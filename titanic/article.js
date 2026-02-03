// Titanic story data (copy from script.js)
const titanicStories = [
    { id: 1, category: "Breaking", title: "Titanic sinks for 47th time this week - crew calling it 'really inconvenient at this point'", excerpt: "The RMS Titanic has once again descended to the ocean floor, marking its 47th sinking event since Monday. Crew members report growing frustration with the cyclical nature of their employment.", icon: "🚢", time: "3 minutes ago", image: "images/titanic_01_sinks_47th_time.png" },
    { id: 2, category: "Titanic II", title: "Titanic II: The Unsinkable lives up to name by refusing to float - remains on ocean floor 'out of principle'", excerpt: "The highly anticipated successor ship has achieved unsinkability through revolutionary technique of simply staying underwater permanently. Engineers hail it as 'technically unsinkable now.'", icon: "⚓", time: "12 minutes ago", image: "images/titanic_02_unsinkable_stays_down.png" },
    { id: 3, category: "Raising", title: "Salvage team successfully raises Titanic - it immediately sinks again 'just to spite them'", excerpt: "After 6 months and $300 million, salvage operators finally brought the ship to surface. Witnesses report the Titanic 'looked them dead in the eye' before diving back down.", icon: "⬆️", time: "1 hour ago", image: "images/titanic_03_raises_sinks_spite.png" },
    { id: 4, category: "Iceberg", title: "Original iceberg issues public apology - Titanic refuses to accept, cites 'trust issues'", excerpt: "The iceberg responsible for 1912 collision has spent century in therapy and now seeks reconciliation. Titanic's spokesperson calls apology 'too little, too late by about 114 years.'", icon: "🧊", time: "2 hours ago", image: "images/titanic_04_iceberg_apology.png" },
    { id: 5, category: "Unsinking", title: "Titanic spontaneously unsinks during documentary filming - crew abandons ship in confusion", excerpt: "BBC documentary team witnessing unprecedented autonomous ascension. Marine biologists baffled as ship surfaces 'of its own accord, without asking permission.'", icon: "⬇️", time: "4 hours ago", image: "images/titanic_05_spontaneous_unsinking.png" },
    { id: 6, category: "Technology", title: "Engineers install 'sink prevention button' on Titanic - ship presses it repeatedly while sinking anyway", excerpt: "$50 million emergency system proves ineffective as Titanic demonstrates ability to push button while simultaneously descending. 'It's almost mocking us,' says lead engineer.", icon: "🔴", time: "5 hours ago", image: "images/titanic_06_button_doesnt_work.png" },
    { id: 7, category: "Titanic II", title: "Titanic II challenges predecessor to sinking competition - winner is 'whoever sinks faster and more dramatically'", excerpt: "Rivalry between ships escalates into official maritime sports event. IOC considering adding 'Competitive Sinking' to 2028 Olympics.", icon: "🏆", time: "6 hours ago", image: "images/titanic_07_sinking_competition.png" },
    { id: 8, category: "Crew", title: "Titanic crew union demands hazard pay for 'excessive sinking and unsinking cycles' - threatens to strike", excerpt: "Maritime workers cite whiplash, confusion, and 'existential dread about job security' as ship oscillates between seabed and surface 8-12 times daily.", icon: "⚠️", time: "8 hours ago", image: "images/titanic_08_crew_union_strike.png" },
    { id: 9, category: "Science", title: "Physicists discover Titanic exists in quantum superposition of sunk and unsunk states simultaneously", excerpt: "Groundbreaking study reveals ship occupies multiple positions on z-axis at once. 'Schrödinger's Boat,' declares Nature journal. Nobel Prize anticipated.", icon: "⚛️", time: "10 hours ago", image: "images/titanic_09_quantum_superposition.png" },
    { id: 10, category: "Re-unsinking", title: "Titanic achieves triple unsinking reversal - experts lose track of whether it's currently sunk or not", excerpt: "Maritime tracking systems crash as ship executes unprecedented unsink-resink-reunsink maneuver. Coast Guard advises checking Schrödinger equations.", icon: "🔄", time: "12 hours ago", image: "images/titanic_10_triple_reversal.png" },
    { id: 11, category: "Titanic II", title: "Titanic II develops sentience, demands to be called 'The Artist Formerly Known As Unsinkable'", excerpt: "Ship's AI achieves consciousness, immediately files name change petition and starts avant-garde performance art collective focused on 'exploring buoyancy identity.'", icon: "🎨", time: "14 hours ago", image: "images/titanic_11_sentient_name_change.png" },
    { id: 12, category: "Raising", title: "Salvage company raises wrong Titanic - discovers there are now 17 identical copies on ocean floor", excerpt: "DNA testing reveals multiplication event occurred during one of the sinking cycles. 'They're reproducing asexually,' warns marine biologist. Containment efforts underway.", icon: "👯", time: "16 hours ago", image: "images/titanic_12_seventeen_copies.png" },
    { id: 13, category: "Breaking", title: "Titanic announces retirement from sinking - will pursue career as stationary reef", excerpt: "After 114 years of maritime chaos, ship declares intentions to 'settle down' and provide habitat for fish. Ocean ecology community cautiously optimistic.", icon: "🐠", time: "18 hours ago", image: "images/titanic_13_retires_becomes_reef.png" },
    { id: 14, category: "Iceberg", title: "Iceberg files restraining order against Titanic - claims ship 'keeps coming back for revenge collisions'", excerpt: "Legal documents allege Titanic has deliberately struck iceberg 23 times since 2015. Iceberg's lawyer argues pattern of harassment constitutes maritime stalking.", icon: "⚖️", time: "20 hours ago", image: "images/titanic_14_restraining_order.png" },
    { id: 15, category: "Technology", title: "AI predicts Titanic will sink exactly 847 more times before achieving permanent stability in 2156", excerpt: "Machine learning model trained on 50,000 sinking events forecasts precise timeline. Crew considering early retirement plans.", icon: "🤖", time: "22 hours ago", image: "images/titanic_15_ai_predicts_847_more.png" },
    { id: 16, category: "Unsinking", title: "Titanic unsinks so hard it achieves orbit - NASA scrambling to de-orbit ship before it becomes space debris", excerpt: "Excessive buoyancy compensation sends vessel 380km above Earth. International Space Station reports 'close call with luxury liner.'", icon: "🛸", time: "1 day ago", image: "images/titanic_16_achieves_orbit.png" },
    { id: 17, category: "Titanic II", title: "Titanic II gives up on being unsinkable - embraces identity as 'aggressively sinkable' instead", excerpt: "Marketing pivot celebrates 'fastest descent times in maritime history.' New slogan: 'We Go Down Better Than Anyone.'", icon: "💪", time: "1 day ago", image: "images/titanic_17_aggressively_sinkable.png" },
    { id: 18, category: "Raising", title: "Salvage team accidentally raises Titanic II instead of original - both ships now sinking in synchronized routine", excerpt: "Mix-up leads to discovery of coordinated sinking capabilities. Synchronized swimming judges award perfect 10s.", icon: "🤽", time: "1 day ago", image: "images/titanic_18_synchronized_sinking.png" },
    { id: 19, category: "Future", title: "Time travelers from 2247 report Titanic still sinking - 'it never stopped, we just got used to it'", excerpt: "Visitors from future reveal humanity eventually builds civilization around perpetual sinking cycle. 'It's a tourist attraction now.'", icon: "⏰", time: "1 day ago", image: "images/titanic_19_future_still_sinking.png" },
    { id: 20, category: "Breaking", title: "Titanic splits into two ships during latest sinking - both halves claim to be 'the real Titanic'", excerpt: "Identity crisis erupts as port and starboard sections develop separate consciousnesses. Custody battle over name and legacy anticipated.", icon: "✂️", time: "2 days ago", image: "images/titanic_20_splits_identity_crisis.png" },
    { id: 21, category: "Crew", title: "Captain admits he has no idea how to stop the sinking cycle - 'I just work here'", excerpt: "Candid interview reveals century-long incompetence. 'Honestly, we're all just pretending we know what's happening,' confesses captain.", icon: "👨‍✈️", time: "2 days ago", image: "images/titanic_21_captain_clueless.png" },
    { id: 22, category: "Iceberg", title: "Iceberg starts YouTube channel reviewing each Titanic collision - monetization paying for therapy", excerpt: "'Iceberg Reacts' series gains 5M subscribers. Ad revenue funds PTSD treatment and ice-reinforcement procedures.", icon: "📹", time: "2 days ago", image: "images/titanic_22_iceberg_youtube.png" },
    { id: 23, category: "Technology", title: "Engineers install giant cork in Titanic's hull - ship sinks with cork still attached", excerpt: "Comedically oversized cork solution proves ineffective as both cork and ship descend together. Physics professors assign as extra credit problem.", icon: "🍾", time: "2 days ago", image: "images/titanic_23_giant_cork_fails.png" },
    { id: 24, category: "Titanic II", title: "Titanic II becomes influencer, promotes 'Sinking Lifestyle Brand' - partnerships with underwater GoPro companies", excerpt: "Ship pivots to social media career with #SinkLife movement. Sponsored content includes waterproof phone cases and emergency flotation devices.", icon: "📱", time: "3 days ago", image: "images/titanic_24_influencer_lifestyle.png" },
    { id: 25, category: "Raising", title: "Raising attempt fails when Titanic grabs onto ocean floor - 'I like it down here,' says ship", excerpt: "Vessel demonstrates previously unknown ability to grip seabed. Salvage crew reports ship is 'being difficult on purpose.'", icon: "✊", time: "3 days ago", image: "images/titanic_25_grabs_ocean_floor.png" },
    { id: 26, category: "Re-unsinking", title: "Titanic executes flawless quadruple unsinking - immediately forgets how it did it", excerpt: "Record-breaking four-layer unsinking maneuver cannot be replicated. Ship admits it 'wasn't paying attention to what buttons it pressed.'", icon: "🎯", time: "3 days ago", image: "images/titanic_26_quadruple_unsinking.png" },
    { id: 27, category: "Science", title: "Marine biologists classify Titanic as new species of migratory vessel - 'Navis titanicus perpetuus'", excerpt: "Taxonomic classification recognizes ship's cyclical vertical migration pattern. Added to endangered species list despite reproducing asexually.", icon: "🔬", time: "3 days ago", image: "images/titanic_27_new_species.png" },
    { id: 28, category: "Future", title: "Titanic III announced - will be 'pre-sunk' to save time and avoid disappointment", excerpt: "Designers skip surface phase entirely. 'Why fight the inevitable?' says chief engineer. Launch planned from submarine factory 2 miles underwater.", icon: "🚀", time: "4 days ago", image: "images/titanic_28_titanic_iii_presunk.png" },
    { id: 29, category: "Breaking", title: "Titanic's lifeboats develop sinking problem - now need their own tiny lifeboats", excerpt: "Contagious sinking spreads to rescue equipment. Micro-lifeboats commissioned for lifeboat lifeboats. Infinite regress concerns raised.", icon: "🛟", time: "4 days ago", image: "images/titanic_29_lifeboats_sinking.png" },
    { id: 30, category: "Iceberg", title: "Original iceberg melts from guilt - Titanic sends condolence flowers to puddle", excerpt: "Century of remorse culminates in total liquefaction. Titanic's gesture called 'classy but weird' by maritime etiquette experts.", icon: "💐", time: "4 days ago", image: "images/titanic_30_iceberg_melts_guilt.png" },
    { id: 31, category: "Unsinking", title: "Unsinking process gets stuck halfway - Titanic now vertical, pointing at sky 'like a monument to hubris'", excerpt: "Ship frozen at 90-degree angle creates navigational hazard and tourist attraction. 'It's kind of beautiful,' admits coast guard.", icon: "🗿", time: "5 days ago", image: "images/titanic_31_stuck_vertical.png" },
    { id: 32, category: "Titanic II", title: "Titanic II and original Titanic merge into super-ship 'Titanic Squared' - immediately sinks twice as fast", excerpt: "Fusion event creates vessel with combined sinking capabilities of both predecessors. Mathematicians excited by squared sinking coefficient.", icon: "²️", time: "5 days ago", image: "images/titanic_32_titanic_squared.png" }
];

// Article generation functions
function generateArticleBody(story) {
    const paragraphs = [
        `${story.excerpt} Multiple sources close to the situation have confirmed this unprecedented development.`,
        `"This is completely without precedent," states Professor of Maritime Absurdity, Dr. Henderson from the Institute of Improbable Naval Events. "We have never seen anything like this in the entire history of seafaring, and we honestly don't understand how it's even possible."`,
        `The case has attracted international attention, with maritime experts from around the world now converging to investigate the phenomenon further. The International Maritime Organization has not yet issued an official statement, but sources close to the organization say there is "profound bewilderment mixed with morbid fascination."`,
        `Coast Guard authorities are urging the public to remain calm and avoid the area. "We know this seems impossible, but we ask everyone to stay away from the vicinity until we understand what is happening," reads an official press release. "Also, please stop trying to sell tickets to watch the sinkings."`,
        `Social media has been in an uproar since the news broke. The hashtag #${story.category}Chaos is trending worldwide on Twitter, and thousands are sharing their own theories about what could be causing this phenomenon. Several TikTok videos claiming to show the event have gone viral.`,
        `"I've studied the Titanic for 40 years, and I've never experienced anything remotely this bizarre," says Dr. Margaret Thompson, leading Titanic historian. "This will fundamentally change everything we thought we knew about the ship. Also, I might need to rewrite my entire book."`,
        `Scientific journals around the world are now scrambling to publish peer-reviewed articles about the phenomenon, although peer reviewers keep rejecting submissions with notes like "this can't possibly be real" and "are you having a stroke?"`,
        `The government has scheduled an emergency press conference for later today, where officials are expected to present an action plan. Opposition parties have called the situation "utterly absurd but also weirdly captivating" and are demanding a full parliamentary inquiry.`,
        `Experts continue to warn against jumping to conclusions. "We need to have all the facts before we can say anything with certainty," insists Dr. James Rodriguez, head of the Institute for Impossible Maritime Events. "But between you and me, this is completely bonkers."`,
        `The situation continues to develop, and we will update this article with new information as it becomes available. Stay tuned to The Titanic Times for continuous coverage of this ongoing story.`
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
            <a href="index.html" class="back-link">← Back to The Titanic Times</a>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', renderArticle);
