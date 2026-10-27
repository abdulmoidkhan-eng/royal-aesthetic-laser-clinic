import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, ShieldCheck, Clock, MapPin, CheckCircle2, ChevronRight, 
  X, Calendar
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { SEED_PRODUCTS } from '../data/seedProducts.js';
import { REVIEWS } from '../data/reviewsData.js';
import { CLINIC_INFO } from '../data/clinicInfo.js';
import { buildWhatsAppLink, getAppointmentBookingMessage } from '../utils/whatsapp.js';
import { getActiveServices, seedServicesIfNeeded } from '../firebase/servicesService.js';
import { SEED_SERVICES } from '../data/seedServices.js';
import { getReviews } from '../firebase/contentService.js';
import Button from '../components/UI/Button.jsx';
import Card from '../components/UI/Card.jsx';
import SectionHeader from '../components/UI/SectionHeader.jsx';
import Badge from '../components/UI/Badge.jsx';
import ServiceCard from '../components/ServiceCard.jsx';
import ConcernSearch from '../components/ConcernSearch.jsx';

export const HomePage = () => {
  const { language, isRTL, t, getLocalized } = useLanguage();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [services, setServices] = useState(SEED_SERVICES);
  const [products, setProducts] = useState(SEED_PRODUCTS);
  const [reviewsList, setReviewsList] = useState(REVIEWS);
  const [loadingServices, setLoadingServices] = useState(true);
  const [addedProductId, setAddedProductId] = useState(null);

  // Quick Concern Chips matching user requested starting keywords
  const concernChips = [
    { key: 'laser hair removal', labelEn: 'Laser Hair Removal/ Hair Reduction', labelUr: 'لیزر ہیئر ریموول / ہیئر ریڈکشن' },
    { key: 'pigmentation', labelEn: 'Pigmentation / Melasma', labelUr: 'پگمنٹیشن / میلازما' },
    { key: 'medicated hydrafacial', labelEn: 'Medicated HydraFacial', labelUr: 'میڈیکیٹڈ ہائیڈرا فیشل' },
    { key: 'face prp', labelEn: 'Face PRP + Micro-Needling', labelUr: 'فیس پی آر پی + مائیکرو نیڈلنگ' },
    { key: 'hair prp', labelEn: 'Hair PRP + Exosomes', labelUr: 'ہیئر پی آر پی + ایگزوسومز' },
    { key: 'hair transplant', labelEn: 'Hair Transplant', labelUr: 'ہیئر ٹرانسپلانٹ' },
    { key: 'botox', labelEn: 'Botox', labelUr: 'بوٹوکس' },
    { key: 'whitening drips', labelEn: 'Whitening Drips', labelUr: 'وائٹننگ ڈرپس' },
    { key: 'mole removal', labelEn: 'Mole Removal', labelUr: 'تل اور مسے ہٹانا' },
    { key: 'acne treatment', labelEn: 'Acne treatment', labelUr: 'ایکنی ٹریٹمنٹ' }
  ];

  // Load and seed services, products, gallery, and reviews from Firestore on mount
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [servicesData, productsData, reviewsData] = await Promise.all([
          getActiveServices().catch(() => SEED_SERVICES),
          getProducts().catch(() => SEED_PRODUCTS),
          getReviews().catch(() => REVIEWS)
        ]);

        if (isMounted) {
          if (servicesData && servicesData.length > 0) setServices(servicesData);
          if (productsData && productsData.length > 0) setProducts(productsData);
          if (reviewsData && reviewsData.length > 0) setReviewsList(reviewsData);
        }
      } catch (e) {
        console.warn('Error loading Firestore data, keeping seed data:', e);
      } finally {
        if (isMounted) setLoadingServices(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, []);

  const handleChipClick = (term) => {
    navigate(`/services?search=${encodeURIComponent(term)}`);
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

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FBF3F0] to-white pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-[#F4E4DE]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Eyebrow badge / Location pill */}
          <a
            href={CLINIC_INFO.googleMapsUrl || "https://maps.app.goo.gl/MQF1gR36KicZYmhu5"}
            target="_blank"
            rel="noopener noreferrer"
            title={isRTL ? "گوگل میپس پر کلینک کا مقام کھولیں" : "Open clinic location on Google Maps"}
            className="group inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/95 hover:bg-white border border-[#F4E4DE] hover:border-[#D9A38F] text-xs font-semibold text-[#3A3A3A] mb-6 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D9A38F] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D9A38F]"></span>
            </span>
            <MapPin className="w-3.5 h-3.5 text-[#D9A38F] shrink-0 group-hover:scale-110 transition-transform" />
            <span className="text-[#3A3A3A] group-hover:text-[#D9A38F] transition-colors">
              {isRTL ? "تھانہ مالاکنڈ، پل چوکی • بالمقابل میرال ریسٹورنٹ" : "Pul Chowki, Opp. Meeral Restaurant • Thana, Malakand"}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#D9A38F] bg-[#FBF3F0] px-2.5 py-0.5 rounded-full border border-[#F4E4DE] group-hover:bg-[#F4E4DE] transition-colors">
              <span>{isRTL ? "نقشہ دیکھیں" : "View on Maps"}</span>
              <span className="text-[10px]">↗</span>
            </span>
          </a>

          {/* Main Headline */}
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#3A3A3A] font-normal tracking-tight leading-[1.15] max-w-4xl mx-auto">
            {t('tagline')}
          </h1>

          {/* Subtitle */}
          <p className="mt-4 sm:mt-6 text-base sm:text-lg text-[#6B5B55] max-w-2xl mx-auto leading-relaxed">
            {t('heroSubtitle')}
          </p>

          {/* Reusable ConcernSearch Component */}
          <div className="mt-8 sm:mt-10">
            <ConcernSearch variant="hero" />

            {/* Quick Concern Filter Chips */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
              <span className="text-xs text-[#6B5B55] me-1">
                {isRTL ? "جلد کے عام مسائل:" : "Common concerns:"}
              </span>
              {concernChips.map((chip) => (
                <button
                  key={chip.key}
                  type="button"
                  onClick={() => handleChipClick(chip.key)}
                  className="text-xs px-3 py-1.5 rounded-full bg-white border border-[#F4E4DE] text-[#3A3A3A] hover:border-[#D9A38F] hover:bg-[#FBF3F0] transition-all"
                >
                  {isRTL ? chip.labelUr : chip.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Trust Features Strip */}
          <div className="mt-12 pt-8 border-t border-[#F4E4DE]/70 grid grid-cols-2 md:grid-cols-4 gap-4 text-start">
            <div className="flex items-center gap-3 p-2">
              <div className="w-10 h-10 rounded-xl bg-[#F4E4DE] flex items-center justify-center text-[#D9A38F] shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#3A3A3A]">
                  {isRTL ? "ماہر ڈاکٹر کی زیر نگرانی" : "Doctor Supervised"}
                </p>
                <p className="text-[11px] text-[#6B5B55]">
                  {isRTL ? "مصدقہ طبی پروٹوکولز" : "Certified Medical Protocols"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2">
              <div className="w-10 h-10 rounded-xl bg-[#F4E4DE] flex items-center justify-center text-[#D9A38F] shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#3A3A3A]">
                  {isRTL ? "درد کے بغیر جدید لیزر" : "Painless Laser Tech"}
                </p>
                <p className="text-[11px] text-[#6B5B55]">
                  {isRTL ? "آئس کولنگ ہینڈ پیس" : "Sapphire Contact Cooling"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2">
              <div className="w-10 h-10 rounded-xl bg-[#F4E4DE] flex items-center justify-center text-[#D9A38F] shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#3A3A3A]">
                  {isRTL ? "صبح 11 تا شام 5 بجے" : "11:00 AM - 5:00 PM"}
                </p>
                <p className="text-[11px] text-[#6B5B55]">
                  {isRTL ? "ہفتہ تا جمعرات (جمعہ بند)" : "Sat – Thu (Closed Fri)"}
                </p>
              </div>
            </div>

            <a
              href={CLINIC_INFO.googleMapsUrl || "https://maps.app.goo.gl/MQF1gR36KicZYmhu5"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/90 transition-all group cursor-pointer"
              title="Google Maps: Royal Aesthetic & Laser Clinic, Thana"
            >
              <div className="w-10 h-10 rounded-xl bg-[#F4E4DE] group-hover:bg-[#D9A38F] group-hover:text-white flex items-center justify-center text-[#D9A38F] shrink-0 transition-colors">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#3A3A3A] group-hover:text-[#D9A38F] transition-colors flex items-center gap-1">
                  <span>{isRTL ? "تھانہ، مالاکنڈ" : "Thana, Malakand"}</span>
                  <span className="text-[10px] text-[#D9A38F]">↗</span>
                </p>
                <p className="text-[11px] text-[#6B5B55]">
                  {isRTL ? "بالمقابل میرال ریسٹورنٹ (نقشہ)" : "Opp. Meeral Restaurant (Maps)"}
                </p>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* 2. Special 50% Offers Section */}
      <section className="py-10 sm:py-12 bg-gradient-to-b from-white via-[#FBF3F0]/70 to-white border-b border-[#F4E4DE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#FBF3F0] via-white to-[#F4E4DE]/60 border-2 border-[#D9A38F]/40 p-6 sm:p-10 shadow-xs">
            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              <div className="flex-1 text-start">
                <div className="flex flex-wrap items-center gap-2.5 mb-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D9A38F] text-white text-xs font-bold shadow-xs">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{t('offers.discountBadge')}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-[#D9A38F]/30 text-[#8C5E50] text-[11px] font-semibold">
                    <Clock className="w-3 h-3 text-[#D9A38F]" />
                    <span>{t('offers.badge')}</span>
                  </span>
                </div>

                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#3A3A3A] tracking-tight leading-tight">
                  {t('offers.title')}
                </h2>

                <p className="mt-3 text-sm sm:text-base text-[#6B5B55] max-w-2xl leading-relaxed">
                  {t('offers.subtitle')}
                </p>

                {/* Features checklist */}
                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-[#3A3A3A]">
                  {(t('offers.features') || []).map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto shrink-0">
                <a
                  href={buildWhatsAppLink(
                    isRTL
                      ? "السلام علیکم! میں رائل کلینک کی خصوصی آفر 'تمام اسکن پروسیجرز پر 50% رعایت + مفت ڈاکٹر معائنہ' حاصل کرنا چاہتا/چاہتی ہوں اور وقتِ ملاقات لینا چاہتا/چاہتی ہوں۔"
                      : "Hello! I would like to avail the 50% discount on all skin procedures + free doctor consultation offer at Royal Aesthetic Clinic and book an appointment."
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto"
                >
                  <Button variant="primary" size="lg" className="w-full justify-center shadow-md text-xs sm:text-sm">
                    <Sparkles className="w-4 h-4 me-1 text-white" />
                    <span>{t('offers.cta')}</span>
                  </Button>
                </a>

                <Link to="/services" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full justify-center text-xs sm:text-sm">
                    <span>{t('offers.viewTreatments')}</span>
                    <ChevronRight className={`w-4 h-4 ms-1 ${isRTL ? 'rotate-180' : ''}`} />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Popular Services Preview Section (Firestore backed) */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow={isRTL ? "طبی طریقہ علاج" : "Clinical Treatments"}
            title={isRTL ? "کلینک کے اہم علاج" : "Specialized Aesthetic & Laser Services"}
            subtitle={isRTL
              ? "بین الاقوامی معیار کی لیزر مشینوں اور ماہر معالج کے ہاتھوں محفوظ علاج۔"
              : "Doctor-performed procedures in Thana, Malakand (Hair Transplant at Islamabad branch)."}
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

      {/* 4. Featured Skincare Products Section */}
      <section className="py-16 sm:py-20 bg-[#FBF3F0]/60 border-y border-[#F4E4DE]">
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
              const imageUrl = product.images?.[0] || product.image || "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80";
              const isZero = !product.price || product.price === 0;

              return (
                <Card key={product.id} className="flex flex-col justify-between overflow-hidden p-0 border border-[#F4E4DE]">
                  <Link to={`/product/${product.id}`} className="block relative aspect-square bg-[#F4E4DE]/30 overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={name}
                      className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                        !isAvailable ? 'grayscale opacity-75' : ''
                      }`}
                      loading="lazy"
                    />
                    <div className="absolute top-3 end-3">
                      {!isAvailable ? (
                        <span className="bg-rose-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-md shadow-xs">
                          {isRTL ? "ختم شدہ" : "Out of stock"}
                        </span>
                      ) : (
                        <span className="bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md text-[10px] font-semibold text-[#3A3A3A]">
                          {product.category || product.size}
                        </span>
                      )}
                    </div>
                  </Link>

                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <Link to={`/product/${product.id}`}>
                        <h3 className="font-serif text-base font-semibold text-[#3A3A3A] hover:text-[#D9A38F] transition-colors line-clamp-1">
                          {name}
                        </h3>
                      </Link>

                      <p className="mt-1 text-xs text-[#6B5B55] line-clamp-2">
                        {description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#F4E4DE] flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] text-[#6B5B55] block">{t('products.price')}</span>
                        {isZero ? (
                          <span className="font-semibold text-xs text-[#D9A38F]">
                            {isRTL ? "قیمت کا تعین ایڈمن کرے گا" : "Price to be set by admin"}
                          </span>
                        ) : (
                          <span className="font-bold text-sm text-[#3A3A3A]">
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


      {/* 6. Patient Reviews Section */}
      <section className="py-16 sm:py-20 bg-[#FBF3F0]/40 border-t border-[#F4E4DE]">
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
                <Card key={review.id} className="flex flex-col justify-between">
                  <div>
                    <span className="text-xs text-[#6B5B55]">{review.date || 'Verified Patient'}</span>
                    <p className="text-sm text-[#3A3A3A] italic leading-relaxed mt-2">
                      "{comment}"
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#F4E4DE]">
                    <p className="font-serif font-semibold text-sm text-[#3A3A3A]">
                      {review.name}
                    </p>
                    <div className="flex items-center justify-between text-xs text-[#6B5B55] mt-0.5">
                      <span>{review.location || 'Malakand'}</span>
                      <span className="text-[#D9A38F] font-medium">{t('reviews.verifiedPatient')}</span>
                    </div>
                    {treatment && (
                      <p className="text-[11px] text-[#6B5B55] mt-1">
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

      {/* 7. Contact Strip */}
      <section className="py-16 bg-white border-t border-[#F4E4DE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-[#FBF3F0] via-white to-[#F4E4DE]/50 rounded-3xl p-6 sm:p-10 lg:p-12 border border-[#F4E4DE] shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <span className="text-xs font-semibold text-[#D9A38F] uppercase tracking-wider">
                  {t('contactStrip.title')}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#3A3A3A] mt-2">
                  {isRTL ? "ہم آپ کی خوبصورت جلد کے سفر میں ساتھ ہیں" : "Your Journey to Calm, Clear Skin Starts Here"}
                </h3>
                <p className="mt-3 text-sm text-[#6B5B55] leading-relaxed">
                  {t('contactStrip.subtitle')}
                </p>

                <div className="mt-6 space-y-3">
                  <div className="flex items-start gap-3 text-sm">
                    <MapPin className="w-5 h-5 text-[#D9A38F] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-[#3A3A3A]">{t('contactStrip.addressTitle')}:</span>
                      <p className="text-[#6B5B55]">{getLocalized(CLINIC_INFO.address)}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-sm">
                    <Clock className="w-5 h-5 text-[#D9A38F] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-[#3A3A3A]">{t('contactStrip.timingsTitle')}:</span>
                      <p className="text-[#6B5B55]">{getLocalized(CLINIC_INFO.timings)}</p>
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
              <div className="bg-white rounded-2xl p-6 border border-[#F4E4DE] shadow-xs text-start">
                <div className="flex items-center justify-between pb-4 border-b border-[#F4E4DE]">
                  <div>
                    <h4 className="font-serif font-semibold text-base text-[#3A3A3A]">
                      Royal Aesthetic Clinic Thana
                    </h4>
                    <p className="text-xs text-[#6B5B55]">
                      Opposite Meeral Restaurant, Pul Chowki
                    </p>
                  </div>
                  <Badge variant="success" className="text-[10px]">
                    {isRTL ? "اوپن 11 تا 5" : "Open 11am-5pm"}
                  </Badge>
                </div>

                <div className="py-4 space-y-2 text-xs text-[#6B5B55]">
                  <div className="flex justify-between">
                    <span>{isRTL ? "علاقہ:" : "District / Region:"}</span>
                    <span className="font-medium text-[#3A3A3A]">Malakand, KPK</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isRTL ? "قریبی نمایاں جگہ:" : "Landmark:"}</span>
                    <span className="font-medium text-[#3A3A3A]">Meeral Restaurant, Thana</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isRTL ? "جمعہ:" : "Friday:"}</span>
                    <span className="font-semibold text-rose-700">{isRTL ? "بند ہے" : "Weekly Off"}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#F4E4DE]">
                  <a
                    href={CLINIC_INFO.googleMapsUrl || "https://maps.app.goo.gl/MQF1gR36KicZYmhu5"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#FBF3F0] hover:bg-[#F4E4DE] text-xs font-semibold text-[#3A3A3A] hover:text-[#D9A38F] border border-[#F4E4DE] transition-all shadow-2xs group"
                  >
                    <MapPin className="w-4 h-4 text-[#D9A38F] group-hover:scale-110 transition-transform" />
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
