#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Site URL configuration with fallback
const SITE_URL = (process.env.SITE_URL || 'https://ais-pre-rtptp4fdgir5nclpt2qwgb-985586865554.asia-southeast1.run.app').replace(/\/+$/, '');

async function generateSitemap() {
  console.log(`[SEO] Generating sitemap.xml for: ${SITE_URL}...`);

  // Dynamically import seed services and products
  const { SEED_SERVICES } = await import('../src/data/seedServices.js');
  const { SEED_PRODUCTS } = await import('../src/data/seedProducts.js');

  const today = new Date().toISOString().split('T')[0];

  const urls = [
    { loc: `${SITE_URL}/`, priority: '1.0', changefreq: 'daily' },
    { loc: `${SITE_URL}/services`, priority: '0.9', changefreq: 'weekly' },
  ];

  // Add all active clinical procedure routes
  SEED_SERVICES.filter(s => s.active !== false).forEach(service => {
    urls.push({
      loc: `${SITE_URL}/services/${service.id}`,
      priority: '0.8',
      changefreq: 'monthly'
    });
  });

  // Skincare dispensary and products
  urls.push({ loc: `${SITE_URL}/shop`, priority: '0.9', changefreq: 'weekly' });
  SEED_PRODUCTS.forEach(product => {
    urls.push({
      loc: `${SITE_URL}/product/${product.id}`,
      priority: '0.8',
      changefreq: 'monthly'
    });
  });

  // Reviews and Contact
  urls.push({ loc: `${SITE_URL}/reviews`, priority: '0.7', changefreq: 'monthly' });
  urls.push({ loc: `${SITE_URL}/contact`, priority: '0.8', changefreq: 'monthly' });

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  const publicPath = path.join(rootDir, 'public', 'sitemap.xml');
  fs.writeFileSync(publicPath, xmlContent.trim() + '\n', 'utf-8');
  console.log(`[SEO] Successfully generated sitemap with ${urls.length} routes at ${publicPath}`);
}

generateSitemap().catch(err => {
  console.error('[SEO] Error generating sitemap:', err);
  process.exit(1);
});
