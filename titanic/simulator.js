// Titanic Simulator Game Logic - ENHANCED VERSION
// Synced with CLI features: difficulty modes, weather, crew, repairs, achievements

// C64-style sound synthesizer
class C64Synth {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.enabled = true;
    }
    
    play(freq, duration, waveform = 'square', volume = 0.15) {
        if (!this.enabled) return;
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.type = waveform;
        osc.frequency.setValueAtTime(freq, this.audioContext.currentTime);
        
        gain.gain.setValueAtTime(volume, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        osc.connect(gain);
        gain.connect(this.audioContext.destination);
        
        osc.start();
        osc.stop(this.audioContext.currentTime + duration);
    }
    
    shovelCoal() {
        this.play(80, 0.1, 'square', 0.2);
        setTimeout(() => this.play(60, 0.05, 'square', 0.15), 50);
    }
    
    collision() {
        this.play(800, 0.05, 'sawtooth', 0.3);
        setTimeout(() => this.play(400, 0.1, 'sawtooth', 0.25), 50);
        setTimeout(() => this.play(200, 0.15, 'sawtooth', 0.2), 150);
        setTimeout(() => this.play(100, 0.3, 'square', 0.15), 300);
    }
    
    warning() {
        this.play(880, 0.1, 'square', 0.2);
        setTimeout(() => this.play(880, 0.1, 'square', 0.2), 150);
    }
    
    sink() {
        const startTime = this.audioContext.currentTime;
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(440, startTime);
        osc.frequency.exponentialRampToValueAtTime(55, startTime + 2);
        
        gain.gain.setValueAtTime(0.25, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 2);
        
        osc.connect(gain);
        gain.connect(this.audioContext.destination);
        
        osc.start();
        osc.stop(startTime + 2);
    }
}

// Difficulty configurations
const DIFFICULTIES = {
    easy: { doomMult: 2.0, icebergs: 20, damageMult: 0.5, coalRate: 0.0025 },
    normal: { doomMult: 1.0, icebergs: 40, damageMult: 1.0, coalRate: 0.005 },
    hard: { doomMult: 0.7, icebergs: 60, damageMult: 1.5, coalRate: 0.008 }
};

class TitanicSimulator {
    constructor(difficulty = 'normal') {
        this.mapCanvas = document.getElementById('mapCanvas');
        this.furnaceCanvas = document.getElementById('furnaceCanvas');
        this.mapCtx = this.mapCanvas.getContext('2d');
        this.furnaceCtx = this.furnaceCanvas.getContext('2d');
        
        // Initialize sound
        this.synth = new C64Synth();
        
        // Difficulty settings
        this.difficulty = DIFFICULTIES[difficulty];
        this.difficultyName = difficulty;
        
        // Storyline system
        this.currentStoryline = 1;
        this.currentStage = 1;
        this.storylineNames = [
            'Classic Iceberg Encounter',
            'Coal Depletion Emergency',
            'North Atlantic Storm',
            'Engine Room Fire',
            'Lost in the Fog',
            'Hull Integrity Failure',
            'Crew Mutiny Crisis',
            'Vanishing in the Atlantic',
            'Disease Outbreak at Sea',
            'U-Boat Encounter',
            'Failed Rescue Attempt',
            'Maelstrom Encounter',
            'Electrical Storm Catastrophe',
            'Monster Wave Impact',
            'Internal Sabotage Plot',
            'Multiple Cascading Failures'
        ];
        
        this.stageDescriptions = [
            'Departure - All systems nominal',
            'Early voyage - Crew vigilant',
            'First signs of trouble emerge',
            'Situation worsening rapidly',
            'Critical emergency declared',
            'Multiple system failures',
            'Evacuation procedures initiated',
            'Final moments - Inevitable doom'
        ];
        
        // Set canvas sizes
        this.resizeCanvases();
        window.addEventListener('resize', () => this.resizeCanvases());
        
        // Game state
        this.startPos = { lat: 50.9, lon: -1.4 }; // Southampton
        this.endPos = { lat: 40.7, lon: -74.0 }; // New York
        this.ship = {
            lat: this.startPos.lat,
            lon: this.startPos.lon,
            speed: 0, // knots
            heading: 270, // degrees (west)
            maxSpeed: 23
        };
        
        this.coal = 100;
        this.furnaceTemp = 0;
        this.hullIntegrity = 100;
        this.waterLevel = 0;
        
        // Enhanced features synced from CLI
        this.crew = { morale: 100, efficiency: 1.0 };
        this.weather = { condition: 'calm', visibility: 100 };
        this.repairKits = 3;
        this.maxSpeed = 0;
        
        this.icebergs = [];
        this.furnaces = [];
        this.startTime = Date.now();
        this.gameTime = 0;
        this.gameOver = false;
        this.icebergsAvoided = 0;
        this.distanceTraveled = 0;
        this.finalWarningPlayed = false;
        
        // Doom counter - ensures sinking within ~5 minutes
        this.doomCounter = 0;
        this.doomThreshold = 300000 * this.difficulty.doomMult; // Adjusted by difficulty
        this.microLeaksAccumulated = 0;
        
        // Initialize game elements
        this.initFurnaces();
        this.spawnIcebergs();
        
        // Event listeners
        this.furnaceCanvas.addEventListener('click', (e) => this.handleFurnaceClick(e));
        
        // Spacebar to shovel random furnace
        window.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !this.gameOver && this.coal > 0) {
                e.preventDefault();
                const randomFurnace = this.furnaces[Math.floor(Math.random() * this.furnaces.length)];
                randomFurnace.heat = Math.min(100, randomFurnace.heat + 25 * this.crew.efficiency);
                this.coal -= 0.2;
                this.synth.shovelCoal();
            }
            // R key to repair
            if (e.code === 'KeyR' && !this.gameOver && this.repairKits > 0) {
                this.repair();
            }
            // M key to boost morale  
            if (e.code === 'KeyM' && !this.gameOver) {
                this.boostMorale();
            }
        });
        
        // Update weather periodically
        setInterval(() => this.updateWeather(), 30000);
        
        // Start game loop
        this.gameLoop();
        
        this.log("DEPARTURE AUTHORIZED - DESTINATION: NEW YORK");
        this.log("WARNING: ICEBERG REPORTS IN NORTH ATLANTIC");
        this.log("⚠️ PRESS SPACE OR CLICK FURNACES TO SHOVEL COAL!", "warning");
        this.log("Ship will not move without furnace heat!", "warning");
        
        // Give initial heat to get ship moving
        setTimeout(() => {
            if (this.furnaceTemp < 10) {
                this.furnaces.forEach(f => f.heat = 30);
                this.log("INITIAL COAL LOADED - ENGINE STARTING", "good");
            }
        }, 2000);
        
        // Initialize visuals
        this.updateStorylineVisuals();
        this.updateCaptainPortrait();
        this.updateWeatherVisual();
    }
    
    changeStoryline(storylineId) {
        this.currentStoryline = parseInt(storylineId);
        this.currentStage = 1;
        this.updateStorylineVisuals();
        this.log(`STORYLINE CHANGED: ${this.storylineNames[this.currentStoryline - 1]}`, 'info');
    }
    
    updateStorylineVisuals() {
        const storylineImg = document.getElementById('storylineImage');
        const storylineText = document.getElementById('storylineText');
        
        if (storylineImg) {
            const imgPath = `game_images/story_${this.currentStoryline.toString().padStart(2, '0')}_stage_${this.currentStage}.png`;
            storylineImg.src = imgPath;
            storylineImg.onerror = () => { storylineImg.style.display = 'none'; };
            storylineImg.onload = () => { storylineImg.style.display = 'block'; };
        }
        
        if (storylineText) {
            const storyName = this.storylineNames[this.currentStoryline - 1];
            const stageDesc = this.stageDescriptions[this.currentStage - 1];
            storylineText.textContent = `${storyName} - Stage ${this.currentStage}/8: ${stageDesc}`;
        }
    }
    
    updateCaptainPortrait() {
        const captainImg = document.getElementById('captainPortrait');
        if (!captainImg) return;
        
        let mood = 'confident';
        
        if (this.gameOver) {
            const distToNY = this.distance(this.ship.lat, this.ship.lon, this.endPos.lat, this.endPos.lon);
            mood = distToNY < 0.5 ? 'victorious' : 'desperate';
        } else if (this.hullIntegrity < 30 || this.waterLevel > 70) {
            mood = 'desperate';
        } else if (this.hullIntegrity < 60 || this.waterLevel > 40 || this.crew.morale < 50) {
            mood = 'worried';
        }
        
        captainImg.src = `game_images/captain_${mood}.png`;
        captainImg.onerror = () => { captainImg.style.display = 'none'; };
        captainImg.onload = () => { captainImg.style.display = 'block'; };
    }
    
    updateWeatherVisual() {
        const weatherImg = document.getElementById('weatherIcon');
        if (!weatherImg) return;
        
        weatherImg.src = `game_images/weather_${this.weather.condition}.png`;
        weatherImg.onerror = () => { weatherImg.style.display = 'none'; };
        weatherImg.onload = () => { weatherImg.style.display = 'block'; };
    }
    
    resizeCanvases() {
        const mapRect = this.mapCanvas.getBoundingClientRect();
        this.mapCanvas.width = mapRect.width;
        this.mapCanvas.height = mapRect.height;
        
        const furnaceRect = this.furnaceCanvas.getBoundingClientRect();
        this.furnaceCanvas.width = furnaceRect.width;
        this.furnaceCanvas.height = furnaceRect.height;
        
        // Debug: ensure canvases have size
        if (this.mapCanvas.width === 0 || this.mapCanvas.height === 0) {
            setTimeout(() => this.resizeCanvases(), 100);
        }
        
        // Re-render after resize
        if (this.ship) {
            this.render();
        }
    }
    
    initFurnaces() {
        // 6 furnaces to manage
        for (let i = 0; i < 6; i++) {
            this.furnaces.push({
                heat: 50 + Math.random() * 30,
                coolRate: 0.5 + Math.random() * 0.3,
                x: (i % 3) * (this.furnaceCanvas.width / 3) + 50,
                y: Math.floor(i / 3) * 90 + 40
            });
        }
    }
    
    spawnIcebergs() {
        // Generate icebergs along route (count based on difficulty)
        const route = this.calculateRoute();
        const icebergCount = this.difficulty.icebergs;
        for (let i = 0; i < icebergCount; i++) {
            const t = Math.random();
            const pos = this.interpolateRoute(route, t);
            
            // Add some randomness to position
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
    
    updateWeather() {
        const rand = Math.random();
        if (rand < 0.05) {
            this.weather = { condition: 'storm', visibility: 30 + Math.random() * 20 };
            this.log('STORM CONDITIONS DETECTED', 'warning');
        } else if (rand < 0.15) {
            this.weather = { condition: 'fog', visibility: 40 + Math.random() * 30 };
            this.log('FOG BANK ENCOUNTERED', 'warning');
        } else if (rand < 0.30) {
            this.weather = { condition: 'cloudy', visibility: 70 + Math.random() * 20 };
        } else {
            this.weather = { condition: 'calm', visibility: 95 + Math.random() * 5 };
        }
        this.updateWeatherVisual();
    }
    
    repair() {
        if (this.repairKits > 0 && this.hullIntegrity < 100) {
            this.repairKits--;
            const repairAmount = 20;
            this.hullIntegrity = Math.min(100, this.hullIntegrity + repairAmount);
            this.waterLevel = Math.max(0, this.waterLevel - 15);
            this.log(`REPAIRS EXECUTED - Hull restored +${repairAmount}% [${this.repairKits} kits remaining]`, 'good');
        }
    }
    
    boostMorale() {
        this.crew.morale = Math.min(100, this.crew.morale + 10);
        this.crew.efficiency = 0.5 + (this.crew.morale / 200);
        this.log(`CREW MORALE BOOSTED - ${this.crew.morale.toFixed(0)}% (efficiency: ${(this.crew.efficiency * 100).toFixed(0)}%)`, 'info');
    }
    
    calculateRoute() {
        // Great circle route approximation
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
    
    handleFurnaceClick(e) {
        if (this.gameOver) return;
        
        const rect = this.furnaceCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Check which furnace was clicked
        for (let furnace of this.furnaces) {
            const dx = x - furnace.x;
            const dy = y - furnace.y;
            if (Math.sqrt(dx*dx + dy*dy) < 40) {
                if (this.coal > 0) {
                    furnace.heat = Math.min(100, furnace.heat + 25);
                    this.coal -= 0.2; // Reduced coal cost per click
                    this.synth.shovelCoal();
                }
                break;
            }
        }
    }
    
    gameLoop() {
        if (!this.gameOver) {
            this.update();
            this.render();
            requestAnimationFrame(() => this.gameLoop());
        }
    }
    
    update() {
        const deltaTime = 1/60; // 60 FPS
        this.gameTime += deltaTime;
        this.doomCounter += deltaTime * 1000;
        
        // Update storyline stage based on progress
        const doomProgress = this.doomCounter / this.doomThreshold;
        const newStage = Math.min(8, Math.floor(doomProgress * 8) + 1);
        if (newStage !== this.currentStage) {
            this.currentStage = newStage;
            this.updateStorylineVisuals();
        }
        
        // Update furnaces
        let avgHeat = 0;
        for (let furnace of this.furnaces) {
            furnace.heat = Math.max(0, furnace.heat - furnace.coolRate * deltaTime * 60);
            avgHeat += furnace.heat;
        }
        this.furnaceTemp = avgHeat / this.furnaces.length;
        
        // Crew morale decreases over time
        this.crew.morale = Math.max(20, this.crew.morale - deltaTime * 0.5);
        this.crew.efficiency = 0.5 + (this.crew.morale / 200);
        
        // Speed depends on furnace temperature and crew efficiency
        const targetSpeed = (this.furnaceTemp / 100) * this.ship.maxSpeed * this.crew.efficiency;
        this.ship.speed += (targetSpeed - this.ship.speed) * 0.1;
        this.maxSpeed = Math.max(this.maxSpeed, this.ship.speed);
        
        // Consume coal based on speed (adjusted by difficulty)
        const coalRate = this.difficulty.coalRate * (this.ship.speed / this.ship.maxSpeed);
        this.coal = Math.max(0, this.coal - coalRate);
        
        // Move ship - accelerated to complete journey in ~3-5 minutes with good coal management
        // 60x multiplier allows: 3.2 min (calm weather) to 6.4 min (fog/storm)
        // Weather affects speed
        const speedMultiplier = 60 * (this.weather.visibility / 100);
        const speedKmH = this.ship.speed * 1.852 * speedMultiplier;
        const distanceKm = speedKmH * deltaTime / 3600;
        const distanceDegrees = distanceKm / 111; // rough km to degrees
        
        // Navigate toward New York
        const targetLat = this.endPos.lat;
        const targetLon = this.endPos.lon;
        const dLat = targetLat - this.ship.lat;
        const dLon = targetLon - this.ship.lon;
        const angle = Math.atan2(dLat, dLon);
        
        this.ship.lat += Math.sin(angle) * distanceDegrees;
        this.ship.lon += Math.cos(angle) * distanceDegrees;
        this.ship.heading = (angle * 180 / Math.PI + 90 + 360) % 360; // Update heading
        
        this.distanceTraveled += distanceKm * 0.54; // to nautical miles
        
        // Check if reached New York
        const distToNY = this.distance(this.ship.lat, this.ship.lon, this.endPos.lat, this.endPos.lon);
        if (distToNY < 0.5 && !this.gameOver) {
            this.victory();
            return;
        }
        
        // Check iceberg collisions
        for (let iceberg of this.icebergs) {
            const dist = this.distance(this.ship.lat, this.ship.lon, iceberg.lat, iceberg.lon);
            
            if (dist < 0.05 && !iceberg.hit) { // Collision!
                iceberg.hit = true;
                const damage = (20 + Math.random() * 30) * this.difficulty.damageMult;
                this.hullIntegrity -= damage;
                this.waterLevel += damage * 1.2; // More water per hit
                this.crew.morale -= 20; // Morale drops on collision
                this.synth.collision();
                this.log("COLLISION DETECTED - HULL BREACH", "critical");
                this.log(`HULL INTEGRITY: ${this.hullIntegrity.toFixed(1)}%`, "warning");
                
                if (this.hullIntegrity <= 0) {
                    this.sink("Catastrophic hull failure following iceberg collision");
                }
            } else if (dist < 0.15 && !iceberg.passed && this.ship.speed > 5) {
                // Close call
                iceberg.passed = true;
                this.icebergsAvoided++;
            }
        }
        
        // Inevitable doom mechanics - accelerated timeline
        if (this.doomCounter > this.doomThreshold * 0.3) { // Start earlier
            // Micro-leaks accumulate faster
            this.microLeaksAccumulated += deltaTime * 0.05;
            this.waterLevel += deltaTime * 0.08; // Faster flooding
            
            if (this.doomCounter > this.doomThreshold * 0.5) {
                this.hullIntegrity -= deltaTime * 0.2; // Faster degradation
            }
            
            if (this.doomCounter > this.doomThreshold * 0.7) {
                this.hullIntegrity -= deltaTime * 0.4; // Even faster
                this.waterLevel += deltaTime * 0.15;
            }
        }
        
        // Random catastrophic failures increase as doom approaches
        if (this.doomCounter > this.doomThreshold * 0.6) {
            if (Math.random() < 0.015) { // More frequent failures
                this.synth.warning();
                this.log("STRUCTURAL FAILURE DETECTED", "critical");
                this.hullIntegrity -= 15 + Math.random() * 20;
                this.waterLevel += 20 + Math.random() * 15;
            }
        }
        
        // Water accumulation accelerates
        if (this.waterLevel > 0) {
            this.waterLevel += deltaTime * 0.1; // Faster accumulation
            this.hullIntegrity -= deltaTime * 0.05;
        }
        
        // Check for sinking conditions
        if (this.waterLevel >= 100) {
            this.sink("Vessel fully flooded");
        }
        
        if (this.hullIntegrity <= 0) {
            this.sink("Total structural failure");
        }
        
        if (this.coal <= 0 && this.furnaceTemp < 10) {
            this.log("COAL DEPLETED - LOSS OF POWER IMMINENT", "warning");
        }
        
        // Absolute doom failsafe - ensure game concludes within 5 minutes
        if (this.doomCounter > this.doomThreshold * 0.95) {
            if (!this.finalWarningPlayed) {
                this.synth.warning();
                this.finalWarningPlayed = true;
            }
            this.log("CRITICAL STRUCTURAL FATIGUE - FAILURE IMMINENT", "critical");
            this.hullIntegrity -= deltaTime * 2;
            this.waterLevel += deltaTime * 1;
        }
        
        if (this.doomCounter > this.doomThreshold) {
            this.sink("Inevitable structural fatigue and material failure. All vessels are doomed from the moment of departure.");
        }
        
        this.updateUI();
    }
    
    distance(lat1, lon1, lat2, lon2) {
        // Simple Euclidean distance (good enough for game)
        const dlat = lat2 - lat1;
        const dlon = lon2 - lon1;
        return Math.sqrt(dlat*dlat + dlon*dlon);
    }
    
    render() {
        this.renderMap();
        this.renderFurnaces();
    }
    
    renderMap() {
        const ctx = this.mapCtx;
        const w = this.mapCanvas.width;
        const h = this.mapCanvas.height;
        
        // Clear
        ctx.fillStyle = '#001a33';
        ctx.fillRect(0, 0, w, h);
        
        // Convert lat/lon to canvas coordinates
        const toX = (lon) => ((lon - (-74)) / ((-1.4) - (-74))) * w;
        const toY = (lat) => ((50.9 - lat) / (50.9 - 40.7)) * h;
        
        // Draw route
        const route = this.calculateRoute();
        ctx.strokeStyle = 'rgba(74, 158, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(toX(route[0].lon), toY(route[0].lat));
        for (let i = 1; i < route.length; i++) {
            ctx.lineTo(toX(route[i].lon), toY(route[i].lat));
        }
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Draw start and end
        ctx.fillStyle = '#4a9eff';
        ctx.beginPath();
        ctx.arc(toX(this.startPos.lon), toY(this.startPos.lat), 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = '12px Courier New';
        ctx.fillText('SOUTHAMPTON', toX(this.startPos.lon) + 12, toY(this.startPos.lat) + 4);
        
        ctx.fillStyle = '#4a9eff';
        ctx.beginPath();
        ctx.arc(toX(this.endPos.lon), toY(this.endPos.lat), 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.fillText('NEW YORK', toX(this.endPos.lon) - 70, toY(this.endPos.lat) + 4);
        
        // Draw icebergs
        for (let iceberg of this.icebergs) {
            const x = toX(iceberg.lon);
            const y = toY(iceberg.lat);
            
            if (iceberg.hit) {
                ctx.fillStyle = '#ff4444';
            } else {
                ctx.fillStyle = '#88ddff';
            }
            
            ctx.beginPath();
            ctx.arc(x, y, iceberg.size / 4, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Draw ship
        const shipX = toX(this.ship.lon);
        const shipY = toY(this.ship.lat);
        
        ctx.save();
        ctx.translate(shipX, shipY);
        ctx.rotate((this.ship.heading - 90) * Math.PI / 180);
        
        // Ship hull
        if (this.hullIntegrity < 30) {
            ctx.fillStyle = '#ff4444';
        } else if (this.hullIntegrity < 60) {
            ctx.fillStyle = '#ffaa00';
        } else {
            ctx.fillStyle = '#fff';
        }
        
        ctx.beginPath();
        ctx.moveTo(15, 0);
        ctx.lineTo(-10, -8);
        ctx.lineTo(-10, 8);
        ctx.closePath();
        ctx.fill();
        
        // Wake if moving
        if (this.ship.speed > 1) {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(-10, -3);
            ctx.lineTo(-20, -6);
            ctx.moveTo(-10, 3);
            ctx.lineTo(-20, 6);
            ctx.stroke();
        }
        
        ctx.restore();
        
        // Draw sinking indicator if flooding
        if (this.waterLevel > 0) {
            ctx.fillStyle = `rgba(255, 68, 68, ${this.waterLevel / 200})`;
            ctx.fillRect(0, h - (h * this.waterLevel / 100), w, h);
        }
    }
    
    renderFurnaces() {
        const ctx = this.furnaceCtx;
        const w = this.furnaceCanvas.width;
        const h = this.furnaceCanvas.height;
        
        // Clear
        ctx.fillStyle = '#1a0a00';
        ctx.fillRect(0, 0, w, h);
        
        // Title text
        ctx.fillStyle = '#ff8800';
        ctx.font = 'bold 14px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText('CLICK FURNACES TO SHOVEL COAL (or press SPACE)', w/2, 20);
        
        // Draw furnaces
        for (let i = 0; i < this.furnaces.length; i++) {
            const furnace = this.furnaces[i];
            const x = (i % 3) * (w / 3) + (w / 6);
            const y = Math.floor(i / 3) * (h / 2.5) + (h / 3);
            
            furnace.x = x;
            furnace.y = y;
            
            // Furnace door
            const heatRatio = furnace.heat / 100;
            const glowIntensity = heatRatio * 255;
            
            ctx.fillStyle = `rgb(${glowIntensity}, ${glowIntensity * 0.3}, 0)`;
            ctx.beginPath();
            ctx.arc(x, y, 35, 0, Math.PI * 2);
            ctx.fill();
            
            // Inner glow
            ctx.fillStyle = `rgba(255, ${200 * heatRatio}, 0, ${heatRatio})`;
            ctx.beginPath();
            ctx.arc(x, y, 25, 0, Math.PI * 2);
            ctx.fill();
            
            // Border
            ctx.strokeStyle = '#444';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(x, y, 35, 0, Math.PI * 2);
            ctx.stroke();
            
            // Heat level text
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 12px Courier New';
            ctx.textAlign = 'center';
            ctx.fillText(`${Math.round(furnace.heat)}%`, x, y + 5);
            
            // Furnace number
            ctx.fillStyle = '#888';
            ctx.font = '10px Courier New';
            ctx.fillText(`#${i+1}`, x, y + 50);
        }
        
        // Temperature warning
        if (this.furnaceTemp < 30) {
            ctx.fillStyle = '#ff4444';
            ctx.font = 'bold 14px Courier New';
            ctx.textAlign = 'center';
            ctx.fillText('⚠ LOW TEMPERATURE - SPEED REDUCED', w/2, 15);
        }
    }
    
    updateUI() {
        // Position
        document.getElementById('position').textContent = 
            `${Math.abs(this.ship.lat).toFixed(1)}°${this.ship.lat >= 0 ? 'N' : 'S'}, ${Math.abs(this.ship.lon).toFixed(1)}°${this.ship.lon <= 0 ? 'W' : 'E'}`;
        
        // Distance
        const distToNY = this.distance(this.ship.lat, this.ship.lon, this.endPos.lat, this.endPos.lon) * 60; // rough nautical miles
        document.getElementById('distance').textContent = `${Math.round(distToNY)} nm`;
        
        // Speed
        const speedEl = document.getElementById('speed');
        speedEl.textContent = `${this.ship.speed.toFixed(1)} kts`;
        if (this.ship.speed < 5) speedEl.className = 'status-value warning';
        else speedEl.className = 'status-value';
        
        // Coal
        const coalEl = document.getElementById('coal');
        coalEl.textContent = `${Math.round(this.coal)}%`;
        if (this.coal < 20) coalEl.className = 'status-value critical';
        else if (this.coal < 40) coalEl.className = 'status-value warning';
        else coalEl.className = 'status-value';
        
        // Furnace temp
        const tempEl = document.getElementById('furnaceTemp');
        tempEl.textContent = `${Math.round(this.furnaceTemp)}%`;
        if (this.furnaceTemp < 30) tempEl.className = 'status-value critical';
        else if (this.furnaceTemp < 50) tempEl.className = 'status-value warning';
        else tempEl.className = 'status-value';
        
        // Hull integrity
        const hullEl = document.getElementById('hullIntegrity');
        hullEl.textContent = `${Math.round(this.hullIntegrity)}%`;
        if (this.hullIntegrity < 30) hullEl.className = 'status-value critical';
        else if (this.hullIntegrity < 60) hullEl.className = 'status-value warning';
        else hullEl.className = 'status-value';
        
        // Time
        const elapsed = Math.floor(this.gameTime);
        const hours = Math.floor(elapsed / 3600);
        const minutes = Math.floor((elapsed % 3600) / 60);
        const seconds = elapsed % 60;
        document.getElementById('timeElapsed').textContent = 
            `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Sink status
        const sinkEl = document.getElementById('sinkStatus');
        if (this.waterLevel > 70) {
            sinkEl.textContent = 'SINKING RAPIDLY';
            sinkEl.className = 'status-value critical';
        } else if (this.waterLevel > 40) {
            sinkEl.textContent = 'TAKING ON WATER';
            sinkEl.className = 'status-value warning';
        } else if (this.waterLevel > 10) {
            sinkEl.textContent = 'MINOR FLOODING';
            sinkEl.className = 'status-value warning';
        } else if (this.hullIntegrity < 80) {
            sinkEl.textContent = 'COMPROMISED';
            sinkEl.className = 'status-value warning';
        } else {
            sinkEl.textContent = 'STABLE';
            sinkEl.className = 'status-value';
        }
        
        // Enhanced UI updates
        const moraleEl = document.getElementById('morale');
        if (moraleEl) moraleEl.textContent = this.crew.morale.toFixed(0) + '%';
        
        const weatherEl = document.getElementById('weather');
        if (weatherEl) weatherEl.textContent = this.weather.condition;
        
        const repairsEl = document.getElementById('repairs');
        if (repairsEl) repairsEl.textContent = this.repairKits;
        
        // Update captain portrait periodically
        if (!this.lastPortraitUpdate) this.lastPortraitUpdate = -1;
        if (Math.floor(this.gameTime) % 5 === 0 && Math.floor(this.gameTime) !== this.lastPortraitUpdate) {
            this.lastPortraitUpdate = Math.floor(this.gameTime);
            this.updateCaptainPortrait();
        }
    }
    
    changeSpeed(delta) {
        // Speed is controlled by furnace temp, this is more of a suggestion
        this.log(`SPEED ADJUSTMENT REQUESTED: ${delta > 0 ? 'INCREASE' : 'DECREASE'}`);
    }
    
    turnLeft() {
        this.ship.heading = (this.ship.heading - 10 + 360) % 360;
        this.log(`HELM: PORT TURN TO ${Math.round(this.ship.heading)}°`);
    }
    
    turnRight() {
        this.ship.heading = (this.ship.heading + 10) % 360;
        this.log(`HELM: STARBOARD TURN TO ${Math.round(this.ship.heading)}°`);
    }
    
    emergencyStop() {
        this.log("EMERGENCY STOP INITIATED", "warning");
        for (let furnace of this.furnaces) {
            furnace.heat *= 0.5;
        }
    }
    
    sink(reason) {
        if (this.gameOver) return;
        
        this.gameOver = true;
        this.synth.sink();
        this.log("═══════════════════════════════", "critical");
        this.log("VESSEL LOST - ALL HANDS ABANDON SHIP", "critical");
        this.log("═══════════════════════════════", "critical");
        
        // Show defeat image
        const endingImg = document.getElementById('endingImage');
        const gameOverTitle = document.getElementById('gameOverTitle');
        if (endingImg) {
            const defeatImages = ['defeat_01_sinking.png', 'defeat_02_lifeboats.png', 'defeat_03_memorial.png', 'defeat_04_underwater.png'];
            const randomDefeat = defeatImages[Math.floor(Math.random() * defeatImages.length)];
            endingImg.src = `game_images/${randomDefeat}`;
            endingImg.style.display = 'block';
            endingImg.onerror = () => { endingImg.style.display = 'none'; };
        }
        if (gameOverTitle) {
            gameOverTitle.textContent = '⚓ VESSEL LOST ⚓';
        }
        
        this.updateCaptainPortrait();
        document.getElementById('gameOver').style.display = 'block';
        document.getElementById('sinkReason').textContent = reason;
        document.getElementById('finalTime').textContent = document.getElementById('timeElapsed').textContent;
        document.getElementById('finalDistance').textContent = `${Math.round(this.distanceTraveled)} nm`;
        document.getElementById('icebergsAvoided').textContent = this.icebergsAvoided;
        document.getElementById('coalUsed').textContent = `${Math.round(100 - this.coal)} tons`;
        document.getElementById('gameOver').style.display = 'block';
    }
    
    victory() {
        if (this.gameOver) return;
        
        this.gameOver = true;
        this.synth.sink(); // Play success sound
        this.log("═══════════════════════════════", "good");
        this.log("🎉 IMPOSSIBLE VICTORY - NEW YORK REACHED!", "good");
        this.log("═══════════════════════════════", "good");
        
        // Show victory image
        const endingImg = document.getElementById('endingImage');
        const gameOverTitle = document.getElementById('gameOverTitle');
        if (endingImg) {
            const victoryImages = ['victory_01_harbor.png', 'victory_02_celebration.png', 'victory_03_newspaper.png'];
            const randomVictory = victoryImages[Math.floor(Math.random() * victoryImages.length)];
            endingImg.src = `game_images/${randomVictory}`;
            endingImg.style.display = 'block';
            endingImg.onerror = () => { endingImg.style.display = 'none'; };
        }
        if (gameOverTitle) {
            gameOverTitle.textContent = '🎉 IMPOSSIBLE VICTORY! 🎉';
            gameOverTitle.style.color = '#4ade80';
        }
        
        this.updateCaptainPortrait();
        
        const sinkReason = document.getElementById('sinkReason');
        sinkReason.textContent = 'Against all odds, the vessel reached New York Harbor safely!';
        sinkReason.style.color = '#4ade80';
        
        document.getElementById('finalTime').textContent = document.getElementById('timeElapsed').textContent;
        document.getElementById('finalDistance').textContent = `${Math.round(this.distanceTraveled)} nm`;
        document.getElementById('icebergsAvoided').textContent = this.icebergsAvoided;
        document.getElementById('coalUsed').textContent = `${Math.round(100 - this.coal)} tons`;
        document.getElementById('gameOver').style.display = 'block';
    }
    
    restart() {
        document.getElementById('gameOver').style.display = 'none';
        document.getElementById('eventLog').innerHTML = '';
        game = new TitanicSimulator();
    }
    
    log(message, type = 'normal') {
        const logEl = document.getElementById('eventLog');
        if (!logEl) return; // Guard against missing element
        
        const entry = document.createElement('div');
        entry.className = `log-entry ${type}`;
        
        const timestamp = new Date().toLocaleTimeString('en-GB', { hour12: false });
        entry.textContent = `[${timestamp}] ${message}`;
        
        logEl.appendChild(entry);
        
        // Auto-scroll to bottom
        logEl.scrollTop = logEl.scrollHeight;
        
        // Keep log size manageable (max 100 entries)
        while (logEl.children.length > 100) {
            logEl.removeChild(logEl.firstChild);
        }
    }
}

// Initialize game
let game = new TitanicSimulator();
