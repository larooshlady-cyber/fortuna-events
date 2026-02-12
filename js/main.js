/* ============================================================
   FORTUNA EVENTS - Main JavaScript
   Navigation, scroll reveal, counters, timeline,
   case study rendering, form validation,
   interactive enhancements
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
      nav.classList.toggle('is-open');
      document.body.style.overflow = !isOpen ? 'hidden' : '';
    });

    nav.querySelectorAll('.site-header__links a').forEach(function (link) {
      link.addEventListener('click', function () {
        toggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        toggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('is-open');
        document.body.style.overflow = '';
        toggle.focus();
      }
    });
  }


  /* ----------------------------------------------------------
     2. Scroll Reveal
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
    }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });

    elements.forEach(function (el) { observer.observe(el); });
  }


  /* ----------------------------------------------------------
     3. Animated Counters
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

    function easeOut(t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); }

    function animate(el) {
      var target = parseInt(el.getAttribute('data-target'), 10);
      var suffix = el.getAttribute('data-suffix') || '';
      var start = null;

      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / 2000, 1);
        el.textContent = Math.floor(easeOut(p) * target) + suffix;
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
      if (scrollY > 40 && !shrunk) {
        header.classList.add('is-scrolled');
        shrunk = true;
      } else if (scrollY <= 40 && shrunk) {
        header.classList.remove('is-scrolled');
        shrunk = false;
      }

      // Scroll progress bar
      if (progressBar) {
        var docHeight = document.documentElement.scrollHeight - window.innerHeight;
        var progress = docHeight > 0 ? scrollY / docHeight : 0;
        progressBar.style.transform = 'scaleX(' + Math.min(progress, 1) + ')';
      }
    }

    window.addEventListener('scroll', check, { passive: true });
    check();
  }


  /* ----------------------------------------------------------
     5. Timeline
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

    items.forEach(function (item, i) { item.style.transitionDelay = (i * 0.1) + 's'; });

    var ticking = false;

    function update() {
      var rect = timeline.getBoundingClientRect();
      var vh = window.innerHeight;
      var p = Math.min(Math.max((vh * 0.65 - rect.top) / rect.height, 0), 1);

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
     7. Hero Cursor Glow
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
      currentX = lerp(currentX, targetX, 0.08);
      currentY = lerp(currentY, targetY, 0.08);
      glow.style.left = currentX + 'px';
      glow.style.top = currentY + 'px';

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
        var shift = offset * -12;
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
     9. Card Tilt (subtle, desktop only)
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
        card.style.transform = 'translateY(-8px) perspective(800px) rotateY(' + (x * 3).toFixed(2) + 'deg) rotateX(' + (-y * 3).toFixed(2) + 'deg)';
      });

      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    });
  }


  /* ----------------------------------------------------------
     10. Smooth Scroll for Anchor Links
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
     11. Case Study Rendering
     ---------------------------------------------------------- */
  var caseStudies = [
    {
      id: 1,
      title: 'Fintech Leadership Offsite',
      clientType: 'Financial Technology',
      location: 'Hudson Valley, New York',
      guestCount: '42',
      duration: '3 Days, 2 Nights',
      goal: 'A rapidly scaling fintech company needed to align its expanded leadership team around a unified product strategy. The team had tripled in 18 months, and decision-making had become fragmented across departments.',
      approach: 'We designed a three-day offsite at a private estate in the Hudson Valley. The first day focused on individual reflection and relationship building. The second day was structured around facilitated strategy workshops that surfaced competing priorities and built consensus. The final morning was dedicated to commitment and accountability mapping. Every meal, every transition, and every break was designed to support the larger arc of alignment.',
      outcomes: [
        'Unified product roadmap agreed upon by all department leads within the retreat itself.',
        'Cross-functional working groups formed organically, reducing post-retreat decision latency by establishing direct relationships.',
        'Executive team reported sustained alignment in strategic reviews conducted three months after the offsite.'
      ],
      images: ['work-1.jpg', 'work-2.jpg', 'work-3.jpg']
    },
    {
      id: 2,
      title: 'Private Equity Retreat',
      clientType: 'Private Equity',
      location: 'Miami, Florida',
      guestCount: '28',
      duration: '2 Days, 1 Night',
      goal: 'A mid-market private equity firm sought to strengthen partner relationships and articulate a clearer investment thesis as the firm prepared for its next fund raise.',
      approach: 'We curated a two-day retreat at a private waterfront property in Miami. The experience balanced structured working sessions with carefully designed social moments. A custom dinner on the first evening featured curated conversation pairings. The second day included a facilitated thesis workshop and a closing commitment circle.',
      outcomes: [
        'Refined investment thesis articulated and agreed upon, forming the foundation of the firm\'s next fundraise narrative.',
        'Partners identified two new sector verticals based on insights that surfaced during open dialogue sessions.',
        'Internal survey showed a measurable increase in partner trust and communication satisfaction following the retreat.'
      ],
      images: ['work-2.jpg', 'work-4.jpg', 'work-6.jpg']
    },
    {
      id: 3,
      title: 'Founder Dinner Series',
      clientType: 'Venture-Backed Founders',
      location: 'New York City',
      guestCount: '16',
      duration: 'Evening (3-Part Series)',
      goal: 'A venture capital firm wanted to create a recurring, intimate gathering for portfolio founders that would foster genuine peer connection and candid exchange.',
      approach: 'We designed a three-part dinner series at a private dining room in Manhattan. Each dinner seated 16 founders with strategic seating architecture based on stage, sector, and personality. A conversation facilitator guided the table through structured prompts during the first course, then let organic dialogue carry the evening.',
      outcomes: [
        'Multiple founder-to-founder collaborations initiated, including two co-investment opportunities and one strategic partnership.',
        'Waitlist formed for subsequent series, with 90% of attendees requesting invitations to future dinners.',
        'The firm reported deeper portfolio engagement and stronger founder loyalty as a direct result of the series.'
      ],
      images: ['work-3.jpg', 'work-5.jpg', 'work-1.jpg']
    },
    {
      id: 4,
      title: 'Healthcare Leadership Summit',
      clientType: 'Healthcare System',
      location: 'Chicago, Illinois',
      guestCount: '60',
      duration: '2 Days',
      goal: 'A regional healthcare system needed to unite clinical and operational leadership around a patient-centered strategic plan.',
      approach: 'We produced a two-day summit at a downtown Chicago venue, designed to feel unlike a medical conference. The space was warm, the pacing was unhurried, and the programming alternated between cross-functional workshops and reflective pauses.',
      outcomes: [
        'Twelve cross-functional initiatives launched within 60 days of the summit.',
        'Participant feedback scored the summit as the most productive leadership gathering in the system\'s history.',
        'The patient-centered framework developed during the summit became the guiding structure for the system\'s three-year strategic plan.'
      ],
      images: ['work-4.jpg', 'work-6.jpg', 'work-2.jpg']
    },
    {
      id: 5,
      title: 'Creative Agency Retreat',
      clientType: 'Creative Agency',
      location: 'Santa Barbara, California',
      guestCount: '35',
      duration: '3 Days, 2 Nights',
      goal: 'A growing creative agency had expanded rapidly and lost touch with its founding vision. The leadership team needed to reconnect the broader team with the creative principles that made the agency distinctive.',
      approach: 'We designed a three-day retreat at a coastal property in Santa Barbara. The first day focused on storytelling. The second day combined creative workshops with honest operational discussions. The final morning was dedicated to vision mapping.',
      outcomes: [
        'The agency\'s founding creative principles were articulated in a shared document that became the basis for hiring and creative review.',
        'Operational pain points were addressed openly, resulting in three structural changes implemented within 30 days.',
        'Team retention improved in the two quarters following the retreat.'
      ],
      images: ['work-5.jpg', 'work-3.jpg', 'work-1.jpg']
    },
    {
      id: 6,
      title: 'Year-End Corporate Celebration',
      clientType: 'Professional Services Firm',
      location: 'New York City',
      guestCount: '180',
      duration: 'Evening',
      goal: 'A professional services firm marking its tenth anniversary wanted an evening that honored the people who built it, without feeling like a typical corporate party.',
      approach: 'We produced a single-evening celebration at a gallery space in Chelsea. The design concept centered on "a decade in rooms," with each section of the venue reflecting a chapter of the firm\'s history through subtle environmental cues.',
      outcomes: [
        'The event received the highest satisfaction scores of any internal gathering in the firm\'s history.',
        'The memory book became a valued artifact, with team members referencing it in internal communications months later.',
        'The celebration set a new standard for the firm\'s internal culture.'
      ],
      images: ['work-6.jpg', 'work-4.jpg', 'work-2.jpg']
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

    var imagesHTML = study.images.map(function () {
      return '<div class="img-placeholder"></div>';
    }).join('');

    var outcomesHTML = study.outcomes.map(function (o) {
      return '<li>' + o + '</li>';
    }).join('');

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
      '<div class="img-placeholder" style="aspect-ratio: 21/9;"></div>' +
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
      '<section class="cs-section"><div class="container reveal">' +
      '<p class="subhead mb-md">Gallery</p><div class="cs-gallery">' + imagesHTML + '</div>' +
      '</div></section>' +
      '<section class="section"><div class="container"><div class="cta-block reveal-scale">' +
      '<p class="subhead mb-sm">Your Event</p>' +
      '<h2>Ready to create something <span class="text-accent text-accent-shimmer">meaningful</span>?</h2>' +
      '<p>Every engagement begins with a conversation.</p>' +
      '<div class="cta-block__actions">' +
      '<a href="contact.html" class="btn btn-primary">Get in Touch <span class="btn-arrow">&rarr;</span></a>' +
      '<a href="work.html" class="btn btn-secondary">View All Work</a>' +
      '</div></div></div></section>';

    initScrollReveal();
  }


  /* ----------------------------------------------------------
     12. Contact Form
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
     13. Services Nav Scroll Tracking
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
     14. Contact Form Step Tracking
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
      var step1Active = true; // always active by default
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
     15. Init
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
    initSmoothScroll();
    initCaseStudy();
    initContactForm();
    initServicesNav();
    initContactSteps();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
