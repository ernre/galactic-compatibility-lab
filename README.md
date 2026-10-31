# PADMÉ & ANAKIN — Galactic Compatibility Lab

Mobil öncelikli, iki kişinin cevaplarını ayrı ayrı verdiği eğlenceli galaktik uyum testi.

## Çalıştırma

```powershell
npm install
npm run dev
```

Ardından terminalde verilen yerel adresi açın (genellikle `http://localhost:5173`).

> Bu proje klasörünün adında `&` bulunduğu için Windows'ta npm komutları için PowerShell kullanımı `.npmrc` ile ayarlandı.

## Production build

```powershell
npm run build
npm run preview
```

Derlenen dosyalar `dist/` klasöründe oluşur.

## GitHub Pages

Vite base path değerini yayınlayacağınız repository adına göre komut sırasında belirleyin:

```powershell
$env:VITE_BASE_PATH = '/repository-adi/'
npm run build
```

Repository bir kullanıcı/organizasyon sayfasıysa varsayılan `/` path'i bırakılabilir.

## Yapı

- `src/questions.js`: 25 soru ve karakter verileri
- `src/App.jsx`: iki aşamalı cevaplama, gizlilik akışı, mizahi analiz ve paylaşım
- `src/styles.css`: responsive tasarım, yıldız alanı ve holografik animasyonlar

Analiz sonuçları tamamen eğlence amaçlıdır; gerçek uyum veya ilişki başarısı iddiası taşımaz.
