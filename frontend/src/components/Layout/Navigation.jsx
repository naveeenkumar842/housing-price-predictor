import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FaHome, 
  FaCalculator, 
  FaChartLine,
  FaInfoCircle
} from 'react-icons/fa';

function Navigation() {
  const navItems = [
    { path: '/', label: 'Home', icon: FaHome },
    { path: '/estimator', label: 'Property Estimator', icon: FaCalculator },
    { path: '/market-analysis', label: 'Market Analysis', icon: FaChartLine },
    { path: '/about', label: 'About', icon: FaInfoCircle },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex space-x-1 overflow-x-auto">
          {navItems.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 space-x-2 text-sm font-medium transition-colors duration-200 whitespace-nowrap
                ${isActive 
                  ? 'text-primary-600 border-b-2 border-primary-600' 
                  : 'text-gray-600 hover:text-primary-600 hover:border-b-2 hover:border-primary-300'
                }`
              }
            >
              <Icon className="text-lg" />
              <span className="hidden sm:inline">{label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;