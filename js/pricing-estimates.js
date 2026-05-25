// Pricing Estimates and Currency Converter
document.addEventListener('DOMContentLoaded', function() {
  // Exchange rate (approximate, update regularly)
  const USD_TO_BDT = 117; // 1 USD = 117 BDT (as of 2026)
  const CAD_TO_USD = 0.72; // 1 CAD = 0.72 USD

  // Service pricing in USD
  const servicePricing = {
    mobile_audit: {
      name: 'Mobile Performance Audit',
      usd: 299,
      description: 'Comprehensive mobile site analysis',
      deliverables: ['Detailed performance report', 'Mobile UX audit', 'Optimization roadmap', 'Priority action items'],
      timeline: '2-3 business days'
    },
    ga4_basic: {
      name: 'GA4 Basic Setup',
      usd: 499,
      description: 'Essential analytics implementation',
      deliverables: ['GA4 property setup', 'Basic event tracking', 'Standard reports', 'Documentation'],
      timeline: '3-5 business days'
    },
    ga4_advanced: {
      name: 'GA4 Advanced Setup',
      usd: 799,
      description: 'Complete analytics with custom tracking',
      deliverables: ['Full GA4 implementation', 'Custom events & conversions', 'E-commerce tracking', 'Custom dashboards', 'Training session'],
      timeline: '5-7 business days'
    },
    conversion_tracking: {
      name: 'Conversion Tracking Fix',
      usd: 399,
      description: 'Debug and fix tracking issues',
      deliverables: ['Tracking audit', 'Fix broken pixels/tags', 'Cross-platform setup', 'Verification report'],
      timeline: '2-4 business days'
    },
    conversion_advanced: {
      name: 'Advanced Conversion Setup',
      usd: 599,
      description: 'Multi-platform tracking implementation',
      deliverables: ['GA4 + Meta + Google Ads', 'Server-side tracking', 'Attribution setup', 'ROI dashboard'],
      timeline: '5-7 business days'
    },
    performance_basic: {
      name: 'Performance Optimization',
      usd: 799,
      description: 'Core Web Vitals improvement',
      deliverables: ['Performance audit', 'Image optimization', 'Code minification', 'Caching setup', 'Before/after report'],
      timeline: '5-7 business days'
    },
    performance_advanced: {
      name: 'Advanced Performance Package',
      usd: 1499,
      description: 'Complete site optimization',
      deliverables: ['Full performance overhaul', 'CDN setup', 'Database optimization', 'Server tuning', 'Ongoing monitoring'],
      timeline: '7-10 business days'
    },
    monthly_retainer: {
      name: 'Monthly Retainer',
      usd: 499,
      description: 'Ongoing optimization & support',
      deliverables: ['Monthly performance reviews', 'Analytics monitoring', 'Continuous optimization', 'Priority support', 'Monthly reports'],
      timeline: 'Ongoing'
    },
    monthly_retainer_premium: {
      name: 'Premium Monthly Retainer',
      usd: 999,
      description: 'Full-service growth package',
      deliverables: ['Everything in basic retainer', 'A/B testing', 'Conversion rate optimization', 'Technical SEO', 'Weekly check-ins'],
      timeline: 'Ongoing'
    }
  };

  // Currency converter function
  function convertCurrency(usd, targetCurrency) {
    switch(targetCurrency) {
      case 'BDT':
        return Math.round(usd * USD_TO_BDT);
      case 'CAD':
        return Math.round(usd / CAD_TO_USD);
      default:
        return usd;
    }
  }

  // Format currency
  function formatCurrency(amount, currency) {
    switch(currency) {
      case 'USD':
        return `$${amount.toLocaleString()} USD`;
      case 'BDT':
        return `৳${amount.toLocaleString()} BDT`;
      case 'CAD':
        return `$${amount.toLocaleString()} CAD`;
      default:
        return `$${amount}`;
    }
  }

  // Display pricing with multiple currencies
  function displayPricing(serviceKey, containerElement) {
    const service = servicePricing[serviceKey];
    if (!service) return;

    const usd = service.usd;
    const bdt = convertCurrency(usd, 'BDT');
    const cad = convertCurrency(usd, 'CAD');

    const pricingHTML = `
      <div class="pricing-display">
        <div class="text-2xl font-bold text-fulvous-600 mb-2">
          ${formatCurrency(usd, 'USD')}
        </div>
        <div class="text-sm text-gray-600 space-y-1">
          <div>≈ ${formatCurrency(bdt, 'BDT')}</div>
          <div>≈ ${formatCurrency(cad, 'CAD')}</div>
        </div>
      </div>
    `;

    if (containerElement) {
      containerElement.innerHTML = pricingHTML;
    }
  }

  // Add pricing to service cards if they exist
  const serviceCards = document.querySelectorAll('[data-service-pricing]');
  serviceCards.forEach(card => {
    const serviceKey = card.dataset.servicePricing;
    const pricingContainer = card.querySelector('.pricing-container');
    if (pricingContainer) {
      displayPricing(serviceKey, pricingContainer);
    }
  });

  // Track pricing view
  if (window.gtag) {
    gtag('event', 'pricing_view', {
      'event_category': 'Pricing',
      'event_label': 'page_load',
      'value': 1
    });
  }

  // Expose pricing data globally for other scripts
  window.CodexColorPricing = {
    services: servicePricing,
    convert: convertCurrency,
    format: formatCurrency,
    display: displayPricing
  };
});
