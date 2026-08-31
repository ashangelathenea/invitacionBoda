/**
 * main.js — Lógica principal de navegación, cuenta atrás en vivo, interacción bancaria y scroll
 */
(function () {
  'use strict';

  function initMain() {
    /* ---- Navbar hide/show on scroll ---- */
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;
    const SCROLL_THRESHOLD = 10;

    if (navbar) {
      window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        if (currentScroll <= 0) {
          navbar.classList.remove('hidden');
          return;
        }

        if (currentScroll - lastScroll > SCROLL_THRESHOLD) {
          navbar.classList.add('hidden');
          closeMobileMenu();
        } else if (lastScroll - currentScroll > SCROLL_THRESHOLD) {
          navbar.classList.remove('hidden');
        }

        lastScroll = currentScroll;
      }, { passive: true });
    }

    /* ---- Hamburger menu ---- */
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');

    function closeMobileMenu() {
      if (hamburger && mobileMenu) {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      }
    }

    if (hamburger && mobileMenu) {
      hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        mobileMenu.classList.toggle('open');
      });

      mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
      });
    }

    /* ---- Active link tracking ---- */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar-links a, .mobile-menu a');

    function updateActiveLink() {
      const scrollPos = window.scrollY + window.innerHeight / 3;

      sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');

        if (scrollPos >= top && scrollPos < top + height) {
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            }
          });
        }
      });
    }

    window.addEventListener('scroll', updateActiveLink, { passive: true });
    updateActiveLink();

    /* ---- Scroll reveal (IntersectionObserver) ---- */
    const revealElements = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              revealObserver.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.08,
          rootMargin: '0px 0px -20px 0px',
        }
      );
      revealElements.forEach(el => revealObserver.observe(el));
    } else {
      revealElements.forEach(el => el.classList.add('visible'));
    }

    /* ---- Smooth scroll for anchor links ---- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (!targetId || targetId === '#') return;
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    /* ---- CUENTA ATRÁS VIVA AL 14/07/2027 ---- */
    // Mes 6 = Julio (0-indexed en JavaScript: 0=Enero ... 6=Julio)
    const targetDate = new Date(2027, 6, 14, 12, 0, 0).getTime();

    function updateCountdown() {
      const now = Date.now();
      const difference = targetDate - now;

      if (isNaN(difference) || difference <= 0) {
        document.querySelectorAll('.countdown-timer').forEach(el => {
          el.innerHTML = '<div class="countdown-finished">¡Hoy es el gran día! 🎉</div>';
        });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      const dayEls = document.querySelectorAll('[data-countdown-days]');
      const hourEls = document.querySelectorAll('[data-countdown-hours]');
      const minEls = document.querySelectorAll('[data-countdown-minutes]');
      const secEls = document.querySelectorAll('[data-countdown-seconds]');

      dayEls.forEach(el => { el.textContent = String(days); });
      hourEls.forEach(el => { el.textContent = String(hours).padStart(2, '0'); });
      minEls.forEach(el => { el.textContent = String(minutes).padStart(2, '0'); });
      secEls.forEach(el => { el.textContent = String(seconds).padStart(2, '0'); });
    }

    // Actualizar inmediatamente y cada segundo
    updateCountdown();
    setInterval(updateCountdown, 1000);

    /* ---- NÚMERO DE CUENTA / BOTÓN "AQUÍ" ---- */
    const btnAccountToggle = document.getElementById('btn-account-toggle');
    const accountDetailsCard = document.getElementById('account-details-card');
    const btnCopyIban = document.getElementById('btn-copy-iban');
    const ibanText = document.getElementById('iban-text');
    const copyToast = document.getElementById('copy-toast');

    if (btnAccountToggle && accountDetailsCard) {
      btnAccountToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isExpanded = accountDetailsCard.classList.toggle('show');
        btnAccountToggle.classList.toggle('active', isExpanded);
        btnAccountToggle.setAttribute('aria-expanded', isExpanded);
      });
    }

    if (btnCopyIban && ibanText) {
      btnCopyIban.addEventListener('click', (e) => {
        e.preventDefault();
        const textToCopy = ibanText.textContent.replace(/\s+/g, '');
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(textToCopy).then(showCopiedState).catch(() => fallbackCopy(textToCopy));
        } else {
          fallbackCopy(textToCopy);
        }
      });
    }

    function showCopiedState() {
      if (!btnCopyIban) return;
      btnCopyIban.classList.add('copied');
      btnCopyIban.innerHTML = `
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        ¡Copiado!
      `;
      if (copyToast) {
        copyToast.classList.add('show');
        setTimeout(() => copyToast.classList.remove('show'), 2500);
      }
      setTimeout(() => {
        btnCopyIban.classList.remove('copied');
        btnCopyIban.innerHTML = `
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          Copiar IBAN
        `;
      }, 3000);
    }

    function fallbackCopy(text) {
      const tempInput = document.createElement('textarea');
      tempInput.value = text;
      document.body.appendChild(tempInput);
      tempInput.select();
      try {
        document.execCommand('copy');
        showCopiedState();
      } catch (err) {
        console.error('Fallback copy error:', err);
      }
      document.body.removeChild(tempInput);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMain);
  } else {
    initMain();
  }
})();
