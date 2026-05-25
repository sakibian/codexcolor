# CodexColor

Production website for CodexColor, a digital agency focused on mobile optimization, analytics setup, conversion tracking, and performance improvement for small businesses.

## Project status

Ready for production deployment, with:
- dual-market contact presentation for Bangladesh and Canada
- Canada-specific WhatsApp contact
- GA4 / GTM integration
- site-wide cookie consent wiring
- core SEO metadata and structured data on main pages
- responsive marketing pages, contact flow, and ROI calculator

## Main routes

This project uses clean public URLs.

Folder-based pages:
- `/`
- `/about/`
- `/services/`
- `/contact/`
- `/news/`
- `/templates/`

Flat pages rewritten without `.html` in public URLs:
- `/privacy-policy`
- `/terms-of-service`
- `/roi-calculator`

Source files:
- `index.html`
- `about/index.html`
- `services/index.html`
- `contact/index.html`
- `news/index.html`
- `templates/index.html`
- `privacy-policy.html`
- `terms-of-service.html`
- `roi-calculator.html`

## Features

### Marketing site
- homepage with service positioning and CTAs
- about page
- services page with pricing/payment messaging
- contact page
- news page
- templates page

### Lead generation
- contact form with lead scoring
- ROI calculator
- WhatsApp widget
- EmailJS-based form handling

### Trust / compliance
- privacy policy
- terms of service
- cookie consent banner and settings

### Analytics / SEO
- Google Tag Manager
- GA4 event tracking
- consent-based analytics defaults
- canonical tags
- Open Graph metadata
- JSON-LD structured data
- sitemap and robots support

## Contact model

Visible website contact uses both phone numbers:
- Bangladesh: `+88 01715 625 999`
- Canada: `+1 (647) 572-9552`

WhatsApp uses the Canada number specifically:
- `https://wa.me/16475729552`

## Tech stack

- static HTML pages
- CSS under `css/`
- JavaScript under `js/` and `build/`
- EmailJS for lead delivery
- GTM / GA4 for tracking
- Vercel / Netlify / Apache-compatible routing support

## Important files

### Root
- `index.html`
- `privacy-policy.html`
- `terms-of-service.html`
- `roi-calculator.html`
- `server.js`
- `package.json`
- `vercel.json`
- `netlify.toml`
- `.htaccess`
- `sitemap.xml`
- `robots.txt`

### Styles
- `css/style.css` — global styles and shared polish
- `css/animations.css` — animations
- `css/whatsapp-widget.css` — WhatsApp styles
- `css/cookie-consent.css` — cookie consent UI
- `css/roi-calculator.css` — ROI calculator styles

### Scripts
- `js/analytics.js` — GA4 tracking logic
- `js/whatsapp-widget.js` — WhatsApp widget
- `js/contact.js` — contact form behavior
- `js/roi-calculator.js` — ROI calculator logic
- `build/cookie-consent.js` — consent manager loaded across pages
- `build/analytics.js` — built analytics bundle

## Development

Install and run locally:

```bash
npm install
npm start
```

Expected local URL:

```bash
http://localhost:3000
```

## Deployment

### Vercel

```bash
vercel --prod
```

### Netlify

```bash
netlify deploy --prod
```

### Notes
- clean URLs are expected in production
- flat pages are routed without `.html`
- canonical URLs are already aligned with the clean route structure

## Analytics and consent

### GTM / GA4
- GTM URLs use official `googletagmanager.com` endpoints
- analytics scripts are present on the main pages
- events include form activity, ROI usage, WhatsApp clicks, and engagement tracking

### Consent behavior
- cookie consent assets are loaded site-wide on the main pages
- analytics defaults to denied storage until consent is granted
- consent manager updates `analytics_storage` and `ad_storage`

## SEO and structured data

All main pages now include the core SEO layer:
- title
- meta description
- robots
- canonical
- `og:title`
- `og:description`
- `og:type`
- JSON-LD

Structured data types currently used:
- `Organization`
- `Service`
- `Blog`
- `CollectionPage`
- `BreadcrumbList`
- `WebPage`
- `WebApplication`

## Known project notes

- `build/` contains built/static variants used by several pages
- `navbar-template.html` is a snippet/template file, not a primary public page
- documentation files in the repo root are working notes/history and are not required for production runtime

## Production verification checklist

Before deploy, confirm:
- all public routes load with clean URLs
- contact form submits correctly
- ROI calculator works
- WhatsApp opens the Canada number
- cookie banner appears on first visit
- analytics cookies remain blocked before consent
- legal pages load correctly
- no console errors on main pages

## License

MIT
