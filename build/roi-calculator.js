// ROI Calculator - Lead Generation Tool
document.addEventListener('DOMContentLoaded', function() {
  const calculator = document.getElementById('roi-calculator');
  if (!calculator) return;

  // Calculator inputs
  const monthlyTrafficInput = document.getElementById('monthly-traffic');
  const conversionRateInput = document.getElementById('conversion-rate');
  const avgOrderValueInput = document.getElementById('avg-order-value');
  const calculateBtn = document.getElementById('calculate-roi');
  
  // Results elements
  const resultsSection = document.getElementById('roi-results');
  const currentRevenueEl = document.getElementById('current-revenue');
  const optimizedRevenueEl = document.getElementById('optimized-revenue');
  const revenueIncreaseEl = document.getElementById('revenue-increase');
  const paybackPeriodEl = document.getElementById('payback-period');
  const roiPercentageEl = document.getElementById('roi-percentage');
  
  // Lead capture form
  const leadCaptureForm = document.getElementById('roi-lead-capture');
  const emailInput = document.getElementById('roi-email');
  const nameInput = document.getElementById('roi-name');
  const submitLeadBtn = document.getElementById('submit-roi-lead');

  // Industry benchmarks
  const benchmarks = {
    ecommerce: { avgConversion: 2.5, optimizedConversion: 4.5 },
    saas: { avgConversion: 3.0, optimizedConversion: 5.5 },
    services: { avgConversion: 4.0, optimizedConversion: 7.0 },
    retail: { avgConversion: 2.0, optimizedConversion: 4.0 }
  };

  // Calculate ROI
  function calculateROI() {
    const monthlyTraffic = parseFloat(monthlyTrafficInput.value) || 0;
    const conversionRate = parseFloat(conversionRateInput.value) || 0;
    const avgOrderValue = parseFloat(avgOrderValueInput.value) || 0;

    if (monthlyTraffic === 0 || conversionRate === 0 || avgOrderValue === 0) {
      alert('Please fill in all fields with valid numbers');
      return;
    }

    // Current metrics
    const currentConversions = (monthlyTraffic * conversionRate) / 100;
    const currentRevenue = currentConversions * avgOrderValue;

    // Optimized metrics (conservative estimate: +80% conversion rate improvement)
    const optimizedConversionRate = conversionRate * 1.8;
    const optimizedConversions = (monthlyTraffic * optimizedConversionRate) / 100;
    const optimizedRevenue = optimizedConversions * avgOrderValue;

    // Revenue increase
    const revenueIncrease = optimizedRevenue - currentRevenue;
    const revenueIncreasePercent = ((revenueIncrease / currentRevenue) * 100).toFixed(0);

    // Average service cost (mid-range)
    const avgServiceCost = 799; // Average of our services
    const paybackMonths = (avgServiceCost / revenueIncrease).toFixed(1);
    const annualROI = (((revenueIncrease * 12) / avgServiceCost) * 100).toFixed(0);

    // Display results
    currentRevenueEl.textContent = formatCurrency(currentRevenue);
    optimizedRevenueEl.textContent = formatCurrency(optimizedRevenue);
    revenueIncreaseEl.textContent = formatCurrency(revenueIncrease);
    paybackPeriodEl.textContent = paybackMonths;
    roiPercentageEl.textContent = annualROI;

    // Show results section
    resultsSection.classList.remove('hidden');
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Track calculation
    if (window.gtag) {
      gtag('event', 'roi_calculation', {
        'event_category': 'ROI Calculator',
        'event_label': 'calculation_completed',
        'value': Math.round(revenueIncrease)
      });
    }

    // Show lead capture after 3 seconds
    setTimeout(() => {
      leadCaptureForm.classList.remove('hidden');
      leadCaptureForm.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 3000);
  }

  // Format currency
  function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  // Handle lead capture
  async function submitLead(e) {
    e.preventDefault();

    const email = emailInput.value.trim();
    const name = nameInput.value.trim();

    if (!email || !name) {
      alert('Please enter your name and email');
      return;
    }

    // Get calculation data
    const monthlyTraffic = monthlyTrafficInput.value;
    const conversionRate = conversionRateInput.value;
    const avgOrderValue = avgOrderValueInput.value;
    const revenueIncrease = revenueIncreaseEl.textContent;
    const paybackPeriod = paybackPeriodEl.textContent;
    const roiPercentage = roiPercentageEl.textContent;

    // Disable button
    submitLeadBtn.disabled = true;
    submitLeadBtn.textContent = 'Sending...';

    try {
      // Send to EmailJS (configure your service)
      if (window.emailjs) {
        await emailjs.send('service_eoloeii', 'template_roi_report', {
          to_name: name,
          to_email: email,
          monthly_traffic: monthlyTraffic,
          conversion_rate: conversionRate,
          avg_order_value: avgOrderValue,
          revenue_increase: revenueIncrease,
          payback_period: paybackPeriod,
          roi_percentage: roiPercentage,
          timestamp: new Date().toLocaleString()
        });
      }

      // Track lead capture
      if (window.gtag) {
        gtag('event', 'lead_capture', {
          'event_category': 'ROI Calculator',
          'event_label': 'email_captured',
          'value': 1
        });
      }

      // Show success message
      leadCaptureForm.innerHTML = `
        <div class="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <svg class="w-16 h-16 text-green-500 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          </svg>
          <h3 class="text-2xl font-bold text-green-800 mb-2">Report Sent!</h3>
          <p class="text-green-700 mb-4">
            We've sent your detailed ROI report to <strong>${email}</strong>
          </p>
          <p class="text-sm text-green-600 mb-6">
            Check your inbox for a comprehensive analysis and next steps.
          </p>
          <a href="/contact?source=roi_calculator" class="inline-block px-6 py-3 bg-fulvous-500 hover:bg-fulvous-600 text-white font-semibold rounded-lg transition-colors">
            Schedule Free Consultation
          </a>
        </div>
      `;

    } catch (error) {
      console.error('Lead capture error:', error);
      alert('There was an error sending your report. Please try again or contact us directly.');
      submitLeadBtn.disabled = false;
      submitLeadBtn.textContent = 'Get Detailed Report';
    }
  }

  // Event listeners
  if (calculateBtn) {
    calculateBtn.addEventListener('click', calculateROI);
  }

  if (submitLeadBtn) {
    submitLeadBtn.addEventListener('click', submitLead);
  }

  // Allow Enter key to calculate
  [monthlyTrafficInput, conversionRateInput, avgOrderValueInput].forEach(input => {
    if (input) {
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          calculateROI();
        }
      });
    }
  });

  // Input validation (numbers only)
  [monthlyTrafficInput, conversionRateInput, avgOrderValueInput].forEach(input => {
    if (input) {
      input.addEventListener('input', (e) => {
        // Remove non-numeric characters except decimal point
        e.target.value = e.target.value.replace(/[^0-9.]/g, '');
      });
    }
  });

  // Track calculator view
  if (window.gtag) {
    gtag('event', 'roi_calculator_view', {
      'event_category': 'ROI Calculator',
      'event_label': 'page_view',
      'value': 1
    });
  }
});
