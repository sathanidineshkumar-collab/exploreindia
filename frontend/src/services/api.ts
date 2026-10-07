import {
  User,
  Place,
  Review,
  SearchHistory,
  CityInfo,
  TravelTip,
  Notification,
  AnalyticsData
} from "../types";

// Base API URL: In development with Vite proxy, empty string uses relative paths '/api/...'
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

export function getApiUrl(endpoint: string): string {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${cleanEndpoint}`;
}

function getHeaders(token?: string): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error || `Request failed with status ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Authentication
  auth: {
    login: (credentials: { email: string; password: string; rememberMe?: boolean }) =>
      fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(credentials),
      }).then(handleResponse<{ user: User }>),

    signup: (data: { name: string; email: string; password: string }) =>
      fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data),
      }).then(handleResponse<{ user: User; otpCode: string; message: string }>),

    verifyOtp: (data: { email: string; otp: string }) =>
      fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data),
      }).then(handleResponse<{ user: User; message: string }>),

    forgotPassword: (email: string) =>
      fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ email }),
      }).then(handleResponse<{ otpCode: string; message: string }>),

    resetPassword: (data: { email: string; otp: string; newPassword: string }) =>
      fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data),
      }).then(handleResponse<{ message: string }>),
  },

  // Places & Discovery
  places: {
    discover: (query: string, lat?: number | null, lng?: number | null, userId?: string) => {
      const headers = getHeaders();
      if (userId) (headers as any)["x-user-id"] = userId;
      return fetch(`${API_BASE_URL}/api/discover`, {
        method: "POST",
        headers,
        body: JSON.stringify({ query, lat, lng }),
      }).then(handleResponse<{ city: CityInfo; places: Place[]; suggestedTab?: string }>);
    },

    getTrending: () =>
      fetch(`${API_BASE_URL}/api/places/trending`).then(handleResponse<Place[]>),

    getById: (id: string) =>
      fetch(`${API_BASE_URL}/api/places/${id}`).then(handleResponse<Place>),

    getFamousHotels: () =>
      fetch(`${API_BASE_URL}/api/hotels/famous`).then(handleResponse<Place[]>),

    getTrendingCities: () =>
      fetch(`${API_BASE_URL}/api/cities/trending`).then(handleResponse<CityInfo[]>),

    getTravelTips: () =>
      fetch(`${API_BASE_URL}/api/tips`).then(handleResponse<TravelTip[]>),
  },

  // User Profile, Favorites & History
  user: {
    getProfile: (token: string) =>
      fetch(`${API_BASE_URL}/api/user/profile`, {
        headers: getHeaders(token),
      }).then(handleResponse<{ user: User; favorites: Place[]; history: SearchHistory[]; reviews: Review[] }>),

    updateProfile: (token: string, data: { name?: string; avatar?: string }) =>
      fetch(`${API_BASE_URL}/api/user/profile/update`, {
        method: "POST",
        headers: getHeaders(token),
        body: JSON.stringify(data),
      }).then(handleResponse<{ success: boolean; user: User }>),

    clearHistory: (token: string) =>
      fetch(`${API_BASE_URL}/api/user/clear-history`, {
        method: "POST",
        headers: getHeaders(token),
      }).then(handleResponse<{ success: boolean }>),

    toggleFavorite: (token: string, placeId: string) =>
      fetch(`${API_BASE_URL}/api/favorites/toggle`, {
        method: "POST",
        headers: getHeaders(token),
        body: JSON.stringify({ placeId }),
      }).then(handleResponse<{ success: boolean; action: "added" | "removed"; favorites: string[] }>),
  },

  // Reviews
  reviews: {
    submit: (token: string, data: { placeId: string; rating: number; text: string }) =>
      fetch(`${API_BASE_URL}/api/reviews`, {
        method: "POST",
        headers: getHeaders(token),
        body: JSON.stringify(data),
      }).then(handleResponse<{ review: Review; message: string }>),
  },

  // Notifications
  notifications: {
    getAll: (token: string) =>
      fetch(`${API_BASE_URL}/api/notifications`, {
        headers: getHeaders(token),
      }).then(handleResponse<Notification[]>),

    markAllRead: (token: string) =>
      fetch(`${API_BASE_URL}/api/notifications/read-all`, {
        method: "POST",
        headers: getHeaders(token),
      }).then(handleResponse<{ success: boolean }>),
  },

  // Trips & Itineraries
  trips: {
    getAll: (token: string) =>
      fetch(`${API_BASE_URL}/api/trips`, {
        headers: getHeaders(token),
      }).then(handleResponse<any[]>),

    create: (token: string, data: { name: string; destination: string; days: number }) =>
      fetch(`${API_BASE_URL}/api/trips`, {
        method: "POST",
        headers: getHeaders(token),
        body: JSON.stringify(data),
      }).then(handleResponse<any>),

    delete: (token: string, id: string) =>
      fetch(`${API_BASE_URL}/api/trips/${id}`, {
        method: "DELETE",
        headers: getHeaders(token),
      }).then(handleResponse<{ success: boolean }>),

    addPlace: (token: string, tripId: string, placeId: string, day: number) =>
      fetch(`${API_BASE_URL}/api/trips/${tripId}/add-place`, {
        method: "POST",
        headers: getHeaders(token),
        body: JSON.stringify({ placeId, day }),
      }).then(handleResponse<any>),

    removePlace: (token: string, tripId: string, placeId: string, day: number) =>
      fetch(`${API_BASE_URL}/api/trips/${tripId}/remove-place`, {
        method: "POST",
        headers: getHeaders(token),
        body: JSON.stringify({ placeId, day }),
      }).then(handleResponse<any>),

    updateNotes: (token: string, tripId: string, day: number, note: string) =>
      fetch(`${API_BASE_URL}/api/trips/${tripId}/update-notes`, {
        method: "POST",
        headers: getHeaders(token),
        body: JSON.stringify({ day, note }),
      }).then(handleResponse<any>),
  },

  // Bookings
  bookings: {
    getAll: (token: string) =>
      fetch(`${API_BASE_URL}/api/bookings`, {
        headers: getHeaders(token),
      }).then(handleResponse<any[]>),

    create: (token: string, data: { placeId: string; date: string; dateOut?: string; guests: number; time?: string }) =>
      fetch(`${API_BASE_URL}/api/bookings`, {
        method: "POST",
        headers: getHeaders(token),
        body: JSON.stringify(data),
      }).then(handleResponse<any>),

    delete: (token: string, id: string) =>
      fetch(`${API_BASE_URL}/api/bookings/${id}`, {
        method: "DELETE",
        headers: getHeaders(token),
      }).then(handleResponse<{ success: boolean }>),
  },

  // Admin Dashboard
  admin: {
    getAnalytics: (token: string) =>
      fetch(`${API_BASE_URL}/api/admin/analytics`, {
        headers: getHeaders(token),
      }).then(handleResponse<AnalyticsData>),

    getPlaces: (token: string) =>
      fetch(`${API_BASE_URL}/api/admin/places`, {
        headers: getHeaders(token),
      }).then(handleResponse<Place[]>),

    createPlace: (token: string, place: Partial<Place>) =>
      fetch(`${API_BASE_URL}/api/admin/places`, {
        method: "POST",
        headers: getHeaders(token),
        body: JSON.stringify(place),
      }).then(handleResponse<Place>),

    updatePlace: (token: string, id: string, place: Partial<Place>) =>
      fetch(`${API_BASE_URL}/api/admin/places/${id}`, {
        method: "PUT",
        headers: getHeaders(token),
        body: JSON.stringify(place),
      }).then(handleResponse<Place>),

    deletePlace: (token: string, id: string) =>
      fetch(`${API_BASE_URL}/api/admin/places/${id}`, {
        method: "DELETE",
        headers: getHeaders(token),
      }).then(handleResponse<{ success: boolean }>),

    getUsers: (token: string) =>
      fetch(`${API_BASE_URL}/api/admin/users`, {
        headers: getHeaders(token),
      }).then(handleResponse<User[]>),

    deleteUser: (token: string, id: string) =>
      fetch(`${API_BASE_URL}/api/admin/users/${id}`, {
        method: "DELETE",
        headers: getHeaders(token),
      }).then(handleResponse<{ success: boolean }>),

    getPendingReviews: (token: string) =>
      fetch(`${API_BASE_URL}/api/admin/reviews/pending`, {
        headers: getHeaders(token),
      }).then(handleResponse<Review[]>),

    approveReview: (token: string, id: string) =>
      fetch(`${API_BASE_URL}/api/admin/reviews/approve/${id}`, {
        method: "POST",
        headers: getHeaders(token),
      }).then(handleResponse<{ success: boolean }>),

    deleteReview: (token: string, id: string) =>
      fetch(`${API_BASE_URL}/api/admin/reviews/${id}`, {
        method: "DELETE",
        headers: getHeaders(token),
      }).then(handleResponse<{ success: boolean }>),
  },
};
