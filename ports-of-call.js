// Game State
let gameState = {
    company: {
        name: '',
        cash: 100000,
        founded: new Date(1985, 0, 1)
    },
    currentDate: new Date(1985, 0, 1),
    currentShip: null,
    ships: [],
    currentPort: null,
    navigating: false,
    navigationTarget: null
};

// Ship Types
const SHIP_TYPES = {
    coastal: {
        name: 'Coastal Freighter',
        cost: 50000,
        capacity: 100,
        speed: 12,
        fuelCapacity: 500,
        fuelConsumption: 2
    },
    bulk: {
        name: 'Bulk Carrier',
        cost: 150000,
        capacity: 500,
        speed: 15,
        fuelCapacity: 1000,
        fuelConsumption: 4
    },
    container: {
        name: 'Container Ship',
        cost: 300000,
        capacity: 1000,
        speed: 20,
        fuelCapacity: 1500,
        fuelConsumption: 6
    },
    tanker: {
        name: 'Oil Tanker',
        cost: 500000,
        capacity: 2000,
        speed: 18,
        fuelCapacity: 2000,
        fuelConsumption: 8
    }
};

// World Ports
const PORTS = [
    { id: 'newyork', name: 'New York', x: 150, y: 200, region: 'North America' },
    { id: 'london', name: 'London', x: 300, y: 150, region: 'Europe' },
    { id: 'hamburg', name: 'Hamburg', x: 320, y: 140, region: 'Europe' },
    { id: 'rotterdam', name: 'Rotterdam', x: 310, y: 145, region: 'Europe' },
    { id: 'singapore', name: 'Singapore', x: 550, y: 280, region: 'Asia' },
    { id: 'hongkong', name: 'Hong Kong', x: 570, y: 240, region: 'Asia' },
    { id: 'tokyo', name: 'Tokyo', x: 620, y: 200, region: 'Asia' },
    { id: 'sydney', name: 'Sydney', x: 640, y: 380, region: 'Oceania' },
    { id: 'dubai', name: 'Dubai', x: 420, y: 250, region: 'Middle East' },
    { id: 'capetown', name: 'Cape Town', x: 340, y: 380, region: 'Africa' },
    { id: 'santos', name: 'Santos', x: 220, y: 360, region: 'South America' },
    { id: 'miami', name: 'Miami', x: 160, y: 260, region: 'North America' }
];

// Cargo Types
const CARGO_TYPES = [
    { id: 'oil', name: 'Crude Oil', basePrice: 50 },
    { id: 'grain', name: 'Grain', basePrice: 30 },
    { id: 'coal', name: 'Coal', basePrice: 40 },
    { id: 'iron', name: 'Iron Ore', basePrice: 35 },
    { id: 'containers', name: 'Containers', basePrice: 80 },
    { id: 'chemicals', name: 'Chemicals', basePrice: 100 },
    { id: 'machinery', name: 'Machinery', basePrice: 120 },
    { id: 'electronics', name: 'Electronics', basePrice: 150 }
];

// Cargo market prices (vary by port)
let cargoMarket = {};

// Initialize game
function initializeCargoMarket() {
    cargoMarket = {};
    PORTS.forEach(port => {
        cargoMarket[port.id] = {};
        CARGO_TYPES.forEach(cargo => {
            const variance = 0.5 + Math.random();
            cargoMarket[port.id][cargo.id] = {
                buyPrice: Math.round(cargo.basePrice * variance),
                sellPrice: Math.round(cargo.basePrice * variance * 1.2),
                demand: Math.random()
            };
        });
    });
}

function startNewGame() {
    showScreen('setup');
}

function showInstructions() {
    showScreen('instructions');
}

function showMainMenu() {
    showScreen('main-menu');
}

function initializeGame() {
    const companyName = document.getElementById('company-name').value || 'SeaLines Inc.';
    
    gameState.company.name = companyName;
    gameState.company.cash = 100000;
    gameState.currentDate = new Date(1985, 0, 1);
    
    // Create starting ship
    const ship = createShip('coastal', 'SS Pioneer');
    gameState.ships = [ship];
    gameState.currentShip = ship;
    
    // Start at New York
    gameState.currentPort = PORTS[0];
    ship.currentPort = gameState.currentPort;
    
    // Initialize cargo market
    initializeCargoMarket();
    
    // Show game screen
    showScreen('game-screen');
    updateDisplay();
    
    showMessage('Welcome!', `Welcome to ${companyName}, Captain! Your journey begins in ${gameState.currentPort.name}. Buy low, sell high, and build your shipping empire!`);
}

function createShip(type, name) {
    const template = SHIP_TYPES[type];
    return {
        name: name,
        type: type,
        typeName: template.name,
        capacity: template.capacity,
        speed: template.speed,
        fuelCapacity: template.fuelCapacity,
        fuelConsumption: template.fuelConsumption,
        fuel: template.fuelCapacity,
        condition: 100,
        cargo: {},
        value: template.cost,
        currentPort: null
    };
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function updateDisplay() {
    const ship = gameState.currentShip;
    
    // Company info
    document.getElementById('company-display').textContent = gameState.company.name;
    document.getElementById('cash').textContent = '$' + gameState.company.cash.toLocaleString();
    
    const assets = gameState.company.cash + gameState.ships.reduce((sum, s) => sum + s.value, 0);
    document.getElementById('assets').textContent = '$' + assets.toLocaleString();
    document.getElementById('ship-count').textContent = gameState.ships.length;
    
    // Ship info
    if (ship) {
        document.getElementById('ship-name').textContent = ship.name;
        document.getElementById('ship-type').textContent = ship.typeName;
        document.getElementById('fuel').textContent = Math.round((ship.fuel / ship.fuelCapacity) * 100) + '%';
        document.getElementById('condition').textContent = ship.condition + '%';
        
        const cargoUsed = Object.values(ship.cargo).reduce((sum, qty) => sum + qty, 0);
        document.getElementById('cargo-used').textContent = cargoUsed + '/' + ship.capacity;
    }
    
    // Port info
    if (gameState.currentPort) {
        document.getElementById('current-port').textContent = gameState.currentPort.name;
    }
    
    // Date
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    document.getElementById('game-date').textContent = 
        monthNames[gameState.currentDate.getMonth()] + ' ' + gameState.currentDate.getFullYear();
    
    // Check win condition
    if (assets >= 1000000) {
        showMessage('Victory!', `Congratulations! You've built a shipping empire worth $${assets.toLocaleString()}! You are now a Maritime Tycoon!`);
    }
}

function showMap() {
    const content = document.getElementById('action-content');
    let html = '<h2>🗺️ World Ports</h2>';
    html += '<p>Select a destination to navigate to:</p>';
    html += '<div class="port-list">';
    
    PORTS.forEach(port => {
        if (port.id !== gameState.currentPort.id) {
            const distance = calculateDistance(gameState.currentPort, port);
            const fuelNeeded = Math.round(distance / gameState.currentShip.speed * gameState.currentShip.fuelConsumption);
            
            html += `<div class="port-card" onclick="navigateToPort('${port.id}')">`;
            html += `<h4>${port.name}</h4>`;
            html += `<p>${port.region}</p>`;
            html += `<p class="port-distance">${Math.round(distance)} nm</p>`;
            html += `<p class="port-distance">Fuel needed: ${fuelNeeded}</p>`;
            html += `</div>`;
        }
    });
    
    html += '</div>';
    content.innerHTML = html;
}

function calculateDistance(port1, port2) {
    const dx = port2.x - port1.x;
    const dy = port2.y - port1.y;
    return Math.sqrt(dx * dx + dy * dy) * 10; // Scale factor for nautical miles
}

function navigateToPort(portId) {
    const targetPort = PORTS.find(p => p.id === portId);
    const distance = calculateDistance(gameState.currentPort, targetPort);
    const fuelNeeded = Math.round(distance / gameState.currentShip.speed * gameState.currentShip.fuelConsumption);
    
    if (gameState.currentShip.fuel < fuelNeeded) {
        showMessage('Insufficient Fuel', `You need ${fuelNeeded} fuel units, but only have ${Math.round(gameState.currentShip.fuel)}. Please refuel first.`);
        return;
    }
    
    gameState.navigationTarget = targetPort;
    gameState.navigating = true;
    
    showScreen('navigation');
    startNavigation(targetPort, distance, fuelNeeded);
}

function startNavigation(targetPort, distance, fuelNeeded) {
    const info = document.getElementById('nav-info');
    info.innerHTML = `
        <p>Navigating from <strong>${gameState.currentPort.name}</strong> to <strong>${targetPort.name}</strong></p>
        <p>Distance: ${Math.round(distance)} nautical miles</p>
        <p>Fuel required: ${fuelNeeded} units</p>
        <p>Estimated time: ${Math.round(distance / gameState.currentShip.speed)} hours</p>
    `;
    
    // Simulate navigation
    setTimeout(() => {
        // Random events
        const event = Math.random();
        if (event < 0.1) {
            showMessage('Storm!', 'Your ship encountered a storm! Condition reduced by 10%.');
            gameState.currentShip.condition = Math.max(0, gameState.currentShip.condition - 10);
        } else if (event < 0.15) {
            showMessage('Pirates!', 'Pirates attacked! You paid $5000 to escape.');
            gameState.company.cash -= 5000;
        }
        
        // Consume fuel
        gameState.currentShip.fuel -= fuelNeeded;
        
        // Advance time
        const days = Math.ceil(distance / (gameState.currentShip.speed * 24));
        gameState.currentDate.setDate(gameState.currentDate.getDate() + days);
        
        // Arrive at port
        gameState.currentPort = targetPort;
        gameState.currentShip.currentPort = targetPort;
        gameState.navigating = false;
        
        // Update cargo prices
        updateCargoMarket();
        
        showScreen('docking');
        startDocking();
    }, 2000);
}

// Docking Simulator - Three Phase System
let dockingState = {
    phase: 1, // 1=debris, 2=ships, 3=final docking
    shipX: 50,
    shipY: 200,
    shipVelX: 0,
    shipVelY: 0,
    shipAngle: 0,
    shipAngularVel: 0,
    enginePower: 0,
    rudderAngle: 0,
    debris: [],
    otherShips: [],
    damage: 0,
    dockX: 550,
    dockY: 200,
    phase1Distance: 0,
    phase2Distance: 0
};

function startDocking() {
    // Reset docking state
    dockingState = {
        phase: 1,
        shipX: 50,
        shipY: 200,
        shipVelX: 2,
        shipVelY: 0,
        shipAngle: 0,
        shipAngularVel: 0,
        enginePower: 50,
        rudderAngle: 0,
        debris: [],
        otherShips: [],
        damage: 0,
        dockX: 550,
        dockY: 200,
        phase1Distance: 0,
        phase2Distance: 0,
        mass: 1000,
        drag: 0.98,
        maxSpeed: 5
    };
    
    // Generate debris for phase 1
    for (let i = 0; i < 15; i++) {
        dockingState.debris.push({
            x: 100 + Math.random() * 400,
            y: 50 + Math.random() * 300,
            size: 10 + Math.random() * 20,
            type: Math.floor(Math.random() * 3) // 0=barrel, 1=crate, 2=log
        });
    }
    
    // Generate other ships for phase 2
    for (let i = 0; i < 5; i++) {
        dockingState.otherShips.push({
            x: 100 + Math.random() * 400,
            y: 80 + Math.random() * 240,
            width: 60 + Math.random() * 40,
            height: 20 + Math.random() * 15,
            velX: (Math.random() - 0.5) * 0.5,
            velY: (Math.random() - 0.5) * 0.5,
            color: ['#555', '#666', '#777', '#888'][Math.floor(Math.random() * 4)]
        });
    }
    
    updateDockingInfo();
    runDockingSimulation();
}

function updateDockingInfo() {
    const info = document.getElementById('nav-info');
    let phaseText = '';
    
    switch(dockingState.phase) {
        case 1:
            phaseText = '⚠️ PHASE 1: HARBOR APPROACH - Avoid floating debris!';
            break;
        case 2:
            phaseText = '🚢 PHASE 2: TRAFFIC ZONE - Navigate around other vessels!';
            break;
        case 3:
            phaseText = '⚓ PHASE 3: FINAL DOCKING - Carefully align and dock!';
            break;
    }
    
    info.innerHTML = `
        <h3>${phaseText}</h3>
        <p>Speed: <span class="value">${Math.sqrt(dockingState.shipVelX**2 + dockingState.shipVelY**2).toFixed(1)} knots</span> | 
        Angle: <span class="value">${Math.round(dockingState.shipAngle)}°</span> | 
        Damage: <span class="value" style="color: ${dockingState.damage > 30 ? '#ff0000' : '#00ff00'}">${dockingState.damage}%</span></p>
        ${dockingState.phase === 3 ? `<p>Distance to dock: <span class="value">${Math.max(0, Math.round(dockingState.dockX - dockingState.shipX - 40))}m</span></p>` : ''}
    `;
}

function runDockingSimulation() {
    const canvas = document.getElementById('dock-canvas');
    const ctx = canvas.getContext('2d');
    
    let animationFrame;
    
    function gameLoop() {
        // Clear canvas
        ctx.fillStyle = '#001144';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw water effect
        ctx.fillStyle = '#002266';
        for (let i = 0; i < 10; i++) {
            ctx.fillRect(0, i * 40 + (Date.now() / 100 % 40), canvas.width, 2);
        }
        
        // Phase-specific rendering and logic
        switch(dockingState.phase) {
            case 1:
                updatePhase1(ctx);
                break;
            case 2:
                updatePhase2(ctx);
                break;
            case 3:
                updatePhase3(ctx);
                break;
        }
        
        // Draw player ship
        drawPlayerShip(ctx);
        
        // Update physics
        updatePhysics();
        
        // Update info display
        updateDockingInfo();
        
        // Check phase completion
        if (dockingState.phase === 1 && dockingState.shipX > 500) {
            dockingState.phase = 2;
            dockingState.shipX = 50;
            dockingState.shipY = 200;
            dockingState.shipVelX = 2;
            dockingState.phase1Distance = 500;
            showMessage('Phase 1 Complete!', 'Now navigate through ship traffic!');
        } else if (dockingState.phase === 2 && dockingState.shipX > 500) {
            dockingState.phase = 3;
            dockingState.shipX = 50;
            dockingState.shipY = 200;
            dockingState.shipVelX = 1;
            dockingState.shipVelY = 0;
            dockingState.shipAngle = 0;
            dockingState.phase2Distance = 500;
            showMessage('Phase 2 Complete!', 'Final approach - dock carefully!');
        }
        
        // Check if docked (phase 3)
        if (dockingState.phase === 3) {
            const distToDock = Math.abs(dockingState.shipX - (dockingState.dockX - 45));
            const alignedY = Math.abs(dockingState.shipY - dockingState.dockY) < 15;
            const alignedAngle = Math.abs(dockingState.shipAngle) < 5;
            const speed = Math.sqrt(dockingState.shipVelX**2 + dockingState.shipVelY**2);
            
            if (distToDock < 10 && alignedY && alignedAngle) {
                cancelAnimationFrame(animationFrame);
                completeDocking(speed);
                return;
            }
            
            // Check collision with dock
            if (dockingState.shipX > dockingState.dockX - 30 && !alignedY) {
                dockingState.damage += 5;
                dockingState.shipVelX = -Math.abs(dockingState.shipVelX) * 0.5;
            }
        }
        
        // Check if too damaged
        if (dockingState.damage >= 100) {
            cancelAnimationFrame(animationFrame);
            gameState.currentShip.condition = Math.max(0, gameState.currentShip.condition - 50);
            showMessage('Docking Failed!', 'Your ship took too much damage! Condition reduced by 50%. Repairs needed.');
            showScreen('game-screen');
            updateDisplay();
            return;
        }
        
        animationFrame = requestAnimationFrame(gameLoop);
    }
    
    animationFrame = requestAnimationFrame(gameLoop);
}

function updatePhase1(ctx) {
    // Draw and update debris
    dockingState.debris.forEach(debris => {
        // Draw debris based on type
        ctx.save();
        ctx.translate(debris.x, debris.y);
        
        switch(debris.type) {
            case 0: // Barrel
                ctx.fillStyle = '#8B4513';
                ctx.fillRect(-debris.size/2, -debris.size/2, debris.size, debris.size);
                ctx.fillStyle = '#654321';
                ctx.fillRect(-debris.size/2, -debris.size/4, debris.size, debris.size/2);
                break;
            case 1: // Crate
                ctx.fillStyle = '#CD853F';
                ctx.fillRect(-debris.size/2, -debris.size/2, debris.size, debris.size);
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 2;
                ctx.strokeRect(-debris.size/2, -debris.size/2, debris.size, debris.size);
                break;
            case 2: // Log
                ctx.fillStyle = '#8B4513';
                ctx.fillRect(-debris.size, -debris.size/3, debris.size * 2, debris.size * 2/3);
                break;
        }
        
        ctx.restore();
        
        // Check collision with player
        const dx = debris.x - dockingState.shipX - 40;
        const dy = debris.y - dockingState.shipY;
        const dist = Math.sqrt(dx*dx + dy*dy);
        
        if (dist < debris.size + 25) {
            dockingState.damage += 2;
            debris.x = -100; // Remove debris
            // Impact effect
            dockingState.shipVelX *= 0.8;
            dockingState.shipVelY += (Math.random() - 0.5) * 0.5;
        }
    });
}

function updatePhase2(ctx) {
    const canvas = document.getElementById('dock-canvas');
    
    // Draw and update other ships
    dockingState.otherShips.forEach(ship => {
        // Update position
        ship.x += ship.velX;
        ship.y += ship.velY;
        
        // Bounce off edges
        if (ship.x < 0 || ship.x > canvas.width) ship.velX *= -1;
        if (ship.y < 40 || ship.y > canvas.height - 40) ship.velY *= -1;
        
        // Draw ship
        ctx.fillStyle = ship.color;
        ctx.fillRect(ship.x - ship.width/2, ship.y - ship.height/2, ship.width, ship.height);
        ctx.fillStyle = '#333';
        ctx.fillRect(ship.x - ship.width/4, ship.y - ship.height/2 - 8, ship.width/2, 8);
        
        // Draw wake
        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(ship.x - ship.width/2, ship.y - 5);
        ctx.lineTo(ship.x - ship.width/2 - 15, ship.y - 10);
        ctx.moveTo(ship.x - ship.width/2, ship.y + 5);
        ctx.lineTo(ship.x - ship.width/2 - 15, ship.y + 10);
        ctx.stroke();
        
        // Check collision with player
        const dx = Math.abs(ship.x - dockingState.shipX - 40);
        const dy = Math.abs(ship.y - dockingState.shipY);
        
        if (dx < (ship.width + 80)/2 && dy < (ship.height + 30)/2) {
            dockingState.damage += 5;
            // Push ships apart
            dockingState.shipVelX *= 0.6;
            dockingState.shipVelY += (dockingState.shipY - ship.y) * 0.02;
            ship.velX = -ship.velX;
            ship.velY = -ship.velY;
        }
    });
}

function updatePhase3(ctx) {
    // Draw dock structure
    ctx.fillStyle = '#654321';
    ctx.fillRect(dockingState.dockX - 20, 0, 40, canvas.height);
    
    // Draw dock pilings
    for (let i = 0; i < 5; i++) {
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(dockingState.dockX - 15, i * 80 + 20, 30, 20);
    }
    
    // Draw target docking area
    ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
    ctx.fillRect(dockingState.dockX - 30, dockingState.dockY - 20, 20, 40);
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 3;
    ctx.strokeRect(dockingState.dockX - 30, dockingState.dockY - 20, 20, 40);
    
    // Draw distance markers
    for (let i = 100; i < dockingState.dockX - 50; i += 50) {
        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
        ctx.fillStyle = '#fff';
        ctx.font = '12px Courier';
        ctx.fillText((dockingState.dockX - i) + 'm', i + 5, 20);
    }
    
    // Draw dock workers
    for (let i = 0; i < 3; i++) {
        ctx.fillStyle = '#ff8800';
        ctx.fillRect(dockingState.dockX - 12, dockingState.dockY - 30 + i * 30, 8, 15);
    }
}

function drawPlayerShip(ctx) {
    ctx.save();
    ctx.translate(dockingState.shipX + 40, dockingState.shipY);
    ctx.rotate(dockingState.shipAngle * Math.PI / 180);
    
    // Ship hull
    ctx.fillStyle = '#888';
    ctx.beginPath();
    ctx.moveTo(40, 0);
    ctx.lineTo(-40, -15);
    ctx.lineTo(-40, 15);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Ship superstructure
    ctx.fillStyle = '#666';
    ctx.fillRect(-10, -20, 30, 15);
    
    // Ship windows
    ctx.fillStyle = '#ffff00';
    ctx.fillRect(-5, -18, 5, 4);
    ctx.fillRect(5, -18, 5, 4);
    
    // Propeller wash (when engine on)
    if (dockingState.enginePower > 0) {
        ctx.strokeStyle = 'rgba(255,255,255,0.5)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-40, -8);
        ctx.lineTo(-50 - dockingState.enginePower/10, -12);
        ctx.moveTo(-40, 8);
        ctx.lineTo(-50 - dockingState.enginePower/10, 12);
        ctx.stroke();
    }
    
    // Rudder indicator
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-35, 0);
    ctx.lineTo(-35 - 10 * Math.cos(dockingState.rudderAngle * Math.PI / 180), 
               -10 * Math.sin(dockingState.rudderAngle * Math.PI / 180));
    ctx.stroke();
    
    ctx.restore();
}

function updatePhysics() {
    const canvas = document.getElementById('dock-canvas');
    
    // Engine thrust
    const thrust = dockingState.enginePower / 100 * 0.1;
    const angleRad = dockingState.shipAngle * Math.PI / 180;
    dockingState.shipVelX += Math.cos(angleRad) * thrust;
    dockingState.shipVelY += Math.sin(angleRad) * thrust;
    
    // Rudder effect (only when moving)
    const speed = Math.sqrt(dockingState.shipVelX**2 + dockingState.shipVelY**2);
    dockingState.shipAngularVel += dockingState.rudderAngle * 0.002 * speed;
    
    // Angular drag
    dockingState.shipAngularVel *= 0.95;
    dockingState.shipAngle += dockingState.shipAngularVel;
    
    // Keep angle in range
    if (dockingState.shipAngle > 180) dockingState.shipAngle -= 360;
    if (dockingState.shipAngle < -180) dockingState.shipAngle += 360;
    
    // Drag
    dockingState.shipVelX *= 0.985;
    dockingState.shipVelY *= 0.985;
    
    // Speed limit
    const currentSpeed = Math.sqrt(dockingState.shipVelX**2 + dockingState.shipVelY**2);
    if (currentSpeed > dockingState.maxSpeed) {
        dockingState.shipVelX *= dockingState.maxSpeed / currentSpeed;
        dockingState.shipVelY *= dockingState.maxSpeed / currentSpeed;
    }
    
    // Update position
    dockingState.shipX += dockingState.shipVelX;
    dockingState.shipY += dockingState.shipVelY;
    
    // Boundaries
    if (dockingState.shipY < 30) {
        dockingState.shipY = 30;
        dockingState.shipVelY = Math.abs(dockingState.shipVelY) * 0.5;
        dockingState.damage += 1;
    }
    if (dockingState.shipY > canvas.height - 30) {
        dockingState.shipY = canvas.height - 30;
        dockingState.shipVelY = -Math.abs(dockingState.shipVelY) * 0.5;
        dockingState.damage += 1;
    }
}

function completeDocking(speed) {
    const totalDistance = dockingState.phase1Distance + dockingState.phase2Distance + (dockingState.dockX - 50);
    
    if (speed > 2.5) {
        dockingState.damage += 15;
        gameState.currentShip.condition -= dockingState.damage;
        showMessage('Hard Docking!', `You docked too fast at ${speed.toFixed(1)} knots! Total damage: ${Math.round(dockingState.damage)}%. Ship condition reduced.`);
    } else if (dockingState.damage > 20) {
        gameState.currentShip.condition -= dockingState.damage;
        showMessage('Docking Complete', `Docked but with ${Math.round(dockingState.damage)}% damage from collisions. Ship condition reduced.`);
    } else {
        showMessage('Perfect Docking!', `Excellent work, Captain! Docked safely at ${speed.toFixed(1)} knots with minimal damage. Welcome to ${gameState.currentPort.name}!`);
    }
    
    showScreen('game-screen');
    updateDisplay();
}

window.dockingControl = function(action) {
    switch(action) {
        case 'left':
            dockingState.rudderAngle = Math.max(-30, dockingState.rudderAngle - 5);
            break;
        case 'right':
            dockingState.rudderAngle = Math.min(30, dockingState.rudderAngle + 5);
            break;
        case 'center':
            dockingState.rudderAngle = 0;
            break;
        case 'slow':
            dockingState.enginePower = Math.max(0, dockingState.enginePower - 10);
            break;
        case 'stop':
            dockingState.enginePower = 0;
            break;
        case 'go':
            dockingState.enginePower = Math.min(100, dockingState.enginePower + 10);
            break;
        case 'full':
            dockingState.enginePower = 100;
            break;
        case 'reverse':
            dockingState.enginePower = Math.max(-50, dockingState.enginePower - 10);
            break;
    }
};

function cancelNavigation() {
    gameState.navigating = false;
    showScreen('game-screen');
}

function showCargo() {
    const content = document.getElementById('action-content');
    const ship = gameState.currentShip;
    const port = gameState.currentPort;
    
    let html = '<h2>📦 Cargo Trading</h2>';
    html += `<p>Current Port: <strong>${port.name}</strong></p>`;
    
    const cargoUsed = Object.values(ship.cargo).reduce((sum, qty) => sum + qty, 0);
    html += `<p>Cargo Space: ${cargoUsed} / ${ship.capacity} tons</p>`;
    
    html += '<table><tr><th>Cargo</th><th>Buy Price</th><th>Sell Price</th><th>On Ship</th><th>Action</th></tr>';
    
    CARGO_TYPES.forEach(cargo => {
        const market = cargoMarket[port.id][cargo.id];
        const onShip = ship.cargo[cargo.id] || 0;
        
        html += '<tr>';
        html += `<td>${cargo.name}</td>`;
        html += `<td style="color: #ff6600">$${market.buyPrice}/ton</td>`;
        html += `<td style="color: #00ff00">$${market.sellPrice}/ton</td>`;
        html += `<td>${onShip} tons</td>`;
        html += `<td>`;
        html += `<input type="number" id="qty-${cargo.id}" min="0" max="100" value="10" style="width:60px">`;
        html += `<button class="amiga-btn small" onclick="buyCargo('${cargo.id}')">BUY</button>`;
        if (onShip > 0) {
            html += `<button class="amiga-btn small" onclick="sellCargo('${cargo.id}')">SELL</button>`;
        }
        html += `</td>`;
        html += '</tr>';
    });
    
    html += '</table>';
    content.innerHTML = html;
}

function buyCargo(cargoId) {
    const ship = gameState.currentShip;
    const port = gameState.currentPort;
    const qty = parseInt(document.getElementById(`qty-${cargoId}`).value) || 0;
    
    if (qty <= 0) return;
    
    const cargoUsed = Object.values(ship.cargo).reduce((sum, q) => sum + q, 0);
    if (cargoUsed + qty > ship.capacity) {
        showMessage('Error', 'Not enough cargo space!');
        return;
    }
    
    const cost = qty * cargoMarket[port.id][cargoId].buyPrice;
    if (cost > gameState.company.cash) {
        showMessage('Error', 'Not enough cash!');
        return;
    }
    
    gameState.company.cash -= cost;
    ship.cargo[cargoId] = (ship.cargo[cargoId] || 0) + qty;
    
    updateDisplay();
    showCargo();
}

function sellCargo(cargoId) {
    const ship = gameState.currentShip;
    const port = gameState.currentPort;
    const qty = parseInt(document.getElementById(`qty-${cargoId}`).value) || 0;
    const onShip = ship.cargo[cargoId] || 0;
    
    if (qty <= 0 || qty > onShip) return;
    
    const revenue = qty * cargoMarket[port.id][cargoId].sellPrice;
    gameState.company.cash += revenue;
    ship.cargo[cargoId] -= qty;
    
    if (ship.cargo[cargoId] === 0) delete ship.cargo[cargoId];
    
    updateDisplay();
    showCargo();
}

function updateCargoMarket() {
    PORTS.forEach(port => {
        CARGO_TYPES.forEach(cargo => {
            const variance = 0.8 + Math.random() * 0.4;
            cargoMarket[port.id][cargo.id].buyPrice = Math.round(cargo.basePrice * variance);
            cargoMarket[port.id][cargo.id].sellPrice = Math.round(cargo.basePrice * variance * 1.2);
        });
    });
}

function refuelShip() {
    const ship = gameState.currentShip;
    const needed = ship.fuelCapacity - ship.fuel;
    const cost = Math.round(needed * 2);
    
    if (cost > gameState.company.cash) {
        showMessage('Error', 'Not enough cash to refuel!');
        return;
    }
    
    gameState.company.cash -= cost;
    ship.fuel = ship.fuelCapacity;
    
    updateDisplay();
    showMessage('Refueled', `Ship refueled for $${cost.toLocaleString()}`);
}

function repairShip() {
    const ship = gameState.currentShip;
    const needed = 100 - ship.condition;
    const cost = Math.round(needed * 100);
    
    if (cost === 0) {
        showMessage('Info', 'Ship is already in perfect condition!');
        return;
    }
    
    if (cost > gameState.company.cash) {
        showMessage('Error', 'Not enough cash to repair!');
        return;
    }
    
    gameState.company.cash -= cost;
    ship.condition = 100;
    
    updateDisplay();
    showMessage('Repaired', `Ship repaired for $${cost.toLocaleString()}`);
}

function showShipyard() {
    const content = document.getElementById('action-content');
    let html = '<h2>🚢 Shipyard</h2>';
    html += '<p>Buy or sell ships to expand your fleet</p>';
    
    html += '<h3>Available Ships</h3>';
    html += '<table><tr><th>Type</th><th>Capacity</th><th>Speed</th><th>Price</th><th>Action</th></tr>';
    
    Object.entries(SHIP_TYPES).forEach(([key, ship]) => {
        html += '<tr>';
        html += `<td>${ship.name}</td>`;
        html += `<td>${ship.capacity} tons</td>`;
        html += `<td>${ship.speed} knots</td>`;
        html += `<td>$${ship.cost.toLocaleString()}</td>`;
        html += `<td><button class="amiga-btn small" onclick="buyShip('${key}')">BUY</button></td>`;
        html += '</tr>';
    });
    
    html += '</table>';
    
    html += '<h3>Your Fleet</h3>';
    html += '<table><tr><th>Name</th><th>Type</th><th>Port</th><th>Value</th><th>Action</th></tr>';
    
    gameState.ships.forEach((ship, index) => {
        html += '<tr>';
        html += `<td>${ship.name}</td>`;
        html += `<td>${ship.typeName}</td>`;
        html += `<td>${ship.currentPort ? ship.currentPort.name : 'At Sea'}</td>`;
        html += `<td>$${ship.value.toLocaleString()}</td>`;
        html += `<td>`;
        html += `<button class="amiga-btn small" onclick="selectShip(${index})">SELECT</button>`;
        if (gameState.ships.length > 1) {
            html += `<button class="amiga-btn small" onclick="sellShip(${index})">SELL</button>`;
        }
        html += `</td>`;
        html += '</tr>';
    });
    
    html += '</table>';
    content.innerHTML = html;
}

function buyShip(type) {
    const template = SHIP_TYPES[type];
    
    if (gameState.company.cash < template.cost) {
        showMessage('Error', 'Not enough cash to buy this ship!');
        return;
    }
    
    const name = prompt('Enter ship name:', 'SS Venture');
    if (!name) return;
    
    const ship = createShip(type, name);
    ship.currentPort = gameState.currentPort;
    
    gameState.ships.push(ship);
    gameState.company.cash -= template.cost;
    
    updateDisplay();
    showShipyard();
    showMessage('Ship Purchased', `${ship.name} has been added to your fleet!`);
}

function selectShip(index) {
    gameState.currentShip = gameState.ships[index];
    if (gameState.currentShip.currentPort) {
        gameState.currentPort = gameState.currentShip.currentPort;
    }
    updateDisplay();
    showMessage('Ship Selected', `Now commanding ${gameState.currentShip.name}`);
}

function sellShip(index) {
    if (gameState.ships.length === 1) {
        showMessage('Error', 'Cannot sell your last ship!');
        return;
    }
    
    const ship = gameState.ships[index];
    const sellPrice = Math.round(ship.value * 0.7);
    
    if (confirm(`Sell ${ship.name} for $${sellPrice.toLocaleString()}?`)) {
        gameState.company.cash += sellPrice;
        gameState.ships.splice(index, 1);
        
        if (gameState.currentShip === ship) {
            gameState.currentShip = gameState.ships[0];
            gameState.currentPort = gameState.currentShip.currentPort;
        }
        
        updateDisplay();
        showShipyard();
    }
}

function showFinances() {
    const content = document.getElementById('action-content');
    const totalAssets = gameState.company.cash + gameState.ships.reduce((sum, s) => sum + s.value, 0);
    const shipValue = gameState.ships.reduce((sum, s) => sum + s.value, 0);
    
    let html = '<h2>💰 Financial Report</h2>';
    html += '<table>';
    html += `<tr><th>Item</th><th>Value</th></tr>`;
    html += `<tr><td>Cash</td><td style="color: #00ff00">$${gameState.company.cash.toLocaleString()}</td></tr>`;
    html += `<tr><td>Fleet Value</td><td style="color: #00ff00">$${shipValue.toLocaleString()}</td></tr>`;
    html += `<tr><th>Total Assets</th><th style="color: #ffaa00">$${totalAssets.toLocaleString()}</th></tr>`;
    html += '</table>';
    
    html += `<p style="margin-top: 20px;">Company Founded: Jan 1985</p>`;
    html += `<p>Ships Owned: ${gameState.ships.length}</p>`;
    
    if (totalAssets >= 1000000) {
        html += '<p style="color: #00ff00; font-size: 1.5em; margin-top: 20px;">🏆 MILLIONAIRE STATUS ACHIEVED! 🏆</p>';
    } else {
        const remaining = 1000000 - totalAssets;
        html += `<p style="color: #ffaa00; margin-top: 20px;">$${remaining.toLocaleString()} to millionaire status</p>`;
    }
    
    content.innerHTML = html;
}

function showMessage(title, text) {
    document.getElementById('message-title').textContent = title;
    document.getElementById('message-text').textContent = text;
    document.getElementById('message-box').classList.remove('hidden');
}

function closeMessage() {
    document.getElementById('message-box').classList.add('hidden');
}

// Keyboard controls for docking
document.addEventListener('keydown', (e) => {
    if (document.getElementById('docking').classList.contains('active')) {
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                dockingControl('left');
                break;
            case 'ArrowRight':
                e.preventDefault();
                dockingControl('right');
                break;
            case 'ArrowDown':
                e.preventDefault();
                dockingControl('slow');
                break;
            case 'ArrowUp':
                e.preventDefault();
                dockingControl('go');
                break;
            case ' ':
                e.preventDefault();
                dockingControl('stop');
                break;
            case 'c':
            case 'C':
                dockingControl('center');
                break;
            case 'r':
            case 'R':
                dockingControl('reverse');
                break;
            case 'f':
            case 'F':
                dockingControl('full');
                break;
        }
    }
});

// Adjust navigation controls
function adjustSpeed(delta) {
    // Placeholder for speed adjustment during navigation
}

function adjustCourse(delta) {
    // Placeholder for course adjustment during navigation
}
