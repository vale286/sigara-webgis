export interface JknRecord {
  indicator_id: string;
  indicator_name: string;
  unit: string;
  category: "peserta" | "faskes" | "pelayanan" | "biaya";
  province: string;
  year: number;
  value: number | null;
  is_national: boolean;
  source_file: string;
}

export interface DiagnosisRecord {
  rank: number;
  icd_code: string;
  diagnosis_name: string;
  visits: number | null;
  participants: number | null;
  is_total?: boolean;
}

export interface IndicatorMeta {
  id: string;
  filename: string;
  name: string;
  unit: string;
  category: "peserta" | "faskes" | "pelayanan" | "biaya";
  type: "count" | "ratio" | "rate" | "cost";
  description: string;
}

export type ModuleId =
  | "summary"
  | "map"
  | "facilities"
  | "utilization"
  | "claims"
  | "diagnosis"
  | "geoai"
  | "methodology";

export interface ReferralCase {
  caseId: string;
  patientId: string;
  referralDate: string;
  sourceFktp: string;
  sourceFktpCoords: [number, number];
  chosenFkrtl: string;
  chosenFkrtlCoords: [number, number];
  serviceType: string;
  estimatedTravelTimeMin: number;
  nearestAlternativeFkrtl: string;
  nearestAlternativeTravelTimeMin: number;
  timeDifferenceMin: number;
  timeRatio: number;
  hasDocumentedException: boolean;
  exceptionReason?: string;
  triageStatus: "Sesuai Model" | "Alasan Terdokumentasi" | "Perlu Pemeriksaan" | "Data Belum Cukup";
  notes: string;
}
