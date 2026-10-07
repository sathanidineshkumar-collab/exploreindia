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

export interface Place {
  id: string;
  name: string;
  type: PlaceType;
  subtypes: string[]; // e.g., ['Luxury Hotels', 'Hill Resorts', 'Veg Friendly', 'Fine Dining']
  rating: number;
  reviewCount: number;
  priceLevel: number; // 1 to 4 stars ($ to $$$$)
  priceRange?: string; // e.g., '₹1,500 - ₹3,000' or '₹500 for two'
  address: string;
  description: string;
  photos: string[];
  facilities: string[];
  phone?: string;
  website?: string;
  coordinates: LatLng;
  openHours?: string;
  reviews?: Review[];
  city: string;
  state: string;
  
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
  placeType: PlaceType;
  checkIn: string;
  checkOut: string;
  guests: number;
  roomType?: string;
  totalPrice: string;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
}
