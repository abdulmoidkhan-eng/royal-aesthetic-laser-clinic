import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag, Sparkles, ChevronRight, Search } from 'lucide-react';
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
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#F4E4DE] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-3">
            {/* Logo / Brand Name */}
            <Link
              to="/"
              className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none shrink-0"
              onClick={() => {
                setMobileMenuOpen(false);
                setMobileSearchOpen(false);
              }}
            >
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-xs border border-[#F4E4DE] bg-white group-hover:scale-105 transition-transform shrink-0 flex items-center justify-center p-0.5">
                <img 
                  src="/assets/aistudio/Golden_Crowned_R_Emblem_44ae7f4a.png" 
                  alt="Royal Aesthetic & Laser Clinic Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col text-start">
                <span 
                  className="font-serif font-bold text-[21px] not-italic tracking-tight text-[#3A3A3A] group-hover:text-[#D9A38F] transition-colors leading-tight"
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontWeight: 'bold',
                    fontStyle: 'normal',
                    fontSize: '21px'
                  }}
                >
                  Royal Aesthetic
                </span>
                <span className="text-[10px] sm:text-xs text-[#6B5B55] tracking-widest uppercase">
                  & Laser Clinic
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-1">
              {navLinks.map((link) => {
                const active = isActive(link.to);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      active
                        ? 'text-[#D9A38F] bg-[#FBF3F0] font-semibold'
                        : 'text-[#3A3A3A] hover:text-[#D9A38F] hover:bg-[#FBF3F0]/60'
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
                className="lg:hidden p-2 rounded-xl text-[#3A3A3A] hover:bg-[#FBF3F0] transition-colors"
                aria-label="Toggle Concern Search"
              >
                <Search className="w-5 h-5 text-[#D9A38F]" />
              </button>

              {/* Language Switch: EN | اردو */}
              <div className="flex items-center bg-[#FBF3F0] rounded-xl p-1 border border-[#F4E4DE]">
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`px-2 py-0.5 sm:px-2.5 sm:py-1 text-xs rounded-lg transition-all font-medium ${
                    language === 'en'
                      ? 'bg-white text-[#3A3A3A] shadow-xs font-semibold'
                      : 'text-[#6B5B55] hover:text-[#3A3A3A]'
                  }`}
                  aria-label="Switch to English"
                >
                  EN
                </button>
                <span className="text-[#D9A38F] text-xs px-0.5">|</span>
                <button
                  type="button"
                  onClick={() => setLanguage('ur')}
                  className={`px-2 py-0.5 sm:px-2.5 sm:py-1 text-xs rounded-lg transition-all font-medium font-serif ${
                    language === 'ur'
                      ? 'bg-white text-[#3A3A3A] shadow-xs font-semibold'
                      : 'text-[#6B5B55] hover:text-[#3A3A3A]'
                  }`}
                  aria-label="اردو میں تبدیل کریں"
                >
                  اردو
                </button>
              </div>

              {/* Cart Icon */}
              <Link
                to="/cart"
                className="relative p-2 rounded-xl text-[#3A3A3A] hover:bg-[#FBF3F0] transition-colors focus:outline-none"
                aria-label="Shopping Cart"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setMobileSearchOpen(false);
                }}
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute top-1 end-1 bg-[#D9A38F] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
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
                className="xl:hidden p-2 rounded-xl text-[#3A3A3A] hover:bg-[#FBF3F0] transition-colors focus:outline-none"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search Popover Strip */}
        {mobileSearchOpen && (
          <div className="lg:hidden px-4 py-3 bg-[#FBF3F0]/90 border-t border-[#F4E4DE] animate-in fade-in duration-200">
            <ConcernSearch variant="header" autoFocus />
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden fixed inset-x-0 top-20 bg-white border-b border-[#F4E4DE] shadow-xl animate-in slide-in-from-top-2 duration-200 max-h-[calc(100vh-5rem)] overflow-y-auto">
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
                          ? 'bg-[#FBF3F0] text-[#D9A38F] font-semibold'
                          : 'text-[#3A3A3A] hover:bg-[#FBF3F0]/60'
                      }`}
                    >
                      <span>{link.label}</span>
                      <ChevronRight className={`w-4 h-4 text-[#D9A38F] transition-transform ${isRTL ? 'rotate-180' : ''}`} />
                    </Link>
                  );
                })}
              </nav>

              <div className="pt-4 border-t border-[#F4E4DE] flex flex-col gap-3">
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

                <div className="flex items-center justify-between text-xs text-[#6B5B55] px-2 pt-2">
                  <span>{CLINIC_INFO.timings.hoursEn}</span>
                  <span className="text-amber-700 font-medium">
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
