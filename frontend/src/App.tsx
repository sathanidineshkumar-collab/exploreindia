import React, { useState, useEffect } from "react";
import { 
  Compass, MapPin, Search, Star, Hotel, Utensils, Palmtree, Camera, Map as MapIcon,
  Coffee, Shield, LogIn, UserPlus, Heart, History, Sparkles, Filter, 
  Check, ArrowLeft, Globe, Phone, ExternalLink, Calendar, Plus, Edit2, 
  Trash2, Sliders, Menu, X, CheckCircle, AlertTriangle, HelpCircle, 
  Eye, RefreshCw, BarChart2, Users, FileText
} from "lucide-react";
import { 
  User, Place, Review, SearchHistory, CityInfo, 
  TravelTip, PlaceType, LatLng, AnalyticsData 
} from "./types";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ExploreMap from "./components/ExploreMap";
import { 
  FALLBACK_IMAGE, FALLBACK_AVATAR, 
  DEFAULT_CITIES, DEFAULT_TIPS, DEFAULT_HOTELS, 
  generateClientDiscovery 
} from "./constants";
import { getApiUrl } from "./services/api";

export { FALLBACK_IMAGE, FALLBACK_AVATAR };

export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  e.currentTarget.onerror = null;
  e.currentTarget.src = FALLBACK_IMAGE;
};

export const handleAvatarError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  e.currentTarget.onerror = null;
  e.currentTarget.src = FALLBACK_AVATAR;
};

// TripAdvisor Signature Green Bubble Rating Helper
const renderTripAdvisorBubbles = (rating: number) => {
  const bubbles = [];
  const roundedRating = Math.round(rating * 2) / 2; // round to nearest 0.5
  for (let i = 1; i <= 5; i++) {
    if (roundedRating >= i) {
      // Full bubble
      bubbles.push(
        <div key={i} className="w-3 h-3 rounded-full bg-[#00AA6C] border border-[#00AA6C] shrink-0" />
      );
    } else if (roundedRating >= i - 0.5) {
      // Half bubble
      bubbles.push(
        <div 
          key={i} 
          className="w-3 h-3 rounded-full border border-[#00AA6C] bg-gradient-to-r from-[#00AA6C] from-50% to-transparent to-50% shrink-0" 
        />
      );
    } else {
      // Empty bubble
      bubbles.push(
        <div key={i} className="w-3 h-3 rounded-full border border-gray-300 dark:border-slate-700 bg-transparent shrink-0" />
      );
    }
  }
  return <div className="flex items-center gap-0.5">{bubbles}</div>;
};

export default function App() {
  // Theme state
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    try {
      const saved = localStorage.getItem("explore_india_theme");
      return (saved === "light" || saved === "dark") ? saved : "light";
    } catch (e) {
      return "light";
    }
  });

  // User state
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem("explore_india_user");
      if (saved && saved !== "undefined") {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to parse user session:", e);
    }
    return null;
  });

  // Active View & Data state
  const [activeView, setActiveView] = useState<string>("home");
  const [activeViewData, setActiveViewData] = useState<any>(null);
  const [trendingCities, setTrendingCities] = useState<CityInfo[]>(DEFAULT_CITIES);
  const [famousHotels, setFamousHotels] = useState<Place[]>(DEFAULT_HOTELS);
  const [travelTips, setTravelTips] = useState<TravelTip[]>(DEFAULT_TIPS);

  // Search results state
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedCity, setSelectedCity] = useState<CityInfo | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [showDirectionsOnMap, setShowDirectionsOnMap] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [resultsTab, setResultsTab] = useState<"all" | "tourism" | "stays" | "food" | "temples">("all");

  // Filters state
  const [filters, setFilters] = useState({
    type: "all",
    priceLevel: "all",
    rating: "all",
    amenities: [] as string[],
    vegOnly: false,
    nonVegOnly: false,
    openNow: false
  });

  // Profile View Tab State
  const [profileTab, setProfileTab] = useState<"favorites" | "history" | "reviews" | "settings">("favorites");
  const [profileData, setProfileData] = useState<any>(null);

  // Admin Panel states
  const [adminAnalytics, setAdminAnalytics] = useState<AnalyticsData | null>(null);
  const [adminPlaces, setAdminPlaces] = useState<Place[]>([]);
  const [adminUsers, setAdminUsers] = useState<User[]>([]);
  const [adminPendingReviews, setAdminPendingReviews] = useState<Review[]>([]);
  const [adminTab, setAdminTab] = useState<"dashboard" | "places" | "users" | "reviews">("dashboard");
  const [isEditingPlace, setIsEditingPlace] = useState<Place | null>(null);
  const [showAddPlaceModal, setShowAddPlaceModal] = useState(false);
  
  // Terms & Privacy Info Modal
  const [infoModal, setInfoModal] = useState<{
    isOpen: boolean;
    title: string;
    content: string;
  }>({
    isOpen: false,
    title: "",
    content: ""
  });

  // Trips Planner state variables
  const [trips, setTrips] = useState<any[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<any | null>(null);
  const [activeTripDay, setActiveTripDay] = useState(1);
  const [showAddToTripModal, setShowAddToTripModal] = useState(false);
  const [tripFormInputs, setTripFormInputs] = useState({ name: "", destination: "", days: "3" });
  const [tripNoteInput, setTripNoteInput] = useState("");

  // Bookings state variables
  const [userBookings, setUserBookings] = useState<any[]>([]);

  // Auth Modal states
  const [authModal, setAuthModal] = useState<{
    isOpen: boolean;
    mode: "login" | "signup" | "forgot" | "verify" | "reset";
    email?: string;
    otpCode?: string;
  }>({
    isOpen: false,
    mode: "login"
  });

  // TripAdvisor Booking form states
  const [bookingDate, setBookingDate] = useState("");
  const [bookingDateOut, setBookingDateOut] = useState("");
  const [bookingGuests, setBookingGuests] = useState("2");
  const [bookingTime, setBookingTime] = useState("7:30 PM");
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Auth Inputs
  const [authInputs, setAuthInputs] = useState({
    name: "",
    email: "",
    password: "",
    otp: "",
    rememberMe: true,
    avatar: ""
  });

  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");

  // Reviews Inputs
  const [newReviewText, setNewReviewText] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [reviewMessage, setReviewMessage] = useState("");

  // Theme Sync
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("explore_india_theme", theme);
  }, [theme]);

  // Load trending cities, tips & famous hotels on startup
  useEffect(() => {
    fetch(getApiUrl("/api/cities/trending"))
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (Array.isArray(data) && data.length > 0) setTrendingCities(data);
      })
      .catch(err => console.warn("Default cities used:", err));

    fetch(getApiUrl("/api/tips"))
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (Array.isArray(data) && data.length > 0) setTravelTips(data);
      })
      .catch(err => console.warn("Default tips used:", err));

    fetch(getApiUrl("/api/hotels/famous"))
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (Array.isArray(data) && data.length > 0) setFamousHotels(data);
      })
      .catch(err => console.warn("Default hotels used:", err));
  }, []);

  // Fetch full profile data when visiting profile view
  useEffect(() => {
    if (activeView === "profile" && user) {
      fetch(getApiUrl("/api/user/profile"), {
        headers: { "Authorization": `Bearer ${user.token}` }
      })
        .then(res => res.json())
        .then(data => {
          setProfileData(data);
        })
        .catch(err => console.error(err));
    }
  }, [activeView, user]);

  // Load user trips
  useEffect(() => {
    if (user) {
      fetch(getApiUrl("/api/trips"), {
        headers: { "Authorization": `Bearer ${user.token}` }
      })
        .then(res => {
          if (res.ok) return res.json();
          throw new Error("Failed to load trips");
        })
        .then(data => {
          if (Array.isArray(data)) {
            setTrips(data);
            if (data.length > 0) {
              // Preserve selection if possible, otherwise default to first
              setSelectedTrip(prev => {
                if (prev) {
                  const match = data.find(t => t.id === prev.id);
                  if (match) return match;
                }
                return data[0];
              });
            } else {
              setSelectedTrip(null);
            }
          }
        })
        .catch(err => console.error(err));
    } else {
      setTrips([]);
      setSelectedTrip(null);
      setUserBookings([]);
    }
  }, [user]);

  // Load user bookings
  useEffect(() => {
    if (user) {
      fetch(getApiUrl("/api/bookings"), {
        headers: { "Authorization": `Bearer ${user.token}` }
      })
        .then(res => {
          if (res.ok) return res.json();
          throw new Error("Failed to load bookings");
        })
        .then(data => {
          if (Array.isArray(data)) setUserBookings(data);
        })
        .catch(err => console.error(err));
    }
  }, [user]);

  // Load latest place details when visiting details view
  useEffect(() => {
    if (activeView === "details" && selectedPlace?.id) {
      setActivePhotoIndex(0);
      setBookingSuccess(false);
      fetch(getApiUrl(`/api/places/${selectedPlace.id}`))
        .then(res => {
          if (res.ok) return res.json();
          throw new Error("Failed to fetch place details");
        })
        .then(data => setSelectedPlace(data))
        .catch(err => console.error("Error loading place details:", err));
    }
  }, [activeView, selectedPlace?.id]);

  // Load Admin Data when visiting Admin View
  useEffect(() => {
    if (activeView === "admin" && user && user.role === "admin") {
      // Analytics
      fetch(getApiUrl("/api/admin/analytics"), {
        headers: { "Authorization": `Bearer ${user.token}` }
      })
        .then(res => res.json())
        .then(data => setAdminAnalytics(data))
        .catch(err => console.error(err));

      // Places list
      fetch(getApiUrl("/api/admin/places"), {
        headers: { "Authorization": `Bearer ${user.token}` }
      })
        .then(res => res.json())
        .then(data => setAdminPlaces(data))
        .catch(err => console.error(err));

      // Users list
      fetch(getApiUrl("/api/admin/users"), {
        headers: { "Authorization": `Bearer ${user.token}` }
      })
        .then(res => res.json())
        .then(data => setAdminUsers(data))
        .catch(err => console.error(err));

      // Pending reviews
      fetch(getApiUrl("/api/admin/reviews/pending"), {
        headers: { "Authorization": `Bearer ${user.token}` }
      })
        .then(res => res.json())
        .then(data => setAdminPendingReviews(data))
        .catch(err => console.error(err));
    }
  }, [activeView, adminTab, user]);

  // Trigger discovery searches
  const handleSearchCity = async (cityQuery: string, preDefinedCoords?: LatLng, forceTab?: "all" | "tourism" | "stays" | "food" | "temples") => {
    if (!cityQuery.trim()) return;
    setIsSearching(true);

    let finalQuery = cityQuery;
    let finalTab: "all" | "tourism" | "stays" | "food" | "temples" = forceTab || "all";
    
    if (cityQuery.toLowerCase() === "luxury hotels") {
      finalQuery = "Delhi";
      finalTab = "stays";
      setFilters({
        type: "hotel",
        priceLevel: "4",
        rating: "all",
        amenities: [],
        vegOnly: false,
        nonVegOnly: false,
        openNow: false
      });
    } else if (cityQuery.toLowerCase() === "budget hotels") {
      finalQuery = "Jaipur";
      finalTab = "stays";
      setFilters({
        type: "hotel",
        priceLevel: "2",
        rating: "all",
        amenities: [],
        vegOnly: false,
        nonVegOnly: false,
        openNow: false
      });
    } else if (cityQuery.toLowerCase() === "beach resorts") {
      finalQuery = "Goa";
      finalTab = "stays";
      setFilters({
        type: "resort",
        priceLevel: "all",
        rating: "all",
        amenities: [],
        vegOnly: false,
        nonVegOnly: false,
        openNow: false
      });
    } else if (cityQuery.toLowerCase() === "hill resorts") {
      finalQuery = "Srinagar";
      finalTab = "stays";
      setFilters({
        type: "resort",
        priceLevel: "all",
        rating: "all",
        amenities: [],
        vegOnly: false,
        nonVegOnly: false,
        openNow: false
      });
    } else if (cityQuery.toLowerCase() === "street food") {
      finalQuery = "Hyderabad";
      finalTab = "food";
      setFilters({
        type: "restaurant",
        priceLevel: "all",
        rating: "all",
        amenities: [],
        vegOnly: false,
        nonVegOnly: false,
        openNow: false
      });
    } else if (cityQuery.toLowerCase() === "ancient temples") {
      finalQuery = "Varanasi";
      finalTab = "temples";
      setFilters({
        type: "temple",
        priceLevel: "all",
        rating: "all",
        amenities: [],
        vegOnly: false,
        nonVegOnly: false,
        openNow: false
      });
    } else {
      setFilters({
        type: "all",
        priceLevel: "all",
        rating: "all",
        amenities: [],
        vegOnly: false,
        nonVegOnly: false,
        openNow: false
      });
    }

    setSearchQuery(finalQuery);
    
    // Auto-detect intent category based on search query or use forceTab
    const queryLower = finalQuery.toLowerCase();
    let detectedTab: "all" | "tourism" | "stays" | "food" | "temples" = finalTab;
    
    if (finalTab === "all" && !forceTab) {
      if (
        queryLower.includes("hotel") || queryLower.includes("resort") || 
        queryLower.includes("stay") || queryLower.includes("lodge") || 
        queryLower.includes("room") || queryLower.includes("accommodation")
      ) {
        detectedTab = "stays";
      } else if (
        queryLower.includes("food") || queryLower.includes("restaurant") || 
        queryLower.includes("cafe") || queryLower.includes("dine") || 
        queryLower.includes("eat") || queryLower.includes("biryani") || 
        queryLower.includes("coffee") || queryLower.includes("biscuit") || 
        queryLower.includes("tea")
      ) {
        detectedTab = "food";
      } else if (queryLower.includes("temple") || queryLower.includes("shrine") || queryLower.includes("pilgrim") || queryLower.includes("mandir")) {
        detectedTab = "temples";
      } else if (
        queryLower.includes("museum") || 
        queryLower.includes("sight") || queryLower.includes("attraction") || 
        queryLower.includes("visit") || queryLower.includes("monument") || 
        queryLower.includes("place") || queryLower.includes("historical") ||
        queryLower.includes("fort") || queryLower.includes("palace")
      ) {
        detectedTab = "tourism";
      }
    }
    
    setResultsTab(detectedTab);

    try {
      const payload: any = { query: finalQuery };
      if (preDefinedCoords) {
        payload.lat = preDefinedCoords.lat;
        payload.lng = preDefinedCoords.lng;
      }

      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (user) {
        headers["x-user-id"] = user.id;
      }

      let data: any = null;
      try {
        const res = await fetch(getApiUrl("/api/discover"), {
          method: "POST",
          headers,
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          data = await res.json();
        }
      } catch (netErr) {
        console.warn("Backend API not reachable, activating client discovery fallback:", netErr);
      }

      // If backend was unreachable or returned empty, use client-side discovery fallback
      if (!data || !data.city) {
        data = generateClientDiscovery(cityQuery, preDefinedCoords);
      }

      if (data && data.city) {
        setSelectedCity(data.city);
        setPlaces(data.places || []);
        setSelectedPlace(data.places?.[0] || null);
        setShowDirectionsOnMap(false);
        setActiveView("search");
        if (forceTab) {
          setResultsTab(forceTab);
        } else if (data.suggestedTab) {
          setResultsTab(data.suggestedTab as any);
        }
      }
    } catch (e: any) {
      console.warn("Search fallback activated due to:", e);
      const fallback = generateClientDiscovery(cityQuery, preDefinedCoords);
      setSelectedCity(fallback.city);
      setPlaces(fallback.places);
      setSelectedPlace(fallback.places[0] || null);
      setShowDirectionsOnMap(false);
      setActiveView("search");
    } finally {
      setIsSearching(false);
    }
  };

  // Toggle favorite place
  const handleToggleFavorite = async (placeId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!user) {
      setAuthModal({ isOpen: true, mode: "login" });
      return;
    }

    try {
      const res = await fetch(getApiUrl("/api/favorites/toggle"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`
        },
        body: JSON.stringify({ placeId })
      });
      const data = await res.json();
      
      if (data.success) {
        const updatedUser = { ...user, favorites: data.favorites };
        setUser(updatedUser);
        localStorage.setItem("explore_india_user", JSON.stringify(updatedUser));
        
        // Update state of selectedPlace if active
        if (selectedPlace && selectedPlace.id === placeId) {
          // just force re-render or update
        }

        // Re-fetch profile data if on profile view
        if (activeView === "profile") {
          fetch(getApiUrl("/api/user/profile"), {
            headers: { "Authorization": `Bearer ${user.token}` }
          })
            .then(res => res.json())
            .then(d => setProfileData(d));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Submit Review
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setAuthModal({ isOpen: true, mode: "login" });
      return;
    }
    if (!selectedPlace) return;

    try {
      const res = await fetch(getApiUrl("/api/reviews"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`
        },
        body: JSON.stringify({
          placeId: selectedPlace.id,
          rating: newReviewRating,
          text: newReviewText
        })
      });
      const data = await res.json();
      if (res.ok) {
        setNewReviewText("");
        setReviewMessage(data.message);
        
        // Reload details to capture new reviews if immediately approved
        fetch(getApiUrl(`/api/places/${selectedPlace.id}`))
          .then(r => r.json())
          .then(p => setSelectedPlace(p));

        setTimeout(() => setReviewMessage(""), 5000);
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Authentication logic
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");

    try {
      if (authModal.mode === "login") {
        const res = await fetch(getApiUrl("/api/auth/login"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: authInputs.email,
            password: authInputs.password,
            rememberMe: authInputs.rememberMe
          })
        });
        const data = await res.json();
        if (res.ok) {
          setUser(data.user);
          localStorage.setItem("explore_india_user", JSON.stringify(data.user));
          setAuthModal({ isOpen: false, mode: "login" });
        } else {
          setAuthError(data.error || "Login failed");
        }
      } else if (authModal.mode === "signup") {
        const res = await fetch(getApiUrl("/api/auth/signup"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: authInputs.name,
            email: authInputs.email,
            password: authInputs.password
          })
        });
        const data = await res.json();
        if (res.ok) {
          setUser(data.user);
          setAuthSuccess(data.message || "Account created! Verify with OTP.");
          setAuthModal({
            isOpen: true,
            mode: "verify",
            email: authInputs.email,
            otpCode: data.otpCode // Pass OTP directly to test seamlessly
          });
        } else {
          setAuthError(data.error || "Registration failed");
        }
      } else if (authModal.mode === "verify") {
        const res = await fetch(getApiUrl("/api/auth/verify-otp"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: authModal.email,
            otp: authInputs.otp
          })
        });
        const data = await res.json();
        if (res.ok) {
          const updatedUser = data.user;
          setUser(updatedUser);
          localStorage.setItem("explore_india_user", JSON.stringify(updatedUser));
          setAuthSuccess("Email verified successfully!");
          setTimeout(() => {
            setAuthModal({ isOpen: false, mode: "login" });
          }, 1500);
        } else {
          setAuthError(data.error || "Verification failed");
        }
      } else if (authModal.mode === "forgot") {
        const res = await fetch(getApiUrl("/api/auth/forgot-password"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: authInputs.email })
        });
        const data = await res.json();
        if (res.ok) {
          setAuthSuccess(`Reset code sent! Use OTP code: ${data.otpCode}`);
          setAuthModal({
            isOpen: true,
            mode: "reset",
            email: authInputs.email,
            otpCode: data.otpCode
          });
        } else {
          setAuthError(data.error || "Failed to process forgot password");
        }
      } else if (authModal.mode === "reset") {
        const res = await fetch(getApiUrl("/api/auth/reset-password"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: authInputs.email,
            otp: authInputs.otp,
            newPassword: authInputs.password
          })
        });
        const data = await res.json();
        if (res.ok) {
          setAuthSuccess("Password reset successful! You can now log in.");
          setTimeout(() => {
            setAuthModal({ isOpen: true, mode: "login" });
            setAuthSuccess("");
            setAuthInputs(prev => ({ ...prev, password: "", otp: "" }));
          }, 2000);
        } else {
          setAuthError(data.error || "Password reset failed");
        }
      }
    } catch (err: any) {
      setAuthError(err.message || "An unexpected error occurred");
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("explore_india_user");
    setActiveView("home");
  };

  const handleToggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  };

  // Filter application logic
  const filteredPlaces = places.filter(place => {
    // Tab filter
    if (resultsTab === "tourism" && place.type !== "attraction") return false;
    if (resultsTab === "stays" && place.type !== "hotel" && place.type !== "resort") return false;
    if (resultsTab === "food" && place.type !== "restaurant" && place.type !== "cafe") return false;
    if (resultsTab === "temples" && place.type !== "temple") return false;

    if (filters.type !== "all" && place.type !== filters.type) return false;
    if (filters.priceLevel !== "all" && place.priceLevel !== Number(filters.priceLevel)) return false;
    if (filters.rating !== "all" && place.rating < Number(filters.rating)) return false;
    
    // Veg/Nonveg Filters
    if (filters.vegOnly && place.vegFriendly === false) return false;
    if (filters.nonVegOnly && place.nonVegFriendly === false) return false;

    // Amenities
    if (filters.amenities.length > 0) {
      const hasAll = filters.amenities.every(amenity => place.facilities.includes(amenity));
      if (!hasAll) return false;
    }

    return true;
  });

  const handleAmenityToggle = (amenity: string) => {
    setFilters(prev => {
      const current = [...prev.amenities];
      const idx = current.indexOf(amenity);
      if (idx > -1) current.splice(idx, 1);
      else current.push(amenity);
      return { ...prev, amenities: current };
    });
  };

  // Navigations handler
  const handleNavigate = (view: string, data?: any) => {
    if (view === "profile-favorites") {
      setActiveView("profile");
      setProfileTab("favorites");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (view === "privacy") {
      setInfoModal({
        isOpen: true,
        title: "Privacy Policy",
        content: "ExploreIndia takes your privacy very seriously. We secure all personal credentials with robust encryption (bcrypt) and store search logs locally. We do not sell your travel preferences or booking history to any third-party agencies. All geocoding data and map tiles are fetched securely using encrypted end-points. We strictly comply with global digital privacy guidelines."
      });
      return;
    }
    if (view === "terms") {
      setInfoModal({
        isOpen: true,
        title: "Terms & Conditions",
        content: "By using the ExploreIndia portal, you agree to our terms of service. Our portal offers mock reservations, coordinates, and details for research and demonstration purposes. Booking submissions generate active real-time notifications in your user profile feed, but do not charge actual currency. Please respect archaeological site custom guidelines, dress codes, and local guidelines when visiting temple shrines."
      });
      return;
    }
    setActiveView(view);
    setActiveViewData(data);
    if (view === "profile" && data?.tab) {
      setProfileTab(data.tab);
    }
    if (view === "search" && data?.query) {
      handleSearchCity(data.query);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Trips Handlers
  const handleCreateTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      const res = await fetch(getApiUrl("/api/trips"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`
        },
        body: JSON.stringify({
          name: tripFormInputs.name,
          destination: tripFormInputs.destination,
          days: tripFormInputs.days
        })
      });
      if (res.ok) {
        const newTrip = await res.json();
        setTrips(prev => [...prev, newTrip]);
        setSelectedTrip(newTrip);
        setActiveTripDay(1);
        setTripFormInputs({ name: "", destination: "", days: "3" });
        alert("Trip created successfully!");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to create trip");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTrip = async (tripId: string) => {
    if (!user) return;
    if (!confirm("Are you sure you want to delete this trip planner?")) return;
    try {
      const res = await fetch(getApiUrl(`/api/trips/${tripId}`), {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${user.token}` }
      });
      if (res.ok) {
        setTrips(prev => {
          const filtered = prev.filter(t => t.id !== tripId);
          if (selectedTrip && selectedTrip.id === tripId) {
            setSelectedTrip(filtered[0] || null);
            setActiveTripDay(1);
          }
          return filtered;
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddPlaceToTrip = async (tripId: string, day: number) => {
    if (!user || !selectedPlace) return;
    try {
      const res = await fetch(getApiUrl(`/api/trips/${tripId}/add-place`), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`
        },
        body: JSON.stringify({ placeId: selectedPlace.id, day })
      });
      if (res.ok) {
        const updatedTrip = await res.json();
        setTrips(prev => prev.map(t => t.id === updatedTrip.id ? updatedTrip : t));
        setSelectedTrip(updatedTrip);
        setShowAddToTripModal(false);
        alert(`Added ${selectedPlace.name} to Day ${day}!`);
      } else {
        const data = await res.json();
        alert(data.error || "Failed to add place");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemovePlaceFromTrip = async (tripId: string, placeId: string, day: number) => {
    if (!user) return;
    try {
      const res = await fetch(getApiUrl(`/api/trips/${tripId}/remove-place`), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`
        },
        body: JSON.stringify({ placeId, day })
      });
      if (res.ok) {
        const updatedTrip = await res.json();
        setTrips(prev => prev.map(t => t.id === updatedTrip.id ? updatedTrip : t));
        setSelectedTrip(updatedTrip);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateTripNotes = async (tripId: string, day: number, noteText: string) => {
    if (!user) return;
    try {
      const res = await fetch(getApiUrl(`/api/trips/${tripId}/update-notes`), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`
        },
        body: JSON.stringify({ day, note: noteText })
      });
      if (res.ok) {
        const updatedTrip = await res.json();
        setTrips(prev => prev.map(t => t.id === updatedTrip.id ? updatedTrip : t));
        setSelectedTrip(updatedTrip);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Bookings Handlers
  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedPlace) {
      setAuthModal({ isOpen: true, mode: "login" });
      return;
    }

    try {
      const res = await fetch(getApiUrl("/api/bookings"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`
        },
        body: JSON.stringify({
          placeId: selectedPlace.id,
          date: bookingDate,
          dateOut: bookingDateOut,
          guests: bookingGuests,
          time: bookingTime
        })
      });
      if (res.ok) {
        const newBooking = await res.json();
        setUserBookings(prev => [newBooking, ...prev]);
        setBookingSuccess(true);
      } else {
        const data = await res.json();
        alert(data.error || "Failed to make reservation");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!user) return;
    if (!confirm("Are you sure you want to cancel this reservation?")) return;

    try {
      const res = await fetch(getApiUrl(`/api/bookings/${bookingId}`), {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${user.token}` }
      });
      if (res.ok) {
        setUserBookings(prev => prev.filter(b => b.id !== bookingId));
        alert("Booking cancelled successfully.");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to cancel booking");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Admin Actions
  const handleApproveReview = async (id: string) => {
    try {
      const res = await fetch(getApiUrl(`/api/admin/reviews/approve/${id}`), {
        method: "POST",
        headers: { "Authorization": `Bearer ${user?.token}` }
      });
      if (res.ok) {
        setAdminPendingReviews(prev => prev.filter(r => r.id !== id));
        // refresh analytics
        setAdminTab("dashboard");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteReview = async (id: string) => {
    try {
      const res = await fetch(getApiUrl(`/api/admin/reviews/${id}`), {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${user?.token}` }
      });
      if (res.ok) {
        setAdminPendingReviews(prev => prev.filter(r => r.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeletePlace = async (id: string) => {
    if (!confirm("Are you sure you want to delete this listing permanently?")) return;
    try {
      const res = await fetch(getApiUrl(`/api/admin/places/${id}`), {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${user?.token}` }
      });
      if (res.ok) {
        setAdminPlaces(prev => prev.filter(p => p.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f9fb] dark:bg-slate-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Navbar Component */}
      <Navbar 
        user={user}
        onNavigate={handleNavigate}
        activeView={activeView}
        onLogout={handleLogout}
        onOpenAuth={() => setAuthModal({ isOpen: true, mode: "login" })}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Page Routing Switch */}
      <main className="flex-grow">
        
        {/* ======================================================== */}
        {/* HOME VIEW                                                */}
        {/* ======================================================== */}
        {activeView === "home" && (
          <div className="animate-fade-in">
            {/* Immersive Hero Section */}
            <section className="relative min-h-[560px] bg-gradient-to-tr from-[#004F32] via-[#023E28] to-[#011C12] text-white flex items-center py-20 px-4 overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1600')] bg-cover bg-center mix-blend-overlay opacity-30"></div>
              
              {/* TripAdvisor Green and Emerald glow filters */}
              <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500 rounded-full blur-3xl opacity-20"></div>
              <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-lime-500 rounded-full blur-3xl opacity-20"></div>

              <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold tracking-widest uppercase text-[#34E0A1] bg-emerald-950/40 border border-emerald-500/20">
                  <Sparkles className="w-4 h-4 text-[#34E0A1]" /> TripAdvisor-Style Traveler Hub
                </span>
                
                <h1 className="font-serif font-bold text-4xl sm:text-6xl tracking-tight leading-tight">
                  Where to in <span className="text-[#34E0A1]">India?</span>
                </h1>
                
                <p className="text-sm sm:text-base text-gray-300 font-sans font-normal max-w-2xl mx-auto leading-relaxed">
                  Search any city or village. Discover local hotels, luxury resorts, legendary eateries, and historic temples with genuine coordinates and photos.
                </p>

                {/* Floating TripAdvisor-style Search Box */}
                <div className="max-w-2xl mx-auto pt-2">
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSearchCity(searchQuery);
                    }}
                    className="p-2 rounded-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-2xl flex flex-col sm:flex-row gap-2 items-center"
                  >
                    <div className="flex-grow flex items-center px-4 gap-2 text-gray-900 dark:text-white w-full">
                      <Search className="w-5 h-5 text-[#00AA6C] shrink-0" />
                      <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search Tirupati, Varanasi, Goa, Jaipur, Hyderabad..." 
                        className="w-full bg-transparent border-none text-sm text-gray-800 dark:text-white focus:outline-none placeholder-gray-400 py-3"
                      />
                    </div>
                    <button 
                      type="submit"
                      disabled={isSearching}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#00AA6C] hover:bg-[#008f5a] active:scale-98 text-white text-xs font-black font-sans tracking-wide uppercase shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
                    >
                      {isSearching ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
                      Search
                    </button>
                  </form>

                  {/* TripAdvisor category quick search pills */}
                  <div className="flex flex-wrap justify-center gap-3 pt-8">
                    <button 
                      onClick={() => { 
                        setFilters(prev => ({ ...prev, type: "stays" })); 
                        handleSearchCity("Goa", undefined, "stays");
                      }}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold font-sans transition-all cursor-pointer active:scale-95"
                    >
                      <Hotel className="w-4 h-4 text-[#34E0A1]" /> Hotels & Resorts
                    </button>
                    <button 
                      onClick={() => { 
                        setFilters(prev => ({ ...prev, type: "food" })); 
                        handleSearchCity("Varanasi", undefined, "food");
                      }}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-[#34E0A1] text-xs font-bold font-sans transition-all cursor-pointer active:scale-95"
                    >
                      <Utensils className="w-4 h-4 text-[#34E0A1]" /> Restaurants
                    </button>
                    <button 
                      onClick={() => { 
                        setFilters(prev => ({ ...prev, type: "tourism" })); 
                        handleSearchCity("Tirupati", undefined, "tourism");
                      }}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-[#34E0A1] text-xs font-bold font-sans transition-all cursor-pointer active:scale-95"
                    >
                      <Camera className="w-4 h-4 text-[#34E0A1]" /> Things to Do
                    </button>
                    <button 
                      onClick={() => { 
                        setFilters(prev => ({ ...prev, type: "temple" })); 
                        handleSearchCity("Tirupati", undefined, "temples");
                      }}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-[#34E0A1] text-xs font-bold font-sans transition-all cursor-pointer active:scale-95"
                    >
                      <span className="text-[#34E0A1]">🛕</span> Temples & Shrines
                    </button>
                  </div>

                  <p className="text-[10px] text-gray-400 mt-4 flex justify-center items-center gap-1">
                    <Globe className="w-3 h-3 text-[#34E0A1] animate-spin" /> Supported across all 28 States & 8 Union Territories
                  </p>
                </div>
              </div>
            </section>

            {/* Trending Cities Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
              <div className="flex justify-between items-end">
                <div className="text-left">
                  <p className="text-xs font-mono font-bold tracking-widest text-orange-600 dark:text-orange-400 uppercase">
                    Curated Hotspots
                  </p>
                  <h2 className="font-serif font-extrabold text-2xl sm:text-3xl text-gray-900 dark:text-white mt-1">
                    Trending Heritage Cities
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {trendingCities.map((city) => (
                  <button
                    key={city.name}
                    onClick={() => handleSearchCity(city.name, { lat: city.lat, lng: city.lng })}
                    className="group relative h-72 rounded-2xl overflow-hidden shadow-md text-left premium-card-hover cursor-pointer focus:outline-none border border-gray-100 dark:border-slate-800"
                  >
                    <img 
                      src={city.image} 
                      alt={city.name} 
                      onError={handleImageError}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    
                    <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                      <span className="text-[9px] font-mono tracking-widest text-orange-400 uppercase font-bold">
                        {city.state}
                      </span>
                      <h4 className="font-sans font-extrabold text-lg text-white">
                        {city.name}
                      </h4>
                      <p className="text-[11px] text-gray-300 line-clamp-2 leading-relaxed">
                        {city.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* Explore by Vibe Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-gray-150/80 dark:border-slate-800/60">
              <div className="text-center space-y-2 mb-10">
                <p className="text-xs font-mono font-bold tracking-widest text-orange-600 dark:text-orange-400 uppercase">
                  Discover by Vibe
                </p>
                <h2 className="font-serif font-extrabold text-2xl sm:text-3xl text-gray-900 dark:text-white mt-1">
                  Explore India by Category
                </h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { name: "Beaches & Islands", query: "Goa", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600", desc: "Tropical shorelines, sand beaches & nightlife", vibe: "beaches" },
                  { name: "Scenic Hills & Valleys", query: "Srinagar", image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=600", desc: "Misty mountain trails, lakes & fresh weather", vibe: "hills" },
                  { name: "Spiritual Heritage", query: "Varanasi", image: "https://images.unsplash.com/photo-1561361513-2d000a50f0db?w=600", desc: "Sacred temple steps, rituals & inner peace", vibe: "temples" },
                  { name: "Forts & Palaces", query: "Jaipur", image: "https://images.unsplash.com/photo-1477584322902-471851bb1a83?w=600", desc: "Royal mahals, medieval fortresses & history", vibe: "palaces" }
                ].map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      if (item.vibe === "beaches") {
                        setFilters(prev => ({ ...prev, type: "all" }));
                      } else if (item.vibe === "temples") {
                        setFilters(prev => ({ ...prev, type: "temple" }));
                      } else if (item.vibe === "hills") {
                        setFilters(prev => ({ ...prev, type: "all" }));
                      } else if (item.vibe === "palaces") {
                        setFilters(prev => ({ ...prev, type: "attraction" }));
                      }
                      handleSearchCity(item.query);
                    }}
                    className="group relative h-60 rounded-2xl overflow-hidden shadow-md text-left premium-card-hover cursor-pointer border border-gray-100 dark:border-slate-800"
                  >
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                      <h4 className="font-sans font-extrabold text-sm text-white">{item.name}</h4>
                      <p className="text-[10px] text-gray-300 leading-snug">{item.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* Famous Luxury Hotels Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-gray-150/80 dark:border-slate-800/60 bg-gray-50/50 dark:bg-slate-905/10">
              <div className="text-center space-y-2 mb-10">
                <p className="text-xs font-mono font-bold tracking-widest text-[#00AA6C] uppercase">
                  World-Renowned Stays
                </p>
                <h2 className="font-serif font-extrabold text-2xl sm:text-3xl text-gray-900 dark:text-white mt-1">
                  Famous Hotels & Royal Palaces
                </h2>
              </div>

              {famousHotels.length === 0 ? (
                <div className="text-center py-10 text-xs text-gray-400">Loading famous hotels...</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {famousHotels.map((hotel) => (
                    <div 
                      key={hotel.id} 
                      className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-gray-200/60 dark:border-slate-800/60 shadow-sm flex flex-col justify-between"
                    >
                      <div className="relative h-56 overflow-hidden">
                        <img 
                          src={hotel.photos[0]} 
                          alt={hotel.name} 
                          onError={handleImageError}
                          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                        />
                        <span className="absolute top-4 right-4 px-2.5 py-1 text-[9px] font-mono tracking-wider font-extrabold bg-[#070235]/90 text-orange-400 rounded-lg uppercase backdrop-blur-sm">
                          {hotel.type}
                        </span>
                        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-white">
                          <span className="text-[10px] font-mono font-bold bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-orange-500" /> {hotel.city}
                          </span>
                        </div>
                      </div>

                      <div className="p-5 flex-grow flex flex-col justify-between space-y-4 text-left">
                        <div className="space-y-2">
                          <h4 className="font-serif font-extrabold text-base text-gray-900 dark:text-white line-clamp-1 font-bold">
                            {hotel.name}
                          </h4>
                          <div className="flex items-center gap-1.5">
                            {renderTripAdvisorBubbles(hotel.rating)}
                            <span className="text-[10px] font-bold text-gray-900 dark:text-white">{hotel.rating}</span>
                            <span className="text-[9px] text-gray-400">({hotel.reviewCount} logs)</span>
                          </div>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                            {hotel.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-800">
                          <div>
                            <span className="text-[9px] text-gray-400 uppercase font-mono block">Estimated Rate</span>
                            <span className="text-xs font-black text-green-600 dark:text-[#34E0A1]">
                              {hotel.priceRange ? hotel.priceRange.split(" per ")[0] : "₹₹₹₹"}
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedPlace(hotel);
                              setSelectedCity({
                                name: hotel.city,
                                state: hotel.state,
                                description: "",
                                image: "",
                                lat: hotel.coordinates.lat,
                                lng: hotel.coordinates.lng
                              });
                              setActiveView("details");
                            }}
                            className="px-4 py-2 rounded-xl bg-[#00AA6C] hover:bg-[#008f5a] active:scale-97 text-white font-bold text-[10px] font-sans tracking-wide uppercase transition-all cursor-pointer shadow-sm"
                          >
                            Reserve Stay
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Travel Tips Section */}
            <section className="bg-gray-50 dark:bg-slate-900/40 py-16 border-y border-gray-100 dark:border-slate-900">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                <div className="text-center space-y-2">
                  <p className="text-xs font-mono font-bold tracking-widest text-orange-600 dark:text-orange-400 uppercase">
                    Insider Knowledge
                  </p>
                  <h2 className="font-serif font-extrabold text-2xl sm:text-3xl text-gray-900 dark:text-white">
                    Indian Travel Guide & Local Food Tips
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {travelTips.map((tip) => (
                    <div 
                      key={tip.id} 
                      className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-slate-700/60 p-5 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <img 
                          src={tip.image} 
                          alt={tip.title} 
                          onError={handleImageError}
                          className="w-full h-40 object-cover rounded-xl"
                        />
                        <span className="inline-block px-2 py-0.5 text-[9px] font-mono tracking-wider font-bold uppercase text-indigo-600 dark:text-orange-400 bg-indigo-50 dark:bg-orange-950/30 rounded">
                          {tip.category}
                        </span>
                        <h4 className="font-sans font-bold text-sm text-gray-900 dark:text-white">
                          {tip.title}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-sans">
                          {tip.text}
                        </p>
                      </div>
                      <button 
                        onClick={() => handleNavigate("tips")}
                        className="text-left text-xs font-bold font-sans text-indigo-600 dark:text-orange-400 hover:underline mt-4 flex items-center gap-1 cursor-pointer"
                      >
                        Read Full Guide &rarr;
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Customer Reviews Simulation */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
              <div className="text-center space-y-2">
                <p className="text-xs font-mono font-bold tracking-widest text-orange-600 dark:text-orange-400 uppercase">
                  Community Voices
                </p>
                <h2 className="font-serif font-extrabold text-2xl sm:text-3xl text-gray-900 dark:text-white">
                  What Global Travelers Say
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700/60 space-y-4">
                  <div className="flex items-center gap-1">
                    {renderTripAdvisorBubbles(5)}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 italic font-sans leading-relaxed">
                    "Searching Bangalore on ExploreIndia yielded incredible results. The local cafes and heritage resorts returned were exactly where we ended up. Authentic real-time data enrichment!"
                  </p>
                  <div className="flex items-center gap-2">
                    <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100" onError={handleAvatarError} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <h5 className="font-bold text-xs text-gray-900 dark:text-white">Clara Jenkins</h5>
                      <span className="text-[10px] text-gray-400">UK Traveler</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700/60 space-y-4">
                  <div className="flex items-center gap-1">
                    {renderTripAdvisorBubbles(5)}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 italic font-sans leading-relaxed">
                    "I searched my small native village in Andhra Pradesh, and the platform accurately resolved coordinates using OpenStreetMap and synthesized local dhabas with beautiful descriptions. Truly spectacular!"
                  </p>
                  <div className="flex items-center gap-2">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" onError={handleAvatarError} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <h5 className="font-bold text-xs text-gray-900 dark:text-white">Dinesh Kumar</h5>
                      <span className="text-[10px] text-gray-400">Anantapur, AP</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700/60 space-y-4">
                  <div className="flex items-center gap-1">
                    {renderTripAdvisorBubbles(4.5)}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 italic font-sans leading-relaxed">
                    "An essential companion tool for luxury travelers in India. The rating categorization and direct links to maps routing saved us hours of scrolling."
                  </p>
                  <div className="flex items-center gap-2">
                    <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100" onError={handleAvatarError} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <h5 className="font-bold text-xs text-gray-900 dark:text-white">Siddharth Sen</h5>
                      <span className="text-[10px] text-gray-400">Luxury Blogger</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ======================================================== */}
        {/* SEARCH VIEW (SPLIT GRID WITH MAP)                        */}
        {/* ======================================================== */}
        {activeView === "search" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col lg:flex-row gap-6 animate-fade-in">
            
            {/* Left Hand: Search Controls & Places Grid */}
            <div className="w-full lg:w-3/5 space-y-6">
              
              {/* Dynamic search bar */}
              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-200/60 dark:border-slate-800 shadow-sm flex flex-col gap-3">
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSearchCity(searchQuery);
                  }}
                  className="flex gap-2"
                >
                  <div className="flex-grow relative flex items-center bg-gray-50 dark:bg-slate-800 rounded-xl px-3 border border-gray-100 dark:border-slate-700">
                    <MapPin className="w-5 h-5 text-gray-400 shrink-0" />
                    <input 
                      id="search-input"
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Enter city or location to discover..."
                      className="w-full bg-transparent border-none text-xs text-gray-900 dark:text-white focus:outline-none p-2.5"
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={isSearching}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-900 to-indigo-800 hover:opacity-90 active:scale-98 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    {isSearching ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Discover"}
                  </button>
                </form>

                {selectedCity && (
                  <div className="relative h-44 rounded-3xl overflow-hidden shadow-md border border-gray-150/80 dark:border-slate-800 animate-fade-in">
                    <img 
                      src={selectedCity.image || "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1600"} 
                      alt={selectedCity.name}
                      className="absolute inset-0 w-full h-full object-cover" 
                      onError={handleImageError}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4 text-white flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                      <div className="space-y-1 text-left">
                        <p className="text-[9px] font-mono tracking-widest text-orange-400 uppercase font-bold flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-orange-400" /> {selectedCity.state}
                        </p>
                        <h2 className="font-serif font-extrabold text-xl sm:text-2xl text-white">
                          Discover {selectedCity.name}
                        </h2>
                        {selectedCity.description && (
                          <p className="text-[10px] text-gray-300 line-clamp-1 leading-relaxed max-w-sm">
                            {selectedCity.description}
                          </p>
                        )}
                      </div>
                      <div className="px-2 py-1 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10 text-[9px] text-gray-300 font-mono text-left shrink-0">
                        Coords: {selectedCity.lat.toFixed(4)}, {selectedCity.lng.toFixed(4)}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Filters Pane */}
              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-200/60 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-2">
                  <span className="flex items-center gap-1.5 font-bold text-xs text-[#070235] dark:text-white">
                    <Filter className="w-4 h-4 text-orange-500" /> Filter Discovery Results
                  </span>
                  <button 
                    onClick={() => setFilters({
                      type: "all", priceLevel: "all", rating: "all", amenities: [], vegOnly: false, nonVegOnly: false, openNow: false
                    })}
                    className="text-[10px] text-indigo-600 dark:text-orange-400 font-bold hover:underline"
                  >
                    Reset All
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-xs">
                  {/* Category Type */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Category</label>
                    <select
                      value={filters.type}
                      onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                      className="p-2 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-xs text-gray-700 dark:text-gray-200"
                    >
                      <option value="all">All Places</option>
                      <option value="hotel">Hotels</option>
                      <option value="restaurant">Restaurants</option>
                      <option value="resort">Resorts</option>
                      <option value="attraction">Attractions</option>
                      <option value="cafe">Cafes</option>
                      <option value="temple">Temples</option>
                    </select>
                  </div>

                  {/* Price Tier */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Price Range</label>
                    <select
                      value={filters.priceLevel}
                      onChange={(e) => setFilters(prev => ({ ...prev, priceLevel: e.target.value }))}
                      className="p-2 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-xs text-gray-700 dark:text-gray-200"
                    >
                      <option value="all">Any Price</option>
                      <option value="1">₹ (Budget)</option>
                      <option value="2">₹₹ (Moderate)</option>
                      <option value="3">₹₹₹ (Premium)</option>
                      <option value="4">₹₹₹₹ (Luxury)</option>
                    </select>
                  </div>

                  {/* Rating */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Minimum Rating</label>
                    <select
                      value={filters.rating}
                      onChange={(e) => setFilters(prev => ({ ...prev, rating: e.target.value }))}
                      className="p-2 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-xs text-gray-700 dark:text-gray-200"
                    >
                      <option value="all">Any Rating</option>
                      <option value="4">★ 4.0 & Up</option>
                      <option value="4.5">★ 4.5 & Up</option>
                      <option value="4.7">★ 4.7 & Up</option>
                    </select>
                  </div>

                  {/* Veg friendly */}
                  <div className="flex flex-col justify-end pt-4">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-700 dark:text-gray-200">
                      <input 
                        type="checkbox" 
                        checked={filters.vegOnly}
                        onChange={(e) => setFilters(prev => ({ ...prev, vegOnly: e.target.checked }))}
                        className="rounded text-green-600 focus:ring-green-500 h-4 w-4"
                      />
                      🥬 Pure Veg spots
                    </label>
                  </div>
                </div>

                {/* Amenities checklist */}
                <div className="space-y-1.5 pt-2 border-t border-gray-100 dark:border-slate-800">
                  <label className="text-[10px] font-bold text-gray-400 uppercase block">Facilities & Amenities</label>
                  <div className="flex flex-wrap gap-2">
                    {["Swimming Pool", "WiFi", "Parking", "AC", "Breakfast", "Spa", "Pet Friendly"].map((item) => {
                      const isSelected = filters.amenities.includes(item);
                      return (
                        <button
                          key={item}
                          onClick={() => handleAmenityToggle(item)}
                          className={`px-3 py-1.5 rounded-full text-[10px] font-medium font-sans border transition-all cursor-pointer ${
                            isSelected 
                              ? "bg-indigo-950 text-white border-indigo-950 dark:bg-orange-500 dark:border-orange-500"
                              : "bg-gray-50 border-gray-200 text-gray-600 dark:bg-slate-800 dark:border-slate-700 dark:text-gray-300 hover:bg-gray-100"
                          }`}
                        >
                          {item}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Discovery Places List Grid */}
              <div className="space-y-4">
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-mono tracking-wider font-bold">
                      FOUND {filteredPlaces.length} PREMIUM PLACES
                    </p>
                  </div>
                  
                  {/* Premium Category Filter Tabs */}
                  <div className="flex flex-wrap gap-2 border-b border-gray-200/50 dark:border-slate-800/80 pb-3">
                    <button
                      onClick={() => setResultsTab("all")}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-bold font-sans tracking-wide uppercase transition-all cursor-pointer ${
                        resultsTab === "all"
                          ? "bg-[#070235] dark:bg-orange-500 text-white shadow-sm scale-102"
                          : "bg-white dark:bg-slate-900 text-gray-500 hover:text-gray-900 dark:hover:text-white border border-gray-200/60 dark:border-slate-800"
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" /> All ({places.length})
                    </button>
                    <button
                      onClick={() => setResultsTab("tourism")}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-bold font-sans tracking-wide uppercase transition-all cursor-pointer ${
                        resultsTab === "tourism"
                          ? "bg-[#070235] dark:bg-orange-500 text-white shadow-sm scale-102"
                          : "bg-white dark:bg-slate-900 text-gray-500 hover:text-gray-900 dark:hover:text-white border border-gray-200/60 dark:border-slate-800"
                      }`}
                    >
                      <Compass className="w-3.5 h-3.5" /> Tourism Places ({places.filter(p => p.type === "attraction").length})
                    </button>
                    <button
                      onClick={() => setResultsTab("stays")}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-bold font-sans tracking-wide uppercase transition-all cursor-pointer ${
                        resultsTab === "stays"
                          ? "bg-[#070235] dark:bg-orange-500 text-white shadow-sm scale-102"
                          : "bg-white dark:bg-slate-900 text-gray-500 hover:text-gray-900 dark:hover:text-white border border-gray-200/60 dark:border-slate-800"
                      }`}
                    >
                      <Hotel className="w-3.5 h-3.5" /> Stays & Resorts ({places.filter(p => p.type === "hotel" || p.type === "resort").length})
                    </button>
                    <button
                      onClick={() => setResultsTab("food")}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-bold font-sans tracking-wide uppercase transition-all cursor-pointer ${
                        resultsTab === "food"
                          ? "bg-[#070235] dark:bg-orange-500 text-white shadow-sm scale-102"
                          : "bg-white dark:bg-slate-900 text-gray-500 hover:text-gray-900 dark:hover:text-white border border-gray-200/60 dark:border-slate-800"
                      }`}
                    >
                      <Utensils className="w-3.5 h-3.5" /> Eats & Cafes ({places.filter(p => p.type === "restaurant" || p.type === "cafe").length})
                    </button>
                    <button
                      onClick={() => setResultsTab("temples")}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-bold font-sans tracking-wide uppercase transition-all cursor-pointer ${
                        resultsTab === "temples"
                          ? "bg-[#070235] dark:bg-orange-500 text-white shadow-sm scale-102"
                          : "bg-white dark:bg-slate-900 text-gray-500 hover:text-gray-900 dark:hover:text-white border border-gray-200/60 dark:border-slate-800"
                      }`}
                    >
                      <span className="text-orange-500 text-xs">🛕</span> Temples ({places.filter(p => p.type === "temple").length})
                    </button>
                  </div>
                </div>

                {isSearching ? (
                  // Loading skeletons
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map(idx => (
                      <div key={idx} className="bg-white dark:bg-slate-900 rounded-2xl h-80 animate-pulse border border-gray-100 dark:border-slate-800" />
                    ))}
                  </div>
                ) : filteredPlaces.length === 0 ? (
                  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200/60 dark:border-slate-800 p-12 text-center space-y-4">
                    <HelpCircle className="w-12 h-12 text-orange-400 mx-auto" />
                    <h3 className="font-serif font-extrabold text-lg text-gray-900 dark:text-white">No Matching Places Found</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto leading-relaxed">
                      We searched coordinates but nothing matches the active filters. Try resetting the pricing, ratings, or amenity filters.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredPlaces.map((place) => {
                      const isFav = (user?.favorites || []).includes(place.id);
                      return (
                        <div
                          key={place.id}
                          onClick={() => {
                            setSelectedPlace(place);
                            setActiveView("details");
                          }}
                          className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-gray-200/60 dark:border-slate-800/80 p-3 text-left flex flex-col justify-between cursor-pointer premium-card-hover group relative"
                        >
                          {/* Favorite absolute tag */}
                          <button
                            onClick={(e) => handleToggleFavorite(place.id, e)}
                            className="absolute top-5 right-5 z-20 p-2 rounded-xl bg-white/90 dark:bg-slate-800/95 shadow-md hover:scale-110 active:scale-95 transition-all text-red-500"
                            title={isFav ? "Remove from Favorites" : "Save to Favorites"}
                          >
                            <Heart className={`w-4 h-4 ${isFav ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
                          </button>

                          <div className="space-y-2.5">
                            <div className="relative h-44 rounded-xl overflow-hidden">
                              <img 
                                src={place.photos[0]} 
                                alt={place.name} 
                                onError={handleImageError}
                                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                              />
                              {/* Price bracket tag */}
                              <span className="absolute bottom-3 left-3 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white font-mono text-[9px] font-bold tracking-wider">
                                {"₹".repeat(place.priceLevel)} &bull; {place.priceRange || "Reasonable"}
                              </span>
                              {/* Place type absolute badge */}
                              <span className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-indigo-950/80 backdrop-blur-md text-white font-bold text-[8px] tracking-wider uppercase">
                                {place.type}
                              </span>
                            </div>

                            <div className="px-1.5 space-y-1">
                              <div className="flex justify-between items-start gap-2">
                                <h4 className="font-sans font-extrabold text-sm text-gray-900 dark:text-white line-clamp-1 leading-snug group-hover:text-orange-500 transition-colors">
                                  {place.name}
                                </h4>
                              </div>

                              <div className="flex items-center gap-2">
                                {renderTripAdvisorBubbles(place.rating)}
                                <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium mt-0.5">
                                  {place.rating}
                                </span>
                                <span className="text-[10px] text-gray-400 mt-0.5">
                                  ({place.reviewCount})
                                </span>
                              </div>

                              <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-normal line-clamp-2">
                                {place.description}
                              </p>
                            </div>
                          </div>

                          <div className="px-1.5 pt-3 mt-3 border-t border-gray-100 dark:border-slate-800 flex flex-wrap gap-1.5">
                            {place.facilities.slice(0, 3).map(f => (
                              <span key={f} className="text-[9px] font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-slate-800 px-2 py-0.5 rounded border border-gray-100 dark:border-slate-700">
                                {f}
                              </span>
                            ))}
                            {place.facilities.length > 3 && (
                              <span className="text-[9px] text-gray-400 font-medium px-1.5 py-0.5">
                                +{place.facilities.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Right Hand Side: Interactive Map */}
            <div className="w-full lg:w-2/5 h-[calc(100vh-120px)] lg:sticky lg:top-24">
              <ExploreMap 
                places={filteredPlaces}
                selectedPlace={selectedPlace}
                onPlaceSelect={(place) => {
                  setSelectedPlace(place);
                }}
                onPlaceDetailsNavigate={(place) => {
                  setSelectedPlace(place);
                  setActiveView("details");
                }}
                center={selectedCity ? { lat: selectedCity.lat, lng: selectedCity.lng } : { lat: 20.5937, lng: 78.9629 }}
                zoom={12}
                showDirections={showDirectionsOnMap}
                theme={theme}
              />
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* DETAILS PAGE VIEW                                        */}
        {/* ======================================================== */}
        {activeView === "details" && selectedPlace && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
            {/* Navigation back and save button */}
            <div className="flex justify-between items-center">
              <button
                onClick={() => setActiveView("search")}
                className="flex items-center gap-1 text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-orange-500 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Discovery List
              </button>
              
              <button
                onClick={() => handleToggleFavorite(selectedPlace.id)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm text-xs font-bold font-sans cursor-pointer hover:bg-gray-50"
              >
                <Heart className={`w-4 h-4 ${(user?.favorites || []).includes(selectedPlace.id) ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
                {(user?.favorites || []).includes(selectedPlace.id) ? "Saved in Favorites" : "Save to Wishlist"}
              </button>
            </div>

            {/* Hero Gallery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Featured Main Image */}
              <div className="md:col-span-2 relative h-[360px] rounded-3xl overflow-hidden shadow-lg border border-gray-100 dark:border-slate-800 group">
                <img 
                  src={selectedPlace.photos[activePhotoIndex] || selectedPlace.photos[0]} 
                  alt={selectedPlace.name} 
                  onError={handleImageError} 
                  className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80 pointer-events-none"></div>
                {/* Large label overlay for premium aesthetics */}
                <div className="absolute bottom-6 left-6 text-white text-left pointer-events-none">
                  <span className="text-[9px] font-mono tracking-widest text-orange-400 uppercase font-extrabold">
                    FEATURED GALLERY PHOTO
                  </span>
                  <h3 className="font-serif text-lg font-black mt-1 drop-shadow-sm">{selectedPlace.name}</h3>
                </div>
              </div>
              
              {/* Sidebar Tray: Thumbnails Grid & Badges */}
              <div className="flex flex-col gap-4 h-[360px]">
                {/* Thumbnail tray */}
                <div className="bg-gray-50 dark:bg-slate-900/40 p-4 rounded-3xl border border-gray-100 dark:border-slate-800/80 flex flex-col justify-between flex-1">
                  <span className="text-[9px] font-mono font-bold tracking-widest text-gray-400 dark:text-slate-400 uppercase text-left block mb-2">
                    EXPLORE PHOTOS ({selectedPlace.photos.length})
                  </span>
                  <div className="grid grid-cols-2 gap-2.5">
                    {selectedPlace.photos.map((photo, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActivePhotoIndex(idx)}
                        className={`h-16 rounded-xl overflow-hidden border-2 cursor-pointer transition-all duration-300 relative group ${
                          activePhotoIndex === idx 
                            ? "border-orange-500 scale-102 shadow-md ring-2 ring-orange-500/20" 
                            : "border-transparent hover:border-gray-300 dark:hover:border-slate-600 hover:scale-102"
                        }`}
                      >
                        <img 
                          src={photo} 
                          onError={handleImageError} 
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
                        />
                        <div className={`absolute inset-0 bg-black/10 transition-opacity duration-300 ${activePhotoIndex === idx ? "opacity-0" : "opacity-30 group-hover:opacity-10"}`}></div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Badge assured card */}
                <div className="relative rounded-3xl overflow-hidden shadow-sm bg-gradient-to-tr from-indigo-950 via-slate-900 to-indigo-950 text-white flex flex-col items-center justify-center p-6 text-center h-[140px] border border-slate-800">
                  <Sparkles className="w-6 h-6 text-orange-400 mb-1.5 animate-bounce" />
                  <span className="text-[9px] font-mono tracking-widest text-orange-400 uppercase font-bold">
                    HERITAGE ASSURED
                  </span>
                  <h4 className="font-serif font-extrabold text-xs mt-1 text-slate-200">Verified Stay & Local Flavors</h4>
                </div>
              </div>
            </div>

            {/* Layout Split: Detail content & quick action box */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              
              {/* Left 2 Cols: descriptions, menu highlights, rooms, reviews */}
              <div className="md:col-span-2 space-y-8 text-left">
                <div className="space-y-2">
                  <span className="px-2.5 py-1 text-[10px] font-mono tracking-wider font-extrabold bg-indigo-950 text-orange-400 rounded-lg uppercase">
                    {selectedPlace.type}
                  </span>
                  <h1 className="font-serif font-extrabold text-3xl text-gray-900 dark:text-white">
                    {selectedPlace.name}
                  </h1>
                  <p className="text-xs text-gray-400 flex items-center gap-1 font-sans">
                    <MapPin className="w-3.5 h-3.5 text-orange-500" /> {selectedPlace.address}, {selectedPlace.city}, {selectedPlace.state}
                  </p>
                </div>

                <div className="flex items-center gap-6 py-4 border-y border-gray-100 dark:border-slate-800 text-xs">
                  <div>
                    <span className="text-gray-400 block uppercase font-mono text-[9px] font-bold">Overall Rating</span>
                    <div className="mt-1 flex items-center gap-1.5">
                      {renderTripAdvisorBubbles(selectedPlace.rating)}
                      <span className="font-bold text-sm text-gray-900 dark:text-white">
                        {selectedPlace.rating}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-400 block uppercase font-mono text-[9px] font-bold">Reviews</span>
                    <span className="font-bold text-base text-gray-800 dark:text-white mt-1">
                      {selectedPlace.reviewCount} verified logs
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block uppercase font-mono text-[9px] font-bold">Price Range</span>
                    <span className="font-bold text-base text-green-600 mt-1">
                      {selectedPlace.priceRange || "₹".repeat(selectedPlace.priceLevel)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-white">About the Location</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-sans font-normal">
                    {selectedPlace.description}
                  </p>
                </div>

                {/* Restaurant Menu Highlights */}
                {selectedPlace.type === "restaurant" && selectedPlace.menuHighlights && (
                  <div className="p-5 rounded-2xl bg-orange-500/5 border border-orange-500/10 space-y-3">
                    <h4 className="font-serif font-bold text-sm text-[#070235] dark:text-orange-400 flex items-center gap-1.5">
                      <Utensils className="w-4 h-4 text-orange-500" /> Royal Menu Highlights
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-700 dark:text-gray-300 font-sans">
                      {selectedPlace.menuHighlights.map(h => (
                        <div key={h} className="flex items-center gap-1.5">
                          <Check className="w-4 h-4 text-green-500" /> {h}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Facilities & Amenities */}
                <div className="space-y-3">
                  <h3 className="font-serif font-bold text-base text-gray-900 dark:text-white">Facilities & Comforts Included</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-gray-600 dark:text-gray-300 font-sans">
                    {selectedPlace.facilities.map(f => (
                      <span key={f} className="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700/60">
                        <Check className="w-4 h-4 text-orange-500 shrink-0" /> {f}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Interactive Reviews Section */}
                <div className="space-y-6 pt-6 border-t border-gray-100 dark:border-slate-800">
                  <h3 className="font-serif font-extrabold text-lg text-gray-900 dark:text-white">
                    Verified Guest Logbook
                  </h3>

                  {/* Reviews Form */}
                  <form onSubmit={handleSubmitReview} className="space-y-3 bg-gray-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-gray-100 dark:border-slate-800">
                    <h4 className="font-sans font-bold text-xs text-gray-800 dark:text-white">Share Your Heritage Experience</h4>
                    
                    <div className="flex gap-2 items-center text-xs">
                      <span className="text-gray-400 uppercase font-bold text-[10px]">Your Rating:</span>
                      <div className="flex gap-1.5 items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setNewReviewRating(star)}
                            className="hover:scale-110 active:scale-95 transition-all p-0.5 shrink-0"
                            title={`${star} bubbles`}
                          >
                            <div className={`w-5 h-5 rounded-full border-2 border-[#00AA6C] flex items-center justify-center transition-all ${
                              star <= newReviewRating ? "bg-[#00AA6C]" : "bg-transparent"
                            }`} />
                          </button>
                        ))}
                        <span className="text-xs text-gray-500 font-bold ml-1">({newReviewRating} / 5)</span>
                      </div>
                    </div>

                    <textarea
                      required
                      rows={3}
                      value={newReviewText}
                      onChange={(e) => setNewReviewText(e.target.value)}
                      placeholder="Write your detailed experience about service, food taste, cleanliness or rooms..."
                      className="w-full p-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-gray-900 dark:text-white focus:outline-none"
                    />

                    <div className="flex justify-between items-center">
                      <p className="text-[10px] text-gray-400">
                        *Reviews are checked by administrators before visible to the public.
                      </p>
                      {!user ? (
                        <button
                          type="button"
                          onClick={() => setAuthModal({ isOpen: true, mode: "login" })}
                          className="px-5 py-2 rounded-xl bg-indigo-950 dark:bg-orange-500 text-white text-xs font-bold font-sans hover:opacity-90 active:scale-98 transition-all cursor-pointer"
                        >
                          Sign In to Review
                        </button>
                      ) : (
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-xl bg-indigo-950 dark:bg-orange-500 text-white text-xs font-bold font-sans hover:opacity-90 active:scale-98 transition-all cursor-pointer"
                        >
                          Publish Review
                        </button>
                      )}
                    </div>

                    {reviewMessage && (
                      <p className="text-xs text-green-600 font-medium flex items-center gap-1 pt-1.5">
                        <CheckCircle className="w-4 h-4" /> {reviewMessage}
                      </p>
                    )}
                  </form>

                  {/* Real reviews listed */}
                  <div className="space-y-4">
                    {selectedPlace.reviews && selectedPlace.reviews.length === 0 ? (
                      <p className="text-xs text-gray-400 italic">No public reviews logged for this location yet. Be the first!</p>
                    ) : (
                      selectedPlace.reviews?.map((rev) => (
                        <div key={rev.id} className="p-4 rounded-xl border border-gray-100 dark:border-slate-800 space-y-2">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#070235] to-indigo-900 dark:from-indigo-600 dark:to-indigo-500 flex items-center justify-center text-white text-[10px] font-black shadow-sm shrink-0">
                                {(rev.userName || "U").charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <h5 className="font-bold text-xs text-gray-900 dark:text-white">{rev.userName}</h5>
                                <span className="text-[9px] text-gray-400 font-mono">{rev.date}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              {renderTripAdvisorBubbles(rev.rating)}
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed pl-10 font-sans">
                            {rev.text}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Right Side: contact details + directions triggers */}
              <div className="space-y-6">
                
                {/* TripAdvisor Booking Widget */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-lg space-y-4 text-left">
                  <h4 className="font-sans font-extrabold text-sm text-gray-900 dark:text-white pb-2 border-b border-gray-100 dark:border-slate-800">
                    {selectedPlace.type === "hotel" || selectedPlace.type === "resort" ? "Book Your Stay" : 
                     selectedPlace.type === "restaurant" || selectedPlace.type === "cafe" ? "Reserve a Table" : 
                     "Book Tickets"}
                  </h4>
                  
                  {bookingSuccess ? (
                    <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 text-center space-y-2.5 animate-fade-in">
                      <CheckCircle className="w-8 h-8 text-[#00AA6C] mx-auto" />
                      <h5 className="font-bold text-xs text-gray-900 dark:text-white">Reservation Request Sent!</h5>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed">
                        Your booking request at <span className="font-bold">{selectedPlace.name}</span> has been logged under your account. Concierge will confirm shortly.
                      </p>
                      <button 
                        onClick={() => setBookingSuccess(false)}
                        className="text-[10px] font-bold text-[#00AA6C] hover:underline block mx-auto pt-1 cursor-pointer"
                      >
                        Book another date
                      </button>
                    </div>
                  ) : (
                    <form 
                      onSubmit={handleCreateBooking}
                      className="space-y-3.5 text-xs text-gray-700 dark:text-gray-300 font-sans"
                    >
                      <div>
                        <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">
                          {selectedPlace.type === "hotel" || selectedPlace.type === "resort" ? "Check-In Date" : "Date of Visit"}
                        </label>
                        <input 
                          type="date"
                          required
                          min={new Date().toISOString().split("T")[0]}
                          value={bookingDate}
                          onChange={(e) => setBookingDate(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-transparent text-xs text-gray-900 dark:text-white focus:outline-none"
                        />
                      </div>

                      {(selectedPlace.type === "hotel" || selectedPlace.type === "resort") && (
                        <div>
                          <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Check-Out Date</label>
                          <input 
                            type="date"
                            required
                            min={bookingDate || new Date().toISOString().split("T")[0]}
                            value={bookingDateOut}
                            onChange={(e) => setBookingDateOut(e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-transparent text-xs text-gray-900 dark:text-white focus:outline-none"
                          />
                        </div>
                      )}

                      {(selectedPlace.type === "restaurant" || selectedPlace.type === "cafe") && (
                        <div>
                          <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Preferred Time</label>
                          <select 
                            value={bookingTime}
                            onChange={(e) => setBookingTime(e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-gray-900 dark:text-white focus:outline-none"
                          >
                            <option>12:30 PM (Lunch)</option>
                            <option>1:30 PM (Lunch)</option>
                            <option>7:00 PM (Dinner)</option>
                            <option>8:00 PM (Dinner)</option>
                            <option>9:00 PM (Dinner)</option>
                          </select>
                        </div>
                      )}

                      <div>
                        <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">
                          {selectedPlace.type === "attraction" ? "Number of Tickets" : "Number of Guests"}
                        </label>
                        <select 
                          value={bookingGuests}
                          onChange={(e) => setBookingGuests(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-gray-900 dark:text-white focus:outline-none"
                        >
                          <option>1 person</option>
                          <option>2 people</option>
                          <option>3 people</option>
                          <option>4 people</option>
                          <option>5+ people</option>
                        </select>
                      </div>

                      {!user ? (
                        <button
                          type="button"
                          onClick={() => setAuthModal({ isOpen: true, mode: "login" })}
                          className="w-full py-3 rounded-full bg-[#FFC000] hover:bg-[#e6ad00] active:scale-98 text-black font-black text-xs uppercase font-sans tracking-wide shadow-md transition-all cursor-pointer text-center block border border-[#FFC000]"
                        >
                          Sign In to Book
                        </button>
                      ) : (
                        <button
                          type="submit"
                          className="w-full py-3 rounded-full bg-[#FFC000] hover:bg-[#e6ad00] active:scale-98 text-black font-black text-xs uppercase font-sans tracking-wide shadow-md transition-all cursor-pointer text-center block border border-[#FFC000]"
                        >
                          Check Availability & Book
                        </button>
                      )}
                    </form>
                  )}

                  {/* Add to Trip Itinerary button */}
                  <div className="border-t border-gray-100 dark:border-slate-800/80 pt-4 mt-4 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        if (!user) {
                          setAuthModal({ isOpen: true, mode: "login" });
                        } else {
                          setShowAddToTripModal(true);
                        }
                      }}
                      className="w-full py-2.5 rounded-full bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-800 dark:text-white border border-gray-200 dark:border-slate-700 font-extrabold text-xs uppercase font-sans tracking-wide shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Calendar className="w-4 h-4 text-[#00AA6C]" /> Add to Itinerary
                    </button>
                  </div>
                </div>

                {/* Contact concierge box */}
                <div className="bg-[#004F32] text-white p-6 rounded-2xl border border-white/5 shadow-md space-y-4 text-left">
                  <h4 className="font-serif font-extrabold text-sm text-[#34E0A1]">Traveler Concierge Details</h4>
                  <p className="text-[11px] text-emerald-100 leading-relaxed font-sans">
                    Direct details registered with tourism authority boards:
                  </p>
                  
                  <div className="space-y-3.5 text-xs font-sans">
                    {selectedPlace.phone && (
                      <div className="flex items-center gap-2.5">
                        <Phone className="w-4 h-4 text-[#34E0A1]" />
                        <span>{selectedPlace.phone}</span>
                      </div>
                    )}
                    {selectedPlace.website && (
                      <div className="flex items-center gap-2.5">
                        <Globe className="w-4 h-4 text-[#34E0A1]" />
                        <a href={selectedPlace.website} target="_blank" rel="noreferrer" className="text-[#34E0A1] hover:underline flex items-center gap-1.5 truncate">
                          Visit Official Website <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                    {selectedPlace.openHours && (
                      <div className="flex items-center gap-2.5">
                        <Calendar className="w-4 h-4 text-[#34E0A1]" />
                        <span>Hours: {selectedPlace.openHours}</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setShowDirectionsOnMap(true);
                      setActiveView("search");
                    }}
                    className="w-full py-2.5 rounded-full bg-white hover:bg-gray-100 text-[#004F32] font-extrabold text-xs uppercase font-sans tracking-wider shadow-md transition-all cursor-pointer text-center block border border-transparent"
                  >
                    Locate on City Map
                  </button>
                </div>

                {/* Direct Static Map Reference Card */}
                <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-gray-200/60 dark:border-slate-800 shadow-md space-y-4 text-left">
                  <h4 className="font-sans font-bold text-xs text-gray-800 dark:text-white flex items-center gap-1.5 pb-2 border-b border-gray-100 dark:border-slate-800/80">
                    <MapIcon className="w-4 h-4 text-orange-500" /> Exact Location & Coordinates
                  </h4>
                  
                  <div className="h-32 rounded-2xl overflow-hidden relative border border-gray-100 dark:border-slate-800 shadow-inner">
                    {/* Tiny Leaflet Map placeholder or static style representation */}
                    <div className="absolute inset-0 bg-[url('https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/12/1154/2288.png')] bg-cover opacity-60"></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-indigo-950/10 text-center relative z-10 text-white">
                      <MapPin className="w-8 h-8 text-red-500 drop-shadow-md animate-bounce" />
                    </div>
                  </div>

                  <div className="space-y-2 text-xs font-sans">
                    <div className="flex justify-between items-center text-[10px] text-gray-400 dark:text-slate-400 font-mono">
                      <span>LATITUDE:</span>
                      <span className="font-bold text-gray-700 dark:text-slate-200">{selectedPlace.coordinates.lat.toFixed(6)}° N</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-gray-400 dark:text-slate-400 font-mono">
                      <span>LONGITUDE:</span>
                      <span className="font-bold text-gray-700 dark:text-slate-200">{selectedPlace.coordinates.lng.toFixed(6)}° E</span>
                    </div>
                    <div className="pt-2 text-[11px] text-gray-500 dark:text-slate-400 border-t border-gray-100 dark:border-slate-800/80">
                      <strong className="block text-gray-700 dark:text-white font-bold mb-0.5">Address:</strong>
                      {selectedPlace.address}, {selectedPlace.city}, {selectedPlace.state}
                    </div>
                  </div>

                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${selectedPlace.coordinates.lat},${selectedPlace.coordinates.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-white font-bold text-xs uppercase font-sans tracking-wider shadow-sm transition-all cursor-pointer text-center block border border-transparent"
                  >
                    Open Google Maps Directions
                  </a>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TRIPADVISOR TRIPS & ITINERARY PLANNING VIEW              */}
        {/* ======================================================== */}
        {activeView === "trips" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in space-y-8 text-left">
            {!user ? (
              /* Anonymous Lock Screen */
              <div className="max-w-xl mx-auto text-center py-16 space-y-6">
                <div className="w-20 h-20 bg-[#00AA6C]/10 dark:bg-[#00AA6C]/20 text-[#00AA6C] rounded-full flex items-center justify-center mx-auto shadow-md">
                  <Compass className="w-10 h-10 animate-spin-slow" />
                </div>
                <div className="space-y-2">
                  <h1 className="font-serif font-extrabold text-3xl sm:text-4xl text-gray-900 dark:text-white">
                    Plan your next adventure together
                  </h1>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                    Create and organize daily travel itineraries, save your favorite spots, and build the ultimate vacation schedule.
                  </p>
                </div>
                <button
                  onClick={() => setAuthModal({ isOpen: true, mode: "login" })}
                  className="px-8 py-3 rounded-full bg-[#00AA6C] hover:bg-[#00905b] text-white text-xs font-black uppercase font-sans tracking-widest shadow-md hover:scale-102 active:scale-98 transition-all cursor-pointer"
                >
                  Sign In to Plan Trips
                </button>
              </div>
            ) : (
              /* Authenticated Split Dashboard */
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-200 dark:border-slate-800 pb-5 gap-4">
                  <div>
                    <h1 className="font-serif font-extrabold text-3xl text-gray-900 dark:text-white flex items-center gap-2">
                      <Sparkles className="w-7 h-7 text-[#00AA6C]" /> Your Planned Trips
                    </h1>
                    <p className="text-xs text-gray-500 font-sans mt-0.5">
                      Organize day-by-day sightseeing, reserve stays, and view routes.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column: Trip Selection & Creation Panel */}
                  <div className="lg:col-span-4 space-y-6">
                    {/* Create New Trip card */}
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-gray-200/60 dark:border-slate-800 shadow-sm space-y-4">
                      <h3 className="font-sans font-bold text-xs text-gray-800 dark:text-white uppercase tracking-wide border-b border-gray-100 dark:border-slate-800/80 pb-2">
                        ★ Create New Trip Planner
                      </h3>
                      <form onSubmit={handleCreateTrip} className="space-y-3 text-xs font-sans">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase">Trip Name</label>
                          <input
                            required
                            type="text"
                            placeholder="e.g. Goa Beach Holiday"
                            value={tripFormInputs.name}
                            onChange={(e) => setTripFormInputs({ ...tripFormInputs, name: e.target.value })}
                            className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-xs text-gray-900 dark:text-white focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase">Destination</label>
                          <input
                            required
                            type="text"
                            placeholder="e.g. Goa, India"
                            value={tripFormInputs.destination}
                            onChange={(e) => setTripFormInputs({ ...tripFormInputs, destination: e.target.value })}
                            className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-xs text-gray-900 dark:text-white focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase">Duration (Days)</label>
                          <select
                            value={tripFormInputs.days}
                            onChange={(e) => setTripFormInputs({ ...tripFormInputs, days: e.target.value })}
                            className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-xs text-gray-900 dark:text-white focus:outline-none"
                          >
                            <option value="1">1 Day</option>
                            <option value="2">2 Days</option>
                            <option value="3">3 Days</option>
                            <option value="4">4 Days</option>
                            <option value="5">5 Days</option>
                            <option value="7">7 Days</option>
                          </select>
                        </div>
                        <button
                          type="submit"
                          className="w-full py-2.5 bg-[#00AA6C] hover:bg-[#00905b] text-white font-bold rounded-xl cursor-pointer shadow-sm hover:scale-102 active:scale-98 transition-all"
                        >
                          + Initialize Planner
                        </button>
                      </form>
                    </div>

                    {/* Trips lists */}
                    <div className="space-y-3">
                      <h3 className="font-sans font-bold text-xs text-gray-800 dark:text-slate-400 uppercase tracking-wide">
                        Active Planners ({trips.length})
                      </h3>
                      {trips.length === 0 ? (
                        <p className="text-xs text-gray-400 italic py-4">No trips planned yet.</p>
                      ) : (
                        <div className="space-y-3">
                          {trips.map((t) => (
                            <div
                              key={t.id}
                              onClick={() => {
                                setSelectedTrip(t);
                                setActiveTripDay(1);
                                setTripNoteInput(t.notes?.[String(1)] || "");
                              }}
                              className={`p-4 rounded-3xl border text-left cursor-pointer transition-all flex justify-between items-center ${
                                selectedTrip && selectedTrip.id === t.id
                                  ? "bg-indigo-950/5 dark:bg-orange-500/10 border-[#00AA6C] shadow-sm"
                                  : "bg-white dark:bg-slate-900 border-gray-200/60 dark:border-slate-800 hover:border-gray-300"
                              }`}
                            >
                              <div className="space-y-1">
                                <h4 className="font-serif font-extrabold text-sm text-gray-900 dark:text-white">
                                  {t.name}
                                </h4>
                                <div className="flex gap-2 text-[10px] text-gray-500 dark:text-gray-400 font-sans">
                                  <span>📍 {t.destination}</span>
                                  <span>•</span>
                                  <span>📅 {t.days} days</span>
                                </div>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteTrip(t.id);
                                }}
                                className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors cursor-pointer"
                                title="Delete Trip"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Active Trip Daily Itinerary & Map */}
                  <div className="lg:col-span-8 space-y-6">
                    {!selectedTrip ? (
                      <div className="bg-white dark:bg-slate-900 py-16 px-4 rounded-3xl border border-gray-200/60 dark:border-slate-800 text-center space-y-2">
                        <Calendar className="w-10 h-10 text-gray-300 mx-auto" />
                        <h4 className="font-bold text-gray-700 dark:text-white text-sm">Select or Create a Trip Planner</h4>
                        <p className="text-xs text-gray-400 max-w-xs mx-auto">
                          Select one of your travel planners from the sidebar or click "+ Initialize Planner" to start schedule building.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* Active Trip detail card */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-200/60 dark:border-slate-800 shadow-sm space-y-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="px-2 py-0.5 text-[9px] font-mono tracking-widest bg-[#00AA6C]/10 text-[#00AA6C] rounded-md font-bold uppercase">
                                Daily Itinerary
                              </span>
                              <h2 className="font-serif font-extrabold text-2xl text-gray-900 dark:text-white mt-1">
                                {selectedTrip.name}
                              </h2>
                              <p className="text-xs text-gray-400 font-sans mt-0.5">
                                Location: <span className="font-bold text-gray-600 dark:text-gray-300">{selectedTrip.destination}</span>
                              </p>
                            </div>
                          </div>

                          {/* Day selection tabs */}
                          <div className="flex gap-2 border-b border-gray-150 dark:border-slate-800/80 pb-2 overflow-x-auto">
                            {Array.from({ length: selectedTrip.days }, (_, i) => i + 1).map((dayNum) => (
                              <button
                                key={dayNum}
                                onClick={() => {
                                  setActiveTripDay(dayNum);
                                  setTripNoteInput(selectedTrip.notes?.[String(dayNum)] || "");
                                }}
                                className={`py-2 px-4 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                                  activeTripDay === dayNum
                                    ? "bg-[#00AA6C] text-white shadow-sm"
                                    : "bg-gray-50 dark:bg-slate-800 text-gray-500 hover:text-gray-800 dark:hover:text-white"
                                }`}
                              >
                                Day {dayNum}
                              </button>
                            ))}
                          </div>

                          {/* Day timeline */}
                          <div className="space-y-4 text-left">
                            <h4 className="font-bold text-xs text-gray-800 dark:text-white flex items-center gap-1">
                              📅 Schedule List for Day {activeTripDay}
                            </h4>
                            
                            {(() => {
                              const dayPlan = selectedTrip.itinerary.find((d: any) => d.day === activeTripDay);
                              const dayPlaces = dayPlan?.places || [];
                              
                              if (dayPlaces.length === 0) {
                                return (
                                  <div className="p-6 bg-gray-50 dark:bg-slate-800/40 rounded-2xl border border-dashed text-center space-y-1">
                                    <p className="text-xs text-gray-500 leading-relaxed font-sans">
                                      No spots scheduled for Day {activeTripDay} yet.
                                    </p>
                                    <p className="text-[10px] text-gray-400 leading-relaxed font-sans">
                                      Browse attractions or hotels using the **Explore** search tab, open their detail page, and click **"Add to Itinerary"**!
                                    </p>
                                  </div>
                                );
                              }

                              return (
                                <div className="space-y-4">
                                  {dayPlaces.map((place: any, index: number) => (
                                    <div
                                      key={place.id}
                                      onClick={() => {
                                        setSelectedPlace(place);
                                        setActiveView("details");
                                      }}
                                      className="flex gap-4 p-3.5 bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800 hover:border-gray-200 rounded-2xl shadow-sm relative group cursor-pointer transition-all text-left"
                                    >
                                      <img
                                        src={place.photos?.[0]}
                                        onError={handleImageError}
                                        className="w-16 h-16 object-cover rounded-xl shrink-0"
                                      />
                                      <div className="flex-grow space-y-1 min-w-0">
                                        <div className="flex items-center gap-1.5">
                                          <span className="text-[9px] font-bold font-mono tracking-wider px-2 py-0.5 bg-gray-50 dark:bg-slate-800 rounded-md uppercase">
                                            {place.type === "hotel" || place.type === "resort" ? "🏨 Stay" :
                                             place.type === "restaurant" || place.type === "cafe" ? "🍽️ Food" : "🎡 Tour"}
                                          </span>
                                          <span className="text-[9px] text-gray-400 font-bold">Stop #{index + 1}</span>
                                        </div>
                                        <h5 className="font-serif font-extrabold text-sm text-gray-900 dark:text-white truncate">
                                          {place.name}
                                        </h5>
                                        <div className="flex items-center gap-1.5">
                                          {renderTripAdvisorBubbles(place.rating)}
                                          <span className="text-[10px] text-gray-400 font-bold ml-1">
                                            {place.rating.toFixed(1)} ({place.reviewCount} reviews)
                                          </span>
                                        </div>
                                        <p className="text-[10px] text-gray-500 truncate font-sans">
                                          📍 {place.address}, {place.city}
                                        </p>
                                      </div>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleRemovePlaceFromTrip(selectedTrip.id, place.id, activeTripDay);
                                        }}
                                        className="p-1.5 self-center text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer z-10"
                                        title="Remove Stop"
                                      >
                                        <X className="w-4 h-4" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              );
                            })()}
                          </div>

                          {/* Notes block */}
                          <div className="border-t border-gray-100 dark:border-slate-800/80 pt-4 mt-4 space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                              Day Notes & Schedule Hints
                            </label>
                            <div className="flex gap-2">
                              <textarea
                                value={tripNoteInput}
                                onChange={(e) => setTripNoteInput(e.target.value)}
                                placeholder="e.g. Taj Hotel breakfast at 8:00 AM, then taxi to Qutub Minar sightseeing at 10:00 AM..."
                                className="flex-grow p-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-gray-900 dark:text-white focus:outline-none"
                                rows={2}
                              />
                              <button
                                onClick={() => handleUpdateTripNotes(selectedTrip.id, activeTripDay, tripNoteInput)}
                                className="px-4 py-2.5 bg-[#00AA6C] text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all self-end shrink-0"
                              >
                                Save Note
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Interactive Itinerary Leaflet Map */}
                        {(() => {
                          const dayPlan = selectedTrip.itinerary.find((d: any) => d.day === activeTripDay);
                          const dayPlaces = dayPlan?.places || [];
                          if (dayPlaces.length === 0) return null;

                          return (
                            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-gray-200/60 dark:border-slate-800 shadow-sm space-y-4">
                              <h3 className="font-serif font-extrabold text-sm text-gray-800 dark:text-white flex items-center gap-1.5">
                                <MapIcon className="w-5 h-5 text-[#00AA6C]" /> Day {activeTripDay} Map Routing Pins
                              </h3>
                              <div className="h-96 rounded-2xl overflow-hidden relative border border-gray-150 dark:border-slate-800/80 shadow-md">
                                <ExploreMap
                                  places={dayPlaces}
                                  selectedPlace={dayPlaces[0]}
                                  onPlaceSelect={(place) => {}}
                                  onPlaceDetailsNavigate={(place) => {
                                    setSelectedPlace(place);
                                    setActiveView("details");
                                  }}
                                  center={{ lat: dayPlaces[0].coordinates.lat, lng: dayPlaces[0].coordinates.lng }}
                                  zoom={12}
                                  showDirections={true}
                                  theme={theme}
                                />
                              </div>
                            </div>
                          );
                        })()}

                      </div>
                    )}
                  </div>

                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TRAVEL TIPS VIEW                                         */}
        {/* ======================================================== */}
        {activeView === "tips" && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in space-y-10 text-left">
            <div className="space-y-2 text-center">
              <span className="text-xs font-mono font-bold tracking-widest text-orange-600 dark:text-orange-400 uppercase block">
                Official Heritage Concierge Advice
              </span>
              <h1 className="font-serif font-extrabold text-3xl sm:text-5xl text-gray-900 dark:text-white">
                Indian Travel Tips & Food Advisories
              </h1>
              <p className="text-xs text-gray-500 max-w-xl mx-auto">
                Essential cultural tips, budgeting hacks, train booking strategies, and food hygiene advices verified by our regional travel experts.
              </p>
            </div>

            <div className="space-y-8">
              {travelTips.map((tip, idx) => (
                <div key={tip.id} className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-slate-800 p-6 flex flex-col md:flex-row gap-6">
                  <img src={tip.image} onError={handleImageError} className="w-full md:w-1/3 h-52 object-cover rounded-2xl" />
                  <div className="md:w-2/3 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <span className="inline-block px-2.5 py-0.5 text-[9px] font-mono tracking-widest font-extrabold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/50 rounded-lg uppercase">
                        {tip.category} Code
                      </span>
                      <h3 className="font-serif font-extrabold text-xl text-gray-900 dark:text-white">
                        {tip.title}
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-sans">
                        {tip.text}
                      </p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-orange-500/5 border border-orange-500/10 text-[11px] text-orange-800 dark:text-orange-300 font-sans italic">
                      "India's regional heritage varies enormously. Respect religious custom guidelines when entering temples, and always drink bottled mineral water."
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* PROFILE & HISTORY VIEW                                   */}
        {/* ======================================================== */}
        {activeView === "profile" && user && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in space-y-8 text-left">
            {/* Header card info */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-200/60 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#070235] to-indigo-900 dark:from-indigo-600 dark:to-indigo-500 flex items-center justify-center text-white text-3xl font-black shadow-md border border-white/20">
                {(user.name || "U").charAt(0).toUpperCase()}
              </div>
              <div className="flex-grow text-center sm:text-left space-y-1">
                <span className="px-2.5 py-0.5 text-[9px] font-mono tracking-wider font-extrabold bg-orange-100 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 rounded-full uppercase">
                  {user.role} Member
                </span>
                <h2 className="font-serif font-extrabold text-2xl text-gray-900 dark:text-white">{user.name}</h2>
                <p className="text-xs text-gray-400">{user.email}</p>
                <div className="flex gap-2 pt-1.5 flex-wrap justify-center sm:justify-start">
                  <span className="inline-block px-2 py-0.5 text-[10px] text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-md">
                    Wishlist: {(user.favorites || []).length} items
                  </span>
                  <span className="inline-block px-2 py-0.5 text-[10px] text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-md">
                    Verified Email: {user.isVerified ? "✅ Yes" : "❌ No"}
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Tab buttons */}
            <div className="flex border-b border-gray-200 dark:border-slate-800 text-xs">
              <button
                onClick={() => setProfileTab("favorites")}
                className={`py-3 px-4 font-bold border-b-2 transition-colors cursor-pointer ${
                  profileTab === "favorites" ? "border-orange-500 text-orange-500" : "border-transparent text-gray-500 hover:text-gray-900"
                }`}
              >
                Saved Wishlist
              </button>
              <button
                onClick={() => setProfileTab("history")}
                className={`py-3 px-4 font-bold border-b-2 transition-colors cursor-pointer ${
                  profileTab === "history" ? "border-orange-500 text-orange-500" : "border-transparent text-gray-500 hover:text-gray-900"
                }`}
              >
                Search History
              </button>
              <button
                onClick={() => setProfileTab("bookings")}
                className={`py-3 px-4 font-bold border-b-2 transition-colors cursor-pointer ${
                  profileTab === "bookings" ? "border-orange-500 text-orange-500" : "border-transparent text-gray-500 hover:text-gray-900"
                }`}
              >
                My Bookings ({userBookings.length})
              </button>
              <button
                onClick={() => setProfileTab("reviews")}
                className={`py-3 px-4 font-bold border-b-2 transition-colors cursor-pointer ${
                  profileTab === "reviews" ? "border-orange-500 text-orange-500" : "border-transparent text-gray-500 hover:text-gray-900"
                }`}
              >
                My Reviews
              </button>
              <button
                onClick={() => setProfileTab("settings")}
                className={`py-3 px-4 font-bold border-b-2 transition-colors cursor-pointer ${
                  profileTab === "settings" ? "border-orange-500 text-orange-500" : "border-transparent text-gray-500 hover:text-gray-900"
                }`}
              >
                Settings
              </button>
            </div>

            {/* Tab Contents */}
            <div>
              {profileTab === "favorites" && (
                <div className="space-y-4">
                  {profileData?.favorites?.length === 0 ? (
                    <p className="text-xs text-gray-400 italic py-6">Your travel wishlist is currently empty. Start discovering places and clicking the heart button!</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {profileData?.favorites?.map((place: Place) => (
                        <div
                          key={place.id}
                          onClick={() => {
                            setSelectedPlace(place);
                            setActiveView("details");
                          }}
                          className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-4 flex gap-4 cursor-pointer premium-card-hover"
                        >
                          <img src={place.photos[0]} onError={handleImageError} className="w-20 h-20 object-cover rounded-xl shrink-0" />
                          <div className="space-y-1.5 min-w-0">
                            <h4 className="font-sans font-bold text-xs text-gray-900 dark:text-white truncate">{place.name}</h4>
                            <div className="flex items-center gap-1 text-[11px] text-orange-500 font-bold">
                              ★ {place.rating}
                            </div>
                            <p className="text-[10px] text-gray-400 truncate">{place.address}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {profileTab === "bookings" && (
                <div className="space-y-4">
                  {userBookings.length === 0 ? (
                    <div className="p-8 text-center bg-gray-50 dark:bg-slate-800/40 rounded-3xl border border-dashed border-gray-200 dark:border-slate-800 space-y-3">
                      <Calendar className="w-8 h-8 text-gray-400 mx-auto" />
                      <p className="text-xs text-gray-500 italic">You don't have any reservations scheduled yet.</p>
                      <button
                        onClick={() => handleNavigate("search")}
                        className="px-4 py-2 bg-[#00AA6C] text-white font-bold text-xs rounded-xl hover:opacity-90 active:scale-98 cursor-pointer"
                      >
                        Explore & Book Places
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {userBookings.map((booking: any) => (
                        <div
                          key={booking.id}
                          className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200/60 dark:border-slate-800 shadow-sm p-5 flex flex-col justify-between text-left space-y-4 relative group"
                        >
                          <div className="flex gap-4 items-start">
                            <img
                              src={booking.placePhoto}
                              onError={handleImageError}
                              className="w-16 h-16 object-cover rounded-2xl shrink-0"
                            />
                            <div className="min-w-0 space-y-1">
                              <span className="px-2 py-0.5 text-[8px] font-mono tracking-widest bg-emerald-50 dark:bg-emerald-950/20 text-[#00AA6C] border border-emerald-100 dark:border-emerald-900 rounded-md font-bold uppercase">
                                Verified Reservation
                              </span>
                              <h4 className="font-serif font-extrabold text-sm text-gray-900 dark:text-white truncate">
                                {booking.placeName}
                              </h4>
                              <p className="text-[10px] text-gray-500 font-sans">
                                📍 {booking.city}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3 bg-gray-50 dark:bg-slate-800/40 p-3 rounded-2xl text-[10px] font-sans text-gray-600 dark:text-gray-300">
                            <div>
                              <strong className="block text-gray-400 uppercase text-[8px] tracking-wider mb-0.5">Date</strong>
                              {booking.date} {booking.dateOut ? `to ${booking.dateOut}` : ""}
                            </div>
                            <div>
                              <strong className="block text-gray-400 uppercase text-[8px] tracking-wider mb-0.5">Guests</strong>
                              {booking.guests}
                            </div>
                            {booking.time && (
                              <div className="col-span-2 border-t border-gray-150/40 dark:border-slate-800 pt-2 mt-1">
                                <strong className="inline-block text-gray-400 uppercase text-[8px] tracking-wider mr-1.5">Preferred Time:</strong>
                                <span className="font-bold text-gray-900 dark:text-white">{booking.time}</span>
                              </div>
                            )}
                          </div>

                          <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-slate-800 text-xs">
                            <span className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                              <CheckCircle className="w-4 h-4 text-emerald-500" /> Confirmed
                            </span>
                            <button
                              onClick={() => handleCancelBooking(booking.id)}
                              className="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-[10px] rounded-xl transition-all cursor-pointer"
                            >
                              Cancel Reservation
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {profileTab === "history" && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] text-gray-400 font-mono">LATEST SEARCH QUERIES</p>
                    {profileData?.history?.length > 0 && (
                      <button 
                        onClick={async () => {
                          await fetch(getApiUrl("/api/user/clear-history"), {
                            method: "POST",
                            headers: { "Authorization": `Bearer ${user.token}` }
                          });
                          setProfileData((prev: any) => ({ ...prev, history: [] }));
                        }}
                        className="text-[10px] text-red-500 hover:underline"
                      >
                        Clear History
                      </button>
                    )}
                  </div>

                  {profileData?.history?.length === 0 ? (
                    <p className="text-xs text-gray-400 italic py-4">No recent searches logged.</p>
                  ) : (
                    <div className="space-y-2 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-100 dark:border-slate-800">
                      {profileData?.history?.map((hist: SearchHistory) => (
                        <div 
                          key={hist.id} 
                          onClick={() => handleSearchCity(hist.query)}
                          className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors cursor-pointer text-xs"
                        >
                          <span className="flex items-center gap-2 text-gray-800 dark:text-white font-medium">
                            <History className="w-4 h-4 text-gray-400" /> {hist.query}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            {new Date(hist.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {profileTab === "reviews" && (
                <div className="space-y-4">
                  {profileData?.reviews?.length === 0 ? (
                    <p className="text-xs text-gray-400 italic py-6">You haven't posted any reviews yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {profileData?.reviews?.map((rev: Review) => (
                        <div key={rev.id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-100 dark:border-slate-800 space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span className="font-bold text-orange-500">★ {rev.rating}</span>
                            <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold ${
                              rev.approved ? "bg-green-50 text-green-600 border border-green-200" : "bg-yellow-50 text-yellow-600 border border-yellow-200"
                            }`}>
                              {rev.approved ? "Approved" : "Pending Approval"}
                            </span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 italic">"{rev.text}"</p>
                          <span className="text-[10px] text-gray-400 block">{rev.date}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {profileTab === "settings" && (
                <form 
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const nameInput = (e.target as any).elements.profileName.value;
                    const res = await fetch(getApiUrl("/api/user/profile/update"), {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${user.token}`
                      },
                      body: JSON.stringify({ name: nameInput })
                    });
                    if (res.ok) {
                      const data = await res.json();
                      const updated = { ...user, name: data.user.name };
                      setUser(updated);
                      localStorage.setItem("explore_india_user", JSON.stringify(updated));
                      alert("Profile updated successfully!");
                    }
                  }}
                  className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 space-y-4 max-w-sm"
                >
                  <h4 className="font-sans font-bold text-xs text-gray-800 dark:text-white">Edit Profile Details</h4>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Your Display Name</label>
                    <input 
                      type="text" 
                      name="profileName"
                      defaultValue={user.name}
                      className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Registered Email</label>
                    <input 
                      type="text" 
                      disabled
                      value={user.email}
                      className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-gray-100 dark:bg-slate-900 text-xs text-gray-400 cursor-not-allowed"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-indigo-950 dark:bg-orange-500 text-white font-bold text-xs rounded-xl hover:opacity-90 active:scale-98 transition-all cursor-pointer"
                  >
                    Save Settings
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SECURE ADMIN CONTROL PANEL                               */}
        {/* ======================================================== */}
        {activeView === "admin" && user?.role === "admin" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in space-y-8 text-left">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold tracking-widest text-orange-600 dark:text-orange-400 uppercase flex items-center gap-1">
                <Shield className="w-4 h-4 text-orange-400" /> SECURE CONTROL INTERFACE
              </span>
              <h1 className="font-serif font-extrabold text-3xl text-gray-900 dark:text-white">
                Regional Travel Administration Panel
              </h1>
            </div>

            {/* Tab switchers */}
            <div className="flex flex-wrap gap-2 text-xs border-b border-gray-200 dark:border-slate-800 pb-2">
              {[
                { id: "dashboard", label: "Dashboard Statistics", icon: BarChart2 },
                { id: "places", label: "Manage Places", icon: MapPin },
                { id: "users", label: "Active Users", icon: Users },
                { id: "reviews", label: "Approve Reviews", icon: FileText }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setAdminTab(tab.id as any)}
                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                      adminTab === tab.id 
                        ? "bg-indigo-950 text-white dark:bg-orange-500" 
                        : "bg-gray-100 hover:bg-gray-200 text-gray-600 dark:bg-slate-800 dark:text-gray-300"
                    }`}
                  >
                    <Icon className="w-4 h-4" /> {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Admin Dashboard Statistics tab */}
            {adminTab === "dashboard" && adminAnalytics && (
              <div className="space-y-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-200/60 dark:border-slate-800 text-center">
                    <span className="text-gray-400 text-[10px] font-mono uppercase block font-bold">Total Users</span>
                    <span className="text-3xl font-bold text-indigo-950 dark:text-orange-400 mt-1 block">{adminAnalytics.usersCount}</span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-200/60 dark:border-slate-800 text-center">
                    <span className="text-gray-400 text-[10px] font-mono uppercase block font-bold">Registered Places</span>
                    <span className="text-3xl font-bold text-indigo-950 dark:text-orange-400 mt-1 block">{adminAnalytics.placesCount}</span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-200/60 dark:border-slate-800 text-center">
                    <span className="text-gray-400 text-[10px] font-mono uppercase block font-bold">Guest Reviews</span>
                    <span className="text-3xl font-bold text-indigo-950 dark:text-orange-400 mt-1 block">{adminAnalytics.reviewsCount}</span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-200/60 dark:border-slate-800 text-center">
                    <span className="text-gray-400 text-[10px] font-mono uppercase block font-bold">Active Searches</span>
                    <span className="text-3xl font-bold text-indigo-950 dark:text-orange-400 mt-1 block">{adminAnalytics.searchesCount}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Places distribution breakdown */}
                  <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-200/60 dark:border-slate-800 space-y-4">
                    <h4 className="font-sans font-bold text-xs text-gray-800 dark:text-white uppercase tracking-wider">
                      Places Breakdown by Category
                    </h4>
                    <div className="space-y-3.5 text-xs">
                      {Object.entries(adminAnalytics.placesByType).map(([type, count]) => (
                        <div key={type} className="flex items-center gap-3">
                          <span className="w-16 uppercase font-mono text-[10px] text-gray-500 font-bold">{type}s</span>
                          <div className="flex-grow bg-gray-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                            <div className="bg-orange-500 h-full" style={{ width: `${Math.min(100, ((count as number) / (adminAnalytics.placesCount || 1)) * 100)}%` }}></div>
                          </div>
                          <span className="font-bold w-6 text-right">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Popular Searches */}
                  <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-200/60 dark:border-slate-800 space-y-4">
                    <h4 className="font-sans font-bold text-xs text-gray-800 dark:text-white uppercase tracking-wider">
                      Top Searched Locations in India
                    </h4>
                    <div className="space-y-2 text-xs">
                      {adminAnalytics.popularCities.length === 0 ? (
                        <p className="text-gray-400 italic">No search histories recorded yet.</p>
                      ) : (
                        adminAnalytics.popularCities.map((city, index) => (
                          <div key={city.name} className="flex justify-between items-center p-2 rounded-lg bg-gray-50 dark:bg-slate-800">
                            <span className="font-medium text-gray-800 dark:text-white">{index + 1}. {city.name}</span>
                            <span className="font-bold text-indigo-600 dark:text-orange-400">{city.count} searches</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Places CRUD Tab */}
            {adminTab === "places" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-400 font-mono font-bold">MANAGE ACTIVE TOURIST PLACES</p>
                  <button
                    onClick={() => setShowAddPlaceModal(true)}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add New Place
                  </button>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200/60 dark:border-slate-800 overflow-hidden shadow-sm">
                  <table className="w-full text-xs text-left text-gray-500 dark:text-gray-400">
                    <thead className="bg-gray-55/60 dark:bg-slate-800/80 text-gray-700 dark:text-gray-300 font-mono uppercase text-[10px] border-b border-gray-100 dark:border-slate-800">
                      <tr>
                        <th className="p-4">Place Name</th>
                        <th className="p-4">Type</th>
                        <th className="p-4">City / State</th>
                        <th className="p-4">Rating</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-gray-900 dark:text-white">
                      {adminPlaces.map((place) => (
                        <tr key={place.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/40">
                          <td className="p-4 font-bold">{place.name}</td>
                          <td className="p-4 uppercase font-mono text-[10px] text-orange-600 dark:text-orange-400">{place.type}</td>
                          <td className="p-4">{place.city}, {place.state}</td>
                          <td className="p-4">★ {place.rating}</td>
                          <td className="p-4 text-right space-x-2 border-b border-gray-100 dark:border-slate-800">
                            <button 
                              onClick={() => { setSelectedPlace(place); setActiveView("details"); }}
                              className="text-indigo-600 dark:text-indigo-400 hover:underline"
                              title="View details"
                            >
                              <Eye className="w-4 h-4 inline" />
                            </button>
                            <button 
                              onClick={() => setIsEditingPlace(place)}
                              className="text-orange-500 hover:underline"
                              title="Edit place"
                            >
                              <Edit2 className="w-4 h-4 inline" />
                            </button>
                            <button 
                              onClick={() => handleDeletePlace(place.id)}
                              className="text-red-500 hover:underline"
                              title="Delete place"
                            >
                              <Trash2 className="w-4 h-4 inline" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Users list Tab */}
            {adminTab === "users" && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200/60 dark:border-slate-800 overflow-hidden shadow-sm">
                <table className="w-full text-xs text-left text-gray-500 dark:text-gray-400">
                  <thead className="bg-gray-55/60 dark:bg-slate-800/80 text-gray-700 dark:text-gray-300 font-mono uppercase text-[10px] border-b border-gray-100 dark:border-slate-800">
                    <tr>
                      <th className="p-4">User</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Role</th>
                      <th className="p-4">Verified</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-gray-900 dark:text-white">
                    {adminUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/40">
                        <td className="p-4 flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#070235] to-indigo-900 dark:from-indigo-600 dark:to-indigo-500 flex items-center justify-center text-white text-[9px] font-black shadow-sm shrink-0">
                             {(u.name || "U").charAt(0).toUpperCase()}
                           </div>
                          <span className="font-bold">{u.name}</span>
                        </td>
                        <td className="p-4">{u.email}</td>
                        <td className="p-4 uppercase font-mono text-[10px] text-orange-600 dark:text-orange-400">{u.role}</td>
                        <td className="p-4">{u.isVerified ? "✅ Yes" : "❌ No"}</td>
                        <td className="p-4 text-right">
                          <button 
                            disabled={u.id === "admin-id"}
                            onClick={async () => {
                              if (!confirm(`Are you sure you want to delete user ${u.name}?`)) return;
                              const res = await fetch(getApiUrl(`/api/admin/users/${u.id}`), {
                                method: "DELETE",
                                headers: { "Authorization": `Bearer ${user.token}` }
                              });
                              if (res.ok) {
                                setAdminUsers(prev => prev.filter(item => item.id !== u.id));
                              }
                            }}
                            className="text-red-500 hover:underline disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            Delete User
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Review Approvals Tab */}
            {adminTab === "reviews" && (
              <div className="space-y-4">
                <p className="text-xs text-gray-400 font-mono font-bold">PENDING GUEST REVIEWS FOR APPROVAL</p>

                {adminPendingReviews.length === 0 ? (
                  <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-gray-100 dark:border-slate-800 text-center space-y-2">
                    <CheckCircle className="w-10 h-10 text-green-500 mx-auto" />
                    <h4 className="font-serif font-bold text-sm text-gray-900 dark:text-white">All caught up!</h4>
                    <p className="text-xs text-gray-400">No pending guest reviews require moderator approval.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {adminPendingReviews.map((rev) => (
                      <div key={rev.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-200/60 dark:border-slate-800 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-bold text-xs text-gray-900 dark:text-white">{rev.userName}</h5>
                            <p className="text-[10px] text-gray-400">Date: {rev.date} &bull; PlaceId: {rev.placeId}</p>
                          </div>
                          <span className="text-orange-500 font-bold text-xs">★ {rev.rating}</span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-300 italic font-sans">
                          "{rev.text}"
                        </p>
                        <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 dark:border-slate-800">
                          <button
                            onClick={() => handleDeleteReview(rev.id)}
                            className="px-3.5 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold transition-all cursor-pointer"
                          >
                            Reject & Delete
                          </button>
                          <button
                            onClick={() => handleApproveReview(rev.id)}
                            className="px-3.5 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs font-bold transition-all cursor-pointer"
                          >
                            Approve & Publish
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        )}

      </main>

      {/* ======================================================== */}
      {/* AUTHENTICATION MODAL (Beautiful Overlay UI)             */}
      {/* ======================================================== */}
      {authModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border border-gray-100 dark:border-slate-800 p-6 relative animate-fade-in space-y-6">
            
            {/* Close */}
            <button
              onClick={() => {
                setAuthModal({ isOpen: false, mode: "login" });
                setAuthError("");
                setAuthSuccess("");
              }}
              className="absolute top-4 right-4 p-1.5 rounded-xl text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header titles */}
            <div className="space-y-1 text-center">
              <Compass className="w-10 h-10 text-orange-400 mx-auto animate-spin" style={{ animationDuration: "12s" }} />
              <h3 className="font-serif font-extrabold text-xl text-[#070235] dark:text-white pt-2">
                {authModal.mode === "login" && "Sign In to ExploreIndia"}
                {authModal.mode === "signup" && "Create Luxury Account"}
                {authModal.mode === "verify" && "Verify Royal Credentials"}
                {authModal.mode === "forgot" && "Reset Password Request"}
              </h3>
              <p className="text-[11px] text-gray-400">
                {authModal.mode === "login" && "Discover & persistent favorite hotel logs across India"}
                {authModal.mode === "signup" && "Start logging reviews and building personal wishlist"}
                {authModal.mode === "verify" && "Enter OTP received to confirm secure connection"}
                {authModal.mode === "forgot" && "Reset link will automatically generate custom verification key"}
              </p>
            </div>

            {/* Errors alert box */}
            {authError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-sans flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 shrink-0" /> {authError}
              </div>
            )}

            {/* Success alert box */}
            {authSuccess && (
              <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-xs text-green-600 font-sans flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 shrink-0" /> {authSuccess}
              </div>
            )}

            {/* Verification prompt when OTP code is available */}
            {(authModal.mode === "verify" || authModal.mode === "reset") && authModal.otpCode && (
              <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 text-xs text-orange-800 font-sans space-y-1">
                <p className="font-bold flex items-center gap-1">🔑 Verification Assistant (Testing):</p>
                <p>We simulated sending the verification code. Enter this OTP code to proceed:</p>
                <p className="font-mono text-center text-lg tracking-widest font-extrabold bg-white dark:bg-slate-950 p-1.5 rounded border border-orange-200">
                  {authModal.otpCode}
                </p>
              </div>
            )}

            {/* Dynamic Inputs form */}
            <form onSubmit={handleAuthSubmit} className="space-y-4 text-left">
              
              {authModal.mode === "signup" && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Full Name</label>
                  <input
                    required
                    type="text"
                    value={authInputs.name}
                    onChange={(e) => setAuthInputs({ ...authInputs, name: e.target.value })}
                    placeholder="E.g., Dinesh Kumar"
                    className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-xs text-gray-900 focus:outline-none"
                  />
                </div>
              )}

              {(authModal.mode === "login" || authModal.mode === "signup" || authModal.mode === "forgot") && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Email Address</label>
                  <input
                    required
                    type="email"
                    value={authInputs.email}
                    onChange={(e) => setAuthInputs({ ...authInputs, email: e.target.value })}
                    placeholder="Enter email address"
                    className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-xs text-gray-900 focus:outline-none"
                  />
                </div>
              )}

              {(authModal.mode === "login" || authModal.mode === "signup" || authModal.mode === "reset") && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                    {authModal.mode === "reset" ? "New Password" : "Secure Password"}
                  </label>
                  <input
                    required
                    type="password"
                    value={authInputs.password}
                    onChange={(e) => setAuthInputs({ ...authInputs, password: e.target.value })}
                    placeholder="Enter password (e.g. user123 / admin123)"
                    className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-xs text-gray-900 focus:outline-none"
                  />
                </div>
              )}

              {(authModal.mode === "verify" || authModal.mode === "reset") && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">6-Digit Verification Code</label>
                  <input
                    required
                    maxLength={6}
                    type="text"
                    value={authInputs.otp}
                    onChange={(e) => setAuthInputs({ ...authInputs, otp: e.target.value })}
                    placeholder="Enter code (or 123456)"
                    className="w-full p-2.5 rounded-xl border border-orange-500/30 bg-orange-50/10 text-center tracking-widest text-lg font-mono font-bold focus:outline-none"
                  />
                </div>
              )}

              {authModal.mode === "login" && (
                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-1.5 text-gray-500 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={authInputs.rememberMe}
                      onChange={(e) => setAuthInputs({ ...authInputs, rememberMe: e.target.checked })}
                      className="rounded text-indigo-900"
                    /> Remember Me
                  </label>
                  <button
                    type="button"
                    onClick={() => { setAuthModal({ ...authModal, mode: "forgot" }); setAuthError(""); setAuthSuccess(""); }}
                    className="text-indigo-600 dark:text-orange-400 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-[#070235] dark:bg-orange-500 text-white font-bold font-sans text-xs uppercase tracking-wider rounded-xl hover:opacity-95 active:scale-98 shadow-md transition-all cursor-pointer"
              >
                {authModal.mode === "login" && "Confirm Sign In"}
                {authModal.mode === "signup" && "Generate Member Key"}
                {authModal.mode === "verify" && "Verify Secure Code"}
                {authModal.mode === "forgot" && "Send Reset OTP"}
                {authModal.mode === "reset" && "Reset Password"}
              </button>
            </form>

            {/* Alternating Auth links */}
            <div className="text-center text-xs text-gray-500 pt-3 border-t border-gray-100 dark:border-slate-800">
              {authModal.mode === "login" ? (
                <p>
                  New guest to the portal?{" "}
                  <button 
                    onClick={() => { setAuthModal({ ...authModal, mode: "signup" }); setAuthError(""); setAuthSuccess(""); }} 
                    className="text-indigo-600 dark:text-orange-400 font-bold hover:underline"
                  >
                    Register Account
                  </button>
                </p>
              ) : (
                <p>
                  Already registered?{" "}
                  <button 
                    onClick={() => { setAuthModal({ ...authModal, mode: "login" }); setAuthError(""); setAuthSuccess(""); }} 
                    className="text-indigo-600 dark:text-orange-400 font-bold hover:underline"
                  >
                    Sign In
                  </button>
                </p>
              )}
            </div>

            {/* Demo testing credentials shortcut */}
            {authModal.mode === "login" && (
              <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-slate-950 text-[10px] text-gray-500 space-y-1.5 leading-normal">
                <p className="font-bold uppercase tracking-wider text-orange-500 flex items-center gap-1">
                  🧪 Demo Credentials for rapid testing:
                </p>
                <div className="flex justify-between">
                  <span><strong>Administrator:</strong></span>
                  <span>admin@exploreindia.com / admin123</span>
                </div>
                <div className="flex justify-between border-t border-gray-200/50 pt-1">
                  <span><strong>Standard User:</strong></span>
                  <span>sathanidineshkumar@gmail.com / user123</span>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ADD PLACE MODAL (Admin panel CRUD feature)              */}
      {/* ======================================================== */}
      {(showAddPlaceModal || isEditingPlace) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const formEl = e.target as HTMLFormElement;
              const name = (formEl.elements as any).pName.value;
              const type = (formEl.elements as any).pType.value;
              const city = (formEl.elements as any).pCity.value;
              const state = (formEl.elements as any).pState.value;
              const address = (formEl.elements as any).pAddress.value;
              const description = (formEl.elements as any).pDesc.value;
              const priceLevel = Number((formEl.elements as any).pPrice.value);
              const lat = Number((formEl.elements as any).pLat.value);
              const lng = Number((formEl.elements as any).pLng.value);

              const payload: Partial<Place> = {
                name,
                type,
                city,
                state,
                address,
                description,
                priceLevel,
                coordinates: { lat, lng }
              };

              if (isEditingPlace) {
                const res = await fetch(getApiUrl(`/api/admin/places/${isEditingPlace.id}`), {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user?.token}`
                  },
                  body: JSON.stringify(payload)
                });

                if (res.ok) {
                  const updated = await res.json();
                  setAdminPlaces(prev => prev.map(p => p.id === isEditingPlace.id ? updated : p));
                  setIsEditingPlace(null);
                  alert("Place updated successfully!");
                } else {
                  const data = await res.json();
                  alert(data.error || "Failed to update place");
                }
              } else {
                const newP: Partial<Place> = {
                  ...payload,
                  rating: 4.5,
                  photos: [
                    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600",
                    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600"
                  ],
                  facilities: ["WiFi", "AC", "Parking"],
                };

                const res = await fetch(getApiUrl("/api/admin/places"), {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user?.token}`
                  },
                  body: JSON.stringify(newP)
                });

                if (res.ok) {
                  const added = await res.json();
                  setAdminPlaces(prev => [...prev, added]);
                  setShowAddPlaceModal(false);
                  alert("Place added successfully!");
                } else {
                  const data = await res.json();
                  alert(data.error || "Failed to add place");
                }
              }
            }}
            className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-gray-100 dark:border-slate-800 p-6 relative animate-fade-in space-y-4"
          >
            <h3 className="font-serif font-extrabold text-lg text-gray-900 dark:text-white border-b pb-2">
              {isEditingPlace ? "Edit Curated Spot" : "Add New Curated Spot"}
            </h3>
            
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Place Name</label>
                <input required name="pName" defaultValue={isEditingPlace?.name || ""} placeholder="E.g., Taj Palace" className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 text-xs" />
              </div>
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Category Type</label>
                <select name="pType" defaultValue={isEditingPlace?.type || "hotel"} className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 text-xs">
                  <option value="hotel">Hotel</option>
                  <option value="restaurant">Restaurant</option>
                  <option value="resort">Resort</option>
                  <option value="attraction">Attraction</option>
                  <option value="cafe">Cafe</option>
                  <option value="temple">Temple</option>
                </select>
              </div>
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-bold text-gray-400 uppercase">City</label>
                <input required name="pCity" defaultValue={isEditingPlace?.city || ""} placeholder="E.g., Jaipur" className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 text-xs" />
              </div>
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-bold text-gray-400 uppercase">State</label>
                <input required name="pState" defaultValue={isEditingPlace?.state || ""} placeholder="E.g., Rajasthan" className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 text-xs" />
              </div>
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Latitude</label>
                <input required name="pLat" defaultValue={isEditingPlace?.coordinates?.lat || ""} type="number" step="any" placeholder="26.912" className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 text-xs" />
              </div>
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Longitude</label>
                <input required name="pLng" defaultValue={isEditingPlace?.coordinates?.lng || ""} type="number" step="any" placeholder="75.787" className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 text-xs" />
              </div>
            </div>

            <div className="space-y-1 text-left text-xs">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Exact Address</label>
              <input required name="pAddress" defaultValue={isEditingPlace?.address || ""} placeholder=" Amer Road, Jaipur 302002" className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 text-xs" />
            </div>

            <div className="space-y-1 text-left text-xs">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Description</label>
              <textarea required rows={2} name="pDesc" defaultValue={isEditingPlace?.description || ""} placeholder="Enter royal description..." className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 text-xs focus:outline-none" />
            </div>

            <div className="space-y-1 text-left text-xs">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Price Bracket (1 to 4 Stars)</label>
              <input required name="pPrice" type="number" min={1} max={4} defaultValue={isEditingPlace?.priceLevel || 2} className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 text-xs" />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t text-xs">
              <button
                type="button"
                onClick={() => {
                  setShowAddPlaceModal(false);
                  setIsEditingPlace(null);
                }}
                className="px-4 py-2 bg-gray-100 rounded-xl hover:bg-gray-200 font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl cursor-pointer"
              >
                {isEditingPlace ? "Save Changes" : "Add Spot"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Footer Component */}
      <Footer 
        onNavigate={handleNavigate}
        onSearchCity={handleSearchCity}
      />

      {/* Terms & Privacy Info Modal */}
      {infoModal.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-6 border border-gray-200/50 dark:border-slate-800 shadow-2xl space-y-4 animate-fade-in text-left">
            <h3 className="font-serif font-extrabold text-lg text-gray-900 dark:text-white">
              {infoModal.title}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-sans font-normal">
              {infoModal.content}
            </p>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setInfoModal(prev => ({ ...prev, isOpen: false }))}
                className="px-5 py-2.5 bg-indigo-950 dark:bg-orange-500 hover:opacity-90 active:scale-98 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all"
              >
                Accept & Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add to Trip Itinerary Modal */}
      {showAddToTripModal && selectedPlace && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-6 border border-gray-200/50 dark:border-slate-800 shadow-2xl space-y-4 animate-fade-in text-left">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-slate-800">
              <h3 className="font-serif font-extrabold text-base text-gray-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#00AA6C]" /> Add to Itinerary
              </h3>
              <button 
                onClick={() => setShowAddToTripModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white text-xs font-bold font-sans cursor-pointer"
              >
                ✕ Close
              </button>
            </div>
            
            <p className="text-xs text-gray-500 leading-relaxed font-sans">
              Schedule <span className="font-bold text-gray-900 dark:text-white">"{selectedPlace.name}"</span> into one of your custom travel planners.
            </p>

            {trips.length === 0 ? (
              <div className="p-4 bg-orange-500/5 border border-orange-500/10 rounded-2xl text-center space-y-3">
                <p className="text-xs text-orange-800 dark:text-orange-300 font-sans leading-relaxed">
                  You don't have any active Trip Planners yet. Navigate to the "Trips" tab to create one!
                </p>
                <button
                  onClick={() => {
                    setShowAddToTripModal(false);
                    handleNavigate("trips");
                  }}
                  className="px-4 py-2 bg-[#FFC000] hover:bg-[#e6ad00] text-black font-black text-xs rounded-xl hover:opacity-90 active:scale-98 cursor-pointer"
                >
                  Create New Trip Planner
                </button>
              </div>
            ) : (
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const tripId = form.tripSelect.value;
                  const day = Number(form.daySelect.value);
                  handleAddPlaceToTrip(tripId, day);
                }}
                className="space-y-4 text-xs font-sans"
              >
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Select Trip</label>
                  <select 
                    name="tripSelect"
                    className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-xs text-gray-900 dark:text-white focus:outline-none"
                  >
                    {trips.map(t => (
                      <option key={t.id} value={t.id}>{t.name} ({t.destination})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Select Day</label>
                  <select 
                    name="daySelect"
                    className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-xs text-gray-900 dark:text-white focus:outline-none"
                  >
                    {Array.from({ length: trips[0]?.days || 3 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>Day {i + 1}</option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowAddToTripModal(false)}
                    className="px-4 py-2 bg-gray-100 dark:bg-slate-850 dark:text-white rounded-xl hover:bg-gray-200 dark:hover:bg-slate-700 font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#FFC000] hover:bg-[#e6ad00] text-black font-black rounded-xl cursor-pointer"
                  >
                    Confirm & Add
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
