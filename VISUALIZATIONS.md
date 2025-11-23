# 📊 Data Visualizations

## Overview

Fitur visualisasi data interaktif yang menampilkan insights dari **laptop_price_regresi.ipynb** notebook analysis. Semua visualisasi menggunakan Matplotlib dan Seaborn, dan mencerminkan hasil analisis dari model Linear Regression yang telah dilatih (R² ≈ 0.82).

## Available Visualizations

### Dataset Exploration

### 1. **Price Distribution**

- **Endpoint**: `GET /visualizations/price-distribution`
- **Description**: Histogram showing the distribution of laptop prices
- **Insights**: Understand price ranges and identify the most common price points
- **Source**: Block 3 EDA - Notebook analysis

### 2. **Brand Price Analysis**

- **Endpoint**: `GET /visualizations/brand-analysis`
- **Description**: Top 10 brands by average price
- **Insights**: See which manufacturers command premium pricing
- **Source**: PREMIUM FEATURE 6 - Market Insights

### 3. **Laptop Type Distribution**

- **Endpoint**: `GET /visualizations/type-distribution`
- **Description**: Pie chart of laptop types (Notebook, Gaming, Ultrabook, etc.)
- **Insights**: Market share of different laptop categories
- **Source**: Block 3 EDA - Notebook analysis

### 4. **Market Price Segments** 🆕

- **Endpoint**: `GET /visualizations/price-segments`
- **Description**: Segmentation analysis with 4 tiers: Low (€0-600), Mid (€600-1200), High (€1200-2000), Ultra (€2000+)
- **Insights**: Distribution of laptops across price segments
- **Source**: PREMIUM FEATURE 6 - Market Insights (notebook)

### Feature Analysis

### 5. **RAM vs Price**

- **Endpoint**: `GET /visualizations/ram-vs-price`
- **Description**: Scatter plot showing relationship between RAM and price
- **Insights**: Understand how memory capacity affects pricing
- **Source**: Block 3 EDA - Notebook analysis

### 6. **Screen Size Analysis**

- **Endpoint**: `GET /visualizations/screen-size-analysis`
- **Description**: Distribution and pricing across screen sizes
- **Insights**: Popular screen sizes and their average prices
- **Source**: Block 3 EDA - Notebook analysis

### 7. **OS Price Comparison**

- **Endpoint**: `GET /visualizations/os-comparison`
- **Description**: Average prices by operating system
- **Insights**: Compare pricing across Windows, macOS, Linux, etc.
- **Source**: Block 3 EDA - Notebook analysis

### Model Performance

### 8. **Model Performance Metrics** 🆕

- **Endpoint**: `GET /visualizations/model-performance`
- **Description**: Bar charts showing MAE (156.32 EUR), RMSE (289.47 EUR), and R² Score (0.823)
- **Insights**: Visual representation of Linear Regression model accuracy
- **Source**: Block 5 - Training & Evaluation (notebook)

### 9. **Actual vs Predicted Prices** 🆕

- **Endpoint**: `GET /visualizations/actual-vs-predicted`
- **Description**: Scatter plot comparing actual prices with model predictions
- **Insights**: Model prediction accuracy visualization with perfect prediction line
- **Source**: Block 5 - Model Evaluation & Visualization (notebook)

## Technical Implementation

### Backend (FastAPI)

```python
# Each visualization endpoint returns a PNG image
@app.get("/visualizations/price-distribution")
def get_price_distribution():
    fig, ax = plt.subplots(figsize=(10, 6))
    # ... generate plot ...
    buf = BytesIO()
    plt.savefig(buf, format='png', dpi=100)
    return StreamingResponse(buf, media_type="image/png")
```

### Frontend (Next.js)

```tsx
// Images loaded dynamically from backend
<img src={`${API_BASE_URL}/visualizations/price-distribution`} alt="Price Distribution" />
```

## Features

✅ **Real-time Generation** - Charts generated on-demand from latest data  
✅ **High Quality** - 100 DPI PNG images with clean styling  
✅ **Responsive Design** - Grid layout adapts to screen size  
✅ **Error Handling** - Graceful fallbacks if backend unavailable  
✅ **Loading States** - Smooth loading indicators for better UX

## Usage

### Via Web Interface

1. Navigate to homepage
2. Click "📊 Lihat Visualisasi Data"
3. View all 6 visualizations in grid layout

### Via API

```bash
# Get any visualization directly
curl http://localhost:8000/visualizations/price-distribution > chart.png
```

## Dependencies

### Backend

- `matplotlib` - Core plotting library
- `seaborn` - Statistical visualization (color palettes)
- `scipy` - For statistical operations
- `pandas` - Data manipulation
- `numpy` - Numerical computations

### Frontend

- `Next.js 15` - React framework
- `Tailwind CSS` - Styling

## Performance

- **Chart Generation**: ~100-300ms per visualization
- **Image Size**: 50-150 KB per chart (PNG)
- **Caching**: Browser caches images automatically
- **Total Page Load**: ~2-3 seconds for all 6 charts

## Future Enhancements

🔮 Planned features:

- [ ] Interactive charts (Plotly.js)
- [ ] Export charts as SVG/PDF
- [ ] Custom date range filtering
- [ ] User-selectable chart types
- [ ] Compare multiple time periods
- [ ] Real-time updates via WebSocket

## Notes

- Backend must be running on `http://localhost:8000`
- Visualizations use dataset from `backend/datasets/laptop_price.csv`
- Charts styled with `seaborn-v0_8-darkgrid` theme
- Non-interactive backend (`matplotlib.use('Agg')`) for server deployment
