// Clinic Information & WhatsApp Link Helper
export const CLINIC_INFO = {
  name: "Royal Aesthetic & Laser Clinic",
  nameUrdu: "رائل ایستھیٹک اینڈ لیزر کلینک",
  doctorName: "Dr. Royal Aesthetic Specialist",
  doctorTitle: "Aesthetic Physician & Laser Consultant",
  email: "royalaesthetic@gmail.com",
  phone: "+92 347 9305057",
  whatsappNumber: "923479305057", // Standard international format without + or spaces
  googleMapsUrl: "https://maps.app.goo.gl/MQF1gR36KicZYmhu5",
  address: {
    en: "Pul Chowki, opposite Meeral Restaurant, Thana, Malakand, Khyber Pakhtunkhwa, Pakistan",
    ur: "پل چوکی، بالمقابل میرال ریسٹورنٹ، تھانہ، مالاکنڈ، خیبر پختونخوا، پاکستان",
    shortEn: "Pul Chowki, Opp. Meeral Restaurant, Thana, Malakand",
    shortUr: "پل چوکی، بالمقابل میرال ریسٹورنٹ، تھانہ، مالاکنڈ"
  },
  timings: {
    en: "11:00 AM – 5:00 PM (Closed on Friday)",
    ur: "صبح 11 بجے سے شام 5 بجے تک (جمعہ بند)",
    daysEn: "Saturday – Thursday",
    daysUr: "ہفتہ تا جمعرات",
    hoursEn: "11:00 AM - 5:00 PM",
    hoursUr: "11:00 AM - 5:00 PM",
    offDayEn: "Friday (Closed)",
    offDayUr: "جمعہ (بند)"
  },
  socials: {
    instagram: "https://www.instagram.com/asad.shalman?cplk=MWxrbDNxNDBwNDEyNg==",
    facebook: "https://www.facebook.com/share/19UtS7h9fh/",
    tiktok: "https://www.tiktok.com/@drasad.shalman?is_from_webapp=1&sender_device=pc"
  },
  disclaimer: {
    en: "Results vary. Consult our doctor before any procedure.",
    ur: "نتائج ہر فرد کے لیے مختلف ہو سکتے ہیں۔ کسی بھی طریقہ کار سے قبل ہمارے معالج سے مشورہ کریں۔"
  }
};

export const buildWhatsAppLink = (message = "") => {
  const cleanNumber = String(CLINIC_INFO.whatsappNumber).replace(/[+\s-]/g, '');
  const encoded = encodeURIComponent(message || "");
  return `https://wa.me/${cleanNumber}?text=${encoded}`;
};

export const getWhatsAppLink = (message = "") => {
  return buildWhatsAppLink(message);
};
