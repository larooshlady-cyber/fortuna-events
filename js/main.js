/* ============================================================
   FORTUNA EVENTS - Luxury Main JavaScript
   Premium Interactions & Refined Animations
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     1. Mobile Navigation
     ---------------------------------------------------------- */
  function initMobileNav() {
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.querySelector('.site-header__nav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', function () {
      var isOpen = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!isOpen));
      toggle.classList.toggle('is-active');
      nav.classList.toggle('is-open');
      document.body.style.overflow = !isOpen ? 'hidden' : '';
    });

    nav.querySelectorAll('.site-header__links a').forEach(function (link) {
      link.addEventListener('click', function () {
        toggle.setAttribute('aria-expanded', 'false');
        toggle.classList.remove('is-active');
        nav.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        toggle.setAttribute('aria-expanded', 'false');
        toggle.classList.remove('is-active');
        nav.classList.remove('is-open');
        document.body.style.overflow = '';
        toggle.focus();
      }
    });
  }


  /* ----------------------------------------------------------
     2. Scroll Reveal with Stagger
     ---------------------------------------------------------- */
  function initScrollReveal() {
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var selectors = '.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-rotate, .reveal-stagger';
    var elements = document.querySelectorAll(selectors);

    if (prefersReducedMotion) {
      elements.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    if (!elements.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -80px 0px' });

    elements.forEach(function (el) { observer.observe(el); });
  }


  /* ----------------------------------------------------------
     3. Luxury Animated Counters
     ---------------------------------------------------------- */
  function initCounters() {
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var counters = document.querySelectorAll('.counter-value');
    if (!counters.length) return;

    if (prefersReducedMotion) {
      counters.forEach(function (c) {
        c.textContent = c.getAttribute('data-target') + (c.getAttribute('data-suffix') || '');
      });
      return;
    }

    function easeOutExpo(t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); }

    function animate(el) {
      var target = parseInt(el.getAttribute('data-target'), 10);
      var suffix = el.getAttribute('data-suffix') || '';
      var start = null;
      var duration = 2500;

      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / duration, 1);
        el.textContent = Math.floor(easeOutExpo(p) * target) + suffix;
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target + suffix;
      }

      requestAnimationFrame(step);
    }

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animate(e.target); obs.unobserve(e.target); }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (c) { obs.observe(c); });
  }


  /* ----------------------------------------------------------
     4. Header Shrink + Scroll Progress
     ---------------------------------------------------------- */
  function initHeaderScroll() {
    var header = document.querySelector('.site-header');
    var progressBar = document.querySelector('.scroll-progress');
    if (!header) return;

    var shrunk = false;

    function check() {
      var scrollY = window.pageYOffset;

      // Header scroll state
      if (scrollY > 60 && !shrunk) {
        header.classList.add('is-scrolled');
        shrunk = true;
      } else if (scrollY <= 60 && shrunk) {
        header.classList.remove('is-scrolled');
        shrunk = false;
      }

      // Scroll progress bar
      if (progressBar) {
        var docHeight = document.documentElement.scrollHeight - window.innerHeight;
        var progress = docHeight > 0 ? scrollY / docHeight : 0;
        progressBar.style.width = (Math.min(progress, 1) * 100) + '%';
      }
    }

    window.addEventListener('scroll', check, { passive: true });
    check();
  }


  /* ----------------------------------------------------------
     5. Timeline Animation
     ---------------------------------------------------------- */
  function initTimeline() {
    var timeline = document.querySelector('.timeline');
    if (!timeline) return;

    var items = timeline.querySelectorAll('.timeline__item');
    var progress = timeline.querySelector('.timeline__progress');
    if (!items.length) return;

    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      items.forEach(function (item) { item.classList.add('is-active'); });
      if (progress) progress.style.height = '100%';
      return;
    }

    items.forEach(function (item, i) { item.style.transitionDelay = (i * 0.12) + 's'; });

    var ticking = false;

    function update() {
      var rect = timeline.getBoundingClientRect();
      var vh = window.innerHeight;
      var p = Math.min(Math.max((vh * 0.6 - rect.top) / rect.height, 0), 1);

      if (progress) progress.style.height = (p * 100) + '%';

      items.forEach(function (item) {
        var r = item.getBoundingClientRect();
        if (r.top + r.height * 0.3 < vh * 0.75) item.classList.add('is-active');
      });
    }

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(function () { update(); ticking = false; });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    update();
  }


  /* ----------------------------------------------------------
     6. Active Nav
     ---------------------------------------------------------- */
  function initActiveNav() {
    var page = window.location.pathname.split('/').pop() || 'index.html';
    if (page === 'case-study.html') page = 'work.html';

    document.querySelectorAll('.site-header__links a').forEach(function (link) {
      if (link.getAttribute('href') === page) link.classList.add('active');
    });
  }


  /* ----------------------------------------------------------
     7. Hero Cursor Glow (Luxury Follow Effect)
     ---------------------------------------------------------- */
  function initHeroGlow() {
    var hero = document.querySelector('.hero');
    var glow = document.querySelector('.hero__glow-follow');
    if (!hero || !glow) return;

    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    var targetX = 0, targetY = 0;
    var currentX = 0, currentY = 0;
    var animating = false;

    function lerp(a, b, t) { return a + (b - a) * t; }

    function tick() {
      currentX = lerp(currentX, targetX, 0.06);
      currentY = lerp(currentY, targetY, 0.06);
      glow.style.left = (currentX - 300) + 'px';
      glow.style.top = (currentY - 300) + 'px';

      if (Math.abs(targetX - currentX) > 0.5 || Math.abs(targetY - currentY) > 0.5) {
        requestAnimationFrame(tick);
      } else {
        animating = false;
      }
    }

    hero.addEventListener('mousemove', function (e) {
      var rect = hero.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;

      if (!animating) {
        animating = true;
        requestAnimationFrame(tick);
      }
    });
  }


  /* ----------------------------------------------------------
     8. Smooth Section Parallax
     ---------------------------------------------------------- */
  function initSectionParallax() {
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    var sections = document.querySelectorAll('.section > .container');
    if (!sections.length) return;

    var ticking = false;

    function update() {
      var vh = window.innerHeight;
      sections.forEach(function (container) {
        var rect = container.getBoundingClientRect();
        var center = rect.top + rect.height / 2;
        var offset = (center - vh / 2) / vh;
        var shift = offset * -15;
        container.style.transform = 'translateY(' + shift.toFixed(2) + 'px)';
      });
    }

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(function () { update(); ticking = false; });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    update();
  }


  /* ----------------------------------------------------------
     9. Luxury Card Tilt & Magnetic Hover
     ---------------------------------------------------------- */
  function initCardTilt() {
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    if (window.innerWidth < 1024) return;

    var cards = document.querySelectorAll('.portfolio-card, .cta-block');

    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = 'translateY(-8px) perspective(1000px) rotateY(' + (x * 4).toFixed(2) + 'deg) rotateX(' + (-y * 4).toFixed(2) + 'deg)';
      });

      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    });
  }


  /* ----------------------------------------------------------
     10. Magnetic Buttons
     ---------------------------------------------------------- */
  function initMagneticButtons() {
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    if (window.innerWidth < 1024) return;

    var buttons = document.querySelectorAll('.btn-primary, .btn-secondary');

    buttons.forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var rect = btn.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = 'translate(' + (x * 0.15).toFixed(2) + 'px, ' + (y * 0.15).toFixed(2) + 'px)';
      });

      btn.addEventListener('mouseleave', function () {
        btn.style.transform = '';
      });
    });
  }


  /* ----------------------------------------------------------
     11. Smooth Scroll for Anchor Links
     ---------------------------------------------------------- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var target = document.querySelector(link.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }


  /* ----------------------------------------------------------
     12. Text Reveal Animation
     ---------------------------------------------------------- */
  function initTextReveal() {
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    var heroTitle = document.querySelector('.hero h1');
    if (!heroTitle) return;

    heroTitle.style.opacity = '1';
  }


  /* ----------------------------------------------------------
     13. Case Study Rendering
     ---------------------------------------------------------- */
  var caseStudies = [
    {
      id: 1,
      title: 'FAST-Infra Label Launch',
      clientType: 'Sustainable Infrastructure',
      location: 'New York City',
      guestCount: '80+',
      duration: 'Full Day',
      goal: 'FAST-Infra Label needed to host a high-profile industry gathering bringing together global leaders in sustainable infrastructure investment. The event required a professional setting that would facilitate panel discussions, networking, and meaningful dialogue among senior executives and policymakers.',
      approach: 'We organized a full-day conference at a premier corporate venue in Midtown Manhattan with panoramic city views. The programming included keynote presentations, moderated panel discussions, and structured networking breaks. Every detail was considered: from branded podium signage and audience seating arrangements to catering that kept the energy high throughout the day. The flow moved naturally between formal presentations and informal connection.',
      outcomes: [
        'Industry leaders from across the sustainable finance sector convened for substantive dialogue on infrastructure investment standards.',
        'Multiple panel sessions ran seamlessly with professional AV, moderation, and audience engagement throughout the day.',
        'Attendees praised the organization, professionalism, and creative execution that made the gathering a success.'
      ],
      heroImage: 'assets/events/fast-infra/hero.jpg',
      cardImage: 'assets/events/fast-infra/panel-3.jpg',
      images: [
        'assets/events/fast-infra/hero.jpg',
        'assets/events/fast-infra/speaker.jpg',
        'assets/events/fast-infra/panel-1.jpg',
        'assets/events/fast-infra/panel-2.jpg',
        'assets/events/fast-infra/panel-3.jpg',
        'assets/events/fast-infra/networking-1.jpg',
        'assets/events/fast-infra/networking-2.jpg',
        'assets/events/fast-infra/attendee.jpg',
        'assets/events/fast-infra/detail.jpg'
      ],
      testimonial: {
        quote: 'Well organized with highest level of professionalism and creativity, making our gathering a success.',
        name: 'Hilda Liswani',
        title: 'Global Relationship Manager, FAST-Infra Label'
      }
    },
    {
      id: 2,
      title: 'Highlight Cocktail Reception',
      clientType: 'Creative & Media',
      location: 'New York City',
      guestCount: '100+',
      duration: 'Evening',
      goal: 'Highlight, a creative platform, wanted to host an elegant cocktail reception that would bring together founders, creatives, and industry leaders in an atmosphere that felt warm, curated, and genuinely social rather than transactional.',
      approach: 'We produced an evening reception at a stylish NYC rooftop venue with greenery, ambient lighting, and thoughtful details throughout. The experience included curated cocktails, custom branded touches like printed napkins, and a vintage typewriter station for guest notes. Name tags encouraged organic introductions, and the space was designed to flow naturally between intimate conversation areas and open social zones.',
      outcomes: [
        'Guests connected meaningfully in a warm, inviting atmosphere designed to encourage genuine conversation.',
        'The curated details and creative touches earned praise for bringing a unique flair that elevated the evening beyond a typical networking event.',
        'Meticulous organizational skills ensured flawless execution from arrival to farewell.'
      ],
      heroImage: 'assets/events/highlight/hero.jpg',
      cardImage: 'assets/events/highlight/networking-1.jpg',
      images: [
        'assets/events/highlight/hero.jpg',
        'assets/events/highlight/networking-1.jpg',
        'assets/events/highlight/portrait.jpg',
        'assets/events/highlight/cocktails.jpg',
        'assets/events/highlight/typewriter.jpg',
        'assets/events/highlight/guests.jpg',
        'assets/events/highlight/networking-2.jpg',
        'assets/events/highlight/atmosphere.jpg',
        'assets/events/highlight/detail.jpg'
      ],
      testimonial: {
        quote: 'Meticulous organizational skills ensured flawless execution; creative flair brought unique touch.',
        name: 'Ola Parks & Tim Carter',
        title: 'Co-Founders, Highlight'
      }
    }
  ];

  function initCaseStudy() {
    var container = document.getElementById('case-study-content');
    if (!container) return;

    var params = new URLSearchParams(window.location.search);
    var id = parseInt(params.get('id'), 10);
    var study = caseStudies.find(function (s) { return s.id === id; });

    if (!study) {
      container.innerHTML =
        '<section class="page-hero">' +
        '<div class="page-hero__ring page-hero__ring--1" aria-hidden="true"></div>' +
        '<div class="page-hero__ring page-hero__ring--2" aria-hidden="true"></div>' +
        '<div class="page-hero__vignette" aria-hidden="true"></div>' +
        '<div class="container">' +
        '<p class="subhead">Case Study</p><h1>Study not found.</h1>' +
        '<p class="lead mt-md"><a href="work.html" class="btn btn-secondary mt-md">Return to Selected Work</a></p>' +
        '</div></section>';
      return;
    }

    document.title = study.title + ' | Fortuna Events';

    var imagesHTML = study.images.map(function (src) {
      return '<img src="' + src + '" alt="' + study.title + '" class="cs-gallery__img" loading="lazy">';
    }).join('');

    var outcomesHTML = study.outcomes.map(function (o) {
      return '<li>' + o + '</li>';
    }).join('');

    var testimonialHTML = '';
    if (study.testimonial) {
      testimonialHTML =
        '<section class="cs-section section--surface"><div class="container container--narrow reveal">' +
        '<div class="cs-testimonial">' +
        '<div class="cs-testimonial__mark">&ldquo;</div>' +
        '<blockquote>' + study.testimonial.quote + '</blockquote>' +
        '<cite>' + study.testimonial.name + '<span>' + study.testimonial.title + '</span></cite>' +
        '</div></div></section>';
    }

    container.innerHTML =
      '<section class="page-hero">' +
      '<div class="page-hero__ring page-hero__ring--1" aria-hidden="true"></div>' +
      '<div class="page-hero__ring page-hero__ring--2" aria-hidden="true"></div>' +
      '<div class="page-hero__vignette" aria-hidden="true"></div>' +
      '<div class="container">' +
      '<a href="work.html" class="page-hero__back"><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polyline points="15 18 9 12 15 6"/></svg> Back to Work</a>' +
      '<p class="subhead">Case Study</p>' +
      '<h1>' + study.title + '</h1>' +
      '<div class="cs-meta">' +
      '<div class="cs-meta__item"><span class="cs-meta__label">Client Type</span>' + study.clientType + '</div>' +
      '<div class="cs-meta__item"><span class="cs-meta__label">Location</span>' + study.location + '</div>' +
      '<div class="cs-meta__item"><span class="cs-meta__label">Guests</span>' + study.guestCount + '</div>' +
      '<div class="cs-meta__item"><span class="cs-meta__label">Duration</span>' + study.duration + '</div>' +
      '</div></div></section>' +
      '<hr class="gold-divider container">' +
      '<section class="section--sm"><div class="container reveal">' +
      '<img src="' + study.heroImage + '" alt="' + study.title + '" class="cs-hero-img">' +
      '</div></section>' +
      '<section class="cs-section"><div class="container container--narrow reveal">' +
      '<h2>Context</h2><p class="text-muted">' + study.goal + '</p>' +
      '</div></section>' +
      '<section class="cs-section section--surface"><div class="container container--narrow reveal">' +
      '<h2>Experience Architecture</h2><p class="text-muted">' + study.approach + '</p>' +
      '</div></section>' +
      '<section class="cs-section"><div class="container container--narrow reveal">' +
      '<h2>Outcomes</h2><ul class="cs-outcomes">' + outcomesHTML + '</ul>' +
      '</div></section>' +
      testimonialHTML +
      '<section class="cs-section"><div class="container reveal">' +
      '<p class="subhead mb-md">Gallery</p><div class="cs-gallery">' + imagesHTML + '</div>' +
      '</div></section>' +
      '<section class="section"><div class="container"><div class="cta-block reveal-scale">' +
      '<p class="subhead mb-sm">Your Event</p>' +
      '<h2>Ready to create something <span class="text-accent text-accent-shimmer">meaningful</span>?</h2>' +
      '<p>Every engagement begins with a conversation.</p>' +
      '<div class="cta-block__actions">' +
      '<a href="contact.html" class="btn btn-primary"><span>Get in Touch</span> <span class="btn-arrow">&rarr;</span></a>' +
      '<a href="work.html" class="btn btn-secondary"><span>View All Work</span></a>' +
      '</div></div></div></section>';

    initScrollReveal();
  }


  /* ----------------------------------------------------------
     14. Contact Form
     ---------------------------------------------------------- */
  function initContactForm() {
    var form = document.getElementById('contact-form');
    var success = document.getElementById('form-success');
    if (!form || !success) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      form.querySelectorAll('.form-group').forEach(function (g) {
        g.classList.remove('has-error');
      });

      var valid = true;
      var fields = [
        { id: 'name', test: function (v) { return v.trim().length > 0; } },
        { id: 'company', test: function (v) { return v.trim().length > 0; } },
        { id: 'email', test: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); } },
        { id: 'engagement-type', test: function (v) { return v.length > 0; } }
      ];

      fields.forEach(function (f) {
        var el = document.getElementById(f.id);
        if (el && !f.test(el.value)) {
          el.closest('.form-group').classList.add('has-error');
          valid = false;
        }
      });

      if (!valid) {
        var first = form.querySelector('.has-error input, .has-error select');
        if (first) first.focus();
        return;
      }

      var data = {};
      form.querySelectorAll('input, select, textarea').forEach(function (el) {
        if (el.name) data[el.name] = el.value;
      });

      console.log('Fortuna Events Inquiry:', data);
      form.style.display = 'none';
      success.classList.add('is-visible');
      success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    form.querySelectorAll('input, select, textarea').forEach(function (el) {
      el.addEventListener('input', function () { el.closest('.form-group').classList.remove('has-error'); });
      el.addEventListener('change', function () { el.closest('.form-group').classList.remove('has-error'); });
    });
  }


  /* ----------------------------------------------------------
     15. Services Nav Scroll Tracking
     ---------------------------------------------------------- */
  function initServicesNav() {
    var nav = document.querySelector('.services-nav');
    if (!nav) return;

    var links = nav.querySelectorAll('.services-nav__item');
    var sections = [];

    links.forEach(function (link) {
      var href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        var section = document.getElementById(href.substring(1));
        if (section) sections.push({ el: section, link: link });
      }
    });

    if (!sections.length) return;

    var ticking = false;

    function update() {
      var scrollY = window.pageYOffset;
      var headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h'), 10) || 72;
      var offset = headerH + 80;

      var current = null;

      for (var i = sections.length - 1; i >= 0; i--) {
        if (sections[i].el.getBoundingClientRect().top <= offset) {
          current = sections[i];
          break;
        }
      }

      links.forEach(function (l) { l.classList.remove('is-active'); });
      if (current) {
        current.link.classList.add('is-active');
      } else if (sections.length) {
        sections[0].link.classList.add('is-active');
      }
    }

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(function () { update(); ticking = false; });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    update();

    // Smooth scroll on click
    links.forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var href = link.getAttribute('href');
        var target = document.querySelector(href);
        if (target) {
          var headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h'), 10) || 72;
          var navH = nav.offsetHeight;
          var y = target.getBoundingClientRect().top + window.pageYOffset - headerH - navH - 16;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      });
    });
  }


  /* ----------------------------------------------------------
     16. Contact Form Step Tracking
     ---------------------------------------------------------- */
  function initContactSteps() {
    var steps = document.querySelectorAll('.contact-form__step');
    if (!steps.length) return;

    var aboutFields = ['name', 'company', 'role', 'email'];
    var eventFields = ['engagement-type'];
    var detailFields = ['date', 'location', 'guests', 'budget', 'notes'];

    function checkStep(fieldIds) {
      return fieldIds.some(function (id) {
        var el = document.getElementById(id);
        return el && el.value && el.value.trim().length > 0;
      });
    }

    function updateSteps() {
      var step1Active = true;
      var step2Active = checkStep(aboutFields);
      var step3Active = checkStep(eventFields);

      steps.forEach(function (s) { s.classList.remove('is-active'); });

      if (step3Active) {
        steps.forEach(function (s) { s.classList.add('is-active'); });
      } else if (step2Active) {
        if (steps[0]) steps[0].classList.add('is-active');
        if (steps[1]) steps[1].classList.add('is-active');
      } else {
        if (steps[0]) steps[0].classList.add('is-active');
      }
    }

    document.querySelectorAll('#contact-form input, #contact-form select, #contact-form textarea').forEach(function (el) {
      el.addEventListener('input', updateSteps);
      el.addEventListener('change', updateSteps);
    });
  }


  /* ----------------------------------------------------------
     17. Luxury Loading Animation
     ---------------------------------------------------------- */
  function initPageLoad() {
    document.body.classList.add('is-loaded');

    // Animate page-hero content on sub-pages
    var pageHero = document.querySelector('.page-hero');
    if (pageHero) {
      var children = pageHero.querySelectorAll('.container > *');
      children.forEach(function (child, i) {
        child.style.opacity = '0';
        child.style.transform = 'translateY(20px)';
        child.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        child.style.transitionDelay = (0.15 + i * 0.12) + 's';
        requestAnimationFrame(function () {
          child.style.opacity = '1';
          child.style.transform = 'translateY(0)';
        });
      });
    }
  }


  /* ----------------------------------------------------------
     18. Init
     ---------------------------------------------------------- */
  function init() {
    initMobileNav();
    initActiveNav();
    initScrollReveal();
    initCounters();
    initHeaderScroll();
    initTimeline();
    initHeroGlow();
    initSectionParallax();
    initCardTilt();
    initMagneticButtons();
    initSmoothScroll();
    initTextReveal();
    initCaseStudy();
    initContactForm();
    initServicesNav();
    initContactSteps();

    // Delay page load class for smooth entrance
    setTimeout(initPageLoad, 100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
