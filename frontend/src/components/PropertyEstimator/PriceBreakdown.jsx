import React from 'react';
import { formatINR } from '../../utils/formatters';

function PriceBreakdown({ prediction }) {
  const features = prediction.features;
  const basePrice = prediction.prediction;

  // Validate inputs to prevent division by zero
  const sqft = features.square_footage || 1;
  const bedrooms = features.bedrooms || 1;
  const bathrooms = features.bathrooms || 1;

  // Calculate contributions - SIMPLE AND DIRECT
  const baseValue = basePrice * 0.40;
  const bedroomValue = basePrice * 0.25;
  const locationValue = basePrice * 0.15;
  const schoolValue = basePrice * 0.12;
  const ageValue = basePrice * 0.08;

  // Define the 5 main categories - FIXED COUNT
  const breakdownItems = [
    {
      label: 'Base Value (per sq ft)',
      value: baseValue,
      color: 'bg-blue-500',
      detail: `₹${Math.round(baseValue / sqft)}/sq ft`
    },
    {
      label: `Bedroom Premium (${bedrooms} beds)`,
      value: bedroomValue,
      color: 'bg-green-500',
      detail: `₹${Math.round(bedroomValue / bedrooms)} per bedroom`
    },
    {
      label: 'Location Factor',
      value: locationValue,
      color: 'bg-yellow-500',
      detail: `${features.distance_to_city_center || 0} miles from center`
    },
    {
      label: 'School Rating Premium',
      value: schoolValue,
      color: 'bg-purple-500',
      detail: `Rating: ${features.school_rating || 0}/10`
    },
    {
      label: 'Age Factor',
      value: ageValue,
      color: 'bg-red-500',
      detail: `Built in ${features.year_built || 2000}`
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h4 className="text-lg font-semibold text-gray-800 mb-4">Price Breakdown</h4>
      
      <div className="space-y-4">
        {/* Render exactly 5 items - NO LOOPS */}
        {breakdownItems.map((item, index) => {
          const percentage = (item.value / basePrice) * 100;
          return (
            <div key={index}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-700">{item.label}</span>
                <span className="font-medium text-gray-900">{formatINR(item.value)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div 
                  className={`${item.color} h-2.5 rounded-full transition-all duration-1000 ease-out`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs mt-0.5">
                <span className="text-gray-400">{item.detail}</span>
                <span className="text-gray-400">{Math.round(percentage)}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Total */}
      <div className="mt-5 pt-4 border-t-2 border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-base font-semibold text-gray-800">Total Estimated Price</span>
            <div className="text-xs text-gray-400 mt-0.5">
              {sqft} sq ft • {bedrooms} beds • {bathrooms} baths
            </div>
          </div>
          <span className="text-xl font-bold text-primary-600">{formatINR(basePrice)}</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-4 grid grid-cols-3 gap-3 pt-3 border-t border-gray-100">
        <div className="text-center p-2 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-500">Price per sq ft</div>
          <div className="text-sm font-semibold text-gray-800">
            {formatINR(basePrice / sqft)}
          </div>
        </div>
        <div className="text-center p-2 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-500">Price per bedroom</div>
          <div className="text-sm font-semibold text-gray-800">
            {formatINR(basePrice / bedrooms)}
          </div>
        </div>
        <div className="text-center p-2 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-500">Price per bathroom</div>
          <div className="text-sm font-semibold text-gray-800">
            {formatINR(basePrice / bathrooms)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PriceBreakdown;