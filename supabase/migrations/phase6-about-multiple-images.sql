-- Phase 6: Add multiple image support for About section
-- This migration adds image_urls column to site_content for sections that need multiple images

-- Step 1: Add image_urls column to site_content table
alter table site_content
  add column if not exists image_urls jsonb;

-- Step 2: Migrate existing single image_url to image_urls for backward compatibility
-- For sections with a single image_url, migrate it to image_urls array
update site_content
set image_urls = jsonb_build_array(image_url)
where image_url is not null
  and (image_urls is null or image_urls = '[]'::jsonb);

-- Step 3: Make image_url nullable (remove NOT NULL constraint if it exists)
-- This allows sections to use only image_urls without requiring image_url
-- Note: The original schema doesn't have NOT NULL on image_url, but we ensure it's nullable
alter table site_content alter column image_url drop not null;

-- Note: Existing sections will continue to work with image_url
-- New multi-image sections will use image_urls array
-- The frontend should check image_urls first, then fall back to image_url
