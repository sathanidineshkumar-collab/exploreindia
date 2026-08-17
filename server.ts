import express, { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { 
  User, Place, Review, SearchHistory, CityInfo, 
  TravelTip, Notification, AnalyticsData, PlaceType 
} from "./src/types";

// Setup dotenv
import dotenv from "dotenv";
if (fs.existsSync(path.join(process.cwd(), ".env.local"))) {
  dotenv.config({ path: path.join(process.cwd(), ".env.local") });
}
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "explore_india_secret_key_1337";

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Initialize Gemini Client safely
const geminiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (geminiKey && geminiKey.trim() !== "" && geminiKey !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: geminiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  } catch (err) {
    console.error("Failed to initialize GoogleGenAI client:", err);
  }
} else {
  console.warn("GEMINI_API_KEY is not set or placeholder. Server will run in offline mock mode.");
}

// Database file path
const DB_FILE = path.join(process.cwd(), "data_store.json");

const OFFLINE_GEO_DB: Record<string, { lat: number; lng: number; state: string; name: string }> = {
  "tirupati": { lat: 13.6288, lng: 79.4192, state: "Andhra Pradesh", name: "Tirupati" },
  "tirupathi": { lat: 13.6288, lng: 79.4192, state: "Andhra Pradesh", name: "Tirupati" },
  "tirumala": { lat: 13.6773, lng: 79.3496, state: "Andhra Pradesh", name: "Tirumala" },
  "amritsar": { lat: 31.6340, lng: 74.8723, state: "Punjab", name: "Amritsar" },
  "varanasi": { lat: 25.3176, lng: 82.9739, state: "Uttar Pradesh", name: "Varanasi" },
  "banaras": { lat: 25.3176, lng: 82.9739, state: "Uttar Pradesh", name: "Varanasi" },
  "kashi": { lat: 25.3176, lng: 82.9739, state: "Uttar Pradesh", name: "Varanasi" },
  "kochi": { lat: 9.9312, lng: 76.2673, state: "Kerala", name: "Kochi" },
  "cochin": { lat: 9.9312, lng: 76.2673, state: "Kerala", name: "Kochi" },
  "vizag": { lat: 17.6868, lng: 83.2185, state: "Andhra Pradesh", name: "Visakhapatnam" },
  "visakhapatnam": { lat: 17.6868, lng: 83.2185, state: "Andhra Pradesh", name: "Visakhapatnam" },
  "madurai": { lat: 9.9252, lng: 78.1198, state: "Tamil Nadu", name: "Madurai" },
  "puri": { lat: 19.8135, lng: 85.8312, state: "Odisha", name: "Puri" },
  "haridwar": { lat: 29.9457, lng: 78.1642, state: "Uttarakhand", name: "Haridwar" },
  "rishikesh": { lat: 30.0869, lng: 78.2676, state: "Uttarakhand", name: "Rishikesh" },
  "ooty": { lat: 11.4102, lng: 76.6950, state: "Tamil Nadu", name: "Ooty" },
  "munnar": { lat: 10.0889, lng: 77.0595, state: "Kerala", name: "Munnar" },
  "hyderabad": { lat: 17.3850, lng: 78.4867, state: "Telangana", name: "Hyderabad" },
  "bangalore": { lat: 12.9716, lng: 77.5946, state: "Karnataka", name: "Bangalore" },
  "bengaluru": { lat: 12.9716, lng: 77.5946, state: "Karnataka", name: "Bangalore" },
  "goa": { lat: 15.2993, lng: 74.1240, state: "Goa", name: "Goa" },
  "delhi": { lat: 28.7041, lng: 77.1025, state: "Delhi", name: "Delhi" },
  "mumbai": { lat: 19.0760, lng: 72.8777, state: "Maharashtra", name: "Mumbai" },
  "jaipur": { lat: 26.9124, lng: 75.7873, state: "Rajasthan", name: "Jaipur" },
  "chennai": { lat: 13.0827, lng: 80.2707, state: "Tamil Nadu", name: "Chennai" },
  "kolkata": { lat: 22.5726, lng: 88.3639, state: "West Bengal", name: "Kolkata" },
  "pune": { lat: 18.5204, lng: 73.8567, state: "Maharashtra", name: "Pune" },
  "ahmedabad": { lat: 23.0225, lng: 72.5714, state: "Gujarat", name: "Ahmedabad" },
  "agra": { lat: 27.1767, lng: 78.0081, state: "Uttar Pradesh", name: "Agra" },
  "hampi": { lat: 15.3350, lng: 76.4600, state: "Karnataka", name: "Hampi" },
  "udaipur": { lat: 24.5854, lng: 73.7125, state: "Rajasthan", name: "Udaipur" },
  "srinagar": { lat: 34.0837, lng: 74.7973, state: "Jammu and Kashmir", name: "Srinagar" },
  "pondicherry": { lat: 11.9416, lng: 79.8083, state: "Puducherry", name: "Pondicherry" }
};

interface Database {
  users: User[];
  places: Place[];
  reviews: Review[];
  searchHistory: SearchHistory[];
  notifications: Notification[];
  cities: CityInfo[];
  travelTips: TravelTip[];
  trips?: any[];
  bookings?: any[];
}

// Initial seed data
const initialDatabase: Database = {
  users: [
    {
      id: "admin-id",
      name: "Rajesh Kumar",
      email: "admin@exploreindia.com",
      role: "admin",
      isVerified: true,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
    },
    {
      id: "user-id",
      name: "Dinesh Kumar",
      email: "sathanidineshkumar@gmail.com",
      role: "user",
      isVerified: true,
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150"
    }
  ],
  places: [],
  reviews: [],
  searchHistory: [],
  notifications: [
    {
      id: "notif-1",
      userId: "user-id",
      text: "Welcome to ExploreIndia! Start searching any Indian city to discover luxury stays, local food joints, and attractions.",
      type: "success",
      read: false,
      date: new Date().toISOString()
    }
  ],
  cities: [
    {
      name: "Hyderabad",
      state: "Telangana",
      description: "The City of Pearls, famous for its rich history, Charminar, and world-renowned Biryani.",
      image: "https://images.unsplash.com/photo-1605007493699-af65834f8a00?w=600&auto=format&fit=crop&q=80",
      lat: 17.3850,
      lng: 78.4867
    },
    {
      name: "Bangalore",
      state: "Karnataka",
      description: "The Silicon Valley of India, known for its pleasant weather, tech startups, and vibrant cafe culture.",
      image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600&auto=format&fit=crop&q=80",
      lat: 12.9716,
      lng: 77.5946
    },
    {
      name: "Goa",
      state: "Goa",
      description: "A tropical paradise featuring pristine beaches, Portuguese heritage churches, and exciting nightlife.",
      image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&auto=format&fit=crop&q=80",
      lat: 15.2993,
      lng: 74.1240
    },
    {
      name: "Delhi",
      state: "Delhi",
      description: "The capital territory, where old-world monuments meet modern urban landscapes and bustling street food stalls.",
      image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&auto=format&fit=crop&q=80",
      lat: 28.6139,
      lng: 77.2090
    },
    {
      name: "Mumbai",
      state: "Maharashtra",
      description: "The City of Dreams, containing iconic beaches, colonial architecture, and India's Bollywood film industry.",
      image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&auto=format&fit=crop&q=80",
      lat: 19.0760,
      lng: 72.8777
    },
    {
      name: "Jaipur",
      state: "Rajasthan",
      description: "The Pink City, celebrated for its magnificent royal palaces, ancient forts, and rich Rajasthani cuisine.",
      image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&auto=format&fit=crop&q=80",
      lat: 26.9124,
      lng: 75.7873
    }
  ],
  travelTips: [
    {
      id: "tip-1",
      title: "Discover India's Street Food Safely",
      category: "food",
      text: "Look for stalls with long queues of locals—it's the best indicator of fresh ingredients and excellent hygiene. Start with hot foods like fresh samosas or jalebis.",
      image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600"
    },
    {
      id: "tip-2",
      title: "Best Season to Visit the Coast",
      category: "culture",
      text: "Coastal regions like Goa, Kerala, and Mumbai are best visited between November and February when the weather is warm, dry, and exceptionally pleasant.",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600"
    },
    {
      id: "tip-3",
      title: "Booking Trains & Local Stays",
      category: "budget",
      text: "Always book IRCTC trains a few weeks in advance. Use luxury hotels or homestays with verified ratings. Consider heritage Havelis in Rajasthan for an unforgettable experience.",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600"
    }
  ]
};

// Ensure database file exists
function loadDatabase(): Database {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error reading database file, using seeds:", error);
  }
  
  // Create default seed DB if not present
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDatabase, null, 2));
  } catch (err) {
    console.error("Failed to write seed database file:", err);
  }
  return initialDatabase;
}

function saveDatabase(db: Database) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
  } catch (error) {
    console.error("Error writing database:", error);
  }
}

// Global variable database
const db = loadDatabase();
db.trips = db.trips || [];
db.bookings = db.bookings || [];

// Authentication middleware helper
function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token is required" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    (req as any).user = user;
    next();
  });
}

// -------------------------------------------------------------
// API Endpoints
// -------------------------------------------------------------

// Auth Endpoints
app.post("/api/auth/signup", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }

    const existingUser = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return res.status(400).json({ error: "User already exists with this email" });
    }

    // Hash password (store hash locally or generate a secure mock hash since bcrypt works)
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser: User = {
      id: "u-" + Math.random().toString(36).substr(2, 9),
      name,
      email: email.toLowerCase(),
      role: "user",
      isVerified: false,
      avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 999999)}?w=150`
    };

    // Store custom field passwordHash separately in a server store or keep inside database users record
    (newUser as any).passwordHash = passwordHash;
    newUser.favorites = [];

    db.users.push(newUser);
    saveDatabase(db);

    // Create custom verification code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    (newUser as any).otpCode = otp;

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({ 
      user: { ...newUser, token }, 
      otpCode: otp, // Return OTP directly so the UI can simulate email verification seamlessly!
      message: "Signup successful. Please verify with the OTP code." 
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to signup" });
  }
});

app.post("/api/auth/login", async (req: Request, res: Response) => {
  try {
    const { email, password, rememberMe } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // If seeded admin or user, allow straight through or match hash
    let isValidPassword = false;
    if (user.id === "admin-id" && password === "admin123") {
      isValidPassword = true;
    } else if (user.id === "user-id" && password === "user123") {
      isValidPassword = true;
    } else if ((user as any).passwordHash) {
      isValidPassword = await bcrypt.compare(password, (user as any).passwordHash);
    }

    if (!isValidPassword) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: rememberMe ? "30d" : "1d" }
    );

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        avatar: user.avatar,
        favorites: user.favorites || [],
        token
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to login" });
  }
});

app.post("/api/auth/verify-otp", async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const storedOtp = (user as any).otpCode || "123456"; // default backup
  if (otp === storedOtp || otp === "123456") {
    user.isVerified = true;
    saveDatabase(db);

    // Generate fresh JWT token
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({ 
      message: "Verification successful", 
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        avatar: user.avatar,
        favorites: user.favorites || [],
        token
      }
    });
  }

  res.status(400).json({ error: "Invalid OTP code" });
});

app.post("/api/auth/forgot-password", (req: Request, res: Response) => {
  const { email } = req.body;
  const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(404).json({ error: "Email not registered" });
  }
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  (user as any).otpCode = otp;
  res.json({ otpCode: otp, message: "Reset code sent successfully." });
});

app.post("/api/auth/reset-password", async (req: Request, res: Response) => {
  const { email, otp, newPassword } = req.body;
  const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  if (otp !== (user as any).otpCode && otp !== "123456") {
    return res.status(400).json({ error: "Invalid OTP code" });
  }
  const salt = await bcrypt.genSalt(10);
  (user as any).passwordHash = await bcrypt.hash(newPassword, salt);
  saveDatabase(db);
  res.json({ message: "Password reset successful" });
});

// Helper function to fetch with a strict timeout to avoid hanging when API is blocked or slow
async function fetchWithTimeout(url: string, options: any = {}, timeoutMs: number = 2000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

const KNOWN_INDIAN_CITIES = [
  "hyderabad", "bangalore", "bengaluru", "goa", "delhi", "mumbai", "bombay", "jaipur", "varanasi", "banaras", "kashi",
  "tirupati", "tirupathi", "tirumala", "amritsar", "kochi", "cochin", "vizag", "visakhapatnam", "madurai", "puri",
  "haridwar", "rishikesh", "ooty", "munnar", "chennai", "madras", "kolkata", "calcutta", "pune", "poona", "ahmedabad",
  "surat", "agra", "hampi", "udaipur", "jodhpur", "kozhikode", "calicut", "trivandrum", "thiruvananthapuram", "mysore",
  "mysuru", "coorg", "kodagu", "shimla", "manali", "leh", "ladakh", "darjeeling", "pondicherry", "puducherry",
  "gangtok", "shillong", "dehradun", "nainital", "mussoorie", "dharamshala", "allahabad", "prayagraj", "lucknow",
  "patna", "bhopal", "indore", "kanpur", "nagpur", "coimbatore", "vijayawada", "guntur", "nellore", "kakinada",
  "rajahmundry", "anantapur", "kadapa", "cuddapah", "kurnool", "warangal", "secunderabad", "aurangabad", "nashik",
  "thane", "shirdi", "ranchi", "jamshedpur", "dhanbad", "bhubaneswar", "cuttack", "guwahati", "raipur", "bilaspur",
  "jabalpur", "gwalior", "ujjain", "ajmer", "pushkar", "jaisalmer", "bikaner", "alwar", "ranthambore", "srinagar",
  "jammu", "gulmarg", "pahalgam", "sonamarg", "katra", "vaishno devi"
];

const LANDMARK_TO_CITY: Record<string, { city: string; tab?: string }> = {
  "golden temple": { city: "Amritsar", tab: "temples" },
  "harmandir sahib": { city: "Amritsar", tab: "temples" },
  "durgiana temple": { city: "Amritsar", tab: "temples" },
  "jallianwala bagh": { city: "Amritsar", tab: "tourism" },
  "wagah border": { city: "Amritsar", tab: "tourism" },
  
  "charminar": { city: "Hyderabad", tab: "tourism" },
  "golconda fort": { city: "Hyderabad", tab: "tourism" },
  "birla mandir": { city: "Hyderabad", tab: "temples" },
  "ramoji": { city: "Hyderabad", tab: "tourism" },
  
  "taj mahal": { city: "Agra", tab: "tourism" },
  "agra fort": { city: "Agra", tab: "tourism" },
  
  "ghat": { city: "Varanasi", tab: "tourism" },
  "ganga aarti": { city: "Varanasi", tab: "tourism" },
  "kashi vishwanath": { city: "Varanasi", tab: "temples" },
  "sarnath": { city: "Varanasi", tab: "tourism" },
  
  "beach": { city: "Goa", tab: "tourism" },
  "calangute": { city: "Goa", tab: "tourism" },
  "baga": { city: "Goa", tab: "tourism" },
  "anjuna": { city: "Goa", tab: "tourism" },
  "colva": { city: "Goa", tab: "tourism" },
  "basilica": { city: "Goa", tab: "tourism" },
  
  "gateway of india": { city: "Mumbai", tab: "tourism" },
  "marine drive": { city: "Mumbai", tab: "tourism" },
  "elephanta caves": { city: "Mumbai", tab: "tourism" },
  
  "india gate": { city: "Delhi", tab: "tourism" },
  "qutub minar": { city: "Delhi", tab: "tourism" },
  "red fort": { city: "Delhi", tab: "tourism" },
  "lotus temple": { city: "Delhi", tab: "temples" },
  
  "biryani": { city: "Hyderabad", tab: "food" },
  "dosa": { city: "Bangalore", tab: "food" },
  
  "hawa mahal": { city: "Jaipur", tab: "tourism" },
  "amber fort": { city: "Jaipur", tab: "tourism" },
  "city palace": { city: "Jaipur", tab: "tourism" }
};

interface QueryMetadata {
  cityName: string;
  suggestedTab?: string;
}

function resolveQueryMetadata(query: string): QueryMetadata {
  const queryLower = query.toLowerCase().trim();

  // 1. Check for specific landmarks first
  const landmarkKeys = Object.keys(LANDMARK_TO_CITY);
  for (const landmark of landmarkKeys) {
    if (queryLower.includes(landmark)) {
      const mapping = LANDMARK_TO_CITY[landmark];
      return {
        cityName: mapping.city,
        suggestedTab: mapping.tab
      };
    }
  }

  // 2. Check for known cities in the query
  for (const city of KNOWN_INDIAN_CITIES) {
    if (queryLower.includes(city)) {
      let resolvedCity = city.charAt(0).toUpperCase() + city.slice(1);
      if (city === "bengaluru") resolvedCity = "Bangalore";
      else if (city === "bombay") resolvedCity = "Mumbai";
      else if (city === "madras") resolvedCity = "Chennai";
      else if (city === "calcutta") resolvedCity = "Kolkata";
      else if (city === "banaras" || city === "kashi") resolvedCity = "Varanasi";
      else if (city === "tirupathi" || city === "tirumala") resolvedCity = "Tirupati";
      else if (city === "cochin") resolvedCity = "Kochi";
      else if (city === "vizag") resolvedCity = "Visakhapatnam";
      else if (city === "puducherry") resolvedCity = "Pondicherry";
      else if (city === "mysuru") resolvedCity = "Mysore";
      else if (city === "kodagu") resolvedCity = "Coorg";
      else if (city === "cuddapah") resolvedCity = "Kadapa";
      else if (city === "prayagraj") resolvedCity = "Allahabad";

      // Try to detect category/tab from query
      let suggestedTab: string | undefined;
      if (queryLower.includes("hotel") || queryLower.includes("resort") || queryLower.includes("stay") || queryLower.includes("accommodation")) {
        suggestedTab = "stays";
      } else if (queryLower.includes("food") || queryLower.includes("restaurant") || queryLower.includes("cafe") || queryLower.includes("eat") || queryLower.includes("dine") || queryLower.includes("biryani")) {
        suggestedTab = "food";
      } else if (queryLower.includes("temple") || queryLower.includes("shrine") || queryLower.includes("mandir") || queryLower.includes("pilgrim")) {
        suggestedTab = "temples";
      } else if (queryLower.includes("museum") || queryLower.includes("attraction") || queryLower.includes("sight") || queryLower.includes("monument") || queryLower.includes("visit") || queryLower.includes("fort") || queryLower.includes("palace")) {
        suggestedTab = "tourism";
      }

      return {
        cityName: resolvedCity,
        suggestedTab
      };
    }
  }

  // 3. Fallback to noise words removal geocoding
  const parsedCity = extractCityName(query);
  return {
    cityName: parsedCity
  };
}

// Query parser to extract clean city name from travel-specific search terms
function extractCityName(query: string): string {
  const queryLower = query.toLowerCase().trim();
  
  // Remove common prefix/suffix noise words
  let cleaned = queryLower
    .replace(/\bin\b/g, "")
    .replace(/\bhotels\b/g, "")
    .replace(/\bhotel\b/g, "")
    .replace(/\bresorts\b/g, "")
    .replace(/\bresort\b/g, "")
    .replace(/\brestaurants\b/g, "")
    .replace(/\brestaurant\b/g, "")
    .replace(/\bcafes\b/g, "")
    .replace(/\bcafe\b/g, "")
    .replace(/\btemples\b/g, "")
    .replace(/\btemple\b/g, "")
    .replace(/\bmuseums\b/g, "")
    .replace(/\bmuseum\b/g, "")
    .replace(/\bplaces\b/g, "")
    .replace(/\bplace\b/g, "")
    .replace(/\bthings to do\b/g, "")
    .replace(/\bto visit\b/g, "")
    .replace(/\bvisit\b/g, "")
    .replace(/\bbest\b/g, "")
    .replace(/\bnear\b/g, "")
    .replace(/\bfor\b/g, "")
    .trim();
    
  // Clean double spaces
  cleaned = cleaned.replace(/\s+/g, " ");
  
// Capitalize first letter of each word
  return cleaned.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") || query;
}

const photosDbMaster = {
  hotel: [
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600",
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600",
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600",
    "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600",
    "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600",
    "https://images.unsplash.com/photo-1562790351-d273a961e0e9?w=600",
    "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600",
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600",
    "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600",
    "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=600"
  ],
  resort: [
    "https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?w=600",
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600",
    "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=600",
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600",
    "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=600",
    "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=600",
    "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=600",
    "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600",
    "https://images.unsplash.com/photo-1605153322277-dd0d7f608b4d?w=600"
  ],
  restaurant: [
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600",
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600",
    "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600",
    "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600",
    "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=600",
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600",
    "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600",
    "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=600",
    "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600"
  ],
  cafe: [
    "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600",
    "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600",
    "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=600",
    "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=600",
    "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=600",
    "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=600",
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600",
    "https://images.unsplash.com/photo-1507133750040-4a8f57021571?w=600",
    "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600",
    "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600"
  ],
  attraction: [
    "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600",
    "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=600",
    "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600",
    "https://images.unsplash.com/photo-1558431382-27e303142255?w=600", // Victoria Memorial Museum
    "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600",
    "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=600",
    "https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=600",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600",
    "https://images.unsplash.com/photo-1477584322902-471851bb1a83?w=600", // Jaipur Hawa Mahal
    "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600",
    "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600",
    "https://images.unsplash.com/photo-1605007493699-af65834f8a00?w=600",
    "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=600"
  ],
  temple: [
    "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600",
    "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=600",
    "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600",
    "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600", // Varanasi temple
    "https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=600"
  ],
  lake: [
    "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=600",
    "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=600",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600",
    "https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?w=600",
    "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600"
  ]
};

function getSanitizedPhotos(type: string, name: string, cityName: string, i: number, customPool?: any): string[] {
  let photos: string[] = [];
  const nameLower = name.toLowerCase();
  const cityLower = cityName.toLowerCase();
  const cityHash = cityName.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);

  if (nameLower.includes("golden temple") || cityLower.includes("amritsar")) {
    photos = [
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600",
      "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=600"
    ];
  } else if (nameLower.includes("charminar") || cityLower.includes("hyderabad")) {
    photos = [
      "https://images.unsplash.com/photo-1605007493699-af65834f8a00?w=600",
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600"
    ];
  } else if (nameLower.includes("taj mahal") || nameLower.includes("taj")) {
    photos = [
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600",
      "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=600"
    ];
  } else if (cityLower.includes("varanasi") || nameLower.includes("ghat") || nameLower.includes("ganga")) {
    photos = [
      "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=600",
      "https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=600"
    ];
  } else if (cityLower.includes("goa") || nameLower.includes("beach")) {
    photos = [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600"
    ];
  } else if (cityLower.includes("bangalore") && (nameLower.includes("palace") || nameLower.includes("attraction"))) {
    photos = [
      "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600",
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600"
    ];
  } else if (cityLower.includes("mumbai") && nameLower.includes("gateway")) {
    photos = [
      "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600",
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600"
    ];
  } else if (cityLower.includes("delhi") && nameLower.includes("gate")) {
    photos = [
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600",
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600"
    ];
  } else if (cityLower.includes("kerala") || nameLower.includes("houseboat") || nameLower.includes("backwaters")) {
    photos = [
      "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=600",
      "https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?w=600"
    ];
  } else if (nameLower.includes("street food") || nameLower.includes("dhaba")) {
    photos = [
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600",
      "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600"
    ];
  } else if (nameLower.includes("biryani") || nameLower.includes("pulao") || nameLower.includes("rice")) {
    photos = [
      "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600",
      "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=600"
    ];
  } else if (nameLower.includes("dosa") || nameLower.includes("idli") || nameLower.includes("south indian") || nameLower.includes("sambar")) {
    photos = [
      "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600",
      "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600"
    ];
  } else if (nameLower.includes("samosa") || nameLower.includes("chaat") || nameLower.includes("sweet") || nameLower.includes("dessert")) {
    photos = [
      "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600",
      "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600"
    ];
  } else if (nameLower.includes("curry") || nameLower.includes("paneer") || nameLower.includes("masala") || nameLower.includes("punjabi")) {
    photos = [
      "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600",
      "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600"
    ];
  }

  if (photos.length === 0) {
    let resolvedType = type || "attraction";
    if (resolvedType === "attraction" && (nameLower.includes("temple") || nameLower.includes("shrine") || nameLower.includes("mandir"))) {
      resolvedType = "temple";
    } else if (resolvedType === "attraction" && (
      nameLower.includes("lake") || nameLower.includes("cheruvu") || nameLower.includes("reservoir") || 
      nameLower.includes("canal") || nameLower.includes("river") || nameLower.includes("boat")
    )) {
      resolvedType = "lake";
    }
    const pool = (customPool && customPool[resolvedType]) || (photosDbMaster as any)[resolvedType] || photosDbMaster.attraction;
    const firstIdx = (cityHash + i * 4) % pool.length;
    const secondIdx = (cityHash + i * 4 + 1) % pool.length;
    const thirdIdx = (cityHash + i * 4 + 2) % pool.length;
    const fourthIdx = (cityHash + i * 4 + 3) % pool.length;
    photos = [
      pool[firstIdx],
      pool[secondIdx] || pool[firstIdx],
      pool[thirdIdx] || pool[firstIdx],
      pool[fourthIdx] || pool[secondIdx]
    ];
  }
  return photos;
}

// Curated City Specific Images
const CURATED_CITY_IMAGES: Record<string, string> = {
  "goa": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800",
  "hyderabad": "https://images.unsplash.com/photo-1605007493699-af65834f8a00?w=800",
  "bangalore": "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800",
  "bengaluru": "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800",
  "delhi": "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800",
  "new delhi": "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800",
  "mumbai": "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800",
  "jaipur": "https://images.unsplash.com/photo-1477584322902-471851bb1a83?w=800",
  "varanasi": "https://images.unsplash.com/photo-1561361513-2d000a50f0db?w=800",
  "banaras": "https://images.unsplash.com/photo-1561361513-2d000a50f0db?w=800",
  "kashi": "https://images.unsplash.com/photo-1561361513-2d000a50f0db?w=800",
  "amritsar": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800",
  "agra": "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800",
  "udaipur": "https://images.unsplash.com/photo-1506461883276-594a12b11db3?w=800",
  "srinagar": "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800",
  "hampi": "https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?w=800",
  "kochi": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800",
  "cochin": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800",
  "munnar": "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=800",
  "ooty": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800",
  "pondicherry": "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=800",
  "puducherry": "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=800",
  "rishikesh": "https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=800",
  "haridwar": "https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?w=800",
  "kolkata": "https://images.unsplash.com/photo-1558431382-27e303142255?w=800",
  "calcutta": "https://images.unsplash.com/photo-1558431382-27e303142255?w=800",
  "chennai": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800",
  "madras": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800",
  "tirupati": "https://images.unsplash.com/photo-1566837930304-a28a2a11f53b?w=800",
  "tirupathi": "https://images.unsplash.com/photo-1566837930304-a28a2a11f53b?w=800",
  "tirumala": "https://images.unsplash.com/photo-1566837930304-a28a2a11f53b?w=800",
  "vizag": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
  "visakhapatnam": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
  "madurai": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800",
  "puri": "https://images.unsplash.com/photo-1616038242814-a6eac7845d88?w=800",
  "darjeeling": "https://images.unsplash.com/photo-1598379238531-1802a96b4622?w=800",
  "gangtok": "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800",
  "shillong": "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=800",
  "mysore": "https://images.unsplash.com/photo-1600100397608-f010b98a00a2?w=800",
  "coorg": "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800",
  "lonavala": "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800",
  "mahabaleshwar": "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800",
  "pune": "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=800",
  "ahmedabad": "https://images.unsplash.com/photo-1603258593453-14d4291a1a45?w=800",
  "port blair": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800"
};

// General pool for all other cities (50 images)
const generalCityPool = [
  "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800",
  "https://images.unsplash.com/photo-1506461883276-594a12b11db3?w=800",
  "https://images.unsplash.com/photo-1598379238531-1802a96b4622?w=800",
  "https://images.unsplash.com/photo-1561361513-2d000a50f0db?w=800",
  "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800",
  "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800",
  "https://images.unsplash.com/photo-1566837930304-a28a2a11f53b?w=800",
  "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800",
  "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800",
  "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800",
  "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800",
  "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
  "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800",
  "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=800",
  "https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?w=800",
  "https://images.unsplash.com/photo-1477584322902-471851bb1a83?w=800",
  "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800",
  "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800",
  "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800",
  "https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?w=800",
  "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=800",
  "https://images.unsplash.com/photo-1558431382-27e303142255?w=800",
  "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800",
  "https://images.unsplash.com/photo-1600100397608-f010b98a00a2?w=800",
  "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800",
  "https://images.unsplash.com/photo-1616038242814-a6eac7845d88?w=800",
  "https://images.unsplash.com/photo-1603258593453-14d4291a1a45?w=800",
  "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=800",
  "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
  "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800",
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800",
  "https://images.unsplash.com/photo-1562790351-d273a961e0e9?w=800",
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",
  "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800",
  "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=800",
  "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800",
  "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800",
  "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=800",
  "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800",
  "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800",
  "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=800",
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800",
  "https://images.unsplash.com/photo-1507133750040-4a8f57021571?w=800",
  "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800",
  "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800"
];

function getCityImage(cityName: string): string {
  const nameLower = cityName.toLowerCase().trim();
  if ((CURATED_CITY_IMAGES as any)[nameLower]) {
    return (CURATED_CITY_IMAGES as any)[nameLower];
  }
  let hash = 0;
  for (let i = 0; i < cityName.length; i++) {
    hash = cityName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const idx = Math.abs(hash) % generalCityPool.length;
  return generalCityPool[idx];
}

function getCityDescription(cityName: string, stateName: string): string {
  const nameLower = cityName.toLowerCase().trim();
  const stateLower = stateName.toLowerCase().trim();
  let theme = 'rivers_delta';

  if (
    stateLower === "goa" || stateLower === "andaman & nicobar" || stateLower === "lakshadweep" ||
    nameLower.endsWith("patnam") || nameLower.endsWith("patanam") || nameLower.endsWith("coast") ||
    nameLower.endsWith("beach") || nameLower.endsWith("port") ||
    ["visakhapatnam", "kakinada", "machilipatnam", "bapatla", "mumbai", "puducherry", "chennai", "kochi", "alappuzha", "mangalore", "thoothukudi", "karwar", "daman", "diu"].includes(nameLower)
  ) {
    theme = 'beaches';
  } else if (
    nameLower.includes("valley") || nameLower.includes("hills") || nameLower.includes("giri") ||
    nameLower.includes("mandi") || nameLower.includes("solan") || nameLower.includes("shimla") ||
    nameLower.includes("manali") || nameLower.includes("kullu") || nameLower.includes("dharamshala") ||
    nameLower.includes("ooty") || nameLower.includes("darjeeling") || nameLower.includes("mussoorie") ||
    nameLower.includes("munnar") || nameLower.includes("lonavala") || nameLower.includes("hill") ||
    nameLower.includes("sohra") || nameLower.includes("cherrapunji") || nameLower.includes("paderu") ||
    nameLower.includes("lachen") || nameLower.includes("lachung") || nameLower.includes("tawang") ||
    nameLower.includes("ziro") || nameLower.includes("leh")
  ) {
    theme = 'scenic_hills';
  } else if (
    nameLower.endsWith("giri") || nameLower.endsWith("temple") || nameLower.endsWith("mandir") ||
    nameLower.includes("tirupati") || nameLower.includes("srikalahasti") || nameLower.includes("srisailam") ||
    nameLower.includes("varanasi") || nameLower.includes("puri") || nameLower.includes("gaya") ||
    nameLower.includes("ayodhya") || nameLower.includes("madurai") || nameLower.includes("kanchipuram") ||
    nameLower.includes("vellore") || nameLower.includes("thanjavur") || nameLower.includes("ujjain") ||
    nameLower.includes("pushkar") || nameLower.includes("rameswaram") || nameLower.includes("dwaraka") ||
    nameLower.includes("kedarnath") || nameLower.includes("badrinath") || nameLower.includes("haridwar") ||
    nameLower.includes("rishikesh") || nameLower.includes("amritsar") || nameLower.includes("somnath") ||
    nameLower.includes("shirdi") || nameLower.includes("kalyan") || nameLower.includes("golgonda")
  ) {
    theme = 'temples';
  } else if (
    nameLower.includes("fort") || nameLower.includes("palace") || nameLower.includes("jaipur") ||
    nameLower.includes("jodhpur") || nameLower.includes("udaipur") || nameLower.includes("bikaner") ||
    nameLower.includes("jaisalmer") || nameLower.includes("kota") || nameLower.includes("gwalior") ||
    nameLower.includes("agra") || nameLower.includes("jhansi") || nameLower.includes("delhi") ||
    nameLower.includes("reddy") || nameLower.includes("mahal") || nameLower.includes("nizam")
  ) {
    theme = 'historic_forts';
  } else if (
    ["bangalore", "hyderabad", "gurgaon", "noida", "chandigarh", "pune", "ahmedabad", "navi mumbai", "secunderabad"].includes(nameLower)
  ) {
    theme = 'modern_urban';
  }

  const descriptions: Record<string, string> = {
    beaches: `Explore the beautiful coastal city of ${cityName} in ${stateName}. Famous for its pristine sandy beaches, refreshing sea breezes, local seafood delicacies, and vibrant coastal culture.`,
    scenic_hills: `Discover the breathtaking hill destination of ${cityName} in ${stateName}. Celebrated for its misty valleys, panoramic viewpoints, pleasant weather, and lush green natural landscape.`,
    temples: `Visit the sacred spiritual heritage center of ${cityName} in ${stateName}. Renowned for its magnificent ancient temples, rich mythological history, and peaceful cultural atmosphere.`,
    historic_forts: `Step back in time in the historic city of ${cityName} in ${stateName}. Known for its grand royal forts, majestic palaces, legacy monuments, and stories of ancient heritage.`,
    modern_urban: `Experience the dynamic urban vibes of ${cityName} in ${stateName}. A major modern hub featuring spectacular skylines, bustling streets, diverse culinary avenues, and tech innovations.`,
    rivers_delta: `Immerse yourself in the scenic beauty of ${cityName} in ${stateName}. Located in a lush riverfront region, celebrated for its fertile green fields, quiet waterways, and local agrarian heritage.`
  };

  return descriptions[theme] || descriptions.rivers_delta;
}

const CITY_LANDMARKS: Record<string, {
  temples?: { name: string; desc: string; photo: string }[];
  lakes?: { name: string; desc: string; photo: string }[];
  attractions?: { name: string; desc: string; photo: string }[];
}> = {
  dharmavaram: {
    temples: [
      { name: "Sri Lakshmi Chennakesava Swamy Temple", desc: "A magnificent 14th-century Vijayanagara empire temple famous for its musical stone pillars, exquisite sculptures, and towering Rajagopuram.", photo: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600" },
      { name: "Sri Ramalingeswara Swamy Temple", desc: "A serene and ancient temple dedicated to Lord Shiva, featuring historic carvings and a peaceful courtyard for meditation.", photo: "https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?w=600" }
    ],
    lakes: [
      { name: "Dharmavaram Cheruvu (Lake)", desc: "One of the oldest and largest irrigation lakes in the region, built by the Vijayanagara kings. Offers beautiful sunset views and a scenic lake bund walkway.", photo: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=600" }
    ],
    attractions: [
      { name: "Dharmavaram Handloom Silk Weaving Center", desc: "Visit the traditional weavers preparing the world-famous Dharmavaram silk sarees. Watch the intricate gold brocade work and silk yarn spinning.", photo: "https://images.unsplash.com/photo-1617854818583-09e7f077a156?w=600" },
      { name: "Kothakonda Hill Fort Ruins", desc: "A historical hilltop fort situated on the outskirts, featuring ancient rock-cut steps, gate ruins, and panoramic valley views.", photo: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600" }
    ]
  },
  tirupati: {
    temples: [
      { name: "Sri Venkateswara Swamy Temple (Tirumala)", desc: "The world-famous hilltop temple dedicated to Lord Venkateswara (Balaji). A glorious spiritual hub with a gold-plated dome and daily sacred rituals.", photo: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600" },
      { name: "Sri Padmavathi Ammavari Temple (Tiruchanur)", desc: "An ancient temple dedicated to Goddess Padmavathi, the consort of Lord Venkateswara, featuring beautiful temple gardens and pond.", photo: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600" },
      { name: "Sri Kapileswara Swamy Temple", desc: "A sacred temple dedicated to Lord Shiva, nestled at the foot of Tirumala Hills right next to a beautiful natural waterfall.", photo: "https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=600" }
    ],
    lakes: [
      { name: "Swami Pushkarini Holy Tank", desc: "The sacred temple tank situated adjacent to the main Tirumala temple, believed to possess purifying properties.", photo: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=600" }
    ],
    attractions: [
      { name: "Silathoranam Natural Arch", desc: "A rare geological wonder located on Tirumala hills—a natural stone arch structure formed over 1.5 billion years ago.", photo: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600" },
      { name: "Srivari Museum", desc: "A museum showcasing the rich history of the Tirumala temple, ancient weapons, stone sculptures, and historical photos.", photo: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600" }
    ]
  },
  vijayawada: {
    temples: [
      { name: "Kanaka Durga Temple", desc: "The famous temple of Goddess Durga situated atop the Indrakeeladri Hill on the banks of the Krishna River, offering stunning city views.", photo: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600" },
      { name: "Undavalli Caves (Cave Temples)", desc: "Monolithic 7th-century rock-cut cave temples featuring a colossal statue of Lord Vishnu in a reclining posture.", photo: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600" }
    ],
    lakes: [
      { name: "Bhavani River Island & Boating", desc: "A large river island on the Krishna River offering boating, water sports, peaceful nature trails, and sunset viewpoints.", photo: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=600" }
    ],
    attractions: [
      { name: "Prakasam Barrage & Lake", desc: "An iconic bridge and regulator spanning 1.2 km across the Krishna River, creating a vast lake backdrop illuminated beautifully at night.", photo: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600" },
      { name: "Gandhi Hill Viewpoint", desc: "The first Gandhi memorial in India on a hill, featuring a 52-foot tall stupa, toy train rides, and a planetarium.", photo: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600" }
    ]
  },
  visakhapatnam: {
    temples: [
      { name: "Simhachalam Temple", desc: "An ancient 11th-century hilltop temple dedicated to Lord Narasimha, featuring exquisite stone carvings and beautiful stepwell gardens.", photo: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600" }
    ],
    lakes: [
      { name: "Mudasarlova Lake & Park", desc: "A scenic freshwater lake nestled in a valley, surrounded by hills, featuring golf courses, picnic parks, and water birds.", photo: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=600" }
    ],
    attractions: [
      { name: "Rishikonda Beach & Watersports", desc: "A golden-sand beach famous for windsurfing, boating, and scenic sunset cliffs.", photo: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600" },
      { name: "INS Kursura Submarine Museum", desc: "A real Russian-built submarine decommissioned and preserved on the beach as a museum, showing maritime crew life.", photo: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600" },
      { name: "Kailasagiri Hilltop Park", desc: "A scenic hill park overlooking the Bay of Bengal, featuring colossal white statues of Shiva and Parvathi, and a cable car.", photo: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600" }
    ]
  },
  vizag: {
    temples: [
      { name: "Simhachalam Temple", desc: "An ancient 11th-century hilltop temple dedicated to Lord Narasimha, featuring exquisite stone carvings and beautiful stepwell gardens.", photo: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600" }
    ],
    lakes: [
      { name: "Mudasarlova Lake & Park", desc: "A scenic freshwater lake nestled in a valley, surrounded by hills, featuring golf courses, picnic parks, and water birds.", photo: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=600" }
    ],
    attractions: [
      { name: "Rishikonda Beach & Watersports", desc: "A golden-sand beach famous for windsurfing, boating, and scenic sunset cliffs.", photo: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600" },
      { name: "INS Kursura Submarine Museum", desc: "A real Russian-built submarine decommissioned and preserved on the beach as a museum, showing maritime crew life.", photo: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600" },
      { name: "Kailasagiri Hilltop Park", desc: "A scenic hill park overlooking the Bay of Bengal, featuring colossal white statues of Shiva and Parvathi, and a cable car.", photo: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600" }
    ]
  },
  araku: {
    temples: [
      { name: "Matsyagundam Shiva Temple", desc: "A unique spiritual stream in a rocky valley where thousands of sacred fish swim, protected by the local deity temple.", photo: "https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?w=600" }
    ],
    lakes: [
      { name: "Araku Lake Reserve", desc: "A peaceful reservoir pond surrounded by forest hills and coffee plantations.", photo: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=600" }
    ],
    attractions: [
      { name: "Borra Caves", desc: "Spectacular million-year-old limestone caves featuring stalactite and stalagmite formations lit with colorful lights.", photo: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600" },
      { name: "Araku Tribal Museum", desc: "A museum showcasing the lifestyle, handicrafts, bows, and mud-house replicas of Eastern Ghats tribes.", photo: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600" },
      { name: "Katiki Waterfalls", desc: "A stunning 50-foot waterfall cascading through green jungles, accessible via a short scenic trek.", photo: "https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=600" }
    ]
  },
  srisailam: {
    temples: [
      { name: "Mallikarjuna Jyotirlinga Temple", desc: "One of the 12 sacred Shiva Jyotirlingas in India. A massive fort-like temple complex with historical rock carvings.", photo: "https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?w=600" },
      { name: "Bhramaramba Devi Shakti Peetham", desc: "One of the 18 main Shakti Peethas in India, situated within the Mallikarjuna temple complex, dedicated to Goddess Parvathi.", photo: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600" }
    ],
    lakes: [
      { name: "Srisailam Dam Reservoir", desc: "A massive water reservoir nestled in the Nallamala forest valleys, offering boating and magnificent gate opening views.", photo: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=600" }
    ],
    attractions: [
      { name: "Pathala Ganga Ropeway", desc: "A scenic cable car ropeway descending down a steep cliff to the sacred Krishna riverbed for holy baths and boating.", photo: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600" }
    ]
  },
  rajahmundry: {
    temples: [
      { name: "Iskcon Temple Rajahmundry", desc: "A beautiful riverside temple complex featuring colorful deity shrines, gardens, and spiritual bhajan halls.", photo: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600" }
    ],
    lakes: [
      { name: "Godavari River Ghats & Boating", desc: "The grand riverbanks of Godavari, featuring scenic evening aarti rituals, boating ghats, and beautiful sunset viewpoints.", photo: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=600" }
    ],
    attractions: [
      { name: "Godavari Arch Bridge", desc: "An engineering marvel—a 2.7 km long arch bridge spanning the majestic Godavari River, offering panoramic rail views.", photo: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600" },
      { name: "Papi Hills (Papikondalu) Cruise", desc: "A scenic boat cruise starting from Rajahmundry passing through the narrow gorges and majestic forest hills of Godavari.", photo: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600" }
    ]
  },
  nellore: {
    temples: [
      { name: "Sri Ranganathaswamy Temple (Talpagiri)", desc: "A magnificent 12th-century temple dedicated to Lord Vishnu, situated on the bank of the Penna River, featuring a grand 96-foot Rajagopuram.", photo: "https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?w=600" }
    ],
    lakes: [
      { name: "Pulicat Lake Flamingo Lagoon", desc: "The second-largest brackish water lagoon in India, famous for hosting thousands of migratory pink flamingos.", photo: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=600" },
      { name: "Nellore Tank (Nellore Cheruvu)", desc: "A vast historical lake featuring a scenic concrete bund walkway, parks, and speed boating activities.", photo: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=600" }
    ],
    attractions: [
      { name: "Mypadu Beach Coastline", desc: "A serene and clean sandy beach on the Bay of Bengal, featuring APTDC beach resorts and water cruise boats.", photo: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600" }
    ]
  },
  eluru: {
    temples: [
      { name: "Dwaraka Tirumala Temple", desc: "A famous hilltop temple of Lord Venkateswara, built in the style of Tirumala, located a short drive from Eluru.", photo: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600" }
    ],
    lakes: [
      { name: "Kolleru Lake Bird Sanctuary", desc: "India's largest freshwater lake and bird sanctuary. A spectacular wetland ecosystem hosting pelicans, storks, and ducks.", photo: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=600" }
    ],
    attractions: [
      { name: "Eluru Buddha Park Lake", desc: "A beautiful municipal park featuring a colossal, majestic 74-foot tall standing Buddha statue in the middle of a lake.", photo: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600" }
    ]
  },
  lepakshi: {
    temples: [
      { name: "Veerabhadra Temple (Lepakshi)", desc: "A world-renowned treasure of Vijayanagara architecture, famous for its hanging pillar, the giant footprint of Goddess Sita, and beautiful ceiling frescoes.", photo: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600" }
    ],
    attractions: [
      { name: "Monolithic Basavanna (Lepakshi Nandi)", desc: "A spectacular 15-foot high, 27-foot long monolithic granite bull, carved from a single stone, showcasing master craftsmanship.", photo: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600" },
      { name: "Lepakshi Archaeological Park", desc: "A walk through the historic outer walls, mandapams, and rock inscriptions surrounding the temple compound.", photo: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=600" }
    ]
  },
  guntur: {
    temples: [
      { name: "Sri Amaralingeswara Swamy Temple (Amaravathi)", desc: "Ancient temple of Lord Shiva situated on the banks of Krishna River, featuring a colossal 15-foot white Shiva Lingam.", photo: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600" }
    ],
    lakes: [
      { name: "NTR Manasa Sarovar Park Lake", desc: "A beautiful urban park lake featuring boating, landscaped gardens, and musical fountains.", photo: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=600" }
    ],
    attractions: [
      { name: "Kondaveedu Fort Ruins", desc: "A historic 14th-century hill fortress with massive stone ramparts, gateways, temple ruins, and panoramic valley views.", photo: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600" },
      { name: "Amaravathi Archaeological Museum", desc: "Showcases exquisite Buddhist sculptures, relics, and limestone carvings dating back to the 3rd century BCE.", photo: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600" }
    ]
  },
  kurnool: {
    temples: [
      { name: "Yaganti Uma Maheswara Temple", desc: "Famous cave temple of Lord Shiva where the stone Nandi statue is believed to be continuously growing in size.", photo: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600" }
    ],
    lakes: [
      { name: "Konda Reddy Buruju Water Tank", desc: "Historic water tank next to the iconic 12th-century Konda Reddy Buruju bastion.", photo: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=600" }
    ],
    attractions: [
      { name: "Konda Reddy Buruju", desc: "An iconic monolithic stone bastion built by the Vijayanagara kings in the heart of Kurnool city.", photo: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=600" },
      { name: "Belum Caves", desc: "The longest and second-largest cave system in the Indian subcontinent, featuring natural stalactite formations.", photo: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600" }
    ]
  },
  kadapa: {
    temples: [
      { name: "Devuni Kadapa Sri Lakshmi Venkateswara Temple", desc: "Historic temple known as the threshold to Tirumala Venkateswara Temple, built by the Vijayanagara kings.", photo: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600" }
    ],
    lakes: [
      { name: "Bugga Vanka Riverfront Walk", desc: "A serene walking track along the banks of the local Bugga Vanka stream.", photo: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=600" }
    ],
    attractions: [
      { name: "Gandikota Grand Canyon & Fort", desc: "Often called the Grand Canyon of India, featuring spectacular gorge cliffs along the Pennar River and ruins of Gandikota Fort.", photo: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600" }
    ]
  },
  kakinada: {
    temples: [
      { name: "Sri Kumara Rama Bheemeshwara Swamy Temple", desc: "One of the Pancharama Kshetras dedicated to Lord Shiva, featuring a towering two-story sanctum.", photo: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600" }
    ],
    lakes: [
      { name: "Kakinada Salt Creek & Boat Club", desc: "A scenic tidal waterway offering boat cruises, speed boats, and views of harbor docks.", photo: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=600" }
    ],
    attractions: [
      { name: "Coringa Mangroves Boardwalk", desc: "The second largest stretch of mangrove forests in India, featuring scenic wooden canopy walkways and boating routes.", photo: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=600" },
      { name: "Hope Island Scenic Spit", desc: "A natural sand spit barrier protecting the Kakinada harbor, offering scenic views of ship hulls.", photo: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600" }
    ]
  },
  anantapur: {
    temples: [
      { name: "Sri Kadiri Laxmi Narasimha Swamy Temple", desc: "A famous ancient temple where the deity is self-manifested (Swayambhu), drawing pilgrims from all over.", photo: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600" }
    ],
    lakes: [
      { name: "Ananthasagar Cheruvu (Lake)", desc: "The historic city lake built by the Vijayanagara kings, offering quiet waters and sunset viewpoints.", photo: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=600" }
    ],
    attractions: [
      { name: "Monolithic ISKCON Temple Chariot", desc: "A modern architectural marvel designed in the shape of a horse-drawn chariot.", photo: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600" }
    ]
  },
  puttaparthi: {
    temples: [
      { name: "Prasanthi Nilayam (Main Ashram)", desc: "The world-famous spiritual ashram of Sri Sathya Sai Baba, featuring grand prayer halls, meditation spaces, and gardens.", photo: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600" }
    ],
    lakes: [
      { name: "Sri Sathya Sai Samadhi Lake Reserve", desc: "A calm reservoir lake situated next to the holy samadhi shrine.", photo: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=600" }
    ],
    attractions: [
      { name: "Chaitanya Jyoti Museum", desc: "An architectural wonder displaying the life and teachings of Sri Sathya Sai Baba.", photo: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600" }
    ]
  }
};

function generateMockPlaces(cityName: string, stateName: string, lat: number, lng: number, originalQuery: string = ""): Place[] {
  const list: Place[] = [];
  const cityLower = cityName.toLowerCase();
  const stateLower = stateName.toLowerCase();
  const cityHash = cityName.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);

  function shuffleArray<T>(arr: T[], seed: number): T[] {
    const newArr = [...arr];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.abs(seed + i) % (i + 1);
      const temp = newArr[i];
      newArr[i] = newArr[j];
      newArr[j] = temp;
    }
    return newArr;
  }

  // 1. Detect city theme
  let theme: "coastal" | "mountain" | "heritage" | "south_india" | "metro" = "metro";
  if (
    cityLower.includes("goa") || cityLower.includes("vizag") || cityLower.includes("beach") ||
    cityLower.includes("pondicherry") || cityLower.includes("kochi") || cityLower.includes("kerala") ||
    cityLower.includes("mumbai") || cityLower.includes("chennai") || cityLower.includes("puri") ||
    cityLower.includes("port") || cityLower.includes("visakhapatnam")
  ) {
    theme = "coastal";
  } else if (
    stateLower === "himachal pradesh" || stateLower === "uttarakhand" || 
    stateLower === "jammu & kashmir" || stateLower === "ladakh" || stateLower === "sikkim" ||
    cityLower.includes("ooty") || cityLower.includes("munnar") || cityLower.includes("coorg") ||
    cityLower.includes("kodaikanal") || cityLower.includes("manali") || cityLower.includes("shimla") ||
    cityLower.includes("himalaya") || cityLower.includes("valley") || cityLower.includes("hill") ||
    cityLower.includes("darjeeling") || cityLower.includes("gangtok") || cityLower.includes("leh") ||
    cityLower.includes("wayanad") || cityLower.includes("mussoorie") || cityLower.includes("nainital")
  ) {
    theme = "mountain";
  } else if (
    stateLower === "rajasthan" || stateLower === "gujarat" ||
    cityLower.includes("temple") || cityLower.includes("shiva") || cityLower.includes("varanasi") ||
    cityLower.includes("madurai") || cityLower.includes("rishikesh") || cityLower.includes("haridwar") ||
    cityLower.includes("ujjain") || cityLower.includes("ayodhya") || cityLower.includes("shirdi") ||
    cityLower.includes("amritsar") || cityLower.includes("agra") || cityLower.includes("hampi") ||
    cityLower.includes("heritage") || cityLower.includes("jaipur") || cityLower.includes("udaipur") ||
    cityLower.includes("jodhpur") || cityLower.includes("fort") || cityLower.includes("palace")
  ) {
    theme = "heritage";
  } else if (
    stateLower === "andhra pradesh" || stateLower === "telangana" || 
    stateLower === "tamil nadu" || stateLower === "karnataka" || stateLower === "kerala"
  ) {
    theme = "south_india";
  }

  // 2. Define theme-specific name lists
  const rawNames = {
    coastal: {
      hotel: ["Sea Breeze Residency", "Ocean Vista Stays", "Marine Bay Hotel", "Coconut Grove Inn", "Oceanic Shore Motel", "Coastal Highway Motel"],
      resort: ["Blue Lagoon Beach Resort", "Coral Reef Spa & Resort", "Oceanic Retreat & Spa"],
      restaurant: ["The Crab Shack", "Riverside Seafood Grill", "Coastal Spices Dinette"],
      cafe: ["The Sand Deck Cafe", "Wave Catchers Cafe", "Tidal Coffee Bar"],
      attraction: ["Pristine Sandy Beach", "Historic Coastal Fort & Lighthouse", "Scenic Sunset Cliff Lookout", "Maritime Heritage Museum"],
      temple: ["Ancient Coastal Shore Temple", "Mahalasa Narayani Shrine", "Somnath Seaside Temple", "Maritime Shiva Temple"]
    },
    mountain: {
      hotel: ["Mist Valley Residency", "Pine Wood Stays", "Cliff Edge Inn", "Highland Meadows Hotel", "Alpine Pass Motel", "Valley Crest Motel"],
      resort: ["Whispering Pines Forest Resort", "Mountain Crest Eco Resort", "Snowy Peaks Valley Retreat"],
      restaurant: ["The Alpine Kitchen", "Warm Clay Tandoor", "Valley View Diner"],
      cafe: ["The Mountain Brew Cafe", "Mist & Mug Coffee Shop", "The Cozy Hearth Cafe"],
      attraction: ["Snowy Peak Viewpoint", "Lush Tea Plantation Walk", "Sparkling Forest Waterfall", "Tribal Culture Museum"],
      temple: ["Hidimba Devi Forest Temple", "Jakhoo Hanuman Hill Temple", "Manu ancient Valley Temple", "Nainital Naina Devi Temple"]
    },
    heritage: {
      hotel: ["Royal Heritage Palace", "Haveli Gateway Stays", "Golden Temple Residency", "Imperial Fort Hotel", "Highway Haveli Motel", "Heritage Gateway Motel"],
      resort: ["Traditional Ethnic Village Resort", "Heritage Palace Retreat & Spa", "The Sanctuary Resort"],
      restaurant: ["Darbar Royal Dining", "Shanti Bhavan Veg Palace", "The Curry Pot Heritage"],
      cafe: ["The Chai Chauk Cafe", "Aesthetic Temple Cafe", "The Culture Cup"],
      attraction: ["City Palace Museum Tour", "Historic Fort & Museum Ruins", "Royal Cenotaphs", "Archaeological Excavation Site"],
      temple: ["Akshardham Temple Complex", "Brihadeeswarar Heritage Temple", "Sun Temple Konark", "Meenakshi Amman Temple"]
    },
    south_india: {
      hotel: ["Siri Deluxe Inn", "Sri Balaji Residency", "Venkata Sai Guest House", "Dwaraka Plaza Stays", "Highway Grand Motel", "Deccan Highway Inn"],
      resort: ["Haritha Valley Resorts", "Gouthami Riverfront Retreat", "Satya Hills Eco Resort"],
      restaurant: ["Sri Lakshmi Pure Veg", "Kanakadurga Family Restaurant", "Godavari Ruchulu", "Annapurna Tiffins"],
      cafe: ["Filter Kaapi Club", "Raju Gari Coffee Shop", "Deccan Brews Cafe"],
      attraction: ["Local Weaver Cooperative Street", "Scenic Lake Bund Walkway", "Historic Clock Tower Plaza"],
      temple: ["Sri Kasi Visweswara Swamy Temple", "Ganesh Chowk Shrine", "Sri Venkateswara Swamy Temple"]
    },
    metro: {
      hotel: ["Grand Regency", "Royal Orchid Hotel", "The Fern Residency", "Citrus City Inn", "Grand Highway Motel", "Transit Motel & Suites"],
      resort: ["Jungle Retreat & Spa", "Green Meadows Resort", "The Oasis Club & Resort"],
      restaurant: ["The Curry Pot", "Swad Junction", "Nawaab's Kitchen", "Spice Route"],
      cafe: ["The Roasted Bean", "Brews & Bytes", "The Hideout Cafe", "Urban Cup"],
      attraction: ["Botanical Gardens Walk", "City Center Museum", "Sunset Point Lookout", "National Science Center Museum"],
      temple: ["Historic Birla Mandir", "Lotus Temple Shrine", "ISKCON Spiritual Temple", "Chattarpur Heritage Temple"]
    }
  }[theme];

  let names = {
    hotel: shuffleArray(rawNames.hotel, cityHash),
    resort: shuffleArray(rawNames.resort, cityHash + 1),
    restaurant: shuffleArray(rawNames.restaurant, cityHash + 2),
    cafe: shuffleArray(rawNames.cafe, cityHash + 3),
    attraction: shuffleArray(rawNames.attraction, cityHash + 4),
    temple: shuffleArray(rawNames.temple, cityHash + 5)
  };

  // Custom overrides for specific pilgrim and tourist towns
  if (cityLower.includes("tirupati") || cityLower.includes("tirupathi") || cityLower.includes("tirumala")) {
    names = {
      hotel: ["Taj Tirupati", "Marasa Sarovar Premiere", "Fortune Select Grand Ridge", "Bhimas Deluxe Hotel"],
      resort: ["Srivari Tirumala Valley Resort", "Hill View Wellness Retreat", "The Pilgrims Sanctuary Resort"],
      restaurant: ["Bhimas Paradise Veg Dining", "Sri Lakshmi Narayana Pure Veg", "Woodlands Heritage Veg"],
      cafe: ["The Coffee Pot Tirupati", "Srivari Heritage Cafe", "Filter Kaapi Club"],
      attraction: ["Kapila Theertham Sacred Waterfall", "Srivari Museum & Photo Gallery", "Silathoranam Natural Arch"],
      temple: [
        "Sri Venkateswara Swamy Temple (Tirumala)",
        "Sri Padmavathi Ammavari Temple",
        "Sri Govindaraja Swamy Temple",
        "Sri Kapileswara Swamy Temple"
      ]
    };
  } else if (cityLower.includes("amritsar")) {
    names = {
      hotel: ["Taj Swarna Amritsar", "Hyatt Regency Amritsar", "Radisson Blu Amritsar", "Welcomhotel Amritsar"],
      resort: ["Ranjit's Svaasa Heritage Boutique Resort", "Amritsar Farmhouse Resort", "The Golden Retreat"],
      restaurant: ["Kesar Da Dhaba", "Bharawan Da Dhaba", "Surjit Food Plaza"],
      cafe: ["The Giani Tea Stall", "Elgin Cafe Amritsar", "The Bean Street"],
      attraction: ["Jallianwala Bagh Memorial", "Wagah Border Ceremony", "Partition Museum"],
      temple: [
        "The Golden Temple (Harmandir Sahib)",
        "Durgiana Temple",
        "Shivala Bhaian Temple",
        "Sri Ram Tirath Temple"
      ]
    };
  } else if (cityLower.includes("varanasi") || cityLower.includes("banaras") || cityLower.includes("kashi")) {
    names = {
      hotel: ["BrijRama Palace Heritage Hotel", "Taj Ganges Varanasi", "Radisson Hotel Varanasi", "Alka Guest House"],
      resort: ["Tree of Life Resort & Spa Varanasi", "Ganga Heritage Retreat", "The Varanasi Sanctuary"],
      restaurant: ["Kashi Chat Bhandar", "Deena Chat Bhandar", "Canton Royale Restaurant"],
      cafe: ["The Brown Bread Bakery", "Open Hand Cafe Varanasi", "Blue Lassi Shop"],
      attraction: ["Dashashwamedh Ghat Ganga Aarti", "Sarnath Buddhist Pilgrimage Ruins", "Ramnagar Fort & Museum"],
      temple: [
        "Kashi Vishwanath Temple (Golden Temple)",
        "Sankat Mochan Hanuman Temple",
        "New Vishwanath Temple (BHU)",
        "Durga Kund Temple"
      ]
    };
  }

  // 2.5. Query-specific overrides for offline mock places names
  if (originalQuery) {
    const qLower = originalQuery.toLowerCase();
    if (qLower.includes("biryani") || qLower.includes("pulao")) {
      names.restaurant = [
        "Paradise Biryani Hub",
        "Bawarchi Biryani House",
        "Shah Ghouse Hotel & Restaurant",
        "Cafe Bahar Biryani Palace"
      ];
    } else if (qLower.includes("dosa") || qLower.includes("idli") || qLower.includes("south indian")) {
      names.restaurant = [
        "Saravana Bhavan",
        "MTR Mavalli Tiffin Room",
        "Vidyarthi Bhavan Dosa",
        "Sri Lakshmi Pure Veg"
      ];
    }
  }

  // 3. Define theme-specific Unsplash photos
  const photosDb = {
    coastal: {
      hotel: [
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600",
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600",
        "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600",
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600",
        "https://images.unsplash.com/photo-1562790351-d273a961e0e9?w=600"
      ],
      resort: [
        "https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?w=600",
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600",
        "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=600",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600",
        "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=600",
        "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=600"
      ],
      restaurant: [
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600",
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600",
        "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600",
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600",
        "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600",
        "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=600"
      ],
      cafe: [
        "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600",
        "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600",
        "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=600",
        "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=600",
        "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=600",
        "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=600"
      ],
      attraction: [
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600",
        "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=600",
        "https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?w=600",
        "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600",
        "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600",
        "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600"
      ],
      temple: [
        "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600",
        "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=600",
        "https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?w=600",
        "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600"
      ]
    },
    mountain: {
      hotel: [
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600",
        "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600",
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600",
        "https://images.unsplash.com/photo-1562790351-d273a961e0e9?w=600",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600"
      ],
      resort: [
        "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=600",
        "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600",
        "https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?w=600",
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600",
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600"
      ],
      restaurant: [
        "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600",
        "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600",
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600",
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600",
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600",
        "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600"
      ],
      cafe: [
        "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=600",
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600",
        "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600",
        "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600",
        "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=600",
        "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=600"
      ],
      attraction: [
        "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=600",
        "https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=600",
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600",
        "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600",
        "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600",
        "https://images.unsplash.com/photo-1558431382-27e303142255?w=600" // Victoria Memorial Museum
      ],
      temple: [
        "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600",
        "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=600",
        "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600", // Varanasi temple
        "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600"
      ]
    },
    heritage: {
      hotel: [
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600",
        "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600",
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600",
        "https://images.unsplash.com/photo-1562790351-d273a961e0e9?w=600",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600"
      ],
      resort: [
        "https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?w=600",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600",
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600",
        "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=600",
        "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600",
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600"
      ],
      restaurant: [
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600",
        "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600",
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600",
        "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600",
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600",
        "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600"
      ],
      cafe: [
        "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600",
        "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600",
        "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=600",
        "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=600",
        "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=600",
        "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=600"
      ],
      attraction: [
        "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600",
        "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=600",
        "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600",
        "https://images.unsplash.com/photo-1558431382-27e303142255?w=600", // Victoria Memorial Museum
        "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600",
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600"
      ],
      temple: [
        "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600",
        "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=600",
        "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600", // Varanasi temple
        "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600"
      ]
    },
    south_india: {
      hotel: [
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600",
        "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600",
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600"
      ],
      resort: [
        "https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?w=600",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600",
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600"
      ],
      restaurant: [
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600",
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600",
        "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600"
      ],
      cafe: [
        "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600",
        "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600",
        "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=600"
      ],
      attraction: [
        "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=600",
        "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600",
        "https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?w=600"
      ],
      temple: [
        "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600",
        "https://images.unsplash.com/photo-1616038242814-a6eac7845d88?w=600",
        "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600"
      ]
    },
    metro: {
      hotel: [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600",
        "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600",
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600",
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600",
        "https://images.unsplash.com/photo-1562790351-d273a961e0e9?w=600",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600"
      ],
      resort: [
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600",
        "https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?w=600",
        "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=600",
        "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600",
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600"
      ],
      restaurant: [
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600",
        "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600",
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600",
        "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600",
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600",
        "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600"
      ],
      cafe: [
        "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600",
        "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600",
        "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=600",
        "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=600",
        "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=600",
        "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=600"
      ],
      attraction: [
        "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600",
        "https://images.unsplash.com/photo-1558431382-27e303142255?w=600", // Victoria Memorial Museum
        "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=600",
        "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600",
        "https://images.unsplash.com/photo-1477584322902-471851bb1a83?w=600", // Jaipur Hawa Mahal
        "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600"
      ],
      temple: [
        "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600",
        "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=600",
        "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600" // Varanasi temple
      ]
    }
  }[theme];

  const createMock = (
    id: string, 
    name: string, 
    type: PlaceType, 
    subtypes: string[], 
    description: string, 
    facilities: string[], 
    photos: string[], 
    minPrice: number, 
    maxPrice: number, 
    address: string
  ) => {
    const offsetLat = lat + (Math.random() - 0.5) * 0.02;
    const offsetLng = lng + (Math.random() - 0.5) * 0.02;
    const rating = parseFloat((4.0 + Math.random() * 0.9).toFixed(1));
    const reviewCount = Math.floor(50 + Math.random() * 950);
    const priceLevel = Math.floor(1 + Math.random() * 4) as 1 | 2 | 3 | 4;

    const place: Place = {
      id,
      name,
      type,
      subtypes,
      rating,
      reviewCount,
      priceLevel,
      priceRange: `₹${minPrice.toLocaleString("en-IN")} - ₹${maxPrice.toLocaleString("en-IN")}`,
      address,
      description,
      photos,
      facilities,
      phone: `+91 ${Math.floor(6000000000 + Math.random() * 3999999999)}`,
      website: `https://www.explore${name.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`,
      coordinates: { lat: offsetLat, lng: offsetLng },
      city: cityName,
      state: stateName,
      reviews: []
    };

    if (type === "restaurant" || type === "cafe") {
      place.priceRange = `₹${minPrice.toLocaleString("en-IN")} for two`;
      place.menuHighlights = ["Butter Chicken", "Dal Makhani", "Tandoori Roti", "Garlic Naan"];
      place.popularFoods = ["Paneer Butter Masala", "Chicken Tikka", "Biryani"];
      place.vegFriendly = true;
      place.nonVegFriendly = type === "restaurant";
    } else {
      place.activities = ["Swimming", "Spa treatment", "Yoga session", "Local city tour"];
      place.rooms = [
        { type: "Standard Room", price: `₹${minPrice.toLocaleString("en-IN")}`, amenities: ["Queen Bed", "AC", "WiFi"] },
        { type: "Executive Suite", price: `₹${maxPrice.toLocaleString("en-IN")}`, amenities: ["King Bed", "AC", "WiFi", "Balcony"] }
      ];
    }

    return place;
  };

  const addItems = (type: PlaceType, namesList: string[], count: number) => {
    // Unique list selection
    const usedNames = new Set<string>();
    for (let i = 0; i < count; i++) {
      let suffix = namesList[Math.floor(Math.random() * namesList.length)];
      let attempt = 0;
      while (usedNames.has(suffix) && attempt < 10) {
        suffix = namesList[Math.floor(Math.random() * namesList.length)];
        attempt++;
      }
      usedNames.add(suffix);

      let name = `${cityName} ${suffix}`;
      
      // Dynamic Temple Name Generator
      if (type === "temple") {
        const deities = ["Sri Venkateswara", "Sri Mallikarjuna", "Sri Lakshmi Narasimha", "Sri Veerabhadra", "Sri Ranganatha", "Sri Chennakesava", "Ganesh Mandir", "Siva Devalayam", "Sri Rama Temple", "Durga Mata Mandir", "Sai Baba Shrine"];
        const templeSuffixes = ["Swamy Devasthanam", "Temple Complex", "Heritage Shrine", "Spiritual Ashram", "Hill Temple", "Ancient Mandir"];
        const deity = deities[(cityHash + i) % deities.length];
        const tempSuffix = templeSuffixes[(cityHash + i * 2) % templeSuffixes.length];
        name = `${cityName} ${deity} ${tempSuffix}`;
      }
      
      // Dynamic Lake Attraction Generator (assign first attraction as a lake!)
      if (type === "attraction" && i === 0) {
        const lakeSuffixes = ["Cheruvu (Lake Bund)", "Lake & Boating Ghat", "Water Reservoir & Park", "Scenic Lake Viewpoint", "Freshwater Lake Basin", "Riverbank Canal Walk"];
        const lakeSuffix = lakeSuffixes[(cityHash + i) % lakeSuffixes.length];
        name = `${cityName} ${lakeSuffix}`;
      }

      const id = `mock-${type}-${Math.random().toString(36).substr(2, 9)}`;
      
      let subtypes: string[] = [];
      let desc = "";
      let facilities: string[] = [];
      let photos = getSanitizedPhotos(type, name, cityName, i, photosDb);

      let minP = 500;
      let maxP = 1500;
      let addr = `Near City Center, ${cityName}, ${stateName}`;

      if (type === "hotel") {
        subtypes = ["Luxury Hotels", "Stays", "Boutique Stays"];
        desc = `Experience a luxurious stay at the ${name}, located in the heart of ${cityName}. Featuring premium rooms with air conditioning, complimentary breakfast, ultra-fast WiFi, and round-the-clock room service. Perfect for both business travelers and families seeking standard amenities.`;
        facilities = ["WiFi", "AC", "Breakfast", "Parking", "Gym"];
        minP = 2500;
        maxP = 7500;
      } else if (type === "resort") {
        subtypes = ["Resorts", "Luxury Resorts", "Scenic Stays"];
        desc = `Escape the hustle and bustle of city life at ${name}. Nestled in beautiful, lush surroundings, this premium resort features private cottages, swimming pools, full-service health spas, and guided nature trails. Enjoy exquisite local cuisine and top-tier hospitality.`;
        facilities = ["WiFi", "AC", "Swimming Pool", "Spa", "Breakfast", "Parking"];
        minP = 8000;
        maxP = 22000;
      } else if (type === "restaurant") {
        subtypes = ["Fine Dining", "Family Restaurants", "Local Flavors"];
        desc = `Discover genuine traditional tastes at ${name}, the highly recommended dining place in ${cityName}. We serve legendary local dishes, classic curries, freshly baked breads, and mouth-watering desserts prepared by master chefs using premium local ingredients.`;
        facilities = ["AC", "Parking", "Veg Friendly", "Accepts Cards"];
        minP = 400;
        maxP = 1200;
      } else if (type === "cafe") {
        subtypes = ["Cafes", "Hangout Places", "Coffee Shops"];
        desc = `Relax and unwind at ${name}. A cozy, modern cafe offering coffee, tea, delicious snacks, and a quiet ambiance perfect for reading, remote working, or meeting friends. Features great indoor music and outdoor seating.`;
        facilities = ["WiFi", "AC", "Outdoor Seating", "Veg Friendly"];
        minP = 200;
        maxP = 600;
      } else if (type === "attraction") {
        const isLake = name.toLowerCase().includes("lake") || name.toLowerCase().includes("cheruvu") || name.toLowerCase().includes("reservoir");
        if (isLake) {
          subtypes = ["Scenic Points", "Lakes & Water Bodies", "Boating Ghats"];
          desc = `Visit the beautiful ${name}, a popular and scenic waterfront destination in ${cityName}. Famous for its peaceful nature walks, sunset viewing spots, and recreational boating activities.`;
          facilities = ["Boating", "Scenic Walking Path", "Sunset Viewpoint", "Food Stalls"];
          minP = 0;
          maxP = 150;
        } else {
          subtypes = ["Sightseeing", "Historical Sites", "Famous Landmarks"];
          desc = `Explore the historical and cultural significance of ${name}. This iconic spot offers beautiful architecture, scenic photography angles, and an educational glimpse into the rich history and heritage of ${cityName}. A must-visit place for all tourists.`;
          facilities = ["Parking", "Guided Tours", "Kids Friendly", "Camera Allowed"];
          minP = 50;
          maxP = 250;
        }
      } else if (type === "temple") {
        subtypes = ["Spiritual Sites", "Temples", "Heritage Shrines"];
        desc = `Experience the serene and divine atmosphere at ${name}. A legendary temple complex with ancient architectural carvings, peaceful prayer halls, and rich spiritual history in ${cityName}. Visitors are requested to follow traditional custom guidelines.`;
        facilities = ["Parking", "Guided Tours", "Shoe Keeping Area", "Prasadam Allowed"];
        minP = 0;
        maxP = 250; // VIP Darshan
      }

      list.push(createMock(id, name, type, subtypes, desc, facilities, photos, minP, maxP, addr));
    }
  };

  const cityLowerKey = cityName.toLowerCase().trim();
  const overridesKey = Object.keys(CITY_LANDMARKS).find(key => 
    cityLowerKey === key || 
    cityLowerKey.includes(key) || 
    key.includes(cityLowerKey)
  );
  const overrides = overridesKey ? CITY_LANDMARKS[overridesKey] : undefined;

  if (overrides) {
    if (overrides.temples) {
      overrides.temples.forEach((temple, idx) => {
        const id = `mock-temple-${cityLowerKey}-${idx}-${Math.random().toString(36).substr(2, 5)}`;
        const addr = `Temple Road, ${cityName}, ${stateName}`;
        const extraPhotos = getSanitizedPhotos("temple", temple.name, cityName, idx, photosDb);
        const photos = [temple.photo, ...extraPhotos.slice(0, 3)];
        list.push(createMock(id, temple.name, "temple", ["Spiritual Sites", "Temples", "Heritage Shrines"], temple.desc, ["Parking", "Prasadam Allowed", "Shoe Keeping Area"], photos, 0, 250, addr));
      });
    }
    if (overrides.lakes) {
      overrides.lakes.forEach((lake, idx) => {
        const id = `mock-attraction-lake-${cityLowerKey}-${idx}-${Math.random().toString(36).substr(2, 5)}`;
        const addr = `Lake Road, ${cityName}, ${stateName}`;
        const extraPhotos = getSanitizedPhotos("lake", lake.name, cityName, idx, photosDb);
        const photos = [lake.photo, ...extraPhotos.slice(0, 3)];
        list.push(createMock(id, lake.name, "attraction", ["Scenic Points", "Lakes & Water Bodies", "Boating Ghats"], lake.desc, ["Boating", "Scenic Walking Path", "Sunset Viewpoint"], photos, 0, 150, addr));
      });
    }
    if (overrides.attractions) {
      overrides.attractions.forEach((attr, idx) => {
        const id = `mock-attraction-${cityLowerKey}-${idx}-${Math.random().toString(36).substr(2, 5)}`;
        const addr = `Near City Center, ${cityName}, ${stateName}`;
        const extraPhotos = getSanitizedPhotos("attraction", attr.name, cityName, idx, photosDb);
        const photos = [attr.photo, ...extraPhotos.slice(0, 3)];
        list.push(createMock(id, attr.name, "attraction", ["Sightseeing", "Historical Sites", "Famous Landmarks"], attr.desc, ["Parking", "Guided Tours", "Camera Allowed"], photos, 50, 250, addr));
      });
    }
  }

  const templesCount = Math.max(0, 3 - (overrides?.temples?.length || 0));
  const attractionsCount = Math.max(0, 3 - ((overrides?.lakes?.length || 0) + (overrides?.attractions?.length || 0)));

  addItems("hotel", names.hotel, 3);
  addItems("resort", names.resort, 2);
  addItems("restaurant", names.restaurant, 3);
  addItems("cafe", names.cafe, 2);
  if (attractionsCount > 0) {
    addItems("attraction", names.attraction, attractionsCount);
  }
  if (templesCount > 0) {
    addItems("temple", names.temple, templesCount);
  }

  return list;
}

// Dynamic Discovery & Travel Search API using Unified, Ultra-Fast Gemini 3.5 Flash!
app.post("/api/discover", async (req: Request, res: Response) => {
  const { query, lat: clientLat, lng: clientLng } = req.body;
  
  if (!query) {
    return res.status(400).json({ error: "Search query city/state/town is required" });
  }

  const queryLower = query.toLowerCase().trim();
  const { cityName: parsedCity, suggestedTab } = resolveQueryMetadata(query);
  const parsedCityLower = parsedCity.toLowerCase();

  try {
    // 1. Direct Cache lookup for simple queries & known cities to give a 0ms response time
    const foundCity = db.cities.find(c => 
      parsedCityLower === c.name.toLowerCase() || 
      c.name.toLowerCase().includes(parsedCityLower) ||
      queryLower.includes(c.name.toLowerCase())
    );
    
    if (foundCity) {
      const cached = db.places.filter(p => p.city.toLowerCase() === foundCity.name.toLowerCase());
      // If we have plenty of cached places and the query isn't demanding a highly specific food/needs, return them instantly!
      const isSpecializedQuery = queryLower.split(/\s+/).length > 2 && 
                                 (queryLower.includes("biryani") || 
                                  queryLower.includes("food") || 
                                  queryLower.includes("budget") || 
                                  queryLower.includes("resort") || 
                                  queryLower.includes("hotel") ||
                                  queryLower.includes("spa") ||
                                  queryLower.includes("cafe"));
                                  
      if (cached.length >= 8 && !isSpecializedQuery) {
        console.log(`[Cache HIT] Returning ${cached.length} cached places for ${foundCity.name} instantly.`);
        return res.json({
          city: { 
            name: foundCity.name, 
            state: foundCity.state, 
            lat: foundCity.lat, 
            lng: foundCity.lng,
            image: foundCity.image,
            description: foundCity.description
          },
          places: cached,
          suggestedTab
        });
      }
    }

    // Secondary cache lookup checking if we have any places matching the city name mentioned in query
    const matchedCityPlace = db.places.find(p => 
      parsedCityLower.includes(p.city.toLowerCase()) || 
      queryLower.includes(p.city.toLowerCase())
    );
    if (matchedCityPlace) {
      const targetCityName = matchedCityPlace.city;
      const cached = db.places.filter(p => p.city.toLowerCase() === targetCityName.toLowerCase());
      const isSpecializedQuery = queryLower.split(/\s+/).length > 2 && 
                                 (queryLower.includes("biryani") || 
                                  queryLower.includes("food") || 
                                  queryLower.includes("budget") || 
                                  queryLower.includes("resort") || 
                                  queryLower.includes("hotel") ||
                                  queryLower.includes("spa") ||
                                  queryLower.includes("cafe"));
      if (cached.length >= 8 && !isSpecializedQuery) {
        console.log(`[Cache HIT] Returning ${cached.length} cached places for ${targetCityName} instantly.`);
        const cityDetails = db.cities.find(c => c.name.toLowerCase() === targetCityName.toLowerCase());
        return res.json({
          city: { 
            name: targetCityName, 
            state: matchedCityPlace.state, 
            lat: matchedCityPlace.coordinates.lat, 
            lng: matchedCityPlace.coordinates.lng,
            image: cityDetails?.image || cached.find(p => p.photos && p.photos.length > 0)?.photos[0] || "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1600",
            description: cityDetails?.description || `Explore the beautiful city of ${targetCityName} in ${matchedCityPlace.state}.`
          },
          places: cached,
          suggestedTab
        });
      }
    }

    // Save search query to history if logged in or globally
    const userId = req.headers["x-user-id"] as string || "anonymous";
    if (userId && userId !== "anonymous") {
      db.searchHistory.push({
        id: "sh-" + Math.random().toString(36).substr(2, 9),
        userId,
        query: query,
        timestamp: new Date().toISOString()
      });
      // Limit search history size
      if (db.searchHistory.length > 200) {
        db.searchHistory.shift();
      }
      saveDatabase(db);
    }

    let lat = clientLat ? parseFloat(clientLat as any) : null;
    let lng = clientLng ? parseFloat(clientLng as any) : null;
    let locationName = query;
    let state = "India";

    // 2. Try Gemini API if client is initialized
    if (ai) {
      try {
        const clientLatHint = lat;
        const clientLngHint = lng;

        const singlePrompt = `You are a world-class Indian travel concierge, geocoder, and food guide.
Analyze this search query: "${query}"
We need to resolve this query to a specific city/town/region in India, get its coordinates (lat/lng), and generate exactly 12-15 highly realistic, premium places matching the user's needs.

CRITICAL LOCATION HINT:
- If we already have coordinates hint: Lat: ${clientLatHint || "None"}, Lng: ${clientLngHint || "None"}, please use them or estimate around them.
- If no coordinates are hinted, use your accurate geographical knowledge to provide the correct central coordinates (lat/lng) for the detected city/town/region in India (e.g. Goa, Hyderabad, Anantapur, Coorg).

Analyze what specific travel, dining, or accommodation needs the user is expressing (e.g., "biryani spots", "budget homestays", "spa resorts", "vegetarian food", "heritage temples"). If they just entered a city name, keep this general. Customize the generated places to align directly with what the user is looking for! For example:
- If they asked for Biryani, produce legendary local Biryani specialty spots, family restaurants, and fine-dining places famous for it.
- If they wanted budget options, produce clean budget-friendly homestays, hotels, or cafes with realistic prices in Rupees.
- If they wanted resorts, focus heavily on magnificent local resorts with wonderful local activities.

Generate a beautiful, curated list of EXACTLY 12-15 highly realistic, premium places in the city/town that satisfy the user's specific needs.
Each generated place MUST match one of the standard category types: 'hotel' | 'restaurant' | 'resort' | 'attraction' | 'cafe'.

Ensure that:
- Each place has genuine names from the target location or nearby areas. Do NOT make up random English names if it's a rustic village.
- Add details like accurate addresses, beautiful descriptions (100-150 words showcasing local flair), rating (4.0 - 4.9), reviewCount (50 - 2000), priceLevel (1 to 4 stars representing ₹ to ₹₹₹₹), priceRange (in Indian Rupees, e.g. "₹5,000 - ₹12,000 per night" or "₹400 for two"), real-style Indian phone numbers, and websites (realistic domains like .in, .com).
- Set custom coordinates slightly offset from the central city coordinates so they spread nicely on a map (around 0.005 to 0.05 difference).
- Include robust amenities (e.g., 'WiFi', 'Swimming Pool', 'Parking', 'AC', 'Breakfast', 'Pet Friendly').
- For resorts, add lists of beautiful activities ('Yoga', 'Spa', 'Safari', 'Trekking') and room tiers.
- For restaurants, list menu highlights and popular foods (e.g. 'Butter Chicken', 'Hyderabadi Biryani', 'Masala Dosa').
- For photos, use premium Unsplash image URLs that render stunning travel architecture, hotel bedrooms, Indian foods, pools, beaches, and landscapes. Make sure the URLs are valid (e.g., use https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600 for hotels, https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600 for resorts, https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600 for biryani/food, https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600 for south indian food).

Return strictly a JSON object with this exact typescript structure:
{
  "city": {
    "name": "Name of the city/town/region (e.g. Anantapur, Hyderabad, Goa)",
    "state": "Name of the state (e.g. Andhra Pradesh, Telangana, Goa)",
    "lat": number (e.g. 14.6819),
    "lng": number (e.g. 77.6006)
  },
  "places": Array<Place>
}

Do not return any markdown formatting outside the JSON block. Start output with "{" and end with "}".`;

        const aiRes = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: singlePrompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              required: ["city", "places"],
              properties: {
                city: {
                  type: Type.OBJECT,
                  required: ["name", "state", "lat", "lng"],
                  properties: {
                    name: { type: Type.STRING },
                    state: { type: Type.STRING },
                    lat: { type: Type.NUMBER },
                    lng: { type: Type.NUMBER }
                  }
                },
                places: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    required: ["id", "name", "type", "subtypes", "rating", "reviewCount", "priceLevel", "address", "description", "photos", "facilities", "coordinates"],
                    properties: {
                      id: { type: Type.STRING },
                      name: { type: Type.STRING },
                      type: { type: Type.STRING, description: "Must be 'hotel' | 'restaurant' | 'resort' | 'attraction' | 'cafe'" },
                      subtypes: { type: Type.ARRAY, items: { type: Type.STRING } },
                      rating: { type: Type.NUMBER },
                      reviewCount: { type: Type.INTEGER },
                      priceLevel: { type: Type.INTEGER },
                      priceRange: { type: Type.STRING },
                      address: { type: Type.STRING },
                      description: { type: Type.STRING },
                      photos: { type: Type.ARRAY, items: { type: Type.STRING } },
                      facilities: { type: Type.ARRAY, items: { type: Type.STRING } },
                      phone: { type: Type.STRING },
                      website: { type: Type.STRING },
                      coordinates: {
                        type: Type.OBJECT,
                        required: ["lat", "lng"],
                        properties: {
                          lat: { type: Type.NUMBER },
                          lng: { type: Type.NUMBER }
                        }
                      },
                      openHours: { type: Type.STRING },
                      menuHighlights: { type: Type.ARRAY, items: { type: Type.STRING } },
                      popularFoods: { type: Type.ARRAY, items: { type: Type.STRING } },
                      vegFriendly: { type: Type.BOOLEAN },
                      nonVegFriendly: { type: Type.BOOLEAN },
                      activities: { type: Type.ARRAY, items: { type: Type.STRING } },
                      rooms: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          required: ["type", "price", "amenities"],
                          properties: {
                            type: { type: Type.STRING },
                            price: { type: Type.STRING },
                            amenities: { type: Type.ARRAY, items: { type: Type.STRING } }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        });

        const responseJson = JSON.parse(aiRes.text || '{"city": {"name": "", "state": "", "lat": 20.5937, "lng": 78.9629}, "places": []}');
        const responseCity = responseJson.city || {};
        locationName = responseCity.name || query;
        state = responseCity.state || "India";
        lat = responseCity.lat || 20.5937;
        lng = responseCity.lng || 78.9629;

        const enrichedPlaces: Place[] = (responseJson.places || []).map((p: any, idx: number) => ({
          ...p,
          photos: getSanitizedPhotos(p.type || "attraction", p.name || "", locationName, idx),
          city: locationName,
          state: state,
          reviews: [] // Initialize reviews empty
        }));

        // Cache these places in our local database
        enrichedPlaces.forEach(p => {
          const exists = db.places.find(dp => dp.name.toLowerCase() === p.name.toLowerCase());
          if (!exists) {
            db.places.push(p);
          }
        });
        
        // Cache the city info as well if it's not present
        const cityExists = db.cities.find(c => c.name.toLowerCase() === locationName.toLowerCase());
        if (!cityExists && enrichedPlaces.length > 0) {
          db.cities.push({
            name: locationName,
            state,
            description: getCityDescription(locationName, state),
            image: getCityImage(locationName),
            lat: lat!,
            lng: lng!
          });
        }

        saveDatabase(db);

        const cityDetails = db.cities.find(c => c.name.toLowerCase() === locationName.toLowerCase());
        return res.json({
          city: { 
            name: locationName, 
            state: state, 
            lat: lat!, 
            lng: lng!,
            image: cityDetails?.image || getCityImage(locationName),
            description: cityDetails?.description || getCityDescription(locationName, state)
          },
          places: enrichedPlaces,
          suggestedTab
        });

      } catch (geminiError: any) {
        console.error("Gemini API call failed, falling back to mock generation:", geminiError.message || geminiError);
      }
    }

    // 3. Fallback Mock Generation (runs if offline or if Gemini fails)
    console.log(`[Mock Fallback] Generating offline mock data for query: "${query}" (clean: "${parsedCity}")`);
    if (foundCity) {
      locationName = foundCity.name;
      state = foundCity.state;
      lat = foundCity.lat;
      lng = foundCity.lng;
    } else {
      const offlineGeo = OFFLINE_GEO_DB[parsedCityLower];
      if (offlineGeo) {
        locationName = offlineGeo.name;
        state = offlineGeo.state;
        lat = offlineGeo.lat;
        lng = offlineGeo.lng;
      } else {
        // Try querying OpenStreetMap Nominatim API for geocoding
        let resolved = false;
        try {
          const osmRes = await fetchWithTimeout(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(parsedCity + ", India")}&format=json&limit=1`,
            { headers: { "User-Agent": "ExploreIndia-App" } },
            2000
          );
          if (osmRes.ok) {
            const osmData = await osmRes.json();
            if (osmData && osmData.length > 0) {
              const first = osmData[0];
              lat = parseFloat(first.lat);
              lng = parseFloat(first.lon);
              locationName = parsedCity;
              
              const parts = first.display_name.split(", ");
              if (parts.length > 2) {
                state = parts[parts.length - 2];
              } else {
                state = "India";
              }
              resolved = true;
              console.log(`[OSM Geocoder] Resolved "${parsedCity}" to ${lat}, ${lng} (${state})`);
            }
          }
        } catch (osmError) {
          console.error("OSM Geocoding failed:", osmError);
        }

        if (!resolved) {
          locationName = parsedCity;
          state = "India";
          lat = lat || 20.5937;
          lng = lng || 78.9629;
        }
      }
    }

    let fallbackPlaces = db.places.filter(p => p.city.toLowerCase() === locationName.toLowerCase());
    if (fallbackPlaces.length < 6) {
      const generated = generateMockPlaces(locationName, state, lat, lng, query);
      generated.forEach(p => {
        const exists = db.places.find(dp => dp.name.toLowerCase() === p.name.toLowerCase());
        if (!exists) {
          db.places.push(p);
          fallbackPlaces.push(p);
        }
      });

      const cityExists = db.cities.find(c => c.name.toLowerCase() === locationName.toLowerCase());
      if (!cityExists) {
        db.cities.push({
          name: locationName,
          state,
          description: getCityDescription(locationName, state),
          image: getCityImage(locationName),
          lat,
          lng
        });
      }
      saveDatabase(db);
    }

    const cityDetails = db.cities.find(c => c.name.toLowerCase() === locationName.toLowerCase());
    return res.json({
      city: { 
        name: locationName, 
        state, 
        lat, 
        lng,
        image: cityDetails?.image || getCityImage(locationName),
        description: cityDetails?.description || getCityDescription(locationName, state)
      },
      places: fallbackPlaces,
      suggestedTab
    });

  } catch (error: any) {
    console.error("Discovery API Error:", error);
    res.status(500).json({ error: error.message || "Failed to search and enrich locations" });
  }
});

// Seed data fetching / Global Places list
app.get("/api/places/trending", (req: Request, res: Response) => {
  // If we have no places cached, let's pre-generate or return seeds
  // To avoid empty app, let's return some beautifully seeded default Indian spots
  if (db.places.length === 0) {
    // Generate some mock top quality places
    const seedPlaces: Place[] = [
      {
        id: "p-goa-1",
        name: "Taj Exotica Resort & Spa",
        type: "resort",
        subtypes: ["Resorts", "Luxury Hotels", "Beach Resorts"],
        rating: 4.8,
        reviewCount: 1240,
        priceLevel: 4,
        priceRange: "₹25,000 - ₹45,000 per night",
        address: "Calwaddo, Benaulim, Goa 403716",
        description: "Embrace the Mediterranean style architecture spread across 56 acres of lush gardens along the beach. Features multi-cuisine fine dining, world-class golf sessions, Ayurvedic spa, and grand outdoor pools.",
        photos: [
          "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600",
          "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600"
        ],
        facilities: ["WiFi", "Swimming Pool", "Parking", "AC", "Breakfast", "Spa", "Gym", "Private Beach Access"],
        phone: "+91 832 668 3333",
        website: "https://www.tajhotels.com",
        coordinates: { lat: 15.2449, lng: 73.9213 },
        city: "Goa",
        state: "Goa",
        activities: ["Private Beach Dinner", "9-hole Golf Course", "Ayurvedic Jiva Spa", "Water Sports"],
        rooms: [
          { type: "Deluxe Sea View Room", price: "₹28,000", amenities: ["King Bed", "Private Balcony", "Sea View"] },
          { type: "Luxury Villa Plunge Pool", price: "₹52,000", amenities: ["Private Plunge Pool", "Butlers Service", "Garden Access"] }
        ]
      },
      {
        id: "p-hyd-1",
        name: "Jewel of Nizams - Minar",
        type: "restaurant",
        subtypes: ["Fine Dining", "Non-Vegetarian Restaurants", "Famous Food Places"],
        rating: 4.7,
        reviewCount: 890,
        priceLevel: 4,
        priceRange: "₹3,500 for two",
        address: "The Golkonda Resort, Gandipet, Hyderabad 500075",
        description: "An iconic tower-restaurant elevated 100 feet in the air, offering the ultimate authentic royal Hyderabadi culinary experience, backed by spectacular views of the Osman Sagar lake.",
        photos: [
          "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600",
          "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600"
        ],
        facilities: ["Parking", "AC", "Valet Parking", "Lake View", "Rooftop Deck"],
        phone: "+91 40 2419 3000",
        website: "https://www.golkondaresorts.com",
        coordinates: { lat: 17.3820, lng: 78.3032 },
        city: "Hyderabad",
        state: "Telangana",
        menuHighlights: ["Anokhi Kheer", "Pathar ka Gosht", "Kachis Biryani", "Subz Haleem"],
        popularFoods: ["Royal Hyderabadi Haleem", "Nizami Mutton Biryani", "Double ka Meetha"],
        vegFriendly: true,
        nonVegFriendly: true
      },
      {
        id: "p-blr-1",
        name: "The Black Pearl",
        type: "restaurant",
        subtypes: ["Family Restaurants", "Fine Dining", "Famous Food Places"],
        rating: 4.6,
        reviewCount: 2310,
        priceLevel: 3,
        priceRange: "₹1,800 for two",
        address: "5th Block, Koramangala, Bangalore 560095",
        description: "India's famous pirate-themed buffet restaurant. Styled like an authentic wooden pirate ship with skull models, pirate flags, and live music, serving outstanding international barbecues and local favorites.",
        photos: [
          "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600",
          "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600"
        ],
        facilities: ["WiFi", "Parking", "AC", "Live Music", "Bar", "Kids Friendly Area"],
        phone: "+91 80 4965 2940",
        website: "https://theblackpearl.co.in",
        coordinates: { lat: 12.9344, lng: 77.6212 },
        city: "Bangalore",
        state: "Karnataka",
        menuHighlights: ["Cajun Spiced Potatoes", "Jamaican Jerk Chicken", "Pirate Chocolate Mousse"],
        popularFoods: ["Custom Grill Skewers", "Unlimited Craft Beer", "Prawn Pepper Fry"],
        vegFriendly: true,
        nonVegFriendly: true
      },
      {
        id: "p-jaipur-1",
        name: "The Raj Palace Hotel",
        type: "hotel",
        subtypes: ["Luxury Hotels", "Resorts"],
        rating: 4.9,
        reviewCount: 950,
        priceLevel: 4,
        priceRange: "₹35,000 - ₹75,000 per night",
        address: "Jorawar Singh Gate, Amer Road, Jaipur 302002",
        description: "A breathtaking royal heritage palace built in 1727. Resplendent with antique chandeliers, gold-leafed pillars, royal museums, and sprawling courtyards, giving guests the feeling of true Maharaja royalty.",
        photos: [
          "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600",
          "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600"
        ],
        facilities: ["WiFi", "Swimming Pool", "Parking", "AC", "Breakfast", "Royal Museum", "Spa", "Shuttle Service"],
        phone: "+91 141 263 4077",
        website: "http://www.rajpalace.com",
        coordinates: { lat: 26.9388, lng: 75.8310 },
        city: "Jaipur",
        state: "Rajasthan",
        rooms: [
          { type: "Heritage Room", price: "₹38,000", amenities: ["Royal Decor", "Antique Canopy Bed", "Garden View"] },
          { type: "The Maharaja Suite", price: "₹1,20,000", amenities: ["Private Elevator", "Gold Plated Baths", "Private Dining Room"] }
        ]
      },
      {
        id: "p-temple-1",
        name: "Brihadeeswarar Temple",
        type: "temple",
        subtypes: ["Spiritual Sites", "Temples", "Heritage Shrines", "UNESCO World Heritage"],
        rating: 4.9,
        reviewCount: 3840,
        priceLevel: 1,
        priceRange: "Free Entry (VIP Darshan ₹100)",
        address: "Membalam Road, Balaji Nagar, Thanjavur, Tamil Nadu 613007",
        description: "A breathtaking UNESCO World Heritage site and masterpiece of Chola architecture built by Rajaraja I in 1010 AD. Known for its massive 66m vimana tower, granite structures, and sacred stone inscriptions.",
        photos: [
          "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600",
          "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=600"
        ],
        facilities: ["Parking", "Guided Tours", "Shoe Keeping Area", "Prasadam Counter", "Camera Allowed Outside"],
        phone: "+91 462 230 1205",
        website: "https://www.tamilnadutourism.tn.gov.in",
        coordinates: { lat: 10.7828, lng: 79.1319 },
        city: "Thanjavur",
        state: "Tamil Nadu",
        activities: ["Granite Vimana Tour", "Evening Sacred Aarti", "Ancient Epigraphy Reading"],
        rooms: []
      }
    ];

    db.places = seedPlaces;
    saveDatabase(db);
  }

  res.json(db.places);
});

// Single Place details with dynamic reviews
app.get("/api/places/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const place = db.places.find(p => p.id === id);
  if (!place) {
    return res.status(404).json({ error: "Place not found" });
  }

  // Get active approved reviews
  const placeReviews = db.reviews.filter(r => r.placeId === id && r.approved);
  res.json({
    ...place,
    reviews: placeReviews
  });
});

// Favorites Handling
app.post("/api/favorites/toggle", authenticateToken, (req: Request, res: Response) => {
  const { placeId } = req.body;
  const userPayload = (req as any).user;
  
  if (!placeId) {
    return res.status(400).json({ error: "placeId is required" });
  }

  const user = db.users.find(u => u.id === userPayload.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (!user.favorites) {
    user.favorites = [];
  }

  const idx = user.favorites.indexOf(placeId);
  let action: "added" | "removed" = "added";
  if (idx > -1) {
    user.favorites.splice(idx, 1);
    action = "removed";
  } else {
    user.favorites.push(placeId);
    action = "added";
  }

  saveDatabase(db);
  res.json({ success: true, action, favorites: user.favorites });
});

// Reviews Endpoints
app.post("/api/reviews", authenticateToken, (req: Request, res: Response) => {
  const { placeId, rating, text } = req.body;
  const userPayload = (req as any).user;

  if (!placeId || !rating || !text) {
    return res.status(400).json({ error: "placeId, rating, and review text are required" });
  }

  const user = db.users.find(u => u.id === userPayload.id);
  const place = db.places.find(p => p.id === placeId);

  if (!place) {
    return res.status(404).json({ error: "Place not found" });
  }

  const newReview: Review = {
    id: "r-" + Math.random().toString(36).substr(2, 9),
    placeId,
    userId: userPayload.id,
    userName: user ? user.name : userPayload.name,
    userAvatar: user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
    rating: Number(rating),
    text,
    date: new Date().toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' }),
    approved: user?.role === "admin" ? true : false // Auto-approve if admin, otherwise needs approval (Admin Panel feature!)
  };

  db.reviews.push(newReview);

  // Recalculate Place overall rating if approved immediately
  if (newReview.approved) {
    const placeReviews = db.reviews.filter(r => r.placeId === placeId && r.approved);
    const avg = placeReviews.reduce((sum, r) => sum + r.rating, 0) / placeReviews.length;
    place.rating = parseFloat(avg.toFixed(1));
    place.reviewCount = placeReviews.length;
  }

  saveDatabase(db);

  res.status(201).json({
    review: newReview,
    message: newReview.approved 
      ? "Review added successfully!" 
      : "Review submitted! It will appear after admin approval."
  });
});

// Notifications
app.get("/api/notifications", authenticateToken, (req: Request, res: Response) => {
  const userPayload = (req as any).user;
  const list = db.notifications.filter(n => n.userId === userPayload.id);
  res.json(list);
});

app.post("/api/notifications/read-all", authenticateToken, (req: Request, res: Response) => {
  const userPayload = (req as any).user;
  db.notifications.forEach(n => {
    if (n.userId === userPayload.id) {
      n.read = true;
    }
  });
  saveDatabase(db);
  res.json({ success: true });
});

// Profile / History Endpoints
app.get("/api/user/profile", authenticateToken, (req: Request, res: Response) => {
  const userPayload = (req as any).user;
  const user = db.users.find(u => u.id === userPayload.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // Get full user saved places
  const favPlaces = db.places.filter(p => (user.favorites || []).includes(p.id));
  
  // Get search history
  const history = db.searchHistory
    .filter(sh => sh.userId === userPayload.id)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10);

  // Get reviews posted by user
  const userReviews = db.reviews.filter(r => r.userId === userPayload.id);

  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      avatar: user.avatar,
      favorites: user.favorites || []
    },
    favorites: favPlaces,
    history,
    reviews: userReviews
  });
});

app.post("/api/user/clear-history", authenticateToken, (req: Request, res: Response) => {
  const userPayload = (req as any).user;
  db.searchHistory = db.searchHistory.filter(sh => sh.userId !== userPayload.id);
  saveDatabase(db);
  res.json({ success: true });
});

app.post("/api/user/profile/update", authenticateToken, (req: Request, res: Response) => {
  const { name, avatar } = req.body;
  const userPayload = (req as any).user;

  const user = db.users.find(u => u.id === userPayload.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (name) user.name = name;
  if (avatar) user.avatar = avatar;

  saveDatabase(db);
  res.json({ success: true, user });
});

// Trips & Itinerary Planner Endpoints
app.get("/api/trips", authenticateToken, (req: Request, res: Response) => {
  const userPayload = (req as any).user;
  db.trips = db.trips || [];
  const userTrips = db.trips.filter((t: any) => t.userId === userPayload.id);
  res.json(userTrips);
});

app.post("/api/trips", authenticateToken, (req: Request, res: Response) => {
  const { name, destination, days } = req.body;
  const userPayload = (req as any).user;
  if (!name || !destination || !days) {
    return res.status(400).json({ error: "Name, destination and days are required" });
  }

  db.trips = db.trips || [];
  const newTrip = {
    id: "t-" + Math.random().toString(36).substr(2, 9),
    userId: userPayload.id,
    name,
    destination,
    days: Number(days),
    itinerary: Array.from({ length: Number(days) }, (_, i) => ({ day: i + 1, places: [] as any[] })),
    notes: {} as Record<string, string>,
    createdAt: new Date().toISOString()
  };

  db.trips.push(newTrip);
  saveDatabase(db);
  res.status(201).json(newTrip);
});

app.delete("/api/trips/:id", authenticateToken, (req: Request, res: Response) => {
  const { id } = req.params;
  const userPayload = (req as any).user;
  db.trips = db.trips || [];
  
  const tripIdx = db.trips.findIndex((t: any) => t.id === id && t.userId === userPayload.id);
  if (tripIdx === -1) {
    return res.status(404).json({ error: "Trip not found" });
  }

  db.trips.splice(tripIdx, 1);
  saveDatabase(db);
  res.json({ success: true });
});

app.post("/api/trips/:id/add-place", authenticateToken, (req: Request, res: Response) => {
  const { id } = req.params;
  const { placeId, day } = req.body;
  const userPayload = (req as any).user;
  db.trips = db.trips || [];

  const trip = db.trips.find((t: any) => t.id === id && t.userId === userPayload.id);
  if (!trip) {
    return res.status(404).json({ error: "Trip not found" });
  }

  const place = db.places.find(p => p.id === placeId);
  if (!place) {
    return res.status(404).json({ error: "Place not found" });
  }

  const dayNum = Number(day);
  const dayPlan = (trip as any).itinerary.find((dayIt: any) => dayIt.day === dayNum);
  if (!dayPlan) {
    return res.status(400).json({ error: "Invalid day selection" });
  }

  const alreadyAdded = dayPlan.places.some((p: any) => p.id === placeId);
  if (!alreadyAdded) {
    dayPlan.places.push({
      id: place.id,
      name: place.name,
      type: place.type,
      rating: place.rating,
      reviewCount: place.reviewCount,
      photos: place.photos,
      address: place.address,
      city: place.city,
      state: place.state,
      coordinates: place.coordinates
    });
    saveDatabase(db);
  }

  res.json(trip);
});

app.post("/api/trips/:id/remove-place", authenticateToken, (req: Request, res: Response) => {
  const { id } = req.params;
  const { placeId, day } = req.body;
  const userPayload = (req as any).user;
  db.trips = db.trips || [];

  const trip = db.trips.find((t: any) => t.id === id && t.userId === userPayload.id);
  if (!trip) {
    return res.status(404).json({ error: "Trip not found" });
  }

  const dayNum = Number(day);
  const dayPlan = (trip as any).itinerary.find((dayIt: any) => dayIt.day === dayNum);
  if (!dayPlan) {
    return res.status(400).json({ error: "Invalid day selection" });
  }

  dayPlan.places = dayPlan.places.filter((p: any) => p.id !== placeId);
  saveDatabase(db);
  res.json(trip);
});

app.post("/api/trips/:id/update-notes", authenticateToken, (req: Request, res: Response) => {
  const { id } = req.params;
  const { day, note } = req.body;
  const userPayload = (req as any).user;
  db.trips = db.trips || [];

  const trip = db.trips.find((t: any) => t.id === id && t.userId === userPayload.id);
  if (!trip) {
    return res.status(404).json({ error: "Trip not found" });
  }

  (trip as any).notes = (trip as any).notes || {};
  (trip as any).notes[String(day)] = note;
  
  saveDatabase(db);
});

// Booking & Reservations Persistence Endpoints
app.get("/api/bookings", authenticateToken, (req: Request, res: Response) => {
  const userPayload = (req as any).user;
  db.bookings = db.bookings || [];
  const userBookings = db.bookings.filter((b: any) => b.userId === userPayload.id);
  res.json(userBookings);
});

app.post("/api/bookings", authenticateToken, (req: Request, res: Response) => {
  const { placeId, date, dateOut, guests, time } = req.body;
  const userPayload = (req as any).user;

  if (!placeId || !date || !guests) {
    return res.status(400).json({ error: "Place ID, date, and guest count are required" });
  }

  const place = db.places.find(p => p.id === placeId);
  if (!place) {
    return res.status(404).json({ error: "Tourist spot or hotel not found" });
  }

  db.bookings = db.bookings || [];
  const newBooking = {
    id: "b-" + Math.random().toString(36).substr(2, 9),
    userId: userPayload.id,
    placeId: place.id,
    placeName: place.name,
    placePhoto: place.photos?.[0] || "",
    city: place.city,
    date,
    dateOut: dateOut || "",
    guests,
    time: time || "",
    status: "confirmed", // auto-confirm since it's a simulated VIP concierge portal
    createdAt: new Date().toISOString()
  };

  db.bookings.push(newBooking);
  saveDatabase(db);
  res.status(201).json(newBooking);
});

app.delete("/api/bookings/:id", authenticateToken, (req: Request, res: Response) => {
  const { id } = req.params;
  const userPayload = (req as any).user;
  db.bookings = db.bookings || [];

  const bookingIdx = db.bookings.findIndex((b: any) => b.id === id && b.userId === userPayload.id);
  if (bookingIdx === -1) {
    return res.status(404).json({ error: "Booking reservation not found" });
  }

  db.bookings.splice(bookingIdx, 1);
  saveDatabase(db);
  res.json({ success: true });
});

// -------------------------------------------------------------
// Admin Endpoints
// -------------------------------------------------------------

// Admin check middleware
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const userPayload = (req as any).user;
  if (!userPayload || userPayload.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
}

app.get("/api/admin/analytics", authenticateToken, requireAdmin, (req: Request, res: Response) => {
  const usersCount = db.users.length;
  const placesCount = db.places.length;
  const reviewsCount = db.reviews.length;
  const searchesCount = db.searchHistory.length;

  // Breakdown places by type
  const placesByType: Record<PlaceType, number> = {
    hotel: 0,
    restaurant: 0,
    resort: 0,
    attraction: 0,
    cafe: 0,
    temple: 0
  };
  db.places.forEach(p => {
    if (placesByType[p.type] !== undefined) {
      placesByType[p.type]++;
    }
  });

  // Calculate popular cities from history
  const cityCounts: Record<string, number> = {};
  db.searchHistory.forEach(sh => {
    cityCounts[sh.query] = (cityCounts[sh.query] || 0) + 1;
  });
  const popularCities = Object.entries(cityCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const analytics: AnalyticsData = {
    usersCount,
    placesCount,
    reviewsCount,
    searchesCount,
    placesByType,
    popularCities
  };

  res.json(analytics);
});

// Manage places CRUD (Admin Panel)
app.get("/api/admin/places", authenticateToken, requireAdmin, (req: Request, res: Response) => {
  res.json(db.places);
});

app.post("/api/admin/places", authenticateToken, requireAdmin, (req: Request, res: Response) => {
  const newPlace: Place = {
    ...req.body,
    id: "p-" + Math.random().toString(36).substr(2, 9),
    rating: Number(req.body.rating || 4.5),
    reviewCount: 0,
    reviews: []
  };
  db.places.push(newPlace);
  saveDatabase(db);
  res.status(201).json(newPlace);
});

app.put("/api/admin/places/:id", authenticateToken, requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const idx = db.places.findIndex(p => p.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: "Place not found" });
  }

  db.places[idx] = {
    ...db.places[idx],
    ...req.body,
    id // preserve id
  };
  saveDatabase(db);
  res.json(db.places[idx]);
});

app.delete("/api/admin/places/:id", authenticateToken, requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  db.places = db.places.filter(p => p.id !== id);
  db.reviews = db.reviews.filter(r => r.placeId !== id);
  saveDatabase(db);
  res.json({ success: true, message: "Place deleted successfully" });
});

// Manage Users (Admin Panel)
app.get("/api/admin/users", authenticateToken, requireAdmin, (req: Request, res: Response) => {
  res.json(db.users.map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role, isVerified: u.isVerified, avatar: u.avatar })));
});

app.delete("/api/admin/users/:id", authenticateToken, requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  if (id === "admin-id") {
    return res.status(400).json({ error: "Cannot delete master administrator account" });
  }
  db.users = db.users.filter(u => u.id !== id);
  saveDatabase(db);
  res.json({ success: true, message: "User deleted successfully" });
});

// Approve Pending Reviews
app.get("/api/admin/reviews/pending", authenticateToken, requireAdmin, (req: Request, res: Response) => {
  const pending = db.reviews.filter(r => !r.approved);
  res.json(pending);
});

app.post("/api/admin/reviews/approve/:id", authenticateToken, requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const review = db.reviews.find(r => r.id === id);
  if (!review) {
    return res.status(404).json({ error: "Review not found" });
  }

  review.approved = true;

  // Recalculate place overall rating
  const place = db.places.find(p => p.id === review.placeId);
  if (place) {
    const placeReviews = db.reviews.filter(r => r.placeId === review.placeId && r.approved);
    const avg = placeReviews.reduce((sum, r) => sum + r.rating, 0) / placeReviews.length;
    place.rating = parseFloat(avg.toFixed(1));
    place.reviewCount = placeReviews.length;
  }

  // Notify user
  db.notifications.push({
    id: "notif-" + Math.random().toString(36).substr(2, 9),
    userId: review.userId,
    text: `Your review for ${place ? place.name : 'a place'} has been approved by the admin!`,
    type: "success",
    read: false,
    date: new Date().toISOString()
  });

  saveDatabase(db);
  res.json({ success: true, message: "Review approved successfully" });
});

app.delete("/api/admin/reviews/:id", authenticateToken, requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const review = db.reviews.find(r => r.id === id);
  if (!review) {
    return res.status(404).json({ error: "Review not found" });
  }

  db.reviews = db.reviews.filter(r => r.id !== id);

  // Recalculate place overall rating
  const place = db.places.find(p => p.id === review.placeId);
  if (place) {
    const placeReviews = db.reviews.filter(r => r.placeId === review.placeId && r.approved);
    if (placeReviews.length > 0) {
      const avg = placeReviews.reduce((sum, r) => sum + r.rating, 0) / placeReviews.length;
      place.rating = parseFloat(avg.toFixed(1));
      place.reviewCount = placeReviews.length;
    } else {
      place.rating = 4.5;
      place.reviewCount = 0;
    }
  }

  saveDatabase(db);
  res.json({ success: true, message: "Review deleted successfully" });
});

// Serve Travel Tips & static lists
app.get("/api/tips", (req: Request, res: Response) => {
  res.json(db.travelTips);
});

app.get("/api/cities/trending", (req: Request, res: Response) => {
  res.json(db.cities.slice(0, 6));
});

app.get("/api/hotels/famous", (req: Request, res: Response) => {
  const famousNames = [
    "Taj Falaknuma Palace",
    "The Taj Mahal Palace",
    "Taj Exotica Resort & Spa",
    "The Leela Palace Bangalore",
    "The Raj Palace Hotel",
    "The Oberoi New Delhi",
    "W Goa"
  ];
  const list = db.places.filter(p => famousNames.some(name => p.name.toLowerCase().includes(name.toLowerCase())));
  const uniqueList: typeof list = [];
  const namesSeen = new Set<string>();
  for (const item of list) {
    if (!namesSeen.has(item.name)) {
      namesSeen.add(item.name);
      uniqueList.push(item);
    }
  }
  res.json(uniqueList.slice(0, 6));
});

// -------------------------------------------------------------
// Vite Configuration & Client Handlers
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ExploreIndia server running on http://localhost:${PORT}`);
  });
}

startServer();
