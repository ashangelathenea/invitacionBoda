/**
 * rsvp.js — Formulario de confirmación (RSVP)
 * Soporte para opción 'Vengo con alguien', botón '+ Añadir acompañante'
 * y filas con Nombre y apellidos, ¿Es familiar? (Sí/No) y ¿Es adulto? (Sí/No)
 */
(function () {
  'use strict';

  function initRSVP() {
    const form = document.getElementById('rsvp-form');
    const companionContainer = document.getElementById('companion-container');
    const companionRadios = document.querySelectorAll('input[name="acompanante"]');
    const btnAddCompanion = document.getElementById('btn-add-companion');
    const companionsList = document.getElementById('companions-list');
    const formSuccess = document.getElementById('form-success');

    if (!form || !companionContainer || !companionsList) return;

    let companionCount = 0;

    // Mostrar / ocultar sección al cambiar el radio
    companionRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        if (radio.value === 'si' && radio.checked) {
          companionContainer.style.display = 'block';
          companionContainer.classList.add('show');
        } else if (radio.value === 'no' && radio.checked) {
          companionContainer.style.display = 'none';
          companionContainer.classList.remove('show');
          companionsList.innerHTML = '';
          companionCount = 0;
        }
      });
    });

    // Añadir fila de acompañante al pulsar el botón
    if (btnAddCompanion) {
      btnAddCompanion.addEventListener('click', (e) => {
        e.preventDefault();
        addCompanionRow();
      });
    }

    function addCompanionRow() {
      companionCount++;
      const currentNum = companionsList.children.length + 1;
      const rowId = `companion-row-${Date.now()}-${companionCount}`;

      const item = document.createElement('div');
      item.className = 'companion-item';
      item.id = rowId;
      item.innerHTML = `
        <div class="companion-item-header">
          <span class="companion-num">Acompañante #${currentNum}</span>
          <button type="button" class="btn-remove-companion" aria-label="Eliminar acompañante" title="Eliminar">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
        
        <div class="companion-row-grid">
          <div class="form-group-field companion-name-col">
            <label for="${rowId}-name">Nombre y apellidos</label>
            <input type="text" id="${rowId}-name" class="form-input companion-name-input" placeholder="Nombre y apellidos" required>
          </div>
          
          <div class="form-group-field companion-select-col">
            <label for="${rowId}-familiar">¿Es familiar?</label>
            <select id="${rowId}-familiar" class="form-select companion-familiar-select">
              <option value="si">Sí</option>
              <option value="no" selected>No</option>
            </select>
          </div>

          <div class="form-group-field companion-select-col">
            <label for="${rowId}-adulto">¿Es adulto?</label>
            <select id="${rowId}-adulto" class="form-select companion-adult-select">
              <option value="si" selected>Sí</option>
              <option value="no">No</option>
            </select>
          </div>
        </div>
      `;

      // Eliminar fila
      const btnRemove = item.querySelector('.btn-remove-companion');
      if (btnRemove) {
        btnRemove.addEventListener('click', () => {
          item.remove();
          updateCompanionNumbers();
        });
      }

      companionsList.appendChild(item);

      // Enfocar el input recién creado
      const input = item.querySelector('.companion-name-input');
      if (input) input.focus();
    }

    function updateCompanionNumbers() {
      const items = companionsList.querySelectorAll('.companion-item');
      items.forEach((it, idx) => {
        const numSpan = it.querySelector('.companion-num');
        if (numSpan) numSpan.textContent = `Acompañante #${idx + 1}`;
      });
    }

    // Envío del formulario
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('rsvp-name')?.value.trim() || '';
      const ceremonia = form.querySelector('input[name="ceremonia"]:checked')?.value || '';
      const convite = form.querySelector('input[name="convite"]:checked')?.value || '';
      const hasCompanions = form.querySelector('input[name="acompanante"]:checked')?.value === 'si';
      const notes = document.getElementById('rsvp-notes')?.value.trim() || '';

      const companions = [];
      if (hasCompanions) {
        const rows = companionsList.querySelectorAll('.companion-item');
        rows.forEach(row => {
          const cName = row.querySelector('.companion-name-input')?.value.trim() || '';
          const cFam = row.querySelector('.companion-familiar-select')?.value || 'no';
          const cAdult = row.querySelector('.companion-adult-select')?.value || 'si';
          if (cName) {
            companions.push({
              nombre: cName,
              esFamiliar: cFam === 'si',
              esAdulto: cAdult === 'si'
            });
          }
        });
      }

      const payload = {
        name,
        ceremonia,
        convite,
        hasCompanions,
        companions,
        notes,
        timestamp: new Date().toISOString()
      };

      console.log('RSVP Enviado:', payload);

      // Enviar a Google Sheets si hay endpoint configurado
      const RSVP_ENDPOINT_URL = ''; // Pega aquí la URL de tu Google Apps Script (/exec)
      if (RSVP_ENDPOINT_URL) {
        fetch(RSVP_ENDPOINT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload)
        }).catch(err => console.error('Error al enviar a Google Sheets:', err));
      }

      form.style.display = 'none';
      if (formSuccess) {
        formSuccess.classList.add('show');
        formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRSVP);
  } else {
    initRSVP();
  }
})();
