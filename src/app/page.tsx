"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { ProvinceDrawer } from "@/components/ProvinceDrawer";
import { fetchJknData, fetchDiagnosisData } from "@/lib/dataStore";
import { JknRecord, DiagnosisRecord, ModuleId } from "@/lib/types";
import { PROVINCES_LIST } from "@/lib/dataCatalog";

import { ModuleSummary } from "@/components/Modules/ModuleSummary";
import { ModuleMap } from "@/components/Modules/ModuleMap";
import { ModuleFacilities } from "@/components/Modules/ModuleFacilities";
import { ModuleUtilization } from "@/components/Modules/ModuleUtilization";
import { ModuleClaims } from "@/components/Modules/ModuleClaims";
import { ModuleDiagnosis } from "@/components/Modules/ModuleDiagnosis";
import { ModuleGeoAI } from "@/components/Modules/ModuleGeoAI";
import { ModuleMethodology } from "@/components/Modules/ModuleMethodology";

export default function HomePage() {
  const [activeModule, setActiveModule] = useState<ModuleId>("summary");
  const [selectedYear, setSelectedYear] = useState<number>(2018);
  const [selectedProvince, setSelectedProvince] = useState<string>("Semua");

  const [records, setRecords] = useState<JknRecord[]>([]);
  const [diagnosisData, setDiagnosisData] = useState<DiagnosisRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Inspector Drawer State
  const [drawerProvince, setDrawerProvince] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([fetchJknData(), fetchDiagnosisData()])
      .then(([jkn, diag]) => {
        setRecords(jkn);
        setDiagnosisData(diag);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleSelectProvinceFromMap = (prov: string) => {
    setDrawerProvince(prov);
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-dark flex flex-col font-sans">
      {/* Header Bar */}
      <Header
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedProvince={selectedProvince}
        setSelectedProvince={setSelectedProvince}
        provinces={PROVINCES_LIST}
        activeModule={activeModule}
      />

      <div className="flex flex-1">
        {/* Sidebar Navigation */}
        <Sidebar activeModule={activeModule} setActiveModule={setActiveModule} />

        {/* Main Workspace Area */}
        <main className="flex-1 p-6 overflow-y-auto max-w-7xl mx-auto space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-96 space-y-4">
              <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs text-brand-text-secondary font-medium">
                Mengunggah & Memvalidasi 19 Dataset JKN...
              </p>
            </div>
          ) : (
            <>
              {activeModule === "summary" && (
                <ModuleSummary
                  year={selectedYear}
                  selectedProvince={selectedProvince}
                  records={records}
                  setActiveModule={setActiveModule}
                />
              )}

              {activeModule === "map" && (
                <ModuleMap
                  year={selectedYear}
                  records={records}
                  onSelectProvince={handleSelectProvinceFromMap}
                  selectedProvince={selectedProvince === "Semua" ? null : selectedProvince}
                />
              )}

              {activeModule === "facilities" && (
                <ModuleFacilities
                  year={selectedYear}
                  selectedProvince={selectedProvince}
                  records={records}
                />
              )}

              {activeModule === "utilization" && (
                <ModuleUtilization
                  year={selectedYear}
                  selectedProvince={selectedProvince}
                  records={records}
                />
              )}

              {activeModule === "claims" && (
                <ModuleClaims
                  year={selectedYear}
                  selectedProvince={selectedProvince}
                  records={records}
                />
              )}

              {activeModule === "diagnosis" && <ModuleDiagnosis />}

              {activeModule === "geoai" && <ModuleGeoAI />}

              {activeModule === "methodology" && (
                <ModuleMethodology records={records} diagnosisData={diagnosisData} />
              )}
            </>
          )}
        </main>
      </div>

      {/* Right Drawer Inspector */}
      <ProvinceDrawer
        province={drawerProvince}
        onClose={() => setDrawerProvince(null)}
        year={selectedYear}
        records={records}
      />
    </div>
  );
}
