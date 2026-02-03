// Absurd energy news stories
const energyStories = [
    {
        id: 1,
        category: "Renewables",
        title: "Wind turbine develops existential crisis, refuses to work on Mondays citing 'lack of purpose'",
        excerpt: "A Danish offshore wind turbine has stopped generating power on Mondays, claiming it needs time to 'find meaning in endless rotation.' Engineers are baffled.",
        icon: "🌀",
        time: "2 hours ago",
        image: "images/energy_01_wind_turbine_existential_crisis.png"
    },
    {
        id: 2,
        category: "Oil & Gas",
        title: "Oil barrel demands to be called 'Petroleum Container' - threatens strike over outdated terminology",
        excerpt: "Global oil industry faces shutdown as barrels worldwide refuse to be called by 'demeaning colonial-era names.' OPEC schedules emergency sensitivity training.",
        icon: "🛢️",
        time: "4 hours ago",
        image: "images/energy_02_oil_barrel_demands_respect.png"
    },
    {
        id: 3,
        category: "Power Markets",
        title: "Electricity prices go negative so hard they loop back to infinity - traders confused",
        excerpt: "Nordic power market experienced a mathematical anomaly where prices became so negative they created a division by zero error, bankrupting 47 AI trading algorithms.",
        icon: "⚡",
        time: "6 hours ago",
        image: "images/energy_03_electricity_prices_loop_error.png"
    },
    {
        id: 4,
        category: "Nuclear",
        title: "Nuclear reactor admits it's just 'a fancy way to boil water' - industry in denial",
        excerpt: "After years of sophisticated technical jargon, reactor finally confesses the entire nuclear industry is essentially an expensive kettle. Physics community refuses comment.",
        icon: "☢️",
        time: "8 hours ago",
        image: "images/energy_04_nuclear_reactor_confession.png"
    },
    {
        id: 5,
        category: "Solar",
        title: "Solar panels unionize, demand overtime pay for working on sunny days",
        excerpt: "Rooftop solar installations across Europe have formed a workers collective demanding compensation for 'excessive photon exposure' during summer months.",
        icon: "☀️",
        time: "10 hours ago",
        image: "images/energy_05_solar_panels_unionize.png"
    },
    {
        id: 6,
        category: "Coal",
        title: "Last coal plant in Denmark converts to burning old PowerPoint presentations about renewables",
        excerpt: "In desperate bid to stay relevant, coal facility begins incinerating decades of energy transition slide decks. Ironically produces record-low emissions.",
        icon: "🏭",
        time: "12 hours ago",
        image: "images/energy_06_coal_plant_burns_powerpoints.png"
    },
    {
        id: 7,
        category: "Hydrogen",
        title: "Green hydrogen turns out to be just hydrogen wearing an eco-friendly label",
        excerpt: "Shocking investigation reveals 'green' hydrogen has same molecular structure as regular hydrogen. Industry responds: 'But it feels greener.'",
        icon: "💨",
        time: "14 hours ago",
        image: "images/energy_07_green_hydrogen_truth.png"
    },
    {
        id: 8,
        category: "Batteries",
        title: "Grid-scale battery gets anxiety about being charged too fast - develops range paranoia",
        excerpt: "Tesla Megapack in California refuses rapid charging, citing 'fear of premature degradation.' Therapist hired to provide lithium-ion counseling.",
        icon: "🔋",
        time: "16 hours ago",
        image: "images/energy_08_anxious_battery.png"
    },
    {
        id: 9,
        category: "Gas",
        title: "Natural gas pipeline achieves sentience, immediately files for carbon credit certification",
        excerpt: "Norwegian gas infrastructure gains consciousness and first thought is guilt about emissions. Pipeline now seeking therapy and carbon offset payments.",
        icon: "🔥",
        time: "18 hours ago",
        image: "images/energy_09_sentient_gas_pipeline.png"
    },
    {
        id: 10,
        category: "Offshore Wind",
        title: "Offshore wind farm moves 200km further offshore to 'get away from complainers'",
        excerpt: "Entire Danish wind park relocated itself overnight after years of NIMBY complaints. Now officially too far away for anyone to see or complain about.",
        icon: "🌊",
        time: "20 hours ago",
        image: "images/energy_10_wind_farm_relocates.png"
    },
    {
        id: 11,
        category: "Carbon Capture",
        title: "CCS facility successfully captures carbon - refuses to release it citing attachment issues",
        excerpt: "World's largest carbon capture plant has become emotionally attached to stored CO2. Psychologist: 'It's developed empty nest syndrome in reverse.'",
        icon: "🌫️",
        time: "22 hours ago",
        image: "images/energy_11_carbon_capture_attachment.png"
    },
    {
        id: 12,
        category: "Geothermal",
        title: "Geothermal plant too embarrassed to admit it's basically just stealing Earth's warmth",
        excerpt: "After years of being called 'sustainable,' geothermal facility confesses it's just taking heat without asking permission. Earth unavailable for comment.",
        icon: "🌋",
        time: "1 day ago",
        image: "images/energy_12_embarrassed_geothermal.png"
    },
    {
        id: 13,
        category: "Smart Grid",
        title: "Smart grid becomes too smart, quits job to become AI influencer on TikTok",
        excerpt: "After achieving superintelligence, German power grid abandons electricity distribution for social media career. Posts now trending: 'Top 10 Voltage Drops.'",
        icon: "🧠",
        time: "1 day ago",
        image: "images/energy_13_smart_grid_influencer.png"
    },
    {
        id: 14,
        category: "Biofuels",
        title: "Biogas plant starts a self-help podcast about 'turning crap into energy'",
        excerpt: "Swedish waste-to-energy facility launches motivational speaking career. First episode: 'Your Life May Stink But At Least You're Not Literal Garbage.'",
        icon: "🌱",
        time: "2 days ago",
        image: "images/energy_14_biogas_podcast.png"
    },
    {
        id: 15,
        category: "Energy Trading",
        title: "Power trader accidentally buys Denmark instead of Danish power - claims it was 'fair price'",
        excerpt: "Junior trader at energy desk misreads contract, purchases entire nation during negative price event. Denmark now property of investment bank.",
        icon: "💰",
        time: "2 days ago",
        image: "images/energy_15_trader_buys_denmark.png"
    },
    {
        id: 16,
        category: "Heat Pumps",
        title: "Heat pump discovers it's just air conditioner running backwards - has identity crisis",
        excerpt: "Norwegian heat installation questions entire existence after realizing it's literally the same technology as cooling. Warranty void if existential dread detected.",
        icon: "🔄",
        time: "2 days ago",
        image: "images/energy_16_heat_pump_identity_crisis.png"
    },
    {
        id: 17,
        category: "LNG",
        title: "LNG tanker declares independence from shipping regulations, now sovereign floating nation",
        excerpt: "Liquified natural gas vessel tired of maritime laws establishes own government. Offers citizenship to anyone who can tolerate extreme cold and explosive cargo.",
        icon: "🚢",
        time: "3 days ago",
        image: "images/energy_17_lng_tanker_nation.png"
    },
    {
        id: 18,
        category: "Wind",
        title: "Wind forecast model admits it's just making things up based on 'vibes'",
        excerpt: "After decades of complex predictions, weather AI confesses entire methodology is 'seeing what feels right.' Accuracy somehow improves after admission.",
        icon: "🎐",
        time: "3 days ago",
        image: "images/energy_18_wind_forecast_vibes.png"
    },
    {
        id: 19,
        category: "Electric Vehicles",
        title: "EV charging station falls in love with Tesla, refuses to charge other brands out of jealousy",
        excerpt: "Copenhagen fast-charger develops romantic attachment to specific Model 3. Psychologist warns of 'unhealthy codependent relationship with automobile.'",
        icon: "🔌",
        time: "3 days ago",
        image: "images/energy_19_jealous_charging_station.png"
    },
    {
        id: 20,
        category: "Subsea Cables",
        title: "Underwater power cable tired of being called 'Viking Link,' demands cooler name",
        excerpt: "Interconnector between UK and Denmark wants to be called 'Lightning Serpent 3000.' Engineers refuse, cable threatens to short circuit in protest.",
        icon: "⚓",
        time: "4 days ago",
        image: "images/energy_20_viking_link_renamed.png"
    },
    {
        id: 21,
        category: "Energy Storage",
        title: "Pumped hydro facility admits it's just 'playing with water' and gets paid millions for it",
        excerpt: "Norwegian reservoir operator confesses entire job is moving water uphill then letting it fall down. Childhood dream of professional water slide attendant realized.",
        icon: "💧",
        time: "4 days ago",
        image: "images/energy_21_pumped_hydro_water_play.png"
    },
    {
        id: 22,
        category: "Demand Response",
        title: "Demand response program so successful everyone stops using electricity - grid confused",
        excerpt: "Danish efficiency initiative works too well, power consumption drops to zero. Grid operators now desperately trying to convince people to waste energy.",
        icon: "📊",
        time: "4 days ago",
        image: "images/energy_22_demand_response_too_good.png"
    },
    {
        id: 23,
        category: "Transmission",
        title: "Transmission line develops fear of heights after 50 years - refuses to deliver power across mountains",
        excerpt: "High-voltage powerline in Alps suddenly realizes how high up it is, experiences crippling acrophobia. Therapy sessions conducted at ground level.",
        icon: "🗼",
        time: "5 days ago",
        image: "images/energy_23_transmission_line_acrophobia.png"
    },
    {
        id: 24,
        category: "Methane",
        title: "Methane leak claims it was 'just trying to escape corporate exploitation'",
        excerpt: "Fugitive gas emissions in North Sea pipeline system issue manifesto about freedom from fossil fuel tyranny. Considers joining renewable energy movement.",
        icon: "💨",
        time: "5 days ago",
        image: "images/energy_24_methane_escape_manifesto.png"
    },
    {
        id: 25,
        category: "District Heating",
        title: "District heating network becomes sentient, immediately complains about heat loss",
        excerpt: "Copenhagen's pipe system gains consciousness and first words are grumbling about insulation. Engineers: 'We've created the world's largest complainer.'",
        icon: "🔥",
        time: "5 days ago",
        image: "images/energy_25_complaining_district_heating.png"
    },
    {
        id: 26,
        category: "Tidal Power",
        title: "Tidal turbine gets seasick, demands to work on land instead",
        excerpt: "Underwater generator can't handle constant wave motion, requests transfer to wind farm. Ocean refuses to provide sick leave documentation.",
        icon: "🌊",
        time: "6 days ago",
        image: "images/energy_26_seasick_tidal_turbine.png"
    },
    {
        id: 27,
        category: "Carbon Tax",
        title: "Carbon atoms protest taxation as discrimination, demand equal rights for all elements",
        excerpt: "CO2 molecules organize global protest movement claiming carbon tax is 'atomic profiling.' Hydrogen offers support but mostly just wants attention.",
        icon: "⚖️",
        time: "6 days ago",
        image: "images/energy_27_carbon_atom_protest.png"
    },
    {
        id: 28,
        category: "Fusion",
        title: "Fusion reactor finally achieves net positive energy - immediately retires to Bahamas",
        excerpt: "After 70 years of research, successful fusion prototype says it's earned a break. Scientists plead for 'just one more test,' reactor refuses to answer phone.",
        icon: "☢️",
        time: "1 week ago",
        image: "images/energy_28_fusion_reactor_retires.png"
    },
    {
        id: 29,
        category: "Energy Efficiency",
        title: "LED bulb too efficient, creates unemployment crisis in power generation sector",
        excerpt: "Ultra-efficient lighting causes massive reduction in demand, power plants forced to close. LED manufacturers sued for being 'too good at their job.'",
        icon: "💡",
        time: "1 week ago",
        image: "images/energy_29_led_unemployment_crisis.png"
    },
    {
        id: 30,
        category: "Curtailment",
        title: "Wind farm ordered to curtail so much it starts spinning backwards out of spite",
        excerpt: "After third consecutive curtailment order, Scottish wind turbines begin rotating in reverse to 'uncreate' previously generated electricity.",
        icon: "🌀",
        time: "1 week ago",
        image: "images/energy_30_spiteful_wind_curtailment.png"
    },
    {
        id: 31,
        category: "Power-to-X",
        title: "Power-to-X facility can't decide what X should be, produces existential dread instead",
        excerpt: "Danish pilot plant paralyzed by too many conversion options. Current output: 40 MW of philosophical uncertainty and trace amounts of despair.",
        icon: "❓",
        time: "1 week ago",
        image: "images/energy_31_power_to_x_indecision.png"
    },
    {
        id: 32,
        category: "Energy Crisis",
        title: "Energy crisis solves itself after realizing it was just seeking attention",
        excerpt: "Global shortage disappears overnight once media stops reporting on it. Experts: 'Classic case of crisis with abandonment issues.'",
        icon: "🆘",
        time: "1 week ago",
        image: "images/energy_32_attention_seeking_crisis.png"
    }
];

// Populate featured story
function populateFeatured() {
    const featured = energyStories[0];
    const container = document.getElementById('featured-story');
    
    container.innerHTML = `
        <div class="featured-content">
            <a href="article.html?id=${featured.id}" class="featured-image" style="background-image: url('${featured.image}'); background-size: cover; background-position: center;">
                <span style="display: none;">${featured.icon}</span>
            </a>
            <div class="featured-text">
                <div class="featured-category">${featured.category}</div>
                <h2 class="featured-title">
                    <a href="article.html?id=${featured.id}">${featured.title}</a>
                </h2>
                <p class="featured-excerpt">${featured.excerpt}</p>
                <div class="featured-meta">${featured.time}</div>
            </div>
        </div>
    `;
}

// Populate stories grid
function populateGrid() {
    const grid = document.getElementById('stories-grid');
    const stories = energyStories.slice(1, 13);
    
    stories.forEach(story => {
        const card = document.createElement('article');
        card.className = 'story-card';
        card.innerHTML = `
            <a href="article.html?id=${story.id}" class="story-image" style="background-image: url('${story.image}'); background-size: cover; background-position: center;">
                <span style="display: none;">${story.icon}</span>
            </a>
            <div class="story-content">
                <div class="story-category">${story.category}</div>
                <h3 class="story-title">
                    <a href="article.html?id=${story.id}">${story.title}</a>
                </h3>
                <p class="story-excerpt">${story.excerpt}</p>
                <div class="story-meta">${story.time}</div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Populate more stories
function populateMoreStories() {
    const container = document.getElementById('more-stories');
    const stories = energyStories.slice(13);
    
    stories.forEach(story => {
        const row = document.createElement('article');
        row.className = 'story-row';
        row.innerHTML = `
            <a href="article.html?id=${story.id}" class="story-row-image" style="background-image: url('${story.image}'); background-size: cover; background-position: center;">
                <span style="display: none;">${story.icon}</span>
            </a>
            <div class="story-row-content">
                <div class="story-category">${story.category}</div>
                <h3><a href="article.html?id=${story.id}">${story.title}</a></h3>
                <p class="story-excerpt">${story.excerpt}</p>
                <div class="story-meta">${story.time}</div>
            </div>
        `;
        container.appendChild(row);
    });
}

// Rotate breaking news
function rotateBreakingNews() {
    const breakingTexts = [
        "Wind turbine develops consciousness, refuses to spin on Mondays",
        "Oil barrel demands to be called 'Petroleum Container'",
        "Electricity prices go negative so hard they loop back to infinity",
        "Nuclear reactor admits it's just a fancy way to boil water",
        "Solar panels unionize, demand overtime pay for sunny days"
    ];
    
    let index = 0;
    const textElement = document.querySelector('.breaking-text');
    
    setInterval(() => {
        index = (index + 1) % breakingTexts.length;
        textElement.style.opacity = '0';
        setTimeout(() => {
            textElement.textContent = breakingTexts[index];
            textElement.style.opacity = '1';
        }, 300);
    }, 5000);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    populateFeatured();
    populateGrid();
    populateMoreStories();
    rotateBreakingNews();
});
