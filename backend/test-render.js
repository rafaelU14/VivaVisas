import { renderEmailTemplate } from './src/services/templateService.js';

async function test() {
  const html = await renderEmailTemplate('confirmation', {
    clientName: 'Carlos Mendoza',
    service: 'Visa B1/B2 Turismo',
    appointmentDate: 'Lunes, 23 de Noviembre de 2026',
    appointmentTime: '10:00 AM',
    modality: 'En línea',
    applicants: '2',
    locationOrLink: 'https://meet.google.com/viv-visas-sample',
    advisorName: 'Asesor 1',
    supportEmail: 'ayuda@vivaviajes.com',
    supportPhone: '+593 99 999 9999',
  });

  console.log('Template compiled successfully!');
  console.log('Includes client name:', html.includes('Carlos Mendoza'));
  console.log('Includes no undefined:', !html.includes('undefined'));
}

test();