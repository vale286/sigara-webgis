"use client";

import React, { useState } from "react";
import { JknRecord } from "@/lib/types";
import { DATA_CATALOG } from "@/lib/dataCatalog";
import { DataProvenanceBadge } from "@/components/UI/DataProvenanceBadge";
import { formatNumber } from "@/lib/utils";
import { Building2, Stethoscope, Hospital, Activity, Download, Search } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

interface ModuleFacilitiesProps {
  year: number;
  selectedProvince: string;
  records: JknRecord[];
}

export const ModuleFacilities: React.FC<ModuleFacilitiesProps> = ({
  year,
  selectedProvince,
  records,
}) => {
  const [facilityType, setFacilityType] = useState<"puskesmas" | "dokter" | "klinik" | "fkrtl">("puskesmas");
  const [metricMode, setMetricMode] = useState<"count" | "ratio">("count");
  const [searchTerm, setSearchTerm] = useState("");

  const facilityConfig = {
    puskesmas: { countId: "3.2", ratioId: "3.1", name: "Puskesmas", icon: Building2 },
    dokter: { countId: "3.4", ratioId: "3.3", name: "Dokter Praktik Perorangan", icon: Stethoscope },
    klinik: { countId: "3.6", ratioId: "3.5", name: "Klinik Pratama (Inc. TNI/POLRI)", icon: Activity },
    fkrtl: { countId: "3.8", ratioId: "3.7", name: "FKRTL (RS & Klinik Utama)", icon: Hospital },
  };

  const activeConfig = facilityConfig[facilityType];
  const activeIndicatorId = metricMode === "count" ? activeConfig.countId : activeConfig.ratioId;
  const activeMeta = DATA_CATALOG.find((m) => m.id === activeIndicatorId) || DATA_CATALOG[0];

  // Current year records across 34 provinces
  const currentProvRecords = records.filter(
    (r) => r.indicator_id === activeIndicatorId && r.year === year && !r.is_national
  );

  const nationalRecord = records.find(
    (r) => r.indicator_id === activeIndicatorId && r.year === year && r.is_national
  );

  // Top 10 provinces
  const sortedProvinces = [...currentProvRecords].sort((a, b) => (b.value || 0) - (a.value || 0));
  const top10 = sortedProvinces.slice(0, 10);

  // NTT 5-year trend vs National
  const trendData = [2014, 2015, 2016, 2017, 2018].map((y) => {
    const nttRec = records.find(
      (r) => r.indicator_id === activeIndicatorId && r.province === "Nusa Tenggara Timur" && r.year === y
    );
    const natRec = records.find(
      (r) => r.indicator_id === activeIndicatorId && r.is_national && r.year === y
    );
    return {
      year: y,
      ntt: nttRec ? nttRec.value : 0,
      nasional: natRec ? natRec.value : 0,
    };
  });

  // Search filtered records
  const filteredRecords = sortedProvinces.filter((r) =>
    r.province.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Filter Bar */}
      <div className="bg-white border border-brand-border rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Facility Type Selector */}
          {(["puskesmas", "dokter", "klinik", "fkrtl"] as const).map((type) => {
            const cfg = facilityConfig[type];
            const Icon = cfg.icon;
            const isSelected = facilityType === type;
            return (
              <button
                key={type}
                onClick={() => setFacilityType(type)}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                  isSelected
                    ? "bg-brand-primary text-white shadow-xs"
                    : "bg-brand-soft text-brand-dark hover:bg-brand-secondary/20"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cfg.name}</span>
              </button>
            );
          })}
        </div>

        {/* Count vs Ratio Mode */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
          <button
            onClick={() => setMetricMode("count")}
            className={`px-3 py-1 rounded-md font-bold transition-all ${
              metricMode === "count" ? "bg-white text-brand-dark shadow-xs" : "text-slate-600"
            }`}
          >
            Jumlah (Count)
          </button>
          <button
            onClick={() => setMetricMode("ratio")}
            className={`px-3 py-1 rounded-md font-bold transition-all ${
              metricMode === "ratio" ? "bg-white text-brand-dark shadow-xs" : "text-slate-600"
            }`}
          >
            Rasio / 100.000 Peserta
          </button>
        </div>
      </div>

      {/* Info Header */}
      <div className="flex items-center justify-between bg-white border border-brand-border rounded-xl p-4 shadow-xs">
        <div>
          <h3 className="text-sm font-bold text-brand-dark">{activeMeta.name} ({year})</h3>
          <p className="text-xs text-brand-text-secondary">{activeMeta.description}</p>
        </div>
        <DataProvenanceBadge filename={activeMeta.filename} year={year} unit={activeMeta.unit} />
      </div>

      {/* Visual Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 10 Provinces Bar Chart */}
        <div className="bg-white border border-brand-border rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-brand-dark uppercase tracking-wider">
              Top 10 Provinsi - {activeMeta.name} ({year})
            </h4>
            <span className="text-[11px] text-brand-text-secondary">{activeMeta.unit}</span>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={top10} margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EEF4F1" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="province" type="category" tick={{ fontSize: 10 }} width={110} />
                <Tooltip formatter={(val: any) => [formatNumber(Number(val), metricMode === "count" ? 0 : 2) + " " + activeMeta.unit, activeMeta.name]} />
                <Bar dataKey="value" fill="#2F6F57" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* NTT vs National 5-Year Trend */}
        <div className="bg-white border border-brand-border rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-brand-dark uppercase tracking-wider">
              Tren 5 Tahun (2014-2018): NTT vs Nasional
            </h4>
            <span className="text-[11px] text-brand-text-secondary">{activeMeta.unit}</span>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EEF4F1" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(val: any) => [formatNumber(Number(val), metricMode === "count" ? 0 : 2) + " " + activeMeta.unit]} />
                <Line type="monotone" dataKey="ntt" name="Nusa Tenggara Timur" stroke="#1FA7C9" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="nasional" name="Nasional (Total/Rerata)" stroke="#163A32" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Sortable 34 Province Table */}
      <div className="bg-white border border-brand-border rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-brand-dark">Daftar 34 Provinsi - {activeMeta.name} ({year})</h4>
            <p className="text-xs text-brand-text-secondary">Tabel indikator ketersediaan faskes terurut</p>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari provinsi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 border border-brand-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-brand-primary w-48"
            />
          </div>
        </div>

        <div className="overflow-x-auto border border-brand-border rounded-lg">
          <table className="w-full text-xs text-left text-brand-dark">
            <thead className="bg-brand-soft border-b border-brand-border text-[11px] font-bold uppercase tracking-wider text-brand-primary">
              <tr>
                <th className="px-4 py-3">Peringkat</th>
                <th className="px-4 py-3">Provinsi</th>
                <th className="px-4 py-3 text-right">Nilai ({activeMeta.unit})</th>
                <th className="px-4 py-3">Sumber Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {filteredRecords.map((r, idx) => (
                <tr
                  key={r.province}
                  className={`hover:bg-brand-soft/50 transition-colors ${
                    r.province === "Nusa Tenggara Timur" ? "bg-cyan-50/70 font-semibold" : ""
                  }`}
                >
                  <td className="px-4 py-2.5 font-mono text-slate-500">{idx + 1}</td>
                  <td className="px-4 py-2.5 font-medium">{r.province}</td>
                  <td className="px-4 py-2.5 text-right font-bold">
                    {formatNumber(r.value, metricMode === "count" ? 0 : 2)}
                  </td>
                  <td className="px-4 py-2.5 text-slate-500 text-[10px] font-mono">{r.source_file}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
