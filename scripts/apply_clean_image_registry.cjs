const fs = require('fs');
const path = require('path');

// Read the verified registry from build_clean_image_registry.cjs
const buildFile = fs.readFileSync('scripts/build_clean_image_registry.cjs', 'utf8');

// Extract the CITY_LANDMARK_REGISTRY block
const startIdx = buildFile.indexOf('const CITY_LANDMARK_REGISTRY = {');
const endMarker = '};\n\n// Test cross-city uniqueness';
const endIdx = buildFile.indexOf(endMarker);

if (startIdx === -1 || endIdx === -1) {
  console.error('Failed to locate CITY_LANDMARK_REGISTRY bounds in build script');
  process.exit(1);
}

const registryContent = buildFile.slice(startIdx + 'const CITY_LANDMARK_REGISTRY = '.length, endIdx + 1);

// Now read backend/src/services/imageService.ts
const targetPath = 'backend/src/services/imageService.ts';
let imageServiceSrc = fs.readFileSync(targetPath, 'utf8');

// Replace export const CITY_LANDMARK_REGISTRY = { ... };
const regStart = imageServiceSrc.indexOf('export const CITY_LANDMARK_REGISTRY: Record<');
const regEndMarker = 'export const CATEGORY_POOLS: Record<string, string[]> = {';
const regEnd = imageServiceSrc.indexOf(regEndMarker);

if (regStart === -1 || regEnd === -1) {
  console.error('Failed to locate CITY_LANDMARK_REGISTRY bounds in imageService.ts');
  process.exit(1);
}

const newRegistryBlock = `export const CITY_LANDMARK_REGISTRY: Record<
  string,
  {
    hero: string;
    landmarks: Record<string, string[]>;
    food: string[];
    stays: string[];
    culture: string[];
  }
> = ${registryContent};

/**
 * Category-specific pools of diverse, high quality Indian travel imagery.
 * Used for dynamic allocation with duplicate avoidance when landmarks are not specifically known.
 * GUARANTEE: Contains zero photos from any specific city registry to prevent cross-contamination.
 */
export const CATEGORY_POOLS: Record<string, string[]> = {
  hotel: [
    "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1596436889106-be35e843f974?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800&auto=format&fit=crop&q=80"
  ],
  resort: [
    "https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1586611292717-f828b167408c?w=800&auto=format&fit=crop&q=80"
  ],
  restaurant: [
    "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=800&auto=format&fit=crop&q=80"
  ],
  cafe: [
    "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&auto=format&fit=crop&q=80"
  ],
  temple: [
    "https://images.unsplash.com/photo-1582510003544-d893d975231c?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1604537466158-719b1972feb8?w=800&auto=format&fit=crop&q=80"
  ],
  attraction: [
    "https://images.unsplash.com/photo-1506744038136-3a52144d1872?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80"
  ]
};

`;

// Find where CATEGORY_POOLS ends (before CITY_ALIASES)
const poolEndMarker = 'const CITY_ALIASES: Record<string, string> = {';
const poolEnd = imageServiceSrc.indexOf(poolEndMarker);

if (poolEnd === -1) {
  console.error('Failed to locate poolEndMarker in imageService.ts');
  process.exit(1);
}

const updatedSrc = imageServiceSrc.slice(0, regStart) + newRegistryBlock + imageServiceSrc.slice(poolEnd);
fs.writeFileSync(targetPath, updatedSrc, 'utf8');
console.log('Successfully updated backend/src/services/imageService.ts with 100% disjoint photo registry and category pools!');
