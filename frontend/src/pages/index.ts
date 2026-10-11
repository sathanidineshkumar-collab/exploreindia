/**
 * ExploreIndia Page Views Directory
 * Contains page view definitions and metadata for routing.
 */
export type ViewName = "home" | "search" | "details" | "trips" | "profile" | "admin" | "tips";

export interface PageMetadata {
  id: ViewName;
  title: string;
  description: string;
}

export const PAGES: Record<ViewName, PageMetadata> = {
  home: {
    id: "home",
    title: "Explore India - Cultural & Travel Discovery",
    description: "Discover verified hotels, heritage monuments, eateries, and sacred temples across India."
  },
  search: {
    id: "search",
    title: "City Discovery & Live Map",
    description: "Explore curated places, real coordinates, and interactive route mapping."
  },
  details: {
    id: "details",
    title: "Destination Details",
    description: "Inspect high-resolution photo galleries, amenities, reviews, and reservations."
  },
  trips: {
    id: "trips",
    title: "Trip Planner & Daily Itineraries",
    description: "Organize day-by-day travel schedules and route pins."
  },
  profile: {
    id: "profile",
    title: "Traveler Profile & Wishlist",
    description: "Manage saved favorites, booking reservations, and personal reviews."
  },
  admin: {
    id: "admin",
    title: "Administration Panel",
    description: "Portal metrics, place management, and review moderation."
  },
  tips: {
    id: "tips",
    title: "Travel Tips & Regional Advisories",
    description: "Insider knowledge on local cuisine, cultural etiquette, and transit."
  }
};
