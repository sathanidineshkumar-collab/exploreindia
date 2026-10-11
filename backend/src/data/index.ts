import catalog from "./cityImageCatalog.json";

export interface CityImageRecord {
  city: string;
  place: string;
  category: string;
  image: string;
}

export const CITY_IMAGE_CATALOG: CityImageRecord[] = catalog as CityImageRecord[];

export function getStructuredImage(city: string, placeOrCategory: string = ""): string | null {
  const normCity = city.toLowerCase().trim();
  const normQuery = placeOrCategory.toLowerCase().trim();

  // Exact place match
  const match = CITY_IMAGE_CATALOG.find(
    (item) =>
      item.city.toLowerCase() === normCity &&
      (item.place.toLowerCase().includes(normQuery) || normQuery.includes(item.place.toLowerCase()))
  );
  if (match) return match.image;

  // Category match
  const catMatch = CITY_IMAGE_CATALOG.find(
    (item) =>
      item.city.toLowerCase() === normCity &&
      item.category.toLowerCase() === normQuery
  );
  if (catMatch) return catMatch.image;

  // City first image match
  const cityMatch = CITY_IMAGE_CATALOG.find(
    (item) => item.city.toLowerCase() === normCity
  );
  return cityMatch ? cityMatch.image : null;
}
