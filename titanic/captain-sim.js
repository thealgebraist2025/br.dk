let currentScene = 'start';
let gameState = {
    passengers: 2224,
    speed: 22,
    shipStatus: 'Sailing',
    icebergWarnings: 0,
    lookoutQuality: 'good'
};

const scenes = {
    start: {
        image: 'titanic_images/start.png',
        text: "April 14, 1912 - 11:00 PM. You are Captain Edward J. Smith, commanding the magnificent RMS Titanic on her maiden voyage. The night is calm and unusually cold. You've received several ice warnings throughout the day. The ship is making excellent time at 22 knots. What are your orders?",
        choices: [
            { text: "Maintain full speed - we have a schedule to keep", next: 'fullSpeed' },
            { text: "Reduce speed to 18 knots as a precaution", next: 'reducedSpeed' },
            { text: "Order extra lookouts and maintain speed", next: 'extraLookouts' }
        ]
    },
    
    fullSpeed: {
        image: 'titanic_images/fullSpeed.png',
        text: "You order the engines to maintain full speed. The Titanic cuts through the dark waters at 22 knots. At 11:40 PM, the lookout Frederick Fleet spots something ahead. 'ICEBERG, RIGHT AHEAD!' he shouts down the telephone.",
        choices: [
            { text: "Hard to starboard! Reverse engines!", next: 'hardTurn' },
            { text: "Hard to port! Full speed ahead to swing the stern!", next: 'portTurn' }
        ],
        logEntry: "Maintained full speed despite ice warnings"
    },
    
    reducedSpeed: {
        image: 'titanic_images/reducedSpeed.png',
        text: "You wisely reduce speed to 18 knots. Some passengers complain about the delay, but safety is paramount. At 11:50 PM, a lookout spots an iceberg ahead - with the reduced speed, you have more time to react.",
        choices: [
            { text: "Hard to starboard and reverse engines", next: 'avoidedEarly' },
            { text: "Maintain course and pass the iceberg at a safe distance", next: 'safePassing' }
        ],
        logEntry: "Reduced speed to 18 knots as precaution"
    },
    
    extraLookouts: {
        image: 'titanic_images/extraLookouts.png',
        text: "You post extra lookouts on the bow and bridge wings while maintaining speed. At 11:40 PM, multiple lookouts simultaneously spot an iceberg dead ahead, giving slightly more warning time than usual.",
        choices: [
            { text: "Emergency hard to starboard!", next: 'betterWarning' },
            { text: "Stop all engines and turn hard!", next: 'stopAndTurn' }
        ],
        logEntry: "Posted extra lookouts while maintaining speed"
    },
    
    hardTurn: {
        image: 'titanic_images/hardTurn.png',
        text: "First Officer Murdoch orders 'Hard to starboard!' The ship begins to turn, but at 22 knots, it's not fast enough. The iceberg scrapes along the starboard side, opening the hull below the waterline. Water begins flooding the forward compartments.",
        choices: [
            { text: "Assess the damage immediately", next: 'assessDamage' }
        ],
        logEntry: "Collision with iceberg - starboard side damaged"
    },
    
    portTurn: {
        image: 'titanic_images/portTurn.png',
        text: "You order a port turn to swing the stern away. The bow narrowly misses the iceberg, but the stern clips it, damaging the propellers and flooding the aft compartments. The ship is taking on water.",
        choices: [
            { text: "Check the damage", next: 'sternDamage' }
        ],
        logEntry: "Collision with iceberg - stern damaged"
    },
    
    avoidedEarly: {
        image: 'titanic_images/avoidedEarly.png',
        text: "Thanks to the reduced speed, the ship responds better to the helm. The Titanic turns gracefully and the iceberg passes harmlessly down the port side, barely 100 feet away. The passengers cheer at the sight.",
        choices: [
            { text: "Continue the voyage", next: 'survivalGood' }
        ],
        logEntry: "Successfully avoided iceberg due to reduced speed"
    },
    
    safePassing: {
        image: 'titanic_images/safePassing.png',
        text: "With careful navigation and reduced speed, you guide the Titanic past the iceberg at a safe distance. The ship continues smoothly toward New York. Your cautious approach has saved everyone aboard.",
        choices: [
            { text: "Complete the maiden voyage", next: 'survivalGreat' }
        ],
        logEntry: "Safely navigated past iceberg threat"
    },
    
    betterWarning: {
        image: 'titanic_images/betterWarning.png',
        text: "The extra lookouts provide crucial seconds of warning. The ship begins turning earlier, but still strikes the iceberg with a glancing blow. Three compartments are breached - serious, but the ship might survive.",
        choices: [
            { text: "Evaluate if we can reach port", next: 'partialDamage' }
        ],
        logEntry: "Glancing collision - three compartments breached"
    },
    
    stopAndTurn: {
        image: 'titanic_images/stopAndTurn.png',
        text: "You order all engines stopped and hard to starboard. The massive ship slows significantly while turning. The bow just barely scrapes the iceberg, causing minor damage to only two compartments. The ship can float with four compartments flooded.",
        choices: [
            { text: "Proceed to nearest port for repairs", next: 'survivalMinor' }
        ],
        logEntry: "Minor collision - two compartments damaged"
    },
    
    assessDamage: {
        image: 'titanic_images/assessDamage.png',
        text: "Thomas Andrews, the ship's designer, reports that six compartments are flooding. The ship can float with four flooded, but not six. The Titanic will sink in approximately 2 hours. There are only lifeboats for 1,178 people, but 2,224 souls aboard.",
        choices: [
            { text: "Order evacuation - women and children first", next: 'historicalEnd' }
        ],
        logEntry: "Fatal damage confirmed - ship is sinking"
    },
    
    sternDamage: {
        image: 'titanic_images/sternDamage.png',
        text: "The stern damage is severe - four aft compartments are flooding and the propellers are damaged. However, the bow compartments are intact. The ship is listing but Andrews believes she can stay afloat if pumps work continuously.",
        choices: [
            { text: "Make for the nearest port with all possible speed", next: 'survivalDamaged' }
        ],
        logEntry: "Stern damage - attempting to reach port"
    },
    
    partialDamage: {
        image: 'titanic_images/partialDamage.png',
        text: "With only three compartments flooded, the Titanic can stay afloat. Andrews calculates that the pumps can handle the water intake if you proceed slowly. Halifax is 400 miles away.",
        choices: [
            { text: "Signal for escort and proceed to Halifax", next: 'survivalPartial' }
        ],
        logEntry: "Ship damaged but stable - proceeding to Halifax"
    },
    
    survivalGood: {
        outcome: true,
        image: 'titanic_images/survivalGood.png',
        title: "⭐ EXCELLENT SEAMANSHIP ⭐",
        text: "Your cautious decision to reduce speed saved the Titanic and all 2,224 souls aboard. The ship completes her maiden voyage to New York, arriving one day late but safely. You are celebrated as a prudent captain who put safety above schedules. The Titanic goes on to serve for many years, and maritime safety protocols are established based on your example.",
        survivors: 2224
    },
    
    survivalGreat: {
        outcome: true,
        image: 'titanic_images/survivalGreat.png',
        title: "🏆 PERFECT NAVIGATION 🏆",
        text: "Your expert seamanship and wise decision-making have saved the Titanic and everyone aboard. The ship arrives in New York to tremendous fanfare. You are hailed as the greatest captain of your generation, and the White Star Line awards you their highest honors. The Titanic becomes the most successful ocean liner in history.",
        survivors: 2224
    },
    
    survivalMinor: {
        outcome: true,
        image: 'titanic_images/survivalMinor.png',
        title: "⚓ CRISIS AVERTED ⚓",
        text: "Your quick thinking and the extra lookouts prevented disaster. The Titanic limps to Halifax for repairs with minor damage. All 2,224 passengers and crew are safe. While the maiden voyage didn't go as planned, your leadership under pressure is widely praised. After repairs, the Titanic continues her service, and new regulations about lookouts in ice fields are implemented.",
        survivors: 2224
    },
    
    survivalPartial: {
        outcome: true,
        image: 'titanic_images/survivalPartial.png',
        title: "🌊 NARROW ESCAPE 🌊",
        text: "Through skillful damage control and careful navigation, you manage to bring the wounded Titanic to Halifax. All 2,224 souls are saved, though the ship requires extensive repairs. The incident leads to major improvements in ship design and safety regulations. You are commended for your leadership in crisis, though criticized for not reducing speed earlier.",
        survivors: 2224
    },
    
    survivalDamaged: {
        outcome: true,
        image: 'titanic_images/survivalDamaged.png',
        title: "⚓ DAMAGED BUT AFLOAT ⚓",
        text: "The Titanic makes it to St. John's, Newfoundland, with all passengers safe. The stern damage is severe and repairs take months, but everyone survives. Your unconventional decision to turn to port, while causing damage, avoided the fatal bow collision. Maritime experts debate your choice for years, but you saved 2,224 lives.",
        survivors: 2224
    },
    
    historicalEnd: {
        outcome: true,
        image: 'titanic_images/historicalEnd.png',
        title: "⚓ THE HISTORICAL TRAGEDY ⚓",
        text: "Despite your best efforts, the Titanic sinks at 2:20 AM on April 15, 1912. The evacuation is chaotic, hampered by insufficient lifeboats and the 'unsinkable' myth. Approximately 1,500 people perish in the freezing Atlantic waters. The disaster leads to major maritime safety reforms, including sufficient lifeboats for all, 24-hour radio watches, and the International Ice Patrol. The tragedy becomes one of the most famous maritime disasters in history.",
        survivors: 710
    }
};

function startGame() {
    currentScene = 'start';
    gameState = {
        passengers: 2224,
        speed: 22,
        shipStatus: 'Sailing',
        icebergWarnings: 0
    };
    document.getElementById('log').innerHTML = '';
    updateDisplay();
}

function updateDisplay() {
    const scene = scenes[currentScene];
    
    document.getElementById('ship-status').textContent = gameState.shipStatus;
    document.getElementById('passengers').textContent = gameState.passengers.toLocaleString();
    document.getElementById('speed').textContent = gameState.speed + ' knots';
    
    const sceneImg = document.getElementById('scene-img');
    sceneImg.src = scene.image;
    sceneImg.alt = 'Scene image';
    
    document.getElementById('narrative-text').textContent = scene.text;
    
    if (scene.logEntry) {
        addLogEntry(scene.logEntry);
    }
    
    const choicesDiv = document.getElementById('choices');
    const outcomeDiv = document.getElementById('outcome');
    
    if (scene.outcome) {
        choicesDiv.style.display = 'none';
        outcomeDiv.style.display = 'block';
        document.getElementById('outcome-title').textContent = scene.title;
        document.getElementById('outcome-text').textContent = scene.text + `\n\nSurvivors: ${scene.survivors.toLocaleString()} of 2,224`;
        
        if (scene.survivors === 2224) {
            outcomeDiv.style.background = 'rgba(0, 255, 0, 0.2)';
        } else {
            outcomeDiv.style.background = 'rgba(255, 0, 0, 0.2)';
        }
    } else {
        choicesDiv.style.display = 'flex';
        outcomeDiv.style.display = 'none';
        
        choicesDiv.innerHTML = '';
        scene.choices.forEach(choice => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.textContent = choice.text;
            btn.onclick = () => makeChoice(choice.next);
            choicesDiv.appendChild(btn);
        });
    }
}

function makeChoice(nextScene) {
    currentScene = nextScene;
    
    if (nextScene.includes('reduced') || nextScene.includes('Slow')) {
        gameState.speed = 18;
    }
    
    if (nextScene.includes('Damage') || nextScene.includes('damage') || nextScene.includes('collision')) {
        gameState.shipStatus = 'Damaged';
    }
    
    updateDisplay();
}

function addLogEntry(text) {
    const log = document.getElementById('log');
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    
    const time = new Date().toLocaleTimeString();
    entry.innerHTML = `<span class="time">${time}</span>${text}`;
    
    log.insertBefore(entry, log.firstChild);
}

function restartGame() {
    startGame();
}

window.onload = startGame;
