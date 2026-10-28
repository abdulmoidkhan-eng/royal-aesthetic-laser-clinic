import React, { useState, useEffect } from 'react';
import { Sparkles, X, Calendar, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { buildWhatsAppLink } from '../utils/whatsapp.js';

export const OffersBanner = () => {
  const { language, isRTL, t } = useLanguage();
  const [banner, setBanner] = useState({
    active: true,
    textEn: "Exclusive 50% Off Laser Hair Reduction Consultation",
    textUr: "لیزر ہیئر ریڈکشن کنسلٹیشن پر خصوصی 50 فیصد رعایت",
    linkTextEn: "Avail 50% Offer",
    linkTextUr: "50% آفر حاصل کریں"
  });
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function fetchBanner() {
      try {
        const { getOffersBanner } = await import('../firebase/contentService.js');
        const data = await getOffersBanner();
        if (isMounted && data) {
          setBanner(data);
        }
      } catch (err) {
        console.warn('Could not load offers banner:', err);
      }
    }
    const timer = setTimeout(fetchBanner, 500);
    return () => { 
      isMounted = false; 
      clearTimeout(timer);
    };
  }, []);

  if (!banner || dismissed) return null;

  // Check 1: Admin switch on/off
  if (banner.active === false) return null;

  // Check 2: Optional end date expiry
  if (banner.endDate) {
    const endDateTime = new Date(banner.endDate).getTime();
    // Add end of day tolerance if just a date string like YYYY-MM-DD
    const isFullDay = banner.endDate.length === 10;
    const expiry = isFullDay ? endDateTime + (24 * 60 * 60 * 1000 - 1) : endDateTime;
    if (Date.now() > expiry) {
      return null;
    }
  }

  const fallbackText = t('banner.announcement');
  const text = isRTL 
    ? (banner.textUr || banner.textEn || fallbackText) 
    : (banner.textEn || banner.textUr || fallbackText);
  if (!text) return null;

  const defaultActionText = t('banner.action');
  const actionText = isRTL 
    ? (banner.linkTextUr || defaultActionText || "50% آفر حاصل کریں") 
    : (banner.linkTextEn || defaultActionText || "Avail 50% Offer");

  const waMessage = isRTL
    ? `السلام علیکم! میں رائل کلینک کی خصوصی آفر "${text}" کے حوالے سے 50% رعایت اور وقتِ ملاقات لینا چاہتا/چاہتی ہوں۔`
    : `Hello! I would like to avail your limited time 50% offer: "${text}" at Royal Aesthetic Clinic.`;

  const waUrl = buildWhatsAppLink(waMessage);

  return (
    <aside 
      aria-label="Promotional Announcement"
      className="relative z-50 bg-gradient-to-r from-[#93723B] via-[#BA965B] to-[#886934] text-white text-xs sm:text-sm px-4 py-2.5 sm:py-3 shadow-md border-b border-[#7D5F2D] transition-all"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 sm:gap-2.5 flex-1 justify-center text-center flex-wrap">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/20 text-white backdrop-blur-xs ring-1 ring-white/40 shrink-0 shadow-xs animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </span>
          
          <span className="font-semibold tracking-wide text-white drop-shadow-xs">
            {text}
          </span>

          {banner.endDate && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#7D5F2D] bg-white px-2.5 py-0.5 rounded-full shadow-2xs">
              <Calendar className="w-3 h-3 text-[#7D5F2D]" />
              <span>{isRTL ? `آخری تاریخ: ${banner.endDate}` : `Valid until ${banner.endDate}`}</span>
            </span>
          )}

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-bold text-xs sm:text-sm bg-white text-[#7D5F2D] hover:text-[#5E461E] hover:bg-[#FAF8F3] px-3.5 py-1 rounded-full shadow-xs transition-all duration-200 hover:scale-105 active:scale-95 ms-1.5 shrink-0"
          >
            <span>{actionText}</span>
            {isRTL ? (
              <ArrowLeft className="w-3.5 h-3.5 inline" />
            ) : (
              <ArrowRight className="w-3.5 h-3.5 inline" />
            )}
          </a>
        </div>

        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="p-1 text-white/80 hover:text-white hover:bg-white/20 rounded-md transition-colors shrink-0"
          title={isRTL ? "بند کریں" : "Dismiss banner"}
          aria-label="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};

export default OffersBanner;
