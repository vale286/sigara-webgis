"use client";

import React from "react";
import { X, MapPin, TrendingUp, FileText, CheckCircle2 } from "lucide-react";
import { JknRecord } from "@/lib/types";
import { formatNumber, formatCurrency } from "@/lib/utils";
import { DATA_CATALOG } from "@/lib/dataCatalog";

interface ProvinceDrawerProps {
  province: string | null;
  onClose: () => void;
  year: number;
  records: JknRecord[];
}

export const ProvinceDrawer: React.FC<ProvinceDrawerProps> = ({
  province,
  onClose,
  year,
  records,
}) => {
  if (!province) return null;

  const provRecords = records.filter((r) => r.province === province && r.year === year);

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-white border-l border-brand-border shadow-2xl z-50 flex flex-col transform transition-transform duration-300">
      {/* Drawer Header */}
      <div className="p-5 border-b border-brand-border flex items-center justify-between bg-brand-soft/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-primary text-white flex items-center justify-center">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-brand-dark">{province}</h2>
            <p className="text-xs text-brand-text-secondary">Inspector Indikator Tahun {year}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Drawer Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Quick Highlights */}
        <div className="bg-brand-soft border border-brand-secondary/30 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between text-xs text-brand-primary font-bold">
            <span>Ringkasan {province} ({year})</span>
            <span className="px-2 py-0.5 rounded bg-brand-primary text-white text-[10px]">
              34 Provinsi
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            {provRecords
              .filter((r) => ["1.3", "3.2", "3.8", "6.2.3"].includes(r.indicator_id))
              .map((r) => (
                <div key={r.indicator_id} className="bg-white p-2.5 rounded-lg border border-brand-border">
                  <span className="text-[10px] text-brand-text-secondary font-medium block truncate">
                    {r.indicator_name}
                  </span>
                  <span className="text-sm font-bold text-brand-dark">
                    {r.indicator_id.startsWith("6")
                      ? formatCurrency(r.value)
                      : formatNumber(r.value)}
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* All 18 Indicators */}
        <div>
          <h3 className="text-xs font-bold text-brand-dark uppercase tracking-wider mb-3">
            Daftar 18 Indikator Historis ({year})
          </h3>

          <div className="space-y-2">
            {DATA_CATALOG.filter((meta) => meta.id !== "8.1.19").map((meta) => {
              const rec = provRecords.find((r) => r.indicator_id === meta.id);
              const isCost = meta.type === "cost";

              return (
                <div
                  key={meta.id}
                  className="p-3 rounded-lg border border-brand-border hover:border-brand-primary/40 transition-colors flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-brand-dark truncate">{meta.name}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                        {meta.id}
                      </span>
                    </div>
                    <span className="text-[10px] text-brand-text-secondary truncate block">
                      {meta.filename}
                    </span>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-bold text-brand-dark block text-sm">
                      {isCost ? formatCurrency(rec?.value) : formatNumber(rec?.value, meta.type === "count" ? 0 : 2)}
                    </span>
                    <span className="text-[10px] text-brand-text-secondary">{meta.unit}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-800 space-y-1">
          <div className="font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" /> Catatan Metodologi
          </div>
          <p>
            Data berasal dari agregasi provinsi historis BPJS Kesehatan (2014-2018). Tidak mewakili transaksi per pasien atau faskes individual.
          </p>
        </div>
      </div>
    </div>
  );
};
