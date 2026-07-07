from pydantic import BaseModel, Field
from typing import List, Optional

class HousingFeatures(BaseModel):
    """Housing features for prediction"""
    square_footage: float = Field(..., ge=500, le=5000)
    bedrooms: float = Field(..., ge=1, le=10)
    bathrooms: float = Field(..., ge=0.5, le=5)
    year_built: float = Field(..., ge=1950, le=2025)
    lot_size: float = Field(..., ge=1000, le=20000)
    distance_to_city_center: float = Field(..., ge=0.5, le=20)
    school_rating: float = Field(..., ge=1, le=10)

    class Config:
        json_schema_extra = {
            "example": {
                "square_footage": 1850,
                "bedrooms": 3,
                "bathrooms": 2,
                "year_built": 1998,
                "lot_size": 7500,
                "distance_to_city_center": 5.6,
                "school_rating": 8.2
            }
        }

class PredictionRequest(BaseModel):
    features: HousingFeatures

class BatchPredictionRequest(BaseModel):
    features: List[HousingFeatures]

class PredictionResponse(BaseModel):
    prediction: float
    prediction_inr: str
    features: HousingFeatures

class BatchPredictionResponse(BaseModel):
    predictions: List[float]
    predictions_inr: List[str]

class ModelInfoResponse(BaseModel):
    model_type: str
    features_used: List[str]
    coefficients: List[float]
    intercept: float
    r2_score: float
    rmse: float
    rmse_inr: str
    mae: float
    mae_inr: str
    training_samples: int
    feature_importance: Optional[List[dict]] = None
    currency: str = "INR"
    
    class Config:
        protected_namespaces = ()

# Market Analysis Schemas
class MarketStats(BaseModel):
    total_houses: int
    avg_price: float
    avg_price_inr: str
    min_price: float
    min_price_inr: str
    max_price: float
    max_price_inr: str
    avg_square_footage: float
    avg_bedrooms: float
    avg_bathrooms: float
    avg_year_built: float
    avg_school_rating: float

class PriceDistribution(BaseModel):
    price_range: str
    count: int
    percentage: float

class FeatureCorrelation(BaseModel):
    feature: str
    correlation: float

class MarketAnalysisResponse(BaseModel):
    stats: MarketStats
    distribution: List[PriceDistribution]
    correlations: List[FeatureCorrelation]
    top_features: List[dict]