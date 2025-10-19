/* eslint-disable @typescript-eslint/no-explicit-any */
import { NseIndia } from "stock-nse-india";
import {
  DateRange,
  EquityCorporateInfo,
  EquityDetails,
  EquityHistoricalData,
  EquityTradeInfo,
  MarketStatus,
  OptionChainData,
} from "stock-nse-india/build/interface";

const nse = new NseIndia();

export class NSEServiceV2 {
  private static instance: NSEServiceV2;
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 1000;

  private constructor() {}

  static getInstance(): NSEServiceV2 {
    if (!NSEServiceV2.instance) {
      NSEServiceV2.instance = new NSEServiceV2();
    }
    return NSEServiceV2.instance;
  }

  // Retry wrapper
  private async retry<T>(
    fn: () => Promise<T>,
    retries = this.MAX_RETRIES
  ): Promise<T> {
    try {
      return await fn();
    } catch (error: any) {
      if (retries > 0) {
        await this.sleep(this.RETRY_DELAY);
        return this.retry(fn, retries - 1);
      }
      throw error;
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Get equity details
  async getEquityDetails(symbol: string): Promise<EquityDetails> {
    return this.retry(async () => {
      const data = await nse.getEquityDetails(symbol.toUpperCase());
      if (!data) {
        throw new Error(`Stock ${symbol} not found`);
      }
      return data;
    });
  }

  // Get trade info
  async getEquityTradeInfo(symbol: string): Promise<EquityTradeInfo> {
    return this.retry(async () => {
      return await nse.getEquityTradeInfo(symbol.toUpperCase());
    });
  }

  // Get corporate info
  async getEquityCorporateInfo(symbol: string): Promise<EquityCorporateInfo> {
    return this.retry(async () => {
      return await nse.getEquityCorporateInfo(symbol.toUpperCase());
    });
  }

  // Get historical data
  async getEquityHistoricalData(
    symbol: string,
    range?: DateRange
  ): Promise<EquityHistoricalData[]> {
    return this.retry(async () => {
      return await nse.getEquityHistoricalData(symbol.toUpperCase(), range);
    });
  }

  // Get options chain
  async getEquityOptionChain(symbol: string): Promise<OptionChainData> {
    return this.retry(async () => {
      return await nse.getEquityOptionChain(symbol.toUpperCase());
    });
  }

  // Get market status
  async getMarketStatus(): Promise<MarketStatus> {
    return this.retry(async () => {
      return await nse.getMarketStatus();
    });
  }

  // Get multiple stocks in parallel
  async getMultipleStocks(symbols: string[]): Promise<EquityDetails[]> {
    const promises = symbols.map((symbol) =>
      this.getEquityDetails(symbol).catch(() => null)
    );
    const results = await Promise.all(promises);
    return results.filter((r): r is EquityDetails => r !== null);
  }

  // Validate symbol
  async validateSymbol(symbol: string): Promise<boolean> {
    try {
      await this.getEquityDetails(symbol);
      return true;
    } catch {
      return false;
    }
  }
}

export const nseService = NSEServiceV2.getInstance();
