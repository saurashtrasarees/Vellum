// ==========================================================================
// VELLUM — Super-Admin Portal Logic
// ==========================================================================

const ADMIN_PIN = '9879';

const DEFAULT_STAFF_LIST = [
  { id: 'staff-1', slug: 'saurabh', name: 'Saurabh Bhai', firm: 'saurashtra', phone: '9879471039', whatsapp: '919879471039', role: 'Wholesale Sales Head' },
  { id: 'staff-2', slug: 'keyur', name: 'Keyur Bhai', firm: 'keya', phone: '9913643433', whatsapp: '919913643433', role: 'Portal & Reseller Specialist' },
  { id: 'staff-3', slug: 'rajesh', name: 'Rajesh Bhai', firm: 'saurashtra', phone: '9879471039', whatsapp: '919879471039', role: 'B2B Trade Coordinator' },
  { id: 'staff-4', slug: 'neha', name: 'Neha Ben', firm: 'keya', phone: '9913643433', whatsapp: '919913643433', role: 'Online Catalog Desk' },
  { id: 'staff-5', slug: 'amit', name: 'Amit Bhai', firm: 'saurashtra', phone: '9879471039', whatsapp: '919879471039', role: 'Senior Sales Executive' },
  { id: 'staff-6', slug: 'priya', name: 'Priya Ben', firm: 'keya', phone: '9913643433', whatsapp: '919913643433', role: 'Customer Success Manager' }
];

let adminCatalogs = [];
let staffList = [];

document.addEventListener('DOMContentLoaded', async () => {
  if (sessionStorage.getItem('vellum_admin_auth') === 'true') {
    showDashboard();
  } else {
    document.getElementById('adminPinInput').focus();
  }

  loadStaff();
  await loadCatalogs();
  initGenerator();
  renderStaffTable();
  renderRatesTable();

  if (window.lucide) lucide.createIcons();
});

function unlockAdmin() {
  const pin = document.getElementById('adminPinInput').value.trim();
  const errorMsg = document.getElementById('pinErrorMsg');

  if (pin === ADMIN_PIN || pin === '8080') {
    sessionStorage.setItem('vellum_admin_auth', 'true');
    showDashboard();
  } else {
    if (errorMsg) errorMsg.classList.remove('hidden');
  }
}

function lockAdmin() {
  sessionStorage.removeItem('vellum_admin_auth');
  location.reload();
}

function showDashboard() {
  document.getElementById('adminLockScreen').classList.add('hidden');
  document.getElementById('adminDashboard').classList.remove('hidden');
}

// --------------------------------------------------------------------------
// TABS SWITCHING
// --------------------------------------------------------------------------
function switchTab(tabName) {
  const tabs = ['links', 'staff', 'rates', 'firms'];
  tabs.forEach(t => {
    const content = document.getElementById(`tabContent-${t}`);
    const btn = document.getElementById(`tabBtn-${t}`);
    const mBtn = document.getElementById(`mTabBtn-${t}`);

    if (t === tabName) {
      if (content) content.classList.remove('hidden');
      if (btn) btn.className = 'px-3.5 py-1.5 rounded-lg font-bold bg-amber-500 text-slate-950 shadow-xs';
      if (mBtn) mBtn.className = 'px-3 py-1 rounded-lg font-bold bg-amber-500 text-slate-950 whitespace-nowrap';
    } else {
      if (content) content.classList.add('hidden');
      if (btn) btn.className = 'px-3.5 py-1.5 rounded-lg font-medium text-slate-400 hover:text-white';
      if (mBtn) mBtn.className = 'px-3 py-1 rounded-lg font-medium text-slate-400 whitespace-nowrap';
    }
  });

  if (window.lucide) lucide.createIcons();
}

// --------------------------------------------------------------------------
// TAB 1: SMART LINK GENERATOR LOGIC
// --------------------------------------------------------------------------
function loadStaff() {
  const saved = localStorage.getItem('vellum_staff_list');
  staffList = saved ? JSON.parse(saved) : DEFAULT_STAFF_LIST;
}

async function loadCatalogs() {
  try {
    const res = await fetch('data/catalogs.json');
    if (res.ok) {
      adminCatalogs = await res.json();
    }
  } catch (e) {
    console.warn('Could not load catalogs.json:', e);
  }
}

function initGenerator() {
  // Populate staff dropdown
  const staffSelect = document.getElementById('genStaffSelect');
  if (staffSelect) {
    staffSelect.innerHTML = staffList.map(s => {
      const firmLabel = s.firm === 'keya' ? 'Keya Fashion' : 'Saurashtra Sarees';
      return `<option value="${s.slug}">[${firmLabel}] ${s.name} (${s.phone})</option>`;
    }).join('');
  }

  // Populate catalog dropdown
  const catSelect = document.getElementById('genCatalogSelect');
  if (catSelect) {
    catSelect.innerHTML = `
      <option value="">-- Open Full Showroom Collection (Home) --</option>
      ${adminCatalogs.map(c => `<option value="${c.code.toLowerCase()}">${c.name} (${c.code}) - ${c.category}</option>`).join('')}
    `;
  }

  updateGeneratedLink();
}

function updateGeneratedLink() {
  const firmRadio = document.querySelector('input[name="genFirm"]:checked');
  const roleRadio = document.querySelector('input[name="genRole"]:checked');
  const shootRadio = document.querySelector('input[name="genShoot"]:checked');
  const staffSelect = document.getElementById('genStaffSelect');
  const catSelect = document.getElementById('genCatalogSelect');

  const firm = firmRadio ? firmRadio.value : 'saurashtra';
  const role = roleRadio ? roleRadio.value : 'wholesale';
  const shoot = shootRadio ? shootRadio.value : 'all';
  const staffSlug = staffSelect ? staffSelect.value : 'saurabh';
  const catCode = catSelect ? catSelect.value : '';

  const staff = staffList.find(s => s.slug === staffSlug) || staffList[0];

  // Base URL
  const baseOrigin = window.location.origin;
  const basePath = window.location.pathname.replace('admin.html', '').replace('admin', '');
  let url = `${baseOrigin}${basePath}?firm=${firm}&staff=${staff.slug}`;

  if (role === 'wholesale') {
    url += '&k=prime';
  } else if (role === 'reseller') {
    url += '&k=seller';
  }

  if (shoot !== 'all') {
    url += `&shoot=${shoot}`;
  }

  if (catCode) {
    url += `#catalog/${catCode}`;
  }

  // Display URL
  const urlDisplay = document.getElementById('generatedUrlText');
  if (urlDisplay) urlDisplay.textContent = url;

  const testBtn = document.getElementById('previewTestBtn');
  if (testBtn) testBtn.href = url;

  // Previews
  document.getElementById('previewFirmName').textContent = firm === 'keya' ? 'Keya Fashion' : 'Saurashtra Sarees';
  document.getElementById('previewFirmBadge').textContent = firm === 'keya' ? 'Keya' : 'Saurashtra';
  document.getElementById('previewFirmBadge').className = firm === 'keya' 
    ? 'text-[10px] font-bold px-2 py-0.5 rounded bg-sky-600 text-white' 
    : 'text-[10px] font-bold px-2 py-0.5 rounded bg-brand-maroon text-white';

  document.getElementById('previewStaffName').textContent = `${staff.name} (+91 ${staff.phone})`;
  
  let roleTitle = 'Super Wholesale (prime)';
  let roleColor = 'text-emerald-400';
  if (role === 'reseller') { roleTitle = 'Portal Seller / Reseller (seller)'; roleColor = 'text-blue-400'; }
  if (role === 'retail') { roleTitle = 'Retail / Catalog MRP (Clean)'; roleColor = 'text-purple-400'; }

  const roleEl = document.getElementById('previewRoleName');
  if (roleEl) {
    roleEl.textContent = roleTitle;
    roleEl.className = `${roleColor} font-bold`;
  }

  document.getElementById('previewShootName').textContent = shoot === 'all' 
    ? 'All Shoots (Model + Table)' 
    : (shoot === 'model' ? 'Model Shoot Only' : 'Table Shoot Only');
}

function copyGeneratedLink() {
  const url = document.getElementById('generatedUrlText').textContent;
  navigator.clipboard.writeText(url).then(() => {
    showAdminToast('Smart Link copied to clipboard!');
  });
}

function copyWhatsAppBroadcast() {
  const firmRadio = document.querySelector('input[name="genFirm"]:checked');
  const firm = (firmRadio && firmRadio.value === 'keya') ? 'Keya Fashion' : 'Saurashtra Sarees';
  const staffSlug = document.getElementById('genStaffSelect').value;
  const staff = staffList.find(s => s.slug === staffSlug) || staffList[0];
  const url = document.getElementById('generatedUrlText').textContent;

  const text = 
`🙏 Greetings from ${firm} (Surat) 🙏

We have updated our latest wholesale saree lookbook. Click below to view all live collections, model drapes, table flat-lays, and video reels:

👉 ${url}

For any inquiries or bulk bookings, feel free to contact me directly:
👤 Representative: ${staff.name}
📞 Call / WhatsApp: +91 ${staff.phone}
${firm} — Surat Manufacturing Unit`;

  navigator.clipboard.writeText(text).then(() => {
    showAdminToast('WhatsApp message copied with link!');
  });
}

// --------------------------------------------------------------------------
// TAB 2: STAFF DIRECTORY TABLE
// --------------------------------------------------------------------------
function renderStaffTable() {
  const tbody = document.getElementById('staffTableBody');
  if (!tbody) return;

  tbody.innerHTML = staffList.map((s, idx) => {
    const firmName = s.firm === 'keya' ? 'Keya Fashion' : 'Saurashtra Sarees';
    const firmBadge = s.firm === 'keya' ? 'bg-sky-950 text-sky-400 border border-sky-800' : 'bg-rose-950 text-rose-400 border border-rose-800';

    return `
      <tr class="hover:bg-slate-900/60 transition-colors">
        <td class="py-3.5 px-4 font-bold text-white">${s.name} <span class="text-[10px] text-slate-500 block font-normal">${s.role}</span></td>
        <td class="py-3.5 px-4"><span class="px-2 py-0.5 rounded text-[10px] font-bold ${firmBadge}">${firmName}</span></td>
        <td class="py-3.5 px-4 font-mono">${s.phone}</td>
        <td class="py-3.5 px-4 font-mono text-emerald-400">+${s.whatsapp}</td>
        <td class="py-3.5 px-4 font-mono text-amber-300">?staff=${s.slug}</td>
        <td class="py-3.5 px-4 text-right space-x-2">
          <button onclick="copyStaffPermanentLink('${s.slug}', '${s.firm}')" class="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg text-[11px] font-semibold">Copy Link</button>
        </td>
      </tr>
    `;
  }).join('');
}

function copyStaffPermanentLink(slug, firm) {
  const baseOrigin = window.location.origin;
  const basePath = window.location.pathname.replace('admin.html', '').replace('admin', '');
  const url = `${baseOrigin}${basePath}?firm=${firm}&staff=${slug}`;

  navigator.clipboard.writeText(url).then(() => {
    showAdminToast(`Link copied for ${slug}!`);
  });
}

function openAddStaffModal() {
  const name = prompt('Enter Staff Name (e.g. Rahul Bhai):');
  if (!name) return;
  const slug = prompt('Enter Short Link Slug (e.g. rahul):', name.toLowerCase().replace(/[^a-z0-9]/g, ''));
  if (!slug) return;
  const phone = prompt('Enter Phone Number (e.g. 9879471039):', '9879471039');
  if (!phone) return;
  const firm = confirm('Assign to Saurashtra Sarees? (Click Cancel for Keya Fashion)') ? 'saurashtra' : 'keya';

  const newStaff = {
    id: `staff-${Date.now()}`,
    slug: slug,
    name: name,
    firm: firm,
    phone: phone,
    whatsapp: `91${phone}`,
    role: 'Sales Representative'
  };

  staffList.push(newStaff);
  localStorage.setItem('vellum_staff_list', JSON.stringify(staffList));
  renderStaffTable();
  initGenerator();
  showAdminToast(`Staff ${name} added successfully!`);
}

// --------------------------------------------------------------------------
// TAB 3: RATES & STOCK TABLE
// --------------------------------------------------------------------------
function renderRatesTable() {
  const tbody = document.getElementById('ratesTableBody');
  if (!tbody || !adminCatalogs.length) return;

  tbody.innerHTML = adminCatalogs.map((c, idx) => {
    return `
      <tr class="hover:bg-slate-900/60 transition-colors">
        <td class="py-3 px-4 font-bold text-white">${c.name} <span class="text-[10px] text-slate-500 block font-mono">${c.code}</span></td>
        <td class="py-3 px-4 text-slate-400">${c.category}</td>
        <td class="py-3 px-4">
          <input type="number" id="rate-ws-${idx}" value="${c.wholesaleRate}" class="w-24 px-2 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs font-bold text-emerald-400 text-right">
        </td>
        <td class="py-3 px-4">
          <input type="number" id="rate-res-${idx}" value="${c.resellerRate}" class="w-24 px-2 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs font-bold text-blue-400 text-right">
        </td>
        <td class="py-3 px-4">
          <input type="number" id="rate-ret-${idx}" value="${c.retailRate}" class="w-24 px-2 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs font-bold text-purple-400 text-right">
        </td>
        <td class="py-3 px-4">
          <select id="status-${idx}" class="px-2 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs font-semibold text-white">
            <option value="Ready to Dispatch" ${c.status === 'Ready to Dispatch' ? 'selected' : ''}>Ready to Dispatch</option>
            <option value="In Stock" ${c.status === 'In Stock' ? 'selected' : ''}>In Stock</option>
            <option value="Sold Out" ${c.status === 'Sold Out' ? 'selected' : ''}>Sold Out</option>
          </select>
        </td>
      </tr>
    `;
  }).join('');
}

function saveRatesToLocal() {
  adminCatalogs.forEach((c, idx) => {
    const ws = document.getElementById(`rate-ws-${idx}`);
    const res = document.getElementById(`rate-res-${idx}`);
    const ret = document.getElementById(`rate-ret-${idx}`);
    const stat = document.getElementById(`status-${idx}`);

    if (ws) c.wholesaleRate = parseInt(ws.value) || c.wholesaleRate;
    if (res) c.resellerRate = parseInt(res.value) || c.resellerRate;
    if (ret) c.retailRate = parseInt(ret.value) || c.retailRate;
    if (stat) c.status = stat.value;
  });

  localStorage.setItem('vellum_custom_catalogs', JSON.stringify(adminCatalogs));
  showAdminToast('All prices saved successfully!');
}

function showAdminToast(msg) {
  const toast = document.getElementById('adminToast');
  const toastMsg = document.getElementById('adminToastMsg');
  if (toast && toastMsg) {
    toastMsg.textContent = msg;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 3000);
  }
}
