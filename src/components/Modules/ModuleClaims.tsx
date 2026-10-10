"use client";

import React, { useState } from "react";
import { JknRecord } from "@/lib/types";
import { DATA_CATALOG } from "@/lib/dataCatalog";
import { DataProvenanceBadge } from "@/components/UI/DataProvenanceBadge";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { DollarSign, ShieldAlert, Search } from "lucide-react";
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

interface ModuleClaimsProps {
  year: number;
  selectedProvince: string;
  records: JknRecord[];
}

export const ModuleClaims: React.FC<ModuleClaimsProps> = ({
  year,
  selectedProvince,
  records,
}) => {
  const [selectedMetricId, setSelectedMetricId] = useState<string>("6.2.3");
  const [searchTerm, setSearchTerm] = useState("");

  const activeMeta = DATA_CATALOG.find((m) => m.id === selectedMetricId) || DATA_CATALOG[0];

  const currentProvRecords = records.filter(
    (r) => r.indicator_id === selectedMetricId && r.year === year && !r.is_national
  );

  const sortedProvinces = [...currentProvRecords].sort((a, b) => (b.value || 0) - (a.value || 0));
  const top10 = sortedProvinces.slice(0, 10);

  const trendData = [2014, 2015, 2016, 2017, 2018].map((y) => {
    const nttRec = records.find(
      (r) => r.indicator_id === selectedMetricId && r.province === "Nusa Tenggara Timur" && r.year === y
    );
    const natRec = records.find(
      (r) => r.indicator_id === selectedMetricId && r.is_national && r.year === y
    );
    return {
      year: y,
      ntt: nttRec ? nttRec.value : 0,
      nasional: natRec ? natRec.value : 0,
    };
  });

  const filteredRecords = sortedProvinces.filter((r) =>
    r.province.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Selector Bar */}
      <div className="bg-white border border-brand-border rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedMetricId("6.2.3")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              selectedMetricId === "6.2.3"
                ? "bg-brand-primary text-white shadow-xs"
                : "bg-brand-soft text-brand-dark hover:bg-brand-secondary/20"
            }`}
          >
            <DollarSign className="w-4 h-4" /> 6.2.3 - Biaya RJTL (Rp / Kunjungan)
          </button>
          <button
            onClick={() => setSelectedMetricId("6.3.3")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              selectedMetricId === "6.3.3"
                ? "bg-brand-primary text-white shadow-xs"
                : "bg-brand-soft text-brand-dark hover:bg-brand-secondary/20"
            }`}
          >
            <DollarSign className="w-4 h-4" /> 6.3.3 - Biaya RITL (Rp / Admisi)
          </button>
        </div>

        <DataProvenanceBadge filename={activeMeta.filename} year={year} unit={activeMeta.unit} />
      </div>

      {/* Critical Non-Fraud & Methodology Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 space-y-1 shadow-xs">
        <div className="font-bold flex items-center gap-1.5 text-amber-800">
          <ShieldAlert className="w-4 h-4 text-amber-600" /> Ketentuan Metodologi & Integritas Data
        </div>
        <p className="text-[11px] leading-relaxed text-amber-800">
          Rerata biaya satuan klaim merupakan angka agregat historis per unit layanan (kunjungan / admisi). <strong>Dilarang mengartikan rerata biaya sebagai total klaim, estimasi kerugian fraud, atau potensi penyimpangan tanpa data transaksi per pasien.</strong>
        </p>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-brand-border rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-brand-dark uppercase tracking-wider">
              Top 10 Rerata Biaya Klaim ({year})
            </h4>
            <span className="text-[11px] text-brand-text-secondary">{activeMeta.unit}</span>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={top10} margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EEF4F1" />
                <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={(val) => `Rp${(val / 1000).toFixed(0)}k`} />
                <YAxis dataKey="province" type="category" tick={{ fontSize: 10 }} width={110} />
                <Tooltip formatter={(val: any) => [formatCurrency(Number(val)), activeMeta.name]} />
                <Bar dataKey="value" fill="#163A32" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-brand-border rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-brand-dark uppercase tracking-wider">
              Tren Rerata Biaya (2014–2018): NTT vs Nasional
            </h4>
            <span className="text-[11px] text-brand-text-secondary">{activeMeta.unit}</span>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EEF4F1" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(val) => `Rp${(val / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(val: any) => [formatCurrency(Number(val))]} />
                <Line type="monotone" dataKey="ntt" name="Nusa Tenggara Timur" stroke="#1FA7C9" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="nasional" name="Nasional (Total/Rerata)" stroke="#2F6F57" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Sortable Table */}
      <div className="bg-white border border-brand-border rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h4 className="text-sm font-bold text-brand-dark">Daftar 34 Provinsi - {activeMeta.name} ({year})</h4>
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
                <th className="px-4 py-3 text-right">Rerata Biaya ({activeMeta.unit})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {filteredRecords.map((r, idx) => (
                <tr key={r.province} className={`hover:bg-brand-soft/50 ${r.province === "Nusa Tenggara Timur" ? "bg-cyan-50/70 font-semibold" : ""}`}>
                  <td className="px-4 py-2.5 font-mono text-slate-500">{idx + 1}</td>
                  <td className="px-4 py-2.5 font-medium">{r.province}</td>
                  <td className="px-4 py-2.5 text-right font-bold">{formatCurrency(r.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

