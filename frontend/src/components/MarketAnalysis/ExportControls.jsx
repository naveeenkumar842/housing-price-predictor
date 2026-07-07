import React, { useState } from 'react';
import { FaFileCsv, FaFilePdf, FaDownload, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';

function ExportControls({ data }) {
  const [exporting, setExporting] = useState(false);

  const exportCSV = () => {
    setExporting(true);
    try {
      const { stats, distribution, correlations } = data;
      
      const headers = ['Metric', 'Value'];
      const rows = [
        ['Total Properties', stats.total_houses],
        ['Average Price', stats.avg_price_inr],
        ['Min Price', stats.min_price_inr],
        ['Max Price', stats.max_price_inr],
        ['Average Sq Ft', stats.avg_square_footage.toFixed(0)],
        ['Average Bedrooms', stats.avg_bedrooms.toFixed(1)],
        ['Average Bathrooms', stats.avg_bathrooms.toFixed(1)],
        ['Average School Rating', stats.avg_school_rating.toFixed(1)],
        ['', ''],
        ['Price Distribution', ''],
        ...distribution.map(d => [d.price_range, `${d.count} (${d.percentage}%)`]),
        ['', ''],
        ['Feature Correlations', ''],
        ...correlations.map(c => [c.feature.replace(/_/g, ' ').toUpperCase(), c.correlation.toFixed(3)]),
      ];
      
      const csv = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = `market_analysis_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success('CSV exported successfully!');
    } catch (error) {
      toast.error('Failed to export CSV');
    } finally {
      setExporting(false);
    }
  };

  const exportPDF = () => {
    toast.success('PDF export coming soon!');
    // In production, you would use a library like jsPDF or react-pdf
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h4 className="text-lg font-semibold text-gray-800 mb-2">Export Data</h4>
      <p className="text-sm text-gray-600 mb-4">
        Download market analysis data in your preferred format
      </p>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={exportCSV}
          disabled={exporting}
          className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {exporting ? (
            <FaSpinner className="animate-spin" />
          ) : (
            <FaFileCsv />
          )}
          <span>{exporting ? 'Exporting...' : 'Export CSV'}</span>
        </button>
        <button
          onClick={exportPDF}
          className="flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <FaFilePdf />
          <span>Export PDF</span>
        </button>
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Last exported</span>
          <span className="text-gray-500">
            {localStorage.getItem('lastExport') || 'Never'}
          </span>
        </div>
        <button
          onClick={() => {
            localStorage.setItem('lastExport', new Date().toLocaleString());
            toast.success('Export history updated');
          }}
          className="mt-2 text-xs text-primary-600 hover:text-primary-700"
        >
          <FaDownload className="inline mr-1" />
          Update export timestamp
        </button>
      </div>
    </div>
  );
}

export default ExportControls;