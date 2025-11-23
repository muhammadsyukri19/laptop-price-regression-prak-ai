"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type VisualizationType = {
  id: string;
  title: string;
  description: string;
  endpoint: string;
};

const visualizations: VisualizationType[] = [
  {
    id: "price-distribution",
    title: "Price Distribution",
    description: "Histogram showing the distribution of laptop prices across the dataset",
    endpoint: "/visualizations/price-distribution",
  },
  {
    id: "brand-analysis",
    title: "Brand Price Analysis",
    description: "Top 10 brands by average price - see which manufacturers command premium pricing",
    endpoint: "/visualizations/brand-analysis",
  },
  {
    id: "type-distribution",
    title: "Laptop Type Distribution",
    description: "Pie chart showing market share of different laptop types (Notebook, Gaming, etc.)",
    endpoint: "/visualizations/type-distribution",
  },
  {
    id: "price-segments",
    title: "Market Price Segments",
    description: "Price segmentation analysis: Low (€0-600), Mid (€600-1200), High (€1200-2000), Ultra (€2000+)",
    endpoint: "/visualizations/price-segments",
  },
  {
    id: "ram-vs-price",
    title: "RAM vs Price",
    description: "Scatter plot showing the relationship between RAM capacity and laptop price",
    endpoint: "/visualizations/ram-vs-price",
  },
  {
    id: "screen-size-analysis",
    title: "Screen Size Analysis",
    description: "Distribution and average pricing across different screen sizes",
    endpoint: "/visualizations/screen-size-analysis",
  },
  {
    id: "os-comparison",
    title: "OS Price Comparison",
    description: "Compare average prices across different operating systems",
    endpoint: "/visualizations/os-comparison",
  },
  {
    id: "model-performance",
    title: "Model Performance Metrics",
    description: "Linear Regression evaluation metrics: MAE, RMSE, and R² Score from notebook analysis",
    endpoint: "/visualizations/model-performance",
  },
  {
    id: "actual-vs-predicted",
    title: "Actual vs Predicted Prices",
    description: "Scatter plot showing model prediction accuracy (R² ≈ 0.82) based on trained Linear Regression",
    endpoint: "/visualizations/actual-vs-predicted",
  },
];

export default function VisualizationsPage() {
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [timestamp, setTimestamp] = useState<number>(0);

  // Set timestamp only on client side to avoid hydration mismatch
  useEffect(() => {
    setTimestamp(Date.now());
  }, []);

  const handleImageLoad = (id: string) => {
    setLoading((prev) => ({ ...prev, [id]: false }));
  };

  const handleImageError = (id: string) => {
    setLoading((prev) => ({ ...prev, [id]: false }));
    setErrors((prev) => ({ ...prev, [id]: "Failed to load visualization" }));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-1">Data Visualizations</h1>
              <p className="text-sm text-slate-500">Explore insights from the laptop price dataset</p>
            </div>
            <Link href="/" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              ← Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <div className="text-2xl">📊</div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">About These Visualizations</h3>
              <p className="text-sm text-slate-600">
                These charts are generated from the <strong>laptop_price_regresi.ipynb</strong> notebook analysis. The visualizations include dataset exploration, model performance metrics (Linear Regression with R² ≈ 0.82), and market
                insights from 1303 laptops. All charts reflect the actual trained model results.
              </p>
            </div>
          </div>
        </div>

        {/* Visualizations Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {visualizations.map((viz) => (
            <div key={viz.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-slate-900 mb-2">{viz.title}</h2>
                <p className="text-sm text-slate-600">{viz.description}</p>
              </div>

              <div className="relative bg-slate-50 rounded-lg overflow-hidden border border-slate-200" style={{ minHeight: "300px" }}>
                {loading[viz.id] !== false && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-10 h-10 border-3 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
                      <p className="text-sm text-slate-500">Loading visualization...</p>
                    </div>
                  </div>
                )}

                {errors[viz.id] ? (
                  <div className="flex items-center justify-center p-12">
                    <div className="text-center">
                      <div className="text-3xl mb-2">⚠️</div>
                      <p className="text-sm text-slate-600">{errors[viz.id]}</p>
                      <button
                        onClick={() => {
                          setErrors((prev) => {
                            const newErrors = { ...prev };
                            delete newErrors[viz.id];
                            return newErrors;
                          });
                          setLoading((prev) => ({ ...prev, [viz.id]: true }));
                        }}
                        className="mt-3 px-4 py-2 text-xs bg-slate-900 text-white rounded-lg hover:bg-slate-800"
                      >
                        Retry
                      </button>
                    </div>
                  </div>
                ) : (
                  <img
                    src={`${API_BASE_URL}${viz.endpoint}${timestamp ? `?t=${timestamp}` : ""}`}
                    alt={viz.title}
                    onLoad={() => handleImageLoad(viz.id)}
                    onError={() => handleImageError(viz.id)}
                    className={`w-full h-auto ${loading[viz.id] !== false ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Tech Note */}
        <div className="mt-12 pt-8 border-t border-slate-200 text-center">
          <p className="text-sm text-slate-500">
            📈 Visualizations generated from <span className="font-semibold">laptop_price_regresi.ipynb</span> using <span className="font-semibold">Matplotlib</span> and <span className="font-semibold">Seaborn</span>
          </p>
          <p className="text-xs text-slate-400 mt-2">Data source: 1303 laptops • Model: Linear Regression (R² = 0.823, MAE = 156.32 EUR)</p>
        </div>
      </main>
    </div>
  );
}
