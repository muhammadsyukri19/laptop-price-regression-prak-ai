#!/bin/bash
cd "$(dirname "$0")"
echo "Starting Laptop Price Predictor Backend..."
echo ""
echo "Installing required dependencies..."
python -m pip install --quiet fastapi uvicorn joblib pandas numpy scikit-learn matplotlib seaborn scipy
echo ""
echo "Starting FastAPI server on http://localhost:8000..."
echo "Press CTRL+C to stop the server"
echo ""
python -m uvicorn main:app --reload --port 8000
