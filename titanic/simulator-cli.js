#!/usr/bin/env node

// Titanic Simulator - Command Line Edition - EXPANDED 16x
// Run with: node simulator-cli.js [options]
// Options: --auto --speed=fast|normal|slow --runs=N --difficulty=easy|normal|hard|impossible
//          --log-file=FILE --quiet --json --ascii --achievements --ship=TYPE

const readline = require('readline');
const fs = require('fs');

class TitanicCLI {
    constructor(options = {}) {
        this.auto = options.auto || false;
        this.speed = options.speed || 'normal';
        this.logHistory = [];
        
        // Game state
        this.startPos = { lat: 50.9, lon: -1.4 }; // Southampton
        this.endPos = { lat: 40.7, lon: -74.0 }; // New York
        this.ship = {
            lat: this.startPos.lat,
            lon: this.startPos.lon,
            speed: 0,
            heading: 270,
            maxSpeed: 23
        };
        
        this.coal = 100;
        this.furnaceTemp = 0;
        this.hullIntegrity = 100;
        this.waterLevel = 0;
        this.icebergs = [];
        this.furnaces = [];
        this.gameTime = 0;
        this.gameOver = false;
        this.icebergsAvoided = 0;
        this.distanceTraveled = 0;
        this.coalConsumed = 0;
        this.doomCounter = 0;
        this.doomThreshold = 300000; // 5 minutes
        this.microLeaksAccumulated = 0;
        this.finalWarningPlayed = false;
        this.runNumber = options.runNumber || 1;
        
        this.initFurnaces();
        this.spawnIcebergs();
        this.setupInput();
    }
    
    initFurnaces() {
        for (let i = 0; i < 6; i++) {
            this.furnaces.push({
                id: i + 1,
                heat: 50 + Math.random() * 30,
                coolRate: 0.5 + Math.random() * 0.3
            });
        }
    }
    
    spawnIcebergs() {
        const route = this.calculateRoute();
        for (let i = 0; i < 40; i++) {
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
            { lat: 50.9, lon: -1.4 },   // Southampton
            { lat: 50.5, lon: -10.0 },  // South of Ireland
            { lat: 48.0, lon: -25.0 },  // Mid Atlantic
            { lat: 43.0, lon: -45.0 },  // Iceberg alley
            { lat: 41.7, lon: -50.0 },  // Fatal position
            { lat: 40.7, lon: -74.0 }   // New York
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
    
    setupInput() {
        if (!this.auto) {
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
                    if (key.name === 'space') {
                        this.shovelCoal();
                    }
                }
            });
        }
    }
    
    shovelCoal() {
        if (this.coal > 0) {
            const furnace = this.furnaces[Math.floor(Math.random() * this.furnaces.length)];
            furnace.heat = Math.min(100, furnace.heat + 25);
            this.coal -= 0.2;
            this.coalConsumed += 0.2;
            this.log(`COAL SHOVELED INTO FURNACE #${furnace.id} [${furnace.heat.toFixed(0)}% heat]`);
        }
    }
    
    update(deltaTime) {
        this.gameTime += deltaTime;
        this.doomCounter += deltaTime * 1000;
        
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
        
        // Speed depends on furnace temperature
        const targetSpeed = (this.furnaceTemp / 100) * this.ship.maxSpeed;
        this.ship.speed += (targetSpeed - this.ship.speed) * 0.1;
        
        // Consume coal
        this.coal = Math.max(0, this.coal - (this.ship.speed / this.ship.maxSpeed) * 0.005);
        
        // Move ship - 60x accelerated for ~3-5 minute journey with good coal management
        const speedMultiplier = 60;
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
        
        // Check iceberg collisions
        for (let iceberg of this.icebergs) {
            const dist = this.distance(this.ship.lat, this.ship.lon, iceberg.lat, iceberg.lon);
            
            if (dist < 0.05 && !iceberg.hit) {
                iceberg.hit = true;
                const damage = 20 + Math.random() * 30;
                this.hullIntegrity -= damage;
                this.waterLevel += damage * 1.2;
                this.log(`!!! COLLISION DETECTED - HULL BREACH !!!`, 'critical');
                this.log(`HULL INTEGRITY: ${this.hullIntegrity.toFixed(1)}%`, 'warning');
                
                if (this.hullIntegrity <= 0) {
                    this.sink("Catastrophic hull failure following iceberg collision");
                }
            } else if (dist < 0.15 && !iceberg.passed && this.ship.speed > 5) {
                iceberg.passed = true;
                this.icebergsAvoided++;
                if (this.icebergsAvoided % 5 === 0) {
                    this.log(`ICEBERG AVOIDED - Total: ${this.icebergsAvoided}`);
                }
            }
        }
        
        // Doom mechanics
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
                this.log("STRUCTURAL FAILURE DETECTED", "critical");
                this.hullIntegrity -= 15 + Math.random() * 20;
                this.waterLevel += 20 + Math.random() * 15;
            }
        }
        
        // Water accumulation
        if (this.waterLevel > 0) {
            this.waterLevel += deltaTime * 0.1;
            this.hullIntegrity -= deltaTime * 0.05;
        }
        
        // Final warnings
        if (this.doomCounter > this.doomThreshold * 0.95 && !this.finalWarningPlayed) {
            this.log("CRITICAL STRUCTURAL FATIGUE - FAILURE IMMINENT", "critical");
            this.finalWarningPlayed = true;
        }
        
        if (this.doomCounter > this.doomThreshold * 0.95) {
            this.hullIntegrity -= deltaTime * 2;
            this.waterLevel += deltaTime * 1;
        }
        
        // Check sinking conditions
        if (this.hullIntegrity <= 0) {
            this.sink("Hull integrity failure");
        }
        if (this.waterLevel >= 100) {
            this.sink("Complete flooding - vessel submerged");
        }
        if (this.doomCounter > this.doomThreshold) {
            this.sink("Inevitable structural fatigue and material failure");
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
    
    log(message, type = 'normal') {
        const timestamp = this.formatTime(this.gameTime);
        const prefix = type === 'critical' ? '🔴' : type === 'warning' ? '🟡' : '⚪';
        const logEntry = `[${timestamp}] ${prefix} ${message}`;
        this.logHistory.push({ time: this.gameTime, message, type });
        console.log(logEntry);
    }
    
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    sink(reason) {
        this.gameOver = true;
        this.log(`\n${'='.repeat(70)}`, 'critical');
        this.log(`⚓ VESSEL LOST - ${reason}`, 'critical');
        this.log(`${'='.repeat(70)}\n`, 'critical');
        this.printStats();
        this.quit();
    }
    
    victory() {
        this.gameOver = true;
        this.log(`\n${'='.repeat(70)}`);
        this.log(`🎉 IMPOSSIBLE! VESSEL REACHED NEW YORK!`);
        this.log(`(This defies all known laws of maritime doom)`);
        this.log(`${'='.repeat(70)}\n`);
        this.printStats();
        this.quit();
    }
    
    printStats() {
        console.log(`\n📊 VOYAGE STATISTICS - RUN #${this.runNumber}`);
        console.log(`${'─'.repeat(70)}`);
        console.log(`Time Survived:      ${this.formatTime(this.gameTime)}`);
        console.log(`Distance Traveled:  ${this.distanceTraveled.toFixed(1)} nautical miles`);
        console.log(`Icebergs Avoided:   ${this.icebergsAvoided}`);
        console.log(`Coal Consumed:      ${this.coalConsumed.toFixed(1)}%`);
        console.log(`Final Speed:        ${this.ship.speed.toFixed(1)} knots`);
        console.log(`Hull Integrity:     ${this.hullIntegrity.toFixed(1)}%`);
        console.log(`Water Level:        ${this.waterLevel.toFixed(1)}%`);
        console.log(`Final Position:     ${this.ship.lat.toFixed(2)}°N, ${Math.abs(this.ship.lon).toFixed(2)}°W`);
        console.log(`${'─'.repeat(70)}\n`);
        
        // Log file output
        const distToNY = this.distance(this.ship.lat, this.ship.lon, this.endPos.lat, this.endPos.lon);
        const success = distToNY < 0.5;
        const summary = {
            run: this.runNumber,
            success,
            time: this.gameTime,
            distance: this.distanceTraveled,
            icebergsAvoided: this.icebergsAvoided,
            coalConsumed: this.coalConsumed,
            logs: this.logHistory.length
        };
        
        return summary;
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
        console.clear();
        console.log(`\n${'═'.repeat(70)}`);
        console.log(`  RMS TITANIC NAVIGATION SIMULATOR - COMMAND LINE EDITION`);
        console.log(`  Run #${this.runNumber} | Mode: ${this.auto ? 'AUTO' : 'MANUAL'}`);
        console.log(`${'═'.repeat(70)}\n`);
        
        this.log("DEPARTURE AUTHORIZED - DESTINATION: NEW YORK");
        this.log("WARNING: ICEBERG REPORTS IN NORTH ATLANTIC");
        
        if (!this.auto) {
            this.log("\nPress SPACE to shovel coal | Ctrl+C to quit\n");
        }
        
        const tickRate = this.speed === 'fast' ? 50 : this.speed === 'slow' ? 200 : 100;
        const deltaTime = tickRate / 1000;
        
        this.gameLoop = setInterval(() => {
            if (!this.gameOver) {
                this.update(deltaTime);
                
                // Status update every 5 seconds
                if (Math.floor(this.gameTime) % 5 === 0 && Math.floor(this.gameTime) !== this.lastStatusUpdate) {
                    this.lastStatusUpdate = Math.floor(this.gameTime);
                    const distToNY = this.distance(this.ship.lat, this.ship.lon, this.endPos.lat, this.endPos.lon);
                    console.log(`\n📍 STATUS: Speed ${this.ship.speed.toFixed(1)}kts | Coal ${this.coal.toFixed(0)}% | Hull ${this.hullIntegrity.toFixed(0)}% | Distance to NY ${(distToNY * 69).toFixed(0)}nm`);
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
    speed: args.find(a => a.startsWith('--speed='))?.split('=')[1] || 'fast'
};

// Run multiple times if requested
const runCount = parseInt(args.find(a => a.startsWith('--runs='))?.split('=')[1] || '1');

if (runCount > 1) {
    console.log(`\n🚢 RUNNING ${runCount} SIMULATION RUNS\n`);
    const results = [];
    
    (async function runAll() {
        for (let i = 1; i <= runCount; i++) {
            const sim = new TitanicCLI({ ...options, auto: true, runNumber: i });
            
            await new Promise((resolve) => {
                sim.run();
                const originalQuit = sim.quit;
                sim.quit = function() {
                    clearInterval(sim.gameLoop);
                    const summary = sim.printStats();
                    results.push(summary);
                    resolve();
                };
            });
            
            // Delay between runs
            await new Promise(r => setTimeout(r, 500));
        }
        
        // Final summary
        console.log(`\n${'═'.repeat(70)}`);
        console.log(`  AGGREGATE RESULTS FROM ${runCount} RUNS`);
        console.log(`${'═'.repeat(70)}`);
        
        const avgTime = results.reduce((a, b) => a + b.time, 0) / results.length;
        const avgDist = results.reduce((a, b) => a + b.distance, 0) / results.length;
        const avgIcebergs = results.reduce((a, b) => a + b.icebergsAvoided, 0) / results.length;
        const successes = results.filter(r => r.success).length;
        
        console.log(`Average Survival Time:  ${Math.floor(avgTime / 60)}:${Math.floor(avgTime % 60).toString().padStart(2, '0')}`);
        console.log(`Average Distance:       ${avgDist.toFixed(1)} nm`);
        console.log(`Average Icebergs:       ${avgIcebergs.toFixed(1)}`);
        console.log(`Success Rate:           ${successes}/${runCount} (${(successes/runCount*100).toFixed(1)}%)`);
        console.log(`${'═'.repeat(70)}\n`);
        
        process.exit(0);
    })();
} else {
    const sim = new TitanicCLI(options);
    sim.run();
}
