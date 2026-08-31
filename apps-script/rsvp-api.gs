/**
 * Google Apps Script — Guardar respuestas de RSVP en Google Sheets
 *
 * DATOS DE IMPLEMENTACIÓN ACTIVA:
 * - Deployment ID: AKfycbzoHJdTmPo_4Z29ZJihZKupfFR41C5L7Or5LuUt8CYb4r25P8TvJpheyyLQjTdvrOBX
 * - Web App URL: https://script.google.com/macros/s/AKfycbzoHJdTmPo_4Z29ZJihZKupfFR41C5L7Or5LuUt8CYb4r25P8TvJpheyyLQjTdvrOBX/exec
 * - Cuenta: ash.angel.athenea@gmail.com
 */

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);

    const timestamp = new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid' });
    const nombre = data.name || 'Sin nombre';
    const ceremonia = data.ceremonia === 'si' ? 'Sí' : 'No';
    const convite = data.convite === 'si' ? 'Sí' : 'No';
    const tieneAcomp = data.hasCompanions ? 'Sí' : 'No';

    // Formatear acompañantes en texto legible
    let acompanantesTexto = 'Ninguno';
    let totalPersonas = 1;

    if (data.hasCompanions && Array.isArray(data.companions) && data.companions.length > 0) {
      totalPersonas += data.companions.length;
      acompanantesTexto = data.companions.map((c, i) => {
        const fam = c.esFamiliar ? 'Familiar' : 'No familiar';
        const edad = c.esAdulto ? 'Adulto' : 'Niño/a';
        return `${i + 1}. ${c.nombre} (${fam}, ${edad})`;
      }).join('\n');
    }

    const notas = data.notes || '';

    // Añadir fila al final de la hoja
    sheet.appendRow([
      timestamp,
      nombre,
      ceremonia,
      convite,
      tieneAcomp,
      acompanantesTexto,
      totalPersonas,
      notas
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success', message: 'Respuesta guardada correctamente' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
