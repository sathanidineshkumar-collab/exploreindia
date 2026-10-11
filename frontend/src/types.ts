export type Role = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  isVerified: boolean;
  avatar?: string;
  token?: string;
  favorites?: string[]; // list of placeIds
}

export type PlaceType = 'hotel' | 'restaurant' | 'resort' | 'attraction' | 'cafe' | 'temple';

export interface LatLng {
  lat: number;
  lng: number;
}

export interface Review {
  id: string;
  placeId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  text: string;
  date: string;
  approved: boolean;
}

export type PlaceCategory =
  | 'temple'
  | 'heritage'
  | 'attraction'
  | 'museum'
  | 'beach'
  | 'waterfall'
  | 'nature'
  | 'wildlife'
  | 'hotel'
  | 'restaurant'
  | 'adventure'
  | 'garden'
  | 'market'
  | 'pilgrimage'
  | 'cultural'
  | 'hidden_gem'
  | 'transit';

export interface Place {
  id: string;
  name: string;
  altNames?: string[];
  type: PlaceType;
  category?: PlaceCategory | string;
  subtypes: string[]; // e.g., ['Luxury Hotels', 'Hill Resorts', 'Veg Friendly', 'Fine Dining']
  rating: number;
  reviewCount: number;
  priceLevel: number; // 1 to 4 stars ($ to $$$$)
  priceRange?: string; // e.g., '₹1,500 - ₹3,000' or '₹500 for two'
  entryFee?: string;
  address: string;
  city: string;
  district?: string;
  state: string;
  region?: string;
  country?: string;
  coordinates: LatLng;
  description: string;
  detailedDescription?: string;
  photos: string[];
  facilities: string[];
  openHours?: string;
  bestTimeToVisit?: string;
  phone?: string;
  website?: string;
  source?: string;
  sourceId?: string;
  lastVerified?: string;
  featured?: boolean;
  tags?: string[];
  reviews?: Review[];
  
  // Restaurant-specific
  menuHighlights?: string[];
  popularFoods?: string[];
  vegFriendly?: boolean;
  nonVegFriendly?: boolean;

  // Resort-specific
  activities?: string[];
  rooms?: {
    type: string;
    price: string;
    amenities: string[];
  }[];
}

export interface CategoryCounts {
  all: number;
  [category: string]: number;
}

export interface DiscoverResponse {
  city: CityInfo;
  places: Place[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  categoryCounts: CategoryCounts;
  suggestedTab?: string;
}

export interface SearchHistory {
  id: string;
  userId: string;
  query: string;
  timestamp: string;
}

export interface CityInfo {
  name: string;
  state: string;
  description: string;
  image: string;
  lat: number;
  lng: number;
}

export interface TravelTip {
  id: string;
  title: string;
  category: 'food' | 'culture' | 'budget' | 'packing';
  text: string;
  image: string;
}

export interface Notification {
  id: string;
  userId: string;
  text: string;
  type: 'info' | 'success' | 'alert';
  read: boolean;
  date: string;
}

export interface AnalyticsData {
  usersCount: number;
  placesCount: number;
  reviewsCount: number;
  searchesCount: number;
  placesByType: Record<PlaceType, number>;
  popularCities: { name: string; count: number }[];
}

export interface TripPlace {
  placeId: string;
  name: string;
  type: PlaceType;
  city: string;
  photo?: string;
  notes?: string;
}

export interface Trip {
  id: string;
  userId: string;
  name: string;
  destination: string;
  startDate?: string;
  endDate?: string;
  notes?: string;
  places: TripPlace[];
  createdAt: string;
}

export interface Booking {
  id: string;
  userId: string;
  placeId: string;
  placeName: string;
  placePhoto?: string;
  placeType?: PlaceType;
  city?: string;
  date?: string;
  dateOut?: string;
  checkIn?: string;
  checkOut?: string;
  guests: number;
  time?: string;
  roomType?: string;
  totalPrice?: string;
  status: 'confirmed' | 'cancelled' | string;
  createdAt: string;
}
