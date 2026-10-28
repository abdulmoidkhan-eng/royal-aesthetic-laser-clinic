import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { buildWhatsAppLink, getAppointmentBookingMessage } from '../utils/whatsapp.js';

export const FloatingWhatsApp = () => {
  const { language, isRTL, t } = useLanguage();
  const [showTooltip, setShowTooltip] = useState(true);

  // Pre-filled appointment message in current language using template
  const defaultMsg = getAppointmentBookingMessage('', language);

  return (
    <div className="fixed bottom-16 sm:bottom-20 end-6 z-50 flex items-end gap-3 select-none">
      {/* Friendly Chat Tooltip Bubble */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2 bg-white text-[#262626] px-3.5 py-2 rounded-2xl shadow-lg border border-[#E8E2D8] text-xs animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex flex-col text-start">
            <span className="font-semibold text-[#C5A46D]">
              {isRTL ? "آن لائن کلینک رابطہ" : "Royal Clinic WhatsApp"}
            </span>
            <span className="text-[11px] text-[#77716A]">
              {t('whatsapp.chatBubble')}
            </span>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="p-1 text-[#77716A] hover:text-[#262626] rounded-md transition-colors"
            aria-label="Close message"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={buildWhatsAppLink(defaultMsg)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Royal Aesthetic Clinic on WhatsApp"
        className="relative group w-14 h-14 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#25D366]/30"
      >
        {/* Subtle Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25 pointer-events-none" />
        
        <MessageCircle className="w-7 h-7 relative z-10" />
      </a>
    </div>
  );
};

export default FloatingWhatsApp;
