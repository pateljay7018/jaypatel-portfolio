/**
 * Dynamic Component Auto-Loader
 * Loads components/header.html and components/footer.html dynamically on all pages.
 * Updating components/header.html or components/footer.html updates ALL pages automatically!
 */

async function loadDynamicComponents() {
  // 1. Fetch & Inject Header Component
  const headerContainer = document.getElementById('header-placeholder') || document.querySelector('header.navbar');
  if (headerContainer) {
    try {
      const res = await fetch('components/header.html?t=' + Date.now());
      if (res.ok) {
        const headerHtml = await res.text();
        const wrapper = document.createElement('div');
        wrapper.innerHTML = headerHtml.trim();
        const newHeader = wrapper.firstElementChild;

        // Highlight active nav item depending on page URL
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = newHeader.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (currentPath === 'projects.html' && href.includes('projects.html')) {
            link.classList.add('active');
          } else if ((currentPath === '' || currentPath === 'index.html') && href.includes('index.html#hero') && (!window.location.hash || window.location.hash === '#hero')) {
            link.classList.add('active');
          }
        });

        if (headerContainer.parentNode) {
          headerContainer.parentNode.replaceChild(newHeader, headerContainer);
        }
      }
    } catch (err) {
      console.error('Error loading header component:', err);
    }
  }

  // 2. Fetch & Inject Footer Component
  const footerContainer = document.getElementById('footer-placeholder') || document.querySelector('footer.footer');
  if (footerContainer) {
    try {
      const res = await fetch('components/footer.html?t=' + Date.now());
      if (res.ok) {
        const footerHtml = await res.text();
        const wrapper = document.createElement('div');
        wrapper.innerHTML = footerHtml.trim();
        const newFooter = wrapper.firstElementChild;

        if (footerContainer.parentNode) {
          footerContainer.parentNode.replaceChild(newFooter, footerContainer);
        }
      }
    } catch (err) {
      console.error('Error loading footer component:', err);
    }
  }
}

// Auto-run on DOM ready
document.addEventListener('DOMContentLoaded', loadDynamicComponents);
