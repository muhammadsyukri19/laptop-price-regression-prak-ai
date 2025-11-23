# 🚀 Quick Start Guide - Visualizations

## Step 1: Pastikan Backend Running

### Terminal 1 - Backend

```bash
cd "d:\Tugas-tugas\Tugas kuliah Milan\Semester 5\Artificial Intelligent\Project Akhir AI\laptop-price-regression-prak-ai\backend"
python main.py
```

**Expected output:**

```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete.
```

## Step 2: Pastikan Frontend Running

### Terminal 2 - Frontend

```bash
cd "d:\Tugas-tugas\Tugas kuliah Milan\Semester 5\Artificial Intelligent\Project Akhir AI\laptop-price-regression-prak-ai\frontend"
npm run dev
```

**Expected output:**

```
▲ Next.js 15.1.6
- Local:        http://localhost:3000
✓ Ready in 2.5s
```

## Step 3: Access Application

### 🏠 Homepage

Open browser: `http://localhost:3000`

**Available options:**

- 🚀 **Mulai Bandingkan Laptop** → Compare 2 laptops
- 📊 **Lihat Visualisasi Data** → View data visualizations

### 📊 Visualizations Page

Direct link: `http://localhost:3000/visualizations`

**6 Charts available:**

1. ✅ Price Distribution
2. ✅ Brand Price Analysis
3. ✅ Laptop Type Distribution
4. ✅ RAM vs Price
5. ✅ Screen Size Analysis
6. ✅ OS Price Comparison

## Verify Backend Endpoints

### Test API manually:

```bash
# 1. Check if backend is alive
curl http://localhost:8000

# 2. Get dropdown options
curl http://localhost:8000/options

# 3. Get price distribution chart
curl http://localhost:8000/visualizations/price-distribution > test.png

# 4. Open test.png - should see histogram
```

## Troubleshooting

### ❌ Problem: "Failed to Load Data" on frontend

**Solution:**

1. Check backend is running (Terminal 1)
2. Visit `http://localhost:8000` directly - should see JSON response
3. Check browser console (F12) for errors

### ❌ Problem: Visualizations show "⚠️ Failed to load"

**Solution:**

1. Test endpoint directly: `http://localhost:8000/visualizations/price-distribution`
2. Check backend terminal for Python errors
3. Verify matplotlib/seaborn installed: `pip list | grep -i "matplotlib\|seaborn"`

### ❌ Problem: "Module not found" errors in backend

**Solution:**

```bash
cd backend
pip install matplotlib seaborn scipy fastapi uvicorn joblib pandas numpy scikit-learn
```

### ❌ Problem: Charts load but are blank/corrupted

**Solution:**

1. Check backend logs for matplotlib errors
2. Try different browser (Chrome recommended)
3. Clear browser cache (Ctrl+Shift+Del)

## Features to Test

### ✅ Checklist

- [ ] Homepage loads correctly
- [ ] Click "Mulai Bandingkan Laptop" → Comparison page opens
- [ ] Select laptop specs → Click "Predict Both Laptops" → See prices
- [ ] Click "Lihat Visualisasi Data" → Visualizations page opens
- [ ] All 6 charts load successfully
- [ ] Charts are visible and well-formatted
- [ ] No console errors (F12)

## Performance Notes

- **First load**: ~3-5 seconds (backend generates all charts)
- **Subsequent loads**: <1 second (browser cache)
- **Each chart**: 50-150 KB PNG
- **Total page size**: ~500 KB

## Next Steps

1. ✅ Explore comparison tool with different laptop specs
2. ✅ View all visualizations to understand dataset
3. ✅ Check GitHub link on homepage
4. ✅ Try mobile view (responsive design)

---

📝 **Note**: Backend must run BEFORE frontend, otherwise API calls will fail.
🔄 **Refresh**: If charts don't update, add `?t=timestamp` to force reload.
