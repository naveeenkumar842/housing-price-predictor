import React, { useState } from 'react';
import toast from 'react-hot-toast';
import EstimatorForm from '../components/PropertyEstimator/EstimatorForm';
import PredictionResult from '../components/PropertyEstimator/PredictionResult';
import PriceChart from '../components/PropertyEstimator/PriceChart';
import PriceBreakdown from '../components/PropertyEstimator/PriceBreakdownNew';
import HistoryTable from '../components/PropertyEstimator/HistoryTable';
import ComparisonView from '../components/PropertyEstimator/ComparisonView';
import { useApp } from '../context/AppContext';
import { predictPrice, predictBatch } from '../utils/api';

function Estimator() {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [comparisonFeatures, setComparisonFeatures] = useState([]);
  const { addToHistory, predictionHistory } = useApp();

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      const result = await predictPrice(data);
      setPrediction(result);
      addToHistory({ 
        ...data, 
        predicted_price: result.prediction, 
        predicted_inr: result.prediction_inr 
      });
      toast.success(`Prediction: ${result.prediction_inr}`);
    } catch (error) {
      toast.error('Failed to get prediction');
    } finally {
      setLoading(false);
    }
  };

  const handleBatchPredict = async (featuresList) => {
    setLoading(true);
    try {
      const result = await predictBatch(featuresList);
      result.predictions_inr.forEach((price, index) => {
        addToHistory({ 
          ...featuresList[index], 
          predicted_price: result.predictions[index],
          predicted_inr: price 
        });
      });
      toast.success(`Predicted ${result.predictions.length} properties`);
    } catch (error) {
      toast.error('Batch prediction failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCompare = (features) => {
    setComparisonFeatures(prev => [...prev, features]);
    toast.success('Added to comparison');
  };

  const handleClearComparison = () => {
    setComparisonFeatures([]);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Property Value Estimator</h2>
        <p className="text-gray-600">
          Enter property details below to get an estimated market value in Indian Rupees (₹)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div>
          <EstimatorForm 
            onSubmit={handleSubmit}
            loading={loading}
            onBatchPredict={handleBatchPredict}
          />
        </div>

        {/* Results */}
        <div className="space-y-6">
          {prediction && (
            <>
              <PredictionResult prediction={prediction} />
              <PriceChart prediction={prediction} />
              <PriceBreakdown prediction={prediction} />
            </>
          )}
          
          {!prediction && (
            <div className="bg-white rounded-xl shadow-md p-6 flex items-center justify-center text-gray-500 h-64">
              <div className="text-center">
                <div className="text-4xl mb-2">🏠</div>
                <p>Enter property details and click "Predict Price"</p>
                <p className="text-sm mt-2">Results will appear here</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Comparison View */}
      {comparisonFeatures.length > 0 && (
        <ComparisonView 
          features={comparisonFeatures}
          onClear={handleClearComparison}
        />
      )}

      {/* History */}
      {predictionHistory.length > 0 && (
        <HistoryTable history={predictionHistory} />
      )}
    </div>
  );
}

export default Estimator;