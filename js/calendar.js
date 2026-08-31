/**
 * calendar.js — Google Calendar link generator
 */
(function () {
  'use strict';

  const btn = document.getElementById('btn-add-calendar');
  if (!btn) return;

  // ====== CONFIGURAR ESTOS DATOS ======
  const EVENT = {
    title: 'Boda de Ángel & Ashley y Bautizo de Athenea',
    // Formato: YYYYMMDDTHHMMSS (hora local)
    startDate: '20270714T120000',
    endDate: '20270715T020000',
    location: 'Iglesia de San Martín, Madrid, España',
    description:
      '¡Nos casamos y bautizamos a Athenea! Ceremonia a las 12:00h en la Iglesia de San Martín, seguida del convite en la Finca El Olivar.',
  };
  // ====================================

  /**
   * Builds a Google Calendar event creation URL
   */
  function buildCalendarUrl(event) {
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: event.title,
      dates: `${event.startDate}/${event.endDate}`,
      details: event.description,
      location: event.location,
      sf: 'true',
    });

    return `https://calendar.google.com/calendar/r/eventedit?${params.toString()}`;
  }

  btn.addEventListener('click', () => {
    const url = buildCalendarUrl(EVENT);
    window.open(url, '_blank', 'noopener');
  });
})();
