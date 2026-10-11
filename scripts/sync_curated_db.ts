import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { CURATED_CITIES } from "../backend/src/services/curatedCatalog";
import { CITY_LANDMARK_REGISTRY } from "../backend/src/services/imageService";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetFiles = [
  path.resolve(__dirname, "../backend/data_store.json"),
  path.resolve(__dirname, "../data_store.json")
];

for (const filePath of targetFiles) {
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping non-existent file: ${filePath}`);
    continue;
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(raw);

  // 1. Update cities with distinct verified hero images
  data.cities = data.cities || [];
  for (const [key, entry] of Object.entries(CURATED_CITIES)) {
    const existingIndex = data.cities.findIndex(
      (c: any) => c.name.toLowerCase() === entry.city.name.toLowerCase()
    );
    if (existingIndex >= 0) {
      data.cities[existingIndex] = {
        ...data.cities[existingIndex],
        ...entry.city
      };
    } else {
      data.cities.push(entry.city);
    }
  }

  // 2. Update/replace places with curated authentic places
  data.places = data.places || [];
  
  // Track all curated places
  const curatedPlaceList: any[] = [];
  const curatedCitiesSet = new Set<string>();

  for (const [key, entry] of Object.entries(CURATED_CITIES)) {
    curatedCitiesSet.add(entry.city.name.toLowerCase());
    for (const place of entry.places) {
      curatedPlaceList.push(place);
    }
  }

  // Filter out outdated places for the curated cities, keeping other cities
  const nonCuratedPlaces = data.places.filter(
    (p: any) => !curatedCitiesSet.has(p.city.toLowerCase())
  );

  // Combine non-curated places + fresh curated places
  data.places = [...curatedPlaceList, ...nonCuratedPlaces];

  // 3. Write back formatted JSON
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  console.log(`Successfully synced curated places to: ${filePath} (Total places: ${data.places.length})`);
}

// 4. Update backend/src/data/cityImageCatalog.json
const catalogEntries: any[] = [];
for (const [key, cityEntry] of Object.entries(CURATED_CITIES)) {
  for (const place of cityEntry.places) {
    let cat = "Heritage";
    if (place.type === "hotel" || place.type === "resort") cat = "Stays";
    else if (place.type === "restaurant" || place.type === "cafe") cat = "Food";
    else if (place.type === "temple") cat = "Temples";
    else if (place.subtypes?.some((s: string) => s.toLowerCase().includes("beach"))) cat = "Beaches";
    else if (place.subtypes?.some((s: string) => s.toLowerCase().includes("park") || s.toLowerCase().includes("lake"))) cat = "Nature";

    catalogEntries.push({
      city: place.city,
      place: place.name,
      category: cat,
      image: place.photos[0]
    });
  }
}

const catalogPath = path.resolve(__dirname, "../backend/src/data/cityImageCatalog.json");
fs.writeFileSync(catalogPath, JSON.stringify(catalogEntries, null, 2), "utf-8");
console.log(`Successfully synced cityImageCatalog.json (${catalogEntries.length} entries)`);

console.log("Database synchronization complete!");
