/* -------- Data (replace with full Tehillim text when ready) -------- */
const PSALM_COUNT = 150;

// Minimal sample text; plug in real text later (Lashon Hakodesh or translation).
const psalmData = {
  1: "Ashrei ha'ish... (Sample text for Psalm 1)",
  2: "Lamah rag'shu goyim... (Sample text for Psalm 2)",
  3: "Mizmor leDavid... (Sample text for Psalm 3)"
  // ... add as needed up to 150
};

/* -------- Elements -------- */
const grid = document.getElementById('grid');
const reader = document.getElementById('reader');
const backBtn = document.getElementById('backToGrid');
const psalmHeading = document.getElementById('psalmHeading');
const psalmText = document.getElementById('psalmText');

const search = document.getElementById('search');
const clearSearch = document.getElementById('clearSearch');

const sections = {
  siddur: document.getElementById('siddur'),
  tehillim: document.getElementById('tehillim'),
  settings: document.getElementById('settings'),
  reader: document.getElementById('reader')
};
const tabs = Array.from(document.querySelectorAll('.tabbar .tab'));

/* -------- Init: Build Grid -------- */
function buildGrid() {
  const frag = document.createDocumentFragment();
  for (let i = 1; i <= PSALM_COUNT; i++) {
    const btn = document.createElement('button');
    btn.className = 'pill';
    btn.role = 'gridcell';
    btn.textContent = i;
    btn.dataset.psalm = i;
    btn.addEventListener('click', () => openPsalm(i));
    frag.appendChild(btn);
  }
  grid.appendChild(frag);
}
buildGrid();

/* -------- Open / Close Psalm -------- */
function openPsalm(n) {
  psalmHeading.textContent = `Psalm ${n}`;
  psalmText.dir = document.getElementById('toggleRTL').checked ? 'rtl' : 'ltr';
  psalmText.textContent = psalmData[n] || "— Add text for this Psalm here —";
  showSection('reader');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
backBtn.addEventListener('click', () => {
  showSection('tehillim');
});

/* -------- Search -------- */
search.addEventListener('input', () => {
  const q = search.value.trim();
  clearSearch.hidden = q.length === 0;
  filterGrid(q);
});
clearSearch.addEventListener('click', () => {
  search.value = '';
  clearSearch.hidden = true;
  filterGrid('');
  search.focus();
});

function filterGrid(query) {
  const pills = grid.querySelectorAll('.pill');
  if (!query) {
    pills.forEach(p => p.hidden = false);
    return;
  }
  const qNum = Number(query);
  pills.forEach(p => {
    const n = Number(p.dataset.psalm);
    p.hidden = !(String(n).startsWith(String(qNum)));
  });
}

/* -------- Tabs / Sections -------- */
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    showSection(tab.dataset.target);
  });
});

function showSection(id) {
  Object.entries(sections).forEach(([key, el]) => {
    el.hidden = key !== id;
  });
  // Keep Tehillim grid visible when reader is not active
  if (id !== 'reader') {
    sections.reader.hidden = true;
  }
  // Keep tab selection in sync (reader is under the Tehillim tab)
  if (id === 'reader' || id === 'tehillim') {
    setActiveTab('tehillim');
  } else {
    setActiveTab(id);
  }
}
function setActiveTab(key){
  tabs.forEach(t => t.classList.toggle('active', t.dataset.target === key));
}

/* -------- Settings -------- */
document.getElementById('toggleLarge').addEventListener('change', e => {
  grid.querySelectorAll('.pill').forEach(p =>
    p.classList.toggle('large', e.target.checked)
  );
});
document.getElementById('toggleRTL').addEventListener('change', e => {
  if (!reader.hidden) psalmText.dir = e.target.checked ? 'rtl' : 'ltr';
});

/* -------- Deep link: #tehillim/#settings/#siddur -------- */
window.addEventListener('hashchange', () => {
  const key = location.hash.replace('#','');
  if (['tehillim','settings','siddur'].includes(key)) showSection(key);
});
if (['#settings','#siddur'].includes(location.hash)) {
  showSection(location.hash.slice(1));
}
