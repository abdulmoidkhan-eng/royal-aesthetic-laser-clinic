import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag, ChevronRight, Search } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { CLINIC_INFO } from '../data/clinicInfo.js';
import { buildWhatsAppLink, getAppointmentBookingMessage } from '../utils/whatsapp.js';
import Button from './UI/Button.jsx';
import ConcernSearch from './ConcernSearch.jsx';

export const Header = () => {
  const { language, setLanguage, isRTL, t } = useLanguage();
  const { cartCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/services', label: t('nav.services') },
    { to: '/shop', label: t('nav.shop') },
    { to: '/reviews', label: t('nav.reviews') },
    { to: '/contact', label: t('nav.contact') }
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleBookClick = () => {
    const generalMsg = getAppointmentBookingMessage('', language);
    window.open(buildWhatsAppLink(generalMsg), '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FAF8F3]/95 backdrop-blur-md border-b border-[#E8E2D8] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-3">
            {/* Logo / Brand Name */}
            <Link
              to="/"
              className="flex items-center gap-3 group focus:outline-none shrink-0"
              onClick={() => {
                setMobileMenuOpen(false);
                setMobileSearchOpen(false);
              }}
            >
              <div className="w-11 h-11 rounded-xl overflow-hidden shadow-xs border border-[#E8E2D8] bg-white group-hover:border-[#C5A46D] group-hover:scale-105 transition-all shrink-0 flex items-center justify-center p-0.5">
                <picture>
                  <source srcSet="/assets/aistudio/Golden_Crowned_R_Emblem_44ae7f4a.webp" type="image/webp" />
                  <img 
                    src="/assets/aistudio/Golden_Crowned_R_Emblem_44ae7f4a.png" 
                    alt="Royal Aesthetic & Laser Clinic Logo" 
                    width="44"
                    height="44"
                    className="w-full h-full object-contain"
                  />
                </picture>
              </div>
              <div className="flex flex-col text-start">
                <span className="font-serif font-bold text-xl sm:text-[22px] tracking-tight text-[#262626] group-hover:text-[#C5A46D] transition-colors leading-tight">
                  Royal Aesthetic
                </span>
                <span className="text-[10px] sm:text-[11px] text-[#77716A] tracking-[0.2em] uppercase font-medium">
                  & Laser Clinic
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-1.5">
              {navLinks.map((link) => {
                const active = isActive(link.to);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      active
                        ? 'text-[#9E7F47] bg-[#F3EEE5] border border-[#E8E2D8] font-semibold'
                        : 'text-[#262626] hover:text-[#C5A46D] hover:bg-[#F3EEE5]/60'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Reusable ConcernSearch (Desktop header) */}
            <div className="hidden lg:block w-64 xl:w-72">
              <ConcernSearch variant="header" />
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
              {/* Mobile Search Toggle */}
              <button
                type="button"
                onClick={() => setMobileSearchOpen(prev => !prev)}
                className="lg:hidden p-2 rounded-xl text-[#262626] hover:bg-[#F3EEE5] transition-colors"
                aria-label="Toggle Concern Search"
              >
                <Search className="w-5 h-5 text-[#C5A46D]" />
              </button>

              {/* Language Switch: EN | اردو */}
              <div className="flex items-center bg-[#F3EEE5] rounded-xl p-1 border border-[#E8E2D8]">
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`px-2 py-0.5 sm:px-2.5 sm:py-1 text-xs rounded-lg transition-all font-medium ${
                    language === 'en'
                      ? 'bg-white text-[#262626] shadow-2xs font-semibold'
                      : 'text-[#77716A] hover:text-[#262626]'
                  }`}
                  aria-label="Switch to English"
                >
                  EN
                </button>
                <span className="text-[#C5A46D] text-xs px-0.5">|</span>
                <button
                  type="button"
                  onClick={() => setLanguage('ur')}
                  className={`px-2 py-0.5 sm:px-2.5 sm:py-1 text-xs rounded-lg transition-all font-medium font-serif ${
                    language === 'ur'
                      ? 'bg-white text-[#262626] shadow-2xs font-semibold'
                      : 'text-[#77716A] hover:text-[#262626]'
                  }`}
                  aria-label="اردو میں تبدیل کریں"
                >
                  اردو
                </button>
              </div>

              {/* Cart Icon */}
              <Link
                to="/cart"
                className="relative p-2 rounded-xl text-[#262626] hover:bg-[#F3EEE5] transition-colors focus:outline-none"
                aria-label="Shopping Cart"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setMobileSearchOpen(false);
                }}
              >
                <ShoppingBag className="w-5 h-5 text-[#262626]" />
                {cartCount > 0 && (
                  <span className="absolute top-1 end-1 bg-[#C5A46D] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Book Appointment CTA (Desktop) */}
              <div className="hidden sm:block">
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleBookClick}
                  className="shadow-xs text-xs sm:text-sm"
                >
                  {t('nav.bookAppointment')}
                </Button>
              </div>

              {/* Mobile Hamburger Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(prev => !prev)}
                className="xl:hidden p-2 rounded-xl text-[#262626] hover:bg-[#F3EEE5] transition-colors focus:outline-none"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search Popover Strip */}
        {mobileSearchOpen && (
          <div className="lg:hidden px-4 py-3 bg-[#F3EEE5]/95 border-t border-[#E8E2D8] animate-in fade-in duration-200">
            <ConcernSearch variant="header" autoFocus />
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden fixed inset-x-0 top-20 bg-[#FAF8F3] border-b border-[#E8E2D8] shadow-xl animate-in slide-in-from-top-2 duration-200 max-h-[calc(100vh-5rem)] overflow-y-auto">
            <div className="px-5 py-6 space-y-4">
              {/* Search in mobile drawer */}
              <div className="mb-3">
                <ConcernSearch variant="hero" />
              </div>

              <nav className="flex flex-col space-y-1">
                {navLinks.map((link) => {
                  const active = isActive(link.to);
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                        active
                          ? 'bg-[#F3EEE5] text-[#9E7F47] border border-[#E8E2D8] font-semibold'
                          : 'text-[#262626] hover:bg-[#F3EEE5]/60'
                      }`}
                    >
                      <span>{link.label}</span>
                      <ChevronRight className={`w-4 h-4 text-[#C5A46D] transition-transform ${isRTL ? 'rotate-180' : ''}`} />
                    </Link>
                  );
                })}
              </nav>

              <div className="pt-4 border-t border-[#E8E2D8] flex flex-col gap-3">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleBookClick();
                  }}
                  className="w-full justify-center"
                >
                  {t('nav.bookAppointment')}
                </Button>

                <div className="flex items-center justify-between text-xs text-[#77716A] px-2 pt-2">
                  <span>{CLINIC_INFO.timings.hoursEn}</span>
                  <span className="text-[#9E7F47] font-semibold">
                    {isRTL ? "جمعہ بند" : "Closed Friday"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
