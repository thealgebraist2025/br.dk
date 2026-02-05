// Main game logic for Ports of Call
// Types are defined in types.ts
// Constants are defined in constants.ts

// Game State
let gameState: GameState = {
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

// Cargo market prices (vary by port)
let cargoMarket: CargoMarket = {};

// Docking state
let dockingState: DockingState = {
    phase: 1,
    shipX: 50,
    shipY: 200,
    shipVelX: 0,
    shipVelY: 0,
    shipAngle: 0,
    shipAngularVel: 0,
    enginePower: 0,
    targetEnginePower: 0,
    rudderAngle: 0,
    bowThruster: 0,
    sternThruster: 0,
    damage: 0,
    dockX: 550,
    dockY: 200,
    mass: 5000,
    momentOfInertia: 80000,
    length: 80,
    width: 10,
    linearDrag: 0.05,
    angularDrag: 0.15,
    lateralDrag: 0.3,
    maxEngineForce: 50,
    engineResponseTime: 0.1,
    rudderForce: 2.5,
    thrusterForce: 10,
    currentX: 0.02,
    currentY: 0.01,
    windX: 0,
    windY: 0
};

// UI Functions
function showScreen(screenId: string): void {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => screen.classList.remove('active'));
    
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
    }
}

function showMessage(title: string, message: string): void {
    const messageBox = document.getElementById('message-box');
    const messageTitle = document.getElementById('message-title');
    const messageText = document.getElementById('message-text');
    
    if (messageBox && messageTitle && messageText) {
        messageTitle.textContent = title;
        messageText.textContent = message;
        messageBox.classList.remove('hidden');
    }
}

function closeMessage(): void {
    const messageBox = document.getElementById('message-box');
    if (messageBox) {
        messageBox.classList.add('hidden');
    }
}

function showMainMenu(): void {
    showScreen('main-menu');
}

function showInstructions(): void {
    showScreen('instructions');
}

function startNewGame(): void {
    showScreen('setup');
}

// Initialize game
function initializeCargoMarket(): void {
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

function initializeGame(): void {
    const companyNameInput = document.getElementById('company-name') as HTMLInputElement;
    const companyName = companyNameInput?.value || 'SeaLines Inc.';
    
    gameState.company.name = companyName;
    gameState.currentDate = new Date(1985, 0, 1);
    gameState.company.cash = 100000;
    
    // Create starting ship
    const startPort = PORTS[0];
    const shipType = SHIP_TYPES.coastal;
    
    const ship: Ship = {
        id: 'ship1',
        name: 'SS Pioneer',
        type: 'coastal',
        fuel: shipType.fuelCapacity,
        fuelCapacity: shipType.fuelCapacity,
        fuelConsumption: shipType.fuelConsumption,
        capacity: shipType.capacity,
        speed: shipType.speed,
        condition: 100,
        cargo: {},
        currentPort: startPort
    };
    
    gameState.ships = [ship];
    gameState.currentShip = ship;
    gameState.currentPort = startPort;
    
    initializeCargoMarket();
    showScreen('game-screen');
    updateDisplay();
}

function updateDisplay(): void {
    const ship = gameState.currentShip;
    if (!ship) return;
    
    // Update date
    const dateElement = document.getElementById('game-date');
    if (dateElement) {
        dateElement.textContent = gameState.currentDate.toLocaleDateString('en-US', { 
            month: 'short', 
            year: 'numeric' 
        });
    }
    
    // Update company info
    const companyDisplay = document.getElementById('company-display');
    if (companyDisplay) {
        companyDisplay.textContent = gameState.company.name;
    }
    
    const cashElement = document.getElementById('cash');
    if (cashElement) {
        cashElement.textContent = `$${gameState.company.cash.toLocaleString()}`;
    }
    
    const totalAssets = gameState.company.cash + (gameState.ships.length * 50000);
    const assetsElement = document.getElementById('assets');
    if (assetsElement) {
        assetsElement.textContent = `$${totalAssets.toLocaleString()}`;
    }
    
    const shipCountElement = document.getElementById('ship-count');
    if (shipCountElement) {
        shipCountElement.textContent = gameState.ships.length.toString();
    }
    
    // Update ship info
    const shipNameElement = document.getElementById('ship-name');
    if (shipNameElement) {
        shipNameElement.textContent = ship.name;
    }
    
    const shipTypeElement = document.getElementById('ship-type');
    if (shipTypeElement) {
        shipTypeElement.textContent = SHIP_TYPES[ship.type].name;
    }
    
    const fuelElement = document.getElementById('fuel');
    if (fuelElement) {
        fuelElement.textContent = `${Math.round((ship.fuel / ship.fuelCapacity) * 100)}%`;
    }
    
    const conditionElement = document.getElementById('condition');
    if (conditionElement) {
        conditionElement.textContent = `${Math.round(ship.condition)}%`;
    }
    
    const cargoUsed = Object.values(ship.cargo).reduce((sum, qty) => sum + qty, 0);
    const cargoElement = document.getElementById('cargo-used');
    if (cargoElement) {
        cargoElement.textContent = `${cargoUsed}/${ship.capacity}`;
    }
    
    // Update port info
    if (gameState.currentPort) {
        const portElement = document.getElementById('current-port');
        if (portElement) {
            portElement.textContent = gameState.currentPort.name;
        }
    }
}

function calculateDistance(port1: Port, port2: Port): number {
    const dx = port2.x - port1.x;
    const dy = port2.y - port1.y;
    return Math.sqrt(dx * dx + dy * dy) * 10; // Scale factor for nautical miles
}

function showMap(): void {
    const content = document.getElementById('action-content');
    if (!content || !gameState.currentPort || !gameState.currentShip) return;
    
    let html = '<h2>🗺️ World Ports</h2>';
    html += '<p>Select a destination to navigate to:</p>';
    html += '<div class="port-list">';
    
    PORTS.forEach(port => {
        if (port.id !== gameState.currentPort!.id) {
            const distance = calculateDistance(gameState.currentPort!, port);
            const fuelNeeded = Math.round(distance / gameState.currentShip!.speed * gameState.currentShip!.fuelConsumption);
            
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

function navigateToPort(portId: string): void {
    if (!gameState.currentPort || !gameState.currentShip) return;
    
    const targetPort = PORTS.find(p => p.id === portId);
    if (!targetPort) return;
    
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

function startNavigation(targetPort: Port, distance: number, fuelNeeded: number): void {
    if (!gameState.currentPort || !gameState.currentShip) return;
    
    const info = document.getElementById('nav-info');
    if (info) {
        info.innerHTML = `
            <p>Navigating from <strong>${gameState.currentPort.name}</strong> to <strong>${targetPort.name}</strong></p>
            <p>Distance: ${Math.round(distance)} nautical miles</p>
            <p>Fuel required: ${fuelNeeded} units</p>
            <p>Estimated time: ${Math.round(distance / gameState.currentShip.speed)} hours</p>
        `;
    }
    
    // Simulate navigation
    setTimeout(() => {
        if (!gameState.currentShip) return;
        
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

function showDockingChoice(): void {
    if (!gameState.currentShip || !gameState.currentPort) return;
    
    // Calculate pilot cost based on ship size
    const shipValue = gameState.currentShip.type === 'coastal' ? 50000 :
                      gameState.currentShip.type === 'bulk' ? 150000 :
                      gameState.currentShip.type === 'container' ? 300000 : 500000;
    const pilotCost = Math.round(shipValue * 0.01);
    
    const approachingPortElement = document.getElementById('approaching-port');
    const pilotCostElement = document.getElementById('pilot-cost');
    
    if (approachingPortElement) {
        approachingPortElement.textContent = gameState.currentPort.name;
    }
    if (pilotCostElement) {
        pilotCostElement.textContent = `Cost: $${pilotCost.toLocaleString()}`;
    }
    
    showScreen('docking-choice');
}

function manualDocking(): void {
    showScreen('docking');
    startDocking();
}

function hirePilot(): void {
    if (!gameState.currentShip || !gameState.currentPort) return;
    
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

// Docking Simulator
function startDocking(): void {
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
        bowThruster: 0,
        sternThruster: 0,
        damage: 0,
        dockX: 550,
        dockY: 200,
        
        // Realistic physics constants
        mass: 5000,
        momentOfInertia: 80000,
        length: 80,
        width: 10,
        
        // Drag coefficients
        linearDrag: 0.05,
        angularDrag: 0.15,
        lateralDrag: 0.3,
        
        // Forces
        maxEngineForce: 50,
        engineResponseTime: 0.1,
        rudderForce: 2.5,
        thrusterForce: 10,
        
        // Environmental
        currentX: 0.02,
        currentY: 0.01,
        windX: 0,
        windY: 0
    };
    
    updateDockingInfo();
    runDockingSimulation();
}

function updateDockingInfo(): void {
    const info = document.getElementById('nav-info');
    if (!info) return;
    
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

function runDockingSimulation(): void {
    const canvas = document.getElementById('dock-canvas') as HTMLCanvasElement;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationFrame: number;
    
    function gameLoop(): void {
        if (!ctx || !canvas) return;
        
        // Clear canvas
        ctx.fillStyle = '#001144';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw water effect
        ctx.fillStyle = '#002266';
        for (let i = 0; i < 10; i++) {
            ctx.fillRect(0, i * 40 + (Date.now() / 100 % 40), canvas.width, 2);
        }
        
        // Draw docking scene
        updatePhase3(ctx, canvas);
        
        // Draw player ship
        drawPlayerShip(ctx);
        
        // Update physics
        updatePhysics(canvas);
        
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
        
        // Check collision with dock
        if (dockingState.shipX + dockingState.length/2 > dockingState.dockX - 20) {
            const collisionSpeed = Math.abs(dockingState.shipVelX);
            if (collisionSpeed > 0.1) {
                dockingState.shipVelX = -dockingState.shipVelX * 0.4;
                dockingState.shipVelY *= 0.6;
                dockingState.damage += collisionSpeed * 20;
                
                if (!alignedY || !alignedAngle) {
                    dockingState.damage += 5;
                }
            }
        }
        
        // Check if too damaged
        if (dockingState.damage >= 50) {
            cancelAnimationFrame(animationFrame);
            if (gameState.currentShip) {
                gameState.currentShip.condition = Math.max(0, gameState.currentShip.condition - 30);
            }
            showMessage('Docking Failed!', 'Your ship took too much damage! Condition reduced by 30%. Repairs needed.');
            showScreen('game-screen');
            updateDisplay();
            return;
        }
        
        animationFrame = requestAnimationFrame(gameLoop);
    }
    
    animationFrame = requestAnimationFrame(gameLoop);
}

function updatePhase3(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
    // Draw dock structure
    ctx.fillStyle = '#654321';
    ctx.fillRect(dockingState.dockX - 20, 0, 40, canvas.height);
    
    // Draw dock pilings
    for (let i = 0; i < 5; i++) {
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(dockingState.dockX - 15, i * 80 + 20, 30, 20);
    }
    
    // Draw target docking area
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

function drawPlayerShip(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.translate(dockingState.shipX, dockingState.shipY);
    ctx.rotate(dockingState.shipAngle * Math.PI / 180);
    
    const length = dockingState.length;
    const width = dockingState.width;
    
    // Ship hull
    ctx.fillStyle = '#888';
    ctx.fillRect(-length/2, -width/2, length, width);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.strokeRect(-length/2, -width/2, length, width);
    
    // Bow
    ctx.fillStyle = '#999';
    ctx.beginPath();
    ctx.moveTo(length/2, 0);
    ctx.lineTo(length/2 - 10, -width/2);
    ctx.lineTo(length/2 - 10, width/2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Bridge
    ctx.fillStyle = '#666';
    ctx.fillRect(-length/4, -width, length/3, width*1.5);
    ctx.strokeRect(-length/4, -width, length/3, width*1.5);
    
    // Windows
    ctx.fillStyle = '#ffff00';
    for (let i = 0; i < 3; i++) {
        ctx.fillRect(-length/4 + 5 + i*10, -width + 2, 6, 4);
    }
    
    // Propeller wash
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
    
    // Rudder indicator
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-length/2, 0);
    const rudderLength = 8;
    ctx.lineTo(-length/2 - rudderLength * Math.cos(dockingState.rudderAngle * Math.PI / 180), 
               -rudderLength * Math.sin(dockingState.rudderAngle * Math.PI / 180));
    ctx.stroke();
    
    // Velocity vector
    ctx.strokeStyle = 'rgba(0,255,0,0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(dockingState.shipVelX * 20, dockingState.shipVelY * 20);
    ctx.stroke();
    
    ctx.restore();
}

function updatePhysics(canvas: HTMLCanvasElement): void {
    const dt = 1/60;
    
    // Engine response
    const engineDiff = dockingState.targetEnginePower - dockingState.enginePower;
    dockingState.enginePower += engineDiff * dockingState.engineResponseTime;
    
    // Forces
    let forceX = 0;
    let forceY = 0;
    let torque = 0;
    
    // Engine thrust
    const angleRad = dockingState.shipAngle * Math.PI / 180;
    const thrust = (dockingState.enginePower / 100) * dockingState.maxEngineForce;
    forceX += Math.cos(angleRad) * thrust;
    forceY += Math.sin(angleRad) * thrust;
    
    // Rudder force
    const forwardSpeed = dockingState.shipVelX * Math.cos(angleRad) + 
                         dockingState.shipVelY * Math.sin(angleRad);
    if (forwardSpeed > 0.1) {
        const rudderEffectiveness = Math.min(forwardSpeed, 2) / 2;
        torque += dockingState.rudderAngle * dockingState.rudderForce * rudderEffectiveness;
    }
    
    // Bow thruster
    if (dockingState.bowThruster !== 0) {
        const thrusterForceValue = (dockingState.bowThruster / 100) * dockingState.thrusterForce;
        forceX += -Math.sin(angleRad) * thrusterForceValue;
        forceY += Math.cos(angleRad) * thrusterForceValue;
        torque += thrusterForceValue * (dockingState.length / 3);
    }
    
    // Water current
    forceX += dockingState.currentX * 0.5;
    forceY += dockingState.currentY * 0.5;
    
    // Drag forces
    const speed = Math.sqrt(dockingState.shipVelX**2 + dockingState.shipVelY**2);
    if (speed > 0.01) {
        const dragMagnitude = dockingState.linearDrag * speed * speed;
        forceX -= (dockingState.shipVelX / speed) * dragMagnitude;
        forceY -= (dockingState.shipVelY / speed) * dragMagnitude;
    }
    
    // Lateral drag
    const lateralVelX = -Math.sin(angleRad);
    const lateralVelY = Math.cos(angleRad);
    const lateralSpeed = dockingState.shipVelX * lateralVelX + dockingState.shipVelY * lateralVelY;
    if (Math.abs(lateralSpeed) > 0.01) {
        const lateralDragMagnitude = dockingState.lateralDrag * lateralSpeed * Math.abs(lateralSpeed);
        forceX -= lateralVelX * lateralDragMagnitude;
        forceY -= lateralVelY * lateralDragMagnitude;
    }
    
    // Angular drag
    torque -= dockingState.shipAngularVel * dockingState.angularDrag;
    
    // Integration
    const accelX = forceX / dockingState.mass;
    const accelY = forceY / dockingState.mass;
    
    dockingState.shipVelX += accelX * dt * 60;
    dockingState.shipVelY += accelY * dt * 60;
    
    const angularAccel = torque / dockingState.momentOfInertia;
    dockingState.shipAngularVel += angularAccel * dt * 60;
    
    // Update positions
    dockingState.shipX += dockingState.shipVelX;
    dockingState.shipY += dockingState.shipVelY;
    dockingState.shipAngle += dockingState.shipAngularVel;
    
    // Boundary checks
    if (dockingState.shipY < 20) {
        dockingState.shipY = 20;
        dockingState.shipVelY = -dockingState.shipVelY * 0.5;
    }
    if (dockingState.shipY > canvas.height - 20) {
        dockingState.shipY = canvas.height - 20;
        dockingState.shipVelY = -dockingState.shipVelY * 0.5;
    }
}

function completeDocking(speed: number): void {
    if (!gameState.currentPort || !gameState.currentShip) return;
    
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

function dockingControl(action: string): void {
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
}

function cancelNavigation(): void {
    gameState.navigating = false;
    showScreen('game-screen');
}

function showCargo(): void {
    const content = document.getElementById('action-content');
    if (!content || !gameState.currentShip || !gameState.currentPort) return;
    
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

function buyCargo(cargoId: string): void {
    if (!gameState.currentShip || !gameState.currentPort) return;
    
    const ship = gameState.currentShip;
    const port = gameState.currentPort;
    const qtyInput = document.getElementById(`qty-${cargoId}`) as HTMLInputElement;
    const qty = parseInt(qtyInput?.value || '0') || 0;
    
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

function sellCargo(cargoId: string): void {
    if (!gameState.currentShip || !gameState.currentPort) return;
    
    const ship = gameState.currentShip;
    const port = gameState.currentPort;
    const qtyInput = document.getElementById(`qty-${cargoId}`) as HTMLInputElement;
    const qty = parseInt(qtyInput?.value || '0') || 0;
    const onShip = ship.cargo[cargoId] || 0;
    
    if (qty <= 0 || qty > onShip) return;
    
    const revenue = qty * cargoMarket[port.id][cargoId].sellPrice;
    gameState.company.cash += revenue;
    ship.cargo[cargoId] -= qty;
    
    if (ship.cargo[cargoId] === 0) delete ship.cargo[cargoId];
    
    updateDisplay();
    showCargo();
}

function updateCargoMarket(): void {
    PORTS.forEach(port => {
        CARGO_TYPES.forEach(cargo => {
            const variance = 0.8 + Math.random() * 0.4;
            cargoMarket[port.id][cargo.id].buyPrice = Math.round(cargo.basePrice * variance);
            cargoMarket[port.id][cargo.id].sellPrice = Math.round(cargo.basePrice * variance * 1.2);
        });
    });
}

function showMarketAnalysis(): void {
    const content = document.getElementById('action-content');
    if (!content || !gameState.currentShip || !gameState.currentPort) return;
    
    // Calculate all profitable trade routes
    const tradeOpportunities: TradeOpportunity[] = [];
    
    CARGO_TYPES.forEach(cargo => {
        let lowestBuyPrice = Infinity;
        let lowestBuyPort: Port | undefined;
        let highestSellPrice = -Infinity;
        let highestSellPort: Port | undefined;
        
        PORTS.forEach(port => {
            const buyPrice = cargoMarket[port.id][cargo.id].buyPrice;
            const sellPrice = cargoMarket[port.id][cargo.id].sellPrice;
            
            if (buyPrice < lowestBuyPrice) {
                lowestBuyPrice = buyPrice;
                lowestBuyPort = port;
            }
            
            if (sellPrice > highestSellPrice) {
                highestSellPrice = sellPrice;
                highestSellPort = port;
            }
        });
        
        if (lowestBuyPort !== undefined && highestSellPort !== undefined && 
            lowestBuyPort.id !== highestSellPort.id && gameState.currentShip) {
            const profitPerTon = highestSellPrice - lowestBuyPrice;
            const distance = calculateDistance(lowestBuyPort, highestSellPort);
            const fuelCost = Math.round(distance / gameState.currentShip.speed * gameState.currentShip.fuelConsumption * 2);
            const netProfitPerTon = profitPerTon - (fuelCost / gameState.currentShip.capacity);
            const profitMargin = ((profitPerTon / lowestBuyPrice) * 100).toFixed(1);
            
            tradeOpportunities.push({
                cargo: cargo.name,
                buyPort: lowestBuyPort.name,
                buyPrice: lowestBuyPrice,
                sellPort: highestSellPort.name,
                sellPrice: highestSellPrice,
                profitPerTon: profitPerTon,
                netProfitPerTon: Math.round(netProfitPerTon),
                profitMargin: profitMargin,
                distance: Math.round(distance),
                fuelCost: fuelCost,
                isCurrentPort: lowestBuyPort.id === gameState.currentPort!.id
            });
        }
    });
    
    tradeOpportunities.sort((a, b) => b.netProfitPerTon - a.netProfitPerTon);
    
    let html = '<h2>📊 Market Analysis</h2>';
    html += `<p><strong>Date:</strong> ${gameState.currentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric', day: 'numeric' })}</p>`;
    html += `<p><strong>Analysis:</strong> Best trading opportunities across all ports (accounting for fuel costs)</p>`;
    html += '<div style="margin: 10px 0; padding: 10px; background: rgba(0,0,0,0.3); border: 2px solid #ff8800;">';
    html += '<p style="margin: 5px 0;">💡 <strong>Strategy Tips:</strong></p>';
    html += '<p style="margin: 5px 0; font-size: 12px;">• Routes marked with ⭐ start from your current port</p>';
    html += '<p style="margin: 5px 0; font-size: 12px;">• Net profit already subtracts fuel costs</p>';
    html += '<p style="margin: 5px 0; font-size: 12px;">• Higher profit margins mean better returns on investment</p>';
    html += '</div>';
    
    html += '<table><tr><th>Rank</th><th>Cargo</th><th>Buy At</th><th>Sell At</th><th>Buy Price</th><th>Sell Price</th>';
    html += '<th>Gross Profit/ton</th><th>Fuel Cost</th><th>Net Profit/ton</th><th>Margin</th><th>Distance</th></tr>';
    
    tradeOpportunities.slice(0, 10).forEach((opp, index) => {
        const rowClass = opp.isCurrentPort ? 'style="background: rgba(0,255,0,0.1);"' : '';
        const star = opp.isCurrentPort ? '⭐ ' : '';
        const profitColor = opp.netProfitPerTon > 50 ? '#00ff00' : opp.netProfitPerTon > 20 ? '#ffff00' : '#ff8800';
        
        html += `<tr ${rowClass}>`;
        html += `<td><strong>${index + 1}</strong></td>`;
        html += `<td>${star}${opp.cargo}</td>`;
        html += `<td style="color: #00ccff">${opp.buyPort}</td>`;
        html += `<td style="color: #00ccff">${opp.sellPort}</td>`;
        html += `<td style="color: #ff6600">$${opp.buyPrice}</td>`;
        html += `<td style="color: #00ff00">$${opp.sellPrice}</td>`;
        html += `<td style="color: ${profitColor}"><strong>$${opp.profitPerTon}</strong></td>`;
        html += `<td style="color: #ff6600">$${opp.fuelCost}</td>`;
        html += `<td style="color: ${profitColor}"><strong>$${opp.netProfitPerTon}</strong></td>`;
        html += `<td style="color: ${profitColor}">${opp.profitMargin}%</td>`;
        html += `<td>${opp.distance} nm</td>`;
        html += '</tr>';
    });
    
    html += '</table>';
    
    html += '<h3 style="margin-top: 20px;">🎯 Opportunities from ' + gameState.currentPort!.name + '</h3>';
    const currentPortOpps = tradeOpportunities.filter(opp => opp.isCurrentPort).slice(0, 5);
    
    if (currentPortOpps.length > 0) {
        html += '<div style="margin-top: 10px;">';
        currentPortOpps.forEach((opp, index) => {
            html += `<div style="padding: 8px; margin: 5px 0; background: rgba(255,136,0,0.2); border-left: 3px solid #ff8800;">`;
            html += `<strong>${index + 1}. ${opp.cargo}</strong> → ${opp.sellPort}<br>`;
            html += `<span style="font-size: 12px;">Buy: $${opp.buyPrice} | Sell: $${opp.sellPrice} | Net Profit: <span style="color: #00ff00">$${opp.netProfitPerTon}/ton</span> (${opp.profitMargin}% margin)</span>`;
            html += `</div>`;
        });
        html += '</div>';
    } else {
        html += '<p>No highly profitable routes from this port. Consider navigating elsewhere!</p>';
    }
    
    content.innerHTML = html;
}

function refuelShip(): void {
    if (!gameState.currentShip) return;
    
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

function repairShip(): void {
    if (!gameState.currentShip) return;
    
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

function showShipyard(): void {
    const content = document.getElementById('action-content');
    if (!content) return;
    
    let html = '<h2>🚢 Shipyard</h2>';
    html += '<p>Purchase additional ships to expand your fleet:</p>';
    html += '<table><tr><th>Ship Type</th><th>Cost</th><th>Capacity</th><th>Speed</th><th>Fuel Cap</th><th>Action</th></tr>';
    
    Object.entries(SHIP_TYPES).forEach(([key, shipType]) => {
        html += '<tr>';
        html += `<td>${shipType.name}</td>`;
        html += `<td>$${shipType.cost.toLocaleString()}</td>`;
        html += `<td>${shipType.capacity} tons</td>`;
        html += `<td>${shipType.speed} knots</td>`;
        html += `<td>${shipType.fuelCapacity}</td>`;
        html += `<td><button class="amiga-btn small" onclick="buyShip('${key}')">BUY</button></td>`;
        html += '</tr>';
    });
    
    html += '</table>';
    content.innerHTML = html;
}

function buyShip(shipType: string): void {
    const type = SHIP_TYPES[shipType];
    if (!type || !gameState.currentPort) return;
    
    if (gameState.company.cash < type.cost) {
        showMessage('Error', 'Not enough cash!');
        return;
    }
    
    gameState.company.cash -= type.cost;
    
    const newShip: Ship = {
        id: `ship${gameState.ships.length + 1}`,
        name: `SS ${type.name} ${gameState.ships.length + 1}`,
        type: shipType as any,
        fuel: type.fuelCapacity,
        fuelCapacity: type.fuelCapacity,
        fuelConsumption: type.fuelConsumption,
        capacity: type.capacity,
        speed: type.speed,
        condition: 100,
        cargo: {},
        currentPort: gameState.currentPort
    };
    
    gameState.ships.push(newShip);
    updateDisplay();
    showMessage('Ship Purchased!', `You bought a ${type.name}!`);
    showShipyard();
}

function showFinances(): void {
    const content = document.getElementById('action-content');
    if (!content) return;
    
    let html = '<h2>💰 Financial Report</h2>';
    html += `<p><strong>Company:</strong> ${gameState.company.name}</p>`;
    html += `<p><strong>Founded:</strong> ${gameState.company.founded.toLocaleDateString()}</p>`;
    html += `<p><strong>Current Date:</strong> ${gameState.currentDate.toLocaleDateString()}</p>`;
    html += '<h3>Assets</h3>';
    html += '<table><tr><th>Asset</th><th>Value</th></tr>';
    html += `<tr><td>Cash</td><td>$${gameState.company.cash.toLocaleString()}</td></tr>`;
    
    let totalShipValue = 0;
    gameState.ships.forEach(ship => {
        const value = SHIP_TYPES[ship.type].cost * (ship.condition / 100);
        totalShipValue += value;
        html += `<tr><td>${ship.name}</td><td>$${Math.round(value).toLocaleString()}</td></tr>`;
    });
    
    const totalAssets = gameState.company.cash + totalShipValue;
    html += `<tr style="border-top: 2px solid #ff8800;"><td><strong>Total Assets</strong></td><td><strong>$${totalAssets.toLocaleString()}</strong></td></tr>`;
    html += '</table>';
    
    if (totalAssets >= 1000000) {
        html += '<div style="margin-top: 20px; padding: 15px; background: rgba(0,255,0,0.2); border: 3px solid #00ff00;">';
        html += '<h2>🎉 CONGRATULATIONS! 🎉</h2>';
        html += '<p>You have reached $1,000,000 in assets!</p>';
        html += '<p>You are a Maritime Trading Master!</p>';
        html += '</div>';
    }
    
    content.innerHTML = html;
}

// Keyboard controls
document.addEventListener('keydown', (e: KeyboardEvent) => {
    const dockingScreen = document.getElementById('docking');
    if (dockingScreen?.classList.contains('active')) {
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

// Make functions globally accessible
(window as any).startNewGame = startNewGame;
(window as any).showInstructions = showInstructions;
(window as any).showMainMenu = showMainMenu;
(window as any).initializeGame = initializeGame;
(window as any).showMap = showMap;
(window as any).navigateToPort = navigateToPort;
(window as any).showCargo = showCargo;
(window as any).buyCargo = buyCargo;
(window as any).sellCargo = sellCargo;
(window as any).showMarketAnalysis = showMarketAnalysis;
(window as any).refuelShip = refuelShip;
(window as any).repairShip = repairShip;
(window as any).showShipyard = showShipyard;
(window as any).buyShip = buyShip;
(window as any).showFinances = showFinances;
(window as any).dockingControl = dockingControl;
(window as any).cancelNavigation = cancelNavigation;
(window as any).manualDocking = manualDocking;
(window as any).hirePilot = hirePilot;
(window as any).closeMessage = closeMessage;
