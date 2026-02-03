// Generate detailed article content
function generateArticleBody(story) {
    const paragraphs = [
        `${story.excerpt} Det bekræfter flere kilder tæt på situationen.`,
        `"Dette er helt uden præcedens," udtaler professor i absurdologi, Dr. Mortensen fra Københavns Universitet. "Vi har aldrig set noget lignende, og vi forstår ærligt talt ikke hvordan det er muligt."`,
        `Sagen har vakt international opmærksomhed, og eksperter fra hele verden er nu på vej til Danmark for at undersøge fænomenet nærmere. FN har endnu ikke kommenteret situationen, men kilder tæt på organisationen fortæller at der er "stor bekymring og endnu større forvirring".`,
        `Lokale myndigheder opfordrer befolkningen til at forholde sig rolige og ikke træffe forhastede beslutninger. "Vi ved at dette virker mærkeligt, men vi beder alle om at bevare roen indtil vi forstår hvad der foregår," lyder det i en pressemeddelelse.`,
        `Sociale medier har været i kog siden nyheden brød. Hashtagget #${story.category}kaos er trending på Twitter, og mange deler deres egne teorier om hvad der kan være årsagen.`,
        `"Jeg har arbejdet med ${story.category} i 30 år, og jeg har aldrig oplevet noget så bizart," fortæller en anonym kilde. "Dette vil ændre alt hvad vi troede vi vidste."`,
        `Videnskabelige tidsskrifter verden over forbereder sig nu på at publicere artikler om fænomenet, selvom ingen endnu kan forklare de grundlæggende mekanismer bag begivenheden.`,
        `Regeringen har indkaldt til pressemøde senere i dag, hvor man forventes at præsentere en handleplan. Opposition kalder situationen for "absurd men også ret interessant".`,
        `Eksperter advarer mod at drage forhastede konklusioner. "Vi skal have alle fakta på bordet før vi kan sige noget med sikkerhed," udtaler cheffen for Institut for Usandsynlige Begivenheder.`,
        `Sagen udvikler sig stadig, og vi vil løbende opdatere denne artikel med nye oplysninger efterhånden som de kommer frem.`
    ];
    
    return paragraphs.join('</p><p>');
}

function getStoryById(id) {
    return window.bizarreStories.find(story => story.id === parseInt(id));
}

function renderArticle() {
    // Get article ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');
    
    if (!articleId) {
        document.getElementById('article-content').innerHTML = '<p>Artikel ikke fundet.</p>';
        return;
    }
    
    const story = getStoryById(articleId);
    
    if (!story) {
        document.getElementById('article-content').innerHTML = '<p>Artikel ikke fundet.</p>';
        return;
    }
    
    // Update page title
    document.title = `${story.title} - BR`;
    
    // Render article
    const articleContainer = document.getElementById('article-content');
    articleContainer.innerHTML = `
        <header class="article-header">
            <div class="article-category">${story.category}</div>
            <h1 class="article-title">${story.title}</h1>
            <p class="article-excerpt">${story.excerpt}</p>
            <div class="article-meta-info">
                <span>Publiceret: ${story.time}</span>
                <span>Kategori: ${story.category}</span>
                <span>Troværdighed: 0%</span>
            </div>
        </header>
        
        <div class="article-image" style="background-image: url('${story.image}'); background-size: cover; background-position: center;">
            <span style="display: none;">${story.icon}</span>
        </div>
        
        <div class="article-body">
            <p>${generateArticleBody(story)}</p>
        </div>
        
        <div style="margin-top: 2rem; padding: 1.5rem; background: #f7f7f7; border-radius: 8px; border-left: 4px solid #e30613;">
            <p style="font-weight: 600; margin-bottom: 0.5rem;">⚠️ Redaktionel note:</p>
            <p style="font-size: 0.875rem; color: #666;">Denne artikel er 100% opdigtet og en del af en satirisk parodi-side. Ingen af oplysningerne er sande eller baseret på virkelige begivenheder. Hensigten er udelukkende underholdning.</p>
        </div>
    `;
    
    // Render related stories
    renderRelatedStories(story.id, story.category);
}

function renderRelatedStories(currentId, category) {
    const relatedContainer = document.getElementById('related-stories');
    
    // Get 4 random stories from same category (excluding current article)
    let relatedStories = window.bizarreStories
        .filter(s => s.id !== parseInt(currentId) && s.category === category)
        .sort(() => 0.5 - Math.random())
        .slice(0, 4);
    
    // If not enough in same category, add random ones
    if (relatedStories.length < 4) {
        const additionalStories = window.bizarreStories
            .filter(s => s.id !== parseInt(currentId) && !relatedStories.includes(s))
            .sort(() => 0.5 - Math.random())
            .slice(0, 4 - relatedStories.length);
        relatedStories = [...relatedStories, ...additionalStories];
    }
    
    relatedStories.forEach(story => {
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
        relatedContainer.appendChild(row);
    });
}

// Initialize article page
document.addEventListener('DOMContentLoaded', () => {
    renderArticle();
});
