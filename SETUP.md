# Supabase Setup Guide

## Step 1: Create Database Schema

1. Go to [Supabase Console](https://app.supabase.com) → Your Project
2. Navigate to **SQL Editor**
3. Create a new query and paste the contents of `supabase/seed.sql`
4. Click **Run**

This will create three tables:
- `site_content` - homepage sections
- `gallery` - uploaded images
- `notices` - published announcements

## Step 2: Create Storage Bucket

1. In Supabase Console, go to **Storage** (left sidebar)
2. Click **Create Bucket**
3. Name it: `school-assets`
4. Enable **Public Bucket**
5. Click **Create**

Your admin panel will upload gallery images here.

## Step 3: Set Up Admin Authentication

1. In Supabase Console, go to **Authentication** → **Providers**
2. Email is enabled by default
3. Go to **Users** and click **Add user**
4. Create an admin account:
   - Email: (your admin email)
   - Password: (strong password)
   - Auto send email: OFF

## Step 4: Configure Admin Permissions (Optional)

For additional security, you can restrict admin write access using Row Level Security (RLS):

```sql
-- Run in SQL Editor to restrict write access to authenticated admins only
create policy "Allow authenticated users to write" on site_content for insert to authenticated using (true);
create policy "Allow authenticated users to update" on site_content for update to authenticated using (true);
create policy "Allow authenticated users to delete" on gallery for delete to authenticated using (true);
create policy "Allow authenticated users to delete notices" on notices for delete to authenticated using (true);
```

## Step 5: Test the Application

```bash
npm run dev
```

Visit:
- **Public Site**: `http://localhost:5173`
- **Admin Login**: `http://localhost:5173/admin/login`

## Troubleshooting

### Images not loading?
- Check that `school-assets` bucket is created and public
- Verify image paths in Supabase Storage match the URLs in the database

### Admin login fails?
- Confirm the user exists in **Authentication** → **Users**
- Check browser console for error messages
- Verify `.env` has correct `VITE_SUPABASE_ANON_KEY`

### Content not showing?
- Run seed.sql again to populate initial data
- Check **Data Browser** in Supabase Console to verify table contents
- Ensure RLS policies allow public read

## Production Deployment

Before deploying to Vercel or another host:

1. Update `.env` to use environment variables (not committed to git)
2. Set same `VITE_SUPABASE_*` variables in your deployment platform
3. Create a strong admin password
4. Consider setting up Row Level Security policies for better access control
5. Test admin features in production environment

## Admin Features Available

- **Content Editor**: Update hero, about, admissions, and other sections
- **Gallery Manager**: Upload new images, delete old ones, organize by category
- **Notices**: Publish announcements with publish dates
- **Secure Login**: Supabase authentication protects admin access
