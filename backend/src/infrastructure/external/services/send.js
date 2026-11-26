import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderEmailTemplate } from './templateService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendTestEmail() {
  const html = await renderEmailTemplate('confirmation', {
    clientName: 'Rafael Ulloa',
    service: 'Visa B1/B2 Turismo',
    appointmentDate: 'Viernes, 20 de Noviembre de 2026',
    appointmentTime: '11:00 AM',
    modality: 'En línea',
    applicants: '1 persona',
    locationOrLink: 'https://meet.google.com/viv-viajes-demo',
    advisorName: 'Asesor Viva Viajes',
    supportEmail: process.env.EMAIL_USER,
    supportPhone: '+593 99 999 9999',
  });

  const mailOptions = {
    from: `"Viva Viajes" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_RECEIVER,
    subject: 'Confirmación de Cita — Viva Viajes',
    html,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent successfully! Receipt:', info.response);
    }
  });
}

sendTestEmail();
