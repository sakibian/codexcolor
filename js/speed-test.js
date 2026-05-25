// Mobile Speed Test Tool - PageSpeed Insights Integration
document.addEventListener('DOMContentLoaded', function() {
  const speedTestForm = document.getElementById('speed-test-form');
  const urlInput = document.getElementById('test-url');
  const testButton = document.getElementById('run-speed-test');
  const resultsSection = document.getElementById('speed-test-results');
  const loadingSection = document.getElementById('speed-test-loading');
  const errorSection = document.getElementById('speed-test-error');
  
  // Results elements
  const mobileScoreEl = document.getElementById('mobile-score');
  const desktopScoreEl = document.getElementById('desktop-score');
  const lcpValueEl = document.getElementById('lcp-value');
  const fidValueEl = document.getElementById('fid-value');
  const clsValueEl = document.getElementById('cls-value');
  const fcpValueEl = document.getElementById('fcp-value');
  const ttiValueEl = document.getElementById('tti-value');
  const siValueEl = document.getElementById('si-value');
  const issuesListEl = document.getElementById('issues-list');
  const opportunitiesListEl = document.getElementById('opportunities-list');
  
  // Lead capture
  const leadCaptureSection = document.getElementById('speed-test-lead-capture');
  const auditEmailInput = document.getElementById('audit-email');
  const auditNameInput = document.getElementById('audit-name');
  const requestAuditBtn = document.getElementById('request-audit');

  // Google PageSpeed Insights API
  const PAGESPEED_API_KEY = 'AIzaSyDummyKeyReplaceWithReal'; // Replace with actual API key
  const PAGESPEED_API_URL = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

  // Run speed test
  async function runSpeedTest(e) {
    e.preventDefault();
    
    const url = urlInput.value.trim();
    
    if (!url) {
      alert('Please enter a valid URL');
      return;
    }

    // Validate URL format
    if (!isValidUrl(url)) {
      alert('Please enter a valid URL (e.g., https://example.com)');
      return;
    }

    // Hide previous results and errors
    resultsSection.classList.add('hidden');
    errorSection.classList.add('hidden');
    leadCaptureSection.classList.add('hidden');
    
    // Show loading
    loadingSection.classList.remove('hidden');
    testButton.disabled = true;
    testButton.textContent = 'Testing...';

    try {
      // Track test start
      if (window.gtag) {
        gtag('event', 'speed_test_start', {
          'event_category': 'Speed Test',
          'event_label': url,
          'value': 1
        });
      }

      // Fetch mobile results
      const mobileData = await fetchPageSpeedData(url, 'mobile');
      
      // Fetch desktop results
      const desktopData = await fetchPageSpeedData(url, 'desktop');

      // Display results
      displayResults(mobileData, desktopData, url);
      
      // Show lead capture after 5 seconds
      setTimeout(() => {
        leadCaptureSection.classList.remove('hidden');
        leadCaptureSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 5000);

      // Track successful test
      if (window.gtag) {
        gtag('event', 'speed_test_complete', {
          'event_category': 'Speed Test',
          'event_label': url,
          'mobile_score': mobileData.score,
          'desktop_score': desktopData.score
        });
      }

    } catch (error) {
      console.error('Speed test error:', error);
      showError(error.message);
      
      // Track error
      if (window.gtag) {
        gtag('event', 'speed_test_error', {
          'event_category': 'Speed Test',
          'event_label': url,
          'error': error.message
        });
      }
    } finally {
      loadingSection.classList.add('hidden');
      testButton.disabled = false;
      testButton.textContent = 'Test My Site Speed';
    }
  }

  // Fetch PageSpeed data
  async function fetchPageSpeedData(url, strategy) {
    const apiUrl = `${PAGESPEED_API_URL}?url=${encodeURIComponent(url)}&strategy=${strategy}&key=${PAGESPEED_API_KEY}`;
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error('Failed to fetch speed test data. Please try again.');
    }
    
    const data = await response.json();
    
    return {
      score: Math.round(data.lighthouseResult.categories.performance.score * 100),
      metrics: data.lighthouseResult.audits,
      opportunities: extractOpportunities(data.lighthouseResult.audits),
      diagnostics: extractDiagnostics(data.lighthouseResult.audits)
    };
  }

  // Display results
  function displayResults(mobileData, desktopData, url) {
    // Scores
    mobileScoreEl.textContent = mobileData.score;
    desktopScoreEl.textContent = desktopData.score;
    
    // Apply score colors
    applyScoreColor(mobileScoreEl, mobileData.score);
    applyScoreColor(desktopScoreEl, desktopData.score);

    // Core Web Vitals (from mobile data)
    const lcp = mobileData.metrics['largest-contentful-paint'];
    const fid = mobileData.metrics['max-potential-fid'];
    const cls = mobileData.metrics['cumulative-layout-shift'];
    const fcp = mobileData.metrics['first-contentful-paint'];
    const tti = mobileData.metrics['interactive'];
    const si = mobileData.metrics['speed-index'];

    lcpValueEl.textContent = formatMetric(lcp.displayValue);
    fidValueEl.textContent = formatMetric(fid.displayValue);
    clsValueEl.textContent = formatMetric(cls.displayValue);
    fcpValueEl.textContent = formatMetric(fcp.displayValue);
    ttiValueEl.textContent = formatMetric(tti.displayValue);
    siValueEl.textContent = formatMetric(si.displayValue);

    // Apply metric colors
    applyMetricColor(lcpValueEl.parentElement, lcp.score);
    applyMetricColor(fidValueEl.parentElement, fid.score);
    applyMetricColor(clsValueEl.parentElement, cls.score);
    applyMetricColor(fcpValueEl.parentElement, fcp.score);
    applyMetricColor(ttiValueEl.parentElement, tti.score);
    applyMetricColor(siValueEl.parentElement, si.score);

    // Issues and opportunities
    displayIssues(mobileData.opportunities, issuesListEl);
    displayOpportunities(mobileData.opportunities, opportunitiesListEl);

    // Show results
    resultsSection.classList.remove('hidden');
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Extract opportunities
  function extractOpportunities(audits) {
    const opportunities = [];
    const opportunityKeys = [
      'render-blocking-resources',
      'unused-css-rules',
      'unused-javascript',
      'modern-image-formats',
      'offscreen-images',
      'unminified-css',
      'unminified-javascript',
      'efficient-animated-content',
      'duplicated-javascript',
      'legacy-javascript'
    ];

    opportunityKeys.forEach(key => {
      if (audits[key] && audits[key].score < 1) {
        opportunities.push({
          title: audits[key].title,
          description: audits[key].description,
          savings: audits[key].displayValue || 'Potential savings available'
        });
      }
    });

    return opportunities;
  }

  // Extract diagnostics
  function extractDiagnostics(audits) {
    const diagnostics = [];
    const diagnosticKeys = [
      'uses-long-cache-ttl',
      'total-byte-weight',
      'dom-size',
      'critical-request-chains',
      'user-timings',
      'bootup-time',
      'mainthread-work-breakdown',
      'font-display'
    ];

    diagnosticKeys.forEach(key => {
      if (audits[key] && audits[key].score < 1) {
        diagnostics.push({
          title: audits[key].title,
          description: audits[key].description
        });
      }
    });

    return diagnostics;
  }

  // Display issues
  function displayIssues(opportunities, container) {
    container.innerHTML = '';
    
    if (opportunities.length === 0) {
      container.innerHTML = '<li class="text-green-600">✓ No major issues found!</li>';
      return;
    }

    opportunities.slice(0, 5).forEach(opp => {
      const li = document.createElement('li');
      li.className = 'flex items-start gap-3 p-3 bg-red-50 rounded-lg';
      li.innerHTML = `
        <svg class="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
        </svg>
        <div>
          <p class="font-semibold text-gray-900">${opp.title}</p>
          <p class="text-sm text-gray-600 mt-1">${opp.savings}</p>
        </div>
      `;
      container.appendChild(li);
    });
  }

  // Display opportunities
  function displayOpportunities(opportunities, container) {
    container.innerHTML = '';
    
    if (opportunities.length === 0) {
      container.innerHTML = '<li class="text-green-600">✓ Site is well optimized!</li>';
      return;
    }

    opportunities.slice(0, 5).forEach(opp => {
      const li = document.createElement('li');
      li.className = 'flex items-start gap-3 p-3 bg-yellow-50 rounded-lg';
      li.innerHTML = `
        <svg class="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
        </svg>
        <div>
          <p class="font-semibold text-gray-900">${opp.title}</p>
          <p class="text-sm text-gray-600 mt-1">${opp.savings}</p>
        </div>
      `;
      container.appendChild(li);
    });
  }

  // Apply score color
  function applyScoreColor(element, score) {
    element.classList.remove('text-red-600', 'text-yellow-600', 'text-green-600');
    
    if (score >= 90) {
      element.classList.add('text-green-600');
    } else if (score >= 50) {
      element.classList.add('text-yellow-600');
    } else {
      element.classList.add('text-red-600');
    }
  }

  // Apply metric color
  function applyMetricColor(element, score) {
    element.classList.remove('border-red-200', 'border-yellow-200', 'border-green-200', 'bg-red-50', 'bg-yellow-50', 'bg-green-50');
    
    if (score >= 0.9) {
      element.classList.add('border-green-200', 'bg-green-50');
    } else if (score >= 0.5) {
      element.classList.add('border-yellow-200', 'bg-yellow-50');
    } else {
      element.classList.add('border-red-200', 'bg-red-50');
    }
  }

  // Format metric value
  function formatMetric(value) {
    return value || 'N/A';
  }

  // Show error
  function showError(message) {
    errorSection.classList.remove('hidden');
    errorSection.querySelector('p').textContent = message;
    errorSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // Validate URL
  function isValidUrl(string) {
    try {
      const url = new URL(string);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
      return false;
    }
  }

  // Handle audit request
  async function requestAudit(e) {
    e.preventDefault();

    const email = auditEmailInput.value.trim();
    const name = auditNameInput.value.trim();
    const url = urlInput.value.trim();

    if (!email || !name) {
      alert('Please enter your name and email');
      return;
    }

    requestAuditBtn.disabled = true;
    requestAuditBtn.textContent = 'Sending...';

    try {
      // Send audit request via EmailJS
      if (window.emailjs) {
        await emailjs.send('service_eoloeii', 'template_speed_audit', {
          to_name: name,
          to_email: email,
          website_url: url,
          mobile_score: mobileScoreEl.textContent,
          desktop_score: desktopScoreEl.textContent,
          timestamp: new Date().toLocaleString()
        });
      }

      // Track lead
      if (window.gtag) {
        gtag('event', 'audit_request', {
          'event_category': 'Speed Test',
          'event_label': 'professional_audit_requested',
          'value': 1
        });
      }

      // Show success
      leadCaptureSection.innerHTML = `
        <div class="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <svg class="w-16 h-16 text-green-500 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          </svg>
          <h3 class="text-2xl font-bold text-green-800 mb-2">Request Received!</h3>
          <p class="text-green-700 mb-4">
            We'll send you a comprehensive performance audit within 24 hours.
          </p>
          <a href="/contact?source=speed_test" class="inline-block px-6 py-3 bg-fulvous-500 hover:bg-fulvous-600 text-white font-semibold rounded-lg transition-colors">
            Schedule Consultation
          </a>
        </div>
      `;

    } catch (error) {
      console.error('Audit request error:', error);
      alert('There was an error sending your request. Please try again or contact us directly.');
      requestAuditBtn.disabled = false;
      requestAuditBtn.textContent = 'Get Professional Audit';
    }
  }

  // Event listeners
  if (speedTestForm) {
    speedTestForm.addEventListener('submit', runSpeedTest);
  }

  if (requestAuditBtn) {
    requestAuditBtn.addEventListener('click', requestAudit);
  }

  // Track page view
  if (window.gtag) {
    gtag('event', 'speed_test_page_view', {
      'event_category': 'Speed Test',
      'event_label': 'page_loaded',
      'value': 1
    });
  }
});
