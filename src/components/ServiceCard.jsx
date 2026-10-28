import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { buildWhatsAppLink, getAppointmentBookingMessage } from '../utils/whatsapp.js';
import Card from './UI/Card.jsx';
import Button from './UI/Button.jsx';
import OptimizedImage from './UI/OptimizedImage.jsx';

export const ServiceCard = ({ service, onBookAppointment }) => {
  const { language, isRTL, getLocalized } = useLanguage();

  if (!service) return null;

  const hasPrice = typeof service.price === 'number' && service.price > 0;
  const name = getLocalized(service.name);
  const shortDescription = getLocalized(service.shortDescription);
  const branchNote = getLocalized(service.branchNote);

  const handleBook = (e) => {
    e.preventDefault();
    if (onBookAppointment) {
      onBookAppointment(service);
      return;
    }
    const message = getAppointmentBookingMessage(name, language);
    window.open(buildWhatsAppLink(message), '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="flex flex-col justify-between overflow-hidden p-0 border border-[#E8E2D8] bg-white group h-full transition-all duration-300 hover:shadow-xl hover:border-[#C5A46D]">
      {/* Thumbnail with overlay badges */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#F3EEE5]">
        <OptimizedImage
          src={service.image}
          alt={isRTL ? `${name} - کلینیکل طریقہ علاج` : `${name} - Clinical Aesthetic Treatment`}
          width="600"
          height="375"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Branch / Highlight Badge */}
        {branchNote ? (
          <div className="absolute top-3 start-3 max-w-[85%] bg-[#262626]/90 text-[#F3EEE5] backdrop-blur-xs text-[10px] font-medium px-2.5 py-1 rounded-lg shadow-xs flex items-center gap-1.5 border border-[#C5A46D]/40">
            <MapPin className="w-3 h-3 text-[#C5A46D] shrink-0" />
            <span className="line-clamp-1">{branchNote}</span>
          </div>
        ) : (
          <div className="absolute top-3 start-3">
            <span className="bg-white/95 text-[#262626] backdrop-blur-xs text-[10px] font-medium px-2.5 py-1 rounded-md shadow-2xs border border-[#E8E2D8]">
              {isRTL ? "ڈاکٹر کی زیرِ نگرانی" : "Doctor Supervised"}
            </span>
          </div>
        )}

        {/* Duration badge if present */}
        {service.duration && (
          <div className="absolute bottom-3 end-3 bg-[#262626]/80 text-[#F3EEE5] backdrop-blur-xs text-[10px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#C5A46D]" />
            <span>{service.duration}</span>
          </div>
        )}
      </div>

      {/* Content body */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between bg-white">
        <div>
          <Link to={`/services/${service.id}`}>
            <h3 className="font-serif text-lg sm:text-xl font-semibold text-[#262626] group-hover:text-[#C5A46D] transition-colors leading-snug">
              {name}
            </h3>
          </Link>

          {/* Islamabad Branch Alert Notice for Hair Transplant */}
          {service.id === 'hair-transplant' && (
            <div className="mt-2.5 p-2.5 rounded-lg bg-[#FAF8F3] border border-[#E8E2D8] text-[11px] text-[#262626] leading-tight">
              <span className="font-semibold text-[#9E7F47]">{isRTL ? "اسلام آباد برانچ: " : "Islamabad Branch: "}</span>
              {isRTL 
                ? "یہ سرجری ہماری اسلام آباد برانچ میں جدید ترین تھیٹر میں انجام پاتی ہے۔" 
                : "Surgical procedure is carried out at our specialized Islamabad theater."}
            </div>
          )}

          <p className="mt-2.5 text-xs sm:text-sm text-[#77716A] leading-relaxed line-clamp-3">
            {shortDescription}
          </p>
        </div>

        {/* Footer: Price and Actions */}
        <div className="mt-5 pt-4 border-t border-[#E8E2D8]">
          <div className="flex items-center justify-between mb-3.5">
            {hasPrice ? (
              <div>
                <span className="text-[10px] text-[#77716A] uppercase tracking-wider block font-medium">
                  {isRTL ? "ابتدائی فیس" : "Starting from"}
                </span>
                <span className="font-serif text-base sm:text-lg font-bold text-[#262626]">
                  {service.price.toLocaleString()} PKR
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-[#77716A] font-medium">
                <Clock className="w-3.5 h-3.5 text-[#C5A46D]" />
                <span>{service.duration || (isRTL ? "ڈاکٹر معائنہ" : "Doctor Consultation")}</span>
              </div>
            )}

            <Link
              to={`/services/${service.id}`}
              className="text-xs font-semibold text-[#77716A] hover:text-[#C5A46D] flex items-center gap-1 transition-colors"
            >
              <span>{isRTL ? "تفصیلات" : "Details"}</span>
              <ChevronRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link to={`/services/${service.id}`} className="w-full">
              <Button variant="outline" size="sm" className="w-full text-xs">
                {isRTL ? "معلومات دیکھیں" : "View Details"}
              </Button>
            </Link>
            <Button
              variant="primary"
              size="sm"
              onClick={handleBook}
              className="w-full text-xs shadow-2xs"
            >
              {isRTL ? "وقتِ ملاقات لیں" : "Book appointment"}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ServiceCard;
