// ==============================================================================
// VELLUM — Supabase & Cloud Storage Data Adapter
// Realtime Sync, Dynamic Google Drive Folders & Granular Stock State
// ==============================================================================

const STORAGE_KEYS = {
  SUPABASE_CONFIG: 'vellum_supabase_config',
  DRIVE_FOLDERS: 'vellum_drive_folders',
  STOCK_OVERRIDES: 'vellum_stock_overrides',
  CUSTOM_RATES: 'vellum_custom_rates',
};

// Default Cloud Drive Shoot Folders
const DEFAULT_DRIVE_CONFIG = {
  modelShootFolderUrl: 'https://drive.google.com/open?id=1JregR_hN7mL3fynLcGOq4ZYaTRHAj91e&usp=drive_fs',
  tableShootFolderUrl: 'https://drive.google.com/open?id=1JregR_hN7mL3fynLcGOq4ZYaTRHAj91e&usp=drive_fs',
  modelFolderId: '1JregR_hN7mL3fynLcGOq4ZYaTRHAj91e',
  tableFolderId: '1JregR_hN7mL3fynLcGOq4ZYaTRHAj91e',
  lastUpdated: new Date().toISOString()
};

class VellumDataAdapter {
  constructor() {
    this.driveConfig = this.loadDriveConfig();
    this.stockOverrides = this.loadStockOverrides();
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

  // 3. Supabase Credentials & Connection
  loadSupabaseConfig() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SUPABASE_CONFIG);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse Supabase config', e);
    }
    return { url: '', anonKey: '', isEnabled: false };
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
