/**
 * intro.js — Animación mejorada de sobre lacrado interactivo
 * Secuencia: Tocar -> Zoom -> Despegue de lacre -> Apertura 3D completa de solapa -> Salida vertical de carta -> Expansión centrada y texto en cascada
 */
(function () {
  'use strict';

  const overlay = document.getElementById('intro-overlay');
  if (!overlay) return;

  const scene = document.getElementById('envelope-scene');
  const introHint = document.getElementById('intro-hint');
  const btnConfirm = document.getElementById('btn-intro-confirm');
  const btnSkip = document.getElementById('btn-intro-skip');

  let isOpening = false;
  let isOpened = false;

  // Bloquear scroll mientras el intro está activo
  document.body.classList.add('intro-active');

  function openEnvelope() {
    if (isOpening || isOpened) return;
    isOpening = true;

    // 1. Ocultar indicador inferior
    if (introHint) {
      introHint.classList.add('hide');
    }

    // 2. Zoom suave hacia el sobre y sello
    overlay.classList.add('step-zoom');

    // 3. Romper y despegar el sello de lacre
    setTimeout(() => {
      overlay.classList.add('step-seal-break');
    }, 350);

    // 4. Abrir la solapa superior en 3D (dura 700ms)
    setTimeout(() => {
      overlay.classList.add('step-flap-open');
    }, 650);

    // 5. SOLO cuando la solapa está 100% abierta (650 + 750 = 1400ms), la carta empieza a salir
    setTimeout(() => {
      overlay.classList.add('step-card-slide-out');
    }, 1450);

    // 6. Centrar y expandir la carta en pantalla completa sin filtros
    setTimeout(() => {
      overlay.classList.add('step-card-expand');
      isOpened = true;
    }, 2150);
  }

  // Interacción al tocar la escena
  if (scene) {
    scene.addEventListener('click', (e) => {
      if (!isOpened && !isOpening) {
        openEnvelope();
      }
    });
  }

  // Botón Confirmar Asistencia
  if (btnConfirm) {
    btnConfirm.addEventListener('click', (e) => {
      e.stopPropagation();
      closeIntroAndNavigate('#vienes');
    });
  }

  // Botón Ver detalles
  if (btnSkip) {
    btnSkip.addEventListener('click', (e) => {
      e.stopPropagation();
      closeIntroAndNavigate('#hero');
    });
  }

  function closeIntroAndNavigate(targetHash) {
    overlay.classList.add('step-fade-out');

    setTimeout(() => {
      overlay.style.display = 'none';
      document.body.classList.remove('intro-active');

      if (targetHash) {
        const targetElement = document.querySelector(targetHash);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }, 600);
  }
})();
