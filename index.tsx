
import { MAD_LIST, MadItem } from './database';

declare const gsap: any;
declare const ScrollTrigger: any;
declare const Lenis: any;

// Register GSAP Plugin
gsap.registerPlugin(ScrollTrigger);

// --- Initialization ---
const container = document.getElementById('gallery-container');
const searchInput = document.getElementById('search-input') as HTMLInputElement;
const navRuler = document.getElementById('nav-ruler');
const progressBar = document.querySelector('.progress-bar');

// --- Render Functions ---

const createCardHTML = (item: MadItem) => {
    const tagsHTML = item.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
    
    return `
    <article class="mad-card" id="rank-${item.rank}" data-title="${item.title}" data-author="${item.author}">
        <div class="card-visual">
            <div class="scanline-overlay"></div>
            <img class="card-img" src="${item.coverUrl}" alt="${item.title}" loading="lazy" decoding="async" 
                 onerror="this.parentElement.classList.add('no-signal'); this.style.display='none';">
        </div>
        <div class="card-info">
            <div class="card-rank">${String(item.rank).padStart(2, '0')}</div>
            <h2 class="card-title">${item.title}</h2>
            <div class="card-meta">
                <span class="meta-id">ID: ${item.id}</span>
                <span class="meta-author">AUTHOR: ${item.author}</span>
            </div>
            <p class="card-comment">${item.comment}</p>
            <div class="card-tags">
                ${tagsHTML}
            </div>
        </div>
    </article>
    `;
};

const renderGallery = (data: MadItem[]) => {
    if (!container) return;
    const fullHTML = data.map(createCardHTML).join('');
    container.innerHTML = fullHTML;
    
    // Initialize animations after DOM update
    requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        initCardAnimations();
    });
};

const renderNav = () => {
    if (!navRuler) return;
    let html = '';
    for (let i = 1; i <= 100; i += 10) {
        html += `<div class="timeline-mark" data-rank="${i}">${i}</div>`;
    }
    html += `<div class="timeline-mark" data-rank="100">100</div>`;
    navRuler.innerHTML = html;

    // Attach Click Events manually since we are in a module
    const marks = navRuler.querySelectorAll('.timeline-mark');
    marks.forEach(mark => {
        mark.addEventListener('click', () => {
            const rank = mark.getAttribute('data-rank');
            scrollToRank(Number(rank));
        });
    });
};

// --- Animation Logic ---

function initCardAnimations() {
    const cards = document.querySelectorAll('.mad-card');
    
    cards.forEach(card => {
        const img = card.querySelector('.card-img');
        const rank = card.querySelector('.card-rank');

        // 1. Entrance
        gsap.fromTo(card, 
            { opacity: 0, y: 100 },
            {
                opacity: 1, 
                y: 0, 
                duration: 0.8, 
                ease: "power2.out",
                scrollTrigger: {
                    trigger: card,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            }
        );

        // 2. Parallax
        if (img) {
            gsap.fromTo(img,
                { scale: 1.0 },
                {
                    scale: 1.2,
                    ease: "none",
                    scrollTrigger: {
                        trigger: card,
                        scrub: true,
                        start: "top bottom",
                        end: "bottom top"
                    }
                }
            );
        }

        // 3. Rank Float
        if (rank) {
            gsap.fromTo(rank,
                { opacity: 0, x: -50 },
                {
                    opacity: 0.15,
                    x: 0,
                    duration: 1,
                    scrollTrigger: {
                        trigger: card,
                        start: "top 70%"
                    }
                }
            );
        }
    });
}

// Header Glitch
gsap.from("header h1", {
    duration: 1.5,
    opacity: 0,
    y: 50,
    skewX: 10,
    ease: "power4.out",
    delay: 0.2
});

// Mobile Progress Bar
if (progressBar) {
    gsap.to(progressBar, {
        width: "100%",
        ease: "none",
        scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.3
        }
    });
}

// --- Smooth Scroll (Lenis) ---
const lenis = new Lenis({
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
});

function raf(time: number) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

const scrollToRank = (rank: number) => {
    const el = document.getElementById(`rank-${rank}`);
    if (el) {
        lenis.scrollTo(el, { offset: -100 });
    }
};

// --- Interaction ---
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const target = e.target as HTMLInputElement;
        const keyword = target.value.toLowerCase();
        const cards = document.querySelectorAll('.mad-card');
        
        cards.forEach(card => {
            const title = card.getAttribute('data-title')?.toLowerCase() || "";
            const author = card.getAttribute('data-author')?.toLowerCase() || "";
            
            if (title.includes(keyword) || author.includes(keyword)) {
                card.classList.remove('hidden');
                gsap.set(card, { opacity: 1, y: 0 }); 
            } else {
                card.classList.add('hidden');
            }
        });
        ScrollTrigger.refresh();
    });
}

// --- Run ---
renderNav();
renderGallery(MAD_LIST);
