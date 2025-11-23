# 💻 Laptop Price Predictor

Machine Learning application untuk memprediksi harga laptop menggunakan Linear Regression dengan Full-Stack Web Interface.

![Next.js](https://img.shields.io/badge/Next.js-15-black) ![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688) ![Python](https://img.shields.io/badge/Python-3.8+-blue) ![Scikit-learn](https://img.shields.io/badge/scikit--learn-1.0+-orange)

## ✨ Features

### 🤖 Machine Learning

- **Linear Regression Model** terlatih dengan 1300+ laptop dataset
- **Feature Engineering** otomatis (CPU, GPU, Memory, Screen Resolution)
- **Model Pipeline** dengan preprocessing dan transformasi
- **K-Fold Cross Validation** untuk evaluasi model
- **QQ-Plot & Residual Analysis** untuk diagnostik

### 🚀 Comparison Tool

- **Side-by-side comparison** untuk 2 laptop
- **Real-time prediction** dengan FastAPI backend
- **Interactive forms** dengan dropdown untuk semua spesifikasi
- **Price difference calculator** dalam IDR dan EUR
- **Detailed summary** cards untuk hasil prediksi

### 📊 Data Visualizations

- **6 Interactive Charts** generated real-time:
  - Price Distribution Histogram
  - Brand Price Analysis (Top 10)
  - Laptop Type Distribution (Pie Chart)
  - RAM vs Price Scatter Plot
  - Screen Size Analysis
  - OS Price Comparison
- **High-quality PNG** images (100 DPI)
- **Loading states** dan error handling
- **Responsive grid layout**

### 🎨 Modern UI/UX

- **Clean professional design** dengan Tailwind CSS
- **Responsive layout** untuk desktop & mobile
- **Loading indicators** dan error states
- **Form validation** dengan user feedback
- **Hover effects** dan smooth transitions

## 🏗️ Architecture

```
laptop-price-regression-prak-ai/
├── backend/                          # FastAPI Backend
│   ├── main.py                      # API endpoints
│   ├── lr_laptop_price_pipeline.pkl # Trained model
│   ├── laptop_price_regresi.ipynb   # ML notebook
│   └── datasets/
│       └── laptop_price.csv         # Dataset (1303 rows)
├── frontend/                         # Next.js Frontend
│   └── src/
│       └── app/
│           ├── page.tsx             # Homepage
│           ├── laptop-compare/      # Comparison tool
│           └── visualizations/      # Data viz page
├── VISUALIZATIONS.md                # Viz documentation
└── README.md                        # This file
```

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 18+
- npm/yarn/pnpm

### 1. Clone Repository

```bash
git clone https://github.com/muhammadsyukri19/laptop-price-regression-prak-ai.git
cd laptop-price-regression-prak-ai
```

### 2. Setup Backend

```bash
cd backend
pip install fastapi uvicorn joblib pandas numpy scikit-learn matplotlib seaborn scipy
python main.py
# Backend running on http://localhost:8000
```

### 3. Setup Frontend

```bash
cd frontend
npm install
npm run dev
# Frontend running on http://localhost:3000
```

### 4. Open Application

Navigate to `http://localhost:3000` in your browser

## 📡 API Endpoints

### Prediction

- `POST /predict` - Predict laptop price from specifications
- `GET /options` - Get all dropdown options for forms

### Visualizations

- `GET /visualizations/price-distribution` - Price histogram
- `GET /visualizations/brand-analysis` - Brand pricing analysis
- `GET /visualizations/type-distribution` - Type pie chart
- `GET /visualizations/ram-vs-price` - RAM correlation
- `GET /visualizations/screen-size-analysis` - Screen size insights
- `GET /visualizations/os-comparison` - OS pricing comparison

## 🛠️ Tech Stack

### Backend

- **FastAPI** - Modern Python web framework
- **Scikit-learn** - ML model training
- **Pandas & NumPy** - Data processing
- **Matplotlib & Seaborn** - Visualizations
- **Joblib** - Model persistence

### Frontend

- **Next.js 15** - React framework (App Router)
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **React Hooks** - State management

### ML Pipeline

- **Linear Regression** - Core algorithm
- **Feature Engineering** - CPU/GPU/Memory parsing
- **Standard Scaler** - Feature normalization
- **Cross Validation** - Model evaluation

## 📊 Dataset

- **Source**: Kaggle Laptop Prices Dataset
- **Size**: 1303 laptops
- **Features**: 13 columns
  - Company, Product, TypeName
  - Inches, ScreenResolution
  - CPU, RAM, Memory (Storage)
  - GPU, OpSys, Weight
  - Price_euros (target)

## 🎯 Model Performance

- **R² Score**: ~0.82-0.85 (K-Fold CV)
- **MAE**: ~150-200 EUR
- **RMSE**: ~250-300 EUR
- **Training Time**: <5 seconds

## 🔧 Configuration

### Environment Variables

Create `.env.local` in `frontend/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend Settings

- **CORS**: Enabled for all origins (change in production)
- **Port**: 8000 (default FastAPI)
- **Dataset Path**: `backend/datasets/laptop_price.csv`
- **Model Path**: `backend/lr_laptop_price_pipeline.pkl`

## 📱 Usage Examples

### Compare Laptops

1. Go to homepage → "🚀 Mulai Bandingkan Laptop"
2. Select specifications for Laptop 1 & 2
3. Click "Predict Both Laptops"
4. View predicted prices and comparison

### View Visualizations

1. Go to homepage → "📊 Lihat Visualisasi Data"
2. Scroll through 6 different charts
3. Charts update in real-time from dataset

### API Usage

```bash
# Predict price
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "Company": "Apple",
    "Product": "MacBook Pro",
    "TypeName": "Notebook",
    "Inches": 15.4,
    "ScreenResolution": "2880x1800",
    "Cpu": "Intel Core i7 2.7GHz",
    "Ram": 16,
    "Memory": "512GB SSD",
    "Gpu": "Intel Iris Plus Graphics 640",
    "OpSys": "macOS",
    "Weight": 1.83
  }'

# Get visualization
curl http://localhost:8000/visualizations/price-distribution > chart.png
```

## 🐛 Troubleshooting

### Backend won't start

- Check if port 8000 is available
- Verify all Python dependencies installed: `pip list`
- Check model file exists: `backend/lr_laptop_price_pipeline.pkl`

### Frontend shows "Failed to Load Data"

- Ensure backend is running on `http://localhost:8000`
- Check CORS settings in `backend/main.py`
- Verify API_BASE_URL in frontend

### Visualizations not loading

- Check backend has matplotlib, seaborn, scipy installed
- Verify backend terminal for errors
- Try accessing endpoint directly: `http://localhost:8000/visualizations/price-distribution`

## 📚 Documentation

- [VISUALIZATIONS.md](VISUALIZATIONS.md) - Detailed visualization docs
- [OPTIMIZATION.md](frontend/OPTIMIZATION.md) - Frontend optimizations
- [QUICKSTART.md](frontend/QUICKSTART.md) - Quick setup guide

## 🤝 Contributing

This is an academic project for AI coursework. Feel free to fork and improve!

## 📝 License

MIT License - feel free to use for educational purposes

## 👨‍💻 Author

**Muhammad Syukri** ([@muhammadsyukri19](https://github.com/muhammadsyukri19))

**Academic Project** - Semester 5, Artificial Intelligence Course

---

⭐ **Star this repo** if you find it helpful!
