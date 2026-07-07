import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { predictPrice } from '../../utils/api';
import { formatINR } from '../../utils/formatters';
import LoadingSpinner from '../Common/LoadingSpinner';

function WhatIfAnalysis() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scenarios, setScenarios] = useState([]);

  const watchedFields = watch();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const features = {
        square_footage: parseFloat(data.square_footage),
        bedrooms: parseFloat(data.bedrooms),
        bathrooms: parseFloat(data.bathrooms),
        year_built: parseFloat(data.year_built),
        lot_size: parseFloat(data.lot_size),
        distance_to_city_center: parseFloat(data.distance_to_city_center),
        school_rating: parseFloat(data.school_rating),
      };
      
      const result = await predictPrice(features);
      setResults(result);
      
      // Add to scenarios
      const scenario = {
        ...features,
        predicted_price: result.prediction,
        predicted_inr: result.prediction_inr,
        timestamp: new Date().toISOString()
      };
      setScenarios([...scenarios, scenario]);
      
      toast.success('Analysis complete!');
    } catch (error) {
      toast.error('Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const clearScenarios = () => {
    setScenarios([]);
    setResults(null);
  };

  const fields = [
    { name: 'square_footage', label: 'Square Footage', default: 1800, min: 500, max: 5000, step: 100 },
    { name: 'bedrooms', label: 'Bedrooms', default: 3, min: 1, max: 10, step: 1 },
    { name: 'bathrooms', label: 'Bathrooms', default: 2, min: 0.5, max: 5, step: 0.5 },
    { name: 'year_built', label: 'Year Built', default: 2000, min: 1950, max: 2025, step: 5 },
    { name: 'lot_size', label: 'Lot Size (sq ft)', default: 7000, min: 1000, max: 20000, step: 500 },
    { name: 'distance_to_city_center', label: 'Distance (miles)', default: 5, min: 0.5, max: 20, step: 0.5 },
    { name: 'school_rating', label: 'School Rating', default: 8, min: 1, max: 10, step: 0.5 },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h4 className="text-lg font-semibold text-gray-800 mb-2">What-If Analysis</h4>
      <p className="text-sm text-gray-600 mb-4">
        Adjust the sliders below to see how different features affect the property price
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {fields.map(({ name, label, default: defaultValue, min, max, step }) => (
          <div key={name}>
            <div className="flex justify-between text-sm font-medium text-gray-700">
              <label>{label}</label>
              <span className="text-primary-600 font-bold">
                {watchedFields[name] || defaultValue}
              </span>
            </div>
            <input
              {...register(name, { 
                required: true,
                valueAsNumber: true,
                min: { value: min, message: `Minimum is ${min}` },
                max: { value: max, message: `Maximum is ${max}` }
              })}
              type="range"
              min={min}
              max={max}
              step={step}
              defaultValue={defaultValue}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
              disabled={loading}
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>{min}</span>
              <span>{max}</span>
            </div>
          </div>
        ))}

        <button
          type="submit"
          className="w-full btn-primary py-2 text-lg"
          disabled={loading}
        >
          {loading ? <LoadingSpinner size="sm" /> : 'Analyze Price Impact 🔍'}
        </button>
      </form>

      {results && (
        <div className="mt-4 p-4 bg-primary-50 rounded-lg">
          <div className="text-sm text-primary-600 mb-1">Estimated Price</div>
          <div className="text-2xl font-bold text-primary-700">
            {results.prediction_inr}
          </div>
          <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
            <div>
              <span className="text-gray-500">Sq Ft:</span>{' '}
              <span className="font-medium">{watchedFields.square_footage}</span>
            </div>
            <div>
              <span className="text-gray-500">Bedrooms:</span>{' '}
              <span className="font-medium">{watchedFields.bedrooms}</span>
            </div>
            <div>
              <span className="text-gray-500">Bathrooms:</span>{' '}
              <span className="font-medium">{watchedFields.bathrooms}</span>
            </div>
            <div>
              <span className="text-gray-500">School Rating:</span>{' '}
              <span className="font-medium">{watchedFields.school_rating}/10</span>
            </div>
          </div>
        </div>
      )}

      {/* Scenarios History */}
      {scenarios.length > 0 && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <h5 className="text-sm font-semibold text-gray-700">Scenario History</h5>
            <button
              onClick={clearScenarios}
              className="text-xs text-red-600 hover:text-red-800"
            >
              Clear All
            </button>
          </div>
          <div className="max-h-48 overflow-y-auto space-y-2">
            {scenarios.map((scenario, index) => (
              <div key={index} className="p-2 bg-gray-50 rounded-lg text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">Scenario #{index + 1}</span>
                  <span className="text-primary-600 font-semibold">{scenario.predicted_inr}</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {scenario.square_footage} sq ft • {scenario.bedrooms} beds • {scenario.bathrooms} baths • {scenario.year_built}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default WhatIfAnalysis;