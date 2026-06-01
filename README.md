# 🕋 JalanPulang - Menemukan Kembali Arah Spiritual Anda

**JalanPulang** adalah aplikasi produktivitas dan pendamping ibadah Islami modern yang didesain secara elegan, minimalis, dan sepenuhnya **bebas dari iklan**. Aplikasi ini dirancang untuk membantu umat Muslim meningkatkan keistiqamahan ibadah harian melalui antarmuka yang tenang dan bebas gangguan.

Proyek ini terdiri dari dua bagian utama:
1. 📱 **Mobile Application**: Aplikasi mobile universal (Android & iOS) berbasis **React Native Expo** dengan arsitektur modern (NativeWind, Zustand, Expo Router).
2. 💻 **Landing Page**: Halaman web pengenalan produk di direktori `landing-page/` yang bersih, modern, responsif dengan styling **Tailwind CSS** dan interaksi mikro interaktif berbasis **GSAP & ScrollTrigger**.

---

## ✨ Fitur Unggulan

### 1. 🕒 Jadwal Shalat Akurat & Notifikasi Adzan
*   Menghitung waktu shalat presisi berdasarkan koordinat lokasi GPS secara dinamis.
*   *Countdown* sisa waktu menuju shalat berikutnya secara real-time.
*   Notifikasi adzan yang merdu dengan opsi audio kustom.

### 2. 📖 Al-Quran Digital & Riwayat Tilawah
*   Daftar surah interaktif dengan font khat Arab Madinah yang tajam dan nyaman dibaca.
*   Terjemahan standar Kementerian Agama RI.
*   Fitur penanda otomatis (*last read*) untuk melanjutkan tilawah dengan mudah.

### 3. 🎯 Pelacak Aktivitas Ibadah Harian
*   *Checklist* interaktif harian untuk membangun kebiasaan shalih (seperti Shalat Rawatib, Dzikir Pagi/Petang, Sedekah Subuh).
*   Visualisasi persentase pencapaian target harian dengan progress bar yang dinamis.

### 4. 🧭 Kompas Kiblat Presisi
*   Pencari arah Ka'bah secara akurat memanfaatkan sensor magnetik dan akselerometer perangkat (mendukung penggunaan *offline*).

### 5. 💝 Donasi & Infaq QRIS
*   Dashboard kemudahan berinfaq secara aman dengan scanner QRIS instan bagi program kemanusiaan.

---

## 📁 Struktur Direktori Utama

```bash
jalanpulang-app/
├── app/                       # File utama Expo Router (Screen & Tab Layout)
│   ├── (tabs)/                # Halaman utama aplikasi (Home, Prayer, Quran, Settings)
│   ├── doa/                   # Fitur doa dan dzikir harian
│   ├── surah/                 # Layar detail bacaan Quran per Surah
│   ├── qibla.tsx              # Layar kompas arah Kiblat
│   ├── donation.tsx           # Fitur QRIS donasi kemanusiaan
│   └── global.css             # Konfigurasi Tailwind aplikasi mobile
├── assets/                    # Aset gambar, ikon, logo, dan suara Adzan
├── components/                # Komponen UI reusable (Button, Card, Text)
├── hooks/                     # Custom react hooks (Pelacak waktu shalat, lokasi)
├── landing-page/              # Landing Page Web (Tailwind & GSAP)
│   └── index.html             # Single-file HTML landing page dengan animasi premium
├── store/                     # State management menggunakan Zustand
├── jalanpulang.apk            # Berkas installer offline siap pasang untuk Android
├── tailwind.config.js         # Konfigurasi tema warna khas JalanPulang
├── app.json                   # Konfigurasi Expo & perizinan (Android permissions)
└── package.json               # Dependensi & skrip development
```

---

## 🚀 Cara Menjalankan Proyek

### 1. Aplikasi Mobile (React Native Expo)

Pastikan Anda memiliki **Node.js** terinstal di komputer Anda.

1.  **Instal Dependensi**:
    ```bash
    npm install
    ```

2.  **Jalankan Expo Development Server**:
    ```bash
    npm run android    # untuk Android (memerlukan emulator atau perangkat fisik terhubung)
    # atau
    npx expo start     # untuk memindai kode QR melalui aplikasi Expo Go
    ```

3.  **Memasang Aplikasi Secara Langsung (Android)**:
    Anda dapat langsung menyalin file `jalanpulang.apk` yang berada di root direktori proyek ini ke ponsel Android Anda untuk langsung mencobanya secara instan.

### 2. Landing Page Web (Tailwind CSS & GSAP)

Halaman landing page dirancang sebagai halaman web mandiri yang sangat cepat dan teroptimasi.

*   Cukup buka berkas `landing-page/index.html` menggunakan peramban (*web browser*) favorit Anda secara langsung (klik dua kali pada file tersebut), atau gunakan ekstensi seperti **Live Server** di VS Code untuk pengalaman pengembangan instan.

---

## 🎨 Palet Warna Identitas (Theme Palette)

Tema warna JalanPulang menggunakan kombinasi warna alamiah, tenang, dan hangat:
*   **Primary Core**: `#84583f` / `#926247` (Cokelat kayu / tanah hangat yang merepresentasikan kedekatan spiritual)
*   **Gold Highlight**: `#f59e0b` (Emas penunjuk kiblat/cahaya)
*   **Background Light**: `#FDFBF7` (Krim lembut, bersih, dan menenangkan mata)
*   **Background Dark**: `#1e1815` (Varian mode gelap hangat)
*   **Ad-Free Promise**: Didistribusikan gratis sepenuhnya tanpa iklan untuk menjaga kekhusyukan beribadah.
