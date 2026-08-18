/**
 * SPIDER-MAN PORTFOLIO JAVASCRIPT
 * Interactive Web Canvas • Multiverse Suit Switcher • Web Audio SFX • 3D Hologram Tilt
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. WEB AUDIO API SYNTHESIZER (Spidey Sound Effects)
  // --------------------------------------------------------------------------
  let isSoundEnabled = true;
  let audioCtx = null;

  function initAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Synthesize Web-Shooter "THWIP!" sound
  function playThwipSound() {
    if (!isSoundEnabled) return;
    initAudioContext();
    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.15);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, audioCtx.currentTime);
    filter.Q.setValueAtTime(4, audioCtx.currentTime);

    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.15);
  }

  // Synthesize Spider-Sense pulse / Zap sound
  function playSpiderSenseSound() {
    if (!isSoundEnabled) return;
    initAudioContext();
    if (!audioCtx) return;

    for (let i = 0; i < 3; i++) {
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc.type = 'sine';
      const startTime = audioCtx.currentTime + i * 0.1;
      osc.frequency.setValueAtTime(880 + i * 220, startTime);
      osc.frequency.exponentialRampToValueAtTime(1760 + i * 220, startTime + 0.08);

      gainNode.gain.setValueAtTime(0.2, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.08);

      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.08);
    }
  }

  // Synthesize Suit Switch SFX
  function playSuitSwitchSound() {
    if (!isSoundEnabled) return;
    initAudioContext();
    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(900, audioCtx.currentTime + 0.2);

    gainNode.gain.setValueAtTime(0.25, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.2);
  }

  // Sound Toggle Button
  const sfxToggleBtn = document.getElementById('sfxToggle');
  if (sfxToggleBtn) {
    sfxToggleBtn.addEventListener('click', () => {
      isSoundEnabled = !isSoundEnabled;
      initAudioContext();

      const tooltip = sfxToggleBtn.querySelector('.action-tooltip');
      const icon = sfxToggleBtn.querySelector('i');

      if (isSoundEnabled) {
        icon.className = 'fa-solid fa-volume-high';
        tooltip.textContent = 'SFX ON';
        playThwipSound();
      } else {
        icon.className = 'fa-solid fa-volume-xmark';
        tooltip.textContent = 'SFX OFF';
      }
    });
  }

  // Attach THWIP sound to primary action buttons
  document.querySelectorAll('.btn-thwip, .spidey-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      playThwipSound();
    });
  });

  // --------------------------------------------------------------------------
  // 2. MULTIVERSE SUIT / THEME SWITCHER
  // --------------------------------------------------------------------------
  const suitBtn = document.getElementById('suitBtn');
  const suitDropdownWrap = document.querySelector('.suit-switcher-wrap');
  const suitOptions = document.querySelectorAll('.suit-option');
  const suitNameLabel = document.querySelector('.suit-name-label');

  if (suitBtn && suitDropdownWrap) {
    suitBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = suitDropdownWrap.classList.toggle('open');
      suitBtn.setAttribute('aria-expanded', isOpen);
    });

    document.addEventListener('click', () => {
      suitDropdownWrap.classList.remove('open');
      suitBtn.setAttribute('aria-expanded', 'false');
    });

    suitOptions.forEach(option => {
      option.addEventListener('click', (e) => {
        e.stopPropagation();
        const selectedSuit = option.getAttribute('data-suit');
        const suitName = option.querySelector('strong').textContent;

        document.documentElement.setAttribute('data-theme', selectedSuit);

        suitOptions.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');

        if (suitNameLabel) suitNameLabel.textContent = suitName;

        suitDropdownWrap.classList.remove('open');
        suitBtn.setAttribute('aria-expanded', 'false');

        playSuitSwitchSound();
      });
    });
  }

  // --------------------------------------------------------------------------
  // 3. SPIDER-SENSE ALERT TRIGGER
  // --------------------------------------------------------------------------
  const spiderSenseBtn = document.getElementById('spiderSenseBtn');
  const spiderSenseBanner = document.getElementById('spiderSenseBanner');

  if (spiderSenseBtn && spiderSenseBanner) {
    spiderSenseBtn.addEventListener('click', () => {
      playSpiderSenseSound();
      spiderSenseBanner.classList.add('active');

      setTimeout(() => {
        spiderSenseBanner.classList.remove('active');
      }, 4000);
    });
  }

  // --------------------------------------------------------------------------
  // 4. INTERACTIVE SPIDER-WEB CANVAS BACKGROUND
  // --------------------------------------------------------------------------
  const canvas = document.getElementById('webCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = Math.min(Math.floor(window.innerWidth / 18), 70);
    const mouse = { x: null, y: null, maxRadius: 180 };

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    class WebParticle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;
        this.radius = Math.random() * 2 + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse interaction: gravitate slightly or connect
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.maxRadius) {
            const force = (mouse.maxRadius - dist) / mouse.maxRadius;
            this.x += (dx / dist) * force * 0.5;
            this.y += (dy / dist) * force * 0.5;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 0, 85, 0.6)';
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new WebParticle());
    }

    function animateWeb() {
      ctx.clearRect(0, 0, width, height);

      // Connect particles with web threads
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            const alpha = 1 - dist / 130;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 242, 254, ${alpha * 0.25})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        // Connect particles to mouse cursor (web-slinger thread)
        if (mouse.x !== null && mouse.y !== null) {
          const dx = particles[i].x - mouse.x;
          const dy = particles[i].y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 160) {
            const alpha = 1 - dist / 160;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(255, 230, 0, ${alpha * 0.5})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animateWeb);
    }

    animateWeb();
  }

  // --------------------------------------------------------------------------
  // 5. 3D HOLOGRAM TILT ON HERO CARD
  // --------------------------------------------------------------------------
  const heroCard = document.getElementById('spideyCard');
  if (heroCard) {
    heroCard.addEventListener('mousemove', (e) => {
      const rect = heroCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -12;
      const rotateY = ((x - centerX) / centerX) * 12;

      heroCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
    });

    heroCard.addEventListener('mouseleave', () => {
      heroCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  }

  // --------------------------------------------------------------------------
  // 6. MISSIONS / PROJECTS FILTERING
  // --------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const missionCards = document.querySelectorAll('.mission-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      missionCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease-out';
        } else {
          card.style.display = 'none';
        }
      });

      playThwipSound();
    });
  });

  // --------------------------------------------------------------------------
  // 7. SPIDER-SIGNAL CONTACT FORM SUBMISSION
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('spiderContactForm');
  const formSuccessToast = document.getElementById('formSuccessToast');

  if (contactForm && formSuccessToast) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('senderName');
      const emailInput = document.getElementById('senderEmail');
      const messageInput = document.getElementById('senderMessage');

      if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
        alert('Please fill out all transmission coordinates!');
        return;
      }

      playThwipSound();
      formSuccessToast.classList.add('show');
      formSuccessToast.setAttribute('aria-hidden', 'false');

      contactForm.reset();

      setTimeout(() => {
        formSuccessToast.classList.remove('show');
        formSuccessToast.setAttribute('aria-hidden', 'true');
      }, 5000);
    });
  }

  // --------------------------------------------------------------------------
  // 8. MOBILE HAMBURGER MENU TOGGLE
  // --------------------------------------------------------------------------
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      hamburgerBtn.setAttribute('aria-expanded', isOpen);
    });

    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // --------------------------------------------------------------------------
  // 9. ACTIVE NAV LINK ON SCROLL
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
});
