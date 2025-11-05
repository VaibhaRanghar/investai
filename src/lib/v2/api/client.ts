/* eslint-disable @typescript-eslint/no-explicit-any */
// API client for V2 endpoints

const API_BASE = "/api/v2";

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: any;
  answer?: any;
}

class ApiClient {
  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Request failed");
      }

      return data;
    } catch (error: any) {
      console.error(`API Error (${endpoint}):`, error);
      return {
        success: false,
        error: error.message || "An error occurred",
      };
    }
  }

  // Analyze query with AI
  async analyze(query: string) {
    return this.request<{ answer: string; metadata: any }>("/analyze", {
      method: "POST",
      body: JSON.stringify({ query }),
    });
  }

  // Compare two stocks
  async compareStocks(symbol1: string, symbol2: string) {
    return this.request<{
      comparison: any;
      insights: string;
      metadata: any;
    }>("/compare", {
      method: "POST",
      body: JSON.stringify({ symbols: [symbol1, symbol2] }),
    });
  }

  // Get single stock details
  async getStock(symbol: string) {
    return this.request<{
      data: {
        equity: any;
        trade: any;
        corporate: any;
      };
      cached: boolean;
    }>(`/stock/${symbol}`);
  }

  // Get news for a stock
  async getNews(symbol: string) {
    return this.request<{
      announcements: any[];
      corporateActions: any[];
      meetings: any[];
      financialResults: any[];
    }>(`/news?s
      ymbol=${symbol}`);
  }

  // Get options data
  async getOptions(symbol: string) {
    return this.request<{
      data: any;
      cached: boolean;
    }>(`/options?symbol=${symbol}`);
  }

  // Get market status
  async getMarketStatus() {
    return this.request<{
      data: any;
      cached: boolean;
    }>("/market");
  }
}

export const apiClient = new ApiClient();
// How are the fundamentals of Utkarsh Small Finance Bank Limited-RE. Should i invest in it or not?
