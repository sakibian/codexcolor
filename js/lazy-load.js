// Image lazy loading
document.addEventListener('DOMContentLoaded', () => {
  const lazyImages = document.querySelectorAll('img[data-src]');

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        observer.unobserve(img);

        // Track image load in analytics
        if (typeof window.Analytics !== 'undefined') {
          window.Analytics.trackEvent('image_load', {
            image_src: img.src,
          });
        }
      }
    });
  });

  lazyImages.forEach((img) => imageObserver.observe(img));
});
