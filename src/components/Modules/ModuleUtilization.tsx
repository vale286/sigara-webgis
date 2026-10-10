"use client";

import React, { useState } from "react";
import { JknRecord } from "@/lib/types";
import { DATA_CATALOG } from "@/lib/dataCatalog";
import { DataProvenanceBadge } from "@/components/UI/DataProvenanceBadge";
import { formatNumber } from "@/lib/utils";
import { Activity, TrendingUp, Hospital, Info, Search } from "lucide-react";
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

interface ModuleUtilizationProps {
  year: number;
  selectedProvince: string;
  records: JknRecord[];
}

export const ModuleUtilization: React.FC<ModuleUtilizationProps> = ({
  year,
  selectedProvince,
  records,
}) => {
  const [activeTab, setActiveTab] = useState<"access" | "visit" | "admission">("access");
  const [selectedSubMetric, setSelectedSubMetric] = useState<string>("4.3.3");
  const [searchTerm, setSearchTerm] = useState("");

  const tabMetrics = {
    access: [
      { id: "4.1.3", name: "Angka Akses RJTP (orang/10.000)" },
      { id: "4.2.3", name: "Angka Akses RITP (orang/10.000)" },
      { id: "4.3.3", name: "Angka Akses RJTL (orang/10.000)" },
      { id: "4.4.3", name: "Angka Akses RITL (orang/10.000)" },
    ],
    visit: [
      { id: "5.1.3", name: "Angka Kunjungan RJTP (kunj/10.000)" },
      { id: "5.3.3", name: "Angka Kunjungan RJTL (kunj/10.000)" },
    ],
    admission: [
      { id: "5.4.5", name: "Angka Admisi RITL (admisi/10.000)" },
    ],
  };

  const handleTabChange = (tab: "access" | "visit" | "admission") => {
    setActiveTab(tab);
    setSelectedSubMetric(tabMetrics[tab][0].id);
  };

  const activeMeta = DATA_CATALOG.find((m) => m.id === selectedSubMetric) || DATA_CATALOG[0];

  const currentProvRecords = records.filter(
    (r) => r.indicator_id === selectedSubMetric && r.year === year && !r.is_national
  );

  const sortedProvinces = [...currentProvRecords].sort((a, b) => (b.value || 0) - (a.value || 0));
  const top10 = sortedProvinces.slice(0, 10);

  const trendData = [2014, 2015, 2016, 2017, 2018].map((y) => {
    const nttRec = records.find(
      (r) => r.indicator_id === selectedSubMetric && r.province === "Nusa Tenggara Timur" && r.year === y
    );
    const natRec = records.find(
      (r) => r.indicator_id === selectedSubMetric && r.is_national && r.year === y
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
      {/* Module Tabs */}
      <div className="bg-white border border-brand-border rounded-xl p-4 shadow-xs space-y-4">
        <div className="flex items-center gap-3 border-b border-brand-border pb-3">
          <button
            onClick={() => handleTabChange("access")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "access"
                ? "bg-brand-primary text-white shadow-xs"
                : "text-brand-text-secondary hover:bg-brand-soft"
            }`}
          >
            <Activity className="w-4 h-4" /> Angka Akses (Orang / 10.000)
          </button>
          <button
            onClick={() => handleTabChange("visit")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "visit"
                ? "bg-brand-primary text-white shadow-xs"
                : "text-brand-text-secondary hover:bg-brand-soft"
            }`}
          >
            <TrendingUp className="w-4 h-4" /> Angka Kunjungan (Kunjungan / 10.000)
          </button>
          <button
            onClick={() => handleTabChange("admission")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "admission"
                ? "bg-brand-primary text-white shadow-xs"
                : "text-brand-text-secondary hover:bg-brand-soft"
            }`}
          >
            <Hospital className="w-4 h-4" /> Angka Admisi (Admisi / 10.000)
          </button>
        </div>

        {/* Sub Metric Selector Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {tabMetrics[activeTab].map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedSubMetric(m.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                selectedSubMetric === m.id
                  ? "bg-brand-accent text-white border-brand-accent shadow-xs"
                  : "bg-brand-soft text-brand-dark border-brand-border hover:bg-brand-secondary/20"
              }`}
            >
              {m.name}
            </button>
          ))}
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
                <Tooltip formatter={(val: any) => [formatNumber(Number(val), 1) + " " + activeMeta.unit]} />
                <Bar dataKey="value" fill="#1FA7C9" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-brand-border rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-brand-dark uppercase tracking-wider">
              Tren 5 Tahun: NTT vs Nasional ({activeMeta.name})
            </h4>
            <span className="text-[11px] text-brand-text-secondary">{activeMeta.unit}</span>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EEF4F1" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(val: any) => [formatNumber(Number(val), 1) + " " + activeMeta.unit]} />
                <Line type="monotone" dataKey="ntt" name="Nusa Tenggara Timur" stroke="#2F6F57" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="nasional" name="Nasional" stroke="#163A32" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Important Definition Disclaimer */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-900 space-y-1">
        <div className="font-bold flex items-center gap-1.5">
          <Info className="w-4 h-4 text-blue-600" /> Definisi Metrik Pelayanan JKN
        </div>
        <ul className="list-disc pl-5 space-y-0.5 text-[11px] text-blue-800">
          <li><strong>Angka Akses:</strong> Jumlah peserta unik yang memanfaatkan layanan per 10.000 peserta terdaftar.</li>
          <li><strong>Angka Kunjungan:</strong> Jumlah total peristiwa kunjungan pelayanan rawat jalan per 10.000 peserta.</li>
          <li><strong>Angka Admisi:</strong> Jumlah total episode perawaan rawat inap (admisi) per 10.000 peserta.</li>
        </ul>
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
                <th className="px-4 py-3 text-right">Nilai ({activeMeta.unit})</th>
                <th className="px-4 py-3">Sumber Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {filteredRecords.map((r, idx) => (
                <tr key={r.province} className={`hover:bg-brand-soft/50 ${r.province === "Nusa Tenggara Timur" ? "bg-cyan-50/70 font-semibold" : ""}`}>
                  <td className="px-4 py-2.5 font-mono text-slate-500">{idx + 1}</td>
                  <td className="px-4 py-2.5 font-medium">{r.province}</td>
                  <td className="px-4 py-2.5 text-right font-bold">{formatNumber(r.value, 1)}</td>
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
