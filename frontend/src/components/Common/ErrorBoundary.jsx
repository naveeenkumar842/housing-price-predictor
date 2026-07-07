import React from 'react';
import { FaExclamationTriangle, FaHome } from 'react-icons/fa';
import { Link } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaExclamationTriangle className="text-4xl text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-4">
              We're sorry, but an unexpected error occurred.
            </p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-4 p-3 bg-red-50 rounded-lg text-left">
                <p className="text-sm text-red-600 font-mono break-all">
                  {this.state.error.toString()}
                </p>
              </div>
            )}
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => window.location.reload()}
                className="btn-primary w-full"
              >
                Refresh Page
              </button>
              <Link
                to="/"
                className="btn-secondary w-full flex items-center justify-center space-x-2"
                onClick={() => this.setState({ hasError: false })}
              >
                <FaHome />
                <span>Go Home</span>
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;