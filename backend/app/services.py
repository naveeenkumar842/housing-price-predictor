import joblib
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_squared_error
from sklearn.preprocessing import StandardScaler
import os
from pathlib import Path
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class HousingModelService:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialize()
        return cls._instance
    
    def _initialize(self):
        self.model = None
        self.scaler = None
        self.feature_names = None
        self.r2_score = None
        self.mse = None
        self.rmse = None
        self.intercept = None
        self.coefficients = None
        self.n_features = 0
        self.n_samples = 0
        self._load_or_train_model()
    
    def _load_or_train_model(self):
        model_path = Path("models/housing_model.pkl")
        if model_path.exists() and model_path.stat().st_size > 0:
            try:
                logger.info("Loading existing model...")
                self._load_model(model_path)
                return
            except Exception as e:
                logger.warning(f"Failed to load model: {e}. Retraining...")
                os.remove(model_path)
        
        logger.info("Training new model...")
        self._train_and_save_model(model_path)
    
    def _load_model(self, path):
        try:
            model_data = joblib.load(path)
            self.model = model_data['model']
            self.scaler = model_data.get('scaler')
            self.feature_names = model_data['feature_names']
            self.r2_score = model_data['r2_score']
            self.mse = model_data['mse']
            self.rmse = model_data['rmse']
            self.intercept = model_data['intercept']
            self.coefficients = model_data['coefficients']
            self.n_features = model_data.get('n_features', len(self.feature_names))
            self.n_samples = model_data.get('n_samples', 0)
            logger.info(f"Model loaded. R²: {self.r2_score:.4f}")
        except Exception as e:
            logger.error(f"Failed to load model: {e}")
            raise
    
    def _train_and_save_model(self, path):
        try:
            data_paths = [
                Path("data/House Price Dataset.csv"),
                Path("data/house_price_dataset.csv"),
                Path("../data/House Price Dataset.csv")
            ]
            
            df = None
            for data_path in data_paths:
                if data_path.exists():
                    df = pd.read_csv(data_path)
                    logger.info(f"Loaded {len(df)} samples from {data_path}")
                    break
            
            if df is None:
                raise FileNotFoundError("Dataset not found. Please add House Price Dataset.csv to data/ folder.")
            
            self.feature_names = ['square_footage', 'bedrooms', 'bathrooms', 
                                 'year_built', 'lot_size', 'distance_to_city_center', 
                                 'school_rating']
            
            X = df[self.feature_names]
            y = df['price']
            
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42
            )
            
            self.scaler = StandardScaler()
            X_train_scaled = self.scaler.fit_transform(X_train)
            X_test_scaled = self.scaler.transform(X_test)
            
            self.model = LinearRegression()
            self.model.fit(X_train_scaled, y_train)
            
            y_pred = self.model.predict(X_test_scaled)
            self.r2_score = r2_score(y_test, y_pred)
            self.mse = mean_squared_error(y_test, y_pred)
            self.rmse = np.sqrt(self.mse)
            self.intercept = self.model.intercept_
            self.coefficients = self.model.coef_.tolist()
            self.n_features = len(self.feature_names)
            self.n_samples = len(X)
            
            logger.info(f"Model trained. R²: {self.r2_score:.4f}, RMSE: ${self.rmse:,.2f}")
            
            os.makedirs("models", exist_ok=True)
            model_data = {
                'model': self.model,
                'scaler': self.scaler,
                'feature_names': self.feature_names,
                'r2_score': self.r2_score,
                'mse': self.mse,
                'rmse': self.rmse,
                'intercept': self.intercept,
                'coefficients': self.coefficients,
                'n_features': self.n_features,
                'n_samples': self.n_samples
            }
            joblib.dump(model_data, path)
            logger.info(f"Model saved to {path}")
            
        except Exception as e:
            logger.error(f"Training failed: {e}")
            raise
    
    def predict_single(self, features_dict):
        if self.model is None:
            raise ValueError("Model not loaded")
        
        features = np.array([[
            features_dict.get('square_footage', 0),
            features_dict.get('bedrooms', 0),
            features_dict.get('bathrooms', 0),
            features_dict.get('year_built', 0),
            features_dict.get('lot_size', 0),
            features_dict.get('distance_to_city_center', 0),
            features_dict.get('school_rating', 0)
        ]])
        
        if self.scaler:
            features = self.scaler.transform(features)
        
        prediction = self.model.predict(features)[0]
        return float(prediction)
    
    def predict_batch(self, features_list):
        if self.model is None:
            raise ValueError("Model not loaded")
        
        features_array = np.array([[
            f.get('square_footage', 0),
            f.get('bedrooms', 0),
            f.get('bathrooms', 0),
            f.get('year_built', 0),
            f.get('lot_size', 0),
            f.get('distance_to_city_center', 0),
            f.get('school_rating', 0)
        ] for f in features_list])
        
        if self.scaler:
            features_array = self.scaler.transform(features_array)
        
        predictions = self.model.predict(features_array)
        return [float(p) for p in predictions]
    
    def get_model_info(self):
        return {
            'coefficients': self.coefficients,
            'feature_names': self.feature_names,
            'r2_score': self.r2_score,
            'mse': self.mse,
            'rmse': self.rmse,
            'intercept': self.intercept,
            'n_features': self.n_features,
            'n_samples': self.n_samples
        }