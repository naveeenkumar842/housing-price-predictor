import React, { createContext, useContext, useState, useCallback } from 'react';
import toast from 'react-hot-toast';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [predictionHistory, setPredictionHistory] = useState([]);

  const addToHistory = useCallback((prediction) => {
    const entry = {
      ...prediction,
      timestamp: new Date().toISOString(),
      id: Date.now()
    };
    setPredictionHistory(prev => [entry, ...prev].slice(0, 20));
  }, []);

  const clearHistory = useCallback(() => {
    setPredictionHistory([]);
    toast.success('History cleared');
  }, []);

  const value = {
    loading,
    setLoading,
    predictionHistory,
    addToHistory,
    clearHistory
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}