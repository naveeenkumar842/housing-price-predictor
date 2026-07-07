import joblib
from pathlib import Path
import pandas as pd
import numpy as np
import os

class HousingPriceModel:
    def __init__(self):
        self.feature_names = [
            'square_footage', 'bedrooms', 'bathrooms', 'year_built',
            'lot_size', 'distance_to_city_center', 'school_rating'
        ]
        self.model = None
        self.scaler = None
        self.metrics = None
        self.load_models()
    
    def load_models(self):
        """Load the trained model, scaler, and metrics"""
        model_path = Path('/app/models/model.pkl')
        scaler_path = Path('/app/models/scaler.pkl')
        metrics_path = Path('/app/models/metrics.pkl')
        
        if model_path.exists() and scaler_path.exists() and metrics_path.exists():
            try:
                self.model = joblib.load(model_path)
                self.scaler = joblib.load(scaler_path)
                self.metrics = joblib.load(metrics_path)
                print("✅ Models loaded successfully!")
                return
            except Exception as e:
                print(f"⚠️ Error loading models: {e}")
                print("🔄 Creating dummy model...")
        else:
            print("⚠️ Model files not found. Creating dummy model for demonstration...")
        
        # Create dummy model if loading fails
        self._create_dummy_model()
    
    def _create_dummy_model(self):
        """Create a dummy model if no trained model exists"""
        from sklearn.ensemble import RandomForestRegressor
        import numpy as np
        
        self.model = RandomForestRegressor(n_estimators=10, random_state=42)
        # Set dummy feature importances
        self.model.feature_importances_ = np.array([0.3, 0.15, 0.1, 0.05, 0.2, 0.1, 0.1])
        self.scaler = None
        self.metrics = {
            'model_type': 'Random Forest Regressor (Dummy)',
            'features_used': self.feature_names,
            'coefficients': self.model.feature_importances_.tolist(),
            'intercept': 0,
            'r2_score': 0.85,
            'rmse': 25000,
            'mae': 18000,
            'training_samples': 40,
            'feature_importance': [
                {'feature': f, 'importance': imp}
                for f, imp in zip(self.feature_names, self.model.feature_importances_)
            ]
        }
        print("⚠️ Using dummy model for demonstration")
    
    def predict(self, features_dict):
        """Make a single prediction"""
        df = pd.DataFrame([features_dict])[self.feature_names]
        
        if self.scaler:
            X_scaled = self.scaler.transform(df)
        else:
            X_scaled = df.values
        
        prediction = self.model.predict(X_scaled)[0]
        return float(prediction)
    
    def predict_batch(self, features_list):
        """Make batch predictions"""
        df = pd.DataFrame(features_list)[self.feature_names]
        
        if self.scaler:
            X_scaled = self.scaler.transform(df)
        else:
            X_scaled = df.values
        
        predictions = self.model.predict(X_scaled)
        return [float(p) for p in predictions]

# Singleton instance
model_instance = HousingPriceModel()