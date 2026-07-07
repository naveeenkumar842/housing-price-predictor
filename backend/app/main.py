from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import pandas as pd
import numpy as np
from pathlib import Path
import uvicorn

app = FastAPI(
    title="Housing Price Prediction API",
    description="API for predicting housing prices in Indian Rupees (₹)",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*",
        "https://housing-frontend.onrender.com",
        "https://housing-frontend-7s6f.onrender.com",
        "http://localhost:3000",
        "http://localhost:3001"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)

# Import your models
from app.models import model_instance
from app.utils import format_inr

# Health check
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "model_loaded": model_instance.model is not None,
        "version": "1.0.0"
    }

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Housing Price Prediction API",
        "status": "online",
        "version": "1.0.0",
        "docs": "/docs"
    }

# Prediction endpoints
@app.post("/predict")
async def predict(request: dict):
    try:
        features = request.get('features', {})
        prediction = model_instance.predict(features)
        prediction_inr = format_inr(prediction)
        return {
            "prediction": round(prediction, 2),
            "prediction_inr": prediction_inr,
            "features": features
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/predict/batch")
async def predict_batch(request: dict):
    try:
        features_list = request.get('features', [])
        predictions = model_instance.predict_batch(features_list)
        predictions_inr = [format_inr(p) for p in predictions]
        return {
            "predictions": [round(p, 2) for p in predictions],
            "predictions_inr": predictions_inr
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Model info endpoint
@app.get("/model-info")
async def get_model_info():
    if not model_instance.metrics:
        raise HTTPException(status_code=404, detail="Model information not available")
    
    metrics = model_instance.metrics
    return {
        "model_type": metrics.get('model_type', 'Unknown'),
        "features_used": metrics.get('features_used', []),
        "coefficients": metrics.get('coefficients', []),
        "intercept": metrics.get('intercept', 0),
        "r2_score": metrics.get('r2_score', 0),
        "rmse": metrics.get('rmse', 0),
        "rmse_inr": format_inr(metrics.get('rmse', 0)),
        "mae": metrics.get('mae', 0),
        "mae_inr": format_inr(metrics.get('mae', 0)),
        "training_samples": metrics.get('training_samples', 0),
        "feature_importance": metrics.get('feature_importance', []),
        "currency": "INR"
    }

# ============================================
# MARKET STATS ENDPOINT - ADD THIS
# ============================================


import json
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# Add helper function to convert numpy types
def convert_to_serializable(obj):
    """Convert numpy types to Python native types for JSON serialization"""
    if isinstance(obj, np.integer):
        return int(obj)
    elif isinstance(obj, np.floating):
        return float(obj)
    elif isinstance(obj, np.ndarray):
        return obj.tolist()
    elif isinstance(obj, pd.Series):
        return obj.to_list()
    elif isinstance(obj, dict):
        return {k: convert_to_serializable(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [convert_to_serializable(item) for item in obj]
    else:
        return obj

@app.get("/market/stats")
async def get_market_stats():
    """
    Get market statistics and analysis
    """
    try:
        # Try to load the dataset
        data_paths = [
            Path('/app/data/House Price Dataset.csv'),
            Path('/app/backend/data/House Price Dataset.csv'),
            Path('data/House Price Dataset.csv'),
        ]
        
        df = None
        for path in data_paths:
            if path.exists():
                df = pd.read_csv(path)
                print(f"✅ Loaded dataset from: {path}")
                break
        
        if df is None:
            # Create sample data if no dataset found
            print("⚠️ No dataset found. Creating sample data for market stats...")
            np.random.seed(42)
            n_samples = 50
            df = pd.DataFrame({
                'square_footage': np.random.randint(800, 3000, n_samples),
                'bedrooms': np.random.randint(1, 5, n_samples),
                'bathrooms': np.random.randint(1, 4, n_samples),
                'year_built': np.random.randint(1950, 2020, n_samples),
                'lot_size': np.random.randint(3000, 12000, n_samples),
                'distance_to_city_center': np.random.uniform(1, 10, n_samples),
                'school_rating': np.random.uniform(5, 10, n_samples),
                'price': np.random.randint(150000, 400000, n_samples)
            })
            print(f"✅ Created sample dataset with {len(df)} rows")
        
        # Calculate statistics - convert all to Python types
        stats = {
            'total_houses': int(len(df)),
            'avg_price': float(df['price'].mean()),
            'avg_price_inr': format_inr(float(df['price'].mean())),
            'min_price': float(df['price'].min()),
            'min_price_inr': format_inr(float(df['price'].min())),
            'max_price': float(df['price'].max()),
            'max_price_inr': format_inr(float(df['price'].max())),
            'avg_square_footage': float(df['square_footage'].mean()),
            'avg_bedrooms': float(df['bedrooms'].mean()),
            'avg_bathrooms': float(df['bathrooms'].mean()),
            'avg_year_built': float(df['year_built'].mean()),
            'avg_school_rating': float(df['school_rating'].mean())
        }
        
        # Price distribution
        bins = [0, 200000, 300000, 400000, 500000, float('inf')]
        labels = ['< ₹2L', '₹2L-3L', '₹3L-4L', '₹4L-5L', '> ₹5L']
        df['price_range'] = pd.cut(df['price'], bins=bins, labels=labels, right=False)
        distribution = df['price_range'].value_counts()
        
        distribution_list = []
        total = len(df)
        for label in labels:
            count = int(distribution.get(label, 0))
            distribution_list.append({
                'price_range': label,
                'count': count,
                'percentage': round((count / total) * 100, 2) if total > 0 else 0
            })
        
        # Feature correlations - convert to Python types
        feature_cols = ['square_footage', 'bedrooms', 'bathrooms', 'year_built', 
                        'lot_size', 'distance_to_city_center', 'school_rating']
        correlations = []
        for col in feature_cols:
            if col in df.columns:
                corr = df[col].corr(df['price'])
                # Handle NaN or None
                if pd.isna(corr):
                    corr_value = 0
                else:
                    corr_value = float(corr)
                correlations.append({
                    'feature': col,
                    'correlation': round(corr_value, 3)
                })
        
        # Feature importance from model
        top_features = []
        if model_instance.metrics and 'feature_importance' in model_instance.metrics:
            top_features = sorted(
                model_instance.metrics['feature_importance'],
                key=lambda x: x.get('importance', 0),
                reverse=True
            )[:5]
            # Ensure values are Python types
            for feature in top_features:
                if 'importance' in feature:
                    feature['importance'] = float(feature['importance'])
        
        # Build response with all Python types
        response = {
            'stats': stats,
            'distribution': distribution_list,
            'correlations': sorted(correlations, key=lambda x: abs(x['correlation']), reverse=True),
            'top_features': top_features
        }
        
        return response
        
    except Exception as e:
        print(f"❌ Error in market stats: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Market stats error: {str(e)}")
    


    
if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)