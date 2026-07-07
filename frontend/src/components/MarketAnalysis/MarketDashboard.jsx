import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { formatINR } from '../../utils/formatters';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function MarketDashboard({ data, filters }) {
  const { stats, distribution, correlations, top_features } = data;

  // Price Distribution Chart
  const distributionData = {
    labels: distribution.map(d => d.price_range),
    datasets: [
      {
        label: 'Number of Properties',
        data: distribution.map(d => d.count),
        backgroundColor: [
          'rgba(59, 130, 246, 0.6)',
          'rgba(16, 185, 129, 0.6)',
          'rgba(245, 158, 11, 0.6)',
          'rgba(239, 68, 68, 0.6)',
          'rgba(168, 85, 247, 0.6)',
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
          'rgb(168, 85, 247)',
        ],
        borderWidth: 2,
      },
    ],
  };

  // Feature Correlations Chart
  const correlationData = {
    labels: correlations.map(c => c.feature.replace(/_/g, ' ').toUpperCase()),
    datasets: [
      {
        label: 'Correlation with Price',
        data: correlations.map(c => c.correlation),
        backgroundColor: correlations.map(c => 
          c.correlation > 0 ? 'rgba(16, 185, 129, 0.6)' : 'rgba(239, 68, 68, 0.6)'
        ),
        borderColor: correlations.map(c => 
          c.correlation > 0 ? 'rgb(16, 185, 129)' : 'rgb(239, 68, 68)'
        ),
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="text-sm text-gray-500">Total Properties</div>
          <div className="text-2xl font-bold text-gray-800">{stats.total_houses}</div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="text-sm text-gray-500">Average Price</div>
          <div className="text-2xl font-bold text-primary-600">{stats.avg_price_inr}</div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="text-sm text-gray-500">Price Range</div>
          <div className="text-lg font-bold text-gray-800">
            {stats.min_price_inr} - {stats.max_price_inr}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="text-sm text-gray-500">Average School Rating</div>
          <div className="text-2xl font-bold text-gray-800">{stats.avg_school_rating.toFixed(1)}/10</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Price Distribution</h4>
          <div style={{ height: '250px' }}>
            <Bar 
              data={distributionData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1 },
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Feature Correlations</h4>
          <div style={{ height: '250px' }}>
            <Bar 
              data={correlationData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                },
                scales: {
                  y: {
                    beginAtZero: false,
                    min: -1,
                    max: 1,
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Top Features */}
      {top_features && top_features.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Top 5 Most Important Features</h4>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {top_features.map((feature, index) => (
              <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500">{feature.feature.replace(/_/g, ' ').toUpperCase()}</div>
                <div className="text-xl font-bold text-primary-600">
                  {(feature.importance * 100).toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MarketDashboard;