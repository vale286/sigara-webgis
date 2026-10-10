"use client";

import React, { useEffect, useState, useRef } from "react";
import L from "leaflet";
import { JknRecord } from "@/lib/types";
import { getChoroplethColor, formatNumber, formatCurrency } from "@/lib/utils";

interface ProvinceCentroid {
  name: string;
  lat: number;
  lng: number;
}

interface ChoroplethMapInnerProps {
  indicatorId: string;
  indicatorName: string;
  unit: string;
  year: number;
  records: JknRecord[];
  onSelectProvince: (prov: string) => void;
  selectedProvince: string | null;
}

export default function ChoroplethMapInner({
  indicatorId,
  indicatorName,
  unit,
  year,
  records,
  onSelectProvince,
  selectedProvince,
}: ChoroplethMapInnerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  const [centroids, setCentroids] = useState<ProvinceCentroid[]>([]);
  const [tileProvider, setTileProvider] = useState<"osm" | "light" | "satellite">("osm");

  // Fetch 34 province centroids
  useEffect(() => {
    fetch("/data/indonesia_province_centroids.json")
      .then((res) => res.json())
      .then((data) => setCentroids(data))
      .catch((err) => console.error("Centroids error:", err));
  }, []);

  // Filter current indicator + year records
  const currentRecords = records.filter(
    (r) => r.indicator_id === indicatorId && r.year === year && !r.is_national
  );

  const values = currentRecords
    .map((r) => r.value)
    .filter((v): v is number => v !== null && !isNaN(v));

  const minVal = values.length > 0 ? Math.min(...values) : 0;
  const maxVal = values.length > 0 ? Math.max(...values) : 100;

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [-2.5, 118.0],
      zoom: 5,
      zoomControl: true,
    });

    mapInstanceRef.current = map;

    // Create layer group for province markers
    const layerGroup = L.layerGroup().addTo(map);
    layerGroupRef.current = layerGroup;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Handle Tile Layers (No API key watermarks)
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    let tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    let attr = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

    if (tileProvider === "light") {
      tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    } else if (tileProvider === "satellite") {
      tileUrl = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
      attr = "Esri, Maxar, Earthstar Geographics";
    }

    L.tileLayer(tileUrl, { attribution: attr, maxZoom: 19 }).addTo(map);
  }, [tileProvider]);

  // Render Proportional Interactive Circle Markers
  useEffect(() => {
    if (!mapInstanceRef.current || centroids.length === 0) return;
    const layerGroup = layerGroupRef.current;
    if (!layerGroup) return;

    layerGroup.clearLayers();

    const valueMap = new Map<string, number | null>();
    currentRecords.forEach((r) => {
      valueMap.set(r.province.toLowerCase(), r.value);
    });

    const isCost = indicatorId.startsWith("6");

    centroids.forEach((c) => {
      const val = valueMap.get(c.name.toLowerCase()) ?? null;
      const color = getChoroplethColor(val, minVal, maxVal);
      const isSelected = selectedProvince?.toLowerCase() === c.name.toLowerCase();

      // Calculate radius (from 10px to 26px) based on value
      let radius = 12;
      if (val !== null && maxVal > minVal) {
        const ratio = (val - minVal) / (maxVal - minVal);
        radius = 10 + ratio * 18;
      }

      const valText = isCost
        ? formatCurrency(val)
        : formatNumber(val, indicatorId.startsWith("3") && !indicatorId.endsWith("2") ? 2 : 0);

      const marker = L.circleMarker([c.lat, c.lng], {
        radius: isSelected ? radius + 4 : radius,
        fillColor: isSelected ? "#1E5631" : color,
        color: isSelected ? "#1E5631" : "#74C69D",
        weight: isSelected ? 4 : 2.5,
        opacity: 1,
        fillOpacity: isSelected ? 0.95 : (val === null ? 0.3 : 0.85),
      });


      // Bind Tooltip
      marker.bindTooltip(
        `<div class="p-1 font-sans">
          <strong class="text-brand-dark block text-xs font-bold">${c.name}</strong>
          <span class="text-[11px] text-slate-600">${indicatorName}:</span>
          <span class="text-xs font-bold text-brand-primary block">${valText} ${unit}</span>
          <span class="text-[10px] text-slate-400 block mt-0.5">Tahun ${year} | Klik untuk detail</span>
        </div>`,
        { sticky: true }
      );

      // Bind Popup
      marker.bindPopup(
        `<div class="p-2 font-sans text-xs">
          <strong class="text-sm font-bold text-brand-dark block mb-1">${c.name}</strong>
          <div class="text-slate-600 mb-1">${indicatorName} (${year}):</div>
          <div class="text-sm font-bold text-brand-primary mb-2">${valText} ${unit}</div>
          <button id="drawer-btn-${c.name.replace(/\s+/g, '-')}" class="w-full px-2.5 py-1 bg-brand-primary text-white rounded font-bold text-[11px]">
            Buka Detail Provinsi
          </button>
        </div>`
      );

      marker.on("click", () => {
        onSelectProvince(c.name);
      });

      marker.on("popupopen", () => {
        const btn = document.getElementById(`drawer-btn-${c.name.replace(/\s+/g, '-')}`);
        if (btn) {
          btn.onclick = () => onSelectProvince(c.name);
        }
      });

      marker.addTo(layerGroup);
    });
  }, [centroids, indicatorId, year, currentRecords, minVal, maxVal, selectedProvince, indicatorName, unit, onSelectProvince]);

  return (
    <div className="relative w-full h-full min-h-[480px] rounded-xl overflow-hidden border border-brand-border shadow-xs">
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Map Layer Controls - top-left below zoom, z-index lower than drawer */}
      <div className="absolute top-24 left-3 z-[300] bg-white/95 backdrop-blur-md p-1.5 rounded-lg border border-brand-border shadow-md flex flex-col gap-1 text-xs">
        <button
          onClick={() => setTileProvider("osm")}
          className={`px-2.5 py-1 rounded font-semibold transition-colors ${
            tileProvider === "osm" ? "bg-brand-primary text-white" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Peta
        </button>
        <button
          onClick={() => setTileProvider("satellite")}
          className={`px-2.5 py-1 rounded font-semibold transition-colors ${
            tileProvider === "satellite" ? "bg-brand-primary text-white" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Satelit
        </button>
      </div>

      {/* Dynamic Legend */}
      <div className="absolute bottom-4 left-4 z-[400] bg-white/95 backdrop-blur-md p-3 rounded-xl border border-brand-border shadow-lg max-w-[260px] text-xs">
        <div className="font-bold text-brand-dark mb-1 text-[11px] truncate">{indicatorName}</div>
        <div className="text-[10px] text-brand-text-secondary mb-2">Satuan: {unit} ({year})</div>

        <div className="flex items-center gap-1 mb-1">
          <div className="h-3 flex-1 rounded-sm bg-gradient-to-r from-[#D3E8DF] via-[#6FA58A] to-[#163A32]" />
        </div>
        <div className="flex justify-between text-[10px] font-mono text-slate-600">
          <span>{indicatorId.startsWith("6") ? formatCurrency(minVal) : formatNumber(minVal)}</span>
          <span>{indicatorId.startsWith("6") ? formatCurrency(maxVal) : formatNumber(maxVal)}</span>
        </div>
      </div>
    </div>
  );
}
