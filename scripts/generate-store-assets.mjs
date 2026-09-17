import fs from 'node:fs/promises';
import sharp from 'sharp';

const source = 'resources/icon.png';
const output = 'store-listing';
await fs.mkdir(output, { recursive: true });

await sharp(source)
  .resize(512, 512, { fit: 'cover' })
  .png({ compressionLevel: 9 })
  .toFile(`${output}/app-icon-512.png`);

const icon = await sharp(source)
  .resize(330, 330, { fit: 'contain' })
  .png()
  .toBuffer();
const encodedIcon = icon.toString('base64');

const featureGraphic = `
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="500" viewBox="0 0 1024 500">
  <defs>
    <linearGradient id="background" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f6f4ec"/>
      <stop offset="1" stop-color="#e1e8d7"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.76" cy="0.24" r="0.62">
      <stop offset="0" stop-color="#dfbc70" stop-opacity="0.24"/>
      <stop offset="1" stop-color="#dfbc70" stop-opacity="0"/>
    </radialGradient>
    <filter id="shadow" x="-40%" y="-40%" width="180%" height="180%">
      <feDropShadow dx="0" dy="18" stdDeviation="16" flood-color="#173f35" flood-opacity="0.24"/>
    </filter>
  </defs>
  <rect width="1024" height="500" fill="url(#background)"/>
  <rect width="1024" height="500" fill="url(#glow)"/>
  <path d="M865 34 C835 137 869 237 989 318" fill="none" stroke="#8da178" stroke-width="3" opacity="0.35"/>
  <g fill="#91a47c" opacity="0.28">
    <ellipse cx="850" cy="98" rx="53" ry="20" transform="rotate(-38 850 98)"/>
    <ellipse cx="898" cy="162" rx="57" ry="21" transform="rotate(28 898 162)"/>
    <ellipse cx="879" cy="233" rx="61" ry="22" transform="rotate(-34 879 233)"/>
    <ellipse cx="944" cy="287" rx="58" ry="21" transform="rotate(34 944 287)"/>
  </g>
  <image href="data:image/png;base64,${encodedIcon}" x="62" y="85" width="330" height="330" filter="url(#shadow)"/>
  <text x="450" y="202" fill="#173f35" font-family="Georgia, serif" font-size="68" font-weight="700">Healthopedia</text>
  <text x="454" y="250" fill="#786448" font-family="Arial, sans-serif" font-size="16" font-weight="700" letter-spacing="3">THE HERBAL KNOWLEDGE LIBRARY</text>
  <line x1="454" y1="283" x2="862" y2="283" stroke="#b6c1ac" stroke-width="2"/>
  <text x="454" y="333" fill="#44584d" font-family="Arial, sans-serif" font-size="24">Ingredients. Rationale. Safety.</text>
  <text x="454" y="372" fill="#667369" font-family="Arial, sans-serif" font-size="18">Free educational access by NDN Analytics Inc.</text>
</svg>`;

await sharp(Buffer.from(featureGraphic))
  .png({ compressionLevel: 9 })
  .toFile(`${output}/feature-graphic-1024x500.png`);

console.log('Generated Play Store app icon and feature graphic.');
