import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Clock, Calendar, ShieldCheck, ArrowLeft, ArrowRight, 
  CheckCircle2, MessageCircle, AlertCircle, MapPin, Sparkles, HelpCircle 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { getServiceById } from '../firebase/servicesService.js';
import { SEED_SERVICES } from '../data/seedServices.js';
import { SERVICE_FAQS } from '../data/serviceFaqs.js';
import { CLINIC_INFO } from '../data/clinicInfo.js';
import { buildWhatsAppLink, getAppointmentBookingMessage } from '../utils/whatsapp.js';
import Button from '../components/UI/Button.jsx';
import Card from '../components/UI/Card.jsx';
import Badge from '../components/UI/Badge.jsx';
import OptimizedImage from '../components/UI/OptimizedImage.jsx';

export const ServiceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language, isRTL, t, getLocalized } = useLanguage();

  const [service, setService] = useState(() => {
    return SEED_SERVICES.find(s => s.id === id) || null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadDetail() {
      try {
        const data = await getServiceById(id);
        if (isMounted && data) {
          setService(data);
        }
      } catch (err) {
        console.warn('Error loading service by id:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadDetail();
    return () => { isMounted = false; };
  }, [id]);

  if (!service && !loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center bg-[#FAF8F3]">
        <h2 className="font-serif text-2xl text-[#262626]">
          {isRTL ? "علاج نہیں ملا" : "Treatment Not Found"}
        </h2>
        <p className="text-sm text-[#77716A] mt-2 mb-6">
          {isRTL ? "مطلوبہ طریقہ علاج فہرست میں دستیاب نہیں۔" : "The requested procedure does not exist in our menu."}
        </p>
        <Link to="/services">
          <Button variant="primary">
            {isRTL ? "تمام علاج دیکھیں" : "Browse All Treatments"}
          </Button>
        </Link>
      </div>
    );
  }

  const name = getLocalized(service?.name);
  const shortDescription = getLocalized(service?.shortDescription);
  const longDescription = getLocalized(service?.longDescription);
  const priceNote = getLocalized(service?.priceNote);
  const branchNote = getLocalized(service?.branchNote);
  const hasPrice = typeof service?.price === 'number' && service.price > 0;
  const faqs = service?.id ? SERVICE_FAQS[service.id] : null;

  const handleBookAppointment = () => {
    const msg = getAppointmentBookingMessage(name, language);
    window.open(buildWhatsAppLink(msg), '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-[#FAF8F3] py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation back */}
        <div className="mb-6">
          <Link
            to="/services"
            className="inline-flex items-center gap-1.5 text-xs text-[#77716A] hover:text-[#C5A46D] transition-colors"
          >
            {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            <span>{isRTL ? "واپس تمام سروسز پر جائیں" : "Back to All Treatments"}</span>
          </Link>
        </div>

        {/* Hero Card for Service */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8E2D8] shadow-xs overflow-hidden">
          {/* Header image if available */}
          {service?.image && (
            <div className="aspect-[21/9] sm:aspect-[21/8] w-full rounded-2xl overflow-hidden mb-6 bg-[#F3EEE5] border border-[#E8E2D8]">
              <OptimizedImage
                src={service.image}
                alt={isRTL ? `${name} - طریقہ علاج، رائل ایستھیٹک کلینک تھانہ مالاکنڈ` : `${name} - Clinical Aesthetic Procedure at Royal Aesthetic Clinic Malakand`}
                width={1200}
                height={480}
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
          )}

          {/* Badges and duration */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="gold">
                {isRTL ? "طبی پروٹوکول" : "Clinical Protocol"}
              </Badge>
              {service?.id === 'hair-transplant' && (
                <span className="bg-[#F3EEE5] text-[#9E7F47] border border-[#E8E2D8] text-xs font-semibold px-3 py-0.5 rounded-full flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#C5A46D]" />
                  <span>{isRTL ? "اسلام آباد برانچ سرجری" : "Islamabad Branch Surgery"}</span>
                </span>
              )}
            </div>

            {service?.duration && (
              <span className="text-xs text-[#77716A] flex items-center gap-1 font-medium">
                <Clock className="w-4 h-4 text-[#C5A46D]" />
                {service.duration}
              </span>
            )}
          </div>

          <h1 className="font-serif text-2xl sm:text-4xl text-[#262626] font-normal leading-tight">
            {name}
          </h1>

          {/* Special notice for Hair Transplant at Islamabad branch */}
          {service?.id === 'hair-transplant' && (
            <div className="mt-4 p-4 rounded-2xl bg-[#F3EEE5] border border-[#E8E2D8] text-xs sm:text-sm text-[#262626] leading-relaxed flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#C5A46D] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-sm font-semibold mb-0.5 text-[#262626]">
                  {isRTL ? "اہم طبی و جغرافیائی وضاحت:" : "Important Surgical Location Notice:"}
                </strong>
                <p className="text-[#77716A]">
                  {isRTL 
                    ? "ہیئر ٹرانسپلانٹ سرجری مکمل طور پر ہماری اسلام آباد برانچ میں جدید ترین تھیٹر میں انجام پاتی ہے۔ تھانہ مالاکنڈ کلینک میں ابتدائی معائنہ، گرافٹ پلاننگ، خون کے ٹیسٹ اور آپریشن کے بعد واش اور پی آر پی کی سہولت فراہم کی جاتی ہے۔"
                    : "Hair transplant surgery is performed exclusively at our specialized Islamabad branch operating facility. Initial consultation, hairline planning, pre-op blood work, and post-operative wash and PRP sessions are managed locally at our Thana, Malakand clinic."}
                </p>
              </div>
            </div>
          )}

          <p className="mt-4 text-sm sm:text-base text-[#77716A] leading-relaxed">
            {shortDescription}
          </p>

          {/* Price & Booking Bar */}
          <div className="mt-8 pt-6 border-t border-[#E8E2D8] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              {hasPrice ? (
                <>
                  <span className="text-xs text-[#77716A] block">
                    {t('services.priceStarting')}
                  </span>
                  <span className="font-serif text-2xl sm:text-3xl font-semibold text-[#262626]">
                    {service.price.toLocaleString()} PKR
                  </span>
                </>
              ) : (
                <>
                  <span className="text-xs text-[#77716A] block">
                    {isRTL ? "ملاقات اور معائنہ" : "Doctor Consultation"}
                  </span>
                  <span className="font-serif text-xl sm:text-2xl font-semibold text-[#C5A46D]">
                    {isRTL ? "مفت معائنہ برائے محدود وقت" : "Free Consultation (Limited Time)"}
                  </span>
                </>
              )}
              {priceNote && (
                <p className="text-xs text-[#77716A] mt-1">
                  {priceNote}
                </p>
              )}
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={handleBookAppointment}
              className="w-full sm:w-auto shadow-sm"
            >
              <Calendar className="w-5 h-5 me-2" />
              <span>{isRTL ? "وقتِ ملاقات لیں" : "Book appointment"}</span>
            </Button>
          </div>
        </div>

        {/* Detailed Clinical Explanation */}
        <div className="mt-10 grid grid-cols-1 gap-6">
          <Card className="p-6 sm:p-8 border border-[#E8E2D8] bg-white">
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#262626] mb-3">
              {isRTL ? "طبی طریقہ کار اور علاج کے مراحل" : "Comprehensive Clinical Overview"}
            </h2>
            <p className="text-sm sm:text-base text-[#77716A] leading-relaxed whitespace-pre-line">
              {longDescription}
            </p>
          </Card>
        </div>

        {/* Short FAQ Section */}
        {faqs && faqs.length > 0 && (
          <div className="mt-10">
            <div className="mb-6">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#C5A46D] block mb-1">
                {isRTL ? "عام معلوماتی رہنمائی" : "General Information"}
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#262626]">
                {isRTL ? "اکثر پوچھے جانے والے سوالات" : "Frequently Asked Questions"}
              </h2>
              <p className="text-xs text-[#77716A] mt-1">
                {isRTL 
                  ? "یہ معلومات صرف عام آگاہی کے لیے ہیں۔ کسی خاص نتیجے کی ضمانت نہیں، نتائج ہر مریض کی جلد اور صحت کے مطابق مختلف ہو سکتے ہیں۔"
                  : "General educational information only. No guaranteed results. Outcomes vary based on individual biological factors."}
              </p>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {faqs.map((faq, idx) => (
                <Card key={idx} className="p-5 border border-[#E8E2D8] bg-white">
                  <h3 className="font-serif text-base sm:text-lg font-semibold text-[#262626] mb-2 flex items-start gap-2">
                    <span className="text-[#C5A46D] font-bold shrink-0">Q{idx + 1}:</span>
                    <span>{isRTL ? faq.qUr : faq.qEn}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-[#77716A] leading-relaxed ps-5 border-s-2 border-[#C5A46D]/40 ms-1">
                    {isRTL ? faq.aUr : faq.aEn}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Clinical Disclaimer */}
        <div className="mt-8 p-5 rounded-2xl bg-[#F3EEE5] border border-[#E8E2D8] flex items-start gap-3 text-xs text-[#77716A]">
          <AlertCircle className="w-5 h-5 text-[#C5A46D] shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-[#262626]">
              {isRTL ? "طبی وضاحت: " : "Medical Notice: "}
            </span>
            <span>{getLocalized(CLINIC_INFO.disclaimer)}</span>
          </div>
        </div>

        {/* Other Treatments Navigation */}
        <div className="mt-10 pt-6 border-t border-[#E8E2D8] text-center">
          <Link to="/services">
            <Button variant="outline" size="md">
              {isRTL ? "دیگر تمام کلینیکل طریقہ علاج دیکھیں" : "Explore Other Clinical Procedures"}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default ServiceDetailPage;
