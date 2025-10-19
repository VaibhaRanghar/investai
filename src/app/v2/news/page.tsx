"use client";
import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/v2/ui/Card";
import { Input } from "@/components/v2/ui/Input";
import { Tabs } from "@/components/v2/ui/Tabs";
import { Badge } from "@/components/v2/ui/Badge";
import {
  MarketStatusBanner,
  dummyMarketStatus,
} from "@/components/v2/market/MarketStatusBanner";
import {
  Newspaper,
  Search,
  TrendingUp,
  TrendingDown,
  Calendar,
  FileText,
} from "lucide-react";

export default function NewsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const tabs = [
    {
      id: "announcements",
      label: "Announcements",
      icon: <Newspaper className="w-4 h-4" />,
    },
    {
      id: "movers",
      label: "Market Movers",
      icon: <TrendingUp className="w-4 h-4" />,
    },
    { id: "results", label: "Results", icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Market Status */}
        <div className="mb-6">
          <MarketStatusBanner {...dummyMarketStatus} />
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Newspaper className="w-10 h-10 text-indigo-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              Market News & Updates
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Latest corporate announcements, market movers, and financial results
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by company or symbol..."
            icon={<Search className="w-5 h-5" />}
          />
        </div>

        {/* Tabs */}
        <Tabs tabs={tabs} defaultTab="announcements">
          {(activeTab) => (
            <>
              {activeTab === "announcements" && <AnnouncementsTab />}
              {activeTab === "movers" && <MoversTab />}
              {activeTab === "results" && <ResultsTab />}
            </>
          )}
        </Tabs>
      </div>
    </div>
  );
}

const AnnouncementsTab = () => {
  const announcements = [
    {
      symbol: "IRCTC",
      date: "10-Oct-2025 14:15",
      subject: "Certificate under SEBI Regulations",
      category: "Compliance",
    },
    {
      symbol: "RVNL",
      date: "10-Oct-2025 13:20",
      subject: "Board Meeting Outcome - Q2 Results",
      category: "Results",
    },
    {
      symbol: "TCS",
      date: "09-Oct-2025 18:45",
      subject: "Change in Management - New CTO Appointed",
      category: "Management",
    },
    {
      symbol: "RELIANCE",
      date: "09-Oct-2025 16:30",
      subject: "Dividend Declaration - ₹8.50 per share",
      category: "Dividend",
    },
    {
      symbol: "HDFCBANK",
      date: "08-Oct-2025 19:10",
      subject: "General Updates - Expansion Plans",
      category: "General",
    },
  ];

  return (
    <div className="space-y-3">
      {announcements.map((item, index) => (
        <Card
          key={index}
          className="hover:border-indigo-300 transition-colors cursor-pointer"
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <Badge variant="info" size="sm">
                {item.category}
              </Badge>
              <div className="flex items-center text-xs text-gray-500">
                <Calendar className="w-3 h-3 mr-1" />
                {item.date}
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="px-2 py-1 bg-indigo-100 text-indigo-700 font-bold text-sm rounded">
                {item.symbol}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {item.subject}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const MoversTab = () => {
  const gainers = [
    {
      symbol: "RVNL",
      name: "Rail Vikas Nigam Ltd",
      price: 345.2,
      change: 24.5,
      changePercent: 7.65,
    },
    {
      symbol: "IRCTC",
      name: "Indian Railway Catering",
      price: 715.0,
      change: 18.2,
      changePercent: 2.61,
    },
    {
      symbol: "RITES",
      name: "RITES Limited",
      price: 450.3,
      change: 15.8,
      changePercent: 3.64,
    },
  ];

  const losers = [
    {
      symbol: "ZOMATO",
      name: "Zomato Limited",
      price: 145.5,
      change: -8.3,
      changePercent: -5.4,
    },
    {
      symbol: "PAYTM",
      name: "One97 Communications",
      price: 320.1,
      change: -12.5,
      changePercent: -3.76,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Gainers */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <CardTitle>Top Gainers</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {gainers.map((stock, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
              >
                <div>
                  <p className="font-semibold text-gray-900">{stock.symbol}</p>
                  <p className="text-xs text-gray-600">{stock.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">
                    ₹{stock.price.toFixed(2)}
                  </p>
                  <p className="text-sm font-semibold text-green-600">
                    +₹{stock.change.toFixed(2)} (+
                    {stock.changePercent.toFixed(2)}%)
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Losers */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <TrendingDown className="w-5 h-5 text-red-600" />
            <CardTitle>Top Losers</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {losers.map((stock, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200"
              >
                <div>
                  <p className="font-semibold text-gray-900">{stock.symbol}</p>
                  <p className="text-xs text-gray-600">{stock.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">
                    ₹{stock.price.toFixed(2)}
                  </p>
                  <p className="text-sm font-semibold text-red-600">
                    ₹{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}
                    %)
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const ResultsTab = () => {
  return (
    <div className="text-center py-12 text-gray-500">
      Financial results section - Coming soon
    </div>
  );
};
