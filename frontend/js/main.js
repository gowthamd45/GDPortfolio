const CDN = 'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/';

async function loadPortfolio() {
  const res  = await fetch('./data/portfolio.json');
  return res.json();
}

function chipImg(chip) {
  if (chip.icon)  return `<img src="${CDN}${chip.icon}" alt="${chip.name}" loading="lazy">`;
  if (chip.badge) return `<span class="aws-badge">${chip.badge}</span>`;
  return `<span style="font-size:1.1rem">${chip.emoji}</span>`;
}

function renderHero(hero) {
  document.querySelector('.hero-eyebrow').innerHTML =
    `<span class="dot"></span>${hero.status}`;

  document.querySelector('.hero-name').innerHTML =
    hero.name.split(' ').map(w => `<span class="grad-text">${w}</span>`).join('');

  document.querySelector('.hero-role').innerHTML =
    `<strong>${hero.title}</strong> &nbsp;·&nbsp; ${hero.subtitle}`;

  document.querySelector('.tech-pill-row').innerHTML = hero.techPills.map(p => {
    const icon = p.icon
      ? `<img src="${CDN}${p.icon}" alt="${p.name}">`
      : `<span class="aws-lbl">${p.badge}</span>`;
    return `<div class="tech-pill">${icon}${p.name}</div>`;
  }).join('');

  document.querySelector('.hero-stats').innerHTML = hero.stats.map(s =>
    `<div class="stat-card">
       <span class="stat-num">${s.num}</span>
       <span class="stat-lbl">${s.label}</span>
     </div>`
  ).join('');
}

function renderAbout(about) {
  const paras = about.paragraphs.map(p => `<p>${p}</p>`).join('');
  const exp   = about.expertise.map(e =>
    `<div class="expertise-item">
       <span class="ei-icon">${e.icon}</span>
       <div>
         <div class="ei-name">${e.name}</div>
         <div class="ei-desc">${e.desc}</div>
       </div>
     </div>`
  ).join('');

  document.querySelector('.about-text').innerHTML =
    paras + `<div class="expertise-row">${exp}</div>`;

  document.querySelector('.cert-panel').innerHTML =
    `<div class="cert-panel-hdr">Certifications &amp; Degrees</div>` +
    about.certifications.map(c =>
      `<div class="cert-item">
         <div class="cert-badge-icon">${c.badge}</div>
         <div>
           <div class="cert-name">${c.name}</div>
           <div class="cert-org">${c.org}</div>
         </div>
       </div>`
    ).join('');
}

function renderSkills(skills) {
  document.querySelector('.tech-section').innerHTML = skills.map(cat =>
    `<div>
       <div class="tech-cat-title">${cat.category}</div>
       <div class="tech-chips">
         ${cat.chips.map(chip =>
           `<div class="tech-chip">${chipImg(chip)}<span>${chip.name}</span></div>`
         ).join('')}
       </div>
     </div>`
  ).join('');

  document.querySelectorAll('.tech-chips').forEach(row => {
    row.querySelectorAll('.tech-chip').forEach((c, i) => {
      c.style.opacity = '0';
      c.style.transform = 'translateY(14px)';
      c.style.transition = `opacity 0.38s ease ${i * 48}ms, transform 0.38s ease ${i * 48}ms`;
    });
  });
  const chipObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.querySelectorAll('.tech-chip').forEach(c => {
        c.style.opacity = '1'; c.style.transform = 'none';
      });
      chipObs.unobserve(e.target);
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.tech-chips').forEach(r => chipObs.observe(r));
}

function renderExperience(experience) {
  document.querySelector('.timeline').innerHTML = experience.map(job =>
    `<div class="exp-item reveal-left">
       <div class="exp-dot"></div>
       <div class="exp-card">
         <div class="exp-header">
           <div class="exp-title">${job.title}</div>
           <div class="exp-date-badge">${job.period}</div>
         </div>
         <div class="exp-company">${job.company} &nbsp;·&nbsp; ${job.location}</div>
         <ul class="exp-bullets">
           ${job.bullets.map(b => `<li>${b}</li>`).join('')}
         </ul>
         <div class="exp-tags">
           ${job.tags.map(t => `<span class="exp-tag">${t}</span>`).join('')}
         </div>
       </div>
     </div>`
  ).join('');
}

function renderEducation(education) {
  document.querySelector('.edu-grid').innerHTML = education.map(edu =>
    `<div class="edu-card reveal-scale">
       <span class="edu-icon">${edu.icon}</span>
       <div class="edu-degree">${edu.degree}</div>
       <div class="edu-field">${edu.field}</div>
       <div class="edu-school">${edu.school}</div>
       <div class="edu-date ${edu.active ? 'active' : ''}">${edu.period}</div>
     </div>`
  ).join('');
}

function renderContact(contact) {
  document.querySelector('.contact-cards').innerHTML = `
    <a href="tel:${contact.phone}" class="contact-card contact-card-icon-only">
      <span class="contact-icon">📞</span>
    </a>
    <a href="mailto:${contact.email}" class="contact-card contact-card-icon-only">
      <span class="contact-icon">✉️</span>
    </a>
    <a href="${contact.linkedin}" target="_blank" rel="noopener" class="contact-card contact-card-icon-only">
      <span class="contact-icon">
        <img src="${CDN}linkedin/linkedin-original.svg" alt="LinkedIn" style="width:2rem;height:2rem;vertical-align:middle;">
      </span>
    </a>`;
}

function initCanvas() {
  const canvas = document.getElementById('anime-bg');
  const ctx = canvas.getContext('2d');
  let W, H;
  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  const iconPaths = [
    'java/java-original.svg','spring/spring-original.svg','angularjs/angularjs-original.svg',
    'docker/docker-original.svg','mongodb/mongodb-original.svg','typescript/typescript-original.svg',
    'mysql/mysql-original.svg','git/git-original.svg','jenkins/jenkins-original.svg',
    'postgresql/postgresql-original.svg','html5/html5-original.svg','css3/css3-original.svg',
    'bootstrap/bootstrap-original.svg','javascript/javascript-original.svg',
    'hibernate/hibernate-plain.svg','linux/linux-original.svg',
  ];
  const images = iconPaths.map(p => {
    const img = new Image(); img.crossOrigin = 'anonymous'; img.src = CDN + p; return img;
  });

  const stars = Array.from({ length: 220 }, () => ({
    x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
    r: Math.random() * 1.4 + 0.2, alpha: Math.random(),
    speed: Math.random() * 0.008 + 0.003, dir: Math.random() > 0.5 ? 1 : -1,
    color: Math.random() > 0.85 ? '#ffd6f5' : '#ffffff'
  }));

  function makeIcon(fromTop) {
    return {
      x: Math.random() * W, y: fromTop ? -50 : Math.random() * H,
      vx: (Math.random() - 0.5) * 0.7, vy: Math.random() * 0.9 + 0.4,
      rot: Math.random() * Math.PI * 2, rotV: (Math.random() - 0.5) * 0.018,
      size: Math.random() * 18 + 22, alpha: Math.random() * 0.22 + 0.1,
      imgIdx: Math.floor(Math.random() * images.length),
      swing: Math.random() * 0.012 + 0.004, phase: Math.random() * Math.PI * 2
    };
  }
  const iconParticles = Array.from({ length: 28 }, () => makeIcon(false));
  let shooters = [];
  setInterval(() => { if (shooters.length < 2) shooters.push({ x: Math.random()*W*0.6, y: Math.random()*H*0.4, len: 80+Math.random()*60, angle: Math.PI/5+(Math.random()-0.5)*0.3, speed: 8+Math.random()*6, alpha: 1, done: false }); }, 4000);

  function draw() {
    const grad = ctx.createLinearGradient(0,0,0,H);
    grad.addColorStop(0,'#07010f'); grad.addColorStop(0.3,'#0c0220');
    grad.addColorStop(0.65,'#12032e'); grad.addColorStop(1,'#0a0118');
    ctx.fillStyle = grad; ctx.fillRect(0,0,W,H);

    stars.forEach(s => {
      s.alpha += s.speed * s.dir;
      if (s.alpha > 1 || s.alpha < 0.05) s.dir *= -1;
      ctx.save(); ctx.globalAlpha = s.alpha; ctx.beginPath();
      ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fillStyle = s.color;
      ctx.shadowColor = s.color; ctx.shadowBlur = s.r > 1 ? 4 : 0;
      ctx.fill(); ctx.restore();
    });

    shooters = shooters.filter(sh => !sh.done);
    shooters.forEach(sh => {
      ctx.save(); ctx.globalAlpha = sh.alpha; ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1.5; ctx.shadowColor = '#d87dff'; ctx.shadowBlur = 6;
      ctx.beginPath(); ctx.moveTo(sh.x,sh.y);
      ctx.lineTo(sh.x - Math.cos(sh.angle)*sh.len, sh.y - Math.sin(sh.angle)*sh.len);
      ctx.stroke(); ctx.restore();
      sh.x += Math.cos(sh.angle)*sh.speed; sh.y += Math.sin(sh.angle)*sh.speed;
      sh.alpha -= 0.025; if (sh.alpha <= 0) sh.done = true;
    });

    iconParticles.forEach(p => {
      const img = images[p.imgIdx];
      if (!img.complete || !img.naturalWidth) return;
      p.phase += p.swing; p.x += p.vx + Math.sin(p.phase)*0.55; p.y += p.vy; p.rot += p.rotV;
      ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.rot); ctx.globalAlpha = p.alpha;
      ctx.shadowColor = '#d87dff'; ctx.shadowBlur = 10;
      ctx.drawImage(img,-p.size/2,-p.size/2,p.size,p.size); ctx.restore();
      if (p.y > H+60 || p.x < -60 || p.x > W+60) Object.assign(p, makeIcon(true));
    });

    requestAnimationFrame(draw);
  }
  draw();
}

function initFloatingHeroIcons() {
  const icons = [
    'java/java-original.svg','spring/spring-original.svg','angularjs/angularjs-original.svg',
    'docker/docker-original.svg','mongodb/mongodb-original.svg','typescript/typescript-original.svg',
    'mysql/mysql-original.svg','git/git-original.svg','jenkins/jenkins-original.svg',
    'postgresql/postgresql-original.svg','html5/html5-original.svg','css3/css3-original.svg',
    'bootstrap/bootstrap-original.svg','javascript/javascript-original.svg',
  ];
  const container = document.getElementById('floatingTech');
  icons.forEach((src, i) => {
    const img = document.createElement('img');
    img.src = CDN + src; img.className = 'float-icon';
    const size = 26 + Math.random() * 22;
    img.style.cssText = `width:${size}px;height:${size}px;left:${Math.random()*92+4}%;bottom:-60px;animation-duration:${16+Math.random()*18}s;animation-delay:${i*2.2}s;`;
    container.appendChild(img);
  });
}

function initScrollBehaviors() {
  const bar = document.getElementById('scroll-progress');
  const nav = document.querySelector('nav');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav ul li a');
  const hc = document.querySelector('.hero-content');

  window.addEventListener('scroll', () => {
    bar.style.width = (window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100) + '%';
    nav.classList.toggle('scrolled', window.scrollY > 60);
    let cur = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 130) cur = s.id; });
    navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur));
    if (window.scrollY < window.innerHeight)
      hc.style.transform = `translateY(${window.scrollY * 0.18}px)`;
  }, { passive: true });
}

function initReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => { if (e.isIntersecting) setTimeout(() => e.target.classList.add('visible'), i * 90); });
  }, { threshold: 0.07 });
  document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.reveal-scale').forEach(el => obs.observe(el));
}

function initStatCounter() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const raw = el.textContent.trim();
      const m = raw.match(/^(\d+)/);
      if (!m) return;
      const end = +m[1], suffix = raw.slice(m[1].length);
      let cur = 0;
      const step = Math.max(1, Math.ceil(end / 32));
      const t = setInterval(() => {
        cur = Math.min(cur + step, end);
        el.textContent = cur + suffix;
        if (cur >= end) clearInterval(t);
      }, 35);
      obs.unobserve(el);
    });
  }, { threshold: 0.9 });
  document.querySelectorAll('.stat-num').forEach(el => obs.observe(el));
}

function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const payload = Object.fromEntries(new FormData(form));
    const subject = encodeURIComponent(payload.subject || 'Portfolio Inquiry');
    const body    = encodeURIComponent(
      `Name: ${payload.name}\nEmail: ${payload.email}\nPhone: ${payload.phone || 'N/A'}\n\n${payload.message}`
    );
    window.location.href = `mailto:gowthamdoppalapudi369@gmail.com?subject=${subject}&body=${body}`;
    form.reset();
    document.getElementById('formSuccess').style.display = 'block';
    form.querySelector('.form-submit').style.display = 'none';
    form.querySelector('.form-note').style.display = 'none';
  });
}

async function init() {
  try {
    const data = await loadPortfolio();
    renderHero(data.hero);
    renderAbout(data.about);
    renderSkills(data.skills);
    renderExperience(data.experience);
    renderEducation(data.education);
    renderContact(data.contact);
  } catch (err) {
    console.error('Failed to load portfolio data:', err);
  }

  const loader = document.getElementById('loading-screen');
  loader.classList.add('hidden');
  setTimeout(() => loader.remove(), 400);

  initCanvas();
  initFloatingHeroIcons();
  initScrollBehaviors();
  initReveal();
  initStatCounter();
  initContactForm();
}

document.addEventListener('DOMContentLoaded', init);
