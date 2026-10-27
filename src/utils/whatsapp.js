import { CLINIC_INFO } from '../data/clinicInfo.js';

/**
 * Utility function to build a direct WhatsApp link with URL encoded message
 * Uses clinic confirmed WhatsApp number with country code without '+' or spaces.
 * 
 * @param {string} message - Pre-filled message string
 * @returns {string} - Formatted WhatsApp URL
 */
export function buildWhatsAppLink(message = '') {
  // Ensure number has no '+' or spaces
  const cleanNumber = String(CLINIC_INFO.whatsappNumber).replace(/[+\s-]/g, '');
  const encodedMessage = encodeURIComponent(message || '');
  return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
}

/**
 * Returns localized pre-filled appointment message template
 * 
 * @param {string} serviceName - Optional service name (if blank, returns general booking template)
 * @param {string} language - 'en' or 'ur'
 * @returns {string} - Formatted message
 */
export function getAppointmentBookingMessage(serviceName = '', language = 'en') {
  const isUrdu = language === 'ur';

  if (serviceName && serviceName.trim()) {
    if (isUrdu) {
      return `السلام علیکم رائل ایستھیٹک اینڈ لیزر کلینک، میں "${serviceName.trim()}" کے لیے وقتِ ملاقات (اپائنٹمنٹ) بک کروانا چاہتا/چاہتی ہوں۔ میرا نام ____ ہے۔ مجوزہ دن اور وقت: ____۔`;
    }
    return `Hello Royal Aesthetic & Laser Clinic, I would like to book an appointment for ${serviceName.trim()}. My name is ____. Preferred day and time: ____.`;
  }

  // General booking message when service name is not provided
  if (isUrdu) {
    return `السلام علیکم رائل ایستھیٹک اینڈ لیزر کلینک، میں وقتِ ملاقات (اپائنٹمنٹ) بک کروانا چاہتا/چاہتی ہوں۔ میرا نام ____ ہے۔ مجوزہ دن اور وقت: ____۔`;
  }
  return `Hello Royal Aesthetic & Laser Clinic, I would like to book an appointment. My name is ____. Preferred day and time: ____.`;
}

/**
 * Convenience helper to get full WhatsApp URL for appointment
 */
export function getAppointmentWhatsAppUrl(serviceName = '', language = 'en') {
  const message = getAppointmentBookingMessage(serviceName, language);
  return buildWhatsAppLink(message);
}

export const getWhatsAppLink = buildWhatsAppLink;

export default buildWhatsAppLink;
