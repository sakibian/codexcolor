<<<<<<< HEAD
# CodexColor

A modern color utility library for developers and designers.

## Features

- Color conversion between multiple formats (HEX, RGB, HSL, HSV)
- Color manipulation (lighten, darken, saturate, etc.)
- Color palette generation
- Accessibility contrast checking
- Color harmony calculations

## Installation

```bash
npm install codexcolor
```

## Usage

```javascript
import { Color } from 'codexcolor';

const color = new Color('#3498db');
console.log(color.toRGB()); // rgb(52, 152, 219)
console.log(color.lighten(0.2)); // Lighten by 20%
```

## License

MIT
=======
# CodexColor - Mobile Optimization & Analytics Experts

A professional website for CodexColor, specializing in mobile website optimization, GA4 analytics implementation, conversion tracking troubleshooting, and performance optimization for small businesses in Bangladesh.

## 🚀 Features

- **Mobile-First Design**: Responsive design optimized for all devices
- **Lead Generation Forms**: Advanced contact forms with service-specific questions and lead quality scoring
- **Comprehensive Services**: Four core service areas with detailed explanations and pricing
- **SEO Optimized**: Mobile-first indexing ready with structured data and meta tags
- **Analytics Integration**: GA4 event tracking with comprehensive user journey analytics
- **Production Ready**: Complete with professional positioning, case studies, and certifications

## 🛠️ Technology Stack

- **Frontend**: HTML5, Tailwind CSS
- **JavaScript**: Vanilla JS with ES6+ features
- **Build Tools**: npm, PostCSS, Autoprefixer
- **Analytics**: Google Analytics 4 (GA4)
- **Performance**: Core Web Vitals optimized

## 📁 Project Structure

```
/Users/bakibillahsakib/Herd/codexcolor/
├── index.html                 # Homepage with hero and service overview
├── about/
│   └── index.html            # About page with team and client stories
├── services/
│   └── index.html            # Detailed services page
├── contact/
│   └── index.html            # Contact form with lead scoring
├── news/
│   └── index.html            # Blog/news section
├── css/
│   ├── style.css             # Compiled Tailwind styles
│   ├── animations.css        # Custom animations
│   └── navigation.css        # Navigation styles
├── js/
│   ├── analytics.js          # GA4 implementation
│   ├── contact.js            # Form validation and lead scoring
│   ├── main.js               # Main functionality
│   ├── animations.js         # Animation utilities
│   ├── lazy-load.js          # Image lazy loading
│   └── navigation.js         # Mobile menu handling
├── tasks/
│   └── *.md                  # PRD and task management files
├── rules/
│   └── *.md                  # Development guidelines
├── mockup/                   # Design mockups
└── package.json              # Project dependencies and scripts
```

## 🔧 Installation & Setup

### Prerequisites

- Node.js 16+ and npm
- Git
- Web server (for local development: Live Server, Apache, Nginx)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/sakibian/codexcolor.git
   cd codexcolor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the project**
   ```bash
   npm run build
   ```

4. **Start development server**
   ```bash
   # Option 1: Live Server (Recommended)
   npx live-server

   # Option 2: Included build server
   npm run build && npx live-server
   ```

5. **View the website**
   - Open `http://localhost:8080` in your browser

### Development Commands

```bash
# Build CSS only
npm run build:css

# Build JavaScript only
npm run build:js

# Full build (CSS + JS)
npm run build

# Start development server
npx live-server
```

## 🌐 Deployment

### Production Deployment Requirements

Before deploying to production, configure these environment variables and settings:

#### 1. Google Analytics 4 Setup
**Required for tracking and analytics**

1. **Create GA4 Property**:
   - Go to [Google Analytics](https://analytics.google.com)
   - Create a new GA4 property for CodexColor
   - Note the Measurement ID (format: `G-XXXXXXXXXX`)

2. **Update Analytics Configuration**:
   - Open `js/analytics.js`
   - Replace the placeholder `GA_MEASUREMENT_ID` with your actual GA4 Measurement ID:
   ```javascript
   const GA_MEASUREMENT_ID = 'G-YOUR-ACTUAL-MEASUREMENT-ID'; // Replace with your GA4 ID
   ```

3. **Verify Analytics**:
   - Deploy and check that GA4 receives events
   - Use Google Analytics Realtime reports to verify tracking

#### 2. Domain Configuration

1. **Purchase Domain**:
   - Domain recommendation: `codexcolor.com` (currently referenced in meta tags)

2. **DNS Setup** (if using hosting service):
   - Point domain A records to your hosting provider's IP
   - Set up SSL certificate (Let's Encrypt recommended)

#### 3. Email Configuration

Currently using placeholder email. Set up production email:

1. **Professional Email**:
   - Set up `codexcolorinfo@gmail.com` or similar
   - Consider business email hosting (GSuite, Outlook, etc.)

2. **Contact Form Emails**:
   - Form submissions are currently logged to console
   - Implement email service integration (SendGrid, Mailgun, etc.)

#### 4. Web Server Configuration

**Apache (.htaccess)**
```apache
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.html [QSA,L]
</IfModule>

# Enable compression
<IfModule mod_deflate.c>
AddOutputFilterByType DEFLATE text/plain
AddOutputFilterByType DEFLATE text/html
AddOutputFilterByType DEFLATE text/xml
AddOutputFilterByType DEFLATE text/css
AddOutputFilterByType DEFLATE application/xml
AddOutputFilterByType DEFLATE application/xhtml+xml
AddOutputFilterByType DEFLATE application/rss+xml
AddOutputFilterByType DEFLATE application/javascript
AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Security headers
<IfModule mod_headers.c>
Header always set X-Frame-Options DENY
Header always set X-Content-Type-Options nosniff
Header always set Referrer-Policy strict-origin-when-cross-origin
</IfModule>
```

**Nginx Configuration**
```nginx
server {
    listen 80;
    server_name codexcolor.com www.codexcolor.com;
    root /var/www/codexcolor;
    index index.html;

    # Enable gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Handle client-side routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SSL redirect (if HTTPS enabled)
    if ($scheme != "https") {
        return 301 https://$server_name$request_uri;
    }
}
```

#### 5. SSL Certificate Setup

1. **Let's Encrypt (Free)**:
   ```bash
   sudo certbot --nginx -d codexcolor.com -d www.codexcolor.com
   ```

2. **Commercial SSL**: Purchase from providers like DigiCert, GlobalSign

#### 6. CDN Setup (Optional but Recommended)

Configure Cloudflare or similar for:
- Global content distribution
- DDoS protection
- SSL termination
- Performance optimization

### Deployment Options

#### Option 1: Netlify (Recommended for Static Sites)
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify init
netlify deploy --prod --dir=.
```

#### Option 2: Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Option 3: Traditional Hosting
- Upload files to any static hosting provider
- Ensure server supports SSL and proper MIME types
- Recommended: DigitalOcean, AWS S3, Hostinger, etc.

### Post-Deployment Checklist

- [ ] **GA4 Working**: Events appear in Google Analytics
- [ ] **Forms Working**: Contact form submissions function
- [ ] **Mobile Friendly**: Test on multiple devices
- [ ] **SSL Active**: HTTPS certificate valid
- [ ] **Email Setup**: Contact emails operational
- [ ] **SEO Verified**: Search Console submission complete

## 🎨 Brand Colors & Design System

### Primary Brand Colors (Fulvous Theme)
- **Primary**: `#E7A547` (fulvous-500)
- **Primary Light**: `#F4C47F` (fulvous-400)
- **Primary Dark**: `#D99739` (fulvous-600)
- **Accent**: `#37B1E7` (blue-500)
- **Accent Green**: `#10B981` (emerald-500)
- **Accent Purple**: `#8B5CF6` (violet-500)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Headings**: Bold weights
- **Body**: Regular weight

### Spacing & Layout
- **Container**: Max-width 7xl (1280px)
- **Grid**: Responsive columns (1/2/3/4 on mobile/tablet/desktop)
- **Spacing**: Consistent 16px/24px/32px scale

## 📊 Performance & SEO

### Core Web Vitals Targets
- **LCP**: < 2.5 seconds
- **FID**: < 100 milliseconds
- **CLS**: < 0.1

### SEO Implementation
- **Meta Tags**: Complete coverage across all pages
- **Structured Data**: Organization, Service, and Blog schemas
- **Mobile-First**: Viewport and responsive meta tags
- **Canonical URLs**: Avoid duplicate content issues

## 🧪 Testing

### Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Device Testing
- Desktop: 1920x1080, 1366x768
- Tablet: iPad, various Android tablets
- Mobile: iPhone, Android phones (multiple screen sizes)

### Performance Testing
```bash
# Run Lighthouse audit
npx lighthouse http://localhost:8080 --output html --output-path ./reports/lighthouse.html
```

## 🔍 Troubleshooting

### Common Issues

1. **Analytics Not Working**
   - Verify GA4 Measurement ID in `js/analytics.js`
   - Check browser developer console for errors
   - Wait 24-48 hours for GA4 data to populate

2. **Forms Not Submitting**
   - Check browser console for JavaScript errors
   - Verify form validation logic
   - Ensure server-side email handler is configured

3. **Styles Not Loading**
   - Run `npm run build:css` to generate styles
   - Check file paths in HTML
   - Verify Tailwind configuration

4. **Images Not Loading**
   - Check image file paths
   - Ensure lazy loading is not preventing display
   - Verify build process copies assets

### Support
- **GitHub Issues**: Report bugs and request features
- **Documentation**: Comprehensive setup and troubleshooting guides
- **Email**: Contact form or direct support email

---

Built with ❤️ for small businesses seeking mobile optimization and analytics excellence.
>>>>>>> cdc25e4 (Foundation build up)
