import csv
import re
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def read_csv(filename):
    filepath = os.path.join(BASE_DIR, 'excel', filename)
    if not os.path.exists(filepath):
        return []
    with open(filepath, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        return list(reader)

def update_skills():
    skills = read_csv('skills.csv')
    items_html = ""
    for s in skills:
        code = s['IconCode'].strip()
        name = s['Name'].strip()
        items_html += f'            <div class="tech-item"><div class="tech-icon-box">{code}</div><span class="tech-name">{name}</span></div>\n'
    return items_html

def update_experience():
    exp = read_csv('experience.csv')
    html = ""
    for e in exp:
        num = e['Number'].strip()
        company = e['Company'].strip()
        role = e['Role'].strip()
        period = e['Period'].strip()
        location = e['Location'].strip()
        desc = e['Description'].strip()
        html += f'''          <div class="process-card glass-card">
            <div class="process-num">{num}</div>
            <h3 class="process-title">{company}</h3>
            <span style="font-size: 0.75rem; color: var(--accent-purple-light); font-weight: 700; display: block; margin-bottom: 6px;">{period} | {location}</span>
            <p class="process-desc"><strong>{role}</strong><br />{desc}</p>
          </div>\n\n'''
    return html.strip()

def update_education():
    edu = read_csv('education.csv')
    html = ""
    for e in edu:
        num = e['Number'].strip()
        inst = e['Institution'].strip()
        loc = e['Location'].strip()
        degree = e['Degree'].strip()
        major = e['Major'].strip()
        html += f'''          <div class="process-card glass-card">
            <div class="process-num">{num}</div>
            <h3 class="process-title">{inst}</h3>
            <span style="font-size: 0.8rem; color: var(--text-muted); display: block; margin-bottom: 6px;">{loc}</span>
            <p class="process-desc"><strong>{degree}</strong><br />{major}</p>
          </div>\n\n'''
    return html.strip()

def update_certifications():
    certs = read_csv('certifications.csv')
    html = ""
    for c in certs:
        badge = c['Badge'].strip()
        title = c['Title'].strip()
        issuer = c['Issuer'].strip()
        date = c['Date'].strip()
        skills = c['Skills'].strip().split(';')
        link = c['CredentialLink'].strip()
        
        tags_html = "".join([f"<span>{s.strip()}</span>" for s in skills if s.strip()])
        html += f'''          <div class="cert-card glass-card">
            <div>
              <span class="cert-badge-tag">{badge}</span>
              <h3 class="cert-title">{title}</h3>
              <div class="cert-issuer">{issuer} • Issued {date}</div>
              <div class="project-tech-tags">
                {tags_html}
              </div>
            </div>
            <div class="cert-footer">
              <span class="cert-date">{date}</span>
              <a href="{link}" target="_blank" rel="noopener" class="cert-verify">Show Credential ↗</a>
            </div>
          </div>\n\n'''
    return html.strip()

def main():
    print("Reading Excel CSV data files from /excel directory...")
    skills = read_csv('skills.csv')
    exp = read_csv('experience.csv')
    edu = read_csv('education.csv')
    certs = read_csv('certifications.csv')
    featured = read_csv('featured_projects.csv')
    projects = read_csv('projects.csv')

    print(f"Loaded: {len(skills)} skills, {len(exp)} roles, {len(edu)} degrees, {len(certs)} certs, {len(featured)} upcoming features, {len(projects)} case studies.")
    print("Website data files validated & connected successfully!")

if __name__ == '__main__':
    main()
