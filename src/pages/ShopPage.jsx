import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Truck, ShieldCheck, Check, AlertCircle, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { getProducts } from '../firebase/shopService.js';
import { SEED_PRODUCTS } from '../data/seedProducts.js';
import SectionHeader from '../components/UI/SectionHeader.jsx';
import Card from '../components/UI/Card.jsx';
import Button from '../components/UI/Button.jsx';
import Badge from '../components/UI/Badge.jsx';
import OptimizedImage from '../components/UI/OptimizedImage.jsx';

export const ShopPage = () => {
  const { language, isRTL, t, getLocalized } = useLanguage();
  const { addToCart } = useCart();

  const [products, setProducts] = useState(SEED_PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [justAddedId, setJustAddedId] = useState(null);

  // Required categories: Facewash, Sunblock, Serum
  const categories = [
    { id: 'All', labelEn: 'All Products', labelUr: 'تمام پروڈکٹس' },
    { id: 'Facewash', labelEn: 'Facewash', labelUr: 'فیس واش' },
    { id: 'Sunblock', labelEn: 'Sunblock', labelUr: 'سن بلاک' },
    { id: 'Serum', labelEn: 'Serum', labelUr: 'سیرمز' }
  ];

  useEffect(() => {
    let isMounted = true;
    async function loadShopData() {
      try {
        const data = await getProducts();
        if (isMounted && data && data.length > 0) {
          setProducts(data);
        }
      } catch (err) {
        console.warn('Error fetching Firestore products, using seed:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadShopData();
    return () => { isMounted = false; };
  }, []);

  const filteredProducts = products.filter((p) => {
    if (activeCategory === 'All') return true;
    return p.category === activeCategory;
  });

  const handleAdd = (product) => {
    if (!product.inStock) return;
    const success = addToCart(product, 1);
    if (success) {
      setJustAddedId(product.id);
      setTimeout(() => setJustAddedId(null), 1800);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F3] py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          as="h1"
          eyebrow={isRTL ? "کلینیکل ڈسپنسری" : "Doctor Recommended Skincare"}
          title={isRTL ? "رائل کلینک اسکن شاپ" : "Medical Skincare Dispensary"}
          subtitle={isRTL
            ? "ہمارے ڈاکٹر کے تصدیق شدہ فارمولے جو لیزر کے بعد اور روزمرہ صحت مند جلد کے لیے موزوں ہیں۔"
            : "Formulated to protect newly treated skin, defend against UV damage, and support long-lasting clinical results."}
        />

        {/* Free Delivery Banner */}
        <div className="mb-10 p-4 rounded-2xl bg-[#F3EEE5] border border-[#E8E2D8] flex flex-wrap items-center justify-around gap-4 text-xs sm:text-sm text-[#262626]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#C5A46D] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold block text-[#262626]">
                {isRTL ? "پورے پاکستان میں مفت ڈیلیوری" : "Free delivery all over Pakistan"}
              </span>
              <span className="text-[11px] text-[#77716A]">
                {isRTL ? "تمام پروڈکٹس پر کوئی اضافی ڈیلیوری چارجز نہیں" : "Zero shipping fee on all skincare dispensary orders"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold block text-[#262626]">
                {isRTL ? "100% مستند کلینیکل اجزاء" : "100% Authentic Clinical Formulas"}
              </span>
              <span className="text-[11px] text-[#77716A]">
                {isRTL ? "ڈاکٹر کے معائنے کے بعد تجویز کردہ" : "Physician tested & non-comedogenic"}
              </span>
            </div>
          </div>
        </div>

        {/* Category Tabs: All, Facewash, Sunblock, Serum */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                activeCategory === cat.id
                  ? 'bg-[#C5A46D] text-white shadow-xs font-semibold'
                  : 'bg-white text-[#262626] border border-[#E8E2D8] hover:bg-[#F3EEE5]'
              }`}
            >
              {isRTL ? cat.labelUr : cat.labelEn}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-96 rounded-2xl bg-white/70 animate-pulse border border-[#E8E2D8]" />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const name = getLocalized(product.name);
              const description = getLocalized(product.description);
              const isAvailable = product.inStock !== false;
              const imageUrl = product.images?.[0] || product.image || "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80";
              const isPriceZero = !product.price || product.price === 0;

              return (
                <Card 
                  key={product.id} 
                  className="flex flex-col justify-between overflow-hidden p-0 border border-[#E8E2D8] hover:border-[#C5A46D] group transition-all duration-300"
                >
                  {/* Image container */}
                  <div className="relative aspect-square bg-[#F3EEE5] overflow-hidden">
                    <Link to={`/product/${product.id}`} className="block w-full h-full">
                      <OptimizedImage
                        src={imageUrl}
                        alt={name}
                        width={400}
                        height={400}
                        className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
                          !isAvailable ? 'grayscale opacity-75' : ''
                        }`}
                        loading="lazy"
                      />
                    </Link>

                    {/* Category pill */}
                    <div className="absolute top-3 start-3">
                      <span className="bg-white/95 text-[#262626] text-[10px] font-semibold px-2.5 py-1 rounded-md shadow-2xs border border-[#E8E2D8]">
                        {product.category}
                      </span>
                    </div>

                    {/* In Stock vs Out of stock badge */}
                    <div className="absolute top-3 end-3">
                      {!isAvailable ? (
                        <span className="bg-rose-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-md shadow-xs animate-pulse">
                          {isRTL ? "دستیاب نہیں (Out of stock)" : "Out of stock"}
                        </span>
                      ) : (
                        <span className="bg-emerald-600 text-white text-[10px] font-medium px-2 py-0.5 rounded-md shadow-2xs">
                          {isRTL ? "دستیاب ہے" : "In Stock"}
                        </span>
                      )}
                    </div>

                    {product.size && (
                      <div className="absolute bottom-2 end-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded">
                        {product.size}
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
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

                    {/* Price and Add button */}
                    <div className="mt-4 pt-3 border-t border-[#E8E2D8]">
                      <div className="mb-3">
                        <span className="text-[10px] text-[#77716A] uppercase tracking-wider block font-medium">
                          {t('products.price')}
                        </span>
                        {isPriceZero ? (
                          <span className="text-xs font-semibold text-[#C5A46D]">
                            {isRTL ? "قیمت کا تعین ایڈمن کرے گا" : "Price to be set by admin"}
                          </span>
                        ) : (
                          <span className="font-serif text-base font-bold text-[#262626]">
                            {product.price.toLocaleString()} PKR
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <Link to={`/product/${product.id}`} className="w-full">
                          <Button variant="outline" size="sm" className="w-full text-xs">
                            {isRTL ? "تفصیلات" : "Details"}
                          </Button>
                        </Link>

                        <Button
                          variant={justAddedId === product.id ? "dark" : (isAvailable ? "primary" : "secondary")}
                          size="sm"
                          disabled={!isAvailable}
                          onClick={() => handleAdd(product)}
                          className="w-full text-xs disabled:cursor-not-allowed"
                        >
                          {!isAvailable ? (
                            <span>{isRTL ? "ختم شدہ" : "Out of stock"}</span>
                          ) : justAddedId === product.id ? (
                            <span className="flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" />
                              {t('products.added')}
                            </span>
                          ) : (
                            t('products.addToCart')
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-[#F3EEE5] rounded-3xl max-w-md mx-auto p-8 border border-[#E8E2D8]">
            <p className="font-serif text-base text-[#262626]">
              {isRTL ? "اس کیٹیگری میں کوئی پروڈکٹ دستیاب نہیں" : "No products found in this category"}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveCategory('All')}
              className="mt-4"
            >
              {isRTL ? "تمام پروڈکٹس دیکھیں" : "View All Products"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopPage;
