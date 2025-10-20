// Navigation functionality
document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const hamburger = document.querySelector('#hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const header = document.querySelector('.navbar');
  let lastScroll = 0;

  // Toggle mobile menu
  hamburger?.addEventListener('click', () => {
    if (mobileMenu?.classList.contains('hidden')) {
      mobileMenu.classList.remove('hidden');
      // Trigger reflow
      mobileMenu.offsetHeight;
      mobileMenu.classList.remove('translate-y-[-10px]', 'opacity-0');
    } else {
      mobileMenu.classList.add('translate-y-[-10px]', 'opacity-0');
      setTimeout(() => {
        mobileMenu.classList.add('hidden');
      }, 300);
    }
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (
      !hamburger?.contains(e.target) &&
      !mobileMenu?.contains(e.target) &&
      !mobileMenu?.classList.contains('hidden')
    ) {
      mobileMenu.classList.add('translate-y-[-10px]', 'opacity-0');
      setTimeout(() => {
        mobileMenu.classList.add('hidden');
      }, 300);
    }
  });

  // Handle scroll behavior for sticky header
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll <= 0) {
      header?.classList.remove('scroll-up');
      return;
    }

    if (
      currentScroll > lastScroll &&
      !header?.classList.contains('scroll-down')
    ) {
      // Scrolling down
      header?.classList.remove('scroll-up');
      header?.classList.add('scroll-down');
    } else if (
      currentScroll < lastScroll &&
      header?.classList.contains('scroll-down')
    ) {
      // Scrolling up
      header?.classList.remove('scroll-down');
      header?.classList.add('scroll-up');
    }

    lastScroll = currentScroll;
  });

  // Track navigation interactions
  const navLinks = document.querySelectorAll('.nav-link, .mobile-menu-link');
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (typeof window.Analytics !== 'undefined') {
        window.Analytics.trackEvent('navigation_click', {
          link_text: link.textContent,
          link_url: link.getAttribute('href'),
        });
      }
    });
  });
});
