# 🚀 Quick Start Guide

## Prerequisites

- Node.js 18+ installed
- Backend FastAPI running di `http://localhost:8000`

## Setup dalam 3 Langkah

### 1️⃣ Install Dependencies

```bash
cd frontend
npm install
```

### 2️⃣ Configure Environment

Buat file `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_EUR_TO_IDR=17000
```

### 3️⃣ Run Development Server

```bash
npm run dev
```

Buka browser: **http://localhost:3000** 🎉

---

## 📍 Pages

| Route             | Description                       |
| ----------------- | --------------------------------- |
| `/`               | Homepage dengan info proyek       |
| `/laptop-compare` | Compare 2 laptop & prediksi harga |

---

## 🔧 Troubleshooting

### Error: "Gagal memuat data"

✅ **Solusi:** Pastikan backend berjalan di `http://localhost:8000`

```bash
# Di folder backend
uvicorn main:app --reload
```

### Error: "Prediksi timeout"

✅ **Solusi:** Backend mungkin lambat, tunggu atau restart backend

### Port 3000 sudah dipakai

✅ **Solusi:** Gunakan port lain

```bash
PORT=3001 npm run dev
```

---

## 📱 Testing

### Test Homepage

1. Buka `http://localhost:3000`
2. Klik "🚀 Mulai Bandingkan Laptop"

### Test Compare Page

1. Pilih spesifikasi laptop 1 & 2
2. Klik "🚀 Prediksi Harga Kedua Laptop"
3. Lihat estimasi harga & selisih

---

## 🎨 Features to Try

1. **Real-time Prediction** - Ubah spesifikasi, klik predict
2. **Price Comparison** - Lihat laptop mana yang lebih murah
3. **Loading States** - Perhatikan animasi loading
4. **Error Recovery** - Matikan backend, lihat error handling
5. **Responsive Design** - Buka di mobile/tablet

---

## 🏗️ Build untuk Production

```bash
npm run build
npm start
```

---

## 📚 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State:** React Hooks (useState, useEffect, useMemo, useCallback)

---

**Happy Coding! 💻✨**
