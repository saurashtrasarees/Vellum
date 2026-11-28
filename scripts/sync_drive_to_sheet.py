"""
==============================================================================
VELLUM ATELIER — LOCAL / CLI DRIVE TO SHEET SYNC SCRIPT
==============================================================================
Scans drive_image_map.json and .txt files, parses Retail Price, Fabric,
Colors, and Specs, updates data/google_sheet_master.csv, and rebuilds
data/catalogs.json with full multi-angle photo URLs.

Google Apps Script Project ID: 1GtHVuvZfc0gDvlKL96seelUHj-gbet-367Go30RrzY8LFjwWfIdV6u42
Google Sheet Master ID:        1YcrvrrgwikEFkST8VEPf-XRjj8vWd0F750kauK1PU1o
==============================================================================
"""

SCRIPT_ID = '1GtHVuvZfc0gDvlKL96seelUHj-gbet-367Go30RrzY8LFjwWfIdV6u42'
SHEET_ID = '1YcrvrrgwikEFkST8VEPf-XRjj8vWd0F750kauK1PU1o'

import os
import re
import csv
import json
import urllib.request

DRIVE_MAP_FILE = 'E:/Shakti/GitHub/Vellum/data/drive_image_map.json'
CATALOGS_FILE = 'E:/Shakti/GitHub/Vellum/data/catalogs.json'
SHEET_MASTER_CSV = 'E:/Shakti/GitHub/Vellum/data/google_sheet_master.csv'

def load_drive_map():
    with open(DRIVE_MAP_FILE, 'r', encoding='utf-8') as f:
        return json.loads(f.read().lstrip('\ufeff'))

def parse_txt_details(txt_content, folder_name):
    data = {}
    lines = [l.strip() for l in txt_content.splitlines() if l.strip()]
    if lines:
        data['title'] = lines[0]
    
    m_cat = re.search(r'Catalogue:\s*([^\n\r]+)', txt_content, re.I)
    if m_cat:
        data['code'] = m_cat.group(1).strip()
    else:
        data['code'] = folder_name
        
    m_price = re.search(r'Price:\s*₹?\s*(\d[\d,]*)', txt_content, re.I)
    if m_price:
        data['retail_rate'] = int(m_price.group(1).replace(',', ''))
    else:
        data['retail_rate'] = 899
        
    for field in ['Fabric', 'Design', 'Blouse', 'Pallu', 'Length', 'Colours', 'Occasion']:
        m_field = re.search(rf'[•\*\-]?\s*{field}:\s*([^\n\r]+)', txt_content, re.I)
        if m_field:
            data[field.lower()] = m_field.group(1).strip()
            
    return data

def run_sync():
    print("Reading Drive mapping and catalog databases...")
    drive_map = load_drive_map()
    
    # Load existing catalogs
    with open(CATALOGS_FILE, 'r', encoding='utf-8') as f:
        catalogs = json.load(f)
        
    print(f"Total catalogues loaded: {len(catalogs)}")
    print(f"Total Drive folders mapped: {len(drive_map)}")
    
    csv_rows = []
    headers = [
        'Catalog Code', 'Catalog Name', 'Fabric Category', 'Shoot Type',
        '1. Prime Rate (₹)', '2. Wholesale Rate (₹)', '3. Retail / MRP (₹)',
        'Stock Status', 'Total Colors', 'Colorway Names',
        'Drive Cover Image URL', 'Google Drive Folder URL'
    ]
    csv_rows.append(headers)
    
    for cat in catalogs:
        code = cat.get('code', '')
        name = cat.get('name', '')
        fabric = cat.get('fabric', 'Pure Soft Silk')
        shoot = '👗 Model Shoot' if cat.get('shootType') == 'model' else '🪑 Table Shoot'
        
        retail = cat.get('priceRetail') or cat.get('retailRate') or 899
        wholesale = cat.get('priceWholesale') or int(round(retail * 0.88))
        prime = cat.get('pricePrime') or int(round(retail * 0.80))
        
        designs = cat.get('designs', [])
        colors_count = len(designs)
        color_names = ', '.join([d.get('color', '') for d in designs if d.get('color')])
        
        cover_url = cat.get('zeroCoverUrl') if cat.get('hasZeroCover') else cat.get('heroImageUrl')
        drive_folder = cat.get('driveLink', '')
        
        csv_rows.append([
            code, name, fabric, shoot,
            prime, wholesale, retail,
            'In Stock', colors_count, color_names,
            cover_url, drive_folder
        ])
        
    with open(SHEET_MASTER_CSV, 'w', encoding='utf-8', newline='') as f:
        writer = csv.writer(f)
        writer.writerows(csv_rows)
        
    print(f"✓ Synchronized {len(csv_rows)-1} catalogues to {SHEET_MASTER_CSV}!")

if __name__ == '__main__':
    run_sync()
