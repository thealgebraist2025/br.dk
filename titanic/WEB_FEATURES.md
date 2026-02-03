# 🎮 Titanic Simulator - Web Version Features

## ✨ Complete Visual Integration

The web version now includes **full graphics integration** with AI-generated imagery!

### 🖼️ Visual Assets

#### Available Now (30 images):
- **Logo**: Art Deco RMS Titanic emblem in header
- **Captain Portraits** (4): Confident, Worried, Desperate, Victorious
- **Victory Endings** (3): Harbor arrival, celebration, newspaper headline
- **Defeat Endings** (4): Sinking ship, lifeboats, memorial, underwater wreck
- **Weather Icons** (4): Calm, cloudy, fog, storm
- **Storyline 1 - Classic Iceberg** (8/8 stages): Complete! ✅
- **Storyline 2 - Coal Crisis** (7/8 stages): Nearly complete! 🔄

#### Coming Soon (113 more images generating):
- Storylines 3-16 (8 stages each)

---

## 📚 16 Selectable Storylines

Use the dropdown menu in the header to choose your disaster scenario:

1. **Classic Iceberg Encounter** ✅ *All 8 images available*
2. **Coal Depletion Emergency** 🔄 *7/8 images available*
3. **North Atlantic Storm** ⏳
4. **Engine Room Fire** ⏳
5. **Lost in the Fog** ⏳
6. **Hull Integrity Failure** ⏳
7. **Crew Mutiny Crisis** ⏳
8. **Vanishing in the Atlantic** ⏳
9. **Disease Outbreak at Sea** ⏳
10. **U-Boat Encounter** ⏳
11. **Failed Rescue Attempt** ⏳
12. **Maelstrom Encounter** ⏳
13. **Electrical Storm Catastrophe** ⏳
14. **Monster Wave Impact** ⏳
15. **Internal Sabotage Plot** ⏳
16. **Multiple Cascading Failures** ⏳

Each storyline has 8 progressive stages from departure to disaster/victory.

---

## 🎭 Dynamic Captain Portraits

The captain's portrait changes based on game state:

- **Confident** 😊 - Good conditions, high morale, smooth sailing
- **Worried** 😟 - Moderate damage, low morale, or challenges ahead
- **Desperate** 😱 - Critical hull damage, severe flooding, imminent doom
- **Victorious** 🎉 - Successfully reached New York Harbor!

Portrait updates every 5 seconds based on:
- Hull integrity
- Water level  
- Crew morale
- Game outcome

---

## 🌤️ Weather System

Real-time weather affects gameplay and is visualized:

- **Weather Icon**: Shows current conditions (top-right of visual panel)
- **4 Conditions**:
  - **Calm** ☀️ - 95-100% visibility, optimal navigation
  - **Cloudy** ☁️ - 70-90% visibility, slight challenges
  - **Fog** 🌫️ - 40-70% visibility, difficult navigation
  - **Storm** ⛈️ - 30-50% visibility, dangerous conditions

Weather changes every 30 seconds and affects:
- Ship speed multiplier
- Iceberg visibility
- Navigation difficulty

---

## 🏆 Victory & Defeat Screens

### Victory (Rare but Possible!)
- **Condition**: Reach New York (< 0.5 degrees from harbor)
- **Visuals**: Random victory image (3 options)
- **Caption**: "Against all odds, the vessel reached New York Harbor safely!"
- **Portrait**: Victorious captain
- **Title**: "🎉 IMPOSSIBLE VICTORY! 🎉" (in green)

### Defeat (Historically Accurate)
- **Conditions**: Hull failure, flooding, doom timer, coal depletion
- **Visuals**: Random defeat image (4 options)
- **Portraits**: Desperate captain
- **Title**: "⚓ VESSEL LOST ⚓"
- **Statistics**: Time survived, distance traveled, icebergs avoided

---

## 🎮 Controls

### Keyboard Shortcuts
- **SPACE** - Shovel coal to random furnace (instant)
- **R** - Use repair kit (3 available, restores 20% hull + reduces water)
- **M** - Boost crew morale (inspirational speech)

### Mouse Controls
- **Click Furnaces** - Shovel coal to specific furnace
- **Dropdown Menu** - Change storyline scenario

---

## 📊 Visual Panel Layout

```
┌─────────────────────────────────────────────┐
│  [Captain]   [Storyline Image & Text]   [⛅]│
│   Portrait          200x600          Weather│
│   120x120                             60x60 │
└─────────────────────────────────────────────┘
```

- **Left**: Captain portrait showing current mood
- **Center**: Storyline progression image with stage description
- **Right**: Weather condition indicator

---

## 🎨 Storyline Progression

Storylines auto-advance through 8 stages based on doom counter:

1. **Stage 1** (0-12.5%): Departure - All systems nominal
2. **Stage 2** (12.5-25%): Early voyage - Crew vigilant
3. **Stage 3** (25-37.5%): First signs of trouble emerge
4. **Stage 4** (37.5-50%): Situation worsening rapidly
5. **Stage 5** (50-62.5%): Critical emergency declared
6. **Stage 6** (62.5-75%): Multiple system failures
7. **Stage 7** (75-87.5%): Evacuation procedures initiated
8. **Stage 8** (87.5-100%): Final moments - Inevitable doom

Each stage displays a unique AI-generated image showing the unfolding disaster.

---

## 🚀 Play Now

Open **simulator.html** in your browser and:

1. Select your storyline from dropdown
2. Start shoveling coal (SPACE or click furnaces)
3. Watch the captain's expression change
4. See the storyline unfold in images
5. Monitor weather conditions
6. Try to reach New York!

---

## 🎯 Difficulty Modes

Choose your challenge (edit code):

```javascript
game = new TitanicSimulator('easy');   // 10 min doom timer, 20 icebergs
game = new TitanicSimulator('normal'); // 5 min doom timer, 40 icebergs  
game = new TitanicSimulator('hard');   // 3.5 min doom timer, 60 icebergs
```

---

## 📈 Statistics Tracked

- **Time Survived**: How long you kept the ship afloat
- **Distance Traveled**: Nautical miles covered
- **Icebergs Avoided**: Close calls that didn't end in collision
- **Coal Used**: Fuel consumption
- **Max Speed**: Top speed achieved
- **Crew Morale**: Final crew efficiency

---

## 🔧 Technical Details

- **Image Format**: PNG, 512x512 pixels
- **Generation**: Tiny-SD on Apple Silicon MPS
- **Fallback**: Graceful degradation if images missing
- **Performance**: No FPS impact, lazy loading
- **Update Rate**:
  - Storyline: Updates when stage changes (~37.5s per stage)
  - Captain: Updates every 5 seconds  
  - Weather: Updates on weather change (~30s)
  - Ending: Shows on victory/defeat

---

## 🎊 Special Features

### C64-Style Sound Effects
- **Shovel Coal**: Chunky 80Hz square wave
- **Iceberg Collision**: Descending sawtooth crash
- **Warnings**: Pulsing 880Hz square wave
- **Sinking**: Dramatic 440Hz→55Hz descent

### Enhanced Gameplay
- **Crew Morale**: Decreases over time, affects efficiency
- **Repair Kits**: Limited emergency repairs (3 available)
- **Weather Effects**: Dynamic conditions affecting navigation
- **Doom Mechanics**: Ensures historical accuracy (usually sinks in ~5 min)
- **Achievement Potential**: Track personal bests

---

## 🌟 Future Enhancements

As more images generate:

- ✅ Complete all 16 storylines (8 stages each)
- ⏳ Storyline-specific events and challenges
- ⏳ Achievement system integration
- ⏳ Leaderboard with statistics
- ⏳ Storyline descriptions and historical context
- ⏳ Sound effects per storyline type

---

**Made with ❤️ and AI-generated imagery**  
*Experience the tragedy of 1912 with modern technology*

🚢 Good luck, Captain! ⚓
