/* ============================================================
   SUNAULO SANSAR PHOTOGRAPHY — script.js
   ============================================================ */

'use strict';

/* ── DOM Ready Helper ── */
const ready = (fn) => {
  if (document.readyState !== 'loading') fn();
  else document.addEventListener('DOMContentLoaded', fn);
};

ready(() => {

  /* ============================================================
     1. PRELOADER
     ============================================================ */
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.classList.add('hidden');
        document.body.style.overflow = '';
      }, 1600);
    });
    document.body.style.overflow = 'hidden';
  }

  /* ============================================================
     2. CUSTOM CURSOR
     ============================================================ */
  const cursor = document.querySelector('.cursor');
  const follower = document.querySelector('.cursor-follower');

  if (cursor && follower && window.matchMedia('(pointer: fine)').matches) {
    let fx = 0, fy = 0, cx = 0, cy = 0;

    document.addEventListener('mousemove', (e) => {
      cx = e.clientX;
      cy = e.clientY;
      cursor.style.left = cx + 'px';
      cursor.style.top  = cy + 'px';
    });

    // Smooth follower
    (function animFollower() {
      fx += (cx - fx) * 0.14;
      fy += (cy - fy) * 0.14;
      follower.style.left = fx + 'px';
      follower.style.top  = fy + 'px';
      requestAnimationFrame(animFollower);
    })();

    // Hover effect
    document.querySelectorAll('a, button, .gallery-item, .gallery-page-item, .service-card, .testimonial-card').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.width   = '16px';
        cursor.style.height  = '16px';
        follower.style.width  = '56px';
        follower.style.height = '56px';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.width   = '10px';
        cursor.style.height  = '10px';
        follower.style.width  = '36px';
        follower.style.height = '36px';
      });
    });
  }

  /* ============================================================
     3. NAVBAR — Scroll & Mobile Toggle
     ============================================================ */
  const navbar  = document.getElementById('navbar');
  const toggle  = document.querySelector('.nav-toggle');
  const drawer  = document.querySelector('.nav-drawer');

  if (navbar) {
    const handleScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  if (toggle && drawer) {
    toggle.addEventListener('click', () => {
      const open = toggle.classList.toggle('open');
      if (open) {
        drawer.style.display = 'flex';
        requestAnimationFrame(() => drawer.classList.add('open'));
      } else {
        drawer.classList.remove('open');
        setTimeout(() => { drawer.style.display = ''; }, 350);
      }
    });

    // Close drawer on link click
    drawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('open');
        drawer.classList.remove('open');
        setTimeout(() => { drawer.style.display = ''; }, 350);
      });
    });
  }

  // Active nav link highlighting
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-drawer a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ============================================================
     4. SCROLL REVEAL (Intersection Observer)
     ============================================================ */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    revealObserver.observe(el);
  });

  /* ============================================================
     5. ANIMATED COUNTERS
     ============================================================ */
  const counters = document.querySelectorAll('[data-count]');

  if (counters.length > 0) {
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el     = entry.target;
          const target = parseInt(el.dataset.count, 10);
          const suffix = el.dataset.suffix || '';
          const dur    = 2000;
          const start  = performance.now();

          const tick = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / dur, 1);
            const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            el.textContent = Math.floor(ease * target) + suffix;
            if (progress < 1) requestAnimationFrame(tick);
            else el.textContent = target + suffix;
          };

          requestAnimationFrame(tick);
          countObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => countObserver.observe(c));
  }

  /* ============================================================
     6. GALLERY FILTER
     ============================================================ */
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item[data-category], .gallery-page-item[data-category]');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      galleryItems.forEach(item => {
        const show = filter === 'all' || item.dataset.category === filter;
        item.style.transition = 'opacity 0.35s ease, transform 0.35s ease';

        if (show) {
          item.style.opacity   = '0';
          item.style.transform = 'scale(0.94)';
          item.style.display   = '';
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              item.style.opacity   = '1';
              item.style.transform = 'scale(1)';
            });
          });
        } else {
          item.style.opacity   = '0';
          item.style.transform = 'scale(0.94)';
          setTimeout(() => { item.style.display = 'none'; }, 350);
        }
      });
    });
  });

  /* ============================================================
     7. LIGHTBOX
     ============================================================ */
  const lightbox     = document.getElementById('lightbox');
  const lightboxImg  = document.getElementById('lightbox-img');
  const lightboxCap  = document.getElementById('lightbox-caption');
  const lbClose      = document.getElementById('lb-close');
  const lbPrev       = document.getElementById('lb-prev');
  const lbNext       = document.getElementById('lb-next');

  if (!lightbox) return;   // no lightbox on this page — bail early for this section

  const lbItems = () => [
    ...document.querySelectorAll('.gallery-item[data-src], .gallery-page-item[data-src]')
  ];

  let currentLbIndex = 0;

  function openLightbox(index) {
    const items = lbItems();
    if (!items.length) return;
    currentLbIndex = ((index % items.length) + items.length) % items.length;
    const item = items[currentLbIndex];
    lightboxImg.src = item.dataset.src || item.querySelector('img')?.src || '';
    lightboxCap.textContent = item.dataset.caption || item.querySelector('.gallery-caption')?.textContent || '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    lightboxImg.src = '';
  }

  // Open on item click
  document.addEventListener('click', (e) => {
    const item = e.target.closest('.gallery-item[data-src], .gallery-page-item[data-src], .gallery-zoom-btn');
    if (!item) return;
    const parent = item.closest('[data-src]') || item;
    const items  = lbItems();
    const idx    = items.indexOf(parent);
    openLightbox(idx >= 0 ? idx : 0);
  });

  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lbPrev)  lbPrev.addEventListener('click',  () => openLightbox(currentLbIndex - 1));
  if (lbNext)  lbNext.addEventListener('click',  () => openLightbox(currentLbIndex + 1));

  // Keyboard nav
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  openLightbox(currentLbIndex - 1);
    if (e.key === 'ArrowRight') openLightbox(currentLbIndex + 1);
  });

  // Click outside image to close
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  /* ============================================================
     8. FAQ ACCORDION
     ============================================================ */
  document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
      const item = question.closest('.faq-item');
      const wasOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));

      // Toggle current
      if (!wasOpen) item.classList.add('open');
    });
  });

  /* ============================================================
     9. CONTACT FORM
     ============================================================ */
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('.form-submit');
      btn.textContent = 'Sending…';
      btn.disabled = true;

      setTimeout(() => {
        contactForm.reset();
        btn.textContent = 'Send Message';
        btn.disabled = false;
        if (formSuccess) {
          formSuccess.classList.add('show');
          setTimeout(() => formSuccess.classList.remove('show'), 5000);
        }
      }, 1500);
    });
  }

  /* ============================================================
     10. BACK TO TOP
     ============================================================ */
  const btt = document.getElementById('back-to-top');
  if (btt) {
    window.addEventListener('scroll', () => {
      btt.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    btt.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ============================================================
     11. NEWSLETTER FORM
     ============================================================ */
  const newsletterForms = document.querySelectorAll('.newsletter-form');
  newsletterForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input');
      const btn   = form.querySelector('button');
      const orig  = btn.innerHTML;
      btn.innerHTML = '✓';
      btn.style.background = '#22c55e';
      input.value = '';
      setTimeout(() => {
        btn.innerHTML = orig;
        btn.style.background = '';
      }, 3000);
    });
  });

  /* ============================================================
     12. HERO PARALLAX (subtle)
     ============================================================ */
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      heroBg.style.transform = `scale(1.05) translateY(${y * 0.2}px)`;
    }, { passive: true });
  }

  /* ============================================================
     13. PRICING — highlight on hover
     ============================================================ */
  document.querySelectorAll('.pricing-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      document.querySelectorAll('.pricing-card').forEach(c => {
        if (c !== card) c.style.opacity = '0.6';
      });
    });
    card.addEventListener('mouseleave', () => {
      document.querySelectorAll('.pricing-card').forEach(c => {
        c.style.opacity = '';
      });
    });
  });

}); // end ready
