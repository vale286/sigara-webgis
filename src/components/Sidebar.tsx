"use client";

import React from "react";
import {
  LayoutDashboard,
  Map,
  Building2,
  Activity,
  DollarSign,
  FileText,
  Cpu,
  BookOpen,
} from "lucide-react";
import { ModuleId } from "@/lib/types";

interface SidebarProps {
  activeModule: ModuleId;
  setActiveModule: (m: ModuleId) => void;
}

export const NAV_ITEMS: { id: ModuleId; label: string; icon: React.ElementType; badge?: string }[] = [
  { id: "summary", label: "Ringkasan JKN", icon: LayoutDashboard },
  { id: "map", label: "Peta Sebaran JKN", icon: Map },
  { id: "facilities", label: "Ketersediaan Faskes", icon: Building2 },
  { id: "utilization", label: "Akses & Pemanfaatan", icon: Activity },
  { id: "claims", label: "Analisis Biaya Klaim", icon: DollarSign },
  { id: "diagnosis", label: "Profil Diagnosis RJTL", icon: FileText },
  { id: "geoai", label: "GeoAI Pemeriksaan Rujukan", icon: Cpu },
  { id: "methodology", label: "Metodologi & Asisten", icon: BookOpen },
];


export const Sidebar: React.FC<SidebarProps> = ({ activeModule, setActiveModule }) => {
  return (
    <aside className="w-64 bg-white border-r border-brand-border flex flex-col justify-between h-[calc(100vh-61px)] sticky top-[61px] shrink-0">
      <div className="p-4 space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold text-brand-text-secondary uppercase tracking-wider">
          Navigasi Modul
        </div>
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveModule(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? "bg-brand-primary text-white shadow-sm font-semibold"
                    : "text-brand-text-primary hover:bg-brand-soft hover:text-brand-dark"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-brand-primary"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
                      isActive ? "bg-white/20 text-white" : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-brand-border bg-brand-soft/40 text-xs text-brand-text-secondary space-y-2">
        <div className="flex items-center gap-2 font-semibold text-brand-dark">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span>19 Dataset JKN Ready</span>
        </div>
        <p className="text-[11px] leading-relaxed">
          Semua data disajikan berdasarkan 19 workbook resmi BPJS Kesehatan (2014–2018).
        </p>
      </div>
    </aside>
  );
};
