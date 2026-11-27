// ==============================================================================
// VELLUM — Supabase & Cloud Storage Data Adapter
// Realtime Sync, Dynamic Google Drive Folders & Granular Stock State
// ==============================================================================

const STORAGE_KEYS = {
  SUPABASE_CONFIG: 'vellum_supabase_config',
  DRIVE_FOLDERS: 'vellum_drive_folders',
  STOCK_OVERRIDES: 'vellum_stock_overrides',
  CUSTOM_RATES: 'vellum_custom_rates',
  FIRM_PROFILES: 'vellum_firm_profiles',
  STAFF_PROFILES: 'vellum_staff_profiles',
  SAVED_LINKS: 'vellum_saved_links',
};

// Default Cloud Drive Shoot Folders
const DEFAULT_DRIVE_CONFIG = {
  modelShootFolderUrl: 'https://drive.google.com/open?id=1JregR_hN7mL3fynLcGOq4ZYaTRHAj91e&usp=drive_fs',
  tableShootFolderUrl: 'https://drive.google.com/open?id=1JregR_hN7mL3fynLcGOq4ZYaTRHAj91e&usp=drive_fs',
  modelFolderId: '1JregR_hN7mL3fynLcGOq4ZYaTRHAj91e',
  tableFolderId: '1JregR_hN7mL3fynLcGOq4ZYaTRHAj91e',
  lastUpdated: new Date().toISOString()
};

// Default Supabase Credentials (Pre-wired & Enabled)
const DEFAULT_SUPABASE_CONFIG = {
  url: 'https://rdjnbuhmfragtdrfbarc.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkam5idWhtZnJhZ3RkcmZiYXJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTU3NTcyNzMsImV4cCI6MjExMTMzMzI3M30.91xoJnemrWCsXrNT-lDRPNP9E36nsA902Ac4Wg_8Bu0',
  isEnabled: true
};

// Default Universal Firm Configuration with Verified Surat Address
const DEFAULT_FIRM_PROFILES = {
  keya: {
    id: 'keya',
    name: 'Keya Fashion',
    tagline: 'Stop wishing. Start living....',
    address: 'A-1001, Rajhans Fabrizo, Near Polaris Textile City, BRTS Road, Magob, Surat, Gujarat – 395010',
    timings: '09:00 AM–07:00 PM (Monday–Saturday)',
    primaryPhone: '+91 98254 52528',
    orderPhone: '+91 99094 52528',
    whatsapp: '919825452528',
    themeClass: 'theme-keya',
    accentColor: '#f59e0b',
    logo: 'assets/keya-fashion-logo.jpg',
    lastUpdated: new Date().toISOString()
  },
  saurashtra: {
    id: 'saurashtra',
    name: 'Saurashtra Sarees',
    tagline: 'Make Occasion Better',
    address: 'A-1001, Rajhans Fabrizo, Near Polaris Textile City, BRTS Road, Magob, Surat, Gujarat – 395010',
    timings: '09:00 AM–07:00 PM (Monday–Saturday)',
    primaryPhone: '+91 98249 82338',
    orderPhone: '+91 98794 71039',
    secondaryPhone: '+91 99136 43433',
    whatsapp: '919879471039',
    themeClass: 'theme-saurashtra',
    accentColor: '#8b1d40',
    logo: 'assets/saurashtra-sarees-logo.jpg',
    lastUpdated: new Date().toISOString()
  }
};

// Default Verified Sales Staff Profiles (A through H)
const DEFAULT_STAFF_PROFILES = [
  // 1. Keya Fashion
  {
    code: 'KH28',
    name: 'Khushi',
    letter: 'A',
    phone: '9825452528',
    displayPhone: '+91 98254 52528',
    whatsapp: '919825452528',
    firm: 'keya',
    firmName: 'Keya Fashion',
    title: 'Dedicated Catalog Representative'
  },
  {
    code: 'AN26',
    name: 'Anshika',
    letter: 'B',
    phone: '9825452526',
    displayPhone: '+91 98254 52526',
    whatsapp: '919825452526',
    firm: 'keya',
    firmName: 'Keya Fashion',
    title: 'Client Relationship Executive'
  },
  {
    code: 'PR28',
    name: 'Priti',
    letter: 'C',
    phone: '9909352528',
    displayPhone: '+91 99093 52528',
    whatsapp: '919909352528',
    firm: 'keya',
    firmName: 'Keya Fashion',
    title: 'Customer Sales Coordinator'
  },
  {
    code: 'PA28',
    name: 'Palak',
    letter: 'D',
    phone: '9909452528',
    displayPhone: '+91 99094 52528',
    whatsapp: '919909452528',
    firm: 'keya',
    firmName: 'Keya Fashion',
    title: 'Order Desk Manager'
  },
  {
    code: 'JE04',
    name: 'Jenish',
    letter: 'E',
    phone: '9033808104',
    displayPhone: '+91 90338 08104',
    whatsapp: '919033808104',
    firm: 'keya',
    firmName: 'Keya Fashion',
    title: 'Digital Sales Executive'
  },

  // 2. Saurashtra Sarees
  {
    code: 'AR38',
    name: 'Arvind Sir',
    letter: 'F',
    phone: '9824982338',
    displayPhone: '+91 98249 82338',
    whatsapp: '919824982338',
    firm: 'saurashtra',
    firmName: 'Saurashtra Sarees',
    title: 'Senior Sales Director'
  },
  {
    code: 'NA39',
    name: 'Nayan Sir',
    letter: 'G',
    phone: '9879471039',
    displayPhone: '+91 98794 71039',
    whatsapp: '919879471039',
    firm: 'saurashtra',
    firmName: 'Saurashtra Sarees',
    title: 'Managing Partner'
  },
  {
    code: 'CH33',
    name: 'Chetan Sir',
    letter: 'H',
    phone: '9913643433',
    displayPhone: '+91 99136 43433',
    whatsapp: '919913643433',
    firm: 'saurashtra',
    firmName: 'Saurashtra Sarees',
    title: 'Executive Director'
  }
];

class VellumDataAdapter {
  constructor() {
    this.driveConfig = this.loadDriveConfig();
    this.stockOverrides = this.loadStockOverrides();
    this.firmProfiles = this.loadFirmProfiles();
    this.supabaseConfig = this.loadSupabaseConfig();
    this.supabaseClient = null;
    this.initSupabaseClient();
  }

  // 1. Google Drive Shoot Folders
  loadDriveConfig() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DRIVE_FOLDERS);
      if (saved) return { ...DEFAULT_DRIVE_CONFIG, ...JSON.parse(saved) };
    } catch (e) {
      console.warn('Failed to parse drive config from localStorage', e);
    }
    return { ...DEFAULT_DRIVE_CONFIG };
  }

  saveDriveConfig(config) {
    this.driveConfig = {
      ...this.driveConfig,
      ...config,
      lastUpdated: new Date().toISOString()
    };
    try {
      localStorage.setItem(STORAGE_KEYS.DRIVE_FOLDERS, JSON.stringify(this.driveConfig));
      window.dispatchEvent(new CustomEvent('vellum:drive-updated', { detail: this.driveConfig }));
      this.syncToSupabaseIfConnected('drive_shoot_folders', this.driveConfig);
      return true;
    } catch (e) {
      console.error('Error saving drive config:', e);
      return false;
    }
  }

  // 2. Granular Stock State Management (Catalog + Color level)
  // schema:
  // {
  //   catalogs: { [catalogId]: 'in_stock' | 'temp_out_of_stock' | 'perm_out_of_stock' },
  //   colors: { [`${catalogId}_${designCode}`]: 'in_stock' | 'sold_out' }
  // }
  loadStockOverrides() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STOCK_OVERRIDES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse stock overrides', e);
    }
    return { catalogs: {}, colors: {} };
  }

  // Shoot Assignments: { [catalogId]: 'model' | 'table' | 'both' }
  loadShootAssignments() {
    try {
      const saved = localStorage.getItem('vellum_shoot_assignments');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse shoot assignments', e);
    }
    return {};
  }

  saveShootAssignments(assignments) {
    try {
      localStorage.setItem('vellum_shoot_assignments', JSON.stringify(assignments));
      window.dispatchEvent(new CustomEvent('vellum:shoot-updated', { detail: assignments }));
      this.syncToSupabaseIfConnected('shoot_assignments', assignments);
      return true;
    } catch (e) {
      console.error('Error saving shoot assignments:', e);
      return false;
    }
  }

  setCatalogShoot(catalogId, shootType) {
    const assignments = this.loadShootAssignments();
    assignments[catalogId] = shootType;
    return this.saveShootAssignments(assignments);
  }

  getCatalogShoot(catalogId, fallback = null) {
    const assignments = this.loadShootAssignments();
    return assignments[catalogId] || fallback;
  }

  saveStockOverrides(overrides) {
    this.stockOverrides = overrides;
    try {
      localStorage.setItem(STORAGE_KEYS.STOCK_OVERRIDES, JSON.stringify(this.stockOverrides));
      window.dispatchEvent(new CustomEvent('vellum:stock-updated', { detail: this.stockOverrides }));
      this.syncToSupabaseIfConnected('stock_overrides', this.stockOverrides);
      return true;
    } catch (e) {
      console.error('Error saving stock overrides:', e);
      return false;
    }
  }

  setCatalogStock(catalogId, status) {
    // status: 'in_stock' | 'temp_out_of_stock' | 'perm_out_of_stock'
    const overrides = this.loadStockOverrides();
    overrides.catalogs = overrides.catalogs || {};
    overrides.catalogs[catalogId] = status;
    return this.saveStockOverrides(overrides);
  }

  setColorStock(catalogId, designCode, status) {
    // status: 'in_stock' | 'sold_out'
    const overrides = this.loadStockOverrides();
    overrides.colors = overrides.colors || {};
    const key = `${catalogId}_${designCode}`;
    overrides.colors[key] = status;
    return this.saveStockOverrides(overrides);
  }

  getCatalogStock(catalogId, defaultStatus = 'in_stock') {
    return (this.stockOverrides.catalogs && this.stockOverrides.catalogs[catalogId]) || defaultStatus;
  }

  getColorStock(catalogId, designCode, defaultStatus = 'in_stock') {
    const key = `${catalogId}_${designCode}`;
    return (this.stockOverrides.colors && this.stockOverrides.colors[key]) || defaultStatus;
  }

  // 3. Dual Firm Profiles Management (Keya Fashion & Saurashtra Sarees)
  loadFirmProfiles() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FIRM_PROFILES);
      if (saved) return { ...DEFAULT_FIRM_PROFILES, ...JSON.parse(saved) };
    } catch (e) {
      console.warn('Failed to parse firm profiles from localStorage', e);
    }
    return { ...DEFAULT_FIRM_PROFILES };
  }

  saveFirmProfiles(profiles) {
    this.firmProfiles = {
      ...this.firmProfiles,
      ...profiles,
      lastUpdated: new Date().toISOString()
    };
    try {
      localStorage.setItem(STORAGE_KEYS.FIRM_PROFILES, JSON.stringify(this.firmProfiles));
      window.dispatchEvent(new CustomEvent('vellum:firm-updated', { detail: this.firmProfiles }));
      this.syncToSupabaseIfConnected('firm_profiles', this.firmProfiles);
      return true;
    } catch (e) {
      console.error('Error saving firm profiles:', e);
      return false;
    }
  }

  saveFirmProfile(firmId, data) {
    const current = this.loadFirmProfiles();
    current[firmId] = {
      ...(current[firmId] || {}),
      ...data,
      id: firmId,
      lastUpdated: new Date().toISOString()
    };
    return this.saveFirmProfiles(current);
  }

  deleteFirmProfile(firmId) {
    const current = this.loadFirmProfiles();
    if (Object.keys(current).length <= 1) {
      console.warn('Cannot delete the last remaining firm');
      return false;
    }
    delete current[firmId];
    return this.saveFirmProfiles(current);
  }

  getFirmProfile(firmId) {
    const profiles = this.loadFirmProfiles();
    return profiles[firmId] || DEFAULT_FIRM_PROFILES[firmId] || null;
  }

  // 4. Staff Profiles Management (Full Add/Edit/Delete CRUD)
  loadStaffProfiles() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STAFF_PROFILES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse staff profiles from localStorage', e);
    }
    return [...DEFAULT_STAFF_PROFILES];
  }

  saveStaffProfiles(profiles) {
    try {
      localStorage.setItem(STORAGE_KEYS.STAFF_PROFILES, JSON.stringify(profiles));
      window.dispatchEvent(new CustomEvent('vellum:staff-updated', { detail: profiles }));
      this.syncToSupabaseIfConnected('staff_profiles', profiles);
      return true;
    } catch (e) {
      console.error('Error saving staff profiles:', e);
      return false;
    }
  }

  saveStaffProfile(staffObj) {
    const list = this.loadStaffProfiles();
    const idx = list.findIndex(s => s.code.toUpperCase() === staffObj.code.toUpperCase());
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...staffObj };
    } else {
      list.push(staffObj);
    }
    return this.saveStaffProfiles(list);
  }

  deleteStaffProfile(code) {
    let list = this.loadStaffProfiles();
    list = list.filter(s => s.code.toUpperCase() !== code.toUpperCase());
    return this.saveStaffProfiles(list);
  }

  // 5. Custom Saved Links / Campaigns Management
  loadSavedLinks() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SAVED_LINKS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved links from localStorage', e);
    }
    return [];
  }

  saveSavedLinks(links) {
    try {
      localStorage.setItem(STORAGE_KEYS.SAVED_LINKS, JSON.stringify(links));
      window.dispatchEvent(new CustomEvent('vellum:links-updated', { detail: links }));
      this.syncToSupabaseIfConnected('saved_links', links);
      return true;
    } catch (e) {
      console.error('Error saving links:', e);
      return false;
    }
  }

  addSavedLink(linkObj) {
    const list = this.loadSavedLinks();
    list.unshift({
      id: 'link_' + Date.now(),
      created_at: new Date().toISOString(),
      ...linkObj
    });
    return this.saveSavedLinks(list);
  }

  deleteSavedLink(id) {
    let list = this.loadSavedLinks();
    list = list.filter(l => l.id !== id);
    return this.saveSavedLinks(list);
  }

  // 6. Supabase Credentials & Connection
  loadSupabaseConfig() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SUPABASE_CONFIG);
      if (saved) return { ...DEFAULT_SUPABASE_CONFIG, ...JSON.parse(saved) };
    } catch (e) {
      console.warn('Failed to parse Supabase config', e);
    }
    return { ...DEFAULT_SUPABASE_CONFIG };
  }

  saveSupabaseConfig(config) {
    this.supabaseConfig = { ...this.supabaseConfig, ...config };
    try {
      localStorage.setItem(STORAGE_KEYS.SUPABASE_CONFIG, JSON.stringify(this.supabaseConfig));
      this.initSupabaseClient();
      return true;
    } catch (e) {
      console.error('Error saving Supabase config', e);
      return false;
    }
  }

  initSupabaseClient() {
    if (window.supabase && this.supabaseConfig.url && this.supabaseConfig.anonKey && this.supabaseConfig.isEnabled) {
      try {
        this.supabaseClient = window.supabase.createClient(
          this.supabaseConfig.url,
          this.supabaseConfig.anonKey
        );
        this.setupRealtimeListeners();
        console.log('⚡ Supabase Client initialized and Realtime listeners active.');
      } catch (err) {
        console.error('Failed to create Supabase client:', err);
      }
    } else {
      this.supabaseClient = null;
    }
  }

  setupRealtimeListeners() {
    if (!this.supabaseClient) return;

    try {
      this.supabaseClient
        .channel('schema-db-changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'app_settings' },
          (payload) => {
            console.log('⚡ Supabase Realtime update received:', payload);
            if (payload.new && payload.new.key === 'drive_shoot_folders') {
              this.driveConfig = payload.new.value;
              localStorage.setItem(STORAGE_KEYS.DRIVE_FOLDERS, JSON.stringify(this.driveConfig));
              window.dispatchEvent(new CustomEvent('vellum:drive-updated', { detail: this.driveConfig }));
            }
            if (payload.new && payload.new.key === 'stock_overrides') {
              this.stockOverrides = payload.new.value;
              localStorage.setItem(STORAGE_KEYS.STOCK_OVERRIDES, JSON.stringify(this.stockOverrides));
              window.dispatchEvent(new CustomEvent('vellum:stock-updated', { detail: this.stockOverrides }));
            }
            if (payload.new && payload.new.key === 'firm_profiles') {
              this.firmProfiles = payload.new.value;
              localStorage.setItem(STORAGE_KEYS.FIRM_PROFILES, JSON.stringify(this.firmProfiles));
              window.dispatchEvent(new CustomEvent('vellum:firm-updated', { detail: this.firmProfiles }));
            }
            if (payload.new && payload.new.key === 'shoot_assignments') {
              localStorage.setItem('vellum_shoot_assignments', JSON.stringify(payload.new.value));
              window.dispatchEvent(new CustomEvent('vellum:shoot-updated', { detail: payload.new.value }));
            }
            if (payload.new && payload.new.key === 'staff_profiles') {
              localStorage.setItem(STORAGE_KEYS.STAFF_PROFILES, JSON.stringify(payload.new.value));
              window.dispatchEvent(new CustomEvent('vellum:staff-updated', { detail: payload.new.value }));
            }
            if (payload.new && payload.new.key === 'saved_links') {
              localStorage.setItem(STORAGE_KEYS.SAVED_LINKS, JSON.stringify(payload.new.value));
              window.dispatchEvent(new CustomEvent('vellum:links-updated', { detail: payload.new.value }));
            }
          }
        )
        .subscribe();
    } catch (e) {
      console.warn('Failed to setup realtime channel:', e);
    }
  }

  async syncToSupabaseIfConnected(key, value) {
    if (!this.supabaseClient) return false;
    try {
      const { error } = await this.supabaseClient
        .from('app_settings')
        .upsert({ key, value, updated_at: new Date().toISOString() });
      if (error) throw error;
      return true;
    } catch (e) {
      console.warn('Could not sync to Supabase:', e.message);
      return false;
    }
  }

  // 4. Helper to extract Google Drive Folder ID
  static extractFolderId(urlOrId) {
    if (!urlOrId) return '';
    const clean = urlOrId.trim();
    // Case 1: direct ID
    if (/^[a-zA-Z0-9_-]{25,}$/.test(clean)) return clean;
    // Case 2: url with id= parameter
    const idParam = clean.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (idParam && idParam[1]) return idParam[1];
    // Case 3: url with /folders/ID
    const foldersMatch = clean.match(/\/folders\/([a-zA-Z0-9_-]+)/);
    if (foldersMatch && foldersMatch[1]) return foldersMatch[1];
    return clean;
  }
}

// Global Singleton Instance
window.vellumAdapter = new VellumDataAdapter();
