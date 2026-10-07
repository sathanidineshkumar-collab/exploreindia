import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { Database } from "../models/types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Determine database file path reliably
function resolveDbPath(): string {
  const possiblePaths = [
    path.resolve(__dirname, "../../data_store.json"),
    path.resolve(process.cwd(), "backend", "data_store.json"),
    path.resolve(process.cwd(), "data_store.json"),
    path.resolve(__dirname, "../../../data_store.json")
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return p;
    }
  }

  // Default path in backend directory
  return path.resolve(process.cwd(), "data_store.json");
}

export const DB_FILE = resolveDbPath();

export const initialDatabase: Database = {
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
  ],
  trips: [],
  bookings: []
};

export function loadDatabase(): Database {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      const parsed = JSON.parse(data);
      parsed.trips = parsed.trips || [];
      parsed.bookings = parsed.bookings || [];
      return parsed;
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

export function saveDatabase(database: Database): void {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(database, null, 2));
  } catch (error) {
    console.error("Error writing database:", error);
  }
}

export const db: Database = loadDatabase();
db.trips = db.trips || [];
db.bookings = db.bookings || [];
