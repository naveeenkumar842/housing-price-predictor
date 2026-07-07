import React, { useState, useMemo } from 'react';
import { FaSort, FaSortUp, FaSortDown, FaSearch } from 'react-icons/fa';
import { formatINR } from '../../utils/formatters';

function DataTable({ data, filters }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('price');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock data for the table (in production, this would come from the API)
  const mockData = useMemo(() => {
    // Generate sample data based on market statistics
    const { stats } = data;
    const sampleData = [];
    const features = ['square_footage', 'bedrooms', 'bathrooms', 'year_built', 'lot_size', 'distance_to_city_center', 'school_rating'];
    
    for (let i = 0; i < 50; i++) {
      const row = {
        id: i + 1,
        square_footage: Math.round(1000 + Math.random() * 1500),
        bedrooms: Math.round(2 + Math.random() * 3),
        bathrooms: Math.round((1.5 + Math.random() * 2) * 2) / 2,
        year_built: Math.round(1970 + Math.random() * 50),
        lot_size: Math.round(4000 + Math.random() * 6000),
        distance_to_city_center: Math.round((2 + Math.random() * 6) * 10) / 10,
        school_rating: Math.round((6 + Math.random() * 4) * 10) / 10,
        price: Math.round(150000 + Math.random() * 250000)
      };
      sampleData.push(row);
    }
    return sampleData;
  }, [data]);

  // Apply filters
  const filteredData = useMemo(() => {
    return mockData.filter(item => {
      const priceMatch = item.price >= filters.minPrice && item.price <= filters.maxPrice;
      const bedroomMatch = item.bedrooms >= filters.minBedrooms && item.bedrooms <= filters.maxBedrooms;
      const bathroomMatch = item.bathrooms >= filters.minBathrooms && item.bathrooms <= filters.maxBathrooms;
      
      // Search term match
      let searchMatch = true;
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        searchMatch = 
          String(item.id).includes(searchLower) ||
          String(item.square_footage).includes(searchLower) ||
          String(item.bedrooms).includes(searchLower) ||
          String(item.bathrooms).includes(searchLower) ||
          String(item.year_built).includes(searchLower) ||
          String(item.price).includes(searchLower);
      }
      
      return priceMatch && bedroomMatch && bathroomMatch && searchMatch;
    });
  }, [mockData, filters, searchTerm]);

  // Sort data
  const sortedData = useMemo(() => {
    const sorted = [...filteredData];
    sorted.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredData, sortField, sortDirection]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return sortedData.slice(start, end);
  }, [sortedData, currentPage]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return <FaSort className="text-gray-400" />;
    return sortDirection === 'asc' ? 
      <FaSortUp className="text-primary-600" /> : 
      <FaSortDown className="text-primary-600" />;
  };

  const columns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'square_footage', label: 'Sq Ft', sortable: true },
    { key: 'bedrooms', label: 'Beds', sortable: true },
    { key: 'bathrooms', label: 'Baths', sortable: true },
    { key: 'year_built', label: 'Year Built', sortable: true },
    { key: 'lot_size', label: 'Lot Size', sortable: true },
    { key: 'distance_to_city_center', label: 'Distance', sortable: true },
    { key: 'school_rating', label: 'School Rating', sortable: true },
    { key: 'price', label: 'Price', sortable: true },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
        <h4 className="text-lg font-semibold text-gray-800">Property Listings</h4>
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <span className="text-sm text-gray-500 whitespace-nowrap">
            {filteredData.length} properties
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {columns.map(({ key, label, sortable }) => (
                <th
                  key={key}
                  className={`px-3 py-2 text-left font-semibold text-gray-700 ${
                    sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                  }`}
                  onClick={() => sortable && handleSort(key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{label}</span>
                    {sortable && getSortIcon(key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-8 text-gray-500">
                  No properties match the current filters
                </td>
              </tr>
            ) : (
              paginatedData.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2 font-medium">{item.id}</td>
                  <td className="px-3 py-2">{item.square_footage}</td>
                  <td className="px-3 py-2">{item.bedrooms}</td>
                  <td className="px-3 py-2">{item.bathrooms}</td>
                  <td className="px-3 py-2">{item.year_built}</td>
                  <td className="px-3 py-2">{item.lot_size.toLocaleString()}</td>
                  <td className="px-3 py-2">{item.distance_to_city_center} mi</td>
                  <td className="px-3 py-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.school_rating >= 8 ? 'bg-green-100 text-green-700' :
                      item.school_rating >= 6 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {item.school_rating}/10
                    </span>
                  </td>
                  <td className="px-3 py-2 font-semibold text-primary-600">
                    {formatINR(item.price)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-500">
            Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, sortedData.length)} of {sortedData.length}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
            <span className="px-3 py-1 bg-primary-600 text-white rounded-lg">
              {currentPage}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;