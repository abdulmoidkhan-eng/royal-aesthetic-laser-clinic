export const REVIEWS = [
  {
    id: "rev-1",
    name: "Dr. Ayesha K.",
    location: "Thana, Malakand",
    rating: 5,
    treatment: {
      en: "Laser Hair Removal (Face & Arms)",
      ur: "لیزر ہیئر ریموول (چہرہ اور بازو)"
    },
    comment: {
      en: "I was hesitant to try laser in Malakand, but Royal Clinic blew me away. The doctor explained everything in detail. The cooling tip makes it genuinely painless, and after 4 sessions my facial hair is almost completely gone!",
      ur: "میں پہلے مالاکنڈ میں لیزر کروانے سے ہچکچا رہی تھی، لیکن رائل کلینک کا معیار لاجواب ہے۔ ڈاکٹر صاحبہ نے تفصیل سے سمجھایا۔ کولنگ ٹیکنالوجی کی وجہ سے بالکل درد نہیں ہوا اور 4 سیشنز کے بعد چہرے کے غیر ضروری بال ختم ہو گئے۔"
    },
    date: "2 weeks ago"
  },
  {
    id: "rev-2",
    name: "Mohammad Usman",
    location: "Batkhela",
    rating: 5,
    treatment: {
      en: "Acne Scar RF Microneedling",
      ur: "ایکنی اسکار آر ایف مائیکرو نیڈلنگ"
    },
    comment: {
      en: "Had stubborn acne pits since my college years. Did 3 sessions of RF microneedling at Royal Aesthetic. The skin surface is visibly smoother, and the clinic is so hygienic and private.",
      ur: "کالج کے زمانے سے چہرے پر ایکنی کے گہرے گڑھے تھے۔ رائل کلینک سے 3 سیشن کروائے۔ اب جلد بالکل ہموار اور صاف ہے، اور کلینک کا ماحول انتہائی صاف ستھرا اور پرسکون ہے۔"
    },
    date: "1 month ago"
  },
  {
    id: "rev-3",
    name: "Zainab Bibi",
    location: "Chakdara / Swat Road",
    rating: 5,
    treatment: {
      en: "HydraFacial Glow & Pigmentation Protocol",
      ur: "ہائیڈرا فیشل گلو اور پگمنٹیشن پروٹوکول"
    },
    comment: {
      en: "Took the HydraFacial before my sister's wedding. Instant glow without any allergic reaction or redness. Also bought their barrier cream and sunscreen which worked wonders.",
      ur: "اپنی بہن کی شادی سے قبل ہائیڈرا فیشل کروایا۔ بغیر کسی الرجی یا سرخی کے فوری نکھار آیا۔ ان کی سن اسکرین اور بیریئر کریم بھی بہترین ہے۔"
    },
    date: "3 weeks ago"
  }
];

export const GALLERY_ITEMS = [
  {
    id: "gal-1",
    title: {
      en: "Severe Acne Scars & Uneven Texture",
      ur: "ایکنی کے گہرے گڑھے اور جلد کی ناہمواری"
    },
    service: {
      en: "3 Sessions RF Microneedling + Medical Peels",
      ur: "3 سیشنز آر ایف مائیکرو نیڈلنگ مع میڈیکل پیل"
    },
    concern: "scars",
    beforeImage: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&auto=format&fit=crop&q=80",
    afterImage: "https://images.unsplash.com/photo-1512290900672-1f55b9a8976b?w=600&auto=format&fit=crop&q=80",
    timeframe: {
      en: "12 Weeks (3 Sessions)",
      ur: "12 ہفتے (3 سیشنز)"
    },
    notes: {
      en: "Significant dermal leveling and collagen remodeling. Results vary.",
      ur: "کولیجن کی قدرتی بحالی اور جلد کی ہمواری۔ نتائج مختلف ہو سکتے ہیں۔"
    }
  },
  {
    id: "gal-2",
    title: {
      en: "Upper Lip & Chin Unwanted Hair",
      ur: "اوپری ہونٹ اور ٹھوڑی کے غیر مطلوبہ بال"
    },
    service: {
      en: "4 Sessions Painless Diode Laser",
      ur: "4 سیشنز ڈائیوڈ لیزر ہیئر ریموول"
    },
    concern: "hair",
    beforeImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80",
    afterImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
    timeframe: {
      en: "16 Weeks (4 Sessions)",
      ur: "16 ہفتے (4 سیشنز)"
    },
    notes: {
      en: "Noticeable reduction in hair density and ingrown bumps. Results vary.",
      ur: "بالوں کی موٹائی اور تعداد میں واضح کمی۔ نتائج مختلف ہو سکتے ہیں۔"
    }
  },
  {
    id: "gal-3",
    title: {
      en: "Cheek Melasma & Sun Damage",
      ur: "گالوں کی چھائیاں اور دھوپ کے سیاہ دھبے"
    },
    service: {
      en: "Laser Toning & Depigmentation Protocol",
      ur: "لیزر ٹوننگ اور ڈی پگمنٹیشن طریقہ علاج"
    },
    concern: "pigmentation",
    beforeImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&auto=format&fit=crop&q=80",
    afterImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80",
    timeframe: {
      en: "10 Weeks (4 Sessions)",
      ur: "10 ہفتے (4 سیشنز)"
    },
    notes: {
      en: "Reduction in melanin density alongside home SPF discipline. Results vary.",
      ur: "میلانن میں واضح کمی اور رنگت میں برابری۔ نتائج مختلف ہو سکتے ہیں۔"
    }
  }
];
