import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 mt-auto">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm">
            © 2026 Property Price Predictor. All rights reserved.
          </div>
          <div className="flex space-x-6 text-sm">
            <span>🏠 Built with React + FastAPI</span>
            <span>🇮🇳 Indian Rupee (₹)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;