/**
 * carousel.js — Reusable carousel component
 * Auto-initializes all elements with [data-carousel]
 */
(function () {
  'use strict';

  class Carousel {
    constructor(element) {
      this.el = element;
      this.track = element.querySelector('.carousel-track');
      this.slides = element.querySelectorAll('.carousel-slide');
      this.prevBtn = element.querySelector('.carousel-btn.prev');
      this.nextBtn = element.querySelector('.carousel-btn.next');
      this.dotsContainer = element.querySelector('.carousel-dots');
      this.currentIndex = 0;
      this.total = this.slides.length;
      this.autoplayInterval = null;

      if (this.total <= 1) return;

      this.createDots();
      this.bindEvents();
      this.startAutoplay();
    }

    createDots() {
      for (let i = 0; i < this.total; i++) {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        dot.setAttribute('aria-label', `Ir a imagen ${i + 1}`);
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => this.goTo(i));
        this.dotsContainer.appendChild(dot);
      }
    }

    bindEvents() {
      this.prevBtn.addEventListener('click', () => this.prev());
      this.nextBtn.addEventListener('click', () => this.next());

      // Touch/swipe support
      let startX = 0;
      let deltaX = 0;

      this.track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        this.stopAutoplay();
      }, { passive: true });

      this.track.addEventListener('touchmove', (e) => {
        deltaX = e.touches[0].clientX - startX;
      }, { passive: true });

      this.track.addEventListener('touchend', () => {
        if (Math.abs(deltaX) > 50) {
          deltaX < 0 ? this.next() : this.prev();
        }
        deltaX = 0;
        this.startAutoplay();
      });

      // Pause autoplay on hover
      this.el.addEventListener('mouseenter', () => this.stopAutoplay());
      this.el.addEventListener('mouseleave', () => this.startAutoplay());
    }

    goTo(index) {
      this.currentIndex = ((index % this.total) + this.total) % this.total;
      this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
      this.updateDots();
    }

    prev() {
      this.goTo(this.currentIndex - 1);
    }

    next() {
      this.goTo(this.currentIndex + 1);
    }

    updateDots() {
      const dots = this.dotsContainer.querySelectorAll('.carousel-dot');
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === this.currentIndex);
      });
    }

    startAutoplay() {
      this.stopAutoplay();
      this.autoplayInterval = setInterval(() => this.next(), 5000);
    }

    stopAutoplay() {
      if (this.autoplayInterval) {
        clearInterval(this.autoplayInterval);
        this.autoplayInterval = null;
      }
    }
  }

  // Auto-initialize carousels
  document.querySelectorAll('[data-carousel]').forEach(el => new Carousel(el));
})();
