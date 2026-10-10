# SIGARA WebGIS — Sistem Informasi Geografis Agentik untuk Rujukan Akuntabel

Aplikasi WebGIS modern berbasis **Next.js 15, TypeScript, Tailwind CSS, Leaflet.js, Recharts, dan Lucide Icons** yang mengintegrasikan secara utuh **seluruh 19 workbook Excel JKN resmi BPJS Kesehatan (2014–2018)** untuk Healthkathon 2026 (Kategori Efisiensi Risiko pada Fasilitas Kesehatan).

---

## 🌟 Fitur Utama & Modul

Aplikasi SIGARA WebGIS terdiri dari **8 Modul Utama**:

1. **Ringkasan JKN (Dashboard Utama):**
   - KPI Nasional & Wilayah (Peserta JKN, Puskesmas, Dokter Praktik, Klinik Pratama, FKRTL, Angka Akses, Kunjungan, Admisi, Rerata Biaya Klaim).
   - Grafis tren pertumbuhan peserta 2014–2018 dan komposisi faskes.
   - Penandaan data historis yang transparan dan non-fraud disclaimer.

2. **Peta Sebaran JKN (Choropleth WebGIS):**
   - Peta tematik choropleth 34 provinsi historis dengan legenda dinamis.
   - Pilihan 18 indikator seri waktu (2014–2018).
   - Interaksi tooltip hover & *Province Inspector Drawer* saat provinsi diklik.
   - Kontrol basemap (Light, Street, Satelit), Zoom, Fit-to-Data, & Ekspor Data CSV.

3. **Ketersediaan Faskes (Puskesmas, Dokter, Klinik, FKRTL):**
   - Konsumsi 8 tabel fasilitas (3.1–3.8).
   - Toggle antara **Jumlah Absolut (Count)** dan **Rasio per 100.000 Peserta**.
   - Grafik Top 10 provinsi, tren 5 tahun NTT vs Nasional, serta tabel 34 provinsi yang dapat dicari dan diurutkan.

4. **Akses & Pemanfaatan Layanan (RJTP, RITP, RJTL, RITL):**
   - Tab khusus *Angka Akses* (orang/10.000), *Angka Kunjungan* (kunjungan/10.000), dan *Angka Admisi* (admisi/10.000).
   - Panel definisi metrik pelayanan kesehatan BPJS Kesehatan.

5. **Analisis Biaya Klaim (RJTL & RITL):**
   - Rerata biaya satuan klaim per kunjungan RJTL (6.2.3) dan per admisi RITL (6.3.3) dalam Rupiah.
   - Peringkat provinsi dengan klaim tertinggi dan analisis tren 5 tahun.

6. **Profil Diagnosis RJTL 2018 (Top 100 Diseases):**
   - 100 entri diagnosis tingkat nasional tahun 2018 (Tabel 8.1.19).
   - Grafik Top 10 / 20 diagnosis terbanyak.
   - Pencarian kode ICD-10 & nama diagnosis, paginasi, serta preservasi entri ICD duplikat.

7. **GeoAI Pemeriksaan Rujukan (Demo Simulator 2026):**
   - Studi kasus proposal **SIM-R01516** (Kota Kupang: Puskesmas Pasir Panjang → RS Siloam Kupang vs RSUD Johannes).
   - Simulator triase rujukan interaktif berbasis 4 status: `Sesuai Model`, `Alasan Terdokumentasi`, `Perlu Pemeriksaan`, `Data Belum Cukup`.

8. **Metodologi, Data Catalog & Asisten SIGARA:**
   - Catalog 19 dataset terverifikasi.
   - Asisten Data SIGARA (Mode Deterministik) dengan penyertaan *Data Provenance Badge*.
   - Cetak biru arsitektur 6-Agent AI.

---

## 📂 Struktur Dataset (19 File XLSX)

Seluruh 19 file Excel berada di folder `dataset/`:

1. `Tabel 1.3-Pertumbuhan Peserta JKN per Provinsi.xlsx`
2. `Tabel 3.1-Rasio Puskesmas.xlsx`
3. `Tabel 3.2-Puskesmas yang Bekerjasama.xlsx`
4. `Tabel 3.3-Rasio Dokter Praktek Perorangan.xlsx`
5. `Tabel 3.4-Dokter Praktek Perorangan yang Bekerjasama.xlsx`
6. `Tabel 3.5-Rasio Klinik Pratama.xlsx`
7. `Tabel 3.6-Klinik Pratama yang Bekerjasama.xlsx`
8. `Tabel 3.7-Rasio FKRTL.xlsx`
9. `Tabel 3.8-FKRTL yang Bekerjasama.xlsx`
10. `Tabel 4.1.3-Angka Akses Pelayanan RJTP berdasarkan Provinsi.xlsx`
11. `Tabel 4.2.3-Angka Akses Pelayanan RITP berdasarkan Provinsi.xlsx`
12. `Tabel 4.3.3-Angka Akses Pelayanan RJTL  berdasarkan Provinsi.xlsx`
13. `Tabel 4.4.3-Angka Akses Pelayanan RITL berdasarkan Provinsi.xlsx`
14. `Tabel 5.1.3 Angka Kunjungan Pelayanan RJTP berdasarkan Provinsi.xlsx`
15. `Tabel 5.3.3 Angka Kunjungan  Pelayanan RJTL berdasarkan Provinsi .xlsx`
16. `Tabel 5.4.5 Angka Admisi  Pelayanan RITL berdasarkan Provinsi.xlsx`
17. `Tabel 6.2.3 Distribusi Rerata Biaya Satuan Klaim  per Kunjungan Pelayanan RJTL berdasarkan Provinsi .xlsx`
18. `Tabel 6.3.3 Distribusi Rerata Biaya Satuan Klaim per Admisi Pelayanan RITL berdasarkan Provinsi.xlsx`
19. `Tabel 8.1.19 100 Penyakit Terbanyak pada RJTL Tahun 2018.xlsx`

---

## 🚀 Cara Menjalankan Aplikasi

### 1. Menjalankan Server Pengembangan (Dev)
```bash
npm run dev
```
Buka browser di `http://localhost:3000`.

### 2. Build untuk Produksi
```bash
npm run build
npm run start
```
