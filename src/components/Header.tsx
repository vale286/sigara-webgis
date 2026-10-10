"use client";

import React from "react";
import { Activity, ShieldCheck, Database, Info, MapPin } from "lucide-react";
import { ModuleId } from "@/lib/types";

interface HeaderProps {
  selectedYear: number;
  setSelectedYear: (yr: number) => void;
  selectedProvince: string;
  setSelectedProvince: (prov: string) => void;
  provinces: string[];
  activeModule: ModuleId;
}

export const Header: React.FC<HeaderProps> = ({
  selectedYear,
  setSelectedYear,
  selectedProvince,
  setSelectedProvince,
  provinces,
  activeModule,
}) => {
  const isDiagnosisModule = activeModule === "diagnosis";

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-brand-border px-6 py-3 flex flex-wrap items-center justify-between gap-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-brand-primary text-white flex items-center justify-center font-bold text-xl shadow-md">
          S
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-brand-dark tracking-tight">
              SIGARA <span className="text-brand-accent font-semibold text-sm">WebGIS</span>
            </h1>
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-brand-soft text-brand-primary border border-brand-secondary/30">
              Healthkathon 2026
            </span>
          </div>
          <p className="text-xs text-brand-text-secondary hidden sm:block">
            Sistem Informasi Geografis Agentik untuk Rujukan Akuntabel
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        {/* Year Selector */}
        <div className="flex items-center bg-brand-soft border border-brand-border rounded-lg p-1 text-xs">
          <span className="text-brand-text-secondary px-2 font-medium">Tahun:</span>
          {[2014, 2015, 2016, 2017, 2018].map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                selectedYear === year
                  ? "bg-brand-primary text-white shadow-sm"
                  : "text-brand-text-secondary hover:text-brand-dark hover:bg-white/50"
              }`}
            >
              {year}
            </button>
          ))}
        </div>

        {/* Province Selector */}
        <div className="flex items-center gap-1.5 bg-white border border-brand-border rounded-lg px-3 py-1.5 text-xs shadow-xs">
          <MapPin className="w-3.5 h-3.5 text-brand-primary" />
          <select
            value={selectedProvince}
            onChange={(e) => setSelectedProvince(e.target.value)}
            disabled={isDiagnosisModule}
            className="bg-transparent font-medium text-brand-dark focus:outline-none cursor-pointer disabled:opacity-50"
          >
            <option value="Semua">Semua Provinsi (Nasional)</option>
            <option value="Nusa Tenggara Timur">Nusa Tenggara Timur (Fokus)</option>
            <option value="Nusa Tenggara Barat">Nusa Tenggara Barat</option>
            <option disabled className="bg-slate-100 text-slate-400">--- 34 Provinsi ---</option>
            {provinces.map((prov) => (
              <option key={prov} value={prov}>
                {prov}
              </option>
            ))}
          </select>
        </div>

        {/* Shortcut Button for NTT */}
        <button
          onClick={() => setSelectedProvince("Nusa Tenggara Timur")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
            selectedProvince === "Nusa Tenggara Timur"
              ? "bg-brand-accent text-white border-brand-accent shadow-xs"
              : "bg-brand-soft text-brand-primary border-brand-border hover:bg-brand-secondary/20"
          }`}
        >
          Fokus NTT
        </button>
      </div>
    </header>
  );
};
