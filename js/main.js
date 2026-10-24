// ============================================================
// Soft Interior Studio — Main JS
// ============================================================

(function () {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const header = $('#siteHeader');
  const onScroll = () => {
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const navToggle = $('#navToggle');
  const mainNav = $('#mainNav');
  navToggle.addEventListener('click', () => {
    const open = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open);
    navToggle.classList.toggle('active', open);
  });
  $$('#mainNav a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const headerH = header.offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH - 8;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  const revealEls = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  const counters = $$('.stat-num');
  const animateCounter = (el) => {
    const target = +el.dataset.target;
    const duration = 1600;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    };
    requestAnimationFrame(step);
  };
  if ('IntersectionObserver' in window) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          cio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => cio.observe(c));
  } else {
    counters.forEach(c => { c.textContent = c.dataset.target; });
  }

  const filterBtns = $$('.filter-btn');
  const items = $$('.portfolio-item');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      items.forEach(item => {
        const cat = item.dataset.category;
        const show = filter === 'all' || cat === filter;
        item.style.transition = 'opacity 0.35s, transform 0.35s';
        if (show) {
          item.style.display = '';
          requestAnimationFrame(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          });
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.96)';
          setTimeout(() => { if (filter !== 'all' && item.dataset.category !== filter) item.style.display = 'none'; }, 350);
        }
      });
    });
  });
  const lightbox = $('#lightbox');
  const lightboxContent = $('#lightboxContent');
  const lightboxClose = $('#lightboxClose');

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  items.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('.portfolio-img');
      const bg = img ? getComputedStyle(img).backgroundImage : '';
      lightboxContent.innerHTML = '';
      const div = document.createElement('div');
      div.className = 'portfolio-img';
      div.style.backgroundImage = bg;
      lightboxContent.appendChild(div);
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  const form = $('#contactForm');
  const status = $('#formStatus');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = $('#name').value.trim();
      const email = $('#email').value.trim();
      const message = $('#message').value.trim();

      if (!name || !email || !message) {
        status.textContent = 'Please fill in all required fields.';
        status.className = 'form-status error';
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        status.textContent = 'Please enter a valid email address.';
        status.className = 'form-status error';
        return;
      }

      const btn = form.querySelector('button[type="submit"]');
      const original = btn.textContent;
      btn.textContent = 'Sending...';
      btn.disabled = true;

      setTimeout(() => {
        status.textContent = "Thanks! Your message has been sent. We'll be in touch soon.";
        status.className = 'form-status success';
        form.reset();
        btn.textContent = original;
        btn.disabled = false;
      }, 1200);
    });
  }

  const nl = $('#newsletterForm');
  if (nl) {
    nl.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = nl.querySelector('input');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) {
        alert('Please enter a valid email.');
        return;
      }
      input.value = '';
      alert('Subscribed! Thank you.');
    });
  }

  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();

