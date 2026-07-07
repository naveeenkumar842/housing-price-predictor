import React from 'react';

// Simple INR formatter without any external dependencies
const formatINR = (amount) => {
  if (!amount) return '₹0';
  const num = Math.round(Math.abs(amount));
  const str = num.toString();
  if (str.length <= 3) return `₹${str}`;
  
  const reversed = str.split('').reverse();
  const parts = [];
  parts.push(reversed.splice(0, 3).reverse().join(''));
  while (reversed.length > 0) {
    parts.push(reversed.splice(0, 2).reverse().join(''));
  }
  return `₹${parts.reverse().join(',')}`;
};

function PriceBreakdownNew({ prediction }) {
  console.log('✅ NEW COMPONENT LOADED - NO LOOPS!');
  
  const features = prediction.features;
  const basePrice = prediction.prediction;

  // Safety checks
  const sqft = features.square_footage || 1;
  const bedrooms = features.bedrooms || 1;
  const bathrooms = features.bathrooms || 1;

  // Calculate contributions - SIMPLE MATH
  const baseValue = Math.round(basePrice * 0.40);
  const bedroomValue = Math.round(basePrice * 0.25);
  const locationValue = Math.round(basePrice * 0.15);
  const schoolValue = Math.round(basePrice * 0.12);
  const ageValue = Math.round(basePrice * 0.08);

  // ONLY 5 ITEMS - NO LOOPS!
  const breakdownData = [
    {
      label: 'Base Value (per sq ft)',
      value: baseValue,
      detail: `${formatINR(Math.round(baseValue / sqft))}/sq ft`,
      pct: 40,
      barColor: 'bg-blue-500'
    },
    {
      label: `Bedroom Premium (${bedrooms} beds)`,
      value: bedroomValue,
      detail: `${formatINR(Math.round(bedroomValue / bedrooms))}/bedroom`,
      pct: 25,
      barColor: 'bg-green-500'
    },
    {
      label: 'Location Factor',
      value: locationValue,
      detail: `${features.distance_to_city_center || 0} miles from center`,
      pct: 15,
      barColor: 'bg-yellow-500'
    },
    {
      label: 'School Rating Premium',
      value: schoolValue,
      detail: `Rating: ${features.school_rating || 0}/10`,
      pct: 12,
      barColor: 'bg-purple-500'
    },
    {
      label: 'Age Factor',
      value: ageValue,
      detail: `Built in ${features.year_built || 2000}`,
      pct: 8,
      barColor: 'bg-red-500'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h4 className="text-lg font-semibold text-gray-800 mb-4">💰 Price Breakdown</h4>
      
      {/* Render exactly 5 items */}
      {breakdownData.map((item, index) => (
        <div key={index} className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-gray-700">{item.label}</span>
            <span className="font-bold text-gray-900">{formatINR(item.value)}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div 
              className={`${item.barColor} h-2.5 rounded-full transition-all duration-1000`}
              style={{ width: `${item.pct}%` }}
            />
          </div>
          <div className="flex justify-between text-xs mt-0.5">
            <span className="text-gray-400">{item.detail}</span>
            <span className="text-gray-400">{item.pct}%</span>
          </div>
        </div>
      ))}

      {/* Total */}
      <div className="mt-4 pt-4 border-t-2 border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <span className="font-semibold text-gray-800">Total Estimated Price</span>
            <div className="text-xs text-gray-400">
              {sqft} sq ft • {bedrooms} beds • {bathrooms} baths
            </div>
          </div>
          <span className="text-2xl font-bold text-primary-600">{formatINR(basePrice)}</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="text-center p-2 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-500">Per sq ft</div>
          <div className="font-bold text-gray-800">{formatINR(Math.round(basePrice / sqft))}</div>
        </div>
        <div className="text-center p-2 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-500">Per bedroom</div>
          <div className="font-bold text-gray-800">{formatINR(Math.round(basePrice / bedrooms))}</div>
        </div>
        <div className="text-center p-2 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-500">Per bathroom</div>
          <div className="font-bold text-gray-800">{formatINR(Math.round(basePrice / bathrooms))}</div>
        </div>
      </div>
    </div>
  );
}

export default PriceBreakdownNew;