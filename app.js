// ==========================================================================
// VELLUM — Multi-Firm Luxury Saree Showroom Engine
// Developed by BinduGrid Studio
// ==========================================================================

const CONFIG = {
  sheetId: '1O-F9nVgPdkamtTGDesEcde8PCZSK7pyjUJDi8PrwmaY',
  sheetUrl: 'https://docs.google.com/spreadsheets/d/1O-F9nVgPdkamtTGDesEcde8PCZSK7pyjUJDi8PrwmaY/gviz/tq?tqx=out:csv&sheet=Catalogs%20%26%20Pricing',
  defaultKeys: {
    wholesale: 'prime',
    reseller: 'seller'
  }
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
// 2. STAFF DIRECTORY (Supports 3-6 dedicated staff members)
// --------------------------------------------------------------------------
const DEFAULT_STAFF = [
  {
    id: 'staff-1',
    slug: 'saurabh',
    name: 'Saurabh Bhai',
    firm: 'saurashtra',
    phone: '9879471039',
    whatsapp: '919879471039',
    role: 'Wholesale Sales Head'
  },
  {
    id: 'staff-2',
    slug: 'keyur',
    name: 'Keyur Bhai',
    firm: 'keya',
    phone: '9913643433',
    whatsapp: '919913643433',
    role: 'Portal & Reseller Specialist'
  },
  {
    id: 'staff-3',
    slug: 'rajesh',
    name: 'Rajesh Bhai',
    firm: 'saurashtra',
    phone: '9879471039',
    whatsapp: '919879471039',
    role: 'B2B Trade Coordinator'
  },
  {
    id: 'staff-4',
    slug: 'neha',
    name: 'Neha Ben',
    firm: 'keya',
    phone: '9913643433',
    whatsapp: '919913643433',
    role: 'Online Catalog Desk'
  },
  {
    id: 'staff-5',
    slug: 'amit',
    name: 'Amit Bhai',
    firm: 'saurashtra',
    phone: '9879471039',
    whatsapp: '919879471039',
    role: 'Senior Sales Executive'
  },
  {
    id: 'staff-6',
    slug: 'priya',
    name: 'Priya Ben',
    firm: 'keya',
    phone: '9913643433',
    whatsapp: '919913643433',
    role: 'Customer Success Manager'
  }
];

// Global Application State
const state = {
  catalogs: [],
  filteredCatalogs: [],
  selectedCategory: 'all',
  searchQuery: '',
  sortBy: 'newest',
  currentRole: 'retail', // 'wholesale', 'reseller', 'retail'
  currentShoot: 'all',   // 'all' (default), 'model', 'table'
  activeFirm: 'saurashtra',
  activeStaff: null,
  activePdpCatalog: null,
  activePdpDesignIndex: 0,
  activePdpImageIndex: 0,
  activePdpShoot: 'all'
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

// Resolve Firm, Staff, Role and Shoot from URL parameters
function resolveUrlContext() {
  const params = new URLSearchParams(window.location.search);
  
  // 1. Firm resolution
  const firmParam = (params.get('firm') || params.get('f') || '').toLowerCase().trim();
  if (firmParam === 'keya' || firmParam === 'keyafashion') {
    state.activeFirm = 'keya';
  } else {
    state.activeFirm = 'saurashtra';
  }

  // 2. Staff resolution (stored in localStorage or from DEFAULT_STAFF)
  const savedStaff = JSON.parse(localStorage.getItem('vellum_staff_list') || 'null') || DEFAULT_STAFF;
  const staffParam = (params.get('staff') || params.get('rep') || params.get('s') || '').toLowerCase().trim();
  
  if (staffParam) {
    const matched = savedStaff.find(s => s.slug.toLowerCase() === staffParam || s.id.toLowerCase() === staffParam);
    if (matched) {
      state.activeStaff = matched;
      state.activeFirm = matched.firm; // Firm follows the staff member's assignment
    }
  }

  if (!state.activeStaff) {
    // Default to the first staff of the active firm
    state.activeStaff = savedStaff.find(s => s.firm === state.activeFirm) || savedStaff[0];
  }

  // 3. Shoot resolution (Default is "all")
  const shootParam = (params.get('shoot') || '').toLowerCase().trim();
  if (shootParam === 'model') state.currentShoot = 'model';
  else if (shootParam === 'table') state.currentShoot = 'table';
  else state.currentShoot = 'all';

  // 4. Role resolution
  const key = (params.get('k') || params.get('key') || params.get('ref') || '').toLowerCase().trim();
  if (key === CONFIG.defaultKeys.wholesale || key === 'wholesale' || key === 'dealer' || key === 'bulk') {
    state.currentRole = 'wholesale';
  } else if (key === CONFIG.defaultKeys.reseller || key === 'seller' || key === 'portal' || key === 'reseller') {
    state.currentRole = 'reseller';
  } else {
    state.currentRole = 'retail';
  }

  applyFirmTheme();
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
  document.getElementById('pageTitle').textContent = `${firm.name} | Digital Wholesale Showroom`;
  
  const logoImg = document.getElementById('firmLogoImg');
  if (logoImg) logoImg.src = firm.logo;

  const footerLogo = document.getElementById('footerFirmLogo');
  if (footerLogo) footerLogo.src = firm.logo;

  // Text Elements
  document.getElementById('headerFirmName').textContent = firm.name;
  document.getElementById('announcementFirmText').textContent = firm.name;
  document.getElementById('announcementTagline').textContent = firm.tagline;
  document.getElementById('footerFirmName').textContent = firm.name;
  document.getElementById('footerFirmTagline').textContent = firm.tagline;
  document.getElementById('heroFirmTag').textContent = `${firm.name} Direct Wholesale`;
  document.getElementById('currentFirmPillLabel').textContent = `Firm: ${firm.name.split(' ')[0]}`;
}

function updateStaffUI() {
  const staff = state.activeStaff;
  if (!staff) return;

  const staffNameEls = [
    document.getElementById('staffNameDisplay'),
    document.getElementById('badgeStaffActive')
  ];
  staffNameEls.forEach(el => {
    if (el) el.textContent = staff.name;
  });

  const phoneEl = document.getElementById('staffPhoneDisplay');
  if (phoneEl) phoneEl.textContent = `+91 ${staff.phone}`;

  const callLink = document.getElementById('staffCallLink');
  if (callLink) callLink.href = `tel:+91${staff.phone}`;
}

function switchFirm(firmId) {
  state.activeFirm = firmId;
  applyFirmTheme();
  
  // Re-assign a matching staff member
  const savedStaff = JSON.parse(localStorage.getItem('vellum_staff_list') || 'null') || DEFAULT_STAFF;
  state.activeStaff = savedStaff.find(s => s.firm === state.activeFirm) || savedStaff[0];
  updateStaffUI();

  toggleFirmMenu();
  applyFiltersAndRender();
  if (state.activePdpCatalog) renderPdpScreen();
}

function toggleFirmMenu() {
  const menu = document.getElementById('firmMenu');
  if (menu) menu.classList.toggle('hidden');
}

function updateRoleUI() {
  const labelEl = document.getElementById('currentRoleLabel');
  const badgeEl = document.getElementById('badgeRoleActive');

  let labelText = 'Retail / MRP';
  let badgeText = 'Retail / MRP Rate';
  let badgeClass = 'text-purple-700';

  if (state.currentRole === 'wholesale') {
    labelText = 'Wholesale';
    badgeText = 'Super Wholesale Rate';
    badgeClass = 'text-emerald-700';
  } else if (state.currentRole === 'reseller') {
    labelText = 'Portal Seller';
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
    console.log('Using cached pricing database.');
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

function getActiveRate(catalog) {
  if (state.currentRole === 'wholesale') return catalog.wholesaleRate;
  if (state.currentRole === 'reseller') return catalog.resellerRate;
  return catalog.retailRate;
}

function getRoleTag() {
  if (state.currentRole === 'wholesale') return 'Wholesale';
  if (state.currentRole === 'reseller') return 'Reseller';
  return 'MRP';
}

function applyFiltersAndRender() {
  let list = [...state.catalogs];

  // Category Filter
  if (state.selectedCategory !== 'all') {
    list = list.filter(c => c.category === state.selectedCategory);
  }

  // Search Filter
  if (state.searchQuery) {
    const q = state.searchQuery;
    list = list.filter(c => {
      const matchName = c.name.toLowerCase().includes(q);
      const matchCode = c.code.toLowerCase().includes(q);
      const matchCat = c.category.toLowerCase().includes(q);
      const matchFabric = c.fabric.toLowerCase().includes(q);
      const matchColors = c.designs.some(d => d.color.toLowerCase().includes(q));
      return matchName || matchCode || matchCat || matchFabric || matchColors;
    });
  }

  // Sorting
  if (state.sortBy === 'price-asc') {
    list.sort((a, b) => getActiveRate(a) - getActiveRate(b));
  } else if (state.sortBy === 'price-desc') {
    list.sort((a, b) => getActiveRate(b) - getActiveRate(a));
  } else if (state.sortBy === 'name-asc') {
    list.sort((a, b) => a.name.localeCompare(b.name));
  }

  state.filteredCatalogs = list;

  const countLabel = document.getElementById('catalogCountLabel');
  if (countLabel) countLabel.textContent = `Showing ${list.length} of ${state.catalogs.length} Catalogs`;

  const emptyState = document.getElementById('emptyState');
  const grid = document.getElementById('catalogGrid');

  if (list.length === 0) {
    if (emptyState) emptyState.classList.remove('hidden');
    if (grid) grid.innerHTML = '';
    return;
  } else {
    if (emptyState) emptyState.classList.add('hidden');
  }

  renderGrid(list);
  if (window.lucide) lucide.createIcons();
}

function renderGrid(catalogs) {
  const grid = document.getElementById('catalogGrid');
  if (!grid) return;

  grid.innerHTML = catalogs.map((cat, idx) => {
    const firstDesign = cat.designs[0] || {};
    const rate = getActiveRate(cat);
    const roleTag = getRoleTag();

    // Shoot badge calculation based on currentShoot
    let shootBadge = '🌟 All Shoots';
    let shootBadgeClass = 'badge-all';

    if (state.currentShoot === 'model') {
      shootBadge = '👗 Model Shoot';
      shootBadgeClass = 'badge-model';
    } else if (state.currentShoot === 'table') {
      shootBadge = '🪑 Table Shoot';
      shootBadgeClass = 'badge-table';
    }

    const displayImgUrl = firstDesign.heroImageUrl || cat.heroImageUrl || 'https://placehold.co/600x800/1e293b/d4af37?text=' + encodeURIComponent(cat.name);

    // Color Swatches with Tooltips (Requirement 5)
    const swatchesHtml = cat.designs.slice(0, 6).map((d, dIdx) => {
      const colorObj = getAccurateColor(d.color);
      const isSelected = dIdx === 0;
      return `
        <div class="swatch-wrapper">
          <span class="swatch-tooltip">Design ${d.code}: ${colorObj.label}</span>
          <button 
            type="button"
            onclick="event.stopPropagation(); switchCardDesign('${cat.code}', ${dIdx})"
            class="card-dot-${cat.code} w-4 h-4 rounded-full border-2 border-white shadow-xs inline-block transition-transform hover:scale-130 ${isSelected ? 'ring-2 ring-slate-900 scale-115' : 'opacity-85'}"
            style="background-color: ${colorObj.hex};"
          ></button>
        </div>
      `;
    }).join('');

    const moreColors = cat.designs.length > 6 ? `<span class="text-[10px] text-slate-400 font-bold">+${cat.designs.length - 6}</span>` : '';

    return `
      <div class="catalog-card bg-white rounded-3xl overflow-hidden border border-slate-200/90 flex flex-col group shadow-xs hover:shadow-xl transition-all">
        
        <!-- Media Frame: Clicking navigates to dedicated Shopify PDP -->
        <div onclick="navigateToProduct('${cat.code}')" class="relative aspect-[3/4] bg-slate-900 overflow-hidden cursor-pointer flex items-center justify-center">
          
          <img 
            id="card-hero-${cat.code}"
            src="${displayImgUrl}" 
            referrerpolicy="no-referrer"
            alt="${cat.name}" 
            loading="lazy" 
            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
            onerror="this.onerror=null; this.src='https://placehold.co/600x800/1e293b/d4af37?text=${encodeURIComponent(cat.name)}';"
          >

          <!-- Badges Floating -->
          <div class="absolute top-3.5 left-3.5 flex flex-col gap-1.5 items-start z-10 pointer-events-none">
            <span class="text-[10px] font-extrabold px-2.5 py-1 rounded-lg tracking-wide uppercase shadow-md ${shootBadgeClass}">
              ${shootBadge}
            </span>
            ${cat.hasVideo ? `
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-950/80 text-amber-300 backdrop-blur-md flex items-center gap-1 shadow-md border border-white/10">
                <span>📹</span> Reel Ready
              </span>
            ` : ''}
          </div>

          <!-- Quick Look Icon on Hover -->
          <div class="absolute inset-0 bg-slate-950/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
            <span class="px-4 py-2 bg-white/95 backdrop-blur-md rounded-xl text-xs font-bold text-slate-900 shadow-xl flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
              <span>View Product Details</span> ↗
            </span>
          </div>

        </div>

        <!-- Content Details Area -->
        <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
          
          <div class="space-y-1.5">
            <div class="flex items-center justify-between text-xs">
              <span class="font-extrabold uppercase tracking-wider text-slate-700 text-[10px] bg-slate-100 px-2 py-0.5 rounded">
                ${cat.code}
              </span>
              <span class="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> ${cat.status}
              </span>
            </div>

            <h3 onclick="navigateToProduct('${cat.code}')" class="font-serif text-lg font-bold text-slate-900 hover:text-slate-700 cursor-pointer transition-colors leading-tight">
              ${cat.name}
            </h3>

            <!-- Active Selected Design & Color -->
            <p id="card-design-${cat.code}" class="text-[11px] font-bold text-slate-700">
              Design ${firstDesign.code || '101'} — ${firstDesign.color || 'Color 1'}
            </p>

            <p class="text-xs text-slate-500 line-clamp-2 leading-relaxed">
              ${cat.fabric}
            </p>

            <!-- Color Swatches with Tooltips -->
            <div class="pt-1">
              <div class="flex items-center gap-2">
                ${swatchesHtml}
                ${moreColors}
              </div>
            </div>
          </div>

          <!-- Price & Quick Actions -->
          <div class="pt-3 border-t border-slate-100 space-y-3">
            <div class="flex items-baseline justify-between">
              <div>
                <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">${roleTag} Rate</span>
                <div class="flex items-baseline gap-1">
                  <span class="font-serif text-2xl font-extrabold text-slate-900">₹${rate}</span>
                  <span class="text-[11px] text-slate-400">/ pc</span>
                </div>
              </div>
              <span class="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded">
                ${cat.skuCount} Colors
              </span>
            </div>

            <div class="grid grid-cols-2 gap-2">
              <button onclick="navigateToProduct('${cat.code}')" class="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all text-center">
                Full Details
              </button>
              <button onclick="sendStaffWhatsApp('${cat.code}', '${firstDesign.color || 'All Colors'}', ${rate})" class="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all">
                <span>Inquire</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    `;
  }).join('');
}

// Switch design/color directly on card
function switchCardDesign(catCode, designIdx) {
  const cat = state.catalogs.find(c => c.code.toLowerCase() === catCode.toLowerCase());
  if (!cat || !cat.designs[designIdx]) return;

  const design = cat.designs[designIdx];
  const colorObj = getAccurateColor(design.color);

  // Update card hero image
  const imgEl = document.getElementById(`card-hero-${cat.code}`);
  if (imgEl && design.heroImageUrl) {
    imgEl.src = design.heroImageUrl;
  }

  // Update design label text
  const labelEl = document.getElementById(`card-design-${cat.code}`);
  if (labelEl) {
    labelEl.textContent = `Design ${design.code} — ${colorObj.label}`;
  }

  // Highlight active dot
  const dots = document.querySelectorAll(`.card-dot-${cat.code}`);
  dots.forEach((dot, idx) => {
    if (idx === designIdx) {
      dot.className = `card-dot-${cat.code} w-4 h-4 rounded-full border-2 border-white shadow-xs inline-block transition-transform scale-125 ring-2 ring-slate-900`;
    } else {
      dot.className = `card-dot-${cat.code} w-4 h-4 rounded-full border-2 border-white shadow-xs inline-block transition-transform hover:scale-125 opacity-85`;
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
  const staff = state.activeStaff || DEFAULT_STAFF[0];
  const rate = getActiveRate(cat);

  // Breadcrumbs
  document.getElementById('pdpBreadcrumbCategory').textContent = cat.category;
  document.getElementById('pdpBreadcrumbTitle').textContent = cat.name;

  // Title, Category & Specs
  document.getElementById('pdpCategoryTag').textContent = `${firm.name} • ${cat.category} Collection`;
  document.getElementById('pdpTitle').textContent = cat.name;
  document.getElementById('pdpCode').textContent = `SKU: ${cat.code}`;
  document.getElementById('pdpPrice').textContent = `₹${rate}`;
  
  const roleName = state.currentRole === 'wholesale' 
    ? 'Wholesale / Super Stockist Rate' 
    : state.currentRole === 'reseller' 
      ? 'Portal Seller / Reseller Rate' 
      : 'Retail / Catalog MRP';
  document.getElementById('pdpRoleName').textContent = roleName;

  document.getElementById('pdpFabric').textContent = cat.fabric;
  document.getElementById('pdpBorder').textContent = cat.border;
  document.getElementById('pdpPallu').textContent = cat.pallu;
  document.getElementById('pdpBlouse').textContent = cat.blouse;
  document.getElementById('pdpLength').textContent = cat.length;

  // Staff Assignment Card
  document.getElementById('pdpStaffName').textContent = staff.name;
  document.getElementById('pdpStaffFirm').textContent = `${firm.name} • ${staff.role}`;
  document.getElementById('pdpStaffCallBtn').href = `tel:+91${staff.phone}`;

  // Color Swatches with accurate colors & hover tooltips
  renderPdpColorSwatches();
  updatePdpGallery();
  updatePdpShootUI();
  renderRelatedCatalogs();

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

  // Thumbnails Strip for THIS selected color (e.g. 101, 102, 103, 104)
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
// 8. SECTION: RELATED CATALOGUES (YOU MAY ALSO LIKE) (Requirement 4)
// --------------------------------------------------------------------------
function renderRelatedCatalogs() {
  const cat = state.activePdpCatalog;
  if (!cat) return;

  const container = document.getElementById('pdpRelatedGrid');
  if (!container) return;

  // Find 4 other catalogs (prioritizing same category, excluding active catalog)
  let related = state.catalogs.filter(c => c.code !== cat.code && c.category === cat.category);
  if (related.length < 4) {
    const others = state.catalogs.filter(c => c.code !== cat.code && c.category !== cat.category);
    related = [...related, ...others];
  }
  related = related.slice(0, 4);

  container.innerHTML = related.map(item => {
    const firstD = item.designs[0] || {};
    const itemRate = getActiveRate(item);
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
            <span class="font-serif text-base font-extrabold text-slate-900">₹${itemRate}</span>
            <span class="text-[10px] text-emerald-600 font-bold">${item.status}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// --------------------------------------------------------------------------
// 9. DEDICATED STAFF WHATSAPP & CALL INQUIRIES (Requirement 2)
// --------------------------------------------------------------------------
function sendStaffWhatsApp(catalogCode, color, rate) {
  const firm = FIRMS[state.activeFirm] || FIRMS.saurashtra;
  const staff = state.activeStaff || DEFAULT_STAFF[0];

  const msg = encodeURIComponent(
    `Hello ${staff.name} (${firm.name}),\n` +
    `I am inquiring about this catalog:\n\n` +
    `🥻 Catalog: ${catalogCode}\n` +
    `🎨 Color/Design: ${color}\n` +
    `💰 Rate: ₹${rate}\n` +
    `View Mode: ${state.currentShoot.toUpperCase()}\n\n` +
    `Please share stock availability and dispatch schedule.`
  );
  window.open(`https://wa.me/${staff.whatsapp}?text=${msg}`, '_blank');
}

function sendPdpWhatsApp() {
  const cat = state.activePdpCatalog;
  if (!cat) return;
  const activeDesign = cat.designs[state.activePdpDesignIndex] || {};
  const colorObj = getAccurateColor(activeDesign.color);
  const rate = getActiveRate(cat);

  sendStaffWhatsApp(cat.code, `${colorObj.label} (Design ${activeDesign.code})`, rate);
}

function copyPdpSpecs() {
  const cat = state.activePdpCatalog;
  if (!cat) return;
  const firm = FIRMS[state.activeFirm] || FIRMS.saurashtra;
  const staff = state.activeStaff || DEFAULT_STAFF[0];
  const rate = getActiveRate(cat);

  const textToCopy = 
`🆕 PREMIUM SAREE CATALOG 🆕
Brand: ${firm.name}
Catalogue: ${cat.code} (${cat.category})
Price: ₹${rate}/- Only

Fabric Details:
• Fabric: ${cat.fabric}
• Border: ${cat.border}
• Pallu: ${cat.pallu}
• Blouse: ${cat.blouse}
• Length: ${cat.length}

Total Colors: ${cat.skuCount} Premium Colors
Status: ${cat.status}

Direct Inquiries & Booking:
📞 Representative: ${staff.name}
📱 WhatsApp / Call: +91 ${staff.phone}
Powered by ${firm.name}`;

  navigator.clipboard.writeText(textToCopy).then(() => {
    showToast(`Specs copied for ${staff.name}'s desk!`);
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
