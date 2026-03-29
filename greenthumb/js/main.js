const STORAGE_KEYS = {
  users: 'greenThumbUsers',
  currentUser: 'greenThumbCurrentUser',
  posts: 'greenThumbPosts'
};

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function slugEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function getUsers() {
  return readStorage(STORAGE_KEYS.users, []);
}

function saveUsers(users) {
  writeStorage(STORAGE_KEYS.users, users);
}

function getCurrentUserEmail() {
  return localStorage.getItem(STORAGE_KEYS.currentUser) || '';
}

function setCurrentUserEmail(email) {
  if (email) {
    localStorage.setItem(STORAGE_KEYS.currentUser, email);
  } else {
    localStorage.removeItem(STORAGE_KEYS.currentUser);
  }
}

function getCurrentUser() {
  const email = slugEmail(getCurrentUserEmail());
  return getUsers().find((user) => slugEmail(user.email) === email) || null;
}

function getPosts() {
  return readStorage(STORAGE_KEYS.posts, []);
}

function savePosts(posts) {
  writeStorage(STORAGE_KEYS.posts, posts);
}

function showToast(message) {
  const existing = $('.toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  window.setTimeout(() => toast.remove(), 2800);
}

function initials(name) {
  return String(name || 'Green Thumb')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'GT';
}

function formatJoined(iso) {
  const date = iso ? new Date(iso) : new Date();
  return `Joined ${date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}`;
}

function timeAgo(iso) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.max(1, Math.floor(diffMs / 60000));
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}

function updateNavForUser() {
  const currentUser = getCurrentUser();
  const outlineLink = $('.nav-cta .btn-outline[href="profile.html"]');
  const solidLink = $('.nav-cta .btn-solid[href="profile.html"]');
  const mobileProfileLink = $('.mobile-menu a[href="profile.html"]');

  if (outlineLink) outlineLink.textContent = currentUser ? 'Profile' : 'Sign In';
  if (solidLink) solidLink.textContent = currentUser ? 'Profile' : 'Join Free';
  if (mobileProfileLink) mobileProfileLink.textContent = 'Profile';
}

function initNav() {
  const nav = $('.nav');
  if (nav) {
    window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 10));
  }

  const hamburger = $('.nav-hamburger');
  const mobileMenu = $('.mobile-menu');
  if (hamburger && mobileMenu && nav) {
    hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
    document.addEventListener('click', (event) => {
      if (!nav.contains(event.target) && !mobileMenu.contains(event.target)) {
        mobileMenu.classList.remove('open');
      }
    });
  }

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  $$('.nav-links a, .mobile-menu a').forEach((link) => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });

  updateNavForUser();
}

function initObservers() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '';
        entry.target.style.animationPlayState = 'running';
      }
    });
  }, { threshold: 0.1 });

  $$('.observe').forEach((element) => {
    element.style.opacity = '0';
    element.style.animationPlayState = 'paused';
    observer.observe(element);
  });
}

function initAuthTabs() {
  const authTabs = $$('.auth-tab');
  const authPanels = $$('.auth-panel');
  authTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      authTabs.forEach((item) => item.classList.remove('active'));
      authPanels.forEach((panel) => { panel.style.display = 'none'; });
      tab.classList.add('active');
      const target = document.getElementById(tab.dataset.panel);
      if (target) target.style.display = 'block';
    });
  });
}

function initPlantsPage() {
  const plantGrid = $('#plant-grid');
  if (!plantGrid) return;

  const searchInput = $('#plant-search');
  const cards = $$('[data-plant-card]');
  const chips = $$('[data-filter-chip]');
  const calendarRows = [
    { plant: 'Tomatoes', data: [0,1,1,1,2,2,3,3,3,0,0,0] },
    { plant: 'Lettuce', data: [0,0,2,2,2,3,3,2,2,2,2,0] },
    { plant: 'Cucumbers', data: [0,0,1,1,2,2,3,3,3,0,0,0] },
    { plant: 'Bell Peppers', data: [0,1,1,1,2,2,3,3,3,0,0,0] },
    { plant: 'Spinach', data: [0,0,2,2,2,0,0,0,2,2,2,0] },
    { plant: 'Green Beans', data: [0,0,0,1,2,2,3,3,2,0,0,0] },
    { plant: 'Strawberries', data: [0,0,2,2,3,3,3,0,0,2,0,0] },
    { plant: 'Basil', data: [0,0,1,1,2,2,3,3,2,0,0,0] }
  ];

  const tbody = $('#calendar-body');
  if (tbody) {
    const colors = ['transparent', 'rgba(58,90,64,0.16)', 'rgba(58,90,64,0.52)', 'var(--green)'];
    tbody.innerHTML = '';
    calendarRows.forEach((row) => {
      const tr = document.createElement('tr');
      tr.style.borderBottom = '1px solid var(--border)';
      tr.innerHTML = `<td style="padding:0.7rem 1rem;font-weight:500;text-align:left;">${row.plant}</td>${row.data.map((value) => `<td style="padding:0.45rem;text-align:center;"><div style="width:22px;height:22px;border-radius:4px;margin:auto;background:${colors[value]};"></div></td>`).join('')}`;
      tbody.appendChild(tr);
    });
  }

  function applyPlantFilters() {
    const activeChip = chips.find((chip) => chip.classList.contains('active'));
    const activeFilter = activeChip ? activeChip.dataset.filterChip : 'all';
    const query = (searchInput?.value || '').trim().toLowerCase();

    cards.forEach((card) => {
      const haystack = card.textContent.toLowerCase();
      const categories = (card.dataset.category || '').toLowerCase();
      const matchesFilter = activeFilter === 'all' || categories.includes(activeFilter);
      const matchesQuery = !query || haystack.includes(query);
      card.style.display = matchesFilter && matchesQuery ? '' : 'none';
    });
  }

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chips.forEach((item) => item.classList.remove('active'));
      chip.classList.add('active');
      applyPlantFilters();
    });
  });

  searchInput?.addEventListener('input', applyPlantFilters);
}

function initCommunityPage() {
  const form = $('#community-form');
  if (!form) return;

  const currentUser = getCurrentUser();
  const postsContainer = $('#community-posts');
  const emptyState = $('#community-empty');
  const loadMoreButton = $('#load-more-posts');
  const filterButtons = $$('[data-community-filter]');
  const authNote = $('#community-auth-note');
  const submitButton = $('#community-submit');
  const signInCta = $('#community-signin-cta');
  const formFields = $$('input, select, textarea, button[type="submit"]', form);
  let visibleCount = 4;

  function applyPostingAccess() {
    const user = getCurrentUser();
    const isSignedIn = Boolean(user);
    formFields.forEach((field) => { field.disabled = !isSignedIn; });
    if (authNote) {
      authNote.textContent = isSignedIn
        ? `Posting as ${user.name}. You can also delete your own posts below.`
        : 'Sign in first to create a post from your account.';
    }
    if (submitButton) submitButton.textContent = isSignedIn ? 'Post' : 'Sign in required';
    if (signInCta) signInCta.style.display = isSignedIn ? 'none' : 'block';
  }

  function renderPosts() {
    const user = getCurrentUser();
    const activeFilter = filterButtons.find((button) => button.classList.contains('active'))?.dataset.communityFilter || 'all';
    const posts = getPosts()
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .filter((post) => activeFilter === 'all' || post.topic === activeFilter);

    postsContainer.innerHTML = '';

    if (!posts.length) {
      emptyState.style.display = 'block';
      loadMoreButton.style.display = 'none';
      return;
    }

    emptyState.style.display = 'none';

    posts.slice(0, visibleCount).forEach((post) => {
      const isOwner = user && slugEmail(user.email) === slugEmail(post.email);
      const article = document.createElement('article');
      article.className = 'post-item';
      article.innerHTML = `
        <div class="post-avatar">${initials(post.author)}</div>
        <div class="post-content" style="flex:1;">
          <h3>${post.title}</h3>
          <p>${post.body}</p>
          <div class="card-tags"><span class="tag">${post.topic}</span>${isOwner ? '<span class="tag">Your post</span>' : ''}</div>
          <div class="post-meta">
            <span>${post.author}</span>
            <span>${timeAgo(post.createdAt)}</span>
            <span>${post.replyCount || 0} replies</span>
          </div>
          ${isOwner ? `<div style="margin-top:0.9rem;"><button class="btn btn-outline" data-delete-post="${post.id}" type="button" style="padding:0.5rem 1rem;">Delete Post</button></div>` : ''}
        </div>`;
      postsContainer.appendChild(article);
    });

    $$('[data-delete-post]', postsContainer).forEach((button) => {
      button.addEventListener('click', () => {
        const nextPosts = getPosts().filter((post) => post.id !== button.dataset.deletePost);
        savePosts(nextPosts);
        renderPosts();
        showToast('Post deleted.');
      });
    });

    loadMoreButton.style.display = posts.length > visibleCount ? 'inline-flex' : 'none';
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const user = getCurrentUser();
    if (!user) {
      showToast('Sign in before creating a post.');
      applyPostingAccess();
      return;
    }

    const formData = new FormData(form);
    const title = String(formData.get('title') || '').trim();
    const topic = String(formData.get('topic') || 'Growing Tips');
    const body = String(formData.get('body') || '').trim();

    if (!title || !body) {
      showToast('Enter both a title and a message before posting.');
      return;
    }

    const posts = getPosts();
    posts.push({
      id: crypto.randomUUID(),
      title,
      topic,
      body,
      author: user.name,
      email: user.email,
      createdAt: new Date().toISOString(),
      replyCount: 0
    });
    savePosts(posts);
    visibleCount = Math.max(4, visibleCount);
    form.reset();
    renderPosts();
    showToast('Post published locally.');
  });

  loadMoreButton.addEventListener('click', () => {
    visibleCount += 4;
    renderPosts();
  });

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      filterButtons.forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      visibleCount = 4;
      renderPosts();
    });
  });

  applyPostingAccess();
  renderPosts();
}

function initMapPage() {
  const mapEl = $('#map');
  if (!mapEl || typeof L === 'undefined') return;

  const searchInput = $('#location-search');
  const list = $('#nearby-list');
  const filterButtons = $$('[data-map-filter]');
  const locateButton = $('#locate-me');
  const locations = [
    { id: 'nyc-liz', name: 'Liz Christy Community Garden', lat: 40.7229, lng: -73.9897, type: 'community', label: 'Community Garden', items: 'Volunteer beds and pollinator space', area: 'New York, NY', zip: '10002' },
    { id: 'nyc-battery', name: 'Battery Urban Farm', lat: 40.7041, lng: -74.0170, type: 'produce', label: 'Produce', items: 'Urban farm education and seasonal crops', area: 'New York, NY', zip: '10004' },
    { id: 'brooklyn-grange', name: 'Brooklyn Grange Navy Yard', lat: 40.6983, lng: -73.9705, type: 'produce', label: 'Produce', items: 'Rooftop farm produce and events', area: 'Brooklyn, NY', zip: '11205' },
    { id: 'greenpoint-seed', name: 'Greenpoint Seed Library', lat: 40.7317, lng: -73.9546, type: 'seeds', label: 'Seeds', items: 'Borrow and share seasonal seeds', area: 'Brooklyn, NY', zip: '11222' },
    { id: 'red-hook-farm', name: 'Red Hook Community Farm', lat: 40.6763, lng: -74.0139, type: 'produce', label: 'Produce', items: 'Community farm produce and volunteer days', area: 'Brooklyn, NY', zip: '11231' },
    { id: 'harlem-grown', name: 'Harlem Grown', lat: 40.8007, lng: -73.9492, type: 'community', label: 'Community Garden', items: 'Youth garden programs and neighborhood growing', area: 'New York, NY', zip: '10035' },
    { id: 'philly-orchard', name: 'Philadelphia Orchard Project', lat: 39.9526, lng: -75.1652, type: 'community', label: 'Community Garden', items: 'Community orchard and education support', area: 'Philadelphia, PA', zip: '19107' },
    { id: 'dc-farm', name: 'Common Good City Farm', lat: 38.9146, lng: -77.0190, type: 'produce', label: 'Produce', items: 'Urban farm and food access programming', area: 'Washington, DC', zip: '20001' },
    { id: 'boston-farm', name: 'The Food Project Urban Farm', lat: 42.3431, lng: -71.0824, type: 'produce', label: 'Produce', items: 'Neighborhood food growing and youth leadership', area: 'Boston, MA', zip: '02119' },
    { id: 'atlanta-garden', name: 'Truly Living Well Urban Farm', lat: 33.7550, lng: -84.3725, type: 'produce', label: 'Produce', items: 'Urban farm produce and classes', area: 'Atlanta, GA', zip: '30312' },
    { id: 'miami-garden', name: 'Little Haiti Community Garden', lat: 25.8242, lng: -80.1918, type: 'community', label: 'Community Garden', items: 'Neighborhood garden plots and events', area: 'Miami, FL', zip: '33127' },
    { id: 'chicago-farm', name: 'Windy City Harvest Farm', lat: 41.8430, lng: -87.7112, type: 'produce', label: 'Produce', items: 'Training farm and seasonal produce', area: 'Chicago, IL', zip: '60623' },
    { id: 'detroit-farm', name: 'D-Town Farm', lat: 42.4082, lng: -83.1703, type: 'produce', label: 'Produce', items: 'Large-scale urban farm and market produce', area: 'Detroit, MI', zip: '48219' },
    { id: 'minneapolis-seed', name: 'Minnesota Seed Library Network', lat: 44.9778, lng: -93.2650, type: 'seeds', label: 'Seeds', items: 'Seed-saving support and community exchanges', area: 'Minneapolis, MN', zip: '55401' },
    { id: 'stl-garden', name: 'Gateway Greening Demonstration Garden', lat: 38.6286, lng: -90.2050, type: 'community', label: 'Community Garden', items: 'Community gardening education and plots', area: 'St. Louis, MO', zip: '63106' },
    { id: 'dallas-farm', name: 'Bonton Farms', lat: 32.7488, lng: -96.7560, type: 'produce', label: 'Produce', items: 'Community market garden and food access', area: 'Dallas, TX', zip: '75215' },
    { id: 'houston-garden', name: 'Finca Tres Robles', lat: 29.7433, lng: -95.3154, type: 'produce', label: 'Produce', items: 'Urban farm produce and workshops', area: 'Houston, TX', zip: '77003' },
    { id: 'austin-seed', name: 'Austin Seed Library', lat: 30.2672, lng: -97.7431, type: 'seeds', label: 'Seeds', items: 'Community seed lending and swaps', area: 'Austin, TX', zip: '78701' },
    { id: 'denver-farm', name: 'GrowHaus Community Food Center', lat: 39.7597, lng: -104.9157, type: 'community', label: 'Community Garden', items: 'Food access, gardens, and education', area: 'Denver, CO', zip: '80216' },
    { id: 'phoenix-garden', name: 'Spaces of Opportunity', lat: 33.3985, lng: -112.0724, type: 'community', label: 'Community Garden', items: 'Community farms, markets, and learning space', area: 'Phoenix, AZ', zip: '85040' },
    { id: 'salt-lake-farm', name: 'Wasatch Community Gardens Campus', lat: 40.7240, lng: -111.8520, type: 'community', label: 'Community Garden', items: 'Garden education and community growing', area: 'Salt Lake City, UT', zip: '84105' },
    { id: 'seattle-farm', name: 'Beacon Food Forest', lat: 47.5787, lng: -122.3114, type: 'community', label: 'Community Garden', items: 'Food forest with open community harvesting', area: 'Seattle, WA', zip: '98108' },
    { id: 'portland-seed', name: 'Portland Seed Library', lat: 45.5231, lng: -122.6765, type: 'seeds', label: 'Seeds', items: 'Seed lending and local growing resources', area: 'Portland, OR', zip: '97204' },
    { id: 'sf-farm', name: 'Alemany Farm', lat: 37.7327, lng: -122.4204, type: 'produce', label: 'Produce', items: 'Volunteer-run urban farm and produce', area: 'San Francisco, CA', zip: '94110' },
    { id: 'oakland-garden', name: 'City Slicker Farms', lat: 37.8044, lng: -122.2712, type: 'produce', label: 'Produce', items: 'Backyard garden support and local produce', area: 'Oakland, CA', zip: '94607' },
    { id: 'la-seed', name: 'Los Angeles Seed Library', lat: 34.0522, lng: -118.2437, type: 'seeds', label: 'Seeds', items: 'Free seed sharing and gardening resources', area: 'Los Angeles, CA', zip: '90012' },
    { id: 'san-diego-garden', name: 'Ocean View Growing Grounds', lat: 32.7243, lng: -117.1611, type: 'community', label: 'Community Garden', items: 'Community food production and training', area: 'San Diego, CA', zip: '92113' }
  ];

  const map = L.map('map', { scrollWheelZoom: true }).setView([39.8283, -98.5795], 4);
  window.greenThumbMap = map;
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19
  }).addTo(map);

  const markerIcon = L.divIcon({
    className: '',
    html: '<div style="width:28px;height:28px;border-radius:50%;background:#3a5a40;border:3px solid #fff;box-shadow:0 4px 10px rgba(0,0,0,0.18);"></div>',
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  });

  const markers = new Map();

  function activeMapFilter() {
    return filterButtons.find((button) => button.classList.contains('active'))?.dataset.mapFilter || 'all';
  }

  function filteredLocations() {
    const query = (searchInput?.value || '').trim().toLowerCase();
    const filter = activeMapFilter();
    return locations.filter((location) => {
      const matchesFilter = filter === 'all' || location.type === filter;
      const haystack = `${location.name} ${location.area} ${location.zip} ${location.items}`.toLowerCase();
      const matchesQuery = !query || haystack.includes(query);
      return matchesFilter && matchesQuery;
    });
  }

  function focusLocation(id) {
    const location = locations.find((item) => item.id === id);
    if (!location) return;
    const marker = markers.get(id);
    if (marker) {
      map.flyTo([location.lat, location.lng], 11, { duration: 0.6 });
      marker.openPopup();
    }
    $$('.nearby-item', list).forEach((item) => item.classList.toggle('active', item.dataset.locationId === id));
  }

  function renderMap() {
    const visible = filteredLocations();
    list.innerHTML = '';

    markers.forEach((marker) => marker.remove());
    markers.clear();

    visible.forEach((location) => {
      const popup = `<div style="min-width:200px;"><strong>${location.name}</strong><br><span style="font-size:0.78rem;color:#70806e;">${location.label} · ${location.area}</span><br><span style="font-size:0.8rem;color:#3a5a40;display:block;margin-top:0.45rem;">${location.items}</span><span style="font-size:0.74rem;color:#70806e;display:block;margin-top:0.35rem;">ZIP ${location.zip}</span></div>`;
      const marker = L.marker([location.lat, location.lng], { icon: markerIcon }).addTo(map).bindPopup(popup);
      marker.on('click', () => focusLocation(location.id));
      markers.set(location.id, marker);

      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'nearby-item';
      item.dataset.locationId = location.id;
      item.innerHTML = `<h4>${location.name}</h4><p>${location.items}</p><div class="dist">${location.label} · ${location.area} · ${location.zip}</div>`;
      item.addEventListener('click', () => focusLocation(location.id));
      list.appendChild(item);
    });

    if (!visible.length) {
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.innerHTML = '<h3>No matching locations</h3><p>Try a broader search or switch the map filter back to All.</p>';
      list.appendChild(empty);
      map.setView([39.8283, -98.5795], 4);
      return;
    }

    const bounds = L.latLngBounds(visible.map((location) => [location.lat, location.lng]));
    map.fitBounds(bounds.pad(0.12));
    window.setTimeout(() => map.invalidateSize(), 120);
  }

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      filterButtons.forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      renderMap();
    });
  });

  searchInput?.addEventListener('input', renderMap);

  locateButton?.addEventListener('click', () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not available in this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      map.flyTo([latitude, longitude], 10, { duration: 0.6 });
      L.circleMarker([latitude, longitude], {
        radius: 8,
        color: '#ffffff',
        weight: 2,
        fillColor: '#3a5a40',
        fillOpacity: 1
      }).addTo(map).bindPopup('You are here').openPopup();
    }, () => {
      showToast('Location access was blocked, so the map stayed on the national view.');
    });
  });

  renderMap();
}

function initProfilePage() {
  const authView = $('#auth-view');
  if (!authView) return;

  const signupForm = $('#signup-form');
  const signinForm = $('#signin-form');
  const profileView = $('#profile-view');
  const signupStatus = $('#signup-status');
  const signinStatus = $('#signin-status');
  const saveStatus = $('#profile-save-status');
  const googleButton = $('#google-signin');

  function setStatus(element, message, type = '') {
    if (!element) return;
    element.textContent = message;
    element.className = `auth-status${type ? ` ${type}` : ''}`;
  }

  function renderProfile() {
    const user = getCurrentUser();
    if (!user) {
      authView.style.display = 'flex';
      profileView.style.display = 'none';
      return;
    }

    authView.style.display = 'none';
    profileView.style.display = 'block';

    $('#profile-avatar').textContent = initials(user.name);
    $('#profile-name').textContent = user.name;
    $('#profile-location').textContent = `ZIP / Postal Code: ${user.zip}`;
    $('#profile-joined').textContent = formatJoined(user.createdAt);
    $('#profile-provider').textContent = user.provider === 'google' ? 'Google Account' : 'Email Account';
    $('#profile-summary').textContent = user.about || 'Add a short description of your growing setup, what you share, and what help you are looking for.';
    $('#profile-name-input').value = user.name || '';
    $('#profile-zip-input').value = user.zip || '';
    $('#profile-about-input').value = user.about || '';
    $('#profile-grow-input').value = user.grow || '';
    $('#profile-posts').textContent = String(getPosts().filter((post) => slugEmail(post.email) === slugEmail(user.email)).length);
    $('#profile-listings').textContent = user.listings ? String(user.listings) : '0';
  }

  signupForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(signupForm);
    const name = String(data.get('name') || '').trim();
    const email = slugEmail(data.get('email'));
    const zip = String(data.get('zip') || '').trim();
    const password = String(data.get('password') || '');

    if (!name || !email || !zip || !password) {
      setStatus(signupStatus, 'Complete every field before creating an account.', 'error');
      return;
    }
    if (password.length < 8) {
      setStatus(signupStatus, 'Use at least 8 characters for the password.', 'error');
      return;
    }
    if (getUsers().some((user) => slugEmail(user.email) === email)) {
      setStatus(signupStatus, 'That email is already registered in this browser.', 'error');
      return;
    }

    const users = getUsers();
    users.push({
      id: crypto.randomUUID(),
      name,
      email,
      zip,
      password,
      provider: 'email',
      about: '',
      grow: '',
      listings: 0,
      createdAt: new Date().toISOString()
    });
    saveUsers(users);
    setCurrentUserEmail(email);
    setStatus(signupStatus, 'Account created successfully.', 'success');
    signupForm.reset();
    updateNavForUser();
    renderProfile();
  });

  signinForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(signinForm);
    const email = slugEmail(data.get('email'));
    const password = String(data.get('password') || '');
    const user = getUsers().find((item) => slugEmail(item.email) === email && item.password === password);

    if (!user) {
      setStatus(signinStatus, 'Email or password did not match a saved account.', 'error');
      return;
    }

    setCurrentUserEmail(user.email);
    setStatus(signinStatus, 'Signed in successfully.', 'success');
    signinForm.reset();
    updateNavForUser();
    renderProfile();
  });

  googleButton?.addEventListener('click', () => {
    setStatus(signinStatus, 'Google sign-in needs a real OAuth client ID and allowed domain setup before it can work.', 'error');
  });

  $('#signout-button')?.addEventListener('click', () => {
    setCurrentUserEmail('');
    updateNavForUser();
    renderProfile();
    showToast('Signed out.');
  });

  $('#profile-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const users = getUsers();
    const nextUsers = users.map((user) => {
      if (slugEmail(user.email) !== slugEmail(currentUser.email)) return user;
      return {
        ...user,
        name: $('#profile-name-input').value.trim(),
        zip: $('#profile-zip-input').value.trim(),
        about: $('#profile-about-input').value.trim(),
        grow: $('#profile-grow-input').value.trim()
      };
    });
    saveUsers(nextUsers);
    renderProfile();
    if (saveStatus) {
      saveStatus.style.display = 'inline-flex';
      window.setTimeout(() => { saveStatus.style.display = 'none'; }, 1800);
    }
    showToast('Profile saved locally.');
  });

  renderProfile();
}

function initAll() {
  initNav();
  initObservers();
  initAuthTabs();
  initPlantsPage();
  initCommunityPage();
  initMapPage();
  initProfilePage();
}

window.addEventListener('load', initAll);
