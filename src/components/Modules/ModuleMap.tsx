"use client";

import React, { useState } from "react";
import { JknRecord } from "@/lib/types";
import { DATA_CATALOG } from "@/lib/dataCatalog";
import { ChoroplethMap } from "@/components/Map/ChoroplethMap";
import { DataProvenanceBadge } from "@/components/UI/DataProvenanceBadge";
import { formatNumber, formatCurrency } from "@/lib/utils";
import { Filter, Layers, Download, Maximize2 } from "lucide-react";

interface ModuleMapProps {
  year: number;
  records: JknRecord[];
  onSelectProvince: (prov: string) => void;
  selectedProvince: string | null;
}

export const ModuleMap: React.FC<ModuleMapProps> = ({
  year,
  records,
  onSelectProvince,
  selectedProvince,
}) => {
  const [selectedIndicatorId, setSelectedIndicatorId] = useState<string>("1.3");

  const activeMeta = DATA_CATALOG.find((m) => m.id === selectedIndicatorId) || DATA_CATALOG[0];

  // Filter current indicator records
  const currentRecords = records.filter(
    (r) => r.indicator_id === selectedIndicatorId && r.year === year && !r.is_national
  );

  const isCost = activeMeta.type === "cost";

  const sortedProvinces = [...currentRecords].sort((a, b) => (b.value || 0) - (a.value || 0));
  const topProv = sortedProvinces[0];
  const bottomProv = sortedProvinces[sortedProvinces.length - 1];

  const handleExportCSV = () => {
    const headers = ["Indicator_ID", "Indicator_Name", "Province", "Year", "Value", "Unit", "Source_File"];
    const rows = currentRecords.map((r) => [
      r.indicator_id,
      `"${r.indicator_name}"`,
      `"${r.province}"`,
      r.year,
      r.value ?? "",
      `"${r.unit}"`,
      `"${r.source_file}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `SIGARA_Choropleth_${selectedIndicatorId}_${year}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Filter Bar */}
      <div className="bg-white border border-brand-border rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-xs font-bold text-brand-dark">
            <Filter className="w-4 h-4 text-brand-primary" />
            <span>Pilih Indikator Peta:</span>
          </div>

          <select
            value={selectedIndicatorId}
            onChange={(e) => setSelectedIndicatorId(e.target.value)}
            className="bg-brand-soft border border-brand-border text-brand-dark text-xs font-semibold rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary cursor-pointer max-w-md"
          >
            <optgroup label="Peserta JKN">
              <option value="1.3">1.3 - Peserta JKN (peserta)</option>
            </optgroup>
            <optgroup label="Fasilitas Kesehatan (Rasio & Jumlah)">
              <option value="3.1">3.1 - Rasio Puskesmas (/100.000 peserta)</option>
              <option value="3.2">3.2 - Jumlah Puskesmas (unit)</option>
              <option value="3.3">3.3 - Rasio Dokter Praktik (/100.000 peserta)</option>
              <option value="3.4">3.4 - Jumlah Dokter Praktik (unit)</option>
              <option value="3.5">3.5 - Rasio Klinik Pratama (/100.000 peserta)</option>
              <option value="3.6">3.6 - Jumlah Klinik Pratama (unit)</option>
              <option value="3.7">3.7 - Rasio FKRTL (/100.000 peserta)</option>
              <option value="3.8">3.8 - Jumlah FKRTL (unit)</option>
            </optgroup>
            <optgroup label="Akses & Pemanfaatan Layanan">
              <option value="4.1.3">4.1.3 - Akses Pelayanan RJTP (orang/10.000)</option>
              <option value="4.2.3">4.2.3 - Akses Pelayanan RITP (orang/10.000)</option>
              <option value="4.3.3">4.3.3 - Akses Pelayanan RJTL (orang/10.000)</option>
              <option value="4.4.3">4.4.3 - Akses Pelayanan RITL (orang/10.000)</option>
              <option value="5.1.3">5.1.3 - Kunjungan Pelayanan RJTP (kunj/10.000)</option>
              <option value="5.3.3">5.3.3 - Kunjungan Pelayanan RJTL (kunj/10.000)</option>
              <option value="5.4.5">5.4.5 - Admisi Pelayanan RITL (admisi/10.000)</option>
            </optgroup>
            <optgroup label="Biaya Klaim">
              <option value="6.2.3">6.2.3 - Rerata Biaya Klaim RJTL (Rp/kunjungan)</option>
              <option value="6.3.3">6.3.3 - Rerata Biaya Klaim RITL (Rp/admisi)</option>
            </optgroup>
          </select>
        </div>

      </div>

      {/* Map + Quick Insights Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 h-[560px]">
          <ChoroplethMap
            indicatorId={selectedIndicatorId}
            indicatorName={activeMeta.name}
            unit={activeMeta.unit}
            year={year}
            records={records}
            onSelectProvince={onSelectProvince}
            selectedProvince={selectedProvince}
          />
        </div>

        {/* Side Panel Summary */}
        <div className="space-y-4">
          <div className="bg-white border border-brand-border rounded-xl p-4 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-brand-dark uppercase tracking-wider">
              Statistik {activeMeta.name} ({year})
            </h4>

            {topProv && (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                <span className="text-[10px] text-emerald-700 font-bold uppercase block">
                  Provinsi Tertinggi
                </span>
                <span className="text-sm font-bold text-emerald-950 block">{topProv.province}</span>
                <span className="text-xs font-semibold text-emerald-800">
                  {isCost ? formatCurrency(topProv.value) : formatNumber(topProv.value)} {activeMeta.unit}
                </span>
              </div>
            )}

            {bottomProv && (
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                <span className="text-[10px] text-amber-700 font-bold uppercase block">
                  Provinsi Terendah
                </span>
                <span className="text-sm font-bold text-amber-950 block">{bottomProv.province}</span>
                <span className="text-xs font-semibold text-amber-800">
                  {isCost ? formatCurrency(bottomProv.value) : formatNumber(bottomProv.value)} {activeMeta.unit}
                </span>
              </div>
            )}

            <div className="pt-2 text-[11px] text-brand-text-secondary leading-relaxed border-t border-brand-border">
              Klik provinsi pada peta untuk membuka <strong>Province Drawer</strong> yang menampilkan seluruh 18 indikator sepanjang 2014–2018.
            </div>
          </div>

          <div className="bg-brand-soft border border-brand-secondary/30 rounded-xl p-4 space-y-2">
            <span className="text-xs font-bold text-brand-primary block">Batas Wilayah & Validasi</span>
            <p className="text-[11px] text-slate-600 leading-normal">
              Peta tematik menggunakan GeoJSON 34 provinsi sesuai periode historis 2014-2018.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
