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
        
        // Show docking choice screen
        showDockingChoice();
    }, 2000);
}

function showDockingChoice() {
    // Calculate pilot cost based on ship size
    const shipValue = gameState.currentShip.type === 'coastal' ? 50000 :
                      gameState.currentShip.type === 'bulk' ? 150000 :
                      gameState.currentShip.type === 'container' ? 300000 : 500000;
    const pilotCost = Math.round(shipValue * 0.01); // 1% of ship value
    
    document.getElementById('approaching-port').textContent = gameState.currentPort.name;
    document.getElementById('pilot-cost').textContent = `Cost: $${pilotCost.toLocaleString()}`;
    
    showScreen('docking-choice');
}

function manualDocking() {
    showScreen('docking');
    startDocking();
}

function hirePilot() {
    // Calculate pilot cost
    const shipValue = gameState.currentShip.type === 'coastal' ? 50000 :
                      gameState.currentShip.type === 'bulk' ? 150000 :
                      gameState.currentShip.type === 'container' ? 300000 : 500000;
    const pilotCost = Math.round(shipValue * 0.01);
    
    if (gameState.company.cash < pilotCost) {
        showMessage('Insufficient Funds', `You need $${pilotCost.toLocaleString()} to hire a harbor pilot. You only have $${gameState.company.cash.toLocaleString()}.`);
        return;
    }
    
    // Deduct cost
    gameState.company.cash -= pilotCost;
    
    // Auto-dock with perfect result
    showMessage('Harbor Pilot Hired', 
        `The experienced harbor pilot expertly navigates your ship to the dock.\n\n` +
        `Cost: $${pilotCost.toLocaleString()}\n\n` +
        `Welcome to ${gameState.currentPort.name}!`);
    
    showScreen('game-screen');
    updateDisplay();
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
    // Reset docking state with realistic physics parameters
    dockingState = {
        phase: 3,
        shipX: 50,
        shipY: 200,
        shipVelX: 0.5,
        shipVelY: 0,
        shipAngle: 0,
        shipAngularVel: 0,
        enginePower: 20,
        targetEnginePower: 20,
        rudderAngle: 0,
        bowThruster: 0,  // Lateral thruster at bow (-100 to 100)
        sternThruster: 0, // Lateral thruster at stern (-100 to 100)
        damage: 0,
        dockX: 550,
        dockY: 200,
        
        // Realistic physics constants
        mass: 5000,              // Ship mass in tons
        momentOfInertia: 80000,  // Rotational inertia
        length: 80,
        width: 10,
        
        // Drag coefficients
        linearDrag: 0.05,        // Water resistance increases with speed
        angularDrag: 0.15,       // Rotational damping
        lateralDrag: 0.3,        // Higher drag when moving sideways
        
        // Forces
        maxEngineForce: 50,      // Maximum thrust (adjusted for mass scale)
        engineResponseTime: 0.1, // Engine takes time to respond
        rudderForce: 2.5,        // Rudder effectiveness (only when moving)
        thrusterForce: 10,       // Bow/stern thruster force
        
        // Environmental
        currentX: 0.02,          // Water current (small drift)
        currentY: 0.01,
        windX: 0,
        windY: 0
    };
    
    updateDockingInfo();
    runDockingSimulation();
}

function updateDockingInfo() {
    const info = document.getElementById('nav-info');
    const speed = Math.sqrt(dockingState.shipVelX**2 + dockingState.shipVelY**2);
    const distToDock = Math.max(0, Math.round(dockingState.dockX - dockingState.shipX - dockingState.length/2));
    
    info.innerHTML = `
        <h3>⚓ DOCKING PROCEDURE - Realistic Ship Physics</h3>
        <p>Speed: <span class="value">${speed.toFixed(2)} knots</span> | 
        Heading: <span class="value">${Math.round(dockingState.shipAngle)}°</span> | 
        Distance: <span class="value">${distToDock}m</span></p>
        <p>Engine: <span class="value">${Math.round(dockingState.enginePower)}%</span> | 
        Rudder: <span class="value">${Math.round(dockingState.rudderAngle)}°</span> |
        Bow Thruster: <span class="value">${Math.round(dockingState.bowThruster)}%</span></p>
        <p>Forward Vel: <span class="value">${dockingState.shipVelX.toFixed(2)}</span> | 
        Lateral Vel: <span class="value">${dockingState.shipVelY.toFixed(2)}</span> |
        Angular Vel: <span class="value">${dockingState.shipAngularVel.toFixed(3)}</span></p>
        <p class="hint">💡 Use bow thrusters (Q/E) for lateral movement. Rudder only works when moving forward!</p>
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
        
        // Draw docking scene
        updatePhase3(ctx);
        
        // Draw player ship
        drawPlayerShip(ctx);
        
        // Update physics
        updatePhysics();
        
        // Update info display
        updateDockingInfo();
        
        // Check if docked
        const distToDock = dockingState.dockX - dockingState.shipX - dockingState.length/2;
        const alignedY = Math.abs(dockingState.shipY - dockingState.dockY) < 25;
        const alignedAngle = Math.abs(dockingState.shipAngle) < 8;
        const speed = Math.sqrt(dockingState.shipVelX**2 + dockingState.shipVelY**2);
        
        if (distToDock < 5 && distToDock > -5 && alignedY && alignedAngle && speed < 0.5) {
            cancelAnimationFrame(animationFrame);
            completeDocking(speed);
            return;
        }
        
        // Check collision with dock (realistic collision response)
        if (dockingState.shipX + dockingState.length/2 > dockingState.dockX - 20) {
            const collisionSpeed = Math.abs(dockingState.shipVelX);
            if (collisionSpeed > 0.1) {
                // Bounce off dock
                dockingState.shipVelX = -dockingState.shipVelX * 0.4; // Energy loss
                dockingState.shipVelY *= 0.6;
                dockingState.damage += collisionSpeed * 20;
                
                // If not aligned, more damage
                if (!alignedY || !alignedAngle) {
                    dockingState.damage += 5;
                }
            }
        }
        
        // Check if too damaged
        if (dockingState.damage >= 50) {
            cancelAnimationFrame(animationFrame);
            gameState.currentShip.condition = Math.max(0, gameState.currentShip.condition - 30);
            showMessage('Docking Failed!', 'Your ship took too much damage! Condition reduced by 30%. Repairs needed.');
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
    const canvas = document.getElementById('dock-canvas');
    
    // Draw dock structure
    ctx.fillStyle = '#654321';
    ctx.fillRect(dockingState.dockX - 20, 0, 40, canvas.height);
    
    // Draw dock pilings
    for (let i = 0; i < 5; i++) {
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(dockingState.dockX - 15, i * 80 + 20, 30, 20);
    }
    
    // Draw target docking area - sized for ship
    const targetHeight = 50;
    ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
    ctx.fillRect(dockingState.dockX - 30, dockingState.dockY - targetHeight/2, 20, targetHeight);
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 3;
    ctx.strokeRect(dockingState.dockX - 30, dockingState.dockY - targetHeight/2, 20, targetHeight);
    
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
    
    // Draw center line guide
    ctx.strokeStyle = 'rgba(255,255,0,0.5)';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(0, dockingState.dockY);
    ctx.lineTo(dockingState.dockX - 30, dockingState.dockY);
    ctx.stroke();
    ctx.setLineDash([]);
}

function drawPlayerShip(ctx) {
    ctx.save();
    ctx.translate(dockingState.shipX, dockingState.shipY);
    ctx.rotate(dockingState.shipAngle * Math.PI / 180);
    
    const length = dockingState.length;
    const width = dockingState.width;
    
    // Ship hull - simple rectangle, 8:1 ratio
    ctx.fillStyle = '#888';
    ctx.fillRect(-length/2, -width/2, length, width);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.strokeRect(-length/2, -width/2, length, width);
    
    // Bow (front)
    ctx.fillStyle = '#999';
    ctx.beginPath();
    ctx.moveTo(length/2, 0);
    ctx.lineTo(length/2 - 10, -width/2);
    ctx.lineTo(length/2 - 10, width/2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Ship superstructure (bridge)
    ctx.fillStyle = '#666';
    ctx.fillRect(-length/4, -width, length/3, width*1.5);
    ctx.strokeRect(-length/4, -width, length/3, width*1.5);
    
    // Windows
    ctx.fillStyle = '#ffff00';
    for (let i = 0; i < 3; i++) {
        ctx.fillRect(-length/4 + 5 + i*10, -width + 2, 6, 4);
    }
    
    // Propeller wash (when engine on)
    if (Math.abs(dockingState.enginePower) > 5) {
        ctx.strokeStyle = dockingState.enginePower > 0 ? 'rgba(255,255,255,0.5)' : 'rgba(255,100,100,0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        const washLength = Math.abs(dockingState.enginePower) / 5;
        const washDir = dockingState.enginePower > 0 ? -1 : 1;
        ctx.moveTo(-length/2, -width/3);
        ctx.lineTo(-length/2 + washDir * washLength, -width/2);
        ctx.moveTo(-length/2, width/3);
        ctx.lineTo(-length/2 + washDir * washLength, width/2);
        ctx.stroke();
    }
    
    // Bow thruster indicators
    if (Math.abs(dockingState.bowThruster) > 5) {
        ctx.strokeStyle = dockingState.bowThruster > 0 ? 'rgba(0,255,255,0.7)' : 'rgba(255,0,255,0.7)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        const thrustDir = dockingState.bowThruster > 0 ? 1 : -1;
        ctx.moveTo(length/3, 0);
        ctx.lineTo(length/3, thrustDir * width * 2);
        ctx.stroke();
    }
    
    // Rudder indicator at stern
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-length/2, 0);
    const rudderLength = 8;
    ctx.lineTo(-length/2 - rudderLength * Math.cos(dockingState.rudderAngle * Math.PI / 180), 
               -rudderLength * Math.sin(dockingState.rudderAngle * Math.PI / 180));
    ctx.stroke();
    
    // Velocity vector (for debugging/feedback)
    ctx.strokeStyle = 'rgba(0,255,0,0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(dockingState.shipVelX * 20, dockingState.shipVelY * 20);
    ctx.stroke();
    
    ctx.restore();
}

function updatePhysics() {
    const canvas = document.getElementById('dock-canvas');
    const dt = 1/60; // Time step (60 FPS)
    
    // Engine response (engines don't respond instantly)
    const engineDiff = dockingState.targetEnginePower - dockingState.enginePower;
    dockingState.enginePower += engineDiff * dockingState.engineResponseTime;
    
    // === FORCES ===
    let forceX = 0;
    let forceY = 0;
    let torque = 0;
    
    // 1. Engine thrust (in ship's forward direction)
    const angleRad = dockingState.shipAngle * Math.PI / 180;
    const thrust = (dockingState.enginePower / 100) * dockingState.maxEngineForce;
    forceX += Math.cos(angleRad) * thrust;
    forceY += Math.sin(angleRad) * thrust;
    
    // 2. Rudder force (only effective when ship is moving forward)
    const forwardSpeed = dockingState.shipVelX * Math.cos(angleRad) + 
                         dockingState.shipVelY * Math.sin(angleRad);
    if (forwardSpeed > 0.1) {
        // Rudder creates a force perpendicular to ship's direction
        const rudderEffectiveness = Math.min(forwardSpeed, 2) / 2; // More effective at higher speeds
        torque += dockingState.rudderAngle * dockingState.rudderForce * rudderEffectiveness;
    }
    
    // 3. Bow thruster (lateral force at bow)
    if (dockingState.bowThruster !== 0) {
        const thrusterForceValue = (dockingState.bowThruster / 100) * dockingState.thrusterForce;
        // Force perpendicular to ship
        forceX += -Math.sin(angleRad) * thrusterForceValue;
        forceY += Math.cos(angleRad) * thrusterForceValue;
        // Torque from bow thruster (creates rotation)
        torque += thrusterForceValue * (dockingState.length / 3);
    }
    
    // 4. Stern thruster (lateral force at stern)
    if (dockingState.sternThruster !== 0) {
        const thrusterForceValue = (dockingState.sternThruster / 100) * dockingState.thrusterForce;
        forceX += -Math.sin(angleRad) * thrusterForceValue;
        forceY += Math.cos(angleRad) * thrusterForceValue;
        torque -= thrusterForceValue * (dockingState.length / 3);
    }
    
    // 5. Water current
    forceX += dockingState.currentX * 0.5;
    forceY += dockingState.currentY * 0.5;
    
    // === DRAG FORCES ===
    
    // Linear drag (opposes velocity, increases with speed squared)
    const speed = Math.sqrt(dockingState.shipVelX**2 + dockingState.shipVelY**2);
    if (speed > 0.01) {
        const dragMagnitude = dockingState.linearDrag * speed * speed;
        forceX -= (dockingState.shipVelX / speed) * dragMagnitude;
        forceY -= (dockingState.shipVelY / speed) * dragMagnitude;
    }
    
    // Lateral drag (higher resistance when moving sideways)
    const lateralVelX = -Math.sin(angleRad);
    const lateralVelY = Math.cos(angleRad);
    const lateralSpeed = dockingState.shipVelX * lateralVelX + dockingState.shipVelY * lateralVelY;
    if (Math.abs(lateralSpeed) > 0.01) {
        const lateralDragMagnitude = dockingState.lateralDrag * lateralSpeed * Math.abs(lateralSpeed);
        forceX -= lateralVelX * lateralDragMagnitude;
        forceY -= lateralVelY * lateralDragMagnitude;
    }
    
    // Angular drag (opposes rotation)
    torque -= dockingState.shipAngularVel * dockingState.angularDrag;
    
    // === INTEGRATION (F = ma) ===
    
    // Linear motion
    const accelX = forceX / dockingState.mass;
    const accelY = forceY / dockingState.mass;
    
    dockingState.shipVelX += accelX * dt * 60; // Scale by dt
    dockingState.shipVelY += accelY * dt * 60;
    
    // Angular motion
    const angularAccel = torque / dockingState.momentOfInertia;
    dockingState.shipAngularVel += angularAccel * dt * 60;
    
    // Update position and angle
    dockingState.shipX += dockingState.shipVelX;
    dockingState.shipY += dockingState.shipVelY;
    dockingState.shipAngle += dockingState.shipAngularVel;
    
    // Keep angle in range
    while (dockingState.shipAngle > 180) dockingState.shipAngle -= 360;
    while (dockingState.shipAngle < -180) dockingState.shipAngle += 360;
    
    // Boundaries with realistic collision
    if (dockingState.shipY < 30) {
        dockingState.shipY = 30;
        dockingState.shipVelY = -dockingState.shipVelY * 0.3; // Bounce with energy loss
        dockingState.shipVelX *= 0.7; // Friction
        dockingState.damage += Math.abs(dockingState.shipVelY) * 10;
    }
    if (dockingState.shipY > canvas.height - 30) {
        dockingState.shipY = canvas.height - 30;
        dockingState.shipVelY = -dockingState.shipVelY * 0.3;
        dockingState.shipVelX *= 0.7;
        dockingState.damage += Math.abs(dockingState.shipVelY) * 10;
    }
}

function completeDocking(speed) {
    if (speed > 2) {
        dockingState.damage += 10;
        gameState.currentShip.condition = Math.max(0, gameState.currentShip.condition - 10);
        showMessage('Hard Docking!', `You docked too fast at ${speed.toFixed(1)} knots! Ship condition reduced by 10%.`);
    } else if (speed > 1.5) {
        showMessage('Docking Complete', `Docked at ${speed.toFixed(1)} knots. A bit rough, but acceptable. Welcome to ${gameState.currentPort.name}!`);
    } else {
        showMessage('Perfect Docking!', `Excellent work, Captain! Docked smoothly at ${speed.toFixed(1)} knots. Welcome to ${gameState.currentPort.name}!`);
    }
    
    showScreen('game-screen');
    updateDisplay();
}

window.dockingControl = function(action) {
    switch(action) {
        case 'left':
            dockingState.rudderAngle = Math.max(-35, dockingState.rudderAngle - 5);
            break;
        case 'right':
            dockingState.rudderAngle = Math.min(35, dockingState.rudderAngle + 5);
            break;
        case 'center':
            dockingState.rudderAngle = 0;
            break;
        case 'slow':
            dockingState.targetEnginePower = Math.max(-30, dockingState.targetEnginePower - 10);
            break;
        case 'stop':
            dockingState.targetEnginePower = 0;
            break;
        case 'go':
            dockingState.targetEnginePower = Math.min(100, dockingState.targetEnginePower + 10);
            break;
        case 'full':
            dockingState.targetEnginePower = 100;
            break;
        case 'reverse':
            dockingState.targetEnginePower = Math.max(-30, dockingState.targetEnginePower - 10);
            break;
        case 'bow_left':
            dockingState.bowThruster = Math.max(-100, dockingState.bowThruster - 20);
            break;
        case 'bow_right':
            dockingState.bowThruster = Math.min(100, dockingState.bowThruster + 20);
            break;
        case 'bow_off':
            dockingState.bowThruster = 0;
            break;
    }
};

// Make functions globally accessible
window.manualDocking = manualDocking;
window.hirePilot = hirePilot;

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
            case 'q':
            case 'Q':
                e.preventDefault();
                dockingControl('bow_left');
                break;
            case 'e':
            case 'E':
                e.preventDefault();
                dockingControl('bow_right');
                break;
            case 'w':
            case 'W':
                e.preventDefault();
                dockingControl('bow_off');
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
