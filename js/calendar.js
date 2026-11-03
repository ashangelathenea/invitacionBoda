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
    startDate: '20270626T170000',
    endDate: '20270627T040000',
    location: 'Parroquia Nuestra Señora del Pilar (Valdemoro) / Hotel PCM Forum Alcalá (Alcalá de Henares)',
    description:
      '¡Nos casamos y bautizamos a Athenea! Ceremonia y bautizo a las 17:00h en la Parroquia Nuestra Señora del Pilar (Valdemoro), seguida de la celebración y convite a las 20:00h en el Hotel PCM Forum Alcalá.',
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
