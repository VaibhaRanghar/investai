export interface TechnicalLevel {
  type: "support" | "resistance";
  level: number;
  strength: "strong" | "moderate" | "weak";
}

export interface TechnicalCardProps {
  trend: "bullish" | "bearish" | "neutral";
  ma5: number;
  ma10: number;
  ma20: number;
  rsi: number;
  macd: "bullish" | "bearish";
  levels: TechnicalLevel[];
}
export interface StockHeaderProps {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  sector?: string;
  indices?: string[];
}

export interface ShareholdingPattern {
  quarter: string;
  promoter: number;
  public: number;
  institutional: number;
}

export interface ShareholdingCardProps {
  current: ShareholdingPattern;
  previous: ShareholdingPattern;
  history: ShareholdingPattern[];
}
export interface PriceCardProps {
  open: number;
  high: number;
  low: number;
  previousClose: number;
  vwap: number;
  volume: number;
  high52w: number;
  low52w: number;
}

export interface NewsItem {
  date: string;
  subject: string;
  category: "Management" | "Dividend" | "Results" | "Compliance" | "General";
  hasAttachment?: boolean;
  attachmentUrl?: string;
}

export interface NewsCardProps {
  news: NewsItem[];
  showAll?: boolean;
}

export interface Metric {
  label: string;
  value: string | number;
  subValue?: string;
  variant?: "success" | "danger" | "warning" | "neutral";
  badge?: string;
}

export interface MetricsGridProps {
  metrics: Metric[];
  columns?: 2 | 3 | 4;
}
export interface FundamentalMetric {
  label: string;
  value: string;
  previous?: string;
  trend?: "up" | "down" | "neutral";
  good?: boolean;
}

export interface FundamentalsCardProps {
  metrics: FundamentalMetric[];
}

export interface FinancialResult {
  period: string;
  revenue: number;
  profit: number;
  eps: number;
  margin: number;
}

export interface FinancialResultsCardProps {
  results: FinancialResult[];
  growthRates: {
    revenueGrowth: number;
    profitGrowth: number;
    epsGrowth: number;
  };
}
export interface Dividend {
  date: string;
  amount: number;
  type: "Final" | "Interim";
}

export interface DividendCardProps {
  dividends: Dividend[];
  totalAnnual: number;
  yield: number;
  payoutRatio: number;
  consistency: number; // years of consistent payment
}

export interface AIInsight {
  type: "positive" | "negative" | "neutral";
  category: string;
  message: string;
}

export interface AIInsightsCardProps {
  analysis: string;
  recommendation: "BUY" | "HOLD" | "SELL" | "AVOID";
  confidence: number;
  insights: AIInsight[];
  targets?: {
    entry: number;
    stopLoss: number;
    target: number;
  };
  loading?: boolean;
}

export interface MarketStatusBannerProps {
  isOpen: boolean;
  niftyValue: number;
  niftyChange: number;
  niftyChangePercent: number;
  timestamp: string;
  giftNifty?: {
    value: number;
    change: number;
  };
}
export interface MarketCapCardProps {
  totalMarketCap: number; // in crores
  totalMarketCapUSD: number; // in trillions
  change: number;
  changePercent: number;
}
export interface IndexData {
  name: string;
  value: number;
  change: number;
  changePercent: number;
}

export interface IndexWidgetProps {
  indices: IndexData[];
}

export interface GiftNiftyWidgetProps {
  value: number;
  change: number;
  changePercent: number;
  niftyClose: number;
  timestamp: string;
}
export interface StockSearchInputProps {
  onSelect: (symbol: string) => void;
  placeholder?: string;
}
export interface QueryInputProps {
  onSubmit: (query: string) => void;
  loading?: boolean;
  placeholder?: string;
}
export interface ChartData {
  label: string;
  stock1: number;
  stock2: number;
}

export interface ComparisonChartProps {
  stock1Symbol: string;
  stock2Symbol: string;
  data: ChartData[];
}

export interface OptionsData {
  putCallRatio: number;
  maxPain: number;
  highestCallOI: { strike: number; oi: number };
  highestPutOI: { strike: number; oi: number };
  impliedVolatility: number;
}

export interface OptionsChainCardProps {
  currentPrice: number;
  data: OptionsData;
}

export interface Range52WeekCardProps {
  current: number;
  low: number;
  high: number;
  lowDate: string;
  highDate: string;
}
export interface Level {
  price: number;
  strength: "Strong" | "Moderate" | "Weak";
  touchCount: number;
}

export interface SupportResistanceProps {
  currentPrice: number;
  supports: Level[];
  resistances: Level[];
}
export interface Indicator {
  name: string;
  value: string;
  signal: "BUY" | "SELL" | "NEUTRAL";
  description: string;
}

export interface TechnicalIndicatorsProps {
  indicators: Indicator[];
  overallSignal: "BUY" | "SELL" | "NEUTRAL";
  buySignals: number;
  sellSignals: number;
  neutralSignals: number;
}
