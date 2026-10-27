import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Mail, Instagram, Facebook, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { CLINIC_INFO } from '../data/clinicInfo.js';
import { buildWhatsAppLink } from '../utils/whatsapp.js';

export const Footer = () => {
  const { isRTL, t, getLocalized } = useLanguage();

  const quickLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/services', label: t('nav.services') },
    { to: '/shop', label: t('nav.shop') },
    { to: '/reviews', label: t('nav.reviews') },
    { to: '/contact', label: t('nav.contact') }
  ];

  const popularTreatments = [
    { label: isRTL ? "لیزر ہیئر ریموول / ریڈکشن" : "Laser Hair Removal/ Hair Reduction", to: "/services/laser-hair-removal" },
    { label: isRTL ? "پگمنٹیشن / میلازما" : "Pigmentation / Melasma", to: "/services/pigmentation-melasma" },
    { label: isRTL ? "میڈیکیٹڈ ہائیڈرا فیشل" : "Medicated HydraFacial", to: "/services/medicated-hydrafacial" },
    { label: isRTL ? "فیس پی آر پی + مائیکرو نیڈلنگ" : "Face PRP + Micro-Needling", to: "/services/face-prp-microneedling" },
    { label: isRTL ? "وائٹننگ ڈرپس" : "Whitening Drips", to: "/services/whitening-drips" }
  ];

  return (
    <footer className="bg-[#FBF3F0] border-t border-[#F4E4DE] text-[#3A3A3A] transition-colors">
      {/* Upper Footer: Main columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* Col 1: Brand & Philosophy */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-xs border border-[#F4E4DE] bg-white shrink-0 flex items-center justify-center p-0.5">
                <img 
                  src="/assets/aistudio/Golden_Crowned_R_Emblem_44ae7f4a.png" 
                  alt="Royal Aesthetic & Laser Clinic Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="font-serif text-lg font-semibold text-[#3A3A3A] leading-tight">
                  Royal Aesthetic
                </h3>
                <p className="text-xs text-[#6B5B55]">
                  & Laser Clinic • Malakand
                </p>
              </div>
            </div>

            <p className="text-sm text-[#6B5B55] leading-relaxed">
              {t('footer.aboutText')}
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={CLINIC_INFO.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white border border-[#F4E4DE] flex items-center justify-center text-[#6B5B55] hover:text-[#D9A38F] hover:border-[#D9A38F] transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={CLINIC_INFO.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white border border-[#F4E4DE] flex items-center justify-center text-[#6B5B55] hover:text-[#D9A38F] hover:border-[#D9A38F] transition-all"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={CLINIC_INFO.socials.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white border border-[#F4E4DE] flex items-center justify-center text-[#6B5B55] hover:text-[#D9A38F] hover:border-[#D9A38F] transition-all"
                aria-label="TikTok"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.89 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.35 0 .68.06 1 .17V9.3a6.38 6.38 0 0 0-1-.08 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.06a8.28 8.28 0 0 0 4.76 1.5v-3.4a4.85 4.85 0 0 1-1-.47z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="font-serif text-base font-semibold text-[#3A3A3A] mb-4">
              {t('footer.quickLinks')}
            </h4>
            <ul className="space-y-2.5 text-sm">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-[#6B5B55] hover:text-[#D9A38F] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Popular Treatments */}
          <div>
            <h4 className="font-serif text-base font-semibold text-[#3A3A3A] mb-4">
              {t('footer.treatments')}
            </h4>
            <ul className="space-y-2.5 text-sm">
              {popularTreatments.map((item, idx) => (
                <li key={idx}>
                  <Link
                    to={item.to}
                    className="text-[#6B5B55] hover:text-[#D9A38F] transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Clinic Info & Timings */}
          <div className="space-y-4">
            <h4 className="font-serif text-base font-semibold text-[#3A3A3A] mb-2">
              {t('footer.contactInfo')}
            </h4>

            <div className="flex items-start gap-3 text-sm text-[#6B5B55]">
              <MapPin className="w-4 h-4 text-[#D9A38F] shrink-0 mt-0.5" />
              <div>
                <span>{getLocalized(CLINIC_INFO.address)}</span>
                <div className="mt-1">
                  <a
                    href={CLINIC_INFO.googleMapsUrl || "https://maps.app.goo.gl/MQF1gR36KicZYmhu5"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#D9A38F] hover:underline font-medium inline-flex items-center gap-1"
                  >
                    <span>{isRTL ? "گوگل میپس میں دیکھیں" : "View on Google Maps"}</span>
                    <span>→</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 text-sm text-[#6B5B55]">
              <Clock className="w-4 h-4 text-[#D9A38F] shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-[#3A3A3A]">{getLocalized(CLINIC_INFO.timings)}</p>
                <p className="text-xs text-amber-800 font-semibold mt-0.5">
                  {getLocalized(CLINIC_INFO.timings.offDayEn ? { en: CLINIC_INFO.timings.offDayEn, ur: CLINIC_INFO.timings.offDayUr } : {})}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm text-[#6B5B55]">
              <Mail className="w-4 h-4 text-[#D9A38F] shrink-0" />
              <a
                href={`mailto:${CLINIC_INFO.email}`}
                className="hover:text-[#D9A38F] transition-colors"
              >
                {CLINIC_INFO.email}
              </a>
            </div>

            <div className="pt-2">
              <a
                href={buildWhatsAppLink(isRTL ? "السلام علیکم! میں رائل کلینک سے رابطہ کرنا چاہتا/چاہتی ہوں۔" : "Hello Royal Aesthetic Clinic! I would like to inquire about your services.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl bg-white border border-[#D9A38F] text-[#3A3A3A] hover:bg-[#F4E4DE] transition-all"
              >
                <span>{isRTL ? "ڈائریکٹ واٹس ایپ رابطہ" : "Direct WhatsApp Help"}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Medical Disclaimer Banner */}
        <div className="mt-12 p-4 rounded-2xl bg-white border border-[#F4E4DE] flex items-start gap-3 text-xs text-[#6B5B55] leading-relaxed">
          <AlertCircle className="w-4 h-4 text-[#D9A38F] shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-[#3A3A3A]">
              {isRTL ? "اہم طبی رہنمائی: " : "Clinical Disclaimer: "}
            </span>
            <span>{getLocalized(CLINIC_INFO.disclaimer)}</span>{" "}
            <span>
              {isRTL
                ? "طبی نتائج ہر فرد کی جلد اور صحت کی حالت کے مطابق مختلف ہوتے ہیں۔"
                : "Individual aesthetic responses depend on skin condition, medical history, and treatment frequency."}
            </span>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Terms */}
        <div className="mt-8 pt-6 border-t border-[#F4E4DE] flex flex-col sm:flex-row items-center justify-between text-xs text-[#6B5B55] gap-3">
          <p>
            © {new Date().getFullYear()} {getLocalized({ en: CLINIC_INFO.name, ur: CLINIC_INFO.nameUrdu })}. {t('footer.allRightsReserved')}
          </p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-[11px]">
              {isRTL ? "معیاری و محفوظ لیزر کلینک" : "Certified Aesthetic Practice"}
            </span>
            <span className="text-[#D9A38F]">•</span>
            <span>Malakand, KPK</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
