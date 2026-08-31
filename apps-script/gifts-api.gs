/**
 * Google Apps Script — API para la lista de regalos de boda
 *
 * INSTRUCCIONES DE CONFIGURACIÓN:
 *
 * 1. Crea una Google Sheet con estas columnas (en la fila 1):
 *    A: ID | B: Nombre | C: Descripcion | D: Precio | E: Icono | F: Reservado | G: ReservadoPor
 *
 * 2. Rellena las filas con los regalos. Ejemplo:
 *    | 1 | Vajilla completa | Set de 12 piezas | 180€ | 🍽️ | FALSE |  |
 *    | 2 | Robot de cocina   | Para la cocina    | 250€ | 🤖 | FALSE |  |
 *
 * 3. En la Google Sheet, ve a Extensiones → Apps Script
 *
 * 4. Pega este código completo en el editor (reemplazando todo lo existente)
 *
 * 5. Haz clic en "Implementar" → "Nueva implementación"
 *    - Tipo: "Aplicación web"
 *    - Ejecutar como: "Yo" (tu cuenta)
 *    - Acceso: "Cualquier persona"
 *
 * 6. Copia la URL generada y pégala en js/gifts.js en la constante API_URL
 *
 * 7. Cada vez que modifiques este script, crea una NUEVA implementación
 *    (no basta con guardar, hay que re-implementar)
 */

// ID de tu Google Sheet (lo puedes sacar de la URL del Sheet)
// https://docs.google.com/spreadsheets/d/TU_ID_AQUI/edit
const SHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();
const SHEET_NAME = 'Hoja 1'; // Cambia si tu hoja tiene otro nombre

/**
 * GET — Devuelve la lista de regalos en formato JSON
 */
function doGet(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const gifts = [];

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (!row[0]) continue; // Skip empty rows

      gifts.push({
        id: row[0],
        nombre: row[1],
        descripcion: row[2],
        precio: row[3],
        icono: row[4],
        reservado: row[5] === true || row[5] === 'TRUE' || row[5] === 'true',
        reservadoPor: row[6] || '',
      });
    }

    return ContentService
      .createTextOutput(JSON.stringify(gifts))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * POST — Marca un regalo como reservado
 * Body esperado: { "id": 1, "reservadoPor": "Nombre" }
 */
function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const giftId = body.id;
    const reservadoPor = body.reservadoPor || 'Anónimo';

    if (!giftId) {
      return ContentService
        .createTextOutput(JSON.stringify({ error: 'Falta el ID del regalo' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    const data = sheet.getDataRange().getValues();

    for (let i = 1; i < data.length; i++) {
      if (data[i][0] == giftId) {
        // Check if already reserved
        if (data[i][5] === true || data[i][5] === 'TRUE') {
          return ContentService
            .createTextOutput(JSON.stringify({
              error: 'Este regalo ya ha sido reservado',
              reservadoPor: data[i][6]
            }))
            .setMimeType(ContentService.MimeType.JSON);
        }

        // Mark as reserved
        sheet.getRange(i + 1, 6).setValue(true);        // Column F: Reservado
        sheet.getRange(i + 1, 7).setValue(reservadoPor); // Column G: ReservadoPor

        return ContentService
          .createTextOutput(JSON.stringify({
            success: true,
            message: `Regalo "${data[i][1]}" reservado por ${reservadoPor}`
          }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }

    return ContentService
      .createTextOutput(JSON.stringify({ error: 'Regalo no encontrado' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
