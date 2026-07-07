import React from 'react';
import { FaFilter, FaTimes } from 'react-icons/fa';

function FilterControls({ filters, onFilterChange }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({
      ...filters,
      [name]: parseFloat(value) || 0
    });
  };

  const resetFilters = () => {
    onFilterChange({
      minPrice: 0,
      maxPrice: 500000,
      minBedrooms: 0,
      maxBedrooms: 5,
      minBathrooms: 0,
      maxBathrooms: 3
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-semibold text-gray-800 flex items-center">
          <FaFilter className="mr-2 text-primary-600" />
          Filters
        </h4>
        <button
          onClick={resetFilters}
          className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700"
        >
          <FaTimes />
          <span>Reset</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price Range (₹)
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleChange}
              placeholder="Min"
              className="w-full input-field text-sm"
            />
            <span className="text-gray-500">to</span>
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleChange}
              placeholder="Max"
              className="w-full input-field text-sm"
            />
          </div>
        </div>

        {/* Bedrooms */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bedrooms
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              name="minBedrooms"
              value={filters.minBedrooms}
              onChange={handleChange}
              placeholder="Min"
              className="w-full input-field text-sm"
              min="0"
              max="10"
            />
            <span className="text-gray-500">to</span>
            <input
              type="number"
              name="maxBedrooms"
              value={filters.maxBedrooms}
              onChange={handleChange}
              placeholder="Max"
              className="w-full input-field text-sm"
              min="0"
              max="10"
            />
          </div>
        </div>

        {/* Bathrooms */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bathrooms
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              name="minBathrooms"
              value={filters.minBathrooms}
              onChange={handleChange}
              placeholder="Min"
              className="w-full input-field text-sm"
              min="0"
              max="5"
              step="0.5"
            />
            <span className="text-gray-500">to</span>
            <input
              type="number"
              name="maxBathrooms"
              value={filters.maxBathrooms}
              onChange={handleChange}
              placeholder="Max"
              className="w-full input-field text-sm"
              min="0"
              max="5"
              step="0.5"
            />
          </div>
        </div>
      </div>

      {/* Active Filters Summary */}
      <div className="mt-3 flex flex-wrap gap-2">
        {(filters.minPrice > 0 || filters.maxPrice < 500000) && (
          <span className="inline-flex items-center px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
            Price: ₹{filters.minPrice.toLocaleString()} - ₹{filters.maxPrice.toLocaleString()}
          </span>
        )}
        {(filters.minBedrooms > 0 || filters.maxBedrooms < 5) && (
          <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
            Beds: {filters.minBedrooms} - {filters.maxBedrooms}
          </span>
        )}
        {(filters.minBathrooms > 0 || filters.maxBathrooms < 3) && (
          <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
            Baths: {filters.minBathrooms} - {filters.maxBathrooms}
          </span>
        )}
      </div>
    </div>
  );
}

export default FilterControls;