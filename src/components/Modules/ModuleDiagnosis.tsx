"use client";

import React, { useState, useEffect } from "react";
import { fetchDiagnosisData } from "@/lib/dataStore";
import { DiagnosisRecord } from "@/lib/types";
import { DataProvenanceBadge } from "@/components/UI/DataProvenanceBadge";
import { formatNumber } from "@/lib/utils";
import { FileText, Search, AlertCircle } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export const ModuleDiagnosis: React.FC = () => {
  const [diagnoses, setDiagnoses] = useState<DiagnosisRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [chartLimit, setChartLimit] = useState<10 | 20>(10);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  useEffect(() => {
    fetchDiagnosisData().then(setDiagnoses);
  }, []);

  const totalRow = diagnoses.find((d) => d.is_total);
  const listRows = diagnoses.filter((d) => !d.is_total && d.rank > 0);

  const filtered = listRows.filter(
    (d) =>
      d.icd_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.diagnosis_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const topChartData = listRows.slice(0, chartLimit).map((d) => ({
    name: `${d.icd_code} - ${d.diagnosis_name.substring(0, 25)}...`,
    code: d.icd_code,
    visits: d.visits || 0,
    fullName: d.diagnosis_name,
  }));

  return (
    <div className="space-y-6">
      {/* Scope Header */}
      <div className="bg-white border border-brand-border rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-brand-dark">
              100 Penyakit Terbanyak pada RJTL Tahun 2018
            </h3>
            <span className="px-2 py-0.5 rounded bg-brand-primary text-white text-[10px] font-bold">
              Nasional 2018
            </span>
          </div>
          <p className="text-xs text-brand-text-secondary mt-0.5">
            Dataset ini memuat 100 entri diagnosis tingkat nasional (2018), bukan data per provinsi.
          </p>
        </div>
        <DataProvenanceBadge
          filename="Tabel 8.1.19 100 Penyakit Terbanyak pada RJTL Tahun 2018.xlsx"
          year={2018}
          unit="kunjungan & peserta"
        />
      </div>

      {/* Total Row Summary */}
      {totalRow && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-brand-soft border border-brand-secondary/30 rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-primary text-white flex items-center justify-center font-bold text-lg">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-brand-text-secondary font-medium">
                Total Kunjungan 100 Penyakit
              </span>
              <div className="text-2xl font-bold text-brand-dark">
                {formatNumber(totalRow.visits)}
              </div>
            </div>
          </div>

          <div className="bg-brand-soft border border-brand-secondary/30 rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-accent text-white flex items-center justify-center font-bold text-lg">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-brand-text-secondary font-medium">
                Total Peserta Unik (Agregat)
              </span>
              <div className="text-2xl font-bold text-brand-dark">
                {formatNumber(totalRow.participants)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top 10 / 20 Visual Chart */}
      <div className="bg-white border border-brand-border rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-brand-dark uppercase tracking-wider">
            Grafik Diagnosis Teratas Menurut Jumlah Kunjungan
          </h4>

          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setChartLimit(10)}
              className={`px-3 py-1 rounded-md font-bold ${
                chartLimit === 10 ? "bg-white text-brand-dark shadow-xs" : "text-slate-600"
              }`}
            >
              Top 10
            </button>
            <button
              onClick={() => setChartLimit(20)}
              className={`px-3 py-1 rounded-md font-bold ${
                chartLimit === 20 ? "bg-white text-brand-dark shadow-xs" : "text-slate-600"
              }`}
            >
              Top 20
            </button>
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={topChartData} margin={{ top: 5, right: 20, left: 60, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EEF4F1" />
              <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={(v) => (v >= 1000000 ? `${(v/1000000).toFixed(1)}M` : formatNumber(v))} />
              <YAxis dataKey="code" type="category" tick={{ fontSize: 11, fontWeight: "bold" }} width={60} />
              <Tooltip
                formatter={(val: any, name: any, item: any) => [
                  `${formatNumber(Number(val))} kunjungan`,
                  item.payload.fullName,
                ]}
              />
              <Bar dataKey="visits" fill="#2F6F57" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Searchable 100 Rows Table */}
      <div className="bg-white border border-brand-border rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-brand-dark">
              Tabel 100 Diagnosis Terbanyak RJTL 2018
            </h4>
            <p className="text-xs text-brand-text-secondary">
              Pencarian berdasarkan Kode ICD-10 atau Deskripsi Diagnosis
            </p>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari Kode ICD / Nama..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-8 pr-3 py-1.5 border border-brand-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-brand-primary w-56"
            />
          </div>
        </div>

        <div className="overflow-x-auto border border-brand-border rounded-lg">
          <table className="w-full text-xs text-left text-brand-dark">
            <thead className="bg-brand-soft border-b border-brand-border text-[11px] font-bold uppercase tracking-wider text-brand-primary">
              <tr>
                <th className="px-4 py-3">No.</th>
                <th className="px-4 py-3">Kode ICD-10</th>
                <th className="px-4 py-3">Diagnosis Primer</th>
                <th className="px-4 py-3 text-right">Jumlah Kunjungan</th>
                <th className="px-4 py-3 text-right">Jumlah Peserta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {paginated.map((d) => (
                <tr key={`${d.rank}-${d.icd_code}`} className="hover:bg-brand-soft/50">
                  <td className="px-4 py-2.5 font-mono text-slate-500 font-bold">{d.rank}</td>
                  <td className="px-4 py-2.5 font-mono font-bold text-brand-accent">{d.icd_code}</td>
                  <td className="px-4 py-2.5 font-medium">{d.diagnosis_name}</td>
                  <td className="px-4 py-2.5 text-right font-bold">{formatNumber(d.visits)}</td>
                  <td className="px-4 py-2.5 text-right text-slate-600">{formatNumber(d.participants)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between text-xs text-brand-text-secondary pt-2">
          <span>
            Menampilkan {paginated.length} dari {filtered.length} entri
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1 rounded border border-brand-border hover:bg-slate-100 disabled:opacity-50"
            >
              Prev
            </button>
            <span className="px-2 font-bold text-brand-dark">
              {currentPage} / {totalPages || 1}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-2.5 py-1 rounded border border-brand-border hover:bg-slate-100 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
