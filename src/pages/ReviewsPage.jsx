import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { REVIEWS } from '../data/reviewsData.js';
import { getReviews } from '../firebase/contentService.js';
import { buildWhatsAppLink } from '../utils/whatsapp.js';
import SectionHeader from '../components/UI/SectionHeader.jsx';
import Card from '../components/UI/Card.jsx';
import Button from '../components/UI/Button.jsx';
import Badge from '../components/UI/Badge.jsx';

export const ReviewsPage = () => {
  const { isRTL, t, getLocalized } = useLanguage();
  const [reviews, setReviews] = useState(REVIEWS);

  useEffect(() => {
    let isMounted = true;
    async function fetchReviews() {
      try {
        const data = await getReviews();
        if (isMounted && data && data.length > 0) {
          setReviews(data);
        }
      } catch (err) {
        console.warn('Reviews load error, using default seeds:', err);
      }
    }
    fetchReviews();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF8F3] py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          as="h1"
          eyebrow={isRTL ? "مریضوں کا تاثر" : "Patient Testimonials"}
          title={isRTL ? "ہمارے مریضوں کی سچی آراء" : "Real Experiences From Real Patients"}
          subtitle={isRTL
            ? "مالاکنڈ، بٹ خیلہ، سوات اور گردونواح کے معزز مریضوں کے تاثرات۔"
            : "Honest feedback from patients who trusted Royal Aesthetic & Laser Clinic for their skin journey."}
        />

        {/* Overall satisfaction banner */}
        <div className="mb-12 p-6 rounded-3xl bg-[#F3EEE5] border border-[#E8E2D8] text-center max-w-xl mx-auto">
          <div className="flex items-center justify-center gap-1.5 text-[#C5A46D] mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-[#C5A46D]" />
            ))}
          </div>
          <p className="font-serif text-2xl font-bold text-[#262626]">
            4.9 / 5.0
          </p>
          <p className="text-xs text-[#77716A] mt-1">
            {isRTL ? "سیکڑوں کامیاب علاج اور مطمئن مریض" : "Based on verified clinical patient consultations"}
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {reviews.map((review) => {
            const comment = review.textEn 
              ? (isRTL ? (review.textUr || review.textEn) : review.textEn)
              : getLocalized(review.comment);
            const treatment = review.service || review.treatment?.en
              ? (isRTL ? (review.treatment?.ur || review.service) : (review.treatment?.en || review.service))
              : '';

            return (
              <Card key={review.id} className="flex flex-col justify-between border border-[#E8E2D8] bg-white hover:border-[#C5A46D] transition-all">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1 text-[#C5A46D]">
                      {[...Array(review.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#C5A46D]" />
                      ))}
                    </div>
                    <span className="text-xs text-[#77716A]">{review.date || 'Verified Patient'}</span>
                  </div>

                  <p className="text-sm text-[#262626] italic leading-relaxed">
                    "{comment}"
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E8E2D8]">
                  <p className="font-serif font-semibold text-sm text-[#262626]">
                    {review.name}
                  </p>
                  <div className="flex items-center justify-between text-xs text-[#77716A] mt-0.5">
                    <span>{review.location || 'Malakand'}</span>
                    <span className="text-[#C5A46D] font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      {t('reviews.verifiedPatient')}
                    </span>
                  </div>
                  {treatment && (
                    <p className="text-[11px] text-[#77716A] mt-1.5 font-medium">
                      {treatment}
                    </p>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Leave feedback CTA */}
        <div className="mt-14 p-8 rounded-3xl bg-white border border-[#E8E2D8] text-center max-w-2xl mx-auto shadow-xs">
          <MessageSquare className="w-8 h-8 text-[#C5A46D] mx-auto mb-3" />
          <h3 className="font-serif text-xl font-semibold text-[#262626]">
            {isRTL ? "کیا آپ ہمارے کلینک تشریف لائے ہیں؟" : "Visited Royal Aesthetic Clinic?"}
          </h3>
          <p className="text-xs sm:text-sm text-[#77716A] mt-2 mb-6">
            {isRTL 
              ? "ہمیں اپنی رائے اور تاثرات سے آگاہ کریں تاکہ ہم اپنی سروسز کو مزید بہتر بنا سکیں۔" 
              : "Share your experience with our team on WhatsApp or Google Reviews."}
          </p>
          <a
            href={buildWhatsAppLink(
              isRTL
                ? "السلام علیکم! میں رائل کلینک میں اپنے حالیہ معائنے / علاج کے بارے میں اپنی رائے اور ریویو دینا چاہتا/چاہتی ہوں۔"
                : "Hello! I would like to submit my feedback / review regarding my recent visit to Royal Aesthetic & Laser Clinic."
            )}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="whatsapp" size="md">
              {isRTL ? "واٹس ایپ پر اپنی رائے شیئر کریں" : "Share Feedback on WhatsApp"}
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ReviewsPage;
