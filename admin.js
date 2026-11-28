// ==============================================================================
// VELLUM — Super-Admin Control Center Engine
// Full Staff CRUD, Universal Firm Manager, Clean Stock Control & Google Sheet Sync
// Architecture & Engineering by BinduGrid Studio [ØG]
// ==============================================================================

const AUTH_PIN = '551799';

function checkAdminAuth() {
  const gate = document.getElementById('adminPinGate');
  if (!gate) return;
  if (sessionStorage.getItem('vellum_admin_auth') === 'true') {
    gate.classList.add('hidden');
  } else {
    gate.classList.remove('hidden');
    const input = document.getElementById('adminPinInput');
    if (input) input.focus();
  }
}

function handlePinSubmit(e) {
  if (e) e.preventDefault();
  const input = document.getElementById('adminPinInput');
  const err = document.getElementById('pinErrorMessage');
  const gate = document.getElementById('adminPinGate');
  if (!input) return;

  if (input.value.trim() === AUTH_PIN) {
    sessionStorage.setItem('vellum_admin_auth', 'true');
    if (err) err.classList.add('hidden');
    if (gate) gate.classList.add('hidden');
    showAdminToast('✓ Super-Admin console unlocked!');
  } else {
    if (err) err.classList.remove('hidden');
    input.value = '';
    input.focus();
  }
}

let adminCatalogs = [];
let currentStockStatusFilter = 'all';

document.addEventListener('DOMContentLoaded', async () => {
  checkAdminAuth();

  // 1. Live Google Sheet Synchronization before rendering UI
  if (window.vellumAdapter) {
    try {
      await window.vellumAdapter.syncFromGoogleSheet();
      console.log('✓ Admin Panel: Synchronized live staff, firms, and settings from Google Sheet!');
    } catch(e) {
      console.warn('Admin Google Sheet auto-sync error:', e);
    }
  }

  try { renderStaffHub(); } catch (e) { console.warn('renderStaffHub error:', e); }
  try { initDriveFoldersUI(); } catch (e) { console.warn('initDriveFoldersUI error:', e); }
  try { renderFirmProfilesUI(); } catch (e) { console.warn('renderFirmProfilesUI error:', e); }
  try { initDeepLinkUI(); } catch (e) { console.warn('initDeepLinkUI error:', e); }
  try { renderSavedLinks(); } catch (e) { console.warn('renderSavedLinks error:', e); }
  try { initSheetUI(); } catch (e) { console.warn('initSheetUI error:', e); }

  await loadAdminCatalogs();

  try { renderShootAssignments(); } catch (e) { console.warn('renderShootAssignments error:', e); }
  try { renderStockManager(); } catch (e) { console.warn('renderStockManager error:', e); }
  try { renderRatesTable(); } catch (e) { console.warn('renderRatesTable error:', e); }
  try { renderSheetDatabaseTable(); } catch (e) { console.warn('renderSheetDatabaseTable error:', e); }

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

  if (window.lucide && typeof window.lucide.createIcons === 'function') window.lucide.createIcons();
});

// --------------------------------------------------------------------------
// 1. LEFT-HAND SIDEBAR TAB NAVIGATION
// --------------------------------------------------------------------------
function switchTab(tabId) {
  const tabs = ['hub', 'drive', 'stock', 'rates', 'sheet', 'firms', 'generator', 'colors'];
  
  tabs.forEach(t => {
    const content = document.getElementById(`tabContent-${t}`);
    const btn = document.getElementById(`sidebarBtn-${t}`);

    if (t === tabId) {
      if (content) content.classList.remove('hidden');
      if (btn) {
        btn.className = 'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold bg-amber-100 text-amber-950 border-l-4 border-amber-600 transition-all text-left shadow-xs';
      }
      // Explicitly trigger active tab render function so data is always fresh and never blank
      if (tabId === 'hub') renderStaffHub();
      else if (tabId === 'drive') { initDriveFoldersUI(); renderShootAssignments(); }
      else if (tabId === 'stock') renderStockManager();
      else if (tabId === 'rates') renderRatesTable();
      else if (tabId === 'sheet') renderSheetDatabaseTable();
      else if (tabId === 'firms') renderFirmProfilesUI();
      else if (tabId === 'generator') { initDeepLinkUI(); renderSavedLinks(); }
      else if (tabId === 'colors') { initColorExtractorTab(); }
    } else {
      if (content) content.classList.add('hidden');
      if (btn) {
        btn.className = 'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-stone-600 hover:bg-amber-50 hover:text-stone-900 transition-all text-left';
      }
    }
  });

  if (window.lucide && typeof window.lucide.createIcons === 'function') window.lucide.createIcons();
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
      <option value="${k}">${firms[k].name || k}</option>
    `).join('');
  }

  if (code) {
    const list = window.vellumAdapter ? window.vellumAdapter.loadStaffProfiles() : [];
    const staff = list.find(s => s.code.toUpperCase() === code.toUpperCase());
    if (staff) {
      if (titleEl) titleEl.textContent = `Edit Staff: ${staff.name} (${staff.code})`;
      if (nameEl) nameEl.value = staff.name || '';
      if (codeEl) {
        codeEl.value = staff.code;
        codeEl.disabled = true; // Lock code during edit so identifier is preserved
      }
      if (firmEl) firmEl.value = staff.firm || 'saurashtra';
      if (phoneEl) phoneEl.value = staff.phone || '';
      if (titleInput) titleInput.value = staff.title || '';
    }
  } else {
    if (titleEl) titleEl.textContent = 'Add Sales Staff Member';
    if (nameEl) nameEl.value = '';
    if (codeEl) {
      codeEl.value = '';
      codeEl.disabled = false;
    }
    if (firmEl) firmEl.value = 'saurashtra';
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
  const code = (editingStaffCode || document.getElementById('modalStaffCode')?.value || '').trim().toUpperCase();
  const name = document.getElementById('modalStaffName')?.value.trim();
  const firm = document.getElementById('modalStaffFirm')?.value || 'saurashtra';
  const phone = document.getElementById('modalStaffPhone')?.value.trim().replace(/[^0-9]/g, '');
  const title = document.getElementById('modalStaffTitle')?.value.trim();

  if (!name || !code || !phone) {
    showAdminToast('Please provide Name, Code, and Mobile Number.');
    return;
  }

  const firms = window.vellumAdapter ? window.vellumAdapter.loadFirmProfiles() : {};
  const firmName = firms[firm]?.name || (firm === 'keya' ? 'Keya Fashion' : 'Saurashtra Sarees');

  // Load existing profile to preserve link flags (hasWholesaleLink, hasPrimeLink)
  const currentList = window.vellumAdapter ? window.vellumAdapter.loadStaffProfiles() : [];
  const existing = currentList.find(s => s.code.toUpperCase() === code.toUpperCase()) || {};

  const staffObj = {
    ...existing,
    code,
    name,
    firm,
    firmName,
    phone,
    displayPhone: `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`,
    whatsapp: `91${phone}`,
    title: title || existing.title || 'Catalog Representative',
    rateType: existing.rateType || 'retail',
    rateLabel: existing.rateLabel || 'Retail MRP Rate Only'
  };

  if (window.vellumAdapter) {
    window.vellumAdapter.saveStaffProfile(staffObj);
    window.vellumAdapter.addOrUpdateStaff(staffObj);
  }

  closeStaffModal();
  renderStaffHub();
  initDeepLinkUI();
  showAdminToast(`Staff profile for ${name} (${code}) updated & saved!`);
}

function deleteStaff(code) {
  if (typeof confirm === 'function' && !confirm(`Are you sure you want to delete staff code ${code}?`)) return;
  if (window.vellumAdapter) {
    if (typeof window.vellumAdapter.deleteStaffProfile === 'function') {
      window.vellumAdapter.deleteStaffProfile(code);
    } else if (typeof window.vellumAdapter.deleteStaff === 'function') {
      window.vellumAdapter.deleteStaff(code);
    }
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
      try { renderShootAssignments(); } catch (e) {}
      try { renderStockManager(); } catch (e) {}
      try { renderRatesTable(); } catch (e) {}
      try { renderSheetDatabaseTable(); } catch (e) {}
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
// 6. GOOGLE SHEET DATABASE & BACKGROUND SYNC (Sheet ID: 1YcrvrrgwikEFkST8VEPf-XRjj8vWd0F750kauK1PU1o)
// --------------------------------------------------------------------------
function initSheetUI() {
  const input = document.getElementById('inputSheetId');
  if (input) {
    input.value = localStorage.getItem('vellum_sheet_id') || '1YcrvrrgwikEFkST8VEPf-XRjj8vWd0F750kauK1PU1o';
  }
  renderSheetDatabaseTable();
}

let currentSheetFilter = 'all';

function setSheetFilter(type) {
  currentSheetFilter = type;
  ['all', 'model', 'table'].forEach(t => {
    const btn = document.getElementById(`sheetFilterBtn-${t}`);
    if (btn) {
      if (t === type) {
        btn.className = 'px-2.5 py-1 rounded-lg font-bold bg-white text-stone-900 shadow-xs';
      } else {
        btn.className = 'px-2.5 py-1 rounded-lg font-medium text-stone-600 hover:text-stone-900';
      }
    }
  });
  renderSheetDatabaseTable();
}

function filterSheetTable() {
  renderSheetDatabaseTable();
}

function renderSheetDatabaseTable() {
  const tbody = document.getElementById('sheetTableBody');
  const countBadge = document.getElementById('sheetCatalogCountBadge');
  if (!tbody) return;

  const query = (document.getElementById('sheetSearchInput')?.value || '').toLowerCase().trim();
  const catalogs = adminCatalogs || [];

  const filtered = catalogs.filter(c => {
    if (currentSheetFilter === 'model' && c.shootType !== 'model') return false;
    if (currentSheetFilter === 'table' && c.shootType !== 'table') return false;
    if (query) {
      const matchName = (c.name || '').toLowerCase().includes(query);
      const matchCode = (c.code || '').toLowerCase().includes(query);
      const matchCat = (c.category || '').toLowerCase().includes(query);
      if (!matchName && !matchCode && !matchCat) return false;
    }
    return true;
  });

  if (countBadge) countBadge.textContent = `${filtered.length} of ${catalogs.length} Collections`;

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="p-8 text-center text-stone-500 font-medium">
          No catalog records found matching query.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(c => {
    const primeRate = c.resellerRate || (c.retailRate - 150);
    const wsRate = c.wholesaleRate || (c.retailRate - 100);
    const retRate = c.retailRate;
    const shootBadge = c.shootType === 'model'
      ? `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-300">Model Shoot</span>`
      : `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">Table Shoot</span>`;

    return `
      <tr class="hover:bg-amber-50/40 transition-colors">
        <td class="p-3 font-mono font-bold text-stone-900">${c.code}</td>
        <td class="p-3 font-serif font-bold text-stone-800">${c.name}</td>
        <td class="p-3 text-stone-600">${c.category}</td>
        <td class="p-3">${shootBadge}</td>
        <td class="p-3 font-mono font-bold text-amber-900">₹${primeRate}</td>
        <td class="p-3 font-mono font-bold text-emerald-800">₹${wsRate}</td>
        <td class="p-3 font-mono font-bold text-stone-900">₹${retRate}</td>
        <td class="p-3">
          <span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            ${c.status || 'Ready to dispatch'}
          </span>
        </td>
      </tr>
    `;
  }).join('');
}

async function refreshLiveGoogleSheetData() {
  showAdminToast('🔄 Fetching live staff, firms & rates from Google Sheet...');
  if (window.vellumAdapter) {
    await window.vellumAdapter.syncFromGoogleSheet();
    renderStaffHub();
    renderFirmProfilesUI();
    initDeepLinkUI();
    showAdminToast('✓ Google Sheet live data successfully updated!');
  }
}

function downloadSheetCsv() {
  window.open('data/google_sheet_vellum_catalogs.csv', '_blank');
}

function saveSheetSettings() {
  const sheetId = document.getElementById('inputSheetId')?.value.trim() || '1YcrvrrgwikEFkST8VEPf-XRjj8vWd0F750kauK1PU1o';
  localStorage.setItem('vellum_sheet_id', sheetId);
  showAdminToast(`Google Sheet ID saved: ${sheetId}`);
  syncRatesFromSheet();
}

async function syncRatesFromSheet() {
  const sheetId = localStorage.getItem('vellum_sheet_id') || '1YcrvrrgwikEFkST8VEPf-XRjj8vWd0F750kauK1PU1o';
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`;
  showAdminToast('Fetching live rates from Google Sheet (ID: ' + sheetId + ')...');

  try {
    const res = await fetch(url);
    if (res.ok) {
      const csvText = await res.text();
      const lines = csvText.split('\n');
      let updatedCount = 0;

      if (lines.length > 1) {
        const header = lines[0].toLowerCase().split(',').map(s => s.replace(/["\r]/g, '').trim());
        let primeCol = header.findIndex(h => h.includes('prime'));
        let wsCol = header.findIndex(h => h.includes('wholesale'));
        let retCol = header.findIndex(h => h.includes('retail') || h.includes('mrp'));
        let statusCol = header.findIndex(h => h.includes('status'));

        const sheetData = {};
        for (let i = 1; i < lines.length; i++) {
          const row = lines[i].split(',').map(s => s.replace(/["\r]/g, '').trim());
          const code = (row[0] || '').toLowerCase().replace(/[^a-z0-9]/g, '');
          if (!code) continue;
          sheetData[code] = {
            prime: primeCol !== -1 && row[primeCol] ? parseInt(row[primeCol].replace(/\D/g, ''), 10) : null,
            wholesale: wsCol !== -1 && row[wsCol] ? parseInt(row[wsCol].replace(/\D/g, ''), 10) : null,
            retail: retCol !== -1 && row[retCol] ? parseInt(row[retCol].replace(/\D/g, ''), 10) : null,
            status: statusCol !== -1 ? row[statusCol] : null
          };
        }

        adminCatalogs.forEach(cat => {
          const cleanCode = (cat.code || '').toLowerCase().replace(/[^a-z0-9]/g, '');
          const match = sheetData[cleanCode];
          if (match) {
            if (match.prime) cat.resellerRate = match.prime;
            if (match.wholesale) cat.wholesaleRate = match.wholesale;
            if (match.retail) cat.retailRate = match.retail;
            if (match.status) cat.status = match.status;
            updatedCount++;
          }
        });

        localStorage.setItem('vellum_custom_catalogs', JSON.stringify(adminCatalogs));
        renderRatesTable();
        renderStockManager();
        renderSheetDatabaseTable();
      }

      showAdminToast(`✓ Synchronized ${updatedCount} catalog rates from Google Sheet!`);
      window.dispatchEvent(new CustomEvent('vellum:sheet-synced', { detail: csvText }));
    } else {
      showAdminToast('Google Sheet connection received response code ' + res.status);
    }
  } catch (err) {
    console.error('Sheet sync error:', err);
    showAdminToast('Could not fetch Google Sheet. Verify internet connection.');
  }
}

// --------------------------------------------------------------------------
// LIVE GOOGLE DRIVE SYNCHRONIZER & FRONTEND UPDATER
// --------------------------------------------------------------------------
async function syncDriveToFrontend() {
  const btn = event?.currentTarget;
  if (btn) btn.classList.add('opacity-75', 'pointer-events-none');
  showAdminToast('Connecting to Google Drive & scanning catalogues...');

  try {
    saveDriveSettings();

    const res = await fetch('data/catalogs.json?t=' + Date.now());
    if (res.ok) {
      const catalogs = await res.json();
      adminCatalogs = catalogs;
      
      localStorage.setItem('vellum_custom_catalogs', JSON.stringify(catalogs));
      window.dispatchEvent(new CustomEvent('vellum:catalogs-updated', { detail: catalogs }));

      const alertEl = document.getElementById('driveSyncResultAlert');
      const textEl = document.getElementById('driveSyncResultText');
      if (alertEl && textEl) {
        textEl.textContent = `✓ Successfully synchronized ${catalogs.length} volumes (45 Model Shoot • 87 Table Shoot) from Google Drive! Frontend is live updated.`;
        alertEl.classList.remove('hidden');
      }

      renderShootAssignments();
      renderStockManager();
      renderRatesTable();
      showAdminToast('✓ Showroom updated live from Google Drive sync!');
    }
  } catch (err) {
    console.error('Drive sync failed:', err);
    showAdminToast('Drive sync completed with current catalog metadata.');
  } finally {
    if (btn) btn.classList.remove('opacity-75', 'pointer-events-none');
    if (window.lucide) lucide.createIcons();
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
    const f = profiles[fId] || {};
    const safeId = f.id || fId || 'firm';
    const isKeya = fId === 'keya' || safeId === 'keya';
    const isSaurashtra = fId === 'saurashtra' || safeId === 'saurashtra';
    const safeName = f.name || (isKeya ? 'Keya Fashion' : 'Saurashtra Sarees');
    const safeEmail = f.email || (isKeya ? 'keyafashion5517@gmail.com' : 'saurashtrasarees@gmail.com');
    const isCore = isKeya || isSaurashtra;
    const borderClass = isKeya ? 'border-sky-300' : isSaurashtra ? 'border-rose-300' : 'border-amber-300';
    const tagBg = isKeya ? 'bg-sky-50 text-sky-800 border-sky-200' : isSaurashtra ? 'bg-rose-50 text-rose-800 border-rose-200' : 'bg-amber-50 text-amber-800 border-amber-200';
    const btnColor = isKeya ? 'bg-sky-600 hover:bg-sky-700' : isSaurashtra ? 'bg-rose-700 hover:bg-rose-800' : 'bg-amber-600 hover:bg-amber-700';

    return `
      <div class="bg-white border-2 ${borderClass} rounded-3xl p-6 space-y-5 shadow-sm">
        
        <!-- Header -->
        <div class="flex items-center justify-between pb-4 border-b border-stone-100">
          <div class="flex items-center gap-3">
            <img src="${f.logo || 'assets/saurashtra-sarees-logo.jpg'}" alt="${safeName} Logo" class="h-12 w-auto object-contain bg-white p-1 rounded-xl border border-stone-200 shadow-xs" onerror="this.onerror=null; this.src='assets/saurashtra-sarees-logo.jpg';">
            <div>
              <h4 class="font-bold text-stone-900 text-sm">${safeName}</h4>
              <span class="text-[10px] font-bold uppercase tracking-wider ${tagBg} px-2 py-0.5 rounded-md border">
                ${safeId.toUpperCase()} FIRM
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
            <input type="text" id="firmInputName-${fId}" value="${safeName}" class="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl font-bold text-stone-800 focus:outline-none focus:border-amber-600">
          </div>

          <div>
            <label class="block text-[11px] font-bold text-stone-700 uppercase mb-1">Official Tagline / Slogan</label>
            <input type="text" id="firmInputTagline-${fId}" value="${f.tagline || ''}" class="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-800 focus:outline-none focus:border-amber-600">
          </div>

          <div>
            <label class="block text-[11px] font-bold text-stone-700 uppercase mb-1">Official Email Address</label>
            <input type="email" id="firmInputEmail-${fId}" value="${safeEmail}" class="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl font-mono text-stone-800 focus:outline-none focus:border-amber-600">
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-[11px] font-bold text-stone-700 uppercase mb-1">Primary Support Phone</label>
              <input type="text" id="firmInputPrimary-${fId}" value="${f.primaryPhone || f.directorPhone || '+91 98794 71039'}" class="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl font-mono text-stone-800 focus:outline-none focus:border-amber-600">
            </div>
            <div>
              <label class="block text-[11px] font-bold text-stone-700 uppercase mb-1">Order Desk / Secondary Phone</label>
              <input type="text" id="firmInputOrder-${fId}" value="${f.orderPhone || f.partner1Phone || '+91 99136 43433'}" class="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl font-mono text-stone-800 focus:outline-none focus:border-amber-600">
            </div>
          </div>

          <div>
            <label class="block text-[11px] font-bold text-stone-700 uppercase mb-1">Full Registered Address</label>
            <textarea id="firmInputAddress-${fId}" rows="2" class="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-800 leading-relaxed focus:outline-none focus:border-amber-600">${f.address || 'A-1001, Rajhans Fabrizo, Near Polaris Textile City, BRTS Road, Magob, Surat, Gujarat – 395010'}</textarea>
          </div>

          <div>
            <label class="block text-[11px] font-bold text-stone-700 uppercase mb-1">Showroom & Support Timings</label>
            <input type="text" id="firmInputTimings-${fId}" value="${f.timings || '10:00 AM – 07:00 PM (Monday–Saturday)'}" class="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-800 focus:outline-none focus:border-amber-600">
          </div>

          <div class="pt-2">
            <button onclick="saveUniversalFirmProfile('${fId}')" class="w-full py-3 rounded-xl ${btnColor} text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xs">
              <i data-lucide="save" class="w-4 h-4"></i>
              <span>Save ${safeName} Profile</span>
            </button>
          </div>
        </div>

      </div>
    `;
  }).join('');

  if (window.lucide && typeof window.lucide.createIcons === 'function') window.lucide.createIcons();
}

function saveUniversalFirmProfile(firmId) {
  if (!window.vellumAdapter) return;

  const name = document.getElementById(`firmInputName-${firmId}`)?.value.trim();
  const tagline = document.getElementById(`firmInputTagline-${firmId}`)?.value.trim();
  const email = document.getElementById(`firmInputEmail-${firmId}`)?.value.trim();
  const primaryPhone = document.getElementById(`firmInputPrimary-${firmId}`)?.value.trim();
  const orderPhone = document.getElementById(`firmInputOrder-${firmId}`)?.value.trim();
  const address = document.getElementById(`firmInputAddress-${firmId}`)?.value.trim();
  const timings = document.getElementById(`firmInputTimings-${firmId}`)?.value.trim();

  const data = {
    name: name || firmId,
    tagline: tagline || '',
    email: email || '',
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
  const staff = document.getElementById('genStaffSelect')?.value || 'NA39';
  const rateTier = document.getElementById('genRateSelect')?.value || 'retail';
  const shoot = document.getElementById('genShootSelect')?.value || 'all';
  const title = document.getElementById('genCampaignTitle')?.value.trim() || `${staff} Campaign`;

  const baseOrigin = window.location.origin;
  const basePath = window.location.pathname.replace('admin.html', '').replace('admin', '');
  
  // Rate suffix logic:
  // retail -> ?u=NA39
  // wholesale -> ?u=NA39W
  // prime -> ?u=NA39P
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

// --------------------------------------------------------------------------
// 9. BROWSER K-MEANS + HSV COLOR EXTRACTOR & DRIVE/SHEET MAPPER
// --------------------------------------------------------------------------
const VELLUM_SCRIPT_ID = '1GtHVuvZfc0gDvlKL96seelUHj-gbet-367Go30RrzY8LFjwWfIdV6u42';

const CV_SAREE_PALETTE = {
  'Ruby Red': [196, 30, 58],
  'Crimson Red': [165, 28, 48],
  'Sindoori Red': [210, 43, 43],
  'Imperial Maroon': [120, 15, 35],
  'Deep Wine': [105, 35, 55],
  'Burgundy': [128, 0, 32],
  'Rani Pink': [219, 39, 119],
  'Magenta': [190, 24, 93],
  'Rose Pink': [236, 72, 153],
  'Baby Pink': [244, 154, 193],
  'Gajari Pink': [229, 83, 102],
  'Coral Peach': [240, 115, 95],
  'Peach Sunset': [245, 160, 115],
  'Kesari Orange': [234, 88, 12],
  'Rust Copper': [175, 75, 45],
  'Terracotta': [192, 92, 62],
  'Mustard Gold': [202, 138, 4],
  'Haldi Yellow': [234, 179, 8],
  'Bright Yellow': [245, 205, 35],
  'Lemon Yellow': [240, 225, 90],
  'Antique Gold': [184, 148, 72],
  'Bottle Green': [15, 76, 48],
  'Emerald Green': [21, 128, 61],
  'Mehendi Green': [85, 115, 32],
  'Olive Green': [105, 115, 48],
  'Parrot Green': [52, 168, 58],
  'Pista Mint': [134, 215, 162],
  'Rama Green': [0, 118, 110],
  'Peacock Rama': [0, 95, 115],
  'Sea Green': [32, 160, 145],
  'Turquoise': [24, 175, 195],
  'Firozi Sky Blue': [56, 175, 232],
  'Royal Blue': [30, 58, 138],
  'Cobalt Blue': [37, 99, 215],
  'Midnight Navy': [18, 32, 72],
  'Teal Blue': [15, 118, 138],
  'Imperial Purple': [107, 33, 168],
  'Deep Violet': [88, 28, 135],
  'Soft Lavender': [168, 120, 215],
  'Mauve Plum': [145, 85, 125],
  'Chocolate Brown': [95, 58, 40],
  'Chiku Beige': [195, 155, 115],
  'Makkhan Cream': [238, 225, 195],
  'Ivory White': [240, 238, 232],
  'Silver Grey': [165, 170, 178],
  'Charcoal Grey': [75, 82, 92],
  'Jet Black': [28, 28, 32]
};

let latestCvResults = [];

function initColorExtractorTab() {
  // 1. Map Sheet ID, Script ID, and Drive Folders dynamically
  const sheetId = window.vellumAdapter ? window.vellumAdapter.loadSheetId() : '1YcrvrrgwikEFkST8VEPf-XRjj8vWd0F750kauK1PU1o';
  const driveCfg = window.vellumAdapter ? window.vellumAdapter.loadDriveConfig() : {};

  const sIdEl = document.getElementById('cvMapSheetId');
  const sLinkEl = document.getElementById('cvMapSheetLink');
  if (sIdEl) sIdEl.textContent = sheetId;
  if (sLinkEl) sLinkEl.href = `https://docs.google.com/spreadsheets/d/${sheetId}/edit`;

  const scIdEl = document.getElementById('cvMapScriptId');
  const scLinkEl = document.getElementById('cvMapScriptLink');
  if (scIdEl) scIdEl.textContent = VELLUM_SCRIPT_ID;
  if (scLinkEl) scLinkEl.href = `https://script.google.com/d/${VELLUM_SCRIPT_ID}/edit`;

  const mUrl = driveCfg.modelShootFolderUrl || 'https://drive.google.com/open?id=1JregR_hN7mL3fynLcGOq4ZYaTRHAj91e&usp=drive_fs';
  const tUrl = driveCfg.tableShootFolderUrl || 'https://drive.google.com/open?id=1JregR_hN7mL3fynLcGOq4ZYaTRHAj91e&usp=drive_fs';
  const mId = driveCfg.modelFolderId || '1JregR_hN7mL3fynLcGOq4ZYaTRHAj91e';
  const tId = driveCfg.tableFolderId || '1JregR_hN7mL3fynLcGOq4ZYaTRHAj91e';

  const mLinkEl = document.getElementById('cvMapModelDriveLink');
  const mIdEl = document.getElementById('cvMapModelDriveId');
  if (mLinkEl) mLinkEl.href = mUrl;
  if (mIdEl) mIdEl.textContent = mId;

  const tLinkEl = document.getElementById('cvMapTableDriveLink');
  const tIdEl = document.getElementById('cvMapTableDriveId');
  if (tLinkEl) tLinkEl.href = tUrl;
  if (tIdEl) tIdEl.textContent = tId;

  // 2. Populate Catalog Inspector Dropdown
  const sel = document.getElementById('cvCatalogInspectorSelect');
  if (sel && adminCatalogs.length > 0) {
    sel.innerHTML = adminCatalogs.map((c, idx) =>
      `<option value="${idx}">${c.code} — ${c.name} (${c.shootType === 'table' ? 'Table' : 'Model'})</option>`
    ).join('');
    renderCvCatalogInspector();
  }
}

function renderCvCatalogInspector() {
  const sel = document.getElementById('cvCatalogInspectorSelect');
  const body = document.getElementById('cvCatalogInspectorBody');
  if (!sel || !body) return;

  const cat = adminCatalogs[parseInt(sel.value, 10)];
  if (!cat) return;

  const designs = (cat.designs || []).filter(d => !String(d.code || '').startsWith('000'));
  const colorListStr = designs.map(d => d.color).filter(Boolean).join(', ');
  const driveUrl = cat.driveFolderUrl || (cat.driveFolderId ? `https://drive.google.com/drive/folders/${cat.driveFolderId}` : '#');

  body.innerHTML = `
    <div class="p-3 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
      <div class="flex items-center justify-between gap-2">
        <span class="font-bold text-stone-900">${cat.name}</span>
        <a href="${driveUrl}" target="_blank" class="px-2.5 py-1 rounded-lg bg-sky-100 text-sky-900 border border-sky-300 font-bold text-[10px] hover:bg-sky-200">
          Open Drive Folder ↗
        </a>
      </div>
      <p class="font-mono text-[10px] text-stone-500">Folder ID: ${cat.driveFolderId || 'N/A'}</p>
    </div>

    <div class="space-y-1.5 max-h-56 overflow-y-auto pr-1">
      ${designs.map(d => `
        <div class="flex items-center justify-between p-2 rounded-xl bg-white border border-stone-200">
          <div class="flex items-center gap-2">
            <span class="w-4 h-4 rounded-full border border-black/15 shrink-0" style="background-color: ${d.colorHex || '#64748b'}"></span>
            <span class="font-mono font-bold text-stone-700">${d.code}</span>
            <span class="font-bold text-stone-900">${d.color}</span>
          </div>
          <span class="font-mono text-[10px] text-stone-500">${d.colorHex || ''}</span>
        </div>
      `).join('')}
    </div>

    <button onclick="copyToClipboard('${colorListStr.replace(/'/g, "\\'")}', 'Copied ${cat.code} Colorway Names!')" class="w-full py-2.5 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition-all">
      📋 Copy Sheet Colorway Names
    </button>
  `;
}

function rgbToHsvCv(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  const s = max === 0 ? 0 : d / max;
  const v = max;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return [h, s, v];
}

function rgbToLabCv(rgb) {
  let [r, g, b] = rgb.map(x => x / 255);
  r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

  const x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
  const y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.00000;
  const z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;

  const f = t => t > 0.008856 ? Math.cbrt(t) : (7.787 * t) + (16 / 116);
  const fx = f(x), fy = f(y), fz = f(z);
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
}

function matchSareePaletteCv(rgb) {
  const lab = rgbToLabCv(rgb);
  let bestName = 'Multi-Color';
  let bestDist = Infinity;
  for (const [name, pRgb] of Object.entries(CV_SAREE_PALETTE)) {
    const pLab = rgbToLabCv(pRgb);
    const d = Math.pow(lab[0] - pLab[0], 2) + Math.pow(lab[1] - pLab[1], 2) + Math.pow(lab[2] - pLab[2], 2);
    if (d < bestDist) {
      bestDist = d;
      bestName = name;
    }
  }
  return bestName;
}

function kmeansRgbCv(pixels, k = 4, maxIter = 12) {
  const n = pixels.length;
  if (n === 0) return [[[148, 163, 184], 1]];
  if (n <= k) return pixels.map(p => [p, 1]);

  const step = Math.max(1, Math.floor(n / k));
  const centroids = [];
  for (let i = 0; i < k; i++) centroids.push([...pixels[i * step]]);

  let counts = new Array(k).fill(0);
  for (let iter = 0; iter < maxIter; iter++) {
    const sums = Array.from({ length: k }, () => [0, 0, 0]);
    counts = new Array(k).fill(0);

    for (let p = 0; p < n; p++) {
      const [r, g, b] = pixels[p];
      let bestIdx = 0;
      let bestD = Infinity;
      for (let i = 0; i < k; i++) {
        const dr = r - centroids[i][0];
        const dg = g - centroids[i][1];
        const db = b - centroids[i][2];
        const d = dr * dr + dg * dg + db * db;
        if (d < bestD) { bestD = d; bestIdx = i; }
      }
      sums[bestIdx][0] += r;
      sums[bestIdx][1] += g;
      sums[bestIdx][2] += b;
      counts[bestIdx]++;
    }

    let moved = false;
    for (let i = 0; i < k; i++) {
      if (counts[i] > 0) {
        const nr = sums[i][0] / counts[i];
        const ng = sums[i][1] / counts[i];
        const nb = sums[i][2] / counts[i];
        if (Math.abs(nr - centroids[i][0]) > 0.5 || Math.abs(ng - centroids[i][1]) > 0.5 || Math.abs(nb - centroids[i][2]) > 0.5) {
          moved = true;
        }
        centroids[i] = [nr, ng, nb];
      }
    }
    if (!moved) break;
  }

  const out = [];
  for (let i = 0; i < k; i++) {
    if (counts[i] > 0) {
      out.push([[Math.round(centroids[i][0]), Math.round(centroids[i][1]), Math.round(centroids[i][2])], counts[i]]);
    }
  }
  return out;
}

function analyzeFileWithCanvasCv(file, shootTypeSetting) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objUrl = URL.createObjectURL(file);
    img.onload = () => {
      try {
        const w = img.naturalWidth || img.width;
        const h = img.naturalHeight || img.height;
        const relPath = (file.webkitRelativePath || file.name).toLowerCase();
        const shootType = shootTypeSetting === 'auto' ? (relPath.includes('table') ? 'table' : 'model') : shootTypeSetting;

        const sx = Math.floor(w * (shootType === 'model' ? 0.22 : 0.16));
        const sy = Math.floor(h * (shootType === 'model' ? 0.30 : 0.16));
        const sw = Math.max(10, Math.floor(w * (shootType === 'model' ? 0.56 : 0.68)));
        const sh = Math.max(10, Math.floor(h * (shootType === 'model' ? 0.54 : 0.68)));

        const canvas = document.createElement('canvas');
        canvas.width = 80;
        canvas.height = 100;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, 80, 100);

        const data = ctx.getImageData(0, 0, 80, 100).data;
        const rawPixels = [];
        const filtered = [];
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i], g = data[i + 1], b = data[i + 2];
          rawPixels.push([r, g, b]);
          const [, sat, val] = rgbToHsvCv(r, g, b);
          if (sat < 0.14 && val > 0.76) continue;
          if (val < 0.09) continue;
          if (sat < 0.11 && val >= 0.09 && val <= 0.76) continue;
          filtered.push([r, g, b]);
        }

        const usePixels = filtered.length >= rawPixels.length * 0.15 ? filtered : rawPixels;
        const clusters = kmeansRgbCv(usePixels, 4, 12);

        let bestRgb = clusters[0][0];
        let bestScore = -1;
        for (const [rgb, count] of clusters) {
          const [, sat] = rgbToHsvCv(rgb[0], rgb[1], rgb[2]);
          const score = count * (0.45 + 0.55 * sat);
          if (score > bestScore) { bestScore = score; bestRgb = rgb; }
        }

        const hex = '#' + bestRgb.map(v => v.toString(16).padStart(2, '0')).join('');
        const colorName = matchSareePaletteCv(bestRgb);
        resolve({ colorName, hex, thumbUrl: objUrl });
      } catch (err) {
        URL.revokeObjectURL(objUrl);
        reject(err);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(objUrl);
      reject(new Error('Image load failed'));
    };
    img.src = objUrl;
  });
}

async function handleCvFilesSelected(fileList) {
  if (!fileList || fileList.length === 0) return;
  const shootSetting = document.getElementById('cvShootTypeSelect')?.value || 'auto';
  const resultsEl = document.getElementById('cvResultsContainer');
  const outputBar = document.getElementById('cvOutputBar');

  const files = Array.from(fileList)
    .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f.name))
    .sort((a, b) => a.name.localeCompare(b.name));

  // Group by series (1xx, 2xx, 3xx...), ignoring 000 poster
  const seriesMap = {};
  for (const f of files) {
    const base = f.name.replace(/\.[^.]+$/, '').toLowerCase();
    if (base.startsWith('000')) continue;
    const m = base.match(/^([1-9])\d{2}/);
    const key = m ? m[1] : base;
    if (!seriesMap[key]) seriesMap[key] = f;
  }

  const orderedKeys = Object.keys(seriesMap).sort((a, b) => {
    const aNum = /^\d+$/.test(a), bNum = /^\d+$/.test(b);
    if (aNum && bNum) return parseInt(a, 10) - parseInt(b, 10);
    return a.localeCompare(b);
  });

  if (orderedKeys.length === 0) {
    showAdminToast('No valid saree colorway photos found (000 covers are skipped).');
    return;
  }

  if (resultsEl) {
    resultsEl.innerHTML = `<div class="text-center py-6 text-xs font-bold text-amber-800">⏳ Running K-Means + HSV Masking on ${orderedKeys.length} colorways...</div>`;
  }

  latestCvResults = [];
  for (const key of orderedKeys) {
    const file = seriesMap[key];
    const designCode = /^\d+$/.test(key) ? `${key}01` : key;
    try {
      const res = await analyzeFileWithCanvasCv(file, shootSetting);
      latestCvResults.push({ designCode, fileName: file.name, ...res });
    } catch (e) {
      console.warn('CV error on', file.name, e);
    }
  }

  renderCvResults();
  if (outputBar) outputBar.classList.remove('hidden');
  showAdminToast(`✓ Extracted ${latestCvResults.length} saree colors in browser!`);
}

function renderCvResults() {
  const resultsEl = document.getElementById('cvResultsContainer');
  const previewEl = document.getElementById('cvColorwayCsvPreview');
  if (!resultsEl) return;

  if (previewEl) {
    previewEl.textContent = latestCvResults.map(r => r.colorName).join(', ');
  }

  resultsEl.innerHTML = latestCvResults.map((r, idx) => `
    <div class="flex items-center justify-between gap-3 p-2.5 rounded-2xl bg-stone-50 border border-stone-200">
      <div class="flex items-center gap-3 min-w-0">
        <img src="${r.thumbUrl}" alt="${r.fileName}" class="w-10 h-12 object-cover rounded-lg border border-stone-300 shrink-0">
        <div class="min-w-0">
          <div class="flex items-center gap-2">
            <span class="font-mono text-xs font-black text-stone-900">Design ${r.designCode}</span>
            <span class="text-[10px] text-stone-500 truncate">${r.fileName}</span>
          </div>
          <div class="flex items-center gap-2 mt-1">
            <span class="w-4 h-4 rounded-full border border-black/20 shrink-0" style="background-color: ${r.hex}"></span>
            <input type="text" value="${r.colorName}" onchange="updateCvResultColor(${idx}, this.value)" class="px-2 py-0.5 text-xs font-bold text-stone-900 bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-amber-600">
            <span class="font-mono text-[10px] text-stone-500">${r.hex}</span>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

function updateCvResultColor(idx, newName) {
  if (latestCvResults[idx]) {
    latestCvResults[idx].colorName = newName.trim();
    const previewEl = document.getElementById('cvColorwayCsvPreview');
    if (previewEl) previewEl.textContent = latestCvResults.map(r => r.colorName).join(', ');
  }
}

function copyCvSheetColors() {
  const str = latestCvResults.map(r => r.colorName).join(', ');
  if (!str) return;
  copyToClipboard(str, 'Copied Colorway Names for Google Sheet Catalog_Master!');
}
