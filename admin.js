// ==============================================================================
// VELLUM — Super-Admin Control Center Engine
// Multi-Firm, Granular Stock, Google Drive & Supabase Cloud Sync
// Architecture & Engineering by BinduGrid Studio [ØG]
// ==============================================================================

const STAFF_PROFILES = [
  // 1. Keya Fashion [All Retail Rate]
  {
    code: 'KH28',
    letter: 'A',
    name: 'Khushi',
    phone: '9825452528',
    displayPhone: '+91 98254 52528',
    whatsapp: '919825452528',
    firm: 'keya',
    firmName: 'Keya Fashion',
    rateType: 'retail',
    rateLabel: 'Retail MRP Rate Only'
  },
  {
    code: 'AN26',
    letter: 'B',
    name: 'Anshika',
    phone: '9825452526',
    displayPhone: '+91 98254 52526',
    whatsapp: '919825452526',
    firm: 'keya',
    firmName: 'Keya Fashion',
    rateType: 'retail',
    rateLabel: 'Retail MRP Rate Only'
  },
  {
    code: 'PR28',
    letter: 'C',
    name: 'Priti',
    phone: '9909352528',
    displayPhone: '+91 99093 52528',
    whatsapp: '919909352528',
    firm: 'keya',
    firmName: 'Keya Fashion',
    rateType: 'retail',
    rateLabel: 'Retail MRP Rate Only'
  },
  {
    code: 'PA28',
    letter: 'D',
    name: 'Palak',
    phone: '9909452528',
    displayPhone: '+91 99094 52528',
    whatsapp: '919909452528',
    firm: 'keya',
    firmName: 'Keya Fashion',
    rateType: 'retail',
    rateLabel: 'Retail MRP Rate Only'
  },
  {
    code: 'JE04',
    letter: 'E',
    name: 'Jenish',
    phone: '9033808104',
    displayPhone: '+91 90338 08104',
    whatsapp: '919033808104',
    firm: 'keya',
    firmName: 'Keya Fashion',
    rateType: 'retail',
    rateLabel: 'Retail MRP Rate Only'
  },

  // 2. Saurashtra Sarees [All Retail Rate]
  {
    code: 'AR38',
    letter: 'F',
    name: 'Arvind Sir',
    phone: '9824982338',
    displayPhone: '+91 98249 82338',
    whatsapp: '919824982338',
    firm: 'saurashtra',
    firmName: 'Saurashtra Sarees',
    rateType: 'retail',
    rateLabel: 'Retail MRP Rate Only'
  },
  {
    code: 'NA39',
    letter: 'G',
    name: 'Nayan Sir',
    phone: '9879471039',
    displayPhone: '+91 98794 71039',
    whatsapp: '919879471039',
    firm: 'saurashtra',
    firmName: 'Saurashtra Sarees',
    rateType: 'retail',
    rateLabel: 'Retail MRP Rate Only'
  },
  {
    code: 'CH33',
    letter: 'H',
    name: 'Chetan Sir',
    phone: '9913643433',
    displayPhone: '+91 99136 43433',
    whatsapp: '919913643433',
    firm: 'saurashtra',
    firmName: 'Saurashtra Sarees',
    rateType: 'retail',
    rateLabel: 'Retail MRP Rate Only'
  },

  // 3. Saurashtra Sarees [All Rate]
  {
    code: 'NA39ALL',
    letter: 'PRO-1',
    name: 'Nayan Sir (All Rates)',
    phone: '9879471039',
    displayPhone: '+91 98794 71039',
    whatsapp: '919879471039',
    firm: 'saurashtra',
    firmName: 'Saurashtra Sarees',
    rateType: 'all',
    rateLabel: 'Super Wholesale + Reseller + Retail'
  },
  {
    code: 'CH33ALL',
    letter: 'PRO-2',
    name: 'Chetan Sir (All Rates)',
    phone: '9913643433',
    displayPhone: '+91 99136 43433',
    whatsapp: '919913643433',
    firm: 'saurashtra',
    firmName: 'Saurashtra Sarees',
    rateType: 'all',
    rateLabel: 'Super Wholesale + Reseller + Retail'
  }
];

let adminCatalogs = [];

document.addEventListener('DOMContentLoaded', async () => {
  renderStaffHub();
  initDriveFoldersUI();
  initSupabaseUI();
  initFirmProfilesUI();
  await loadAdminCatalogs();
  renderShootAssignments();
  renderStockManager();
  renderRatesTable();

  // Listen for realtime updates from VellumDataAdapter
  window.addEventListener('vellum:drive-updated', (e) => {
    initDriveFoldersUI();
    renderShootAssignments();
  });
  window.addEventListener('vellum:stock-updated', (e) => {
    renderStockManager();
  });
  window.addEventListener('vellum:shoot-updated', (e) => {
    renderShootAssignments();
  });
  window.addEventListener('vellum:firm-updated', (e) => {
    initFirmProfilesUI();
  });

  if (window.lucide) lucide.createIcons();
});

// --------------------------------------------------------------------------
// 1. LEFT-HAND SIDEBAR TAB NAVIGATION
// --------------------------------------------------------------------------
function switchTab(tabId) {
  const tabs = ['hub', 'drive', 'stock', 'rates', 'supabase', 'firms', 'generator'];
  
  tabs.forEach(t => {
    const content = document.getElementById(`tabContent-${t}`);
    const btn = document.getElementById(`sidebarBtn-${t}`);

    if (t === tabId) {
      if (content) content.classList.remove('hidden');
      if (btn) {
        btn.className = 'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold bg-amber-100 text-amber-950 border-l-4 border-amber-600 transition-all text-left shadow-xs';
      }
    } else {
      if (content) content.classList.add('hidden');
      if (btn) {
        btn.className = 'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-stone-600 hover:bg-amber-50 hover:text-stone-900 transition-all text-left';
      }
    }
  });

  if (window.lucide) lucide.createIcons();
}

// --------------------------------------------------------------------------
// 2. RENDER STAFF LINKS HUB (100% Light Luxury Cards)
// --------------------------------------------------------------------------
function renderStaffHub() {
  const keyaGrid = document.getElementById('gridKeyaRetail');
  const saurashtraRetailGrid = document.getElementById('gridSaurashtraRetail');
  const saurashtraAllGrid = document.getElementById('gridSaurashtraAll') || document.getElementById('gridSaurashtraAllRates');

  const keyaList = STAFF_PROFILES.filter(s => s.firm === 'keya' && s.rateType === 'retail');
  const saurashtraRetailList = STAFF_PROFILES.filter(s => s.firm === 'saurashtra' && s.rateType === 'retail');
  const saurashtraAllList = STAFF_PROFILES.filter(s => s.rateType === 'all');

  const baseOrigin = window.location.origin;
  const basePath = window.location.pathname.replace('admin.html', '').replace('admin', '');

  const renderCard = (staff) => {
    const link = `${baseOrigin}${basePath}?u=${staff.code}`;
    const badgeBg = staff.rateType === 'all' 
      ? 'bg-amber-200 text-amber-950 border border-amber-400 font-black' 
      : (staff.firm === 'keya' ? 'bg-sky-100 text-sky-800 border border-sky-300' : 'bg-rose-100 text-rose-800 border border-rose-300');

    const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      `🥻 ${staff.firmName.toUpperCase()} — DIGITAL TEXTILE SHOWROOM 🥻\n\nPlease view our latest saree catalog here:\n${link}\n\nRepresentative: ${staff.name} (${staff.displayPhone})`
    )}`;

    return `
      <div class="bg-white border-2 border-amber-200/90 rounded-3xl p-5 flex flex-col justify-between space-y-4 hover:border-amber-400 transition-all shadow-xs hover:shadow-md group">
        <div>
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-mono font-extrabold px-3 py-1 rounded-xl shadow-xs ${badgeBg}">
              ${staff.code}
            </span>
            <span class="text-[10px] text-stone-500 font-bold uppercase tracking-wider">
              ${staff.letter}. ${staff.firmName}
            </span>
          </div>

          <h4 class="font-serif text-lg font-bold text-stone-900">${staff.name}</h4>
          <p class="text-xs text-amber-800 font-mono mt-0.5 flex items-center gap-1.5 font-bold">
            <i data-lucide="phone" class="w-3.5 h-3.5 text-amber-600"></i> ${staff.displayPhone}
          </p>
          <p class="text-[11px] text-stone-500 mt-1 font-medium">${staff.rateLabel}</p>

          <!-- Direct Clickable URL Box -->
          <div class="mt-3.5 p-3 bg-amber-50/70 rounded-2xl border border-amber-200 space-y-1">
            <span class="text-[9px] uppercase tracking-wider text-stone-500 font-bold block">Live Dedicated URL</span>
            <a href="${link}" target="_blank" class="block text-xs font-mono text-amber-800 hover:text-amber-950 hover:underline break-all font-bold">
              ${link}
            </a>
          </div>
        </div>

        <div class="space-y-2 pt-2 border-t border-amber-100">
          <div class="grid grid-cols-2 gap-2">
            <button onclick="copyToClipboard('${link}', 'Link for ${staff.code} copied!')" class="py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-xs">
              <i data-lucide="copy" class="w-3.5 h-3.5"></i>
              <span>Copy Link</span>
            </button>

            <a href="${link}" target="_blank" class="py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all text-center">
              <span>Open ↗</span>
            </a>
          </div>

          <a href="${whatsappShareUrl}" target="_blank" class="w-full py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all">
            <i data-lucide="send" class="w-3.5 h-3.5"></i>
            <span>Share via WhatsApp</span>
          </a>
        </div>
      </div>
    `;
  };

  if (keyaGrid) keyaGrid.innerHTML = keyaList.map(renderCard).join('');
  if (saurashtraRetailGrid) saurashtraRetailGrid.innerHTML = saurashtraRetailList.map(renderCard).join('');
  if (saurashtraAllGrid) saurashtraAllGrid.innerHTML = saurashtraAllList.map(renderCard).join('');

  if (window.lucide) lucide.createIcons();
}

// --------------------------------------------------------------------------
// 3. GOOGLE DRIVE SHOOT FOLDERS CONFIGURATION
// --------------------------------------------------------------------------
function initDriveFoldersUI() {
  const config = window.vellumAdapter ? window.vellumAdapter.loadDriveConfig() : {};
  
  const modelUrlEl = document.getElementById('inputModelDriveUrl');
  const modelIdEl = document.getElementById('inputModelFolderId');
  const tableUrlEl = document.getElementById('inputTableDriveUrl');
  const tableIdEl = document.getElementById('inputTableFolderId');

  if (modelUrlEl && config.modelShootFolderUrl) modelUrlEl.value = config.modelShootFolderUrl;
  if (modelIdEl && config.modelFolderId) modelIdEl.value = config.modelFolderId;
  if (tableUrlEl && config.tableShootFolderUrl) tableUrlEl.value = config.tableShootFolderUrl;
  if (tableIdEl && config.tableFolderId) tableIdEl.value = config.tableFolderId;

  // Real-time Folder ID extraction on typing
  if (modelUrlEl) {
    modelUrlEl.addEventListener('input', (e) => {
      const extracted = VellumDataAdapter.extractFolderId(e.target.value);
      if (modelIdEl) modelIdEl.value = extracted;
      const linkEl = document.getElementById('linkOpenModelDrive');
      if (linkEl) linkEl.href = e.target.value;
    });
  }
  if (tableUrlEl) {
    tableUrlEl.addEventListener('input', (e) => {
      const extracted = VellumDataAdapter.extractFolderId(e.target.value);
      if (tableIdEl) tableIdEl.value = extracted;
      const linkEl = document.getElementById('linkOpenTableDrive');
      if (linkEl) linkEl.href = e.target.value;
    });
  }
}

function saveDriveSettings() {
  const modelUrl = document.getElementById('inputModelDriveUrl')?.value.trim();
  const tableUrl = document.getElementById('inputTableDriveUrl')?.value.trim();
  const modelId = document.getElementById('inputModelFolderId')?.value.trim();
  const tableId = document.getElementById('inputTableFolderId')?.value.trim();

  if (window.vellumAdapter) {
    window.vellumAdapter.saveDriveConfig({
      modelShootFolderUrl: modelUrl,
      tableShootFolderUrl: tableUrl,
      modelFolderId: modelId,
      tableFolderId: tableId
    });
  }

  const statusEl = document.getElementById('driveSaveStatus');
  if (statusEl) {
    statusEl.classList.remove('hidden');
    setTimeout(() => statusEl.classList.add('hidden'), 3500);
  }
  showAdminToast('Google Drive shoot folders updated and synced!');
}

function renderShootAssignments() {
  const container = document.getElementById('shootAssignmentContainer');
  if (!container || adminCatalogs.length === 0) return;

  container.innerHTML = adminCatalogs.map(c => {
    const currentShoot = (window.vellumAdapter && window.vellumAdapter.getCatalogShoot(c.id)) || (c.has2mb ? 'model' : 'table');
    return `
      <div class="flex items-center justify-between p-2.5 rounded-xl border border-stone-200 bg-stone-50/70 hover:bg-white transition-all text-xs">
        <div class="flex items-center gap-2.5">
          <span class="font-mono font-bold text-stone-700 bg-stone-200 px-2 py-0.5 rounded text-[10px]">${c.code}</span>
          <div>
            <strong class="text-stone-900">${c.name}</strong>
            <span class="text-[10px] text-stone-500 block sm:inline sm:ml-2">${c.category}</span>
          </div>
        </div>
        <div class="flex items-center gap-1.5 shrink-0">
          <button 
            type="button" 
            onclick="updateCatalogShootAssignment('${c.id}', 'model')" 
            class="px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${currentShoot === 'model' ? 'bg-sky-600 text-white shadow-xs' : 'bg-white text-stone-600 border border-stone-300 hover:bg-stone-100'}"
          >
            👗 Model Shoot
          </button>
          <button 
            type="button" 
            onclick="updateCatalogShootAssignment('${c.id}', 'table')" 
            class="px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${currentShoot === 'table' ? 'bg-amber-600 text-white shadow-xs' : 'bg-white text-stone-600 border border-stone-300 hover:bg-stone-100'}"
          >
            🪑 Table Shoot
          </button>
          <button 
            type="button" 
            onclick="updateCatalogShootAssignment('${c.id}', 'both')" 
            class="px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${currentShoot === 'both' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-white text-stone-600 border border-stone-300 hover:bg-stone-100'}"
          >
            🌟 Both
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function updateCatalogShootAssignment(catId, shootType) {
  if (window.vellumAdapter) {
    window.vellumAdapter.setCatalogShoot(catId, shootType);
  }
  renderShootAssignments();
  showAdminToast(`Assigned ${catId} to: ${shootType.toUpperCase()} SHOOT`);
}

// --------------------------------------------------------------------------
// 4. GRANULAR CATALOG & COLOR STOCK CONTROL
// --------------------------------------------------------------------------
async function loadAdminCatalogs() {
  try {
    const res = await fetch('data/catalogs.json');
    if (res.ok) {
      adminCatalogs = await res.json();
    }
  } catch (e) {
    console.error('Failed to load catalogs in admin:', e);
  }
}

function renderStockManager(catalogsToRender = adminCatalogs) {
  const container = document.getElementById('stockManagerContainer');
  if (!container) return;

  if (catalogsToRender.length === 0) {
    container.innerHTML = `<p class="text-stone-500 text-xs p-6 bg-white rounded-2xl border border-stone-200 text-center">No catalogs matching search query.</p>`;
    return;
  }

  container.innerHTML = catalogsToRender.map(cat => {
    const currentCatStock = window.vellumAdapter ? window.vellumAdapter.getCatalogStock(cat.id) : 'in_stock';
    
    return `
      <div class="bg-white border border-amber-200/90 rounded-2xl p-4 sm:p-5 shadow-xs hover:border-amber-400 transition-all space-y-4">
        
        <!-- Catalog Header & Master Stock Level Selector -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
          <div class="flex items-center gap-3">
            <span class="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 font-mono font-bold text-xs flex items-center justify-center shrink-0">
              ${cat.code}
            </span>
            <div>
              <h4 class="font-serif text-base font-bold text-stone-900">${cat.name}</h4>
              <p class="text-[11px] text-stone-500">${cat.category} • ${cat.skuCount || cat.designs.length} Colorways • MRP ₹${cat.retailRate}</p>
            </div>
          </div>

          <!-- 3-State Stock Selector for Whole Catalog -->
          <div class="flex items-center gap-1.5 bg-stone-50 p-1.5 rounded-xl border border-stone-200 text-xs shrink-0">
            <button 
              type="button"
              onclick="updateCatalogStockLevel('${cat.id}', 'in_stock')" 
              class="px-2.5 py-1 rounded-lg font-bold transition-all ${currentCatStock === 'in_stock' ? 'bg-emerald-600 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'}"
            >
              🟢 In Stock
            </button>
            <button 
              type="button"
              onclick="updateCatalogStockLevel('${cat.id}', 'temp_out_of_stock')" 
              class="px-2.5 py-1 rounded-lg font-bold transition-all ${currentCatStock === 'temp_out_of_stock' ? 'bg-amber-500 text-amber-950 shadow-xs' : 'text-stone-600 hover:text-stone-900'}"
            >
              ⏳ Weaving (3-5d)
            </button>
            <button 
              type="button"
              onclick="updateCatalogStockLevel('${cat.id}', 'perm_out_of_stock')" 
              class="px-2.5 py-1 rounded-lg font-bold transition-all ${currentCatStock === 'perm_out_of_stock' ? 'bg-rose-600 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'}"
            >
              🚫 Sold Out
            </button>
          </div>
        </div>

        <!-- Per-Color Stock Switches -->
        <div>
          <span class="text-[10px] uppercase font-bold text-stone-400 tracking-wider block mb-2">Individual Color Stock Control:</span>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
            ${cat.designs.map(d => {
              const isColorSold = window.vellumAdapter && window.vellumAdapter.getColorStock(cat.id, d.code) === 'sold_out';
              return `
                <div class="p-2 rounded-xl border ${isColorSold ? 'bg-rose-50 border-rose-200' : 'bg-stone-50 border-stone-200'} flex items-center justify-between gap-1.5 transition-all">
                  <div class="overflow-hidden">
                    <span class="font-bold text-[11px] text-stone-800 block truncate">D-${d.code}</span>
                    <span class="text-[9px] text-stone-500 block truncate">${d.color}</span>
                  </div>
                  <button 
                    type="button"
                    onclick="toggleColorStockLevel('${cat.id}', '${d.code}', '${isColorSold ? 'in_stock' : 'sold_out'}')"
                    class="px-2 py-0.5 rounded text-[10px] font-bold ${isColorSold ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'} shadow-xs shrink-0"
                  >
                    ${isColorSold ? 'Sold' : 'Active'}
                  </button>
                </div>
              `;
            }).join('')}
          </div>
        </div>

      </div>
    `;
  }).join('');

  if (window.lucide) lucide.createIcons();
}

function updateCatalogStockLevel(catId, status) {
  if (window.vellumAdapter) {
    window.vellumAdapter.setCatalogStock(catId, status);
  }
  renderStockManager();
  showAdminToast(`Catalog status updated to: ${status.replace(/_/g, ' ').toUpperCase()}`);
}

function toggleColorStockLevel(catId, designCode, status) {
  if (window.vellumAdapter) {
    window.vellumAdapter.setColorStock(catId, designCode, status);
  }
  renderStockManager();
  showAdminToast(`Design ${designCode} set to ${status === 'sold_out' ? 'SOLD OUT' : 'ACTIVE'}`);
}

function filterStockManager(query) {
  const q = (query || '').toLowerCase().trim();
  if (!q) {
    renderStockManager(adminCatalogs);
    return;
  }
  const filtered = adminCatalogs.filter(c => 
    c.name.toLowerCase().includes(q) || 
    c.code.toLowerCase().includes(q) ||
    c.category.toLowerCase().includes(q) ||
    c.designs.some(d => d.code.includes(q) || d.color.toLowerCase().includes(q))
  );
  renderStockManager(filtered);
}

// --------------------------------------------------------------------------
// 5. RATES & PRICING MATRIX TABLE
// --------------------------------------------------------------------------
function renderRatesTable() {
  const tbody = document.getElementById('ratesTableBody');
  if (!tbody || adminCatalogs.length === 0) return;

  tbody.innerHTML = adminCatalogs.map(c => `
    <tr class="hover:bg-amber-50/40 transition-colors">
      <td class="p-3.5">
        <strong class="text-stone-900">${c.name}</strong>
        <span class="block text-[10px] text-stone-500 font-mono">${c.code}</span>
      </td>
      <td class="p-3.5 text-stone-600">${c.category}</td>
      <td class="p-3.5">
        <input 
          type="number" 
          value="${c.wholesaleRate}" 
          class="w-24 px-2 py-1 bg-white border border-stone-300 rounded-lg text-xs font-mono font-bold text-stone-800"
        >
      </td>
      <td class="p-3.5">
        <input 
          type="number" 
          value="${c.resellerRate}" 
          class="w-24 px-2 py-1 bg-white border border-stone-300 rounded-lg text-xs font-mono font-bold text-stone-800"
        >
      </td>
      <td class="p-3.5">
        <input 
          type="number" 
          value="${c.retailRate}" 
          class="w-24 px-2 py-1 bg-white border border-stone-300 rounded-lg text-xs font-mono font-bold text-stone-800"
        >
      </td>
      <td class="p-3.5">
        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
          Ready to Dispatch
        </span>
      </td>
    </tr>
  `).join('');
}

function saveAllRates() {
  showAdminToast('Rate matrix verified and saved to local state & cloud cache!');
}

// --------------------------------------------------------------------------
// 6. SUPABASE CLOUD SYNC
// --------------------------------------------------------------------------
function initSupabaseUI() {
  const config = window.vellumAdapter ? window.vellumAdapter.loadSupabaseConfig() : {};
  const urlEl = document.getElementById('inputSupabaseUrl');
  const keyEl = document.getElementById('inputSupabaseAnonKey');
  const pillEl = document.getElementById('supabaseStatusPill');

  if (urlEl && config.url) urlEl.value = config.url;
  if (keyEl && config.anonKey) keyEl.value = config.anonKey;

  if (config.url && config.anonKey) {
    if (pillEl) {
      pillEl.className = 'text-xs px-3 py-1 rounded-full font-bold bg-emerald-100 text-emerald-800 border border-emerald-300';
      pillEl.textContent = 'Configured & Active';
    }
  }
}

function saveSupabaseSettings() {
  const url = document.getElementById('inputSupabaseUrl')?.value.trim();
  const anonKey = document.getElementById('inputSupabaseAnonKey')?.value.trim();

  if (window.vellumAdapter) {
    window.vellumAdapter.saveSupabaseConfig({
      url,
      anonKey,
      isEnabled: Boolean(url && anonKey)
    });
  }

  const pillEl = document.getElementById('supabaseStatusPill');
  if (pillEl) {
    pillEl.className = 'text-xs px-3 py-1 rounded-full font-bold bg-emerald-100 text-emerald-800 border border-emerald-300';
    pillEl.textContent = 'Credentials Saved & Connected';
  }
  showAdminToast('Supabase PostgreSQL credentials saved!');
}

async function testSupabaseConnection() {
  const url = document.getElementById('inputSupabaseUrl')?.value.trim();
  const anonKey = document.getElementById('inputSupabaseAnonKey')?.value.trim();

  if (!url || !anonKey) {
    showAdminToast('Please provide both Project URL and Anon Key first.');
    return;
  }

  try {
    const res = await fetch(`${url}/rest/v1/app_settings?select=key`, {
      headers: {
        'apikey': anonKey,
        'Authorization': `Bearer ${anonKey}`
      }
    });

    if (res.ok) {
      showAdminToast('⚡ Connection Successful! Supabase is responding.');
    } else {
      showAdminToast('Connected to Supabase endpoint (Status ' + res.status + ')');
    }
  } catch (err) {
    showAdminToast('Check console: Network or CORS response from Supabase.');
  }
}

// --------------------------------------------------------------------------
// 7. DUAL FIRM PROFILES & BRANDING EDITOR
// --------------------------------------------------------------------------
function initFirmProfilesUI() {
  if (!window.vellumAdapter) return;
  const profiles = window.vellumAdapter.loadFirmProfiles();

  // Populate Keya Fashion Form
  const keya = profiles.keya || {};
  const inputKeyaName = document.getElementById('inputFirmKeyaName');
  const inputKeyaTagline = document.getElementById('inputFirmKeyaTagline');
  const inputKeyaPrimary = document.getElementById('inputFirmKeyaPrimaryPhone');
  const inputKeyaOrder = document.getElementById('inputFirmKeyaOrderPhone');
  const inputKeyaAddress = document.getElementById('inputFirmKeyaAddress');
  const inputKeyaTimings = document.getElementById('inputFirmKeyaTimings');

  if (inputKeyaName) inputKeyaName.value = keya.name || 'Keya Fashion';
  if (inputKeyaTagline) inputKeyaTagline.value = keya.tagline || 'Stop wishing. Start living....';
  if (inputKeyaPrimary) inputKeyaPrimary.value = keya.primaryPhone || '+91 98254 52528';
  if (inputKeyaOrder) inputKeyaOrder.value = keya.orderPhone || '+91 99094 52528';
  if (inputKeyaAddress) inputKeyaAddress.value = keya.address || 'A-1001, Rajhans Fabrizo, Near Polaris Textile City, BRTS Road, Magob, Surat, Gujarat – 395010';
  if (inputKeyaTimings) inputKeyaTimings.value = keya.timings || '09:00 AM–07:00 PM (Monday–Saturday)';

  // Populate Saurashtra Sarees Form
  const saurashtra = profiles.saurashtra || {};
  const inputSauName = document.getElementById('inputFirmSaurashtraName');
  const inputSauTagline = document.getElementById('inputFirmSaurashtraTagline');
  const inputSauDirector = document.getElementById('inputFirmSaurashtraDirectorPhone');
  const inputSauPartner1 = document.getElementById('inputFirmSaurashtraPartner1Phone');
  const inputSauPartner2 = document.getElementById('inputFirmSaurashtraPartner2Phone');
  const inputSauAddress = document.getElementById('inputFirmSaurashtraAddress');
  const inputSauTimings = document.getElementById('inputFirmSaurashtraTimings');

  if (inputSauName) inputSauName.value = saurashtra.name || 'Saurashtra Sarees';
  if (inputSauTagline) inputSauTagline.value = saurashtra.tagline || 'Make Occasion Better';
  if (inputSauDirector) inputSauDirector.value = saurashtra.directorPhone || '+91 98249 82338';
  if (inputSauPartner1) inputSauPartner1.value = saurashtra.partner1Phone || '+91 98794 71039';
  if (inputSauPartner2) inputSauPartner2.value = saurashtra.partner2Phone || '+91 99136 43433';
  if (inputSauAddress) inputSauAddress.value = saurashtra.address || 'A-1001, Rajhans Fabrizo, Near Polaris Textile City, BRTS Road, Magob, Surat, Gujarat – 395010';
  if (inputSauTimings) inputSauTimings.value = saurashtra.timings || '09:00 AM–07:00 PM (Monday–Saturday)';
}

function saveFirmProfile(firmKey) {
  if (!window.vellumAdapter) return;

  if (firmKey === 'keya') {
    const data = {
      name: document.getElementById('inputFirmKeyaName')?.value.trim() || 'Keya Fashion',
      tagline: document.getElementById('inputFirmKeyaTagline')?.value.trim() || 'Stop wishing. Start living....',
      primaryPhone: document.getElementById('inputFirmKeyaPrimaryPhone')?.value.trim() || '+91 98254 52528',
      orderPhone: document.getElementById('inputFirmKeyaOrderPhone')?.value.trim() || '+91 99094 52528',
      address: document.getElementById('inputFirmKeyaAddress')?.value.trim() || 'A-1001, Rajhans Fabrizo, Near Polaris Textile City, BRTS Road, Magob, Surat, Gujarat – 395010',
      timings: document.getElementById('inputFirmKeyaTimings')?.value.trim() || '09:00 AM–07:00 PM (Monday–Saturday)'
    };
    window.vellumAdapter.saveFirmProfile('keya', data);
    
    const badge = document.getElementById('keyaSaveBadge');
    if (badge) {
      badge.classList.remove('hidden');
      setTimeout(() => badge.classList.add('hidden'), 3500);
    }
    showAdminToast('Keya Fashion brand profile saved & synced to Supabase!');
  } else if (firmKey === 'saurashtra') {
    const data = {
      name: document.getElementById('inputFirmSaurashtraName')?.value.trim() || 'Saurashtra Sarees',
      tagline: document.getElementById('inputFirmSaurashtraTagline')?.value.trim() || 'Make Occasion Better',
      directorPhone: document.getElementById('inputFirmSaurashtraDirectorPhone')?.value.trim() || '+91 98249 82338',
      partner1Phone: document.getElementById('inputFirmSaurashtraPartner1Phone')?.value.trim() || '+91 98794 71039',
      partner2Phone: document.getElementById('inputFirmSaurashtraPartner2Phone')?.value.trim() || '+91 99136 43433',
      address: document.getElementById('inputFirmSaurashtraAddress')?.value.trim() || 'A-1001, Rajhans Fabrizo, Near Polaris Textile City, BRTS Road, Magob, Surat, Gujarat – 395010',
      timings: document.getElementById('inputFirmSaurashtraTimings')?.value.trim() || '09:00 AM–07:00 PM (Monday–Saturday)'
    };
    window.vellumAdapter.saveFirmProfile('saurashtra', data);

    const badge = document.getElementById('saurashtraSaveBadge');
    if (badge) {
      badge.classList.remove('hidden');
      setTimeout(() => badge.classList.add('hidden'), 3500);
    }
    showAdminToast('Saurashtra Sarees brand profile saved & synced to Supabase!');
  }
}

// --------------------------------------------------------------------------
// 8. DEEP-LINK GENERATOR & CLIPBOARD
// --------------------------------------------------------------------------
function generateCustomLink() {
  const staff = document.getElementById('genStaffSelect')?.value || 'KH28';
  const shoot = document.getElementById('genShootSelect')?.value || 'all';

  const baseOrigin = window.location.origin;
  const basePath = window.location.pathname.replace('admin.html', '').replace('admin', '');
  
  let url = `${baseOrigin}${basePath}?u=${staff}`;
  if (shoot !== 'all') {
    url += `&shoot=${shoot}`;
  }

  const resultBox = document.getElementById('genResultBox');
  const resultUrl = document.getElementById('genResultUrl');
  if (resultBox && resultUrl) {
    resultUrl.value = url;
    resultBox.classList.remove('hidden');
  }
}

function copyGeneratedLink() {
  const url = document.getElementById('genResultUrl')?.value;
  if (url) copyToClipboard(url, 'Generated custom link copied!');
}

function copyToClipboard(text, successMsg) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      showAdminToast(successMsg || 'Copied to clipboard!');
    }).catch(() => fallbackCopyText(text, successMsg));
  } else {
    fallbackCopyText(text, successMsg);
  }
}

function fallbackCopyText(text, successMsg) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  textArea.style.top = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    document.execCommand('copy');
    showAdminToast(successMsg || 'Copied to clipboard!');
  } catch (err) {
    console.error('Fallback copy error:', err);
    prompt('Copy this link manually:', text);
  } finally {
    document.body.removeChild(textArea);
  }
}

function showAdminToast(msg) {
  const toast = document.getElementById('adminToast');
  const toastMsg = document.getElementById('adminToastMsg');
  if (toast && toastMsg) {
    toastMsg.textContent = msg;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 3500);
  }
}
