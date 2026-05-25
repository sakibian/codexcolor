// Cookie Consent Manager - GDPR/CCPA Compliant
(function() {
  'use strict';

  const COOKIE_CONSENT_KEY = 'codexcolor_cookie_consent';
  const COOKIE_EXPIRY_DAYS = 365;

  // Cookie categories
  const COOKIE_CATEGORIES = {
    necessary: {
      name: 'Necessary Cookies',
      description: 'Essential cookies required for the website to function properly. These cannot be disabled.',
      required: true,
      cookies: ['codexcolor_cookie_consent', 'session_id']
    },
    analytics: {
      name: 'Analytics Cookies',
      description: 'Help us understand how visitors interact with our website by collecting and reporting information anonymously.',
      required: false,
      cookies: ['_ga', '_ga_*', '_gid', '_gat']
    },
    marketing: {
      name: 'Marketing Cookies',
      description: 'Used to track visitors across websites to display relevant advertisements.',
      required: false,
      cookies: ['_fbp', '_fbc']
    },
    preferences: {
      name: 'Preference Cookies',
      description: 'Enable the website to remember information that changes the way it behaves or looks.',
      required: false,
      cookies: ['user_status', 'language_preference']
    }
  };

  class CookieConsent {
    constructor() {
      this.consent = this.loadConsent();
      this.init();
    }

    init() {
      // Create banner HTML
      this.createBanner();
      this.createSettingsModal();
      this.createPreferencesLink();

      // Check if consent already given
      if (!this.consent) {
        this.showBanner();
      } else {
        this.applyConsent();
      }

      // Event listeners
      this.attachEventListeners();
    }

    createBanner() {
      const banner = document.createElement('div');
      banner.className = 'cookie-consent-banner';
      banner.id = 'cookie-consent-banner';
      banner.innerHTML = `
        <div class="cookie-consent-content">
          <div class="cookie-consent-text">
            <strong>🍪 We use cookies</strong><br>
            We use cookies and similar technologies to improve your experience, analyze site traffic, 
            and personalize content. By clicking "Accept All", you consent to our use of cookies. 
            <a href="/privacy-policy">Privacy Policy</a> | 
            <a href="/terms-of-service">Terms of Service</a>
          </div>
          <div class="cookie-consent-buttons">
            <button class="cookie-btn cookie-btn-accept" id="cookie-accept-all">
              Accept All
            </button>
            <button class="cookie-btn cookie-btn-decline" id="cookie-decline-all">
              Decline All
            </button>
            <button class="cookie-btn cookie-btn-settings" id="cookie-settings-btn">
              Cookie Settings
            </button>
          </div>
        </div>
      `;
      document.body.appendChild(banner);
    }

    createSettingsModal() {
      const modal = document.createElement('div');
      modal.className = 'cookie-settings-modal';
      modal.id = 'cookie-settings-modal';
      
      let categoriesHTML = '';
      for (const [key, category] of Object.entries(COOKIE_CATEGORIES)) {
        const disabled = category.required ? 'disabled checked' : '';
        categoriesHTML += `
          <div class="cookie-category">
            <div class="cookie-category-header">
              <h3 class="cookie-category-title">${category.name}</h3>
              <label class="cookie-toggle">
                <input type="checkbox" id="cookie-${key}" ${disabled}>
                <span class="cookie-toggle-slider"></span>
              </label>
            </div>
            <p class="cookie-category-description">${category.description}</p>
          </div>
        `;
      }

      modal.innerHTML = `
        <div class="cookie-settings-content">
          <div class="cookie-settings-header">
            <h2 class="cookie-settings-title">Cookie Settings</h2>
            <button class="cookie-settings-close" id="cookie-settings-close">&times;</button>
          </div>
          ${categoriesHTML}
          <div class="cookie-settings-actions">
            <button class="cookie-btn cookie-btn-accept" id="cookie-save-settings">
              Save Settings
            </button>
            <button class="cookie-btn cookie-btn-decline" id="cookie-cancel-settings">
              Cancel
            </button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    createPreferencesLink() {
      const link = document.createElement('div');
      link.className = 'cookie-preferences-link';
      link.id = 'cookie-preferences-link';
      link.textContent = '🍪 Cookie Settings';
      link.style.display = this.consent ? 'block' : 'none';
      document.body.appendChild(link);
    }

    attachEventListeners() {
      // Accept all
      document.getElementById('cookie-accept-all')?.addEventListener('click', () => {
        this.acceptAll();
      });

      // Decline all
      document.getElementById('cookie-decline-all')?.addEventListener('click', () => {
        this.declineAll();
      });

      // Open settings
      document.getElementById('cookie-settings-btn')?.addEventListener('click', () => {
        this.showSettings();
      });

      // Close settings
      document.getElementById('cookie-settings-close')?.addEventListener('click', () => {
        this.hideSettings();
      });

      // Cancel settings
      document.getElementById('cookie-cancel-settings')?.addEventListener('click', () => {
        this.hideSettings();
      });

      // Save settings
      document.getElementById('cookie-save-settings')?.addEventListener('click', () => {
        this.saveSettings();
      });

      // Preferences link
      document.getElementById('cookie-preferences-link')?.addEventListener('click', () => {
        this.showSettings();
      });
    }

    showBanner() {
      const banner = document.getElementById('cookie-consent-banner');
      if (banner) {
        setTimeout(() => {
          banner.classList.add('show');
        }, 1000);
      }
    }

    hideBanner() {
      const banner = document.getElementById('cookie-consent-banner');
      if (banner) {
        banner.classList.remove('show');
      }
    }

    showSettings() {
      const modal = document.getElementById('cookie-settings-modal');
      if (modal) {
        modal.classList.add('show');
        
        // Load current settings
        if (this.consent) {
          for (const [key, value] of Object.entries(this.consent)) {
            const checkbox = document.getElementById(`cookie-${key}`);
            if (checkbox && !checkbox.disabled) {
              checkbox.checked = value;
            }
          }
        }
      }
    }

    hideSettings() {
      const modal = document.getElementById('cookie-settings-modal');
      if (modal) {
        modal.classList.remove('show');
      }
    }

    acceptAll() {
      const consent = {};
      for (const key of Object.keys(COOKIE_CATEGORIES)) {
        consent[key] = true;
      }
      this.saveConsent(consent);
      this.hideBanner();
      this.applyConsent();
      this.showPreferencesLink();
      
      // Track consent
      this.trackConsent('accept_all');
    }

    declineAll() {
      const consent = {};
      for (const [key, category] of Object.entries(COOKIE_CATEGORIES)) {
        consent[key] = category.required;
      }
      this.saveConsent(consent);
      this.hideBanner();
      this.applyConsent();
      this.showPreferencesLink();
      
      // Track consent
      this.trackConsent('decline_all');
    }

    saveSettings() {
      const consent = {};
      for (const key of Object.keys(COOKIE_CATEGORIES)) {
        const checkbox = document.getElementById(`cookie-${key}`);
        consent[key] = checkbox ? checkbox.checked : false;
      }
      this.saveConsent(consent);
      this.hideSettings();
      this.hideBanner();
      this.applyConsent();
      this.showPreferencesLink();
      
      // Track consent
      this.trackConsent('custom_settings');
    }

    saveConsent(consent) {
      this.consent = consent;
      const consentData = {
        consent: consent,
        timestamp: new Date().toISOString(),
        version: '1.0'
      };
      localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consentData));
      
      // Set cookie for server-side detection
      this.setCookie(COOKIE_CONSENT_KEY, JSON.stringify(consent), COOKIE_EXPIRY_DAYS);
    }

    loadConsent() {
      try {
        const data = localStorage.getItem(COOKIE_CONSENT_KEY);
        if (data) {
          const parsed = JSON.parse(data);
          return parsed.consent;
        }
      } catch (e) {
        console.error('Error loading cookie consent:', e);
      }
      return null;
    }

    applyConsent() {
      if (!this.consent) return;

      // Analytics (GA4)
      if (this.consent.analytics) {
        this.enableAnalytics();
      } else {
        this.disableAnalytics();
      }

      // Marketing
      if (this.consent.marketing) {
        this.enableMarketing();
      } else {
        this.disableMarketing();
      }

      // Preferences
      if (this.consent.preferences) {
        this.enablePreferences();
      } else {
        this.disablePreferences();
      }
    }

    enableAnalytics() {
      // Enable GA4
      if (window.gtag) {
        gtag('consent', 'update', {
          'analytics_storage': 'granted'
        });
      }
    }

    disableAnalytics() {
      // Disable GA4
      if (window.gtag) {
        gtag('consent', 'update', {
          'analytics_storage': 'denied'
        });
      }
      
      // Delete GA cookies
      this.deleteCookiesByPattern('_ga');
      this.deleteCookiesByPattern('_gid');
      this.deleteCookiesByPattern('_gat');
    }

    enableMarketing() {
      if (window.gtag) {
        gtag('consent', 'update', {
          'ad_storage': 'granted'
        });
      }
    }

    disableMarketing() {
      if (window.gtag) {
        gtag('consent', 'update', {
          'ad_storage': 'denied'
        });
      }
      
      // Delete marketing cookies
      this.deleteCookiesByPattern('_fbp');
      this.deleteCookiesByPattern('_fbc');
    }

    enablePreferences() {
      // Preferences enabled
    }

    disablePreferences() {
      // Clear localStorage except consent
      const consentData = localStorage.getItem(COOKIE_CONSENT_KEY);
      localStorage.clear();
      if (consentData) {
        localStorage.setItem(COOKIE_CONSENT_KEY, consentData);
      }
    }

    showPreferencesLink() {
      const link = document.getElementById('cookie-preferences-link');
      if (link) {
        link.style.display = 'block';
      }
    }

    setCookie(name, value, days) {
      const expires = new Date();
      expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
      document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
    }

    deleteCookiesByPattern(pattern) {
      const cookies = document.cookie.split(';');
      for (let cookie of cookies) {
        const name = cookie.split('=')[0].trim();
        if (name.includes(pattern)) {
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
        }
      }
    }

    trackConsent(action) {
      // Track consent decision (only if analytics enabled)
      if (this.consent && this.consent.analytics && window.gtag) {
        gtag('event', 'cookie_consent', {
          'event_category': 'Cookie Consent',
          'event_label': action,
          'value': 1
        });
      }
    }
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      new CookieConsent();
    });
  } else {
    new CookieConsent();
  }

  // Expose for manual control
  window.CookieConsent = CookieConsent;
})();
