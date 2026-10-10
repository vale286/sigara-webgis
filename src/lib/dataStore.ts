import { JknRecord, DiagnosisRecord } from "./types";

let cachedRecords: JknRecord[] | null = null;
let cachedDiagnosis: DiagnosisRecord[] | null = null;

export async function fetchJknData(): Promise<JknRecord[]> {
  if (cachedRecords) return cachedRecords;
  try {
    const res = await fetch("/data/jkn_normalized_data.json");
    if (!res.ok) throw new Error("Failed to fetch normalized dataset");
    const data: JknRecord[] = await res.json();
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
      (year === undefined || r.year === year)
  );
}

export function getNationalRecord(
  records: JknRecord[],
  indicatorId: string,
  year: number
): JknRecord | undefined {
  return records.find(
    (r) => r.indicator_id === indicatorId && r.is_national && r.year === year
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
