/**
 * Dynamic Component Auto-Loader
 * Loads components/header.html and components/footer.html dynamically on all pages.
 */

// Apply theme instantly on script load to prevent flash
(function() {
  const currentTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);
})();

function initMobileDrawer(headerEl) {
  const burger = headerEl.querySelector('.nav-burger');
  const drawer = headerEl.querySelector('.mobile-drawer');
  if (!burger || !drawer) return;

  const closeDrawer = () => {
    headerEl.classList.remove('drawer-open');
    burger.setAttribute('aria-expanded', 'false');
    drawer.hidden = true;
  };

  const openDrawer = () => {
    drawer.hidden = false;
    headerEl.classList.add('drawer-open');
    burger.setAttribute('aria-expanded', 'true');
  };

  burger.addEventListener('click', () => {
    if (headerEl.classList.contains('drawer-open')) closeDrawer();
    else openDrawer();
  });

  // Close after tapping any drawer link
  drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));

  // Close when tapping outside the header, on Escape, or on resize to desktop
  document.addEventListener('click', (e) => {
    if (headerEl.classList.contains('drawer-open') && !headerEl.contains(e.target)) closeDrawer();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) closeDrawer();
  });
}

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

        // Initialize Mobile Hamburger Drawer
        initMobileDrawer(newHeader);
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