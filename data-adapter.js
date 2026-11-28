// ==============================================================================
// VELLUM — Multi-Firm & Google Sheet Data Adapter (Offline-First Architecture)
// Master Store for Firm Profiles, Staff Routing, Drive Folders & Granular Stock
// Master Google Sheet Database: 1YcrvrrgwikEFkST8VEPf-XRjj8vWd0F750kauK1PU1o
// ==============================================================================

const STORAGE_KEYS = {
  SHEET_ID: 'vellum_sheet_id',
  DRIVE_FOLDERS: 'vellum_drive_folders',
  STOCK_OVERRIDES: 'vellum_stock_overrides',
  CUSTOM_RATES: 'vellum_custom_rates',
  FIRM_PROFILES: 'vellum_firm_profiles',
  STAFF_PROFILES: 'vellum_staff_profiles',
  SAVED_LINKS: 'vellum_saved_links',
  SHOOT_ASSIGNMENTS: 'vellum_shoot_assignments'
};

const DEFAULT_SHEET_ID = '1YcrvrrgwikEFkST8VEPf-XRjj8vWd0F750kauK1PU1o';

// Default Cloud Drive Shoot Folders
const DEFAULT_DRIVE_CONFIG = {
  modelShootFolderUrl: 'https://drive.google.com/open?id=1JregR_hN7mL3fynLcGOq4ZYaTRHAj91e&usp=drive_fs',
  tableShootFolderUrl: 'https://drive.google.com/open?id=1JregR_hN7mL3fynLcGOq4ZYaTRHAj91e&usp=drive_fs',
  modelFolderId: '1JregR_hN7mL3fynLcGOq4ZYaTRHAj91e',
  tableFolderId: '1JregR_hN7mL3fynLcGOq4ZYaTRHAj91e',
  lastUpdated: new Date().toISOString()
};

// Default Universal Firm Configuration with Verified Surat Address & Timings
const DEFAULT_FIRM_PROFILES = {
  keya: {
    id: 'keya',
    name: 'Keya Fashion',
    tagline: 'Stop wishing. Start living....',
    address: 'A-1001, Rajhans Fabrizo, Near Polaris Textile City, BRTS Road, Magob, Surat, Gujarat – 395010',
    atelierCoordinates: 'A-1001, Rajhans Fabrizo, Near Polaris Textile City, Magob, Surat, Gujarat – 395010',
    timings: '10:00 AM – 07:00 PM (Monday–Saturday)',
    primaryPhone: '+91 98794 71039',
    orderPhone: '+91 99136 43433',
    secondaryPhone: '+91 99136 43433',
    whatsapp: '919879471039',
    focus: 'Curated Catalogues & Retail Showroom Collections',
    email: 'keyafashion5517@gmail.com',
    themeClass: 'theme-keya',
    accentColor: '#0284c7',
    secondaryColor: '#f59e0b',
    logo: 'assets/keya-fashion-logo.jpg',
    lastUpdated: new Date().toISOString()
  },
  saurashtra: {
    id: 'saurashtra',
    name: 'Saurashtra Sarees',
    tagline: 'Make Occasion Better',
    address: 'A-1001, Rajhans Fabrizo, Near Polaris Textile City, BRTS Road, Magob, Surat, Gujarat – 395010',
    atelierCoordinates: 'A-1001, Rajhans Fabrizo, Near Polaris Textile City, Magob, Surat, Gujarat – 395010',
    timings: '10:00 AM – 07:00 PM (Monday–Saturday)',
    primaryPhone: '+91 98794 71039',
    orderPhone: '+91 99136 43433',
    secondaryPhone: '+91 99136 43433',
    whatsapp: '919879471039',
    focus: 'Direct Mill Wholesale & Super Stockist Distribution',
    email: 'saurashtrasarees@gmail.com',
    themeClass: 'theme-saurashtra',
    accentColor: '#8b1d40',
    secondaryColor: '#d4af37',
    logo: 'assets/saurashtra-sarees-logo.jpg',
    lastUpdated: new Date().toISOString()
  }
};

// Default Verified Sales Staff & Leadership Profiles
const DEFAULT_STAFF_PROFILES = [
  // 1. Saurashtra Sarees Leadership & Direct Inquiries
  {
    code: 'NA39',
    name: 'Nayan Patel [Founder]',
    shortName: 'Nayan Patel',
    letter: 'G',
    phone: '9879471039',
    displayPhone: '+91 98794 71039',
    whatsapp: '919879471039',
    firm: 'saurashtra',
    firmName: 'Saurashtra Sarees',
    title: 'Founder',
    rateAccess: 'retail',
    hasWholesaleLink: false,
    hasPrimeLink: false
  },
  {
    code: 'CH33',
    name: 'Chetan Patel [Co-Founder]',
    shortName: 'Chetan Patel',
    letter: 'H',
    phone: '9913643433',
    displayPhone: '+91 99136 43433',
    whatsapp: '919913643433',
    firm: 'saurashtra',
    firmName: 'Saurashtra Sarees',
    title: 'Co-Founder',
    rateAccess: 'retail',
    hasWholesaleLink: false,
    hasPrimeLink: false
  },

  // 2. Keya Fashion Representatives
  {
    code: 'KH28',
    name: 'Khushi',
    letter: 'A',
    phone: '9825452528',
    displayPhone: '+91 98254 52528',
    whatsapp: '919825452528',
    firm: 'keya',
    firmName: 'Keya Fashion',
    title: 'Dedicated Catalog Representative',
    hasWholesaleLink: false,
    hasPrimeLink: false
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
    title: 'Client Relationship Executive',
    hasWholesaleLink: false,
    hasPrimeLink: false
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
    title: 'Customer Sales Coordinator',
    hasWholesaleLink: false,
    hasPrimeLink: false
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
    title: 'Order Desk Manager',
    hasWholesaleLink: false,
    hasPrimeLink: false
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
    title: 'Digital Sales Executive',
    hasWholesaleLink: false,
    hasPrimeLink: false
  },
  {
    code: 'AR38',
    name: 'Arvind Patel',
    shortName: 'Arvind Patel',
    letter: 'F',
    phone: '9824982338',
    displayPhone: '+91 98249 82338',
    whatsapp: '919824982338',
    firm: 'keya',
    firmName: 'Keya Fashion',
    title: 'Dedicated Representative',
    rateAccess: 'retail',
    hasWholesaleLink: false,
    hasPrimeLink: false
  }
];

class VellumDataAdapter {
  constructor() {
    this.driveConfig = this.loadDriveConfig();
    this.stockOverrides = this.loadStockOverrides();
    this.firmProfiles = this.loadFirmProfiles();
    this.sheetId = this.loadSheetId();
  }

  // 1. Google Sheet Master ID
  loadSheetId() {
    return localStorage.getItem(STORAGE_KEYS.SHEET_ID) || DEFAULT_SHEET_ID;
  }

  saveSheetId(id) {
    const cleanId = (id || DEFAULT_SHEET_ID).trim();
    localStorage.setItem(STORAGE_KEYS.SHEET_ID, cleanId);
    return cleanId;
  }

  // 2. Google Drive Shoot Folders
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
      return true;
    } catch (e) {
      console.error('Error saving drive config:', e);
      return false;
    }
  }

  // 3. Granular Stock State Management (Catalog + Color level)
  loadStockOverrides() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STOCK_OVERRIDES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse stock overrides', e);
    }
    return { catalogs: {}, colors: {} };
  }

  loadShootAssignments() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SHOOT_ASSIGNMENTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse shoot assignments', e);
    }
    return {};
  }

  saveShootAssignments(assignments) {
    try {
      localStorage.setItem(STORAGE_KEYS.SHOOT_ASSIGNMENTS, JSON.stringify(assignments));
      window.dispatchEvent(new CustomEvent('vellum:shoot-updated', { detail: assignments }));
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
      return true;
    } catch (e) {
      console.error('Error saving stock overrides:', e);
      return false;
    }
  }

  setCatalogStock(catalogId, status) {
    const current = this.loadStockOverrides();
    current.catalogs = current.catalogs || {};
    current.catalogs[catalogId] = status;
    return this.saveStockOverrides(current);
  }

  setColorStock(catalogId, designCode, status) {
    const current = this.loadStockOverrides();
    current.colors = current.colors || {};
    const key = `${catalogId}_${designCode}`;
    current.colors[key] = status;
    return this.saveStockOverrides(current);
  }

  getCatalogStock(catalogId, fallbackStatus = 'in_stock') {
    const current = this.loadStockOverrides();
    return (current.catalogs && current.catalogs[catalogId]) || fallbackStatus;
  }

  getColorStock(catalogId, designCode) {
    const current = this.loadStockOverrides();
    const key = `${catalogId}_${designCode}`;
    return (current.colors && current.colors[key]) || 'in_stock';
  }

  // 4. Rate Overrides Matrix
  loadCustomRates() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOM_RATES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse custom rates', e);
    }
    return {};
  }

  saveCustomRates(rates) {
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_RATES, JSON.stringify(rates));
      window.dispatchEvent(new CustomEvent('vellum:rates-updated', { detail: rates }));
      return true;
    } catch (e) {
      console.error('Error saving custom rates:', e);
      return false;
    }
  }

  setCatalogRates(catalogId, { retail, wholesale, reseller, prime }) {
    const current = this.loadCustomRates();
    current[catalogId] = {
      retail: retail !== undefined ? Number(retail) : undefined,
      wholesale: wholesale !== undefined ? Number(wholesale) : undefined,
      reseller: reseller !== undefined ? Number(reseller) : undefined,
      prime: prime !== undefined ? Number(prime) : undefined
    };
    return this.saveCustomRates(current);
  }

  // 5. Universal Firm Profiles (Keya Fashion, Saurashtra Sarees, and custom firms)
  loadFirmProfiles() {
    const result = {
      keya: { ...DEFAULT_FIRM_PROFILES.keya, id: 'keya' },
      saurashtra: { ...DEFAULT_FIRM_PROFILES.saurashtra, id: 'saurashtra' }
    };
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FIRM_PROFILES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          Object.keys(parsed).forEach(k => {
            if (parsed[k] && typeof parsed[k] === 'object') {
              result[k] = {
                ...(result[k] || {}),
                ...parsed[k],
                id: k
              };
            }
          });
        }
      }
    } catch (e) {
      console.warn('Failed to parse firm profiles', e);
    }
    return result;
  }

  saveFirmProfiles(profiles) {
    this.firmProfiles = profiles;
    try {
      localStorage.setItem(STORAGE_KEYS.FIRM_PROFILES, JSON.stringify(this.firmProfiles));
      window.dispatchEvent(new CustomEvent('vellum:firm-updated', { detail: this.firmProfiles }));
      return true;
    } catch (e) {
      console.error('Error saving firm profiles:', e);
      return false;
    }
  }

  saveFirmProfile(firmId, data) {
    return this.updateFirm(firmId, data);
  }

  updateFirm(firmId, data) {
    const current = this.loadFirmProfiles();
    current[firmId] = {
      ...(current[firmId] || { id: firmId }),
      ...data,
      id: firmId,
      lastUpdated: new Date().toISOString()
    };
    return this.saveFirmProfiles(current);
  }

  deleteFirmProfile(firmId) {
    if (firmId === 'keya' || firmId === 'saurashtra') return false;
    const current = this.loadFirmProfiles();
    if (current[firmId]) {
      delete current[firmId];
      return this.saveFirmProfiles(current);
    }
    return false;
  }

  getFirmProfile(firmId = 'saurashtra') {
    const profiles = this.loadFirmProfiles();
    return profiles[firmId] || profiles.saurashtra || DEFAULT_FIRM_PROFILES.saurashtra;
  }

  getAtelierCoordinates(firmId = 'saurashtra') {
    const firm = this.getFirmProfile(firmId);
    return firm.atelierCoordinates || firm.address || 'A-1001, Rajhans Fabrizo, Near Polaris Textile City, Magob, Surat, Gujarat – 395010';
  }

  // 6. Sales Staff Profiles (Full CRUD)
  loadStaffProfiles() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STAFF_PROFILES);
      if (saved) {
        const list = JSON.parse(saved);
        // Ensure rateAccess strictly defaults to 'retail' (Retail Only) as set in Google Sheet
        return list.map(s => ({
          ...s,
          rateAccess: (s.rateAccess && s.rateAccess.toLowerCase().includes('all')) ? 'all' : 'retail',
          hasWholesaleLink: (s.rateAccess && s.rateAccess.toLowerCase().includes('all')) ? Boolean(s.hasWholesaleLink) : false,
          hasPrimeLink: (s.rateAccess && s.rateAccess.toLowerCase().includes('all')) ? Boolean(s.hasPrimeLink) : false
        }));
      }
    } catch (e) {
      console.warn('Failed to parse staff profiles', e);
    }
    return DEFAULT_STAFF_PROFILES;
  }

  saveStaffProfiles(profiles) {
    try {
      localStorage.setItem(STORAGE_KEYS.STAFF_PROFILES, JSON.stringify(profiles));
      window.dispatchEvent(new CustomEvent('vellum:staff-updated', { detail: profiles }));
      return true;
    } catch (e) {
      console.error('Error saving staff profiles:', e);
      return false;
    }
  }

  saveStaffProfile(staffData) {
    return this.addOrUpdateStaff(staffData);
  }

  addOrUpdateStaff(staffData) {
    const list = this.loadStaffProfiles();
    const idx = list.findIndex(s => s.code.toUpperCase() === staffData.code.toUpperCase());
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...staffData };
    } else {
      list.push(staffData);
    }
    return this.saveStaffProfiles(list);
  }

  deleteStaffProfile(staffCode) {
    return this.deleteStaff(staffCode);
  }

  deleteStaff(staffCode) {
    const list = this.loadStaffProfiles().filter(s => s.code.toUpperCase() !== staffCode.toUpperCase());
    return this.saveStaffProfiles(list);
  }

  // 7. Campaign Saved Links
  loadSavedLinks() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SAVED_LINKS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved links', e);
    }
    return [];
  }

  saveSavedLinks(links) {
    try {
      localStorage.setItem(STORAGE_KEYS.SAVED_LINKS, JSON.stringify(links));
      window.dispatchEvent(new CustomEvent('vellum:links-updated', { detail: links }));
      return true;
    } catch (e) {
      console.error('Error saving links:', e);
      return false;
    }
  }
}

// Global Single Instance
window.vellumAdapter = new VellumDataAdapter();
