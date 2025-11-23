"use client";

import { useEffect, useState, useCallback, useMemo } from "react";

type Options = {
  companies: string[];
  products: string[];
  typenames: string[];
  screen_resolutions: string[];
  cpus: string[];
  rams_gb: number[];
  memories: string[];
  gpus: string[];
  opsys: string[];
  inches: number[];
  weights: number[];
};

type LaptopForm = {
  Company: string;
  Product: string;
  TypeName: string;
  Inches: string;
  ScreenResolution: string;
  Cpu: string;
  Ram: string;
  Memory: string;
  Gpu: string;
  OpSys: string;
  Weight: string;
};

const emptyLaptop: LaptopForm = {
  Company: "",
  Product: "",
  TypeName: "",
  Inches: "",
  ScreenResolution: "",
  Cpu: "",
  Ram: "",
  Memory: "",
  Gpu: "",
  OpSys: "",
  Weight: "",
};

const EUR_TO_IDR = 17000;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function formatIDRFromEuro(val: number | null) {
  if (val == null) return "-";
  const rupiah = val * EUR_TO_IDR;
  return rupiah.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  });
}

export default function LaptopComparePage() {
  const [options, setOptions] = useState<Options | null>(null);
  const [laptopA, setLaptopA] = useState<LaptopForm>(emptyLaptop);
  const [laptopB, setLaptopB] = useState<LaptopForm>(emptyLaptop);
  const [priceA, setPriceA] = useState<number | null>(null);
  const [priceB, setPriceB] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // PENTING: Semua hooks HARUS di atas sebelum early return!
  // Hitung selisih harga - PINDAHKAN KE ATAS
  const priceDiff = useMemo(() => {
    if (priceA != null && priceB != null) {
      return Math.abs(priceA - priceB);
    }
    return null;
  }, [priceA, priceB]);

  const cheaperLaptop = useMemo(() => {
    if (priceA != null && priceB != null) {
      return priceA < priceB ? "Laptop 1" : "Laptop 2";
    }
    return null;
  }, [priceA, priceB]);

  const handleChange = useCallback((target: "A" | "B", e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (target === "A") {
      setLaptopA((prev) => ({ ...prev, [name]: value }));
    } else {
      setLaptopB((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  const validateForm = useCallback((form: LaptopForm): string | null => {
    if (!form.Company || !form.Product || !form.TypeName) {
      return "Brand, Product, dan Tipe harus diisi";
    }
    if (!form.Inches || isNaN(parseFloat(form.Inches))) {
      return "Ukuran layar tidak valid";
    }
    if (!form.Ram || isNaN(parseInt(form.Ram, 10))) {
      return "RAM tidak valid";
    }
    if (!form.Weight || isNaN(parseFloat(form.Weight))) {
      return "Berat tidak valid";
    }
    return null;
  }, []);

  // --- Fetch dropdown options dengan error handling & retry ---
  useEffect(() => {
    let isMounted = true;
    let retryCount = 0;
    const maxRetries = 3;

    async function loadOptions() {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

        const res = await fetch(`${API_BASE_URL}/options`, {
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }

        const data: Options = await res.json();

        if (!isMounted) return;

        setOptions(data);
        setLoadingOptions(false);

        // Set default values
        if (data.companies.length > 0) {
          setLaptopA({
            Company: data.companies[0],
            Product: data.products[0] || "",
            TypeName: data.typenames[0] || "",
            Inches: String(data.inches[0] || ""),
            ScreenResolution: data.screen_resolutions[0] || "",
            Cpu: data.cpus[0] || "",
            Ram: String(data.rams_gb[0] || ""),
            Memory: data.memories[0] || "",
            Gpu: data.gpus[0] || "",
            OpSys: data.opsys[0] || "",
            Weight: String(data.weights[0] || ""),
          });

          setLaptopB({
            Company: data.companies[Math.min(1, data.companies.length - 1)],
            Product: data.products[Math.min(1, data.products.length - 1)] || data.products[0] || "",
            TypeName: data.typenames[Math.min(1, data.typenames.length - 1)] || data.typenames[0] || "",
            Inches: String(data.inches[Math.min(1, data.inches.length - 1)] || data.inches[0] || ""),
            ScreenResolution: data.screen_resolutions[Math.min(1, data.screen_resolutions.length - 1)] || data.screen_resolutions[0] || "",
            Cpu: data.cpus[Math.min(1, data.cpus.length - 1)] || data.cpus[0] || "",
            Ram: String(data.rams_gb[Math.min(1, data.rams_gb.length - 1)] || data.rams_gb[0] || ""),
            Memory: data.memories[Math.min(1, data.memories.length - 1)] || data.memories[0] || "",
            Gpu: data.gpus[Math.min(1, data.gpus.length - 1)] || data.gpus[0] || "",
            OpSys: data.opsys[Math.min(1, data.opsys.length - 1)] || data.opsys[0] || "",
            Weight: String(data.weights[Math.min(1, data.weights.length - 1)] || data.weights[0] || ""),
          });
        }
      } catch (err: any) {
        if (!isMounted) return;

        console.error("Error loading options:", err);

        // Retry logic
        if (retryCount < maxRetries && err.name !== "AbortError") {
          retryCount++;
          setTimeout(() => loadOptions(), 2000 * retryCount); // exponential backoff
        } else {
          setError(err.name === "AbortError" ? "Koneksi timeout. Pastikan backend berjalan di http://localhost:8000" : `Gagal memuat data: ${err.message}`);
          setLoadingOptions(false);
        }
      }
    }

    loadOptions();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handlePredict(e: React.FormEvent) {
    e.preventDefault();
    if (!options) return;

    // Validate forms
    const errorA = validateForm(laptopA);
    const errorB = validateForm(laptopB);

    if (errorA || errorB) {
      setError(errorA || errorB || "Form tidak valid");
      return;
    }

    setLoading(true);
    setError(null);
    setPriceA(null);
    setPriceB(null);

    const bodyA = {
      Company: laptopA.Company,
      Product: laptopA.Product,
      TypeName: laptopA.TypeName,
      Inches: parseFloat(laptopA.Inches),
      ScreenResolution: laptopA.ScreenResolution,
      Cpu: laptopA.Cpu,
      Ram: parseInt(laptopA.Ram, 10),
      Memory: laptopA.Memory,
      Gpu: laptopA.Gpu,
      OpSys: laptopA.OpSys,
      Weight: parseFloat(laptopA.Weight),
    };

    const bodyB = {
      Company: laptopB.Company,
      Product: laptopB.Product,
      TypeName: laptopB.TypeName,
      Inches: parseFloat(laptopB.Inches),
      ScreenResolution: laptopB.ScreenResolution,
      Cpu: laptopB.Cpu,
      Ram: parseInt(laptopB.Ram, 10),
      Memory: laptopB.Memory,
      Gpu: laptopB.Gpu,
      OpSys: laptopB.OpSys,
      Weight: parseFloat(laptopB.Weight),
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

      const [resA, resB] = await Promise.all([
        fetch(`${API_BASE_URL}/predict`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bodyA),
          signal: controller.signal,
        }),
        fetch(`${API_BASE_URL}/predict`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bodyB),
          signal: controller.signal,
        }),
      ]);

      clearTimeout(timeoutId);

      if (!resA.ok || !resB.ok) {
        const errorText = !resA.ok ? await resA.text() : await resB.text();
        throw new Error(`Prediksi gagal: ${errorText}`);
      }

      const dataA = await resA.json();
      const dataB = await resB.json();

      setPriceA(dataA.predicted_price);
      setPriceB(dataB.predicted_price);
    } catch (err: any) {
      console.error("Prediction error:", err);
      setError(err.name === "AbortError" ? "Prediksi timeout. Coba lagi." : err.message || "Terjadi kesalahan saat prediksi");
    } finally {
      setLoading(false);
    }
  }

  // Loading state
  if (loadingOptions) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-3 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
          <p className="text-slate-600 text-sm font-medium">Loading options from backend...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !options) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Failed to Load Data</h2>
          <p className="text-slate-600 mb-6 text-sm">{error}</p>
          <button onClick={() => window.location.reload()} className="px-6 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-colors">
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  if (!options) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Header dengan gradient subtle */}
      <header className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-1">Compare Laptops</h1>
              <p className="text-sm text-slate-500">Select specifications and predict prices using ML</p>
            </div>
            <a href="/" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              ← Back to Home
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <form onSubmit={handlePredict}>
          {/* Cards Grid */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <LaptopCard title="Laptop 1" form={laptopA} price={priceA} options={options} onChange={(e) => handleChange("A", e)} isLoading={loading} />
            <LaptopCard title="Laptop 2" form={laptopB} price={priceB} options={options} onChange={(e) => handleChange("B", e)} isLoading={loading} />
          </div>

          {/* Action Button */}
          <div className="flex justify-center mb-8">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Calculating predictions...
                </span>
              ) : (
                "Predict Both Laptops"
              )}
            </button>
          </div>
        </form>

        {/* Price Comparison */}
        {priceA != null && priceB != null && priceDiff != null && (
          <div className="max-w-md mx-auto mb-8">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center">
              <p className="text-xs uppercase tracking-wide text-slate-500 font-medium mb-2">Price Difference</p>
              <p className="text-3xl font-bold text-slate-900 mb-1">{formatIDRFromEuro(priceDiff)}</p>
              <p className="text-sm text-slate-600">
                {cheaperLaptop} is <span className="font-semibold">cheaper</span>
              </p>
            </div>
          </div>
        )}

        {/* Summary Section */}
        <div className="border-t border-slate-100 pt-10">
          <h2 className="text-xl font-bold text-slate-900 text-center mb-8">Summary</h2>
          <div className="grid lg:grid-cols-2 gap-6">
            <SummaryCard label="Laptop 1" form={laptopA} price={priceA} />
            <SummaryCard label="Laptop 2" form={laptopB} price={priceB} />
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700 text-center">⚠️ {error}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// ---------- Subcomponents ----------

type LaptopCardProps = {
  title: string;
  form: LaptopForm;
  price: number | null;
  options: Options;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  isLoading?: boolean;
};

function LaptopCard({ title, form, price, options, onChange, isLoading = false }: LaptopCardProps) {
  const priceTextIDR = formatIDRFromEuro(price);
  const priceTextEUR = price == null ? "" : `€${price.toFixed(2)}`;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="mb-6 pb-4 border-b border-slate-100">
        <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2">{title}</p>
        <h3 className="text-lg font-bold text-slate-900 truncate">
          {form.Company || "Select Brand"} {form.Product ? `• ${form.Product.substring(0, 25)}` : ""}
        </h3>
      </div>

      {/* Price Display */}
      <div className="mb-6 p-4 bg-slate-50 rounded-lg text-center">
        <p className="text-xs text-slate-500 mb-1">Estimated Price</p>
        {isLoading ? (
          <div className="h-12 flex items-center justify-center">
            <div className="animate-pulse text-slate-400 text-sm">Calculating...</div>
          </div>
        ) : (
          <>
            <p className="text-2xl font-bold text-slate-900">{priceTextIDR}</p>
            {price != null && <p className="text-xs text-slate-500 mt-1">{priceTextEUR}</p>}
          </>
        )}
      </div>

      {/* Form Fields */}
      <div className="space-y-4 text-sm">
        <SelectField label="Brand" name="Company" value={form.Company} options={options.companies} onChange={onChange} disabled={isLoading} />

        <SelectField label="Product / Series" name="Product" value={form.Product} options={options.products} onChange={onChange} disabled={isLoading} />

        <div className="grid grid-cols-2 gap-3">
          <SelectField label="Type" name="TypeName" value={form.TypeName} options={options.typenames} onChange={onChange} disabled={isLoading} />
          <SelectField label="Screen" name="Inches" value={form.Inches} options={options.inches.map((v) => String(v))} displayFormatter={(v) => `${v}"`} onChange={onChange} disabled={isLoading} />
        </div>

        <SelectField label="Resolution" name="ScreenResolution" value={form.ScreenResolution} options={options.screen_resolutions} onChange={onChange} disabled={isLoading} />

        <SelectField label="Processor (CPU)" name="Cpu" value={form.Cpu} options={options.cpus} onChange={onChange} disabled={isLoading} />

        <div className="grid grid-cols-2 gap-3">
          <SelectField label="RAM" name="Ram" value={form.Ram} options={options.rams_gb.map((v) => String(v))} displayFormatter={(v) => `${v} GB`} onChange={onChange} disabled={isLoading} />
          <SelectField label="Weight" name="Weight" value={form.Weight} options={options.weights.map((v) => String(v))} displayFormatter={(v) => `${v} kg`} onChange={onChange} disabled={isLoading} />
        </div>

        <SelectField label="Storage" name="Memory" value={form.Memory} options={options.memories} onChange={onChange} disabled={isLoading} />

        <SelectField label="Graphics (GPU)" name="Gpu" value={form.Gpu} options={options.gpus} onChange={onChange} disabled={isLoading} />

        <SelectField label="Operating System" name="OpSys" value={form.OpSys} options={options.opsys} onChange={onChange} disabled={isLoading} />
      </div>
    </div>
  );
}

type SelectFieldProps = {
  label: string;
  name: keyof LaptopForm;
  value: string;
  options: string[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  displayFormatter?: (value: string) => string;
  disabled?: boolean;
};

function SelectField({ label, name, value, options, onChange, displayFormatter, disabled = false }: SelectFieldProps) {
  const uniqueOptions = useMemo(() => Array.from(new Set(options)), [options]);

  return (
    <div>
      <label className="block mb-1.5 text-xs font-semibold text-slate-700">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 bg-white disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed transition-all"
      >
        {uniqueOptions.map((opt, idx) => (
          <option key={`${name}-${idx}`} value={opt}>
            {displayFormatter ? displayFormatter(opt) : opt}
          </option>
        ))}
      </select>
    </div>
  );
}

type SummaryProps = {
  label: string;
  form: LaptopForm;
  price: number | null;
};

function SummaryCard({ label, form, price }: SummaryProps) {
  const priceTextIDR = formatIDRFromEuro(price);
  const priceTextEUR = price == null ? "" : `€${price.toFixed(2)}`;

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
      <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-3">{label}</p>

      <div className="space-y-3">
        <div>
          <h4 className="text-base font-bold text-slate-900">
            {form.Company} {form.Product}
          </h4>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-slate-500">Screen</p>
            <p className="font-medium text-slate-700">{form.Inches}&quot;</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Type</p>
            <p className="font-medium text-slate-700">{form.TypeName}</p>
          </div>
        </div>

        <div>
          <p className="text-xs text-slate-500 mb-1">Specifications</p>
          <div className="space-y-1 text-xs text-slate-600">
            <p>• {form.Cpu}</p>
            <p>
              • {form.Ram}GB RAM • {form.Memory}
            </p>
            <p>• {form.Gpu}</p>
            <p>
              • {form.OpSys} • {form.Weight} kg
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-200">
          <p className="text-xs text-slate-500 mb-1">Predicted Price</p>
          <p className="text-xl font-bold text-slate-900">{priceTextIDR}</p>
          {price != null && <p className="text-xs text-slate-500">{priceTextEUR}</p>}
        </div>
      </div>
    </div>
  );
}
