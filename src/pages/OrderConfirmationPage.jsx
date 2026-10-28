import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, MessageCircle, Package, Clock, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { buildWhatsAppLink } from '../utils/whatsapp.js';
import Button from '../components/UI/Button.jsx';
import Card from '../components/UI/Card.jsx';
import Badge from '../components/UI/Badge.jsx';

export const OrderConfirmationPage = () => {
  const { isRTL, getLocalized } = useLanguage();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('royal_last_order');
      if (saved) {
        setOrder(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Unable to read order from sessionStorage:', e);
    }
  }, []);

  const orderNumber = order?.orderNumber || 'ROYAL-PENDING';
  const status = order?.status || 'Pending payment verification';

  // Optional button to send order number to clinic on WhatsApp
  const handleSendWhatsAppOrderNumber = () => {
    let msg = '';
    if (isRTL) {
      msg = `السلام علیکم رائل ایستھیٹک کلینک، میں نے اپنی شاپنگ کا آرڈر درج کروایا ہے۔\n*آرڈر نمبر:* ${orderNumber}\n*ٹرانزیکشن ID:* ${order?.transactionId || '____'}\n*گاہک:* ${order?.customer?.fullName || '____'}\nبراہ کرم ادائیگی کی تصدیق فرمائیں اور پارسل کی ترسیل شروع کریں۔ شکریہ!`;
    } else {
      msg = `Hello Royal Aesthetic & Laser Clinic, I have placed an order on your website.\n*Order Number:* ${orderNumber}\n*Transaction ID:* ${order?.transactionId || '____'}\n*Customer:* ${order?.customer?.fullName || '____'}\nPlease verify my payment and initiate parcel dispatch. Thank you!`;
    }

    window.open(buildWhatsAppLink(msg), '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-[#FAF8F3] py-12 sm:py-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Success Icon */}
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-200">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <span className="text-xs font-semibold text-[#C5A46D] uppercase tracking-wider">
          {isRTL ? "آرڈر کامیابی کے ساتھ درج ہو گیا" : "Order Placed Successfully"}
        </span>

        <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#262626] mt-2">
          {isRTL ? "رائل کلینک مالاکنڈ کا انتخاب کرنے کا شکریہ!" : "Thank You for Ordering with Royal Clinic!"}
        </h1>

        {/* Order Number Box */}
        <div className="mt-6 p-5 rounded-2xl bg-[#F3EEE5] border border-[#E8E2D8] text-center">
          <span className="text-xs text-[#77716A] block">
            {isRTL ? "آپ کا آرڈر نمبر:" : "Your Order Reference Number:"}
          </span>
          <span className="font-mono text-2xl font-bold text-[#262626] tracking-wider mt-1 block">
            {orderNumber}
          </span>

          <div className="mt-3 flex items-center justify-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
            <span className="inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
              <Clock className="w-3.5 h-3.5 me-1" />
              {status}
            </span>
          </div>

          <p className="text-xs text-[#77716A] mt-3">
            {isRTL
              ? "آپ کا آرڈر اور ٹرانزیکشن ID فائر بیس ڈیٹا بیس میں محفوظ کر لی گئی ہے۔ ہماری کلینک ٹیم ادائیگی کی جانچ کر رہی ہے۔"
              : "Your order details and Transaction ID are logged in our clinic database. Our team is verifying your payment."}
          </p>
        </div>

        {/* Optional Button to Send Order Number to Clinic on WhatsApp */}
        <div className="mt-6 p-6 rounded-2xl bg-white border border-[#E8E2D8] shadow-xs text-start">
          <div className="flex items-center gap-2 mb-2">
            <MessageCircle className="w-5 h-5 text-emerald-600" />
            <h3 className="font-semibold text-sm text-[#262626]">
              {isRTL ? "کلینک کو واٹس ایپ پر آرڈر نمبر بھیجیں (اختیاری)" : "Send Order Number on WhatsApp (Optional)"}
            </h3>
          </div>
          <p className="text-xs text-[#77716A] leading-relaxed mb-4">
            {isRTL 
              ? "تیز ترین تصدیق کے لیے، ایک کلک سے اپنا آرڈر نمبر اور ٹرانزیکشن ID کلینک مینیجر کو واٹس ایپ پر بھیجیں۔"
              : "To fast-track manual payment verification and parcel packing, you can notify the clinic team directly on WhatsApp."}
          </p>

          <Button
            variant="whatsapp"
            size="md"
            onClick={handleSendWhatsAppOrderNumber}
            className="w-full justify-center text-xs sm:text-sm"
          >
            <MessageCircle className="w-4 h-4 me-2" />
            <span>{isRTL ? "واٹس ایپ پر آرڈر نمبر شیئر کریں" : "Send Order Number to Clinic via WhatsApp"}</span>
          </Button>
        </div>

        {/* Order Details Preview */}
        {order && (
          <Card className="mt-6 text-start p-5 border-[#E8E2D8]">
            <h4 className="text-xs font-semibold text-[#262626] uppercase tracking-wider mb-3">
              {isRTL ? "آرڈر کی تفصیلات" : "Order Summary"}
            </h4>

            <div className="text-xs space-y-2 text-[#77716A]">
              <div className="flex justify-between">
                <span>{isRTL ? "کسٹمر کا نام:" : "Customer:"}</span>
                <span className="font-semibold text-[#262626]">{order.customer?.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span>{isRTL ? "موبائل:" : "Phone:"}</span>
                <span className="font-mono text-[#262626]">{order.customer?.phone}</span>
              </div>
              <div className="flex justify-between">
                <span>{isRTL ? "شہر:" : "City:"}</span>
                <span className="text-[#262626]">{order.customer?.city}</span>
              </div>
              <div className="flex justify-between">
                <span>{isRTL ? "پتہ:" : "Delivery Address:"}</span>
                <span className="text-[#262626] text-end max-w-xs truncate">{order.customer?.address}</span>
              </div>
              <div className="flex justify-between">
                <span>{isRTL ? "طریقہ ادائیگی:" : "Payment Method:"}</span>
                <span className="font-medium text-[#262626] capitalize">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span>{isRTL ? "ٹرانزیکشن ID:" : "Transaction ID:"}</span>
                <span className="font-mono font-bold text-emerald-800">{order.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span>{isRTL ? "ڈیلیوری:" : "Delivery:"}</span>
                <span className="font-semibold text-emerald-700">{order.delivery || "Free delivery all over Pakistan"}</span>
              </div>

              {/* Items summary */}
              {order.items?.length > 0 && (
                <div className="pt-2 border-t border-[#E8E2D8] space-y-1">
                  <span className="font-semibold text-[#262626] block mb-1">
                    {isRTL ? "اشیاء:" : "Purchased Items:"}
                  </span>
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>• {getLocalized(item.name)} (x{item.quantity})</span>
                      <span>
                        {item.price > 0 
                          ? `${(item.price * item.quantity).toLocaleString()} PKR` 
                          : (isRTL ? "ایڈمن پرائسنگ" : "Admin pricing")}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Back navigation */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link to="/">
            <Button variant="outline" size="sm">
              {isRTL ? "ہوم پیج پر جائیں" : "Back to Home"}
            </Button>
          </Link>
          <Link to="/shop">
            <Button variant="primary" size="sm">
              {isRTL ? "مزید مصنوعات دیکھیں" : "Continue Shopping"}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
