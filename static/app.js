const searchBtn = document.getElementById('search-btn');
const movieInput = document.getElementById('movie-input');
const resultsEl = document.getElementById('results');
const themeToggle = document.getElementById('theme-toggle');
const toastEl = document.getElementById('toast');
const chipsEl = document.getElementById('chips');
const resultsTitleEl = document.getElementById('results-title');
const clearBtn = document.getElementById('clear-btn');
const copyLinkBtn = document.getElementById('copy-link');

const API_ROOT = '/api'; // if running backend at same host, otherwise change to full origin

function getCount(){
  return 10;
}

async function fetchRecommendations(query, n=8){
  const url = new URL(API_ROOT + '/recommend', window.location.origin);
  url.searchParams.set('q', query);
  url.searchParams.set('n', n);

  const resp = await fetch(url.href);
  if(!resp.ok){
    const j = await resp.json().catch(()=>({error: 'Server error'}));
    throw new Error(j.error || 'Server returned error');
  }
  return resp.json();
}

function renderResults(items, query){
  resultsEl.innerHTML = '';
  if(!items || items.length === 0){
    if(resultsTitleEl) resultsTitleEl.textContent = 'No results found';
    return;
  }
  if(resultsTitleEl) resultsTitleEl.textContent = `${items.length} recommendations for "${query}"`;
  items.forEach(item => {
    const sim = computeSimilarity(item.distance);
    const tier = tierFromSim(sim);
    const li = document.createElement('li');
    li.className = `result ${tier}`;
    li.innerHTML = createResultHTML(item, sim, tier);
    resultsEl.appendChild(li);
    // set ring percent
    const ring = li.querySelector('.ring');
    if(ring){ ring.style.setProperty('--p', Math.round(sim*100) + '%'); }
  });
  // scroll into view
  document.getElementById('results-card')?.scrollIntoView({behavior:'smooth', block:'start'});
}

function escapeHtml(str){
  return str.replace(/[&<>"']/g, tag => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"
  }[tag]));
}

function computeSimilarity(distance){
  let d = Number(distance);
  if(!Number.isFinite(d)) d = 1;
  let s = 1 - d;
  if(s < 0) s = 0;
  if(s > 1) s = 1;
  return s;
}

function tierFromSim(s){
  if(s >= 0.8) return 'good';
  if(s >= 0.5) return 'mid';
  return 'low';
}

function createResultHTML(item, sim, tier){
  const percent = Math.round(sim * 100);
  const safeTitle = escapeHtml(item.title);
  const year = parseYear(safeTitle);
  const initial = (safeTitle[0] || '#').toUpperCase();
  return `
    <div class="ring" style="--p:${percent}%"><div class="initial">${initial}</div></div>
    <div class="content">
      <div class="title-row">
        <div class="movie-title">${safeTitle}${year ? ` <span class="year">(${year})</span>` : ''}</div>
        <div class="percent">${percent}%</div>
      </div>
      <div class="movie-meta">movieId: ${item.movieId} • distance: ${Number(item.distance).toFixed(3)}</div>
    </div>
  `;
}

function parseYear(title){
  const m = title.match(/\((\d{4})\)/);
  return m ? m[1] : '';
}


function showSkeleton(count=6){
  resultsEl.innerHTML = '';
  for(let i=0;i<count;i++){
    const li = document.createElement('li');
    li.className = 'result';
    li.innerHTML = `
      <div class="ring skeleton"></div>
      <div class="content">
        <div class="skeleton" style="height:14px;width:60%"></div>
        <div class="skeleton" style="height:10px;width:40%;margin-top:8px"></div>
      </div>
    `;
    resultsEl.appendChild(li);
  }
}

function toast(msg, type='info', timeout=2200){
  if(!toastEl) return;
  toastEl.textContent = msg;
  toastEl.classList.remove('success','error','info');
  if(type) toastEl.classList.add(type);
  toastEl.classList.add('show');
  window.clearTimeout(toastEl._t);
  toastEl._t = window.setTimeout(()=>{
    toastEl.classList.remove('show');
  }, timeout);
}

function applyTheme(pref){
  const root = document.documentElement;
  if(pref === 'light') root.setAttribute('data-theme','light');
  else root.setAttribute('data-theme','dark');
}

function prefersDark(){
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function updateThemeIcon(){
  if(!themeToggle) return;
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  themeToggle.textContent = isLight ? '🌙' : '☀️';
}

function initTheme(){
  // Modern design uses dark theme by default
  document.documentElement.style.colorScheme = 'dark';
}

function toggleTheme(){
  // Theme toggle for future light mode support
  toast('Dark theme is optimized for this design', 'info');
}

searchBtn.addEventListener('click', async ()=>{
  const q = movieInput.value.trim();
  if(!q) return;
  showSkeleton(getCount());
  searchBtn.disabled = true; searchBtn.classList.add('loading');
  try{
    const data = await fetchRecommendations(q, getCount());
    renderResults(data.results, q);
    toast(`Found ${data.results?.length || 0} recommendations`, 'success');
  }catch(e){
    resultsEl.innerHTML = '';
    if(resultsTitleEl) resultsTitleEl.textContent = 'Error';
    toast(e.message, 'error');
  }finally{
    searchBtn.disabled = false; searchBtn.classList.remove('loading');
  }
});

// Download functionality removed from modern UI

// allow Enter key in input
movieInput.addEventListener('keyup', e=>{ if(e.key === 'Enter') searchBtn.click(); });

// Show/hide clear button and debounced search
let debounceTimer;
function updateClearBtn(){
  if(!clearBtn) return;
  clearBtn.classList.toggle('show', movieInput.value.trim().length > 0);
}
movieInput.addEventListener('input', () => {
  updateClearBtn();
  const q = movieInput.value.trim();
  window.clearTimeout(debounceTimer);
  if(q.length >= 3){
    debounceTimer = window.setTimeout(()=>{
      searchBtn.click();
    }, 450);
  }
});
if(clearBtn){
  clearBtn.addEventListener('click', ()=>{
    movieInput.value = '';
    updateClearBtn();
    movieInput.focus();
    resultsEl.innerHTML = '';
    if(resultsTitleEl) resultsTitleEl.textContent = 'Recommendations';
  });
}

// chips quick search
if(chipsEl){
  chipsEl.addEventListener('click', e => {
    const chip = e.target.closest('.chip');
    if(!chip) return;
    movieInput.value = chip.textContent.trim();
    for(const c of chipsEl.querySelectorAll('.chip')) c.classList.toggle('active', c === chip);
    searchBtn.click();
  });
}

// theme toggle
if(themeToggle){
  initTheme();
  updateThemeIcon();
  themeToggle.addEventListener('click', toggleTheme);
}

// Remove palette switching code since it's not in new design
// (keeping only theme toggle)

// Build and copy shareable link
function buildShareUrl(q, n){
  const url = new URL(window.location.href);
  url.searchParams.set('q', q);
  url.searchParams.set('n', String(n || 8));
  return url.toString();
}
async function copyShareLink(){
  const q = movieInput.value.trim();
  const n = getCount();
  const link = q ? buildShareUrl(q, n) : window.location.href;
  try{
    await navigator.clipboard.writeText(link);
    toast('Link copied to clipboard', 'success');
  }catch{
    // fallback
    const ta = document.createElement('textarea');
    ta.value = link; document.body.appendChild(ta); ta.select();
    document.execCommand('copy'); ta.remove();
    toast('Link copied', 'success');
  }
}
if(copyLinkBtn){
  copyLinkBtn.addEventListener('click', copyShareLink);
}

// Initialize from URL query params (with skeleton)
(function initFromURL(){
  const p = new URLSearchParams(window.location.search);
  const q = p.get('q');
  if(q){
    movieInput.value = q;
    updateClearBtn();
    showSkeleton(getCount());
    searchBtn.click();
  }
})();
