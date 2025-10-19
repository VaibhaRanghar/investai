/* eslint-disable @typescript-eslint/no-explicit-any */
// ============================================
// NSE SERVICE TYPES
// ============================================

export interface NSEEquityDetails {
  info: {
    symbol: string;
    companyName: string;
    industry: string;
    activeSeries: string[];
    isFNOSec: boolean;
    isSLBSec: boolean;
    listingDate: string;
  };
  metadata: {
    series: string;
    symbol: string;
    isin: string;
    status: string;
    listingDate: string;
    industry: string;
    lastUpdateTime: string;
    pdSectorPe: number;
    pdSymbolPe: number;
    pdSectorInd: string;
    pdSectorIndAll: string[];
  };
  securityInfo: {
    boardStatus: string;
    tradingStatus: string;
    tradingSegment: string;
    classOfShare: string;
    derivatives: string;
    faceValue: number;
    issuedSize: number;
    eps?: number;
    bookValue?: number;
    dividendYield?: number;
  };
  priceInfo: {
    lastPrice: number;
    change: number;
    pChange: number;
    previousClose: number;
    open: number;
    close: number;
    vwap: number;
    lowerCP: string;
    upperCP: string;
    basePrice: number;
    intraDayHighLow: {
      min: number;
      max: number;
      value: number;
    };
    weekHighLow: {
      min: number;
      minDate: string;
      max: number;
      maxDate: string;
      value: number;
    };
  };
  tradeInfo?: {
    marketDeptOrderBook?: {
      totalBuyQuantity: number;
      totalSellQuantity: number;
      tradeInfo: {
        totalTradedVolume: number;
        totalTradedValue: number;
        totalMarketCap: number;
      };
    };
    securityWiseDP?: {
      quantityTraded: number;
      deliveryQuantity: number;
      deliveryToTradedQuantity: number;
    };
  };
  corpInfo?: CorporateInfo;
  preOpenMarket?: {
    preopen: PreOpenOrder[];
    IEP: number;
    totalTradedVolume: number;
    totalBuyQuantity: number;
    totalSellQuantity: number;
  };
}

export interface PreOpenOrder {
  price: number;
  buyQty: number;
  sellQty: number;
  iep?: boolean;
}

export interface CorporateInfo {
  latest_announcements?: {
    data: RawAnnouncement[];
  };
  corporate_actions?: {
    data: CorporateAction[];
  };
  shareholdings_patterns?: {
    data: {
      [quarter: string]: ShareholdingEntry[];
    };
  };
  financial_results?: {
    data: FinancialResult[];
  };
  board_meeting?: {
    data: BoardMeeting[];
  };
}

export interface RawAnnouncement {
  symbol: string;
  subject: string;
  broadcastdate?: string;
  an_dt?: string;
  attchmntFile?: string;
  attchmntText?: string;
  sm_name?: string;
  sm_isin?: string;
  desc?: string;
}

export interface CorporateAction {
  symbol: string;
  exdate: string;
  purpose: string;
}

export interface ShareholdingEntry {
  "Promoter & Promoter Group"?: string;
  Public?: string;
  "Shares held by Employee Trusts"?: string;
  Total?: string;
}

export interface FinancialResult {
  from_date: string | null;
  to_date: string;
  expenditure: string | null;
  income: string;
  audited: string;
  cumulative: string | null;
  consolidated: string;
  reDilEPS: string;
  reProLossBefTax: string;
  proLossAftTax: string;
  re_broadcast_timestamp: string;
  xbrl_attachment?: string;
  na_attachment?: string;
}

export interface BoardMeeting {
  symbol: string;
  purpose: string;
  meetingdate: string;
}

export interface NSEHistoricalDataRaw {
  _id: string;
  CH_SYMBOL: string;
  CH_SERIES: string;
  CH_MARKET_TYPE: string;
  CH_TRADE_HIGH_PRICE: number;
  CH_TRADE_LOW_PRICE: number;
  CH_OPENING_PRICE: number;
  CH_CLOSING_PRICE: number;
  CH_LAST_TRADED_PRICE: number;
  CH_PREVIOUS_CLS_PRICE: number;
  CH_TOT_TRADED_QTY: number;
  CH_TOT_TRADED_VAL: number;
  CH_52WEEK_HIGH_PRICE: number;
  CH_52WEEK_LOW_PRICE: number;
  CH_TOTAL_TRADES: number;
  CH_ISIN: string;
  CH_TIMESTAMP: string;
  TIMESTAMP: string;
  VWAP: number;
  mTIMESTAMP: string;
}

export interface NSEOptionsChainRaw {
  records: {
    data: OptionStrike[];
    expiryDates: string[];
    strikePrices: number[];
  };
  filtered: {
    data: OptionStrike[];
  };
}

export interface OptionStrike {
  strikePrice: number;
  expiryDate: string;
  CE?: OptionData;
  PE?: OptionData;
}

export interface OptionData {
  strikePrice: number;
  expiryDate: string;
  underlying: string;
  identifier: string;
  openInterest: number;
  changeinOpenInterest: number;
  pchangeinOpenInterest: number;
  totalTradedVolume: number;
  impliedVolatility: number;
  lastPrice: number;
  change: number;
  pChange: number;
  totalBuyQuantity: number;
  totalSellQuantity: number;
  bidQty: number;
  bidprice: number;
  askQty: number;
  askPrice: number;
  underlyingValue: number;
}

export interface NSEMarketStatusRaw {
  marketState: MarketSegment[];
  marketcap: {
    timeStamp: string;
    marketCapinTRDollars: number;
    marketCapinLACCRRupees: number;
    marketCapinCRRupees: number;
    underlying: string;
  };
  indicativenifty50: {
    dateTime: string;
    indexName: string;
    closingValue: number;
    finalClosingValue: number;
    change: number;
    perChange: number;
    status: string;
  };
  giftnifty: {
    INSTRUMENTTYPE: string;
    SYMBOL: string;
    EXPIRYDATE: string;
    LASTPRICE: number;
    DAYCHANGE: string;
    PERCHANGE: string;
    CONTRACTSTRADED: number;
    TIMESTMP: string;
  };
}

export interface MarketSegment {
  market: string;
  marketStatus: string;
  tradeDate: string;
  index: string;
  last: number | string;
  variation: number | string;
  percentChange: number | string;
  marketStatusMessage: string;
}

// ============================================
// PROCESSED/NORMALIZED TYPES
// ============================================

export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  open: number;
  high: number;
  low: number;
  previousClose: number;
  vwap: number;
  volume: number;
  high52w: number;
  low52w: number;
  peRatio: number | null;
  sectorPe: number | null;
  eps: number | null;
  bookValue: number | null;
  dividendYield: number | null;
  faceValue: number;
  issuedSize: number;
  marketCap: number;
  sector: string | null;
  indices: string[];
  isFnO: boolean;
  deliveryPercent: number | null;
  upperCircuit: string;
  lowerCircuit: string;
  corporateInfo: CorporateInfo | null;
}

export interface HistoricalData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  vwap: number;
}

export interface OptionsChainData {
  putCallRatio: number;
  maxPain: number;
  maxCallOI: {
    strike: number;
    oi: number;
  };
  maxPutOI: {
    strike: number;
    oi: number;
  };
  totalCallOI: number;
  totalPutOI: number;
  strikes: OptionStrike[];
}

export interface MarketStatus {
  isOpen: boolean;
  nifty: {
    value: number;
    change: number;
    changePercent: number;
  };
  timestamp: string;
  giftNifty: {
    LASTPRICE: number;
    DAYCHANGE: string;
    PERCHANGE: string;
    TIMESTMP: string;
  } | null;
  marketCap: {
    totalInCrores: number;
    totalInUSD: number;
  } | null;
}

export interface NewsItem {
  symbol: string;
  subject: string;
  date: string;
  category:
    | "Management"
    | "Dividend"
    | "Results"
    | "Compliance"
    | "Meeting"
    | "General";
  hasAttachment: boolean;
  attachmentUrl: string | null;
}

export interface ProcessedShareholding {
  quarter: string;
  promoter: number;
  public: number;
  institutional: number;
  employeeTrusts: number;
}

export interface ProcessedFinancialResult {
  period: string;
  revenue: number;
  expenditure: number | null;
  profit: number;
  eps: number;
  margin: number;
  audited: boolean;
}

export interface ProcessedDividend {
  date: string;
  amount: number;
  type: "Final" | "Interim";
  exDate: string;
}

// ============================================
// CACHE SERVICE TYPES
// ============================================

export interface CacheEntry<T> {
  data: T;
  expiry: number;
}

export type CacheTTLType =
  | "PRICE"
  | "STOCK_DETAILS"
  | "HISTORICAL"
  | "OPTIONS"
  | "NEWS"
  | "MARKET_STATUS";

// ============================================
// LLM SERVICE TYPES
// ============================================

export interface LLMConfig {
  temperature: number;
  maxTokens?: number;
  model?: string;
}

export interface LLMResponse {
  content: string;
  tokensUsed?: number;
  model?: string;
}

// ============================================
// AGENT TYPES
// ============================================

export interface AgentInput {
  query: string;
  context?: UserContext;
}

export interface UserContext {
  riskTolerance?: "low" | "medium" | "high";
  investmentHorizon?: "short" | "medium" | "long";
  portfolioSize?: "small" | "medium" | "large";
  experience?: "beginner" | "intermediate" | "expert";
}

export interface AgentOutput {
  answer: string;
  confidence?: number;
  sources?: string[];
  toolsUsed?: string[];
  processingTime?: number;
}

export interface ToolOutput {
  toolName: string;
  data: string;
  success: boolean;
  error?: string;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface StockAPIResponse extends APIResponse<StockData> {
  cached?: boolean;
  timestamp?: string;
}

export interface AnalysisAPIResponse extends APIResponse {
  answer: string;
  query: string;
  metadata?: {
    processingTime: number;
    toolsUsed: string[];
    confidence: number;
  };
}

export interface ComparisonAPIResponse extends APIResponse {
  comparison: {
    stock1: StockData;
    stock2: StockData;
  };
  insights: string;
  winner?: string;
  metrics?: ComparisonMetric[];
}

export interface ComparisonMetric {
  metric: string;
  stock1Value: string | number;
  stock2Value: string | number;
  winner: 1 | 2 | null;
  higherIsBetter: boolean;
}

export interface NewsAPIResponse extends APIResponse {
  news: NewsItem[];
  totalCount: number;
  filtered?: boolean;
}

export interface MarketStatusAPIResponse extends APIResponse<MarketStatus> {
  segments?: MarketSegment[];
}

export interface OptionsAPIResponse extends APIResponse<OptionsChainData> {
  currentPrice?: number;
  expiry?: string;
}

// ============================================
// CALCULATION TYPES
// ============================================

export interface TechnicalIndicators {
  ma5: number;
  ma10: number;
  ma20: number;
  ma50?: number;
  rsi: number;
  macd?: {
    value: number;
    signal: number;
    histogram: number;
  };
  bollingerBands?: {
    upper: number;
    middle: number;
    lower: number;
  };
}

export interface SupportResistanceLevels {
  supports: PriceLevel[];
  resistances: PriceLevel[];
}

export interface PriceLevel {
  price: number;
  strength: "Strong" | "Moderate" | "Weak";
  touchCount: number;
  lastTouched?: string;
}

export interface PerformanceMetrics {
  dayReturn: number;
  weekReturn: number;
  monthReturn: number;
  yearReturn: number;
  volatility: number;
  sharpeRatio?: number;
  beta?: number;
}

export interface ValuationMetrics {
  peRatio: number | null;
  pbRatio: number | null;
  pegRatio: number | null;
  evEbitda: number | null;
  priceToSales: number | null;
  dividendYield: number | null;
}

// ============================================
// ERROR TYPES
// ============================================

export class StockNotFoundError extends Error {
  constructor(symbol: string) {
    super(`Stock ${symbol} not found on NSE`);
    this.name = "StockNotFoundError";
  }
}

export class RateLimitError extends Error {
  constructor(message: string = "Rate limit exceeded") {
    super(message);
    this.name = "RateLimitError";
  }
}

export class NSEServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NSEServiceError";
  }
}

export class LLMServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LLMServiceError";
  }
}

export class CacheError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CacheError";
  }
}

// ============================================
// UTILITY TYPES
// ============================================

export interface DateRange {
  from: Date;
  to: Date;
}

export interface RateLimitRecord {
  count: number;
  resetTime: number;
  ip: string;
}

export interface LogEntry {
  timestamp: string;
  level: "info" | "warn" | "error" | "debug";
  message: string;
  context?: Record<string, any>;
  error?: Error;
}

// ============================================
// QUERY CLASSIFICATION TYPES
// ============================================

export enum QueryType {
  STOCK_PRICE = "stock_price",
  STOCK_FUNDAMENTALS = "stock_fundamentals",
  STOCK_ANALYSIS = "stock_analysis",
  COMPARE_STOCKS = "compare_stocks",
  COMPARE_SECTORS = "compare_sectors",
  TECHNICAL_ANALYSIS = "technical",
  OPTIONS_ANALYSIS = "options",
  MARKET_STATUS = "market_status",
  SECTOR_PERFORMANCE = "sector",
  PRE_MARKET = "pre_market",
  STOCK_SCREENER = "screener",
  DIVIDEND_STOCKS = "dividend",
  PORTFOLIO_ADVICE = "portfolio",
  RISK_ASSESSMENT = "risk",
  EXPLAIN_CONCEPT = "explain",
  GENERAL = "general",
}

export interface ClassifiedQuery {
  type: QueryType;
  symbols: string[];
  timeframe?: string;
  filters?: Record<string, any>;
  confidence: number;
}

// ============================================
// TOOL INPUT/OUTPUT SCHEMAS
// ============================================

export interface StockAnalysisToolInput {
  symbol: string;
}

export interface StockAnalysisToolOutput {
  symbol: string;
  analysis: string;
  data: StockData;
  technical?: TechnicalIndicators;
  recommendation?: "BUY" | "HOLD" | "SELL" | "AVOID";
}

export interface ComparisonToolInput {
  symbol1: string;
  symbol2: string;
}

export interface ComparisonToolOutput {
  comparison: string;
  stock1: StockData;
  stock2: StockData;
  winner: string;
  metrics: ComparisonMetric[];
}

export interface OptionsToolInput {
  symbol: string;
  expiry?: string;
}

export interface OptionsToolOutput {
  symbol: string;
  analysis: string;
  data: OptionsChainData;
  signals: OptionsSignal[];
}

export interface OptionsSignal {
  type: "bullish" | "bearish" | "neutral";
  strength: "strong" | "moderate" | "weak";
  description: string;
}

// ============================================
// FORMATTER TYPES
// ============================================

export interface FormattedCurrency {
  value: number;
  formatted: string;
  unit: "Cr" | "L" | "K" | "";
}

export interface FormattedVolume {
  value: number;
  formatted: string;
  unit: "Cr" | "L" | "";
}

export interface FormattedPercent {
  value: number;
  formatted: string;
  isPositive: boolean;
}

// ============================================
// RECOMMENDATION TYPES
// ============================================

export interface StockRecommendation {
  action: "BUY" | "HOLD" | "SELL" | "AVOID";
  confidence: number;
  reasoning: string[];
  risks: string[];
  targets?: {
    entry: number;
    stopLoss: number;
    target: number;
  };
  timeHorizon: "short" | "medium" | "long";
  suitableFor: ("growth" | "value" | "income" | "conservative")[];
}

export interface ComparisonRecommendation {
  winner: string;
  loser: string;
  score: {
    stock1: number;
    stock2: number;
  };
  reasoning: string[];
  bestFor: {
    growth: string;
    value: string;
    income: string;
    safety: string;
  };
}

// ============================================
// SCREENER TYPES
// ============================================

export interface ScreenerCriteria {
  minPrice?: number;
  maxPrice?: number;
  minPE?: number;
  maxPE?: number;
  minMarketCap?: number;
  maxMarketCap?: number;
  minDividendYield?: number;
  sectors?: string[];
  indices?: string[];
  hasFnO?: boolean;
  minDelivery?: number;
}

export interface ScreenerResult {
  stocks: StockData[];
  totalCount: number;
  criteria: ScreenerCriteria;
  executionTime: number;
}

// ============================================
// EXPORT ALL
// ============================================

export // Add any additional exports needed
 type {};
