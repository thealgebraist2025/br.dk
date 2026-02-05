// Bizarre stories based on real DR.dk news - Updated 2026-02-04 12:23
const bizarreStories = [
    {
        "id": 1,
        "category": "indland",
        "title": "Torsdag og fredag:Prognose har store mængder sne over Nordjylland og Sjælland - men baglæns",
        "excerpt": "Denne historie viser igen at virkeligheden er mærkeligere end fiktion. Eksperter er fortsat i møde om sagen.",
        "icon": "⚡",
        "time": "2 min. siden",
        "image": "generated_images/story_01_dr_based.png"
    },
    {
        "id": 2,
        "category": "udland",
        "title": "DMI varsler snestorm i store dele af landet - og ingen kan forklare hvorfor",
        "excerpt": "Ingen så det komme, men nu er det en realitet. Befolkningen reagerer med forvirring og fascination.",
        "icon": "🔥",
        "time": "15 min. siden",
        "image": "generated_images/story_02_dr_based.png"
    },
    {
        "id": 3,
        "category": "politik",
        "title": "67 smågrise døde af overophedning, men chauffør blev frifundet. Nu vil politikere kigge på loven - eksperter er forvirrede",
        "excerpt": "I en udvikling der overraskede alle, bekræfter kilder at dette faktisk er sket. Mere følger.",
        "icon": "💫",
        "time": "1 time siden",
        "image": "generated_images/story_03_dr_based.png"
    },
    {
        "id": 4,
        "category": "kultur",
        "title": "Overraskende: flugtfange ventede på plads i andet fængsel",
        "excerpt": "Dette er ikke det første tilfælde af sin art, men muligvis det mærkeligste. Undersøgelser er i gang.",
        "icon": "🎭",
        "time": "2 timer siden",
        "image": "generated_images/story_04_dr_based.png"
    },
    {
        "id": 5,
        "category": "videnskab",
        "title": "Københavns Kommune får kritik:Respekterede ikke lærers ytringsfrihed - virkeligheden overrasker igen",
        "excerpt": "Eksperter kalder det 'uhørt' og 'fascinerende på samme tid'. Sagen udvikler sig stadig.",
        "icon": "🌟",
        "time": "3 timer siden",
        "image": "generated_images/story_05_dr_based.png"
    },
    {
        "id": 6,
        "category": "sport",
        "title": "Mystisk: naturbrande truer urskov i patagonien",
        "excerpt": "Denne historie viser igen at virkeligheden er mærkeligere end fiktion. Eksperter er fortsat i møde om sagen.",
        "icon": "🎪",
        "time": "5 timer siden",
        "image": "generated_images/story_06_dr_based.png"
    },
    {
        "id": 7,
        "category": "indland",
        "title": "Draco Malfoy er nytårsmaskot i Kina - og det er ikke en joke",
        "excerpt": "Ingen så det komme, men nu er det en realitet. Befolkningen reagerer med forvirring og fascination.",
        "icon": "🎨",
        "time": "8 timer siden",
        "image": "generated_images/story_07_dr_based.png"
    },
    {
        "id": 8,
        "category": "udland",
        "title": "Bekræftet: tidligere novo-direktør fik over 100 millioner med sig efter fyring",
        "excerpt": "I en udvikling der overraskede alle, bekræfter kilder at dette faktisk er sket. Mere følger.",
        "icon": "🎯",
        "time": "1 dag siden",
        "image": "generated_images/story_08_dr_based.png"
    },
    {
        "id": 9,
        "category": "politik",
        "title": "Er Novo Nordisk i krise? Nej, siger topchef efter historisk melding og blodbad på børsen - men baglæns",
        "excerpt": "Dette er ikke det første tilfælde af sin art, men muligvis det mærkeligste. Undersøgelser er i gang.",
        "icon": "🎲",
        "time": "2 dage siden",
        "image": "generated_images/story_09_dr_based.png"
    },
    {
        "id": 10,
        "category": "kultur",
        "title": "Mia skrev 1-stjernet anmeldelse af brudebutik:Så skrev ejer, at hun var meldt til kommunen for børneforsømmelse - og ingen kan forklare hvorfor",
        "excerpt": "Eksperter kalder det 'uhørt' og 'fascinerende på samme tid'. Sagen udvikler sig stadig.",
        "icon": "🎰",
        "time": "2 dage siden",
        "image": "generated_images/story_10_dr_based.png"
    },
    {
        "id": 11,
        "category": "videnskab",
        "title": "Over 150.000 drevet på flugt i Syrien - eksperter er forvirrede",
        "excerpt": "Denne historie viser igen at virkeligheden er mærkeligere end fiktion. Eksperter er fortsat i møde om sagen.",
        "icon": "🎺",
        "time": "2 dage siden",
        "image": "generated_images/story_11_dr_based.png"
    },
    {
        "id": 12,
        "category": "sport",
        "title": "Overraskende: novo nordisk-aktie falder massivt efter årsregnskab",
        "excerpt": "Ingen så det komme, men nu er det en realitet. Befolkningen reagerer med forvirring og fascination.",
        "icon": "🎸",
        "time": "2 dage siden",
        "image": "generated_images/story_12_dr_based.png"
    },
    {
        "id": 13,
        "category": "indland",
        "title": "Frosten driller færger til små øer i Kattegat - virkeligheden overrasker igen",
        "excerpt": "I en udvikling der overraskede alle, bekræfter kilder at dette faktisk er sket. Mere følger.",
        "icon": "🎻",
        "time": "2 dage siden",
        "image": "generated_images/story_13_dr_based.png"
    },
    {
        "id": 14,
        "category": "udland",
        "title": "Mystisk: danmarksdemokraterne står splittet i sag om færge",
        "excerpt": "Dette er ikke det første tilfælde af sin art, men muligvis det mærkeligste. Undersøgelser er i gang.",
        "icon": "🎬",
        "time": "2 dage siden",
        "image": "generated_images/story_14_dr_based.png"
    },
    {
        "id": 15,
        "category": "politik",
        "title": "Vintertæpper og varmekanoner skal sikre, at arbejdet på Aarhus H ikke skrider - og det er ikke en joke",
        "excerpt": "Eksperter kalder det 'uhørt' og 'fascinerende på samme tid'. Sagen udvikler sig stadig.",
        "icon": "📺",
        "time": "2 dage siden",
        "image": "generated_images/story_15_dr_based.png"
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
