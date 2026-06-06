# Delivery Notes — Shree Gujarati Samaj School CMS

Final pre-delivery pass completed. The project is ready for client handoff.

---

## Final improvements made

### Visual polish
- Fixed dark-section heading contrast (Academics, Gallery, Contact) via `SectionHeading` `variant="dark"`
- Header logo sizing, `object-contain`, and mobile tap-friendly Call CTA
- Consistent mobile padding (`px-4` → `sm:px-6`)
- Hero minimum height for stable mobile layout
- About image `aspect-[4/3]` container to prevent layout shift
- Contact/footer phone and email made clickable
- `overflow-x-hidden` on homepage and `html` to prevent horizontal scroll
- Notice banner titles changed from `h2` → `p` to preserve single-page `h1` hierarchy
- Admin sidebar active state and responsive main padding

### SEO & discoverability
- Enhanced `SeoMeta` with fallbacks, branded title format, `og:locale`, `og:site_name`
- Added `SchoolJsonLd` (School + EducationalOrganization structured data)
- Fixed favicon (`public/favicon.svg`), theme-color, and `index.html` defaults
- `robots.txt` blocks `/admin/` from indexing
- `sitemap.xml` lists homepage only (admin removed)
- Admin login and 404 pages use `noindex`
- Added `VITE_SITE_URL` to `.env.example` for canonical URLs

---

## Deployment checklist

### Environment variables
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SITE_URL=https://cmpgujaratischool.com
```

### Supabase migrations (run if not already applied)
1. `supabase/migrations/add-missing-sections.sql` — facilities, student life, leadership
2. `supabase/migrations/phase3-operational.sql` — draft/publish `status`, `activity_log` table

### Admin user setup
1. Create users in Supabase Auth (email/password)
2. Assign roles via SQL:
```sql
-- Administrator (full access including Activity log)
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'
where email = 'admin@school.com';

-- Editor (content, gallery, notices only)
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"editor"}'
where email = 'editor@school.com';
```
3. Add authenticated RLS write policies for `site_content`, `gallery`, `notices`, `activity_log`

### Build & deploy
```bash
npm install
npm run build
# Deploy dist/ to hosting (Vercel, Netlify, etc.)
```

### Post-deploy SEO
1. **Google Search Console** — verify domain, submit `https://cmpgujaratischool.com/sitemap.xml`
2. **HTTPS** — ensure SSL is active; redirect `www` → apex or vice versa consistently
3. **Canonical URL** — set `VITE_SITE_URL` to production domain before build
4. **Social previews** — test with [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) and Twitter Card Validator
5. **Google Business Profile** — ensure address/phone match website contact section
6. **Lighthouse** — run mobile audit; compress large gallery PNGs in `src/assets` if scores are low

### Favicon
- Default: `public/favicon.svg` (SGS initials)
- Optional: replace with school logo PNG at `public/favicon.ico` for sharper branding

---

## Maintenance notes

| Task | How |
|------|-----|
| Update homepage content | Admin → Content |
| Publish notices | Admin → Notices (set status to Published) |
| Manage gallery | Admin → Gallery (drag/drop upload) |
| Review changes | Admin → Activity (admin role only) |
| Draft before publish | Set section/notice status to Draft |

### Image recommendations
- Upload WebP or compressed JPEG under 5 MB
- Large bundled assets (`gallery2.png` ~2.6 MB) can be recompressed for faster first load
- Hero/section images via admin upload go to Supabase Storage

---

## Known non-critical limitations

- **SPA SEO** — React client-side rendering; acceptable for a single-school site. Prerendering optional future enhancement.
- **Admin in sitemap** — intentionally excluded; blocked in `robots.txt`
- **Notice dismissals** — stored in visitor `localStorage` (per browser, not synced)
- **Draft sections** — public site falls back to static `data.js` content when CMS section is draft
- **Activity log** — fails silently if table missing (CMS still works)
- **Role defaults** — users without `role` metadata default to `admin` for backward compatibility

---

## QA sign-off summary

| Area | Status |
|------|--------|
| CMS content save/load | ✅ |
| Draft/publish | ✅ |
| Gallery upload/delete + storage cleanup | ✅ |
| Notices on homepage | ✅ |
| Repeater editors | ✅ |
| Error boundaries | ✅ |
| Role-based admin | ✅ |
| Google Maps embed | ✅ |
| Mobile responsive header/CTA | ✅ |
| SEO meta + JSON-LD | ✅ |
| robots.txt + sitemap | ✅ |

---

## Support contacts (fill in for client)

- **Technical contact:** _______________
- **School admin login:** _______________
- **Production URL:** https://cmpgujaratischool.com
- **Supabase project:** _______________
