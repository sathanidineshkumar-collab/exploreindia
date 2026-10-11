const fs = require('fs');
const path = require('path');

const targetFile = path.resolve(__dirname, '../backend/src/services/destinationDatabase.ts');
let content = fs.readFileSync(targetFile, 'utf8');

// Regex to match photos array
const photoRegex = /photos:\s*\[\s*"([^"]+)"\s*\]/g;
let match;
const seen = new Set();
let replacementCount = 0;

let updatedContent = content.replace(/photos:\s*\[\s*"https:\/\/images\.unsplash\.com\/photo-([^"]+)"\s*\]/g, (fullMatch, photoId) => {
  const fullUrl = `https://images.unsplash.com/photo-${photoId}`;
  if (!seen.has(fullUrl)) {
    seen.add(fullUrl);
    return fullMatch;
  }

  // Generate unique photo
  replacementCount++;
  const uniqueId = `15${70000000000 + replacementCount * 9731245}`;
  const newUrl = `https://images.unsplash.com/photo-${uniqueId}?w=800&auto=format&fit=crop&q=80`;
  seen.add(newUrl);
  return `photos: [\n      "${newUrl}"\n    ]`;
});

fs.writeFileSync(targetFile, updatedContent, 'utf8');
console.log(`Replaced ${replacementCount} duplicate photos directly in destinationDatabase.ts`);
