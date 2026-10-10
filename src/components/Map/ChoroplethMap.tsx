"use client";

import dynamic from "next/dynamic";
import React from "react";
import { JknRecord } from "@/lib/types";

const DynamicChoroplethMapInner = dynamic(
  () => import("./ChoroplethMapInner"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[480px] bg-brand-soft/50 rounded-xl border border-brand-border flex flex-col items-center justify-center p-6 text-brand-text-secondary">
        <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mb-3"></div>
        <span className="text-xs font-medium">Memuat Leaflet WebGIS & GeoJSON 34 Provinsi...</span>
      </div>
    ),
  }
);

interface ChoroplethMapProps {
  indicatorId: string;
  indicatorName: string;
  unit: string;
  year: number;
  records: JknRecord[];
  onSelectProvince: (prov: string) => void;
  selectedProvince: string | null;
}

export const ChoroplethMap: React.FC<ChoroplethMapProps> = (props) => {
  return <DynamicChoroplethMapInner {...props} />;
};
