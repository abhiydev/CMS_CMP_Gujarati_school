-- Phase 7: Add performance indexes for frequently queried columns
-- This migration improves query performance as data grows

-- Index on site_content section_key for faster lookups
CREATE INDEX IF NOT EXISTS idx_site_content_section_key ON site_content(section_key);

-- Index on gallery created_at for sorting by date
CREATE INDEX IF NOT EXISTS idx_gallery_created_at ON gallery(created_at DESC);

-- Index on gallery category for filtering
CREATE INDEX IF NOT EXISTS idx_gallery_category ON gallery(category);

-- Index on notices publish_date for sorting and filtering
CREATE INDEX IF NOT EXISTS idx_notices_publish_date ON notices(publish_date DESC);

-- Index on notices created_at for sorting
CREATE INDEX IF NOT EXISTS idx_notices_created_at ON notices(created_at DESC);

-- Index on activity_log created_at for sorting recent activity
CREATE INDEX IF NOT EXISTS idx_activity_log_created_at ON activity_log(created_at DESC);

-- Index on activity_log actor_email for filtering by user
CREATE INDEX IF NOT EXISTS idx_activity_log_actor_email ON activity_log(actor_email);
