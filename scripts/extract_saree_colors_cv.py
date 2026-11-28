"""
==============================================================================
VELLUM ATELIER — PYTHON K-MEANS + HSV MASKING SAREE COLOR EXTRACTOR
==============================================================================
Analyzes every colorway hero image in data/catalogs.json using:
  1. Shoot-aware Region-of-Interest (ROI) cropping (Model vs Table Shoot)
  2. HSV Masking to strip studio white/grey/black backgrounds & skin tones
  3. Deterministic K-Means Clustering (k=4) on fabric pixels
  4. Perceptual CIELAB (Delta-E) matching against an Indian Saree Palette
  5. Syncs updated Color Names & Hex Codes to catalogs.json, CSV, and Google Sheet
==============================================================================
"""

import os
import io
import re
import csv
import json
import math
import time
import argparse
import colorsys
import subprocess
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from PIL import Image

BASE_DIR = 'E:/Shakti/GitHub/Vellum'
CATALOGS_FILE = os.path.join(BASE_DIR, 'data/catalogs.json')
SHEET_CSV_FILE = os.path.join(BASE_DIR, 'data/google_sheet_master.csv')
CACHE_FILE = os.path.join(BASE_DIR, 'data/color_cv_cache.json')

# Authentic Indian Saree & Textile Color Dictionary (Name -> Reference RGB)
SAREE_PALETTE = {
    'Ruby Red': (196, 30, 58),
    'Crimson Red': (165, 28, 48),
    'Sindoori Red': (210, 43, 43),
    'Imperial Maroon': (120, 15, 35),
    'Deep Wine': (105, 35, 55),
    'Burgundy': (128, 0, 32),
    'Rani Pink': (219, 39, 119),
    'Magenta': (190, 24, 93),
    'Rose Pink': (236, 72, 153),
    'Baby Pink': (244, 154, 193),
    'Gajari Pink': (229, 83, 102),
    'Coral Peach': (240, 115, 95),
    'Peach Sunset': (245, 160, 115),
    'Kesari Orange': (234, 88, 12),
    'Rust Copper': (175, 75, 45),
    'Terracotta': (192, 92, 62),
    'Mustard Gold': (202, 138, 4),
    'Haldi Yellow': (234, 179, 8),
    'Bright Yellow': (245, 205, 35),
    'Lemon Yellow': (240, 225, 90),
    'Antique Gold': (184, 148, 72),
    'Bottle Green': (15, 76, 48),
    'Emerald Green': (21, 128, 61),
    'Mehendi Green': (85, 115, 32),
    'Olive Green': (105, 115, 48),
    'Parrot Green': (52, 168, 58),
    'Pista Mint': (134, 215, 162),
    'Rama Green': (0, 118, 110),
    'Peacock Rama': (0, 95, 115),
    'Sea Green': (32, 160, 145),
    'Turquoise': (24, 175, 195),
    'Firozi Sky Blue': (56, 175, 232),
    'Royal Blue': (30, 58, 138),
    'Cobalt Blue': (37, 99, 215),
    'Midnight Navy': (18, 32, 72),
    'Teal Blue': (15, 118, 138),
    'Imperial Purple': (107, 33, 168),
    'Deep Violet': (88, 28, 135),
    'Soft Lavender': (168, 120, 215),
    'Mauve Plum': (145, 85, 125),
    'Chocolate Brown': (95, 58, 40),
    'Chiku Beige': (195, 155, 115),
    'Makkhan Cream': (238, 225, 195),
    'Ivory White': (240, 238, 232),
    'Silver Grey': (165, 170, 178),
    'Charcoal Grey': (75, 82, 92),
    'Jet Black': (28, 28, 32),
}


def rgb_to_lab(rgb):
    """Convert sRGB (0-255) to perceptual CIELAB (L*, a*, b*)."""
    r, g, b = [x / 255.0 for x in rgb]
    r = ((r + 0.055) / 1.055) ** 2.4 if r > 0.04045 else r / 12.92
    g = ((g + 0.055) / 1.055) ** 2.4 if g > 0.04045 else g / 12.92
    b = ((b + 0.055) / 1.055) ** 2.4 if b > 0.04045 else b / 12.92

    x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047
    y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.00000
    z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883

    def f(t):
        return t ** (1.0 / 3.0) if t > 0.008856 else (7.787 * t) + (16.0 / 116.0)

    fx, fy, fz = f(x), f(y), f(z)
    L = (116.0 * fy) - 16.0
    a = 500.0 * (fx - fy)
    b_val = 200.0 * (fy - fz)
    return (L, a, b_val)


PALETTE_LAB = {name: rgb_to_lab(rgb) for name, rgb in SAREE_PALETTE.items()}


def match_saree_color_name(rgb):
    """Find nearest Indian saree color name using CIELAB Delta-E distance."""
    lab = rgb_to_lab(rgb)
    best_name = 'Multi-Color'
    best_dist = float('inf')
    for name, p_lab in PALETTE_LAB.items():
        d = (lab[0] - p_lab[0]) ** 2 + (lab[1] - p_lab[1]) ** 2 + (lab[2] - p_lab[2]) ** 2
        if d < best_dist:
            best_dist = d
            best_name = name
    return best_name


def kmeans_rgb(pixels, k=4, max_iter=12):
    """Deterministic K-Means clustering on list of (R, G, B) tuples."""
    n = len(pixels)
    if n == 0:
        return [((148, 163, 184), 1)]
    if n <= k:
        return [(p, 1) for p in pixels]

    # Deterministic spread initialization across pixel list
    step = max(1, n // k)
    centroids = [list(pixels[i * step]) for i in range(k)]

    counts = [0] * k
    for _ in range(max_iter):
        sums = [[0, 0, 0] for _ in range(k)]
        counts = [0] * k
        for r, g, b in pixels:
            best_idx = 0
            best_d = 999999999
            for idx in range(k):
                cr, cg, cb = centroids[idx]
                dr = r - cr
                dg = g - cg
                db = b - cb
                d = dr * dr + dg * dg + db * db
                if d < best_d:
                    best_d = d
                    best_idx = idx
            sums[best_idx][0] += r
            sums[best_idx][1] += g
            sums[best_idx][2] += b
            counts[best_idx] += 1

        moved = False
        for idx in range(k):
            if counts[idx] > 0:
                nr = sums[idx][0] / counts[idx]
                ng = sums[idx][1] / counts[idx]
                nb = sums[idx][2] / counts[idx]
                if abs(nr - centroids[idx][0]) > 0.5 or abs(ng - centroids[idx][1]) > 0.5 or abs(nb - centroids[idx][2]) > 0.5:
                    moved = True
                centroids[idx] = [nr, ng, nb]
        if not moved:
            break

    clusters = []
    for idx in range(k):
        if counts[idx] > 0:
            c_rgb = (int(round(centroids[idx][0])), int(round(centroids[idx][1])), int(round(centroids[idx][2])))
            clusters.append((c_rgb, counts[idx]))
    return clusters


def extract_saree_color_from_image_bytes(img_bytes, shoot_type='model'):
    """Apply shoot-aware ROI crop + HSV masking + K-Means to extract saree fabric color."""
    img = Image.open(io.BytesIO(img_bytes)).convert('RGB')
    w, h = img.size

    # 1. Shoot-aware ROI Cropping
    if shoot_type == 'model':
        # Torso & drape zone (skip face/head at top and studio edges)
        left, top, right, bottom = int(w * 0.22), int(h * 0.30), int(w * 0.78), int(h * 0.84)
    else:
        # Table flat-lay central saree area
        left, top, right, bottom = int(w * 0.16), int(h * 0.16), int(w * 0.84), int(h * 0.84)

    roi = img.crop((left, top, max(left + 10, right), max(top + 10, bottom)))
    # Resize ROI to ~80x100 for fast, crisp clustering
    roi = roi.resize((80, 100), Image.Resampling.BILINEAR)
    raw_pixels = list(roi.get_flattened_data()) if hasattr(roi, 'get_flattened_data') else list(roi.getdata())

    # 2. HSV Masking (strip studio whites, deep blacks, neutral greys)
    filtered = []
    for r, g, b in raw_pixels:
        hue, sat, val = colorsys.rgb_to_hsv(r / 255.0, g / 255.0, b / 255.0)
        # Skip blown-out studio white / off-white
        if sat < 0.14 and val > 0.76:
            continue
        # Skip deep black shadows
        if val < 0.09:
            continue
        # Skip neutral studio grey
        if sat < 0.11 and 0.09 <= val <= 0.76:
            continue
        filtered.append((r, g, b))

    # Fallback for genuinely Ivory/White/Silver/Black sarees
    use_pixels = filtered if len(filtered) >= len(raw_pixels) * 0.15 else raw_pixels

    # 3. K-Means Clustering (k=4)
    clusters = kmeans_rgb(use_pixels, k=4, max_iter=12)

    # 4. Score clusters: favour large textile area + vibrant fabric saturation (avoid minor dull/skin/border noise)
    best_rgb = clusters[0][0]
    best_score = -1.0
    for rgb, count in clusters:
        _, sat, val = colorsys.rgb_to_hsv(rgb[0] / 255.0, rgb[1] / 255.0, rgb[2] / 255.0)
        # Weight cluster size with fabric richness
        score = count * (0.45 + 0.55 * sat)
        if score > best_score:
            best_score = score
            best_rgb = rgb

    hex_code = '#{:02x}{:02x}{:02x}'.format(*best_rgb)
    color_name = match_saree_color_name(best_rgb)
    return color_name, hex_code


def fetch_and_analyze(task):
    """Worker function for ThreadPoolExecutor."""
    img_url, shoot_type = task
    thumb_url = img_url.split('=')[0] + '=w220'
    req = urllib.request.Request(thumb_url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=12) as resp:
        data = resp.read()
    return extract_saree_color_from_image_bytes(data, shoot_type=shoot_type)


def main():
    start_time = time.time()
    print('Loading catalogs and CV color cache...')
    with open(CATALOGS_FILE, 'r', encoding='utf-8') as f:
        catalogs = json.load(f)

    cache = {}
    if os.path.exists(CACHE_FILE):
        try:
            with open(CACHE_FILE, 'r', encoding='utf-8') as f:
                cache = json.load(f)
        except Exception:
            cache = {}

    # Collect unique (url, shootType) tasks not yet in cache
    tasks = {}
    for cat in catalogs:
        st = cat.get('shootType', 'model')
        for d in cat.get('designs', []):
            url = d.get('heroImageUrl') or (d.get('imageUrls') or [None])[0]
            if url:
                key = f"{url}|{st}"
                if key not in cache:
                    tasks[key] = (url, st)

    print(f'Total catalogs: {len(catalogs)} | Cache hits: {len(cache)} | Images to analyze via CV: {len(tasks)}')

    if tasks:
        done = 0
        errors = 0
        with ThreadPoolExecutor(max_workers=16) as executor:
            future_map = {executor.submit(fetch_and_analyze, t): k for k, t in tasks.items()}
            for fut in as_completed(future_map):
                key = future_map[fut]
                done += 1
                try:
                    c_name, c_hex = fut.result()
                    cache[key] = {'color': c_name, 'hex': c_hex}
                except Exception as e:
                    errors += 1
                if done % 50 == 0 or done == len(tasks):
                    print(f'  Processed {done}/{len(tasks)} images (errors: {errors})...')

        with open(CACHE_FILE, 'w', encoding='utf-8') as f:
            json.dump(cache, f, indent=2, ensure_ascii=False)

    # Apply extracted CV colors to catalogs.json
    updated_designs = 0
    for cat in catalogs:
        st = cat.get('shootType', 'model')
        for d in cat.get('designs', []):
            url = d.get('heroImageUrl') or (d.get('imageUrls') or [None])[0]
            if url:
                key = f"{url}|{st}"
                if key in cache:
                    d['color'] = cache[key]['color']
                    d['colorHex'] = cache[key]['hex']
                    updated_designs += 1

    with open(CATALOGS_FILE, 'w', encoding='utf-8') as f:
        json.dump(catalogs, f, indent=2, ensure_ascii=False)

    # Update data/google_sheet_master.csv
    csv_rows = [[
        'Catalog Code', 'Catalog Name', 'Fabric Category', 'Shoot Type',
        '1. Prime Rate (₹)', '2. Wholesale Rate (₹)', '3. Retail / MRP (₹)',
        'Stock Status', 'Total Colors', 'Colorway Names',
        'Drive Cover Image URL', 'Google Drive Folder URL'
    ]]
    for cat in catalogs:
        shoot_label = '👗 Model Shoot' if cat.get('shootType') == 'model' else '🪑 Table Shoot'
        designs = cat.get('designs', [])
        color_names = ', '.join([d.get('color', '') for d in designs if d.get('color')])
        cover_url = cat.get('zeroCoverUrl') if cat.get('has000Cover') and cat.get('zeroCoverUrl') else cat.get('heroImageUrl', '')
        csv_rows.append([
            cat.get('code', ''),
            cat.get('name', ''),
            cat.get('category', cat.get('fabric', 'Silk')),
            shoot_label,
            cat.get('resellerRate', 799),
            cat.get('wholesaleRate', 869),
            cat.get('retailRate', 999),
            cat.get('status', 'In Stock'),
            len(designs),
            color_names,
            cover_url,
            cat.get('driveFolderUrl', '')
        ])

    with open(SHEET_CSV_FILE, 'w', encoding='utf-8', newline='') as f:
        writer = csv.writer(f)
        writer.writerows(csv_rows)

    elapsed = round(time.time() - start_time, 1)
    print(f'✓ CV Color Extraction Complete in {elapsed}s! Updated {updated_designs} colorways across {len(catalogs)} catalogs.')


def analyze_local_catalog_folder(folder_path, shoot_type='auto'):
    """Scan a single local catalog folder for 1xx/2xx/3xx images (ignoring 000)."""
    if shoot_type == 'auto':
        st = 'table' if 'table' in folder_path.lower() else 'model'
    else:
        st = shoot_type

    series_first_img = {}
    for fname in sorted(os.listdir(folder_path)):
        lower = fname.lower()
        if not lower.endswith(('.jpg', '.jpeg', '.png', '.webp')):
            continue
        base = os.path.splitext(lower)[0]
        if base.startswith('000'):
            continue
        m = re.match(r'^([1-9])\d{2}', base)
        series_key = m.group(1) if m else base
        if series_key not in series_first_img:
            series_first_img[series_key] = os.path.join(folder_path, fname)

    results = []
    for s_key in sorted(series_first_img.keys(), key=lambda x: (0, int(x)) if x.isdigit() else (1, x)):
        fpath = series_first_img[s_key]
        with open(fpath, 'rb') as f:
            c_name, c_hex = extract_saree_color_from_image_bytes(f.read(), shoot_type=st)
        design_code = f'{s_key}01' if s_key.isdigit() else s_key
        results.append((design_code, os.path.basename(fpath), c_name, c_hex))
    return results


def run_local_dir(local_dir, shoot_type='auto'):
    """Scan a local disk folder (single catalog or parent of multiple catalog folders)."""
    local_dir = os.path.abspath(local_dir)
    if not os.path.isdir(local_dir):
        print(f'Error: Directory not found -> {local_dir}')
        return

    print(f'Scanning local disk directory: {local_dir}')
    catalog_folders = []

    # Check if local_dir itself contains saree images directly
    direct_imgs = [f for f in os.listdir(local_dir) if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp'))]
    if direct_imgs:
        catalog_folders.append(local_dir)
    else:
        for root, dirs, files in os.walk(local_dir):
            imgs = [f for f in files if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp'))]
            if imgs:
                catalog_folders.append(root)

    if not catalog_folders:
        print('No saree images (.jpg, .jpeg, .png, .webp) found in that folder.')
        return

    out_csv = os.path.join(local_dir, 'extracted_colors.csv')
    csv_rows = [['Catalog Folder', 'Design Code', 'Sample Image', 'Detected Color', 'HEX Code']]

    for folder in catalog_folders:
        folder_name = os.path.basename(folder)
        res = analyze_local_catalog_folder(folder, shoot_type=shoot_type)
        if not res:
            continue
        print(f'\n[{folder_name}] ({len(res)} colorways):')
        for design_code, fname, c_name, c_hex in res:
            print(f'  Design {design_code:<5} | {fname:<20} -> {c_name:<18} ({c_hex})')
            csv_rows.append([folder_name, design_code, fname, c_name, c_hex])

    with open(out_csv, 'w', encoding='utf-8', newline='') as f:
        csv.writer(f).writerows(csv_rows)
    print(f'\n✓ Saved local color report to: {out_csv}')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Vellum K-Means + HSV Masking Saree Color Extractor')
    parser.add_argument('--local-dir', type=str, help='Path to local disk folder containing saree photos or catalog subfolders')
    parser.add_argument('--shoot-type', type=str, default='auto', choices=['auto', 'model', 'table'], help='Shoot type for ROI crop (default: auto)')
    parser.add_argument('--force', action='store_true', help='Ignore cache and re-analyze all Drive images')
    args = parser.parse_args()

    if args.force and os.path.exists(CACHE_FILE):
        os.remove(CACHE_FILE)

    if args.local_dir:
        run_local_dir(args.local_dir, shoot_type=args.shoot_type)
    else:
        main()
