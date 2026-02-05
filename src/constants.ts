// Constants for Ports of Call game

interface Port {
    id: string;
    name: string;
    x: number;
    y: number;
    region: string;
}

interface ShipType {
    name: string;
    cost: number;
    capacity: number;
    speed: number;
    fuelCapacity: number;
    fuelConsumption: number;
}

interface CargoType {
    id: string;
    name: string;
    basePrice: number;
}

const SHIP_TYPES: Record<string, ShipType> = {
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

const PORTS: Port[] = [
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

const CARGO_TYPES: CargoType[] = [
    { id: 'oil', name: 'Crude Oil', basePrice: 50 },
    { id: 'grain', name: 'Grain', basePrice: 30 },
    { id: 'coal', name: 'Coal', basePrice: 40 },
    { id: 'iron', name: 'Iron Ore', basePrice: 35 },
    { id: 'containers', name: 'Containers', basePrice: 80 },
    { id: 'chemicals', name: 'Chemicals', basePrice: 100 },
    { id: 'machinery', name: 'Machinery', basePrice: 120 },
    { id: 'electronics', name: 'Electronics', basePrice: 150 }
];

const COMPETITOR_NAMES: string[] = [
    'Global Shipping Co.',
    'Pacific Marine Lines',
    'Atlantic Freight Inc.',
    'Orient Express Cargo',
    'Nordic Sea Transport',
    'Mediterranean Traders',
    'Cape Horn Shipping',
    'Baltic Maritime Group',
    'Caribbean Cargo Lines',
    'Indian Ocean Traders'
];
