import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../context/LanguageContext.jsx';
import { CLINIC_INFO } from '../data/clinicInfo.js';
import { SEED_SERVICES } from '../data/seedServices.js';
import { SEED_PRODUCTS } from '../data/seedProducts.js';

const ROUTE_STATIC_META = {
  '/': {
    titleEn: 'Royal Aesthetic Clinic | Skin & Laser Care in Malakand',
    titleUr: 'رائل ایستھیٹک کلینک | مالاکنڈ میں اسکن و لیزر کیئر',
    descEn: 'Doctor-supervised laser hair removal, acne treatments, HydraFacials, and skincare in Thana, Malakand. Physician consultations via WhatsApp.',
    descUr: 'تھانہ مالاکنڈ میں ماہر ڈاکٹر کی زیر نگرانی لیزر ہیئر ریموول، ایکنی اور گڑھوں کا علاج، ہائیڈرا فیشل، اور مصدقہ اسکن کیئر۔',
    type: 'website'
  },
  '/services': {
    titleEn: 'Aesthetic & Laser Treatments | Royal Aesthetic Clinic',
    titleUr: 'طبی طریقہ علاج اور لیزر سروسز | رائل کلینک مالاکنڈ',
    descEn: '10 specialized aesthetic procedures: Laser Hair Removal, Melasma Toning, HydraFacial, Face PRP, Hair PRP, Botox, and Acne care in Malakand.',
    descUr: 'رائل کلینک کے 10 مخصوص جمالیاتی طریقہ کار: لیزر ہیئر ریموول، پگمنٹیشن، ہائیڈرا فیشل، فیس پی آر پی، ہیئر پی آر پی، بوٹوکس اور ایکنی۔',
    type: 'website'
  },
  '/shop': {
    titleEn: 'Medical Skincare Dispensary | Royal Aesthetic Clinic',
    titleUr: 'ڈاکٹر کی تجویز کردہ اسکن کیئر مصنوعات | رائل کلینک',
    descEn: 'Physician-recommended facewashes, SPF 50 & 100 sunblocks, and brightening serums with free nationwide delivery across Pakistan.',
    descUr: 'آئل کنٹرول فیس واش، سن بلاک ایس پی ایف 50 اور 100، اور وٹامن سی برائٹننگ سیرمز۔ پورے پاکستان میں فری ڈیلیوری۔',
    type: 'website'
  },
  '/reviews': {
    titleEn: 'Patient Reviews & Stories | Royal Aesthetic Clinic',
    titleUr: 'مریضوں کے تاثرات اور تجربات | رائل کلینک مالاکنڈ',
    descEn: 'Read verified feedback from patients across Malakand, Batkhela, Chakdara, and Swat who experienced our aesthetic and laser procedures.',
    descUr: 'مالاکنڈ، بٹ خیلہ، چکدرہ اور سوات کے معزز مریضوں کے سچے اور مصدقہ تاثرات۔',
    type: 'website'
  },
  '/contact': {
    titleEn: 'Clinic Location & Hours | Royal Aesthetic Malakand',
    titleUr: 'رابطہ، اوقات اور کلینک لوکیشن | رائل کلینک تھانہ',
    descEn: 'Find our exact location opposite Meeral Restaurant in Thana Malakand, clinic hours (Sat-Thu 11am-5pm), and direct WhatsApp booking.',
    descUr: 'تھانہ مالاکنڈ بالمقابل میرال ریسٹورنٹ، اوقات صبح 11 تا شام 5 بجے (جمعہ بند) اور واٹس ایپ پر فوری رابطہ۔',
    type: 'website'
  },
  '/cart': {
    titleEn: 'Your Skincare Bag | Royal Aesthetic Clinic',
    titleUr: 'آپ کا شاپنگ کارٹ | رائل کلینک',
    descEn: 'Review your selected clinical skincare products before placing your order with nationwide free delivery.',
    descUr: 'منتخب کردہ اسکن کیئر پراڈکٹس کا جائزہ لیں اور فری ہوم ڈیلیوری کے ساتھ آرڈر مکمل کریں۔',
    noindex: true
  },
  '/checkout': {
    titleEn: 'Guest Checkout | Royal Aesthetic Clinic',
    titleUr: 'آرڈر چیک آؤٹ | رائل کلینک',
    descEn: 'Complete your skincare order via direct Easypaisa, JazzCash, or bank transfer with pending payment verification.',
    descUr: 'ایزی پیسہ، جاز کیش یا بینک ٹرانسفر کے ذریعے اپنا آرڈر محفوظ طریقے سے درج کریں۔',
    noindex: true
  },
  '/order-confirmation': {
    titleEn: 'Order Received | Royal Aesthetic Clinic',
    titleUr: 'آرڈر موصول ہو گیا | رائل کلینک',
    descEn: 'Your skincare order has been placed successfully and is pending payment verification by clinic dispensary.',
    descUr: 'آپ کا آرڈر موصول ہو چکا ہے اور کلینک انتظامیہ تصدیق کے بعد فوری روانہ کرے گی۔',
    noindex: true
  },
  '/admin': {
    titleEn: 'Clinic Management Portal | Royal Aesthetic Clinic',
    titleUr: 'انتظامی پورٹل | رائل کلینک',
    descEn: 'Authorized administration panel for treatment catalog, skincare inventory, patient orders, and live clinic settings.',
    descUr: 'رائل کلینک انتظامی پورٹل برائے سروسز، مصنوعات اور کسٹمر آرڈرز۔',
    noindex: true
  }
};

export const RouteSEO = () => {
  const { pathname } = useLocation();
  const { language } = useLanguage();

  const siteOrigin = typeof window !== 'undefined' 
    ? window.location.origin 
    : 'https://ais-pre-rtptp4fdgir5nclpt2qwgb-985586865554.asia-southeast1.run.app';

  const defaultImage = `${siteOrigin}/assets/aistudio/Golden_Crowned_R_Emblem_44ae7f4a.png`;

  const metaData = useMemo(() => {
    // 1. Static route match
    if (ROUTE_STATIC_META[pathname]) {
      const item = ROUTE_STATIC_META[pathname];
      return {
        title: language === 'ur' ? item.titleUr : item.titleEn,
        description: language === 'ur' ? item.descUr : item.descEn,
        image: defaultImage,
        type: item.type || 'website',
        noindex: !!item.noindex,
        canonical: `${siteOrigin}${pathname === '/' ? '' : pathname}`,
        schema: null
      };
    }

    // 2. Service detail route (/services/:id)
    if (pathname.startsWith('/services/')) {
      const serviceId = pathname.replace('/services/', '').split('/')[0];
      const service = SEED_SERVICES.find(s => s.id === serviceId);

      if (service) {
        const name = language === 'ur' ? (service.name.ur || service.name.en) : service.name.en;
        const title = `${name} | Royal Aesthetic Clinic`.slice(0, 60);
        const descRaw = language === 'ur' 
          ? (service.shortDescription?.ur || service.longDescription?.ur || '') 
          : (service.shortDescription?.en || service.longDescription?.en || '');
        const description = (descRaw || 'Specialized doctor-administered cosmetic procedure in Thana, Malakand.').slice(0, 155);
        const image = service.image?.startsWith('http') ? service.image : `${siteOrigin}${service.image}`;

        const schema = {
          "@context": "https://schema.org",
          "@type": "MedicalProcedure",
          "name": service.name.en,
          "alternateName": service.name.ur,
          "description": service.shortDescription?.en || service.longDescription?.en,
          "procedureType": "https://schema.org/NoninvasiveProcedure",
          "image": image,
          "provider": {
            "@type": "MedicalClinic",
            "name": CLINIC_INFO.name,
            "url": siteOrigin,
            "telephone": CLINIC_INFO.phone,
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Pul Chowki, opposite Meeral Restaurant",
              "addressLocality": "Thana",
              "addressRegion": "Malakand, Khyber Pakhtunkhwa",
              "addressCountry": "PK"
            }
          }
        };

        return {
          title,
          description,
          image,
          type: 'article',
          noindex: false,
          canonical: `${siteOrigin}/services/${serviceId}`,
          schema
        };
      }
    }

    // 3. Product detail route (/product/:id)
    if (pathname.startsWith('/product/')) {
      const productId = pathname.replace('/product/', '').split('/')[0];
      const product = SEED_PRODUCTS.find(p => p.id === productId);

      if (product) {
        const name = language === 'ur' ? (product.name.ur || product.name.en) : product.name.en;
        const title = `${name} | Royal Aesthetic Dispensary`.slice(0, 60);
        const descRaw = language === 'ur' 
          ? (product.description?.ur || '') 
          : (product.description?.en || '');
        const description = (descRaw || 'Dermatologist-recommended clinical skincare formulation with free delivery throughout Pakistan.').slice(0, 155);
        const image = product.images?.[0]?.startsWith('http') 
          ? product.images[0] 
          : `${siteOrigin}${product.images?.[0] || '/assets/aistudio/Golden_Crowned_R_Emblem_44ae7f4a.png'}`;

        const schema = {
          "@context": "https://schema.org",
          "@type": "Product",
          "name": product.name.en,
          "alternateName": product.name.ur,
          "description": product.description?.en,
          "image": image,
          "brand": {
            "@type": "Brand",
            "name": "Royal Aesthetic Dispensary"
          },
          "offers": {
            "@type": "Offer",
            "priceCurrency": "PKR",
            "price": product.price > 0 ? String(product.price) : "0",
            "priceValidUntil": "2027-12-31",
            "availability": product.inStock !== false ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            "seller": {
              "@type": "MedicalClinic",
              "name": CLINIC_INFO.name
            }
          }
        };

        return {
          title,
          description,
          image,
          type: 'product',
          noindex: false,
          canonical: `${siteOrigin}/product/${productId}`,
          schema
        };
      }
    }

    // Fallback to home
    const fallback = ROUTE_STATIC_META['/'];
    return {
      title: language === 'ur' ? fallback.titleUr : fallback.titleEn,
      description: language === 'ur' ? fallback.descUr : fallback.descEn,
      image: defaultImage,
      type: 'website',
      noindex: false,
      canonical: siteOrigin,
      schema: null
    };
  }, [pathname, language, siteOrigin, defaultImage]);

  // Home / Contact MedicalClinic Schema
  const medicalClinicSchema = useMemo(() => {
    if (pathname === '/' || pathname === '/contact') {
      return {
        "@context": "https://schema.org",
        "@type": ["MedicalClinic", "LocalBusiness"],
        "name": CLINIC_INFO.name,
        "alternateName": CLINIC_INFO.nameUrdu,
        "description": "Doctor-supervised laser hair removal, acne treatments, HydraFacials, and physician-dispensed skincare in Thana, Malakand.",
        "url": siteOrigin,
        "logo": `${siteOrigin}/assets/aistudio/Golden_Crowned_R_Emblem_44ae7f4a.png`,
        "image": `${siteOrigin}/assets/aistudio/Golden_Crowned_R_Emblem_44ae7f4a.png`,
        "telephone": CLINIC_INFO.phone,
        "email": CLINIC_INFO.email,
        "priceRange": "$$",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Pul Chowki, opposite Meeral Restaurant",
          "addressLocality": "Thana",
          "addressRegion": "Malakand, Khyber Pakhtunkhwa",
          "addressCountry": "PK"
        },
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
            "opens": "11:00",
            "closes": "17:00"
          }
        ],
        "sameAs": [
          CLINIC_INFO.socials.instagram,
          CLINIC_INFO.socials.facebook,
          CLINIC_INFO.socials.tiktok
        ]
      };
    }
    return null;
  }, [pathname, siteOrigin]);

  // Breadcrumbs schema for subpages
  const breadcrumbSchema = useMemo(() => {
    if (pathname === '/') return null;
    const items = [
      {
        "@type": "ListItem",
        "position": 1,
        "name": language === 'ur' ? "ہوم" : "Home",
        "item": `${siteOrigin}/`
      }
    ];

    if (pathname === '/services') {
      items.push({
        "@type": "ListItem",
        "position": 2,
        "name": language === 'ur' ? "علاج" : "Treatments",
        "item": `${siteOrigin}/services`
      });
    } else if (pathname.startsWith('/services/')) {
      const serviceId = pathname.replace('/services/', '').split('/')[0];
      const service = SEED_SERVICES.find(s => s.id === serviceId);
      items.push({
        "@type": "ListItem",
        "position": 2,
        "name": language === 'ur' ? "علاج" : "Treatments",
        "item": `${siteOrigin}/services`
      });
      items.push({
        "@type": "ListItem",
        "position": 3,
        "name": service ? (language === 'ur' ? service.name.ur : service.name.en) : "Procedure",
        "item": `${siteOrigin}${pathname}`
      });
    } else if (pathname === '/shop') {
      items.push({
        "@type": "ListItem",
        "position": 2,
        "name": language === 'ur' ? "شاپ" : "Dispensary",
        "item": `${siteOrigin}/shop`
      });
    } else if (pathname.startsWith('/product/')) {
      const prodId = pathname.replace('/product/', '').split('/')[0];
      const prod = SEED_PRODUCTS.find(p => p.id === prodId);
      items.push({
        "@type": "ListItem",
        "position": 2,
        "name": language === 'ur' ? "شاپ" : "Dispensary",
        "item": `${siteOrigin}/shop`
      });
      items.push({
        "@type": "ListItem",
        "position": 3,
        "name": prod ? (language === 'ur' ? prod.name.ur : prod.name.en) : "Product",
        "item": `${siteOrigin}${pathname}`
      });
    } else if (pathname === '/reviews') {
      items.push({
        "@type": "ListItem",
        "position": 2,
        "name": language === 'ur' ? "تاثرات" : "Reviews",
        "item": `${siteOrigin}/reviews`
      });
    } else if (pathname === '/contact') {
      items.push({
        "@type": "ListItem",
        "position": 2,
        "name": language === 'ur' ? "رابطہ" : "Contact",
        "item": `${siteOrigin}/contact`
      });
    }

    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": items
    };
  }, [pathname, language, siteOrigin]);

  const activeSchema = metaData.schema || medicalClinicSchema;

  return (
    <Helmet
      htmlAttributes={{
        lang: language === 'ur' ? 'ur' : 'en',
        dir: language === 'ur' ? 'rtl' : 'ltr'
      }}
    >
      {/* Standard Meta */}
      <title>{metaData.title}</title>
      <meta name="description" content={metaData.description} />
      <link rel="canonical" href={metaData.canonical} />

      {/* Robots Control */}
      {metaData.noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      )}

      {/* Open Graph Social Sharing */}
      <meta property="og:title" content={metaData.title} />
      <meta property="og:description" content={metaData.description} />
      <meta property="og:url" content={metaData.canonical} />
      <meta property="og:type" content={metaData.type} />
      <meta property="og:image" content={metaData.image} />
      <meta property="og:site_name" content={CLINIC_INFO.name} />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaData.title} />
      <meta name="twitter:description" content={metaData.description} />
      <meta name="twitter:image" content={metaData.image} />

      {/* Primary Schema JSON-LD */}
      {activeSchema && (
        <script type="application/ld+json">
          {JSON.stringify(activeSchema)}
        </script>
      )}

      {/* BreadcrumbList Schema JSON-LD */}
      {breadcrumbSchema && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      )}
    </Helmet>
  );
};

export default RouteSEO;
