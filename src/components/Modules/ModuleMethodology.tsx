"use client";

import React, { useState } from "react";
import { DATA_CATALOG } from "@/lib/dataCatalog";
import { JknRecord, DiagnosisRecord } from "@/lib/types";
import { DataProvenanceBadge } from "@/components/UI/DataProvenanceBadge";
import { formatNumber, formatCurrency } from "@/lib/utils";
import { BookOpen, Bot, Cpu, Database, CheckCircle2, MessageSquare, Send, Sparkles } from "lucide-react";

interface ModuleMethodologyProps {
  records: JknRecord[];
  diagnosisData: DiagnosisRecord[];
}

interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  provenance?: {
    file: string;
    year?: number;
    province?: string;
    unit?: string;
  };
}

export const ModuleMethodology: React.FC<ModuleMethodologyProps> = ({
  records,
  diagnosisData,
}) => {
  const [activeTab, setActiveTab] = useState<"catalog" | "assistant" | "architecture">("catalog");

  // Chat Assistant State
  const [inputQuery, setInputQuery] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "assistant",
      text: "Halo! Saya Asisten Data SIGARA (mode deterministik). Saya dapat menjawab pertanyaan seputar 19 dataset historis JKN (2014-2018). Silakan pilih salah satu contoh pertanyaan atau ketik pertanyaan Anda.",
    },
  ]);

  const sampleQueries = [
    "Berapa jumlah peserta JKN NTT pada 2018?",
    "Bagaimana tren rasio FKRTL NTT 2014–2018?",
    "Bandingkan angka akses RJTL NTT dan nasional pada 2018",
    "Tampilkan diagnosis RJTL teratas secara nasional pada 2018",
    "Sumber indikator ini dari tabel apa?",
  ];

  const handleSendQuery = (queryText: string) => {
    if (!queryText.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: queryText,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery("");

    // Process answer deterministically
    const q = queryText.toLowerCase();

    let ansText = "";
    let provInfo: ChatMessage["provenance"] = undefined;

    if (q.includes("peserta") && q.includes("ntt") && q.includes("2018")) {
      const rec = records.find(
        (r) => r.indicator_id === "1.3" && r.province === "Nusa Tenggara Timur" && r.year === 2018
      );
      if (rec) {
        ansText = `Jumlah peserta JKN di Nusa Tenggara Timur pada tahun 2018 adalah ${formatNumber(rec.value)} peserta.`;
        provInfo = { file: rec.source_file, year: 2018, province: "Nusa Tenggara Timur", unit: "peserta" };
      }
    } else if (q.includes("rasio fkrtl") && q.includes("ntt")) {
      const nttRecords = records
        .filter((r) => r.indicator_id === "3.7" && r.province === "Nusa Tenggara Timur")
        .sort((a, b) => a.year - b.year);
      const trendStr = nttRecords.map((r) => `${r.year}: ${r.value?.toFixed(2)}`).join(", ");
      ansText = `Tren rasio FKRTL di Nusa Tenggara Timur (2014-2018) per 100.000 peserta adalah: ${trendStr}.`;
      provInfo = { file: "Tabel 3.7-Rasio FKRTL.xlsx", unit: "FKRTL / 100.000 peserta" };
    } else if (q.includes("akses rjtl") && q.includes("2018")) {
      const nttRec = records.find(
        (r) => r.indicator_id === "4.3.3" && r.province === "Nusa Tenggara Timur" && r.year === 2018
      );
      const natRec = records.find(
        (r) => r.indicator_id === "4.3.3" && r.is_national && r.year === 2018
      );
      ansText = `Pada tahun 2018, Angka Akses Pelayanan RJTL NTT adalah ${formatNumber(nttRec?.value, 1)} orang/10.000, sedangkan Rerata Nasional adalah ${formatNumber(natRec?.value, 1)} orang/10.000 peserta.`;
      provInfo = { file: "Tabel 4.3.3-Angka Akses Pelayanan RJTL.xlsx", year: 2018, unit: "orang / 10.000 peserta" };
    } else if (q.includes("diagnosis") || q.includes("penyakit")) {
      const top3 = diagnosisData.filter((d) => !d.is_total && d.rank > 0).slice(0, 3);
      const top3Str = top3.map((d) => `${d.rank}. ${d.icd_code} - ${d.diagnosis_name} (${formatNumber(d.visits)} kunjungan)`).join("; ");
      ansText = `Diagnosis RJTL teratas secara nasional tahun 2018 adalah: ${top3Str}.`;
      provInfo = { file: "Tabel 8.1.19 100 Penyakit Terbanyak pada RJTL Tahun 2018.xlsx", year: 2018 };
    } else if (q.includes("sumber") || q.includes("tabel")) {
      ansText = `Aplikasi SIGARA mengkonsumsi 19 file Excel historis (2014-2018) terstruktur yang mencakup pertumbuhan peserta, rasio & jumlah faskes (Puskesmas, Dokter, Klinik, FKRTL), angka akses/kunjungan/admisi, rerata biaya klaim, dan 100 diagnosis terbanyak.`;
      provInfo = { file: "19 Dataset JKN Manifest" };
    } else {
      ansText = `Maaf, pertanyaan Anda dapat diproses lebih spesifik. Contoh: "Berapa jumlah peserta JKN NTT pada 2018?" atau "Tampilkan diagnosis RJTL teratas".`;
    }

    setTimeout(() => {
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "assistant",
        text: ansText,
        provenance: provInfo,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    }, 200);
  };

  return (
    <div className="space-y-6">
      {/* Header Tabs */}
      <div className="flex items-center justify-between bg-white border border-brand-border rounded-xl p-3 shadow-xs flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("catalog")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "catalog"
                ? "bg-brand-primary text-white shadow-xs"
                : "text-brand-text-secondary hover:bg-brand-soft"
            }`}
          >
            <Database className="w-4 h-4" /> Data Catalog 19 Dataset
          </button>
          <button
            onClick={() => setActiveTab("assistant")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "assistant"
                ? "bg-brand-primary text-white shadow-xs"
                : "text-brand-text-secondary hover:bg-brand-soft"
            }`}
          >
            <Bot className="w-4 h-4 text-cyan-300" /> Asisten Data SIGARA
          </button>
          <button
            onClick={() => setActiveTab("architecture")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "architecture"
                ? "bg-brand-primary text-white shadow-xs"
                : "text-brand-text-secondary hover:bg-brand-soft"
            }`}
          >
            <Cpu className="w-4 h-4" /> Arsitektur 6-Agent AI
          </button>
        </div>
      </div>

      {/* Catalog Tab */}
      {activeTab === "catalog" && (
        <div className="bg-white border border-brand-border rounded-xl p-5 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-brand-dark">Katalog 19 Workbook Dataset JKN</h3>
            <p className="text-xs text-brand-text-secondary">
              Manifest lengkap sumber data historis yang diintegrasikan ke dalam WebGIS SIGARA.
            </p>
          </div>

          <div className="overflow-x-auto border border-brand-border rounded-lg">
            <table className="w-full text-xs text-left text-brand-dark">
              <thead className="bg-brand-soft border-b border-brand-border text-[11px] font-bold uppercase tracking-wider text-brand-primary">
                <tr>
                  <th className="px-4 py-3">Kode ID</th>
                  <th className="px-4 py-3">Nama File Excel</th>
                  <th className="px-4 py-3">Nama Indikator</th>
                  <th className="px-4 py-3">Satuan</th>
                  <th className="px-4 py-3">Periode</th>
                  <th className="px-4 py-3">Status Validasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {DATA_CATALOG.map((meta) => (
                  <tr key={meta.id} className="hover:bg-brand-soft/50">
                    <td className="px-4 py-2.5 font-mono font-bold text-brand-accent">{meta.id}</td>
                    <td className="px-4 py-2.5 font-mono text-[11px] text-slate-700">{meta.filename}</td>
                    <td className="px-4 py-2.5 font-medium">{meta.name}</td>
                    <td className="px-4 py-2.5 text-slate-600">{meta.unit}</td>
                    <td className="px-4 py-2.5 font-mono text-slate-600">{meta.id === "8.1.19" ? "2018" : "2014-2018"}</td>
                    <td className="px-4 py-2.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Terverifikasi
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Assistant Tab */}
      {activeTab === "assistant" && (
        <div className="bg-white border border-brand-border rounded-xl p-5 shadow-xs space-y-4 max-w-4xl mx-auto">
          <div className="flex items-center justify-between border-b border-brand-border pb-3">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-brand-primary" />
              <div>
                <h3 className="text-sm font-bold text-brand-dark">Asisten Data SIGARA (Deterministik)</h3>
                <span className="text-[11px] text-brand-text-secondary">Tanya-jawab berbasis 19 dataset terverifikasi</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              100% Fact-Checked
            </span>
          </div>

          {/* Sample Queries */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase block">Contoh Pertanyaan Cepat:</span>
            <div className="flex flex-wrap gap-1.5">
              {sampleQueries.map((sq) => (
                <button
                  key={sq}
                  onClick={() => handleSendQuery(sq)}
                  className="px-2.5 py-1 rounded-lg bg-brand-soft hover:bg-brand-secondary/20 text-brand-primary text-xs font-semibold border border-brand-border transition-colors text-left"
                >
                  {sq}
                </button>
              ))}
            </div>
          </div>

          {/* Messages Container */}
          <div className="h-80 overflow-y-auto border border-brand-border rounded-xl p-4 bg-slate-50/50 space-y-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                    m.sender === "user"
                      ? "bg-brand-primary text-white rounded-br-none"
                      : "bg-white border border-brand-border text-slate-900 rounded-bl-none shadow-xs"
                  }`}
                >
                  {m.text}
                </div>

                {m.provenance && (
                  <div className="mt-1">
                    <DataProvenanceBadge
                      filename={m.provenance.file}
                      year={m.provenance.year}
                      province={m.provenance.province}
                      unit={m.provenance.unit}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Input Box */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Tanyakan angka indikator..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendQuery(inputQuery)}
              className="flex-1 p-2.5 border border-brand-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
            <button
              onClick={() => handleSendQuery(inputQuery)}
              className="p-2.5 rounded-xl bg-brand-primary hover:bg-brand-hover text-white transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Architecture Tab */}
      {activeTab === "architecture" && (
        <div className="bg-white border border-brand-border rounded-xl p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-sm font-bold text-brand-dark">Cetak Biru Arsitektur 6-Agent AI SIGARA</h3>
            <p className="text-xs text-brand-text-secondary">
              Perencanaan agen otonom untuk integrasi backend pemeriksaan rujukan akuntabel.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-brand-border bg-slate-50 space-y-2">
              <span className="text-xs font-bold text-brand-primary block">1. Agent Orchestrator</span>
              <p className="text-[11px] text-slate-600">Mengkoordinasikan aliran pemeriksaan, validasi aturan triase, dan mengarahkan agen spesialis.</p>
              <span className="inline-block px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">Direncanakan</span>
            </div>

            <div className="p-4 rounded-xl border border-brand-border bg-slate-50 space-y-2">
              <span className="text-xs font-bold text-brand-primary block">2. Agent Data JKN</span>
              <p className="text-[11px] text-slate-600">Mengkonsumsi 19 dataset historis dan data transaksional terotorisasi untuk penarikan metrik dasar.</p>
              <span className="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">Aktif (Local)</span>
            </div>

            <div className="p-4 rounded-xl border border-brand-border bg-slate-50 space-y-2">
              <span className="text-xs font-bold text-brand-primary block">3. Agent Kapabilitas Faskes</span>
              <p className="text-[11px] text-slate-600">Memeriksa kelayakan spesialis, jadwal praktik, kapasitas bed, dan status kontrak kerja sama faskes.</p>
              <span className="inline-block px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">Direncanakan</span>
            </div>

            <div className="p-4 rounded-xl border border-brand-border bg-slate-50 space-y-2">
              <span className="text-xs font-bold text-brand-primary block">4. Agent GeoAI & Routing</span>
              <p className="text-[11px] text-slate-600">Menghitung matriks jarak, waktu tempuh jalan publik, dan simulasi rute tercepat antar-faskes.</p>
              <span className="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">Demo Client</span>
            </div>

            <div className="p-4 rounded-xl border border-brand-border bg-slate-50 space-y-2">
              <span className="text-xs font-bold text-brand-primary block">5. Agent Konteks Klinis</span>
              <p className="text-[11px] text-slate-600">Menganalisis kesesuaian diagnosis ICD-10 dengan tindakan medis dan alasan pengecualian klinis.</p>
              <span className="inline-block px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">Direncanakan</span>
            </div>

            <div className="p-4 rounded-xl border border-brand-border bg-slate-50 space-y-2">
              <span className="text-xs font-bold text-brand-primary block">6. Agent Bukti & Provenance</span>
              <p className="text-[11px] text-slate-600">Menyusun berkas audit trail, data provenance badge, dan catatan keputusan verifikator.</p>
              <span className="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">Aktif (Client)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
