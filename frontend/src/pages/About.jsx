import React from 'react';
import { FaPython, FaReact, FaDocker, FaGithub } from 'react-icons/fa';
import { SiFastapi, SiTailwindcss } from 'react-icons/si';

function About() {
  const techStack = [
    { name: 'React', icon: FaReact, color: 'text-blue-400' },
    { name: 'FastAPI', icon: SiFastapi, color: 'text-green-500' },
    { name: 'Python', icon: FaPython, color: 'text-blue-500' },
    { name: 'Tailwind CSS', icon: SiTailwindcss, color: 'text-cyan-500' },
    { name: 'Docker', icon: FaDocker, color: 'text-blue-600' },
    { name: 'GitHub', icon: FaGithub, color: 'text-gray-700' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">About This Application</h2>
        <p className="text-gray-600 mb-4">
          A comprehensive housing price prediction system built with modern web technologies,
          designed to help real estate professionals and home buyers estimate property values
          in the Indian market.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Key Features</h3>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start space-x-2">
              <span className="text-primary-600 font-bold">•</span>
              <span>ML-powered price predictions with ₹ INR formatting</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-primary-600 font-bold">•</span>
              <span>Interactive market analysis dashboard</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-primary-600 font-bold">•</span>
              <span>Batch predictions and comparison views</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-primary-600 font-bold">•</span>
              <span>Export data in CSV and PDF formats</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-primary-600 font-bold">•</span>
              <span>What-if analysis tool</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Technology Stack</h3>
          <div className="grid grid-cols-2 gap-4">
            {techStack.map((tech) => {
              const Icon = tech.icon;
              return (
                <div key={tech.name} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                  <Icon className={`text-2xl ${tech.color}`} />
                  <span className="text-sm font-medium text-gray-700">{tech.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">How It Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4">
            <div className="text-3xl mb-2">📊</div>
            <h4 className="font-semibold text-gray-800">1. Data Collection</h4>
            <p className="text-sm text-gray-600">Historical housing data with 7 key features</p>
          </div>
          <div className="text-center p-4">
            <div className="text-3xl mb-2">🤖</div>
            <h4 className="font-semibold text-gray-800">2. Model Training</h4>
            <p className="text-sm text-gray-600">Random Forest / Linear Regression models</p>
          </div>
          <div className="text-center p-4">
            <div className="text-3xl mb-2">💰</div>
            <h4 className="font-semibold text-gray-800">3. Price Prediction</h4>
            <p className="text-sm text-gray-600">Real-time predictions in ₹ INR format</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;