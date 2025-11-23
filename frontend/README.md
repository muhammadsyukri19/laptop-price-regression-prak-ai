# Laptop Price Predictor - Frontend

Frontend aplikasi prediksi harga laptop menggunakan Next.js 15 dan Tailwind CSS.

## 🚀 Tech Stack

- **Next.js 15** - React framework dengan App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Hooks** - State management (useState, useEffect, useCallback, useMemo)

## 📦 Installation

```bash
npm install
```

## ⚙️ Configuration

Buat file `.env.local` di root folder:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_EUR_TO_IDR=17000
```

## 🏃 Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
src/
├── app/
│   ├── laptop-compare/     # Halaman perbandingan laptop
│   │   └── page.tsx
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Homepage
│   └── globals.css         # Global styles
```

## ✨ Features

### 1. **Homepage** (`/`)

- Landing page dengan informasi proyek
- Fitur highlights
- Link ke halaman compare

### 2. **Laptop Compare** (`/laptop-compare`)

- Form dropdown dengan data dari backend API
- Real-time prediction dengan dual compare
- Loading states & error handling
- Responsive design
- Price comparison highlight

## 🔧 Optimization Features

### Performance

- ✅ `useMemo` untuk optimize unique options
- ✅ `useCallback` untuk prevent unnecessary re-renders
- ✅ Request timeout (10s untuk options, 15s untuk predict)
- ✅ Retry mechanism dengan exponential backoff

### User Experience

- ✅ Loading spinner dengan animasi
- ✅ Disabled state saat loading
- ✅ Error boundary dengan recovery option
- ✅ Form validation sebelum submit
- ✅ Price difference calculator
- ✅ Responsive mobile-first design

## 🔌 API Integration

Frontend berkomunikasi dengan FastAPI backend:

### GET `/options`

Mendapatkan semua pilihan dropdown dari dataset

### POST `/predict`

Mengirim spesifikasi laptop dan menerima prediksi harga

## 🚀 Build for Production

```bash
npm run build
npm start
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## Deploy on Vercel

Deploy menggunakan [Vercel Platform](https://vercel.com/new)
