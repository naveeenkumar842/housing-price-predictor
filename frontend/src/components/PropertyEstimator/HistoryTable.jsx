import React, { useState } from 'react';
import { FaTrash, FaDownload } from 'react-icons/fa';
import { useApp } from '../../context/AppContext';
import { formatDate, formatINR } from '../../utils/formatters';

function HistoryTable({ history }) {
  const { clearHistory } = useApp();
  const [sortField, setSortField] = useState('timestamp');
  const [sortDirection, setSortDirection] = useState('desc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedHistory = [...history].sort((a, b) => {
    let aVal = a[sortField] || '';
    let bVal = b[sortField] || '';
    
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    }
    
    aVal = String(aVal).toLowerCase();
    bVal = String(bVal).toLowerCase();
    return sortDirection === 'asc' 
      ? aVal.localeCompare(bVal) 
      : bVal.localeCompare(aVal);
  });

  const exportCSV = () => {
    const headers = ['Timestamp', 'Square Footage', 'Bedrooms', 'Bathrooms', 'Year Built', 'Lot Size', 'Distance', 'School Rating', 'Predicted Price'];
    const rows = history.map(item => [
      formatDate(item.timestamp),
      item.square_footage,
      item.bedrooms,
      item.bathrooms,
      item.year_built,
      item.lot_size,
      item.distance_to_city_center,
      item.school_rating,
      item.predicted_inr
    ]);
    
    const csv = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prediction_history_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (history.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <h4 className="text-lg font-semibold text-gray-800">Prediction History</h4>
        <div className="flex space-x-2">
          <button
            onClick={exportCSV}
            className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <FaDownload className="text-xs" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={clearHistory}
            className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <FaTrash className="text-xs" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b-2 border-gray-200">
              <th 
                className="px-3 py-2.5 text-left cursor-pointer hover:bg-gray-100 transition-colors whitespace-nowrap"
                onClick={() => handleSort('timestamp')}
              >
                Timestamp {sortField === 'timestamp' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="px-3 py-2.5 text-left cursor-pointer hover:bg-gray-100 transition-colors whitespace-nowrap"
                onClick={() => handleSort('square_footage')}
              >
                Sq Ft {sortField === 'square_footage' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="px-3 py-2.5 text-left cursor-pointer hover:bg-gray-100 transition-colors whitespace-nowrap"
                onClick={() => handleSort('bedrooms')}
              >
                Beds {sortField === 'bedrooms' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="px-3 py-2.5 text-left cursor-pointer hover:bg-gray-100 transition-colors whitespace-nowrap"
                onClick={() => handleSort('bathrooms')}
              >
                Baths {sortField === 'bathrooms' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="px-3 py-2.5 text-left cursor-pointer hover:bg-gray-100 transition-colors whitespace-nowrap"
                onClick={() => handleSort('predicted_inr')}
              >
                Price {sortField === 'predicted_inr' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedHistory.slice(0, 10).map((item) => (
              <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-3 py-2.5 text-gray-600 whitespace-nowrap">{formatDate(item.timestamp)}</td>
                <td className="px-3 py-2.5 font-medium">{item.square_footage}</td>
                <td className="px-3 py-2.5">{item.bedrooms}</td>
                <td className="px-3 py-2.5">{item.bathrooms}</td>
                <td className="px-3 py-2.5 font-semibold text-primary-600 whitespace-nowrap">
                  {item.predicted_inr}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {history.length > 10 && (
          <div className="text-center text-sm text-gray-500 mt-3">
            Showing last 10 of {history.length} predictions
          </div>
        )}
      </div>
    </div>
  );
}

export default HistoryTable;