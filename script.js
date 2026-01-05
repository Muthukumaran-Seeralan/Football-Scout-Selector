const players = [
    {
        id: 1, name: "Erling Haaland", club: "Manchester City", league: "Premier League", pos: "Forward", age: 23, nation: "Norway",
        stats: { shooting: 98, pace: 94, physical: 92, passing: 68, dribbling: 82 },
        market: { val: "€180M", trend: "Upward", demand: "Critical", contract: "2027" },
        form: ['W', 'W', 'W', 'L', 'W'],
        traits: ["Clinical Finisher", "Box Dominance", "Rapid Transitions"],
        aliases: ["haaland"]
    },
    {
        id: 2, name: "Vinícius Júnior", club: "Real Madrid", league: "LaLiga", pos: "Forward", age: 23, nation: "Brazil",
        stats: { shooting: 86, pace: 95, physical: 74, passing: 82, dribbling: 96 },
        market: { val: "€150M", trend: "Rising", demand: "High", contract: "2027" },
        form: ['W', 'W', 'W', 'W', 'D'],
        traits: ["Dribbling Wizard", "Transition Threat", "High Pressing"],
        aliases: ["vini", "vinicius", "vinicius jr"]
    },
    {
        id: 3, name: "Lionel Messi", club: "Inter Miami", league: "MLS", pos: "Forward", age: 36, nation: "Argentina",
        stats: { shooting: 89, pace: 80, physical: 70, passing: 96, dribbling: 92 },
        market: { val: "€30M", trend: "Stable", demand: "High", contract: "2025" },
        form: ['W', 'W', 'D', 'W', 'W'],
        traits: ["Visionary", "Playmaker", "Legendary IQ"],
        aliases: ["messi", "leo", "pulga"]
    },
    {
        id: 4, name: "Sunil Chhetri", club: "Bengaluru FC", league: "ISL", pos: "Forward", age: 39, nation: "India",
        stats: { shooting: 84, pace: 78, physical: 72, passing: 76, dribbling: 75 },
        market: { val: "€0.5M", trend: "Stable", demand: "Regional", contract: "2024" },
        form: ['W', 'L', 'W', 'D', 'D'],
        traits: ["Iconic Leader", "Penalty Pro", "Positioning"],
        aliases: ["sunil", "chhetri", "captain"]
    },
    {
        id: 5, name: "Mehdi Taremi", club: "FC Porto", league: "AFC Context", pos: "Forward", age: 31, nation: "Iran",
        stats: { shooting: 88, pace: 82, physical: 84, passing: 80, dribbling: 81 },
        market: { val: "€12M", trend: "Stable", demand: "Moderate", contract: "2024" },
        form: ['W', 'W', 'L', 'W', 'W'],
        traits: ["Versatile Pivot", "Aerial Threat", "Target Man"],
        aliases: ["taremi", "mehdi"]
    },
    {
        id: 6, name: "Marc-André ter Stegen", club: "FC Barcelona", league: "LaLiga", pos: "Goalkeeper", age: 31, nation: "Germany",
        stats: { shooting: 10, pace: 65, physical: 80, passing: 92, dribbling: 50 },
        market: { val: "€35M", trend: "Stable", demand: "High", contract: "2028" },
        form: ['W', 'W', 'D', 'W', 'W'],
        traits: ["Elite Passing", "Sweeper Keeper", "Reflexes"],
        aliases: ["ter stegen", "marc"]
    },
    {
        id: 7, name: "Virgil van Dijk", club: "Liverpool", league: "Premier League", pos: "Defender", age: 32, nation: "Netherlands",
        stats: { shooting: 62, pace: 85, physical: 95, passing: 84, dribbling: 74 },
        market: { val: "€32M", trend: "Stable", demand: "High", contract: "2025" },
        form: ['W', 'W', 'L', 'D', 'W'],
        traits: ["Commanding", "Aerially Elite", "Long Passing"],
        aliases: ["van dijk", "virgil"]
    },
    {
        id: 8, name: "Cristiano Ronaldo", club: "Al Nassr", league: "AFC Context", pos: "Forward", age: 39, nation: "Portugal",
        stats: { shooting: 92, pace: 82, physical: 85, passing: 78, dribbling: 80 },
        market: { val: "€15M", trend: "Stable", demand: "Global", contract: "2025" },
        form: ['W', 'W', 'W', 'W', 'W'],
        traits: ["Mentality", "Heading", "Clutch"],
        aliases: ["ronaldo", "cr7", "siuu"]
    },
    {
        id: 9, name: "Son Heung-min", club: "Tottenham", league: "Premier League", pos: "Forward", age: 31, nation: "South Korea",
        stats: { shooting: 90, pace: 88, physical: 72, passing: 82, dribbling: 86 },
        market: { val: "€50M", trend: "Stable", demand: "High", contract: "2025" },
        form: ['W', 'W', 'D', 'L', 'W'],
        traits: ["Two-Footed", "Finishing", "Pace"],
        aliases: ["son", "sonny"]
    }
];

let selectedP1 = null;
let selectedP2 = null;
let currentView = 'console-view';

// --- UTILS ---
const normalize = (str) => {
    return str.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s]/g, "");
};

// Select DOM Elements
const sidebarNav = document.getElementById('sidebar-nav');
const views = document.querySelectorAll('.content-view');
const p1Input = document.getElementById('p1-search');
const p2Input = document.getElementById('p2-search');
const analyzeBtn = document.getElementById('analyze-btn');
const loadingOverlay = document.getElementById('loading-overlay');
const dashboard = document.getElementById('comparison-dashboard');

// --- NAVIGATION LOGIC ---
sidebarNav.addEventListener('click', (e) => {
    const navItem = e.target.closest('.nav-item');
    if (!navItem) return;

    const targetViewId = navItem.dataset.view;
    switchView(targetViewId);

    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    navItem.classList.add('active');
});

function switchView(viewId) {
    views.forEach(v => v.classList.add('hidden'));
    document.getElementById(viewId).classList.remove('hidden');
    currentView = viewId;

    if (viewId === 'history-view') renderHistory();
    if (viewId === 'market-view') renderMarketData();
}

// --- SEARCH & SELECTION ---
function handleInput(e, resultsDivId, pNum) {
    const rawQuery = e.target.value;
    const query = normalize(rawQuery);
    const resultsDiv = document.getElementById(resultsDivId);
    resultsDiv.innerHTML = '';

    if (query.length < 1) {
        resultsDiv.classList.add('hidden');
        return;
    }

    const filtered = players.filter(p => {
        const normalizedName = normalize(p.name);
        const matchesName = normalizedName.includes(query);
        const matchesAlias = (p.aliases || []).some(alias => normalize(alias).includes(query));
        return matchesName || matchesAlias;
    }).sort((a, b) => {
        const aNorm = normalize(a.name);
        const bNorm = normalize(b.name);
        const aStart = aNorm.startsWith(query) ? 2 : (aNorm.includes(query) ? 1 : 0);
        const bStart = bNorm.startsWith(query) ? 2 : (bNorm.includes(query) ? 1 : 0);
        return bStart - aStart;
    });

    if (filtered.length > 0) {
        resultsDiv.classList.remove('hidden');
        filtered.forEach(p => {
            const div = document.createElement('div');
            div.className = 'result-item';
            div.innerHTML = `
                <div style="font-weight:700;">${p.name}</div>
                <div style="font-size:0.75rem; color:var(--text-muted);">${p.club} • ${p.league}</div>
            `;
            div.onclick = () => selectPlayer(p, pNum);
            resultsDiv.appendChild(div);
        });
    } else {
        resultsDiv.classList.add('hidden');
    }
}

function selectPlayer(player, pNum) {
    const avatar = `https://api.dicebear.com/7.x/initials/svg?seed=${player.name.replace(/\s/g, '')}&backgroundColor=3b82f6`;
    const previewHtml = `
        <div style="display:flex;align-items:center;gap:1.25rem;">
            <img src="${avatar}" style="width:55px;height:55px;border-radius:10px;border:2px solid var(--primary);">
            <div>
                <h4 style="font-size:1.1rem;">${player.name}</h4>
                <p style="font-size:0.8rem; color:var(--text-muted);">${player.club} | ${player.league}</p>
            </div>
        </div>`;

    if (pNum === 1) {
        selectedP1 = player;
        document.getElementById('p1-selection-preview').innerHTML = previewHtml;
        document.getElementById('p1-results').classList.add('hidden');
        p1Input.value = player.name;
    } else {
        selectedP2 = player;
        document.getElementById('p2-selection-preview').innerHTML = previewHtml;
        document.getElementById('p2-results').classList.add('hidden');
        p2Input.value = player.name;
    }

    analyzeBtn.disabled = !(selectedP1 && selectedP2 && selectedP1.id !== selectedP2.id);
}

// --- ANALYSIS & PERSISTENCE ---
analyzeBtn.addEventListener('click', async () => {
    loadingOverlay.classList.remove('hidden');
    document.getElementById('loading-status').textContent = "Aggregating Global Metrics...";

    await new Promise(r => setTimeout(r, 2000));

    loadingOverlay.classList.add('hidden');
    renderComparison();
    saveToHistory();
});

function renderComparison() {
    dashboard.classList.remove('hidden');

    // Stats
    const root = document.getElementById('stats-comparison-root');
    root.innerHTML = '';
    Object.keys(selectedP1.stats).forEach(m => {
        const v1 = selectedP1.stats[m];
        const v2 = selectedP2.stats[m];
        root.innerHTML += `
            <div class="metric-row">
                <div class="metric-info">
                    <span>${v1}</span>
                    <span style="color:var(--text-muted); text-transform:uppercase; letter-spacing:1px; font-size:0.75rem;">${m}</span>
                    <span>${v2}</span>
                </div>
                <div class="metric-bar-bg">
                    <div class="bar-p1" style="width:${v1}%"></div>
                    <div class="bar-p2" style="width:${v2}%"></div>
                </div>
            </div>`;
    });

    renderInsights('p1-insights-block', selectedP1);
    renderInsights('p2-insights-block', selectedP2);

    const role = document.getElementById('position-select').value;
    const system = document.getElementById('style-select').value;
    document.getElementById('ai-verdict-content').innerHTML = `
        <div style="line-height:1.6; color:var(--text-muted);">
            <p style="margin-bottom:1rem; border-left:4px solid var(--secondary); padding-left:1rem; color:white; font-weight:600;">
                AI PREFERENCE: ${selectedP1.stats.shooting > selectedP2.stats.shooting ? selectedP1.name : selectedP2.name}
            </p>
            <p>For the <b>${role}</b> role in <b>${system}</b>, analysis across <b>${selectedP1.league}</b> and <b>${selectedP2.league}</b> reveals that ${selectedP1.name} offers a more specialized tactical profile for the chosen competition.</p>
        </div>
    `;
    dashboard.scrollIntoView({ behavior: 'smooth' });
}

function renderInsights(id, p) {
    const avatar = `https://api.dicebear.com/7.x/initials/svg?seed=${p.name.replace(/\s/g, '')}&backgroundColor=3b82f6`;
    const formHtml = p.form.map(f => `<div class="form-dot ${f === 'W' ? 'win' : f === 'D' ? 'draw' : 'loss'}">${f}</div>`).join('');
    document.getElementById(id).innerHTML = `
        <div style="display:flex;gap:1.25rem;align-items:center;margin-bottom:1.5rem;">
            <img src="${avatar}" style="width:45px;border-radius:8px;">
            <div>
                <h4 style="font-size:1rem;">${p.name}</h4>
                <p style="font-size:0.75rem; color:var(--text-muted);">${p.nation} | ${p.age} years</p>
            </div>
        </div>
        <div style="font-size:0.7rem; color:var(--primary); text-transform:uppercase; margin-bottom:8px; font-weight:800;">Recent Form</div>
        <div class="form-wrap">${formHtml}</div>
        <div style="margin-top:1.5rem;display:flex;flex-wrap:wrap;gap:5px;">
            ${p.traits.map(t => `<span class="source-tag" style="background:rgba(255,255,255,0.05);">${t}</span>`).join('')}
        </div>
    `;
}

// --- MARKET DATA ---
function renderMarketData() {
    if (!selectedP1 || !selectedP2) return;
    document.getElementById('market-summary-root').innerHTML = `
        <h3 style="margin-bottom:1rem;">Market & Competition Valuation</h3>
        <p style="color:var(--text-muted);">Comparing fiscal metrics across <b>${selectedP1.league}</b> and <b>${selectedP2.league}</b>.</p>
    `;
    [selectedP1, selectedP2].forEach((p, i) => {
        const container = document.getElementById(`valuation-grid-p${i + 1}`);
        container.style.padding = '2rem';
        container.innerHTML = `
            <div style="color:var(--primary); font-weight:800; text-transform:uppercase; font-size:0.7rem; margin-bottom:10px;">${p.name}</div>
            <div class="bio-grid">
                <div class="bio-item"><b>Valuation</b><span>${p.market.val}</span></div>
                <div class="bio-item"><b>Contract</b><span>${p.market.contract}</span></div>
                <div class="bio-item"><b>League</b><span>${p.league}</span></div>
                <div class="bio-item"><b>Demand</b><span>${p.market.demand}</span></div>
            </div>
        `;
    });
}

// --- HISTORY ---
function saveToHistory() {
    const session = {
        timestamp: new Date().toLocaleString(),
        p1: selectedP1.name, p1L: selectedP1.league,
        p2: selectedP2.name, p2L: selectedP2.league,
        role: document.getElementById('position-select').value
    };
    let history = JSON.parse(localStorage.getItem('scout_history') || '[]');
    history.unshift(session);
    localStorage.setItem('scout_history', JSON.stringify(history.slice(0, 10)));
}

function renderHistory() {
    const history = JSON.parse(localStorage.getItem('scout_history') || '[]');
    const root = document.getElementById('history-list-root');
    if (history.length === 0) {
        root.innerHTML = '<p style="color:var(--text-muted);">No scouting history available.</p>';
        return;
    }
    root.innerHTML = `
        <table style="width:100%; border-collapse:collapse;">
            <thead><tr style="text-align:left; color:var(--primary); font-size:0.75rem; text-transform:uppercase;"><th>Analysis Date</th><th>Player Pair</th><th>Target Role</th></tr></thead>
            <tbody>
                ${history.map(h => `
                    <tr style="border-bottom:1px solid var(--glass-border);">
                        <td style="padding:1.25rem 0; font-size:0.8rem; color:var(--text-muted);">${h.timestamp}</td>
                        <td style="padding:1.25rem 0; font-weight:700;">${h.p1} (${h.p1L}) <span style="color:var(--primary)">vs</span> ${h.p2} (${h.p2L})</td>
                        <td style="padding:1.25rem 0; font-size:0.85rem;">${h.role}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>`;
}

// --- INIT ---
p1Input.addEventListener('input', (e) => handleInput(e, 'p1-results', 1));
p2Input.addEventListener('input', (e) => handleInput(e, 'p2-results', 2));
document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-input-wrapper')) {
        document.getElementById('p1-results').classList.add('hidden');
        document.getElementById('p2-results').classList.add('hidden');
    }
});
renderHistory();
