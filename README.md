# Vellum 🥻
> **Imperial Haute Couture Digital Textile Showroom & B2B Wholesale Engine**  
> *Developed for **Saurashtra Sarees** & **Keya Fashion** — Direct Surat Mill Manufacturers & Wholesale Stockists.*  
> *Engineered by **BinduGrid Studio [ØG]**.*

[![Live GitHub Repository](https://img.shields.io/badge/GitHub-saurashtrasarees%2FVellum-181717?style=for-the-badge&logo=github)](https://github.com/saurashtrasarees/Vellum)
[![Google Sheet Database](https://img.shields.io/badge/Google%20Sheet-Live%20Database-34A853?style=for-the-badge&logo=googlesheets&logoColor=white)](https://docs.google.com/spreadsheets/d/1YcrvrrgwikEFkST8VEPf-XRjj8vWd0F750kauK1PU1o/edit)
[![Curated Inventory](https://img.shields.io/badge/Curated%20Volumes-132%20Total%20(45%20Model%20•%2087%20Table)-d4af37?style=for-the-badge)](https://github.com/saurashtrasarees/Vellum)
[![Surat Mill Direct](https://img.shields.io/badge/Origin-Surat%2C%20Gujarat-8b1d40?style=for-the-badge)](https://github.com/saurashtrasarees/Vellum)

---

## 🏛️ Brand Architecture & Mill Atelier

Vellum powers two flagship ethnic wear brands operating from Surat's premier textile hub:

| Firm | Brand Slogan | Accent Palette | Primary Focus | Direct Desk |
| :--- | :--- | :--- | :--- | :--- |
| **Saurashtra Sarees** | *Make Occasion Better* | `#8b1d40` (Royal Maroon) & `#d4af37` (Gold) | Direct Mill Wholesale & Super Stockist Distribution | `+91 98249 82338` / `+91 98794 71039` |
| **Keya Fashion** | *Stop wishing. Start living....* | `#0284c7` (Atelier Sky) & `#f59e0b` (Amber) | Curated Catalogues & Retail Showroom Collections | `+91 98254 52528` / `+91 99094 52528` |

* **Atelier & Registered Mill Address:**  
  `A-1001, Rajhans Fabrizo, Near Polaris Textile City, BRTS Road, Magob, Surat, Gujarat – 395010`
* **Operating Hours:** 09:00 AM – 07:00 PM (Monday–Saturday)

---

## ⚡ Architecture: Google Sheet Database + GitHub Frontend

Vellum uses **Google Sheets as its master database and background engine**, paired with a lightweight **GitHub-hosted frontend** for instant global loading speeds:

* **Master Google Sheet ID:** [`1YcrvrrgwikEFkST8VEPf-XRjj8vWd0F750kauK1PU1o`](https://docs.google.com/spreadsheets/d/1YcrvrrgwikEFkST8VEPf-XRjj8vWd0F750kauK1PU1o/edit)
* **Frontend Repository:** [github.com/saurashtrasarees/Vellum](https://github.com/saurashtrasarees/Vellum)
* **Live Pricing Sync:** Pricing matrices and stock levels edit directly in Google Sheets and stream live to active showroom shoppers via GViz CSV endpoints.
* **Zero Dark Mode Guarantee:** 100% Light Luxury aesthetic (warm ivory, champagne gold, textured cloud motifs, pure white, and Surat gold accents).

---

## 📦 132 Curated Volumes (Real Mill Data)

Unlike generic e-commerce templates with dummy placeholder data, Vellum is populated directly from authentic Google Drive catalog folders:

* **👗 45 Model Shoot Volumes:** High-fashion lifestyle runway draping, model lookbook captures, and full 4K HD video reels.
* **🪑 87 Table Shoot Volumes:** Authentic flat-lay captures highlighting warp/weft detail, metallic zari sheen, contrast borders, and true-to-life color fidelity.
* **Direct `.txt` Parsing:** Every volume's technical specifications, design story, dispatch availability, and Retail MRP are parsed directly from its respective `.txt` catalog document.

---

## 🖼️ Surat Textile `000` Cover Convention

In Surat textile catalog distribution, `000.jpeg` / `000.jpg` serves as the master catalog poster / all-colorway collage:

* **Represents NO Color:** `000` is strictly excluded from colorway swatches so it is never counted as an individual saree shade.
* **Master Poster Display:** Catalogs with `000` automatically feature it as the main showroom card hero image, designated with an elegant `🖼️ 000 Cover` badge.
* **Product Detail Page (PDP):** Shoppers can inspect the full `000 Master Catalog Poster` via a dedicated button without polluting color dot selections.

---

## 💰 Commercial Pricing Hierarchy

Pricing strictly follows wholesale manufacturing economics:

$$\text{1. Prime Rate (Lowest)} \quad < \quad \text{2. Wholesale Rate} \quad < \quad \text{3. Retail / Catalog MRP (Highest)}$$

1. **Prime Rate (Tier 1):** Exclusive rate for VIP volume buyers and institutional partners.
2. **Wholesale Rate (Tier 2):** Super stockist B2B direct mill wholesale rate.
3. **Retail Rate (Tier 3):** Standard catalog MRP fetched directly from the catalog's `.txt` file for general retail buyers.

---

## 🔗 Staff Smart Links (Tamper-Proof Link Architecture)

Sales representatives share targeted links that dynamically configure the pricing tier on-screen with zero buyer login friction:

| Tier | Link Parameter | Example Link | Rate Displayed |
| :--- | :--- | :--- | :--- |
| **Retail MRP (Default)** | `?u=<StaffCode>` | `https://saurashtrasarees.github.io/Vellum/?u=AR38` | **Retail / Catalog MRP** |
| **Wholesale B2B** | `?u=<StaffCode>W` | `https://saurashtrasarees.github.io/Vellum/?u=AR38W` | **Wholesale Price** |
| **Prime Exclusive** | `?u=<StaffCode>P` | `https://saurashtrasarees.github.io/Vellum/?u=AR38P` | **Prime Rate** |

> 🔒 **Tamper-Proof Fail-Safe:** If a retail customer alters the URL query (e.g. typing random letters or removing the code), Vellum automatically defaults to **Retail MRP**.

---

## 🔍 Advanced Multi-Filter & Search Bar

The showroom features an organized, mobile-first multi-filter control grid:

* **Real-Time Search:** Live query matching across catalog names, codes, fabric categories, and weave types with `✕` clear button.
* **Shoot Selector:** Switch instantaneously between `All (132)`, `👗 Model Shoot (45)`, and `🪑 Table Shoot (87)`.
* **Price Range Brackets:**
  * $\le \text{₹}499$ *(Budget Collections)*
  * $\text{₹}500 - \text{₹}999$ *(Fast Moving Lots)*
  * $\text{₹}1,000 - \text{₹}1,499$ *(Festive Silk)*
  * $\text{₹}1,500 - \text{₹}1,999$ *(Pure Silk Artistry)*
  * $\ge \text{₹}2,000$ *(Bridal Haute Couture)*
* **Fabric Weave Dropdown:** Filter by authentic weaves (`Banarasi Silk`, `Paithani Silk`, `Chanderi`, `Tussar Silk`, `Kanjivaram Silk`, `Tissue Silk`, `Cotton Silk`) with dynamic item counts.
* **Active Filter Chips & Reset:** Visual tag bar displaying applied filters with 1-click removal and a **Reset All Filters** button.

---

## 🛠️ Super Admin Control Hub (`admin.html`)

Access via the Super-Admin portal button or `?admin=7401`:

1. **Staff Directory & Smart Link Hub:** Full CRUD (Add, Edit, Delete) for sales representatives, with 1-click generation or revocation of Wholesale (`?u=...W`) and Prime (`?u=...P`) links.
2. **Google Drive Shoot Synchronizer:** Configure central Drive folder URLs (`1JregR_hN7mL3fynLcGOq4ZYaTRHAj91e`), with a 1-click **`🔄 Synchronise from Google Drive & Update Frontend`** button that live-updates the catalog database.
3. **High-Efficiency Stock Control:** 1-click status updates for whole catalogues (🟢 Ready Lot, 🟡 Re-Weaving 3–5 Days, 🔴 Sold Out) plus individual shade drawers.
4. **Google Sheet Live Pricing Hub:** Live sync with Google Sheet `1YcrvrrgwikEFkST8VEPf-XRjj8vWd0F750kauK1PU1o`.
5. **Universal Firm Manager:** Real-time branding and contact configuration for Saurashtra Sarees, Keya Fashion, or newly provisioned brand entities.

---

## 🚀 Local Development & Deployment

### Run Locally:
```bash
# Clone the repository
git clone https://github.com/saurashtrasarees/Vellum.git
cd Vellum

# Start the local development server
python -m http.server 8080
# Or double click: start-server.bat

# Open in browser:
# http://localhost:8080/
# http://localhost:8080/admin.html
```

### Deploy to GitHub Pages:
1. Go to **Repository Settings** > **Pages**.
2. Select **Branch:** `main` and **Folder:** `/(root)`.
3. Click **Save**. Your showroom will be live at `https://saurashtrasarees.github.io/Vellum/`.

---

## 🎨 Design & Engineering Credits

* **Architecture & UI/UX Systems:** **BinduGrid Studio [ØG]**
* **Inquiries & Manufacturing:**
  * Arvind Sir (`AR38`): `+91 98249 82338`
  * Nayan Sir (`NA39`): `+91 98794 71039`
  * Chetan Sir (`CH33`): `+91 99136 43433`
  * Khushi (`KH28`): `+91 98254 52528`
  * Palak (`PA28`): `+91 99094 52528`

---
*© 2026 Saurashtra Sarees & Keya Fashion. All rights reserved. Powered by Vellum.*
