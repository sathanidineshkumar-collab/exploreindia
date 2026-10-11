const fs = require('fs');
const path = require('path');

const destDbFile = path.resolve(__dirname, '../backend/src/services/destinationDatabase.ts');
let code = fs.readFileSync(destDbFile, 'utf8');

const REPLACEMENTS = {
  'dest-tpt-01': 'https://images.unsplash.com/photo-1582510003544-d893d9752328?w=800', // Tirupati Venkateswara
  'dest-gir-01': 'https://images.unsplash.com/photo-1584132967334-10e028bd69f9?w=800', // Gir Lion Safari
  'dest-alp-01': 'https://images.unsplash.com/photo-1593693397690-362cb9666fc1?w=800', // Alleppey Houseboat Lagoon
  'dest-ahd-02': 'https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?w=800', // Adalaj Stepwell
  'dest-shl-01': 'https://images.unsplash.com/photo-1506744038136-46273834b3fe?w=800'  // Cherrapunji Living Root Bridges
};

let updatedCount = 0;
for (const [id, newUrl] of Object.entries(REPLACEMENTS)) {
  const idPattern = new RegExp(`(["']id["']\\s*:\\s*["']${id}["'][\\s\\S]*?["']photos["']\\s*:\\s*\\[\\s*["'])([^"']+)(["'])`);
  if (idPattern.test(code)) {
    code = code.replace(idPattern, `$1${newUrl}$3`);
    console.log(`✓ Updated photo for ${id} -> ${newUrl.slice(0, 50)}...`);
    updatedCount++;
  } else {
    console.warn(`! Could not match place ID: ${id}`);
  }
}

fs.writeFileSync(destDbFile, code, 'utf8');
console.log(`\nSuccessfully updated ${updatedCount} places in destinationDatabase.ts`);
