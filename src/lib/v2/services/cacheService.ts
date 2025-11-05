import path from "path";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface CacheEntry<T> {
  data: T;
  expiry: number;
}

export class CacheService {
  private static instance: CacheService;
  private cache = new Map<string, CacheEntry<any>>();

  // TTL configurations (in milliseconds)
  private readonly TTL = {
    PRICE: 30 * 1000, // 30 seconds
    DETAILS: 5 * 60 * 1000, // 5 minutes
    HISTORICAL: 15 * 60 * 1000, // 15 minutes
    CORPORATE: 60 * 60 * 1000, // 1 hour
    OPTIONS: 60 * 1000, // 1 minute
    MARKET_STATUS: 10 * 1000, // 10 seconds
    STOCKS: 60 * 60 * 24000,
  };

  private constructor() {
    // Cleanup every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }
    console.log("CAHED DATA =", entry.data);
    return entry.data as T;
  }

  set<T>(key: string, data: T, ttl?: number): void {
    const expiry = Date.now() + (ttl || this.TTL.DETAILS);
    this.cache.set(key, { data, expiry });
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiry) {
        this.cache.delete(key);
      }
    }
  }

  // Helper to get TTL by type
  getTTL(type: keyof typeof this.TTL): number {
    return this.TTL[type];
  }
}

export const cacheService = CacheService.getInstance();
