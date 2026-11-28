# Vellum 🥻
> **Imperial Haute Couture Digital Textile Showroom & B2B Wholesale Engine**  
> *Developed for **Saurashtra Sarees** & **Keya Fashion** — Direct Surat Mill Manufacturers & Wholesale Super-Stockists.*  
> *Engineered by **BinduGrid Studio [ØG]** (<bindugrid@gmail.com>).*

[![Live Domain](https://img.shields.io/badge/Live%20Domain-saurashtrasarees.com-8b1d40?style=for-the-badge&logo=googlechrome&logoColor=white)](https://saurashtrasarees.com)
[![Live GitHub Repository](https://img.shields.io/badge/GitHub-saurashtrasarees%2FVellum-181717?style=for-the-badge&logo=github)](https://github.com/saurashtrasarees/Vellum)
[![Google Sheet Database](https://img.shields.io/badge/Google%20Sheet-Live%20Database-34A853?style=for-the-badge&logo=googlesheets&logoColor=white)](https://docs.google.com/spreadsheets/d/1YcrvrrgwikEFkST8VEPf-XRjj8vWd0F750kauK1PU1o/edit)
[![Curated Inventory](https://img.shields.io/badge/Curated%20Volumes-132%20Total%20(45%20Model%20•%2087%20Table)-d4af37?style=for-the-badge)](https://saurashtrasarees.com/catalog.html)
[![Surat Mill Direct](https://img.shields.io/badge/Origin-Surat%2C%20Gujarat-8b1d40?style=for-the-badge)](https://saurashtrasarees.com)

---

## 🏛️ Brand Architecture & Mill Atelier

Vellum powers two flagship ethnic wear brands operating from Surat's premier textile corridor:

| Firm | Brand Slogan | Accent Palette | Primary Focus | Direct Desk Contacts |
| :--- | :--- | :--- | :--- | :--- |
| **Saurashtra Sarees** | *Make Occasion Better* | `#8b1d40` (Royal Maroon) & `#d4af37` (Gold) | Direct Mill Wholesale & Super Stockist Distribution | **Nayan Patel [Founder]**: `+91 98794 71039`<br>**Chetan Patel [Co-Founder]**: `+91 99136 43433` |
| **Keya Fashion** | *Stop wishing. Start living....* | `#0284c7` (Atelier Sky) & `#f59e0b` (Amber) | Curated Catalogues & Retail Showroom Collections | **Nayan Patel [Founder]**: `+91 98794 71039`<br>**Chetan Patel [Co-Founder]**: `+91 99136 43433` |

* **Atelier & Registered Mill Address:**  
  `A-1001, Rajhans Fabrizo, Near Polaris Textile City, Magob, Surat, Gujarat – 395010`
* **Operating Hours:** 10:00 AM – 07:00 PM (Monday–Saturday)
* **Location Pin:** [Google Maps Directions](https://maps.app.goo.gl/zUFKsVaYb4rvTaiD6)
* **Manufacturing Provenance:**  
  * **10+ Years** Continuous Manufacturing  
  * **5,000+** Boutiques & Stockists Served  

---

## ⚡ Architecture: Direct Google Drive Mapping + Google Sheet Master + GitHub Frontend

Vellum uses **Google Drive & Google Sheets as its master database and content engine**, paired with a lightweight **GitHub-hosted frontend** mapped to custom domain `saurashtrasarees.com`:

* **Direct Google Drive Image Mapping:** Images stream globally directly from authenticated Google Drive view links (`https://lh3.googleusercontent.com/d/{fileId}`). No heavy media files are stored in git or third-party servers.
* **Master Google Sheet Database:** [`1YcrvrrgwikEFkST8VEPf-XRjj8vWd0F750kauK1PU1o`](https://docs.google.com/spreadsheets/d/1YcrvrrgwikEFkST8VEPf-XRjj8vWd0F750kauK1PU1o/edit)
* **Live Dynamic Pricing:** Commercial rate tiers (Prime, Wholesale, Retail) stream in real time from Google Sheets to active showroom buyers.
* **SOP (Standard Operating Procedure):**
  1. Add/modify catalogue images or reels in Google Drive folder.
  2. In Admin Panel, click **`🔄 Synchronise from Google Drive & Update Frontend`** or **`Fetch Live Google Sheet Rates`**.
  3. Changes reflect instantly across all frontend client smart links.

---

## 📦 132 Curated Volumes (Real Mill Data)

* **👗 45 Model Shoot Volumes:** High-fashion runway lookbooks and video reels.
* **🪑 87 Table Shoot Volumes:** Authentic flat-lay captures highlighting warp/weft detail, zari sheen, and true-to-life color fidelity.
* **Direct Specifications:** Saree lengths, blouse fabrics, approximate weights, and retail MRP parsed directly from `.txt` catalog sheets.

---

## 🖼️ Surat Textile `000` Cover Convention

* **Represents NO Color:** `000` cover image is strictly excluded from color swatches.
* **Master Volume Poster:** Automatically features as the main showroom card hero image.

---

## 💰 Commercial Pricing Hierarchy

$$\text{1. Prime Rate (P)} \quad < \quad \text{2. Wholesale Rate (W)} \quad < \quad \text{3. Retail / MRP}$$

1. **Prime Rate (Tier 1):** Exclusive rate for VIP volume buyers and institutional partners.
2. **Wholesale Rate (Tier 2):** Super stockist B2B direct mill wholesale rate.
3. **Retail Rate (Tier 3):** Standard catalog MRP for boutique end-buyers.

> 🔒 **Single-Rate PDP Rule:** On the public Product Detail Page (PDP), buyers only see the single price tier authorized by their specific link. Wholesale rates are strictly hidden from retail buyers.

---

## 🔗 Staff Smart Links

| Tier | Link Parameter | Example Link | Rate Displayed |
| :--- | :--- | :--- | :--- |
| **Retail MRP (Default)** | `?staff=NA39` | `https://saurashtrasarees.com/catalog.html?staff=NA39` | **Retail / Catalog MRP** |
| **Wholesale B2B** | `?staff=NA39W` | `https://saurashtrasarees.com/catalog.html?staff=NA39W` | **Wholesale Price** |
| **Prime Exclusive** | `?staff=NA39P` | `https://saurashtrasarees.com/catalog.html?staff=NA39P` | **Prime Rate** |

---

## 🛠️ Super Admin Control Hub (`admin.html`)

1. **Staff Directory & Smart Link Hub:** Manage staff profiles, create campaign deep links.
2. **Google Drive Synchronizer:** Scans Google Drive and maps high-resolution direct links.
3. **High-Efficiency Stock Control:** 1-click status updates (🟢 Ready Lot, 🟡 Re-Weaving 3–5 Days, 🔴 Sold Out).
4. **Google Sheet Database:** Real-time bi-directional sync with Sheet `1YcrvrrgwikEFkST8VEPf-XRjj8vWd0F750kauK1PU1o`.
5. **Universal Firm Manager:** Real-time branding and contact management for Saurashtra Sarees and Keya Fashion.

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
# http://localhost:8080/catalog.html
# http://localhost:8080/admin.html (Protected via PIN: 551799)
```

### Custom Domain Configuration (Hostinger -> GitHub Pages):
* **Custom Domain:** `saurashtrasarees.com` (CNAME file in repo root)
* **DNS Settings in Hostinger:**
  * `A` records pointing to GitHub Pages IPs:
    * `185.199.108.153`
    * `185.199.109.153`
    * `185.199.110.153`
    * `185.199.111.153`
  * `CNAME` record: `www` pointing to `saurashtrasarees.github.io`
* **GitHub Settings > Pages:**
  * Source: **Deploy from a branch**
  * Branch: `main` / `/(root)`
  * Custom domain: `saurashtrasarees.com` (Enforce HTTPS enabled)

---

## 🎨 Executive Leadership & Inquiries

* **Nayan Patel [Founder]**: `+91 98794 71039` | `saurashtrasarees@gmail.com`
* **Chetan Patel [Co-Founder]**: `+91 99136 43433` | `keyafashion5517@gmail.com`
* **Architecture & Engineering Systems:** **BinduGrid Studio [ØG]** (<bindugrid@gmail.com>)

---
*© 2014–2026 Saurashtra Sarees. All rights reserved. Powered by Vellum.*
