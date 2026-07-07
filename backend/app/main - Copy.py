from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import List
import pandas as pd
import numpy as np

from app.schemas import (
    HousingFeatures, PredictionRequest, BatchPredictionRequest,
    PredictionResponse, BatchPredictionResponse, ModelInfoResponse,
    MarketAnalysisResponse, MarketStats, PriceDistribution, FeatureCorrelation
)
from app.models import model_instance
from app.utils import format_inr, load_training_data

app = FastAPI(
    title="Housing Price Prediction API",
    description="API for predicting housing prices in Indian Rupees (₹)",
    version="1.0.0"
)

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "model_loaded": model_instance.model is not None,
        "model_type": model_instance.metrics.get('model_type', 'Unknown') if model_instance.metrics else 'Unknown',
        "currency": "INR",
        "version": "1.0.0"
    }

@app.post("/predict", response_model=PredictionResponse)
async def predict_single(request: PredictionRequest):
    try:
        features_dict = request.features.dict()
        prediction = model_instance.predict(features_dict)
        prediction_inr = format_inr(prediction)
        
        return PredictionResponse(
            prediction=round(prediction, 2),
            prediction_inr=prediction_inr,
            features=request.features
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Prediction failed: {str(e)}"
        )

@app.post("/predict/batch", response_model=BatchPredictionResponse)
async def predict_batch(request: BatchPredictionRequest):
    try:
        features_list = [feature.dict() for feature in request.features]
        predictions = model_instance.predict_batch(features_list)
        predictions_inr = [format_inr(p) for p in predictions]
        
        return BatchPredictionResponse(
            predictions=[round(p, 2) for p in predictions],
            predictions_inr=predictions_inr
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Batch prediction failed: {str(e)}"
        )

@app.get("/model-info", response_model=ModelInfoResponse)
async def get_model_info():
    if not model_instance.metrics:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Model information not available"
        )
    
    metrics = model_instance.metrics
    return ModelInfoResponse(
        model_type=metrics['model_type'],
        features_used=metrics['features_used'],
        coefficients=metrics['coefficients'],
        intercept=metrics['intercept'],
        r2_score=metrics['r2_score'],
        rmse=metrics['rmse'],
        rmse_inr=format_inr(metrics['rmse']),
        mae=metrics['mae'],
        mae_inr=format_inr(metrics['mae']),
        training_samples=metrics['training_samples'],
        feature_importance=metrics.get('feature_importance', None),
        currency="INR"
    )

# Market Analysis Endpoints
@app.get("/market/stats", response_model=MarketAnalysisResponse)
async def get_market_analysis():
    """Get comprehensive market analysis"""
    df = load_training_data()
    if df is None:
        raise HTTPException(status_code=404, detail="Training data not found")
    
    # Basic statistics
    stats = MarketStats(
        total_houses=len(df),
        avg_price=df['price'].mean(),
        avg_price_inr=format_inr(df['price'].mean()),
        min_price=df['price'].min(),
        min_price_inr=format_inr(df['price'].min()),
        max_price=df['price'].max(),
        max_price_inr=format_inr(df['price'].max()),
        avg_square_footage=df['square_footage'].mean(),
        avg_bedrooms=df['bedrooms'].mean(),
        avg_bathrooms=df['bathrooms'].mean(),
        avg_year_built=df['year_built'].mean(),
        avg_school_rating=df['school_rating'].mean()
    )
    
    # Price distribution
    bins = [0, 200000, 300000, 400000, 500000, float('inf')]
    labels = ['< ₹2L', '₹2L-3L', '₹3L-4L', '₹4L-5L', '> ₹5L']
    df['price_range'] = pd.cut(df['price'], bins=bins, labels=labels, right=False)
    distribution = df['price_range'].value_counts()
    
    distribution_list = []
    for label in labels:
        count = distribution.get(label, 0)
        distribution_list.append(
            PriceDistribution(
                price_range=label,
                count=int(count),
                percentage=round((count / len(df)) * 100, 2)
            )
        )
    
    # Feature correlations with price
    feature_cols = ['square_footage', 'bedrooms', 'bathrooms', 'year_built', 
                    'lot_size', 'distance_to_city_center', 'school_rating']
    correlations = []
    for col in feature_cols:
        corr = df[col].corr(df['price'])
        correlations.append(FeatureCorrelation(feature=col, correlation=round(corr, 3)))
    
    # Top features by importance
    if model_instance.metrics and 'feature_importance' in model_instance.metrics:
        top_features = sorted(
            model_instance.metrics['feature_importance'],
            key=lambda x: x['importance'],
            reverse=True
        )[:5]
    else:
        top_features = []
    
    return MarketAnalysisResponse(
        stats=stats,
        distribution=distribution_list,
        correlations=sorted(correlations, key=lambda x: abs(x.correlation), reverse=True),
        top_features=top_features
    )

@app.get("/market/history")
async def get_prediction_history():
    """Get prediction history (in-memory for demo)"""
    # In production, this would query a database
    return {"history": []}

@app.get("/")
async def root():
    return {
        "message": "Housing Price Prediction API",
        "version": "1.0.0",
        "currency": "Indian Rupees (₹)",
        "endpoints": {
            "docs": "/docs",
            "health": "/health",
            "predict": "/predict",
            "predict_batch": "/predict/batch",
            "model_info": "/model-info",
            "market_stats": "/market/stats"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)