import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Calendar, MapPin, Sparkles, ChevronRight, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { buildWhatsAppLink, getAppointmentBookingMessage } from '../utils/whatsapp.js';
import Card from './UI/Card.jsx';
import Button from './UI/Button.jsx';
import Badge from './UI/Badge.jsx';

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
    <Card className="flex flex-col justify-between overflow-hidden p-0 border border-[#F4E4DE] group h-full transition-all duration-300 hover:shadow-lg hover:border-[#D9A38F]/60">
      {/* Thumbnail with overlay badges */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#FBF3F0]">
        <img
          src={service.image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Branch / Highlight Badge */}
        {branchNote ? (
          <div className="absolute top-3 start-3 max-w-[85%] bg-amber-900/90 text-white backdrop-blur-xs text-[10px] font-semibold px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1.5 border border-amber-700/50">
            <MapPin className="w-3 h-3 text-amber-300 shrink-0" />
            <span className="line-clamp-1">{branchNote}</span>
          </div>
        ) : (
          <div className="absolute top-3 start-3">
            <span className="bg-white/90 text-[#3A3A3A] backdrop-blur-xs text-[10px] font-semibold px-2.5 py-1 rounded-md shadow-xs border border-[#F4E4DE]">
              {isRTL ? "ڈاکٹر کی زیرِ نگرانی" : "Doctor Supervised"}
            </span>
          </div>
        )}

        {/* Duration badge if present */}
        {service.duration && (
          <div className="absolute bottom-3 end-3 bg-black/60 text-white backdrop-blur-xs text-[10px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#D9A38F]" />
            <span>{service.duration}</span>
          </div>
        )}
      </div>

      {/* Content body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <Link to={`/services/${service.id}`}>
            <h3 className="font-serif text-lg sm:text-xl font-semibold text-[#3A3A3A] group-hover:text-[#D9A38F] transition-colors leading-snug">
              {name}
            </h3>
          </Link>

          {/* Islamabad Branch Alert Notice for Hair Transplant */}
          {service.id === 'hair-transplant' && (
            <div className="mt-2.5 p-2 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-900 leading-tight">
              <span className="font-semibold">{isRTL ? "اسلام آباد برانچ: " : "Islamabad Branch: "}</span>
              {isRTL 
                ? "یہ سرجری ہماری اسلام آباد برانچ میں جدید ترین تھیٹر میں انجام پاتی ہے۔" 
                : "Surgical procedure is carried out at our specialized Islamabad theater."}
            </div>
          )}

          <p className="mt-2 text-xs sm:text-sm text-[#6B5B55] leading-relaxed line-clamp-3">
            {shortDescription}
          </p>
        </div>

        {/* Footer: Price (hidden if empty) and Buttons */}
        <div className="mt-5 pt-4 border-t border-[#F4E4DE]">
          <div className="flex items-center justify-between mb-3.5">
            {hasPrice ? (
              <div>
                <span className="text-[10px] text-[#6B5B55] uppercase tracking-wider block">
                  {isRTL ? "ابتدائی فیس" : "Starting from"}
                </span>
                <span className="font-serif text-base sm:text-lg font-bold text-[#3A3A3A]">
                  {service.price.toLocaleString()} PKR
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-[#6B5B55]">
                <Clock className="w-3.5 h-3.5 text-[#D9A38F]" />
                <span>{service.duration || (isRTL ? "ڈاکٹر معائنہ" : "Doctor Consultation")}</span>
              </div>
            )}

            <Link
              to={`/services/${service.id}`}
              className="text-xs font-semibold text-[#6B5B55] hover:text-[#D9A38F] flex items-center gap-1 transition-colors"
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
              className="w-full text-xs"
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
