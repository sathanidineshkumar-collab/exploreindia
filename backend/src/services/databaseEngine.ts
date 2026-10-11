import { Place, CityInfo, CategoryCounts, PlaceCategory, LatLng } from "../models/types";
import { db, saveDatabase } from "../config/db";
import { getCityHeroImage, getPlacePhotos } from "./imageService";
import { isValidIndiaCoordinate } from "./osmService";

/**
 * ExploreIndia Database & Indexing Engine
 * Provides indexed lookups, deduplication, pagination, and multi-category querying.
 */

class DatabaseEngine {
  private idIndex = new Map<string, Place>();
  private sourceIdIndex = new Map<string, string>(); // source:sourceId -> placeId
  private cityIndex = new Map<string, Set<string>>(); // cityLower -> Set of placeIds
  private stateIndex = new Map<string, Set<string>>(); // stateLower -> Set of placeIds
  private categoryIndex = new Map<string, Set<string>>(); // categoryLower -> Set of placeIds
  private typeIndex = new Map<string, Set<string>>(); // typeLower -> Set of placeIds
  private tokenIndex = new Map<string, Set<string>>(); // token -> Set of placeIds
  private initialized = false;

  constructor() {
    this.rebuildIndexes();
  }

  public rebuildIndexes(): void {
    this.idIndex.clear();
    this.sourceIdIndex.clear();
    this.cityIndex.clear();
    this.stateIndex.clear();
    this.categoryIndex.clear();
    this.typeIndex.clear();
    this.tokenIndex.clear();

    const places = db.places || [];
    for (const p of places) {
      this.indexPlace(p);
    }
    this.initialized = true;
  }

  private indexPlace(place: Place): void {
    this.idIndex.set(place.id, place);

    // Source deduplication key
    if (place.source && place.sourceId) {
      this.sourceIdIndex.set(`${place.source}:${place.sourceId}`, place.id);
    }

    // City Index
    const cityKey = (place.city || "").toLowerCase().trim();
    if (cityKey) {
      if (!this.cityIndex.has(cityKey)) this.cityIndex.set(cityKey, new Set());
      this.cityIndex.get(cityKey)!.add(place.id);
    }

    // State Index
    const stateKey = (place.state || "").toLowerCase().trim();
    if (stateKey) {
      if (!this.stateIndex.has(stateKey)) this.stateIndex.set(stateKey, new Set());
      this.stateIndex.get(stateKey)!.add(place.id);
    }

    // Category Index
    const cat = this.normalizeCategory(place);
    if (!this.categoryIndex.has(cat)) this.categoryIndex.set(cat, new Set());
    this.categoryIndex.get(cat)!.add(place.id);

    // Legacy Type Index
    const typeKey = (place.type || "").toLowerCase().trim();
    if (typeKey) {
      if (!this.typeIndex.has(typeKey)) this.typeIndex.set(typeKey, new Set());
      this.typeIndex.get(typeKey)!.add(place.id);
    }

    // Search Token Index
    const tokens = this.extractTokens(place);
    for (const token of tokens) {
      if (!this.tokenIndex.has(token)) this.tokenIndex.set(token, new Set());
      this.tokenIndex.get(token)!.add(place.id);
    }
  }

  public normalizeCategory(place: Place): string {
    if (place.category) return place.category.toLowerCase().trim();
    if (place.type === "temple") return "temple";
    if (place.type === "hotel" || place.type === "resort") return "hotel";
    if (place.type === "restaurant" || place.type === "cafe") return "restaurant";

    const subs = (place.subtypes || []).map((s) => s.toLowerCase());
    if (subs.some((s) => s.includes("fort") || s.includes("palace") || s.includes("monument") || s.includes("heritage"))) {
      return "heritage";
    }
    if (subs.some((s) => s.includes("beach") || s.includes("coastal"))) {
      return "beach";
    }
    if (subs.some((s) => s.includes("waterfall") || s.includes("lake") || s.includes("river"))) {
      return "waterfall";
    }
    if (subs.some((s) => s.includes("wildlife") || s.includes("zoo") || s.includes("safari") || s.includes("national park"))) {
      return "wildlife";
    }
    if (subs.some((s) => s.includes("museum") || s.includes("gallery"))) {
      return "museum";
    }
    if (subs.some((s) => s.includes("market") || s.includes("bazaar") || s.includes("shopping"))) {
      return "market";
    }
    if (subs.some((s) => s.includes("garden") || s.includes("park"))) {
      return "garden";
    }
    return "attraction";
  }

  private extractTokens(place: Place): Set<string> {
    const raw = [
      place.name,
      ...(place.altNames || []),
      place.city,
      place.state,
      place.category,
      place.type,
      ...(place.subtypes || []),
      ...(place.tags || []),
      ...(place.menuHighlights || [])
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const words = raw.split(/[\s,.-/()]+/).filter((w) => w.length >= 2);
    return new Set(words);
  }

  /**
   * Upsert a place record with strict deduplication
   */
  public upsertPlace(place: Place, save: boolean = true): { action: "inserted" | "updated" | "skipped"; id: string } {
    // Coordinate validation
    if (!isValidIndiaCoordinate(place.coordinates.lat, place.coordinates.lng)) {
      return { action: "skipped", id: place.id };
    }

    // Standardize category and country
    place.category = this.normalizeCategory(place);
    place.country = place.country || "India";

    // 1. Check by source & sourceId
    if (place.source && place.sourceId) {
      const existingId = this.sourceIdIndex.get(`${place.source}:${place.sourceId}`);
      if (existingId) {
        const existingIdx = db.places.findIndex((p) => p.id === existingId);
        if (existingIdx !== -1) {
          db.places[existingIdx] = { ...db.places[existingIdx], ...place, id: existingId };
          this.indexPlace(db.places[existingIdx]);
          if (save) saveDatabase(db);
          return { action: "updated", id: existingId };
        }
      }
    }

    // 2. Check by City & Name collision
    const cityKey = place.city.toLowerCase().trim();
    const nameKey = place.name.toLowerCase().trim();
    const cityPlaces = this.cityIndex.get(cityKey);

    if (cityPlaces) {
      for (const id of cityPlaces) {
        const existing = this.idIndex.get(id);
        if (existing && (existing.name.toLowerCase().trim() === nameKey || existing.id === place.id)) {
          const idx = db.places.findIndex((p) => p.id === existing.id);
          if (idx !== -1) {
            db.places[idx] = { ...db.places[idx], ...place, id: existing.id };
            this.indexPlace(db.places[idx]);
            if (save) saveDatabase(db);
            return { action: "updated", id: existing.id };
          }
        }
      }
    }

    // 3. New record insertion
    db.places.push(place);
    this.indexPlace(place);
    if (save) saveDatabase(db);
    return { action: "inserted", id: place.id };
  }

  /**
   * Bulk import destinations with detailed report
   */
  public bulkImport(
    places: Place[],
    sourceName: string
  ): {
    discovered: number;
    inserted: number;
    updated: number;
    skipped: number;
    rejected: number;
  } {
    let inserted = 0;
    let updated = 0;
    let skipped = 0;
    let rejected = 0;

    for (const p of places) {
      if (!isValidIndiaCoordinate(p.coordinates.lat, p.coordinates.lng)) {
        rejected++;
        continue;
      }

      const res = this.upsertPlace(p, false);
      if (res.action === "inserted") inserted++;
      else if (res.action === "updated") updated++;
      else skipped++;
    }

    saveDatabase(db);
    return {
      discovered: places.length,
      inserted,
      updated,
      skipped,
      rejected
    };
  }

  /**
   * Comprehensive query method with pagination, multi-category filters, and category counts
   */
  public queryPlaces(params: {
    city?: string;
    state?: string;
    category?: string;
    type?: string;
    search?: string;
    priceLevel?: number;
    minRating?: number;
    facilities?: string[];
    vegOnly?: boolean;
    nonVegOnly?: boolean;
    sortBy?: "rating" | "reviews" | "price_asc" | "price_desc" | "name" | "featured";
    page?: number;
    limit?: number;
  }): {
    places: Place[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    categoryCounts: CategoryCounts;
  } {
    const page = Math.max(1, params.page || 1);
    const limit = Math.max(1, Math.min(100, params.limit || 24));

    let candidateIds: Set<string> | null = null;

    // Filter by City
    if (params.city) {
      const cityKey = params.city.toLowerCase().trim();
      const ids = this.cityIndex.get(cityKey);
      candidateIds = ids ? new Set(ids) : new Set();
    }

    // Filter by State
    if (params.state) {
      const stateKey = params.state.toLowerCase().trim();
      const stateIds = this.stateIndex.get(stateKey) || new Set();
      if (candidateIds === null) {
        candidateIds = new Set(stateIds);
      } else {
        candidateIds = new Set([...candidateIds].filter((id) => stateIds.has(id)));
      }
    }

    // Search query token intersection
    if (params.search) {
      const searchTokens = params.search
        .toLowerCase()
        .split(/[\s,.-]+/)
        .filter((w) => w.length >= 2);

      if (searchTokens.length > 0) {
        const matchingSearchIds = new Set<string>();
        for (const token of searchTokens) {
          const ids = this.tokenIndex.get(token);
          if (ids) {
            for (const id of ids) matchingSearchIds.add(id);
          }
        }
        if (candidateIds === null) {
          candidateIds = matchingSearchIds;
        } else {
          candidateIds = new Set([...candidateIds].filter((id) => matchingSearchIds.has(id)));
        }
      }
    }

    // Gather candidate places
    const allCandidates = candidateIds !== null
      ? [...candidateIds].map((id) => this.idIndex.get(id)).filter(Boolean) as Place[]
      : (db.places || []);

    // Compute Category Counts for the current location/search scope BEFORE applying category filter
    const categoryCounts: CategoryCounts = {
      all: allCandidates.length,
      temple: 0,
      heritage: 0,
      attraction: 0,
      museum: 0,
      beach: 0,
      waterfall: 0,
      nature: 0,
      wildlife: 0,
      hotel: 0,
      restaurant: 0,
      adventure: 0,
      garden: 0,
      market: 0,
      transit: 0
    };

    for (const p of allCandidates) {
      const c = this.normalizeCategory(p);
      categoryCounts[c] = (categoryCounts[c] || 0) + 1;
      // Also maintain legacy counts
      if (p.type === "hotel" || p.type === "resort") categoryCounts["stays"] = (categoryCounts["stays"] || 0) + 1;
      if (p.type === "restaurant" || p.type === "cafe") categoryCounts["food"] = (categoryCounts["food"] || 0) + 1;
      if (p.type === "attraction") categoryCounts["tourism"] = (categoryCounts["tourism"] || 0) + 1;
    }

    // Apply specific Category filter if requested
    let filtered = allCandidates;
    if (params.category && params.category !== "all") {
      const catReq = params.category.toLowerCase().trim();
      if (catReq === "tourism") {
        filtered = filtered.filter((p) => p.type === "attraction");
      } else if (catReq === "stays") {
        filtered = filtered.filter((p) => p.type === "hotel" || p.type === "resort");
      } else if (catReq === "food") {
        filtered = filtered.filter((p) => p.type === "restaurant" || p.type === "cafe");
      } else {
        filtered = filtered.filter((p) => this.normalizeCategory(p) === catReq || (p.subtypes || []).some(s => s.toLowerCase().includes(catReq)));
      }
    }

    // Apply Legacy Type filter
    if (params.type && params.type !== "all") {
      filtered = filtered.filter((p) => p.type === params.type);
    }

    // Filter by Price Level
    if (params.priceLevel) {
      filtered = filtered.filter((p) => p.priceLevel === params.priceLevel);
    }

    // Filter by Minimum Rating
    if (params.minRating) {
      filtered = filtered.filter((p) => p.rating >= params.minRating!);
    }

    // Vegetarian / Non-vegetarian
    if (params.vegOnly) {
      filtered = filtered.filter((p) => p.vegFriendly === true);
    }
    if (params.nonVegOnly) {
      filtered = filtered.filter((p) => p.nonVegFriendly === true);
    }

    // Facilities / Amenities
    if (params.facilities && params.facilities.length > 0) {
      const reqFac = params.facilities.map((f) => f.toLowerCase());
      filtered = filtered.filter((p) =>
        reqFac.every((rf) =>
          (p.facilities || []).some((f) => f.toLowerCase().includes(rf))
        )
      );
    }

    // Sorting
    const sort = params.sortBy || "featured";
    filtered.sort((a, b) => {
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "reviews") return b.reviewCount - a.reviewCount;
      if (sort === "price_asc") return a.priceLevel - b.priceLevel;
      if (sort === "price_desc") return b.priceLevel - a.priceLevel;
      if (sort === "name") return a.name.localeCompare(b.name);
      // Default: featured first, then rating
      if ((b.featured ? 1 : 0) !== (a.featured ? 1 : 0)) {
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      }
      return b.rating - a.rating;
    });

    // Pagination
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedPlaces = filtered.slice(startIndex, startIndex + limit);

    return {
      places: paginatedPlaces,
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      categoryCounts
    };
  }

  /**
   * Get all registered places count
   */
  public getTotalCount(): number {
    return (db.places || []).length;
  }
}

export const dbEngine = new DatabaseEngine();
