import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, Calendar, ShieldCheck, Clock, MapPin, 
  ChevronRight, ArrowRight, MessageCircle, Star, CheckCircle2, ShoppingBag 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { getActiveServices } from '../firebase/servicesService.js';
import { getProducts } from '../firebase/shopService.js';
import { getReviews } from '../firebase/contentService.js';
import { SEED_SERVICES } from '../data/seedServices.js';
import { SEED_PRODUCTS } from '../data/seedProducts.js';
import { CLINIC_INFO } from '../data/clinicInfo.js';
import { buildWhatsAppLink, getAppointmentBookingMessage } from '../utils/whatsapp.js';
import ServiceCard from '../components/ServiceCard.jsx';
import ConcernSearch from '../components/ConcernSearch.jsx';
import SectionHeader from '../components/UI/SectionHeader.jsx';
import Button from '../components/UI/Button.jsx';
import Card from '../components/UI/Card.jsx';
import Badge from '../components/UI/Badge.jsx';
import OptimizedImage from '../components/UI/OptimizedImage.jsx';

export const HomePage = () => {
  const { language, isRTL, t, getLocalized } = useLanguage();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [services, setServices] = useState(SEED_SERVICES);
  const [products, setProducts] = useState(SEED_PRODUCTS);
  const [reviewsList, setReviewsList] = useState([]);
  const [addedProductId, setAddedProductId] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [servicesData, prodsData, reviewsData] = await Promise.all([
          getActiveServices(),
          getProducts(),
          getReviews()
        ]);
        if (isMounted) {
          if (servicesData && servicesData.length > 0) setServices(servicesData);
          if (prodsData && prodsData.length > 0) setProducts(prodsData);
          if (reviewsData && reviewsData.length > 0) setReviewsList(reviewsData);
        }
      } catch (err) {
        console.warn('Could not load homepage data from Firestore:', err);
      }
    }

    // Defer network sync to idle time so FCP and LCP render uninterrupted
    let timerId = null;
    let idleId = null;
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(() => {
        loadData();
      }, { timeout: 2000 });
    } else {
      timerId = setTimeout(loadData, 600);
    }

    return () => {
      isMounted = false;
      if (idleId && window.cancelIdleCallback) window.cancelIdleCallback(idleId);
      if (timerId) clearTimeout(timerId);
    };
  }, []);

  const concernChips = [
    { key: "acne", labelEn: "Acne & Pimples", labelUr: "ایکنی اور دانے" },
    { key: "laser", labelEn: "Laser Hair Removal", labelUr: "لیزر ہیئر ریموول" },
    { key: "pigmentation", labelEn: "Pigmentation / Melasma", labelUr: "چھائیاں / پگمنٹیشن" },
    { key: "glow", labelEn: "HydraFacial Glow", labelUr: "ہائیڈرا فیشل گلو" },
    { key: "hair", labelEn: "Hair Loss / PRP", labelUr: "گرتے بالوں کا علاج" }
  ];

  const handleChipClick = (concernKey) => {
    navigate(`/services?search=${encodeURIComponent(concernKey)}`);
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 1800);
  };

  const handleBookService = (service) => {
    const name = getLocalized(service.name);
    const msg = getAppointmentBookingMessage(name, language);
    window.open(buildWhatsAppLink(msg), '_blank', 'noopener,noreferrer');
  };

  const handleGeneralBook = () => {
    const msg = getAppointmentBookingMessage('', language);
    window.open(buildWhatsAppLink(msg), '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F3] text-[#262626]">
      {/* 1. Royal Luxury Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF8F3] via-[#F3EEE5]/40 to-[#FAF8F3] pt-8 pb-12 sm:pt-20 sm:pb-24 border-b border-[#E8E2D8]">
        {/* Decorative subtle ambient luxury lighting */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-[#C5A46D]/10 via-[#FAF8F3]/5 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Eyebrow Location Pill (Responsive on small mobile screens) */}
          <a
            href={CLINIC_INFO.googleMapsUrl || "https://maps.app.goo.gl/MQF1gR36KicZYmhu5"}
            target="_blank"
            rel="noopener noreferrer"
            title={isRTL ? "گوگل میپس پر کلینک کا مقام کھولیں" : "Open clinic location on Google Maps"}
            className="group inline-flex items-center gap-2 sm:gap-2.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/95 hover:bg-white border border-[#E8E2D8] hover:border-[#C5A46D] text-[11px] sm:text-xs font-medium text-[#262626] mb-5 sm:mb-6 shadow-2xs hover:shadow-xs transition-all duration-200 cursor-pointer max-w-full"
          >
            <span className="flex h-2 w-2 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C5A46D] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C5A46D]"></span>
            </span>
            <MapPin className="w-3.5 h-3.5 text-[#C5A46D] shrink-0 group-hover:scale-110 transition-transform" />
            <span className="text-[#262626] group-hover:text-[#9E7F47] transition-colors truncate max-w-[210px] xs:max-w-none">
              {isRTL ? "تھانہ مالاکنڈ، پل چوکی • بالمقابل میرال ریسٹورنٹ" : "Pul Chowki, Opp. Meeral Restaurant • Thana, Malakand"}
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-[#9E7F47] bg-[#F3EEE5] px-2 sm:px-2.5 py-0.5 rounded-full border border-[#E8E2D8] group-hover:bg-[#EAE2D3] transition-colors shrink-0">
              <span>{isRTL ? "نقشہ" : "Maps"}</span>
              <span className="text-[10px]">↗</span>
            </span>
          </a>

          {/* Main Headline */}
          <h1 className="font-serif text-[26px] xs:text-3xl sm:text-5xl md:text-6xl text-[#262626] font-normal tracking-tight leading-[1.2] sm:leading-[1.15] max-w-4xl mx-auto px-1 sm:px-0">
            {t('tagline')}
          </h1>

          {/* Subtitle */}
          <p className="mt-3.5 sm:mt-6 text-sm sm:text-lg text-[#77716A] max-w-2xl mx-auto leading-relaxed px-2 sm:px-0">
            {t('heroSubtitle')}
          </p>

          {/* ConcernSearch Component (Prominently visible on mobile phones & desktop) */}
          <div className="mt-5 sm:mt-7 max-w-2xl mx-auto w-full px-1 sm:px-0">
            <ConcernSearch variant="hero" />

            {/* Quick Concern Filter Chips */}
            <div className="mt-3 sm:mt-3.5 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
              <span className="text-xs text-[#77716A] me-1">
                {isRTL ? "جلد کے عام مسائل:" : "Common skin concerns:"}
              </span>
              {concernChips.map((chip) => (
                <button
                  key={chip.key}
                  type="button"
                  onClick={() => handleChipClick(chip.key)}
                  className="text-[11px] sm:text-xs px-3 sm:px-3.5 py-1.5 rounded-full bg-white border border-[#E8E2D8] text-[#262626] hover:border-[#C5A46D] hover:bg-[#FAF8F3] transition-all cursor-pointer shadow-2xs active:scale-95"
                >
                  {isRTL ? chip.labelUr : chip.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Hero Action CTAs (Mobile Stacked / Touch-Friendly) */}
          <div className="mt-6 sm:mt-8 flex flex-col xs:flex-row items-stretch xs:items-center justify-center gap-2.5 sm:gap-3.5 w-full max-w-xl mx-auto">
            <Button
              variant="primary"
              size="lg"
              onClick={handleGeneralBook}
              className="w-full xs:w-auto shadow-sm hover:shadow-md gap-2 justify-center min-h-[46px]"
            >
              <Calendar className="w-4 h-4 text-white" />
              <span>{isRTL ? "وقتِ ملاقات بک کریں" : "Book Doctor Appointment"}</span>
            </Button>
            <Link to="/services" className="w-full xs:w-auto">
              <Button
                variant="secondary"
                size="lg"
                className="w-full xs:w-auto gap-2 justify-center min-h-[46px]"
              >
                <span>{isRTL ? "تمام علاج دیکھیں" : "Explore Treatments"}</span>
                <ChevronRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
              </Button>
            </Link>
            <Link to="/shop" className="w-full xs:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full xs:w-auto gap-2 justify-center min-h-[46px] border-[#C5A46D] text-[#262626] hover:bg-[#F3EEE5] shadow-2xs"
              >
                <ShoppingBag className="w-4 h-4 text-[#C5A46D]" />
                <span>{isRTL ? "اسکن شاپ" : "Shop Skincare"}</span>
              </Button>
            </Link>
          </div>

          {/* Trust Features Strip (Responsive mobile cards) */}
          <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-[#E8E2D8] grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 text-start">
            <div className="flex items-center gap-3 p-3 sm:p-2 rounded-2xl bg-white/70 xs:bg-transparent border border-[#E8E2D8] xs:border-0 shadow-2xs xs:shadow-none">
              <div className="w-10 h-10 rounded-xl bg-[#F3EEE5] border border-[#E8E2D8] flex items-center justify-center text-[#C5A46D] shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#262626]">
                  {isRTL ? "ماہر ڈاکٹر کی زیر نگرانی" : "Doctor Supervised"}
                </p>
                <p className="text-[11px] text-[#77716A]">
                  {isRTL ? "مصدقہ طبی پروٹوکولز" : "Certified Medical Protocols"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 sm:p-2 rounded-2xl bg-white/70 xs:bg-transparent border border-[#E8E2D8] xs:border-0 shadow-2xs xs:shadow-none">
              <div className="w-10 h-10 rounded-xl bg-[#F3EEE5] border border-[#E8E2D8] flex items-center justify-center text-[#C5A46D] shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#262626]">
                  {isRTL ? "درد کے بغیر جدید لیزر" : "Painless Laser Tech"}
                </p>
                <p className="text-[11px] text-[#77716A]">
                  {isRTL ? "آئس کولنگ ہینڈ پیس" : "Sapphire Contact Cooling"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 sm:p-2 rounded-2xl bg-white/70 xs:bg-transparent border border-[#E8E2D8] xs:border-0 shadow-2xs xs:shadow-none">
              <div className="w-10 h-10 rounded-xl bg-[#F3EEE5] border border-[#E8E2D8] flex items-center justify-center text-[#C5A46D] shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#262626]">
                  {isRTL ? "صبح 11 تا شام 5 بجے" : "11:00 AM - 5:00 PM"}
                </p>
                <p className="text-[11px] text-[#77716A]">
                  {isRTL ? "ہفتہ تا جمعرات (جمعہ بند)" : "Sat – Thu (Closed Fri)"}
                </p>
              </div>
            </div>

            <a
              href={CLINIC_INFO.googleMapsUrl || "https://maps.app.goo.gl/MQF1gR36KicZYmhu5"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 sm:p-2 rounded-2xl bg-white/70 xs:bg-transparent hover:bg-white border border-[#E8E2D8] xs:border-0 shadow-2xs xs:shadow-none transition-all group cursor-pointer"
              title="Google Maps: Royal Aesthetic & Laser Clinic, Thana"
            >
              <div className="w-10 h-10 rounded-xl bg-[#F3EEE5] group-hover:bg-[#C5A46D] group-hover:text-white border border-[#E8E2D8] flex items-center justify-center text-[#C5A46D] shrink-0 transition-colors">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#262626] group-hover:text-[#9E7F47] transition-colors flex items-center gap-1">
                  <span>{isRTL ? "تھانہ، مالاکنڈ" : "Thana, Malakand"}</span>
                  <span className="text-[10px] text-[#C5A46D]">↗</span>
                </p>
                <p className="text-[11px] text-[#77716A]">
                  {isRTL ? "بالمقابل میرال ریسٹورنٹ (نقشہ)" : "Opp. Meeral Restaurant (Maps)"}
                </p>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* 2. Specialized Aesthetic & Laser Treatments Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow={isRTL ? "طبی طریقہ علاج" : "Clinical Treatments"}
            title={isRTL ? "کلینک کے اہم علاج" : "Specialized Aesthetic & Laser Services"}
            subtitle={isRTL
              ? "بین الاقوامی معیار کی لیزر مشینوں اور ماہر معالج کے ہاتھوں محفوظ علاج۔"
              : "Doctor-performed procedures in Thana, Malakand."}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {services.slice(0, 6).map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onBookAppointment={handleBookService}
              />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/services">
              <Button variant="secondary" size="lg" className="gap-2">
                <span>{isRTL ? `تمام (${services.length || 10}) کلینیکل طریقہ علاج دیکھیں` : `Explore All (${services.length || 10}) Clinical Treatments`}</span>
                <ChevronRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Featured Skincare Products Section (Dispensary) */}
      <section className="py-16 sm:py-24 bg-[#FAF8F3] border-y border-[#E8E2D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow={isRTL ? "طبی اسکن کیئر" : "Clinical Dispensary"}
            title={t('products.featuredTitle')}
            subtitle={t('products.featuredSubtitle')}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map((product) => {
              const name = getLocalized(product.name);
              const description = getLocalized(product.description);
              const isAvailable = product.inStock !== false;
              const imageUrl = product.images?.[0] || product.image || "/assets/aistudio/Golden_Crowned_R_Emblem_44ae7f4a.png";
              const isZero = !product.price || product.price === 0;

              return (
                <Card key={product.id} className="flex flex-col justify-between overflow-hidden p-0 border border-[#E8E2D8] bg-white group hover:border-[#C5A46D] hover:shadow-lg transition-all duration-300">
                  <Link to={`/product/${product.id}`} className="block relative aspect-square bg-[#F3EEE5] overflow-hidden">
                    <OptimizedImage
                      src={imageUrl}
                      alt={name}
                      width="500"
                      height="500"
                      className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                        !isAvailable ? 'grayscale opacity-75' : ''
                      }`}
                    />
                    <div className="absolute top-3 end-3">
                      {!isAvailable ? (
                        <span className="bg-rose-700 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-md shadow-xs">
                          {isRTL ? "ختم شدہ" : "Out of stock"}
                        </span>
                      ) : (
                        <span className="bg-white/95 backdrop-blur-xs px-2.5 py-0.5 rounded-md text-[10px] font-medium text-[#262626] border border-[#E8E2D8]">
                          {product.category || product.size}
                        </span>
                      )}
                    </div>
                  </Link>

                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <Link to={`/product/${product.id}`}>
                        <h3 className="font-serif text-base font-semibold text-[#262626] hover:text-[#C5A46D] transition-colors line-clamp-1">
                          {name}
                        </h3>
                      </Link>

                      <p className="mt-1.5 text-xs text-[#77716A] line-clamp-2 leading-relaxed">
                        {description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#E8E2D8] flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] text-[#77716A] block font-medium">{t('products.price')}</span>
                        {isZero ? (
                          <span className="font-semibold text-xs text-[#9E7F47]">
                            {isRTL ? "قیمت کا تعین ایڈمن کرے گا" : "Price to be set by admin"}
                          </span>
                        ) : (
                          <span className="font-bold text-sm text-[#262626]">
                            {product.price.toLocaleString()} PKR
                          </span>
                        )}
                      </div>

                      <Button
                        variant={addedProductId === product.id ? "dark" : (isAvailable ? "primary" : "secondary")}
                        size="sm"
                        disabled={!isAvailable}
                        onClick={() => handleAddToCart(product)}
                        className="text-xs shrink-0"
                      >
                        {!isAvailable
                          ? (isRTL ? "ختم" : "Out of stock")
                          : (addedProductId === product.id ? t('products.added') : t('products.addToCart'))}
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="mt-10 text-center">
            <Link to="/shop">
              <Button variant="outline" size="md">
                {t('products.viewShop')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Patient Reviews Section */}
      <section className="py-16 sm:py-24 bg-white border-b border-[#E8E2D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow={isRTL ? "مریضوں کا تاثر" : "Patient Voices"}
            title={t('reviews.title')}
            subtitle={t('reviews.subtitle')}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviewsList.slice(0, 3).map((review) => {
              const comment = review.textEn 
                ? (isRTL ? (review.textUr || review.textEn) : review.textEn)
                : getLocalized(review.comment);
              const treatment = review.service || review.treatment?.en
                ? (isRTL ? (review.treatment?.ur || review.service) : (review.treatment?.en || review.service))
                : '';

              return (
                <Card key={review.id} className="flex flex-col justify-between border border-[#E8E2D8] bg-[#FAF8F3]">
                  <div>
                    <span className="text-xs text-[#77716A]">{review.date || 'Verified Patient'}</span>
                    <p className="text-sm text-[#262626] italic leading-relaxed mt-2.5">
                      "{comment}"
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#E8E2D8]">
                    <p className="font-serif font-semibold text-sm text-[#262626]">
                      {review.name}
                    </p>
                    <div className="flex items-center justify-between text-xs text-[#77716A] mt-0.5">
                      <span>{review.location || 'Malakand'}</span>
                      <span className="text-[#9E7F47] font-semibold">{t('reviews.verifiedPatient')}</span>
                    </div>
                    {treatment && (
                      <p className="text-[11px] text-[#77716A] mt-1">
                        {treatment}
                      </p>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Contact & Location Card */}
      <section className="py-16 sm:py-20 bg-[#FAF8F3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-[#F3EEE5] via-white to-[#F3EEE5] rounded-3xl p-6 sm:p-10 lg:p-12 border border-[#E8E2D8] shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <span className="text-xs font-semibold text-[#9E7F47] uppercase tracking-[0.2em]">
                  {t('contactStrip.title')}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#262626] mt-2">
                  {isRTL ? "ہم آپ کی خوبصورت جلد کے سفر میں ساتھ ہیں" : "Your Journey to Calm, Clear Skin Starts Here"}
                </h3>
                <p className="mt-3 text-sm text-[#77716A] leading-relaxed">
                  {t('contactStrip.subtitle')}
                </p>

                <div className="mt-6 space-y-3">
                  <div className="flex items-start gap-3 text-sm">
                    <MapPin className="w-5 h-5 text-[#C5A46D] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-[#262626]">{t('contactStrip.addressTitle')}:</span>
                      <p className="text-[#77716A]">{getLocalized(CLINIC_INFO.address)}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-sm">
                    <Clock className="w-5 h-5 text-[#C5A46D] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-[#262626]">{t('contactStrip.timingsTitle')}:</span>
                      <p className="text-[#77716A]">{getLocalized(CLINIC_INFO.timings)}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link to="/contact">
                    <Button variant="primary" size="md">
                      {isRTL ? "کلینک کا وقتِ ملاقات لیں" : "Book an Appointment"}
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Clinic Location Graphic Card */}
              <div className="bg-white rounded-2xl p-6 border border-[#E8E2D8] shadow-xs text-start">
                <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D8]">
                  <div>
                    <h4 className="font-serif font-semibold text-base text-[#262626]">
                      Royal Aesthetic Clinic Thana
                    </h4>
                    <p className="text-xs text-[#77716A]">
                      Opposite Meeral Restaurant, Pul Chowki
                    </p>
                  </div>
                  <Badge variant="success" className="text-[10px]">
                    {isRTL ? "اوپن 11 تا 5" : "Open 11am-5pm"}
                  </Badge>
                </div>

                <div className="py-4 space-y-2.5 text-xs text-[#77716A]">
                  <div className="flex justify-between">
                    <span>{isRTL ? "علاقہ:" : "District / Region:"}</span>
                    <span className="font-medium text-[#262626]">Malakand, KPK</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isRTL ? "قریبی نمایاں جگہ:" : "Landmark:"}</span>
                    <span className="font-medium text-[#262626]">Meeral Restaurant, Thana</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isRTL ? "جمعہ:" : "Friday:"}</span>
                    <span className="font-semibold text-rose-700">{isRTL ? "بند ہے" : "Weekly Off"}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E8E2D8]">
                  <a
                    href={CLINIC_INFO.googleMapsUrl || "https://maps.app.goo.gl/MQF1gR36KicZYmhu5"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#FAF8F3] hover:bg-[#F3EEE5] text-xs font-semibold text-[#262626] hover:text-[#9E7F47] border border-[#E8E2D8] transition-all shadow-2xs group"
                  >
                    <MapPin className="w-4 h-4 text-[#C5A46D] group-hover:scale-110 transition-transform" />
                    <span>{isRTL ? "گوگل میپس پر کلینک لوکیشن کھولیں" : "Open in Google Maps"}</span>
                    <span className="text-xs">↗</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
