/**
 * Dynamic Excel CSV Data Engine
 * Renders all website content 100% dynamically from /excel/*.csv data files
 */

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
        <div class="tech-item">
          <div class="tech-icon-box">${s.IconCode || ''}</div>
          <span class="tech-name">${s.Name || ''}</span>
        </div>`;
    });

    track.innerHTML = `
      <!-- Tech Stack Items Set 1 -->
      ${itemsHtml}
      <!-- Cloned Tech Stack Items Set 2 for Infinite Loop -->
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

    container.style.gridTemplateColumns = `repeat(${Math.min(exp.length, 4)}, 1fr)`;
    let html = '';
    exp.forEach((e, idx) => {
      const num = e.Number || String(idx + 1).padStart(2, '0');
      html += `
        <div class="process-card glass-card">
          <div class="process-num">${num}</div>
          <h3 class="process-title">${e.Company || ''}</h3>
          <span style="font-size: 0.75rem; color: var(--accent-purple-light); font-weight: 700; display: block; margin-bottom: 6px;">${e.Period || ''} | ${e.Location || ''}</span>
          <p class="process-desc"><strong>${e.Role || ''}</strong><br />${e.Description || ''}</p>
        </div>`;
    });

    container.innerHTML = html;
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

    container.style.gridTemplateColumns = `repeat(${Math.min(edu.length, 4)}, 1fr)`;
    let html = '';
    edu.forEach((e, idx) => {
      const num = e.Number || String(idx + 1).padStart(2, '0');
      html += `
        <div class="process-card glass-card">
          <div class="process-num">${num}</div>
          <h3 class="process-title">${e.Institution || ''}</h3>
          <span style="font-size: 0.8rem; color: var(--text-muted); display: block; margin-bottom: 6px;">${e.Location || ''}</span>
          <p class="process-desc"><strong>${e.Degree || ''}</strong><br />${e.Major || ''}</p>
        </div>`;
    });

    container.innerHTML = html;
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

    let html = '';
    certs.forEach(c => {
      const skillsList = c.Skills ? c.Skills.split(';') : [];
      const tagsHtml = skillsList.map(s => `<span>${s.trim()}</span>`).join('');

      html += `
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

    grid.innerHTML = html;
  } catch (err) {
    console.error('Error rendering certifications:', err);
  }
}

async function renderProjects() {
  try {
    const res = await fetch('excel/projects.csv?t=' + Date.now());
    const text = await res.text();
    const projects = parseCSV(text);
    if (!projects.length) return;

    // 1. Compact Featured Projects (for index.html)
    const compactGrid = document.getElementById('compact-projects-grid');
    if (compactGrid) {
      const featured = projects.filter(p => p.Featured && p.Featured.toLowerCase().trim() === 'yes');
      let compactHtml = '';
      featured.forEach(p => {
        compactHtml += `
          <a href="projects.html" class="compact-project-card glass-card">
            <div>
              <div class="compact-project-badge">${(p.Category || '').toUpperCase()}</div>
              <h3 class="compact-project-title">${p.Title || ''}</h3>
              <p class="compact-project-desc">${p.Tagline || ''}</p>
            </div>
            <span class="compact-project-link">View Full Case Study ↗</span>
          </a>`;
      });
      compactGrid.innerHTML = compactHtml;
    }

    // 2. Full Projects Showcase Grid (for projects.html)
    const fullGrid = document.getElementById('full-projects-grid');
    if (fullGrid) {
      let fullHtml = '';
      projects.forEach(p => {
        const skillsList = p.TechTags ? p.TechTags.split(';') : [];
        const tagsHtml = skillsList.map(s => `<span>${s.trim()}</span>`).join('');

        fullHtml += `
          <div class="project-card glass-card project-detail-card" data-category="${p.Category || ''}">
            <div class="project-img-wrapper">
              <img src="${p.Image || 'assets/finovo.png'}" alt="${p.Title || ''}" />
              <div class="project-overlay">
                <span class="view-btn">View Case Details ↗</span>
              </div>
            </div>
            <div class="project-info" style="flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
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
    }
  } catch (err) {
    console.error('Error rendering projects:', err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderSkills();
  renderExperience();
  renderEducation();
  renderCertifications();
  renderProjects();
});
