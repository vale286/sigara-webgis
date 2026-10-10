"use client";

import React, { useState } from "react";
import { Cpu, MapPin, Clock, AlertTriangle, CheckCircle, FileCheck2, Info, ArrowRight } from "lucide-react";
import { ReferralCase } from "@/lib/types";

export const ModuleGeoAI: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"case-study" | "simulator">("case-study");

  // Sample proposal case study SIM-R01516
  const caseStudy: ReferralCase = {
    caseId: "SIM-R01516",
    patientId: "P-882041",
    referralDate: "2026-06-14T09:30:00+08:00",
    sourceFktp: "FKTP-S01 (Puskesmas Pasir Panjang, Kupang)",
    sourceFktpCoords: [123.6075, -10.1654],
    chosenFkrtl: "RS-S06 (RS Siloam Kupang)",
    chosenFkrtlCoords: [123.6189, -10.1580],
    serviceType: "Spesialis Penyakit Dalam (Sp.PD)",
    estimatedTravelTimeMin: 30.2,
    nearestAlternativeFkrtl: "RS-S01 (RSUD Prof. Dr. W.Z. Johannes, Kupang)",
    nearestAlternativeTravelTimeMin: 6.1,
    timeDifferenceMin: 24.1,
    timeRatio: 4.95,
    hasDocumentedException: false,
    exceptionReason: "Tidak ada kode pengecualian klinis atau kapasitas yang terlampir.",
    triageStatus: "Perlu Pemeriksaan",
    notes: "Pilihan RS memakan waktu +24,1 menit dibanding 5 alternatif layak yang lebih dekat tanpa catatan pengecualian.",
  };

  // Interactive Simulator State
  const [simService, setSimService] = useState("Spesialis Penyakit Dalam");
  const [simTravelTime, setSimTravelTime] = useState<number>(30);
  const [simAlternativeTime, setSimAlternativeTime] = useState<number>(8);
  const [simException, setSimException] = useState<boolean>(false);
  const [simExceptionCode, setSimExceptionCode] = useState<string>("NONE");

  // Dynamic Triage Calculation
  const extraTime = Math.max(simTravelTime - simAlternativeTime, 0);
  const ratio = simAlternativeTime > 0 ? simTravelTime / simAlternativeTime : 1;

  let computedTriage: "Sesuai Model" | "Alasan Terdokumentasi" | "Perlu Pemeriksaan" = "Sesuai Model";
  if (simException && simExceptionCode !== "NONE") {
    computedTriage = "Alasan Terdokumentasi";
  } else if (extraTime >= 8 && ratio >= 1.5) {
    computedTriage = "Perlu Pemeriksaan";
  } else {
    computedTriage = "Sesuai Model";
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-brand-dark to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30">
              KOTA KUPANG DEMO
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              OPERASIONAL VERIFIKATOR
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-3">
            <Cpu className="w-8 h-8 text-cyan-400" /> GeoAI Pemeriksaan Rujukan Akuntabel
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Demonstrasi model triase pemeriksaan rujukan yang membandingkan aksesibilitas geospasial jaringan jalan publik, waktu tempuh antar-faskes, dan kriteria kelayakan fasilitas.
          </p>

          <div className="pt-2 flex items-center gap-2 border-t border-white/10 text-[11px] text-slate-400">
            <Info className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Data rujukan disintesis untuk keperluan verifikasi operasional dan audit rujukan internal BPJS Kesehatan.</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 bg-white border border-brand-border rounded-xl p-2 shadow-xs">
        <button
          onClick={() => setActiveTab("case-study")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === "case-study"
              ? "bg-brand-primary text-white shadow-xs"
              : "text-brand-text-secondary hover:bg-brand-soft"
          }`}
        >
          Studi Kasus Pemeriksaan (SIM-R01516)
        </button>
        <button
          onClick={() => setActiveTab("simulator")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === "simulator"
              ? "bg-brand-primary text-white shadow-xs"
              : "text-brand-text-secondary hover:bg-brand-soft"
          }`}
        >
          Simulator Triase Rujukan Interaktif
        </button>
      </div>


      {/* Case Study Tab */}
      {activeTab === "case-study" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Case Card Detail */}
            <div className="lg:col-span-2 bg-white border border-brand-border rounded-xl p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-brand-border pb-4">
                <div>
                  <span className="text-xs text-slate-500 font-mono">No. Kasus: {caseStudy.caseId}</span>
                  <h3 className="text-lg font-bold text-brand-dark">Pemeriksaan Rujukan Pasien {caseStudy.patientId}</h3>
                  <span className="text-xs text-brand-text-secondary">Tanggal Rujukan: {new Date(caseStudy.referralDate).toLocaleString("id-ID")}</span>
                </div>

                <div className="px-3 py-1.5 rounded-xl bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  {caseStudy.triageStatus}
                </div>
              </div>

              {/* Grid Journey details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[11px] text-slate-500 uppercase font-bold">FKTP Perujuk</span>
                  <div className="text-sm font-bold text-slate-900">{caseStudy.sourceFktp}</div>
                  <span className="text-xs text-slate-600 font-mono">Coords: [10.1654°S, 123.6075°E]</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[11px] text-slate-500 uppercase font-bold">FKRTL Dipilih</span>
                  <div className="text-sm font-bold text-slate-900">{caseStudy.chosenFkrtl}</div>
                  <span className="text-xs text-slate-600 font-mono">Waktu Tempuh: {caseStudy.estimatedTravelTimeMin} Menit</span>
                </div>
              </div>

              {/* Comparison Details */}
              <div className="p-4 rounded-xl bg-cyan-50 border border-cyan-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-950 uppercase tracking-wider">
                    Alternatif Terdekat Layak
                  </span>
                  <span className="px-2 py-0.5 rounded bg-cyan-600 text-white text-[10px] font-bold">
                    5 Alternatif Teridentifikasi
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-slate-900 block">{caseStudy.nearestAlternativeFkrtl}</span>
                    <span className="text-slate-600">Estimasi Waktu Tempuh: <strong>{caseStudy.nearestAlternativeTravelTimeMin} Menit</strong></span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-rose-700 block">Selisih: +{caseStudy.timeDifferenceMin} Menit</span>
                    <span className="text-[10px] text-slate-500 font-mono">Rasio: {caseStudy.timeRatio}x lebih lama</span>
                  </div>
                </div>
              </div>

              {/* Rule & Exception Inspection */}
              <div className="p-4 rounded-xl border border-brand-border space-y-2">
                <span className="text-xs font-bold text-brand-dark block">Hasil Audit Pemeriksaan GeoAI</span>
                <p className="text-xs text-slate-700 leading-relaxed">{caseStudy.notes}</p>
                <div className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded border border-amber-200 font-mono">
                  Alasan Pengecualian: {caseStudy.exceptionReason}
                </div>
              </div>
            </div>

            {/* Triage Matrix Rules */}
            <div className="bg-white border border-brand-border rounded-xl p-5 shadow-xs space-y-4">
              <h4 className="text-xs font-bold text-brand-dark uppercase tracking-wider">
                Empat Kategori Triase GeoAI SIGARA
              </h4>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 space-y-1">
                  <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" /> Sesuai Model
                  </div>
                  <p className="text-[11px] text-emerald-800">Rujukan menuju faskes terdekat yang sesuai kapabilitas layanan tanpa anomali waktu tempuh signifikan.</p>
                </div>

                <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 space-y-1">
                  <div className="font-bold text-blue-950 flex items-center gap-1.5">
                    <FileCheck2 className="w-4 h-4 text-blue-600" /> Alasan Terdokumentasi
                  </div>
                  <p className="text-[11px] text-blue-800">Terdapat selisih waktu tempuh namun disertai kode alasan klinis, kuota penuh, atau kendala medis terlampir.</p>
                </div>

                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 space-y-1">
                  <div className="font-bold text-amber-950 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" /> Perlu Pemeriksaan
                  </div>
                  <p className="text-[11px] text-amber-800">Tambahan waktu &ge; 8 menit dan rasio &ge; 1,5x tanpa disertai bukti alasan pengecualian klinis.</p>
                </div>

                <div className="p-3 rounded-lg bg-slate-100 border border-slate-300 space-y-1">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-slate-500" /> Data Belum Cukup
                  </div>
                  <p className="text-[11px] text-slate-700">Informasi koordinat, jadwal dokter, atau status kontrak fasilitas pada waktu kejadian tidak lengkap.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Simulator Tab */}
      {activeTab === "simulator" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Controls */}
          <div className="bg-white border border-brand-border rounded-xl p-6 shadow-xs space-y-5">
            <h3 className="text-sm font-bold text-brand-dark">Input Parameter Simulasi Rujukan</h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Jenis Layanan Spesialis</label>
                <select
                  value={simService}
                  onChange={(e) => setSimService(e.target.value)}
                  className="w-full p-2 border border-brand-border rounded-lg bg-white font-medium"
                >
                  <option value="Spesialis Penyakit Dalam">Spesialis Penyakit Dalam (Sp.PD)</option>
                  <option value="Spesialis Anak">Spesialis Anak (Sp.A)</option>
                  <option value="Spesialis Bedah">Spesialis Bedah (Sp.B)</option>
                  <option value="Spesialis Obstetri & Ginekologi">Spesialis Obstetri & Ginekologi (Sp.OG)</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span>Waktu Tempuh ke RS Dipilih:</span>
                  <span className="font-bold text-brand-primary">{simTravelTime} Menit</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={60}
                  value={simTravelTime}
                  onChange={(e) => setSimTravelTime(Number(e.target.value))}
                  className="w-full accent-brand-primary cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span>Waktu Tempuh ke RS Alternatif Terdekat Layak:</span>
                  <span className="font-bold text-brand-accent">{simAlternativeTime} Menit</span>
                </div>
                <input
                  type="range"
                  min={3}
                  max={30}
                  value={simAlternativeTime}
                  onChange={(e) => setSimAlternativeTime(Number(e.target.value))}
                  className="w-full accent-brand-accent cursor-pointer"
                />
              </div>

              <div className="pt-2 border-t border-brand-border space-y-2">
                <label className="flex items-center gap-2 font-semibold text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={simException}
                    onChange={(e) => setSimException(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-primary"
                  />
                  <span>Lampirkan Kode Pengecualian Klinis / Operasional</span>
                </label>

                {simException && (
                  <select
                    value={simExceptionCode}
                    onChange={(e) => setSimExceptionCode(e.target.value)}
                    className="w-full p-2 border border-brand-border rounded-lg bg-slate-50 font-mono text-xs"
                  >
                    <option value="EXC-01">EXC-01: Peralatan Medis Khusus Diperlukan</option>
                    <option value="EXC-02">EXC-02: Kuota Faskes Terdekat Penuh</option>
                    <option value="EXC-03">EXC-03: Dokter Spesialis Tidak Layar Pada Jam Kejadian</option>
                    <option value="EXC-04">EXC-04: Permintaan Khusus Pasien / Kondisi Darurat Terkontrol</option>
                  </select>
                )}
              </div>
            </div>
          </div>

          {/* Result Card */}
          <div className="bg-white border border-brand-border rounded-xl p-6 shadow-xs flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hasil Evaluasi Triase Model SIGARA</span>

              <div
                className={`p-5 rounded-2xl border text-center space-y-2 ${
                  computedTriage === "Sesuai Model"
                    ? "bg-emerald-50 border-emerald-300 text-emerald-950"
                    : computedTriage === "Alasan Terdokumentasi"
                    ? "bg-blue-50 border-blue-300 text-blue-950"
                    : "bg-amber-50 border-amber-300 text-amber-950"
                }`}
              >
                <span className="text-xs font-bold uppercase tracking-wider block opacity-75">Status Triase</span>
                <div className="text-2xl font-extrabold">{computedTriage}</div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Tambahan Waktu</span>
                  <span className="text-base font-bold text-slate-900">+{extraTime.toFixed(1)} Menit</span>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Rasio Waktu Tempuh</span>
                  <span className="text-base font-bold text-slate-900">{ratio.toFixed(2)}x</span>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 border-t border-slate-200 pt-3">
              Catatan: Status triase membantu prioritas verifikasi berkas oleh petugas antifraud/verifikator, dan tidak secara otomatis memvonis kecurangan (fraud).
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
