/* eslint-disable @typescript-eslint/no-explicit-any */

import { EquityHistoricalData } from "stock-nse-india/build/interface";

export class FinancialCalculations {
  // Calculate position in 52-week range
  static calculate52WeekPosition(
    current: number,
    low: number,
    high: number
  ): number {
    return ((current - low) / (high - low)) * 100;
  }

  // Calculate profit margin
  static calculateProfitMargin(profit: number, revenue: number): number {
    return (profit / revenue) * 100;
  }

  // Calculate YoY growth
  static calculateGrowth(current: number, previous: number): number {
    return ((current - previous) / previous) * 100;
  }

  // Calculate moving average
  static calculateMA(
    historicalData: EquityHistoricalData,
    period: number
  ): number {
    const data = historicalData.data.slice(0, period);
    const sum = data.reduce((acc: any, item: { CH_CLOSING_PRICE: any; }) => acc + item.CH_CLOSING_PRICE, 0);
    return sum / period;
  }

  // Calculate RSI
  static calculateRSI(
    historicalData: EquityHistoricalData,
    period: number = 14
  ): number {
    const data = historicalData.data.slice(0, period + 1);

    let gains = 0;
    let losses = 0;

    for (let i = 1; i < data.length; i++) {
      const change = data[i - 1].CH_CLOSING_PRICE - data[i].CH_CLOSING_PRICE;
      if (change > 0) {
        gains += change;
      } else {
        losses += Math.abs(change);
      }
    }

    const avgGain = gains / period;
    const avgLoss = losses / period;

    if (avgLoss === 0) return 100;

    const rs = avgGain / avgLoss;
    return 100 - 100 / (1 + rs);
  }

  // Calculate volatility
  static calculateVolatility(historicalData: EquityHistoricalData): number {
    const returns = [];
    const data = historicalData.data;

    for (let i = 1; i < data.length; i++) {
      const ret =
        (data[i - 1].CH_CLOSING_PRICE - data[i].CH_CLOSING_PRICE) /
        data[i].CH_CLOSING_PRICE;
      returns.push(ret);
    }

    const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance =
      returns.reduce((acc, ret) => acc + Math.pow(ret - mean, 2), 0) /
      returns.length;

    return Math.sqrt(variance) * Math.sqrt(252) * 100; // Annualized
  }

  // Calculate beta (vs NIFTY - simplified)
  static calculateBeta(
    stockVolatility: number,
    marketVolatility: number = 15
  ): number {
    // Simplified beta calculation
    return stockVolatility / marketVolatility;
  }

  // Determine trend
  static determineTrend(
    ma5: number,
    ma10: number,
    ma20: number
  ): "bullish" | "bearish" | "neutral" {
    if (ma5 > ma10 && ma10 > ma20) return "bullish";
    if (ma5 < ma10 && ma10 < ma20) return "bearish";
    return "neutral";
  }

  // Calculate support/resistance levels
  static calculateSupportResistance(historicalData: EquityHistoricalData): {
    supports: number[];
    resistances: number[];
  } {
    const data = historicalData.data.slice(0, 30); // Last 30 days
    const prices = data.map((d: any) => d.CH_CLOSING_PRICE);

    // Find local minima for support
    const supports: number[] = [];
    for (let i = 1; i < prices.length - 1; i++) {
      if (prices[i] < prices[i - 1] && prices[i] < prices[i + 1]) {
        supports.push(prices[i]);
      }
    }

    // Find local maxima for resistance
    const resistances: number[] = [];
    for (let i = 1; i < prices.length - 1; i++) {
      if (prices[i] > prices[i - 1] && prices[i] > prices[i + 1]) {
        resistances.push(prices[i]);
      }
    }

    return {
      supports: supports.slice(0, 3).sort((a, b) => b - a),
      resistances: resistances.slice(0, 3).sort((a, b) => a - b),
    };
  }

  // Format currency
  static formatCurrency(value: number): string {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(2)} Cr`;
    }
    if (value >= 100000) {
      return `₹${(value / 100000).toFixed(2)} L`;
    }
    return `₹${value.toLocaleString("en-IN")}`;
  }
}
