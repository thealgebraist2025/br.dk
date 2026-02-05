# Ports of Call - TypeScript Edition

A maritime trading simulator game built with TypeScript, featuring realistic ship physics and economic simulation.

## 🚢 Features

- **TypeScript Implementation**: Fully typed codebase with strict type checking
- **Realistic Ship Physics**: Force-based physics simulation for docking
- **Economic Simulation**: Dynamic cargo markets across 12 world ports
- **Fleet Management**: Buy and manage multiple ships
- **Market Analysis**: AI-powered trading recommendations
- **Harbor Pilot Option**: Auto-docking for convenience

## 📦 Project Structure

```
src/
├── types.ts       - TypeScript type definitions
├── constants.ts   - Game constants (ports, ships, cargo types)
└── game.ts        - Main game logic
dist/
└── game.js        - Compiled JavaScript (generated)
```

## 🛠️ Development

### Prerequisites
- Node.js (v16 or higher)
- npm

### Installation

```bash
npm install
```

### Build

```bash
npm run build
```

### Development Mode (Watch)

```bash
npm run watch
```

### Clean Build

```bash
npm run clean
npm run build
```

## 🎮 How to Play

1. Open `ports-of-call-ts.html` in a web browser
2. Start a new game and name your company
3. Trade cargo between ports to make profit
4. Use the Market Analysis tool (📊) to find best opportunities
5. Dock your ship manually or hire a harbor pilot
6. Expand your fleet and reach $1,000,000!

## 🎯 Game Mechanics

### Trading
- Buy low, sell high across 12 global ports
- 8 different cargo types with dynamic pricing
- Fuel costs affect profitability

### Ship Docking
- **Manual Docking**: Realistic physics simulation
  - Control engines, rudder, and bow thrusters
  - Account for momentum, drag, and inertia
  - Perfect landings give best rewards
  
- **Harbor Pilot**: Pay 1% of ship value for auto-dock

### Fleet Management
- 4 ship types: Coastal Freighter, Bulk Carrier, Container Ship, Oil Tanker
- Manage fuel, repairs, and cargo capacity
- Random events: storms, pirates

## 🔧 TypeScript Configuration

The project uses strict TypeScript settings:
- `strict: true` - All strict type-checking options enabled
- `noImplicitAny: true` - No implicit 'any' types
- `strictNullChecks: true` - Strict null checking
- `noUnusedLocals: true` - Error on unused variables
- `noUnusedParameters: true` - Error on unused parameters

## 📊 Type Safety Benefits

- **Compile-time error detection**: Catch bugs before runtime
- **Better IDE support**: IntelliSense and auto-completion
- **Safer refactoring**: TypeScript ensures type consistency
- **Self-documenting code**: Types serve as inline documentation

## 🎨 Original JavaScript Version

The original JavaScript version is available as:
- `ports-of-call.html`
- `ports-of-call.js`
- `ports-of-call.css`

Both versions share the same CSS and are functionally identical.

## 📝 License

MIT

## 🙏 Credits

Inspired by the classic Amiga game "Ports of Call" (1986)
