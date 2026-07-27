(function () {
  const TOTAL_FRAMES = 300;
  const canvas = document.getElementById("scroll-canvas");
  const ctx = canvas.getContext("2d");
  const loader = document.getElementById("loader");
  const loaderBar = document.getElementById("loader-bar");
  const loaderText = document.getElementById("loader-text");

  const images = [];
  let loadedCount = 0;

  let targetFrame = 0;
  let currentFrame = 0;
  let isLoaded = false;

  // Format frame number to 3-digit padded string (001, 002... 300)
  function getFramePath(index) {
    const paddedIndex = String(index + 1).padStart(3, "0");
    return `frames/ezgif-frame-${paddedIndex}.jpg`;
  }

  // Preload all 300 frame images
  function preloadImages() {
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFramePath(i);
      img.onload = () => {
        loadedCount++;
        const percent = Math.floor((loadedCount / TOTAL_FRAMES) * 100);
        if (loaderBar) loaderBar.style.width = `${percent}%`;
        if (loaderText) loaderText.textContent = `Loading ${percent}%`;

        // Render first frame as soon as it loads for quick preview
        if (i === 0 && !isLoaded) {
          resizeCanvas();
          drawFrame(0);
        }

        if (loadedCount === TOTAL_FRAMES) {
          onAllImagesLoaded();
        }
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES) {
          onAllImagesLoaded();
        }
      };
      images.push(img);
    }
  }

  function onAllImagesLoaded() {
    isLoaded = true;
    if (loader) {
      loader.classList.add("hidden");
    }
    resizeCanvas();
    updateTargetFrame();
    currentFrame = targetFrame;
    requestAnimationFrame(renderLoop);
  }

  // Calculate canvas size and high-DPI resolution scaling
  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.scale(dpr, dpr);
    
    // Redraw current frame cleanly
    drawFrame(Math.round(currentFrame));
  }

  // Calculate target frame index from scroll position
  function updateTargetFrame() {
    const scrollTop = window.scrollY || window.pageYOffset;
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    
    const scrollFraction = Math.max(0, Math.min(1, scrollTop / maxScroll));
    targetFrame = Math.min(TOTAL_FRAMES - 1, scrollFraction * (TOTAL_FRAMES - 1));

    updateActiveNav();
  }

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

  // Draw frame centered while preserving aspect ratio (contain fit)
  function drawFrame(index) {
    const frameIndex = Math.max(0, Math.min(TOTAL_FRAMES - 1, index));
    const img = images[frameIndex];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;

    const imgRatio = imgWidth / imgHeight;
    const viewportRatio = viewportWidth / viewportHeight;

    let drawWidth, drawHeight, offsetX, offsetY;

    if (viewportRatio > imgRatio) {
      drawHeight = viewportHeight;
      drawWidth = viewportHeight * imgRatio;
      offsetX = (viewportWidth - drawWidth) / 2;
      offsetY = 0;
    } else {
      drawWidth = viewportWidth;
      drawHeight = viewportWidth / imgRatio;
      offsetX = 0;
      offsetY = (viewportHeight - drawHeight) / 2;
    }

    ctx.clearRect(0, 0, viewportWidth, viewportHeight);
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }

  // Smooth rendering loop with Linear Interpolation (lerp)
  function renderLoop() {
    const delta = targetFrame - currentFrame;
    if (Math.abs(delta) > 0.001) {
      currentFrame += delta * 0.15;
      drawFrame(Math.round(currentFrame));
    }

    requestAnimationFrame(renderLoop);
  }

  // Event Listeners
  window.addEventListener("scroll", updateTargetFrame, { passive: true });
  window.addEventListener("resize", resizeCanvas, { passive: true });

  // Initialize
  preloadImages();
})();
