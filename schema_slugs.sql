-- 1. Add slug column to user_branding
ALTER TABLE user_branding ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- 2. Add slug column to projects
ALTER TABLE projects ADD COLUMN IF NOT EXISTS slug TEXT;

-- 3. Create a unique constraint for user_id and project slug
-- This ensures that a single user cannot have two projects with the same slug.
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_user_slug_unique;
ALTER TABLE projects ADD CONSTRAINT projects_user_slug_unique UNIQUE (user_id, slug);

-- 4. Simple function to generate a slug from text (re-adding just in case)
CREATE OR REPLACE FUNCTION generate_slug(t text) RETURNS text AS $$
BEGIN
  RETURN lower(regexp_replace(regexp_replace(t, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'));
END;
$$ LANGUAGE plpgsql;

-- 5. Populate existing null slugs (Optional safety step)
-- This will fill empty slugs with a name-based version
UPDATE user_branding SET slug = generate_slug(agency_name) WHERE slug IS NULL AND agency_name IS NOT NULL;
UPDATE projects SET slug = generate_slug(name) WHERE slug IS NULL AND name IS NOT NULL;
