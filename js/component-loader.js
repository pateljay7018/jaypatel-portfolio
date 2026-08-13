/**
 * Dynamic Component Auto-Loader
 * Loads components/header.html and components/footer.html dynamically on all pages.
 */

// Apply theme instantly on script load to prevent flash
(function() {
  const currentTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);
})();

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

        // Highlight active nav item depending on page URL and fix reload issue
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        const isHomePage = (currentPath === '' || currentPath === 'index.html');
        
        const navLinks = newHeader.querySelectorAll('a');
        navLinks.forEach(link => {
          let href = link.getAttribute('href');
          if (!href) return;
          
          // Fix full page reload: strip 'index.html' if we are already on the homepage
          if (isHomePage && href.startsWith('index.html#')) {
            link.setAttribute('href', href.replace('index.html', ''));
            href = link.getAttribute('href');
          }

          // Active highlighting logic
          if (currentPath === 'projects.html' && href.includes('projects.html')) {
            link.classList.add('active');
          } else if (isHomePage && href.includes('#hero') && (!window.location.hash || window.location.hash === '#hero')) {
            link.classList.add('active');
          }
        });

        if (headerContainer.parentNode) {
          headerContainer.parentNode.replaceChild(newHeader, headerContainer);
        }

        // Initialize Theme Toggle
        const themeBtn = newHeader.querySelector('.theme-toggle-btn');
        if (themeBtn) {
          themeBtn.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            const target = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', target);
            localStorage.setItem('theme', target);
          });
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
