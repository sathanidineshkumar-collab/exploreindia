import React, { useEffect, useRef, useState } from "react";
import { Place, LatLng } from "../types";
import { MapPin, Navigation, Compass, Star, Map as MapIcon, Loader } from "lucide-react";
import { FALLBACK_IMAGE } from "../constants";

interface ExploreMapProps {
  places: Place[];
  selectedPlace: Place | null;
  onPlaceSelect: (place: Place) => void;
  onPlaceDetailsNavigate?: (place: Place) => void;
  center: LatLng;
  zoom?: number;
  showDirections?: boolean;
  theme?: string;
}

declare const L: any; // Leaflet global declaration

export default function ExploreMap({
  places,
  selectedPlace,
  onPlaceSelect,
  onPlaceDetailsNavigate,
  center,
  zoom = 12,
  showDirections = false,
  theme = "light"
}: ExploreMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  const markersGroupRef = useRef<any>(null);
  const routePolylineRef = useRef<any>(null);
  const [isLeafletLoaded, setIsLeafletLoaded] = useState(false);

  // 1. Dynamic CDN Loading of Leaflet JS & CSS
  useEffect(() => {
    const cleanup = () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };

    if (typeof L !== "undefined") {
      setIsLeafletLoaded(true);
      return cleanup;
    }

    // Load Leaflet CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
    link.crossOrigin = "";
    document.head.appendChild(link);

    // Load Leaflet JS
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";
    script.crossOrigin = "";
    script.onload = () => {
      setIsLeafletLoaded(true);
    };
    document.head.appendChild(script);

    return cleanup;
  }, []);

  // 2. Initialize Leaflet Map
  useEffect(() => {
    if (!isLeafletLoaded || !mapContainerRef.current) return;

    if (!leafletMapRef.current) {
      // Initialize map instance
      leafletMapRef.current = L.map(mapContainerRef.current, {
        zoomControl: false // Custom zoom placement
      }).setView([center.lat, center.lng], zoom);

      // Add zoom control at bottom-right
      L.control.zoom({ position: "bottomright" }).addTo(leafletMapRef.current);

      // Initialize layer group for markers
      markersGroupRef.current = L.featureGroup().addTo(leafletMapRef.current);
    } else {
      // Smoothly update center when city changes
      leafletMapRef.current.setView([center.lat, center.lng], zoom);
    }
  }, [isLeafletLoaded, center, zoom]);

  // 2b. Dynamic Tile Layer based on Dark Mode theme
  useEffect(() => {
    if (!isLeafletLoaded || !leafletMapRef.current) return;

    if (tileLayerRef.current) {
      tileLayerRef.current.remove();
    }

    const tileUrl = theme === "dark" 
      ? "https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

    tileLayerRef.current = L.tileLayer(tileUrl, {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(leafletMapRef.current);
  }, [theme, isLeafletLoaded]);

  // 3. Render Custom Pins & Markers
  useEffect(() => {
    if (!isLeafletLoaded || !leafletMapRef.current || !markersGroupRef.current) return;

    // Clear previous markers
    markersGroupRef.current.clearLayers();

    // Clear previous route if any
    if (routePolylineRef.current) {
      routePolylineRef.current.remove();
      routePolylineRef.current = null;
    }

    // Draw route polyline from center to selected place if requested
    if (showDirections && selectedPlace) {
      const start = [center.lat, center.lng];
      const end = [selectedPlace.coordinates.lat, selectedPlace.coordinates.lng];
      
      routePolylineRef.current = L.polyline([start, end], {
        color: "#f97316", // Tailwind orange-500
        weight: 4,
        dashArray: "8, 8",
        opacity: 0.8
      }).addTo(leafletMapRef.current);
      
      // Fit bounds to show both endpoints
      const bounds = L.latLngBounds([start, end]);
      leafletMapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }

    const getMarkerColor = (type: string) => {
      switch (type) {
        case "hotel": return "#3b82f6"; // blue
        case "restaurant": return "#ef4444"; // red
        case "resort": return "#10b981"; // green
        case "cafe": return "#f59e0b"; // amber
        case "attraction": return "#8b5cf6"; // purple
        case "temple": return "#f97316"; // orange
        default: return "#6b7280";
      }
    };

    // Helper to return icon html based on type
    const getMarkerHtml = (type: string, isSelected: boolean) => {
      const color = getMarkerColor(type);
      const pulseClass = isSelected ? "animate-ping opacity-75" : "";
      const scaleClass = isSelected ? "scale-125 z-50 ring-4 ring-orange-400" : "hover:scale-110";
      
      let symbol = "📍";
      if (type === "hotel") symbol = "🏨";
      else if (type === "restaurant") symbol = "🍛";
      else if (type === "resort") symbol = "🌴";
      else if (type === "cafe") symbol = "☕";
      else if (type === "attraction") symbol = "🏰";
      else if (type === "temple") symbol = "🛕";

      return `
        <div class="relative flex items-center justify-center cursor-pointer transition-all duration-300 ${scaleClass}">
          ${isSelected ? `<span class="absolute inline-flex h-full w-full rounded-full bg-orange-400 ${pulseClass}"></span>` : ""}
          <div class="w-9 h-9 rounded-xl bg-white border-2 flex items-center justify-center text-sm shadow-md font-sans" style="border-color: ${color}">
            ${symbol}
          </div>
          <div class="absolute -bottom-1 w-2 h-2 rotate-45 border-r border-b" style="background-color: ${color}; border-color: ${color}"></div>
        </div>
      `;
    };

    // Plot places
    places.forEach((place) => {
      const isSelected = selectedPlace?.id === place.id;
      const markerHtml = getMarkerHtml(place.type, isSelected);
      
      const customIcon = L.divIcon({
        html: markerHtml,
        className: "custom-leaflet-icon",
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -32]
      });

      const marker = L.marker([place.coordinates.lat, place.coordinates.lng], { icon: customIcon })
        .addTo(markersGroupRef.current);

      // Create beautiful custom Popup content
      const popupContent = `
        <div class="p-2.5 max-w-[220px] font-sans">
          <img src="${place.photos[0]}" class="w-full h-20 object-cover rounded-lg mb-1.5" onerror="this.onerror=null; this.src='${FALLBACK_IMAGE}'" />
          <h5 class="font-extrabold text-xs text-gray-900 dark:text-slate-100 mb-0.5 truncate">${place.name}</h5>
          <div class="flex items-center gap-1 mb-1">
            <span class="text-orange-500 font-bold text-xs flex items-center">★ ${place.rating}</span>
            <span class="text-[9px] text-gray-400 dark:text-slate-400">(${place.reviewCount} reviews)</span>
          </div>
          <p class="text-[10px] text-gray-500 dark:text-slate-400 line-clamp-2 leading-tight mb-2">${place.address}</p>
          <button class="w-full py-1 text-[10px] bg-indigo-950 dark:bg-orange-500 text-white font-bold rounded-md hover:bg-orange-500 dark:hover:bg-orange-600 transition-colors text-center cursor-pointer" id="btn-details-${place.id}">
            View Details
          </button>
        </div>
      `;

      marker.bindPopup(popupContent);

      // Listen to click to select on map
      marker.on("click", () => {
        onPlaceSelect(place);
      });

      // Hook up the detail button click in popup
      marker.on("popupopen", () => {
        const btn = document.getElementById(`btn-details-${place.id}`);
        if (btn) {
          btn.addEventListener("click", () => {
            if (onPlaceDetailsNavigate) {
              onPlaceDetailsNavigate(place);
            } else {
              onPlaceSelect(place);
            }
          });
        }
      });
    });

  }, [isLeafletLoaded, places, selectedPlace, showDirections, center]);

  // 4. Smooth Pan when selected place changes from details view
  useEffect(() => {
    if (!isLeafletLoaded || !leafletMapRef.current || !selectedPlace) return;
    
    // Pan smoothly
    leafletMapRef.current.setView(
      [selectedPlace.coordinates.lat, selectedPlace.coordinates.lng],
      15,
      { animate: true, duration: 1.0 }
    );
  }, [selectedPlace, isLeafletLoaded]);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-gray-200/60 dark:border-slate-800 shadow-md">
      {!isLeafletLoaded && (
        <div className="absolute inset-0 bg-gray-50/80 dark:bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
          <Loader className="w-10 h-10 text-[#070235] dark:text-orange-400 animate-spin mb-2" />
          <p className="text-xs text-gray-500 dark:text-gray-400 font-mono tracking-wider font-bold">
            LOADING CITY MAP...
          </p>
        </div>
      )}

      {/* Map Division */}
      <div id="leaflet-map" ref={mapContainerRef} className="w-full h-full min-h-[300px] z-10" />

      {/* Floating Compass / Recenter */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        <button
          onClick={() => {
            if (leafletMapRef.current) {
              leafletMapRef.current.setView([center.lat, center.lng], zoom);
            }
          }}
          className="p-2.5 rounded-xl bg-white dark:bg-slate-800 shadow-lg border border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer text-[#070235] dark:text-orange-400"
          title="Recenter City Center"
        >
          <Compass className="w-5 h-5" />
        </button>

        {places.length > 0 && (
          <button
            onClick={() => {
              if (leafletMapRef.current && places.length > 0) {
                const bounds = L.latLngBounds(places.map(p => [p.coordinates.lat, p.coordinates.lng]));
                leafletMapRef.current.fitBounds(bounds, { padding: [40, 40] });
              }
            }}
            className="p-2.5 rounded-xl bg-white dark:bg-slate-800 shadow-lg border border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer text-indigo-600 dark:text-indigo-400"
            title="Fit All Places in City"
          >
            <Navigation className="w-5 h-5 fill-indigo-100 dark:fill-indigo-950" />
          </button>
        )}
      </div>

      <div className="absolute bottom-4 left-4 z-20 flex flex-wrap gap-2 pointer-events-none">
        <div className="flex gap-4 p-2 rounded-xl bg-white/95 dark:bg-slate-800/95 shadow-md border border-gray-100 dark:border-slate-700 text-[10px] font-sans font-medium flex-wrap">
          <span className="flex items-center gap-1 text-blue-600"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Hotels</span>
          <span className="flex items-center gap-1 text-green-600"><span className="w-2.5 h-2.5 rounded-full bg-green-500"></span> Resorts</span>
          <span className="flex items-center gap-1 text-red-600"><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Restaurants</span>
          <span className="flex items-center gap-1 text-purple-600"><span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> Attractions</span>
          <span className="flex items-center gap-1 text-orange-600"><span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> Temples</span>
        </div>
      </div>
    </div>
  );
}
