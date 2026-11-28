# 👑 Vellum Google Apps Script Sync Architecture

## 📌 Master Credentials & Project Links

| Resource | ID / Direct URL |
|---|---|
| **Apps Script Project ID** | `1GtHVuvZfc0gDvlKL96seelUHj-gbet-367Go30RrzY8LFjwWfIdV6u42` |
| **Direct Script Editor** | [Open Apps Script Editor](https://script.google.com/d/1GtHVuvZfc0gDvlKL96seelUHj-gbet-367Go30RrzY8LFjwWfIdV6u42/edit) |
| **Google Sheet ID** | `1YcrvrrgwikEFkST8VEPf-XRjj8vWd0F750kauK1PU1o` |
| **Direct Google Sheet** | [Open Google Sheet Master](https://docs.google.com/spreadsheets/d/1YcrvrrgwikEFkST8VEPf-XRjj8vWd0F750kauK1PU1o/edit) |
| **Source Script File** | [`scripts/Vellum_Drive_To_Sheet_Sync.gs`](file:///E:/Shakti/GitHub/Vellum/scripts/Vellum_Drive_To_Sheet_Sync.gs) |

---

## ⚡ Background Sync Frequency Options

Instead of only a single fixed hourly trigger, Vellum now provides multiple business-tailored operational schedules:

### 1. High-Frequency / Shoot Day Ingestion
- **⚡ Every 15 Minutes (`setupTrigger15Min`)**: Ideal when photography and catalog teams are dumping fresh shoots into Drive folders. Rapidly discovers new folders, parses `.txt` files for retail rates, and adds them to `Catalog_Master`.
- **⏱️ Every 30 Minutes (`setupTrigger30Min`)**: Active business daytime refresh for busy periods.

### 2. Standard Factory & Showroom Operation
- **🕒 Every 1 Hour (`setupTrigger1Hour`)**: Standard automatic background synchronization.
- **🕓 Every 2 Hours (`setupTrigger2Hours`)**: Light daytime sync with reduced API quota usage.
- **🕕 Every 4 Hours (`setupTrigger4Hours`)**: Steady batch synchronization across morning, afternoon, and evening shifts.
- **🕗 Every 6 Hours (`setupTrigger6Hours`)**: Shift-change synchronization (4 times per day).

### 3. Factory Shift & Dispatch Timed Schedules
- **🌅 Daily at 8:00 AM (`setupTriggerDaily8AM`)**: Runs right before factory dispatch desks open. Ensures morning sales calls by Khushi, Nayan, Chetan, and Pooja have updated rates and stock.
- **🌙 Daily at 10:00 PM (`setupTriggerDaily10PM`)**: Nightly audit run after loom production and dispatches finish.

### 4. Interactive Custom Schedule
- **🛠️ Custom Frequency Setup (`setupCustomTriggerPrompt`)**: Prompt dialog inside Google Sheets to pick any interval (`15m`, `30m`, `1h`, `2h`, `4h`, `6h`, `daily 8am`, `daily 10pm`).

---

## 🎛️ Interactive Sync Control Center

Users can open the dedicated graphical dashboard inside Google Sheets via:
**`👑 Vellum Sync` ➔ `🎛️ Open Sync Control Center (Interactive Panel)`**

### Key Features of Control Center:
1. **Live State**: Shows whether automation is **🟢 ACTIVE** or **⏸️ PAUSED**.
2. **Visual Radio Cards**: Switch sync frequency between 15m, 30m, 1h, 2h, 4h, 6h, Daily 8 AM, or Daily 10 PM in 1 click.
3. **Instant Manual Sync**: Trigger full scans on demand without waiting for the timer.
4. **Pause Automation**: Safely clean and remove all background triggers with one click.
5. **Stats & Audit**: Displays last sync timestamp, total catalogs processed, new additions, and updates.

---

## 📋 Google Sheet Menu Structure

```
👑 Vellum Sync
├── 🚀 Run Sync Now (All Catalogs)
├── 👗 Sync Model Shoots Only
├── 🪑 Sync Table Shoots Only
├── ----------------------------------------------------
├── ⏱️ Set Automatic Frequency
│   ├── ⚡ High Frequency: Every 15 Minutes (Shoot Day / Rapid Ingestion)
│   ├── ⏱️ Active Hours: Every 30 Minutes
│   ├── 🕒 Standard: Every 1 Hour
│   ├── 🕓 Regular: Every 2 Hours
│   ├── 🕕 Batch: Every 4 Hours
│   ├── 🕗 Shift: Every 6 Hours
│   ├── 🌅 Daily Morning: 8:00 AM (Pre-Dispatch Sync)
│   ├── 🌙 Daily Night: 10:00 PM (End of Day Audit)
│   └── 🛠️ Custom Frequency Setup (Enter Minutes / Hours)...
├── ----------------------------------------------------
├── 🎛️ Open Sync Control Center (Interactive Panel)
├── 📊 Check Active Schedule & Sync Health
├── ----------------------------------------------------
└── 🛑 Stop All Automatic Syncing (Pause Trigger)
```

---

## 🔄 What Gets Synced From Drive Folders:
1. **Catalog Code & Title**: Extracted from `.txt` description or folder name.
2. **Retail Price (MRP)**: Automatically extracted from `Price: ₹.../-` in `.txt` file.
3. **Fabric & Border**: Read from `.txt` specs.
4. **Colorways**: Grouped by 3-digit numbering (`101, 102...` for color 1, `201...` for color 2).
5. **Cover Photo**: Isolated `000.jpeg` master lookbook poster, or `101` first angle.
6. **Drive Link**: Direct web link to the catalog shoot folder.
7. **Calculated Rates**: Wholesale (`-12%`) and Prime (`-20%`) if not manually set by Admin.
