import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import LoadingSpinner from '../Common/LoadingSpinner';

function EstimatorForm({ onSubmit, loading, onBatchPredict }) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [batchMode, setBatchMode] = useState(false);
  const [batchData, setBatchData] = useState('');

  const fields = [
    { name: 'square_footage', label: 'Square Footage', type: 'number', step: 'any', placeholder: 'e.g., 1850', min: 500, max: 5000, default: 1850 },
    { name: 'bedrooms', label: 'Bedrooms', type: 'number', step: 'any', placeholder: 'e.g., 3', min: 1, max: 10, default: 3 },
    { name: 'bathrooms', label: 'Bathrooms', type: 'number', step: 'any', placeholder: 'e.g., 2', min: 0.5, max: 5, default: 2 },
    { name: 'year_built', label: 'Year Built', type: 'number', step: 'any', placeholder: 'e.g., 1998', min: 1950, max: 2025, default: 2000 },
    { name: 'lot_size', label: 'Lot Size (sq ft)', type: 'number', step: 'any', placeholder: 'e.g., 7500', min: 1000, max: 20000, default: 7500 },
    { name: 'distance_to_city_center', label: 'Distance to City Center (miles)', type: 'number', step: 'any', placeholder: 'e.g., 5.6', min: 0.5, max: 20, default: 5 },
    { name: 'school_rating', label: 'School Rating (1-10)', type: 'number', step: 'any', placeholder: 'e.g., 8.2', min: 1, max: 10, default: 8 },
  ];

  const handleSingleSubmit = (data) => {
    const numericData = {};
    Object.keys(data).forEach(key => {
      numericData[key] = parseFloat(data[key]) || 0;
    });
    onSubmit(numericData);
  };

  const handleBatchSubmit = () => {
    try {
      const rows = batchData.trim().split('\n').filter(row => row.trim());
      const featuresList = rows.map(row => {
        const values = row.split(',').map(v => parseFloat(v.trim()));
        const fields = ['square_footage', 'bedrooms', 'bathrooms', 'year_built', 'lot_size', 'distance_to_city_center', 'school_rating'];
        const features = {};
        fields.forEach((field, index) => {
          features[field] = values[index] || 0;
        });
        return features;
      });
      onBatchPredict(featuresList);
    } catch (error) {
      toast.error('Invalid batch data format. Please check your input.');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Property Details</h3>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setBatchMode(false)}
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
              !batchMode ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Single
          </button>
          <button
            type="button"
            onClick={() => setBatchMode(true)}
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
              batchMode ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Batch
          </button>
        </div>
      </div>

      {!batchMode ? (
        <form onSubmit={handleSubmit(handleSingleSubmit)} className="space-y-4">
          {fields.map(({ name, label, type, step, placeholder, min, max, default: defaultValue }) => (
            <div key={name}>
              <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
                {label}
              </label>
              <input
                {...register(name, { 
                  required: `${label} is required`,
                  valueAsNumber: true,
                  min: { value: min, message: `${label} must be at least ${min}` },
                  max: { value: max, message: `${label} must be at most ${max}` }
                })}
                id={name}
                type={type}
                step={step}
                placeholder={placeholder}
                defaultValue={defaultValue}
                className={`input-field ${errors[name] ? 'border-red-500 focus:ring-red-500' : ''}`}
                disabled={loading}
              />
              {errors[name] && (
                <p className="mt-1 text-sm text-red-600">{errors[name].message}</p>
              )}
            </div>
          ))}

          <button
            type="submit"
            className="w-full btn-primary py-3 text-lg font-semibold"
            disabled={loading}
          >
            {loading ? <LoadingSpinner size="sm" /> : 'Predict Price 🏠'}
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Batch Data (CSV format)
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Enter one property per line: square_footage,bedrooms,bathrooms,year_built,lot_size,distance_to_city_center,school_rating
            </p>
            <textarea
              value={batchData}
              onChange={(e) => setBatchData(e.target.value)}
              rows={6}
              className="input-field font-mono text-sm"
              placeholder="1850,3,2,1998,7500,5.6,8.2&#10;1550,3,2,1997,6800,4.1,7.6"
              disabled={loading}
            />
          </div>
          <button
            type="button"
            onClick={handleBatchSubmit}
            className="w-full btn-primary py-3 text-lg font-semibold"
            disabled={loading || !batchData.trim()}
          >
            {loading ? <LoadingSpinner size="sm" /> : 'Predict Batch 📊'}
          </button>
        </div>
      )}
    </div>
  );
}

export default EstimatorForm;