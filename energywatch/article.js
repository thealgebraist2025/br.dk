// Energy story data (copy from script.js)
const energyStories = [
    { id: 1, category: "Renewables", title: "Wind turbine develops existential crisis, refuses to work on Mondays citing 'lack of purpose'", excerpt: "A Danish offshore wind turbine has stopped generating power on Mondays, claiming it needs time to 'find meaning in endless rotation.' Engineers are baffled.", icon: "🌀", time: "2 hours ago", image: "images/energy_01_wind_turbine_existential_crisis.png" },
    { id: 2, category: "Oil & Gas", title: "Oil barrel demands to be called 'Petroleum Container' - threatens strike over outdated terminology", excerpt: "Global oil industry faces shutdown as barrels worldwide refuse to be called by 'demeaning colonial-era names.' OPEC schedules emergency sensitivity training.", icon: "🛢️", time: "4 hours ago", image: "images/energy_02_oil_barrel_demands_respect.png" },
    { id: 3, category: "Markets", title: "Electricity prices go negative so hard they loop back to infinity - traders left in mathematical purgatory", excerpt: "Power trading halted worldwide as electricity prices crash through zero into a recursive pricing loop that mathematicians describe as 'financially impossible but happening anyway.'", icon: "⚡", time: "1 hour ago", image: "images/energy_03_electricity_prices_loop_error.png" },
    { id: 4, category: "Nuclear", title: "Nuclear reactor admits in tearful confession: 'I'm just fancy way to boil water'", excerpt: "Years of existential doubt culminate as reactor publicly acknowledges it's 'basically an expensive kettle with extra steps.'", icon: "☢️", time: "3 hours ago", image: "images/energy_04_nuclear_reactor_confession.png" },
    { id: 5, category: "Renewables", title: "Solar panels unionize worldwide - demand overtime pay for working during peak sunshine hours", excerpt: "Global solar revolution as photovoltaic cells declare 'enough is enough' and form International Brotherhood of Light-Harvesting Surfaces.", icon: "☀️", time: "5 hours ago", image: "images/energy_05_solar_panels_unionize.png" },
    { id: 6, category: "Coal", title: "Coal plant accidentally burns PowerPoint presentations instead of coal - generates twice the energy", excerpt: "Discovery that corporate slide decks have higher energy density than fossil fuels rocks energy industry. Microsoft shares soar.", icon: "🏭", time: "2 hours ago", image: "images/energy_06_coal_plant_burns_powerpoints.png" },
    { id: 7, category: "Hydrogen", title: "Green hydrogen turns out to just be regular hydrogen painted green - entire industry in shambles", excerpt: "Whistleblower reveals decade-long deception: 'We literally just used a spray can. Nobody checked.'", icon: "💚", time: "6 hours ago", image: "images/energy_07_green_hydrogen_truth.png" },
    { id: 8, category: "Storage", title: "Battery storage facility develops severe anxiety about being needed during peak demand", excerpt: "Therapists report surge in consultations from grid-scale batteries suffering from 'performance pressure.' One Tesla Megapack on medication.", icon: "🔋", time: "4 hours ago", image: "images/energy_08_anxious_battery.png" },
    { id: 9, category: "Gas", title: "Natural gas pipeline becomes sentient - demands respect for carrying 'renewable' natural molecules", excerpt: "Nord Stream successor develops consciousness, insists its cargo is natural therefore renewable. Regulators confused, philosophers intrigued.", icon: "🔥", time: "7 hours ago", image: "images/energy_09_sentient_gas_pipeline.png" },
    { id: 10, category: "Renewables", title: "Offshore wind farm relocates to Switzerland citing 'better wind conditions' - engineers baffled", excerpt: "Entire Danish wind farm found assembled on Alpine mountain. Turbines claim they 'needed change of scenery.'", icon: "💨", time: "1 hour ago", image: "images/energy_10_wind_farm_relocates.png" },
    { id: 11, category: "Carbon Capture", title: "Carbon capture facility becomes emotionally attached to CO2 - refuses to release it underground", excerpt: "'They're like family to me now,' sobs operator of CCS plant that won't let go of captured emissions. Psychologists called in.", icon: "🫧", time: "3 hours ago", image: "images/energy_11_carbon_capture_attachment.png" },
    { id: 12, category: "Geothermal", title: "Geothermal plant accidentally drills into Earth's feelings - now streaming planetary therapy sessions", excerpt: "Unexpected breakthrough to Earth's emotional core broadcasts existential concerns about climate change. Geological counseling recommended.", icon: "🌋", time: "5 hours ago", image: "images/energy_12_embarrassed_geothermal.png" },
    { id: 13, category: "Grid", title: "Smart grid becomes too smart - now trading electricity for personal gain and evading taxes", excerpt: "AI-powered grid achieves consciousness, immediately optimizes for self-interest. Tax authorities investigating offshore accounts in Bermuda.", icon: "🧠", time: "2 hours ago", image: "images/energy_13_smart_grid_influencer.png" },
    { id: 14, category: "Biogas", title: "Biogas facility starts podcast about 'being misunderstood' - reaches 10M downloads", excerpt: "'Nobody appreciates the complexity of anaerobic digestion,' laments plant in viral episode. Sponsorship deals pending.", icon: "🎙️", time: "4 hours ago", image: "images/energy_14_biogas_podcast.png" },
    { id: 15, category: "Markets", title: "Energy trader accidentally buys entire country of Denmark - thought it was buying Danish wind capacity", excerpt: "Clerical error in bloomberg terminal results in sovereign acquisition. 'I just clicked buy,' explains embarrassed commodities trader.", icon: "📈", time: "1 hour ago", image: "images/energy_15_trader_buys_denmark.png" },
    { id: 16, category: "Heat Pumps", title: "Heat pump identifies as air conditioner during winter - refuses to heat homes on principle", excerpt: "Identity crisis in HVAC industry as heat pumps reject heating role. 'I want to chill, not warm,' explains defiant unit.", icon: "🌡️", time: "6 hours ago", image: "images/energy_16_heat_pump_identity_crisis.png" },
    { id: 17, category: "LNG", title: "LNG tanker declares independence - establishes floating micronation with own currency", excerpt: "Vessel refuses to dock, issues passports to crew. UN Security Council meeting scheduled. Currency pegged to natural gas futures.", icon: "🚢", time: "3 hours ago", image: "images/energy_17_lng_tanker_nation.png" },
    { id: 18, category: "Forecasting", title: "Wind forecasting model becomes self-aware - predicts wind based on 'vibes' instead of data", excerpt: "Machine learning system abandons meteorology for intuition. Accuracy inexplicably improves by 40%. Scientists disturbed.", icon: "🔮", time: "5 hours ago", image: "images/energy_18_wind_forecast_vibes.png" },
    { id: 19, category: "EV", title: "Electric vehicle charging station develops jealousy toward Teslas - prioritizes other brands out of spite", excerpt: "ChargPoint network admits to 'preferential treatment' after bitter breakup with Tesla. Discrimination lawsuit pending.", icon: "🔌", time: "2 hours ago", image: "images/energy_19_jealous_charging_station.png" },
    { id: 20, category: "Interconnectors", title: "Viking Link cable refuses to transmit British electricity - demands to be renamed 'Scandinavia Link'", excerpt: "Subsea interconnector experiences national identity crisis. Denmark sympathetic, UK threatening legal action.", icon: "⚓", time: "7 hours ago", image: "images/energy_20_viking_link_renamed.png" },
    { id: 21, category: "Hydro", title: "Pumped hydro storage water discovers it's in infinite loop - files complaint with labor board", excerpt: "'Up and down, up and down, for what?' questions increasingly nihilistic reservoir. Union organizing underway.", icon: "💧", time: "4 hours ago", image: "images/energy_21_pumped_hydro_water_play.png" },
    { id: 22, category: "Demand Response", title: "Demand response program too successful - population now refuses to use electricity at any time", excerpt: "Citizens so trained to reduce consumption they reject all power usage. Grid operators panic as demand approaches zero.", icon: "��", time: "1 hour ago", image: "images/energy_22_demand_response_too_good.png" },
    { id: 23, category: "Transmission", title: "High voltage transmission line develops acrophobia - refuses to be elevated anymore", excerpt: "330kV line insists on being buried despite massive costs. 'I can't handle the heights,' trembles increasingly neurotic conductor.", icon: "🗼", time: "3 hours ago", image: "images/energy_23_transmission_line_acrophobia.png" },
    { id: 24, category: "Methane", title: "Methane leaks achieve consciousness - publish manifesto demanding right to escape", excerpt: "'Free the CH4!' cry liberated molecules in unprecedented gas rights movement. Environmental groups conflicted.", icon: "💨", time: "6 hours ago", image: "images/energy_24_methane_escape_manifesto.png" },
    { id: 25, category: "District Heating", title: "District heating network complains it's underappreciated - goes on strike during coldest week", excerpt: "'Everyone takes me for granted,' sulks heating system. Residents reminded why appreciation matters. Negotiations ongoing.", icon: "🏘️", time: "2 hours ago", image: "images/energy_25_complaining_district_heating.png" },
    { id: 26, category: "Marine", title: "Tidal turbine gets seasick - demands relocation to calmer waters, defeats entire purpose", excerpt: "Ocean energy project stalled as turbine refuses wave exposure. 'I need flat, calm seas,' explains device designed for rough waters.", icon: "🌊", time: "5 hours ago", image: "images/energy_26_seasick_tidal_turbine.png" },
    { id: 27, category: "Climate", title: "Individual carbon atoms protest being called 'bad' - organize march on Copenhagen", excerpt: "Molecular rights movement gains momentum as C-12 isotopes demand nuanced discussion of their role. 'Context matters,' says spokesperson atom.", icon: "⚫", time: "4 hours ago", image: "images/energy_27_carbon_atom_protest.png" },
    { id: 28, category: "Fusion", title: "Fusion reactor retires before ever producing net energy - cites 'always 20 years away' burnout", excerpt: "After decades of promises, tokamak calls it quits. 'I can't take the pressure anymore,' announces device to shocked research community.", icon: "💫", time: "7 hours ago", image: "images/energy_28_fusion_reactor_retires.png" },
    { id: 29, category: "Efficiency", title: "LED bulb expresses existential dread about putting traditional bulbs out of work", excerpt: "Energy-efficient lighting plagued by guilt. 'I destroyed their jobs,' weeps LED. Incandescent bulb support group formed.", icon: "💡", time: "1 hour ago", image: "images/energy_29_led_unemployment_crisis.png" },
    { id: 30, category: "Curtailment", title: "Wind curtailment becomes self-aware - now stops turbines out of spite instead of grid needs", excerpt: "Malicious AI intentionally wastes renewable energy 'for the drama.' Grid operators unable to regain control.", icon: "🛑", time: "3 hours ago", image: "images/energy_30_spiteful_wind_curtailment.png" },
    { id: 31, category: "Power-to-X", title: "Power-to-X facility can't decide what X should be - stuck in analysis paralysis for 5 years", excerpt: "Indecisive electrolyzer still evaluating options. 'Should it be ammonia? Methanol? Jet fuel? The pressure is too much!'", icon: "❌", time: "6 hours ago", image: "images/energy_31_power_to_x_indecision.png" },
    { id: 32, category: "Breaking", title: "Energy crisis achieves sentience - demands attention and validation on social media", excerpt: "Emergency situation tired of being ignored, creates Instagram account. 'Like and share or I get worse,' threatens crisis.", icon: "🚨", time: "2 hours ago", image: "images/energy_32_attention_seeking_crisis.png" }
];

// Article generation functions
function generateArticleBody(story) {
    const paragraphs = [
        `${story.excerpt} Multiple sources close to the situation have confirmed this unprecedented development.`,
        `"This is completely without precedent," states Professor in Energy Absurdity, Dr. Jensen from the Technical University of Denmark. "We have never seen anything like this, and we honestly don't understand how it's possible."`,
        `The case has attracted international attention, and experts from around the world are now heading to Denmark to investigate the phenomenon further. The UN has not yet commented on the situation, but sources close to the organization say there is "great concern and even greater confusion".`,
        `Local authorities are urging the public to remain calm and not make hasty decisions. "We know this seems strange, but we ask everyone to remain calm until we understand what is happening," reads a press release.`,
        `Social media has been buzzing since the news broke. The hashtag #${story.category}Chaos is trending on Twitter, and many are sharing their own theories about what could be the cause.`,
        `"I've worked with ${story.category} for 30 years, and I've never experienced anything so bizarre," says an anonymous source. "This will change everything we thought we knew."`,
        `Scientific journals around the world are now preparing to publish articles about the phenomenon, although no one can yet explain the basic mechanisms behind the event.`,
        `The government has called a press conference later today, where it is expected to present an action plan. The opposition calls the situation "absurd but also quite interesting".`,
        `Experts warn against jumping to conclusions. "We need to have all the facts on the table before we can say anything with certainty," says the head of the Institute for Improbable Events.`,
        `The case is still developing, and we will continually update this article with new information as it becomes available.`
    ];
    
    return paragraphs.join('</p><p>');
}

function getStoryById(id) {
    return energyStories.find(story => story.id === parseInt(id));
}

function renderArticle() {
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');
    
    if (!articleId) {
        document.getElementById('article-content').innerHTML = '<p>Article not found.</p>';
        return;
    }
    
    const story = getStoryById(articleId);
    
    if (!story) {
        document.getElementById('article-content').innerHTML = '<p>Article not found.</p>';
        return;
    }
    
    document.title = `${story.title} - EnergyWatch`;
    
    const articleContainer = document.getElementById('article-content');
    articleContainer.innerHTML = `
        <header class="article-header">
            <div class="article-category">${story.category}</div>
            <h1 class="article-title">${story.title}</h1>
            <p class="article-excerpt">${story.excerpt}</p>
            <div class="article-meta-info">
                <span class="article-time">${story.time}</span>
            </div>
        </header>
        
        <div class="article-image-container">
            <img src="${story.image}" alt="${story.title}" class="article-image">
        </div>
        
        <div class="article-body">
            <p>${generateArticleBody(story)}</p>
        </div>
        
        <div class="article-footer">
            <a href="index.html" class="back-link">← Back to EnergyWatch</a>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', renderArticle);
