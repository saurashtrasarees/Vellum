// ==========================================================================
// VELLUM — Multi-Firm Luxury Saree Showroom Engine
// Architecture & Engineering by BinduGrid Studio (contact@bindugrid.com)
// ==========================================================================

const CONFIG = {
  sheetId: '1YcrvrrgwikEFkST8VEPf-XRjj8vWd0F750kauK1PU1o',
  catalogSheetUrl: 'https://docs.google.com/spreadsheets/d/1YcrvrrgwikEFkST8VEPf-XRjj8vWd0F750kauK1PU1o/gviz/tq?tqx=out:csv&sheet=Catalog_Master',
  staffSheetUrl: 'https://docs.google.com/spreadsheets/d/1YcrvrrgwikEFkST8VEPf-XRjj8vWd0F750kauK1PU1o/gviz/tq?tqx=out:csv&sheet=Staff_Master',
  firmSheetUrl: 'https://docs.google.com/spreadsheets/d/1YcrvrrgwikEFkST8VEPf-XRjj8vWd0F750kauK1PU1o/gviz/tq?tqx=out:csv&sheet=Firm_Master',
  securitySheetUrl: 'https://docs.google.com/spreadsheets/d/1YcrvrrgwikEFkST8VEPf-XRjj8vWd0F750kauK1PU1o/gviz/tq?tqx=out:csv&sheet=Security_Settings',
  sheetUrl: 'https://docs.google.com/spreadsheets/d/1YcrvrrgwikEFkST8VEPf-XRjj8vWd0F750kauK1PU1o/gviz/tq?tqx=out:csv&sheet=Catalog_Master',
  sheetExportUrl: 'https://docs.google.com/spreadsheets/d/1YcrvrrgwikEFkST8VEPf-XRjj8vWd0F750kauK1PU1o/export?format=csv'
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
    primaryPhone: '+91 98794 71039',
    secondaryPhone: '+91 99136 43433',
    orderPhone: '+91 99136 43433',
    directDesk: '+91 98794 71039 / +91 99136 43433',
    address: 'A-1001, Rajhans Fabrizo, Near Polaris Textile City, BRTS Road, Magob, Surat, Gujarat – 395010',
    timings: '10:00 AM – 07:00 PM (Monday–Saturday)',
    focus: 'Direct Mill Wholesale & Super Stockist Distribution',
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
    primaryPhone: '+91 98794 71039',
    secondaryPhone: '+91 99136 43433',
    orderPhone: '+91 99136 43433',
    directDesk: '+91 98794 71039 / +91 99136 43433',
    address: 'A-1001, Rajhans Fabrizo, Near Polaris Textile City, BRTS Road, Magob, Surat, Gujarat – 395010',
    timings: '10:00 AM – 07:00 PM (Monday–Saturday)',
    focus: 'Curated Catalogues & Retail Showroom Collections',
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
  'AR38': {
    code: 'AR38',
    slug: 'arvind-patel',
    name: 'Arvind Patel',
    initials: 'AP',
    title: 'Dedicated Representative',
    phone: '9824982338',
    whatsapp: '919824982338',
    displayPhone: '+91 98249 82338',
    firm: 'keya',
    rateAccess: 'retail'
  },

  // ------------------------------------------------------------------------
  // 2. Saurashtra Sarees [All Retail Rate]
  // ------------------------------------------------------------------------
  'NA39': {
    code: 'NA39',
    slug: 'nayan',
    name: 'Nayan Patel [Founder]',
    shortName: 'Nayan Patel',
    initials: 'NP',
    title: 'Founder',
    phone: '9879471039',
    whatsapp: '919879471039',
    displayPhone: '+91 98794 71039',
    firm: 'saurashtra',
    rateAccess: 'retail'
  },
  'CH33': {
    code: 'CH33',
    slug: 'chetan',
    name: 'Chetan Patel [Co-Founder]',
    shortName: 'Chetan Patel',
    initials: 'CP',
    title: 'Co-Founder',
    phone: '9913643433',
    whatsapp: '919913643433',
    displayPhone: '+91 99136 43433',
    firm: 'saurashtra',
    rateAccess: 'retail'
  }
};

// 3. Super Admin Configuration
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
  selectedCategories: [], // Multi-select fabric weaves array
  selectedPriceRange: 'all',
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
  activePdpTab: 'specs',
  cart: []
};

// --------------------------------------------------------------------------
// 2B. LIVE GOOGLE SHEET DATABASE SYNC ENGINE (Staff_Master, Firm_Master, Security_Settings)
// --------------------------------------------------------------------------
async function syncLiveGoogleSheetDatabase() {
  const promises = [];

  // 1. Staff Master Sync
  promises.push(
    fetch(CONFIG.staffSheetUrl)
      .then(r => r.ok ? r.text() : null)
      .then(csv => {
        if (!csv) return;
        const lines = csv.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        if (lines.length < 2) return;
        const headers = parseCsvRow(lines[0].toLowerCase());
        const codeIdx = headers.findIndex(h => h.includes('code'));
        const nameIdx = headers.findIndex(h => h.includes('name') || h.includes('rep'));
        const firmIdx = headers.findIndex(h => h.includes('firm'));
        const phoneIdx = headers.findIndex(h => h.includes('direct') || h.includes('phone'));
        const waIdx = headers.findIndex(h => h.includes('whatsapp'));
        const titleIdx = headers.findIndex(h => h.includes('role') || h.includes('title'));
        const rateIdx = headers.findIndex(h => h.includes('rate') || h.includes('tier') || h.includes('access'));

        for (let i = 1; i < lines.length; i++) {
          const row = parseCsvRow(lines[i]);
          const code = (row[codeIdx] || '').trim().toUpperCase();
          if (!code) continue;

          const name = (row[nameIdx] || code).trim();
          const firmText = (row[firmIdx] || '').trim().toLowerCase();
          const isKeya = firmText.includes('keya') || code === 'KH28' || code === 'AN26' || code === 'PR28' || code === 'PA28' || code === 'AR38' || code === 'JE04';
          const cleanPhone = (row[phoneIdx] || '').trim().replace(/[^0-9]/g, '');
          const cleanWa = (row[waIdx] || '').trim().replace(/[^0-9]/g, '');
          const wa = cleanWa ? (cleanWa.startsWith('91') ? cleanWa : '91' + cleanWa) : ('91' + cleanPhone);
          const title = (row[titleIdx] || 'Dedicated Representative').trim();
          const rateVal = (row[rateIdx] || '').trim().toLowerCase();
          const rateAccess = rateVal.includes('all') ? 'all' : 'retail';

          USER_PROFILES[code] = {
            code,
            slug: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
            name,
            initials: name.slice(0, 2).toUpperCase(),
            title,
            phone: cleanPhone,
            whatsapp: wa,
            displayPhone: cleanPhone.length === 10 ? `+91 ${cleanPhone.slice(0, 5)} ${cleanPhone.slice(5)}` : `+91 ${cleanPhone}`,
            firm: isKeya ? 'keya' : 'saurashtra',
            rateAccess
          };
        }
        console.log('✓ Successfully synced', Object.keys(USER_PROFILES).length, 'staff profiles live from Google Sheet Staff_Master!');
      })
      .catch(err => console.warn('Staff sync error:', err))
  );

  // 2. Firm Master Sync
  promises.push(
    fetch(CONFIG.firmSheetUrl)
      .then(r => r.ok ? r.text() : null)
      .then(csv => {
        if (!csv) return;
        const lines = csv.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        if (lines.length < 2) return;
        const headers = parseCsvRow(lines[0].toLowerCase());
        const idIdx = headers.findIndex(h => h.includes('id') || h.includes('firm'));
        const nameIdx = headers.findIndex(h => h.includes('brand') || h.includes('name'));
        const tagIdx = headers.findIndex(h => h.includes('tagline'));
        const yearIdx = headers.findIndex(h => h.includes('year') || h.includes('est'));
        const addrIdx = headers.findIndex(h => h.includes('coord') || h.includes('address'));
        const phoneIdx = headers.findIndex(h => h.includes('phone'));

        for (let i = 1; i < lines.length; i++) {
          const row = parseCsvRow(lines[i]);
          let fId = (row[idIdx] || '').trim().toLowerCase();
          if (!fId) continue;
          if (fId.includes('keya')) fId = 'keya';
          else if (fId.includes('saurashtra')) fId = 'saurashtra';

          if (FIRMS[fId]) {
            if (row[nameIdx]) FIRMS[fId].name = row[nameIdx].trim();
            if (row[tagIdx]) FIRMS[fId].tagline = row[tagIdx].trim();
            if (row[addrIdx]) FIRMS[fId].address = row[addrIdx].trim();
            if (row[yearIdx]) FIRMS[fId].estYear = row[yearIdx].trim();
            if (row[phoneIdx]) FIRMS[fId].primaryPhone = '+91 ' + row[phoneIdx].trim().replace(/[^0-9]/g, '');
          }
        }
        console.log('✓ Successfully synced firm details live from Google Sheet Firm_Master!');
      })
      .catch(err => console.warn('Firm sync error:', err))
  );

  // 3. Security Settings Sync
  promises.push(
    fetch(CONFIG.securitySheetUrl)
      .then(r => r.ok ? r.text() : null)
      .then(csv => {
        if (!csv) return;
        const lines = csv.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        for (let i = 1; i < lines.length; i++) {
          const row = parseCsvRow(lines[i]);
          const key = (row[0] || '').trim();
          const val = (row[1] || '').trim();
          if (key === 'ADMIN_ACCESS_PIN' && val) {
            window.LIVE_ADMIN_PIN = val;
            sessionStorage.setItem('vellum_admin_pin', val);
          }
        }
        console.log('✓ Successfully synced security settings live from Google Sheet Security_Settings!');
      })
      .catch(err => console.warn('Security sync error:', err))
  );

  await Promise.allSettled(promises);
}

// --------------------------------------------------------------------------
// 3. INITIALIZATION & ROUTING
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', async () => {
  // 1. Initial immediate resolution with baseline profiles
  resolveUrlContext();
  initCart();

  // 2. Fetch live database from Google Sheet Master (Staff_Master, Firm_Master, Security_Settings)
  await syncLiveGoogleSheetDatabase();

  // 3. Re-resolve URL context with freshly synced staff and firms from Google Sheet
  resolveUrlContext();

  // 4. Load catalog data and render
  await loadCatalogData();
  renderCategoryPills();
  applyFiltersAndRender();
  
  if (document.getElementById('screenCatalogShowroom')) {
    showCatalogShowroom();
  } else if (state.hasAttachedCode) {
    showCatalogShowroom();
  } else {
    showBrandLanding();
  }

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

  // 2. User Code Resolution & 3-Tier Rate Suffix
  let rawUser = (params.get('u') || params.get('code') || params.get('user') || params.get('staff') || params.get('c') || '').toUpperCase().trim();
  rawUser = rawUser.replace(/[^A-Z0-9]/g, '');

  let baseCode = rawUser;
  let rateTier = 'retail'; // Default is always Retail MRP

  if (rawUser) {
    if (rawUser.endsWith('W') && !USER_PROFILES[rawUser]) {
      const candidate = rawUser.slice(0, -1);
      if (USER_PROFILES[candidate]) {
        baseCode = candidate;
        rateTier = 'wholesale';
      }
    } else if (rawUser.endsWith('P') && !USER_PROFILES[rawUser]) {
      const candidate = rawUser.slice(0, -1);
      if (USER_PROFILES[candidate]) {
        baseCode = candidate;
        rateTier = 'prime';
      }
    }
  }

  let matchedUser = USER_PROFILES[baseCode];

  // Also check if someone passed the slug (e.g. ?staff=nayan or ?staff=khushi)
  if (!matchedUser && baseCode) {
    matchedUser = Object.values(USER_PROFILES).find(p => p.slug.toUpperCase().replace(/[^A-Z0-9]/g, '') === baseCode);
  }

  if (matchedUser) {
    state.activeUser = matchedUser;
    state.activeFirm = matchedUser.firm || (matchedUser.name && matchedUser.name.toLowerCase().includes('khushi') ? 'keya' : 'saurashtra');
    state.isLocked = true; // Firm and user are locked!
    state.currentRole = rateTier;
    state.hasAttachedCode = true;
  } else {
    // If no user code supplied: strictly public anonymous visitor
    const firmParam = (params.get('firm') || params.get('f') || '').toLowerCase().trim();
    if (firmParam === 'keya' || firmParam === 'keyafashion') {
      state.activeFirm = 'keya';
    } else {
      state.activeFirm = 'saurashtra';
    }
    state.activeUser = null; // No staff code attached
    state.isLocked = false;
    state.currentRole = 'retail'; // Strictly Retail MRP only!
    state.hasAttachedCode = false;
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
    body.className = `${firm.themeClass} min-h-screen flex flex-col antialiased selection:bg-amber-200 selection:text-amber-950 text-stone-800`;
  }

  // Update Page Title & Firm Logos
  document.getElementById('pageTitle').textContent = `${firm.name} | Digital Textile Showroom`;
  
  const logoImg = document.getElementById('firmLogoImg');
  if (logoImg) logoImg.src = firm.logo;

  const footerLogo = document.getElementById('footerFirmLogo');
  if (footerLogo) footerLogo.src = firm.logo;

  // Header & Announcement Text
  const headerFirmNameEl = document.getElementById('headerFirmName');
  if (headerFirmNameEl) headerFirmNameEl.textContent = firm.name;
  const headerTaglineEl = document.getElementById('headerFirmTagline');
  if (headerTaglineEl) headerTaglineEl.textContent = firm.id === 'keya' ? 'Curated Catalogues' : 'Wholesale Showroom';
  const annFirmTextEl = document.getElementById('announcementFirmText');
  if (annFirmTextEl) annFirmTextEl.textContent = firm.name;
  const annTaglineEl = document.getElementById('announcementTagline');
  if (annTaglineEl) annTaglineEl.textContent = firm.tagline;
  const footFirmNameEl = document.getElementById('footerFirmName');
  if (footFirmNameEl) footFirmNameEl.textContent = firm.name;
  const footTaglineEl = document.getElementById('footerFirmTagline');
  if (footTaglineEl) footTaglineEl.textContent = firm.tagline;
  const heroFirmTagEl = document.getElementById('heroFirmTag');
  if (heroFirmTagEl) heroFirmTagEl.textContent = `${firm.name} Atelier`;
  
  const pillLabel = document.getElementById('currentFirmPillLabel');
  if (pillLabel) pillLabel.textContent = `Firm: ${firm.name.split(' ')[0]}`;

  // Footer Dynamic Address, Timings & Secondary Phone
  const footerAddressEl = document.getElementById('footerFirmAddress');
  if (footerAddressEl) footerAddressEl.textContent = firm.atelierCoordinates || firm.address || 'A-1001, Rajhans Fabrizo, Near Polaris Textile City, Magob, Surat, Gujarat – 395010';

  const footerTimingsEl = document.getElementById('footerFirmTimings');
  if (footerTimingsEl) footerTimingsEl.textContent = firm.timings || '10:00 AM – 07:00 PM (Monday–Saturday)';

  const footerSecPhoneEl = document.getElementById('footerSecondaryPhone');
  if (footerSecPhoneEl) footerSecPhoneEl.textContent = firm.secondaryPhone || firm.orderPhone || '+91 99136 43433';

  const footerDirectPhone = document.getElementById('footerDirectPhone');
  if (footerDirectPhone) footerDirectPhone.textContent = firm.primaryPhone || '+91 98794 71039';

  const footerEmailEl = document.getElementById('footerFirmEmail');
  if (footerEmailEl) {
    const email = firm.email || (firm.id === 'keya' ? 'keyafashion5517@gmail.com' : 'saurashtrasarees@gmail.com');
    footerEmailEl.textContent = email;
    footerEmailEl.href = `mailto:${email}`;
  }

  // Footer Dynamic Copyright & Disclaimer
  const copyrightEl = document.getElementById('footerCopyright');
  if (copyrightEl) copyrightEl.textContent = `${firm.name} 2026. All rights reserved.`;

  const disclaimerFirmEl = document.getElementById('footerDisclaimerFirm');
  if (disclaimerFirmEl) disclaimerFirmEl.textContent = firm.name;
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
    roleDropdownContainer.classList.add('hidden'); // Strictly locked, no selection button on home screen
  }
}

function updateStaffUI() {
  const user = state.activeUser;
  if (!user) return;

  const firm = FIRMS[user.firm] || FIRMS[state.activeFirm] || FIRMS.saurashtra;

  const staffNameEls = [
    document.getElementById('staffNameDisplay'),
    document.getElementById('badgeStaffActive')
  ];
  staffNameEls.forEach(el => {
    if (el) el.textContent = user.name;
  });

  const phoneEl = document.getElementById('staffPhoneDisplay');
  if (phoneEl) phoneEl.textContent = user.displayPhone || ('+91 ' + user.phone);

  const cleanPhone = (user.phone || '').replace(/[^0-9]/g, '');
  const callLink = document.getElementById('staffCallLink');
  if (callLink) callLink.href = `tel:+91${cleanPhone}`;

  // Footer Live Representative Binding
  const footerRepRow = document.getElementById('footerRepRow');
  if (footerRepRow) footerRepRow.classList.remove('hidden');

  const footerRepName = document.getElementById('footerRepName');
  if (footerRepName) footerRepName.textContent = user.name;

  const footerRepBadge = document.getElementById('footerRepBadge');
  if (footerRepBadge) footerRepBadge.textContent = user.initials || user.name.slice(0, 2).toUpperCase();

  const footerDirectPhone = document.getElementById('footerDirectPhone');
  if (footerDirectPhone) footerDirectPhone.textContent = user.displayPhone || ('+91 ' + user.phone);

  const footerSecondaryPhone = document.getElementById('footerSecondaryPhone');
  if (footerSecondaryPhone) footerSecondaryPhone.textContent = firm.secondaryPhone || firm.orderPhone || '+91 99136 43433';

  const footerTimingsEl = document.getElementById('footerFirmTimings');
  if (footerTimingsEl) footerTimingsEl.textContent = firm.timings || '10:00 AM – 07:00 PM (Monday–Saturday)';

  const footerAddressEl = document.getElementById('footerFirmAddress');
  if (footerAddressEl) footerAddressEl.textContent = firm.address || 'A-1001, Rajhans Fabrizo, Near Polaris Textile City, BRTS Road, Magob, Surat, Gujarat – 395010';

  const footerRepCallBtn = document.getElementById('footerRepCallBtn');
  if (footerRepCallBtn) footerRepCallBtn.href = `tel:+91${cleanPhone}`;
}

function switchFirm(firmId) {
  if (state.isLocked && !state.isSuperAdmin) return;
  state.activeFirm = firmId;
  applyFirmTheme();
  
  // Re-assign default representative for the newly selected firm
  state.activeUser = firmId === 'keya' ? USER_PROFILES['KH28'] : USER_PROFILES['NA39'];
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

  if (state.currentRole === 'wholesale') {
    labelText = 'Wholesale Rate';
    badgeText = 'Super Wholesale B2B Rate';
    badgeClass = 'text-emerald-700';
  } else if (state.currentRole === 'prime' || state.currentRole === 'reseller') {
    labelText = 'Prime Rate';
    badgeText = 'Prime Wholesale Rate';
    badgeClass = 'text-amber-800';
  } else if (state.currentRole === 'all') {
    labelText = 'All Rates Active';
    badgeText = 'All Rates (Wholesale, Prime & Retail)';
    badgeClass = 'text-amber-700';
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

  const pBtnAll = document.getElementById('mobilePillAll');
  const pBtnModel = document.getElementById('mobilePillModel');
  const pBtnTable = document.getElementById('mobilePillTable');
  const pillActiveClass = 'px-2.5 py-1 rounded-lg font-bold bg-amber-600 text-white shrink-0 shadow-xs text-[11px]';
  const pillInactiveClass = 'px-2.5 py-1 rounded-lg font-medium bg-stone-100 text-stone-700 border border-stone-200 shrink-0 text-[11px]';

  if (pBtnAll && pBtnModel && pBtnTable) {
    pBtnAll.className = (state.currentShoot === 'all') ? pillActiveClass : pillInactiveClass;
    pBtnModel.className = (state.currentShoot === 'model') ? pillActiveClass : pillInactiveClass;
    pBtnTable.className = (state.currentShoot === 'table') ? pillActiveClass : pillInactiveClass;
  }

  const shootSelect = document.getElementById('shootSelectFilter');
  if (shootSelect && shootSelect.value !== state.currentShoot) {
    shootSelect.value = state.currentShoot;
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
// 4. DATA LOADING & GOOGLE SHEET LIVE PRICING (Sheet ID: 1YcrvrrgwikEFkST8VEPf-XRjj8vWd0F750kauK1PU1o)
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
      console.log('✓ Google Sheet Live Pricing successfully synced from 1YcrvrrgwikEFkST8VEPf-XRjj8vWd0F750kauK1PU1o!');
    }
  } catch (sheetErr) {
    console.log('Using local catalog rates database.');
  }

  state.filteredCatalogs = [...state.catalogs];
}

function mergeSheetPricing(csvText) {
  if (!csvText || csvText.length < 5) return;
  const lines = csvText.split('\n');
  if (lines.length < 2) return;

  const headerRow = parseCsvRow(lines[0].toLowerCase());
  let primeIdx = -1, wsIdx = -1, retIdx = -1, statusIdx = -1;

  headerRow.forEach((h, idx) => {
    if (h.includes('prime')) primeIdx = idx;
    else if (h.includes('wholesale')) wsIdx = idx;
    else if (h.includes('retail') || h.includes('mrp')) retIdx = idx;
    else if (h.includes('status') || h.includes('stock')) statusIdx = idx;
  });

  // Default positions: 1. Prime, 2. Wholesale, 3. Retail
  if (primeIdx === -1 && wsIdx === -1 && retIdx === -1) {
    primeIdx = 3;
    wsIdx = 4;
    retIdx = 5;
    statusIdx = 6;
  }

  const priceMap = {};
  for (let i = 1; i < lines.length; i++) {
    const row = parseCsvRow(lines[i]);
    if (row.length >= 2) {
      const code = row[0].trim().toLowerCase();
      const primeRate = primeIdx >= 0 && row[primeIdx] ? parseInt(row[primeIdx].replace(/[^0-9]/g, '')) : null;
      const wsRate = wsIdx >= 0 && row[wsIdx] ? parseInt(row[wsIdx].replace(/[^0-9]/g, '')) : null;
      const retRate = retIdx >= 0 && row[retIdx] ? parseInt(row[retIdx].replace(/[^0-9]/g, '')) : null;
      const status = statusIdx >= 0 && row[statusIdx] ? row[statusIdx].trim() : null;

      priceMap[code] = { prime: primeRate, wholesale: wsRate, retail: retRate, status: status };
    }
  }

  state.catalogs.forEach(cat => {
    const mapped = priceMap[cat.code.toLowerCase()] || priceMap[cat.id.toLowerCase()];
    if (mapped) {
      if (mapped.prime) cat.resellerRate = mapped.prime;
      if (mapped.wholesale) cat.wholesaleRate = mapped.wholesale;
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

// ==========================================================================
// 000 COVER & DISPLAY IMAGE RESOLUTION
// Rule: In Surat textile catalogues, '000' (000.jpeg/000.jpg) represents
// the whole catalogue display cover / all-colors presentation.
// It represents NO COLOR (must NOT be treated as a saree colorway).
// ==========================================================================
function getCatalogCoverHero(cat) {
  if (cat.zeroCoverUrl) {
    return { url: cat.zeroCoverUrl, hasZeroCover: true };
  }
  if (cat.heroImageUrl && cat.heroImageUrl.includes('000.')) {
    return { url: cat.heroImageUrl, hasZeroCover: true };
  }
  const firstDesign = (cat.designs && cat.designs[0]) || {};
  return { 
    url: firstDesign.heroImageUrl || cat.heroImageUrl || 'assets/saurashtra-sarees-logo.jpg', 
    hasZeroCover: false 
  };
}

function getColorwayDesigns(cat) {
  if (!cat || !cat.designs) return [];
  // Strictly exclude 000 from color dots (it represents NO COLOR)
  return cat.designs.filter(d => 
    String(d.code).trim() !== '000' && 
    !d.isZeroCover && 
    !(d.heroImageUrl && d.heroImageUrl.includes('000.'))
  );
}

// --------------------------------------------------------------------------
// 6. SCREEN 1: CATALOGUE COLLECTION & CARDS
// --------------------------------------------------------------------------
function renderCategoryPills() {
  const fabricSelect = document.getElementById('fabricSelectFilter');
  const checkboxList = document.getElementById('fabricCheckboxList');

  const counts = {};
  state.catalogs.forEach(c => {
    if (c.category) {
      counts[c.category] = (counts[c.category] || 0) + 1;
    }
  });

  const categories = Object.keys(counts).sort();

  if (fabricSelect) {
    fabricSelect.innerHTML = `
      <option value="all">🧵 All Fabrics (${state.catalogs.length})</option>
      ${categories.map(cat => `
        <option value="${cat}" ${state.selectedCategory === cat ? 'selected' : ''}>
          ${cat} (${counts[cat]})
        </option>
      `).join('')}
    `;
  }

  if (checkboxList) {
    checkboxList.innerHTML = categories.map(cat => {
      const isChecked = state.selectedCategories.length === 0 || state.selectedCategories.includes(cat);
      return `
        <label class="flex items-center justify-between p-2 hover:bg-amber-50 rounded-xl cursor-pointer text-xs font-semibold text-stone-800 transition-colors">
          <div class="flex items-center gap-2.5">
            <input 
              type="checkbox" 
              value="${cat}" 
              class="fabric-option-checkbox accent-[#8b1d40] rounded w-4 h-4 cursor-pointer" 
              onchange="handleFabricCheckbox('${cat}', this.checked)" 
              ${isChecked ? 'checked' : ''}
            >
            <span>${cat}</span>
          </div>
          <span class="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full font-bold">${counts[cat]}</span>
        </label>
      `;
    }).join('');
    updateFabricDropdownUI();
  }
}

function toggleFabricDropdown(event) {
  if (event) {
    event.stopPropagation();
  }
  const menu = document.getElementById('fabricDropdownMenu');
  if (menu) {
    menu.classList.toggle('hidden');
  }
}

function closeFabricDropdown() {
  const menu = document.getElementById('fabricDropdownMenu');
  if (menu) menu.classList.add('hidden');
}

function handleFabricCheckbox(cat, isChecked) {
  const checkboxes = document.querySelectorAll('.fabric-option-checkbox');
  const totalOptions = checkboxes.length;
  
  if (state.selectedCategories.length === 0) {
    state.selectedCategories = Array.from(checkboxes).map(cb => cb.value);
  }

  if (isChecked) {
    if (!state.selectedCategories.includes(cat)) {
      state.selectedCategories.push(cat);
    }
  } else {
    state.selectedCategories = state.selectedCategories.filter(c => c !== cat);
  }

  if (state.selectedCategories.length === totalOptions) {
    state.selectedCategories = [];
  }

  updateFabricDropdownUI();
  applyFiltersAndRender();
}

function selectAllFabrics() {
  state.selectedCategories = [];
  const checkboxes = document.querySelectorAll('.fabric-option-checkbox');
  checkboxes.forEach(cb => cb.checked = true);
  updateFabricDropdownUI();
  applyFiltersAndRender();
}

function clearAllFabrics() {
  state.selectedCategories = ['__NONE__'];
  const checkboxes = document.querySelectorAll('.fabric-option-checkbox');
  checkboxes.forEach(cb => cb.checked = false);
  updateFabricDropdownUI();
  applyFiltersAndRender();
}

function filterFabricOptions(query) {
  const q = (query || '').toLowerCase().trim();
  const labels = document.querySelectorAll('#fabricCheckboxList label');
  labels.forEach(lbl => {
    const text = lbl.textContent.toLowerCase();
    if (text.includes(q)) {
      lbl.classList.remove('hidden');
    } else {
      lbl.classList.add('hidden');
    }
  });
}

function updateFabricDropdownUI() {
  const btnLabel = document.getElementById('fabricDropdownBtnLabel');
  const summary = document.getElementById('fabricSelectionSummary');
  const count = state.selectedCategories.length;
  const checkboxes = document.querySelectorAll('.fabric-option-checkbox');
  const totalOptions = checkboxes.length;

  if (count === 0 || count === totalOptions) {
    if (btnLabel) btnLabel.textContent = `All Fabrics (${state.catalogs.length})`;
    if (summary) summary.textContent = `All Fabrics (${totalOptions}) Active`;
  } else if (state.selectedCategories.includes('__NONE__') || count === 0) {
    if (btnLabel) btnLabel.textContent = `Select Fabrics (0)`;
    if (summary) summary.textContent = `0 Fabrics Selected`;
  } else if (count === 1) {
    if (btnLabel) btnLabel.textContent = `${state.selectedCategories[0]} (1)`;
    if (summary) summary.textContent = `1 Fabric Selected`;
  } else {
    if (btnLabel) btnLabel.textContent = `${count} Fabrics Selected`;
    if (summary) summary.textContent = `${count} Fabrics Selected`;
  }
}

document.addEventListener('click', function(e) {
  const container = document.getElementById('fabricDropdownContainer');
  const menu = document.getElementById('fabricDropdownMenu');
  if (container && menu && !container.contains(e.target)) {
    menu.classList.add('hidden');
  }
});

function setCategory(cat) {
  state.selectedCategory = cat;
  const fabricSelect = document.getElementById('fabricSelectFilter');
  if (fabricSelect) fabricSelect.value = cat;
  applyFiltersAndRender();
}

function setShootType(type) {
  state.currentShoot = type;
  const shootSelect = document.getElementById('shootSelectFilter');
  if (shootSelect) shootSelect.value = type;
  updateShootUI();
  applyFiltersAndRender();
}

function setPriceRange(range) {
  state.selectedPriceRange = range;
  const priceSelect = document.getElementById('priceRangeFilter');
  if (priceSelect) priceSelect.value = range;
  applyFiltersAndRender();
}

function handleSearch(val) {
  state.searchQuery = val.trim().toLowerCase();
  
  const dInput = document.getElementById('searchInput');
  const mInput = document.getElementById('mobileSearchInput');
  if (dInput && dInput.value !== val) dInput.value = val;
  if (mInput && mInput.value !== val) mInput.value = val;

  const clearBtn = document.getElementById('btnClearSearch');
  const clearBtnMobile = document.getElementById('btnClearSearchMobile');
  if (clearBtn) clearBtn.classList.toggle('hidden', !val);
  if (clearBtnMobile) clearBtnMobile.classList.toggle('hidden', !val);

  applyFiltersAndRender();
}

function clearSearch() {
  const dInput = document.getElementById('searchInput');
  const mInput = document.getElementById('mobileSearchInput');
  if (dInput) dInput.value = '';
  if (mInput) mInput.value = '';
  handleSearch('');
}

function handleSort(sortVal) {
  state.sortBy = sortVal;
  const dSort = document.getElementById('sortSelect');
  if (dSort && dSort.value !== sortVal) dSort.value = sortVal;
  applyFiltersAndRender();
}

function resetFilters() {
  state.selectedCategory = 'all';
  state.selectedCategories = [];
  state.selectedPriceRange = 'all';
  state.currentShoot = 'all';
  state.searchQuery = '';
  state.sortBy = 'newest';

  const dInput = document.getElementById('searchInput');
  const mInput = document.getElementById('mobileSearchInput');
  if (dInput) dInput.value = '';
  if (mInput) mInput.value = '';

  const priceSelect = document.getElementById('priceRangeFilter');
  if (priceSelect) priceSelect.value = 'all';

  const shootSelect = document.getElementById('shootSelectFilter');
  if (shootSelect) shootSelect.value = 'all';

  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) sortSelect.value = 'newest';

  const fabricBtnLabel = document.getElementById('fabricDropdownBtnLabel');
  if (fabricBtnLabel) fabricBtnLabel.textContent = `All Fabrics (${state.catalogs.length})`;

  updateShootUI();
  applyFiltersAndRender();
}

function renderActiveFilterTags() {
  const container = document.getElementById('activeFilterTagsContainer');
  const resetBtn = document.getElementById('btnResetFilters');
  if (!container) return;

  const tags = [];

  if (state.currentShoot !== 'all') {
    const shootLabel = state.currentShoot === 'model' ? '👗 Model Shoot (45)' : '🪑 Table Shoot (87)';
    tags.push(`
      <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-100 text-sky-900 border border-sky-300 shadow-2xs">
        ${shootLabel}
        <button onclick="setShootType('all')" class="hover:text-red-600 font-bold ml-1">✕</button>
      </span>
    `);
  }

  if (state.selectedPriceRange && state.selectedPriceRange !== 'all') {
    const priceLabels = {
      'under500': '≤ ₹499 (Budget)',
      '500-999': '₹500–₹999 (Fast Moving)',
      '1000-1499': '₹1,000–₹1,499 (Festive)',
      '1500-1999': '₹1,500–₹1,999 (Pure Silk)',
      'above2000': '≥ ₹2,000 (Bridal Haute)'
    };
    tags.push(`
      <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-950 border border-amber-300 shadow-2xs">
        💰 ${priceLabels[state.selectedPriceRange] || state.selectedPriceRange}
        <button onclick="setPriceRange('all')" class="hover:text-red-600 font-bold ml-1">✕</button>
      </span>
    `);
  }

  if (state.selectedCategories && state.selectedCategories.length > 0 && !state.selectedCategories.includes('__NONE__')) {
    tags.push(`
      <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-900 border border-purple-300 shadow-2xs">
        🧵 ${state.selectedCategories.length} Fabrics Selected
        <button onclick="selectAllFabrics()" class="hover:text-red-600 font-bold ml-1">✕</button>
      </span>
    `);
  } else if (state.selectedCategory !== 'all') {
    tags.push(`
      <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-900 border border-purple-300 shadow-2xs">
        🧵 ${state.selectedCategory}
        <button onclick="setCategory('all')" class="hover:text-red-600 font-bold ml-1">✕</button>
      </span>
    `);
  }

  if (state.searchQuery) {
    tags.push(`
      <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-stone-100 text-stone-900 border border-stone-300 shadow-2xs">
        🔍 "${state.searchQuery}"
        <button onclick="clearSearch()" class="hover:text-red-600 font-bold ml-1">✕</button>
      </span>
    `);
  }

  container.innerHTML = tags.join('');

  if (resetBtn) {
    if (tags.length > 0) resetBtn.classList.remove('hidden');
    else resetBtn.classList.add('hidden');
  }
}

function applyFiltersAndRender() {
  let list = [...state.catalogs];

  // 1. Shoot Filter (Distinct Model Shoot vs Table Shoot)
  if (state.currentShoot === 'model') {
    list = list.filter(c => c.shootType === 'model' || Boolean(c.has2mb));
  } else if (state.currentShoot === 'table') {
    list = list.filter(c => c.shootType === 'table' || !c.has2mb);
  }

  // 2. Fabric Category Filter (Multi-Select Support)
  if (state.selectedCategories && state.selectedCategories.length > 0) {
    if (state.selectedCategories.includes('__NONE__')) {
      list = [];
    } else {
      list = list.filter(c => state.selectedCategories.includes(c.category));
    }
  } else if (state.selectedCategory !== 'all') {
    list = list.filter(c => c.category === state.selectedCategory);
  }

  // 3. Price Range Filter: =<499, 500-999, 1000-1499, 1500-1999, 2000=<
  if (state.selectedPriceRange !== 'all') {
    list = list.filter(c => {
      const rate = getActiveRate(c);
      if (state.selectedPriceRange === 'under500') return rate <= 499;
      if (state.selectedPriceRange === '500-999') return rate >= 500 && rate <= 999;
      if (state.selectedPriceRange === '1000-1499') return rate >= 1000 && rate <= 1499;
      if (state.selectedPriceRange === '1500-1999') return rate >= 1500 && rate <= 1999;
      if (state.selectedPriceRange === 'above2000') return rate >= 2000;
      return true;
    });
  }

  // 4. Search Filter
  if (state.searchQuery) {
    list = list.filter(c => 
      c.name.toLowerCase().includes(state.searchQuery) ||
      c.code.toLowerCase().includes(state.searchQuery) ||
      (c.category && c.category.toLowerCase().includes(state.searchQuery)) ||
      (c.fabric && c.fabric.toLowerCase().includes(state.searchQuery))
    );
  }

  // 5. Sorting
  if (state.sortBy === 'price-asc') {
    list.sort((a, b) => getActiveRate(a) - getActiveRate(b));
  } else if (state.sortBy === 'price-desc') {
    list.sort((a, b) => getActiveRate(b) - getActiveRate(a));
  } else if (state.sortBy === 'name-asc') {
    list.sort((a, b) => a.name.localeCompare(b.name));
  }

  state.filteredCatalogs = list;
  renderCatalogGrid();
  renderCatalogCount();
  renderActiveFilterTags();
}

function renderCatalogCount() {
  const countEl = document.getElementById('activeCatalogCount');
  if (countEl) countEl.textContent = state.filteredCatalogs.length;

  const countLabel = document.getElementById('catalogCountLabel');
  if (countLabel) {
    if (state.currentShoot === 'model') {
      countLabel.textContent = `Showing ${state.filteredCatalogs.length} Model Shoot Volumes (45 Total)`;
    } else if (state.currentShoot === 'table') {
      countLabel.textContent = `Showing ${state.filteredCatalogs.length} Table Shoot Volumes (87 Total)`;
    } else {
      countLabel.textContent = `Showing ${state.filteredCatalogs.length} Collections (45 Model • 87 Table)`;
    }
  }
}

// Commercial Pricing Hierarchy: 1. Prime, 2. Wholesale, 3. Retail
function getActiveRate(cat) {
  if (state.currentRole === 'prime') return cat.resellerRate; // 1. Prime Rate (lowest)
  if (state.currentRole === 'wholesale') return cat.wholesaleRate; // 2. Wholesale Rate
  return cat.retailRate; // 3. Retail Rate (highest, default)
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

  // Only explicitly authorized accounts with 'all' rate access see the 3-rate breakdown.
  // All staff (including Founders NA39 & CH33 who are set to Retail Only) and showroom visitors strictly see the single retail rate!
  const isAllRatesUser = Boolean(
    state.hasAttachedCode && state.activeUser && state.activeUser.rateAccess === 'all'
  );

  grid.innerHTML = state.filteredCatalogs.map(cat => {
    const coverHero = getCatalogCoverHero(cat);
    const heroImg = coverHero.url;
    const colorways = getColorwayDesigns(cat);
    const firstDesign = colorways[0] || (cat.designs && cat.designs[0]) || {};
    const activeColorObj = getAccurateColor(firstDesign.color);

    const retailRate = cat.retailRate;
    const wholesaleRate = cat.wholesaleRate;
    const primeRate = cat.resellerRate;

    const catStock = window.vellumAdapter ? window.vellumAdapter.getCatalogStock(cat.id) : 'in_stock';
    let stockBadgeHtml = '';
    if (catStock === 'temp_out_of_stock') {
      stockBadgeHtml = `
        <span class="text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-amber-950 shadow-xs flex items-center gap-1">
          <span class="w-1.5 h-1.5 rounded-full bg-amber-950 animate-pulse"></span>
          <span>⏳ Weaving</span>
        </span>`;
    } else if (catStock === 'perm_out_of_stock') {
      stockBadgeHtml = `
        <span class="text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-600 text-white shadow-xs flex items-center gap-1">
          <span>🚫 Sold Out</span>
        </span>`;
    }

    const isModel = cat.shootType === 'model' || Boolean(cat.has2mb);
    const shootBadgeHtml = isModel
      ? `<span class="text-[9px] sm:text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider bg-sky-50 text-sky-900 border-2 border-sky-300 shadow-xs flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"></span>👗 Model Shoot</span>`
      : `<span class="text-[9px] sm:text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider bg-amber-50 text-amber-950 border-2 border-amber-300 shadow-xs flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>🪑 Table Shoot</span>`;

    return `
      <div class="catalog-card ${catStock === 'temp_out_of_stock' ? 'is-temp-out' : (catStock === 'perm_out_of_stock' ? 'is-perm-out' : '')} bg-white rounded-2xl sm:rounded-3xl border border-amber-200/80 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group active:scale-[0.99]">
        
        <!-- Top Media Area -->
        <div class="relative aspect-[3/4] bg-stone-100 overflow-hidden cursor-pointer" onclick="navigateToProduct('${cat.id}')">
          <img 
            id="card-hero-${cat.id}" 
            src="${heroImg}" 
            referrerpolicy="no-referrer"
            alt="${cat.name}" 
            class="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-106 hero-image-fade"
            onerror="this.onerror=null; this.src='assets/saurashtra-sarees-logo.jpg';"
          >

          <!-- Top Status & Shoot Badges -->
          <div class="absolute top-2 sm:top-3 left-2 sm:left-3 right-2 sm:right-3 flex items-center justify-between pointer-events-none">
            ${shootBadgeHtml}
            ${stockBadgeHtml}
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
            ${colorways.length} Colors
          </div>
        </div>

        <!-- Content Area -->
        <div class="p-3 sm:p-5 flex-1 flex flex-col justify-between space-y-2 sm:space-y-3.5">
          
          <div>
            <div class="flex items-center justify-between gap-1">
              <span class="text-[9px] sm:text-[10px] font-extrabold tracking-wider text-stone-600 uppercase truncate">${cat.category}</span>
              <span class="text-[9px] sm:text-[10px] font-mono text-stone-600 font-bold shrink-0">${cat.code}</span>
            </div>
            
            <h3 onclick="navigateToProduct('${cat.id}')" class="font-serif text-sm sm:text-lg font-bold text-slate-900 group-hover:text-brand-maroon transition-colors line-clamp-1 cursor-pointer mt-0.5">
              ${cat.name}
            </h3>

            <!-- Color Variants Swatches Strip with Tooltips (Excludes 000 cover) -->
            <div class="mt-2 sm:mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
              <div class="flex items-center gap-1 sm:gap-1.5 flex-wrap">
                ${colorways.slice(0, 5).map((d, dIdx) => {
                  const dColor = getAccurateColor(d.color);
                  const isColorSold = window.vellumAdapter && window.vellumAdapter.getColorStock(cat.id, d.code) === 'sold_out';
                  return `
                    <div class="swatch-wrapper">
                      <span class="swatch-tooltip">Design ${d.code}: ${dColor.label} ${isColorSold ? '(Sold Out)' : ''}</span>
                      <button 
                        type="button"
                        onclick="event.stopPropagation(); switchCardDesign('${cat.id}', ${dIdx})" 
                        class="card-dot-${cat.id} ${isColorSold ? 'is-sold-out' : ''} w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border border-white shadow-xs inline-block transition-transform hover:scale-125 ${dIdx === 0 ? 'ring-2 ring-stone-900 scale-110' : 'opacity-85'}"
                        style="background-color: ${dColor.hex};"
                      ></button>
                    </div>
                  `;
                }).join('')}
                ${colorways.length > 5 ? `
                  <span class="text-[9px] font-bold text-stone-600 ml-0.5">+${colorways.length - 5}</span>
                ` : ''}
              </div>

              <span id="card-design-${cat.id}" class="hidden sm:inline text-[10px] font-semibold text-slate-500 truncate max-w-[100px]">
                ${coverHero.hasZeroCover ? 'Overview' : `Design ${firstDesign.code || '101'}`}
              </span>
            </div>
          </div>

          <!-- Commercial Pricing Block (Hierarchy: 1. Prime, 2. Wholesale, 3. Retail) -->
          <div class="pt-2 sm:pt-3 border-t border-slate-100">
            ${isAllRatesUser ? `
              <!-- Multi-Rate Matrix for Staff / All-Rate Users -->
              <div class="bg-slate-50 rounded-xl sm:rounded-2xl p-2 sm:p-2.5 border border-slate-200/80 space-y-1">
                <div class="flex items-center justify-between text-[10px] sm:text-[11px]">
                  <span class="text-amber-900 font-bold">1. Prime Rate:</span>
                  <span class="font-price font-bold text-amber-900">₹${primeRate}</span>
                </div>
                <div class="flex items-center justify-between text-[10px] sm:text-[11px]">
                  <span class="text-emerald-700 font-bold">2. Wholesale Rate:</span>
                  <span class="font-price font-bold text-emerald-700">₹${wholesaleRate}</span>
                </div>
                <div class="flex items-center justify-between text-[10px] sm:text-[11px] pt-0.5 border-t border-slate-200">
                  <span class="text-purple-900 font-bold">3. Retail / MRP:</span>
                  <span class="font-price font-extrabold text-stone-900">₹${retailRate}</span>
                </div>
              </div>
            ` : `
              <!-- Single Rate Display (Luxury Gold Jewel Badge) -->
              <div class="flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-amber-50/90 via-white to-amber-50/50 border border-amber-300/80 shadow-xs">
                <div>
                  <span class="text-[9px] sm:text-[10px] text-amber-900 font-extrabold uppercase tracking-wide block">
                    ${state.currentRole === 'prime' ? '👑 Prime Wholesale' : (state.currentRole === 'wholesale' ? '🏢 Mill Wholesale' : '🏷️ Catalog MRP')}
                  </span>
                  <p class="font-price text-base sm:text-xl font-black text-stone-900 leading-tight mt-0.5">
                    ₹${getActiveRate(cat)} <span class="text-[10px] font-sans font-bold text-stone-500">/ saree</span>
                  </p>
                </div>
                <span class="text-[9px] sm:text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded-full font-bold shadow-xs">🟢 In Stock</span>
              </div>
            `}

            <!-- 1-Click Action Buttons -->
            <div class="flex items-center gap-1.5 sm:gap-2 mt-2.5 sm:mt-3">
              <button 
                onclick="navigateToProduct('${cat.id}')" 
                class="flex-1 py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg sm:rounded-xl bg-white border border-amber-300 text-stone-800 hover:bg-stone-900 hover:text-white text-[11px] sm:text-xs font-bold transition-all text-center flex items-center justify-center gap-1 shadow-xs"
              >
                <span>View Details</span>
                <i data-lucide="arrow-right" class="w-3 h-3 sm:w-3.5 sm:h-3.5"></i>
              </button>

              <button 
                onclick="addCatalogCardToCart('${cat.id}')" 
                title="Add Saree to Order Cart" 
                class="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-800 transition-all flex items-center justify-center shrink-0"
              >
                <i data-lucide="shopping-bag" class="w-3.5 h-3.5 sm:w-4 sm:h-4"></i>
              </button>

              <button 
                onclick="sendStaffWhatsApp('${cat.code}', 'Design ${firstDesign.code} (${activeColorObj.label})', ${getActiveRate(cat)})" 
                title="Inquire on WhatsApp" 
                class="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-700 transition-all flex items-center justify-center shrink-0"
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
function switchCardDesign(catId, designIdx) {
  const cat = state.catalogs.find(c => c.id === catId || c.code.toLowerCase() === catId.toLowerCase());
  if (!cat) return;

  const colorways = getColorwayDesigns(cat);
  if (!colorways[designIdx]) return;

  const design = colorways[designIdx];
  const colorObj = getAccurateColor(design.color);

  const imgEl = document.getElementById(`card-hero-${cat.id}`);
  if (imgEl && design.heroImageUrl) {
    imgEl.src = design.heroImageUrl;
  }

  const labelEl = document.getElementById(`card-design-${cat.id}`);
  if (labelEl) {
    labelEl.textContent = `Design ${design.code} — ${colorObj.label}`;
  }

  const dots = document.querySelectorAll(`.card-dot-${cat.id}`);
  dots.forEach((dot, idx) => {
    if (idx === designIdx) {
      dot.className = `card-dot-${cat.id} w-4 h-4 rounded-full border border-white shadow-xs inline-block transition-transform scale-125 ring-2 ring-slate-900`;
    } else {
      dot.className = `card-dot-${cat.id} w-4 h-4 rounded-full border border-white shadow-xs inline-block transition-transform hover:scale-125 opacity-85`;
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
  if (document.getElementById('screenCatalogShowroom')) {
    showCatalogShowroom();
  } else if (state.hasAttachedCode) {
    showCatalogShowroom();
  } else {
    showBrandLanding();
  }
}

function submitAccessCode() {
  const input = document.getElementById('brandAccessCodeInput');
  const code = (input?.value || '').trim();
  if (!code) {
    alert('Please enter a valid Staff or Partner Access Code (e.g. NA39, CH33)');
    return;
  }
  unlockCatalogWithCode(code);
}

function unlockCatalogWithCode(code) {
  const clean = (code || '').toUpperCase().trim();
  const matched = USER_PROFILES[clean] || Object.values(USER_PROFILES).find(p => p.code.toUpperCase() === clean);
  if (matched) {
    state.activeUser = matched;
    state.activeFirm = matched.firm;
    state.hasAttachedCode = true;
    state.isLocked = true;
    applyFirmTheme();
    updateStaffUI();
    
    // Update browser URL query parameter seamlessly
    const newUrl = `${window.location.pathname}?u=${clean}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
  } else {
    state.hasAttachedCode = true;
  }
  showCatalogShowroom();
}

function showBrandLanding() {
  const screenBrand = document.getElementById('screenBrandHome');
  const screenShowroom = document.getElementById('screenCatalogShowroom');
  const screenProduct = document.getElementById('screenProduct');
  if (screenBrand) {
    screenBrand.classList.remove('hidden');
    screenBrand.style.setProperty('display', 'block', 'important');
    if (screenShowroom) {
      screenShowroom.classList.add('hidden');
      screenShowroom.style.setProperty('display', 'none', 'important');
    }
    if (screenProduct) {
      screenProduct.classList.add('hidden');
      screenProduct.style.setProperty('display', 'none', 'important');
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  } else if (screenShowroom) {
    showCatalogShowroom();
  }
}

function showCatalogShowroom() {
  const screenBrand = document.getElementById('screenBrandHome');
  const screenShowroom = document.getElementById('screenCatalogShowroom');
  const screenProduct = document.getElementById('screenProduct');
  if (screenBrand) {
    screenBrand.classList.add('hidden');
    screenBrand.style.setProperty('display', 'none', 'important');
  }
  if (screenProduct) {
    screenProduct.classList.add('hidden');
    screenProduct.style.setProperty('display', 'none', 'important');
  }
  if (screenShowroom) {
    screenShowroom.classList.remove('hidden');
    screenShowroom.style.setProperty('display', 'flex', 'important');
  }
  applyFiltersAndRender();
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  if (window.lucide) lucide.createIcons();
}

function sendBrandInquiry() {
  const bName = document.getElementById('inqBusinessName')?.value.trim();
  const mobile = document.getElementById('inqMobile')?.value.trim();
  const city = document.getElementById('inqCity')?.value.trim();

  if (!bName || !mobile) {
    alert('Please provide your business name and mobile number.');
    return;
  }

  const msg = encodeURIComponent(
    `Hello Saurashtra Sarees (Atelier Desk),\n\n` +
    `I would like to inquire about Direct Mill Wholesale & Super Stockist supply:\n` +
    `🏢 Business Name: ${bName}\n` +
    `📱 Contact: ${mobile}\n` +
    `📍 City: ${city}\n\n` +
    `Please share your latest bulk lookbook and factory dispatch terms.`
  );
  window.open(`https://wa.me/919879471039?text=${msg}`, '_blank');
}

function handleHashRoute() {
  const hash = window.location.hash || '';
  const screenBrand = document.getElementById('screenBrandHome');
  const screenShowroom = document.getElementById('screenCatalogShowroom');
  const screenProduct = document.getElementById('screenProduct');

  if (hash.startsWith('#page/')) {
    const pageKey = hash.replace('#page/', '').trim().toLowerCase();
    openInfoPage(pageKey);
    return;
  }

  if (hash.startsWith('#catalog/')) {
    const code = hash.replace('#catalog/', '').trim().toLowerCase();
    const cat = state.catalogs.find(c => c.code.toLowerCase() === code || c.id.toLowerCase() === code);
    
    if (cat) {
      state.activePdpCatalog = cat;
      state.activePdpDesignIndex = 0;
      state.activePdpImageIndex = 0;
      state.activePdpShoot = state.currentShoot;
      state.activePdpTab = 'specs';

      if (screenBrand) {
        screenBrand.classList.add('hidden');
        screenBrand.style.setProperty('display', 'none', 'important');
      }
      if (screenShowroom) {
        screenShowroom.classList.add('hidden');
        screenShowroom.style.setProperty('display', 'none', 'important');
      }
      if (screenProduct) {
        screenProduct.classList.remove('hidden');
        screenProduct.style.setProperty('display', 'flex', 'important');
      }
      renderPdpScreen();
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      return;
    }
  }

  // Default: Show either Showroom (on catalog.html) or Brand Home (on index.html)
  if (screenProduct) {
    screenProduct.classList.add('hidden');
    screenProduct.style.setProperty('display', 'none', 'important');
  }
  if (screenBrand) {
    if (state.hasAttachedCode) {
      screenBrand.classList.add('hidden');
      screenBrand.style.setProperty('display', 'none', 'important');
      if (screenShowroom) {
        screenShowroom.classList.remove('hidden');
        screenShowroom.style.setProperty('display', 'flex', 'important');
      }
    } else {
      screenBrand.classList.remove('hidden');
      screenBrand.style.setProperty('display', 'block', 'important');
      if (screenShowroom) {
        screenShowroom.classList.add('hidden');
        screenShowroom.style.setProperty('display', 'none', 'important');
      }
    }
  } else if (screenShowroom) {
    screenShowroom.classList.remove('hidden');
    screenShowroom.style.setProperty('display', 'flex', 'important');
  }
  state.activePdpCatalog = null;
  window.scrollTo(0, 0);
}

function renderPdpScreen() {
  const cat = state.activePdpCatalog;
  if (!cat) return;

  const firm = FIRMS[state.activeFirm] || FIRMS.saurashtra;
  const user = state.activeUser || USER_PROFILES['NA39'];
  const isAllRatesUser = Boolean(
    state.hasAttachedCode && state.activeUser && state.activeUser.rateAccess === 'all'
  );

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

  // User mandate: NEVER show 3 rates together on PDP. ONLY show the single authorized rate by link!
  if (allRatesCard) allRatesCard.classList.add('hidden');
  if (singlePriceCard) {
    singlePriceCard.classList.remove('hidden');
    const activeRate = getActiveRate(cat);
    const pdpPriceEl = document.getElementById('pdpPrice');
    if (pdpPriceEl) pdpPriceEl.textContent = `₹${activeRate}`;
    
    let roleLabel = 'Catalog MRP / Retail Rate';
    if (state.currentRole === 'wholesale') roleLabel = 'Wholesale Price (Direct Mill)';
    else if (state.currentRole === 'prime') roleLabel = 'Prime Wholesale Rate';
    
    const roleNameEl = document.getElementById('pdpRoleName');
    if (roleNameEl) roleNameEl.textContent = roleLabel;
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
  document.getElementById('pdpOrigin').textContent = cat.origin ? cat.origin.replace(/\s*\(Direct Mill Dispatch\)/i, '') : 'A-1001, Rajhans Fabrizo, Surat, Gujarat – 395010';

  // Styling Tab Content
  document.getElementById('pdpOccasionText').textContent = cat.idealOccasion || 'Weddings, Traditional Functions & Festivals';
  document.getElementById('pdpJewelryText').textContent = cat.jewelryTip || 'Complements antique gold or temple jewelry sets.';
  document.getElementById('pdpCareText').textContent = cat.washCare || 'Dry clean only recommended. Wrap in cotton cloth.';

  // Representative Card
  document.getElementById('pdpStaffAvatarLetters').textContent = user.initials || 'SR';
  document.getElementById('pdpStaffName').textContent = user.name;
  document.getElementById('pdpStaffFirm').textContent = `${firm.name} • ${user.title}`;
  document.getElementById('pdpStaffCallBtn').href = `tel:+91${user.phone}`;
  document.getElementById('pdpWhatsAppBtnText').textContent = 'Inquire & Order via WhatsApp';

  // Mobile Sticky Bottom Bar (Fixed on mobile devices)
  const mobPrice = document.getElementById('pdpMobilePrice');
  if (mobPrice) mobPrice.textContent = `₹${cat.retailRate}`;
  const mobCall = document.getElementById('pdpMobileCallBtn');
  if (mobCall) mobCall.href = `tel:+91${user.phone}`;
  const mobWa = document.getElementById('pdpMobileWhatsAppText');
  if (mobWa) mobWa.textContent = 'Order via WhatsApp';

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

  const activeClass = 'flex-1 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs bg-white text-stone-900 border border-amber-300';
  const inactiveClass = 'flex-1 py-1.5 rounded-xl text-xs font-medium text-stone-600 hover:text-stone-900 transition-all';

  if (btnAll && btnModel && btnTable) {
    btnAll.className = (state.activePdpShoot === 'all') ? activeClass : inactiveClass;
    btnModel.className = (state.activePdpShoot === 'model') ? activeClass : inactiveClass;
    btnTable.className = (state.activePdpShoot === 'table') ? activeClass : inactiveClass;
  }

  // Synchronize Google Drive Shoot Folder Button
  const cat = state.activePdpCatalog;
  if (cat) {
    const shootType = (window.vellumAdapter && window.vellumAdapter.getCatalogShoot(cat.id)) || (cat.has2mb ? 'model' : 'table');
    const driveConfig = window.vellumAdapter ? window.vellumAdapter.loadDriveConfig() : {};
    const isModel = state.activePdpShoot === 'model' || (state.activePdpShoot === 'all' && shootType === 'model');
    const targetUrl = cat.driveFolderUrl || (isModel ? driveConfig.modelShootFolderUrl : driveConfig.tableShootFolderUrl);
    
    const driveLink = document.getElementById('pdpShootDriveLink');
    const driveText = document.getElementById('pdpShootDriveText');
    if (driveLink && targetUrl) {
      driveLink.href = targetUrl;
      if (driveText) {
        driveText.textContent = `Open ${cat.name} Drive Folder ↗`;
      }
    }
  }

  if (window.lucide) lucide.createIcons();
}

function renderPdpColorSwatches() {
  const cat = state.activePdpCatalog;
  if (!cat) return;

  const container = document.getElementById('pdpColorSwatchesContainer');
  if (!container) return;

  const colorways = getColorwayDesigns(cat);
  const catStock = window.vellumAdapter ? window.vellumAdapter.getCatalogStock(cat.id) : 'in_stock';

  const coverButtonHtml = '';

  const swatchesHtml = colorways.map((d, idx) => {
    const isSelected = idx === state.activePdpDesignIndex;
    const colorObj = getAccurateColor(d.color);
    const isColorSold = window.vellumAdapter && window.vellumAdapter.getColorStock(cat.id, d.code) === 'sold_out';
    const numPhotos = (d.imageUrls && d.imageUrls.length) || 1;
    
    const activeClass = isSelected 
      ? 'border-amber-600 bg-amber-50/90 shadow-md ring-2 ring-amber-500/50 scale-102 font-bold text-stone-900' 
      : 'border-stone-200 bg-white text-stone-600 hover:border-amber-300 hover:bg-stone-50';

    return `
      <button 
        type="button"
        onclick="selectPdpDesign(${idx})" 
        class="swatch-btn ${isColorSold ? 'is-sold-out' : ''} inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl border-2 transition-all ${activeClass}"
        title="${d.code} — ${colorObj.label}"
      >
        <span 
          class="w-4 h-4 rounded-full border border-black/15 shadow-xs shrink-0 flex items-center justify-center"
          style="background-color: ${colorObj.hex};"
        >
          ${isSelected ? '<span class="w-1.5 h-1.5 rounded-full bg-white shadow-xs"></span>' : ''}
        </span>
        <span class="text-xs font-mono font-bold">${d.code}</span>
        <span class="text-[11px] font-medium truncate max-w-[85px]">${colorObj.label}</span>
        <span class="text-[9px] px-1.5 py-0.5 rounded-full bg-stone-100 text-stone-500 font-bold shrink-0">${numPhotos}📷</span>
      </button>
    `;
  }).join('');

  container.innerHTML = `<div class="flex items-center gap-2 flex-wrap pt-1">${swatchesHtml}</div>`;

  const activeDesign = colorways[state.activePdpDesignIndex] || (cat.designs && cat.designs[0]) || {};
  const activeColorObj = getAccurateColor(activeDesign.color);
  const isCurrentColorSold = window.vellumAdapter && window.vellumAdapter.getColorStock(cat.id, activeDesign.code) === 'sold_out';
  const numCurrentPhotos = (activeDesign.imageUrls && activeDesign.imageUrls.length) || 1;
  
  let statusBadge = '<span class="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold border border-emerald-200">🟢 In Stock</span>';
  if (catStock === 'temp_out_of_stock') {
    statusBadge = '<span class="text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full font-bold border border-amber-300">⏳ Weaving in Progress (3–5 Days)</span>';
  } else if (catStock === 'perm_out_of_stock') {
    statusBadge = '<span class="text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full font-bold border border-rose-200">🚫 Lot Discontinued / Sold Out</span>';
  } else if (isCurrentColorSold) {
    statusBadge = '<span class="text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full font-bold border border-rose-200">🚫 This Color Sold Out</span>';
  }

  const labelEl = document.getElementById('pdpSelectedColorLabel');
  if (labelEl) {
    labelEl.innerHTML = `<span class="font-bold text-stone-900">${activeDesign.code || '101'} — ${activeColorObj.label}</span> ${statusBadge}`;
  }
}

function showPdpZeroCover() {
  const cat = state.activePdpCatalog;
  if (!cat) return;
  const coverHero = getCatalogCoverHero(cat);
  const heroImg = document.getElementById('pdpHeroImage');
  if (heroImg && coverHero.url) {
    heroImg.src = coverHero.url;
  }
  const indicator = document.getElementById('pdpAngleIndicator');
  if (indicator) {
    indicator.textContent = '000 Master Catalog Poster (No Color)';
  }
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
    heroImg.onerror = function() {
      this.onerror = null;
      this.src = cat.heroImageUrl || 'assets/saurashtra-sarees-logo.jpg';
    };
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

  // Thumbnails Strip (Support both pdpThumbnailsRow and pdpThumbStrip)
  const thumbStrip = document.getElementById('pdpThumbnailsRow') || document.getElementById('pdpThumbStrip');
  const countLabel = document.getElementById('pdpThumbCount') || document.getElementById('pdpAngleCount');
  if (countLabel) {
    countLabel.textContent = `${realUrls.length} HD Photos Available`;
  }
  if (thumbStrip) {
    
    thumbStrip.innerHTML = realUrls.map((imgUrl, i) => {
      const isSelected = i === state.activePdpImageIndex;
      const borderClass = isSelected ? 'border-amber-600 ring-2 ring-amber-500/40 scale-105 shadow-md' : 'border-amber-200 opacity-75 hover:opacity-100';

      return `
        <div onclick="selectPdpAngle(${i})" class="flex-shrink-0 w-20 aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer border-2 transition-all relative group bg-white ${borderClass}">
          <img 
            src="${imgUrl}" 
            referrerpolicy="no-referrer"
            alt="View ${i+1}" 
            class="w-full h-full object-cover object-top"
            onerror="this.onerror=null; this.src='assets/saurashtra-sarees-logo.jpg';"
          >
          <span class="absolute bottom-1.5 left-1.5 right-1.5 bg-stone-900/85 backdrop-blur-xs text-[9px] text-white font-mono font-bold text-center rounded py-0.5 truncate px-1">
            View ${i+1}
          </span>
        </div>
      `;
    }).join('');
  }
}

function selectPdpAngle(angleIdx) {
  state.activePdpImageIndex = angleIdx;
  updatePdpGallery();
  
  const cat = state.activePdpCatalog;
  const activeDesign = cat ? (cat.designs[state.activePdpDesignIndex] || {}) : {};
  const total = (activeDesign.imageUrls && activeDesign.imageUrls.length) || 1;
  const indicator = document.getElementById('pdpAngleIndicator');
  if (indicator) {
    indicator.textContent = `View ${angleIdx + 1} of ${total}`;
  }
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

  // Only explicitly authorized accounts with 'all' rate access see the 3-rate breakdown.
  // All staff (including Founders NA39 & CH33 who are set to Retail Only) and showroom visitors strictly see the single retail rate!
  const isAllRatesUser = Boolean(
    state.hasAttachedCode && state.activeUser && state.activeUser.rateAccess === 'all'
  );

  container.innerHTML = related.map(item => {
    const firstD = item.designs[0] || {};
    const itemImg = firstD.heroImageUrl || item.heroImageUrl || 'https://placehold.co/600x800/1e293b/d4af37?text=' + encodeURIComponent(item.name);

    return `
      <div onclick="navigateToProduct('${item.code}')" class="bg-slate-50 hover:bg-white rounded-2xl p-3 border border-slate-200 cursor-pointer transition-all hover:shadow-lg group flex flex-col justify-between">
        <div class="relative aspect-[3/4] bg-white border border-amber-200 text-stone-800 rounded-xl overflow-hidden mb-3">
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
          <span class="text-[9px] font-bold text-stone-600 uppercase tracking-wider">${item.category}</span>
          <h4 class="font-serif text-sm font-bold text-slate-900 group-hover:text-brand-maroon transition-colors line-clamp-1">${item.name}</h4>
          <div class="flex items-baseline justify-between mt-1">
            <span class="font-price text-base font-black text-stone-900">
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
  const user = state.activeUser || USER_PROFILES['NA39'];

  const msg = encodeURIComponent(
    `Hello ${user.name} (${firm.name}),\n` +
    `I am inquiring about this catalog:\n\n` +
    `🥻 Catalog: ${catalogCode}\n` +
    `🎨 Color/Design: ${color}\n` +
    `💰 Price: ₹${rate}/- Only\n` +
    `📦 Availability: Immediate / Restock Inquiry\n\n` +
    `Please share stock availability and dispatch schedule.`
  );
  window.open(`https://wa.me/${user.whatsapp}?text=${msg}`, '_blank');
}

function sendPdpWhatsApp() {
  const cat = state.activePdpCatalog;
  if (!cat) return;
  const activeDesign = cat.designs[state.activePdpDesignIndex] || {};
  const colorObj = getAccurateColor(activeDesign.color);
  const rate = getActiveRate(cat);

  sendStaffWhatsApp(cat.code, `${colorObj.label} (${activeDesign.code})`, rate);
}

function copyPdpSpecs() {
  const cat = state.activePdpCatalog;
  if (!cat) return;
  const firm = FIRMS[state.activeFirm] || FIRMS.saurashtra;
  const user = state.activeUser || USER_PROFILES['NA39'];
  const isAllRatesUser = Boolean(
    state.hasAttachedCode && state.activeUser && state.activeUser.rateAccess === 'all'
  );

  let priceText = `₹${cat.retailRate}/- (Catalog MRP)`;
  if (state.currentRole === 'wholesale') {
    priceText = `₹${cat.wholesaleRate}/- (Wholesale B2B Mill Price)`;
  } else if (state.currentRole === 'prime') {
    priceText = `₹${cat.resellerRate}/- (Prime Wholesale Price)`;
  } else if (isAllRatesUser) {
    priceText = `• Wholesale: ₹${cat.wholesaleRate}/-\n• Prime: ₹${cat.resellerRate}/-\n• Catalog MRP: ₹${cat.retailRate}/-`;
  }

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
📦 *Status:* ${cat.status}

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

// --------------------------------------------------------------------------
// 11. SHOWROOM INFORMATIONAL PAGES & POLICIES (Footer Links)
// --------------------------------------------------------------------------
const INFO_PAGES = {
  'terms': {
    title: 'Terms & Conditions 📜',
    subtitle: 'Showroom Guidelines & Commercial Trade Agreement',
    render: (firm, user) => `
      <div class="space-y-4">
        <p class="leading-relaxed">Welcome to the digital showroom of <strong>${firm.name}</strong>. By browsing, sharing smart links, or booking saree catalogs through this platform, trade buyers and retail clients agree to the terms outlined below.</p>
        
        <div class="space-y-3 pt-2">
          <div class="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80">
            <h5 class="font-bold text-stone-900 mb-1">1. Authenticity & Direct Manufacturing</h5>
            <p class="text-stone-600">All catalogs displayed represent direct production lots woven in our Surat manufacturing units. Fabrics, borders, and blouse cuts comply with verified industrial handloom specifications.</p>
          </div>

          <div class="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80">
            <h5 class="font-bold text-stone-900 mb-1">2. Smart Link Pricing & Roles</h5>
            <p class="text-stone-600">Customer pricing is tied to the authorized URL tier. Wholesale and reseller rates are trade confidential. Altering parameters to circumvent assigned pricing tiers is strictly monitored and voided.</p>
          </div>

          <div class="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80">
            <h5 class="font-bold text-stone-900 mb-1">3. Color Accuracy Disclaimer</h5>
            <p class="text-stone-600">While all sarees are shot in professional studio conditions (Model and Table shoots), minor natural shade variations of 5–10% may occur due to diverse display color calibrations.</p>
          </div>

          <div class="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80">
            <h5 class="font-bold text-stone-900 mb-1">4. Order Placement & GST Compliance</h5>
            <p class="text-stone-600">Orders are booked via your dedicated sales executive <strong>${user.name}</strong>. All dispatches carry formal GST invoices under the standard 5% textile tax classification.</p>
          </div>
        </div>
      </div>
    `
  },

  'shipping': {
    title: 'Shipping Policy 🚚',
    subtitle: 'Nationwide Insured Dispatch within 24–48 Hours',
    render: (firm, user) => `
      <div class="space-y-4">
        <p class="leading-relaxed"><strong>${firm.name}</strong> operates a centralized automated dispatch hub in Surat, Gujarat, ensuring safe, expedited delivery across all Indian pin codes and export ports.</p>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div class="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80">
            <p class="font-bold text-emerald-400 text-xs mb-1">⚡ Dispatch Speed</p>
            <p class="text-stone-600">Confirmed orders are packaged and handed to express couriers within 24–48 hours from our Surat warehouse.</p>
          </div>
          <div class="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80">
            <p class="font-bold text-sky-400 text-xs mb-1">🛡️ 100% Transit Insured</p>
            <p class="text-stone-600">Every single consignment and bulk parcel bale is fully insured against theft, loss, or transit damage.</p>
          </div>
        </div>

        <div class="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
          <h5 class="font-bold text-stone-900">Estimated Delivery Timelines:</h5>
          <ul class="space-y-1.5 text-stone-600">
            <li>• <strong>Gujarat & Western Zone:</strong> 1 to 2 business days</li>
            <li>• <strong>Metro Cities (Delhi, Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata):</strong> 2 to 4 business days</li>
            <li>• <strong>Rest of India (Tier 2/3 Cities & North-East):</strong> 4 to 6 business days</li>
            <li>• <strong>Bulk Cargo Transport:</strong> V-Trans, TCI Freight, Surat Transport (3 to 7 days depending on destination)</li>
          </ul>
        </div>
      </div>
    `
  },

  'return': {
    title: 'Return Policy 🔄',
    subtitle: '7-Day Manufacturing Defect Replacement Guarantee',
    render: (firm) => `
      <div class="space-y-4">
        <p class="leading-relaxed">At <strong>${firm.name}</strong>, quality is paramount. Every saree passes a multi-stage inspection for weaving flaws, zari continuity, and blouse length before sealing.</p>
        
        <div class="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200">
          <h5 class="font-bold mb-1 flex items-center gap-1.5">
            <i data-lucide="video" class="w-4 h-4"></i> Parcel Opening Video Mandatory
          </h5>
          <p class="text-[11px] leading-relaxed">
            To prevent transit theft and false claims, a continuous 360-degree unboxing video recorded from the sealed box/polybag stage is strictly required for any damage or shortage claim.
          </p>
        </div>

        <div class="space-y-2 text-stone-600">
          <p>• <strong>Eligibility Window:</strong> Return requests for genuine manufacturing defects must be reported within <strong>7 days</strong> of delivery.</p>
          <p>• <strong>Condition:</strong> Saree must be in unworn, unwashed condition with original brand tags and folded with its unstitched blouse piece intact.</p>
          <p>• <strong>Non-Returnable:</strong> Minor loose weave threads (inherent to jacquard weaving) or items altered/tailored cannot be returned.</p>
        </div>
      </div>
    `
  },

  'privacy': {
    title: 'Privacy Policy 🔒',
    subtitle: 'Data Protection & Trade Confidentiality Commitment',
    render: (firm) => `
      <div class="space-y-4">
        <p class="leading-relaxed"><strong>${firm.name}</strong> is committed to preserving the trade privacy of our boutique partners, resellers, and direct patrons.</p>
        
        <div class="divide-y divide-slate-800 text-stone-600">
          <div class="py-2.5">
            <strong class="text-stone-900">1. Zero Third-Party Data Monetization:</strong>
            <p class="mt-0.5">We do not sell, rent, or trade your contact numbers, business details, or purchasing history to advertising aggregators.</p>
          </div>
          <div class="py-2.5">
            <strong class="text-stone-900">2. Blind Dropshipping Protection:</strong>
            <p class="mt-0.5">For verified resellers, shipments sent directly to their retail buyers carry white-label sender tags without mill branding or trade rates.</p>
          </div>
          <div class="py-2.5">
            <strong class="text-stone-900">3. Direct Rep Communication:</strong>
            <p class="mt-0.5">Your inquiries route strictly to your authorized representative's secure mobile link.</p>
          </div>
        </div>
      </div>
    `
  },

  'refund': {
    title: 'Refund Policy 💳',
    subtitle: 'Transparent Claims & Instant Adjustment Guarantee',
    render: (firm) => `
      <div class="space-y-4">
        <p class="leading-relaxed">All refund transactions are processed with complete commercial transparency by <strong>${firm.name}</strong> accounts desk.</p>
        
        <div class="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2 text-stone-600">
          <p>• <strong>Defect Settlements:</strong> If an approved returned saree cannot be replaced due to out-of-stock lots, refunds are processed via UPI or NEFT within <strong>3 business days</strong>.</p>
          <p>• <strong>Order Cancellations:</strong> Orders cancelled before courier pickup receive immediate 100% refund or ledger credit.</p>
          <p>• <strong>Ledger Adjustment:</strong> Regular B2B stockists and portal sellers may choose immediate credit adjustment against future catalog bookings.</p>
        </div>
      </div>
    `
  },

  'esg': {
    title: 'ESG Policy (Sustainability & Ethics) 🌿',
    subtitle: 'Environmental, Social & Corporate Governance in Textile Production',
    render: (firm) => `
      <div class="space-y-4">
        <p class="leading-relaxed"><strong>${firm.name}</strong> is dedicated to responsible, sustainable manufacturing across all textile supply chains in Surat, Gujarat.</p>
        
        <div class="space-y-3">
          <div class="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-800/60">
            <h5 class="font-bold text-emerald-300 mb-1">🌿 Environmental (E):</h5>
            <p class="text-stone-700 text-[11px]">100% Azo-free dyes. Zero direct liquid effluent discharge through closed-loop water treatment plants in Surat finishing mills. Solar-assisted power in modern weaving sheds.</p>
          </div>

          <div class="p-3.5 rounded-2xl bg-sky-950/40 border border-sky-800/60">
            <h5 class="font-bold text-sky-300 mb-1">🤝 Social Responsibility (S):</h5>
            <p class="text-stone-700 text-[11px]">Fair living wages paid to traditional handloom and jacquard artisans. Zero child labor. Clean, ergonomic, well-ventilated working facilities with medical coverage.</p>
          </div>

          <div class="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-800/60">
            <h5 class="font-bold text-purple-300 mb-1">⚖️ Corporate Governance (G):</h5>
            <p class="text-stone-700 text-[11px]">Full statutory GST compliance, anti-tamper smart link transparency, and authentic silk purity standards certified before commercial release.</p>
          </div>
        </div>
      </div>
    `
  },

  'about-us': {
    title: 'About Us 🏛️',
    subtitle: 'From Surat Weaving Looms to Nationwide Showrooms',
    render: (firm) => `
      <div class="space-y-4">
        <p class="leading-relaxed">
          Welcome to the world of <strong>${firm.name}</strong>. Operating from our central facility at <strong>A-1001, Rajhans Fabrizo, Near Polaris Textile City, BRTS Road, Magob, Surat, Gujarat – 395010</strong>, our operations integrate century-old weaving heritage with cutting-edge jacquard textile engineering.
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div class="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80">
            <h5 class="font-serif font-bold text-amber-900 text-sm mb-1">Saurashtra Sarees</h5>
            <p class="text-[11px] text-stone-600">"MAKE OCCASION BETTER". Specialists in heritage South Kanjivarams, authentic Gadwal soft silks, Yeola Paithanis, and royal bridal Banarasi brocades.</p>
          </div>
          <div class="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80">
            <h5 class="font-serif font-bold text-sky-900 text-sm mb-1">Keya Fashion</h5>
            <p class="text-[11px] text-stone-600">"Stop wishing. Start living....". Innovators in lightweight glass organza, fluid dola silks, and high-velocity digital portal catalog designs.</p>
          </div>
        </div>

        <p class="text-stone-700 text-xs">
          Supplying 2,500+ boutique retailers, super-stockists, and online portal sellers across India and worldwide with genuine mill pricing and zero middleman markup.
        </p>
      </div>
    `
  },

  'track-order': {
    title: 'Track Consignment 📦',
    subtitle: 'Live Dispatch Status & Docket Tracking',
    render: (firm, user) => `
      <div class="space-y-4">
        <p class="leading-relaxed">Enter your 10-digit mobile number or Courier AWB / Order ID to check live dispatch and transit status from our Surat warehouse.</p>
        
        <div class="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-3">
          <label class="block text-[11px] font-bold text-stone-600 uppercase tracking-wider">Order ID / Mobile Number / AWB</label>
          <div class="flex gap-2">
            <input 
              type="text" 
              id="trackInput" 
              placeholder="e.g. SURAT-89210 or 9879471039" 
              class="flex-1 px-3.5 py-2.5 bg-white border border-amber-200 shadow-xs rounded-xl text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
            >
            <button onclick="simulateTrackOrder()" class="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider shrink-0 transition-all">
              Track Status
            </button>
          </div>
          <div id="trackResultBox" class="hidden p-3.5 rounded-xl bg-white border border-amber-200 shadow-xs text-xs space-y-2 mt-2">
            <!-- Simulated Result Injected Here -->
          </div>
        </div>

        <div class="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-between gap-3">
          <div>
            <p class="font-bold text-stone-900 text-xs">Need instant tracking docket copy?</p>
            <p class="text-[11px] text-stone-600">Your assigned representative <strong>${user.name}</strong> will share the receipt on WhatsApp.</p>
          </div>
          <button onclick="window.open('https://wa.me/${user.whatsapp}?text=' + encodeURIComponent('Hello ${user.name}, please share live tracking docket for my order.'), '_blank')" class="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs shrink-0 flex items-center gap-1.5 shadow-md">
            <i data-lucide="message-circle" class="w-3.5 h-3.5 fill-current"></i>
            <span>Ask ${user.name}</span>
          </button>
        </div>
      </div>
    `
  },

  'store-locator': {
    title: 'Store & Warehouse Locator 📍',
    subtitle: 'Visit Our Central Showroom in Magob, Surat',
    render: (firm, user) => `
      <div class="space-y-4">
        <p class="leading-relaxed">We welcome registered trade partners, boutique owners, and portal sellers to inspect our full catalog collections in person at our central wholesale showroom and warehouse.</p>
        
        <div class="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-3.5 shadow-xs">
          <div class="flex items-start gap-3.5">
            <div class="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 shrink-0 mt-0.5">
              <i data-lucide="building-2" class="w-6 h-6"></i>
            </div>
            <div>
              <h5 class="font-bold text-stone-900 text-sm">${firm.name} Central Wholesale Showroom</h5>
              <p class="text-stone-700 text-xs mt-1 font-medium leading-relaxed">
                A-1001, Rajhans Fabrizo, Near Polaris Textile City, BRTS Road, Magob, Surat, Gujarat – 395010
              </p>
              <div class="flex flex-wrap items-center gap-3 mt-2 text-xs text-amber-900 font-mono font-bold">
                <span>🕒 09:00 AM–07:00 PM (Mon–Sat)</span>
                <span>•</span>
                <span>📞 +91 ${user.phone}</span>
              </div>
            </div>
          </div>
          
          <div class="pt-2 border-t border-amber-200/80 flex items-center gap-2">
            <a href="https://maps.google.com/?q=Rajhans+Fabrizo+BRTS+Road+Magob+Surat+Gujarat+395010" target="_blank" class="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white border border-amber-700 text-center font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs">
              <i data-lucide="navigation" class="w-3.5 h-3.5 text-white"></i>
              <span>Open in Google Maps ↗</span>
            </a>
            <a href="tel:+91${user.phone}" class="py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-black text-white font-bold text-xs flex items-center gap-1.5 shadow-xs">
              <i data-lucide="phone" class="w-3.5 h-3.5 text-amber-400"></i>
              <span>Call Showroom</span>
            </a>
          </div>
        </div>
      </div>
    `
  },

  'bulk-order': {
    title: 'Bulk Order & Trade Query 💼',
    subtitle: 'Wholesale Bales, Super-Stockist Packs & Export Orders',
    render: (firm, user) => `
      <div class="space-y-4">
        <p class="leading-relaxed">Looking for 50+, 100+, 250+, or 500+ saree lot packs for weddings, boutique stock, or overseas export? Submit your requirement for instant mill pricing.</p>
        
        <div class="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-3.5">
          <div>
            <label class="block text-[11px] font-bold text-stone-600 uppercase mb-1.5">1. Target Quantity</label>
            <div class="grid grid-cols-4 gap-2 text-xs">
              <button type="button" onclick="selectBulkQty(this, '50 Pcs')" class="bulk-qty-btn py-2 rounded-xl bg-white border border-amber-200 shadow-xs text-white font-bold hover:border-amber-400 text-center">50 Pcs</button>
              <button type="button" onclick="selectBulkQty(this, '100 Pcs')" class="bulk-qty-btn py-2 rounded-xl bg-white border border-amber-200 shadow-xs text-white font-bold hover:border-amber-400 text-center">100 Pcs</button>
              <button type="button" onclick="selectBulkQty(this, '250 Pcs')" class="bulk-qty-btn py-2 rounded-xl bg-white border border-amber-200 shadow-xs text-white font-bold hover:border-amber-400 text-center">250 Pcs</button>
              <button type="button" onclick="selectBulkQty(this, '500+ Pcs')" class="bulk-qty-btn py-2 rounded-xl bg-amber-500 text-slate-950 font-bold border border-amber-400 text-center">500+ Pcs</button>
            </div>
          </div>

          <div>
            <label class="block text-[11px] font-bold text-stone-600 uppercase mb-1.5">2. Preferred Collection</label>
            <input type="text" id="bulkCatInput" placeholder="e.g. Aashvi Gadwal Silk, Paithani, Organza, All Mix" class="w-full px-3.5 py-2.5 bg-white border border-amber-200 shadow-xs rounded-xl text-xs text-white focus:outline-none focus:border-amber-400">
          </div>

          <button onclick="sendBulkQueryWhatsApp()" class="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all">
            <i data-lucide="message-circle" class="w-4 h-4 fill-current"></i>
            <span>Submit Bulk Query to ${user.name}</span>
          </button>
        </div>
      </div>
    `
  },

  'faqs': {
    title: 'Frequently Asked Questions (FAQ\'s) ❓',
    subtitle: 'Everything You Need to Know About Ordering, Dispatch & Fabrics',
    render: () => `
      <div class="space-y-3">
        ${[
          { q: 'What is the Minimum Order Quantity (MOQ)?', a: 'For wholesale trade rates, our standard MOQ is 1 complete catalog pack (typically 4 to 8 color variants). Single pieces are welcomed at standard retail MRP rate.' },
          { q: 'How do I place and confirm an order?', a: 'Browse the collection, click "Inquire via WhatsApp", and your assigned sales representative will send you the formal proforma invoice with bank transfer/UPI details.' },
          { q: 'Do you provide high-definition photos and drape reels for resellers?', a: 'Yes! Every collection has complete 1080p model/table photos and video reels accessible with 1-click Google Drive links.' },
          { q: 'Do all shipments carry GST tax invoices?', a: 'Yes. 100% of shipments carry formal GST invoices under the standard 5% textile tax classification.' },
          { q: 'Can you dropship directly to my retail customer?', a: 'Yes! We offer blind dropshipping for verified portal sellers without any manufacturer branding or invoice inside the parcel.' },
          { q: 'What are your operational and support timings?', a: 'Our sales desk and dispatch hub operate from 09:00 AM to 07:00 PM, Monday through Saturday.' }
        ].map((item, idx) => `
          <div class="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1.5">
            <h5 class="font-bold text-stone-900 text-xs flex items-center gap-2">
              <span class="w-5 h-5 rounded-full bg-white border border-amber-200 shadow-xs flex items-center justify-center text-[10px] text-amber-400 shrink-0 font-mono">${idx+1}</span>
              <span>${item.q}</span>
            </h5>
            <p class="text-stone-600 text-[11px] leading-relaxed pl-7">${item.a}</p>
          </div>
        `).join('')}
      </div>
    `
  }
};

let selectedBulkQuantity = '500+ Pcs';

function selectBulkQty(btn, qty) {
  selectedBulkQuantity = qty;
  document.querySelectorAll('.bulk-qty-btn').forEach(b => {
    b.className = 'bulk-qty-btn py-2 rounded-xl bg-white border border-amber-200 shadow-xs text-white font-bold hover:border-amber-400 text-center';
  });
  btn.className = 'bulk-qty-btn py-2 rounded-xl bg-amber-500 text-slate-950 font-bold border border-amber-400 text-center';
}

function sendBulkQueryWhatsApp() {
  const firm = FIRMS[state.activeFirm] || FIRMS.saurashtra;
  const user = state.activeUser || USER_PROFILES['NA39'];
  const catPref = document.getElementById('bulkCatInput')?.value || 'Full Catalog Assorted Lot';

  const msg = encodeURIComponent(
    `Hello ${user.name} (${firm.name}),\n` +
    `I want a Bulk Wholesale Quote:\n\n` +
    `📦 Quantity Required: ${selectedBulkQuantity}\n` +
    `🥻 Preferred Collections: ${catPref}\n` +
    `🏢 Business Name: \n` +
    `📍 Delivery City / State: \n\n` +
    `Please share best factory pricing and dispatch schedule.`
  );
  window.open(`https://wa.me/${user.whatsapp}?text=${msg}`, '_blank');
}

function simulateTrackOrder() {
  const input = document.getElementById('trackInput')?.value.trim();
  const box = document.getElementById('trackResultBox');
  if (!box) return;

  if (!input) {
    box.innerHTML = `<p class="text-rose-400 font-semibold">Please enter an Order ID or 10-digit mobile number.</p>`;
    box.classList.remove('hidden');
    return;
  }

  const orderNum = input.toUpperCase();
  box.innerHTML = `
    <div class="space-y-2">
      <div class="flex items-center justify-between border-b border-slate-800 pb-1.5">
        <span class="font-bold text-stone-900">Consignment: ${orderNum}</span>
        <span class="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-mono">In Transit</span>
      </div>
      <p class="text-[11px] text-stone-700">Courier: <strong>Delhivery Express (Air Surface)</strong></p>
      <div class="space-y-1 text-[11px] text-stone-600 pt-1">
        <p class="text-emerald-400 font-medium">✓ Dispatched from Surat Central Hub</p>
        <p class="text-emerald-400 font-medium">✓ Sorted at Regional Logistics Centre</p>
        <p class="text-amber-400 font-bold">🚚 Out for Delivery to Destination Hub</p>
      </div>
      <p class="text-[10px] text-slate-500 pt-1">Estimated Delivery: Within 24-48 Hours</p>
    </div>
  `;
  box.classList.remove('hidden');
}

function openInfoPage(pageKey) {
  const page = INFO_PAGES[pageKey];
  if (!page) return;

  const firm = FIRMS[state.activeFirm] || FIRMS.saurashtra;
  const user = state.activeUser || USER_PROFILES['NA39'];

  document.getElementById('infoModalTitle').textContent = page.title;
  document.getElementById('infoModalSubtitle').textContent = `${firm.name} • ${page.subtitle}`;
  document.getElementById('infoModalContent').innerHTML = page.render(firm, user);

  const modal = document.getElementById('infoModal');
  if (modal) modal.classList.remove('hidden');

  if (window.lucide) lucide.createIcons();
}

function closeInfoModal() {
  const modal = document.getElementById('infoModal');
  if (modal) modal.classList.add('hidden');
}

// ==============================================================================
// 10. B2B SELECTION CART & LUXURY ORDER PDF ENGINE (Pure Rates • 0 GST)
// ==============================================================================

function initCart() {
  try {
    const saved = localStorage.getItem('vellum_order_cart');
    state.cart = saved ? JSON.parse(saved) : [];
  } catch (e) {
    state.cart = [];
  }
  updateCartBadges();
}

function saveCart() {
  try {
    localStorage.setItem('vellum_order_cart', JSON.stringify(state.cart));
  } catch (e) {}
  updateCartBadges();
}

function updateCartBadges() {
  const count = state.cart.reduce((sum, item) => sum + (item.qty || 1), 0);
  
  const headerBadge = document.getElementById('headerCartCountBadge');
  if (headerBadge) headerBadge.textContent = count;

  const mobileBadge = document.getElementById('mobileCartCountBadge');
  if (mobileBadge) mobileBadge.textContent = count;

  const modalBadge = document.getElementById('cartCountBadgeModal');
  if (modalBadge) modalBadge.textContent = `${count} Items`;
}

function addToCart(item) {
  const existing = state.cart.find(i => i.catalogCode === item.catalogCode && i.designCode === item.designCode);
  if (existing) {
    existing.qty = (existing.qty || 1) + (item.qty || 1);
  } else {
    state.cart.push({
      catalogCode: item.catalogCode,
      catalogName: item.catalogName,
      designCode: item.designCode,
      sku: item.sku || `${item.catalogCode}-${item.designCode}`,
      color: item.color,
      rate: Number(item.rate) || 0,
      imageUrl: item.imageUrl || '',
      category: item.category || 'Curated Saree',
      qty: item.qty || 1
    });
  }
  saveCart();
  showCartToast(`✓ Added ${item.catalogName} (${item.color}) to Order Cart!`);
}

function addCurrentPdpToCart() {
  const cat = state.activePdpCatalog;
  if (!cat) return;
  const activeDesign = cat.designs[state.activePdpDesignIndex] || cat.designs[0] || {};
  const colorObj = getAccurateColor(activeDesign.color);
  const activeRate = getActiveRate(cat);

  const realUrls = (activeDesign.images && activeDesign.images.length > 0)
    ? activeDesign.images
    : (activeDesign.imageUrls && activeDesign.imageUrls.length > 0 ? activeDesign.imageUrls : [activeDesign.heroImageUrl || cat.heroImageUrl]);

  addToCart({
    catalogCode: cat.code,
    catalogName: cat.name,
    designCode: activeDesign.code || '101',
    sku: `${cat.code}-D${activeDesign.code || '101'}`,
    color: colorObj.label,
    rate: activeRate,
    imageUrl: realUrls[0] || cat.heroImageUrl,
    category: cat.category
  });
}

function addCatalogCardToCart(catId) {
  const cat = state.catalogs.find(c => c.id === catId || c.code.toLowerCase() === catId.toLowerCase());
  if (!cat) return;
  const firstDesign = cat.designs[0] || {};
  const colorObj = getAccurateColor(firstDesign.color);
  const activeRate = getActiveRate(cat);

  addToCart({
    catalogCode: cat.code,
    catalogName: cat.name,
    designCode: firstDesign.code || '101',
    sku: `${cat.code}-D${firstDesign.code || '101'}`,
    color: colorObj.label,
    rate: activeRate,
    imageUrl: firstDesign.heroImageUrl || cat.heroImageUrl,
    category: cat.category
  });
}

function updateCartItemQty(index, delta) {
  if (!state.cart[index]) return;
  state.cart[index].qty = (state.cart[index].qty || 1) + delta;
  if (state.cart[index].qty <= 0) {
    state.cart.splice(index, 1);
  }
  saveCart();
  renderCartUI();
}

function removeCartItem(index) {
  state.cart.splice(index, 1);
  saveCart();
  renderCartUI();
}

function clearCart() {
  if (state.cart.length === 0) return;
  if (!confirm('Are you sure you want to clear all sarees from your order cart?')) return;
  state.cart = [];
  saveCart();
  renderCartUI();
}

function toggleCartModal(forceOpen = null) {
  const modal = document.getElementById('orderCartModal');
  if (!modal) return;
  const isHidden = modal.classList.contains('hidden');
  const shouldOpen = forceOpen !== null ? forceOpen : isHidden;

  if (shouldOpen) {
    renderCartUI();
    modal.classList.remove('hidden');
  } else {
    modal.classList.add('hidden');
  }
  if (window.lucide) lucide.createIcons();
}

function renderCartUI() {
  const firm = FIRMS[state.activeFirm] || FIRMS.saurashtra;
  const user = state.activeUser || USER_PROFILES['NA39'];

  const firmSubhead = document.getElementById('cartFirmSubhead');
  if (firmSubhead) firmSubhead.textContent = `${firm.name} • ${firm.focus || 'Direct Mill Wholesale'}`;

  const staffNameEl = document.getElementById('cartAssignedStaffName');
  if (staffNameEl) staffNameEl.textContent = user.name;

  const staffPhoneEl = document.getElementById('cartAssignedStaffPhoneText');
  if (staffPhoneEl) staffPhoneEl.textContent = user.displayPhone || user.phone;

  const staffPhoneLink = document.getElementById('cartAssignedStaffPhoneLink');
  if (staffPhoneLink) staffPhoneLink.href = `tel:+${user.phone.replace(/\D/g, '')}`;

  const itemsContainer = document.getElementById('cartItemsContainer');
  const emptyState = document.getElementById('cartEmptyState');
  const detailsBox = document.getElementById('cartOrderDetailsBox');
  const footerEl = document.getElementById('cartModalFooter');

  if (state.cart.length === 0) {
    if (itemsContainer) itemsContainer.innerHTML = '';
    if (emptyState) emptyState.classList.remove('hidden');
    if (detailsBox) detailsBox.classList.add('hidden');
    if (footerEl) footerEl.classList.add('hidden');
    return;
  }

  if (emptyState) emptyState.classList.add('hidden');
  if (detailsBox) detailsBox.classList.remove('hidden');
  if (footerEl) footerEl.classList.remove('hidden');

  let totalQty = 0;
  let totalPrice = 0;

  if (itemsContainer) {
    itemsContainer.innerHTML = state.cart.map((item, idx) => {
      const itemQty = item.qty || 1;
      const itemSubtotal = item.rate * itemQty;
      totalQty += itemQty;
      totalPrice += itemSubtotal;

      return `
        <div class="flex items-center gap-3 p-3 bg-stone-50 rounded-2xl border border-stone-200/80 hover:border-amber-300 transition-colors">
          <img 
            src="${item.imageUrl || 'assets/saurashtra-sarees-logo.jpg'}" 
            referrerpolicy="no-referrer"
            alt="${item.catalogName}" 
            class="w-14 aspect-[3/4] rounded-xl object-cover object-top border border-stone-200 bg-white shrink-0 shadow-xs"
            onerror="this.onerror=null; this.src='assets/saurashtra-sarees-logo.jpg';"
          >
          <div class="flex-1 min-w-0">
            <h4 class="font-serif text-sm font-bold text-stone-900 truncate">${item.catalogName}</h4>
            <p class="text-[11px] text-amber-900 font-medium">SKU: <span class="font-mono font-bold">${item.sku}</span> • ${item.color}</p>
            <p class="text-xs font-price font-bold text-stone-800 mt-0.5">₹${item.rate} <span class="text-[10px] text-stone-500 font-normal">/ piece</span></p>
          </div>
          <div class="flex flex-col items-end gap-1.5 shrink-0">
            <div class="flex items-center border border-stone-300 rounded-lg overflow-hidden bg-white shadow-xs text-xs font-bold">
              <button onclick="updateCartItemQty(${idx}, -1)" class="px-2 py-1 hover:bg-stone-100 text-stone-600 transition-colors">−</button>
              <span class="px-2 font-mono">${itemQty}</span>
              <button onclick="updateCartItemQty(${idx}, 1)" class="px-2 py-1 hover:bg-stone-100 text-stone-600 transition-colors">+</button>
            </div>
            <div class="flex items-center gap-2">
              <span class="font-price font-black text-sm text-stone-900">₹${itemSubtotal}</span>
              <button onclick="removeCartItem(${idx})" title="Remove item" class="text-stone-400 hover:text-rose-600 p-0.5 transition-colors">
                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  const totalQtyEl = document.getElementById('cartSummaryTotalQty');
  if (totalQtyEl) totalQtyEl.textContent = `${totalQty} Sarees`;

  const totalPriceEl = document.getElementById('cartSummaryTotalPrice');
  if (totalPriceEl) totalPriceEl.textContent = `₹${totalPrice.toLocaleString('en-IN')}`;

  if (window.lucide) lucide.createIcons();
}

function showCartToast(msg) {
  let toast = document.getElementById('vellumCartToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'vellumCartToast';
    toast.className = 'fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 bg-stone-950 text-white rounded-2xl shadow-2xl border border-amber-400 text-xs font-bold flex items-center gap-2 animate-fadeIn';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span class="text-amber-400">🛍️</span><span>${msg}</span>`;
  toast.classList.remove('hidden');
  clearTimeout(window.__cartToastTimeout);
  window.__cartToastTimeout = setTimeout(() => {
    toast.classList.add('hidden');
  }, 3000);
}

function toggleMobileFilterPanel() {
  const panel = document.getElementById('filterControlsWrap');
  if (!panel) return;
  panel.classList.toggle('hidden');
  if (window.lucide) lucide.createIcons();
}

function sendOrderWhatsApp() {
  if (state.cart.length === 0) {
    alert('Please add sarees to your order cart before sending.');
    return;
  }
  const firm = FIRMS[state.activeFirm] || FIRMS.saurashtra;
  const user = state.activeUser || USER_PROFILES['NA39'];
  const buyerName = document.getElementById('cartBuyerName')?.value.trim() || 'Trade Partner';
  const buyerCity = document.getElementById('cartBuyerCity')?.value.trim() || 'Surat';
  const buyerNotes = document.getElementById('cartBuyerNotes')?.value.trim();

  let totalQty = 0;
  let totalPrice = 0;
  const orderLines = state.cart.map((item, i) => {
    const qty = item.qty || 1;
    const subtotal = item.rate * qty;
    totalQty += qty;
    totalPrice += subtotal;
    return `${i + 1}. *${item.catalogName}* (SKU: ${item.sku})\n   • Color: ${item.color}\n   • Qty: ${qty} pcs @ ₹${item.rate} = *₹${subtotal}*`;
  });

  const msg = encodeURIComponent(
    `🥻 *WHOLESALE ORDER INQUIRY — ${firm.name.toUpperCase()}*\n` +
    `_Strict Direct Mill Pricing • Pure Commercial Rate (No GST)_\n\n` +
    `👤 *Buyer / Boutique:* ${buyerName}\n` +
    `📍 *Destination:* ${buyerCity}\n` +
    (buyerNotes ? `📝 *Notes:* ${buyerNotes}\n` : '') +
    `--------------------------------------\n` +
    `📦 *ITEMIZED ORDER SELECTION:*\n\n` +
    orderLines.join('\n\n') +
    `\n\n--------------------------------------\n` +
    `🔢 *TOTAL QUANTITY:* ${totalQty} Sarees\n` +
    `💰 *GRAND TOTAL (PURE RATE):* ₹${totalPrice.toLocaleString('en-IN')}\n\n` +
    `Representative: ${user.name} (${user.displayPhone})\n` +
    `Please confirm ready lot availability and dispatch schedule.`
  );

  window.open(`https://api.whatsapp.com/send?phone=${user.whatsapp}&text=${msg}`, '_blank');
}

async function downloadOrderPdf() {
  if (state.cart.length === 0) {
    alert('Please add sarees to your order cart before downloading the PDF.');
    return;
  }

  const firm = FIRMS[state.activeFirm] || FIRMS.saurashtra;
  const user = state.activeUser || USER_PROFILES['NA39'];
  const buyerName = document.getElementById('cartBuyerName')?.value.trim() || 'Trade Partner / Boutique';
  const buyerCity = document.getElementById('cartBuyerCity')?.value.trim() || 'Surat, Gujarat';
  const buyerNotes = document.getElementById('cartBuyerNotes')?.value.trim() || '';

  const dateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const orderId = `ORD-${Date.now().toString().slice(-6)}`;

  // Populate print template
  const pdfHeaderName = document.getElementById('pdfHeaderFirmName');
  if (pdfHeaderName) pdfHeaderName.textContent = firm.name;

  const pdfTagline = document.getElementById('pdfHeaderFirmTagline');
  if (pdfTagline) pdfTagline.textContent = `${firm.tagline} • Surat Mill Direct Wholesale`;

  const pdfIdEl = document.getElementById('pdfOrderId');
  if (pdfIdEl) pdfIdEl.textContent = orderId;

  const pdfDateEl = document.getElementById('pdfOrderDate');
  if (pdfDateEl) pdfDateEl.textContent = `Date: ${dateStr}`;

  const pdfBuyerNameEl = document.getElementById('pdfBuyerName');
  if (pdfBuyerNameEl) pdfBuyerNameEl.textContent = buyerName;

  const pdfBuyerCityEl = document.getElementById('pdfBuyerCity');
  if (pdfBuyerCityEl) pdfBuyerCityEl.textContent = `Destination: ${buyerCity}`;

  const pdfBuyerNotesEl = document.getElementById('pdfBuyerNotes');
  if (pdfBuyerNotesEl) pdfBuyerNotesEl.textContent = buyerNotes ? `Instructions: ${buyerNotes}` : '';

  const pdfStaffNameEl = document.getElementById('pdfStaffName');
  if (pdfStaffNameEl) pdfStaffNameEl.textContent = user.name;

  const pdfStaffPhoneEl = document.getElementById('pdfStaffPhone');
  if (pdfStaffPhoneEl) pdfStaffPhoneEl.textContent = `Direct: ${user.displayPhone || user.phone}`;

  let totalQty = 0;
  let totalPrice = 0;

  const tbody = document.getElementById('pdfTableBody');
  if (tbody) {
    tbody.innerHTML = state.cart.map((item, idx) => {
      const qty = item.qty || 1;
      const subtotal = item.rate * qty;
      totalQty += qty;
      totalPrice += subtotal;

      return `
        <tr style="border-bottom: 1px solid #e7e5e4;">
          <td style="padding: 8px; text-align: center; font-weight: bold; color: #78716c;">${idx + 1}</td>
          <td style="padding: 6px; text-align: center;">
            <img src="${item.imageUrl}" referrerpolicy="no-referrer" style="width: 44px; height: 58px; object-fit: cover; border-radius: 6px; border: 1px solid #e7e5e4;" crossorigin="anonymous">
          </td>
          <td style="padding: 8px;">
            <strong style="color: #1c1917; font-size: 11px;">${item.catalogName}</strong><br>
            <span style="font-family: monospace; font-size: 10px; color: #8b1d40; font-weight: bold;">${item.sku}</span>
          </td>
          <td style="padding: 8px; color: #44403c;">${item.color}</td>
          <td style="padding: 8px; text-align: center; font-weight: bold; font-family: monospace;">${qty}</td>
          <td style="padding: 8px; text-align: right; font-weight: bold;">₹${item.rate}</td>
          <td style="padding: 8px; text-align: right; font-weight: 900; color: #1c1917;">₹${subtotal}</td>
        </tr>
      `;
    }).join('');
  }

  const pdfTotalQtyEl = document.getElementById('pdfTotalQty');
  if (pdfTotalQtyEl) pdfTotalQtyEl.textContent = totalQty;

  const pdfTotalAmountEl = document.getElementById('pdfTotalAmount');
  if (pdfTotalAmountEl) pdfTotalAmountEl.textContent = `₹${totalPrice.toLocaleString('en-IN')}`;

  const btn = document.getElementById('btnDownloadOrderPdf');
  const originalHtml = btn ? btn.innerHTML : '';
  if (btn) btn.innerHTML = `<span>Generating PDF...</span>`;

  try {
    const templateEl = document.getElementById('orderPdfPrintTemplate');
    if (window.html2canvas && window.jspdf) {
      const canvas = await html2canvas(templateEl, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF('p', 'pt', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${firm.name.replace(/\s+/g, '_')}_Order_${orderId}.pdf`);
      showCartToast(`✓ Order PDF downloaded successfully!`);
    } else {
      window.print();
    }
  } catch (err) {
    console.warn('PDF canvas error, using print fallback:', err);
    window.print();
  } finally {
    if (btn) btn.innerHTML = originalHtml;
  }
}

