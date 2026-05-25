// Google Analytics 4 Comprehensive Integration
const GA_MEASUREMENT_ID = "G-2GGKL8VHDF"; // Replace with your actual GA4 Measurement ID

// Performance and timing tracking
let pageLoadStartTime = performance.now();
let firstContentfulPaint = 0;
let largestContentfulPaint = 0;
let firstInputDelay = 0;

// Initialize Google Analytics 4 with enhanced tracking
function initGA() {
  // Load Google Analytics 4
  (function () {
    var script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);
  })();

  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    dataLayer.push(arguments);
  };

  gtag("js", new Date());
  gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
  });

  // Enhanced GA4 Config with recommended settings
  gtag("config", GA_MEASUREMENT_ID, {
    send_page_view: false, // We'll track manually for more control
    custom_map: {
      dimension1: "page_type",
      dimension2: "user_status",
    },
    custom_parameters: {
      page_load_time: getPageLoadTime(),
      device_type: getDeviceType(),
      browser_support: checkBrowserSupport(),
    },
  });

  // Track enhanced page view
  trackEnhancedPageView();

  // Track user interactions
  trackUserInteractions();

  // Track performance metrics
  trackPerformanceMetrics();

  // Track scroll behavior
  trackScrollBehavior();

  // Track form conversions
  trackFormConversions();

  // Track engagement metrics
  trackEngagementMetrics();
}

// Enhanced page view tracking
function trackEnhancedPageView() {
  const pageData = {
    page_title: document.title,
    page_location: window.location.href,
    page_path: window.location.pathname,
    page_referrer: document.referrer,
    page_type: getPageType(),
    timestamp: new Date().toISOString(),
    session_id: generateSessionId(),
    user_agent: navigator.userAgent,
    screen_resolution: `${window.screen.width}x${window.screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
  };

  gtag("event", "page_view", pageData);
}

// Track performance metrics
function trackPerformanceMetrics() {
  // Track navigation timing
  if (performance.timing.loadEventEnd) {
    const loadTime =
      performance.timing.loadEventEnd - performance.timing.navigationStart;
    gtag("event", "page_load_time", {
      event_category: "Performance",
      event_label: "page_load",
      value: loadTime,
      custom_map: { metric_value: loadTime },
    });
  }

  // Track resource loading
  document.addEventListener("load", function () {
    const resources = performance.getEntriesByType("resource");
    const totalResourceSize = resources.reduce((total, resource) => {
      return total + (resource.transferSize || 0);
    }, 0);

    gtag("event", "resource_loaded", {
      event_category: "Performance",
      event_label: "total_size",
      value: totalResourceSize,
    });
  });
}

// Enhanced event tracking
function trackEvent(eventName, parameters = {}) {
  const enhancedParams = {
    ...parameters,
    timestamp: new Date().toISOString(),
    page_path: window.location.pathname,
    page_url: window.location.href,
    user_status: getUserStatus(),
  };

  gtag("event", eventName, enhancedParams);

  // Also track in custom analytics if needed
  if (window.Analytics && window.Analytics.customTracking) {
    window.Analytics.customTracking(eventName, enhancedParams);
  }
}

// Track section visibility
function trackSectionView(sectionName) {
  const scrollTop = window.pageYOffset;
  const documentHeight =
    document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = Math.round((scrollTop / documentHeight) * 100);

  trackEvent("section_view", {
    event_category: "Engagement",
    event_label: sectionName,
    section_name: sectionName,
    scroll_depth: scrollPercent,
  });
}

// Track user interactions
function trackUserInteractions() {
  // Track clicks on tracked elements
  document.addEventListener("click", (e) => {
    const target = e.target.closest("[data-track-click]");
    if (target) {
      const clickData = target.dataset.trackClick;
      trackEvent("element_click", {
        event_category: "Interaction",
        event_label: clickData,
        element_type: target.tagName.toLowerCase(),
        element_text: target.textContent?.trim()?.substring(0, 50),
      });
    }
  });

  // Track form interactions
  document.addEventListener(
    "focus",
    (e) => {
      if (e.target.matches("input, textarea, select")) {
        trackEvent("form_field_focus", {
          event_category: "Form",
          event_label: e.target.name || e.target.id,
          field_type: e.target.type,
          field_name: e.target.name,
        });
      }
    },
    true
  );

  // Track external links
  document.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (link && link.href && link.hostname !== window.location.hostname) {
      trackEvent("external_link_click", {
        event_category: "Navigation",
        event_label: link.hostname,
        link_url: link.href,
        link_text: link.textContent?.trim()?.substring(0, 50),
      });
    }
  });
}

// Track scroll behavior
function trackScrollBehavior() {
  let maxScrollDepth = 0;
  let scrollMilestones = [25, 50, 75, 90];

  function checkScrollDepth() {
    const scrollTop = window.pageYOffset;
    const documentHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = Math.round((scrollTop / documentHeight) * 100);

    if (scrollPercent > maxScrollDepth) {
      maxScrollDepth = scrollPercent;

      // Track milestone achievements
      for (let milestone of scrollMilestones) {
        if (scrollPercent >= milestone && !milestoneReached[milestone]) {
          milestoneReached[milestone] = true;
          trackEvent("scroll_depth", {
            event_category: "Engagement",
            event_label: milestone + "%",
            value: milestone,
            scroll_depth: milestone,
          });
          break;
        }
      }
    }
  }

  const milestoneReached = {};
  window.addEventListener("scroll", checkScrollDepth);
}

// Track form conversions
function trackFormConversions() {
  document.addEventListener("submit", (e) => {
    const form = e.target;
    if (form.id === "contactForm") {
      finishTrackingFormConversion(form);
      return;
    }

    // Generic form tracking
    trackEvent("form_submit", {
      event_category: "Conversion",
      event_label: form.id || "unknown_form",
      form_id: form.id,
    });
  });
}

// Dedicated contact form conversion tracking
function finishTrackingFormConversion(form) {
  const formData = new FormData(form);
  const formValues = {};
  for (let [key, value] of formData.entries()) {
    formValues[key] = value;
  }

  // Track form submission
  trackEvent("contact_form_submit", {
    event_category: "Conversion",
    event_label: "contact_form",
    service_interest: formValues.service || "none",
    budget_range: formValues.budget || "none",
    lead_quality_score: calculateLeadQuality(formValues),
  });

  // Set up success/error tracking for submission result
  form.addEventListener("formSuccess", () => {
    trackEvent("contact_form_success", {
      event_category: "Conversion",
      event_label: "success",
    });
  });

  form.addEventListener("formError", () => {
    trackEvent("contact_form_error", {
      event_category: "Conversion",
      event_label: "error",
      error_type: "submission_error",
    });
  });
}

// Track engagement metrics
function trackEngagementMetrics() {
  let sessionStartTime = Date.now();
  let pageViews = 1;
  let interactions = 0;

  // Track interactions
  document.addEventListener("click", () => interactions++);
  document.addEventListener("scroll", () => interactions++);
  document.addEventListener("keydown", () => interactions++);

  // Track time-based engagement
  setTimeout(() => {
    const engagementTime = Date.now() - sessionStartTime;
    trackEvent("time_engaged", {
      event_category: "Engagement",
      event_label: Math.round(engagementTime / 1000) + "s",
      value: Math.round(engagementTime / 1000),
      interactions_count: interactions,
    });
  }, 30000); // Track after 30 seconds

  // Track before page unload (bounce rate improvement)
  window.addEventListener("beforeunload", () => {
    const totalTime = Date.now() - sessionStartTime;
    if (interactions > 0) {
      navigator.sendBeacon(
        "/api/track-engagement",
        JSON.stringify({
          time_on_page: totalTime,
          interactions: interactions,
          page_path: window.location.pathname,
        })
      );
    }
  });
}

// Utility functions
function getPageLoadTime() {
  return performance.now() - pageLoadStartTime;
}

function getPageType() {
  const path = window.location.pathname;
  if (path === "/") return "home";
  if (path === "/about") return "about";
  if (path === "/services") return "services";
  if (path === "/contact") return "contact";
  if (path === "/news") return "news";
  return "other";
}

function getDeviceType() {
  if (window.innerWidth < 768) return "mobile";
  if (window.innerWidth < 1024) return "tablet";
  return "desktop";
}

function getUserStatus() {
  return localStorage.getItem("user_status") || "new_visitor";
}

function checkBrowserSupport() {
  const features = {
    flexbox: CSS.supports("display", "flex"),
    grid: CSS.supports("display", "grid"),
    es6: typeof Symbol === "function",
  };
  return Object.values(features).filter(Boolean).length + "/3";
}

function generateSessionId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function calculateLeadQuality(formData) {
  let score = 50; // Base score

  // Service interest adds points
  if (formData.service && formData.service !== "") score += 15;

  // Budget information adds points
  if (formData.budget && formData.budget !== "") score += 10;

  // Company information adds points
  if (formData.company && formData.company.trim() !== "") score += 5;

  // Phone number adds points
  if (formData.phone && formData.phone.trim() !== "") score += 5;

  // Message length affects score
  const messageLength = formData.message ? formData.message.length : 0;
  if (messageLength > 100) score += 10;
  else if (messageLength > 50) score += 5;

  return Math.min(score, 100); // Cap at 100
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  // Wait a bit for all scripts to load
  setTimeout(initGA, 100);
});
