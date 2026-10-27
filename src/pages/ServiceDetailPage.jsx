import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Clock, Calendar, ShieldCheck, ArrowLeft, ArrowRight, 
  CheckCircle2, MessageCircle, AlertCircle, MapPin, Sparkles 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { getServiceById } from '../firebase/servicesService.js';
import { SEED_SERVICES } from '../data/seedServices.js';
import { CLINIC_INFO } from '../data/clinicInfo.js';
import { buildWhatsAppLink, getAppointmentBookingMessage } from '../utils/whatsapp.js';
import Button from '../components/UI/Button.jsx';
import Card from '../components/UI/Card.jsx';
import Badge from '../components/UI/Badge.jsx';

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
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="font-serif text-2xl text-[#3A3A3A]">
          {isRTL ? "علاج نہیں ملا" : "Treatment Not Found"}
        </h2>
        <p className="text-sm text-[#6B5B55] mt-2 mb-6">
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

  const handleBookAppointment = () => {
    const msg = getAppointmentBookingMessage(name, language);
    window.open(buildWhatsAppLink(msg), '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-white py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation back */}
        <div className="mb-6">
          <Link
            to="/services"
            className="inline-flex items-center gap-1.5 text-xs text-[#6B5B55] hover:text-[#D9A38F] transition-colors"
          >
            {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            <span>{isRTL ? "واپس تمام سروسز پر جائیں" : "Back to All Treatments"}</span>
          </Link>
        </div>

        {/* Hero Card for Service */}
        <div className="bg-gradient-to-b from-[#FBF3F0] to-white rounded-3xl p-6 sm:p-10 border border-[#F4E4DE] shadow-xs overflow-hidden">
          {/* Header image if available */}
          {service?.image && (
            <div className="aspect-[21/9] sm:aspect-[21/8] w-full rounded-2xl overflow-hidden mb-6 bg-neutral-100 border border-[#F4E4DE]">
              <img
                src={service.image}
                alt={name || "Clinical Service"}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          )}

          {/* Badges and duration */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="blush">
                {isRTL ? "طبی پروٹوکول" : "Clinical Protocol"}
              </Badge>
              {service?.id === 'hair-transplant' && (
                <span className="bg-amber-100 text-amber-900 border border-amber-300 text-xs font-semibold px-3 py-0.5 rounded-full flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-700" />
                  <span>{isRTL ? "اسلام آباد برانچ سرجری" : "Islamabad Branch Surgery"}</span>
                </span>
              )}
            </div>

            {service?.duration && (
              <span className="text-xs text-[#6B5B55] flex items-center gap-1 font-medium">
                <Clock className="w-4 h-4 text-[#D9A38F]" />
                {service.duration}
              </span>
            )}
          </div>

          <h1 className="font-serif text-2xl sm:text-4xl text-[#3A3A3A] font-normal leading-tight">
            {name}
          </h1>

          {/* Special prominent notice for Hair Transplant at Islamabad branch */}
          {service?.id === 'hair-transplant' && (
            <div className="mt-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs sm:text-sm text-amber-900 leading-relaxed flex items-start gap-3">
              <MapPin className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-sm font-semibold mb-0.5">
                  {isRTL ? "اہم طبی و جغرافیائی وضاحت:" : "Important Surgical Location Notice:"}
                </strong>
                <p>
                  {isRTL 
                    ? "ہیئر ٹرانسپلانٹ سرجری مکمل طور پر ہماری اسلام آباد برانچ میں جدید ترین تھیٹر میں انجام پاتی ہے۔ تھانہ مالاکنڈ کلینک میں ابتدائی معائنہ، گرافٹ پلاننگ، خون کے ٹیسٹ اور آپریشن کے بعد واش اور پی آر پی کی سہولت فراہم کی جاتی ہے۔"
                    : "Hair transplant surgery is performed exclusively at our specialized Islamabad branch operating facility. Initial consultation, hairline planning, pre-op blood work, and post-operative wash and PRP sessions are managed locally at our Thana, Malakand clinic."}
                </p>
              </div>
            </div>
          )}

          <p className="mt-4 text-sm sm:text-base text-[#6B5B55] leading-relaxed">
            {shortDescription}
          </p>

          {/* Price & Booking Bar */}
          <div className="mt-8 pt-6 border-t border-[#F4E4DE] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              {hasPrice ? (
                <>
                  <span className="text-xs text-[#6B5B55] block">
                    {t('services.priceStarting')}
                  </span>
                  <span className="font-serif text-2xl sm:text-3xl font-semibold text-[#3A3A3A]">
                    {service.price.toLocaleString()} PKR
                  </span>
                </>
              ) : (
                <>
                  <span className="text-xs text-[#6B5B55] block">
                    {isRTL ? "ملاقات اور معائنہ" : "Doctor Consultation"}
                  </span>
                  <span className="font-serif text-xl sm:text-2xl font-semibold text-[#D9A38F]">
                    {isRTL ? "مفت معائنہ برائے محدود وقت" : "Free Consultation (Limited Time)"}
                  </span>
                </>
              )}
              {priceNote && (
                <p className="text-xs text-[#6B5B55] mt-1">
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
          <Card className="p-6 sm:p-8">
            <h3 className="font-serif text-xl font-semibold text-[#3A3A3A] mb-3">
              {isRTL ? "طبی طریقہ کار اور علاج کے مراحل" : "Comprehensive Clinical Overview"}
            </h3>
            <p className="text-sm sm:text-base text-[#6B5B55] leading-relaxed whitespace-pre-line">
              {longDescription}
            </p>
          </Card>
        </div>

        {/* Clinical Disclaimer */}
        <div className="mt-8 p-5 rounded-2xl bg-[#FBF3F0] border border-[#F4E4DE] flex items-start gap-3 text-xs text-[#6B5B55]">
          <AlertCircle className="w-5 h-5 text-[#D9A38F] shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-[#3A3A3A]">
              {isRTL ? "طبی وضاحت: " : "Medical Notice: "}
            </span>
            <span>{getLocalized(CLINIC_INFO.disclaimer)}</span>
          </div>
        </div>

        {/* Other Treatments Navigation */}
        <div className="mt-10 pt-6 border-t border-[#F4E4DE] text-center">
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
