import React from "react";
import { Compass, Mail, Phone, MapPin, Shield, Star, Globe, Heart } from "lucide-react";

interface FooterProps {
  onNavigate: (view: string) => void;
  onSearchCity: (city: string) => void;
}

export default function Footer({ onNavigate, onSearchCity }: FooterProps) {
  const popularStates = [
    { name: "Rajasthan", city: "Jaipur" },
    { name: "Karnataka", city: "Bangalore" },
    { name: "Telangana", city: "Hyderabad" },
    { name: "Maharashtra", city: "Mumbai" },
    { name: "Goa", city: "Goa" },
    { name: "Delhi NCR", city: "Delhi" }
  ];

  const categories = [
    { label: "Luxury Hotels", query: "luxury hotels" },
    { label: "Budget Hotels", query: "budget hotels" },
    { label: "Beach Resorts", query: "beach resorts" },
    { label: "Hill Resorts", query: "hill resorts" },
    { label: "Famous Food Stalls", query: "street food" },
    { label: "Ancient Temples", query: "ancient temples" }
  ];

  return (
    <footer className="bg-[#070235] text-gray-300 border-t border-indigo-950/80">
      {/* Upper Footer: Branding & Quick Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
        {/* Col 1: Brand pitch */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-indigo-800 to-orange-500 flex items-center justify-center text-white font-bold">
              <Compass className="w-5 h-5 text-orange-400" />
            </div>
            <span className="font-sans font-extrabold text-lg text-white tracking-tight">
              ExploreIndia
            </span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed font-sans font-normal max-w-xs">
            Discover the ultimate curated Indian travel and culinary wonders. From world-renowned Taj luxury resorts in Goa, to sizzling royal Hyderabadi biryanis and magnificent heritage palaces in Rajasthan.
          </p>
          <div className="flex gap-2 pt-2">
            <span className="inline-flex items-center gap-1 text-[10px] font-mono tracking-wider uppercase font-bold text-orange-400 bg-orange-950/40 px-2 py-1 rounded-md border border-orange-800/30">
              <Shield className="w-3.5 h-3.5 text-orange-400" /> Secure SSL Portal
            </span>
          </div>
        </div>

        {/* Col 2: Destination Links */}
        <div>
          <h4 className="text-white text-xs font-mono font-bold uppercase tracking-wider mb-4 border-l-2 border-orange-500 pl-2">
            Popular States
          </h4>
          <ul className="space-y-2 text-xs">
            {popularStates.map((state) => (
              <li key={state.name}>
                <button
                  onClick={() => onSearchCity(state.city)}
                  className="hover:text-white transition-colors hover:translate-x-1 duration-200 text-left text-gray-400 font-sans font-normal flex items-center gap-1.5 cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5 text-gray-500 group-hover:text-orange-400" />
                  {state.name} Discovery
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3: Categories */}
        <div>
          <h4 className="text-white text-xs font-mono font-bold uppercase tracking-wider mb-4 border-l-2 border-orange-500 pl-2">
            Travel Categories
          </h4>
          <ul className="space-y-2 text-xs">
            {categories.map((cat) => (
              <li key={cat.label}>
                <button
                  onClick={() => onSearchCity(cat.query)}
                  className="hover:text-white transition-colors hover:translate-x-1 duration-200 text-left text-gray-400 font-sans font-normal flex items-center gap-1.5 cursor-pointer"
                >
                  <Star className="w-3.5 h-3.5 text-orange-400" />
                  {cat.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 4: Reach Concierge */}
        <div className="space-y-4">
          <h4 className="text-white text-xs font-mono font-bold uppercase tracking-wider border-l-2 border-orange-500 pl-2">
            24/7 Royal Concierge
          </h4>
          <p className="text-xs text-gray-400 leading-relaxed font-sans font-normal">
            For premium customized travel planning, itinerary design, or corporate bookings:
          </p>
          <div className="space-y-2 text-xs font-sans font-normal text-gray-400">
            <a href="tel:+9118004193000" className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
              <Phone className="w-4 h-4 text-orange-400" />
              <span>+91 1800 419 3000 (Toll-Free)</span>
            </a>
            <a href="mailto:concierge@exploreindia.com" className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
              <Mail className="w-4 h-4 text-orange-400" />
              <span>concierge@exploreindia.com</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Footer: Credits */}
      <div className="bg-[#040121] py-6 border-t border-indigo-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 font-sans">
          <p className="text-center md:text-left">
            &copy; {new Date().getFullYear()} ExploreIndia Luxury Travel. All rights reserved.
          </p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <button onClick={() => onNavigate("privacy")} className="hover:text-gray-300 cursor-pointer">Privacy Policy</button>
            <span>&bull;</span>
            <button onClick={() => onNavigate("terms")} className="hover:text-gray-300 cursor-pointer">Terms of Service</button>
            <span>&bull;</span>
            <span className="flex items-center gap-1 text-orange-500/80">
              Made in India with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> for Global Travelers
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
