import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ShoppingBag, Truck, ShieldCheck, ArrowLeft, ArrowRight, 
  Check, MessageCircle, AlertCircle, Sparkles 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { getProductById } from '../firebase/shopService.js';
import { SEED_PRODUCTS } from '../data/seedProducts.js';
import { buildWhatsAppLink } from '../utils/whatsapp.js';
import Button from '../components/UI/Button.jsx';
import Card from '../components/UI/Card.jsx';
import Badge from '../components/UI/Badge.jsx';
import OptimizedImage from '../components/UI/OptimizedImage.jsx';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const { language, isRTL, t, getLocalized } = useLanguage();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(() => {
    return SEED_PRODUCTS.find(p => p.id === id) || null;
  });
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadDetail() {
      try {
        const data = await getProductById(id);
        if (isMounted && data) {
          setProduct(data);
        }
      } catch (err) {
        console.warn('Error loading product by ID:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadDetail();
    return () => { isMounted = false; };
  }, [id]);

  if (!product && !loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center bg-[#FAF8F3]">
        <h2 className="font-serif text-2xl text-[#262626]">
          {isRTL ? "پروڈکٹ نہیں ملا" : "Product Not Found"}
        </h2>
        <p className="text-sm text-[#77716A] mt-2 mb-6">
          {isRTL ? "مطلوبہ پروڈکٹ کلینیکل شاپ میں موجود نہیں۔" : "The requested skincare product does not exist in our catalog."}
        </p>
        <Link to="/shop">
          <Button variant="primary">
            {isRTL ? "شاپ پر واپس جائیں" : "Back to Skin Shop"}
          </Button>
        </Link>
      </div>
    );
  }

  const name = getLocalized(product?.name);
  const description = getLocalized(product?.description);
  const isAvailable = product?.inStock !== false;
  const isPriceZero = !product?.price || product.price === 0;
  const images = product?.images?.length ? product.images : [product?.image || "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80"];

  const handleAddToCart = () => {
    if (!isAvailable) return;
    const success = addToCart(product, quantity);
    if (success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  const handleWhatsAppOrder = () => {
    const msg = isRTL
      ? `السلام علیکم رائل ایستھیٹک کلینک، میں "${name}" (تعداد: ${quantity}) خریدنا چاہتا/چاہتی ہوں۔ برائے مہربانی مجھے کل قیمت اور آرڈر کی تصدیق فراہم کریں۔`
      : `Hello Royal Aesthetic & Laser Clinic, I would like to purchase "${name}" (Quantity: ${quantity}). Please let me know the total price and confirmation details.`;
    window.open(buildWhatsAppLink(msg), '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-[#FAF8F3] py-10 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-xs text-[#77716A] hover:text-[#C5A46D] transition-colors"
          >
            {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            <span>{isRTL ? "اسکن شاپ پر واپس جائیں" : "Back to Skin Shop"}</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 bg-white p-6 sm:p-10 rounded-3xl border border-[#E8E2D8] shadow-xs">
          {/* Product Images Gallery */}
          <div className="space-y-4">
            <div className="bg-[#F3EEE5] rounded-3xl p-6 flex items-center justify-center border border-[#E8E2D8] relative aspect-square overflow-hidden">
              <OptimizedImage
                src={images[selectedImageIndex] || images[0]}
                alt={isRTL ? `${name} - رائل کلینک اسکن کیئر ڈسپنسری` : `${name} - Physician Recommended Skincare at Royal Aesthetic Clinic`}
                width={600}
                height={600}
                className={`max-h-96 w-auto object-contain rounded-2xl shadow-sm transition-all duration-300 ${
                  !isAvailable ? 'grayscale opacity-75' : ''
                }`}
                loading="eager"
              />

              {/* Status Badge */}
              <div className="absolute top-4 end-4">
                {!isAvailable ? (
                  <span className="bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-lg shadow-sm">
                    {isRTL ? "دستیاب نہیں (Out of stock)" : "Out of stock"}
                  </span>
                ) : (
                  <span className="bg-emerald-600 text-white text-xs font-semibold px-3 py-1 rounded-lg shadow-2xs">
                    {isRTL ? "دستیاب ہے" : "In Stock"}
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail selector if multiple images */}
            {images.length > 1 && (
              <div className="flex items-center gap-3">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all bg-[#F3EEE5] ${
                      selectedImageIndex === idx
                        ? 'border-[#C5A46D] shadow-xs ring-2 ring-[#C5A46D]/20'
                        : 'border-[#E8E2D8] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <OptimizedImage 
                      src={img} 
                      alt={`${name || 'Product'} thumbnail ${idx + 1}`} 
                      width={64}
                      height={64}
                      className="w-full h-full object-cover" 
                      loading="lazy" 
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details & Actions */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <Badge variant="gold">{product?.category}</Badge>
                {product?.size && (
                  <span className="text-xs text-[#77716A] font-medium">{product.size}</span>
                )}
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl text-[#262626] font-normal leading-snug">
                {name}
              </h1>

              {/* Price display with admin note */}
              <div className="mt-4 flex items-baseline gap-3">
                {isPriceZero ? (
                  <div>
                    <span className="font-serif text-2xl font-bold text-[#C5A46D]">
                      {isRTL ? "قیمت کا تعین ایڈمن کرے گا" : "Price to be set by admin"}
                    </span>
                    <p className="text-xs text-[#77716A] mt-0.5">
                      {isRTL ? "ایڈمن کی جانب سے قیمت جلد طے کی جائے گی۔" : "Pricing will be updated by clinic admin."}
                    </p>
                  </div>
                ) : (
                  <span className="font-serif text-3xl font-semibold text-[#262626]">
                    {product?.price.toLocaleString()} PKR
                  </span>
                )}
              </div>

              {/* Free delivery badge */}
              <div className="mt-4 p-3 rounded-xl bg-[#F3EEE5] border border-[#E8E2D8] flex items-center gap-2.5 text-xs text-[#262626]">
                <Truck className="w-4 h-4 text-[#C5A46D] shrink-0" />
                <span className="font-medium">
                  {isRTL ? "پورے پاکستان میں مفت ڈیلیوری (Free Delivery)" : "Free delivery all over Pakistan"}
                </span>
              </div>

              <p className="mt-5 text-sm text-[#77716A] leading-relaxed">
                {description}
              </p>

              {/* Clinical features */}
              <div className="mt-6 pt-4 border-t border-[#E8E2D8] space-y-2 text-xs text-[#262626]">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#C5A46D]" />
                  <span>{isRTL ? "طبی طور پر آزمودہ اور محفوظ اجزاء" : "Dermatologically tested & approved formulas"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#C5A46D]" />
                  <span>{isRTL ? "لیزر اور حساس جلد کے بعد استعمال کے لیے موزوں" : "Safe for post-laser & sensitive skin barriers"}</span>
                </div>
              </div>
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div className="mt-8 pt-6 border-t border-[#E8E2D8] space-y-4">
              {!isAvailable ? (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                  <strong className="block font-semibold mb-0.5">
                    {isRTL ? "یہ پراڈکٹ فی الوقت دستیاب نہیں ہے" : "Currently Out of Stock"}
                  </strong>
                  <p>
                    {isRTL 
                      ? "یہ پروڈکٹ فی الوقت ختم ہے۔ آپ واٹس ایپ پر آرڈر نوٹ کروا سکتے ہیں۔" 
                      : "This product is temporarily unavailable and cannot be added to the bag. You may notify our doctor team via WhatsApp."}
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  {/* Quantity controls */}
                  <div className="flex items-center border border-[#E8E2D8] rounded-xl bg-[#FAF8F3] overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="px-3.5 py-2.5 text-sm text-[#77716A] hover:bg-[#F3EEE5] transition-colors"
                    >
                      -
                    </button>
                    <span className="px-4 py-2.5 text-sm font-semibold text-[#262626]">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(q => q + 1)}
                      className="px-3.5 py-2.5 text-sm text-[#77716A] hover:bg-[#F3EEE5] transition-colors"
                    >
                      +
                    </button>
                  </div>

                  <Button
                    variant={added ? "dark" : "primary"}
                    size="md"
                    onClick={handleAddToCart}
                    className="flex-1 justify-center"
                  >
                    <ShoppingBag className="w-4 h-4 me-1.5" />
                    <span>{added ? t('products.added') : t('products.addToCart')}</span>
                  </Button>
                </div>
              )}

              {/* WhatsApp direct inquiry */}
              <Button
                variant="whatsapp"
                size="md"
                onClick={handleWhatsAppOrder}
                className="w-full justify-center"
              >
                <MessageCircle className="w-4 h-4 me-2" />
                <span>{isRTL ? "واٹس ایپ پر پروڈکٹ کے بارے میں پوچھیں" : "Inquire / Order via WhatsApp"}</span>
              </Button>

              <div className="flex items-center justify-between text-[11px] text-[#77716A] pt-1">
                <span>{isRTL ? "گیسٹ چیک آؤٹ (اکاؤنٹ درکار نہیں)" : "Guest checkout (No account required)"}</span>
                <span>•</span>
                <span>{isRTL ? "کوئی کارڈ داخل کرنے کی ضرورت نہیں" : "No card details collected"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
