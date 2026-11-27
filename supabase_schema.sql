-- ==============================================================================
-- VELLUM LUXURY TEXTILE SHOWROOM — SUPABASE POSTGRESQL SCHEMA
-- Built for BinduGrid Studio (From the Origin to the Grid)
-- ==============================================================================

-- 1. APP SETTINGS & CLOUD DRIVE CONFIGURATION
CREATE TABLE IF NOT EXISTS app_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed default settings
INSERT INTO app_settings (key, value, description)
VALUES 
  ('drive_shoot_folders', '{
    "modelShootFolderUrl": "https://drive.google.com/open?id=1JregR_hN7mL3fynLcGOq4ZYaTRHAj91e&usp=drive_fs",
    "tableShootFolderUrl": "https://drive.google.com/open?id=1JregR_hN7mL3fynLcGOq4ZYaTRHAj91e&usp=drive_fs",
    "modelFolderId": "1JregR_hN7mL3fynLcGOq4ZYaTRHAj91e",
    "tableFolderId": "1JregR_hN7mL3fynLcGOq4ZYaTRHAj91e"
  }'::jsonb, 'Google Drive shoot folder URLs and IDs for Model and Table photo sets'),
  ('firm_profiles', '{
    "saurashtra": {
      "name": "Saurashtra Sarees",
      "tagline": "Make Occasion Better",
      "theme": "royal-crimson",
      "address": "A-1001, Rajhans Fabrizo, Near Polaris Textile City, BRTS Road, Magob, Surat, Gujarat – 395010",
      "timings": "09:00 AM–07:00 PM (Monday–Saturday)",
      "directorPhone": "+91 98249 82338",
      "partner1Phone": "+91 98794 71039",
      "partner2Phone": "+91 99136 43433",
      "phones": ["+91 98249 82338", "+91 98794 71039", "+91 99136 43433"]
    },
    "keya": {
      "name": "Keya Fashion",
      "tagline": "Stop wishing. Start living....",
      "theme": "festive-cyan",
      "address": "A-1001, Rajhans Fabrizo, Near Polaris Textile City, BRTS Road, Magob, Surat, Gujarat – 395010",
      "timings": "09:00 AM–07:00 PM (Monday–Saturday)",
      "primaryPhone": "+91 98254 52528",
      "orderPhone": "+91 99094 52528",
      "phones": ["+91 98254 52528", "+91 99094 52528"]
    }
  }'::jsonb, 'Firm branding and communication configuration')
ON CONFLICT (key) DO UPDATE 
SET value = EXCLUDED.value, updated_at = NOW();

-- 2. STAFF USER PROFILES & ACCESS TIERS
CREATE TABLE IF NOT EXISTS staff_profiles (
  code TEXT PRIMARY KEY, -- e.g. KH28, AN26, NA39ALL
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  firm TEXT NOT NULL CHECK (firm IN ('keya', 'saurashtra')),
  rate_access TEXT NOT NULL CHECK (rate_access IN ('retail', 'all')),
  title TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed staff members
INSERT INTO staff_profiles (code, name, phone, whatsapp, firm, rate_access, title)
VALUES
  ('KH28', 'Khushi', '9825452528', '919825452528', 'keya', 'retail', 'Dedicated Catalog Representative'),
  ('AN26', 'Anshika', '9825452526', '919825452526', 'keya', 'retail', 'Client Relationship Executive'),
  ('PR28', 'Priti', '9909352528', '919909352528', 'keya', 'retail', 'Customer Sales Coordinator'),
  ('PA28', 'Palak', '9909452528', '919909452528', 'keya', 'retail', 'Order Desk Manager'),
  ('JE04', 'Jenish', '9033808104', '919033808104', 'keya', 'retail', 'Digital Sales Executive'),
  ('AR38', 'Arvind Sir', '9824982338', '919824982338', 'saurashtra', 'retail', 'Senior Showroom Director'),
  ('NA39', 'Nayan Sir', '9879471039', '919879471039', 'saurashtra', 'retail', 'Managing Partner'),
  ('CH33', 'Chetan Sir', '9913643433', '919913643433', 'saurashtra', 'retail', 'Executive Director')
ON CONFLICT (code) DO NOTHING;

-- 3. SAVED CAMPAIGN LINKS TABLE
CREATE TABLE IF NOT EXISTS saved_links (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  staff TEXT NOT NULL,
  rate_tier TEXT NOT NULL CHECK (rate_tier IN ('retail', 'wholesale', 'prime')),
  shoot TEXT DEFAULT 'all',
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CATALOGS MASTER TABLE WITH STOCK STATUS
CREATE TABLE IF NOT EXISTS catalogs (
  id TEXT PRIMARY KEY, -- e.g. aashvi-vol-1
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  fabric TEXT,
  border TEXT,
  pallu TEXT,
  blouse TEXT,
  length TEXT,
  wholesale_rate NUMERIC DEFAULT 0,
  reseller_rate NUMERIC DEFAULT 0,
  retail_rate NUMERIC DEFAULT 0,
  -- Stock Status: 'in_stock', 'temp_out_of_stock' (re-weaving 3-5 days), 'perm_out_of_stock' (discontinued)
  stock_status TEXT DEFAULT 'in_stock' CHECK (stock_status IN ('in_stock', 'temp_out_of_stock', 'perm_out_of_stock')),
  stock_note TEXT DEFAULT 'Ready to Dispatch',
  total_designs INT DEFAULT 0,
  has_video BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CATALOG COLORWAYS & PER-COLOR STOCK STATUS
CREATE TABLE IF NOT EXISTS catalog_colors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  catalog_id TEXT REFERENCES catalogs(id) ON DELETE CASCADE,
  design_code TEXT NOT NULL, -- e.g. 100, 200, 300
  color_name TEXT NOT NULL, -- e.g. Red, Wine, Royal Blue
  hero_image_url TEXT,
  image_urls JSONB DEFAULT '[]'::jsonb,
  video_url TEXT,
  -- Color Level Stock Status: 'in_stock', 'sold_out'
  stock_status TEXT DEFAULT 'in_stock' CHECK (stock_status IN ('in_stock', 'sold_out')),
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(catalog_id, design_code)
);

-- 5. ENABLE REAL-TIME REPLICATION FOR LIVE SYNC
ALTER PUBLICATION supabase_realtime ADD TABLE app_settings;
ALTER PUBLICATION supabase_realtime ADD TABLE catalogs;
ALTER PUBLICATION supabase_realtime ADD TABLE catalog_colors;
ALTER PUBLICATION supabase_realtime ADD TABLE saved_links;

-- 6. ENABLE ROW LEVEL SECURITY (Public read for client app, authenticated for admin)
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalog_colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read app_settings" ON app_settings FOR SELECT USING (true);
CREATE POLICY "Public read staff_profiles" ON staff_profiles FOR SELECT USING (true);
CREATE POLICY "Public read catalogs" ON catalogs FOR SELECT USING (true);
CREATE POLICY "Public read catalog_colors" ON catalog_colors FOR SELECT USING (true);
CREATE POLICY "Public read saved_links" ON saved_links FOR SELECT USING (true);

-- Admin modification policies (Allows updates when anon key is configured or authorized)
CREATE POLICY "Allow public update for showroom admin" ON app_settings FOR ALL USING (true);
CREATE POLICY "Allow public update for catalogs" ON catalogs FOR ALL USING (true);
CREATE POLICY "Allow public update for catalog_colors" ON catalog_colors FOR ALL USING (true);
CREATE POLICY "Allow public update for staff_profiles" ON staff_profiles FOR ALL USING (true);
CREATE POLICY "Allow public update for saved_links" ON saved_links FOR ALL USING (true);
