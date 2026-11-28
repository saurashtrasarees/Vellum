/**
 * ==============================================================================
 * VELLUM ATELIER — GOOGLE DRIVE TO GOOGLE SHEET AUTOMATED SYNC ENGINE
 * ==============================================================================
 * Automatically scans Google Drive shoot folders, reads catalogue details and
 * Retail Price from each folder's .txt file, extracts colors, swatches and photos,
 * and syncs everything directly into the "Catalog_Master" sheet tab.
 * 
 * SCRIPT ID:     1GtHVuvZfc0gDvlKL96seelUHj-gbet-367Go30RrzY8LFjwWfIdV6u42
 * SPREADSHEET ID: 1YcrvrrgwikEFkST8VEPf-XRjj8vWd0F750kauK1PU1o
 * APPS SCRIPT URL: https://script.google.com/d/1GtHVuvZfc0gDvlKL96seelUHj-gbet-367Go30RrzY8LFjwWfIdV6u42/edit
 * ==============================================================================
 */

// MASTER CONFIGURATION
const CONFIG = {
  SCRIPT_ID: '1GtHVuvZfc0gDvlKL96seelUHj-gbet-367Go30RrzY8LFjwWfIdV6u42',
  SPREADSHEET_ID: '1YcrvrrgwikEFkST8VEPf-XRjj8vWd0F750kauK1PU1o',
  
  // Root Google Drive Shoot Folder Names
  MODEL_SHOOT_FOLDER_NAME: 'Model Shoot',
  TABLE_SHOOT_FOLDER_NAME: 'Table Shoot',
  
  // Sheet tab name (Primary Database)
  SHEET_NAME: 'Catalog_Master',
  
  // Default margin multipliers for Wholesale and Prime if not already entered by Admin:
  // e.g. If Retail is 999: Wholesale ~ 12% lower (879), Prime ~ 20% lower (799).
  AUTO_CALCULATE_TIERS_IF_EMPTY: true,
  WHOLESALE_DISCOUNT_PERCENT: 12, // 12% off Retail
  PRIME_DISCOUNT_PERCENT: 20,     // 20% off Retail
  
  // Default Timezone
  TIMEZONE: 'Asia/Kolkata'
};

/**
 * Creates custom luxury menu in Google Sheets on open
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('👑 Vellum Sync')
    .addItem('🚀 Run Sync Now (All Catalogs)', 'syncAllShoots')
    .addItem('👗 Sync Model Shoots Only', 'syncModelShootsOnly')
    .addItem('🪑 Sync Table Shoots Only', 'syncTableShootsOnly')
    .addSeparator()
    .addSubMenu(ui.createMenu('⏱️ Set Automatic Frequency')
      .addItem('⚡ High Frequency: Every 15 Minutes (Shoot Day / Rapid Ingestion)', 'setupTrigger15Min')
      .addItem('⏱️ Active Hours: Every 30 Minutes', 'setupTrigger30Min')
      .addItem('🕒 Standard: Every 1 Hour', 'setupTrigger1Hour')
      .addItem('🕓 Regular: Every 2 Hours', 'setupTrigger2Hours')
      .addItem('🕕 Batch: Every 4 Hours', 'setupTrigger4Hours')
      .addItem('🕗 Shift: Every 6 Hours', 'setupTrigger6Hours')
      .addItem('🌅 Daily Morning: 8:00 AM (Pre-Dispatch Sync)', 'setupTriggerDaily8AM')
      .addItem('🌙 Daily Night: 10:00 PM (End of Day Audit)', 'setupTriggerDaily10PM')
      .addItem('🛠️ Custom Frequency Setup (Enter Minutes / Hours)...', 'setupCustomTriggerPrompt')
    )
    .addSeparator()
    .addItem('🎛️ Open Sync Control Center (Interactive Panel)', 'openSyncControlCenter')
    .addItem('📊 Check Active Schedule & Sync Health', 'checkTriggerStatus')
    .addSeparator()
    .addItem('🛑 Stop All Automatic Syncing (Pause Trigger)', 'removeAllTriggers')
    .addToUi();
}

// ==============================================================================
// 1. SYNC EXECUTION ENGINES
// ==============================================================================

/**
 * Main Sync Function: Scans both Model Shoot and Table Shoot folders
 */
function syncAllShoots() {
  executeSync({ syncModel: true, syncTable: true });
}

/**
 * Syncs Model Shoot folders only
 */
function syncModelShootsOnly() {
  executeSync({ syncModel: true, syncTable: false });
}

/**
 * Syncs Table Shoot folders only
 */
function syncTableShootsOnly() {
  executeSync({ syncModel: false, syncTable: true });
}

/**
 * Alias for background triggers
 */
function syncDriveToSheet() {
  executeSync({ syncModel: true, syncTable: true });
}

/**
 * Core execution engine
 */
function executeSync(options) {
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

  // Process Model Shoot folders if enabled
  if (options.syncModel) {
    const modelFolders = findShootFolders(CONFIG.MODEL_SHOOT_FOLDER_NAME);
    for (let f = 0; f < modelFolders.length; f++) {
      const res = processShootParentFolder(sheet, modelFolders[f], '👗 Model Shoot', codeRowMap);
      totalSynced += res.synced;
      totalNew += res.newCount;
      totalUpdated += res.updatedCount;
    }
  }

  // Process Table Shoot folders if enabled
  if (options.syncTable) {
    const tableFolders = findShootFolders(CONFIG.TABLE_SHOOT_FOLDER_NAME);
    for (let f = 0; f < tableFolders.length; f++) {
      const res = processShootParentFolder(sheet, tableFolders[f], '🪑 Table Shoot', codeRowMap);
      totalSynced += res.synced;
      totalNew += res.newCount;
      totalUpdated += res.updatedCount;
    }
  }

  // Record timestamp & stats in Document Properties
  const nowStr = Utilities.formatDate(new Date(), CONFIG.TIMEZONE, 'dd MMM yyyy, hh:mm:ss a');
  const props = PropertiesService.getDocumentProperties();
  props.setProperty('LAST_SYNC_TIME', nowStr);
  props.setProperty('LAST_SYNC_STATS', `${totalSynced} scanned (${totalNew} added, ${totalUpdated} updated)`);

  const msg = `✓ Sync Complete!\nTotal Processed: ${totalSynced} catalogues\nNew Added: ${totalNew}\nUpdated: ${totalUpdated}`;
  SpreadsheetApp.getActiveSpreadsheet().toast(msg, '👑 Vellum Drive Sync', 6);
  Logger.log(msg);

  return { totalSynced, totalNew, totalUpdated, timestamp: nowStr };
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
 * - Reads .txt for details and Retail Price
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

// ==============================================================================
// 2. COMPREHENSIVE SCHEDULING ENGINES & PRESETS
// ==============================================================================

/**
 * Universal Trigger Setter: Clears previous triggers and schedules new frequency
 */
function applyScheduleTrigger(type, value, humanLabel) {
  removeAllTriggersSilent();

  let builder = ScriptApp.newTrigger('syncDriveToSheet').timeBased();

  if (type === 'minutes') {
    builder = builder.everyMinutes(value);
  } else if (type === 'hours') {
    builder = builder.everyHours(value);
  } else if (type === 'daily') {
    builder = builder.everyDays(1).atHour(value).nearMinute(0);
  }

  const trigger = builder.create();

  // Store in Document Properties
  const props = PropertiesService.getDocumentProperties();
  props.setProperty('ACTIVE_SCHEDULE', humanLabel);
  props.setProperty('TRIGGER_TYPE', type);
  props.setProperty('TRIGGER_VALUE', String(value));
  props.setProperty('TRIGGER_ID', trigger.getUniqueId());
  props.setProperty('TRIGGER_UPDATED_AT', Utilities.formatDate(new Date(), CONFIG.TIMEZONE, 'dd MMM yyyy, hh:mm a'));

  SpreadsheetApp.getActiveSpreadsheet().toast(
    `✓ Sync Schedule Set: ${humanLabel}\nAutomatic background sync is now running.`,
    '👑 Vellum Automation',
    7
  );
  Logger.log(`Applied schedule: ${humanLabel} (Trigger ID: ${trigger.getUniqueId()})`);
  return { success: true, label: humanLabel, triggerId: trigger.getUniqueId() };
}

// Preset Handlers for Menu & Dialog:

function setupTrigger15Min() {
  applyScheduleTrigger('minutes', 15, '⚡ Every 15 Minutes (Rapid Ingestion)');
}

function setupTrigger30Min() {
  applyScheduleTrigger('minutes', 30, '⏱️ Every 30 Minutes (Active Hours)');
}

function setupTrigger1Hour() {
  applyScheduleTrigger('hours', 1, '🕒 Every 1 Hour (Standard daytime sync)');
}

function setupTrigger2Hours() {
  applyScheduleTrigger('hours', 2, '🕓 Every 2 Hours');
}

function setupTrigger4Hours() {
  applyScheduleTrigger('hours', 4, '🕕 Every 4 Hours (Batch processing)');
}

function setupTrigger6Hours() {
  applyScheduleTrigger('hours', 6, '🕗 Every 6 Hours (Factory shift sync)');
}

function setupTriggerDaily8AM() {
  applyScheduleTrigger('daily', 8, '🌅 Daily at 8:00 AM (Pre-Dispatch Readiness)');
}

function setupTriggerDaily10PM() {
  applyScheduleTrigger('daily', 22, '🌙 Daily at 10:00 PM (End of Day Audit)');
}

/**
 * Custom frequency interactive prompt
 */
function setupCustomTriggerPrompt() {
  const ui = SpreadsheetApp.getUi();
  const resp = ui.prompt(
    '🛠️ Custom Sync Schedule Setup',
    'Choose a sync interval:\n\n' +
    'Type one of the following:\n' +
    '• "15m" or "30m" for Minutes\n' +
    '• "1h", "2h", "4h", "6h", "8h", "12h" for Hours\n' +
    '• "daily 8am" or "daily 10pm" for Daily time\n\n' +
    'Enter your choice:',
    ui.ButtonSet.OK_CANCEL
  );

  if (resp.getSelectedButton() !== ui.Button.OK) return;

  const val = resp.getResponseText().trim().toLowerCase();
  if (val === '15m') setupTrigger15Min();
  else if (val === '30m') setupTrigger30Min();
  else if (val === '1h') setupTrigger1Hour();
  else if (val === '2h') setupTrigger2Hours();
  else if (val === '4h') setupTrigger4Hours();
  else if (val === '6h') setupTrigger6Hours();
  else if (val === 'daily 8am') setupTriggerDaily8AM();
  else if (val === 'daily 10pm') setupTriggerDaily10PM();
  else {
    ui.alert('⚠️ Unrecognized Choice', `"${val}" is not a supported Google Apps Script interval. Please use the menu presets or choose 15m, 30m, 1h, 2h, 4h, 6h, etc.`, ui.ButtonSet.OK);
  }
}

/**
 * Removes all active triggers for syncDriveToSheet
 */
function removeAllTriggers() {
  removeAllTriggersSilent();
  SpreadsheetApp.getActiveSpreadsheet().toast('🛑 All automatic sync triggers have been stopped and paused.', '👑 Vellum Automation', 5);
}

function removeAllTriggersSilent() {
  const triggers = ScriptApp.getProjectTriggers();
  for (let i = 0; i < triggers.length; i++) {
    const fn = triggers[i].getHandlerFunction();
    if (fn === 'syncDriveToSheet' || fn === 'syncAllShoots') {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }
  const props = PropertiesService.getDocumentProperties();
  props.setProperty('ACTIVE_SCHEDULE', '⏸️ Paused (No automatic trigger running)');
  props.deleteProperty('TRIGGER_ID');
}

/**
 * Checks and reports the current sync schedule & health
 */
function checkTriggerStatus() {
  const props = PropertiesService.getDocumentProperties();
  const activeSchedule = props.getProperty('ACTIVE_SCHEDULE') || 'No schedule recorded';
  const lastSyncTime = props.getProperty('LAST_SYNC_TIME') || 'Never / Not yet run';
  const lastSyncStats = props.getProperty('LAST_SYNC_STATS') || 'N/A';
  const triggerUpdatedAt = props.getProperty('TRIGGER_UPDATED_AT') || 'N/A';

  const triggers = ScriptApp.getProjectTriggers();
  let syncTriggerCount = 0;
  for (let i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'syncDriveToSheet') {
      syncTriggerCount++;
    }
  }

  const statusMsg = 
    `👑 VELLUM DRIVE-TO-SHEET SYNC STATUS\n` +
    `=========================================\n\n` +
    `📌 Script ID: ${CONFIG.SCRIPT_ID}\n` +
    `📊 Target Sheet: ${CONFIG.SHEET_NAME}\n\n` +
    `⚡ Automation State: ${syncTriggerCount > 0 ? '🟢 ACTIVE' : '⏸️ PAUSED'}\n` +
    `⏱️ Active Schedule: ${activeSchedule}\n` +
    `📅 Schedule Last Changed: ${triggerUpdatedAt}\n` +
    `🔢 Installed Triggers: ${syncTriggerCount}\n\n` +
    `🕒 Last Successful Sync: ${lastSyncTime}\n` +
    `📈 Last Run Summary: ${lastSyncStats}\n\n` +
    `=========================================\n` +
    `You can change the sync frequency at any time from "👑 Vellum Sync" menu or the interactive Control Center.`;

  SpreadsheetApp.getUi().alert('👑 Vellum Sync Status & Diagnostics', statusMsg, SpreadsheetApp.getUi().ButtonSet.OK);
}

// ==============================================================================
// 3. INTERACTIVE CONTROL CENTER (HTML MODAL DIALOG)
// ==============================================================================

/**
 * Opens a luxury styled modal control panel inside Google Sheets
 */
function openSyncControlCenter() {
  const props = PropertiesService.getDocumentProperties();
  const currentSchedule = props.getProperty('ACTIVE_SCHEDULE') || '⏸️ Paused';
  const lastSync = props.getProperty('LAST_SYNC_TIME') || 'Never run';
  const lastStats = props.getProperty('LAST_SYNC_STATS') || 'No sync records yet';

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <base target="_top">
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            background: #faf8f5;
            color: #1c1917;
            padding: 20px;
          }
          .card {
            background: #ffffff;
            border-radius: 16px;
            padding: 20px;
            border: 1px solid #e7e5e4;
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
            margin-bottom: 16px;
          }
          .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 2px solid #f59e0b;
            padding-bottom: 12px;
            margin-bottom: 16px;
          }
          .title {
            font-family: 'Playfair Display', serif;
            font-size: 20px;
            font-weight: 700;
            color: #881337;
          }
          .script-badge {
            font-size: 10px;
            font-family: monospace;
            background: #fef3c7;
            color: #92400e;
            padding: 4px 8px;
            border-radius: 6px;
            border: 1px solid #fde68a;
          }
          .status-banner {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: #f0fdf4;
            border: 1px solid #bbf7d0;
            padding: 12px 16px;
            border-radius: 12px;
            margin-bottom: 16px;
          }
          .status-label { font-size: 11px; text-transform: uppercase; font-weight: 800; color: #166534; }
          .status-val { font-size: 13px; font-weight: 700; color: #14532d; }
          .section-title {
            font-size: 12px;
            text-transform: uppercase;
            font-weight: 800;
            letter-spacing: 0.05em;
            color: #78716c;
            margin-bottom: 10px;
          }
          .freq-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-bottom: 16px;
          }
          .freq-option {
            border: 2px solid #e7e5e4;
            padding: 10px 12px;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 12px;
            font-weight: 600;
            background: #fafaf9;
          }
          .freq-option:hover {
            border-color: #f59e0b;
            background: #fffbeb;
          }
          .freq-option input {
            accent-color: #881337;
          }
          .btn {
            width: 100%;
            padding: 12px;
            border-radius: 10px;
            border: none;
            font-size: 13px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            margin-bottom: 8px;
          }
          .btn-primary {
            background: #881337;
            color: white;
          }
          .btn-primary:hover { background: #9f1239; }
          .btn-secondary {
            background: #0284c7;
            color: white;
          }
          .btn-secondary:hover { background: #0369a1; }
          .btn-danger {
            background: #fff1f2;
            color: #be123c;
            border: 1px solid #fecdd3;
          }
          .btn-danger:hover { background: #ffe4e6; }
          .stats-row {
            display: flex;
            justify-content: space-between;
            font-size: 11px;
            color: #57534e;
            padding: 4px 0;
            border-bottom: 1px dashed #e7e5e4;
          }
          #feedback {
            margin-top: 10px;
            font-size: 12px;
            font-weight: 700;
            text-align: center;
            padding: 8px;
            border-radius: 8px;
            display: none;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1 class="title">👑 Vellum Sync Center</h1>
            <p style="font-size: 11px; color: #78716c;">Google Drive ⟷ Sheet Automatic Synchronization</p>
          </div>
          <span class="script-badge">Script: ${CONFIG.SCRIPT_ID.substring(0, 10)}...</span>
        </div>

        <div class="status-banner">
          <div>
            <div class="status-label">Active Schedule</div>
            <div id="activeScheduleDisplay" class="status-val">${currentSchedule}</div>
          </div>
          <div style="text-align: right;">
            <div class="status-label">Last Sync</div>
            <div style="font-size: 11px; font-weight: 600; color: #166534;">${lastSync}</div>
          </div>
        </div>

        <div class="card">
          <div class="section-title">Select Background Sync Frequency</div>
          <div class="freq-grid">
            <label class="freq-option">
              <input type="radio" name="freq" value="15m">
              <span>⚡ Every 15 Min</span>
            </label>
            <label class="freq-option">
              <input type="radio" name="freq" value="30m">
              <span>⏱️ Every 30 Min</span>
            </label>
            <label class="freq-option">
              <input type="radio" name="freq" value="1h" checked>
              <span>🕒 Every 1 Hour</span>
            </label>
            <label class="freq-option">
              <input type="radio" name="freq" value="2h">
              <span>🕓 Every 2 Hours</span>
            </label>
            <label class="freq-option">
              <input type="radio" name="freq" value="4h">
              <span>🕕 Every 4 Hours</span>
            </label>
            <label class="freq-option">
              <input type="radio" name="freq" value="6h">
              <span>🕗 Every 6 Hours</span>
            </label>
            <label class="freq-option">
              <input type="radio" name="freq" value="daily8">
              <span>🌅 Daily 8:00 AM</span>
            </label>
            <label class="freq-option">
              <input type="radio" name="freq" value="daily22">
              <span>🌙 Daily 10:00 PM</span>
            </label>
          </div>

          <button class="btn btn-primary" onclick="applySelectedSchedule()">
            <span>💾 Activate Selected Schedule</span>
          </button>
          
          <button class="btn btn-secondary" onclick="runInstantSync()">
            <span>🚀 Run Instant Manual Sync Now</span>
          </button>

          <button class="btn btn-danger" onclick="pauseAutomation()">
            <span>🛑 Stop & Pause All Auto-Sync</span>
          </button>

          <div id="feedback"></div>
        </div>

        <div class="card" style="margin-bottom: 0;">
          <div class="section-title">Sync Details & Activity</div>
          <div class="stats-row">
            <span>Last Run Summary:</span>
            <strong>${lastStats}</strong>
          </div>
          <div class="stats-row">
            <span>Target Sheet:</span>
            <strong>${CONFIG.SHEET_NAME}</strong>
          </div>
          <div class="stats-row" style="border: none;">
            <span>Drive Sources:</span>
            <strong>Model Shoot & Table Shoot</strong>
          </div>
        </div>

        <script>
          function showFeedback(text, isError) {
            const el = document.getElementById('feedback');
            el.style.display = 'block';
            el.style.background = isError ? '#fee2e2' : '#ecfdf5';
            el.style.color = isError ? '#b91c1c' : '#047857';
            el.style.border = isError ? '1px solid #fca5a5' : '1px solid #6ee7b7';
            el.innerHTML = text;
          }

          function applySelectedSchedule() {
            const radios = document.getElementsByName('freq');
            let sel = '1h';
            for (let r of radios) {
              if (r.checked) sel = r.value;
            }

            showFeedback('⏳ Applying background trigger...', false);

            if (sel === '15m') google.script.run.withSuccessHandler(onSuccess).setupTrigger15Min();
            else if (sel === '30m') google.script.run.withSuccessHandler(onSuccess).setupTrigger30Min();
            else if (sel === '1h') google.script.run.withSuccessHandler(onSuccess).setupTrigger1Hour();
            else if (sel === '2h') google.script.run.withSuccessHandler(onSuccess).setupTrigger2Hours();
            else if (sel === '4h') google.script.run.withSuccessHandler(onSuccess).setupTrigger4Hours();
            else if (sel === '6h') google.script.run.withSuccessHandler(onSuccess).setupTrigger6Hours();
            else if (sel === 'daily8') google.script.run.withSuccessHandler(onSuccess).setupTriggerDaily8AM();
            else if (sel === 'daily22') google.script.run.withSuccessHandler(onSuccess).setupTriggerDaily10PM();
          }

          function onSuccess() {
            showFeedback('✓ Success! Schedule activated. It will run automatically in background.', false);
            setTimeout(() => { google.script.host.close(); }, 2000);
          }

          function runInstantSync() {
            showFeedback('⏳ Scanning Google Drive folders & updating Sheet...', false);
            google.script.run.withSuccessHandler(() => {
              showFeedback('✓ Manual Sync Complete! All catalogues refreshed.', false);
            }).withFailureHandler((err) => {
              showFeedback('⚠️ Sync Error: ' + err.message, true);
            }).syncAllShoots();
          }

          function pauseAutomation() {
            showFeedback('⏳ Removing background triggers...', false);
            google.script.run.withSuccessHandler(() => {
              showFeedback('🛑 All automatic triggers stopped and paused.', false);
              document.getElementById('activeScheduleDisplay').textContent = '⏸️ Paused';
            }).removeAllTriggers();
          }
        </script>
      </body>
    </html>
  `;

  const htmlOutput = HtmlService.createHtmlOutput(html)
    .setWidth(520)
    .setHeight(680)
    .setTitle('👑 Vellum Sync Control Center');

  SpreadsheetApp.getUi().showModalDialog(htmlOutput, '👑 Vellum Sync Control Center');
}

// ==============================================================================
// 4. FORMATTING UTILITIES
// ==============================================================================

function formatHeaderRow(sheet) {
  const headerRange = sheet.getRange(1, 1, 1, 12);
  headerRange.setBackground('#881337') // Brand Deep Maroon
             .setFontColor('#FFFFFF')
             .setFontWeight('bold')
             .setHorizontalAlignment('center');
  sheet.setFrozenRows(1);
  sheet.setFrozenColumns(1);
}
