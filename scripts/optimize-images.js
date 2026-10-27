#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const assetsDir = path.resolve(__dirname, '..', 'public', 'assets', 'aistudio');

console.log('[Optimizer] Starting image compression in:', assetsDir);

if (!fs.existsSync(assetsDir)) {
  console.log('[Optimizer] Assets directory not found.');
  process.exit(0);
}

const files = fs.readdirSync(assetsDir).filter(f => f.endsWith('.png'));

for (const file of files) {
  const fullPath = path.join(assetsDir, file);
  const stat = fs.statSync(fullPath);
  const sizeKb = Math.round(stat.size / 1024);

  const baseName = path.basename(file, '.png');
  const webpPath = path.join(assetsDir, `${baseName}.webp`);

  try {
    // 1. Generate WebP modern format (max 1200px width/height, quality 82)
    const isLogo = file.includes('Emblem') || file.includes('logo');
    const resizeArg = isLogo ? '512x512\\>' : '1200x1200\\>';

    execSync(`convert "${fullPath}" -strip -resize ${resizeArg} -quality 82 "${webpPath}"`);
    const webpSize = Math.round(fs.statSync(webpPath).size / 1024);

    // 2. If PNG is larger than 300KB, optimize PNG in-place
    if (sizeKb > 300) {
      execSync(`convert "${fullPath}" -strip -resize ${resizeArg} -quality 85 "${fullPath}"`);
      const newPngSize = Math.round(fs.statSync(fullPath).size / 1024);
      console.log(`[Optimizer] ${file}: ${sizeKb}KB -> ${newPngSize}KB PNG, ${webpSize}KB WebP`);
    } else {
      console.log(`[Optimizer] ${file}: ${sizeKb}KB PNG, ${webpSize}KB WebP`);
    }
  } catch (err) {
    console.warn(`[Optimizer] Failed to process ${file}:`, err.message);
  }
}

console.log('[Optimizer] Image compression completed successfully.');
