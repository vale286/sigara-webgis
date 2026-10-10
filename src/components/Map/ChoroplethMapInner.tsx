"use client";

import React, { useEffect, useState, useRef } from "react";
import L from "leaflet";
import { JknRecord } from "@/lib/types";
import { getChoroplethColor, formatNumber, formatCurrency } from "@/lib/utils";

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
  const geojsonLayerRef = useRef<L.GeoJSON | null>(null);

  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const [tileProvider, setTileProvider] = useState<"light" | "streets" | "satellite">("light");

  // Fetch 34 province GeoJSON
  useEffect(() => {
    fetch("/data/indonesia_provinces_34.geojson")
      .then((res) => res.json())
      .then((data) => setGeoJsonData(data))
      .catch((err) => console.error("GeoJSON error:", err));
  }, []);

  // Filter current indicator + year
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

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Handle Tile Layers
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Remove existing tile layers
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    let tileUrl = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
    let attr = '&copy; <a href="https://carto.com/">CARTO</a>';

    if (tileProvider === "streets") {
      tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
      attr = '&copy; OpenStreetMap contributors';
    } else if (tileProvider === "satellite") {
      tileUrl = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
      attr = 'Esri, Maxar, Earthstar Geographics';
    }

    L.tileLayer(tileUrl, { attribution: attr, maxZoom: 18 }).addTo(map);
  }, [tileProvider]);

  // Render / Update Choropleth GeoJSON Layer
  useEffect(() => {
    if (!mapInstanceRef.current || !geoJsonData) return;
    const map = mapInstanceRef.current;

    if (geojsonLayerRef.current) {
      map.removeLayer(geojsonLayerRef.current);
    }

    const valueMap = new Map<string, number | null>();
    currentRecords.forEach((r) => {
      valueMap.set(r.province.toLowerCase(), r.value);
    });

    const isCost = indicatorId.startsWith("6");

    const geoJsonLayer = L.geoJSON(geoJsonData, {
      style: (feature) => {
        const provName = feature?.properties?.province || "";
        const val = valueMap.get(provName.toLowerCase()) ?? null;
        const color = getChoroplethColor(val, minVal, maxVal);
        const isSelected = selectedProvince?.toLowerCase() === provName.toLowerCase();

        return {
          fillColor: color,
          weight: isSelected ? 3 : 1,
          opacity: 1,
          color: isSelected ? "#1FA7C9" : "#ffffff",
          fillOpacity: val === null ? 0.2 : 0.75,
        };
      },
      onEachFeature: (feature, layer) => {
        const provName = feature?.properties?.province || "";
        const val = valueMap.get(provName.toLowerCase()) ?? null;

        const valText = isCost
          ? formatCurrency(val)
          : formatNumber(val, indicatorId.startsWith("3") && !indicatorId.endsWith("2") ? 2 : 0);

        layer.bindTooltip(
          `<div class="p-1 font-sans">
            <strong class="text-brand-dark block text-xs font-bold">${provName}</strong>
            <span class="text-xs text-slate-600">${indicatorName}:</span>
            <span class="text-xs font-bold text-brand-primary block">${valText} ${unit}</span>
            <span class="text-[10px] text-slate-400 block mt-0.5">Tahun ${year} | 34 Provinsi</span>
          </div>`,
          { sticky: true }
        );

        layer.on({
          click: () => {
            onSelectProvince(provName);
          },
          mouseover: (e) => {
            const l = e.target;
            l.setStyle({ fillOpacity: 0.9, weight: 2 });
          },
          mouseout: (e) => {
            const l = e.target;
            geoJsonLayer.resetStyle(l);
          },
        });
      },
    }).addTo(map);

    geojsonLayerRef.current = geoJsonLayer;
  }, [geoJsonData, indicatorId, year, currentRecords, minVal, maxVal, selectedProvince]);

  return (
    <div className="relative w-full h-full min-h-[480px] rounded-xl overflow-hidden border border-brand-border shadow-xs">
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Map Controls Floating Overlay */}
      <div className="absolute top-3 right-3 z-[400] bg-white/95 backdrop-blur-md p-1.5 rounded-lg border border-brand-border shadow-md flex items-center gap-1 text-xs">
        <button
          onClick={() => setTileProvider("light")}
          className={`px-2 py-1 rounded font-medium ${
            tileProvider === "light" ? "bg-brand-primary text-white" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Light
        </button>
        <button
          onClick={() => setTileProvider("streets")}
          className={`px-2 py-1 rounded font-medium ${
            tileProvider === "streets" ? "bg-brand-primary text-white" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Street
        </button>
        <button
          onClick={() => setTileProvider("satellite")}
          className={`px-2 py-1 rounded font-medium ${
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
