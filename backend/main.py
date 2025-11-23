from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd
import numpy as np
import re
import os

app = FastAPI()

# --- CORS biar bisa diakses dari Next.js ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # di production ganti spesifik
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
#  LOAD MODEL + DATASET
# =========================

# Model pipeline (Linear Regression + preprocess)
MODEL_PATH = "lr_laptop_price_pipeline.pkl"
model = joblib.load(MODEL_PATH)

# Dataset untuk dropdown options
DATA_PATH = os.path.join("..", "backend", "datasets", "laptop_price.csv")
df_raw = pd.read_csv(DATA_PATH, encoding="latin1")


# =========================
#  SCHEMA INPUT KALAU PREDIKSI LANGSUNG
# =========================

class LaptopSpec(BaseModel):
    Company: str
    Product: str
    TypeName: str
    Inches: float
    ScreenResolution: str
    Cpu: str
    Ram: int
    Memory: str
    Gpu: str
    OpSys: str
    Weight: float


# =========================
#  FEATURE ENGINEERING HELPER
#  (HARUS SAMA LOGIKANYA DENGAN NOTEBOOK)
# =========================

def parse_memory(mem: str):
    """
    Contoh string:
    - '256GB SSD'
    - '128GB SSD + 1TB HDD'
    - '512GB SSD + 512GB SSD'
    """
    ssd = hdd = hybrid = flash_storage = 0

    if mem is None:
        return ssd, hdd, hybrid, flash_storage

    parts = str(mem).split('+')
    for p in parts:
        p = p.strip()

        size_match = re.search(r"(\d+)\s*(GB|TB)", p, re.IGNORECASE)
        if not size_match:
            continue

        size = int(size_match.group(1))
        unit = size_match.group(2).upper()

        if unit == "TB":
            size *= 1024  # convert ke GB

        p_upper = p.upper()
        if "SSD" in p_upper and "HYBRID" not in p_upper:
            ssd += size
        elif "HDD" in p_upper:
            hdd += size
        elif "HYBRID" in p_upper:
            hybrid += size
        elif "FLASH" in p_upper or "EMMC" in p_upper:
            flash_storage += size

    return ssd, hdd, hybrid, flash_storage


def extract_cpu_features(cpu: str):
    if cpu is None:
        return "", "", np.nan

    parts = str(cpu).split()
    if not parts:
        return "", "", np.nan

    cpu_brand = parts[0]

    if len(parts) > 2:
        cpu_model = " ".join(parts[1:3])
    elif len(parts) > 1:
        cpu_model = parts[1]
    else:
        cpu_model = ""

    speed = np.nan
    for p in parts:
        if "GHz" in p:
            val = p.replace("GHz", "").replace(",", ".")
            try:
                speed = float(val)
            except ValueError:
                speed = np.nan
            break

    return cpu_brand, cpu_model, speed


def extract_resolution_features(screen: str):
    if screen is None:
        return np.nan, np.nan, 0, 0

    s = str(screen)
    match = re.search(r"(\d+)x(\d+)", s)
    if match:
        resolution_x = int(match.group(1))
        resolution_y = int(match.group(2))
    else:
        resolution_x = np.nan
        resolution_y = np.nan

    s_upper = s.upper()
    is_ips = 1 if "IPS" in s_upper else 0
    is_retina = 1 if "RETINA" in s_upper else 0

    return resolution_x, resolution_y, is_ips, is_retina


def predict_from_spec(spec_dict: dict) -> float:
    """Helper untuk memprediksi dari dict spesifikasi mentah."""
    data = pd.DataFrame([spec_dict])

    # Memory → SSD, HDD, Hybrid, Flash_Storage, Total_Storage
    ssd, hdd, hybrid, flash_storage = parse_memory(data.loc[0, "Memory"])
    data["SSD"] = ssd
    data["HDD"] = hdd
    data["Hybrid"] = hybrid
    data["Flash_Storage"] = flash_storage
    data["Total_Storage"] = ssd + hdd + hybrid + flash_storage

    # CPU features
    cpu_brand, cpu_model, cpu_speed = extract_cpu_features(data.loc[0, "Cpu"])
    data["cpu_brand"] = cpu_brand
    data["cpu_model"] = cpu_model
    data["cpu_speed"] = cpu_speed

    # Screen resolution features
    res_x, res_y, is_ips, is_retina = extract_resolution_features(
        data.loc[0, "ScreenResolution"]
    )
    data["resolution_x"] = res_x
    data["resolution_y"] = res_y
    data["is_ips"] = is_ips
    data["is_retina"] = is_retina

    # Prediksi dengan pipeline
    pred = model.predict(data)[0]
    return float(pred)


# =========================
#  ROUTES
# =========================

@app.get("/")
def root():
    return {"message": "Laptop Price Regression API is running."}


@app.post("/predict")
def predict_price(spec: LaptopSpec):
    pred = predict_from_spec(spec.dict())
    return {
        "predicted_price": pred,
        "currency": "EUR",
    }


# ---------- OPTIONS ENDPOINT UNTUK DROPDOWN ----------

@app.get("/options")
def get_options():
    """
    Return semua pilihan dropdown berdasarkan nilai unik dari dataset.
    Semua sudah dibersihkan & di-sort.
    """
    df = df_raw.copy()

    # Inches & Weight: buang 'kg', ubah ke float
    inches_values = sorted(df["Inches"].astype(float).unique().tolist())

    def clean_weight(w):
        s = str(w).replace("kg", "").replace("kgs", "").replace(",", ".").strip()
        try:
            return float(s)
        except ValueError:
            return np.nan

    weight_values = sorted(
        [clean_weight(w) for w in df["Weight"].unique() if str(w).strip() != ""]
    )

    # RAM: "8GB" -> 8
    def clean_ram(r):
        s = str(r).upper().replace("GB", "").strip()
        try:
            return int(s)
        except ValueError:
            return np.nan

    ram_values = sorted(
        {clean_ram(r) for r in df["Ram"].unique() if str(r).strip() != ""}
    )

    # Unique values lain langsung dari kolom
    companies = sorted(df["Company"].unique().tolist())
    products = sorted(df["Product"].unique().tolist())
    typenames = sorted(df["TypeName"].unique().tolist())
    screen_resolutions = sorted(df["ScreenResolution"].unique().tolist())
    cpus = sorted(df["Cpu"].unique().tolist())
    memories = sorted(df["Memory"].unique().tolist())
    gpus = sorted(df["Gpu"].unique().tolist())
    opsys = sorted(df["OpSys"].unique().tolist())

    return {
        "companies": companies,
        "products": products,
        "typenames": typenames,
        "screen_resolutions": screen_resolutions,
        "cpus": cpus,
        "rams_gb": [int(x) for x in ram_values if not np.isnan(x)],
        "memories": memories,
        "gpus": gpus,
        "opsys": opsys,
        "inches": inches_values,
        "weights": [w for w in weight_values if not np.isnan(w)],
    }
