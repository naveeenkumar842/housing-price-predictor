import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import r2_score, mean_squared_error, mean_absolute_error
import joblib
import os
from pathlib import Path

def format_inr(amount):
    """Format number as Indian Rupees"""
    amount = int(round(amount))
    s = str(amount)[::-1]
    if len(s) <= 3:
        return f"₹{s[::-1]}"
    formatted = s[:3][::-1] + ',' + ','.join(s[3:][i:i+2][::-1] for i in range(0, len(s[3:]), 2))[::-1]
    return f"₹{formatted}"

def train_and_save_model():
    """Train the model and save it to disk"""
    
    # Load your dataset
    data_path = Path('data/House Price Dataset.csv')
    if not data_path.exists():
        # If running from different directory, try relative path
        data_path = Path('../data/House Price Dataset.csv')
    
    # Read the dataset
    df = pd.read_csv(data_path)
    
    # Separate features and target
    X = df.drop(['id', 'price'], axis=1)  # Remove id and target
    y = df['price']
    
    print(f"Dataset shape: {X.shape}")
    print(f"Features: {list(X.columns)}")
    print(f"Price range: {format_inr(y.min())} - {format_inr(y.max())}")
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train Linear Regression model
    lr_model = LinearRegression()
    lr_model.fit(X_train_scaled, y_train)
    
    # Train Random Forest model (for comparison)
    rf_model = RandomForestRegressor(n_estimators=100, random_state=42)
    rf_model.fit(X_train_scaled, y_train)
    
    # Make predictions with Linear Regression
    y_pred_lr = lr_model.predict(X_test_scaled)
    
    # Calculate metrics for Linear Regression
    r2_lr = r2_score(y_test, y_pred_lr)
    rmse_lr = np.sqrt(mean_squared_error(y_test, y_pred_lr))
    mae_lr = mean_absolute_error(y_test, y_pred_lr)
    
    # Make predictions with Random Forest
    y_pred_rf = rf_model.predict(X_test_scaled)
    
    # Calculate metrics for Random Forest
    r2_rf = r2_score(y_test, y_pred_rf)
    rmse_rf = np.sqrt(mean_squared_error(y_test, y_pred_rf))
    mae_rf = mean_absolute_error(y_test, y_pred_rf)
    
    print("\n" + "="*50)
    print("MODEL PERFORMANCE COMPARISON")
    print("="*50)
    print(f"\nLinear Regression:")
    print(f"  R² Score: {r2_lr:.4f}")
    print(f"  RMSE: {format_inr(rmse_lr)}")
    print(f"  MAE: {format_inr(mae_lr)}")
    print(f"\nRandom Forest:")
    print(f"  R² Score: {r2_rf:.4f}")
    print(f"  RMSE: {format_inr(rmse_rf)}")
    print(f"  MAE: {format_inr(mae_rf)}")
    
    # Choose the best model (based on R² score)
    if r2_rf > r2_lr:
        best_model = rf_model
        best_metrics = {
            'model_type': 'Random Forest Regressor',
            'r2_score': r2_rf,
            'rmse': rmse_rf,
            'mae': mae_rf
        }
        print(f"\n✅ Random Forest selected as best model")
    else:
        best_model = lr_model
        best_metrics = {
            'model_type': 'Linear Regression',
            'r2_score': r2_lr,
            'rmse': rmse_lr,
            'mae': mae_lr
        }
        print(f"\n✅ Linear Regression selected as best model")
    
    # Save model and scaler
    model_dir = Path('models')
    model_dir.mkdir(exist_ok=True)
    
    joblib.dump(best_model, 'models/model.pkl')
    joblib.dump(scaler, 'models/scaler.pkl')
    
    # Save metrics
    metrics = {
        'model_type': best_metrics['model_type'],
        'features_used': list(X.columns),
        'coefficients': best_model.feature_importances_.tolist() if hasattr(best_model, 'feature_importances_') else best_model.coef_.tolist(),
        'intercept': best_model.intercept_ if hasattr(best_model, 'intercept_') else 0,
        'r2_score': best_metrics['r2_score'],
        'rmse': best_metrics['rmse'],
        'mae': best_metrics['mae'],
        'training_samples': len(X_train),
        'feature_importance': [
            {'feature': feature, 'importance': importance}
            for feature, importance in zip(X.columns, 
                best_model.feature_importances_.tolist() if hasattr(best_model, 'feature_importances_') else best_model.coef_.tolist())
        ]
    }
    
    joblib.dump(metrics, 'models/metrics.pkl')
    
    print(f"\n✅ Model saved successfully!")
    print(f"Training samples: {len(X_train)}")
    print(f"Model metrics saved in INR format")
    print("="*50)
    
    return best_model, scaler, metrics

if __name__ == "__main__":
    train_and_save_model()