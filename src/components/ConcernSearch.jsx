import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Sparkles, MessageCircle, X, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { SEED_SERVICES } from '../data/seedServices.js';
import { buildWhatsAppLink } from '../utils/whatsapp.js';
import Button from './UI/Button.jsx';

export const ConcernSearch = ({ 
  variant = 'hero', // 'hero' or 'header'
  initialQuery = '',
  onSearchSubmit,
  autoFocus = false
}) => {
  const { language, isRTL, t, getLocalized } = useLanguage();
  const navigate = useNavigate();

  const [query, setQuery] = useState(initialQuery);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [servicesList, setServicesList] = useState(SEED_SERVICES);

  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Filter matching active services (case-insensitive across names in current language and all English, Urdu, Roman Urdu keywords)
  const matches = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || q.length < 2) return [];

    return servicesList.filter((service) => {
      if (!service.active) return false;

      const nameEn = (service.name?.en || '').toLowerCase();
      const nameUr = (service.name?.ur || '').toLowerCase();
      const descEn = (service.shortDescription?.en || '').toLowerCase();
      const descUr = (service.shortDescription?.ur || '').toLowerCase();

      // Check keywords list (which contains English, Urdu, and Roman Urdu variants)
      const keywords = (service.keywords || []).map(k => k.toLowerCase());
      const keywordHit = keywords.some(k => k.includes(q) || q.includes(k));

      return (
        nameEn.includes(q) ||
        nameUr.includes(q) ||
        descEn.includes(q) ||
        descUr.includes(q) ||
        keywordHit
      );
    });
  }, [query, servicesList]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setSelectedIndex(-1);
    setIsOpen(val.trim().length >= 1);
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const cleanQuery = query.trim();
    if (!cleanQuery) return;

    setIsOpen(false);
    if (selectedIndex >= 0 && matches[selectedIndex]) {
      navigate(`/services/${matches[selectedIndex].id}`);
    } else if (onSearchSubmit) {
      onSearchSubmit(cleanQuery);
    } else {
      navigate(`/services?search=${encodeURIComponent(cleanQuery)}`);
    }
  };

  // Keyboard navigation: ArrowDown, ArrowUp, Enter, Escape
  const handleKeyDown = (e) => {
    if (!isOpen) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < matches.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : matches.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleSelectService = (serviceId) => {
    setIsOpen(false);
    navigate(`/services/${serviceId}`);
  };

  const isHeader = variant === 'header';

  return (
    <div ref={containerRef} className={`relative w-full ${isHeader ? 'max-w-xs' : 'max-w-2xl mx-auto'}`}>
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <div className="relative w-full">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 sm:ps-4 pointer-events-none text-[#77716A]">
            <Search className={`${isHeader ? 'w-4 h-4' : 'w-5 h-5'} text-[#C5A46D]`} />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => {
              if (query.trim().length >= 1) setIsOpen(true);
            }}
            onKeyDown={handleKeyDown}
            autoFocus={autoFocus}
            placeholder={
              isHeader
                ? (isRTL ? "مسئلہ تلاش کریں..." : "Search concern...")
                : (isRTL ? "جلد کا مسئلہ تلاش کریں (ایکنی، لیزر، گلو، PRP)..." : "Search skin concern (acne, laser, glow, PRP)...")
            }
            className={`w-full rounded-2xl border transition-all text-[#262626] bg-white placeholder:text-[#77716A]/75 focus:outline-none ${
              isHeader
                ? 'py-2 ps-10 pe-16 text-base sm:text-xs border-[#E8E2D8] focus:border-[#C5A46D]'
                : 'py-3 sm:py-3.5 ps-10 sm:ps-12 pe-20 sm:pe-24 text-base border-2 border-[#E8E2D8] focus:border-[#C5A46D] shadow-xs hover:border-[#C5A46D]/60'
            }`}
          />

          <div className="absolute inset-y-0 end-1.5 sm:end-2 flex items-center gap-1">
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setIsOpen(false);
                  inputRef.current?.focus();
                }}
                className="p-1 text-[#77716A] hover:text-[#262626] rounded-full"
                aria-label="Clear query"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <Button
              type="submit"
              variant="primary"
              size={isHeader ? 'sm' : 'sm'}
              className={`${isHeader ? 'h-7 px-2.5 text-[11px]' : 'h-9 sm:h-10 px-3 sm:px-4 text-xs sm:text-sm'} rounded-xl shrink-0`}
            >
              {isRTL ? "تلاش" : "Find"}
            </Button>
          </div>
        </div>
      </form>

      {/* Dropdown Suggestions Menu */}
      {isOpen && query.trim().length >= 1 && (
        <div className="absolute start-0 end-0 mt-2 bg-white rounded-2xl shadow-xl border border-[#E8E2D8] p-2 text-start z-50 max-h-96 overflow-y-auto animate-in fade-in duration-150">
          {matches.length > 0 ? (
            <div>
              <div className="text-[11px] font-semibold text-[#77716A] px-3 py-1.5 uppercase tracking-wider flex items-center justify-between border-b border-[#E8E2D8]/60 mb-1">
                <span>{isRTL ? "تجویز کردہ علاج" : "Matching Clinical Treatments"}</span>
                <span className="text-[10px] text-[#C5A46D] font-normal">
                  {matches.length} {isRTL ? "نتائج" : "available"}
                </span>
              </div>

              <div className="divide-y divide-[#E8E2D8]/40">
                {matches.map((service, index) => {
                  const isSelected = index === selectedIndex;
                  const name = getLocalized(service.name);
                  const shortDesc = getLocalized(service.shortDescription);

                  return (
                    <div
                      key={service.id}
                      onClick={() => handleSelectService(service.id)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-colors ${
                        isSelected ? 'bg-[#F3EEE5] text-[#C5A46D]' : 'hover:bg-[#F3EEE5]/60 text-[#262626]'
                      }`}
                    >
                      <img
                        src={service.image}
                        alt={name}
                        className="w-12 h-12 rounded-lg object-cover shrink-0 bg-[#E8E2D8]/40 border border-[#E8E2D8]"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs sm:text-sm font-semibold truncate text-[#262626]">
                            {name}
                          </p>
                          {service.price ? (
                            <span className="text-[11px] font-bold text-[#C5A46D] whitespace-nowrap">
                              {service.price.toLocaleString()} PKR
                            </span>
                          ) : null}
                        </div>

                        <p className="text-[11px] text-[#77716A] line-clamp-1 mt-0.5">
                          {shortDesc}
                        </p>

                        {service.id === 'hair-transplant' && (
                          <span className="inline-block mt-0.5 text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded font-medium">
                            {isRTL ? "اسلام آباد برانچ" : "Islamabad Branch"}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-2 pt-2 border-t border-[#E8E2D8]/60 text-center">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="text-xs font-semibold text-[#C5A46D] hover:underline inline-flex items-center gap-1"
                >
                  <span>{isRTL ? `تمام نتائج دیکھیں برائے "${query}"` : `View all results for "${query}"`}</span>
                  {isRTL ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          ) : (
            /* Friendly empty state with WhatsApp CTA button */
            <div className="p-4 sm:p-5 text-center">
              <div className="w-10 h-10 rounded-full bg-[#F3EEE5] flex items-center justify-center text-[#C5A46D] mx-auto mb-2">
                <Sparkles className="w-5 h-5" />
              </div>
              <p className="font-serif text-sm font-semibold text-[#262626]">
                {isRTL ? "اس مسئلے کے لیے کوئی علاج درج نہیں ملا" : "No matching treatment found"}
              </p>
              <p className="text-xs text-[#77716A] mt-1 max-w-sm mx-auto">
                {isRTL 
                  ? "ہماری ٹیم آپ کی رہنمائی اور معائنے کے لیے حاضر ہے۔ براہ راست ہمارے ڈاکٹر سے مشورہ کریں:" 
                  : "We treat a wide range of personalized skin concerns. Chat with our clinical coordinator directly:"}
              </p>
              <div className="mt-4">
                <a
                  href={buildWhatsAppLink(
                    isRTL
                      ? `السلام علیکم رائل ایستھیٹک کلینک، میں "${query}" کے حوالے سے ڈاکٹر سے مشورہ اور معلومات حاصل کرنا چاہتا/چاہتی ہوں۔`
                      : `Hello Royal Aesthetic & Laser Clinic, I would like to consult with the doctor regarding my concern: "${query}".`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <Button variant="whatsapp" size="sm" className="text-xs">
                    <MessageCircle className="w-4 h-4 me-1.5" />
                    <span>{isRTL ? "اپنے مسئلے کے بارے میں ہم سے پوچھیں" : "Ask us about your concern"}</span>
                  </Button>
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ConcernSearch;
