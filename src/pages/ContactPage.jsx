import React, { useState } from 'react';
import { 
  MapPin, Clock, Mail, Phone, MessageCircle, Send, 
  Instagram, Facebook, ExternalLink, Calendar, CheckCircle2, Navigation
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { CLINIC_INFO } from '../data/clinicInfo.js';
import { buildWhatsAppLink, getAppointmentBookingMessage } from '../utils/whatsapp.js';
import { SEED_SERVICES } from '../data/seedServices.js';
import SectionHeader from '../components/UI/SectionHeader.jsx';
import Card from '../components/UI/Card.jsx';
import Button from '../components/UI/Button.jsx';
import Badge from '../components/UI/Badge.jsx';

export const ContactPage = () => {
  const { language, isRTL, t, getLocalized } = useLanguage();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    serviceName: '',
    preferredTime: '',
    notes: ''
  });

  // Exact Google Maps location URL for Royal Aesthetic & Laser Clinic in Thana, Malakand
  const googleMapsUrl = CLINIC_INFO.googleMapsUrl || "https://maps.app.goo.gl/MQF1gR36KicZYmhu5";

  const handleSubmit = (e) => {
    e.preventDefault();

    let msg = '';
    const sName = formData.serviceName.trim();
    const customerName = formData.name.trim() || '____';
    const timePref = formData.preferredTime.trim() || '____';

    if (isRTL) {
      if (sName) {
        msg = `السلام علیکم رائل ایستھیٹک اینڈ لیزر کلینک، میں "${sName}" کے لیے وقتِ ملاقات (اپائنٹمنٹ) بک کروانا چاہتا/چاہتی ہوں۔ میرا نام ${customerName} ہے۔ مجوزہ دن اور وقت: ${timePref}۔`;
      } else {
        msg = `السلام علیکم رائل ایستھیٹک اینڈ لیزر کلینک، میں وقتِ ملاقات (اپائنٹمنٹ) بک کروانا چاہتا/چاہتی ہوں۔ میرا نام ${customerName} ہے۔ مجوزہ دن اور وقت: ${timePref}۔`;
      }
      if (formData.notes.trim()) {
        msg += `\nنوٹ: ${formData.notes.trim()}`;
      }
    } else {
      if (sName) {
        msg = `Hello Royal Aesthetic & Laser Clinic, I would like to book an appointment for ${sName}. My name is ${customerName}. Preferred day and time: ${timePref}.`;
      } else {
        msg = `Hello Royal Aesthetic & Laser Clinic, I would like to book an appointment. My name is ${customerName}. Preferred day and time: ${timePref}.`;
      }
      if (formData.notes.trim()) {
        msg += `\nNotes: ${formData.notes.trim()}`;
      }
    }

    window.open(buildWhatsAppLink(msg), '_blank', 'noopener,noreferrer');
  };

  const generalWhatsAppUrl = buildWhatsAppLink(getAppointmentBookingMessage('', language));

  return (
    <div className="min-h-screen bg-white py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          as="h1"
          eyebrow={isRTL ? "ہم سے رابطہ کریں" : "Contact & Appointments"}
          title={isRTL ? "رائل کلینک سے رابطہ اور کلینیکل ایڈریس" : "Visit or Contact Royal Aesthetic & Laser Clinic"}
          subtitle={isRTL
            ? "تھانہ مالاکنڈ، پل چوکی، بالمقابل میرال ریسٹورنٹ۔ ہفتہ تا جمعرات، صبح 11 تا شام 5 بجے۔"
            : "Located at Pul Chowki, opposite Meeral Restaurant, Thana, Malakand. Reach out via WhatsApp, phone, or visit our clinic."}
        />

        {/* Quick Contact Action Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {/* 1. Direct WhatsApp */}
          <a
            href={generalWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/30 hover:bg-[#25D366]/15 hover:border-[#25D366] transition-all group"
          >
            <div className="w-11 h-11 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-[#6B5B55] font-medium">WhatsApp</p>
              <p className="text-sm font-semibold text-[#3A3A3A] group-hover:text-[#25D366] transition-colors">
                {isRTL ? "ڈائریکٹ چیٹ کریں" : "Chat on WhatsApp"}
              </p>
              <span className="text-[10px] text-emerald-700 font-medium">Online 11am - 5pm</span>
            </div>
          </a>

          {/* 2. Email */}
          <a
            href={`mailto:${CLINIC_INFO.email}`}
            className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#FBF3F0] border border-[#F4E4DE] hover:border-[#D9A38F] hover:bg-white transition-all group"
          >
            <div className="w-11 h-11 rounded-xl bg-[#D9A38F] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <Mail className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-[#6B5B55] font-medium">Email</p>
              <p className="text-sm font-semibold text-[#3A3A3A] truncate group-hover:text-[#D9A38F] transition-colors">
                {CLINIC_INFO.email}
              </p>
              <span className="text-[10px] text-[#6B5B55]">Doctor consultations</span>
            </div>
          </a>

          {/* 3. Timings */}
          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#FBF3F0] border border-[#F4E4DE]">
            <div className="w-11 h-11 rounded-xl bg-[#F4E4DE] text-[#3A3A3A] flex items-center justify-center shrink-0 shadow-xs">
              <Clock className="w-5 h-5 text-[#D9A38F]" />
            </div>
            <div>
              <p className="text-xs text-[#6B5B55] font-medium">{isRTL ? "اوقاتِ کار" : "Timings"}</p>
              <p className="text-sm font-semibold text-[#3A3A3A]">11:00 AM - 5:00 PM</p>
              <span className="text-[10px] text-rose-700 font-semibold">{isRTL ? "جمعہ بند" : "Closed on Friday"}</span>
            </div>
          </div>

          {/* 4. Google Maps Direction */}
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-[#F4E4DE] hover:border-[#D9A38F] hover:bg-[#FBF3F0]/60 transition-all group"
          >
            <div className="w-11 h-11 rounded-xl bg-[#F4E4DE] text-[#D9A38F] flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-[#6B5B55] font-medium">{isRTL ? "گوگل میپس" : "Google Maps"}</p>
              <p className="text-sm font-semibold text-[#3A3A3A] group-hover:text-[#D9A38F] transition-colors flex items-center gap-1">
                <span>{isRTL ? "راستہ دیکھیں" : "Open in Maps"}</span>
                <ExternalLink className="w-3 h-3 text-[#D9A38F]" />
              </p>
              <span className="text-[10px] text-[#6B5B55]">Thana, Malakand</span>
            </div>
          </a>
        </div>

        {/* Main Grid: Appointment Form & Clinic Location Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-start">
          {/* Left: Interactive WhatsApp Appointment Booking Form */}
          <Card className="p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-[#D9A38F]" />
              <h3 className="font-serif text-xl font-semibold text-[#3A3A3A]">
                {isRTL ? "وقتِ ملاقات کی درخواست (بکنگ فارم)" : "Request an Appointment"}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#6B5B55] mb-6">
              {isRTL 
                ? "فارم پُر کریں اور اپنے منتخب کردہ طریقہ علاج کے لیے واٹس ایپ پر براہ راست وقتِ ملاقات حاصل کریں۔" 
                : "Fill this form to instantly pre-fill your personalized appointment request on WhatsApp."}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#3A3A3A] mb-1.5">
                  {isRTL ? "آپ کا نام *" : "Your Name *"}
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(f => ({ ...f, name: e.target.value }))}
                  placeholder={isRTL ? "مثال: فاطمہ بی بی" : "e.g. Fatima Bibi"}
                  className="w-full px-4 py-3 rounded-xl border border-[#F4E4DE] text-sm text-[#3A3A3A] focus:outline-none focus:border-[#D9A38F] bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3A3A3A] mb-1.5">
                  {isRTL ? "مطلوبہ طریقہ علاج / سروس" : "Selected Treatment / Service"}
                </label>
                <select
                  value={formData.serviceName}
                  onChange={(e) => setFormData(f => ({ ...f, serviceName: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-[#F4E4DE] text-sm text-[#3A3A3A] focus:outline-none focus:border-[#D9A38F] bg-white"
                >
                  <option value="">
                    {isRTL ? "-- عام معائنہ / مشورہ --" : "-- General Consultation / Assessment --"}
                  </option>
                  {SEED_SERVICES.map((s) => (
                    <option key={s.id} value={getLocalized(s.name)}>
                      {getLocalized(s.name)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3A3A3A] mb-1.5">
                  {isRTL ? "مجوزہ دن اور وقت *" : "Preferred Day and Time *"}
                </label>
                <input
                  type="text"
                  required
                  value={formData.preferredTime}
                  onChange={(e) => setFormData(f => ({ ...f, preferredTime: e.target.value }))}
                  placeholder={isRTL ? "مثال: پیر، دوپہر 12 بجے" : "e.g. Monday at 1:00 PM"}
                  className="w-full px-4 py-3 rounded-xl border border-[#F4E4DE] text-sm text-[#3A3A3A] focus:outline-none focus:border-[#D9A38F] bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3A3A3A] mb-1.5">
                  {isRTL ? "کوئی خاص نوٹ یا سوال (اختیاری)" : "Special Notes or Medical Questions (Optional)"}
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData(f => ({ ...f, notes: e.target.value }))}
                  placeholder={isRTL ? "کیا آپ پہلے کوئی علاج کروا چکے ہیں؟" : "Any prior laser treatments or skin allergies..."}
                  className="w-full px-4 py-3 rounded-xl border border-[#F4E4DE] text-sm text-[#3A3A3A] focus:outline-none focus:border-[#D9A38F] bg-white resize-none"
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="whatsapp"
                  size="lg"
                  className="w-full justify-center"
                >
                  <MessageCircle className="w-4 h-4 me-2" />
                  <span>{isRTL ? "واٹس ایپ پر وقتِ ملاقات لیں" : "Book appointment via WhatsApp"}</span>
                </Button>
              </div>
            </form>
          </Card>

          {/* Right: Clinic Address, Timings, Google Maps Card & Socials */}
          <div className="space-y-6">
            <Card className="p-6 sm:p-8 bg-[#FBF3F0]/60 border-[#F4E4DE]">
              <h3 className="font-serif text-lg font-semibold text-[#3A3A3A] mb-4">
                {isRTL ? "کلینک کے بارے میں معلومات" : "Clinic Details & Address"}
              </h3>

              <div className="space-y-5 text-sm">
                {/* Address & Maps Link */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#F4E4DE] flex items-center justify-center text-[#D9A38F] shrink-0 mt-0.5 shadow-2xs">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-xs text-[#3A3A3A] uppercase tracking-wider">
                      {isRTL ? "مکمل پتہ" : "Clinic Address"}
                    </p>
                    <p className="text-sm text-[#3A3A3A] font-medium mt-1 leading-snug">
                      {getLocalized(CLINIC_INFO.address)}
                    </p>
                    <p className="text-xs text-[#6B5B55] mt-1">
                      {isRTL ? "پل چوکی، بالمقابل میرال ریسٹورنٹ، تھانہ، مالاکنڈ" : "Pul Chowki, opposite Meeral Restaurant, Thana, Malakand"}
                    </p>

                    {/* Google Maps Link (opens in new tab) */}
                    <div className="mt-3">
                      <a
                        href={googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-white border border-[#D9A38F] text-[#3A3A3A] hover:bg-[#FBF3F0] hover:text-[#D9A38F] transition-all shadow-2xs"
                      >
                        <Navigation className="w-3.5 h-3.5 text-[#D9A38F]" />
                        <span>{isRTL ? "گوگل میپس میں کلینک کا نقشہ کھولیں" : "Open address in Google Maps"}</span>
                        <ExternalLink className="w-3 h-3 text-[#6B5B55]" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Timings */}
                <div className="flex items-start gap-3.5 pt-3 border-t border-[#F4E4DE]">
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#F4E4DE] flex items-center justify-center text-[#D9A38F] shrink-0 mt-0.5 shadow-2xs">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-xs text-[#3A3A3A] uppercase tracking-wider">
                      {isRTL ? "اوقاتِ کار" : "Consultation Timings"}
                    </p>
                    <p className="text-sm text-[#3A3A3A] font-semibold mt-1">
                      11:00 AM – 5:00 PM
                    </p>
                    <p className="text-xs text-[#6B5B55] mt-0.5">
                      {isRTL ? "ہفتہ تا جمعرات (ہفتے میں 6 دن)" : "Saturday to Thursday (6 days a week)"}
                    </p>
                    <p className="text-xs text-rose-700 font-semibold mt-1">
                      {isRTL ? "جمعہ بند (چھٹی کا دن)" : "Closed on Friday"}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3.5 pt-3 border-t border-[#F4E4DE]">
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#F4E4DE] flex items-center justify-center text-[#D9A38F] shrink-0 mt-0.5 shadow-2xs">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-xs text-[#3A3A3A] uppercase tracking-wider">
                      Email
                    </p>
                    <a
                      href={`mailto:${CLINIC_INFO.email}`}
                      className="text-sm text-[#3A3A3A] font-medium hover:text-[#D9A38F] transition-colors"
                    >
                      {CLINIC_INFO.email}
                    </a>
                  </div>
                </div>
              </div>

              {/* Social Media Links (All opening in a new tab) */}
              <div className="mt-8 pt-5 border-t border-[#F4E4DE]">
                <p className="text-xs font-semibold text-[#3A3A3A] uppercase tracking-wider mb-3">
                  {isRTL ? "سوشل میڈیا لنکس (نیا ٹیب)" : "Social Media Channels"}
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  {/* Instagram */}
                  <a
                    href={CLINIC_INFO.socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#F4E4DE] text-xs font-medium text-[#3A3A3A] hover:text-[#D9A38F] hover:border-[#D9A38F] transition-all shadow-2xs group"
                  >
                    <Instagram className="w-4 h-4 text-[#D9A38F]" />
                    <span>Instagram</span>
                    <ExternalLink className="w-3 h-3 text-[#6B5B55] opacity-50 group-hover:opacity-100" />
                  </a>

                  {/* Facebook */}
                  <a
                    href={CLINIC_INFO.socials.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#F4E4DE] text-xs font-medium text-[#3A3A3A] hover:text-[#D9A38F] hover:border-[#D9A38F] transition-all shadow-2xs group"
                  >
                    <Facebook className="w-4 h-4 text-[#D9A38F]" />
                    <span>Facebook</span>
                    <ExternalLink className="w-3 h-3 text-[#6B5B55] opacity-50 group-hover:opacity-100" />
                  </a>

                  {/* TikTok */}
                  <a
                    href={CLINIC_INFO.socials.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#F4E4DE] text-xs font-medium text-[#3A3A3A] hover:text-[#D9A38F] hover:border-[#D9A38F] transition-all shadow-2xs group"
                  >
                    <svg className="w-4 h-4 fill-[#D9A38F] group-hover:fill-[#D9A38F] shrink-0" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.89 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.35 0 .68.06 1 .17V9.3a6.38 6.38 0 0 0-1-.08 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.06a8.28 8.28 0 0 0 4.76 1.5v-3.4a4.85 4.85 0 0 1-1-.47z" />
                    </svg>
                    <span>TikTok</span>
                    <ExternalLink className="w-3 h-3 text-[#6B5B55] opacity-50 group-hover:opacity-100" />
                  </a>
                </div>
              </div>
            </Card>

            {/* Landmark & Parking Card */}
            <Card className="p-6 border-[#F4E4DE]">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <h4 className="font-serif text-base font-semibold text-[#3A3A3A]">
                  {isRTL ? "مقام اور سہولیات کی تفصیل" : "Landmark & Clinic Amenities"}
                </h4>
              </div>
              <p className="text-xs text-[#6B5B55] leading-relaxed">
                {isRTL
                  ? "کلینک مین روڈ پر پل چوکی، میرال ریسٹورنٹ کے عین سامنے واقع ہے۔ مریضوں کے لیے پرائیویٹ اور محفوظ پارکنگ، کشادہ ویٹنگ روم اور خواتین کے لیے مکمل پردے کا انتظام موجود ہے۔"
                  : "Located directly opposite Meeral Restaurant at Pul Chowki, Thana, Malakand. Dedicated patient parking, discreet private waiting lounges, and sanitized clinical procedure rooms."}
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
