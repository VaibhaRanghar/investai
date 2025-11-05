/* eslint-disable @typescript-eslint/no-explicit-any */
import { Metric } from "@/typesV2";
import {
  EquityCorporateInfo,
  EquityDetails,
  EquityTradeInfo,
} from "stock-nse-india/build/interface";

export function ParsedToMetricsData(
  equity: EquityDetails | any,
  trade: EquityTradeInfo | any,
  corporate: EquityCorporateInfo
) {
  const financialResults = corporate?.financial_results?.data || [];
  let eps = null;
  if (financialResults.length > 0) {
    const lastFour = financialResults.slice(0, 4);
    const totalEPS = lastFour.reduce((sum, q) => {
      const val = parseFloat(q.reDilEPS || "0");
      return sum + (isNaN(val) ? 0 : val);
    }, 0);
    eps = totalEPS || null;
  }

  // --- Dividend Yield ---
  const dividends = corporate?.corporate_actions?.data || [];
  let dividendPerShare = 0;
  dividends.forEach((d) => {
    const match = d.purpose.match(/(\d+(\.\d+)?)/); // extract number
    if (match) dividendPerShare += parseFloat(match[1]);
  });

  const currentPrice = equity?.priceInfo?.lastPrice || null;
  const dividendYield =
    currentPrice && dividendPerShare
      ? (dividendPerShare / currentPrice) * 100
      : null;

  // Prepare data for components
  const stockHeaderData = {
    symbol: equity.info.symbol,
    name: equity.info.companyName,
    price: equity.priceInfo.lastPrice,
    change: equity.priceInfo.change,
    changePercent: equity.priceInfo.pChange,
    sector: equity.metadata.industry,
    indices: equity.metadata.pdSectorIndAll?.slice(0, 5) || [
      equity.metadata.pdSectorInd,
    ],
  };

  const priceData = {
    open: equity.priceInfo.open,
    high: equity.priceInfo.intraDayHighLow.max,
    low: equity.priceInfo.intraDayHighLow.min,
    previousClose: equity.priceInfo.previousClose,
    vwap: equity.priceInfo.vwap,
    volume: trade?.marketDeptOrderBook?.tradeInfo?.totalTradedVolume || 0,
    high52w: equity.priceInfo.weekHighLow.max,
    low52w: equity.priceInfo.weekHighLow.min,
  };

  const metricsData = [
    {
      label: "P/E Ratio",
      value: equity.metadata.pdSymbolPe?.toFixed(2) || "N/A",
      subValue: `Sector: ${equity.metadata.pdSectorPe?.toFixed(2) || "N/A"}`,
      variant:
        equity.metadata.pdSymbolPe < equity.metadata.pdSectorPe
          ? "success"
          : "neutral",
      badge:
        equity.metadata.pdSymbolPe < equity.metadata.pdSectorPe
          ? "Fair Value"
          : undefined,
    },
    {
      label: "Market Cap",
      value: trade
        ? `₹${(
            trade.marketDeptOrderBook.tradeInfo.totalMarketCap / 100
          ).toFixed(0)} Cr`
        : "N/A",
      subValue: "Mid Cap",
    },
    {
      label: "EPS",
      value: eps ? `₹${eps.toFixed(2)}` : "N/A",
      subValue: "TTM",
    },
    {
      label: "Book Value",
      value: "N/A", // Not available in your response
      subValue: "Per Share",
    },
    {
      label: "Dividend Yield",
      value: dividendYield ? `${dividendYield.toFixed(2)}%` : "N/A",
      variant: dividendYield && dividendYield > 1 ? "success" : "neutral",
    },
    {
      label: "Delivery %",
      value: trade
        ? `${trade.securityWiseDP.deliveryToTradedQuantity.toFixed(2)}%`
        : "N/A",
      variant:
        trade?.securityWiseDP.deliveryToTradedQuantity > 60
          ? "success"
          : "neutral",
    },
  ] as Metric[];

  const range52Data = {
    current: equity.priceInfo.lastPrice,
    low: equity.priceInfo.weekHighLow.min,
    high: equity.priceInfo.weekHighLow.max,
    lowDate: equity.priceInfo.weekHighLow.minDate,
    highDate: equity.priceInfo.weekHighLow.maxDate,
  };
  return { stockHeaderData, priceData, metricsData, range52Data };
}

JSON.stringify({
  trade: {
    noBlockDeals: true,
    bulkBlockDeals: [
      {
        name: "Session I",
      },
      {
        name: "Session II",
      },
    ],
    marketDeptOrderBook: {
      totalBuyQuantity: 0,
      totalSellQuantity: 0,
      open: 720.95,
      bid: [
        {
          price: 0,
          quantity: 0,
        },
        {
          price: 0,
          quantity: 0,
        },
        {
          price: 0,
          quantity: 0,
        },
        {
          price: 0,
          quantity: 0,
        },
        {
          price: 0,
          quantity: 0,
        },
      ],
      ask: [
        {
          price: 0,
          quantity: 0,
        },
        {
          price: 0,
          quantity: 0,
        },
        {
          price: 0,
          quantity: 0,
        },
        {
          price: 0,
          quantity: 0,
        },
        {
          price: 0,
          quantity: 0,
        },
      ],
      tradeInfo: {
        totalTradedVolume: 9.69,
        totalTradedValue: 69.88,
        totalMarketCap: 57168,
        ffmc: 21496.5972,
        impactCost: 0.03,
        cmDailyVolatility: "1.58",
        cmAnnualVolatility: "30.19",
        marketLot: "",
        activeSeries: "EQ",
      },
      valueAtRisk: {
        securityVar: 9.97,
        indexVar: 0,
        varMargin: 9.97,
        extremeLossMargin: 3.5,
        adhocMargin: 0,
        applicableMargin: 13.47,
      },
    },
    securityWiseDP: {
      quantityTraded: 968687,
      deliveryQuantity: 471037,
      deliveryToTradedQuantity: 48.63,
      seriesRemarks: null,
      secWiseDelPosDate: "24-OCT-2025 EOD",
    },
  },
  corporate: {
    latest_announcements: {
      data: [
        {
          symbol: "IRCTC",
          broadcastdate: "10-Oct-2025 14:15:51",
          subject:
            "Certificate under SEBI (Depositories and Participants) Regulations, 2018",
        },
        {
          symbol: "IRCTC",
          broadcastdate: "10-Oct-2025 14:11:16",
          subject: "General Updates",
        },
        {
          symbol: "IRCTC",
          broadcastdate: "10-Oct-2025 14:05:11",
          subject: "General Updates",
        },
        {
          symbol: "IRCTC",
          broadcastdate: "01-Oct-2025 17:09:36",
          subject: "Change in Management",
        },
        {
          symbol: "IRCTC",
          broadcastdate: "24-Sep-2025 11:39:21",
          subject: "Trading Window",
        },
        {
          symbol: "IRCTC",
          broadcastdate: "22-Sep-2025 19:06:07",
          subject: "General Updates",
        },
        {
          symbol: "IRCTC",
          broadcastdate: "22-Sep-2025 18:00:05",
          subject: "Change in Director(s)",
        },
        {
          symbol: "IRCTC",
          broadcastdate: "21-Sep-2025 15:57:47",
          subject: "General Updates",
        },
      ],
    },
    corporate_actions: {
      data: [
        {
          symbol: "IRCTC",
          exdate: "22-Aug-2025",
          purpose: "Dividend - Re 1 Per Share",
        },
        {
          symbol: "IRCTC",
          exdate: "20-Feb-2025",
          purpose: "Interim Dividend - Rs 3 Per Share",
        },
        {
          symbol: "IRCTC",
          exdate: "14-Nov-2024",
          purpose: "Interim Dividend - Rs 4 Per Share",
        },
        {
          symbol: "IRCTC",
          exdate: "23-Aug-2024",
          purpose: "Dividend - Rs 4 Per Share",
        },
        {
          symbol: "IRCTC",
          exdate: "23-Aug-2024",
          purpose: "Annual General Meeting",
        },
        {
          symbol: "IRCTC",
          exdate: "17-Nov-2023",
          purpose: "Interim Dividend - Rs 2.50 Per Share",
        },
        {
          symbol: "IRCTC",
          exdate: "18-Aug-2023",
          purpose: "Annual General Meeting/Dividend - Rs  2 Per Share",
        },
        {
          symbol: "IRCTC",
          exdate: "22-Feb-2023",
          purpose: "Interim Dividend - Rs 3.50 Per Share",
        },
      ],
    },
    shareholdings_patterns: {
      data: {
        "30-Sep-2024": [
          {
            "Promoter & Promoter Group": "  62.40",
          },
          {
            Public: "  37.60",
          },
          {
            "Shares held by Employee Trusts": "   0.00",
          },
          {
            Total: " 100.00",
          },
        ],
        "31-Dec-2024": [
          {
            "Promoter & Promoter Group": "  62.40",
          },
          {
            Public: "  37.60",
          },
          {
            "Shares held by Employee Trusts": "   0.00",
          },
          {
            Total: " 100.00",
          },
        ],
        "31-Mar-2025": [
          {
            "Promoter & Promoter Group": "  62.40",
          },
          {
            Public: "  37.60",
          },
          {
            "Shares held by Employee Trusts": "   0.00",
          },
          {
            Total: " 100.00",
          },
        ],
        "30-Jun-2025": [
          {
            "Promoter & Promoter Group": "  62.40",
          },
          {
            Public: "  37.60",
          },
          {
            "Shares held by Employee Trusts": "   0.00",
          },
          {
            Total: " 100.00",
          },
        ],
        "30-Sep-2025": [
          {
            "Promoter & Promoter Group": "  62.40",
          },
          {
            Public: "  37.60",
          },
          {
            "Shares held by Employee Trusts": "   0.00",
          },
          {
            Total: " 100.00",
          },
        ],
      },
    },
    financial_results: {
      data: [
        {
          from_date: null,
          to_date: "30 Jun 2025",
          expenditure: null,
          income: "122042.02",
          audited: "Un-Audited",
          cumulative: null,
          consolidated: "Non-Consolidated",
          reDilEPS: "4.13",
          reProLossBefTax: "44179.9",
          proLossAftTax: "33045.27",
          re_broadcast_timestamp: "13-Aug-2025 19:33",
          xbrl_attachment:
            "https://nsearchives.nseindia.com/corporate/xbrl/INTEGRATED_FILING_INDAS_1512033_13082025073317_WEB.xml",
          na_attachment: null,
        },
        {
          from_date: null,
          to_date: "31 Mar 2025",
          expenditure: null,
          income: "132974.21",
          audited: "Audited",
          cumulative: null,
          consolidated: "Non-Consolidated",
          reDilEPS: "4.47",
          reProLossBefTax: "47192.94",
          proLossAftTax: "35794.71",
          re_broadcast_timestamp: "28-May-2025 21:26",
          xbrl_attachment:
            "https://nsearchives.nseindia.com/corporate/xbrl/INTEGRATED_FILING_INDAS_1455633_28052025092632_WEB.xml",
          na_attachment: null,
        },
        {
          from_date: "01 Oct 2024",
          to_date: "31 Dec 2024",
          expenditure: "82428.92",
          income: "128100.16",
          audited: "Un-Audited",
          cumulative: "Non-cumulative",
          consolidated: "Non-Consolidated",
          reDilEPS: "4.27",
          reProLossBefTax: "45671.24",
          proLossAftTax: "34121.43",
          re_broadcast_timestamp: "12-Feb-2025 13:52",
          xbrl_attachment:
            "https://nsearchives.nseindia.com/corporate/xbrl/INDAS_119822_1379361_12022025015204.xml",
          na_attachment:
            "https://nsearchives.nseindia.com/na_attachments/IRCTC_NA_12022025135205_1.zip",
        },
        {
          from_date: "01 Jul 2024",
          to_date: "30 Sep 2024",
          expenditure: "70725.74",
          income: "112377.21",
          audited: "Un-Audited",
          cumulative: "Non-cumulative",
          consolidated: "Non-Consolidated",
          reDilEPS: "3.85",
          reProLossBefTax: "41651.47",
          proLossAftTax: "30781.8",
          re_broadcast_timestamp: "05-Nov-2024 16:17",
          xbrl_attachment:
            "https://nsearchives.nseindia.com/corporate/xbrl/INDAS_114147_1297198_05112024041739.xml",
          na_attachment:
            "https://nsearchives.nseindia.com/na_attachments/IRCTC_NA_05112024161739_1.zip",
        },
        {
          from_date: "01 Apr 2024",
          to_date: "30 Jun 2024",
          expenditure: "76190.81",
          income: "117149.68",
          audited: "Un-Audited",
          cumulative: "Non-cumulative",
          consolidated: "Non-Consolidated",
          reDilEPS: "3.85",
          reProLossBefTax: "41179.59",
          proLossAftTax: "30767.67",
          re_broadcast_timestamp: "14-Aug-2024 13:44",
          xbrl_attachment:
            "https://nsearchives.nseindia.com/corporate/xbrl/INDAS_112060_1225112_14082024014402.xml",
          na_attachment:
            "https://nsearchives.nseindia.com/na_attachments/IRCTC_NA_14082024134402_1.zip",
        },
      ],
    },
    borad_meeting: {
      data: [
        {
          symbol: "IRCTC",
          purpose: "Board Meeting Intimation",
          meetingdate: "13-Aug-2025",
        },
        {
          symbol: "IRCTC",
          purpose: "Board Meeting Intimation",
          meetingdate: "13-Aug-2025",
        },
        {
          symbol: "IRCTC",
          purpose:
            "To consider and approve the financial results for the period ended Jun 30, 2025",
          meetingdate: "13-Aug-2025",
        },
        {
          symbol: "IRCTC",
          purpose:
            "INDIAN RAILWAY CATERING AND TOURISM CORPORATION LIMITED has informed the Exchange about Board Meeting to be held on 28-May-2025 to consider and approve the Yearly Audited Financial results of the Company for the period ended March 2025 and Dividend.",
          meetingdate: "28-May-2025",
        },
        {
          symbol: "IRCTC",
          purpose:
            "To consider and approve the financial results for the period ended March 31, 2025 and dividend",
          meetingdate: "28-May-2025",
        },
        {
          symbol: "IRCTC",
          purpose:
            "Indian Railway Catering and Tourism Corporation Limited has informed the Exchange about Board Meeting to be held on 11-Feb-2025 to consider and approve the Quarterly Unaudited Financial results of the Company for the period ended December 2024 and Dividend.",
          meetingdate: "11-Feb-2025",
        },
        {
          symbol: "IRCTC",
          purpose:
            "To consider and approve the financial results for the period ended December 31, 2024 and dividend",
          meetingdate: "11-Feb-2025",
        },
        {
          symbol: "IRCTC",
          purpose:
            "To consider and approve the financial results for the period ended September 30, 2024 and dividend",
          meetingdate: "04-Nov-2024",
        },
      ],
    },
  },
  range: {
    start: "2020-01-01T00:00:00.000Z",
    end: "2023-12-31T00:00:00.000Z",
  },
  equity: {
    info: {
      symbol: "IRCTC",
      companyName: "Indian Railway Catering And Tourism Corporation Limited",
      industry: "Tour Travel Related Services",
      activeSeries: ["EQ", "T0"],
      debtSeries: [],
      isFNOSec: true,
      isCASec: false,
      isSLBSec: true,
      isDebtSec: false,
      isSuspended: false,
      tempSuspendedSeries: [],
      isETFSec: false,
      isDelisted: false,
      isin: "INE335Y01020",
      slb_isin: "INE335Y01020",
      listingDate: "2019-10-14",
      isMunicipalBond: false,
      isHybridSymbol: false,
      isTop10: false,
      identifier: "IRCTCEQN",
    },
    metadata: {
      series: "EQ",
      symbol: "IRCTC",
      isin: "INE335Y01020",
      status: "Listed",
      listingDate: "14-Oct-2019",
      industry: "Tour Travel Related Services",
      lastUpdateTime: "24-Oct-2025 16:00:00",
      pdSectorPe: 43.72,
      pdSymbolPe: 42.74,
      pdSectorInd: "NIFTY MIDCAP 50",
      pdSectorIndAll: [
        "NIFTY MIDCAP 50",
        "NIFTY PSE",
        "NIFTY MIDCAP150 QUALITY 50",
        "NIFTY LARGEMIDCAP 250",
        "NIFTY500 MULTICAP 50:25:25",
        "NIFTY TOTAL MARKET",
        "NIFTY INDIA DIGITAL",
        "NIFTY MOBILITY",
        "NIFTY TRANSPORTATION & LOGISTICS",
        "NIFTY MIDSMALL INDIA CONSUMPTION",
        "NIFTY500 MULTICAP INFRASTRUCTURE 50:30:20",
        "NIFTY500 EQUAL WEIGHT",
        "NIFTY INDIA RAILWAYS PSU",
        "NIFTY MIDSMALLCAP 400",
        "NIFTY RURAL",
        "NIFTY INDIA TOURISM",
        "NIFTY500 QUALITY 50",
        "NIFTY INDIA FPI 150",
        "NIFTY INDIA NEW AGE CONSUMPTION",
        "NIFTY500 MULTIFACTOR MQVLV 50",
        "NIFTY MIDCAP 100",
        "NIFTY 200",
        "NIFTY 500",
        "NIFTY500 LARGEMIDSMALL EQUAL-CAP WEIGHTED",
        "NIFTY NON-CYCLICAL CONSUMER",
        "NIFTY INDIA INTERNET",
        "NIFTY MIDCAP 150",
        "NIFTY200 QUALITY 30",
      ],
    },
    securityInfo: {
      boardStatus: "Main",
      tradingStatus: "Active",
      tradingSegment: "Normal Market",
      sessionNo: "-",
      slb: "Yes",
      classOfShare: "Equity",
      derivatives: "Yes",
      surveillance: {
        surv: null,
        desc: null,
      },
      faceValue: 2,
      issuedSize: 800000000,
    },
    sddDetails: {
      SDDAuditor: "-",
      SDDStatus: "-",
    },
    currentMarketType: "NM",
    priceInfo: {
      lastPrice: 714.6,
      change: -4.39999999999998,
      pChange: -0.611961057023641,
      previousClose: 719,
      open: 720.95,
      close: 714.8,
      vwap: 721.44,
      stockIndClosePrice: 0,
      lowerCP: "647.10",
      upperCP: "790.90",
      pPriceBand: "No Band",
      basePrice: 719,
      intraDayHighLow: {
        min: 713.75,
        max: 726.8,
        value: 714.6,
      },
      weekHighLow: {
        min: 656,
        minDate: "07-Apr-2025",
        max: 863.3,
        maxDate: "06-Nov-2024",
        value: 714.6,
      },
      iNavValue: null,
      checkINAV: false,
      tickSize: 0.05,
      ieq: "",
    },
    industryInfo: {
      macro: "Consumer Discretionary",
      sector: "Consumer Services",
      industry: "Leisure Services",
      basicIndustry: "Tour Travel Related Services",
    },
    preOpenMarket: {
      preopen: [
        {
          price: 719.3,
          buyQty: 5,
          sellQty: 0,
        },
        {
          price: 719.35,
          buyQty: 30,
          sellQty: 0,
        },
        {
          price: 719.65,
          buyQty: 50,
          sellQty: 0,
        },
        {
          price: 720,
          buyQty: 91,
          sellQty: 0,
        },
        {
          price: 720.65,
          buyQty: 50,
          sellQty: 0,
        },
        {
          price: 720.95,
          buyQty: 0,
          sellQty: 1,
          iep: true,
        },
        {
          price: 721,
          buyQty: 0,
          sellQty: 159,
        },
        {
          price: 721.5,
          buyQty: 0,
          sellQty: 2,
        },
        {
          price: 721.7,
          buyQty: 0,
          sellQty: 500,
        },
        {
          price: 721.95,
          buyQty: 0,
          sellQty: 4,
        },
      ],
      ato: {
        buy: 0,
        sell: 0,
      },
      IEP: 720.95,
      totalTradedVolume: 1561,
      finalPrice: 720.95,
      finalQuantity: 1561,
      lastUpdateTime: "24-Oct-2025 09:08:01",
      totalBuyQuantity: 15012,
      totalSellQuantity: 66327,
      atoBuyQty: 0,
      atoSellQty: 0,
      Change: 1.95,
      perChange: 0.27,
      prevClose: 719,
    },
  },
});
