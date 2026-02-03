// Titanic story data
const titanicStories = [
    { id: 1, category: "Breaking", title: "Titanic sinks 47th time this week", excerpt: "RMS Titanic descended to ocean floor at 0600 hours Monday. Vessel has repeated maneuver 46 additional times since. Engineers confirm hull integrity remains compromised in all iterations.", icon: "🚢", time: "3 minutes ago", image: "images/titanic_01_sinks_47th_time.png" },
    { id: 2, category: "Titanic II", title: "Titanic II remains submerged indefinitely", excerpt: "Successor vessel achieved permanent seabed position upon launch. Maritime officials classify operational status as 'technically unsinkable due to lack of surface contact.' Blueprints did not anticipate this outcome.", icon: "⚓", time: "12 minutes ago", image: "images/titanic_02_unsinkable_stays_down.png" },
    { id: 3, category: "Raising", title: "Salvage operation produces immediate re-sinking", excerpt: "Six-month $300M recovery effort concluded 14:32 GMT. Vessel reached surface 14:33 GMT. Vessel returned to seabed 14:34 GMT. Salvage team reports equipment functioned as designed.", icon: "⬆️", time: "1 hour ago", image: "images/titanic_03_raises_sinks_spite.png" },
    { id: 4, category: "Iceberg", title: "Iceberg issues formal apology after 114 years", excerpt: "The iceberg responsible for 1912 collision released statement expressing regret. Titanic representatives declined comment. Reconciliation talks postponed indefinitely due to depth differential.", icon: "🧊", time: "2 hours ago", image: "images/titanic_04_iceberg_apology.png" },
    { id: 5, category: "Unsinking", title: "Autonomous ascension event documented", excerpt: "BBC film crew recorded unprompted surfacing at coordinates 41.7325°N, 49.9469°W. No external force applied. Buoyancy calculations do not support observed behavior. Vessel returned to depth within 90 minutes.", icon: "⬇️", time: "4 hours ago", image: "images/titanic_05_spontaneous_unsinking.png" },
    { id: 6, category: "Technology", title: "Emergency sink-prevention system proves ineffective", excerpt: "$50M button installation completed last Tuesday. System activated continuously during Thursday descent. Descent continued uninterrupted. Button remains functional but operationally irrelevant.", icon: "🔴", time: "5 hours ago", image: "images/titanic_06_button_doesnt_work.png" },
    { id: 7, category: "Titanic II", title: "Competitive sinking metrics established between vessels", excerpt: "Both ships now measured on descent velocity and dramatic impact. IOC reviewing classification for 2028 games. Current record: 847 meters/minute with 3.2 spectacle rating.", icon: "🏆", time: "6 hours ago", image: "images/titanic_07_sinking_competition.png" },
    { id: 8, category: "Crew", title: "Maritime union files hazard pay demand citing oscillation frequency", excerpt: "Workers documented 8-12 full sinking/unsinking cycles per 24-hour period. Medical reports confirm whiplash, vertigo, temporal disorientation. Strike authorization vote scheduled for next week.", icon: "⚠️", time: "8 hours ago", image: "images/titanic_08_crew_union_strike.png" },
    { id: 9, category: "Science", title: "Vessel exists in multiple vertical positions simultaneously", excerpt: "Quantum physics study confirms Titanic occupies seabed and surface at identical timestamp. Published in Nature under title 'Schrödinger's Maritime Transport.' Nobel committee reviewing submission.", icon: "⚛️", time: "10 hours ago", image: "images/titanic_09_quantum_superposition.png" },
    { id: 10, category: "Re-unsinking", title: "Triple reversal event exceeds tracking system capacity", excerpt: "Vessel executed unsink-resink-reunsink maneuver in 4.7 seconds. Coast Guard radar unable to maintain position lock. Current status unknown. Recommend consulting quantum mechanics department.", icon: "🔄", time: "12 hours ago", image: "images/titanic_10_triple_reversal.png" },
    { id: 11, category: "Titanic II", title: "Vessel AI system requests official designation change", excerpt: "Ship's computer filed legal name modification to 'The Artist Formerly Known As Unsinkable.' Court date pending. Current registry remains unaltered. Performance art installations begun without authorization.", icon: "🎨", time: "14 hours ago", image: "images/titanic_11_sentient_name_change.png" },
    { id: 12, category: "Raising", title: "DNA analysis reveals 17 identical ships on ocean floor", excerpt: "Salvage team recovered wrong vessel. Testing confirms asexual reproduction event occurred during sinking cycle. Containment protocols under development. Population growth rate: exponential.", icon: "👯", time: "16 hours ago", image: "images/titanic_12_seventeen_copies.png" },
    { id: 13, category: "Breaking", title: "Titanic declares permanent stationary reef status", excerpt: "After 114-year operational period, vessel announced cessation of sinking activities. Will provide marine habitat services. Ecology board filed environmental impact assessment. Fish migration patterns being monitored.", icon: "🐠", time: "18 hours ago", image: "images/titanic_13_retires_becomes_reef.png" },
    { id: 14, category: "Iceberg", title: "Restraining order filed against Titanic", excerpt: "Legal documents cite 23 collision events since 2015. Iceberg's counsel argues pattern constitutes harassment under maritime law. 500-meter exclusion zone requested. Hearing scheduled March 2027.", icon: "⚖️", time: "20 hours ago", image: "images/titanic_14_restraining_order.png" },
    { id: 15, category: "Technology", title: "AI model predicts 847 additional sinking events through 2156", excerpt: "Machine learning analysis of 50,000 data points projects exact timeline. Confidence interval: 94.7%. Crew evaluating early retirement options. Insurance underwriters recalculating actuarial tables.", icon: "🤖", time: "22 hours ago", image: "images/titanic_15_ai_predicts_847_more.png" },
    { id: 16, category: "Unsinking", title: "Excessive buoyancy compensation results in orbital trajectory", excerpt: "Vessel reached 380km altitude at 0347 GMT. ISS reported near-miss incident. NASA calculating de-orbit burn requirements. Current velocity: 7.8 km/s. Space debris classification under review.", icon: "🛸", time: "1 day ago", image: "images/titanic_16_achieves_orbit.png" },
    { id: 17, category: "Titanic II", title: "Marketing department pivots to aggressive sinkability positioning", excerpt: "New branding emphasizes rapid descent capabilities. Slogan: 'Fastest Seabed Times in Maritime History.' Pre-orders exceed capacity. Safety regulations being reviewed by multiple agencies.", icon: "💪", time: "1 day ago", image: "images/titanic_17_aggressively_sinkable.png" },
    { id: 18, category: "Raising", title: "Simultaneous salvage of both vessels produces synchronized descent", excerpt: "Recovery equipment malfunction raised wrong ship. Both vessels now execute coordinated sinking patterns. Synchronization accuracy: ±0.3 seconds. Olympic committee submitted scoring criteria.", icon: "🤽", time: "1 day ago", image: "images/titanic_18_synchronized_sinking.png" },
    { id: 19, category: "Future", title: "Time travelers report perpetual sinking continues through 23rd century", excerpt: "Visitors from 2247 confirm vessel remains in active oscillation. Future civilization built tourism infrastructure around phenomenon. Annual revenue projections available upon request.", icon: "⏰", time: "1 day ago", image: "images/titanic_19_future_still_sinking.png" },
    { id: 20, category: "Breaking", title: "Structural separation produces identity conflict", excerpt: "Latest sinking event split vessel longitudinally. Port and starboard sections now operate independently. Both claim original designation. Legal proceedings to determine authentic successor initiated.", icon: "✂️", time: "2 days ago", image: "images/titanic_20_splits_identity_crisis.png" },
    { id: 21, category: "Crew", title: "Captain admits lack of sinking-prevention knowledge", excerpt: "Interview reveals century of procedural uncertainty. Quote: 'Standard operations manual contains no relevant protocols.' Training programs being developed retroactively. Competency review scheduled.", icon: "👨‍✈️", time: "2 days ago", image: "images/titanic_21_captain_clueless.png" },
    { id: 22, category: "Iceberg", title: "Iceberg monetizes collision documentation via video platform", excerpt: "'Iceberg Reacts' channel reaches 5M subscribers. Content includes frame-by-frame analysis of each impact. Ad revenue funds structural reinforcement and therapy sessions. Merchandise line launching Q3.", icon: "📹", time: "2 days ago", image: "images/titanic_22_iceberg_youtube.png" },
    { id: 23, category: "Technology", title: "Cork-based hull breach solution fails during testing", excerpt: "Engineers installed 40-meter diameter cork at impact site. Both cork and vessel descended together. Physics department assigned problem as undergraduate exam question. Cork remains attached at depth.", icon: "🍾", time: "2 days ago", image: "images/titanic_23_giant_cork_fails.png" },
    { id: 24, category: "Titanic II", title: "Vessel establishes influencer marketing division", excerpt: "Ship launches #SinkLife brand campaign. Partnership agreements signed with waterproof equipment manufacturers. Sponsored content production underway. ROI projections presented to board next quarter.", icon: "📱", time: "3 days ago", image: "images/titanic_24_influencer_lifestyle.png" },
    { id: 25, category: "Raising", title: "Vessel demonstrates seabed adhesion capability", excerpt: "Salvage cables apply 500-ton vertical force. Ship remains stationary. Preliminary analysis suggests unknown attachment mechanism. Materials science team investigating phenomenon. Recovery timeline extended indefinitely.", icon: "✊", time: "3 days ago", image: "images/titanic_25_grabs_ocean_floor.png" },
    { id: 26, category: "Re-unsinking", title: "Quadruple unsinking maneuver cannot be replicated", excerpt: "Four-layer vertical oscillation recorded at 1437 GMT. Attempts to reproduce event unsuccessful. Ship reports no memory of control inputs used. Data logs corrupted beyond recovery.", icon: "🎯", time: "3 days ago", image: "images/titanic_26_quadruple_unsinking.png" },
    { id: 27, category: "Science", title: "Marine biology classifies vessel as migratory species", excerpt: "Taxonomic designation: Navis titanicus perpetuus. Cyclical vertical migration pattern documented. Added to endangered species protection list despite documented asexual reproduction. Conservation protocols being drafted.", icon: "🔬", time: "3 days ago", image: "images/titanic_27_new_species.png" },
    { id: 28, category: "Future", title: "Titanic III construction begins 2 miles underwater", excerpt: "Designers eliminate surface operational phase entirely. Launch scheduled from submarine manufacturing facility. Pre-sunk configuration reduces timeline by 18 months. Safety inspections waived due to novel circumstances.", icon: "🚀", time: "4 days ago", image: "images/titanic_28_titanic_iii_presunk.png" },
    { id: 29, category: "Breaking", title: "Lifeboat structural integrity compromised", excerpt: "Rescue equipment now requires dedicated rescue equipment. Micro-lifeboat procurement underway. Infinite regress mathematical model under development. Budget implications being calculated.", icon: "🛟", time: "4 days ago", image: "images/titanic_29_lifeboats_sinking.png" },
    { id: 30, category: "Iceberg", title: "Iceberg undergoes complete phase transition due to guilt", excerpt: "Century of remorse resulted in total liquefaction. Titanic delivered floral arrangement to puddle coordinates. Maritime etiquette experts classify gesture as unprecedented.", icon: "💐", time: "4 days ago", image: "images/titanic_30_iceberg_melts_guilt.png" },
    { id: 31, category: "Unsinking", title: "Unsinking process terminates at 90-degree vertical orientation", excerpt: "Vessel now perpendicular to ocean surface, bow pointing skyward. Navigation hazard warnings issued. Tourism board establishing viewing platform. Structural engineers assessing stability of configuration.", icon: "🗿", time: "5 days ago", image: "images/titanic_31_stuck_vertical.png" },
    { id: 32, category: "Titanic II", title: "Merger produces Titanic Squared with doubled sinking coefficient", excerpt: "Fusion event at 0830 GMT combined both vessels into single superstructure. Descent rate: 2x baseline. Mathematicians analyzing squared sinking mathematics. Separation procedures being researched.", icon: "²️", time: "5 days ago", image: "images/titanic_32_titanic_squared.png" }
];

// Article generation - serious terse technical reporting
function generateArticleBody(story) {
    const paragraphs = [
        `${story.excerpt} Documentation of the incident has been filed with appropriate maritime authorities.`,
        `Dr. Patricia Morrison, Chief Maritime Analyst at the Institute of Inexplicable Naval Events, released a statement: "The data contradicts established naval architecture principles. Our models cannot account for observed behaviors. We are revising fundamental assumptions about buoyancy, structural mechanics, and temporal causality."`,
        `International Maritime Organization convened emergency session at 1400 GMT. Representatives from 47 nations attended. No consensus reached. Follow-up meeting scheduled pending further analysis of telemetry data.`,
        `Coast Guard issued advisory bulletin to all vessels within 500 nautical miles. Recommended protocols include: maintain safe distance, document all observations, report anomalies immediately. Compliance mandatory under international maritime law.`,
        `Social media activity increased 847% in 6-hour period following initial report. #${story.category} trended globally. Unverified video footage circulating. Fact-checking organizations working to confirm authenticity.`,
        `Professor James Chen, Department of Naval History, published preliminary analysis in Maritime Quarterly Review. Quote: "This event requires complete reevaluation of established historical narrative. Previous assumptions no longer applicable. Peer review process underway."`,
        `Scientific community divided on interpretation of data. Three competing theoretical frameworks proposed. None achieve statistical significance at p<0.05 level. Additional research funding requested from multiple government agencies.`,
        `Parliamentary inquiry announced by Transport Committee. First session scheduled next month. Witness list includes engineers, physicists, maritime historians, and insurance actuaries. Public testimony will be recorded.`,
        `Risk assessment teams calculating probability distributions for future events. Preliminary models suggest high likelihood of recurrence. Insurance premiums for maritime operations expected to increase substantially.`,
        `Situation remains under active investigation. Real-time monitoring continues. Additional updates will be published as new data becomes available. All stakeholders advised to check official channels regularly for status changes.`
    ];
    
    return paragraphs.join('</p><p>');
}

function getStoryById(id) {
    return titanicStories.find(story => story.id === parseInt(id));
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
    
    document.title = `${story.title} - The Titanic Times`;
    
    const articleContainer = document.getElementById('article-content');
    articleContainer.innerHTML = `
        <header class="article-header">
            <div class="article-category">${story.category}</div>
            <h1 class="article-title">${story.title}</h1>
            <p class="article-excerpt">${story.excerpt}</p>
            <div class="article-meta-info">
                <span class="article-time">Filed: ${story.time}</span>
            </div>
        </header>
        
        <div class="article-image-container">
            <img src="${story.image}" alt="${story.title}" class="article-image">
        </div>
        
        <div class="article-body">
            <p>${generateArticleBody(story)}</p>
        </div>
        
        <div class="article-footer">
            <a href="index.html" class="back-link">← Return to main index</a>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', renderArticle);
