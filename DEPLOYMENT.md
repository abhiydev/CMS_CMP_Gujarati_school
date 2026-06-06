# Deployment Checklist

## Pre-Launch

- [ ] Database schema created in Supabase (run seed.sql)
- [ ] Storage bucket `school-assets` created and public
- [ ] Admin user account created in Supabase Auth
- [ ] `.env` file populated with Supabase credentials
- [ ] `npm run dev` starts without errors
- [ ] Public site loads at `http://localhost:5173`
- [ ] Admin login works with test account
- [ ] Gallery upload works in admin panel
- [ ] Content editor saves changes

## Vercel Deployment

- [ ] GitHub repository created and pushed
- [ ] Vercel project connected
- [ ] Environment variables added in Vercel dashboard
- [ ] Build completes successfully
- [ ] Production site loads
- [ ] Admin panel accessible in production
- [ ] Images load from Supabase Storage

## Post-Launch

- [ ] Add Google Analytics to `index.html`
- [ ] Set up custom domain (if applicable)
- [ ] Enable HTTPS everywhere
- [ ] Create admin password reset procedure
- [ ] Document admin workflows for staff
- [ ] Test on mobile devices
- [ ] Verify sitemap generation
- [ ] Check robots.txt accessibility

## Performance Optimization

- [ ] Run Lighthouse audit
- [ ] Target: SEO score >95
- [ ] Target: Performance score >90
- [ ] Optimize images for web
- [ ] Enable caching headers

## Security

- [ ] Enable RLS policies in Supabase
- [ ] Restrict admin user permissions
- [ ] Set up backup schedule
- [ ] Monitor for unauthorized access
- [ ] Keep dependencies updated

## Environment Variables Template

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## API Endpoints

- `https://your-project.supabase.co/rest/v1/site_content`
- `https://your-project.supabase.co/rest/v1/gallery`
- `https://your-project.supabase.co/rest/v1/notices`

## Support Contacts

**Technical Issues**: Check the [Supabase documentation](https://supabase.com/docs)

**Admin Login Help**: Reset password via Supabase Console → Auth → Users

**Performance Issues**: Run `npm run build` to check bundle size
