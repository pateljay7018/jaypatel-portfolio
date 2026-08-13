(function () {
  // Highlight active nav link on scroll
  function updateActiveNav() {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link");
    const scrollY = window.scrollY;

    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 200;
      const sectionId = section.getAttribute("id");

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }

  // Event Listeners
  window.addEventListener("scroll", updateActiveNav, { passive: true });

  // Initialize
  updateActiveNav();
  
  // Hide loader immediately since there are no images to preload
  const loader = document.getElementById("loader");
  if (loader) {
    loader.classList.add("hidden");
  }
})();
