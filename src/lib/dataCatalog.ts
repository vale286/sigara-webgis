import { IndicatorMeta } from "./types";

export const DATA_CATALOG: IndicatorMeta[] = [
  {
    id: "1.3",
    filename: "Tabel 1.3-Pertumbuhan Peserta JKN per Provinsi.xlsx",
    name: "Peserta JKN",
    unit: "peserta",
    category: "peserta",
    type: "count",
    description: "Jumlah total peserta JKN terdaftar per provinsi (2014-2018)"
  },
  {
    id: "3.1",
    filename: "Tabel 3.1-Rasio Puskesmas.xlsx",
    name: "Rasio Puskesmas",
    unit: "puskesmas / 100.000 peserta",
    category: "faskes",
    type: "ratio",
    description: "Rasio Puskesmas bekerja sama per 100.000 peserta JKN"
  },
  {
    id: "3.2",
    filename: "Tabel 3.2-Puskesmas yang Bekerjasama.xlsx",
    name: "Jumlah Puskesmas",
    unit: "puskesmas",
    category: "faskes",
    type: "count",
    description: "Jumlah Puskesmas bekerja sama dengan BPJS Kesehatan"
  },
  {
    id: "3.3",
    filename: "Tabel 3.3-Rasio Dokter Praktek Perorangan.xlsx",
    name: "Rasio Dokter Praktik Perorangan",
    unit: "dokter / 100.000 peserta",
    category: "faskes",
    type: "ratio",
    description: "Rasio Dokter Praktik Perorangan bekerja sama per 100.000 peserta"
  },
  {
    id: "3.4",
    filename: "Tabel 3.4-Dokter Praktek Perorangan yang Bekerjasama.xlsx",
    name: "Jumlah Dokter Praktik Perorangan",
    unit: "dokter",
    category: "faskes",
    type: "count",
    description: "Jumlah Dokter Praktik Perorangan bekerja sama dengan BPJS Kesehatan"
  },
  {
    id: "3.5",
    filename: "Tabel 3.5-Rasio Klinik Pratama.xlsx",
    name: "Rasio Klinik Pratama",
    unit: "klinik / 100.000 peserta",
    category: "faskes",
    type: "ratio",
    description: "Rasio Klinik Pratama (termasuk TNI/POLRI) per 100.000 peserta"
  },
  {
    id: "3.6",
    filename: "Tabel 3.6-Klinik Pratama yang Bekerjasama.xlsx",
    name: "Jumlah Klinik Pratama",
    unit: "klinik",
    category: "faskes",
    type: "count",
    description: "Jumlah Klinik Pratama (termasuk TNI/POLRI) bekerja sama"
  },
  {
    id: "3.7",
    filename: "Tabel 3.7-Rasio FKRTL.xlsx",
    name: "Rasio FKRTL",
    unit: "FKRTL / 100.000 peserta",
    category: "faskes",
    type: "ratio",
    description: "Rasio FKRTL (Rumah Sakit & Klinik Utama) per 100.000 peserta"
  },
  {
    id: "3.8",
    filename: "Tabel 3.8-FKRTL yang Bekerjasama.xlsx",
    name: "Jumlah FKRTL",
    unit: "FKRTL",
    category: "faskes",
    type: "count",
    description: "Jumlah FKRTL (Rumah Sakit & Klinik Utama) bekerja sama"
  },
  {
    id: "4.1.3",
    filename: "Tabel 4.1.3-Angka Akses Pelayanan RJTP berdasarkan Provinsi.xlsx",
    name: "Angka Akses Pelayanan RJTP",
    unit: "orang / 10.000 peserta",
    category: "pelayanan",
    type: "rate",
    description: "Peserta unik yang mengakses pelayanan RJTP per 10.000 peserta"
  },
  {
    id: "4.2.3",
    filename: "Tabel 4.2.3-Angka Akses Pelayanan RITP berdasarkan Provinsi.xlsx",
    name: "Angka Akses Pelayanan RITP",
    unit: "orang / 10.000 peserta",
    category: "pelayanan",
    type: "rate",
    description: "Peserta unik yang mengakses pelayanan RITP per 10.000 peserta"
  },
  {
    id: "4.3.3",
    filename: "Tabel 4.3.3-Angka Akses Pelayanan RJTL  berdasarkan Provinsi.xlsx",
    name: "Angka Akses Pelayanan RJTL",
    unit: "orang / 10.000 peserta",
    category: "pelayanan",
    type: "rate",
    description: "Peserta unik yang mengakses pelayanan RJTL per 10.000 peserta"
  },
  {
    id: "4.4.3",
    filename: "Tabel 4.4.3-Angka Akses Pelayanan RITL berdasarkan Provinsi.xlsx",
    name: "Angka Akses Pelayanan RITL",
    unit: "orang / 10.000 peserta",
    category: "pelayanan",
    type: "rate",
    description: "Peserta unik yang mengakses pelayanan RITL per 10.000 peserta"
  },
  {
    id: "5.1.3",
    filename: "Tabel 5.1.3 Angka Kunjungan Pelayanan RJTP berdasarkan Provinsi.xlsx",
    name: "Angka Kunjungan Pelayanan RJTP",
    unit: "kunjungan / 10.000 peserta",
    category: "pelayanan",
    type: "rate",
    description: "Jumlah kunjungan pelayanan RJTP per 10.000 peserta"
  },
  {
    id: "5.3.3",
    filename: "Tabel 5.3.3 Angka Kunjungan  Pelayanan RJTL berdasarkan Provinsi .xlsx",
    name: "Angka Kunjungan Pelayanan RJTL",
    unit: "kunjungan / 10.000 peserta",
    category: "pelayanan",
    type: "rate",
    description: "Jumlah kunjungan pelayanan RJTL per 10.000 peserta"
  },
  {
    id: "5.4.5",
    filename: "Tabel 5.4.5 Angka Admisi  Pelayanan RITL berdasarkan Provinsi.xlsx",
    name: "Angka Admisi Pelayanan RITL",
    unit: "admisi / 10.000 peserta",
    category: "pelayanan",
    type: "rate",
    description: "Jumlah admisi pelayanan RITL per 10.000 peserta"
  },
  {
    id: "6.2.3",
    filename: "Tabel 6.2.3 Distribusi Rerata Biaya Satuan Klaim  per Kunjungan Pelayanan RJTL berdasarkan Provinsi .xlsx",
    name: "Rerata Biaya Klaim RJTL",
    unit: "Rp / kunjungan",
    category: "biaya",
    type: "cost",
    description: "Rerata biaya satuan klaim per kunjungan RJTL dalam Rupiah"
  },
  {
    id: "6.3.3",
    filename: "Tabel 6.3.3 Distribusi Rerata Biaya Satuan Klaim per Admisi Pelayanan RITL berdasarkan Provinsi.xlsx",
    name: "Rerata Biaya Klaim RITL",
    unit: "Rp / admisi",
    category: "biaya",
    type: "cost",
    description: "Rerata biaya satuan klaim per admisi RITL dalam Rupiah"
  },
  {
    id: "8.1.19",
    filename: "Tabel 8.1.19 100 Penyakit Terbanyak pada RJTL Tahun 2018.xlsx",
    name: "Top 100 Diagnosis RJTL 2018",
    unit: "kunjungan / peserta",
    category: "pelayanan",
    type: "count",
    description: "100 Diagnosis Terbanyak pada Pelayanan RJTL Tahun 2018 (Nasional)"
  }
];

export const PROVINCES_LIST = [
  "Aceh", "Sumatera Utara", "Sumatera Barat", "Riau", "Jambi", 
  "Sumatera Selatan", "Bengkulu", "Lampung", "Kepulauan Bangka Belitung", "Kepulauan Riau", 
  "DKI Jakarta", "Jawa Barat", "Jawa Tengah", "DI Yogyakarta", "Jawa Timur", 
  "Banten", "Bali", "Nusa Tenggara Barat", "Nusa Tenggara Timur", "Kalimantan Barat", 
  "Kalimantan Tengah", "Kalimantan Selatan", "Kalimantan Timur", "Kalimantan Utara", "Sulawesi Utara", 
  "Sulawesi Tengah", "Sulawesi Selatan", "Sulawesi Tenggara", "Gorontalo", "Sulawesi Barat", 
  "Maluku", "Maluku Utara", "Papua Barat", "Papua"
];
