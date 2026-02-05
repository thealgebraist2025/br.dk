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

function startDocking() {
    const canvas = document.getElementById('dock-canvas');
    const ctx = canvas.getContext('2d');
    
    let shipX = 50;
    let shipY = 200;
    let shipSpeed = 3;
    const dockX = 550;
    const dockY = 200;
    
    let dockingInterval = setInterval(() => {
        // Clear canvas
        ctx.fillStyle = '#001133';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw dock
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(dockX - 10, 0, 30, canvas.height);
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(dockX - 15, dockY - 20, 40, 40);
        
        // Draw ship
        ctx.fillStyle = '#666';
        ctx.fillRect(shipX, shipY - 15, 80, 30);
        ctx.fillStyle = '#444';
        ctx.fillRect(shipX + 30, shipY - 25, 20, 10);
        
        // Move ship
        if (shipSpeed > 0 && shipX < dockX - 90) {
            shipX += shipSpeed;
        }
        
        // Update display
        document.getElementById('dock-speed').textContent = shipSpeed.toFixed(1);
        document.getElementById('dock-distance').textContent = Math.max(0, Math.round(dockX - shipX - 90));
        
        // Check docking
        if (shipX >= dockX - 95) {
            clearInterval(dockingInterval);
            
            if (shipSpeed > 2) {
                gameState.currentShip.condition -= 20;
                showMessage('Hard Docking!', 'You docked too fast! Ship condition reduced by 20%.');
            } else {
                showMessage('Docked Successfully!', `Welcome to ${gameState.currentPort.name}!`);
            }
            
            showScreen('game-screen');
            updateDisplay();
        }
    }, 50);
    
    window.dockingControl = function(action) {
        if (action === 'left') shipY -= 5;
        if (action === 'right') shipY += 5;
        if (action === 'slow') shipSpeed = Math.max(0, shipSpeed - 0.5);
        if (action === 'stop') shipSpeed = 0;
        if (action === 'go') shipSpeed = Math.min(5, shipSpeed + 0.5);
    };
}

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
        if (e.key === 'ArrowLeft') dockingControl('left');
        if (e.key === 'ArrowRight') dockingControl('right');
        if (e.key === 'ArrowDown') dockingControl('slow');
        if (e.key === 'ArrowUp') dockingControl('go');
        if (e.key === ' ') dockingControl('stop');
    }
});

// Adjust navigation controls
function adjustSpeed(delta) {
    // Placeholder for speed adjustment during navigation
}

function adjustCourse(delta) {
    // Placeholder for course adjustment during navigation
}
