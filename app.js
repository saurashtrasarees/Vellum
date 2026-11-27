// ==========================================================================
// VELLUM — Multi-Firm Luxury Saree Showroom Engine
// Architecture & Engineering by BinduGrid Studio (contact@bindugrid.com)
// ==========================================================================

const CONFIG = {
  sheetId: '1O-F9nVgPdkamtTGDesEcde8PCZSK7pyjUJDi8PrwmaY',
  sheetUrl: 'https://docs.google.com/spreadsheets/d/1O-F9nVgPdkamtTGDesEcde8PCZSK7pyjUJDi8PrwmaY/gviz/tq?tqx=out:csv&sheet=Catalogs%20%26%20Pricing',
};

// --------------------------------------------------------------------------
// 1. FIRMS CONFIGURATION (Keya Fashion & Saurashtra Sarees)
// --------------------------------------------------------------------------
const FIRMS = {
  saurashtra: {
    id: 'saurashtra',
    name: 'Saurashtra Sarees',
    tagline: 'Make Occasion Better',
    logo: 'assets/saurashtra-sarees-logo.jpg',
    themeClass: 'theme-saurashtra',
    primaryColor: '#8b1d40',
    accentColor: '#d4af37',
    defaultPhone: '9879471039',
    defaultWhatsapp: '919879471039'
  },
  keya: {
    id: 'keya',
    name: 'Keya Fashion',
    tagline: 'Stop wishing. Start living....',
    logo: 'assets/keya-fashion-logo.jpg',
    themeClass: 'theme-keya',
    primaryColor: '#0284c7',
    accentColor: '#f59e0b',
    defaultPhone: '9913643433',
    defaultWhatsapp: '919913643433'
  }
};

// --------------------------------------------------------------------------
// 2. DEDICATED USER PROFILES (No. 1 to No. 4)
// Formula: First 2 letters of Name + Last 2 digits of Mobile
// --------------------------------------------------------------------------
const USER_PROFILES = {
  // ------------------------------------------------------------------------
  // 1. Keya Fashion [All Retail Rate]
  // ------------------------------------------------------------------------
  'KH28': {
    code: 'KH28',
    slug: 'khushi',
    name: 'Khushi',
    initials: 'KH',
    title: 'Dedicated Catalog Representative',
    phone: '9825452528',
    whatsapp: '919825452528',
    displayPhone: '+91 98254 52528',
    firm: 'keya',
    rateAccess: 'retail' // Retail only
  },
  'AN26': {
    code: 'AN26',
    slug: 'anshika',
    name: 'Anshika',
    initials: 'AN',
    title: 'Client Relationship Executive',
    phone: '9825452526',
    whatsapp: '919825452526',
    displayPhone: '+91 98254 52526',
    firm: 'keya',
    rateAccess: 'retail'
  },
  'PR28': {
    code: 'PR28',
    slug: 'priti',
    name: 'Priti',
    initials: 'PR',
    title: 'Customer Sales Coordinator',
    phone: '9909352528',
    whatsapp: '919909352528',
    displayPhone: '+91 99093 52528',
    firm: 'keya',
    rateAccess: 'retail'
  },
  'PA28': {
    code: 'PA28',
    slug: 'palak',
    name: 'Palak',
    initials: 'PA',
    title: 'Order Desk Manager',
    phone: '9909452528',
    whatsapp: '919909452528',
    displayPhone: '+91 99094 52528',
    firm: 'keya',
    rateAccess: 'retail'
  },
  'JE04': {
    code: 'JE04',
    slug: 'jenish',
    name: 'Jenish',
    initials: 'JE',
    title: 'Digital Sales Executive',
    phone: '9033808104',
    whatsapp: '919033808104',
    displayPhone: '+91 90338 08104',
    firm: 'keya',
    rateAccess: 'retail'
  },

  // ------------------------------------------------------------------------
  // 2. Saurashtra Sarees [All Retail Rate]
  // ------------------------------------------------------------------------
  'AR38': {
    code: 'AR38',
    slug: 'arvind',
    name: 'Arvind Sir',
    initials: 'AR',
    title: 'Senior Sales Director',
    phone: '9824982338',
    whatsapp: '919824982338',
    displayPhone: '+91 98249 82338',
    firm: 'saurashtra',
    rateAccess: 'retail' // Retail only
  },
  'NA39': {
    code: 'NA39',
    slug: 'nayan',
    name: 'Nayan Sir',
    initials: 'NA',
    title: 'Head of Sales & Distribution',
    phone: '9879471039',
    whatsapp: '919879471039',
    displayPhone: '+91 98794 71039',
    firm: 'saurashtra',
    rateAccess: 'retail' // Retail only
  },
  'CH33': {
    code: 'CH33',
    slug: 'chetan',
    name: 'Chetan Sir',
    initials: 'CH',
    title: 'Managing Director & Sales Head',
    phone: '9913643433',
    whatsapp: '919913643433',
    displayPhone: '+91 99136 43433',
    firm: 'saurashtra',
    rateAccess: 'retail' // Retail only
  },

  // ------------------------------------------------------------------------
  // 3. Saurashtra Sarees [All Rate]
  // ------------------------------------------------------------------------
  'NA39ALL': {
    code: 'NA39ALL',
    slug: 'nayan-all',
    name: 'Nayan Sir',
    initials: 'NA',
    title: 'Head of Sales & Distribution (All Rates)',
    phone: '9879471039',
    whatsapp: '919879471039',
    displayPhone: '+91 98794 71039',
    firm: 'saurashtra',
    rateAccess: 'all' // Super Wholesale, Reseller & Retail
  },
  'CH33ALL': {
    code: 'CH33ALL',
    slug: 'chetan-all',
    name: 'Chetan Sir',
    initials: 'CH',
    title: 'Managing Director (All Rates)',
    phone: '9913643433',
    whatsapp: '919913643433',
    displayPhone: '+91 99136 43433',
    firm: 'saurashtra',
    rateAccess: 'all' // Super Wholesale, Reseller & Retail
  }
};

// 4. Super Admin Configuration
const SUPER_ADMIN = {
  name: 'Super Admin',
  phone: '9898907401',
  displayPhone: '+91 98989 07401',
  pins: ['7401', '9879', '9898', '9898907401']
};

// Global State
const state = {
  catalogs: [],
  filteredCatalogs: [],
  selectedCategory: 'all',
  searchQuery: '',
  sortBy: 'newest',
  currentRole: 'retail', // 'retail', 'all', 'wholesale', 'reseller'
  currentShoot: 'all',   // 'all' (default), 'model', 'table'
  activeFirm: 'saurashtra',
  activeUser: null,
  isLocked: false,
  isSuperAdmin: false,
  activePdpCatalog: null,
  activePdpDesignIndex: 0,
  activePdpImageIndex: 0,
  activePdpShoot: 'all',
  activePdpTab: 'specs'
};

// --------------------------------------------------------------------------
// 3. INITIALIZATION & ROUTING
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', async () => {
  resolveUrlContext();
  await loadCatalogData();
  renderCategoryPills();
  applyFiltersAndRender();
  
  // Hash Routing Listener (for Shopify PDP navigation)
  window.addEventListener('hashchange', handleHashRoute);
  handleHashRoute();

  if (window.lucide) lucide.createIcons();
});

// Resolve Firm, User, Role and Lockdown from URL parameters
function resolveUrlContext() {
  const params = new URLSearchParams(window.location.search);
  
  // 1. Super Admin Check
  const adminParam = (params.get('admin') || '').trim();
  if (adminParam === '9898907401' || adminParam === '7401' || adminParam === 'true') {
    state.isSuperAdmin = true;
    sessionStorage.setItem('vellum_admin_auth', 'true');
  } else if (sessionStorage.getItem('vellum_admin_auth') === 'true') {
    state.isSuperAdmin = true;
  }

  // 2. User Code Resolution (e.g., ?u=KH28, ?u=NA39ALL, ?staff=AR38)
  let rawUser = (params.get('u') || params.get('user') || params.get('staff') || '').toUpperCase().trim();
  rawUser = rawUser.replace(/[^A-Z0-9]/g, '');

  let matchedUser = USER_PROFILES[rawUser];

  // Also check if someone passed the slug (e.g. ?staff=khushi)
  if (!matchedUser && rawUser) {
    matchedUser = Object.values(USER_PROFILES).find(p => p.slug.toUpperCase().replace(/[^A-Z0-9]/g, '') === rawUser);
  }

  if (matchedUser) {
    state.activeUser = matchedUser;
    state.activeFirm = matchedUser.firm;
    state.isLocked = true; // Firm and user are locked!
    
    if (matchedUser.rateAccess === 'all') {
      state.currentRole = 'all';
    } else {
      state.currentRole = 'retail';
    }
  } else {
    // If no user code supplied: check firm param or default
    const firmParam = (params.get('firm') || params.get('f') || '').toLowerCase().trim();
    if (firmParam === 'keya' || firmParam === 'keyafashion') {
      state.activeFirm = 'keya';
      state.activeUser = USER_PROFILES['KH28'];
    } else {
      state.activeFirm = 'saurashtra';
      state.activeUser = USER_PROFILES['AR38'];
    }
    state.isLocked = false;
    state.currentRole = 'retail';
  }

  // 3. Shoot resolution (Default is always "all")
  const shootParam = (params.get('shoot') || '').toLowerCase().trim();
  if (shootParam === 'model') state.currentShoot = 'model';
  else if (shootParam === 'table') state.currentShoot = 'table';
  else state.currentShoot = 'all';

  applyFirmTheme();
  applyLockdownUI();
  updateRoleUI();
  updateShootUI();
  updateStaffUI();
}

function applyFirmTheme() {
  const firm = FIRMS[state.activeFirm] || FIRMS.saurashtra;
  const body = document.getElementById('appBody');
  
  if (body) {
    body.className = `${firm.themeClass} min-h-screen flex flex-col antialiased selection:bg-slate-900 selection:text-white`;
  }

  // Update Page Title & Firm Logos
  document.getElementById('pageTitle').textContent = `${firm.name} | Digital Textile Showroom`;
  
  const logoImg = document.getElementById('firmLogoImg');
  if (logoImg) logoImg.src = firm.logo;

  const footerLogo = document.getElementById('footerFirmLogo');
  if (footerLogo) footerLogo.src = firm.logo;

  // Header & Announcement Text
  document.getElementById('headerFirmName').textContent = firm.name;
  document.getElementById('announcementFirmText').textContent = firm.name;
  document.getElementById('announcementTagline').textContent = firm.tagline;
  document.getElementById('footerFirmName').textContent = firm.name;
  document.getElementById('footerFirmTagline').textContent = firm.tagline;
  document.getElementById('heroFirmTag').textContent = `${firm.name} Direct Wholesale`;
  
  const pillLabel = document.getElementById('currentFirmPillLabel');
  if (pillLabel) pillLabel.textContent = `Firm: ${firm.name.split(' ')[0]}`;
}

// Enforces strict lockdown rules for No. 1, 2, 3
function applyLockdownUI() {
  const firmSwitcherContainer = document.getElementById('firmSwitcherContainer');
  const roleDropdownContainer = document.getElementById('roleDropdownContainer');
  const adminHeaderBtn = document.getElementById('adminHeaderBtn');

  if (state.isSuperAdmin) {
    if (firmSwitcherContainer) firmSwitcherContainer.classList.remove('hidden');
    if (roleDropdownContainer) roleDropdownContainer.classList.remove('hidden');
    if (adminHeaderBtn) adminHeaderBtn.classList.remove('hidden');
    return;
  }

  // For regular staff/customer links:
  // 1. Hide firm switcher completely (Firm is strictly locked)
  if (firmSwitcherContainer) {
    firmSwitcherContainer.classList.add('hidden');
  }

  // 2. Hide admin button completely
  if (adminHeaderBtn) {
    adminHeaderBtn.classList.add('hidden');
  }

  // 3. For No. 1 & 2 (Retail only), hide role dropdown completely
  // For No. 3 (All Rate users), keep role visible or show All Rates badge
  if (roleDropdownContainer) {
    if (state.activeUser && state.activeUser.rateAccess === 'all') {
      roleDropdownContainer.classList.remove('hidden');
    } else {
      roleDropdownContainer.classList.add('hidden');
    }
  }
}

function updateStaffUI() {
  const user = state.activeUser;
  if (!user) return;

  const staffNameEls = [
    document.getElementById('staffNameDisplay'),
    document.getElementById('badgeStaffActive')
  ];
  staffNameEls.forEach(el => {
    if (el) el.textContent = `${user.name} (${user.code})`;
  });

  const phoneEl = document.getElementById('staffPhoneDisplay');
  if (phoneEl) phoneEl.textContent = user.displayPhone;

  const callLink = document.getElementById('staffCallLink');
  if (callLink) callLink.href = `tel:+91${user.phone}`;
}

function switchFirm(firmId) {
  if (state.isLocked && !state.isSuperAdmin) return;
  state.activeFirm = firmId;
  applyFirmTheme();
  
  // Re-assign default representative for the newly selected firm
  state.activeUser = firmId === 'keya' ? USER_PROFILES['KH28'] : USER_PROFILES['AR38'];
  updateStaffUI();

  toggleFirmMenu();
  applyFiltersAndRender();
  if (state.activePdpCatalog) renderPdpScreen();
}

function toggleFirmMenu() {
  if (state.isLocked && !state.isSuperAdmin) return;
  const menu = document.getElementById('firmMenu');
  if (menu) menu.classList.toggle('hidden');
}

function updateRoleUI() {
  const labelEl = document.getElementById('currentRoleLabel');
  const badgeEl = document.getElementById('badgeRoleActive');

  let labelText = 'Catalog MRP';
  let badgeText = 'Retail / Catalog MRP Rate';
  let badgeClass = 'text-purple-700';

  if (state.currentRole === 'all') {
    labelText = 'All Rates Active';
    badgeText = 'All Rates (Wholesale, Reseller & Retail)';
    badgeClass = 'text-amber-700';
  } else if (state.currentRole === 'wholesale') {
    labelText = 'Wholesale Rate';
    badgeText = 'Super Wholesale Rate';
    badgeClass = 'text-emerald-700';
  } else if (state.currentRole === 'reseller') {
    labelText = 'Portal Seller Rate';
    badgeText = 'Reseller / Portal Rate';
    badgeClass = 'text-blue-700';
  }

  if (labelEl) labelEl.textContent = labelText;
  if (badgeEl) {
    badgeEl.textContent = badgeText;
    badgeEl.className = `${badgeClass} font-bold`;
  }
}

function toggleRoleMenu() {
  const menu = document.getElementById('roleMenu');
  if (menu) menu.classList.toggle('hidden');
}

function setRole(role) {
  state.currentRole = role;
  updateRoleUI();
  toggleRoleMenu();
  applyFiltersAndRender();
  if (state.activePdpCatalog) renderPdpScreen();
}

function updateShootUI() {
  const btnAll = document.getElementById('btnShootAll');
  const btnModel = document.getElementById('btnShootModel');
  const btnTable = document.getElementById('btnShootTable');
  
  const mBtnAll = document.getElementById('mobileBtnAll');
  const mBtnModel = document.getElementById('mobileBtnModel');
  const mBtnTable = document.getElementById('mobileBtnTable');

  const badgeShoot = document.getElementById('badgeShootActive');

  const activeClass = 'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs bg-white text-slate-900';
  const inactiveClass = 'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 transition-all';

  if (btnAll && btnModel && btnTable) {
    btnAll.className = (state.currentShoot === 'all') ? activeClass : inactiveClass;
    btnModel.className = (state.currentShoot === 'model') ? activeClass : inactiveClass;
    btnTable.className = (state.currentShoot === 'table') ? activeClass : inactiveClass;
  }

  const mActiveClass = 'flex-1 py-1.5 rounded-lg text-xs font-bold bg-white text-slate-900 shadow-xs text-center';
  const mInactiveClass = 'flex-1 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 text-center';

  if (mBtnAll && mBtnModel && mBtnTable) {
    mBtnAll.className = (state.currentShoot === 'all') ? mActiveClass : mInactiveClass;
    mBtnModel.className = (state.currentShoot === 'model') ? mActiveClass : mInactiveClass;
    mBtnTable.className = (state.currentShoot === 'table') ? mActiveClass : mInactiveClass;
  }

  if (badgeShoot) {
    badgeShoot.textContent = (state.currentShoot === 'all') 
      ? 'All Shoots (Model + Table)' 
      : (state.currentShoot === 'model' ? 'Model Shoot Only' : 'Table Shoot Only');
  }
}

function setShootType(type) {
  state.currentShoot = type;
  updateShootUI();
  applyFiltersAndRender();
}

// --------------------------------------------------------------------------
// 4. DATA LOADING & GOOGLE SHEET LIVE PRICING
// --------------------------------------------------------------------------
async function loadCatalogData() {
  try {
    const res = await fetch('data/catalogs.json');
    if (res.ok) {
      state.catalogs = await res.json();
    }
  } catch (err) {
    console.warn('Local catalog fallback error:', err);
  }

  // Live Google Sheet sync
  try {
    const sheetRes = await fetch(CONFIG.sheetUrl);
    if (sheetRes.ok) {
      const csvText = await sheetRes.text();
      mergeSheetPricing(csvText);
      console.log('✓ Google Sheet Live Pricing successfully synced!');
    }
  } catch (sheetErr) {
    console.log('Using local pricing database.');
  }

  state.filteredCatalogs = [...state.catalogs];
}

function mergeSheetPricing(csvText) {
  const lines = csvText.split('\n');
  if (lines.length < 2) return;

  const priceMap = {};
  for (let i = 1; i < lines.length; i++) {
    const row = parseCsvRow(lines[i]);
    if (row.length >= 6) {
      const code = row[0].trim().toLowerCase();
      const wsRate = parseInt(row[3].replace(/[^0-9]/g, '')) || null;
      const resRate = parseInt(row[4].replace(/[^0-9]/g, '')) || null;
      const retRate = parseInt(row[5].replace(/[^0-9]/g, '')) || null;
      const status = row[6] ? row[6].trim() : 'Ready to Dispatch';

      priceMap[code] = { wholesale: wsRate, reseller: resRate, retail: retRate, status: status };
    }
  }

  state.catalogs.forEach(cat => {
    const mapped = priceMap[cat.code.toLowerCase()];
    if (mapped) {
      if (mapped.wholesale) cat.wholesaleRate = mapped.wholesale;
      if (mapped.reseller) cat.resellerRate = mapped.reseller;
      if (mapped.retail) cat.retailRate = mapped.retail;
      if (mapped.status) cat.status = mapped.status;
    }
  });
}

function parseCsvRow(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') inQuotes = !inQuotes;
    else if (ch === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else current += ch;
  }
  result.push(current);
  return result;
}

// --------------------------------------------------------------------------
// 5. ACCURATE INDIAN TEXTILE COLOR PALETTE & HOVER TOOLTIPS
// --------------------------------------------------------------------------
function getAccurateColor(colorName) {
  if (!colorName) return { hex: '#94a3b8', label: 'Multi-Color' };
  const c = colorName.toLowerCase().replace(/_/g, ' ');

  if (c.includes('wine') || c.includes('burgundy')) return { hex: '#722F37', label: 'Deep Wine' };
  if (c.includes('maroon')) return { hex: '#800000', label: 'Royal Maroon' };
  if (c.includes('red')) return { hex: '#C41E3A', label: 'Ruby Red' };
  if (c.includes('peacock') || c.includes('rama')) return { hex: '#005F73', label: 'Peacock Rama' };
  if (c.includes('navy')) return { hex: '#0B1B3D', label: 'Midnight Navy' };
  if (c.includes('sky')) return { hex: '#38BDF8', label: 'Firozi Sky Blue' };
  if (c.includes('blue')) return { hex: '#1E3A8A', label: 'Royal Blue' };
  if (c.includes('rani') || c.includes('magenta')) return { hex: '#E11D48', label: 'Rani Pink' };
  if (c.includes('pink')) return { hex: '#F472B6', label: 'Gulabi Pink' };
  if (c.includes('haldi') || c.includes('gold')) return { hex: '#EAB308', label: 'Haldi Gold' };
  if (c.includes('mustard')) return { hex: '#CA8A04', label: 'Mustard Yellow' };
  if (c.includes('yellow')) return { hex: '#FACC15', label: 'Bright Yellow' };
  if (c.includes('mehendi')) return { hex: '#4D7C0F', label: 'Mehendi Green' };
  if (c.includes('pista')) return { hex: '#86EFAC', label: 'Pista Green' };
  if (c.includes('parrot')) return { hex: '#22C55E', label: 'Parrot Green' };
  if (c.includes('sea green')) return { hex: '#14B8A6', label: 'Sea Green' };
  if (c.includes('green')) return { hex: '#15803D', label: 'Emerald Green' };
  if (c.includes('purple')) return { hex: '#6B21A8', label: 'Imperial Purple' };
  if (c.includes('lavender')) return { hex: '#A855F7', label: 'Soft Lavender' };
  if (c.includes('orange')) return { hex: '#EA580C', label: 'Kesari Orange' };
  if (c.includes('peach')) return { hex: '#FDBA74', label: 'Aadu Peach' };
  if (c.includes('black')) return { hex: '#18181B', label: 'Jet Black' };
  if (c.includes('grey') || c.includes('gray')) return { hex: '#64748B', label: 'Charcoal Grey' };
  if (c.includes('chiku') || c.includes('beige')) return { hex: '#D4A373', label: 'Chiku Beige' };
  if (c.includes('cream') || c.includes('white')) return { hex: '#FEF3C7', label: 'Makkhan Cream' };

  return { hex: '#64748b', label: colorName };
}

// --------------------------------------------------------------------------
// 6. SCREEN 1: CATALOGUE COLLECTION & CARDS
// --------------------------------------------------------------------------
function renderCategoryPills() {
  const container = document.getElementById('categoryPills');
  if (!container) return;

  const categories = ['All Collections', ...new Set(state.catalogs.map(c => c.category))];

  container.innerHTML = categories.map(cat => {
    const val = cat === 'All Collections' ? 'all' : cat;
    const isActive = state.selectedCategory === val;
    const activeClass = isActive 
      ? 'bg-slate-900 text-white font-bold shadow-xs'
      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 font-medium';

    return `
      <button onclick="setCategory('${val}')" class="px-3.5 py-1.5 rounded-full whitespace-nowrap text-xs transition-all ${activeClass}">
        ${cat}
      </button>
    `;
  }).join('');
}

function setCategory(cat) {
  state.selectedCategory = cat;
  renderCategoryPills();
  applyFiltersAndRender();
}

function handleSearch(val) {
  state.searchQuery = val.trim().toLowerCase();
  const clearBtn = document.getElementById('btnClearSearch');
  if (clearBtn) {
    if (val) clearBtn.classList.remove('hidden');
    else clearBtn.classList.add('hidden');
  }
  applyFiltersAndRender();
}

function clearSearch() {
  const input = document.getElementById('searchInput');
  if (input) input.value = '';
  handleSearch('');
}

function handleSort(sortVal) {
  state.sortBy = sortVal;
  applyFiltersAndRender();
}

function resetFilters() {
  state.selectedCategory = 'all';
  state.searchQuery = '';
  state.sortBy = 'newest';
  const input = document.getElementById('searchInput');
  if (input) input.value = '';
  renderCategoryPills();
  applyFiltersAndRender();
}

function applyFiltersAndRender() {
  let list = [...state.catalogs];

  // Category Filter
  if (state.selectedCategory !== 'all') {
    list = list.filter(c => c.category === state.selectedCategory);
  }

  // Shoot Filter
  if (state.currentShoot === 'model') {
    list = list.filter(c => c.has2mb);
  } else if (state.currentShoot === 'table') {
    list = list.filter(c => !c.has2mb);
  }

  // Search Filter
  if (state.searchQuery) {
    list = list.filter(c => 
      c.name.toLowerCase().includes(state.searchQuery) ||
      c.code.toLowerCase().includes(state.searchQuery) ||
      c.category.toLowerCase().includes(state.searchQuery) ||
      c.fabric.toLowerCase().includes(state.searchQuery)
    );
  }

  // Sorting
  if (state.sortBy === 'price-low') {
    list.sort((a, b) => getActiveRate(a) - getActiveRate(b));
  } else if (state.sortBy === 'price-high') {
    list.sort((a, b) => getActiveRate(b) - getActiveRate(a));
  } else if (state.sortBy === 'colors') {
    list.sort((a, b) => b.skuCount - a.skuCount);
  }

  state.filteredCatalogs = list;
  renderCatalogGrid();
  renderCatalogCount();
}

function renderCatalogCount() {
  const countEl = document.getElementById('activeCatalogCount');
  if (countEl) countEl.textContent = state.filteredCatalogs.length;
}

function getActiveRate(cat) {
  if (state.currentRole === 'wholesale') return cat.wholesaleRate;
  if (state.currentRole === 'reseller') return cat.resellerRate;
  return cat.retailRate; // Default to retailRate
}

function renderCatalogGrid() {
  const grid = document.getElementById('catalogGrid') || document.getElementById('catalogsGrid');
  const emptyState = document.getElementById('emptyState');

  if (!grid) {
    console.error('Catalog grid container not found!');
    return;
  }

  if (state.filteredCatalogs.length === 0) {
    grid.innerHTML = '';
    if (emptyState) emptyState.classList.remove('hidden');
    return;
  }

  if (emptyState) emptyState.classList.add('hidden');

  const isAllRatesUser = (state.activeUser && state.activeUser.rateAccess === 'all') || state.currentRole === 'all';

  grid.innerHTML = state.filteredCatalogs.map(cat => {
    const firstDesign = cat.designs[0] || {};
    const heroImg = firstDesign.heroImageUrl || cat.heroImageUrl || 'https://placehold.co/600x800/1e293b/d4af37?text=' + encodeURIComponent(cat.name);
    const activeColorObj = getAccurateColor(firstDesign.color);
    const retailRate = cat.retailRate;
    const wholesaleRate = cat.wholesaleRate;
    const resellerRate = cat.resellerRate;

    return `
      <div class="catalog-card bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group active:scale-[0.99]">
        
        <!-- Top Media Area -->
        <div class="relative aspect-[3/4] bg-slate-900 overflow-hidden cursor-pointer" onclick="navigateToProduct('${cat.code}')">
          <img 
            id="card-hero-${cat.code}" 
            src="${heroImg}" 
            referrerpolicy="no-referrer"
            alt="${cat.name}" 
            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-106 hero-image-fade"
            onerror="this.onerror=null; this.src='https://placehold.co/600x800/1e293b/d4af37?text=${encodeURIComponent(cat.name)}';"
          >

          <!-- Top Status & Shoot Badges -->
          <div class="absolute top-2 sm:top-3 left-2 sm:left-3 right-2 sm:right-3 flex items-center justify-between pointer-events-none">
            <span class="text-[9px] sm:text-[10px] font-extrabold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full uppercase tracking-wider bg-white/95 text-slate-900 shadow-sm backdrop-blur-xs">
              ${cat.has2mb ? '👗 Model' : '🪑 Table'}
            </span>
            <span class="text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-emerald-500 text-white shadow-sm flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              <span class="hidden sm:inline">${cat.status}</span>
              <span class="sm:hidden">Ready</span>
            </span>
          </div>

          <!-- Video Play Icon Pill -->
          ${(cat.hasVideo || firstDesign.video) ? `
            <div class="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 bg-black/75 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 border border-white/20">
              <i data-lucide="play" class="w-3 h-3 fill-current text-amber-400"></i>
              <span class="hidden sm:inline">Reel</span>
            </div>
          ` : ''}

          <!-- SKU Count Overlay -->
          <div class="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 bg-black/75 backdrop-blur-xs text-white text-[9px] sm:text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-white/10">
            ${cat.skuCount} Colors
          </div>
        </div>

        <!-- Content Area -->
        <div class="p-3 sm:p-5 flex-1 flex flex-col justify-between space-y-2 sm:space-y-3.5">
          
          <div>
            <div class="flex items-center justify-between gap-1">
              <span class="text-[9px] sm:text-[10px] font-extrabold tracking-wider text-slate-400 uppercase truncate">${cat.category}</span>
              <span class="text-[9px] sm:text-[10px] font-mono text-slate-400 font-bold shrink-0">${cat.code}</span>
            </div>
            
            <h3 onclick="navigateToProduct('${cat.code}')" class="font-serif text-sm sm:text-lg font-bold text-slate-900 group-hover:text-brand-maroon transition-colors line-clamp-1 cursor-pointer mt-0.5">
              ${cat.name}
            </h3>

            <!-- Color Variants Swatches Strip with Tooltips -->
            <div class="mt-2 sm:mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
              <div class="flex items-center gap-1 sm:gap-1.5 flex-wrap">
                ${cat.designs.slice(0, 5).map((d, dIdx) => {
                  const dColor = getAccurateColor(d.color);
                  return `
                    <div class="swatch-wrapper">
                      <span class="swatch-tooltip">Design ${d.code}: ${dColor.label}</span>
                      <button 
                        type="button"
                        onclick="event.stopPropagation(); switchCardDesign('${cat.code}', ${dIdx})" 
                        class="card-dot-${cat.code} w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border border-white shadow-xs inline-block transition-transform hover:scale-125 ${dIdx === 0 ? 'ring-2 ring-slate-900 scale-110' : 'opacity-85'}"
                        style="background-color: ${dColor.hex};"
                      ></button>
                    </div>
                  `;
                }).join('')}
                ${cat.designs.length > 5 ? `
                  <span class="text-[9px] font-bold text-slate-400 ml-0.5">+${cat.designs.length - 5}</span>
                ` : ''}
              </div>

              <span id="card-design-${cat.code}" class="hidden sm:inline text-[10px] font-semibold text-slate-500 truncate max-w-[100px]">
                Design ${firstDesign.code || '101'}
              </span>
            </div>
          </div>

          <!-- Commercial Pricing Block -->
          <div class="pt-2 sm:pt-3 border-t border-slate-100">
            ${isAllRatesUser ? `
              <!-- Multi-Rate Matrix for No. 3 All-Rate Users -->
              <div class="bg-slate-50 rounded-xl sm:rounded-2xl p-2 sm:p-2.5 border border-slate-200/80 space-y-1">
                <div class="flex items-center justify-between text-[10px] sm:text-[11px]">
                  <span class="text-slate-500 font-medium">Wholesale:</span>
                  <span class="font-serif font-bold text-emerald-700">₹${wholesaleRate}</span>
                </div>
                <div class="flex items-center justify-between text-[10px] sm:text-[11px]">
                  <span class="text-slate-500 font-medium">Reseller:</span>
                  <span class="font-serif font-bold text-blue-700">₹${resellerRate}</span>
                </div>
                <div class="flex items-center justify-between text-[10px] sm:text-[11px] pt-0.5 border-t border-slate-200">
                  <span class="text-slate-700 font-bold">Catalog MRP:</span>
                  <span class="font-serif font-extrabold text-slate-900">₹${retailRate}</span>
                </div>
              </div>
            ` : `
              <!-- Single Retail MRP Rate for No. 1 and No. 2 Users -->
              <div class="flex items-baseline justify-between">
                <div>
                  <span class="text-[9px] sm:text-[10px] text-slate-400 uppercase font-semibold">Catalog MRP</span>
                  <p class="font-serif text-base sm:text-xl font-extrabold text-slate-900 leading-tight">₹${retailRate}</p>
                </div>
                <span class="text-[9px] sm:text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">✨ In Stock</span>
              </div>
            `}

            <!-- 1-Click Action Buttons -->
            <div class="flex items-center gap-1.5 sm:gap-2 mt-2.5 sm:mt-3">
              <button 
                onclick="navigateToProduct('${cat.code}')" 
                class="flex-1 py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg sm:rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-[11px] sm:text-xs font-bold transition-all text-center flex items-center justify-center gap-1 shadow-xs"
              >
                <span>View Details</span>
                <i data-lucide="arrow-right" class="w-3 h-3 sm:w-3.5 sm:h-3.5"></i>
              </button>

              <button 
                onclick="sendStaffWhatsApp('${cat.code}', 'Design ${firstDesign.code} (${activeColorObj.label})', ${retailRate})" 
                title="Inquire on WhatsApp" 
                class="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 transition-all flex items-center justify-center shrink-0"
              >
                <i data-lucide="message-circle" class="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current"></i>
              </button>
            </div>
          </div>

        </div>

      </div>
    `;
  }).join('');

  if (window.lucide) lucide.createIcons();
}

// Switch design/color directly on card
function switchCardDesign(catCode, designIdx) {
  const cat = state.catalogs.find(c => c.code.toLowerCase() === catCode.toLowerCase());
  if (!cat || !cat.designs[designIdx]) return;

  const design = cat.designs[designIdx];
  const colorObj = getAccurateColor(design.color);

  const imgEl = document.getElementById(`card-hero-${cat.code}`);
  if (imgEl && design.heroImageUrl) {
    imgEl.src = design.heroImageUrl;
  }

  const labelEl = document.getElementById(`card-design-${cat.code}`);
  if (labelEl) {
    labelEl.textContent = `Design ${design.code} — ${colorObj.label}`;
  }

  const dots = document.querySelectorAll(`.card-dot-${cat.code}`);
  dots.forEach((dot, idx) => {
    if (idx === designIdx) {
      dot.className = `card-dot-${cat.code} w-4 h-4 rounded-full border border-white shadow-xs inline-block transition-transform scale-125 ring-2 ring-slate-900`;
    } else {
      dot.className = `card-dot-${cat.code} w-4 h-4 rounded-full border border-white shadow-xs inline-block transition-transform hover:scale-125 opacity-85`;
    }
  });
}

// --------------------------------------------------------------------------
// 7. SCREEN 2: 100% SHOPIFY PRODUCT DETAIL PAGE (PDP)
// --------------------------------------------------------------------------
function navigateToProduct(catalogCode) {
  window.location.hash = `#catalog/${catalogCode.toLowerCase()}`;
}

function navigateToHome() {
  window.location.hash = '';
}

function handleHashRoute() {
  const hash = window.location.hash || '';
  const screenHome = document.getElementById('screenHome');
  const screenProduct = document.getElementById('screenProduct');

  if (hash.startsWith('#catalog/')) {
    const code = hash.replace('#catalog/', '').trim().toLowerCase();
    const cat = state.catalogs.find(c => c.code.toLowerCase() === code || c.id.toLowerCase() === code);
    
    if (cat) {
      state.activePdpCatalog = cat;
      state.activePdpDesignIndex = 0;
      state.activePdpImageIndex = 0;
      state.activePdpShoot = state.currentShoot;
      state.activePdpTab = 'specs';

      if (screenHome) screenHome.classList.add('hidden');
      if (screenProduct) screenProduct.classList.remove('hidden');
      renderPdpScreen();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
  }

  // Default: Show Home Screen
  if (screenHome) screenHome.classList.remove('hidden');
  if (screenProduct) screenProduct.classList.add('hidden');
  state.activePdpCatalog = null;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderPdpScreen() {
  const cat = state.activePdpCatalog;
  if (!cat) return;

  const firm = FIRMS[state.activeFirm] || FIRMS.saurashtra;
  const user = state.activeUser || USER_PROFILES['AR38'];
  const isAllRatesUser = user.rateAccess === 'all' || state.currentRole === 'all';

  // Breadcrumbs
  document.getElementById('pdpBreadcrumbCategory').textContent = cat.category;
  document.getElementById('pdpBreadcrumbTitle').textContent = cat.name;

  // Title, Category & Specs
  document.getElementById('pdpCategoryTag').textContent = `${firm.name} • ${cat.category} Collection`;
  document.getElementById('pdpTitle').textContent = cat.name;
  document.getElementById('pdpCode').textContent = `SKU: ${cat.code}`;

  // Rate Display Logic
  const singlePriceCard = document.getElementById('pdpSinglePriceCard');
  const allRatesCard = document.getElementById('pdpAllRatesCard');

  if (isAllRatesUser) {
    if (singlePriceCard) singlePriceCard.classList.add('hidden');
    if (allRatesCard) {
      allRatesCard.classList.remove('hidden');
      document.getElementById('pdpRateWholesale').textContent = `₹${cat.wholesaleRate}`;
      document.getElementById('pdpRateReseller').textContent = `₹${cat.resellerRate}`;
      document.getElementById('pdpRateRetail').textContent = `₹${cat.retailRate}`;
      
      const resMargin = cat.resellerRate - cat.wholesaleRate;
      const retMargin = cat.retailRate - cat.wholesaleRate;
      document.getElementById('pdpResellerMargin').textContent = `₹${resMargin}`;
      document.getElementById('pdpRetailMargin').textContent = `₹${retMargin}`;
    }
  } else {
    if (allRatesCard) allRatesCard.classList.add('hidden');
    if (singlePriceCard) {
      singlePriceCard.classList.remove('hidden');
      document.getElementById('pdpPrice').textContent = `₹${cat.retailRate}`;
      document.getElementById('pdpRoleName').textContent = 'Catalog MRP / Retail Rate';
    }
  }

  // Specifications & Story Tab Content
  document.getElementById('pdpEditorialStory').textContent = cat.editorialStory || 
    `Woven with authentic Indian textile artistry in Surat, this exquisite ${cat.category} saree features high-grade yarns with intricate metallic zari craftsmanship. Designed for luxurious comfort and majestic festive presence.`;

  document.getElementById('pdpFabric').textContent = cat.fabric;
  document.getElementById('pdpBorder').textContent = cat.border;
  document.getElementById('pdpPallu').textContent = cat.pallu;
  document.getElementById('pdpBlouse').textContent = cat.blouse;
  document.getElementById('pdpLength').textContent = cat.sareeLengthTotal || cat.length;
  document.getElementById('pdpWeight').textContent = cat.weightApprox || 'Approx. 650 - 750 grams';
  document.getElementById('pdpOrigin').textContent = cat.origin || 'Surat, Gujarat (Direct Mill)';

  // Styling Tab Content
  document.getElementById('pdpOccasionText').textContent = cat.idealOccasion || 'Weddings, Traditional Functions & Festivals';
  document.getElementById('pdpJewelryText').textContent = cat.jewelryTip || 'Complements antique gold or temple jewelry sets.';
  document.getElementById('pdpCareText').textContent = cat.washCare || 'Dry clean only recommended. Wrap in cotton cloth.';

  // Representative Card
  document.getElementById('pdpStaffAvatarLetters').textContent = user.initials || 'SR';
  document.getElementById('pdpStaffName').textContent = user.name;
  document.getElementById('pdpStaffFirm').textContent = `${firm.name} • ${user.title}`;
  document.getElementById('pdpStaffCallBtn').href = `tel:+91${user.phone}`;
  document.getElementById('pdpWhatsAppBtnText').textContent = `Inquire & Order via WhatsApp with ${user.name}`;

  // Mobile Sticky Bottom Bar (Fixed on mobile devices)
  const mobPrice = document.getElementById('pdpMobilePrice');
  if (mobPrice) mobPrice.textContent = `₹${cat.retailRate}`;
  const mobCall = document.getElementById('pdpMobileCallBtn');
  if (mobCall) mobCall.href = `tel:+91${user.phone}`;
  const mobWa = document.getElementById('pdpMobileWhatsAppText');
  if (mobWa) mobWa.textContent = `Order with ${user.name}`;

  // Swatches, Gallery, Shoot & Related
  renderPdpColorSwatches();
  updatePdpGallery();
  updatePdpShootUI();
  switchPdpTab(state.activePdpTab);
  renderRelatedCatalogs();

  if (window.lucide) lucide.createIcons();
}

function switchPdpTab(tabName) {
  state.activePdpTab = tabName;
  const tabs = ['specs', 'styling', 'care'];

  tabs.forEach(t => {
    const btn = document.getElementById(`pdpTabBtn${t.charAt(0).toUpperCase() + t.slice(1)}`);
    const content = document.getElementById(`pdpTabContent${t.charAt(0).toUpperCase() + t.slice(1)}`);

    if (t === tabName) {
      if (content) content.classList.remove('hidden');
      if (btn) {
        btn.className = 'flex-1 py-3 px-3 border-b-2 border-slate-900 text-slate-900 bg-white font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs';
      }
    } else {
      if (content) content.classList.add('hidden');
      if (btn) {
        btn.className = 'flex-1 py-3 px-3 border-b-2 border-transparent text-slate-500 hover:text-slate-800 font-medium transition-all flex items-center justify-center gap-1.5';
      }
    }
  });

  if (window.lucide) lucide.createIcons();
}

function setPdpShoot(shootType) {
  state.activePdpShoot = shootType;
  updatePdpShootUI();
  updatePdpGallery();
}

function updatePdpShootUI() {
  const btnAll = document.getElementById('pdpBtnShootAll');
  const btnModel = document.getElementById('pdpBtnShootModel');
  const btnTable = document.getElementById('pdpBtnShootTable');

  const activeClass = 'flex-1 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs bg-white text-slate-900';
  const inactiveClass = 'flex-1 py-1.5 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 transition-all';

  if (btnAll && btnModel && btnTable) {
    btnAll.className = (state.activePdpShoot === 'all') ? activeClass : inactiveClass;
    btnModel.className = (state.activePdpShoot === 'model') ? activeClass : inactiveClass;
    btnTable.className = (state.activePdpShoot === 'table') ? activeClass : inactiveClass;
  }
}

function renderPdpColorSwatches() {
  const cat = state.activePdpCatalog;
  if (!cat) return;

  const container = document.getElementById('pdpColorSwatchesContainer');
  if (!container) return;

  container.innerHTML = cat.designs.map((d, idx) => {
    const isSelected = idx === state.activePdpDesignIndex;
    const colorObj = getAccurateColor(d.color);
    const activeClass = isSelected ? 'ring-3 ring-offset-2 ring-slate-900 scale-120 shadow-md' : 'opacity-85 hover:opacity-100 hover:scale-110';

    return `
      <div class="swatch-wrapper">
        <span class="swatch-tooltip">Design ${d.code}: ${colorObj.label}</span>
        <button 
          type="button"
          onclick="selectPdpDesign(${idx})" 
          class="w-7 h-7 rounded-full border-2 border-white shadow-xs transition-all ${activeClass}"
          style="background-color: ${colorObj.hex};"
        ></button>
      </div>
    `;
  }).join('');

  const activeDesign = cat.designs[state.activePdpDesignIndex] || {};
  const activeColorObj = getAccurateColor(activeDesign.color);
  document.getElementById('pdpSelectedColorLabel').textContent = `Design ${activeDesign.code || '101'} — ${activeColorObj.label}`;
}

function selectPdpDesign(idx) {
  state.activePdpDesignIndex = idx;
  state.activePdpImageIndex = 0;
  renderPdpColorSwatches();
  updatePdpGallery();
}

function updatePdpGallery() {
  const cat = state.activePdpCatalog;
  if (!cat) return;

  const activeDesign = cat.designs[state.activePdpDesignIndex] || {};
  const realUrls = (activeDesign.imageUrls && activeDesign.imageUrls.length > 0)
    ? activeDesign.imageUrls 
    : [activeDesign.heroImageUrl || cat.heroImageUrl];

  const currentImgUrl = realUrls[state.activePdpImageIndex] || realUrls[0];

  const heroImg = document.getElementById('pdpHeroImage');
  if (heroImg && currentImgUrl) {
    heroImg.src = currentImgUrl;
  }

  // Video button
  const videoBtn = document.getElementById('pdpVideoBtn');
  if (videoBtn) {
    if (activeDesign.video || cat.hasVideo || cat.videoUrl) {
      videoBtn.classList.remove('hidden');
    } else {
      videoBtn.classList.add('hidden');
    }
  }

  // Thumbnails Strip
  const thumbStrip = document.getElementById('pdpThumbStrip');
  if (thumbStrip) {
    document.getElementById('pdpAngleCount').textContent = `${realUrls.length} Multi-Angle Views`;
    
    thumbStrip.innerHTML = realUrls.map((imgUrl, i) => {
      const isSelected = i === state.activePdpImageIndex;
      const borderClass = isSelected ? 'border-slate-900 ring-2 ring-slate-900/30 scale-105' : 'border-slate-200 opacity-70 hover:opacity-100';
      const angleLabel = i === 0 ? 'Front Drape' : i === 1 ? 'Pallu Weave' : i === 2 ? 'Border Zari' : i === 3 ? 'Pleats' : 'Blouse Piece';

      return `
        <div onclick="selectPdpAngle(${i})" class="flex-shrink-0 w-20 h-24 rounded-2xl overflow-hidden cursor-pointer border-2 transition-all relative group bg-slate-900 ${borderClass}">
          <img 
            src="${imgUrl}" 
            referrerpolicy="no-referrer"
            alt="Angle ${i+1}" 
            class="w-full h-full object-cover"
            onerror="this.onerror=null; this.src='https://placehold.co/100x120/1e293b/ffffff?text=${i+1}';"
          >
          <span class="absolute bottom-1.5 left-1.5 right-1.5 bg-black/80 backdrop-blur-xs text-[9px] text-white font-bold text-center rounded py-0.5 truncate px-1">
            ${angleLabel}
          </span>
        </div>
      `;
    }).join('');
  }
}

function selectPdpAngle(angleIdx) {
  state.activePdpImageIndex = angleIdx;
  updatePdpGallery();
  
  const angleLabel = angleIdx === 0 ? 'Front Drape Angle' : angleIdx === 1 ? 'Pallu Detail Angle' : angleIdx === 2 ? 'Border Zari Angle' : 'Pleats & Blouse Detail';
  document.getElementById('pdpAngleIndicator').textContent = angleLabel;
}

// --------------------------------------------------------------------------
// 8. SECTION: RELATED CATALOGUES (YOU MAY ALSO LIKE)
// --------------------------------------------------------------------------
function renderRelatedCatalogs() {
  const cat = state.activePdpCatalog;
  if (!cat) return;

  const container = document.getElementById('pdpRelatedGrid');
  if (!container) return;

  let related = state.catalogs.filter(c => c.code !== cat.code && c.category === cat.category);
  if (related.length < 4) {
    const others = state.catalogs.filter(c => c.code !== cat.code && c.category !== cat.category);
    related = [...related, ...others];
  }
  related = related.slice(0, 4);

  const isAllRatesUser = (state.activeUser && state.activeUser.rateAccess === 'all') || state.currentRole === 'all';

  container.innerHTML = related.map(item => {
    const firstD = item.designs[0] || {};
    const itemImg = firstD.heroImageUrl || item.heroImageUrl || 'https://placehold.co/600x800/1e293b/d4af37?text=' + encodeURIComponent(item.name);

    return `
      <div onclick="navigateToProduct('${item.code}')" class="bg-slate-50 hover:bg-white rounded-2xl p-3 border border-slate-200 cursor-pointer transition-all hover:shadow-lg group flex flex-col justify-between">
        <div class="relative aspect-[3/4] bg-slate-900 rounded-xl overflow-hidden mb-3">
          <img 
            src="${itemImg}" 
            referrerpolicy="no-referrer"
            alt="${item.name}" 
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
            onerror="this.onerror=null; this.src='https://placehold.co/600x800/1e293b/d4af37?text=${encodeURIComponent(item.name)}';"
          >
          <span class="absolute top-2 left-2 text-[9px] font-extrabold bg-black/75 text-white px-2 py-0.5 rounded">
            ${item.skuCount} Colors
          </span>
        </div>
        <div>
          <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider">${item.category}</span>
          <h4 class="font-serif text-sm font-bold text-slate-900 group-hover:text-brand-maroon transition-colors line-clamp-1">${item.name}</h4>
          <div class="flex items-baseline justify-between mt-1">
            <span class="font-serif text-base font-extrabold text-slate-900">
              ₹${isAllRatesUser ? item.wholesaleRate : item.retailRate}
            </span>
            <span class="text-[10px] text-emerald-600 font-bold">${item.status}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// --------------------------------------------------------------------------
// 9. DEDICATED STAFF WHATSAPP & CALL INQUIRIES
// --------------------------------------------------------------------------
function sendStaffWhatsApp(catalogCode, color, rate) {
  const firm = FIRMS[state.activeFirm] || FIRMS.saurashtra;
  const user = state.activeUser || USER_PROFILES['AR38'];

  const msg = encodeURIComponent(
    `Hello ${user.name} (${firm.name}),\n` +
    `I am inquiring about this catalog:\n\n` +
    `🥻 Catalog: ${catalogCode}\n` +
    `🎨 Color/Design: ${color}\n` +
    `💰 Price: ₹${rate}/- Only\n` +
    `View Mode: ${state.currentShoot.toUpperCase()}\n\n` +
    `Please share stock availability and dispatch schedule.`
  );
  window.open(`https://wa.me/${user.whatsapp}?text=${msg}`, '_blank');
}

function sendPdpWhatsApp() {
  const cat = state.activePdpCatalog;
  if (!cat) return;
  const activeDesign = cat.designs[state.activePdpDesignIndex] || {};
  const colorObj = getAccurateColor(activeDesign.color);
  const rate = cat.retailRate;

  sendStaffWhatsApp(cat.code, `${colorObj.label} (Design ${activeDesign.code})`, rate);
}

function copyPdpSpecs() {
  const cat = state.activePdpCatalog;
  if (!cat) return;
  const firm = FIRMS[state.activeFirm] || FIRMS.saurashtra;
  const user = state.activeUser || USER_PROFILES['AR38'];
  const isAllRatesUser = user.rateAccess === 'all' || state.currentRole === 'all';

  const priceText = isAllRatesUser
    ? `• Super Wholesale: ₹${cat.wholesaleRate}/-\n• Reseller Rate: ₹${cat.resellerRate}/-\n• Catalog MRP: ₹${cat.retailRate}/-`
    : `₹${cat.retailRate}/- Only (All Inclusive)`;

  const textToCopy = 
`🌸 *PREMIUM DESIGNER SAREE COLLECTION* 🌸
*Brand:* ${firm.name}
*Catalogue:* ${cat.name} (SKU: ${cat.code})
*Category:* ${cat.category}

✨ *Craft & Fabric Specifications:*
• *Fabric Quality:* ${cat.fabric}
• *Border Weave:* ${cat.border}
• *Pallu Detail:* ${cat.pallu}
• *Blouse Piece:* ${cat.blouse}
• *Total Length:* ${cat.sareeLengthTotal || cat.length}
• *Weight:* ${cat.weightApprox || 'Approx. 650 grams'}
• *Total Variants:* ${cat.skuCount} Rich Festive Shades

💰 *Price:* ${priceText}
📦 *Status:* ${cat.status} (Direct Surat Mill Dispatch)

📞 *Direct Booking & Orders:*
Representative: *${user.name}*
📱 WhatsApp / Call: ${user.displayPhone}
Direct Link: https://wa.me/${user.whatsapp}?text=${encodeURIComponent('Hello ' + user.name + ', I want to order ' + cat.name)}`;

  navigator.clipboard.writeText(textToCopy).then(() => {
    showToast(`Catalog specs copied for ${user.name}'s broadcast!`);
  });
}

// --------------------------------------------------------------------------
// 10. VIDEO REEL PLAYER & TOAST
// --------------------------------------------------------------------------
function playCurrentVideo() {
  const cat = state.activePdpCatalog || state.catalogs[0];
  if (!cat) return;
  const activeDesign = cat.designs[state.activePdpDesignIndex] || {};
  const vName = activeDesign.video || '100.mp4';
  const videoId = cat.videoDriveId || '1jLmIGfRmmDEZSNy-8xVNIyVnx9tAGwn6';

  document.getElementById('videoModalTitle').textContent = `${cat.name} • Reel Video (${vName})`;
  document.getElementById('videoFileName').textContent = `${cat.code}/${vName}`;

  const driveLink = document.getElementById('videoDriveLink');
  if (driveLink) {
    driveLink.href = `https://drive.google.com/file/d/${videoId}/view`;
  }

  const vModal = document.getElementById('videoModal');
  if (vModal) vModal.classList.remove('hidden');
  if (window.lucide) lucide.createIcons();
}

function closeVideoModal() {
  const vModal = document.getElementById('videoModal');
  if (vModal) vModal.classList.add('hidden');
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  if (toast && toastMsg) {
    toastMsg.textContent = msg;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 3000);
  }
}
