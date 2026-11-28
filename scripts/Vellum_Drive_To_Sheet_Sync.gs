/**
 * ==============================================================================
 * VELLUM ATELIER — GOOGLE DRIVE TO GOOGLE SHEET AUTOMATED SYNC ENGINE
 * ==============================================================================
 * Automatically scans Google Drive shoot folders, reads catalogue details and
 * Retail Price from each folder's .txt file, extracts colors and photos, and
 * syncs everything directly into the "Catalog_Master" sheet tab.
 * 
 * Google Sheet ID: 1YcrvrrgwikEFkST8VEPf-XRjj8vWd0F750kauK1PU1o
 * ==============================================================================
 */

// CONFIGURATION: Set your root Google Drive Shoot Folder IDs or Names
const CONFIG = {
  // If you have specific folder IDs, place them here. Or leave empty to auto-search by name.
  MODEL_SHOOT_FOLDER_NAME: 'Model Shoot',
  TABLE_SHOOT_FOLDER_NAME: 'Table Shoot',
  
  // Sheet tab name
  SHEET_NAME: 'Catalog_Master',
  
  // Default margin multipliers for Wholesale and Prime if not already entered by Admin:
  // e.g. If Retail is 999: Wholesale ~ 10-15% lower, Prime ~ 20-25% lower.
  AUTO_CALCULATE_TIERS_IF_EMPTY: true,
  WHOLESALE_DISCOUNT_PERCENT: 12, // 12% off Retail
  PRIME_DISCOUNT_PERCENT: 20       // 20% off Retail
};

/**
 * Creates custom menu in Google Sheets on open
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('👑 Vellum Sync')
    .addItem('🔄 Sync All Catalogs from Google Drive', 'syncDriveToSheet')
    .addSeparator()
    .addItem('⏱️ Set Up Hourly Automatic Background Sync', 'setupHourlyTrigger')
    .addItem('🛑 Remove Automatic Sync Trigger', 'removeTriggers')
    .addToUi();
}

/**
 * Main Sync Function: Scans Google Drive and Updates Catalog_Master
 */
function syncDriveToSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.SHEET_NAME);
  }

  // Ensure Header Row is present
  const headers = [
    'Catalog Code',
    'Catalog Name',
    'Fabric Category',
    'Shoot Type',
    '1. Prime Rate (₹)',
    '2. Wholesale Rate (₹)',
    '3. Retail / MRP (₹)',
    'Stock Status',
    'Total Colors',
    'Colorway Names',
    'Drive Cover Image URL',
    'Google Drive Folder URL'
  ];

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    formatHeaderRow(sheet);
  }

  // Read existing data into a map by Catalog Code to avoid duplicates and preserve custom edits
  const existingData = sheet.getDataRange().getValues();
  const codeRowMap = {}; // Code -> Row Number (1-based)
  for (let r = 1; r < existingData.length; r++) {
    const code = String(existingData[r][0]).trim().toLowerCase();
    if (code) {
      codeRowMap[code] = {
        rowNum: r + 1,
        primeRate: existingData[r][4],
        wholesaleRate: existingData[r][5],
        retailRate: existingData[r][6],
        stock: existingData[r][7]
      };
    }
  }

  let totalSynced = 0;
  let totalNew = 0;
  let totalUpdated = 0;

  // Process Model Shoot folders
  const modelFolders = findShootFolders(CONFIG.MODEL_SHOOT_FOLDER_NAME);
  for (let f = 0; f < modelFolders.length; f++) {
    const res = processShootParentFolder(sheet, modelFolders[f], '👗 Model Shoot', codeRowMap);
    totalSynced += res.synced;
    totalNew += res.newCount;
    totalUpdated += res.updatedCount;
  }

  // Process Table Shoot folders
  const tableFolders = findShootFolders(CONFIG.TABLE_SHOOT_FOLDER_NAME);
  for (let f = 0; f < tableFolders.length; f++) {
    const res = processShootParentFolder(sheet, tableFolders[f], '🪑 Table Shoot', codeRowMap);
    totalSynced += res.synced;
    totalNew += res.newCount;
    totalUpdated += res.updatedCount;
  }

  // Toast / Alert result
  const msg = `✓ Sync Complete!\nTotal Processed: ${totalSynced} catalogues\nNew Added: ${totalNew}\nUpdated: ${totalUpdated}`;
  SpreadsheetApp.getActiveSpreadsheet().toast(msg, 'Vellum Drive Sync', 6);
  Logger.log(msg);
}

/**
 * Searches Drive for folders matching target name
 */
function findShootFolders(folderName) {
  const folders = [];
  const it = DriveApp.getFoldersByName(folderName);
  while (it.hasNext()) {
    folders.push(it.next());
  }
  return folders;
}

/**
 * Scans subfolders of Model Shoot or Table Shoot
 */
function processShootParentFolder(sheet, parentFolder, shootTypeLabel, codeRowMap) {
  const subfolders = parentFolder.getFolders();
  let synced = 0;
  let newCount = 0;
  let updatedCount = 0;

  while (subfolders.hasNext()) {
    const folder = subfolders.next();
    const folderName = folder.getName().trim();
    if (folderName.startsWith('.') || folderName.toLowerCase() === 'archive') continue;

    // Parse all files inside this catalog folder
    const catData = parseCatalogFolder(folder, folderName, shootTypeLabel);
    if (!catData || !catData.code) continue;

    const codeKey = catData.code.toLowerCase();
    const existing = codeRowMap[codeKey];

    // Determine Rates:
    // Retail comes directly from the .txt file!
    const retailRate = catData.retailRate || (existing ? existing.retailRate : 899);

    let wholesaleRate = existing && existing.wholesaleRate ? existing.wholesaleRate : '';
    let primeRate = existing && existing.primeRate ? existing.primeRate : '';

    if (CONFIG.AUTO_CALCULATE_TIERS_IF_EMPTY && retailRate) {
      if (!wholesaleRate) {
        wholesaleRate = Math.round((retailRate * (100 - CONFIG.WHOLESALE_DISCOUNT_PERCENT)) / 100);
      }
      if (!primeRate) {
        primeRate = Math.round((retailRate * (100 - CONFIG.PRIME_DISCOUNT_PERCENT)) / 100);
      }
    }

    const rowValues = [
      catData.code,
      catData.name,
      catData.fabric,
      catData.shootType,
      primeRate,
      wholesaleRate,
      retailRate,
      existing && existing.stock ? existing.stock : 'In Stock',
      catData.totalColors,
      catData.colorNames,
      catData.coverImageUrl,
      catData.driveFolderUrl
    ];

    if (existing) {
      // Update existing row
      sheet.getRange(existing.rowNum, 1, 1, rowValues.length).setValues([rowValues]);
      updatedCount++;
    } else {
      // Append new row
      sheet.appendRow(rowValues);
      codeRowMap[codeKey] = { rowNum: sheet.getLastRow(), primeRate, wholesaleRate, retailRate, stock: 'In Stock' };
      newCount++;
    }
    synced++;
  }

  return { synced, newCount, updatedCount };
}

/**
 * Parses files in a single catalog folder:
 * - Reads .txt for details and Retail Rate
 * - Identifies 000 cover image or 101 image
 * - Groups 1xx, 2xx, 3xx colors and counts
 */
function parseCatalogFolder(folder, folderName, shootTypeLabel) {
  const files = folder.getFiles();
  let txtContent = '';
  let txtFileFound = false;

  let zeroCoverId = '';
  let first101Id = '';
  const seriesMap = {}; // 1 -> ['Orange', ...], 2 -> ['Blue', ...]

  while (files.hasNext()) {
    const file = files.next();
    const fname = file.getName().trim();
    const fnameLower = fname.toLowerCase();

    // 1. Text description file
    if (fnameLower.endsWith('.txt')) {
      try {
        txtContent = file.getBlob().getDataAsString();
        txtFileFound = true;
      } catch (e) {
        Logger.log('Could not read text file ' + fname + ': ' + e);
      }
    }

    // 2. Saree Photos
    if (fnameLower.match(/\.(jpg|jpeg|png|webp)$/i)) {
      const baseName = fnameLower.replace(/\.(jpg|jpeg|png|webp)$/i, '');

      // Check for 000 Cover
      if (baseName === '000' || baseName.startsWith('000_') || baseName.startsWith('000-')) {
        zeroCoverId = file.getId();
        continue;
      }

      // Check 3-digit series e.g. 101, 102, 201
      const m3 = baseName.match(/^([1-9])(\d{2})(?:[_\-](.*))?$/);
      if (m3) {
        const sNum = parseInt(m3[1], 10);
        const subNum = parseInt(m3[2], 10);
        const hint = (m3[3] || '').trim();

        if (sNum === 1 && subNum === 1 && !first101Id) {
          first101Id = file.getId();
        }

        if (!seriesMap[sNum]) seriesMap[sNum] = [];
        if (hint) {
          seriesMap[sNum].push(formatColorName(hint));
        }
      }
    }
  }

  // Parse Text details
  const parsedTxt = parseTxtDetails(txtContent, folderName);

  // Determine cover image
  const coverId = zeroCoverId || first101Id;
  const coverImageUrl = coverId ? 'https://lh3.googleusercontent.com/d/' + coverId : '';

  // Determine colors count and color names
  const seriesKeys = Object.keys(seriesMap).sort();
  const totalColors = seriesKeys.length > 0 ? seriesKeys.length : (parsedTxt.colorCount || 6);

  let colorNames = [];
  for (let s = 0; s < seriesKeys.length; s++) {
    const names = seriesMap[seriesKeys[s]];
    if (names && names.length > 0) {
      colorNames.push(names[0]);
    } else {
      colorNames.push(getStandardColor(s));
    }
  }

  return {
    code: parsedTxt.code || folderName,
    name: parsedTxt.title || formatCatalogTitle(folderName),
    fabric: parsedTxt.fabric || 'Pure Soft Silk',
    shootType: shootTypeLabel,
    retailRate: parsedTxt.retailRate,
    totalColors: totalColors,
    colorNames: colorNames.join(', '),
    coverImageUrl: coverImageUrl,
    driveFolderUrl: folder.getUrl()
  };
}

/**
 * Extracts Title, Code, Retail Price, Fabric and Details from .txt content
 */
function parseTxtDetails(txt, fallbackName) {
  if (!txt) return {};

  const result = {};

  // First line is Title
  const lines = txt.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  if (lines.length > 0) {
    result.title = lines[0];
  }

  // Catalogue Code: e.g. "Catalogue: Amrapali-Paithani-Vol-6"
  const mCat = txt.match(/Catalogue:\s*([^\n\r]+)/i);
  if (mCat) {
    result.code = mCat[1].trim();
  }

  // Price (Retail MRP): e.g. "Price: ₹899/-"
  const mPrice = txt.match(/Price:\s*₹?\s*(\d[\d,]*)/i);
  if (mPrice) {
    result.retailRate = parseInt(mPrice[1].replace(/,/g, ''), 10);
  }

  // Fabric: e.g. "Fabric: Pure Soft Silk"
  const mFab = txt.match(/[•\*\-]?\s*Fabric:\s*([^\n\r]+)/i);
  if (mFab) {
    result.fabric = mFab[1].trim();
  }

  // Colours count: e.g. "Colours: 6 beautiful colours"
  const mCol = txt.match(/[•\*\-]?\s*Colours?:\s*(\d+)/i);
  if (mCol) {
    result.colorCount = parseInt(mCol[1], 10);
  }

  return result;
}

function formatColorName(str) {
  return str.replace(/[_\-]/g, ' ')
            .replace(/([a-z])([A-Z])/g, '$1 $2')
            .replace(/\b\w/g, c => c.toUpperCase());
}

function formatCatalogTitle(str) {
  return str.replace(/[_\-]/g, ' ')
            .replace(/\bvol\b/i, 'Vol')
            .replace(/\b\w/g, c => c.toUpperCase());
}

function getStandardColor(idx) {
  const p = ['Peach', 'Rani Pink', 'Peacock Blue', 'Mehendi Green', 'Imperial Maroon', 'Amber Yellow', 'Purple', 'Pistachio Mint'];
  return p[idx % p.length];
}

/**
 * Sets up Time-driven Trigger to run every hour in the background
 */
function setupHourlyTrigger() {
  removeTriggers();
  ScriptApp.newTrigger('syncDriveToSheet')
    .timeBased()
    .everyHours(1)
    .create();
  SpreadsheetApp.getActiveSpreadsheet().toast('✓ Hourly Auto-Sync Trigger is now active! Drive changes will sync automatically every hour.', 'Vellum Automation', 6);
}

function removeTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  for (let i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'syncDriveToSheet') {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }
}

function formatHeaderRow(sheet) {
  const headerRange = sheet.getRange(1, 1, 1, 12);
  headerRange.setBackground('#8B1D40')
             .setFontColor('#FFFFFF')
             .setFontWeight('bold')
             .setHorizontalAlignment('center');
  sheet.setFrozenRows(1);
  sheet.setFrozenColumns(1);
}
