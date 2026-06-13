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

  // ---------- Client Outreach Tool ----------
  const outreachOverlay = document.getElementById('outreachOverlay');
  const openOutreach = document.getElementById('openOutreach');
  const outreachClose = document.getElementById('outreachClose');
  const clientEmail = document.getElementById('clientEmail');
  const clientName = document.getElementById('clientName');
  const clientTypes = document.getElementById('clientTypes');
  const emailPreview = document.getElementById('emailPreview');
  const sendEmailBtn = document.getElementById('sendEmail');
  const copyEmailBtn = document.getElementById('copyEmail');

  const portfolioUrl = window.location.href;

  const emailTemplates = {
    brand: {
      subject: 'Elevate Your Brand Visuals — Editra',
      body: (name) => `Hi ${name},

I came across your brand and really admire what you're building. I'm Sai Kiran, a motion designer and video editor specializing in brand visuals, promotional content, and motion graphics.

I help brands like yours create scroll-stopping content that drives engagement and tells a compelling visual story.

Here's a look at my recent work:
${portfolioUrl}

Some of what I can help with:
• Brand promo videos & launch campaigns
• Motion graphics for social media
• Product showcase edits
• Cinematic brand films

I'd love to explore how we can bring your brand's story to life through video. Would you be open to a quick chat this week?

Looking forward to hearing from you.

Best,
Sai Kiran
Editra — Motion Design & Video Editing
Teameditra@gmail.com`
    },
    creator: {
      subject: 'Let\'s Create Something Amazing Together — Editra',
      body: (name) => `Hey ${name},

Love your content! I'm Sai Kiran from Editra — I specialize in video editing and motion design for creators who want to level up their visual game.

Check out my portfolio:
${portfolioUrl}

Here's how I can help:
• YouTube video editing & pacing
• Talking head edits with dynamic cuts
• Short-form content for Reels/Shorts/TikTok
• Animated intros, transitions & thumbnails

I'd love to help you produce content that stands out and keeps your audience hooked. Let me know if you'd like to chat!

Cheers,
Sai Kiran
Editra — Motion Design & Video Editing
Teameditra@gmail.com`
    },
    agency: {
      subject: 'Freelance Video Editor & Motion Designer Available — Editra',
      body: (name) => `Hi ${name},

I'm Sai Kiran, a freelance video editor and motion designer. I work with agencies to deliver high-quality video content, motion graphics, and visual assets for their clients.

Portfolio:
${portfolioUrl}

My services include:
• End-to-end video production & post-production
• Motion graphics & animated explainers
• Social media content packages
• Brand identity videos & campaign visuals

I'm comfortable with fast turnarounds and can scale to meet your project needs. Happy to discuss rates and availability.

Best regards,
Sai Kiran
Editra — Motion Design & Video Editing
Teameditra@gmail.com`
    },
    startup: {
      subject: 'Video Content That Helps You Launch & Grow — Editra',
      body: (name) => `Hi ${name},

Congrats on building something exciting! I'm Sai Kiran from Editra — I help startups create impactful video content that communicates their vision clearly and attracts customers.

See my work here:
${portfolioUrl}

I can help with:
• Product demo & explainer videos
• Launch campaign visuals
• Investor pitch video editing
• Social media content strategy & production

Great visuals can make all the difference in how your startup is perceived. I'd love to help you make a strong impression. Open to a quick call?

Best,
Sai Kiran
Editra — Motion Design & Video Editing
Teameditra@gmail.com`
    },
    ecommerce: {
      subject: 'Product Videos That Convert — Editra',
      body: (name) => `Hi ${name},

I'm Sai Kiran, a video editor and motion designer who helps e-commerce brands create product videos that drive sales and engagement.

Check out my portfolio:
${portfolioUrl}

What I offer:
• Product showcase & lifestyle videos
• Unboxing & review-style edits
• Social media ad creatives (Reels, Stories, Shorts)
• Animated product graphics & banners

Video content consistently outperforms static images in conversion rates. Let me help you create content that sells. Interested in chatting?

Best,
Sai Kiran
Editra — Motion Design & Video Editing
Teameditra@gmail.com`
    },
    realestate: {
      subject: 'Cinematic Property Videos — Editra',
      body: (name) => `Hi ${name},

I'm Sai Kiran from Editra. I create cinematic property videos and virtual tours that help real estate professionals showcase listings in the most compelling way.

My portfolio:
${portfolioUrl}

Services I offer:
• Cinematic property walkthrough edits
• Drone footage editing & color grading
• Virtual tour videos
• Agent/brand promotional videos

A well-produced video can make a listing stand out and attract serious buyers faster. I'd love to help with your next project.

Best regards,
Sai Kiran
Editra — Motion Design & Video Editing
Teameditra@gmail.com`
    }
  };

  let selectedType = 'brand';

  function updatePreview() {
    const name = clientName.value.trim() || 'there';
    const template = emailTemplates[selectedType];
    emailPreview.textContent = `Subject: ${template.subject}\n\n${template.body(name)}`;
  }

  updatePreview();

  if (openOutreach) {
    openOutreach.addEventListener('click', (e) => {
      e.preventDefault();
      outreachOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }

  if (outreachClose) {
    outreachClose.addEventListener('click', () => {
      outreachOverlay.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  outreachOverlay.addEventListener('click', (e) => {
    if (e.target === outreachOverlay) {
      outreachOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  clientTypes.querySelectorAll('.type-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      clientTypes.querySelector('.active').classList.remove('active');
      btn.classList.add('active');
      selectedType = btn.dataset.type;
      updatePreview();
    });
  });

  clientName.addEventListener('input', updatePreview);

  sendEmailBtn.addEventListener('click', () => {
    const email = clientEmail.value.trim();
    if (!email) { clientEmail.focus(); return; }
    const name = clientName.value.trim() || 'there';
    const template = emailTemplates[selectedType];
    const subject = encodeURIComponent(template.subject);
    const body = encodeURIComponent(template.body(name));
    const gmailUrl = `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(email)}&su=${subject}&body=${body}`;
    window.open(gmailUrl, '_blank');
  });

  copyEmailBtn.addEventListener('click', () => {
    const name = clientName.value.trim() || 'there';
    const template = emailTemplates[selectedType];
    const text = `Subject: ${template.subject}\n\n${template.body(name)}`;
    navigator.clipboard.writeText(text).then(() => {
      copyEmailBtn.textContent = 'Copied!';
      setTimeout(() => { copyEmailBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px;margin-right:8px"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>Copy Email Text'; }, 2000);
    });
  });

});
