import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft, ArrowRight, ShoppingBag, ShieldCheck, Truck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import Button from '../components/UI/Button.jsx';
import Card from '../components/UI/Card.jsx';
import SectionHeader from '../components/UI/SectionHeader.jsx';

export const CartPage = () => {
  const { isRTL, t, getLocalized } = useLanguage();
  const { cart, updateQuantity, removeFromCart, total, cartCount } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center bg-white">
        <div className="w-16 h-16 rounded-full bg-[#FBF3F0] flex items-center justify-center text-[#D9A38F] mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl text-[#3A3A3A]">
          {t('cart.empty')}
        </h2>
        <p className="text-sm text-[#6B5B55] mt-2 mb-6 max-w-sm">
          {isRTL
            ? "آپ نے ابھی تک کوئی پروڈکٹ منتخب نہیں کی ہے۔ ہماری شاپ دیکھیں۔"
            : "Explore our physician-recommended skincare products designed for healthy, glowing skin."}
        </p>
        <Link to="/shop">
          <Button variant="primary">
            {t('cart.continueShopping')}
          </Button>
        </Link>
      </div>
    );
  }

  const hasAnyZeroPrice = cart.some(item => !item.price || item.price === 0);

  return (
    <div className="min-h-screen bg-white py-10 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow={isRTL ? "خریداری" : "Dispensary Cart"}
          title={t('cart.yourBag')}
          subtitle={isRTL ? "گیسٹ چیک آؤٹ — اکاؤنٹ بنانے کی ضرورت نہیں۔" : "Fast guest checkout — no customer account required."}
          centered={false}
        />

        {/* Free Delivery Banner */}
        <div className="mb-8 p-3.5 sm:p-4 rounded-2xl bg-[#FBF3F0] border border-[#F4E4DE] flex items-center gap-3 text-xs sm:text-sm text-[#3A3A3A]">
          <div className="w-8 h-8 rounded-full bg-[#D9A38F] text-white flex items-center justify-center shrink-0">
            <Truck className="w-4 h-4" />
          </div>
          <div>
            <strong className="block text-[#3A3A3A]">
              {isRTL ? "پورے پاکستان میں مفت ڈیلیوری" : "Free delivery all over Pakistan"}
            </strong>
            <span className="text-[11px] text-[#6B5B55]">
              {isRTL ? "ہم آپ کا پارسل بغیر کسی اضافی فیس کے محفوظ طریقے سے پہنچائیں گے۔" : "Zero delivery fees applied to your dispensary package."}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => {
              const name = getLocalized(item.name);
              const imageUrl = item.images?.[0] || item.image || "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80";
              const isZero = !item.price || item.price === 0;

              return (
                <Card key={item.id} className="p-4 sm:p-5 flex gap-4 items-center">
                  <img
                    src={imageUrl}
                    alt={name || "Product in cart"}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl bg-[#FBF3F0] shrink-0 border border-[#F4E4DE]"
                    loading="lazy"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <Link to={`/product/${item.id}`} className="truncate">
                        <h4 className="font-serif font-semibold text-sm sm:text-base text-[#3A3A3A] hover:text-[#D9A38F] transition-colors truncate">
                          {name}
                        </h4>
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="text-[#6B5B55] hover:text-rose-600 p-1 rounded-lg transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs text-[#6B5B55] mt-0.5">
                      {item.category || item.size}
                    </p>

                    <div className="mt-3 flex items-center justify-between">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-[#F4E4DE] rounded-lg bg-white overflow-hidden text-xs">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1.5 text-[#6B5B55] hover:bg-[#FBF3F0]"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 py-1 font-semibold text-[#3A3A3A]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1.5 text-[#6B5B55] hover:bg-[#FBF3F0]"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Item Total / Admin note */}
                      {isZero ? (
                        <span className="text-xs font-semibold text-[#D9A38F]">
                          {isRTL ? "قیمت کا تعین ایڈمن کرے گا" : "Price to be set by admin"}
                        </span>
                      ) : (
                        <span className="font-semibold text-sm text-[#3A3A3A]">
                          {(item.price * item.quantity).toLocaleString()} PKR
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}

            <div className="pt-2">
              <Link to="/shop" className="text-xs text-[#D9A38F] hover:underline flex items-center gap-1 font-medium">
                {isRTL ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
                <span>{isRTL ? "مزید اسکن کیئر پروڈکٹس دیکھیں" : "Continue shopping for more skincare"}</span>
              </Link>
            </div>
          </div>

          {/* Order Summary Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-28 bg-[#FBF3F0]/60 p-6 border-[#F4E4DE]">
              <h3 className="font-serif text-lg font-semibold text-[#3A3A3A] mb-4">
                {isRTL ? "خلاصۂ آرڈر" : "Order Summary"}
              </h3>

              <div className="space-y-3 text-sm text-[#6B5B55] pb-4 border-b border-[#F4E4DE]">
                <div className="flex justify-between">
                  <span>{t('cart.subtotal')} ({cartCount} {isRTL ? "اشیاء" : "items"})</span>
                  <span className="font-medium text-[#3A3A3A]">
                    {hasAnyZeroPrice && total === 0 ? (
                      <span className="text-xs text-[#D9A38F]">
                        {isRTL ? "ایڈمن کا جائزہ درکار" : "Pending admin pricing"}
                      </span>
                    ) : (
                      `${total.toLocaleString()} PKR`
                    )}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span>{isRTL ? "ڈیلیوری" : "Delivery fee"}</span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {isRTL ? "مفت (Free)" : "Free delivery"}
                  </span>
                </div>
              </div>

              <div className="py-4 flex justify-between items-baseline">
                <span className="font-serif font-semibold text-base text-[#3A3A3A]">
                  {isRTL ? "کل واجب الادا رقم" : "Total Amount"}
                </span>
                <span className="font-serif text-2xl font-bold text-[#3A3A3A]">
                  {total > 0 ? `${total.toLocaleString()} PKR` : (isRTL ? "بذریعہ تصدیق" : "Upon verification")}
                </span>
              </div>

              <div className="pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate('/checkout')}
                  className="w-full justify-center text-sm"
                >
                  {t('cart.proceedToCheckout')}
                </Button>
              </div>

              <div className="mt-4 pt-4 border-t border-[#F4E4DE] text-[11px] text-[#6B5B55] space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>{isRTL ? "ایزی پیسہ، جاز کیش یا بینک ٹرانسفر" : "Easypaisa, JazzCash, or Bank Transfer"}</span>
                </div>
                <p>
                  {isRTL ? "کوئی کارڈ داخل کرنے کی ضرورت نہیں۔ رقم باہر ادا کی جاتی ہے۔" : "Pay securely outside the website and enter transaction ID at checkout."}
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
