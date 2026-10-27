import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';

const ROUTE_META = {
  '/': {
    titleEn: 'Royal Aesthetic & Laser Clinic | Premier Skin Care & Medical Aesthetics',
    titleUr: 'رائل ایستھیٹک اینڈ لیزر کلینک | مصدقہ کاسمیٹک و اسکن کیئر کلینک',
    descEn: 'Doctor-supervised laser hair removal, acne treatments, HydraFacials, and physician-dispensed skincare in Thana, Malakand. Hair transplant in Islamabad.',
    descUr: 'مالاکنڈ میں ماہر ڈاکٹر کی زیر نگرانی جدید لیزر ہیئر ریموول، ایکنی اور گڑھوں کا علاج، ہائیڈرا فیشل، اور مصدقہ اسکن کیئر مصنوعات۔'
  },
  '/services': {
    titleEn: 'Clinical Treatments & Laser Procedures | Royal Aesthetic Clinic',
    titleUr: 'طبی طریقہ علاج اور لیزر سروسز | رائل کلینک مالاکنڈ',
    descEn: 'Explore our 10 specialized aesthetic procedures: Laser Hair Removal/ Hair Reduction, Pigmentation / Melasma, Medicated HydraFacial, Face PRP + Micro-Needling, Hair PRP + Exosomes, Hair Transplant, Botox, Whitening Drips, Mole Removal, and Acne treatment.',
    descUr: 'رائل کلینک کے 10 مخصوص جمالیاتی طریقہ کار: لیزر ہیئر ریموول، پگمنٹیشن / میلازما، میڈیکیٹڈ ہائیڈرا فیشل، فیس پی آر پی، ہیئر پی آر پی، ہیئر ٹرانسپلانٹ، بوٹوکس، وائٹننگ ڈرپس، تل ہٹانا، اور ایکنی ٹریٹمنٹ۔'
  },
  '/shop': {
    titleEn: 'Physician Recommended Skincare Dispensary | Royal Aesthetic Clinic',
    titleUr: 'ڈاکٹر کی تجویز کردہ اسکن کیئر مصنوعات | رائل کلینک',
    descEn: 'Order oil-control facewashes, SPF 50 & 100 sunblocks, and niacinamide/hyaluronic brightening serums with free delivery across Pakistan.',
    descUr: 'آئل کنٹرول فیس واش، سن بلاک ایس پی ایف 50 اور 100، اور برائٹننگ سیرمز۔ پورے پاکستان میں فری ڈیلیوری۔'
  },
  '/gallery': {
    titleEn: 'Before & After Clinical Transformations | Royal Aesthetic Clinic',
    titleUr: 'علاج سے قبل اور بعد کے تصویری نتائج | رائل کلینک',
    descEn: 'Documented before and after case studies for acne scars, diode laser hair reduction, and melasma pigmentation protocols in Malakand.',
    descUr: 'ایکنی اسکارز، لیزر ہیئر ریموول اور چھائیوں کے علاج کے حقیقی اور مصدقہ تصویری نتائج۔'
  },
  '/reviews': {
    titleEn: 'Patient Reviews & Experiences | Royal Aesthetic Clinic',
    titleUr: 'مریضوں کے تاثرات اور تجربات | رائل کلینک مالاکنڈ',
    descEn: 'Read verified feedback and testimonials from patients across Malakand, Batkhela, and Swat who experienced our aesthetic and laser procedures.',
    descUr: 'مالاکنڈ، بٹ خیلہ اور سوات کے معزز مریضوں کے سچے اور مصدقہ تاثرات۔'
  },
  '/contact': {
    titleEn: 'Contact, Timings & Location | Royal Aesthetic Clinic Thana',
    titleUr: 'رابطہ، اوقات اور کلینک لوکیشن | رائل کلینک تھانہ مالاکنڈ',
    descEn: 'Find our exact location opposite Meeral Restaurant in Thana Malakand, clinic consultation hours (Sat-Thu 11am-5pm), and direct WhatsApp booking.',
    descUr: 'تھانہ مالاکنڈ بالمقابل میرال ریسٹورنٹ، اوقات صبح 11 تا شام 5 بجے (جمعہ بند) اور واٹس ایپ پر فوری رابطہ۔'
  },
  '/cart': {
    titleEn: 'Your Skincare Bag | Royal Aesthetic Clinic',
    titleUr: 'آپ کا شاپنگ کارٹ | رائل کلینک',
    descEn: 'Review your selected physician-formulated skincare products before placing your order with nationwide free delivery.',
    descUr: 'منتخب کردہ اسکن کیئر پراڈکٹس کا جائزہ لیں اور فری ہوم ڈیلیوری کے ساتھ آرڈر مکمل کریں۔'
  },
  '/checkout': {
    titleEn: 'Secure Guest Checkout | Royal Aesthetic Clinic',
    titleUr: 'آرڈر چیک آؤٹ | رائل کلینک',
    descEn: 'Complete your skincare order via direct Easypaisa, JazzCash, or bank transfer with pending payment verification.',
    descUr: 'ایزی پیسہ، جاز کیش یا بینک ٹرانسفر کے ذریعے اپنا آرڈر محفوظ طریقے سے درج کریں۔'
  },
  '/order-confirmation': {
    titleEn: 'Order Received | Royal Aesthetic Clinic',
    titleUr: 'آرڈر موصول ہو گیا | رائل کلینک',
    descEn: 'Your skincare order has been placed successfully and is pending payment verification by clinic dispensary.',
    descUr: 'آپ کا آرڈر موصول ہو چکا ہے اور کلینک انتظامیہ تصدیق کے بعد فوری روانہ کرے گی۔'
  },
  '/admin': {
    titleEn: 'Private Clinic Management Portal | Royal Aesthetic Clinic',
    titleUr: 'انتظامی پورٹل | رائل کلینک',
    descEn: 'Authorized administration panel for treatment catalog, skincare inventory, patient orders, and live clinic settings.',
    descUr: 'رائل کلینک انتظامی پورٹل برائے سروسز، مصنوعات اور کسٹمر آرڈرز۔'
  }
};

export const RouteSEO = () => {
  const { pathname } = useLocation();
  const { language } = useLanguage();

  useEffect(() => {
    // Exact or prefix matching (e.g. for /services/:id, /product/:id)
    let meta = ROUTE_META[pathname];

    if (!meta) {
      if (pathname.startsWith('/services/')) {
        meta = {
          titleEn: 'Treatment Details & Booking | Royal Aesthetic Clinic',
          titleUr: 'طبی طریقہ علاج کی تفصیلات | رائل کلینک',
          descEn: 'Doctor-supervised aesthetic treatment protocol, procedure duration, and direct WhatsApp appointment booking.',
          descUr: 'علاج کی مکمل تفصیلات اور واٹس ایپ پر ڈاکٹر سے معائنے کا وقت لیں۔'
        };
      } else if (pathname.startsWith('/product/')) {
        meta = {
          titleEn: 'Skincare Product Details | Royal Aesthetic Clinic',
          titleUr: 'اسکن کیئر پراڈکٹ کی تفصیل | رائل کلینک',
          descEn: 'Dermatologist-recommended clinical skincare formulation with free delivery throughout Pakistan.',
          descUr: 'ڈاکٹر کے تجویز کردہ اسکن کیئر فارمولے، مفت ڈیلیوری کے ساتھ۔'
        };
      } else {
        meta = ROUTE_META['/'];
      }
    }

    const title = language === 'ur' ? meta.titleUr : meta.titleEn;
    const description = language === 'ur' ? meta.descUr : meta.descEn;

    // 1. Update Title
    document.title = title;

    // 2. Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = description;

    // 3. Update OpenGraph Tags
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.content = title;

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.content = description;

    // 4. Update HTML lang and dir attribute
    document.documentElement.lang = language === 'ur' ? 'ur' : 'en';
    document.documentElement.dir = language === 'ur' ? 'rtl' : 'ltr';

  }, [pathname, language]);

  return null;
};

export default RouteSEO;
