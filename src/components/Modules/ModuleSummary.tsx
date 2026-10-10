"use client";

import React from "react";
import {
  Users,
  Building2,
  Stethoscope,
  Hospital,
  Activity,
  DollarSign,
  TrendingUp,
  MapPin,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { JknRecord, ModuleId } from "@/lib/types";
import { KPICard } from "@/components/UI/KPICard";
import { DataProvenanceBadge } from "@/components/UI/DataProvenanceBadge";
import { formatNumber, formatCurrency } from "@/lib/utils";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

interface ModuleSummaryProps {
  year: number;
  selectedProvince: string;
  records: JknRecord[];
  setActiveModule: (m: ModuleId) => void;
}

export const ModuleSummary: React.FC<ModuleSummaryProps> = ({
  year,
  selectedProvince,
  records,
  setActiveModule,
}) => {
  const isAll = selectedProvince === "Semua";

  // Helper to extract metric value for current selection & year
  const getVal = (indicatorId: string) => {
    if (isAll) {
      const rec = records.find(
        (r) => r.indicator_id === indicatorId && r.is_national && r.year === year
      );
      return rec ? rec.value : null;
    } else {
      const rec = records.find(
        (r) =>
          r.indicator_id === indicatorId &&
          r.province === selectedProvince &&
          r.year === year
      );
      return rec ? rec.value : null;
    }
  };

  // Participant growth 2014-2018
  const participantTrend = [2014, 2015, 2016, 2017, 2018].map((y) => {
    const rec = isAll
      ? records.find((r) => r.indicator_id === "1.3" && r.is_national && r.year === y)
      : records.find(
          (r) =>
            r.indicator_id === "1.3" &&
            r.province === selectedProvince &&
            r.year === y
        );
    return {
      year: y,
      peserta: rec ? rec.value : 0,
    };
  });

  // Facility Counts 2018 comparison
  const facilityComparison = [
    { name: "Puskesmas", val: getVal("3.2") || 0, id: "3.2" },
    { name: "Dokter Praktik", val: getVal("3.4") || 0, id: "3.4" },
    { name: "Klinik Pratama", val: getVal("3.6") || 0, id: "3.6" },
    { name: "FKRTL (RS)", val: getVal("3.8") || 0, id: "3.8" },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-brand-dark via-brand-primary to-brand-hover text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-md">
              Data Historis 2014–2018
            </span>
            <span className="px-3 py-1 rounded-full bg-brand-accent/30 text-cyan-200 text-xs font-semibold backdrop-blur-md">
              34 Provinsi
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/30 text-emerald-200 text-xs font-semibold backdrop-blur-md">
              Bukan Bukti Fraud
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
            SIGARA | JKN Geographic Intelligence
          </h2>

          <p className="text-sm sm:text-base text-brand-soft/90 leading-relaxed">
            Eksplorasi indikator historis JKN dari 19 dataset resmi BPJS Kesehatan dan demonstrasi kerangka pemeriksaan kewajaran rujukan berbasis bukti geospasial.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveModule("map")}
              className="px-4 py-2 rounded-xl bg-brand-accent hover:bg-cyan-600 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
            >
              Jelajahi Peta Choropleth <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveModule("geoai")}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md transition-all border border-white/20"
            >
              Lihat Demo GeoAI Rujukan 2026
            </button>
          </div>
        </div>
      </div>

      {/* Scope Indicator */}
      <div className="flex items-center justify-between bg-white border border-brand-border rounded-xl p-4 shadow-xs">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-brand-primary" />
          <span className="text-xs font-bold text-brand-dark">
            Konteks Terpilih: {isAll ? "Nasional (Seluruh Indonesia)" : selectedProvince} ({year})
          </span>
        </div>
        <DataProvenanceBadge filename="Tabel 1.3-Pertumbuhan Peserta JKN per Provinsi.xlsx" year={year} />
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Peserta JKN"
          value={getVal("1.3")}
          unit="peserta"
          icon={Users}
          provenance="Tabel 1.3"
          subtitle={`Peserta terdaftar tahun ${year}`}
        />
        <KPICard
          title="Jumlah Puskesmas"
          value={getVal("3.2")}
          unit="puskesmas"
          icon={Building2}
          provenance="Tabel 3.2"
          subtitle="Faskes Tingkat Pertama (Puskesmas)"
        />
        <KPICard
          title="Jumlah Dokter Praktik"
          value={getVal("3.4")}
          unit="dokter"
          icon={Stethoscope}
          provenance="Tabel 3.4"
          subtitle="Dokter Praktik Perorangan"
        />
        <KPICard
          title="Jumlah FKRTL (RS & Klinik Utama)"
          value={getVal("3.8")}
          unit="FKRTL"
          icon={Hospital}
          provenance="Tabel 3.8"
          subtitle="Fasilitas Rujukan Tingkat Lanjutan"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Angka Akses RJTL"
          value={getVal("4.3.3")}
          unit="orang / 10.000"
          decimals={1}
          icon={Activity}
          provenance="Tabel 4.3.3"
          subtitle="Peserta unik mengakses RJTL"
        />
        <KPICard
          title="Angka Kunjungan RJTL"
          value={getVal("5.3.3")}
          unit="kunjungan / 10.000"
          decimals={1}
          icon={TrendingUp}
          provenance="Tabel 5.3.3"
          subtitle="Total kunjungan pelayanan RJTL"
        />
        <KPICard
          title="Angka Admisi RITL"
          value={getVal("5.4.5")}
          unit="admisi / 10.000"
          decimals={1}
          icon={Hospital}
          provenance="Tabel 5.4.5"
          subtitle="Total admisi rawat inap RITL"
        />
        <KPICard
          title="Rerata Biaya Klaim RJTL"
          value={getVal("6.2.3")}
          isCurrency
          icon={DollarSign}
          provenance="Tabel 6.2.3"
          subtitle="Rerata Rp per kunjungan RJTL"
        />
      </div>

      {/* Visual Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Peserta */}
        <div className="bg-white border border-brand-border rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-brand-dark">Tren Peserta JKN (2014–2018)</h3>
              <p className="text-xs text-brand-text-secondary">
                {isAll ? "Nasional Indonesia" : selectedProvince}
              </p>
            </div>
            <DataProvenanceBadge filename="Tabel 1.3" year={year} />
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={participantTrend} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPeserta" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2F6F57" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2F6F57" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#EEF4F1" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(val) => (val >= 1000000 ? `${(val / 1000000).toFixed(1)}M` : formatNumber(val))}
                />
                <Tooltip
                  formatter={(value: any) => [formatNumber(Number(value)) + " peserta", "Peserta JKN"]}
                  labelFormatter={(label) => `Tahun ${label}`}
                />
                <Area type="monotone" dataKey="peserta" stroke="#2F6F57" strokeWidth={3} fillOpacity={1} fill="url(#colorPeserta)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Facility Composition */}
        <div className="bg-white border border-brand-border rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-brand-dark">Jumlah Faskes Kerja Sama ({year})</h3>
              <p className="text-xs text-brand-text-secondary">
                Perbandingan kategori faskes di {isAll ? "Nasional" : selectedProvince}
              </p>
            </div>
            <DataProvenanceBadge filename="Tabel 3.2, 3.4, 3.6, 3.8" year={year} />
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={facilityComparison} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EEF4F1" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(val) => formatNumber(val)} />
                <Tooltip formatter={(val: any) => [formatNumber(Number(val)) + " unit", "Jumlah Faskes"]} />
                <Bar dataKey="val" fill="#1FA7C9" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
