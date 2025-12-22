// github-projects.js
// Fetch public GitHub repos for a username and inject them into the portfolio tabs.
(function () {
    'use strict';

    const usernameInput = document.getElementById('github-username-input');
    const saveBtn = document.getElementById('github-username-save');
    const clearBtn = document.getElementById('github-username-clear');
    const messageEl = document.getElementById('github-config-message');

    function setMessage(msg, isError) {
        messageEl.textContent = msg;
        messageEl.classList.toggle('text-danger', !!isError);
    }

    function getStoredUsername() {
        return localStorage.getItem('githubUsername') || document.querySelector('main')?.dataset?.githubUsername || '';
    }

    function storeUsername(username) {
        if (username) {
            localStorage.setItem('githubUsername', username);
            document.querySelector('main').dataset.githubUsername = username;
        } else {
            localStorage.removeItem('githubUsername');
            document.querySelector('main').dataset.githubUsername = '';
        }
    }

    function formatDate(iso) {
        try { return new Date(iso).toLocaleDateString(); } catch (e) { return iso; }
    }

    function mapRepoToCategory(repo) {
        const name = (repo.name || '').toLowerCase();
        const desc = (repo.description || '').toLowerCase();
        const lang = (repo.language || '').toLowerCase();

        const text = name + ' ' + desc + ' ' + lang;

        const uiKeywords = ['figma', 'prototype', 'ui', 'ux', 'design', 'wireframe', 'prototype'];
        const copyKeywords = ['copy', 'content', 'blog', 'newsletter', 'post', 'article'];
        const graphicKeywords = ['logo', 'brand', 'illustration', 'graphics', 'poster', 'svg', 'design'];

        if (uiKeywords.some(k => text.includes(k))) return 'uiux';
        if (copyKeywords.some(k => text.includes(k))) return 'copywriting';
        if (graphicKeywords.some(k => text.includes(k))) return 'graphics';

        // languages -> web
        const webLangs = ['javascript', 'typescript', 'html', 'css', 'php', 'ruby', 'python', 'go'];
        if (webLangs.includes(lang)) return 'web';

        // fallback to web
        return 'web';
    }

    function createSkeletonCard() {
        const col = document.createElement('div');
        col.className = 'col-md-4 project-card';
        col.setAttribute('data-aos', 'fade-up');
        const card = document.createElement('div');
        card.className = 'card p-3 h-100';
        card.innerHTML = `
          <div class="placeholder-glow">
            <div class="repo-thumb" style="height:160px;background:rgba(255,255,255,0.06);border-radius:6px;"></div>
            <h5 class="mt-3"><span class="placeholder col-8"></span></h5>
            <p class="small"><span class="placeholder col-12"></span><span class="placeholder col-10"></span></p>
          </div>`;
        col.appendChild(card);
        return col;
    }

    function createCard(repo) {
        const col = document.createElement('div');
        col.className = 'col-md-4 project-card';
        // animate on insert
        col.setAttribute('data-aos', 'fade-up');
        col.setAttribute('data-aos-offset', '120');

        const card = document.createElement('div');
        card.className = 'card p-3 h-100';

        const title = document.createElement('h5');
        const a = document.createElement('a');
        a.href = repo.html_url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.textContent = repo.name;
        title.appendChild(a);
        // badges (language, stars)
        const badges = document.createElement('div');
        badges.className = 'repo-badges';

        const langBadge = document.createElement('span');
        langBadge.className = 'repo-badge';
        langBadge.innerHTML = `<i class="bi bi-code-slash"></i> ${repo.language || 'Unknown'}`;
        badges.appendChild(langBadge);

        // Choose a thumbnail that represents the repo's category. Use a small set of packaged portfolio images.
        const category = mapRepoToCategory(repo);
        const thumbs = {
            web: [
                'assets/img/portfolio/app-1.jpg',
                'assets/img/portfolio/app-2.jpg',
                'assets/img/portfolio/app-3.jpg'
            ],
            uiux: [
                'assets/img/portfolio/product-1.jpg',
                'assets/img/portfolio/product-2.jpg',
                'assets/img/portfolio/product-3.jpg'
            ],
            graphics: [
                'assets/img/portfolio/branding-1.jpg',
                'assets/img/portfolio/branding-2.jpg',
                'assets/img/portfolio/branding-3.jpg'
            ],
            copywriting: [
                'assets/img/portfolio/books-1.jpg',
                'assets/img/portfolio/books-2.jpg',
                'assets/img/portfolio/books-3.jpg'
            ]
        };

        function pickThumb(cat) {
            const list = thumbs[cat] || thumbs.web;
            // choose deterministically by repo id/name for stable results
            const idx = Math.abs(hashString(repo.name || repo.id || '')) % list.length;
            return list[idx];
        }

        function hashString(s) {
            let h = 2166136261 >>> 0;
            for (let i = 0; i < s.length; i++) {
                h ^= s.charCodeAt(i);
                h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
            }
            return h >>> 0;
        }

        const thumbSrc = pickThumb(category);
        const imgLink = document.createElement('a');
        imgLink.href = repo.html_url;
        imgLink.target = '_blank';
        imgLink.rel = 'noopener noreferrer';
        const img = document.createElement('img');
        img.className = 'repo-thumb';
        img.alt = repo.name + ' thumbnail';
        img.loading = 'lazy';
        img.src = thumbSrc || (repo.owner && repo.owner.avatar_url) || 'assets/img/portfolio/product-1.jpg';
        imgLink.appendChild(img);

        const starBadge = document.createElement('span');
        starBadge.className = 'repo-badge';
        starBadge.innerHTML = `<i class="bi bi-star-fill"></i> ${repo.stargazers_count || 0}`;
        badges.appendChild(starBadge);

        if (repo.fork) {
            const forkBadge = document.createElement('span');
            forkBadge.className = 'repo-badge';
            forkBadge.innerHTML = `<i class="bi bi-diagram-2"></i> fork`;
            badges.appendChild(forkBadge);
        }

        const p = document.createElement('p');
        p.className = 'small text-muted mb-2 repo-desc';
        p.textContent = repo.description || 'No description provided.';

        const meta = document.createElement('div');
        meta.className = 'repo-meta';
        meta.innerHTML = `<span><i class="bi bi-clock"></i> ${formatDate(repo.updated_at)}</span>`;

        card.appendChild(imgLink);
        card.appendChild(title);
        card.appendChild(badges);
        card.appendChild(p);
        card.appendChild(meta);

        col.appendChild(card);
        return col;
    }

    // simple 5-minute cache in localStorage
    function getCacheKey(username) { return `gh_repos_${username}`; }
    function loadFromCache(username) {
        try {
            const raw = localStorage.getItem(getCacheKey(username));
            if (!raw) return null;
            const obj = JSON.parse(raw);
            if (!obj || !obj.data || !obj.ts) return null;
            if (Date.now() - obj.ts > 5 * 60 * 1000) return null; // TTL 5 minutes
            return obj.data;
        } catch (_) { return null; }
    }
    function saveToCache(username, data) {
        try { localStorage.setItem(getCacheKey(username), JSON.stringify({ ts: Date.now(), data })); } catch (_) {}
    }

    async function fetchRepos(username) {
        const cached = loadFromCache(username);
        if (cached) return cached;
        const url = `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`;
        const res = await fetch(url, { headers: { 'Accept': 'application/vnd.github.v3+json' } });
        if (!res.ok) throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
        const data = await res.json();
        saveToCache(username, data);
        return data;
    }

    // Try to fetch the repo README raw markdown and extract the first image URL.
    // Returns a resolved full URL or null if none found.
    async function fetchReadmeImage(owner, repo, branch) {
        try {
            const url = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/readme`;
            // Ask for raw so we get markdown/text directly
            const res = await fetch(url, { headers: { 'Accept': 'application/vnd.github.v3.raw' } });
            if (!res.ok) return null;
            const text = await res.text();

            // look for markdown image: ![alt](url) or HTML <img src="url">
            const mdImg = /!\[[^\]]*\]\(([^)]+)\)/i.exec(text);
            if (mdImg && mdImg[1]) {
                return resolveReadmeImageUrl(mdImg[1].trim(), owner, repo, branch);
            }
            const htmlImg = /<img[^>]+src=["']?([^"' >]+)["']?/i.exec(text);
            if (htmlImg && htmlImg[1]) {
                return resolveReadmeImageUrl(htmlImg[1].trim(), owner, repo, branch);
            }
            return null;
        } catch (e) {
            return null;
        }
    }

    function resolveReadmeImageUrl(url, owner, repo, branch) {
        // If absolute (http/https) return as-is
        if (/^https?:\/\//i.test(url)) return url;
        // If protocol-relative //example.com/img.png
        if (/^\/\//.test(url)) return window.location.protocol + url;
        // Remove any leading './' or '/'
        const cleaned = url.replace(/^\.\//, '').replace(/^\//, '');
        // Build raw.githubusercontent URL with default branch fallback
        const b = branch || 'main';
        return `https://raw.githubusercontent.com/${owner}/${repo}/${b}/${cleaned}`;
    }

    function clearContainers() {
        ['web-projects', 'uiux-projects', 'graphics-projects', 'copywriting-projects'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.innerHTML = '';
        });
    }

    function setCounts(counts) {
        const keys = ['web', 'uiux', 'graphics', 'copywriting'];
        keys.forEach(k => {
            const el = document.getElementById(`count-${k}`);
            if (el) el.textContent = counts[k] || 0;
        });
    }

    function addSkeletons() {
        const ids = ['web-projects', 'uiux-projects', 'graphics-projects', 'copywriting-projects'];
        ids.forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            for (let i = 0; i < 3; i++) el.appendChild(createSkeletonCard());
        });
    }

    async function loadAndRender(username) {
        setMessage('Loading projects from GitHub...', false);
        clearContainers();
        addSkeletons();
        try {
            let repos = await fetchRepos(username);
            if (!Array.isArray(repos)) repos = [];
            // Exclude forks by default; keep only non-archived, optionally add more filters here
            repos = repos.filter(r => !r.fork && !r.archived);
            if (repos.length === 0) {
                setMessage('No public repositories found for this user.', true);
                clearContainers();
                setCounts({ web: 0, uiux: 0, graphics: 0, copywriting: 0 });
                return;
            }

            clearContainers();

            const counts = { web: 0, uiux: 0, graphics: 0, copywriting: 0 };
            repos.forEach(repo => {
                const cat = mapRepoToCategory(repo);
                counts[cat] = (counts[cat] || 0) + 1;
                const container = document.getElementById(`${cat}-projects`);
                if (container) {
                    const node = createCard(repo);
                    container.appendChild(node);
                    (async () => {
                        try {
                            const imgEl = node.querySelector('.repo-thumb');
                            if (!imgEl) return;
                            const readmeImg = await fetchReadmeImage(repo.owner.login, repo.name, repo.default_branch);
                            if (readmeImg) imgEl.src = readmeImg;
                        } catch (e) {}
                    })();
                }
            });

            setCounts(counts);
            setMessage(`Loaded ${repos.length} public repos for ${username}.`, false);
            if (window.AOS && typeof window.AOS.refresh === 'function') window.AOS.refresh();
        } catch (err) {
            console.error(err);
            setMessage(err.message || 'Failed to load GitHub repos. You may be rate-limited.', true);
            clearContainers();
            setCounts({ web: 0, uiux: 0, graphics: 0, copywriting: 0 });
        }
    }

    // Init
    function init() {
        const stored = getStoredUsername();
        if (stored) {
            if (usernameInput) usernameInput.value = stored;
            loadAndRender(stored);
        }

        saveBtn?.addEventListener('click', () => {
            const v = (usernameInput.value || '').trim();
            if (!v) {
                setMessage('Please enter a GitHub username.', true);
                return;
            }
            storeUsername(v);
            loadAndRender(v);
        });

        clearBtn?.addEventListener('click', () => {
            if (usernameInput) usernameInput.value = '';
            storeUsername('');
            clearContainers();
            setMessage('GitHub username cleared.', false);
            setCounts({ web: 0, uiux: 0, graphics: 0, copywriting: 0 });
        });

        // client-side search
        const search = document.getElementById('repo-search');
        if (search) {
            search.addEventListener('input', () => {
                const q = search.value.trim().toLowerCase();
                const sections = ['web', 'uiux', 'graphics', 'copywriting'];
                sections.forEach(sec => {
                    const container = document.getElementById(`${sec}-projects`);
                    if (!container) return;
                    const cards = container.querySelectorAll('.project-card');
                    let visible = 0;
                    cards.forEach(card => {
                        const txt = card.textContent.toLowerCase();
                        const show = !q || txt.includes(q);
                        card.style.display = show ? '' : 'none';
                        if (show) visible++;
                    });
                    const countEl = document.getElementById(`count-${sec}`);
                    if (countEl) countEl.textContent = visible;
                });
            });
        }
    }

    // Wait for DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
