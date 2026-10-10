import { JknRecord, DiagnosisRecord } from "./types";
import { DATA_CATALOG } from "./dataCatalog";

let cachedRecords: JknRecord[] | null = null;
let cachedDiagnosis: DiagnosisRecord[] | null = null;

export async function fetchJknData(): Promise<JknRecord[]> {
  if (cachedRecords) return cachedRecords;
  try {
    const res = await fetch("/data/jkn_normalized_data.json");
    if (!res.ok) throw new Error("Failed to fetch normalized dataset");
    const data: JknRecord[] = await res.json();

    // Map catalog indicator types for aggregate computation
    const catalogMap = new Map<string, string>();
    DATA_CATALOG.forEach((cat) => {
      catalogMap.set(cat.id, cat.type);
    });

    // Group non-national provincial records by indicator_id and year
    const provGroup = new Map<string, number[]>();
    data.forEach((r) => {
      if (!r.is_national && r.province !== "Nasional" && typeof r.value === "number" && r.value !== null) {
        const key = `${r.indicator_id}_${r.year}`;
        if (!provGroup.has(key)) provGroup.set(key, []);
        provGroup.get(key)!.push(r.value);
      }
    });

    // Populate or update national records with computed sum (for count) or average (for ratio/rate/cost)
    data.forEach((r) => {
      if (r.is_national || r.province === "Nasional") {
        const key = `${r.indicator_id}_${r.year}`;
        const vals = provGroup.get(key) || [];
        if (vals.length > 0) {
          const type = catalogMap.get(r.indicator_id) || "count";
          if (type === "count") {
            r.value = vals.reduce((a, b) => a + b, 0);
          } else {
            r.value = vals.reduce((a, b) => a + b, 0) / vals.length;
          }
        }
      }
    });

    // Ensure national records exist for all indicator_id and year combinations
    const existingNatKeys = new Set(
      data.filter((r) => r.is_national || r.province === "Nasional").map((r) => `${r.indicator_id}_${r.year}`)
    );

    provGroup.forEach((vals, key) => {
      if (!existingNatKeys.has(key) && vals.length > 0) {
        const [indicator_id, yearStr] = key.split("_");
        const year = parseInt(yearStr, 10);
        const type = catalogMap.get(indicator_id) || "count";
        const meta = DATA_CATALOG.find((m) => m.id === indicator_id);
        const val =
          type === "count"
            ? vals.reduce((a, b) => a + b, 0)
            : vals.reduce((a, b) => a + b, 0) / vals.length;

        data.push({
          indicator_id,
          indicator_name: meta?.name || indicator_id,
          unit: meta?.unit || "",
          category: meta?.category || "",
          province: "Nasional",
          year,
          value: val,
          is_national: true,
          source_file: meta?.filename || "",
        });
      }
    });

    cachedRecords = data;
    return data;
  } catch (err) {
    console.error("Error loading JKN dataset:", err);
    return [];
  }
}

export async function fetchDiagnosisData(): Promise<DiagnosisRecord[]> {
  if (cachedDiagnosis) return cachedDiagnosis;
  try {
    const res = await fetch("/data/diagnosis_2018.json");
    if (!res.ok) throw new Error("Failed to fetch diagnosis dataset");
    const data: DiagnosisRecord[] = await res.json();
    cachedDiagnosis = data;
    return data;
  } catch (err) {
    console.error("Error loading diagnosis dataset:", err);
    return [];
  }
}

export function getRecordsByIndicator(
  records: JknRecord[],
  indicatorId: string,
  year?: number
): JknRecord[] {
  return records.filter(
    (r) =>
      r.indicator_id === indicatorId &&
      !r.is_national &&
      r.province !== "Nasional" &&
      (year === undefined || r.year === year)
  );
}

export function getNationalRecord(
  records: JknRecord[],
  indicatorId: string,
  year: number
): JknRecord | undefined {
  return records.find(
    (r) => r.indicator_id === indicatorId && (r.is_national || r.province === "Nasional") && r.year === year
  );
}

export function getProvinceTimeSeries(
  records: JknRecord[],
  province: string,
  indicatorId: string
): JknRecord[] {
  return records
    .filter((r) => r.province === province && r.indicator_id === indicatorId)
    .sort((a, b) => a.year - b.year);
}

