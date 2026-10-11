import { getApiUrl } from "./api";

// Cached client images
const clientImageCache = new Map<string, string>();

/**
 * Generates an SVG data URL placeholder customized by category and place name.
 */
export function getCategoryPlaceholder(category: string = "attraction", label: string = "Explore India"): string {
  let iconEmoji = "🏰";
  let bgGradient = "%231e293b"; // slate-800
  let accentColor = "%23f97316"; // orange-500

  switch (category.toLowerCase()) {
    case "hotel":
      iconEmoji = "🏨";
      bgGradient = "%231e3a8a"; // blue-900
      accentColor = "%2338bdf8";
      break;
    case "resort":
      iconEmoji = "🌴";
      bgGradient = "%23064e3b"; // emerald-900
      accentColor = "%2334d399";
      break;
    case "restaurant":
      iconEmoji = "🍛";
      bgGradient = "%237f1d1d"; // red-900
      accentColor = "%23f87171";
      break;
    case "cafe":
      iconEmoji = "☕";
      bgGradient = "%2378350f"; // amber-900
      accentColor = "%23fbbf24";
      break;
    case "temple":
      iconEmoji = "🛕";
      bgGradient = "%23581c87"; // purple-900
      accentColor = "%23c084fc";
      break;
    default:
      iconEmoji = "🏰";
      bgGradient = "%230f172a";
      accentColor = "%23f97316";
  }

  const safeLabel = encodeURIComponent(label.slice(0, 30));

  return `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='500' viewBox='0 0 800 500'>
    <defs>
      <linearGradient id='bg' x1='0%' y1='0%' x2='100%' y2='100%'>
        <stop offset='0%' stop-color='${bgGradient}'/>
        <stop offset='100%' stop-color='%230f172a'/>
      </linearGradient>
    </defs>
    <rect width='100%' height='100%' fill='url(%23bg)'/>
    <circle cx='400' cy='210' r='60' fill='white' fill-opacity='0.08'/>
    <text x='50%' y='230' font-family='system-ui, sans-serif' font-size='56' text-anchor='middle'>${iconEmoji}</text>
    <text x='50%' y='320' font-family='system-ui, sans-serif' font-size='20' font-weight='bold' fill='white' text-anchor='middle'>${safeLabel}</text>
    <text x='50%' y='350' font-family='system-ui, sans-serif' font-size='12' font-weight='600' fill='${accentColor}' text-anchor='middle' letter-spacing='2'>EXPLORE INDIA</text>
  </svg>`;
}

const CATEGORY_REAL_FALLBACKS: Record<string, string> = {
  hotel: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80",
  resort: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80",
  restaurant: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80",
  cafe: "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=800&auto=format&fit=crop&q=80",
  temple: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80",
  attraction: "https://images.unsplash.com/photo-1605007493699-af65834f8a00?w=800&auto=format&fit=crop&q=80"
};

/**
 * Handles image error events by replacing broken source with authentic photographic category image.
 * Never uses an SVG placeholder when a real photo is expected.
 */
export function handlePlaceImageError(
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  category: string = "attraction",
  placeName: string = "India Landmark"
) {
  const target = e.currentTarget;
  target.onerror = null; // Prevent infinite error loops
  const catKey = (category || "attraction").toLowerCase();
  target.src = CATEGORY_REAL_FALLBACKS[catKey] || CATEGORY_REAL_FALLBACKS.attraction;
}

/**
 * Fetch dynamic city image from backend
 */
export async function fetchDynamicCityImage(city: string, feature: string = ""): Promise<string> {
  const key = `${city}:${feature}`.toLowerCase();
  if (clientImageCache.has(key)) {
    return clientImageCache.get(key)!;
  }

  try {
    const res = await fetch(getApiUrl(`/api/images?city=${encodeURIComponent(city)}&feature=${encodeURIComponent(feature)}`));
    if (res.ok) {
      const data = await res.json();
      if (data && data.imageUrl) {
        clientImageCache.set(key, data.imageUrl);
        return data.imageUrl;
      }
    }
  } catch (err) {
    console.warn("Failed to fetch dynamic city image:", err);
  }

  return CATEGORY_REAL_FALLBACKS.attraction;
}
