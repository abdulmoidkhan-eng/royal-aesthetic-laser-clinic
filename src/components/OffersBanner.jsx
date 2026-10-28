import React, { useState, useEffect } from 'react';
import { Sparkles, X, Calendar, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { getOffersBanner } from '../firebase/contentService.js';
import { buildWhatsAppLink } from '../utils/whatsapp.js';

export const OffersBanner = () => {
  const { language, isRTL, t } = useLanguage();
  const [banner, setBanner] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function fetchBanner() {
      try {
        const data = await getOffersBanner();
        if (isMounted && data) {
          setBanner(data);
        }
      } catch (err) {
        console.warn('Could not load offers banner:', err);
      }
    }
    fetchBanner();
    return () => { isMounted = false; };
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
      className="bg-gradient-to-r from-[#F3EEE5] via-[#FAF8F3] to-[#F3EEE5] border-b border-[#E8E2D8] text-[#262626] text-xs sm:text-sm px-4 py-2.5 transition-all"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 justify-center text-center flex-wrap">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#C5A46D] text-white shrink-0 shadow-xs">
            <Sparkles className="w-3 h-3" />
          </span>
          
          <span className="font-medium text-[#262626]">
            {text}
          </span>

          {banner.endDate && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#9E7F47] bg-white/90 px-2.5 py-0.5 rounded-full border border-[#E8E2D8]">
              <Calendar className="w-3 h-3 text-[#C5A46D]" />
              <span>{isRTL ? `آخری تاریخ: ${banner.endDate}` : `Valid until ${banner.endDate}`}</span>
            </span>
          )}

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-[#262626] underline hover:text-[#C5A46D] transition-colors ms-1.5"
          >
            <span>{actionText}</span>
            {isRTL ? (
              <ArrowLeft className="w-3 h-3 inline" />
            ) : (
              <ArrowRight className="w-3 h-3 inline" />
            )}
          </a>
        </div>

        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="p-1 text-[#77716A] hover:text-[#262626] hover:bg-white/50 rounded-md transition-colors shrink-0"
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
