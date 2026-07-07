import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function PriceChart({ prediction }) {
  const basePrice = prediction.prediction;

  // Generate realistic price variations based on feature changes
  const comparisonData = [
    { 
      label: 'Current', 
      value: basePrice, 
      color: 'rgb(59, 130, 246)' 
    },
    { 
      label: '+20% Sq Ft', 
      value: Math.round(basePrice * 1.15),
      color: 'rgb(16, 185, 129)' 
    },
    { 
      label: '-20% Sq Ft', 
      value: Math.round(basePrice * 0.88),
      color: 'rgb(239, 68, 68)' 
    },
    { 
      label: '+1 Bedroom', 
      value: Math.round(basePrice * 1.12),
      color: 'rgb(168, 85, 247)' 
    },
    { 
      label: '+1 Bathroom', 
      value: Math.round(basePrice * 1.08),
      color: 'rgb(245, 158, 11)' 
    },
    { 
      label: 'Better School', 
      value: Math.round(basePrice * 1.10),
      color: 'rgb(236, 72, 153)' 
    },
  ];

  const data = {
    labels: comparisonData.map(d => d.label),
    datasets: [
      {
        label: 'Estimated Price (₹)',
        data: comparisonData.map(d => d.value),
        backgroundColor: comparisonData.map(d => d.color),
        borderColor: comparisonData.map(d => d.color),
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Price Comparison Scenarios',
        font: {
          size: 16,
          weight: 'bold',
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.parsed.y;
            return `₹${value.toLocaleString('en-IN')}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: function(value) {
            return `₹${(value / 1000).toFixed(0)}K`;
          },
        },
      },
      x: {
        ticks: {
          maxRotation: 35,
          minRotation: 0,
          font: {
            size: 11,
          }
        }
      }
    },
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div style={{ height: '280px', minHeight: '250px' }}>
        <Bar data={data} options={options} />
      </div>
      <p className="text-xs text-gray-500 mt-3 text-center">
        * Hypothetical scenarios based on feature variations (estimates may vary)
      </p>
    </div>
  );
}

export default PriceChart;