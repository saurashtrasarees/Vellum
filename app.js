// ==========================================================================
// VELLUM — Luxury Digital Textile Showroom Engine
// Developed for BinduGrid Studio
// ==========================================================================

const CONFIG = {
  sheetId: '1O-F9nVgPdkamtTGDesEcde8PCZSK7pyjUJDi8PrwmaY',
  sheetUrl: 'https://docs.google.com/spreadsheets/d/1O-F9nVgPdkamtTGDesEcde8PCZSK7pyjUJDi8PrwmaY/gviz/tq?tqx=out:csv&sheet=Catalogs%20%26%20Pricing',
  whatsappPrimary: '919879471039',
  whatsappSecondary: '919913643433',
  defaultKeys: {
    wholesale: 'prime',
    reseller: 'seller'
  }
};

// Global App State
const state = {
  catalogs: [],
  filteredCatalogs: [],
  selectedCategory: 'all',
  searchQuery: '',
  sortBy: 'newest',
  currentRole: 'retail', // 'wholesale', 'reseller', 'retail'
  currentShoot: 'model', // 'model', 'table'
  activeModalCatalog: null,
  activeModalDesignIndex: 0,
  activeModalShoot: 'model',
  activeModalImageIndex: 0
};

// Initialize Application
document.addEventListener('DOMContentLoaded', async () => {
  resolveRoleFromUrl();
  await loadCatalogData();
  renderCategoryPills();
  applyFiltersAndRender();
});

// --------------------------------------------------------------------------
// 1. Role & Secret Key Resolution (Tactic 1: Obfuscated Keys)
// --------------------------------------------------------------------------
function resolveRoleFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const key = (params.get('k') || params.get('key') || params.get('ref') || '').toLowerCase().trim();
  const shoot = (params.get('shoot') || '').toLowerCase().trim();

  if (shoot === 'table') {
    state.currentShoot = 'table';
  } else {
    state.currentShoot = 'model';
  }

  // Key matching
  if (key === CONFIG.defaultKeys.wholesale || key === 'wholesale' || key === 'dealer' || key === 'bulk') {
    state.currentRole = 'wholesale';
  } else if (key === CONFIG.defaultKeys.reseller || key === 'seller' || key === 'portal' || key === 'reseller') {
    state.currentRole = 'reseller';
  } else {
    // If no key or invalid key is provided -> Safe Fallback to Retail / MRP
    state.currentRole = 'retail';
  }

  updateRoleUI();
  updateShootUI();
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

function updateShootUI() {
  const btnModel = document.getElementById('btnShootModel');
  const btnTable = document.getElementById('btnShootTable');
  const mobileBtnModel = document.getElementById('mobileBtnModel');
  const mobileBtnTable = document.getElementById('mobileBtnTable');
  const badgeShoot = document.getElementById('badgeShootActive');

  const isModel = state.currentShoot === 'model';

  if (btnModel && btnTable) {
    btnModel.className = isModel 
      ? 'flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm bg-white text-brand-maroon'
      : 'flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 transition-all';
    
    btnTable.className = !isModel 
      ? 'flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm bg-white text-brand-maroon'
      : 'flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 transition-all';
  }

  if (mobileBtnModel && mobileBtnTable) {
    mobileBtnModel.className = isModel
      ? 'flex-1 py-1.5 rounded-lg text-xs font-bold bg-white text-brand-maroon shadow-sm text-center'
      : 'flex-1 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 text-center';

    mobileBtnTable.className = !isModel
      ? 'flex-1 py-1.5 rounded-lg text-xs font-bold bg-white text-brand-maroon shadow-sm text-center'
      : 'flex-1 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 text-center';
  }

  if (badgeShoot) {
    badgeShoot.textContent = isModel ? 'Model Shoot (Draped)' : 'Table Shoot (Flat Lay Detail)';
  }
}

function setShootType(type) {
  state.currentShoot = type;
  updateShootUI();
  applyFiltersAndRender();
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
}

// --------------------------------------------------------------------------
// 2. Data Loading (Google Sheet Live Sync + Local Fallback)
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

  // Live Google Sheet sync for dynamic rates
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
// 3. Category Filter Pills
// --------------------------------------------------------------------------
function renderCategoryPills() {
  const container = document.getElementById('categoryPills');
  if (!container) return;

  const categories = ['All Collections', ...new Set(state.catalogs.map(c => c.category))];

  container.innerHTML = categories.map(cat => {
    const val = cat === 'All Collections' ? 'all' : cat;
    const isActive = state.selectedCategory === val;
    const activeClass = isActive 
      ? 'bg-brand-maroon text-white font-bold shadow-sm'
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

// --------------------------------------------------------------------------
// 4. Filtering, Sorting & Card Rendering
// --------------------------------------------------------------------------
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

function renderGrid(catalogs) {
  const grid = document.getElementById('catalogGrid');
  if (!grid) return;

  grid.innerHTML = catalogs.map((cat, idx) => {
    const firstDesign = cat.designs[0] || {};
    const rate = getActiveRate(cat);
    const roleTag = getRoleTag();
    const isModel = state.currentShoot === 'model';
    const shootBadge = isModel ? '👗 Model Shoot' : '🪑 Table Shoot';
    const shootBadgeClass = isModel ? 'badge-model' : 'badge-table';

    // Hero image logic: use real Google Drive photo if available
    const displayImgUrl = firstDesign.heroImageUrl || cat.heroImageUrl;
    const hasRealImg = !!displayImgUrl;

    // Color swatches (first 5 dots)
    const swatchesHtml = cat.designs.slice(0, 5).map((d, dIdx) => {
      const colorBg = getColorHex(d.color);
      return `
        <span 
          title="${d.color} (Design ${d.code})"
          class="w-3.5 h-3.5 rounded-full border border-slate-300 shadow-xs inline-block hover:scale-125 transition-transform"
          style="background-color: ${colorBg};"
        ></span>
      `;
    }).join('');

    const moreColors = cat.designs.length > 5 ? `<span class="text-[10px] text-slate-400 font-bold">+${cat.designs.length - 5}</span>` : '';

    return `
      <div class="catalog-card bg-white rounded-3xl overflow-hidden border border-slate-200/90 flex flex-col group shadow-sm hover:shadow-xl transition-all">
        
        <!-- Media Visual Frame -->
        <div onclick="openProductModal('${cat.code}')" class="relative aspect-[3/4] bg-slate-900 overflow-hidden cursor-pointer flex items-center justify-center">
          
          ${hasRealImg ? `
            <img 
              src="${displayImgUrl}" 
              alt="${cat.name}" 
              loading="lazy" 
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
              onerror="this.onerror=null; this.src='https://placehold.co/600x800/2c0d16/d4af37?text=${encodeURIComponent(cat.name)}';"
            >
          ` : `
            <div class="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-brand-maroondark to-brand-maroon text-white transition-transform duration-500 group-hover:scale-105">
              <div class="w-14 h-14 rounded-2xl bg-amber-400/20 backdrop-blur-md flex items-center justify-center text-amber-300 mb-3 border border-amber-300/30">
                <span class="font-serif text-2xl font-bold">${cat.name.charAt(0)}</span>
              </div>
              <p class="font-serif font-bold text-white text-lg leading-snug">${cat.name}</p>
              <p class="text-xs text-amber-200 font-medium mt-1">${cat.category}</p>
              <p class="text-[11px] text-slate-300 mt-2">${firstDesign.color || 'Multi-Color'} • ${firstDesign.images ? firstDesign.images.length : 4} Drapes</p>
            </div>
          `}

          <!-- Badges Floating -->
          <div class="absolute top-3.5 left-3.5 flex flex-col gap-1.5 items-start z-10">
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
          <div class="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span class="px-4 py-2 bg-white/95 backdrop-blur-md rounded-xl text-xs font-bold text-slate-900 shadow-xl flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
              <span>Open Lookbook</span> ↗
            </span>
          </div>

        </div>

        <!-- Content Area -->
        <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
          
          <div class="space-y-2">
            <div class="flex items-center justify-between text-xs">
              <span class="font-extrabold uppercase tracking-wider text-brand-maroon text-[10px] bg-brand-maroonlight px-2 py-0.5 rounded">
                ${cat.code}
              </span>
              <span class="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> ${cat.status}
              </span>
            </div>

            <h3 onclick="openProductModal('${cat.code}')" class="font-serif text-lg font-bold text-slate-900 hover:text-brand-maroon cursor-pointer transition-colors leading-tight">
              ${cat.name}
            </h3>

            <p class="text-xs text-slate-500 line-clamp-2 leading-relaxed">
              ${cat.fabric}
            </p>

            <!-- Color Swatches Row -->
            <div class="flex items-center gap-1.5 pt-1">
              ${swatchesHtml}
              ${moreColors}
            </div>
          </div>

          <!-- Price & Actions Footer -->
          <div class="pt-3 border-t border-slate-100 space-y-3">
            <div class="flex items-baseline justify-between">
              <div>
                <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">${roleTag} Rate</span>
                <div class="flex items-baseline gap-1">
                  <span class="font-serif text-2xl font-extrabold text-slate-900">₹${rate}</span>
                  <span class="text-[11px] text-slate-400">/ pc</span>
                </div>
              </div>
              <span class="text-[10px] font-bold px-2 py-0.5 bg-amber-50 text-amber-900 border border-amber-200/60 rounded">
                ${cat.skuCount} Designs
              </span>
            </div>

            <div class="grid grid-cols-2 gap-2">
              <button onclick="openProductModal('${cat.code}')" class="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all text-center">
                Lookbook
              </button>
              <button onclick="quickWhatsApp('${cat.code}', '${firstDesign.color || 'All Colors'}', ${rate})" class="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all">
                <span>Inquire</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    `;
  }).join('');
}

// Helper: Color to CSS Hex Map
function getColorHex(colorName) {
  if (!colorName) return '#e2e8f0';
  const c = colorName.toLowerCase();
  if (c.includes('red')) return '#dc2626';
  if (c.includes('wine')) return '#881337';
  if (c.includes('maroon')) return '#800000';
  if (c.includes('blue') || c.includes('navy')) return '#1e40af';
  if (c.includes('sky')) return '#38bdf8';
  if (c.includes('pink') || c.includes('magenta')) return '#db2777';
  if (c.includes('yellow') || c.includes('gold')) return '#eab308';
  if (c.includes('green') || c.includes('pista')) return '#16a34a';
  if (c.includes('teal') || c.includes('rama')) return '#0d9488';
  if (c.includes('purple') || c.includes('lavender')) return '#7c3aed';
  if (c.includes('orange') || c.includes('peach')) return '#ea580c';
  if (c.includes('grey') || c.includes('gray')) return '#64748b';
  if (c.includes('black')) return '#0f172a';
  if (c.includes('beige') || c.includes('chiku')) return '#d4a373';
  return '#cbd5e1';
}

// --------------------------------------------------------------------------
// 5. Lookbook Detail Modal
// --------------------------------------------------------------------------
function openProductModal(catalogCode) {
  const cat = state.catalogs.find(c => c.code.toLowerCase() === catalogCode.toLowerCase());
  if (!cat) return;

  state.activeModalCatalog = cat;
  state.activeModalDesignIndex = 0;
  state.activeModalShoot = state.currentShoot;
  state.activeModalImageIndex = 0;

  // Header
  document.getElementById('modalCatalogCode').textContent = cat.code;
  document.getElementById('modalCategory').textContent = `${cat.category} Collection`;
  document.getElementById('modalTitle').textContent = cat.name;

  // Specs
  document.getElementById('modalFabric').textContent = cat.fabric;
  document.getElementById('modalBorder').textContent = cat.border;
  document.getElementById('modalPallu').textContent = cat.pallu;
  document.getElementById('modalBlouse').textContent = cat.blouse;
  document.getElementById('modalLength').textContent = cat.length;

  updateModalShootUI();
  updateModalPriceUI();
  renderModalColorSwatches();
  updateModalGallery();

  const modal = document.getElementById('productModal');
  if (modal) modal.classList.remove('hidden');
  document.body.classList.add('overflow-hidden');
  if (window.lucide) lucide.createIcons();
}

function closeProductModal() {
  const modal = document.getElementById('productModal');
  if (modal) modal.classList.add('hidden');
  document.body.classList.remove('overflow-hidden');
}

function setModalShoot(shootType) {
  state.activeModalShoot = shootType;
  updateModalShootUI();
  updateModalGallery();
}

function updateModalShootUI() {
  const btnModel = document.getElementById('modalBtnModel');
  const btnTable = document.getElementById('modalBtnTable');
  const badge = document.getElementById('modalShootBadge');
  const indicator = document.getElementById('modalShootIndicator');

  const isModel = state.activeModalShoot === 'model';

  if (btnModel && btnTable) {
    btnModel.className = isModel
      ? 'flex-1 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm bg-white text-brand-maroon'
      : 'flex-1 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 transition-all';

    btnTable.className = !isModel
      ? 'flex-1 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm bg-white text-brand-maroon'
      : 'flex-1 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 transition-all';
  }

  if (badge) {
    badge.textContent = isModel ? 'Model Shoot' : 'Table Shoot';
    badge.className = isModel ? 'text-xs px-2 py-0.5 rounded-md font-bold badge-model' : 'text-xs px-2 py-0.5 rounded-md font-bold badge-table';
  }

  if (indicator) {
    indicator.textContent = isModel ? 'Model Drape Angle' : 'Flat Lay Fabric & Pallu Angle';
  }
}

function updateModalPriceUI() {
  if (!state.activeModalCatalog) return;
  const rate = getActiveRate(state.activeModalCatalog);
  const roleName = state.currentRole === 'wholesale' 
    ? 'Wholesale / Super Stockist Rate' 
    : state.currentRole === 'reseller' 
      ? 'Portal Seller / Reseller Rate' 
      : 'Retail / Catalog MRP';

  document.getElementById('modalPrice').textContent = `₹${rate}`;
  document.getElementById('modalRoleName').textContent = roleName;
}

function renderModalColorSwatches() {
  const cat = state.activeModalCatalog;
  if (!cat) return;

  const container = document.getElementById('modalColorSwatches');
  if (!container) return;

  container.innerHTML = cat.designs.map((d, idx) => {
    const isSelected = idx === state.activeModalDesignIndex;
    const bgHex = getColorHex(d.color);
    const activeClass = isSelected ? 'ring-2 ring-offset-2 ring-brand-maroon scale-110 shadow-md' : 'opacity-80 hover:opacity-100';

    return `
      <button 
        onclick="selectModalDesign(${idx})" 
        title="${d.color} (Design ${d.code})"
        class="w-7 h-7 rounded-full border border-slate-300 shadow-sm transition-all ${activeClass}"
        style="background-color: ${bgHex};"
      ></button>
    `;
  }).join('');

  const activeDesign = cat.designs[state.activeModalDesignIndex] || {};
  document.getElementById('modalSelectedColor').textContent = `${activeDesign.color || 'Color'} (Design ${activeDesign.code || '101'})`;
}

function selectModalDesign(idx) {
  state.activeModalDesignIndex = idx;
  state.activeModalImageIndex = 0;
  renderModalColorSwatches();
  updateModalGallery();
}

function updateModalGallery() {
  const cat = state.activeModalCatalog;
  if (!cat) return;

  const activeDesign = cat.designs[state.activeModalDesignIndex] || {};
  const isModel = state.activeModalShoot === 'model';
  
  // Real Drive image URLs
  const realUrls = activeDesign.imageUrls && activeDesign.imageUrls.length > 0 
    ? activeDesign.imageUrls 
    : [activeDesign.heroImageUrl || cat.heroImageUrl];

  const currentImgUrl = realUrls[state.activeModalImageIndex] || realUrls[0];

  // Hero frame
  const heroImg = document.getElementById('modalHeroImage');
  if (heroImg) {
    if (currentImgUrl) {
      heroImg.src = currentImgUrl;
    } else {
      heroImg.src = `https://placehold.co/600x800/2c0d16/d4af37?text=${encodeURIComponent(cat.name)}+${activeDesign.color || ''}`;
    }
  }

  // Video button
  const videoBtn = document.getElementById('modalVideoBtn');
  if (videoBtn) {
    if (activeDesign.video || cat.hasVideo || cat.videoUrl) {
      videoBtn.classList.remove('hidden');
    } else {
      videoBtn.classList.add('hidden');
    }
  }

  // Thumbnails Strip
  const thumbStrip = document.getElementById('modalThumbStrip');
  if (thumbStrip) {
    thumbStrip.innerHTML = realUrls.map((imgUrl, i) => {
      const isSelected = i === state.activeModalImageIndex;
      const borderClass = isSelected ? 'border-brand-maroon ring-2 ring-brand-maroon/30 scale-105' : 'border-slate-200 opacity-70 hover:opacity-100';
      const angleLabel = i === 0 ? 'Front' : i === 1 ? 'Pallu' : i === 2 ? 'Border' : i === 3 ? 'Drape' : 'Blouse';

      return `
        <div onclick="selectModalAngle(${i})" class="flex-shrink-0 w-16 h-20 rounded-xl overflow-hidden cursor-pointer border-2 transition-all relative group bg-slate-900 ${borderClass}">
          ${imgUrl ? `
            <img src="${imgUrl}" alt="Angle ${i+1}" class="w-full h-full object-cover">
          ` : `
            <div class="w-full h-full flex items-center justify-center text-[10px] text-white font-bold bg-slate-800">
              Angle ${i+1}
            </div>
          `}
          <span class="absolute bottom-1 left-1 right-1 bg-black/70 backdrop-blur-xs text-[9px] text-white font-bold text-center rounded py-0.5">
            ${angleLabel}
          </span>
        </div>
      `;
    }).join('');
  }
}

function selectModalAngle(angleIndex) {
  state.activeModalImageIndex = angleIndex;
  updateModalGallery();
}

// --------------------------------------------------------------------------
// 6. Video Reel Player
// --------------------------------------------------------------------------
function playModalVideo() {
  const cat = state.activeModalCatalog;
  if (!cat) return;
  const activeDesign = cat.designs[state.activeModalDesignIndex] || {};
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

// --------------------------------------------------------------------------
// 7. WhatsApp & Inquiry Actions
// --------------------------------------------------------------------------
function quickWhatsApp(catalogCode, color, rate) {
  const msg = encodeURIComponent(
    `Hello BinduGrid Studio / Saurashtra Sarees,\n` +
    `I am inquiring about:\n\n` +
    `🥻 Catalog: ${catalogCode}\n` +
    `🎨 Color: ${color}\n` +
    `💰 Rate: ₹${rate}\n` +
    `Shoot View: ${state.currentShoot === 'model' ? 'Model Shoot' : 'Table Shoot'}\n\n` +
    `Please share stock availability and dispatch schedule.`
  );
  window.open(`https://wa.me/${CONFIG.whatsappPrimary}?text=${msg}`, '_blank');
}

function sendWhatsAppInquiry() {
  const cat = state.activeModalCatalog;
  if (!cat) return;
  const activeDesign = cat.designs[state.activeModalDesignIndex] || {};
  const rate = getActiveRate(cat);

  quickWhatsApp(cat.code, `${activeDesign.color} (Design ${activeDesign.code})`, rate);
}

function copyCatalogCopy() {
  const cat = state.activeModalCatalog;
  if (!cat) return;
  const rate = getActiveRate(cat);

  const textToCopy = 
`🆕 PREMIUM SAREE CATALOG 🆕
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
📞 Call / WhatsApp: +91 9879471039 / +91 9913643433
Powered by BinduGrid Studio`;

  navigator.clipboard.writeText(textToCopy).then(() => {
    showToast('Catalog specs copied for WhatsApp groups!');
  });
}

function copyShareLink() {
  let url = window.location.origin + window.location.pathname;
  if (state.currentRole === 'wholesale') {
    url += `?k=${CONFIG.defaultKeys.wholesale}`;
  } else if (state.currentRole === 'reseller') {
    url += `?k=${CONFIG.defaultKeys.reseller}`;
  }
  if (state.currentShoot === 'table') {
    url += (url.includes('?') ? '&' : '?') + 'shoot=table';
  }

  navigator.clipboard.writeText(url).then(() => {
    showToast(`Smart Link copied for ${state.currentRole.toUpperCase()}!`);
  });
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
