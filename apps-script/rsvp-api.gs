/**
 * Google Apps Script — Guardar respuestas de RSVP en Google Sheets
 *
 * GUÍA DE CONFIGURACIÓN RÁPIDA:
 *
 * 1. Ve a https://sheets.google.com y crea una nueva hoja de cálculo.
 * 2. Nómbrala por ejemplo: "Respuestas Boda Ángel & Ash".
 * 3. En la fila 1 (cabeceras), escribe en las columnas:
 *    - A1: Fecha de Envío
 *    - B1: Nombre Completo
 *    - C1: Asiste a Ceremonia
 *    - D1: Asiste a Convite
 *    - E1: ¿Viene Acompañado?
 *    - F1: Lista de Acompañantes
 *    - G1: Total Asistentes (Titular + Acomp.)
 *    - H1: Notas / Alergias / Canciones
 *
 * 4. En el menú superior de la hoja, ve a: Extensiones → Apps Script.
 * 5. Borra todo el código que aparezca y pega este código completo.
 * 6. Haz clic en "Implementar" (botón azul arriba a la derecha) → "Nueva implementación".
 * 7. En el icono de engranaje (⚙️), selecciona tipo: "Aplicación web".
 * 8. Configura:
 *    - Descripción: "RSVP Boda"
 *    - Ejecutar como: "Yo" (tu correo de Google)
 *    - Quién tiene acceso: "Cualquier persona" (Anyone)  <-- ¡MUY IMPORTANTE!
 * 9. Haz clic en "Implementar", autoriza los permisos de Google.
 * 10. Copia la "URL de la aplicación web" generada (termina en /exec).
 * 11. Pégala en el archivo `js/rsvp.js` en la variable `RSVP_ENDPOINT_URL`.
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
