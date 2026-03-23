// Injects shared nav and footer into every page
(function () {
  const navHTML = `
  <nav class="nav">
    <a href="index.html" class="nav-logo">
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 4C16 4 8 10 8 18C8 22.4 11.6 26 16 26C20.4 26 24 22.4 24 18C24 10 16 4 16 4Z" fill="currentColor" opacity="0.85"/>
        <path d="M16 14C16 14 10 12 9 19" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
        <line x1="16" y1="18" x2="16" y2="29" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
      </svg>
      Green Thumb
    </a>
    <ul class="nav-links">
      <li><a href="index.html">Home</a></li>
      <li><a href="plants.html">Plants</a></li>
      <li><a href="marketplace.html">Marketplace</a></li>
      <li><a href="community.html">Community</a></li>
      <li><a href="map.html">Map</a></li>
    </ul>
    <div class="nav-cta">
      <a href="profile.html" class="btn btn-outline">Sign In</a>
      <a href="profile.html" class="btn btn-solid">Join Free</a>
    </div>
    <button class="nav-hamburger" aria-label="Menu">
      <span></span><span></span><span></span>
    </button>
  </nav>
  <div class="mobile-menu">
    <a href="index.html">Home</a>
    <a href="plants.html">🌿 Plants</a>
    <a href="marketplace.html">🛒 Marketplace</a>
    <a href="community.html">💬 Community</a>
    <a href="map.html">🗺 Map</a>
    <a href="profile.html">👤 Profile</a>
  </div>`;

  const footerHTML = `
  <footer class="footer">
    <div class="footer-grid">
      <div class="footer-brand">
        <a href="index.html" class="nav-logo">
          <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
            <path d="M16 4C16 4 8 10 8 18C8 22.4 11.6 26 16 26C20.4 26 24 22.4 24 18C24 10 16 4 16 4Z" fill="currentColor" opacity="0.85"/>
            <path d="M16 14C16 14 10 12 9 19" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
            <line x1="16" y1="18" x2="16" y2="29" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
          </svg>
          Green Thumb
        </a>
        <p>Inspiring a shared food economy rooted in community, sustainability, and the simple joy of growing your own.</p>
      </div>
      <div class="footer-col">
        <h4>Explore</h4>
        <a href="plants.html">Plant Library</a>
        <a href="marketplace.html">Marketplace</a>
        <a href="map.html">Local Map</a>
        <a href="community.html">Community</a>
      </div>
      <div class="footer-col">
        <h4>Learn</h4>
        <a href="plants.html">Garden Guides</a>
        <a href="community.html#tips">Seasonal Tips</a>
        <a href="community.html">Forum</a>
        <a href="#">Newsletter</a>
      </div>
      <div class="footer-col">
        <h4>About</h4>
        <a href="index.html#mission">Our Mission</a>
        <a href="#">Sustainability</a>
        <a href="#">Contact</a>
        <a href="#">Privacy Policy</a>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2025 Green Thumb. Better for you. Better for mother earth.</span>
      <span style="opacity:0.5">Made with 🌿 love</span>
    </div>
  </footer>`;

  // Inject nav before main
  const main = document.querySelector('main');
  if (main) main.insertAdjacentHTML('beforebegin', navHTML);

  // Inject footer after main
  if (main) main.insertAdjacentHTML('afterend', footerHTML);
})();
