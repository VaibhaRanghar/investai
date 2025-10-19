/* eslint-disable @typescript-eslint/no-explicit-any */
// types/index.ts - Complete Type Definitions

// Stock Metrics
export interface StockMetrics {
  symbol: string;
  name: string;
  price: number;
  peRatio: number | null;
  roe: number | null;
  netProfitMargin: number | null;
  debtToEquity: number | null;
  dividendYield: number;
  oneYearReturn: number;
  high52w: number;
  low52w: number;
  grossMargin: number | null;
  eps: number;
  bookValue: number;
  sector: string | null;
  logo: string | null;
}

// Comparison Response
export interface ComparisonResponse {
  stockA: StockMetrics;
  stockB: StockMetrics;
  winnerByMetric: WinnerByMetric;
  insight: string;
  llmAnalysis?: string;
  success: boolean;
}

// Winner by Metric
export interface WinnerByMetric {
  price: "A" | "B" | "Tie";
  pe: "A" | "B" | "Tie";
  roe?: "A" | "B" | "Tie";
  eps?: "A" | "B" | "Tie";
  margin?: "A" | "B" | "Tie";
  debtEquity?: "A" | "B" | "Tie";
  dividendYield: "A" | "B" | "Tie";
  oneYearReturn?: "A" | "B" | "Tie";
  high52w: "A" | "B" | "Tie";
  low52w: "A" | "B" | "Tie";
  marketCap?: "A" | "B" | "Tie";
  dayPerformance?: "A" | "B" | "Tie";
  volume?: "A" | "B" | "Tie";
}

// Component Props
export interface MetricCardProps {
  label: string;
  valueA: number | null;
  valueB: number | null;
  symbolA: string;
  symbolB: string;
  winner: "A" | "B" | "Tie";
  format?: "percent" | "currency" | "number" | "ratio";
  inverse?: boolean;
}

export interface StockHeaderProps {
  stock: StockMetrics;
  position: "A" | "B";
}

export interface ComparisonChartData {
  metric: string;
  stockA: number;
  stockB: number;
  winner: "A" | "B" | "Tie";
}

// Single Stock Response
export interface SingleStockResponse {
  success: boolean;
  answer: string;
  intermediateSteps?: any[];
  error?: string;
}

// Forex Response
export interface ForexResponse {
  success: boolean;
  answer: string;
  intermediateSteps?: any[];
  error?: string;
}

// News & Announcements
export interface NewsItem {
  title: string;
  description: string;
  date: string;
  link: string;
}

export interface Announcement {
  symbol: string;
  subject: string;
  description: string;
  date: string;
  attachmentUrl: string | null;
}

export interface MarketMover {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

export interface NewsResponse {
  type: "announcements" | "stock-news" | "market-movers";
  symbol?: string | null;
  data:
    | Announcement[]
    | NewsItem[]
    | { gainers: MarketMover[]; losers: MarketMover[] };
  success: boolean;
}

// Form Mode
export type QueryMode = "single" | "compare" | "forex";
