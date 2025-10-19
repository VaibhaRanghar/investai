import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { PriceCardProps } from "@/typesV2";

export const PriceCard: React.FC<PriceCardProps> = ({
  open,
  high,
  low,
  previousClose,
  vwap,
  volume,
  high52w,
  low52w,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Price Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <PriceItem label="Open" value={`₹${open.toFixed(2)}`} />
          <PriceItem
            label="Previous Close"
            value={`₹${previousClose.toFixed(2)}`}
          />
          <PriceItem
            label="Day High"
            value={`₹${high.toFixed(2)}`}
            valueClass="text-green-600"
          />
          <PriceItem
            label="Day Low"
            value={`₹${low.toFixed(2)}`}
            valueClass="text-red-600"
          />
          <PriceItem label="VWAP" value={`₹${vwap.toFixed(2)}`} />
          <PriceItem label="Volume" value={formatVolume(volume)} />
          <PriceItem label="52W High" value={`₹${high52w.toFixed(2)}`} />
          <PriceItem label="52W Low" value={`₹${low52w.toFixed(2)}`} />
        </div>
      </CardContent>
    </Card>
  );
};

const PriceItem: React.FC<{
  label: string;
  value: string;
  valueClass?: string;
}> = ({ label, value, valueClass = "text-gray-900" }) => {
  return (
    <div>
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className={`text-lg font-semibold ${valueClass}`}>{value}</p>
    </div>
  );
};

const formatVolume = (volume: number): string => {
  if (volume >= 10000000) return `${(volume / 10000000).toFixed(2)}Cr`;
  if (volume >= 100000) return `${(volume / 100000).toFixed(2)}L`;
  return volume.toLocaleString();
};

export const dummyPriceData: PriceCardProps = {
  open: 709,
  high: 717.55,
  low: 708.65,
  previousClose: 709.8,
  vwap: 715.15,
  volume: 6780000,
  high52w: 900.4,
  low52w: 656,
};
