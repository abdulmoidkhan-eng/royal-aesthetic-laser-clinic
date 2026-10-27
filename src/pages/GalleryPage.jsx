import React, { useState, useEffect } from 'react';
import { AlertCircle, Clock, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { GALLERY_ITEMS } from '../data/reviewsData.js';
import { getGalleryItems } from '../firebase/contentService.js';
import { buildWhatsAppLink } from '../utils/whatsapp.js';
import SectionHeader from '../components/UI/SectionHeader.jsx';
import Card from '../components/UI/Card.jsx';
import Button from '../components/UI/Button.jsx';
import Badge from '../components/UI/Badge.jsx';

export const GalleryPage = () => {
  const { isRTL, t, getLocalized } = useLanguage();
  const [items, setItems] = useState(GALLERY_ITEMS);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    let isMounted = true;
    async function fetchGallery() {
      try {
        const data = await getGalleryItems();
        if (isMounted && data && data.length > 0) {
          setItems(data);
        }
      } catch (err) {
        console.warn('Gallery load error, using default seeds:', err);
      }
    }
    fetchGallery();
    return () => { isMounted = false; };
  }, []);

  const filters = [
    { id: 'all', labelEn: 'All Results', labelUr: 'تمام نتائج' },
    { id: 'scars', labelEn: 'Acne Scars', labelUr: 'ایکنی اور گڑھے' },
    { id: 'hair', labelEn: 'Laser Hair Reduction', labelUr: 'لیزر ہیئر ریموول' },
    { id: 'pigmentation', labelEn: 'Pigmentation & Melasma', labelUr: 'چھائیاں و میلازما' }
  ];

  const filteredItems = items.filter(item => {
    if (filter === 'all') return true;
    if (item.concern) return item.concern === filter;
    const combined = `${item.relatedService || ''} ${item.captionEn || ''}`.toLowerCase();
    if (filter === 'scars' && (combined.includes('acne') || combined.includes('scar'))) return true;
    if (filter === 'hair' && combined.includes('hair')) return true;
    if (filter === 'pigmentation' && (combined.includes('pigment') || combined.includes('melasma'))) return true;
    return false;
  });

  return (
    <div className="min-h-screen bg-white py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow={isRTL ? "کلینیکل گیلری" : "Case Studies"}
          title={isRTL ? "علاج سے قبل اور بعد کے تصویری نتائج" : "Before & After Clinical Transformations"}
          subtitle={isRTL
            ? "مالاکنڈ کلینک میں ہمارے ماہر ڈاکٹر کے ہاتھوں مریضوں کے حقیقی اور دستاویزی نتائج۔"
            : "Actual documented patient progress under specialized aesthetic and laser protocols."}
        />

        {/* Filter buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                filter === f.id
                  ? 'bg-[#D9A38F] text-white shadow-xs font-semibold'
                  : 'bg-[#FBF3F0] text-[#3A3A3A] hover:bg-[#F4E4DE]'
              }`}
            >
              {isRTL ? f.labelUr : f.labelEn}
            </button>
          ))}
        </div>

        {/* Disclaimer Notice */}
        <div className="mb-10 p-4 rounded-2xl bg-[#FBF3F0] border border-[#F4E4DE] flex items-start gap-3 text-xs text-[#6B5B55] max-w-3xl mx-auto">
          <AlertCircle className="w-5 h-5 text-[#D9A38F] shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-[#3A3A3A]">
              {isRTL ? "ضروری طبی اعلان: " : "Clinical Notice: "}
            </span>
            <span>{t('beforeAfter.disclaimer')}</span>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => {
            const title = item.captionEn 
              ? (isRTL ? (item.captionUr || item.captionEn) : item.captionEn)
              : getLocalized(item.title);
            const service = item.relatedService
              ? (isRTL ? (item.relatedServiceUr || item.relatedService) : item.relatedService)
              : getLocalized(item.service);
            const timeframe = item.timeframeEn
              ? (isRTL ? (item.timeframeUr || item.timeframeEn) : item.timeframeEn)
              : getLocalized(item.timeframe);
            const notes = item.notesEn
              ? (isRTL ? (item.notesUr || item.notesEn) : item.notesEn)
              : getLocalized(item.notes);
            const beforeImg = item.beforeImage || item.beforeUrl;
            const afterImg = item.afterImage || item.afterUrl;

            return (
              <Card key={item.id} className="overflow-hidden p-0 border border-[#F4E4DE] flex flex-col justify-between">
                <div>
                  <div className="grid grid-cols-2 relative bg-neutral-100">
                    <div className="relative aspect-[4/5] border-e border-white/50">
                      <img
                        src={beforeImg}
                        alt={`Before: ${title || 'Treatment'}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <span className="absolute bottom-2 start-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded">
                        {t('beforeAfter.before')}
                      </span>
                    </div>
                    <div className="relative aspect-[4/5]">
                      <img
                        src={afterImg}
                        alt={`After: ${title || 'Treatment'}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <span className="absolute bottom-2 end-2 bg-[#D9A38F] text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                        {t('beforeAfter.after')}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    {timeframe && (
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="blush">{timeframe}</Badge>
                      </div>
                    )}
                    <h3 className="font-serif text-lg font-semibold text-[#3A3A3A]">
                      {title}
                    </h3>
                    {service && (
                      <p className="text-xs text-[#D9A38F] font-semibold mt-1">
                        {service}
                      </p>
                    )}
                    {notes && (
                      <p className="text-xs text-[#6B5B55] mt-2 leading-relaxed">
                        {notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <a
                    href={buildWhatsAppLink(
                      isRTL
                        ? `السلام علیکم! میں نے گیلری میں "${title}" کا رزلٹ دیکھا اور اس طریقہ کار کے بارے میں ڈاکٹر سے معائنہ کروانا چاہتا/چاہتی ہوں۔`
                        : `Hello! I saw the result for "${title}" on your gallery and would like to book a consultation.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full"
                  >
                    <Button variant="outline" size="sm" className="w-full text-xs">
                      {isRTL ? "اس علاج کا مشورہ لیں" : "Inquire About This Result"}
                    </Button>
                  </a>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GalleryPage;
