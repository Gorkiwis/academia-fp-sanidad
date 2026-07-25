import { Resend } from 'resend';
import VerificationEmail from '../emails/VerificationEmail.jsx';
import WelcomeEmail from '../emails/WelcomeEmail.jsx';
import ResetPasswordEmail from '../emails/ResetPasswordEmail.jsx';

// Inicializar el cliente de Resend con la clave de API desde variables de entorno
const resendApiKey = process.env.RESEND_API_KEY || (typeof import.meta !== 'undefined' && import.meta.env?.VITE_RESEND_API_KEY);
export const resend = new Resend(resendApiKey || 're_123456789');

// Remitente por defecto (debe ser un dominio verificado en Resend en producción)
const DEFAULT_FROM = process.env.EMAIL_FROM || 'Academia FP Sanidad <no-reply@academiafpsanidad.es>';

/**
 * Envía el correo de verificación de cuenta.
 * 
 * @param {Object} params
 * @param {string} params.to - Correo electrónico del destinatario
 * @param {string} params.userName - Nombre del usuario
 * @param {string} params.verificationUrl - Enlace de verificación
 * @returns {Promise<Object>} Resultado del envío desde Resend
 */
export async function sendVerificationEmail({ to, userName, verificationUrl }) {
  try {
    const data = await resend.emails.send({
      from: DEFAULT_FROM,
      to: [to],
      subject: 'Verifica tu cuenta - Academia FP Sanidad',
      react: VerificationEmail({ userName, verificationUrl }),
    });
    return { success: true, data };
  } catch (error) {
    console.error('Error al enviar el correo de verificación:', error);
    return { success: false, error: error.message || error };
  }
}

/**
 * Envía el correo de bienvenida y registro.
 * 
 * @param {Object} params
 * @param {string} params.to - Correo electrónico del destinatario
 * @param {string} params.userName - Nombre del alumno
 * @param {string} [params.courseName] - Nombre del curso/módulo de FP Sanidad
 * @param {string} [params.campusUrl] - Enlace de acceso al campus virtual
 * @returns {Promise<Object>} Resultado del envío desde Resend
 */
export async function sendWelcomeEmail({ to, userName, courseName, campusUrl }) {
  try {
    const data = await resend.emails.send({
      from: DEFAULT_FROM,
      to: [to],
      subject: '¡Bienvenido/a a Academia FP Sanidad!',
      react: WelcomeEmail({ userName, courseName, campusUrl }),
    });
    return { success: true, data };
  } catch (error) {
    console.error('Error al enviar el correo de bienvenida:', error);
    return { success: false, error: error.message || error };
  }
}

/**
 * Envía el correo de restablecimiento de contraseña.
 * 
 * @param {Object} params
 * @param {string} params.to - Correo electrónico del destinatario
 * @param {string} params.userName - Nombre del usuario
 * @param {string} params.resetUrl - Enlace para restablecer contraseña
 * @returns {Promise<Object>} Resultado del envío desde Resend
 */
export async function sendPasswordReset({ to, userName, resetUrl }) {
  try {
    const data = await resend.emails.send({
      from: DEFAULT_FROM,
      to: [to],
      subject: 'Restablecer contraseña - Academia FP Sanidad',
      react: ResetPasswordEmail({ userName, resetUrl }),
    });
    return { success: true, data };
  } catch (error) {
    console.error('Error al enviar el correo de restablecimiento de contraseña:', error);
    return { success: false, error: error.message || error };
  }
}
