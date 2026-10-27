import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Sparkles, MessageCircle, Filter, Calendar } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { getActiveServices } from '../firebase/servicesService.js';
import { SEED_SERVICES } from '../data/seedServices.js';
import { CLINIC_INFO } from '../data/clinicInfo.js';
import { buildWhatsAppLink, getAppointmentBookingMessage } from '../utils/whatsapp.js';
import SectionHeader from '../components/UI/SectionHeader.jsx';
import ServiceCard from '../components/ServiceCard.jsx';
import ConcernSearch from '../components/ConcernSearch.jsx';
import Button from '../components/UI/Button.jsx';

export const ServicesPage = () => {
  const { language, isRTL, t, getLocalized } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('search') || '';
  const navigate = useNavigate();

  const [services, setServices] = useState(SEED_SERVICES);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [currentQuery, setCurrentQuery] = useState(queryParam);

  useEffect(() => {
    setCurrentQuery(queryParam);
  }, [queryParam]);

  useEffect(() => {
    let isMounted = true;
    async function fetchServices() {
      try {
        const data = await getActiveServices();
        if (isMounted && data && data.length > 0) {
          setServices(data);
        }
      } catch (err) {
        console.warn('Could not load services from Firestore, using seed:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchServices();
    return () => { isMounted = false; };
  }, []);

  const categories = [
    { id: 'all', labelEn: 'All Procedures (10)', labelUr: 'تمام طریقہ علاج (10)' },
    { id: 'laser', labelEn: 'Laser Hair Reduction', labelUr: 'لیزر ہیئر ریڈکشن' },
    { id: 'pigmentation', labelEn: 'Pigmentation & Melasma', labelUr: 'پگمنٹیشن و میلازما' },
    { id: 'facial', labelEn: 'Medicated HydraFacial', labelUr: 'میڈیکیٹڈ فیشل' },
    { id: 'skin-rejuvenation', labelEn: 'Face PRP & Microneedling', labelUr: 'فیس پی آر پی و مائیکرو نیڈلنگ' },
    { id: 'hair-restoration', labelEn: 'Hair PRP & Exosomes', labelUr: 'ہیئر پی آر پی و ایگزوسومز' },
    { id: 'surgical', labelEn: 'Hair Transplant', labelUr: 'ہیئر ٹرانسپلانٹ' },
    { id: 'injectables', labelEn: 'Botox', labelUr: 'بوٹوکس' },
    { id: 'iv-therapy', labelEn: 'Whitening Drips', labelUr: 'وائٹننگ ڈرپس' },
    { id: 'minor-procedure', labelEn: 'Mole Removal', labelUr: 'تل اور مسے ہٹانا' },
    { id: 'acne-care', labelEn: 'Acne treatment', labelUr: 'ایکنی ٹریٹمنٹ' }
  ];

  // Filtering based on category and query (matching case-insensitive across nameEn, nameUr, and keywords)
  const filteredServices = useMemo(() => {
    const q = currentQuery.trim().toLowerCase();

    return services.filter((service) => {
      if (!service.active) return false;

      const matchesCat = activeCategory === 'all' || service.category === activeCategory;

      if (!q) return matchesCat;

      const nameEn = (service.name?.en || '').toLowerCase();
      const nameUr = (service.name?.ur || '').toLowerCase();
      const descEn = (service.shortDescription?.en || '').toLowerCase();
      const descUr = (service.shortDescription?.ur || '').toLowerCase();
      const keywords = (service.keywords || []).map(k => k.toLowerCase());

      const matchesSearch = 
        nameEn.includes(q) || 
        nameUr.includes(q) || 
        descEn.includes(q) || 
        descUr.includes(q) || 
        keywords.some(k => k.includes(q) || q.includes(k));

      return matchesCat && matchesSearch;
    });
  }, [services, activeCategory, currentQuery]);

  const handleBookAppointment = (service) => {
    const name = getLocalized(service.name);
    const msg = getAppointmentBookingMessage(name, language);
    window.open(buildWhatsAppLink(msg), '_blank', 'noopener,noreferrer');
  };

  const handleSearchSubmit = (newQuery) => {
    setSearchParams({ search: newQuery });
  };

  const handleClearSearch = () => {
    setCurrentQuery('');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-white py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          as="h1"
          eyebrow={isRTL ? "ہماری کلینیکل خدمات" : "Doctor-Performed Treatments"}
          title={isRTL ? "جلد اور لیزر کے تمام طریقہ علاج" : "Complete Aesthetic, Laser & Hair Solutions"}
          subtitle={isRTL
            ? "تھانہ مالاکنڈ کلینک میں تمام جدید ترین طریقہ علاج۔"
            : "Conducted under medical protocols in Thana, Malakand."}
        />

        {/* Concern Search in Services Page */}
        <div className="mb-8 max-w-2xl mx-auto">
          <ConcernSearch
            variant="hero"
            initialQuery={currentQuery}
            onSearchSubmit={handleSearchSubmit}
          />

          {currentQuery && (
            <div className="mt-3 flex items-center justify-between text-xs px-2 text-[#6B5B55]">
              <span>
                {isRTL ? `تلاش کے نتائج برائے: "${currentQuery}"` : `Showing treatments matching: "${currentQuery}"`}
              </span>
              <button
                type="button"
                onClick={handleClearSearch}
                className="text-[#D9A38F] hover:underline font-semibold"
              >
                {isRTL ? "فلٹر ختم کریں" : "Clear filter"}
              </button>
            </div>
          )}
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                activeCategory === cat.id
                  ? 'bg-[#D9A38F] text-white shadow-xs font-semibold'
                  : 'bg-[#FBF3F0] text-[#3A3A3A] hover:bg-[#F4E4DE]'
              }`}
            >
              {isRTL ? cat.labelUr : cat.labelEn}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-96 rounded-2xl bg-[#FBF3F0]/60 animate-pulse border border-[#F4E4DE]" />
            ))}
          </div>
        ) : filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onBookAppointment={handleBookAppointment}
              />
            ))}
          </div>
        ) : (
          /* Empty Search Results with WhatsApp fallback button */
          <div className="text-center py-16 bg-[#FBF3F0]/60 rounded-3xl max-w-xl mx-auto p-8 border border-[#F4E4DE]">
            <div className="w-12 h-12 rounded-full bg-[#F4E4DE] text-[#D9A38F] flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-[#3A3A3A]">
              {isRTL ? "اس مسئلے کے لیے کوئی سروس نہیں ملی" : "No treatments match your concern"}
            </h3>
            <p className="text-sm text-[#6B5B55] mt-2 mb-6">
              {isRTL 
                ? "ہمارے کلینک میں مریض کی ضرورت کے مطابق کسٹم علاج تیار کیا جاتا ہے۔ براہ راست واٹس ایپ پر ڈاکٹر سے پوچھیں:"
                : "Every individual's skin is unique. Chat directly with our clinic coordinator about your concern:"}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={buildWhatsAppLink(`Doctor consultation inquiry regarding: ${currentQuery || "General Skin Inquiry"}`)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="whatsapp" size="md">
                  <MessageCircle className="w-4 h-4 me-2" />
                  <span>{isRTL ? "اپنے مسئلے کے بارے میں ہم سے پوچھیں" : "Ask us about your concern"}</span>
                </Button>
              </a>
              <Button
                variant="outline"
                size="md"
                onClick={handleClearSearch}
              >
                {isRTL ? "تمام علاج دکھائیں" : "View All Treatments"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesPage;
