# 鬼巷 · Gang Terlarang

Game horor first-person berbasis browser (Three.js, tanpa build step). Kamu menjelajahi gang terlarang,
menyetir lewat jalan gunung, singgah di pom bensin, lalu bertahan semalam di rumah Nenek.

**Hantu perangkak** muncul di kejaran jalan desa (Bab 3): hantu perempuan berkimono putih dengan rambut
hitam lurus dan satu mata tertutup poni. Dia berdiri dulu di tengah jalan, lalu jatuh ke empat tangan-kaki
dan merangkak mengejar kamu. Suaranya 3D: klik-klik ala *Clicker* (The Last of Us), tawa serak, dan
tamparan tangan di aspal.

## Cara main

| Tombol | Fungsi |
|---|---|
| W A S D / panah | Jalan / menyetir |
| Mouse (klik layar dulu) | Melihat sekeliling |
| Shift | Lari |
| E | Ambil / interaksi |
| F | Senter |
| R | Ganti radio di mobil |

Pakai headphone. Suara hantu bersifat 3D, jadi kamu bisa mendengar arahnya sebelum melihatnya.

## Menjalankan di komputer

Buka `index.html` di browser (Chrome / Edge / Firefox). Butuh internet karena memuat Three.js, Tailwind,
dan Google Fonts dari CDN.

Kalau mau lewat server lokal:

```bash
python3 -m http.server 8000
# buka http://localhost:8000
```

## Deploy ke GitHub Pages

1. Buat repo baru di GitHub, lalu upload **semua isi folder ini** (`index.html`, `src/`, `.nojekyll`, dan seterusnya).
2. Buka **Settings → Pages**.
3. Di **Build and deployment**, pilih **Deploy from a branch**, branch `main`, folder `/ (root)`, lalu **Save**.
4. Tunggu 1-2 menit. Game bisa dimainkan di `https://USERNAME.github.io/NAMA-REPO/`.

## Struktur

```
index.html        game utama (dunia, bab 1-4, musik, UI)
src/crawler.js    hantu perangkak: model, animasi, suara, dan logika kejaran
```

Tidak ada file gambar: wajah, kimono, dan rambut dibuat lewat kode (tekstur kanvas + geometri Three.js).

## Mengubah hantu perangkak

Semua ada di `src/crawler.js`:

- `ghostFaceTex()`: lukisan wajah (mata, alis, bibir, jejak darah). Wajah dilukis di tekstur bola kepala; bagian depan ada di tengah kanvas.
- `kimonoTex()`: kain kimono (lipatan, noda, robekan).
- `makeCrawler()`: badan, kerah, obi + pita, rambut, poni penutup mata, ikat kepala, lengan baju, kaki, dan rok compang-camping.
- `animCrawler()`: pose berdiri, jatuh, dan merangkak.
- `chase()`: lama berdiri sebelum jatuh (`u.mt>3`, dalam detik) dan logika mengejar.
- `clicks()`, `laugh()`, `slap()`: suara klik, tawa, dan tamparan tangan.
- Kecepatan kejar diatur di `CFG.hantuLari` di `index.html` (default 3.3; jalan 2.3, lari 4).

Ingin mata yang tertutup poni pindah sisi? Ubah `phiStart` pada `flap` dan posisi mata di `ghostFaceTex()`.
Ingin pita atau rambut berbeda? Ubah bagian `obi`/`hair` di `makeCrawler()`.

## Lisensi

Belum ada file lisensi; pilih sendiri lisensi yang kamu mau.
