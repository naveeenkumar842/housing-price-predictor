# Housing Price Prediction API 🇮🇳

A FastAPI-based REST API for predicting housing prices in **Indian Rupees (₹)** using machine learning models.

## Features

- **Single Prediction**: Predict housing price in ₹ from individual features
- **Batch Prediction**: Predict housing prices for multiple feature sets
- **Indian Rupee Formatting**: All prices displayed in ₹ with proper Indian numbering (lakhs/crores)
- **Model Information**: Get model coefficients and performance metrics in ₹
- **Health Check**: Simple endpoint to verify API status
- **OpenAPI/Swagger Documentation**: Interactive API documentation

## Dataset

The model is trained on a housing dataset with the following features:
- `square_footage`: Total square footage
- `bedrooms`: Number of bedrooms
- `bathrooms`: Number of bathrooms
- `year_built`: Year the house was built
- `lot_size`: Lot size in square feet
- `distance_to_city_center`: Distance to city center in miles
- `school_rating`: School rating out of 10
- `price`: Target variable (house price in ₹)

## Currency Formatting

All monetary values are displayed in **Indian Rupees (₹)** with proper Indian numbering:
- Single digit: ₹10,000
- Thousands: ₹1,00,000 (1 lakh)
- Millions: ₹10,00,000 (10 lakhs)
- Billions: ₹1,00,00,000 (1 crore)

## Installation

### Local Development

1. Clone the repository:
```bash
git clone <repository-url>
cd housing-price-api