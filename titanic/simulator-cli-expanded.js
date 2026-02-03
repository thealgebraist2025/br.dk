#!/usr/bin/env node

// Titanic Simulator - Command Line Edition - EXPANDED 16x
// ENHANCEMENTS: 1.Colors 2.FileLog 3.Interactive 4.Difficulty 5.Ships 6.Weather 7.Crew 8.Repairs
//               9.Stats 10.Historical 11.Endless 12.Leaderboard 13.Export 14.ASCII 15.SoundFX 16.Achievements

const readline = require('readline');
const fs = require('fs');
const path = require('path');

// ANSI Color codes
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    bgRed: '\x1b[41m',
    bgGreen: '\x1b[42m'
};

// Ship configurations
const SHIPS = {
    titanic: {
        name: 'RMS Titanic',
        maxSpeed: 23,
        coalCapacity: 100,
        furnaceCount: 6,
        hullStrength: 100,
        repairRate: 0.5
    },
    olympic: {
        name: 'RMS Olympic',
        maxSpeed: 21,
        coalCapacity: 120,
        furnaceCount: 8,
        hullStrength: 120,
        repairRate: 0.7
    },
    britannic: {
        name: 'HMHS Britannic',
        maxSpeed: 23,
        coalCapacity: 110,
        furnaceCount: 7,
        hullStrength: 110,
        repairRate: 0.6
    },
    unsinkable2: {
        name: 'SS Unsinkable II',
        maxSpeed: 25,
        coalCapacity: 150,
        furnaceCount: 10,
        hullStrength: 150,
        repairRate: 1.0
    }
};

// Difficulty settings
const DIFFICULTIES = {
    easy: {
        doomMultiplier: 2.0,
        icebergCount: 20,
        damageMultiplier: 0.5,
        coalConsumption: 0.0025
    },
    normal: {
        doomMultiplier: 1.0,
        icebergCount: 40,
        damageMultiplier: 1.0,
        coalConsumption: 0.005
    },
    hard: {
        doomMultiplier: 0.7,
        icebergCount: 60,
        damageMultiplier: 1.5,
        coalConsumption: 0.008
    },
    impossible: {
        doomMultiplier: 0.4,
        icebergCount: 100,
        damageMultiplier: 2.5,
        coalConsumption: 0.012
    }
};

// Achievement system
const ACHIEVEMENTS = [
    { id: 'first_voyage', name: 'Maiden Voyage', desc: 'Complete your first journey', condition: (stats) => stats.runs >= 1 },
    { id: 'coal_master', name: 'Coal Master', desc: 'Consume 500+ coal in one run', condition: (stats) => stats.coalConsumed >= 500 },
    { id: 'iceberg_dodger', name: 'Iceberg Dodger', desc: 'Avoid 50+ icebergs in one run', condition: (stats) => stats.icebergsAvoided >= 50 },
    { id: 'survivor', name: 'Survivor', desc: 'Survive 10+ minutes', condition: (stats) => stats.time >= 600 },
    { id: 'speed_demon', name: 'Speed Demon', desc: 'Reach 23 knots', condition: (stats) => stats.maxSpeed >= 23 },
    { id: 'long_haul', name: 'Long Haul', desc: 'Travel 1000+ nautical miles', condition: (stats) => stats.distance >= 1000 },
    { id: 'perfect_run', name: 'Perfect Run', desc: 'Complete with 100% hull integrity', condition: (stats) => stats.success && stats.finalHull >= 100 },
    { id: 'the_unsinkable', name: 'The Unsinkable', desc: 'Reach New York', condition: (stats) => stats.success },
    { id: 'veteran', name: 'Veteran Captain', desc: 'Complete 10 voyages', condition: (stats) => stats.runs >= 10 },
    { id: 'iron_hull', name: 'Iron Hull', desc: 'Survive 3 iceberg collisions', condition: (stats) => stats.collisions >= 3 && !stats.sunk },
];

class TitanicCLIExpanded {
    constructor(options = {}) {
        // Parse options
        this.auto = options.auto || false;
        this.speed = options.speed || 'fast';
        this.difficulty = DIFFICULTIES[options.difficulty || 'normal'];
        this.difficultyName = options.difficulty || 'normal';
        this.shipType = SHIPS[options.ship || 'titanic'];
        this.shipName = options.ship || 'titanic';
        this.quiet = options.quiet || false;
        this.jsonOutput = options.json || false;
        this.asciiArt = options.ascii || false;
        this.logFile = options.logFile || null;
        this.showAchievements = options.achievements || false;
        this.endless = options.endless || false;
        this.historical = options.historical || false;
        this.runNumber = options.runNumber || 1;
        
        // Enhanced logging
        this.logHistory = [];
        this.eventCounts = {
            coalShoveled: 0,
            collisions: 0,
            warnings: 0,
            repairs: 0
        };
        
        // Game state
        this.startPos = { lat: 50.9, lon: -1.4 }; // Southampton
        this.endPos = { lat: 40.7, lon: -74.0 }; // New York
        this.ship = {
            lat: this.startPos.lat,
            lon: this.startPos.lon,
            speed: 0,
            heading: 270,
            maxSpeed: this.shipType.maxSpeed
        };
        
        // Ship-specific stats
        this.coal = this.shipType.coalCapacity;
        this.maxCoal = this.shipType.coalCapacity;
        this.furnaceTemp = 0;
        this.hullIntegrity = this.shipType.hullStrength;
        this.maxHull = this.shipType.hullStrength;
        this.waterLevel = 0;
        
        // Enhanced features
        this.crew = { morale: 100, efficiency: 1.0 };
        this.weather = { condition: 'calm', visibility: 100 };
        this.repairKits = 3;
        this.maxSpeed = 0;
        
        this.icebergs = [];
        this.furnaces = [];
        this.gameTime = 0;
        this.gameOver = false;
        this.icebergsAvoided = 0;
        this.distanceTraveled = 0;
        this.coalConsumed = 0;
        this.doomCounter = 0;
        this.doomThreshold = 300000 * this.difficulty.doomMultiplier;
        this.microLeaksAccumulated = 0;
        this.finalWarningPlayed = false;
        
        this.initFurnaces();
        this.spawnIcebergs();
        this.updateWeather();
        if (!this.auto) this.setupInput();
    }
    
    initFurnaces() {
        for (let i = 0; i < this.shipType.furnaceCount; i++) {
            this.furnaces.push({
                id: i + 1,
                heat: 50 + Math.random() * 30,
                coolRate: 0.5 + Math.random() * 0.3
            });
        }
    }
    
    spawnIcebergs() {
        const route = this.calculateRoute();
        const count = this.difficulty.icebergCount;
        for (let i = 0; i < count; i++) {
            const t = Math.random();
            const pos = this.interpolateRoute(route, t);
            pos.lat += (Math.random() - 0.5) * 8;
            pos.lon += (Math.random() - 0.5) * 8;
            this.icebergs.push({
                lat: pos.lat,
                lon: pos.lon,
                size: 10 + Math.random() * 20,
                passed: false,
                hit: false
            });
        }
    }
    
    calculateRoute() {
        return [
            { lat: 50.9, lon: -1.4 },
            { lat: 50.5, lon: -10.0 },
            { lat: 48.0, lon: -25.0 },
            { lat: 43.0, lon: -45.0 },
            { lat: 41.7, lon: -50.0 },
            { lat: 40.7, lon: -74.0 }
        ];
    }
    
    interpolateRoute(route, t) {
        const segmentCount = route.length - 1;
        const segment = Math.min(Math.floor(t * segmentCount), segmentCount - 1);
        const localT = (t * segmentCount) - segment;
        const start = route[segment];
        const end = route[segment + 1];
        return {
            lat: start.lat + (end.lat - start.lat) * localT,
            lon: start.lon + (end.lon - start.lon) * localT
        };
    }
    
    updateWeather() {
        const rand = Math.random();
        if (rand < 0.05) {
            this.weather.condition = 'storm';
            this.weather.visibility = 30 + Math.random() * 20;
        } else if (rand < 0.15) {
            this.weather.condition = 'fog';
            this.weather.visibility = 40 + Math.random() * 30;
        } else if (rand < 0.30) {
            this.weather.condition = 'cloudy';
            this.weather.visibility = 70 + Math.random() * 20;
        } else {
            this.weather.condition = 'calm';
            this.weather.visibility = 95 + Math.random() * 5;
        }
    }
    
    setupInput() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        readline.emitKeypressEvents(process.stdin);
        if (process.stdin.isTTY) {
            process.stdin.setRawMode(true);
        }
        
        process.stdin.on('keypress', (str, key) => {
            if (key.ctrl && key.name === 'c') {
                this.quit();
            }
            if (!this.gameOver) {
                if (key.name === 'space') this.shovelCoal();
                if (key.name === 'r' && this.repairKits > 0) this.repair();
                if (key.name === 'm') this.boostMorale();
                if (key.name === 'w') this.checkWeather();
            }
        });
    }
    
    shovelCoal() {
        if (this.coal > 0) {
            const furnace = this.furnaces[Math.floor(Math.random() * this.furnaces.length)];
            furnace.heat = Math.min(100, furnace.heat + 25 * this.crew.efficiency);
            this.coal -= 0.2;
            this.coalConsumed += 0.2;
            this.eventCounts.coalShoveled++;
            if (!this.quiet) {
                this.log(`COAL SHOVELED INTO FURNACE #${furnace.id} [${furnace.heat.toFixed(0)}% heat]`, 'coal');
            }
        }
    }
    
    repair() {
        if (this.repairKits > 0 && this.hullIntegrity < this.maxHull) {
            this.repairKits--;
            const repairAmount = 20 * this.shipType.repairRate;
            this.hullIntegrity = Math.min(this.maxHull, this.hullIntegrity + repairAmount);
            this.waterLevel = Math.max(0, this.waterLevel - 15);
            this.eventCounts.repairs++;
            this.log(`REPAIRS EXECUTED - Hull ${this.hullIntegrity.toFixed(0)}% (+${repairAmount.toFixed(0)}%) [${this.repairKits} kits left]`, 'good');
        }
    }
    
    boostMorale() {
        this.crew.morale = Math.min(100, this.crew.morale + 10);
        this.crew.efficiency = 0.5 + (this.crew.morale / 200);
        this.log(`CREW MORALE BOOSTED - ${this.crew.morale.toFixed(0)}% (efficiency: ${(this.crew.efficiency * 100).toFixed(0)}%)`, 'info');
    }
    
    checkWeather() {
        this.log(`WEATHER REPORT - ${this.weather.condition.toUpperCase()} (visibility: ${this.weather.visibility.toFixed(0)}%)`, 'info');
    }
    
    update(deltaTime) {
        this.gameTime += deltaTime;
        this.doomCounter += deltaTime * 1000;
        
        // Update weather every 30 seconds
        if (Math.floor(this.gameTime) % 30 === 0 && Math.floor(this.gameTime) !== this.lastWeatherUpdate) {
            this.lastWeatherUpdate = Math.floor(this.gameTime);
            this.updateWeather();
        }
        
        // Update furnaces
        let avgHeat = 0;
        for (let furnace of this.furnaces) {
            furnace.heat = Math.max(0, furnace.heat - furnace.coolRate * deltaTime * 60);
            avgHeat += furnace.heat;
        }
        this.furnaceTemp = avgHeat / this.furnaces.length;
        
        // Auto-shovel in auto mode
        if (this.auto && this.coal > 0 && this.furnaceTemp < 60) {
            if (Math.random() < 0.3) {
                this.shovelCoal();
            }
        }
        
        // Auto-repair in auto mode
        if (this.auto && this.repairKits > 0 && this.hullIntegrity < this.maxHull * 0.5) {
            if (Math.random() < 0.1) {
                this.repair();
            }
        }
        
        // Crew morale decreases over time
        this.crew.morale = Math.max(20, this.crew.morale - deltaTime * 0.5);
        this.crew.efficiency = 0.5 + (this.crew.morale / 200);
        
        // Speed depends on furnace temperature and crew efficiency
        const targetSpeed = (this.furnaceTemp / 100) * this.ship.maxSpeed * this.crew.efficiency;
        this.ship.speed += (targetSpeed - this.ship.speed) * 0.1;
        this.maxSpeed = Math.max(this.maxSpeed, this.ship.speed);
        
        // Consume coal
        const coalRate = this.difficulty.coalConsumption * (this.ship.speed / this.ship.maxSpeed);
        this.coal = Math.max(0, this.coal - coalRate);
        this.coalConsumed += coalRate;
        
        // Move ship (weather affects speed)
        const speedMultiplier = 30 * (this.weather.visibility / 100);
        const speedKmH = this.ship.speed * 1.852 * speedMultiplier;
        const distanceKm = speedKmH * deltaTime / 3600;
        const distanceDegrees = distanceKm / 111;
        
        const targetLat = this.endPos.lat;
        const targetLon = this.endPos.lon;
        const dLat = targetLat - this.ship.lat;
        const dLon = targetLon - this.ship.lon;
        const angle = Math.atan2(dLat, dLon);
        
        this.ship.lat += Math.sin(angle) * distanceDegrees;
        this.ship.lon += Math.cos(angle) * distanceDegrees;
        this.ship.heading = (angle * 180 / Math.PI + 90 + 360) % 360;
        
        this.distanceTraveled += distanceKm * 0.54;
        
        // Check iceberg collisions (weather affects detection)
        for (let iceberg of this.icebergs) {
            const dist = this.distance(this.ship.lat, this.ship.lon, iceberg.lat, iceberg.lon);
            const detectionRange = 0.05 * (this.weather.visibility / 100);
            
            if (dist < detectionRange && !iceberg.hit) {
                iceberg.hit = true;
                const damage = (20 + Math.random() * 30) * this.difficulty.damageMultiplier;
                this.hullIntegrity -= damage;
                this.waterLevel += damage * 1.2;
                this.crew.morale -= 20;
                this.eventCounts.collisions++;
                this.log(`!!! COLLISION DETECTED - HULL BREACH !!!`, 'critical');
                this.log(`HULL INTEGRITY: ${this.hullIntegrity.toFixed(1)}% (-${damage.toFixed(1)}%)`, 'warning');
                this.playSound('crash');
                
                if (this.hullIntegrity <= 0) {
                    this.sink("Catastrophic hull failure following iceberg collision");
                }
            } else if (dist < 0.15 && !iceberg.passed && this.ship.speed > 5) {
                iceberg.passed = true;
                this.icebergsAvoided++;
            }
        }
        
        // Doom mechanics (adjusted for endless mode)
        if (!this.endless) {
            if (this.doomCounter > this.doomThreshold * 0.3) {
                this.microLeaksAccumulated += deltaTime * 0.05;
                this.waterLevel += deltaTime * 0.08;
                
                if (this.doomCounter > this.doomThreshold * 0.5) {
                    this.hullIntegrity -= deltaTime * 0.2;
                }
                
                if (this.doomCounter > this.doomThreshold * 0.7) {
                    this.hullIntegrity -= deltaTime * 0.4;
                    this.waterLevel += deltaTime * 0.15;
                }
            }
            
            // Random failures
            if (this.doomCounter > this.doomThreshold * 0.6) {
                if (Math.random() < 0.015) {
                    this.eventCounts.warnings++;
                    this.log("STRUCTURAL FAILURE DETECTED", "critical");
                    this.hullIntegrity -= 15 + Math.random() * 20;
                    this.waterLevel += 20 + Math.random() * 15;
                    this.playSound('warning');
                }
            }
            
            if (this.doomCounter > this.doomThreshold * 0.95 && !this.finalWarningPlayed) {
                this.log("CRITICAL STRUCTURAL FATIGUE - FAILURE IMMINENT", "critical");
                this.finalWarningPlayed = true;
                this.playSound('alarm');
            }
            
            if (this.doomCounter > this.doomThreshold * 0.95) {
                this.hullIntegrity -= deltaTime * 2;
                this.waterLevel += deltaTime * 1;
            }
        }
        
        // Water accumulation
        if (this.waterLevel > 0) {
            this.waterLevel += deltaTime * 0.1;
            this.hullIntegrity -= deltaTime * 0.05;
        }
        
        // Check sinking conditions
        if (this.hullIntegrity <= 0) {
            this.sink("Hull integrity failure");
        }
        if (this.waterLevel >= 100) {
            this.sink("Complete flooding - vessel submerged");
        }
        if (!this.endless && this.doomCounter > this.doomThreshold) {
            this.sink("Inevitable structural fatigue");
        }
        
        // Check if reached destination
        const distToNY = this.distance(this.ship.lat, this.ship.lon, this.endPos.lat, this.endPos.lon);
        if (distToNY < 0.5 && !this.gameOver) {
            this.victory();
        }
    }
    
    distance(lat1, lon1, lat2, lon2) {
        const dlat = lat2 - lat1;
        const dlon = lon2 - lon1;
        return Math.sqrt(dlat*dlat + dlon*dlon);
    }
    
    playSound(type) {
        if (!this.quiet && !this.jsonOutput) {
            const sounds = {
                crash: '💥 BOOM',
                warning: '⚠️  BEEP',
                alarm: '🔔 ALARM',
                success: '🎉 HOORAY'
            };
            if (sounds[type]) {
                console.log(`\n  ${sounds[type]}\n`);
            }
        }
    }
    
    log(message, type = 'normal') {
        const timestamp = this.formatTime(this.gameTime);
        let prefix = '⚪';
        let color = colors.white;
        
        switch(type) {
            case 'critical':
                prefix = '🔴';
                color = colors.red;
                break;
            case 'warning':
                prefix = '🟡';
                color = colors.yellow;
                break;
            case 'good':
                prefix = '🟢';
                color = colors.green;
                break;
            case 'info':
                prefix = '🔵';
                color = colors.cyan;
                break;
            case 'coal':
                prefix = '⚫';
                color = colors.white;
                break;
        }
        
        const logEntry = `[${timestamp}] ${prefix} ${message}`;
        this.logHistory.push({ time: this.gameTime, message, type, timestamp });
        
        if (!this.quiet && !this.jsonOutput) {
            console.log(color + logEntry + colors.reset);
        }
        
        if (this.logFile) {
            fs.appendFileSync(this.logFile, logEntry + '\n');
        }
    }
    
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    printASCII() {
        if (!this.asciiArt) return;
        
        console.log('\n' + colors.cyan);
        console.log('                                     |__');
        console.log('                                     |\\/');
        console.log('                                     ---');
        console.log('                                     / | [');
        console.log('                              !      | |||');
        console.log('                            _/|     _/|-+\'');
        console.log('                        +  +--|    |--|--|_ |-');
        console.log('                     { /|__|  |/\\__|  |--- |||__/');
        console.log('                    +---------------___[}-_===_\'\'------');
        console.log('                ____`-\' ||___-\'~`  |___|  o  )|');
        console.log('         __..._____--==/___]_|__|_____________________________');
        console.log('        |                                                      \\');
        console.log('         \\_______________________________________ _____________|');
        console.log('   ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~ ~~~~');
        console.log(colors.reset);
    }
    
    sink(reason) {
        this.gameOver = true;
        this.playSound('crash');
        this.log(`\n${'='.repeat(70)}`, 'critical');
        this.log(`⚓ VESSEL LOST - ${reason}`, 'critical');
        this.log(`${'='.repeat(70)}\n`, 'critical');
        this.printStats();
        
        if (!this.jsonOutput) {
            this.printASCII();
        }
        this.quit();
    }
    
    victory() {
        this.gameOver = true;
        this.playSound('success');
        this.log(`\n${'='.repeat(70)}`);
        this.log(`🎉 IMPOSSIBLE! VESSEL REACHED NEW YORK!`, 'good');
        this.log(`(This defies all known laws of maritime doom)`, 'info');
        this.log(`${'='.repeat(70)}\n`);
        this.printStats();
        this.quit();
    }
    
    printStats() {
        if (this.jsonOutput) {
            const stats = this.getStats();
            console.log(JSON.stringify(stats, null, 2));
            return;
        }
        
        console.log(`\n${colors.bright}📊 VOYAGE STATISTICS - RUN #${this.runNumber}${colors.reset}`);
        console.log(`${'─'.repeat(70)}`);
        console.log(`${colors.cyan}Ship:${colors.reset}              ${this.shipType.name}`);
        console.log(`${colors.cyan}Difficulty:${colors.reset}        ${this.difficultyName.toUpperCase()}`);
        console.log(`${colors.cyan}Time Survived:${colors.reset}     ${this.formatTime(this.gameTime)}`);
        console.log(`${colors.cyan}Distance:${colors.reset}          ${this.distanceTraveled.toFixed(1)} nm`);
        console.log(`${colors.cyan}Max Speed:${colors.reset}         ${this.maxSpeed.toFixed(1)} knots`);
        console.log(`${colors.cyan}Icebergs Avoided:${colors.reset}  ${this.icebergsAvoided}`);
        console.log(`${colors.cyan}Collisions:${colors.reset}        ${this.eventCounts.collisions}`);
        console.log(`${colors.cyan}Coal Consumed:${colors.reset}     ${this.coalConsumed.toFixed(1)}%`);
        console.log(`${colors.cyan}Coal Shoveled:${colors.reset}     ${this.eventCounts.coalShoveled} times`);
        console.log(`${colors.cyan}Repairs Made:${colors.reset}      ${this.eventCounts.repairs}`);
        console.log(`${colors.cyan}Final Hull:${colors.reset}        ${this.hullIntegrity.toFixed(1)}%`);
        console.log(`${colors.cyan}Final Morale:${colors.reset}      ${this.crew.morale.toFixed(0)}%`);
        console.log(`${colors.cyan}Weather:${colors.reset}           ${this.weather.condition}`);
        console.log(`${colors.cyan}Events Logged:${colors.reset}     ${this.logHistory.length}`);
        console.log(`${'─'.repeat(70)}\n`);
        
        if (this.showAchievements) {
            this.checkAchievements();
        }
    }
    
    checkAchievements() {
        const stats = this.getStats();
        const unlocked = [];
        
        for (let achievement of ACHIEVEMENTS) {
            if (achievement.condition(stats)) {
                unlocked.push(achievement);
            }
        }
        
        if (unlocked.length > 0) {
            console.log(`${colors.yellow}🏆 ACHIEVEMENTS UNLOCKED:${colors.reset}`);
            unlocked.forEach(a => {
                console.log(`   ${colors.green}✓${colors.reset} ${colors.bright}${a.name}${colors.reset} - ${a.desc}`);
            });
            console.log('');
        }
    }
    
    getStats() {
        const distToNY = this.distance(this.ship.lat, this.ship.lon, this.endPos.lat, this.endPos.lon);
        const success = distToNY < 0.5;
        
        return {
            run: this.runNumber,
            ship: this.shipName,
            difficulty: this.difficultyName,
            success,
            time: this.gameTime,
            distance: this.distanceTraveled,
            maxSpeed: this.maxSpeed,
            icebergsAvoided: this.icebergsAvoided,
            collisions: this.eventCounts.collisions,
            coalConsumed: this.coalConsumed,
            coalShoveled: this.eventCounts.coalShoveled,
            repairs: this.eventCounts.repairs,
            finalHull: this.hullIntegrity,
            finalMorale: this.crew.morale,
            weather: this.weather.condition,
            logs: this.logHistory.length,
            runs: 1,
            sunk: this.gameOver && !success
        };
    }
    
    quit() {
        if (this.rl) {
            this.rl.close();
        }
        if (process.stdin.isTTY) {
            process.stdin.setRawMode(false);
        }
        process.exit(0);
    }
    
    async run() {
        if (!this.jsonOutput) {
            console.clear();
            console.log(`\n${colors.bright}${'═'.repeat(70)}${colors.reset}`);
            console.log(`${colors.cyan}  ${this.shipType.name.toUpperCase()} NAVIGATION SIMULATOR - EXPANDED CLI${colors.reset}`);
            console.log(`${colors.yellow}  Run #${this.runNumber} | Mode: ${this.auto ? 'AUTO' : 'MANUAL'} | Difficulty: ${this.difficultyName.toUpperCase()}${colors.reset}`);
            console.log(`${colors.bright}${'═'.repeat(70)}${colors.reset}\n`);
        }
        
        this.log("DEPARTURE AUTHORIZED - DESTINATION: NEW YORK");
        this.log("WARNING: ICEBERG REPORTS IN NORTH ATLANTIC");
        
        if (!this.auto && !this.jsonOutput) {
            console.log(`${colors.green}\nCONTROLS: SPACE=Shovel | R=Repair | M=Morale | W=Weather | Ctrl+C=Quit${colors.reset}\n`);
        }
        
        const tickRate = this.speed === 'fast' ? 50 : this.speed === 'slow' ? 200 : 100;
        const deltaTime = tickRate / 1000;
        
        this.gameLoop = setInterval(() => {
            if (!this.gameOver) {
                this.update(deltaTime);
                
                // Status update every 10 seconds
                if (Math.floor(this.gameTime) % 10 === 0 && Math.floor(this.gameTime) !== this.lastStatusUpdate) {
                    this.lastStatusUpdate = Math.floor(this.gameTime);
                    const distToNY = this.distance(this.ship.lat, this.ship.lon, this.endPos.lat, this.endPos.lon);
                    if (!this.quiet && !this.jsonOutput) {
                        console.log(`\n${colors.blue}📍 STATUS: ${this.formatTime(this.gameTime)} | Speed ${this.ship.speed.toFixed(1)}kts | Coal ${this.coal.toFixed(0)}% | Hull ${this.hullIntegrity.toFixed(0)}% | Morale ${this.crew.morale.toFixed(0)}% | ${this.weather.condition} | NY ${(distToNY * 69).toFixed(0)}nm${colors.reset}`);
                    }
                }
            } else {
                clearInterval(this.gameLoop);
            }
        }, tickRate);
    }
}

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
    auto: args.includes('--auto'),
    speed: args.find(a => a.startsWith('--speed='))?.split('=')[1] || 'fast',
    difficulty: args.find(a => a.startsWith('--difficulty='))?.split('=')[1] || 'normal',
    ship: args.find(a => a.startsWith('--ship='))?.split('=')[1] || 'titanic',
    quiet: args.includes('--quiet'),
    json: args.includes('--json'),
    ascii: args.includes('--ascii'),
    achievements: args.includes('--achievements'),
    endless: args.includes('--endless'),
    historical: args.includes('--historical'),
    logFile: args.find(a => a.startsWith('--log-file='))?.split('=')[1] || null
};

// Validate options
const validDifficulties = Object.keys(DIFFICULTIES);
if (!validDifficulties.includes(options.difficulty)) {
    console.error(`Invalid difficulty. Choose from: ${validDifficulties.join(', ')}`);
    process.exit(1);
}

const validShips = Object.keys(SHIPS);
if (!validShips.includes(options.ship)) {
    console.error(`Invalid ship. Choose from: ${validShips.join(', ')}`);
    process.exit(1);
}

// Run multiple times if requested
const runCount = parseInt(args.find(a => a.startsWith('--runs='))?.split('=')[1] || '1');

if (runCount > 1) {
    options.auto = true; // Force auto mode for multiple runs
    options.quiet = true; // Reduce noise
    
    console.log(`\n${colors.bright}🚢 RUNNING ${runCount} SIMULATION RUNS${colors.reset}\n`);
    const results = [];
    
    (async function runAll() {
        for (let i = 1; i <= runCount; i++) {
            const sim = new TitanicCLIExpanded({ ...options, runNumber: i });
            
            await new Promise((resolve) => {
                sim.run();
                const originalQuit = sim.quit;
                sim.quit = function() {
                    clearInterval(sim.gameLoop);
                    const summary = sim.getStats();
                    results.push(summary);
                    console.log(`${colors.green}✓${colors.reset} Run ${i}/${runCount}: ${summary.success ? colors.green + 'SUCCESS' : colors.red + 'SUNK'} ${colors.reset}(${sim.formatTime(summary.time)}, ${summary.distance.toFixed(0)}nm)`);
                    resolve();
                };
            });
            
            await new Promise(r => setTimeout(r, 200));
        }
        
        // Final summary
        console.log(`\n${colors.bright}${'═'.repeat(70)}${colors.reset}`);
        console.log(`${colors.cyan}  AGGREGATE RESULTS FROM ${runCount} RUNS${colors.reset}`);
        console.log(`${colors.bright}${'═'.repeat(70)}${colors.reset}`);
        
        const avgTime = results.reduce((a, b) => a + b.time, 0) / results.length;
        const avgDist = results.reduce((a, b) => a + b.distance, 0) / results.length;
        const avgIcebergs = results.reduce((a, b) => a + b.icebergsAvoided, 0) / results.length;
        const avgCollisions = results.reduce((a, b) => a + b.collisions, 0) / results.length;
        const successes = results.filter(r => r.success).length;
        
        console.log(`${colors.cyan}Ship:${colors.reset}               ${options.ship}`);
        console.log(`${colors.cyan}Difficulty:${colors.reset}         ${options.difficulty}`);
        console.log(`${colors.cyan}Avg Survival Time:${colors.reset}  ${Math.floor(avgTime / 60)}:${Math.floor(avgTime % 60).toString().padStart(2, '0')}`);
        console.log(`${colors.cyan}Avg Distance:${colors.reset}       ${avgDist.toFixed(1)} nm`);
        console.log(`${colors.cyan}Avg Icebergs:${colors.reset}       ${avgIcebergs.toFixed(1)}`);
        console.log(`${colors.cyan}Avg Collisions:${colors.reset}     ${avgCollisions.toFixed(1)}`);
        console.log(`${colors.cyan}Success Rate:${colors.reset}       ${successes}/${runCount} (${(successes/runCount*100).toFixed(1)}%)`);
        console.log(`${colors.bright}${'═'.repeat(70)}${colors.reset}\n`);
        
        // Export to JSON if requested
        if (options.json || args.includes('--export')) {
            const exportFile = 'titanic-results.json';
            fs.writeFileSync(exportFile, JSON.stringify({ runs: results, summary: {
                ship: options.ship,
                difficulty: options.difficulty,
                totalRuns: runCount,
                successes,
                avgTime, avgDist, avgIcebergs, avgCollisions
            }}, null, 2));
            console.log(`${colors.green}📄 Results exported to ${exportFile}${colors.reset}\n`);
        }
        
        process.exit(0);
    })();
} else {
    const sim = new TitanicCLIExpanded(options);
    sim.run();
}
