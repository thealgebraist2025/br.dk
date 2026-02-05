// Type definitions for Ports of Call game

export interface Port {
    id: string;
    name: string;
    x: number;
    y: number;
    region: string;
}

export interface ShipType {
    name: string;
    cost: number;
    capacity: number;
    speed: number;
    fuelCapacity: number;
    fuelConsumption: number;
}

export interface Ship {
    id: string;
    name: string;
    type: 'coastal' | 'bulk' | 'container' | 'tanker';
    fuel: number;
    fuelCapacity: number;
    fuelConsumption: number;
    capacity: number;
    speed: number;
    condition: number;
    cargo: Record<string, number>;
    currentPort: Port;
}

export interface Company {
    name: string;
    cash: number;
    founded: Date;
}

export interface GameState {
    company: Company;
    currentDate: Date;
    currentShip: Ship | null;
    ships: Ship[];
    currentPort: Port | null;
    navigating: boolean;
    navigationTarget: Port | null;
}

export interface CargoType {
    id: string;
    name: string;
    basePrice: number;
}

export interface CargoMarketData {
    buyPrice: number;
    sellPrice: number;
    demand: number;
}

export type CargoMarket = Record<string, Record<string, CargoMarketData>>;

export interface DockingState {
    phase: number;
    shipX: number;
    shipY: number;
    shipVelX: number;
    shipVelY: number;
    shipAngle: number;
    shipAngularVel: number;
    enginePower: number;
    targetEnginePower: number;
    rudderAngle: number;
    bowThruster: number;
    sternThruster: number;
    damage: number;
    dockX: number;
    dockY: number;
    mass: number;
    momentOfInertia: number;
    length: number;
    width: number;
    linearDrag: number;
    angularDrag: number;
    lateralDrag: number;
    maxEngineForce: number;
    engineResponseTime: number;
    rudderForce: number;
    thrusterForce: number;
    currentX: number;
    currentY: number;
    windX: number;
    windY: number;
}

export interface TradeOpportunity {
    cargo: string;
    buyPort: string;
    buyPrice: number;
    sellPort: string;
    sellPrice: number;
    profitPerTon: number;
    netProfitPerTon: number;
    profitMargin: string;
    distance: number;
    fuelCost: number;
    isCurrentPort: boolean;
}
