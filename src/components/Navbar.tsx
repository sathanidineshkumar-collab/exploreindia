import React, { useState, useEffect } from "react";
import { 
  Compass, Bell, User as UserIcon, LogOut, Shield, 
  MapPin, Heart, History, Settings, Sun, Moon, Sparkles, Menu, X 
} from "lucide-react";
import { User, Notification } from "../types";

interface NavbarProps {
  user: User | null;
  onNavigate: (view: string, data?: any) => void;
  activeView: string;
  onLogout: () => void;
  onOpenAuth: () => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

export default function Navbar({
  user,
  onNavigate,
  activeView,
  onLogout,
  onOpenAuth,
  theme,
  onToggleTheme
}: NavbarProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Fetch notifications if logged in
  useEffect(() => {
    if (user) {
      fetch("/api/notifications", {
        headers: { "Authorization": `Bearer ${user.token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setNotifications(data);
        })
        .catch(err => console.error("Failed to load notifications", err));
    }
  }, [user]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = async () => {
    if (!user) return;
    try {
      await fetch("/api/notifications/read-all", {
        method: "POST",
        headers: { "Authorization": `Bearer ${user.token}` }
      });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (e) {
      console.error(e);
    }
  };

  const navLinks = [
    { view: "home", label: "Home" },
    { view: "search", label: "Explore" },
    { view: "profile-favorites", label: "Trips" },
    { view: "tips", label: "Travel Tips" }
  ];

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-gray-200/50 dark:border-slate-800/50 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button 
              onClick={() => onNavigate("home")} 
              className="flex items-center gap-2 cursor-pointer focus:outline-none group"
            >
              <div className="w-10 h-10 group-hover:scale-105 transition-all shrink-0">
                <svg className="w-10 h-10" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="46" stroke="#004F32" strokeWidth="6" fill="#FFFFFF" />
                  {/* Left eye circle */}
                  <circle cx="36" cy="48" r="14" stroke="black" strokeWidth="3.5" fill="#34E0A1" />
                  <circle cx="36" cy="48" r="5" fill="black" />
                  {/* Right eye circle */}
                  <circle cx="64" cy="48" r="14" stroke="black" strokeWidth="3.5" fill="#34E0A1" />
                  <circle cx="64" cy="48" r="5" fill="black" />
                  {/* Beak */}
                  <polygon points="50,54 44,66 56,66" fill="#FFC000" stroke="black" strokeWidth="1.5" />
                </svg>
              </div>
              <div className="flex flex-col text-left">
                <span className="font-sans font-extrabold text-xl tracking-tight bg-gradient-to-r from-[#004F32] via-[#00AA6C] to-emerald-600 dark:from-white dark:to-[#34E0A1] bg-clip-text text-transparent">
                  ExploreIndia
                </span>
                <span className="text-[9px] font-mono tracking-wider text-gray-500 dark:text-gray-400 uppercase -mt-1 font-bold">
                  TripAdvisor-Style Portal
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-4">
            {navLinks.map((link) => (
              <button
                key={link.view}
                onClick={() => {
                  if (link.view === "profile-favorites" && !user) {
                    onOpenAuth();
                  } else {
                    onNavigate(link.view);
                  }
                }}
                className={`px-3 py-2 rounded-lg font-sans text-sm font-medium transition-all ${
                  activeView === link.view || (link.view === "profile-favorites" && activeView === "profile")
                    ? "text-[#004F32] dark:text-[#34E0A1] font-semibold bg-gray-100 dark:bg-slate-800"
                    : "text-gray-600 dark:text-gray-300 hover:text-[#004F32] dark:hover:text-[#34E0A1] hover:bg-gray-50 dark:hover:bg-slate-800"
                }`}
              >
                {link.label}
              </button>
            ))}
            {user?.role === "admin" && (
              <button
                onClick={() => onNavigate("admin")}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg font-sans text-sm font-semibold text-orange-600 dark:text-[#34E0A1] hover:bg-orange-50 dark:hover:bg-slate-800 transition-all ${
                  activeView === "admin" ? "bg-orange-100/50 dark:bg-slate-800" : ""
                }`}
              >
                <Shield className="w-4 h-4" /> Admin Panel
              </button>
            )}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
              title="Toggle dark mode"
            >
              {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-yellow-400" />}
            </button>

            {/* Notifications */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    setShowUserMenu(false);
                  }}
                  className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all cursor-pointer relative"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white font-bold text-[10px] rounded-full flex items-center justify-center animate-bounce">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 rounded-2xl glass-panel border border-gray-200/50 dark:border-slate-800 shadow-xl overflow-hidden z-50">
                    <div className="p-4 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
                      <h4 className="font-semibold text-sm text-gray-800 dark:text-white">Notifications</h4>
                      {unreadCount > 0 && (
                        <button 
                          onClick={handleMarkAllRead} 
                          className="text-xs text-indigo-600 dark:text-orange-400 hover:underline"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-64 overflow-y-auto p-2 space-y-1">
                      {notifications.length === 0 ? (
                        <div className="text-center py-6 text-gray-500 dark:text-gray-400 text-xs">
                          No notifications yet.
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div 
                            key={notif.id} 
                            className={`p-3 rounded-xl text-xs transition-all ${
                              notif.read ? "bg-transparent text-gray-600 dark:text-gray-400" : "bg-indigo-50/50 dark:bg-slate-800/50 text-gray-800 dark:text-white font-medium"
                            }`}
                          >
                            <p>{notif.text}</p>
                            <span className="text-[10px] text-gray-400 block mt-1">
                              {new Date(notif.date).toLocaleDateString()}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Account / Login */}
            {user ? (
              <div className="relative flex items-center gap-3">
                <button
                  onClick={() => {
                    setShowUserMenu(!showUserMenu);
                    setShowNotifications(false);
                  }}
                  className="flex items-center gap-2 p-1.5 rounded-xl border border-gray-200/80 dark:border-slate-700/80 hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#070235] to-indigo-900 dark:from-indigo-600 dark:to-indigo-500 flex items-center justify-center text-white text-xs font-black shadow-md border border-white/20">
                    {(user.name || "U").charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline font-sans font-medium text-xs text-gray-700 dark:text-gray-200">
                    {(user.name || "").split(" ")[0] || "User"}
                  </span>
                </button>

                <button
                  onClick={onLogout}
                  className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/20 dark:text-red-400 text-xs font-bold transition-all cursor-pointer border border-red-100 dark:border-red-900/50"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl glass-panel border border-gray-200/50 dark:border-slate-800 shadow-xl overflow-hidden z-50">
                    <div className="p-4 border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/50">
                      <p className="text-xs text-gray-400">Signed in as</p>
                      <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 text-[9px] font-mono tracking-wider uppercase font-semibold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 rounded-full">
                        {user.role}
                      </span>
                    </div>
                    <div className="p-1 space-y-0.5">
                      <button
                        onClick={() => { onNavigate("profile"); setShowUserMenu(false); }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all"
                      >
                        <UserIcon className="w-4 h-4 text-gray-400" /> My Profile & Favorites
                      </button>
                      <button
                        onClick={() => { onNavigate("profile", { tab: "history" }); setShowUserMenu(false); }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all"
                      >
                        <History className="w-4 h-4 text-gray-400" /> Search History
                      </button>
                      <button
                        onClick={() => { onNavigate("profile", { tab: "favorites" }); setShowUserMenu(false); }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all"
                      >
                        <Heart className="w-4 h-4 text-gray-400" /> Favorites List
                      </button>
                    </div>
                    <div className="p-1 border-t border-gray-100 dark:border-slate-800">
                      <button
                        onClick={() => { onLogout(); setShowUserMenu(false); }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#070235] to-[#1e1b4b] dark:from-indigo-600 dark:to-orange-500 hover:opacity-90 active:scale-98 text-white font-sans text-xs font-semibold shadow-md transition-all cursor-pointer"
              >
                <UserIcon className="w-4 h-4" /> Sign In
              </button>
            )}

            {/* Mobile Menu Icon */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-gray-100 dark:border-slate-800/60 p-4 space-y-2 animate-fade-in">
          {navLinks.map((link) => (
            <button
              key={link.view}
              onClick={() => {
                setMobileMenuOpen(false);
                if (link.view === "profile-favorites" && !user) {
                  onOpenAuth();
                } else {
                  onNavigate(link.view);
                }
              }}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeView === link.view || (link.view === "profile-favorites" && activeView === "profile")
                  ? "bg-gray-100 dark:bg-slate-800 text-[#004F32] dark:text-[#34E0A1] font-semibold"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800"
              }`}
            >
              {link.label}
            </button>
          ))}
          {user?.role === "admin" && (
            <button
              onClick={() => { onNavigate("admin"); setMobileMenuOpen(false); }}
              className="w-full text-left flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/25 transition-all"
            >
              <Shield className="w-4 h-4" /> Admin Panel
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
