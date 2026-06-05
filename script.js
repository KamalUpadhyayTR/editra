/* ========================================
   EDITRA — Interactions
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ---------- Scroll Reveal ----------
  const revealTargets = document.querySelectorAll(
    '.section-label, .section-title, .section-desc, ' +
    '.work-card, .service-card, .process-step, ' +
    '.about-intro, .about-text, .about-skills, ' +
    '.contact-link, .showreel-video-wrapper, ' +
    '.hero-content, .hero-visual'
  );

  revealTargets.forEach((el, i) => {
    el.classList.add('reveal');
    const siblings = el.parentElement.querySelectorAll('.reveal');
    const index = Array.from(siblings).indexOf(el);
    if (index > 0 && index <= 4) {
      el.classList.add(`reveal-delay-${index}`);
    }
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // ---------- Navbar Scroll ----------
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    navbar.classList.toggle('scrolled', currentScroll > 60);
    lastScroll = currentScroll;
  }, { passive: true });

  // ---------- Mobile Nav Toggle ----------
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ---------- Smooth Scroll for Anchor Links ----------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = navbar.offsetHeight + 20;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ---------- Parallax Blobs on Mouse Move ----------
  const blobs = document.querySelectorAll('.hero-gradient-blob');

  document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;

    blobs.forEach((blob, i) => {
      const speed = (i + 1) * 12;
      blob.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
    });
  });

  // ---------- Hero Laptop — Scroll Open + 3D Tilt on Hover ----------
  const heroLaptop = document.querySelector('.hero-laptop-img');
  if (heroLaptop) {
    const heroVisual = heroLaptop.closest('.hero-visual');
    let laptopOpened = false;
    let openProgress = 0;

    let currentX = 0, currentY = 0, targetX = 0, targetY = 0;
    let isHovering = false;

    function getOpenProgress() {
      const rect = heroVisual.getBoundingClientRect();
      const viewH = window.innerHeight;
      const start = viewH * 0.9;
      const end = viewH * 0.25;
      const pos = rect.top;
      return Math.max(0, Math.min(1, (start - pos) / (start - end)));
    }

    function updateLaptop() {
      openProgress = getOpenProgress();

      const closedAngle = -80;
      const openAngle = closedAngle * (1 - openProgress);

      laptopOpened = openProgress >= 0.95;

      if (isHovering && laptopOpened) {
        currentX += (targetX - currentX) * 0.08;
        currentY += (targetY - currentY) * 0.08;
      } else {
        currentX += (0 - currentX) * 0.08;
        currentY += (0 - currentY) * 0.08;
      }

      const totalRotateX = openAngle + currentY;
      const shadowX = currentX * -0.8;
      const shadowY = 15 + openProgress * 15;
      const shadowBlur = 20 + openProgress * 30;
      const shadowOpacity = openProgress * 0.25;

      heroLaptop.style.transform = `perspective(800px) rotateX(${totalRotateX}deg) rotateY(${currentX}deg)`;
      heroLaptop.style.filter = `drop-shadow(${shadowX}px ${shadowY}px ${shadowBlur}px rgba(0, 0, 0, ${shadowOpacity}))`;
      heroLaptop.style.opacity = 0.6 + openProgress * 0.4;

      requestAnimationFrame(updateLaptop);
    }

    requestAnimationFrame(updateLaptop);

    heroVisual.addEventListener('mousemove', (e) => {
      if (!laptopOpened) return;
      const rect = heroVisual.getBoundingClientRect();
      targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 25;
      targetY = ((e.clientY - rect.top) / rect.height - 0.5) * -15;
      isHovering = true;
    });

    heroVisual.addEventListener('mouseleave', () => {
      isHovering = false;
      targetX = 0;
      targetY = 0;
    });
  }

  // ---------- Work Cards — Tilt Effect ----------
  document.querySelectorAll('.work-card-inner').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
      card.style.transform = `translateY(-6px) perspective(800px) rotateY(${x}deg) rotateX(${y}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ---------- Cursor Glow (desktop only) ----------
  if (window.matchMedia('(pointer: fine)').matches) {
    const glow = document.createElement('div');
    glow.style.cssText = `
      position: fixed;
      width: 300px;
      height: 300px;
      border-radius: 50%;
      pointer-events: none;
      background: radial-gradient(circle, rgba(192, 132, 252, 0.06) 0%, transparent 70%);
      transform: translate(-50%, -50%);
      z-index: 0;
      transition: opacity 0.3s;
    `;
    document.body.appendChild(glow);

    document.addEventListener('mousemove', (e) => {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    });
  }

  // ---------- Active Nav Link on Scroll ----------
  const sections = document.querySelectorAll('section[id]');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.querySelectorAll('a').forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '-80px 0px -50% 0px'
  });

  sections.forEach(section => navObserver.observe(section));

  // ---------- Work Card Video — Hover Preview & Click to Play ----------
  document.querySelectorAll('.work-card').forEach(card => {
    const video = card.querySelector('.work-video');
    if (!video) return;

    card.addEventListener('mouseenter', () => {
      video.currentTime = 0;
      video.play().catch(() => {});
    });

    card.addEventListener('mouseleave', () => {
      video.pause();
      video.currentTime = 0;
    });

    card.addEventListener('click', () => {
      video.muted = false;
      video.controls = true;
      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen();
      }
      video.play();
    });

    video.addEventListener('fullscreenchange', () => {
      if (!document.fullscreenElement) {
        video.muted = true;
        video.controls = false;
        video.pause();
        video.currentTime = 0;
      }
    });
  });

  // ---------- Counter Animation for Process Steps ----------
  const stepNumbers = document.querySelectorAll('.step-number');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  stepNumbers.forEach(el => counterObserver.observe(el));

});
