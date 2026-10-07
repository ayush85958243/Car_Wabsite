/* ============================================================
   APEX RACING — script.js
   Premium motorsport interactions
============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     1. NAVBAR SCROLL EFFECT
  ---------------------------------------------------------- */
  const navbar = document.getElementById('apexNav');

  function handleNavbarScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();

  /* ----------------------------------------------------------
     2. SMOOTH SCROLL FOR ANCHOR LINKS
  ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = navbar.offsetHeight;
        const targetPos = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });

        // Close mobile menu if open
        const navCollapse = document.getElementById('apexNavMenu');
        if (navCollapse.classList.contains('show')) {
          const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
          if (bsCollapse) bsCollapse.hide();
        }
      }
    });
  });

  /* ----------------------------------------------------------
     3. SCROLL REVEAL ANIMATIONS
  ---------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(function (entries, observer) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(function (el) {
    revealObserver.observe(el);
  });

  /* ----------------------------------------------------------
     4. ANIMATED STAT COUNTERS
  ---------------------------------------------------------- */
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsAnimated = false;

  function animateCounters() {
    statNumbers.forEach(function (counter) {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      const duration = 2000;
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = Math.floor(eased * target);

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target;
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  const statsSection = document.querySelector('.stats-strip');

  const statsObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && !statsAnimated) {
        statsAnimated = true;
        animateCounters();
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  if (statsSection) {
    statsObserver.observe(statsSection);
  }

  /* ----------------------------------------------------------
     5. GALLERY MODAL
  ---------------------------------------------------------- */
  const galleryModal = document.getElementById('galleryModal');
  if (galleryModal) {
    galleryModal.addEventListener('show.bs.modal', function (event) {
      const trigger = event.relatedTarget;
      if (!trigger) return;

      const imgSrc = trigger.getAttribute('data-img');
      const caption = trigger.getAttribute('data-caption');

      document.getElementById('modalGalleryImg').src = imgSrc;
      document.getElementById('modalGalleryImg').alt = caption || 'Gallery image';
      document.getElementById('modalGalleryCaption').textContent = caption || '';
    });
  }

  /* ----------------------------------------------------------
     6. NEWSLETTER FORM VALIDATION
  ---------------------------------------------------------- */
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterEmail = document.getElementById('newsletterEmail');
  const newsletterFeedback = document.getElementById('newsletterFeedback');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const email = newsletterEmail.value.trim();

      if (!email) {
        newsletterFeedback.textContent = 'Please enter your email address.';
        newsletterFeedback.className = 'form-feedback error';
        return;
      }

      if (!emailRegex.test(email)) {
        newsletterFeedback.textContent = 'Please enter a valid email address.';
        newsletterFeedback.className = 'form-feedback error';
        return;
      }

      newsletterFeedback.textContent = 'Thank you for subscribing! Welcome to the grid.';
      newsletterFeedback.className = 'form-feedback success';
      newsletterEmail.value = '';

      setTimeout(function () {
        newsletterFeedback.textContent = '';
      }, 5000);
    });
  }

  /* ----------------------------------------------------------
     7. CONTACT FORM VALIDATION
  ---------------------------------------------------------- */
  const contactForm = document.getElementById('contactForm');
  const contactFeedback = document.getElementById('contactFeedback');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = document.getElementById('contactName').value.trim();
      const email = document.getElementById('contactEmail').value.trim();
      const subject = document.getElementById('contactSubject').value.trim();
      const message = document.getElementById('contactMessage').value.trim();

      if (!name || !email || !subject || !message) {
        contactFeedback.textContent = 'Please fill in all fields.';
        contactFeedback.className = 'form-feedback error';
        return;
      }

      if (!emailRegex.test(email)) {
        contactFeedback.textContent = 'Please enter a valid email address.';
        contactFeedback.className = 'form-feedback error';
        return;
      }

      contactFeedback.textContent = 'Message sent successfully! We will get back to you soon.';
      contactFeedback.className = 'form-feedback success';
      contactForm.reset();

      setTimeout(function () {
        contactFeedback.textContent = '';
      }, 5000);
    });
  }

  /* ----------------------------------------------------------
     8. ACTIVE NAV LINK ON SCROLL
  ---------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.apex-navbar .nav-link');

  function updateActiveNav() {
    let current = '';
    const scrollPos = window.scrollY + navbar.offsetHeight + 100;

    sections.forEach(function (section) {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  /* ----------------------------------------------------------
     9. PARALLAX SUBTLE EFFECT ON HERO (performance-friendly)
  ---------------------------------------------------------- */
  const heroImg = document.querySelector('.hero-img');
  let ticking = false;

  function handleParallax() {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        if (heroImg && window.scrollY < window.innerHeight) {
          const offset = window.scrollY * 0.15;
          heroImg.style.transform = 'scale(1.08) translateY(' + offset + 'px)';
        }
        ticking = false;
      });
      ticking = true;
    }
  }

  // Only apply parallax on larger screens
  if (window.matchMedia('(min-width: 1024px)').matches) {
    window.addEventListener('scroll', handleParallax, { passive: true });
  }

  /* ----------------------------------------------------------
     10. TESTIMONIAL CAROUSEL — pause on hover
  ---------------------------------------------------------- */
  const testimonialCarousel = document.getElementById('testimonialCarousel');
  if (testimonialCarousel) {
    testimonialCarousel.addEventListener('mouseenter', function () {
      bootstrap.Carousel.getInstance(testimonialCarousel).pause();
    });
    testimonialCarousel.addEventListener('mouseleave', function () {
      bootstrap.Carousel.getInstance(testimonialCarousel).cycle();
    });
  }

  /* ----------------------------------------------------------
     11. LAZY LOAD FALLBACK (for older browsers)
  ---------------------------------------------------------- */
  if ('loading' in HTMLImageElement.prototype) {
    // Native lazy loading supported — nothing to do
  } else {
    // Fallback: load images when they enter viewport
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    const lazyObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          lazyObserver.unobserve(img);
        }
      });
    });
    lazyImages.forEach(function (img) { lazyObserver.observe(img); });
  }

})();