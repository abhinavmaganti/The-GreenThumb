// ── NAV SCROLL SHADOW ────────────────────────────────────
const nav = document.querySelector('.nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 10);
  });
}

// ── MOBILE MENU ───────────────────────────────────────────
const hamburger = document.querySelector('.nav-hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target)) mobileMenu.classList.remove('open');
  });
}

// ── ACTIVE NAV LINK ───────────────────────────────────────
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
  if (a.getAttribute('href') === currentPage) a.classList.add('active');
});

// ── FILTER CHIPS ──────────────────────────────────────────
document.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', () => {
    const group = chip.closest('.filter-chips');
    if (group) group.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
  });
});

// ── AUTH TABS ─────────────────────────────────────────────
const authTabs = document.querySelectorAll('.auth-tab');
const authPanels = document.querySelectorAll('.auth-panel');
authTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    authTabs.forEach(t => t.classList.remove('active'));
    authPanels.forEach(p => p.style.display = 'none');
    tab.classList.add('active');
    const target = document.getElementById(tab.dataset.panel);
    if (target) target.style.display = 'block';
  });
});

// ── FADE-UP OBSERVER ──────────────────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '';
      entry.target.style.animationPlayState = 'running';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.observe').forEach(el => {
  el.style.opacity = '0';
  el.style.animationPlayState = 'paused';
  observer.observe(el);
});

// ── SEARCH FILTER (plants / marketplace) ─────────────────
const searchInput = document.querySelector('.search-wrap input');
const filterableCards = document.querySelectorAll('[data-filter]');
if (searchInput && filterableCards.length) {
  searchInput.addEventListener('input', () => {
    const q = searchInput.value.toLowerCase();
    filterableCards.forEach(card => {
      const text = card.textContent.toLowerCase();
      card.style.display = text.includes(q) ? '' : 'none';
    });
  });
}

// ── LEAFLET MAP (if on map page) ──────────────────────────
function initMap() {
  const mapEl = document.getElementById('map');
  if (!mapEl || typeof L === 'undefined') return;

  const map = L.map('map').setView([40.7128, -74.006], 11);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 18
  }).addTo(map);

  const greenIcon = L.divIcon({
    className: '',
    html: `<div style="
      width:32px;height:32px;border-radius:50%;
      background:#3a5a40;border:3px solid white;
      box-shadow:0 2px 8px rgba(0,0,0,0.2);
      display:flex;align-items:center;justify-content:center;
      color:white;font-size:14px;
    ">🌱</div>`,
    iconSize: [32, 32], iconAnchor: [16, 16]
  });

  // Sample gardeners — in production replace with API data
  const gardeners = [
    { name: 'Maria\'s Urban Garden', lat: 40.7282, lng: -73.7949, type: 'Vegetables', items: 'Tomatoes, Zucchini' },
    { name: 'Brooklyn Roots', lat: 40.6782, lng: -73.9442, type: 'Herbs & Flowers', items: 'Basil, Lavender' },
    { name: 'The Green Patch', lat: 40.7489, lng: -73.9680, type: 'Fruits', items: 'Strawberries, Figs' },
    { name: 'Harlem Harvest', lat: 40.8116, lng: -73.9465, type: 'Vegetables', items: 'Kale, Peppers' },
    { name: 'Queens Garden Co-op', lat: 40.7282, lng: -73.7949, type: 'Mixed', items: 'Seasonal Produce' },
    { name: 'Greenpoint Growers', lat: 40.7282, lng: -73.9540, type: 'Herbs', items: 'Mint, Rosemary, Thyme' },
  ];

  gardeners.forEach(g => {
    const popup = `
      <div style="font-family:'DM Sans',sans-serif;min-width:180px">
        <strong style="font-size:0.9rem">${g.name}</strong><br>
        <span style="font-size:0.78rem;color:#7a8a76">${g.type}</span><br>
        <span style="font-size:0.8rem;color:#3a5a40;margin-top:4px;display:block">🌿 ${g.items}</span>
        <a href="marketplace.html" style="font-size:0.78rem;color:#3a5a40;display:block;margin-top:6px">View Listings →</a>
      </div>`;
    L.marker([g.lat, g.lng], { icon: greenIcon }).addTo(map).bindPopup(popup);
  });

  // Try geolocation
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      map.setView([pos.coords.latitude, pos.coords.longitude], 13);
      L.marker([pos.coords.latitude, pos.coords.longitude], {
        icon: L.divIcon({
          className: '',
          html: `<div style="width:14px;height:14px;border-radius:50%;background:#3a5a40;border:2px solid white;box-shadow:0 0 0 4px rgba(58,90,64,0.2)"></div>`,
          iconSize: [14, 14], iconAnchor: [7, 7]
        })
      }).addTo(map).bindPopup('<b>You are here</b>');
    });
  }
}
window.addEventListener('load', initMap);
