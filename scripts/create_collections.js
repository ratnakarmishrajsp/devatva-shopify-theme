/**
 * DEVATVA SHOPIFY ADMIN AUTOMATED COLLECTION CREATOR
 * Automatically creates all 19 collections from aumchakra.com in Shopify Admin!
 * 
 * Usage:
 * 1. Set environment variable: $env:SHOPIFY_ADMIN_API_TOKEN="shpat_xxxx"
 * 2. Run: node scripts/create_collections.js
 */

const https = require('https');

const STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN || 'divyatva.myshopify.com';
const ADMIN_API_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN || '';

const COLLECTIONS_TO_CREATE = [
  'BRACELETS',
  'ZODIAC BRACELETS',
  'NUMEROLOGY BRACELETS',
  'PENDANTS',
  'CRYSTAL RINGS',
  'PI-XIU BRACELETS',
  'PI-XIU RINGS',
  'GEM RINGS',
  'RUDRAKSHA & KARUNGALIS',
  'PYRITE FRAMES',
  'PYRAMID & ROWS',
  'GEMSTONES',
  'ROLLER & GUASHAS',
  'CRYSTAL TREES',
  'JAAP MALAS',
  'GOD DIVINE IDOLS',
  'CRYSTAL WATER BOTTLES',
  'DAILY ESSENTIALS',
  'BEST SELLER'
];

function createCollection(title) {
  return new Promise((resolve, reject) => {
    if (!ADMIN_API_TOKEN) {
      console.log(`[SIMULATION] Creating collection "${title}"... (Please provide SHOPIFY_ADMIN_API_TOKEN)`);
      resolve({ title, status: 'simulated' });
      return;
    }

    const data = JSON.stringify({
      custom_collection: {
        title: title,
        published: true
      }
    });

    const options = {
      hostname: STORE_DOMAIN.replace(/^https?:\/\//, ''),
      port: 443,
      path: '/admin/api/2024-01/custom_collections.json',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': ADMIN_API_TOKEN,
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log(`✅ Created Collection in Shopify Admin: "${title}"`);
          resolve(JSON.parse(body));
        } else {
          console.error(`❌ Error creating "${title}": status ${res.statusCode} - ${body}`);
          resolve({ title, error: body });
        }
      });
    });

    req.on('error', (e) => {
      console.error(`❌ Request error for "${title}":`, e);
      reject(e);
    });

    req.write(data);
    req.end();
  });
}

async function run() {
  console.log(`Starting collection creation for store: ${STORE_DOMAIN}`);
  console.log(`Total collections to create: ${COLLECTIONS_TO_CREATE.length}\n`);

  for (const title of COLLECTIONS_TO_CREATE) {
    await createCollection(title);
    // 300ms delay between requests to respect API rate limits
    await new Promise((res) => setTimeout(res, 300));
  }

  console.log('\n✨ Finished processing all 19 collections!');
}

run();
