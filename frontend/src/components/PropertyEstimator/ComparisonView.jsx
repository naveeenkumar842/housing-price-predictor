import React from 'react';
import { FaTimes } from 'react-icons/fa';
import { formatINR } from '../../utils/formatters';

function ComparisonView({ features, onClear }) {
  if (features.length === 0) return null;

  const fields = ['square_footage', 'bedrooms', 'bathrooms', 'year_built', 'lot_size', 'distance_to_city_center', 'school_rating'];
  const fieldLabels = ['Sq Ft', 'Beds', 'Baths', 'Year Built', 'Lot Size', 'Distance', 'School Rating'];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-semibold text-gray-800">Property Comparison</h4>
        <button
          onClick={onClear}
          className="text-sm text-red-600 hover:text-red-800"
        >
          Clear All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-3 py-2 text-left">Property</th>
              {fields.map((field, index) => (
                <th key={field} className="px-3 py-2 text-left">{fieldLabels[index]}</th>
              ))}
              <th className="px-3 py-2 text-left">Estimated Price</th>
            </tr>
          </thead>
          <tbody>
            {features.map((feature, index) => (
              <tr key={index} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-3 py-2 font-medium">
                  #{index + 1}
                </td>
                {fields.map(field => (
                  <td key={field} className="px-3 py-2">{feature[field]}</td>
                ))}
                <td className="px-3 py-2 font-semibold text-primary-600">
                  {formatINR(feature.predicted_price || 0)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ComparisonView;