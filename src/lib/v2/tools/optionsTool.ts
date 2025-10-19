/* eslint-disable @typescript-eslint/no-explicit-any */
import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';

import { cacheService } from '../services/cacheService';
import { nseService } from '@/lib/services/nseService';

export const optionsTool = new DynamicStructuredTool({
  name: 'analyze_options',
  description:
    'Analyze options chain data including Put-Call Ratio, Max Pain, Open Interest for NSE stocks',
  schema: z.object({
    symbol: z.string().describe('Stock symbol for options analysis'),
  }),
  func: async ({ symbol }) => {
    try {
      const cacheKey = `options:${symbol}`;
      const cached = cacheService.get(cacheKey);
      if (cached) return cached;

      const [optionsData, equityDetails] = await Promise.all([
        nseService.getEquityOptionChain(symbol),
        nseService.getEquityDetails(symbol),
      ]);

      const currentPrice = equityDetails.priceInfo.lastPrice;

      // Calculate Put-Call Ratio
      const totalCallOI = optionsData.filtered.CE.totOI;
      const totalPutOI = optionsData.filtered.PE.totOI;
      const pcr = totalPutOI / totalCallOI;

      // Find Max Pain (strike with highest total OI)
      const strikeOI: { [key: number]: number } = {};
      optionsData.records.data.forEach((strike) => {
        const callOI = strike.CE?.openInterest || 0;
        const putOI = strike.PE?.openInterest || 0;
        strikeOI[strike.strikePrice] = callOI + putOI;
      });

      const maxPainStrike = Object.keys(strikeOI).reduce((a, b) =>
        strikeOI[parseInt(a)] > strikeOI[parseInt(b)] ? a : b
      );

      // Find highest Call and Put OI
      let highestCallOI = { strike: 0, oi: 0 };
      let highestPutOI = { strike: 0, oi: 0 };

      optionsData.records.data.forEach((strike) => {
        if (strike.CE && strike.CE.openInterest > highestCallOI.oi) {
          highestCallOI = {
            strike: strike.strikePrice,
            oi: strike.CE.openInterest,
          };
        }
        if (strike.PE && strike.PE.openInterest > highestPutOI.oi) {
          highestPutOI = {
            strike: strike.strikePrice,
            oi: strike.PE.openInterest,
          };
        }
      });

      // Calculate average implied volatility
      let totalIV = 0;
      let ivCount = 0;
      optionsData.records.data.forEach((strike) => {
        if (strike.CE?.impliedVolatility) {
          totalIV += strike.CE.impliedVolatility;
          ivCount++;
        }
        if (strike.PE?.impliedVolatility) {
          totalIV += strike.PE.impliedVolatility;
          ivCount++;
        }
      });
      const avgIV = ivCount > 0 ? totalIV / ivCount : 0;

      const analysis = {
        symbol,
        currentPrice: `₹${currentPrice.toFixed(2)}`,
        putCallRatio: pcr.toFixed(2),
        sentiment:
          pcr > 1.2
            ? 'Bullish (High Put OI)'
            : pcr < 0.8
            ? 'Bearish (High Call OI)'
            : 'Neutral',
        maxPain: `₹${maxPainStrike}`,
        maxPainDistance: `${((parseInt(maxPainStrike) - currentPrice) / currentPrice * 100).toFixed(2)}%`,
        highestCallOI: {
          strike: `₹${highestCallOI.strike}`,
          oi: (highestCallOI.oi / 100000).toFixed(2) + 'L',
          interpretation: 'Strong Resistance',
        },
        highestPutOI: {
          strike: `₹${highestPutOI.strike}`,
          oi: (highestPutOI.oi / 100000).toFixed(2) + 'L',
          interpretation: 'Strong Support',
        },
        impliedVolatility: `${avgIV.toFixed(2)}%`,
        ivAssessment: avgIV > 30 ? 'High (Volatile market)' : avgIV < 20 ? 'Low (Calm market)' : 'Moderate',
        expiryDate: optionsData.records.expiryDates[0],
        totalCallVolume: (optionsData.filtered.CE.totVol / 100000).toFixed(2) + 'L',
        totalPutVolume: (optionsData.filtered.PE.totVol / 100000).toFixed(2) + 'L',
      };

      const result = JSON.stringify(analysis, null, 2);
      cacheService.set(cacheKey, result, cacheService.getTTL('OPTIONS'));

      return result;
    } catch (error: any) {
      return `Error analyzing options for ${symbol}: ${error.message}. Note: Options data may not be available for all stocks.`;
    }
  },
});
