import React from 'react';
import { formatDate } from '../../utils/formatters';

function PredictionResult({ prediction }) {
  const features = prediction.features;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-primary-500">
      <h4 className="text-lg font-semibold text-gray-800 mb-4">Prediction Result</h4>
      
      <div className="mb-4 p-4 bg-primary-50 rounded-lg">
        <div className="text-sm text-primary-600 mb-1">Estimated Property Value</div>
        <div className="text-3xl font-bold text-primary-700">
          {prediction.prediction_inr}
        </div>
        <div className="text-sm text-gray-500 mt-1">
          {formatDate(new Date().toISOString())}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex justify-between py-2 px-3 bg-gray-50 rounded-lg">
          <span className="text-gray-600">Square Footage</span>
          <span className="font-medium">{features.square_footage}</span>
        </div>
        <div className="flex justify-between py-2 px-3 bg-gray-50 rounded-lg">
          <span className="text-gray-600">Bedrooms</span>
          <span className="font-medium">{features.bedrooms}</span>
        </div>
        <div className="flex justify-between py-2 px-3 bg-gray-50 rounded-lg">
          <span className="text-gray-600">Bathrooms</span>
          <span className="font-medium">{features.bathrooms}</span>
        </div>
        <div className="flex justify-between py-2 px-3 bg-gray-50 rounded-lg">
          <span className="text-gray-600">Year Built</span>
          <span className="font-medium">{features.year_built}</span>
        </div>
        <div className="flex justify-between py-2 px-3 bg-gray-50 rounded-lg">
          <span className="text-gray-600">Lot Size</span>
          <span className="font-medium">{features.lot_size.toLocaleString()} sq ft</span>
        </div>
        <div className="flex justify-between py-2 px-3 bg-gray-50 rounded-lg">
          <span className="text-gray-600">Distance to City</span>
          <span className="font-medium">{features.distance_to_city_center} mi</span>
        </div>
        <div className="flex justify-between py-2 px-3 bg-gray-50 rounded-lg col-span-2">
          <span className="text-gray-600">School Rating</span>
          <span className="font-medium">{features.school_rating}/10</span>
        </div>
      </div>
    </div>
  );
}

export default PredictionResult;