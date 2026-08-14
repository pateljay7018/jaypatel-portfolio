/**
 * Dynamic Excel CSV Data Engine with Low-Speed Auto-Scrolling Section Wheels
 *
 * Auto-scroll wheel thresholds:
 * - Work Experience: > 4 items
 * - Education & Academics: > 3 items
 * - Certifications & Credentials: > 12 items
 * - Featured & Upcoming Releases: > 3 items
 *
 * NOTE: grid column counts are applied with responsive CSS classes
 * (.g-cols-2 / .g-cols-3 / .g-cols-4) instead of inline styles, so the
 * mobile media queries in style.css can always take over.
 */

function applyGridCols(el, count) {
  el.classList.remove('g-cols-1', 'g-cols-2', 'g-cols-3', 'g-cols-4', 'is-marquee');
  el.style.removeProperty('grid-template-columns');
  el.style.removeProperty('display');
  el.classList.add('g-cols-' + Math.min(Math.max(count, 1), 4));
}

function applyMarquee(el) {
  el.classList.remove('g-cols-1', 'g-cols-2', 'g-cols-3', 'g-cols-4');
  el.style.removeProperty('grid-template-columns');
  el.style.removeProperty('display');
  el.classList.add('is-marquee');
}

function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];

  const headers = parseCSVLine(lines[0]);
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const row = parseCSVLine(line);
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index] || '';
    });
    data.push(obj);
  }
  return data;
}

function parseCSVLine(line) {
  const row = [];
  let insideQuote = false;
  let entry = '';
  for (let c = 0; c < line.length; c++) {
    const char = line[c];
    if (char === '"') {
      insideQuote = !insideQuote;
    } else if (char === ',' && !insideQuote) {
      row.push(entry.trim().replace(/^"|"$/g, ''));
      entry = '';
    } else {
      entry += char;
    }
  }
  row.push(entry.trim().replace(/^"|"$/g, ''));
  return row;
}

async function renderSkills() {
  const track = document.getElementById('skills-track');
  if (!track) return;

  try {
    const res = await fetch('excel/skills.csv?t=' + Date.now());
    const text = await res.text();
    const skills = parseCSV(text);
    if (!skills.length) return;

    let itemsHtml = '';
    skills.forEach(s => {
      itemsHtml += `
        <div class="ticker-item">
          <span class="ticker-text">${s.Name || ''}</span>
          <span class="ticker-star">✦</span>
        </div>`;
    });

    track.innerHTML = `
      <!-- Ticker Items Set 1 -->
      ${itemsHtml}
      <!-- Cloned Ticker Items Set 2 for Infinite Loop -->
      ${itemsHtml}`;
  } catch (err) {
    console.error('Error rendering skills:', err);
  }
}

async function renderExperience() {
  const container = document.getElementById('experience-grid');
  if (!container) return;

  try {
    const res = await fetch('excel/experience.csv?t=' + Date.now());
    const text = await res.text();
    const exp = parseCSV(text);
    if (!exp.length) return;

    let itemsHtml = '';
    exp.forEach((e, idx) => {
      const num = e.Number || String(idx + 1).padStart(2, '0');
      itemsHtml += `
        <div class="process-card glass-card">
          <div class="process-num">${num}</div>
          <h3 class="process-title">${e.Company || ''}</h3>
          <span style="font-size: 0.75rem; color: var(--accent-purple-light); font-weight: 700; display: block; margin-bottom: 6px;">${e.Period || ''} | ${e.Location || ''}</span>
          <p class="process-desc"><strong>${e.Role || ''}</strong><br />${e.Description || ''}</p>
        </div>`;
    });

    // Auto-scroll wheel threshold: > 4 items
    if (exp.length > 4) {
      applyMarquee(container);
      const duration = Math.max(35, exp.length * 9);
      container.innerHTML = `
        <div class="section-marquee-wrapper">
          <div class="section-marquee-track" style="animation-duration: ${duration}s;">
            ${itemsHtml}
            ${itemsHtml}
          </div>
        </div>`;
    } else {
      applyGridCols(container, exp.length);
      container.innerHTML = itemsHtml;
    }
  } catch (err) {
    console.error('Error rendering experience:', err);
  }
}

async function renderEducation() {
  const container = document.getElementById('education-grid');
  if (!container) return;

  try {
    const res = await fetch('excel/education.csv?t=' + Date.now());
    const text = await res.text();
    const edu = parseCSV(text);
    if (!edu.length) return;

    let itemsHtml = '';
    edu.forEach((e, idx) => {
      const num = e.Number || String(idx + 1).padStart(2, '0');
      itemsHtml += `
        <div class="process-card glass-card">
          <div class="process-num">${num}</div>
          <h3 class="process-title">${e.Institution || ''}</h3>
          <span style="font-size: 0.8rem; color: var(--text-muted); display: block; margin-bottom: 6px;">${e.Location || ''}</span>
          <p class="process-desc"><strong>${e.Degree || ''}</strong><br />${e.Major || ''}</p>
        </div>`;
    });

    // Auto-scroll wheel threshold: > 3 items
    if (edu.length > 3) {
      applyMarquee(container);
      const duration = Math.max(35, edu.length * 9);
      container.innerHTML = `
        <div class="section-marquee-wrapper">
          <div class="section-marquee-track" style="animation-duration: ${duration}s;">
            ${itemsHtml}
            ${itemsHtml}
          </div>
        </div>`;
    } else {
      applyGridCols(container, edu.length);
      container.innerHTML = itemsHtml;
    }
  } catch (err) {
    console.error('Error rendering education:', err);
  }
}

async function renderCertifications() {
  const grid = document.getElementById('certs-grid');
  if (!grid) return;

  try {
    const res = await fetch('excel/certifications.csv?t=' + Date.now());
    const text = await res.text();
    const certs = parseCSV(text);
    if (!certs.length) return;

    let itemsHtml = '';
    certs.forEach(c => {
      const skillsList = c.Skills ? c.Skills.split(';') : [];
      const tagsHtml = skillsList.map(s => `<span>${s.trim()}</span>`).join('');

      itemsHtml += `
        <div class="cert-card glass-card">
          <div>
            <span class="cert-badge-tag">${c.Badge || ''}</span>
            <h3 class="cert-title">${c.Title || ''}</h3>
            <div class="cert-issuer">${c.Issuer || ''} • Issued ${c.Date || ''}</div>
            <div class="project-tech-tags">
              ${tagsHtml}
            </div>
          </div>
          <div class="cert-footer">
            <span class="cert-date">${c.Date || ''}</span>
            <a href="${c.CredentialLink || '#'}" target="_blank" rel="noopener" class="cert-verify">Show Credential ↗</a>
          </div>
        </div>`;
    });

    // Auto-scroll wheel threshold: > 12 items
    if (certs.length > 12) {
      applyMarquee(grid);
      const duration = Math.max(45, certs.length * 4);
      grid.innerHTML = `
        <div class="section-marquee-wrapper">
          <div class="section-marquee-track" style="animation-duration: ${duration}s;">
            ${itemsHtml}
            ${itemsHtml}
          </div>
        </div>`;
    } else {
      applyGridCols(grid, 4);
      grid.innerHTML = itemsHtml;
    }
  } catch (err) {
    console.error('Error rendering certifications:', err);
  }
}

async function renderFeaturedProjects() {
  const compactGrid = document.getElementById('compact-projects-grid');
  if (!compactGrid) return;

  try {
    const res = await fetch('excel/featured_projects.csv?t=' + Date.now());
    if (!res.ok) return;
    const text = await res.text();
    const featuredProjects = parseCSV(text);
    if (!featuredProjects.length) return;

    let itemsHtml = '';
    featuredProjects.forEach(p => {
      const skillsList = p.TechTags ? p.TechTags.split(';') : [];
      const tagsHtml = skillsList.map(s => `<span>${s.trim()}</span>`).join('');

      itemsHtml += `
        <div class="compact-project-card glass-card">
          <div>
            <div class="compact-project-head">
              <span class="compact-project-badge">${(p.Category || '').toUpperCase()}</span>
              <span class="compact-project-status">${(p.Status || 'UPCOMING').toUpperCase()}</span>
            </div>
            <h3 class="compact-project-title">${p.Title || ''}</h3>
            <p class="compact-project-desc">${p.Description || ''}</p>
            <div class="project-tech-tags" style="margin-bottom: 12px;">
              ${tagsHtml}
            </div>
          </div>
          <div class="compact-project-foot">
            <span class="compact-project-target">Target: ${p.ExpectedRelease || 'Coming Soon'}</span>
            <span class="compact-project-link">Upcoming Feature 🚀</span>
          </div>
        </div>`;
    });

    // Auto-scroll wheel threshold: > 3 items
    if (featuredProjects.length > 3) {
      applyMarquee(compactGrid);
      const duration = Math.max(35, featuredProjects.length * 9);
      compactGrid.innerHTML = `
        <div class="section-marquee-wrapper">
          <div class="section-marquee-track" style="animation-duration: ${duration}s;">
            ${itemsHtml}
            ${itemsHtml}
          </div>
        </div>`;
    } else {
      applyGridCols(compactGrid, featuredProjects.length);
      compactGrid.innerHTML = itemsHtml;
    }
  } catch (err) {
    console.error('Error rendering featured projects:', err);
  }
}

async function renderProjects() {
  const fullGrid = document.getElementById('full-projects-grid');
  if (!fullGrid) return;

  try {
    const res = await fetch('excel/projects.csv?t=' + Date.now());
    if (!res.ok) return;
    const text = await res.text();
    const projects = parseCSV(text);
    if (!projects.length) return;

    let fullHtml = '';
    projects.forEach(p => {
      const skillsList = p.TechTags ? p.TechTags.split(';') : [];
      const tagsHtml = skillsList.map(s => `<span>${s.trim()}</span>`).join('');

      fullHtml += `
        <div class="project-card glass-card project-detail-card" data-category="${p.Category || ''}">
          <div class="project-img-wrapper">
            <img src="${p.Image || 'assets/finovo.png'}" alt="${p.Title || ''}" loading="lazy" />
            <div class="project-overlay">
              <span class="view-btn">View Case Details ↗</span>
            </div>
          </div>
          <div class="project-info project-info-flex">
            <div>
              <div class="project-meta">
                <h3 class="project-name">${p.Title || ''}</h3>
                <span class="project-cat">${(p.Category || '').toUpperCase()}</span>
              </div>
              <p class="project-tagline">${p.Tagline || ''}</p>
              <div class="project-metrics-badge">${p.MetricsBadge || ''}</div>
            </div>
            <div class="project-tech-tags">
              ${tagsHtml}
            </div>
          </div>
        </div>`;
    });

    fullGrid.innerHTML = fullHtml;
  } catch (err) {
    console.error('Error rendering projects:', err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderSkills();
  renderExperience();
  renderEducation();
  renderCertifications();
  renderFeaturedProjects();
  renderProjects();
});