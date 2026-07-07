-- Phase 5: Transform gallery into album-based system
-- This migration adds album structure while maintaining backward compatibility

-- Step 1: Add new columns to gallery table for album support
alter table gallery
  add column if not exists title text,
  add column if not exists description text,
  add column if not exists cover_image_url text,
  add column if not exists image_urls jsonb;

-- Step 2: Migrate existing single-image data to new album structure
-- For existing records with image_url, migrate to cover_image_url and image_urls
update gallery
set 
  title = coalesce(title, category, 'Gallery Image'),
  cover_image_url = coalesce(cover_image_url, image_url),
  image_urls = coalesce(image_urls, jsonb_build_array(image_url))
where image_url is not null
  and (image_urls is null or image_urls = '[]'::jsonb);

-- Step 3: Make image_url nullable (remove NOT NULL constraint)
-- This allows new albums to be created without the legacy field
alter table gallery alter column image_url drop not null;

-- Step 4: Add updated_at column for tracking modifications
alter table gallery add column if not exists updated_at timestamp with time zone default now();

-- Step 5: Create index on created_at for better ordering
create index if not exists gallery_created_at_idx on gallery(created_at desc);

-- Step 6: Update RLS policies for new columns
drop policy if exists "Allow public read" on gallery;

create policy "Allow public read" on gallery for select to anon using (true);

-- Note: Write policies are already set in phase4-rls-write-policies.sql
-- They will continue to work with the new schema

-- Backward compatibility:
-- - Legacy single-image entries will have image_url populated (for reference)
-- - New album entries will have image_url = null
-- - Both formats are supported by the normalizeGalleryItem function
