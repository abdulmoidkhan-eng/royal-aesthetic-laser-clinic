#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

const SITE_URL = (process.env.SITE_URL || 'https://royalaestheticlaserclinic.netlify.app').replace(/\/+$/, '');

async function prerenderRoutes() {
  const indexHtmlPath = path.join(distDir, 'index.html');
  if (!fs.existsSync(indexHtmlPath)) {
    console.error('[SEO Prerender] dist/index.html not found. Run vite build first.');
    return;
  }

  console.log('[SEO Prerender] Pre-rendering static HTML snapshots for public routes...');

  const templateHtml = fs.readFileSync(indexHtmlPath, 'utf-8');

  const { SEED_SERVICES } = await import('../src/data/seedServices.js');
  const { SEED_PRODUCTS } = await import('../src/data/seedProducts.js');
  const { CLINIC_INFO } = await import('../src/data/clinicInfo.js');

  // Shared Organization / Clinic Schema
  const clinicSchema = {
    "@context": "https://schema.org",
    "@type": ["MedicalClinic", "LocalBusiness"],
    "name": CLINIC_INFO.name,
    "alternateName": CLINIC_INFO.nameUrdu,
    "description": "Doctor-supervised laser hair removal, acne treatments, HydraFacials, and physician-dispensed skincare in Thana, Malakand.",
    "url": SITE_URL,
    "logo": `${SITE_URL}/assets/aistudio/Golden_Crowned_R_Emblem_44ae7f4a.png`,
    "image": `${SITE_URL}/assets/aistudio/Golden_Crowned_R_Emblem_44ae7f4a.png`,
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

  const pagesToPrerender = [
    {
      routePath: '',
      title: 'Royal Aesthetic Clinic | Skin & Laser Care in Malakand',
      description: 'Doctor-supervised laser hair removal, acne solutions, HydraFacials, and skincare in Thana, Malakand. Physician consultations via WhatsApp.',
      canonical: `${SITE_URL}/`,
      schema: clinicSchema
    },
    {
      routePath: 'services',
      title: 'Aesthetic & Laser Treatments | Royal Aesthetic Clinic',
      description: '10 clinical aesthetic procedures: laser hair removal, melasma toning, HydraFacial, PRP biotherapy, Botox, and acne solutions in Malakand.',
      canonical: `${SITE_URL}/services`,
      schema: {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Clinical Aesthetic & Laser Procedures",
        "itemListElement": SEED_SERVICES.map((s, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": s.name.en,
          "url": `${SITE_URL}/services/${s.id}`
        }))
      }
    },
    {
      routePath: 'shop',
      title: 'Medical Skincare Dispensary | Royal Aesthetic Clinic',
      description: 'Physician-recommended oil control facewash, SPF 50 & 100 sunblocks, and brightening serums with free nationwide delivery across Pakistan.',
      canonical: `${SITE_URL}/shop`,
      schema: {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Physician Dispensed Skincare Catalog",
        "itemListElement": SEED_PRODUCTS.map((p, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": p.name.en,
          "url": `${SITE_URL}/product/${p.id}`
        }))
      }
    },
    {
      routePath: 'reviews',
      title: 'Patient Reviews & Stories | Royal Aesthetic Clinic',
      description: 'Verified feedback from patients across Malakand, Batkhela, Chakdara, and Swat who experienced our skin and laser procedures.',
      canonical: `${SITE_URL}/reviews`
    },
    {
      routePath: 'contact',
      title: 'Clinic Location & Hours | Royal Aesthetic Malakand',
      description: 'Visit our clinic opposite Meeral Restaurant in Thana, Malakand. Hours: Saturday to Thursday 11am-5pm. Direct WhatsApp bookings.',
      canonical: `${SITE_URL}/contact`,
      schema: clinicSchema
    }
  ];

  // Add individual services
  SEED_SERVICES.forEach(service => {
    pagesToPrerender.push({
      routePath: `services/${service.id}`,
      title: `${service.name.en} | Royal Aesthetic Clinic`,
      description: (service.shortDescription?.en || service.longDescription?.en || '').slice(0, 155),
      canonical: `${SITE_URL}/services/${service.id}`,
      image: service.image?.startsWith('http') ? service.image : `${SITE_URL}${service.image}`,
      schema: {
        "@context": "https://schema.org",
        "@type": "MedicalProcedure",
        "name": service.name.en,
        "description": service.shortDescription?.en || service.longDescription?.en,
        "procedureType": "https://schema.org/NoninvasiveProcedure",
        "provider": {
          "@type": "MedicalClinic",
          "name": CLINIC_INFO.name,
          "url": SITE_URL
        }
      }
    });
  });

  // Add individual products
  SEED_PRODUCTS.forEach(product => {
    pagesToPrerender.push({
      routePath: `product/${product.id}`,
      title: `${product.name.en} | Royal Aesthetic Dispensary`,
      description: (product.description?.en || '').slice(0, 155),
      canonical: `${SITE_URL}/product/${product.id}`,
      image: product.images?.[0]?.startsWith('http') ? product.images[0] : `${SITE_URL}${product.images?.[0]}`,
      schema: {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name.en,
        "description": product.description?.en,
        "image": product.images?.[0]?.startsWith('http') ? product.images[0] : `${SITE_URL}${product.images?.[0]}`,
        "offers": {
          "@type": "Offer",
          "priceCurrency": "PKR",
          "price": product.price > 0 ? String(product.price) : "0",
          "availability": product.inStock !== false ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          "seller": {
            "@type": "MedicalClinic",
            "name": CLINIC_INFO.name
          }
        }
      }
    });
  });

  let generatedCount = 0;

  for (const page of pagesToPrerender) {
    let html = templateHtml;

    // 1. Strip default meta tags to prevent duplicates
    html = html.replace(/<link\s+rel="canonical"[^>]*\/?>/gi, '');
    html = html.replace(/<meta\s+name="description"[^>]*\/?>/gi, '');
    html = html.replace(/<meta\s+property="og:[^"]+"[^>]*\/?>/gi, '');
    html = html.replace(/<meta\s+name="twitter:[^"]+"[^>]*\/?>/gi, '');
    html = html.replace(/<script\s+type="application\/ld\+json">[\s\S]*?<\/script>/gi, '');

    // 2. Replace Title
    html = html.replace(/<title>.*?<\/title>/i, `<title>${page.title}</title>`);

    // 2. Prepare Meta and OG tags
    const image = page.image || `${SITE_URL}/assets/aistudio/Golden_Crowned_R_Emblem_44ae7f4a.png`;
    const seoTags = `
    <link rel="canonical" href="${page.canonical}" />
    <meta name="description" content="${page.description}" />
    <meta property="og:title" content="${page.title}" />
    <meta property="og:description" content="${page.description}" />
    <meta property="og:url" content="${page.canonical}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:type" content="${page.routePath.startsWith('product/') ? 'product' : 'website'}" />
    <meta property="og:site_name" content="${CLINIC_INFO.name}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${page.title}" />
    <meta name="twitter:description" content="${page.description}" />
    <meta name="twitter:image" content="${image}" />
    ${page.schema ? `<script type="application/ld+json">\n${JSON.stringify(page.schema, null, 2)}\n    </script>` : ''}
    `;

    // Inject into <head>
    html = html.replace('</head>', `${seoTags}\n  </head>`);

    // Write file to target folder in dist/
    if (page.routePath === '') {
      fs.writeFileSync(indexHtmlPath, html, 'utf-8');
      generatedCount++;
    } else {
      const targetDir = path.join(distDir, page.routePath);
      fs.mkdirSync(targetDir, { recursive: true });
      fs.writeFileSync(path.join(targetDir, 'index.html'), html, 'utf-8');
      generatedCount++;
    }
  }

  console.log(`[SEO Prerender] Successfully generated ${generatedCount} static HTML pages in dist/!`);
}

prerenderRoutes().catch(err => {
  console.error('[SEO Prerender] Error during pre-rendering:', err);
});
