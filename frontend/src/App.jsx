import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';

// Layout Components
import Header from './components/Layout/Header';
import Navigation from './components/Layout/Navigation';
import Footer from './components/Layout/Footer';

// Pages
import Home from './pages/Home';
import Estimator from './pages/Estimator';
import MarketAnalysis from './pages/MarketAnalysis';
import About from './pages/About';

// Error Boundary
import ErrorBoundary from './components/Common/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            <Navigation />
            <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/estimator" element={<Estimator />} />
                <Route path="/market-analysis" element={<MarketAnalysis />} />
                <Route path="/about" element={<About />} />
              </Routes>
            </main>
            <Footer />
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
          </div>
        </Router>
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;