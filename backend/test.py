import pandas as pd
import requests
import sys
from app.utils import format_inr

def test_predictions():
    """Test the API with provided test data"""
    
    try:
        # Load test data
        test_data = pd.read_csv('data/Test Data For Prediction.csv')
        print(f"📊 Testing {len(test_data)} houses")
        print("-" * 40)
        
        # Make predictions for each house
        for idx, row in test_data.iterrows():
            features = row.to_dict()
            
            try:
                response = requests.post(
                    'http://localhost:8000/predict',
                    json={'features': features},
                    timeout=10
                )
                
                if response.status_code == 200:
                    result = response.json()
                    # Use the formatted INR from the API
                    print(f"House {idx+1}: {result['prediction_inr']}")
                else:
                    print(f"House {idx+1}: Error {response.status_code}")
                    
            except requests.exceptions.ConnectionError:
                print("❌ Error: Cannot connect to API. Make sure the server is running.")
                print("   Run: uvicorn app.main:app --reload")
                return
            except Exception as e:
                print(f"House {idx+1}: Error - {str(e)}")
                
    except FileNotFoundError:
        print("❌ Error: Test data file not found.")
        print("   Make sure 'data/Test Data For Prediction.csv' exists.")
    except Exception as e:
        print(f"❌ Error: {str(e)}")


response = requests.get('http://localhost:8000/model-info')
model_info = response.json()
print(f"Model: {model_info['model_type']}")
print(f"R² Score: {model_info['r2_score']:.4f}")
print(f"RMSE: {model_info['rmse_inr']}")
print(f"MAE: {model_info['mae_inr']}")

if __name__ == "__main__":
    test_predictions()