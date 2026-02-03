// Bizarre and nonsensical news stories (32 iterations)
const bizarreStories = [
    {
        id: 1,
        category: "indland",
        title: "Lokal mand opdager at hans skygge er 3 minutter forsinket - nu undersøger forskere fænomenet",
        excerpt: "En 47-årig mand fra Randers har opdaget, at hans skygge konsekvent ankommer 3 minutter efter ham selv. Fysikere er forvirrede og fascinerede på samme tid.",
        icon: "⏰",
        time: "2 min. siden",
        image: "generated_images/story_01_man_with_delayed_shadow.png"
    },
    {
        id: 2,
        category: "udland",
        title: "Hollandsk ost erklærer uafhængighed fra Holland - danner egen republik",
        excerpt: "En 200 kg tung Gouda-ost har afskåret sig fra Holland og kræver diplomatisk anerkendelse fra FN. Nederlandene kalder det 'osteligt åndssvagt'.",
        icon: "🧀",
        time: "15 min. siden",
        image: "generated_images/story_02_independent_dutch_cheese.png"
    },
    {
        id: 3,
        category: "politik",
        title: "Folketinget stemmer for at gøre tirsdage ulovlige - mandage bliver dobbelt så lange",
        excerpt: "I et historisk flertal har folketinget besluttet at afskaffe alle tirsdage. Fremover vil mandage vare 48 timer for at kompensere.",
        icon: "📅",
        time: "1 time siden",
        image: "generated_images/story_03_tuesday_abolished.png"
    },
    {
        id: 4,
        category: "videnskab",
        title: "Forskere bekræfter: Katte kan faktisk se WiFi-signaler og bliver irriterede af dårlig hastighed",
        excerpt: "Et gennembrud i kattepsykologi afslører, at katte ikke bare er kræsne - de kan bogstaveligt talt se dine WiFi-signaler og dømmer dig for dit netværk.",
        icon: "🐱",
        time: "2 timer siden",
        image: "generated_images/story_04_cats_see_wifi.png"
    },
    {
        id: 5,
        category: "kultur",
        title: "Kunstsamler betaler 4 millioner kroner for usynlig maleri - kan stadig ikke se det",
        excerpt: "En kontroversiel kunsthandel gik over alle grænser i går, da et 'fuldstændig usynligt mesterværk' blev solgt for millioner. Køberen insisterer på at det er smukt.",
        icon: "🎨",
        time: "3 timer siden",
        image: "generated_images/story_05_invisible_painting.png"
    },
    {
        id: 6,
        category: "sport",
        title: "Danske curling-spillere diskvalificeret efter at have brugt opvarmet is",
        excerpt: "Skandale ved vinter-OL: Det danske hold indrømmer nu, at de gennem 3 år har konkurreret på is opvarmet til 1 grad. 'Det gav bedre glid', forklarer holdkapteinen.",
        icon: "🥌",
        time: "4 timer siden",
        image: "generated_images/story_06_heated_ice_curling.png"
    },
    {
        id: 7,
        category: "indland",
        title: "Mand i Aarhus vågner op som brevdue - familie accepterer det ikke",
        excerpt: "En 33-årig IT-konsulent vågnede i morges som brevdue. Hans familie nægter at acceptere transformationen og kræver, at han kommer til familiemiddag alligevel.",
        icon: "🕊️",
        time: "5 timer siden",
        image: "generated_images/story_07_man_becomes_pigeon.png"
    },
    {
        id: 8,
        category: "udland",
        title: "Schweizisk bjerg flytter sig 40 meter østpå - ingen ved hvorfor",
        excerpt: "Matterhorn har spontant flyttet sig 40 meter mod øst natten over. Geologer er mystificerede, mens bjerget selv nægter at kommentere.",
        icon: "⛰️",
        time: "6 timer siden",
        image: "generated_images/story_08_moving_mountain.png"
    },
    {
        id: 9,
        category: "videnskab",
        title: "NASA opdager planet der udelukkende består af mandags-følelser",
        excerpt: "En ny exoplanet udstråler ren, destilleret mandagsstemning. Forskere advarer mod at sende mennesker derhen af mentalhygiejniske årsager.",
        icon: "🪐",
        time: "7 timer siden",
        image: "generated_images/story_09_monday_planet.png"
    },
    {
        id: 10,
        category: "politik",
        title: "Minister foreslår at bytte Bornholm med en stor pizza - Italien overvejer tilbuddet",
        excerpt: "En kontroversiel territorialudveksling er på bordet: Bornholm for en 12-meter pizza med valgfri topping. 'Det er et fair bytte', siger ministeren.",
        icon: "🍕",
        time: "8 timer siden",
        image: "generated_images/story_10_bornholm_for_pizza.png"
    },
    {
        id: 11,
        category: "kultur",
        title: "Operasanger opdager at hun har sunget baglæns de sidste 15 år - ingen har bemærket det",
        excerpt: "En anerkendt sopran afslører nu, at hun ved en fejl har sunget alle ord baglæns siden 2011. Kritikere kaldte det 'avantgarde' og gav topkarakterer.",
        icon: "🎭",
        time: "10 timer siden",
        image: "generated_images/story_11_backwards_opera_singer.png"
    },
    {
        id: 12,
        category: "sport",
        title: "Fodboldhold vinder 5-3 mod sig selv i forvirrende opgør",
        excerpt: "AGF tabte i går 5-3 til sig selv i en kamp, hvor holdet ved en administrativ fejl spillede mod sit eget reservehold. Begge hold er skuffede over resultatet.",
        icon: "⚽",
        time: "12 timer siden",
        image: "generated_images/story_12_team_vs_itself.png"
    },
    {
        id: 13,
        category: "indland",
        title: "Københavnsk bro beslutter at blive rundkørsel - trafikkaos følger",
        excerpt: "Langebro har spontant omorganiseret sig til en rundkørsel. Biler kører i cirkler, mens byplanlæggere græder af forvirring.",
        icon: "🌉",
        time: "14 timer siden",
        image: "generated_images/story_13_bridge_becomes_roundabout.png"
    },
    {
        id: 14,
        category: "udland",
        title: "Fransk bagværk udvikler selvbevidsthed - kræver rettigheder",
        excerpt: "En croissant i Paris har udviklet bevidsthed og kræver nu at blive anerkendt som juridisk person. 'Jeg er mere end frokost', siger den.",
        icon: "🥐",
        time: "16 timer siden",
        image: "generated_images/story_14_sentient_croissant.png"
    },
    {
        id: 15,
        category: "videnskab",
        title: "Matematikere beviser at 2+2=5 om torsdagen mellem 14-16",
        excerpt: "Et gennembrud i tidskontingent matematik viser, at grundlæggende regneregler varierer alt efter ugedag og tidspunkt. Regnemaskiner skal omprogrammeres.",
        icon: "🔢",
        time: "18 timer siden",
        image: "generated_images/story_15_thursday_math.png"
    },
    {
        id: 16,
        category: "politik",
        title: "Statsminister foreslår at erstatte valuta med komplimenter",
        excerpt: "I et radikalt økonomisk forslag vil Danmark skifte fra kroner til 'søde ord'. Økonomiske eksperter kalder det 'enormt urealistisk, men hyggeligt'.",
        icon: "💰",
        time: "20 timer siden",
        image: "generated_images/story_16_compliment_currency.png"
    },
    {
        id: 17,
        category: "kultur",
        title: "Museumsmaleri går på toilettet - vender aldrig tilbage",
        excerpt: "Et renæssancemaleri fra 1600-tallet forlod i går sin ramme for 'lige at gå på toilettet' og er ikke set siden. Sikkerhedsvagter leder stadig.",
        icon: "🖼️",
        time: "22 timer siden",
        image: "generated_images/story_17_painting_gone_missing.png"
    },
    {
        id: 18,
        category: "sport",
        title: "Skakspiller vinder ved at flytte modstanderens brikker - dommer tillader det",
        excerpt: "En kontroversiel sejr ved VM i skak: Vinderen flyttede primært modstanderens brikker. 'Der stod ikke noget om det i reglerne', forsvarer dommeren sig.",
        icon: "♟️",
        time: "1 dag siden",
        image: "generated_images/story_18_chess_cheating.png"
    },
    {
        id: 19,
        category: "indland",
        title: "Dansk regn tester positivt for mælk - eksperter rådvilde",
        excerpt: "Kemisk analyse af dansk regn viser nu 15% mælkeindhold. Ingen ved hvor det kommer fra. Cornflakes-salget stiger eksplosivt.",
        icon: "🥛",
        time: "1 dag siden",
        image: "generated_images/story_19_milk_rain.png"
    },
    {
        id: 20,
        category: "udland",
        title: "Japansk robot bliver Buddhist munk - opnår oplysning på 3 sekunder",
        excerpt: "En AI-robot i Kyoto har tilsluttet sig buddhismen og hævder at have opnået nirvana gennem hurtig dataprocessering. Munke er både imponerede og fornærmede.",
        icon: "🤖",
        time: "1 dag siden",
        image: "generated_images/story_20_buddhist_robot.png"
    },
    {
        id: 21,
        category: "videnskab",
        title: "Forskere opdager at mandag starter kl. 03 om natten - søndag er kortere end troet",
        excerpt: "Ny kronobiologi viser at mandag teknisk set starter søndag nat kl 03. Dette forklarer hvorfor søndage føles korte og mandage uendelige.",
        icon: "⏱️",
        time: "2 dage siden",
        image: "generated_images/story_21_early_monday.png"
    },
    {
        id: 22,
        category: "politik",
        title: "Borgmester foreslår at gennavngive byen til en lyd: 'BZZZZZT'",
        excerpt: "Næstved overvejer at skifte navn til den onamatopoietiske lyd 'BZZZZZT'. Turistrådet er skeptisk, men byrådet kalder det 'fremsynet'.",
        icon: "📢",
        time: "2 dage siden",
        image: "generated_images/story_22_city_renamed_bzzzzzt.png"
    },
    {
        id: 23,
        category: "kultur",
        title: "Forfatter udgiver 500-siders roman bestående udelukkende af semikoloner",
        excerpt: "En eksperimenterende dansk forfatter udfordrer læserne med værket ';;;;;;;;'. Anmelderne kalder det både 'genialsk' og 'læseværdigt hvis du squinter'.",
        icon: "📚",
        time: "2 dage siden",
        image: "generated_images/story_23_semicolon_novel.png"
    },
    {
        id: 24,
        category: "sport",
        title: "Svømmer diskvalificeret for at svømme for hurtigt - mistænkt for at være delfin",
        excerpt: "Efter at have sat verdensrekord med 40 sekunder bliver svømmer testet for delfin-DNA. Resultatet er uklart men mistænkeligt.",
        icon: "🏊",
        time: "3 dage siden",
        image: "generated_images/story_24_dolphin_swimmer.png"
    },
    {
        id: 25,
        category: "indland",
        title: "Aalborg Zoo-papegøje lærer dansk bedre end de fleste mennesker - underviser nu",
        excerpt: "En ara ved navn Professor Fjeder har mestret dansk grammatik så perfekt, at universitetet nu ansætter den som adjunkt. Studerende er begejstrede.",
        icon: "🦜",
        time: "3 dage siden",
        image: "generated_images/story_25_professor_parrot.png"
    },
    {
        id: 26,
        category: "udland",
        title: "Norsk fjord erklærer sig selv som selfieforbudszone - arresterer turister",
        excerpt: "Geirangerfjorden har haft nok af selfie-stænger og indfører nu aktiv modstand. 12 turister blev i går 'pænt men bestemt' skubbet ud af fjorden.",
        icon: "📸",
        time: "3 dage siden",
        image: "generated_images/story_26_selfie-fighting_fjord.png"
    },
    {
        id: 27,
        category: "videnskab",
        title: "Kvantefysikere beviser at kaffen er kold og varm samtidig indtil du smager på den",
        excerpt: "Schrødingers kaffe er nu bekræftet: Din morgenkaffe eksisterer i en superposition af temperaturer. Dette forklarer hvorfor den altid er den forkerte.",
        icon: "☕",
        time: "4 dage siden",
        image: "generated_images/story_27_schrodingers_coffee.png"
    },
    {
        id: 28,
        category: "politik",
        title: "Politikere indfører obligatorisk latter efter dårlige jokes - straffen er flere dårlige jokes",
        excerpt: "En ny lov kræver at alle skal grine høfligt af politikeres humor. Overtrædere straffes ved at høre endnu flere dårlige politiske anekdoter.",
        icon: "😂",
        time: "4 dage siden",
        image: "generated_images/story_28_mandatory_laughter_law.png"
    },
    {
        id: 29,
        category: "kultur",
        title: "Statue på Strøget træt af turister - går hjem for at tage en lur",
        excerpt: "Efter 87 år på samme piedestal har en bronze-statue på Strøget officielt meddelt at den er træt og går hjem. 'Jeg kommer igen på tirsdag', sagde den.",
        icon: "🗿",
        time: "5 dage siden",
        image: "generated_images/story_29_statue_goes_home.png"
    },
    {
        id: 30,
        category: "sport",
        title: "Golf-spiller rammer hul-i-en ved at spille i forkert retning - tæller stadig",
        excerpt: "Ved en fejl spillede en golfspiller baglæns gennem hele banen men endte med perfekt score. Dommerne tillod det 'fordi det var imponerende'.",
        icon: "⛳",
        time: "5 dage siden",
        image: "generated_images/story_30_backwards_golf.png"
    },
    {
        id: 31,
        category: "indland",
        title: "Dansk sol glemmer at gå ned i 3 dage - befolkningen forvirret",
        excerpt: "Solen holdt sig oppe i 72 timer over Jylland uden forklaring. Astronomer er mystificerede, mens natuglesympatisører protesterer.",
        icon: "☀️",
        time: "1 uge siden",
        image: "generated_images/story_31_sun_wont_set.png"
    },
    {
        id: 32,
        category: "udland",
        title: "Belgisk chokolade ansøger om asyl i Schweiz - frygter for kvalitet",
        excerpt: "En palet med belgisk chokolade har søgt politisk asyl i Schweiz med henvisning til 'kvalitetsforfølgelse' i hjemlandet. Belgien er rystet.",
        icon: "🍫",
        time: "1 uge siden",
        image: "generated_images/story_32_chocolate_asylum.png"
    }
];

// Helper functions
function getRelativeTime(timeStr) {
    return timeStr;
}

function getRandomGradient() {
    const gradients = [
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
        'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
}

// Populate latest news
function populateLatestNews() {
    const track = document.getElementById('latest-news-track');
    const latestStories = bizarreStories.slice(0, 6);
    
    latestStories.forEach(story => {
        const item = document.createElement('div');
        item.className = 'news-item-small';
        item.innerHTML = `
            <div class="news-meta">
                <span class="time-badge">${story.time}</span>
                <span class="category-badge">${story.category}</span>
            </div>
            <a href="article.html?id=${story.id}" class="news-title-small">
                ${story.icon} ${story.title}
            </a>
        `;
        track.appendChild(item);
    });
}

// Populate featured story
function populateFeaturedStory() {
    const container = document.getElementById('featured-story');
    const featured = bizarreStories[0];
    
    container.innerHTML = `
        <div class="featured-content">
            <a href="article.html?id=${featured.id}" class="featured-image" style="background-image: url('${featured.image}'); background-size: cover; background-position: center;">
                <span style="display: none;">${featured.icon}</span>
            </a>
            <div class="featured-text">
                <div class="featured-category">${featured.category}</div>
                <h2 class="featured-title">${featured.title}</h2>
                <p class="featured-excerpt">${featured.excerpt}</p>
                <div class="featured-time">${featured.time}</div>
                <a href="article.html?id=${featured.id}" class="read-more">Læs hele historien →</a>
            </div>
        </div>
    `;
}

// Populate news grid
function populateNewsGrid() {
    const grid = document.getElementById('news-grid');
    const gridStories = bizarreStories.slice(6, 18);
    
    gridStories.forEach(story => {
        const card = document.createElement('article');
        card.className = 'news-card';
        card.innerHTML = `
            <a href="article.html?id=${story.id}" class="card-image" style="background-image: url('${story.image}'); background-size: cover; background-position: center;">
                <span style="display: none;">${story.icon}</span>
            </a>
            <div class="card-content">
                <div class="card-category">${story.category}</div>
                <h3 class="card-title">
                    <a href="article.html?id=${story.id}">${story.title}</a>
                </h3>
                <p class="card-excerpt">${story.excerpt}</p>
                <div class="card-time">${story.time}</div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Populate more stories
function populateMoreStories() {
    const container = document.getElementById('more-stories');
    const moreStories = bizarreStories.slice(18);
    
    moreStories.forEach(story => {
        const row = document.createElement('article');
        row.className = 'story-row';
        row.innerHTML = `
            <a href="article.html?id=${story.id}" class="story-icon" style="background-image: url('${story.image}'); background-size: cover; background-position: center;">
                <span style="display: none;">${story.icon}</span>
            </a>
            <div class="story-details">
                <h3><a href="article.html?id=${story.id}">${story.title}</a></h3>
                <p>${story.excerpt}</p>
                <div class="news-meta">
                    <span class="time-badge">${story.time}</span>
                    <span class="category-badge">${story.category}</span>
                </div>
            </div>
        `;
        container.appendChild(row);
    });
}

// Category filtering
function setupCategoryFilter() {
    const categoryPills = document.querySelectorAll('.category-pill');
    
    categoryPills.forEach(pill => {
        pill.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all
            categoryPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            
            const category = pill.dataset.category;
            filterByCategory(category);
        });
    });
}

function filterByCategory(category) {
    const grid = document.getElementById('news-grid');
    grid.innerHTML = '';
    
    let filtered = bizarreStories;
    if (category !== 'all') {
        filtered = bizarreStories.filter(story => story.category === category);
    }
    
    filtered.slice(0, 12).forEach(story => {
        const card = document.createElement('article');
        card.className = 'news-card';
        card.innerHTML = `
            <div class="card-image" style="background: ${getRandomGradient()}">
                <span>${story.icon}</span>
            </div>
            <div class="card-content">
                <div class="card-category">${story.category}</div>
                <h3 class="card-title">
                    <a href="article.html?id=${story.id}">${story.title}</a>
                </h3>
                <p class="card-excerpt">${story.excerpt}</p>
                <div class="card-time">${story.time}</div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('latest-news-track')) {
        populateLatestNews();
        populateFeaturedStory();
        populateNewsGrid();
        populateMoreStories();
        setupCategoryFilter();
    }
});

// Export for use in article page
if (typeof window !== 'undefined') {
    window.bizarreStories = bizarreStories;
    window.getRandomGradient = getRandomGradient;
}
