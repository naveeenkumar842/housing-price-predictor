import React, { useState, useEffect } from 'react';
import MarketDashboard from '../components/MarketAnalysis/MarketDashboard';
import FilterControls from '../components/MarketAnalysis/FilterControls';
import WhatIfAnalysis from '../components/MarketAnalysis/WhatIfAnalysis';
import DataTable from '../components/MarketAnalysis/DataTable';
import ExportControls from '../components/MarketAnalysis/ExportControls';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { getMarketStats } from '../utils/api';

function MarketAnalysis() {
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 500000,
    minBedrooms: 0,
    maxBedrooms: 5,
    minBathrooms: 0,
    maxBathrooms: 3
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMarketStats();
        setMarketData(data);
      } catch (error) {
        console.error('Failed to fetch market data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading market analysis..." />;
  }

  if (!marketData) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 text-center">
        <p className="text-gray-600">No market data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Property Market Analysis</h2>
        <p className="text-gray-600">
          Comprehensive analysis of the Indian housing market with interactive visualizations
        </p>
      </div>

      <FilterControls filters={filters} onFilterChange={setFilters} />
      
      <MarketDashboard data={marketData} filters={filters} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WhatIfAnalysis />
        <ExportControls data={marketData} />
      </div>

      <DataTable data={marketData} filters={filters} />
    </div>
  );
}

export default MarketAnalysis;