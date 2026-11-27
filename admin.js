// ==========================================================================
// VELLUM — Super-Admin Logic & Dedicated Staff Links Matrix
// Architecture & Engineering by BinduGrid Studio
// ==========================================================================

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
  await loadAdminCatalogs();
  initCustomGenerator();
  renderRatesTable();

  if (window.lucide) lucide.createIcons();
});

function switchTab(tabId) {
  const tabs = ['hub', 'generator', 'rates', 'firms'];
  tabs.forEach(t => {
    const content = document.getElementById(`tabContent-${t}`);
    const btn = document.getElementById(`tabBtn-${t}`);

    if (t === tabId) {
      if (content) content.classList.remove('hidden');
      if (btn) btn.className = 'px-4 py-2 rounded-xl font-bold bg-amber-500 text-slate-950 shadow-xs whitespace-nowrap';
    } else {
      if (content) content.classList.add('hidden');
      if (btn) btn.className = 'px-4 py-2 rounded-xl font-medium text-slate-400 hover:text-white whitespace-nowrap';
    }
  });

  if (window.lucide) lucide.createIcons();
}

// --------------------------------------------------------------------------
// RENDER STAFF LINKS HUB
// --------------------------------------------------------------------------
function renderStaffHub() {
  const keyaGrid = document.getElementById('gridKeyaRetail');
  const saurashtraRetailGrid = document.getElementById('gridSaurashtraRetail');
  const saurashtraAllGrid = document.getElementById('gridSaurashtraAllRates');

  const keyaList = STAFF_PROFILES.filter(s => s.firm === 'keya' && s.rateType === 'retail');
  const saurashtraRetailList = STAFF_PROFILES.filter(s => s.firm === 'saurashtra' && s.rateType === 'retail');
  const saurashtraAllList = STAFF_PROFILES.filter(s => s.rateType === 'all');

  const baseOrigin = window.location.origin;
  const basePath = window.location.pathname.replace('admin.html', '').replace('admin', '');

  const renderCard = (staff) => {
    const link = `${baseOrigin}${basePath}?u=${staff.code}`;
    const badgeBg = staff.rateType === 'all' 
      ? 'bg-amber-400 text-slate-950' 
      : (staff.firm === 'keya' ? 'bg-sky-500 text-white' : 'bg-rose-500 text-white');

    const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      `🥻 ${staff.firmName.toUpperCase()} — DIGITAL TEXTILE SHOWROOM 🥻\n\nPlease view our latest saree catalog here:\n${link}\n\nRepresentative: ${staff.name} (${staff.displayPhone})`
    )}`;

    return `
      <div class="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all shadow-md group">
        <div>
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-mono font-extrabold px-3 py-1 rounded-xl shadow-xs ${badgeBg}">
              ${staff.code}
            </span>
            <span class="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              ${staff.letter}. ${staff.firmName}
            </span>
          </div>

          <h4 class="font-serif text-lg font-bold text-white">${staff.name}</h4>
          <p class="text-xs text-amber-300 font-mono mt-0.5 flex items-center gap-1.5">
            <i data-lucide="phone" class="w-3.5 h-3.5"></i> ${staff.displayPhone}
          </p>
          <p class="text-[11px] text-slate-400 mt-1">${staff.rateLabel}</p>

          <!-- Direct Clickable URL Box -->
          <div class="mt-3.5 p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
            <span class="text-[9px] uppercase tracking-wider text-slate-500 font-bold block">Live Dedicated URL</span>
            <a href="${link}" target="_blank" class="block text-xs font-mono text-amber-300 hover:underline break-all font-semibold">
              ${link}
            </a>
          </div>
        </div>

        <div class="space-y-2 pt-2 border-t border-slate-800/80">
          <div class="grid grid-cols-2 gap-2">
            <button onclick="copyToClipboard('${link}', 'Link for ${staff.code} copied!')" class="py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-xs">
              <i data-lucide="copy" class="w-3.5 h-3.5"></i>
              <span>Copy Link</span>
            </button>

            <a href="${link}" target="_blank" class="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-all text-center">
              <span>Open ↗</span>
            </a>
          </div>

          <a href="${whatsappShareUrl}" target="_blank" class="w-full py-2 px-3 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all">
            <i data-lucide="send" class="w-3.5 h-3.5"></i>
            <span>Share directly on WhatsApp</span>
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
// TAB 2: DEEP-LINK GENERATOR
// --------------------------------------------------------------------------
async function loadAdminCatalogs() {
  try {
    const res = await fetch('data/catalogs.json');
    if (res.ok) {
      adminCatalogs = await res.json();
    }
  } catch (e) {
    console.warn('Could not load catalogs:', e);
  }
}

function initCustomGenerator() {
  const staffSelect = document.getElementById('genStaffSelect');
  if (staffSelect) {
    staffSelect.innerHTML = STAFF_PROFILES.map(s => {
      return `<option value="${s.code}">[${s.code}] ${s.name} — ${s.firmName} (${s.displayPhone})</option>`;
    }).join('');
  }

  const catSelect = document.getElementById('genCatalogSelect');
  if (catSelect) {
    catSelect.innerHTML = `
      <option value="">-- Open Full Collection (Showroom Home) --</option>
      ${adminCatalogs.map(c => `<option value="${c.code.toLowerCase()}">${c.name} (${c.code}) — ${c.category}</option>`).join('')}
    `;
  }

  updateCustomLink();
}

function updateCustomLink() {
  const staffCode = document.getElementById('genStaffSelect')?.value || 'KH28';
  const catCode = document.getElementById('genCatalogSelect')?.value || '';
  const shootRadio = document.querySelector('input[name="genShoot"]:checked');
  const shoot = shootRadio ? shootRadio.value : 'all';

  const staff = STAFF_PROFILES.find(s => s.code === staffCode) || STAFF_PROFILES[0];

  const baseOrigin = window.location.origin;
  const basePath = window.location.pathname.replace('admin.html', '').replace('admin', '');
  
  let url = `${baseOrigin}${basePath}?u=${staff.code}`;
  if (shoot !== 'all') {
    url += `&shoot=${shoot}`;
  }
  if (catCode) {
    url += `#catalog/${catCode}`;
  }

  const urlDisplay = document.getElementById('customGeneratedUrlText');
  if (urlDisplay) urlDisplay.textContent = url;

  const testBtn = document.getElementById('customTestLinkBtn');
  if (testBtn) testBtn.href = url;

  document.getElementById('genPreviewStaff').textContent = `${staff.name} (${staff.displayPhone})`;
  document.getElementById('genPreviewFirm').textContent = staff.firmName;
  document.getElementById('genPreviewRate').textContent = staff.rateLabel;
  document.getElementById('genPreviewFirmBadge').textContent = staff.firmName;
  document.getElementById('genPreviewFirmBadge').className = staff.firm === 'keya' 
    ? 'text-[10px] font-bold px-2 py-0.5 rounded bg-brand-sky text-white' 
    : 'text-[10px] font-bold px-2 py-0.5 rounded bg-brand-maroon text-white';
}

function copyCustomLink() {
  const url = document.getElementById('customGeneratedUrlText')?.textContent || '';
  copyToClipboard(url, 'Smart Link copied to clipboard!');
}

// --------------------------------------------------------------------------
// TAB 3: RATES & STOCK EDITOR
// --------------------------------------------------------------------------
function renderRatesTable() {
  const tbody = document.getElementById('adminRatesTableBody');
  if (!tbody) return;

  tbody.innerHTML = adminCatalogs.map((cat) => {
    return `
      <tr class="hover:bg-slate-950/60 transition-colors">
        <td class="py-3 px-4 font-semibold text-white">
          <div class="font-serif">${cat.name}</div>
          <div class="text-[10px] font-mono text-slate-400">${cat.code}</div>
        </td>
        <td class="py-3 px-4 text-slate-400">${cat.category}</td>
        <td class="py-3 px-4">${cat.skuCount} Shades</td>
        <td class="py-3 px-4">
          <input 
            type="number" 
            id="rate-ws-${cat.code}" 
            value="${cat.wholesaleRate}" 
            class="w-24 px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-emerald-400 font-mono font-bold focus:border-amber-400 text-xs"
          >
        </td>
        <td class="py-3 px-4">
          <input 
            type="number" 
            id="rate-res-${cat.code}" 
            value="${cat.resellerRate}" 
            class="w-24 px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-blue-400 font-mono font-bold focus:border-amber-400 text-xs"
          >
        </td>
        <td class="py-3 px-4">
          <input 
            type="number" 
            id="rate-ret-${cat.code}" 
            value="${cat.retailRate}" 
            class="w-24 px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-purple-400 font-mono font-bold focus:border-amber-400 text-xs"
          >
        </td>
        <td class="py-3 px-4">
          <select id="status-${cat.code}" class="px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs">
            <option value="Ready to Dispatch" ${cat.status === 'Ready to Dispatch' ? 'selected' : ''}>Ready to Dispatch</option>
            <option value="Limited Stock" ${cat.status === 'Limited Stock' ? 'selected' : ''}>Limited Stock</option>
            <option value="Sold Out" ${cat.status === 'Sold Out' ? 'selected' : ''}>Sold Out</option>
          </select>
        </td>
      </tr>
    `;
  }).join('');
}

function saveRatesChanges() {
  adminCatalogs.forEach(cat => {
    const wsInput = document.getElementById(`rate-ws-${cat.code}`);
    const resInput = document.getElementById(`rate-res-${cat.code}`);
    const retInput = document.getElementById(`rate-ret-${cat.code}`);
    const statusSelect = document.getElementById(`status-${cat.code}`);

    if (wsInput) cat.wholesaleRate = parseInt(wsInput.value) || cat.wholesaleRate;
    if (resInput) cat.resellerRate = parseInt(resInput.value) || cat.resellerRate;
    if (retInput) cat.retailRate = parseInt(retInput.value) || cat.retailRate;
    if (statusSelect) cat.status = statusSelect.value;
  });

  showToast('✓ Pricing and stock status updated successfully!');
}

// --------------------------------------------------------------------------
// BULLETPROOF CLIPBOARD COPY (WITH FALLBACK)
// --------------------------------------------------------------------------
function copyToClipboard(text, successMsg) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(successMsg || 'Copied to clipboard! ✓');
    }).catch(() => fallbackCopy(text, successMsg));
  } else {
    fallbackCopy(text, successMsg);
  }
}

function fallbackCopy(text, successMsg) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-9999px';
  textArea.style.top = '-9999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    const successful = document.execCommand('copy');
    if (successful) {
      showToast(successMsg || 'Copied to clipboard! ✓');
    } else {
      prompt('Copy this link manually:', text);
    }
  } catch (err) {
    prompt('Copy this link manually:', text);
  }
  document.body.removeChild(textArea);
}

function showToast(msg) {
  const toast = document.getElementById('adminToast');
  const toastMsg = document.getElementById('adminToastMsg');
  if (toast && toastMsg) {
    toastMsg.textContent = msg;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 3500);
  }
}
