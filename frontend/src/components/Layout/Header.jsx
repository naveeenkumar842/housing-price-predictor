import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';

function Header() {
  return (
    <header className="bg-primary-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <FaHome className="text-2xl" />
            <div>
              <h1 className="text-2xl font-bold">🏠 Property Price Predictor</h1>
              <p className="text-sm text-primary-100">Indian Housing Market Analysis</p>
            </div>
          </Link>
          <div className="flex items-center space-x-4">
            <span className="px-3 py-1 bg-primary-700 rounded-full text-sm">
              ₹ INR
            </span>
            <span className="hidden md:inline-block text-sm">
              v1.0
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;