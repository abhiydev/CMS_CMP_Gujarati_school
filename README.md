# Shree Gujarati Samaj School - Dynamic CMS Site

A production-ready, Supabase-powered school website with an admin dashboard for content management.

## What's Ready

### ✅ Public Website
- **Premium responsive design** with Framer Motion animations
- **Dynamic content** loaded from Supabase (fallback to static data)
- **SEO optimized** with meta tags, sitemap, and robots.txt
- **Lazy-loaded pages** for faster performance
- All school branding, images, and content from the MVP

### ✅ Admin Dashboard
- **Secure authentication** via Supabase
- **Content editor** for all homepage sections
- **Gallery manager** with upload/delete functionality
- **Notices system** for announcements
- Clean, branded admin interface

### ✅ Technology Stack
- **Frontend**: React 18 + Vite + Tailwind CSS + Framer Motion
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Deployment**: Ready for Vercel/Netlify
- **SEO**: React Helmet for dynamic meta tags

## Quick Start

### 1. Initialize Supabase Database

```bash
# Copy and paste the entire content of supabase/seed.sql
# into Supabase SQL Editor and run it
```

Or:
1. Go to Supabase Console → SQL Editor
2. Paste contents from `supabase/seed.sql`
3. Click **Run**

### 2. Create Storage Bucket

1. Supabase Console → **Storage**
2. Create bucket named: `school-assets`
3. Enable **Public Bucket**

### 3. Create Admin Account

1. Supabase Console → **Authentication** → **Users**
2. Click **Add user**
3. Enter email and password
4. Click **Create user**

### 4. Run Locally

```bash
npm install
npm run dev
```

Visit:
- Public: `http://localhost:5173`
- Admin: `http://localhost:5173/admin/login`

## Deploy to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial CMS setup"
git remote add origin <your-repo>
git push -u origin main
```

### 2. Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Add environment variables:
   ```
   VITE_SUPABASE_URL=https://ehfsrxwxsaewwgyjwdij.supabase.co
   VITE_SUPABASE_ANON_KEY=<your-key>
   VITE_SUPABASE_SERVICE_ROLE_KEY=<your-key>
   ```
4. Click **Deploy**

## Admin Panel Features

### Content Editor
- Update hero, about, admissions sections
- Manage facility descriptions
- Edit contact information
- Add leadership messages

### Gallery Manager
- Upload new images
- Organize by category (Campus, Events, Students, Facilities)
- Delete outdated photos
- Preview before upload

### Notices System
- Create announcements
- Set publish dates
- Auto-sorted by newest first
- Delete old notices

## File Structure

```
src/
├── pages/
│   ├── HomePage.jsx          # Public landing page
│   └── NotFoundPage.jsx       # 404 page
├── admin/
│   ├── AdminLoginPage.jsx     # Secure login
│   ├── AdminLayout.jsx        # Admin sidebar
│   ├── AdminDashboardPage.jsx # Overview
│   ├── AdminContentPage.jsx   # Edit sections
│   ├── AdminGalleryPage.jsx   # Image uploads
│   └── AdminNoticesPage.jsx   # Announcements
├── components/
│   ├── SectionHeading.jsx     # Reusable header
│   ├── GalleryLightbox.jsx    # Image preview
│   ├── SeoMeta.jsx            # SEO tags
│   └── LoadingSpinner.jsx     # Loading UI
├── hooks/
│   ├── useSiteData.jsx        # Dynamic content
│   └── useAuth.jsx            # Authentication
├── services/
│   ├── supabaseClient.js      # Supabase setup
│   └── contentService.js      # Database queries
└── App.jsx                     # Routing
```

## Database Schema

### site_content
- `id` - UUID primary key
- `section_key` - Unique identifier (hero, about, etc)
- `title` - Section heading
- `subtitle` - Description
- `content` - JSON structured data
- `image_url` - Asset path
- `updated_at` - Last modified timestamp

### gallery
- `id` - UUID primary key
- `image_url` - Public URL in storage
- `category` - Campus/Events/Students/Facilities
- `created_at` - Upload timestamp

### notices
- `id` - UUID primary key
- `title` - Announcement title
- `description` - Full text
- `publish_date` - Display date
- `created_at` - Creation timestamp

## SEO & Performance

✅ **SEO**: Dynamic meta titles, descriptions, OpenGraph tags
✅ **Performance**: Code splitting, lazy loading, optimized bundles
✅ **Responsive**: Mobile-first design, tested on all devices
✅ **Accessibility**: Semantic HTML, proper contrast, keyboard navigation

## Security

- Admin panel protected by Supabase authentication
- Row Level Security (RLS) policies for database access
- Environment variables for sensitive keys
- HTTPS-only in production

## Support & Maintenance

### Regular Updates
- Check Supabase dashboard for content updates
- Monitor gallery storage usage
- Archive old notices as needed

### Backup Strategy
- Supabase provides automatic backups
- Export content regularly to JSON

### Analytics
- Set up Google Analytics in `index.html`
- Monitor visitor behavior
- Track conversion metrics

---

**Ready to launch?** Follow SETUP.md for detailed instructions.
