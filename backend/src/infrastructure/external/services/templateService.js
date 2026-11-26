import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMPLATES_DIR = path.resolve(__dirname, '../templates/emails');

const TEMPLATE_NAMES = {
  confirmation: 'appointment-confirmation.html',
  reschedule: 'appointment-reschedule.html',
  cancel: 'appointment-cancel.html',
  remind: 'appointment-remind.html',
};

const DEFAULT_VARIABLES = {
  supportEmail: process.env.SUPPORT_EMAIL || 'contacto@vivaviajes.com',
  supportPhone: process.env.SUPPORT_PHONE || '+593 99 999 9999',
  manageAppointmentUrl: process.env.APP_URL || 'http://localhost:5173/dashboard',
  bookAppointmentUrl: process.env.APP_URL || 'http://localhost:5173/dashboard',
  cancellationReason: 'Por solicitud del cliente.',
  applicants: '1',
  modality: 'Presencial',
};

export async function renderEmailTemplate(templateType, variables = {}) {
  const fileName = TEMPLATE_NAMES[templateType] || templateType;
  const normalizedFileName = fileName.endsWith('.html') ? fileName : `${fileName}.html`;
  const filePath = path.join(TEMPLATES_DIR, normalizedFileName);

  const rawHtml = await fs.readFile(filePath, 'utf-8');
  const payload = { ...DEFAULT_VARIABLES, ...variables };

  return rawHtml.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_, key) => {
    const value = payload[key];
    if (value === undefined || value === null) {
      return '';
    }
    return String(value);
  });
}