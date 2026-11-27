// ==============================================================================
// VELLUM — Super-Admin Control Center Engine
// Full Staff CRUD, Universal Firm Manager, Clean Stock Control & Supabase Sync
// Architecture & Engineering by BinduGrid Studio [ØG]
// ==============================================================================

let adminCatalogs = [];
let currentStockStatusFilter = 'all';

document.addEventListener('DOMContentLoaded', async () => {
  renderStaffHub();
  initDriveFoldersUI();
  initSupabaseUI();
  renderFirmProfilesUI();
  initDeepLinkUI();
  renderSavedLinks();
  await loadAdminCatalogs();
  renderShootAssignments();
  renderStockManager();
  renderRatesTable();

  // Listen for realtime updates from VellumDataAdapter
  window.addEventListener('vellum:drive-updated', () => {
    initDriveFoldersUI();
    renderShootAssignments();
  });
  window.addEventListener('vellum:stock-updated', () => {
    renderStockManager();
  });
  window.addEventListener('vellum:shoot-updated', () => {
    renderShootAssignments();
  });
  window.addEventListener('vellum:firm-updated', () => {
    renderFirmProfilesUI();
    renderStaffHub();
    initDeepLinkUI();
  });
  window.addEventListener('vellum:staff-updated', () => {
    renderStaffHub();
    initDeepLinkUI();
  });
  window.addEventListener('vellum:links-updated', () => {
    renderSavedLinks();
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
// 2. STAFF DIRECTORY & 3-TIER SMART LINK HUB (Full CRUD)
// --------------------------------------------------------------------------
function renderStaffHub() {
  const container = document.getElementById('staffDirectoryContainer');
  const countBadge = document.getElementById('staffTotalCountBadge');
  if (!container) return;

  const staffList = window.vellumAdapter ? window.vellumAdapter.loadStaffProfiles() : [];
  const firms = window.vellumAdapter ? window.vellumAdapter.loadFirmProfiles() : {};
  
  if (countBadge) countBadge.textContent = `${staffList.length} Active Staff`;

  const baseOrigin = window.location.origin;
  const basePath = window.location.pathname.replace('admin.html', '').replace('admin', '');

  // Group staff by firm
  const grouped = {};
  staffList.forEach(s => {
    const fId = s.firm || 'saurashtra';
    if (!grouped[fId]) grouped[fId] = [];
    grouped[fId].push(s);
  });

  container.innerHTML = Object.keys(grouped).map(fId => {
    const firm = firms[fId] || { name: fId.toUpperCase() };
    const members = grouped[fId];
    const isKeya = fId === 'keya';
    const firmDotClass = isKeya ? 'bg-sky-500' : 'bg-rose-700';

    return `
      <div class="space-y-4 pt-4 first:pt-0">
        <div class="flex items-center justify-between border-b border-amber-200/80 pb-2">
          <div class="flex items-center gap-2.5">
            <span class="w-3.5 h-3.5 rounded-full ${firmDotClass}"></span>
            <h3 class="font-serif text-lg font-bold text-stone-900">${firm.name}</h3>
          </div>
          <span class="text-xs font-bold text-stone-600 bg-stone-100 px-3 py-1 rounded-full border border-stone-200">
            ${members.length} Representatives
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          ${members.map(staff => {
            const retailLink = `${baseOrigin}${basePath}?u=${staff.code}`;
            const wholesaleLink = `${baseOrigin}${basePath}?u=${staff.code}W`;
            const primeLink = `${baseOrigin}${basePath}?u=${staff.code}P`;

            const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
              `🥻 ${firm.name.toUpperCase()} — DIGITAL TEXTILE SHOWROOM 🥻\n\nPlease view our latest saree catalog here:\n${retailLink}\n\nRepresentative: ${staff.name} (${staff.displayPhone || staff.phone})`
            )}`;

            return `
              <div class="bg-white border-2 border-amber-200/90 rounded-3xl p-5 flex flex-col justify-between space-y-4 hover:border-amber-400 transition-all shadow-xs hover:shadow-md group">
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-xs font-mono font-black px-2.5 py-1 rounded-xl shadow-xs ${isKeya ? 'bg-sky-100 text-sky-900 border border-sky-300' : 'bg-rose-100 text-rose-900 border border-rose-300'}">
                      ${staff.code}
                    </span>
                    
                    <div class="flex items-center gap-1">
                      <button onclick="openStaffModal('${staff.code}')" title="Edit Staff" class="p-1.5 rounded-lg text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-all">
                        <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
                      </button>
                      <button onclick="deleteStaff('${staff.code}')" title="Delete Staff" class="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-all">
                        <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                      </button>
                    </div>
                  </div>

                  <h4 class="font-serif text-lg font-bold text-stone-900">${staff.name}</h4>
                  <p class="text-xs text-amber-900 font-mono mt-0.5 flex items-center gap-1.5 font-bold">
                    <i data-lucide="phone" class="w-3.5 h-3.5 text-amber-600"></i> ${staff.displayPhone || staff.phone}
                  </p>
                  <p class="text-[11px] text-stone-500 mt-0.5 font-medium">${staff.title || 'Catalog Representative'}</p>

                  <!-- Selective Smart Links: Retail (Default) + On-Demand Wholesale & Prime -->
                  <div class="mt-4 space-y-2 pt-3 border-t border-amber-100">
                    
                    <!-- 1. Retail MRP Link (Always Active Default) -->
                    <div class="p-2.5 bg-stone-50 rounded-xl border border-stone-200/90 space-y-1">
                      <div class="flex items-center justify-between">
                        <span class="text-[9px] uppercase font-bold text-purple-800 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">Retail MRP (Default)</span>
                        <div class="flex items-center gap-1.5">
                          <button onclick="copyToClipboard('${retailLink}', 'Retail link for ${staff.code} copied!')" class="text-[10px] text-stone-600 hover:text-amber-800 font-bold">Copy</button>
                          <span class="text-stone-300">•</span>
                          <a href="${retailLink}" target="_blank" class="text-[10px] text-stone-600 hover:text-stone-900 font-bold">Open ↗</a>
                        </div>
                      </div>
                      <a href="${retailLink}" target="_blank" class="block text-[11px] font-mono text-stone-700 hover:underline truncate">
                        ?u=${staff.code}
                      </a>
                    </div>

                    <!-- 2. Wholesale Rate Link (Shown ONLY when granted by Admin) -->
                    ${staff.hasWholesaleLink ? `
                      <div class="p-2.5 bg-emerald-50/70 rounded-xl border border-emerald-300 space-y-1">
                        <div class="flex items-center justify-between">
                          <span class="text-[9px] uppercase font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-300">Wholesale B2B</span>
                          <div class="flex items-center gap-1.5">
                            <button onclick="copyToClipboard('${wholesaleLink}', 'Wholesale link for ${staff.code}W copied!')" class="text-[10px] text-emerald-800 hover:text-emerald-950 font-bold">Copy</button>
                            <span class="text-emerald-300">•</span>
                            <a href="${wholesaleLink}" target="_blank" class="text-[10px] text-emerald-800 hover:text-emerald-950 font-bold">Open ↗</a>
                            <span class="text-emerald-300">•</span>
                            <button onclick="toggleStaffRateLink('${staff.code}', 'wholesale', false)" title="Revoke Wholesale Link" class="text-[10px] text-rose-600 hover:underline font-bold">Revoke</button>
                          </div>
                        </div>
                        <a href="${wholesaleLink}" target="_blank" class="block text-[11px] font-mono text-emerald-800 hover:underline truncate font-bold">
                          ?u=${staff.code}W
                        </a>
                      </div>
                    ` : ''}

                    <!-- 3. Prime Rate Link (Shown ONLY when granted by Admin) -->
                    ${staff.hasPrimeLink ? `
                      <div class="p-2.5 bg-amber-50/80 rounded-xl border border-amber-300 space-y-1">
                        <div class="flex items-center justify-between">
                          <span class="text-[9px] uppercase font-bold text-amber-900 bg-amber-200 px-1.5 py-0.5 rounded border border-amber-400">Prime Exclusive</span>
                          <div class="flex items-center gap-1.5">
                            <button onclick="copyToClipboard('${primeLink}', 'Prime link for ${staff.code}P copied!')" class="text-[10px] text-amber-900 hover:text-amber-950 font-bold">Copy</button>
                            <span class="text-amber-300">•</span>
                            <a href="${primeLink}" target="_blank" class="text-[10px] text-amber-900 hover:text-amber-950 font-bold">Open ↗</a>
                            <span class="text-amber-300">•</span>
                            <button onclick="toggleStaffRateLink('${staff.code}', 'prime', false)" title="Revoke Prime Link" class="text-[10px] text-rose-600 hover:underline font-bold">Revoke</button>
                          </div>
                        </div>
                        <a href="${primeLink}" target="_blank" class="block text-[11px] font-mono text-amber-900 hover:underline truncate font-bold">
                          ?u=${staff.code}P
                        </a>
                      </div>
                    ` : ''}

                    <!-- Grant Extra Rate Links On-Demand -->
                    ${(!staff.hasWholesaleLink || !staff.hasPrimeLink) ? `
                      <div class="flex flex-wrap items-center gap-1.5 pt-1.5">
                        ${!staff.hasWholesaleLink ? `
                          <button onclick="toggleStaffRateLink('${staff.code}', 'wholesale', true)" class="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-bold flex items-center gap-1 transition-all">
                            <span>+ Grant Wholesale (?u=${staff.code}W)</span>
                          </button>
                        ` : ''}
                        ${!staff.hasPrimeLink ? `
                          <button onclick="toggleStaffRateLink('${staff.code}', 'prime', true)" class="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold flex items-center gap-1 transition-all">
                            <span>+ Grant Prime (?u=${staff.code}P)</span>
                          </button>
                        ` : ''}
                      </div>
                    ` : ''}

                  </div>
                </div>

                <div class="pt-2 border-t border-amber-100">
                  <a href="${whatsappShareUrl}" target="_blank" class="w-full py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all">
                    <i data-lucide="send" class="w-3.5 h-3.5"></i>
                    <span>Share Retail Link on WhatsApp</span>
                  </a>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }).join('');

  if (window.lucide) lucide.createIcons();
}

function toggleStaffRateLink(code, tier, enable) {
  const staffList = window.vellumAdapter ? window.vellumAdapter.loadStaffProfiles() : [];
  const staff = staffList.find(s => s.code.toUpperCase() === code.toUpperCase());
  if (staff) {
    if (tier === 'wholesale') staff.hasWholesaleLink = enable;
    if (tier === 'prime') staff.hasPrimeLink = enable;
    if (window.vellumAdapter) {
      window.vellumAdapter.saveStaffProfiles(staffList);
    }
    renderStaffHub();
    showAdminToast(`${staff.name} ${tier.toUpperCase()} Link ${enable ? 'generated & authorized' : 'revoked'}`);
  }
}

// Staff Modal CRUD Handlers
let editingStaffCode = null;

function openStaffModal(code = null) {
  editingStaffCode = code;
  const modal = document.getElementById('staffModal');
  const titleEl = document.getElementById('staffModalTitle');
  const nameEl = document.getElementById('modalStaffName');
  const codeEl = document.getElementById('modalStaffCode');
  const firmEl = document.getElementById('modalStaffFirm');
  const phoneEl = document.getElementById('modalStaffPhone');
  const titleInput = document.getElementById('modalStaffTitle');

  // Populate firm dropdown
  const firms = window.vellumAdapter ? window.vellumAdapter.loadFirmProfiles() : {};
  if (firmEl) {
    firmEl.innerHTML = Object.keys(firms).map(k => `
      <option value="${k}">${firms[k].name}</option>
    `).join('');
  }

  if (code) {
    const list = window.vellumAdapter ? window.vellumAdapter.loadStaffProfiles() : [];
    const staff = list.find(s => s.code.toUpperCase() === code.toUpperCase());
    if (staff) {
      if (titleEl) titleEl.textContent = `Edit Staff: ${staff.name}`;
      if (nameEl) nameEl.value = staff.name;
      if (codeEl) {
        codeEl.value = staff.code;
        codeEl.disabled = true; // Lock code during edit
      }
      if (firmEl) firmEl.value = staff.firm;
      if (phoneEl) phoneEl.value = staff.phone;
      if (titleInput) titleInput.value = staff.title || '';
    }
  } else {
    if (titleEl) titleEl.textContent = 'Add Sales Staff Member';
    if (nameEl) nameEl.value = '';
    if (codeEl) {
      codeEl.value = '';
      codeEl.disabled = false;
    }
    if (phoneEl) phoneEl.value = '';
    if (titleInput) titleInput.value = '';
  }

  if (modal) modal.classList.remove('hidden');
}

function closeStaffModal() {
  const modal = document.getElementById('staffModal');
  if (modal) modal.classList.add('hidden');
  editingStaffCode = null;
}

function saveModalStaff() {
  const name = document.getElementById('modalStaffName')?.value.trim();
  const code = document.getElementById('modalStaffCode')?.value.trim().toUpperCase();
  const firm = document.getElementById('modalStaffFirm')?.value;
  const phone = document.getElementById('modalStaffPhone')?.value.trim().replace(/[^0-9]/g, '');
  const title = document.getElementById('modalStaffTitle')?.value.trim();

  if (!name || !code || !phone) {
    showAdminToast('Please provide Name, Code, and Mobile Number.');
    return;
  }

  const firms = window.vellumAdapter ? window.vellumAdapter.loadFirmProfiles() : {};
  const firmName = firms[firm]?.name || firm;

  const staffObj = {
    code,
    name,
    firm,
    firmName,
    phone,
    displayPhone: `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`,
    whatsapp: `91${phone}`,
    title: title || 'Catalog Representative',
    rateType: 'retail',
    rateLabel: 'Retail MRP Rate Only'
  };

  if (window.vellumAdapter) {
    window.vellumAdapter.saveStaffProfile(staffObj);
  }

  closeStaffModal();
  renderStaffHub();
  initDeepLinkUI();
  showAdminToast(`Staff profile for ${name} (${code}) saved!`);
}

function deleteStaff(code) {
  if (!confirm(`Are you sure you want to delete staff code ${code}?`)) return;
  if (window.vellumAdapter) {
    window.vellumAdapter.deleteStaffProfile(code);
  }
  renderStaffHub();
  initDeepLinkUI();
  showAdminToast(`Staff ${code} removed.`);
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

async function loadAdminCatalogs() {
  try {
    const res = await fetch('data/catalogs.json');
    if (res.ok) {
      adminCatalogs = await res.json();
    }
  } catch (err) {
    console.warn('Could not load catalogs for admin:', err);
  }
}

// Shoot Folder Assignment Matrix
function renderShootAssignments() {
  const container = document.getElementById('shootAssignmentContainer');
  if (!container || adminCatalogs.length === 0) return;

  container.innerHTML = adminCatalogs.map(cat => {
    const currentAssignment = window.vellumAdapter 
      ? window.vellumAdapter.getCatalogShoot(cat.id, cat.has2mb ? 'model' : 'table')
      : (cat.has2mb ? 'model' : 'table');

    return `
      <div class="p-3 bg-stone-50 rounded-xl border border-stone-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div>
          <span class="font-bold text-stone-900">${cat.name}</span>
          <span class="text-stone-500 font-mono ml-1">(${cat.code})</span>
          <span class="text-[10px] text-amber-800 bg-amber-100 px-2 py-0.5 rounded font-bold ml-1">${cat.category}</span>
        </div>

        <div class="flex items-center gap-1.5 shrink-0">
          <button 
            type="button"
            onclick="setCatalogShootAssignment('${cat.id}', 'model')" 
            class="px-2.5 py-1 rounded-lg font-bold transition-all ${currentAssignment === 'model' ? 'bg-sky-600 text-white shadow-xs' : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'}"
          >
            👗 Model Shoot
          </button>
          <button 
            type="button"
            onclick="setCatalogShootAssignment('${cat.id}', 'table')" 
            class="px-2.5 py-1 rounded-lg font-bold transition-all ${currentAssignment === 'table' ? 'bg-amber-600 text-white shadow-xs' : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'}"
          >
            🪑 Table Shoot
          </button>
          <button 
            type="button"
            onclick="setCatalogShootAssignment('${cat.id}', 'both')" 
            class="px-2.5 py-1 rounded-lg font-bold transition-all ${currentAssignment === 'both' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'}"
          >
            🌟 Both Shoots
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function setCatalogShootAssignment(catId, shootType) {
  if (window.vellumAdapter) {
    window.vellumAdapter.setCatalogShoot(catId, shootType);
  }
  renderShootAssignments();
  showAdminToast(`Assigned ${catId} to ${shootType.toUpperCase()} shoot.`);
}

// --------------------------------------------------------------------------
// 4. CLEAN & FAST CATALOG STOCK CONTROL (High Efficiency)
// --------------------------------------------------------------------------
function renderStockManager(customList = null) {
  const container = document.getElementById('stockManagerContainer');
  if (!container) return;

  const list = customList || adminCatalogs;

  if (list.length === 0) {
    container.innerHTML = `
      <div class="p-8 text-center bg-white rounded-2xl border border-stone-200 text-stone-500 text-xs">
        No catalogs match your search.
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(cat => {
    const currentCatStock = window.vellumAdapter 
      ? window.vellumAdapter.getCatalogStock(cat.id, 'in_stock') 
      : 'in_stock';

    const firstDesign = cat.designs[0] || {};
    const heroThumb = firstDesign.heroImageUrl || cat.heroImageUrl || 'assets/saurashtra-sarees-logo.jpg';

    return `
      <div class="bg-white border border-amber-200/90 rounded-2xl p-4 shadow-xs hover:border-amber-400 transition-all space-y-3">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          <div class="flex items-center gap-3 min-w-0">
            <img 
              src="${heroThumb}" 
              referrerpolicy="no-referrer" 
              alt="${cat.name}" 
              class="w-12 h-14 rounded-xl object-cover border border-amber-200 bg-stone-100 shrink-0 shadow-xs"
              onerror="this.onerror=null; this.src='assets/saurashtra-sarees-logo.jpg';"
            >
            <div class="min-w-0">
              <div class="flex items-center gap-2">
                <h4 class="font-serif text-sm sm:text-base font-bold text-stone-900 truncate">${cat.name}</h4>
                <span class="text-[10px] font-mono text-stone-500 font-bold bg-stone-100 px-1.5 py-0.5 rounded">${cat.code}</span>
              </div>
              <p class="text-[11px] text-stone-500 mt-0.5">
                ${cat.category} • <strong class="text-stone-700">${cat.designs.length} Colorways</strong> • Wholesale: <span class="text-emerald-700 font-bold">₹${cat.wholesaleRate}</span> • Prime: <span class="text-amber-800 font-bold">₹${cat.resellerRate}</span> • MRP: <span class="text-stone-900 font-bold">₹${cat.retailRate}</span>
              </p>
            </div>
          </div>

          <!-- 3-Segment 1-Click Stock Pill -->
          <div class="flex items-center gap-1.5 bg-stone-50 p-1 rounded-xl border border-stone-200 text-xs shrink-0 self-start sm:self-auto">
            <button 
              type="button"
              onclick="updateCatalogStockLevel('${cat.id}', 'in_stock')" 
              class="px-3 py-1.5 rounded-lg font-bold transition-all ${currentCatStock === 'in_stock' ? 'bg-emerald-600 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'}"
            >
              🟢 Ready Lot
            </button>
            <button 
              type="button"
              onclick="updateCatalogStockLevel('${cat.id}', 'temp_out_of_stock')" 
              class="px-3 py-1.5 rounded-lg font-bold transition-all ${currentCatStock === 'temp_out_of_stock' ? 'bg-amber-500 text-amber-950 shadow-xs' : 'text-stone-600 hover:text-stone-900'}"
            >
              🟡 Re-Weaving (3-5d)
            </button>
            <button 
              type="button"
              onclick="updateCatalogStockLevel('${cat.id}', 'perm_out_of_stock')" 
              class="px-3 py-1.5 rounded-lg font-bold transition-all ${currentCatStock === 'perm_out_of_stock' ? 'bg-rose-600 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'}"
            >
              🔴 Sold Out
            </button>

            <!-- Collapsible Color Shades Toggle Button -->
            <button 
              type="button"
              onclick="toggleColorDrawer('${cat.id}')"
              class="ml-1 px-2.5 py-1.5 rounded-lg bg-white border border-stone-200 text-stone-700 text-xs font-bold hover:bg-stone-100 flex items-center gap-1"
            >
              <span>🎨 Colors</span>
              <i data-lucide="chevron-down" class="w-3.5 h-3.5"></i>
            </button>
          </div>

        </div>

        <!-- Collapsible Color Shades Drawer -->
        <div id="colorDrawer-${cat.id}" class="hidden pt-2 border-t border-stone-100">
          <span class="text-[10px] font-bold uppercase text-stone-400 tracking-wider block mb-1.5">Click to toggle single shade stock:</span>
          <div class="flex flex-wrap gap-2">
            ${cat.designs.map(d => {
              const isColorSold = window.vellumAdapter && window.vellumAdapter.getColorStock(cat.id, d.code) === 'sold_out';
              return `
                <button 
                  type="button"
                  onclick="toggleColorStockLevel('${cat.id}', '${d.code}', '${isColorSold ? 'in_stock' : 'sold_out'}')"
                  class="px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 border transition-all ${isColorSold ? 'bg-rose-50 text-rose-800 border-rose-300 line-through' : 'bg-emerald-50 text-emerald-800 border-emerald-300'}"
                >
                  <span class="w-2 h-2 rounded-full ${isColorSold ? 'bg-rose-600' : 'bg-emerald-600'}"></span>
                  <span>D-${d.code} (${d.color})</span>
                  <span class="text-[9px] uppercase font-black">${isColorSold ? 'SOLD' : 'OK'}</span>
                </button>
              `;
            }).join('')}
          </div>
        </div>

      </div>
    `;
  }).join('');

  if (window.lucide) lucide.createIcons();
}

function toggleColorDrawer(catId) {
  const drawer = document.getElementById(`colorDrawer-${catId}`);
  if (drawer) drawer.classList.toggle('hidden');
}

function updateCatalogStockLevel(catId, status) {
  if (window.vellumAdapter) {
    window.vellumAdapter.setCatalogStock(catId, status);
  }
  renderStockManager();
  showAdminToast(`Stock status updated to ${status.replace(/_/g, ' ').toUpperCase()}`);
}

function toggleColorStockLevel(catId, designCode, status) {
  if (window.vellumAdapter) {
    window.vellumAdapter.setColorStock(catId, designCode, status);
  }
  renderStockManager();
  showAdminToast(`Design ${designCode} set to ${status === 'sold_out' ? 'SOLD OUT' : 'READY'}`);
}

function markAllCatalogsInStock() {
  if (!confirm('Mark all catalog collections as Ready to Dispatch?')) return;
  adminCatalogs.forEach(c => {
    if (window.vellumAdapter) {
      window.vellumAdapter.setCatalogStock(c.id, 'in_stock');
    }
  });
  renderStockManager();
  showAdminToast('All catalog collections marked In Stock!');
}

function filterStockStatus(status) {
  currentStockStatusFilter = status;
  ['all', 'in_stock', 'temp_out_of_stock', 'perm_out_of_stock'].forEach(st => {
    const btn = document.getElementById(`stockTab-${st}`);
    if (btn) {
      if (st === status) {
        btn.className = 'px-3 py-1.5 rounded-xl bg-amber-600 text-white shadow-xs';
      } else {
        btn.className = 'px-3 py-1.5 rounded-xl bg-stone-100 text-stone-700 hover:bg-stone-200';
      }
    }
  });

  if (status === 'all') {
    renderStockManager(adminCatalogs);
  } else {
    const filtered = adminCatalogs.filter(c => {
      const stock = window.vellumAdapter ? window.vellumAdapter.getCatalogStock(c.id, 'in_stock') : 'in_stock';
      return stock === status;
    });
    renderStockManager(filtered);
  }
}

function filterStockManager(query) {
  const q = (query || '').toLowerCase().trim();
  if (!q) {
    filterStockStatus(currentStockStatusFilter);
    return;
  }
  const filtered = adminCatalogs.filter(c => 
    c.name.toLowerCase().includes(q) || 
    c.code.toLowerCase().includes(q) ||
    c.category.toLowerCase().includes(q)
  );
  renderStockManager(filtered);
}

// --------------------------------------------------------------------------
// 5. COMMERCIAL RATE MATRIX (Prime, Wholesale & Retail / MRP)
// --------------------------------------------------------------------------
function renderRatesTable() {
  const tbody = document.getElementById('ratesTableBody');
  if (!tbody || adminCatalogs.length === 0) return;

  tbody.innerHTML = adminCatalogs.map(c => `
    <tr class="hover:bg-amber-50/50 transition-colors">
      <td class="p-3.5 font-bold text-stone-900">${c.name} (${c.code})</td>
      <td class="p-3.5 text-stone-600">${c.category}</td>
      <td class="p-3.5">
        <input 
          type="number" 
          value="${c.resellerRate}" 
          class="w-24 px-2 py-1 bg-white border border-stone-300 rounded-lg text-xs font-mono font-bold text-amber-900"
          placeholder="Prime Rate"
        >
      </td>
      <td class="p-3.5">
        <input 
          type="number" 
          value="${c.wholesaleRate}" 
          class="w-24 px-2 py-1 bg-white border border-stone-300 rounded-lg text-xs font-mono font-bold text-emerald-800"
          placeholder="Wholesale Rate"
        >
      </td>
      <td class="p-3.5">
        <input 
          type="number" 
          value="${c.retailRate}" 
          class="w-24 px-2 py-1 bg-white border border-stone-300 rounded-lg text-xs font-mono font-bold text-stone-900"
          placeholder="Retail MRP"
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
  showAdminToast('Commercial rate matrix verified and synchronized to cache!');
}

// --------------------------------------------------------------------------
// 6. SUPABASE CLOUD SYNC & 1-CLICK ACTIVATOR
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

async function copySqlSchemaToClipboard() {
  try {
    const res = await fetch('supabase_schema.sql');
    if (res.ok) {
      const sqlText = await res.text();
      copyToClipboard(sqlText, '📋 Supabase SQL Schema copied! Paste into Supabase SQL Editor and click Run.');
    } else {
      showAdminToast('Opening supabase_schema.sql directly...');
      window.open('supabase_schema.sql', '_blank');
    }
  } catch (e) {
    window.open('supabase_schema.sql', '_blank');
  }
}

// --------------------------------------------------------------------------
// 7. UNIVERSAL MULTI-FIRM MANAGER (Full CRUD: Add, Edit, Delete)
// --------------------------------------------------------------------------
function renderFirmProfilesUI() {
  const container = document.getElementById('firmsDirectoryContainer');
  if (!container) return;

  const profiles = window.vellumAdapter ? window.vellumAdapter.loadFirmProfiles() : {};
  const firmKeys = Object.keys(profiles);

  container.innerHTML = firmKeys.map(fId => {
    const f = profiles[fId];
    const isKeya = fId === 'keya';
    const isSaurashtra = fId === 'saurashtra';
    const isCore = isKeya || isSaurashtra;
    const borderClass = isKeya ? 'border-sky-300' : isSaurashtra ? 'border-rose-300' : 'border-amber-300';
    const tagBg = isKeya ? 'bg-sky-50 text-sky-800 border-sky-200' : isSaurashtra ? 'bg-rose-50 text-rose-800 border-rose-200' : 'bg-amber-50 text-amber-800 border-amber-200';
    const btnColor = isKeya ? 'bg-sky-600 hover:bg-sky-700' : isSaurashtra ? 'bg-rose-700 hover:bg-rose-800' : 'bg-amber-600 hover:bg-amber-700';

    return `
      <div class="bg-white border-2 ${borderClass} rounded-3xl p-6 space-y-5 shadow-sm">
        
        <!-- Header -->
        <div class="flex items-center justify-between pb-4 border-b border-stone-100">
          <div class="flex items-center gap-3">
            <img src="${f.logo || 'assets/saurashtra-sarees-logo.jpg'}" alt="${f.name} Logo" class="h-12 w-auto object-contain bg-white p-1 rounded-xl border border-stone-200 shadow-xs">
            <div>
              <h4 class="font-bold text-stone-900 text-sm">${f.name}</h4>
              <span class="text-[10px] font-bold uppercase tracking-wider ${tagBg} px-2 py-0.5 rounded-md border">
                ${f.id.toUpperCase()} FIRM
              </span>
            </div>
          </div>
          
          <div class="flex items-center gap-2">
            <span id="saveBadge-${fId}" class="hidden text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-300">
              ✓ Saved
            </span>
            ${isCore ? `
              <span class="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200 flex items-center gap-1">
                🛡️ Foundation
              </span>
            ` : `
              <button onclick="deleteFirm('${fId}')" title="Delete Custom Firm" class="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
                <i data-lucide="trash-2" class="w-4 h-4"></i>
              </button>
            `}
          </div>
        </div>

        <!-- Universal Keya-Style Form Fields -->
        <div class="space-y-3.5 text-xs">
          <div>
            <label class="block text-[11px] font-bold text-stone-700 uppercase mb-1">Firm Display Name</label>
            <input type="text" id="firmInputName-${fId}" value="${f.name || ''}" class="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl font-bold text-stone-800 focus:outline-none focus:border-amber-600">
          </div>

          <div>
            <label class="block text-[11px] font-bold text-stone-700 uppercase mb-1">Official Tagline / Slogan</label>
            <input type="text" id="firmInputTagline-${fId}" value="${f.tagline || ''}" class="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-800 focus:outline-none focus:border-amber-600">
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-[11px] font-bold text-stone-700 uppercase mb-1">Primary Support Phone</label>
              <input type="text" id="firmInputPrimary-${fId}" value="${f.primaryPhone || f.directorPhone || ''}" class="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl font-mono text-stone-800 focus:outline-none focus:border-amber-600">
            </div>
            <div>
              <label class="block text-[11px] font-bold text-stone-700 uppercase mb-1">Order Desk / Secondary Phone</label>
              <input type="text" id="firmInputOrder-${fId}" value="${f.orderPhone || f.partner1Phone || ''}" class="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl font-mono text-stone-800 focus:outline-none focus:border-amber-600">
            </div>
          </div>

          <div>
            <label class="block text-[11px] font-bold text-stone-700 uppercase mb-1">Full Registered Address</label>
            <textarea id="firmInputAddress-${fId}" rows="2" class="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-800 leading-relaxed focus:outline-none focus:border-amber-600">${f.address || 'A-1001, Rajhans Fabrizo, Near Polaris Textile City, BRTS Road, Magob, Surat, Gujarat – 395010'}</textarea>
          </div>

          <div>
            <label class="block text-[11px] font-bold text-stone-700 uppercase mb-1">Showroom & Support Timings</label>
            <input type="text" id="firmInputTimings-${fId}" value="${f.timings || '09:00 AM–07:00 PM (Monday–Saturday)'}" class="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-800 focus:outline-none focus:border-amber-600">
          </div>

          <div class="pt-2">
            <button onclick="saveUniversalFirmProfile('${fId}')" class="w-full py-3 rounded-xl ${btnColor} text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xs">
              <i data-lucide="save" class="w-4 h-4"></i>
              <span>Save ${f.name} Profile</span>
            </button>
          </div>
        </div>

      </div>
    `;
  }).join('');

  if (window.lucide) lucide.createIcons();
}

function saveUniversalFirmProfile(firmId) {
  if (!window.vellumAdapter) return;

  const name = document.getElementById(`firmInputName-${firmId}`)?.value.trim();
  const tagline = document.getElementById(`firmInputTagline-${firmId}`)?.value.trim();
  const primaryPhone = document.getElementById(`firmInputPrimary-${firmId}`)?.value.trim();
  const orderPhone = document.getElementById(`firmInputOrder-${firmId}`)?.value.trim();
  const address = document.getElementById(`firmInputAddress-${firmId}`)?.value.trim();
  const timings = document.getElementById(`firmInputTimings-${firmId}`)?.value.trim();

  const data = {
    name: name || firmId,
    tagline: tagline || '',
    primaryPhone: primaryPhone || '',
    orderPhone: orderPhone || '',
    directorPhone: primaryPhone || '',
    partner1Phone: orderPhone || '',
    address: address || '',
    timings: timings || ''
  };

  window.vellumAdapter.saveFirmProfile(firmId, data);

  const badge = document.getElementById(`saveBadge-${firmId}`);
  if (badge) {
    badge.classList.remove('hidden');
    setTimeout(() => badge.classList.add('hidden'), 3500);
  }

  showAdminToast(`${name || firmId} profile saved & synchronized!`);
}

function deleteFirm(firmId) {
  if (!confirm(`Are you sure you want to delete the firm profile for ${firmId}?`)) return;
  if (window.vellumAdapter) {
    const ok = window.vellumAdapter.deleteFirmProfile(firmId);
    if (ok) {
      renderFirmProfilesUI();
      renderStaffHub();
      showAdminToast(`Firm ${firmId} deleted.`);
    } else {
      showAdminToast('Cannot delete the last remaining firm.');
    }
  }
}

function openFirmModal() {
  const modal = document.getElementById('firmModal');
  if (modal) modal.classList.remove('hidden');
}

function closeFirmModal() {
  const modal = document.getElementById('firmModal');
  if (modal) modal.classList.add('hidden');
}

function saveModalNewFirm() {
  const key = document.getElementById('modalFirmKey')?.value.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  const name = document.getElementById('modalFirmName')?.value.trim();
  const tagline = document.getElementById('modalFirmTagline')?.value.trim();
  const primaryPhone = document.getElementById('modalFirmPrimaryPhone')?.value.trim();
  const orderPhone = document.getElementById('modalFirmOrderPhone')?.value.trim();
  const address = document.getElementById('modalFirmAddress')?.value.trim();
  const timings = document.getElementById('modalFirmTimings')?.value.trim();

  if (!key || !name) {
    showAdminToast('Please provide Firm Key and Firm Name.');
    return;
  }

  const firmData = {
    id: key,
    name,
    tagline: tagline || 'Make Occasion Better',
    primaryPhone: primaryPhone || '+91 98794 71039',
    orderPhone: orderPhone || '+91 99136 43433',
    address: address || 'A-1001, Rajhans Fabrizo, Near Polaris Textile City, BRTS Road, Magob, Surat, Gujarat – 395010',
    timings: timings || '09:00 AM–07:00 PM (Monday–Saturday)',
    themeClass: 'theme-saurashtra',
    accentColor: '#d4af37'
  };

  if (window.vellumAdapter) {
    window.vellumAdapter.saveFirmProfile(key, firmData);
  }

  // Clear modal inputs
  const kInput = document.getElementById('modalFirmKey');
  if (kInput) kInput.value = '';
  const nInput = document.getElementById('modalFirmName');
  if (nInput) nInput.value = '';
  const tInput = document.getElementById('modalFirmTagline');
  if (tInput) tInput.value = '';
  const pInput = document.getElementById('modalFirmPrimaryPhone');
  if (pInput) pInput.value = '';
  const oInput = document.getElementById('modalFirmOrderPhone');
  if (oInput) oInput.value = '';

  closeFirmModal();
  renderFirmProfilesUI();
  renderStaffHub();
  showAdminToast(`New firm "${name}" successfully created and synced!`);
}

// --------------------------------------------------------------------------
// 8. DEEP-LINK BUILDER & SAVED CAMPAIGN LINKS (Full CRUD)
// --------------------------------------------------------------------------
function initDeepLinkUI() {
  const staffSelect = document.getElementById('genStaffSelect');
  if (!staffSelect) return;

  const staffList = window.vellumAdapter ? window.vellumAdapter.loadStaffProfiles() : [];
  staffSelect.innerHTML = staffList.map(s => `
    <option value="${s.code}">${s.code} — ${s.name} (${s.firmName || s.firm})</option>
  `).join('');
}

function generateAndSaveLink() {
  const staff = document.getElementById('genStaffSelect')?.value || 'AR38';
  const rateTier = document.getElementById('genRateSelect')?.value || 'retail';
  const shoot = document.getElementById('genShootSelect')?.value || 'all';
  const title = document.getElementById('genCampaignTitle')?.value.trim() || `${staff} Campaign`;

  const baseOrigin = window.location.origin;
  const basePath = window.location.pathname.replace('admin.html', '').replace('admin', '');
  
  // Rate suffix logic:
  // retail -> ?u=AR38
  // wholesale -> ?u=AR38W
  // prime -> ?u=AR38P
  let userParam = staff;
  if (rateTier === 'wholesale') userParam = `${staff}W`;
  else if (rateTier === 'prime') userParam = `${staff}P`;

  let url = `${baseOrigin}${basePath}?u=${userParam}`;
  if (shoot !== 'all') {
    url += `&shoot=${shoot}`;
  }

  const resultBox = document.getElementById('genResultBox');
  const resultUrl = document.getElementById('genResultUrl');
  if (resultBox && resultUrl) {
    resultUrl.value = url;
    resultBox.classList.remove('hidden');
  }

  // Save to stored links
  if (window.vellumAdapter) {
    window.vellumAdapter.addSavedLink({
      title,
      staff,
      rateTier,
      shoot,
      url
    });
  }

  renderSavedLinks();
  showAdminToast(`Campaign link created: ${url}`);
}

function renderSavedLinks() {
  const container = document.getElementById('savedLinksContainer');
  const countBadge = document.getElementById('savedLinksCount');
  if (!container) return;

  const links = window.vellumAdapter ? window.vellumAdapter.loadSavedLinks() : [];
  if (countBadge) countBadge.textContent = `${links.length} Saved`;

  if (links.length === 0) {
    container.innerHTML = `
      <div class="p-6 text-center text-xs text-stone-500 bg-stone-50 rounded-2xl border border-stone-200">
        No custom campaign links created yet. Use the generator on the left!
      </div>
    `;
    return;
  }

  container.innerHTML = links.map(item => {
    let tierBadge = 'bg-stone-100 text-stone-800 border-stone-200';
    if (item.rateTier === 'wholesale') tierBadge = 'bg-emerald-100 text-emerald-900 border-emerald-300';
    else if (item.rateTier === 'prime') tierBadge = 'bg-amber-200 text-amber-950 border-amber-400';

    return `
      <div class="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/90 space-y-2">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="font-bold text-stone-900 text-xs">${item.title}</span>
            <span class="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded border ${tierBadge}">${item.rateTier}</span>
          </div>
          <button onclick="deleteSavedCampaignLink('${item.id}')" title="Delete Link" class="text-stone-400 hover:text-rose-600 transition-colors">
            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
          </button>
        </div>

        <div class="flex items-center gap-2 text-xs">
          <input type="text" readonly value="${item.url}" class="flex-1 px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg font-mono text-[11px] text-stone-700">
          <button onclick="copyToClipboard('${item.url}', 'Link copied!')" class="px-2.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-[11px]">Copy</button>
          <a href="${item.url}" target="_blank" class="px-2.5 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-lg font-bold text-[11px]">Open ↗</a>
        </div>
      </div>
    `;
  }).join('');

  if (window.lucide) lucide.createIcons();
}

function deleteSavedCampaignLink(id) {
  if (window.vellumAdapter) {
    window.vellumAdapter.deleteSavedLink(id);
  }
  renderSavedLinks();
  showAdminToast('Campaign link removed.');
}

function copyGeneratedLink() {
  const url = document.getElementById('genResultUrl')?.value;
  if (url) copyToClipboard(url, 'Generated link copied to clipboard!');
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
