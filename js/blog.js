/* =============================================
   AZEKA CONSULTING — Blog Engine
   Client-side Markdown blog with search, tags,
   pagination, and article rendering
   ============================================= */

const POSTS_PER_PAGE = 6;
const POSTS_INDEX_URL = 'posts/index.json';

// --- State ---
let allPosts = [];
let filteredPosts = [];
let currentPage = 1;
let activeTag = null;
let searchQuery = '';

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();

    // Detect page context after DOM is ready
    const isArticlePage = document.getElementById('articleContent') !== null;
    const isBlogPage = document.getElementById('blogGrid') !== null;

    if (isBlogPage) {
        initBlogListing();
    } else if (isArticlePage) {
        initArticleReader();
    }
});

/* =============================================
   MOBILE MENU (shared)
   ============================================= */
function initMobileMenu() {
    const toggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');
    if (!toggle || !navLinks) return;

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

/* =============================================
   BLOG LISTING PAGE
   ============================================= */
async function initBlogListing() {
    try {
        const response = await fetch(POSTS_INDEX_URL);
        if (!response.ok) throw new Error('Failed to load posts index');
        allPosts = await response.json();

        // Sort by date descending
        allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
        filteredPosts = [...allPosts];

        // Check URL params for tag filter
        const urlParams = new URLSearchParams(window.location.search);
        const tagParam = urlParams.get('tag');
        if (tagParam) {
            activeTag = tagParam;
        }

        renderTagsCloud();
        applyFilters();
        initSearch();
    } catch (error) {
        console.error('Error loading posts:', error);
        document.getElementById('blogGrid').innerHTML = `
      <div class="no-results">
        <div class="no-results-icon">⚠️</div>
        <h3>Erreur de chargement</h3>
        <p>Impossible de charger les articles. Veuillez réessayer.</p>
      </div>
    `;
    }
}

function renderTagsCloud() {
    const tagsCloud = document.getElementById('tagsCloud');
    if (!tagsCloud) return;

    // Count tags
    const tagCounts = {};
    allPosts.forEach(post => {
        (post.tags || []).forEach(tag => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
    });

    // Sort tags by count
    const sortedTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);

    // "All" button
    let html = `<button class="tag-btn ${!activeTag ? 'active' : ''}" data-tag="">
    Tous <span class="tag-count">(${allPosts.length})</span>
  </button>`;

    sortedTags.forEach(([tag, count]) => {
        html += `<button class="tag-btn ${activeTag === tag ? 'active' : ''}" data-tag="${tag}">
      ${tag} <span class="tag-count">(${count})</span>
    </button>`;
    });

    tagsCloud.innerHTML = html;

    // Bind clicks
    tagsCloud.querySelectorAll('.tag-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            activeTag = btn.dataset.tag || null;
            currentPage = 1;

            // Update active state
            tagsCloud.querySelectorAll('.tag-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            applyFilters();
        });
    });
}

function initSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchClear = document.getElementById('searchClear');
    if (!searchInput) return;

    let debounceTimer;

    searchInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            searchQuery = searchInput.value.trim().toLowerCase();
            currentPage = 1;
            applyFilters();

            if (searchClear) {
                searchClear.classList.toggle('visible', searchQuery.length > 0);
            }
        }, 250);
    });

    if (searchClear) {
        searchClear.addEventListener('click', () => {
            searchInput.value = '';
            searchQuery = '';
            currentPage = 1;
            searchClear.classList.remove('visible');
            applyFilters();
            searchInput.focus();
        });
    }
}

function applyFilters() {
    filteredPosts = allPosts.filter(post => {
        // Tag filter
        if (activeTag && !(post.tags || []).includes(activeTag)) return false;

        // Search filter
        if (searchQuery) {
            const searchable = [
                post.title,
                post.description,
                ...(post.tags || [])
            ].join(' ').toLowerCase();
            return searchable.includes(searchQuery);
        }

        return true;
    });

    renderResultsInfo();
    renderBlogGrid();
    renderPagination();
}

function renderResultsInfo() {
    const info = document.getElementById('resultsInfo');
    if (!info) return;

    const total = filteredPosts.length;
    let text = `${total} article${total !== 1 ? 's' : ''}`;

    if (activeTag) text += ` · Tag : ${activeTag}`;
    if (searchQuery) text += ` · Recherche : "${searchQuery}"`;

    info.textContent = text;
}

function renderBlogGrid() {
    const grid = document.getElementById('blogGrid');
    const noResults = document.getElementById('noResults');
    if (!grid) return;

    const start = (currentPage - 1) * POSTS_PER_PAGE;
    const pagePosts = filteredPosts.slice(start, start + POSTS_PER_PAGE);

    if (pagePosts.length === 0) {
        grid.innerHTML = '';
        if (noResults) noResults.style.display = 'block';
        return;
    }

    if (noResults) noResults.style.display = 'none';

    // Map of emojis for tags
    const emojiMap = {
        'GenAI': '🤖', 'RAG': '🔍', 'LLM': '🧠', 'Architecture': '🕸️',
        'Data Engineering': '⚡', 'Cloud': '☁️', 'Multi-Agent': '🤝',
        'MLOps': '⚙️', 'REX': '📋', 'Tutorial': '📚', 'Orchestration': '🔄',
        'Python': '🐍', 'Lakehouse': '🏠'
    };

    grid.innerHTML = pagePosts.map(post => {
        const primaryTag = (post.tags || [])[0] || '';
        const emoji = emojiMap[primaryTag] || '📝';
        const dateStr = formatDate(post.date);
        const tagsHtml = (post.tags || []).map(t =>
            `<span class="card-tag">${t}</span>`
        ).join('');

        return `
      <a href="article.html?slug=${post.slug}" class="glass-card blog-listing-card">
        <div class="card-image">
          <span class="card-emoji">${emoji}</span>
          <span class="card-category">${primaryTag}</span>
        </div>
        <div class="card-body">
          <div class="card-meta">
            <span>${dateStr}</span>
            <span>·</span>
            <span>${post.readTime || '5 min'}</span>
          </div>
          <div class="card-title">${escapeHtml(post.title)}</div>
          <div class="card-description">${escapeHtml(post.description)}</div>
          <div class="card-tags">${tagsHtml}</div>
        </div>
      </a>
    `;
    }).join('');
}

function renderPagination() {
    const paginationEl = document.getElementById('pagination');
    if (!paginationEl) return;

    const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);

    if (totalPages <= 1) {
        paginationEl.innerHTML = '';
        return;
    }

    let html = '';

    // Previous
    html += `<button class="pagination-btn" ${currentPage === 1 ? 'disabled' : ''} data-page="${currentPage - 1}">←</button>`;

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (totalPages > 7 && i > 3 && i < totalPages - 1 && Math.abs(i - currentPage) > 1) {
            if (i === 4 || i === totalPages - 2) html += `<span class="pagination-btn" style="cursor:default; border:none;">...</span>`;
            continue;
        }
        html += `<button class="pagination-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
    }

    // Next
    html += `<button class="pagination-btn" ${currentPage === totalPages ? 'disabled' : ''} data-page="${currentPage + 1}">→</button>`;

    paginationEl.innerHTML = html;

    // Bind clicks
    paginationEl.querySelectorAll('.pagination-btn[data-page]').forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.disabled) return;
            currentPage = parseInt(btn.dataset.page);
            renderBlogGrid();
            renderPagination();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}

/* =============================================
   ARTICLE READER PAGE
   ============================================= */
async function initArticleReader() {
    const slug = new URLSearchParams(window.location.search).get('slug');
    if (!slug) {
        showArticleError('Aucun article spécifié.');
        return;
    }

    try {
        // Load index to get metadata and nav
        const indexResponse = await fetch(POSTS_INDEX_URL);
        if (!indexResponse.ok) throw new Error('Failed to load index');
        allPosts = await indexResponse.json();
        allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

        const postIndex = allPosts.findIndex(p => p.slug === slug);
        if (postIndex === -1) {
            showArticleError('Article introuvable.');
            return;
        }

        const post = allPosts[postIndex];

        // Update page meta
        document.title = `${post.title} — Azeka Consulting`;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.content = post.description;

        // Render header
        renderArticleHeader(post);

        // Load and render Markdown
        const mdResponse = await fetch(`posts/${slug}.md`);
        if (!mdResponse.ok) throw new Error('Failed to load article');
        const mdText = await mdResponse.text();

        // Strip front-matter
        const content = stripFrontMatter(mdText);

        // Render Markdown
        renderMarkdown(content);

        // Generate TOC
        generateTOC();

        // Render prev/next nav
        renderArticleNav(postIndex);

        // Init TOC scroll tracking
        initTOCTracking();

    } catch (error) {
        console.error('Error loading article:', error);
        showArticleError('Erreur lors du chargement de l\'article.');
    }
}

function renderArticleHeader(post) {
    const header = document.getElementById('articleHeader');
    if (!header) return;

    const dateStr = formatDate(post.date);
    const tagsHtml = (post.tags || []).map(t =>
        `<a href="blog.html?tag=${encodeURIComponent(t)}" class="article-tag">${t}</a>`
    ).join('');

    header.innerHTML = `
    <div class="article-tags">${tagsHtml}</div>
    <h1>${escapeHtml(post.title)}</h1>
    <div class="article-meta">
      <span class="article-meta-item">📅 ${dateStr}</span>
      <span class="article-meta-item">⏱️ ${post.readTime || '5 min'}</span>
      <span class="article-meta-item">✍️ ${escapeHtml(post.author || 'Azeka Consulting')}</span>
    </div>
  `;
}

function renderMarkdown(mdContent) {
    const contentEl = document.getElementById('articleContent');
    if (!contentEl) return;

    // Configure marked with highlight.js
    if (typeof marked !== 'undefined') {
        try {
            // Check if marked-highlight is available
            if (typeof markedHighlight !== 'undefined' && typeof hljs !== 'undefined') {
                marked.use(markedHighlight.markedHighlight({
                    langPrefix: 'hljs language-',
                    highlight(code, lang) {
                        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
                        return hljs.highlight(code, { language }).value;
                    }
                }));
            }

            // Custom renderer (marked v12 compatible)
            const renderer = {
                // Add heading IDs for TOC links
                heading(token) {
                    // token.text is raw text, token.depth is the level
                    const rawText = (typeof token === 'object') ? (token.text || '') : String(token);
                    const depth = (typeof token === 'object') ? (token.depth || 2) : 2;

                    const id = rawText.toLowerCase()
                        .replace(/<[^>]*>/g, '')
                        .replace(/[^\w\sàâäéèêëïîôùûüÿçœæ-]/g, '')
                        .trim()
                        .replace(/\s+/g, '-');

                    return `<h${depth} id="${id}">${rawText}</h${depth}>`;
                },

                // Add language label to code blocks
                code(token) {
                    const text = (typeof token === 'object') ? (token.text || '') : String(token);
                    const lang = (typeof token === 'object') ? (token.lang || '') : '';
                    const langAttr = lang ? ` data-lang="${lang}"` : '';

                    // If highlighted by marked-highlight, text is already HTML
                    return `<pre${langAttr}><code class="hljs language-${lang || 'text'}">${text}</code></pre>`;
                }
            };

            marked.use({ renderer });
            contentEl.innerHTML = marked.parse(mdContent);
        } catch (error) {
            console.error('Marked rendering error:', error);
            // Fallback: try without custom renderer
            contentEl.innerHTML = marked.parse(mdContent);
        }
    } else {
        // Fallback: show raw markdown in a pre block
        contentEl.innerHTML = `<pre style="white-space:pre-wrap;">${escapeHtml(mdContent)}</pre>`;
    }
}

function generateTOC() {
    const tocList = document.getElementById('tocList');
    const contentEl = document.getElementById('articleContent');
    if (!tocList || !contentEl) return;

    const headings = contentEl.querySelectorAll('h2, h3');
    if (headings.length === 0) {
        const tocCard = document.getElementById('tocCard');
        if (tocCard) tocCard.style.display = 'none';
        return;
    }

    let html = '';
    headings.forEach(h => {
        const level = h.tagName.toLowerCase();
        const text = h.textContent;
        const id = h.id;
        const className = level === 'h3' ? 'toc-h3' : '';
        html += `<li><a href="#${id}" class="${className}">${escapeHtml(text)}</a></li>`;
    });

    tocList.innerHTML = html;
}

function initTOCTracking() {
    const tocLinks = document.querySelectorAll('.toc-list a');
    const headings = document.querySelectorAll('.article-content h2, .article-content h3');
    if (tocLinks.length === 0 || headings.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                tocLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, {
        rootMargin: '-80px 0px -60% 0px',
        threshold: 0
    });

    headings.forEach(h => observer.observe(h));

    // Smooth scroll for TOC links
    tocLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
                const offset = 90;
                const top = targetEl.offsetTop - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });
}

function renderArticleNav(currentIndex) {
    const navEl = document.getElementById('articleNav');
    if (!navEl) return;

    const prevPost = allPosts[currentIndex + 1]; // Older
    const nextPost = allPosts[currentIndex - 1]; // Newer

    let html = '';

    if (prevPost) {
        html += `
      <a href="article.html?slug=${prevPost.slug}" class="glass-card article-nav-link prev">
        <div class="article-nav-label">← Article précédent</div>
        <div class="article-nav-title">${escapeHtml(prevPost.title)}</div>
      </a>
    `;
    } else {
        html += '<div></div>';
    }

    if (nextPost) {
        html += `
      <a href="article.html?slug=${nextPost.slug}" class="glass-card article-nav-link next">
        <div class="article-nav-label">Article suivant →</div>
        <div class="article-nav-title">${escapeHtml(nextPost.title)}</div>
      </a>
    `;
    } else {
        html += '<div></div>';
    }

    navEl.innerHTML = html;
}

function showArticleError(message) {
    const contentEl = document.getElementById('articleContent');
    if (contentEl) {
        contentEl.innerHTML = `
      <div class="no-results">
        <div class="no-results-icon">😕</div>
        <h3>${message}</h3>
        <p><a href="blog.html">Retour au blog</a></p>
      </div>
    `;
    }
}

/* =============================================
   UTILITIES
   ============================================= */
function stripFrontMatter(text) {
    const match = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    return match ? match[2].trim() : text;
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
