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
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-slate-200 border-t-sky-500 rounded-full animate-spin"></div>
          <p className="text-slate-500 text-sm">Memuat data dari backend...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !options) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-semibold mb-2">Gagal memuat data</h2>
          <p className="text-slate-500 mb-6">{error}</p>
          <button onClick={() => window.location.reload()} className="rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-white hover:bg-sky-600">
            Muat Ulang
          </button>
        </div>
      </div>
    );
  }

  if (!options) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-sky-600 to-violet-600 bg-clip-text text-transparent">Bandingkan Model Laptop</h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">Pilih spesifikasi dari dataset dan dapatkan estimasi harga menggunakan Machine Learning</p>
        </section>

        <form onSubmit={handlePredict}>
          {/* Dua kartu compare */}
          <section className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Card Laptop A */}
            <LaptopCard title="Laptop 1" accentColor="sky" form={laptopA} price={priceA} options={options} onChange={(e) => handleChange("A", e)} isLoading={loading} />

            {/* Card Laptop B */}
            <LaptopCard title="Laptop 2" accentColor="violet" form={laptopB} price={priceB} options={options} onChange={(e) => handleChange("B", e)} isLoading={loading} />
          </section>

          <div className="flex justify-center mb-10">
            <button
              type="submit"
              disabled={loading}
              className="group relative rounded-full bg-gradient-to-r from-sky-500 to-violet-500 px-10 py-4 text-base font-semibold text-white shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-60 disabled:hover:scale-100 transition-all duration-200"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Menghitung prediksi...
                </span>
              ) : (
                "🚀 Prediksi Harga Kedua Laptop"
              )}
            </button>
          </div>
        </form>

        {/* Price Comparison Highlight */}
        {priceA != null && priceB != null && priceDiff != null && (
          <section className="mb-10 max-w-md mx-auto">
            <div className="bg-gradient-to-r from-sky-50 to-violet-50 border border-sky-200 rounded-2xl p-6 text-center">
              <p className="text-sm text-slate-600 mb-2">Selisih Harga</p>
              <p className="text-3xl font-bold text-sky-600 mb-2">{formatIDRFromEuro(priceDiff)}</p>
              <p className="text-sm text-slate-500">
                {cheaperLaptop} <span className="font-semibold">lebih murah</span>
              </p>
            </div>
          </section>
        )}

        {/* Ringkasan ala Apple */}
        <section className="border-t border-slate-200 pt-10">
          <h2 className="text-2xl font-semibold text-center mb-8">Ringkasan</h2>
          <div className="grid md:grid-cols-2 gap-8 text-center">
            <SummaryCard label="Laptop 1" form={laptopA} price={priceA} />
            <SummaryCard label="Laptop 2" form={laptopB} price={priceB} />
          </div>

          {error && <p className="mt-6 text-center text-sm text-red-500">❌ {error}</p>}
        </section>
      </main>
    </div>
  );
}

// ---------- Subcomponents ----------

type LaptopCardProps = {
  title: string;
  accentColor: "sky" | "violet";
  form: LaptopForm;
  price: number | null;
  options: Options;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  isLoading?: boolean;
};

function LaptopCard({ title, accentColor, form, price, options, onChange, isLoading = false }: LaptopCardProps) {
  const accent = accentColor === "sky" ? "text-sky-500 border-sky-500" : "text-violet-500 border-violet-500";

  const priceTextIDR = formatIDRFromEuro(price);
  const priceTextEUR = price == null ? "" : `≈ € ${price.toFixed(2)}`;

  return (
    <div
      className={`border-2 ${
        accentColor === "sky" ? "border-sky-200 hover:border-sky-300" : "border-violet-200 hover:border-violet-300"
      } rounded-3xl px-6 py-8 flex flex-col items-center shadow-md hover:shadow-xl transition-all duration-300 bg-white`}
    >
      <p className={`text-xs uppercase tracking-wide mb-1 font-semibold ${accentColor === "sky" ? "text-sky-600" : "text-violet-600"}`}>{title}</p>
      <h2 className="text-xl font-bold mb-3 text-center min-h-[3rem] flex items-center">
        {form.Company || "Brand"} {form.Product ? form.Product.substring(0, 20) : ""}
      </h2>

      <div className={`w-40 h-28 rounded-2xl ${accentColor === "sky" ? "bg-gradient-to-br from-sky-100 to-sky-50" : "bg-gradient-to-br from-violet-100 to-violet-50"} mb-4 flex items-center justify-center shadow-inner`}>
        <span className="text-6xl">💻</span>
      </div>

      <p className="text-sm text-slate-500 mb-2">Estimasi Harga</p>
      {isLoading ? (
        <div className="h-16 flex items-center justify-center">
          <div className="animate-pulse text-slate-400">Menghitung...</div>
        </div>
      ) : (
        <>
          <p className="text-2xl font-bold mb-1">{priceTextIDR}</p>
          {price != null && <p className="text-xs text-slate-500 mb-6">{priceTextEUR}</p>}
        </>
      )}

      <div className="w-full space-y-3 text-sm">
        {/* Company */}
        <SelectField label="Brand" name="Company" value={form.Company} options={options.companies} onChange={onChange} disabled={isLoading} />

        {/* Product */}
        <SelectField label="Product / Seri" name="Product" value={form.Product} options={options.products} onChange={onChange} disabled={isLoading} />

        {/* TypeName & Inches */}
        <div className="grid grid-cols-2 gap-3">
          <SelectField label="Tipe" name="TypeName" value={form.TypeName} options={options.typenames} onChange={onChange} disabled={isLoading} />
          <SelectField label="Layar (inch)" name="Inches" value={form.Inches} options={options.inches.map((v) => String(v))} displayFormatter={(v) => `${v}"`} onChange={onChange} disabled={isLoading} />
        </div>

        {/* ScreenResolution */}
        <SelectField label="Resolusi Layar" name="ScreenResolution" value={form.ScreenResolution} options={options.screen_resolutions} onChange={onChange} disabled={isLoading} />

        {/* CPU */}
        <SelectField label="CPU" name="Cpu" value={form.Cpu} options={options.cpus} onChange={onChange} disabled={isLoading} />

        {/* RAM & Weight */}
        <div className="grid grid-cols-2 gap-3">
          <SelectField label="RAM (GB)" name="Ram" value={form.Ram} options={options.rams_gb.map((v) => String(v))} displayFormatter={(v) => `${v} GB`} onChange={onChange} disabled={isLoading} />
          <SelectField label="Berat (kg)" name="Weight" value={form.Weight} options={options.weights.map((v) => String(v))} displayFormatter={(v) => `${v} kg`} onChange={onChange} disabled={isLoading} />
        </div>

        {/* Memory */}
        <SelectField label="Storage" name="Memory" value={form.Memory} options={options.memories} onChange={onChange} disabled={isLoading} />

        {/* GPU */}
        <SelectField label="GPU" name="Gpu" value={form.Gpu} options={options.gpus} onChange={onChange} disabled={isLoading} />

        {/* OS */}
        <SelectField label="Sistem Operasi" name="OpSys" value={form.OpSys} options={options.opsys} onChange={onChange} disabled={isLoading} />
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
  // buang duplikat & memoize
  const uniqueOptions = useMemo(() => Array.from(new Set(options)), [options]);

  return (
    <div>
      <label className="block mb-1 text-xs font-medium text-slate-600">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 bg-white disabled:bg-slate-50 disabled:cursor-not-allowed transition-all"
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
  const priceTextEUR = price == null ? "" : `≈ € ${price.toFixed(2)}`;

  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">{label}</p>
      <h3 className="text-lg font-semibold mb-2">
        {form.Company} {form.Product}
      </h3>
      <p className="text-4xl font-semibold mb-4">
        {form.Inches}
        &quot;
      </p>
      <p className="text-sm text-slate-500 mb-1">{form.ScreenResolution}</p>
      <p className="text-sm text-slate-500 mb-1">
        {form.Cpu} • {form.Ram}GB RAM
      </p>
      <p className="text-sm text-slate-500 mb-1">
        {form.Memory} • {form.Gpu}
      </p>
      <p className="text-sm text-slate-500 mb-2">
        {form.OpSys} • {form.Weight} kg
      </p>
      <p className="mt-3 text-base font-semibold">Prediksi harga: {priceTextIDR}</p>
      {price != null && <p className="text-xs text-slate-500">{priceTextEUR}</p>}
    </div>
  );
}
