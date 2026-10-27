import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, Truck, ArrowLeft, ArrowRight, CheckCircle2, 
  MessageCircle, Upload, Image as ImageIcon, X, AlertCircle, Copy, Check 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { getPaymentSettings, createGuestOrder } from '../firebase/shopService.js';
import { DEFAULT_PAYMENT_SETTINGS } from '../data/seedProducts.js';
import { buildWhatsAppLink } from '../utils/whatsapp.js';
import Button from '../components/UI/Button.jsx';
import Card from '../components/UI/Card.jsx';
import SectionHeader from '../components/UI/SectionHeader.jsx';
import Badge from '../components/UI/Badge.jsx';

export const CheckoutPage = () => {
  const { language, isRTL, t, getLocalized } = useLanguage();
  const { cart, total, clearCart } = useCart();
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    city: 'Malakand / Thana',
    address: '',
    notes: '',
    paymentMethod: 'easypaisa', // 'easypaisa', 'jazzcash', 'bankTransfer'
    transactionId: ''
  });

  const [paymentSettings, setPaymentSettings] = useState(DEFAULT_PAYMENT_SETTINGS);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [screenshotDataUrl, setScreenshotDataUrl] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [copiedKey, setCopiedKey] = useState(null);

  // Fetch live payment settings from Firestore
  useEffect(() => {
    let isMounted = true;
    async function loadSettings() {
      try {
        const settings = await getPaymentSettings();
        if (isMounted && settings) {
          setPaymentSettings(settings);
        }
      } catch (e) {
        console.warn('Error loading Firestore payment settings:', e);
      } finally {
        if (isMounted) setLoadingSettings(false);
      }
    }
    loadSettings();
    return () => { isMounted = false; };
  }, []);

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="font-serif text-2xl text-[#3A3A3A]">
          {isRTL ? "ٹوکری خالی ہے" : "No Items in Bag"}
        </h2>
        <p className="text-sm text-[#6B5B55] mt-2 mb-6">
          {isRTL ? "چیک آؤٹ سے پہلے براہ کرم مصنوعات شامل کریں۔" : "Please add products before checking out."}
        </p>
        <Link to="/shop">
          <Button variant="primary">
            {isRTL ? "اسکن شاپ پر جائیں" : "Browse Skin Shop"}
          </Button>
        </Link>
      </div>
    );
  }

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (formError) setFormError('');
  };

  const handleScreenshotChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setFormError(isRTL ? "تصویر کا سائز 2MB سے کم ہونا چاہیے۔" : "Screenshot image size must be under 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setScreenshotDataUrl(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const copyToClipboard = (text, key) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.fullName.trim()) {
      setFormError(isRTL ? "براہ کرم اپنا پورا نام درج کریں۔" : "Please provide your full name.");
      return;
    }
    if (!formData.phone.trim()) {
      setFormError(isRTL ? "براہ کرم اپنا موبائل یا واٹس ایپ نمبر درج کریں۔" : "Please enter your mobile or WhatsApp contact number.");
      return;
    }
    if (!formData.address.trim()) {
      setFormError(isRTL ? "براہ کرم اپنا مکمل ڈیلیوری پتہ درج کریں۔" : "Please specify your complete street address.");
      return;
    }
    if (!formData.transactionId.trim()) {
      setFormError(isRTL ? "براہ کرم ادائیگی کے بعد موصول ہونے والی ٹرانزیکشن ID (Trx ID) درج کریں۔" : "Please provide your payment Transaction ID (Trx ID / Reference).");
      return;
    }

    setSubmitting(true);
    setFormError('');

    try {
      const orderNumber = `ROYAL-${Math.floor(100000 + Math.random() * 900000)}`;

      const orderPayload = {
        orderNumber,
        customer: {
          fullName: formData.fullName.trim(),
          phone: formData.phone.trim(),
          city: formData.city,
          address: formData.address.trim(),
          notes: formData.notes.trim() || null
        },
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price || 0,
          quantity: item.quantity,
          category: item.category || ''
        })),
        totalAmount: total,
        paymentMethod: formData.paymentMethod,
        transactionId: formData.transactionId.trim(),
        screenshotUrl: screenshotDataUrl || null,
        delivery: "Free delivery all over Pakistan",
        status: "Pending payment verification",
        createdAt: new Date().toISOString()
      };

      // Save order in Firestore
      await createGuestOrder(orderPayload);

      // Save temporary order summary in session storage for Order Confirmation page
      sessionStorage.setItem('royal_last_order', JSON.stringify(orderPayload));

      // Clear shopping cart
      clearCart();

      // Redirect to confirmation
      navigate('/order-confirmation');
    } catch (err) {
      console.error('Order creation error:', err);
      setFormError(isRTL 
        ? "آرڈر جمع کرنے میں دشواری پیش آئی۔ براہ کرم دوبارہ کوشش کریں یا واٹس ایپ پر رابطہ کریں۔" 
        : "Failed to save order in database. Please check your connection or contact our clinic on WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  };

  const activeMethod = formData.paymentMethod;

  return (
    <div className="min-h-screen bg-white py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow={isRTL ? "محفوظ گیسٹ چیک آؤٹ" : "Guest Checkout"}
          title={isRTL ? "آرڈر اور ڈیلیوری کی تفصیلات" : "Shipping & Manual Payment"}
          subtitle={isRTL
            ? "کوئی کارڈ یا پاس ورڈ درکار نہیں۔ رقم باہر ادا کریں اور رسید کی تفصیلات یہاں درج کریں۔"
            : "No registration required. Pay securely via mobile wallet/bank and confirm with your Trx ID."}
          centered={false}
        />

        {/* Free Delivery Banner */}
        <div className="mb-8 p-4 rounded-2xl bg-[#FBF3F0] border border-[#F4E4DE] flex items-center justify-between gap-4 text-xs sm:text-sm text-[#3A3A3A]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#D9A38F] text-white flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <strong className="block text-sm font-semibold text-[#3A3A3A]">
                {isRTL ? "پورے پاکستان میں مفت ڈیلیوری" : "Free delivery all over Pakistan"}
              </strong>
              <span className="text-[11px] text-[#6B5B55]">
                {isRTL ? "کوئی پوشیدہ اخراجات یا شپنگ فیس نہیں" : "No hidden charges or shipping fees"}
              </span>
            </div>
          </div>
          <Badge variant="success" className="text-xs">
            {isRTL ? "مفت ترسیل" : "Zero PKR Delivery"}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Checkout Form */}
          <div className="lg:col-span-2">
            <Card className="p-6 sm:p-8">
              {formError && (
                <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 1. Recipient Details */}
                <div>
                  <h3 className="font-serif text-lg font-semibold text-[#3A3A3A] mb-4 pb-2 border-b border-[#F4E4DE]">
                    {isRTL ? "1. وصول کنندہ کی معلومات" : "1. Recipient Information"}
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#3A3A3A] mb-1.5">
                        {isRTL ? "پورا نام *" : "Full Name *"}
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        required
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder={isRTL ? "مثال: مریم خان" : "e.g. Maryam Khan"}
                        className="w-full px-4 py-3 rounded-xl border border-[#F4E4DE] text-sm text-[#3A3A3A] focus:outline-none focus:border-[#D9A38F] bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#3A3A3A] mb-1.5">
                          {isRTL ? "موبائل یا واٹس ایپ نمبر *" : "Mobile / WhatsApp Number *"}
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="0347 0000000"
                          className="w-full px-4 py-3 rounded-xl border border-[#F4E4DE] text-sm text-[#3A3A3A] focus:outline-none focus:border-[#D9A38F] bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#3A3A3A] mb-1.5">
                          {isRTL ? "شہر / ضلع *" : "City / District *"}
                        </label>
                        <select
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border border-[#F4E4DE] text-sm text-[#3A3A3A] focus:outline-none focus:border-[#D9A38F] bg-white"
                        >
                          <option value="Malakand / Thana">Malakand / Thana</option>
                          <option value="Batkhela">Batkhela</option>
                          <option value="Chakdara">Chakdara</option>
                          <option value="Mingora / Swat">Mingora / Swat</option>
                          <option value="Mardan">Mardan</option>
                          <option value="Peshawar">Peshawar</option>
                          <option value="Islamabad / Rawalpindi">Islamabad / Rawalpindi</option>
                          <option value="Lahore">Lahore</option>
                          <option value="Karachi">Karachi</option>
                          <option value="Other City in Pakistan">Other City in Pakistan</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#3A3A3A] mb-1.5">
                        {isRTL ? "مکمل پتہ اور قریبی نشانی *" : "Full Street Address & Landmark *"}
                      </label>
                      <textarea
                        rows={3}
                        name="address"
                        required
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder={isRTL ? "محلہ، گلی، مکان نمبر، قریبی مسجد یا دکان..." : "House/apartment #, street, nearby shop or landmark..."}
                        className="w-full px-4 py-3 rounded-xl border border-[#F4E4DE] text-sm text-[#3A3A3A] focus:outline-none focus:border-[#D9A38F] bg-white resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#3A3A3A] mb-1.5">
                        {isRTL ? "خصوصی ڈیلیوری نوٹ (اختیاری)" : "Special Delivery Instructions (Optional)"}
                      </label>
                      <input
                        type="text"
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        placeholder={isRTL ? "کال کرنے کا مناسب وقت وغیرہ..." : "Preferred delivery hours or instructions..."}
                        className="w-full px-4 py-3 rounded-xl border border-[#F4E4DE] text-sm text-[#3A3A3A] focus:outline-none focus:border-[#D9A38F] bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Payment Instructions from Firestore Site Settings */}
                <div className="pt-4">
                  <h3 className="font-serif text-lg font-semibold text-[#3A3A3A] mb-2 pb-2 border-b border-[#F4E4DE]">
                    {isRTL ? "2. ادائیگی کی ہدایات (Payment Instructions)" : "2. Payment Instructions"}
                  </h3>
                  <p className="text-xs text-[#6B5B55] mb-4">
                    {isRTL 
                      ? "ویب سائٹ سے باہر اپنے موبائل اکاؤنٹ یا بینک سے رقم ادا کریں اور رسید کی ٹرانزیکشن ID درج کریں۔" 
                      : "Pay outside the website using the account details below, then enter your Trx ID."}
                  </p>

                  {/* Payment method selector tabs */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'easypaisa' }))}
                      className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                        activeMethod === 'easypaisa'
                          ? 'bg-[#25D366]/10 text-emerald-800 border-emerald-500 shadow-2xs'
                          : 'bg-white border-[#F4E4DE] text-[#6B5B55] hover:bg-[#FBF3F0]'
                      }`}
                    >
                      Easypaisa
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'jazzcash' }))}
                      className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                        activeMethod === 'jazzcash'
                          ? 'bg-rose-50 text-rose-800 border-rose-400 shadow-2xs'
                          : 'bg-white border-[#F4E4DE] text-[#6B5B55] hover:bg-[#FBF3F0]'
                      }`}
                    >
                      JazzCash
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'bankTransfer' }))}
                      className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                        activeMethod === 'bankTransfer'
                          ? 'bg-indigo-50 text-indigo-800 border-indigo-400 shadow-2xs'
                          : 'bg-white border-[#F4E4DE] text-[#6B5B55] hover:bg-[#FBF3F0]'
                      }`}
                    >
                      Bank / 1Link
                    </button>
                  </div>

                  {/* Payment Instructions Details Box */}
                  <div className="p-4 rounded-2xl bg-[#FBF3F0] border border-[#F4E4DE] text-xs space-y-2.5">
                    {activeMethod === 'easypaisa' && (
                      <>
                        <div className="flex items-center justify-between pb-2 border-b border-[#F4E4DE]">
                          <span className="font-semibold text-emerald-800">Easypaisa Mobile Account</span>
                          <span className="text-[10px] text-[#6B5B55]">Instant Transfer</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[#6B5B55]">{isRTL ? "اکاؤنٹ ٹائٹل:" : "Account Title:"}</span>
                          <span className="font-bold text-[#3A3A3A]">{paymentSettings.easypaisa.accountTitle}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[#6B5B55]">{isRTL ? "موبائل نمبر:" : "Account Number:"}</span>
                          <div className="flex items-center gap-1.5 font-mono font-bold text-[#3A3A3A]">
                            <span>{paymentSettings.easypaisa.accountNumber}</span>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(paymentSettings.easypaisa.accountNumber, 'ep')}
                              className="p-1 hover:text-[#D9A38F]"
                            >
                              {copiedKey === 'ep' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>
                        <p className="text-[11px] text-[#6B5B55] pt-1 border-t border-[#F4E4DE]/60 italic">
                          {getLocalized(paymentSettings.easypaisa.instructions)}
                        </p>
                      </>
                    )}

                    {activeMethod === 'jazzcash' && (
                      <>
                        <div className="flex items-center justify-between pb-2 border-b border-[#F4E4DE]">
                          <span className="font-semibold text-rose-800">JazzCash Account</span>
                          <span className="text-[10px] text-[#6B5B55]">TID Verification</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[#6B5B55]">{isRTL ? "اکاؤنٹ ٹائٹل:" : "Account Title:"}</span>
                          <span className="font-bold text-[#3A3A3A]">{paymentSettings.jazzcash.accountTitle}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[#6B5B55]">{isRTL ? "اکاؤنٹ نمبر:" : "Account Number:"}</span>
                          <div className="flex items-center gap-1.5 font-mono font-bold text-[#3A3A3A]">
                            <span>{paymentSettings.jazzcash.accountNumber}</span>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(paymentSettings.jazzcash.accountNumber, 'jc')}
                              className="p-1 hover:text-[#D9A38F]"
                            >
                              {copiedKey === 'jc' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>
                        <p className="text-[11px] text-[#6B5B55] pt-1 border-t border-[#F4E4DE]/60 italic">
                          {getLocalized(paymentSettings.jazzcash.instructions)}
                        </p>
                      </>
                    )}

                    {activeMethod === 'bankTransfer' && (
                      <>
                        <div className="flex items-center justify-between pb-2 border-b border-[#F4E4DE]">
                          <span className="font-semibold text-indigo-900">{paymentSettings.bankTransfer.bankName}</span>
                          <span className="text-[10px] text-[#6B5B55]">{paymentSettings.bankTransfer.branch}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[#6B5B55]">{isRTL ? "اکاؤنٹ ٹائٹل:" : "Account Title:"}</span>
                          <span className="font-bold text-[#3A3A3A]">{paymentSettings.bankTransfer.accountTitle}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[#6B5B55]">IBAN:</span>
                          <div className="flex items-center gap-1.5 font-mono font-bold text-[#3A3A3A]">
                            <span className="text-[11px]">{paymentSettings.bankTransfer.iban}</span>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(paymentSettings.bankTransfer.iban, 'iban')}
                              className="p-1 hover:text-[#D9A38F]"
                            >
                              {copiedKey === 'iban' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>
                        <p className="text-[11px] text-[#6B5B55] pt-1 border-t border-[#F4E4DE]/60 italic">
                          {getLocalized(paymentSettings.bankTransfer.instructions)}
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* 3. Proof of Payment (Transaction ID & Optional Screenshot) */}
                <div className="pt-4 border-t border-[#F4E4DE] space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#3A3A3A] mb-1.5">
                      {isRTL ? "ٹرانزیکشن ID (Trx ID / TID / ریفرنس نمبر) *" : "Payment Transaction ID (Trx ID / TID) *"}
                    </label>
                    <input
                      type="text"
                      name="transactionId"
                      required
                      value={formData.transactionId}
                      onChange={handleInputChange}
                      placeholder={isRTL ? "مثال: 37372910482 یا TID 8558" : "e.g. 37372910482 or TID 8558"}
                      className="w-full px-4 py-3 rounded-xl border border-[#F4E4DE] text-sm font-mono text-[#3A3A3A] focus:outline-none focus:border-[#D9A38F] bg-white"
                    />
                    <p className="text-[11px] text-[#6B5B55] mt-1">
                      {isRTL ? "ادائیگی کے بعد موصول ہونے والا تصدیقی ایس ایم ایس کوڈ درج کریں۔" : "Enter the verification reference from your payment confirmation SMS."}
                    </p>
                  </div>

                  {/* Optional Payment Screenshot Upload */}
                  <div>
                    <label className="block text-xs font-semibold text-[#3A3A3A] mb-1.5">
                      {isRTL ? "ادائیگی کا اسکرین شاٹ (اختیاری)" : "Payment Screenshot (Optional)"}
                    </label>
                    {screenshotDataUrl ? (
                      <div className="relative inline-block border border-[#F4E4DE] rounded-xl p-2 bg-[#FBF3F0]">
                        <img
                          src={screenshotDataUrl}
                          alt="Payment Screenshot"
                          className="h-28 w-auto rounded-lg object-contain"
                        />
                        <button
                          type="button"
                          onClick={() => setScreenshotDataUrl(null)}
                          className="absolute -top-2 -end-2 bg-rose-600 text-white rounded-full p-1 hover:bg-rose-700 shadow-sm"
                          aria-label="Remove screenshot"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <label className="border-2 border-dashed border-[#F4E4DE] hover:border-[#D9A38F] rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors bg-[#FBF3F0]/40">
                        <Upload className="w-6 h-6 text-[#D9A38F] mb-1" />
                        <span className="text-xs font-medium text-[#3A3A3A]">
                          {isRTL ? "رسید کی تصویر یا اسکرین شاٹ اپلوڈ کریں" : "Click to upload payment receipt or screenshot"}
                        </span>
                        <span className="text-[10px] text-[#6B5B55] mt-0.5">PNG, JPG up to 2MB</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleScreenshotChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={submitting}
                    className="w-full justify-center text-sm"
                  >
                    {submitting
                      ? (isRTL ? "آرڈر تصدیق کے لیے محفوظ ہو رہا ہے..." : "Saving Order in Database...")
                      : (isRTL ? "آرڈر مکمل کریں (ادائیگی تصدیق کے لیے بھیجیں)" : "Submit Order (Pending Payment Verification)")}
                  </Button>
                  <p className="text-[11px] text-center text-[#6B5B55] mt-2">
                    {isRTL ? "آرڈر کی حیثیت: 'Pending payment verification' کے طور پر محفوظ ہوگی۔" : "Order will be saved with status 'Pending payment verification' in clinic Firestore."}
                  </p>
                </div>
              </form>
            </Card>
          </div>

          {/* Mini Cart Order Summary Card */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-[#FBF3F0]/60 border-[#F4E4DE] sticky top-28">
              <h3 className="font-serif text-base font-semibold text-[#3A3A3A] mb-3">
                {isRTL ? "آپ کا آرڈر" : "Order Summary"}
              </h3>

              <div className="divide-y divide-[#F4E4DE] text-xs">
                {cart.map((item) => (
                  <div key={item.id} className="py-2.5 flex justify-between gap-2">
                    <div>
                      <p className="font-semibold text-[#3A3A3A] line-clamp-1">
                        {getLocalized(item.name)}
                      </p>
                      <p className="text-[#6B5B55]">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-medium text-[#3A3A3A] shrink-0">
                      {!item.price ? (
                        <span className="text-[10px] text-[#D9A38F]">{isRTL ? "زیرِ تعین" : "Pending"}</span>
                      ) : (
                        `${(item.price * item.quantity).toLocaleString()} PKR`
                      )}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-[#F4E4DE] space-y-2 text-xs">
                <div className="flex justify-between text-[#6B5B55]">
                  <span>{isRTL ? "ڈیلیوری:" : "Delivery:"}</span>
                  <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {isRTL ? "مفت (Free)" : "Free delivery"}
                  </span>
                </div>

                <div className="flex justify-between text-sm font-semibold text-[#3A3A3A] pt-2 border-t border-[#F4E4DE]">
                  <span>{isRTL ? "کل رقم:" : "Total to Pay:"}</span>
                  <span>{total > 0 ? `${total.toLocaleString()} PKR` : (isRTL ? "تصدیق کے بعد" : "Pending verification")}</span>
                </div>
              </div>

              <div className="mt-5 p-3 rounded-xl bg-white border border-[#F4E4DE] text-[11px] text-[#6B5B55] space-y-1">
                <div className="flex items-center gap-1.5 font-medium text-[#3A3A3A]">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>{isRTL ? "محفوظ گیسٹ آرڈر" : "Secure Guest Order"}</span>
                </div>
                <p>
                  {isRTL 
                    ? "ہم کبھی کارڈ کی معلومات نہیں مانگتے۔ تمام ادائیگیاں بیرونی والٹ/بینک سے ہوتی ہیں۔" 
                    : "No credit cards collected. Payments are made outside the website."}
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
