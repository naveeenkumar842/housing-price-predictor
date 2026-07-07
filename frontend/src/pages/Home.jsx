import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCalculator, FaChartLine, FaRocket, FaShieldAlt } from 'react-icons/fa';
import { getHealth } from '../utils/api';

function Home() {
  const [status, setStatus] = useState({ healthy: false, loading: true });

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const data = await getHealth();
        setStatus({ healthy: true, loading: false, data });
      } catch (error) {
        setStatus({ healthy: false, loading: false, error: error.message });
      }
    };
    checkHealth();
  }, []);

  const features = [
    {
      icon: FaCalculator,
      title: 'Property Estimator',
      description: 'Get accurate price predictions for any property using our ML model',
      link: '/estimator',
      color: 'text-blue-600'
    },
    {
      icon: FaChartLine,
      title: 'Market Analysis',
      description: 'Explore market trends, distributions, and feature correlations',
      link: '/market-analysis',
      color: 'text-green-600'
    },
    {
      icon: FaRocket,
      title: 'Fast Predictions',
      description: 'Real-time predictions with batch processing support',
      link: '/estimator',
      color: 'text-purple-600'
    },
    {
      icon: FaShieldAlt,
      title: 'Reliable Data',
      description: 'Based on real housing data with Indian Rupee (₹) support',
      link: '/about',
      color: 'text-red-600'
    }
  ];

  if (status.loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600" />
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 mb-8 text-white">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold mb-4">
            Indian Housing Price Predictor
          </h1>
          <p className="text-xl mb-6 text-primary-100">
            Leverage machine learning to estimate property values in the Indian market.
            Get accurate predictions powered by real estate data.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/estimator" className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors">
              Start Estimating
            </Link>
            <Link to="/market-analysis" className="bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-800 transition-colors">
              View Market Analysis
            </Link>
          </div>
          {status.data && (
            <div className="mt-6 text-sm text-primary-200">
              ✅ System Status: {status.data.status} • Model: {status.data.model_type} • Currency: ₹ INR
            </div>
          )}
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Link
              key={index}
              to={feature.link}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200 group"
            >
              <div className="flex items-start space-x-4">
                <div className={`${feature.color} text-3xl group-hover:scale-110 transition-transform`}>
                  <Icon />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="mt-8 bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Facts</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">50+</div>
            <div className="text-sm text-gray-600">Training Samples</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">7</div>
            <div className="text-sm text-gray-600">Features</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">₹</div>
            <div className="text-sm text-gray-600">Indian Rupee</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">~85%</div>
            <div className="text-sm text-gray-600">Model Accuracy</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;