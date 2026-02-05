#!/usr/bin/env python3
"""
Update BR.dk with bizarre versions of real stories from DR.dk
"""

import requests
from bs4 import BeautifulSoup
import json
import re
from datetime import datetime

def fetch_dr_stories():
    """Fetch stories from DR.dk"""
    url = "https://www.dr.dk/nyheder"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    }
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')
        
        stories = []
        
        # Find news headlines - DR uses various structures
        # Look for common patterns
        headlines = soup.find_all(['h2', 'h3', 'a'], limit=50)
        
        for headline in headlines:
            text = headline.get_text(strip=True)
            if text and len(text) > 20 and len(text) < 200:
                # Filter out navigation and other non-story elements
                if not any(skip in text.lower() for skip in ['læs mere', 'gå til', 'kontakt', 'søg', 'menu']):
                    stories.append(text)
        
        # Remove duplicates while preserving order
        seen = set()
        unique_stories = []
        for story in stories:
            if story not in seen:
                seen.add(story)
                unique_stories.append(story)
        
        return unique_stories[:15]  # Get top 15 stories
        
    except Exception as e:
        print(f"Error fetching DR stories: {e}")
        return []

def bizarrify_story(original_title, index):
    """Transform a real DR story into a bizarre BR version"""
    
    categories = ["indland", "udland", "politik", "kultur", "videnskab", "sport"]
    category = categories[index % len(categories)]
    
    icons = ["⚡", "🔥", "💫", "🎭", "🌟", "🎪", "🎨", "🎯", "🎲", "🎰", "🎺", "🎸", 
             "🎻", "🎬", "📺", "📻", "📡", "🔔", "🎖️", "🏆", "🎓", "🎁"]
    icon = icons[index % len(icons)]
    
    # Simple time variations
    times = ["2 min. siden", "15 min. siden", "1 time siden", "2 timer siden", 
             "3 timer siden", "5 timer siden", "8 timer siden", "1 dag siden", 
             "2 dage siden"]
    time = times[min(index, len(times)-1)]
    
    # Create bizarre twist on the original
    bizarre_templates = [
        lambda t: f"{t} - men baglæns",
        lambda t: f"{t} - og ingen kan forklare hvorfor",
        lambda t: f"{t} - eksperter er forvirrede",
        lambda t: f"Overraskende: {t.lower()}",
        lambda t: f"{t} - virkeligheden overrasker igen",
        lambda t: f"Mystisk: {t.lower()}",
        lambda t: f"{t} - og det er ikke en joke",
        lambda t: f"Bekræftet: {t.lower()}",
    ]
    
    bizarre_title = bizarre_templates[index % len(bizarre_templates)](original_title)
    
    excerpt_templates = [
        f"Denne historie viser igen at virkeligheden er mærkeligere end fiktion. Eksperter er fortsat i møde om sagen.",
        f"Ingen så det komme, men nu er det en realitet. Befolkningen reagerer med forvirring og fascination.",
        f"I en udvikling der overraskede alle, bekræfter kilder at dette faktisk er sket. Mere følger.",
        f"Dette er ikke det første tilfælde af sin art, men muligvis det mærkeligste. Undersøgelser er i gang.",
        f"Eksperter kalder det 'uhørt' og 'fascinerende på samme tid'. Sagen udvikler sig stadig.",
    ]
    
    excerpt = excerpt_templates[index % len(excerpt_templates)]
    
    return {
        "id": index + 1,
        "category": category,
        "title": bizarre_title,
        "excerpt": excerpt,
        "icon": icon,
        "time": time,
        "image": f"generated_images/story_{str(index+1).zfill(2)}_dr_based.png"
    }

def update_script_js(stories_data):
    """Update script.js with new stories"""
    
    js_content = f"""// Bizarre stories based on real DR.dk news - Updated {datetime.now().strftime('%Y-%m-%d %H:%M')}
const bizarreStories = {json.dumps(stories_data, ensure_ascii=False, indent=4)};

// Helper functions
function getRelativeTime(timeStr) {{
    return timeStr;
}}

function getRandomGradient() {{
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
}}

// Populate latest news
function populateLatestNews() {{
    const track = document.getElementById('latest-news-track');
    const latestStories = bizarreStories.slice(0, 6);
    
    latestStories.forEach(story => {{
        const item = document.createElement('div');
        item.className = 'news-item-small';
        item.innerHTML = `
            <div class="news-meta">
                <span class="time-badge">${{story.time}}</span>
                <span class="category-badge">${{story.category}}</span>
            </div>
            <a href="article.html?id=${{story.id}}" class="news-title-small">
                ${{story.icon}} ${{story.title}}
            </a>
        `;
        track.appendChild(item);
    }});
}}

// Populate featured story
function populateFeaturedStory() {{
    const container = document.getElementById('featured-story');
    const featured = bizarreStories[0];
    
    container.innerHTML = `
        <div class="featured-content">
            <a href="article.html?id=${{featured.id}}" class="featured-image" style="background-image: url('${{featured.image}}'); background-size: cover; background-position: center;">
                <span style="display: none;">${{featured.icon}}</span>
            </a>
            <div class="featured-text">
                <div class="featured-category">${{featured.category}}</div>
                <h2 class="featured-title">${{featured.title}}</h2>
                <p class="featured-excerpt">${{featured.excerpt}}</p>
                <div class="featured-time">${{featured.time}}</div>
                <a href="article.html?id=${{featured.id}}" class="read-more">Læs hele historien →</a>
            </div>
        </div>
    `;
}}

// Populate news grid
function populateNewsGrid() {{
    const grid = document.getElementById('news-grid');
    const gridStories = bizarreStories.slice(6, 18);
    
    gridStories.forEach(story => {{
        const card = document.createElement('article');
        card.className = 'news-card';
        card.innerHTML = `
            <a href="article.html?id=${{story.id}}" class="card-image" style="background-image: url('${{story.image}}'); background-size: cover; background-position: center;">
                <span style="display: none;">${{story.icon}}</span>
            </a>
            <div class="card-content">
                <div class="card-category">${{story.category}}</div>
                <h3 class="card-title">
                    <a href="article.html?id=${{story.id}}">${{story.title}}</a>
                </h3>
                <p class="card-excerpt">${{story.excerpt}}</p>
                <div class="card-time">${{story.time}}</div>
            </div>
        `;
        grid.appendChild(card);
    }});
}}

// Populate more stories
function populateMoreStories() {{
    const container = document.getElementById('more-stories');
    const moreStories = bizarreStories.slice(18);
    
    moreStories.forEach(story => {{
        const row = document.createElement('article');
        row.className = 'story-row';
        row.innerHTML = `
            <a href="article.html?id=${{story.id}}" class="story-icon" style="background-image: url('${{story.image}}'); background-size: cover; background-position: center;">
                <span style="display: none;">${{story.icon}}</span>
            </a>
            <div class="story-details">
                <h3><a href="article.html?id=${{story.id}}">${{story.title}}</a></h3>
                <p>${{story.excerpt}}</p>
                <div class="news-meta">
                    <span class="time-badge">${{story.time}}</span>
                    <span class="category-badge">${{story.category}}</span>
                </div>
            </div>
        `;
        container.appendChild(row);
    }});
}}

// Category filtering
function setupCategoryFilter() {{
    const categoryPills = document.querySelectorAll('.category-pill');
    
    categoryPills.forEach(pill => {{
        pill.addEventListener('click', (e) => {{
            e.preventDefault();
            
            // Remove active class from all
            categoryPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            
            const category = pill.dataset.category;
            filterByCategory(category);
        }});
    }});
}}

function filterByCategory(category) {{
    const grid = document.getElementById('news-grid');
    grid.innerHTML = '';
    
    let filtered = bizarreStories;
    if (category !== 'all') {{
        filtered = bizarreStories.filter(story => story.category === category);
    }}
    
    filtered.slice(0, 12).forEach(story => {{
        const card = document.createElement('article');
        card.className = 'news-card';
        card.innerHTML = `
            <div class="card-image" style="background: ${{getRandomGradient()}}">
                <span>${{story.icon}}</span>
            </div>
            <div class="card-content">
                <div class="card-category">${{story.category}}</div>
                <h3 class="card-title">
                    <a href="article.html?id=${{story.id}}">${{story.title}}</a>
                </h3>
                <p class="card-excerpt">${{story.excerpt}}</p>
                <div class="card-time">${{story.time}}</div>
            </div>
        `;
        grid.appendChild(card);
    }});
}}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {{
    if (document.getElementById('latest-news-track')) {{
        populateLatestNews();
        populateFeaturedStory();
        populateNewsGrid();
        populateMoreStories();
        setupCategoryFilter();
    }}
}});

// Export for use in article page
if (typeof window !== 'undefined') {{
    window.bizarreStories = bizarreStories;
    window.getRandomGradient = getRandomGradient;
}}
"""
    
    with open('script.js', 'w', encoding='utf-8') as f:
        f.write(js_content)
    
    print(f"✅ Updated script.js with {len(stories_data)} stories")

def main():
    print("🔄 Fetching stories from DR.dk...")
    dr_stories = fetch_dr_stories()
    
    if not dr_stories:
        print("❌ No stories fetched from DR.dk")
        return
    
    print(f"📰 Found {len(dr_stories)} stories from DR.dk")
    
    print("🎭 Creating bizarre versions...")
    bizarre_stories = []
    for i, story in enumerate(dr_stories):
        bizarre = bizarrify_story(story, i)
        bizarre_stories.append(bizarre)
        print(f"  {i+1}. {story[:60]}...")
    
    print("\n💾 Updating script.js...")
    update_script_js(bizarre_stories)
    
    print("\n✨ BR.dk has been updated with DR.dk stories!")
    print(f"   Total stories: {len(bizarre_stories)}")
    print(f"   Updated: {datetime.now().strftime('%Y-%m-%d %H:%M')}")

if __name__ == "__main__":
    main()
