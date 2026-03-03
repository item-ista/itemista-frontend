import React from 'react';
import './ErrorBoundary.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <h2>کچھ غلط ہو گیا</h2>
            <p>ایپلیکیشن میں خرابی آئی ہے۔ براہ کرم صفحہ دوبارہ لوڈ کریں۔</p>
            <button 
              className="error-boundary-button"
              onClick={() => window.location.reload()}
            >
              دوبارہ لوڈ کریں
            </button>
            {process.env.NODE_ENV === 'development' && (
              <details style={{ marginTop: '20px' }}>
                <summary style={{ cursor: 'pointer', marginBottom: '10px' }}>
                  Technical Details (Development Only)
                </summary>
                <pre style={{ 
                  background: '#f5f5f5', 
                  padding: '10px', 
                  overflow: 'auto', 
                  fontSize: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}>
                  {this.state.error && this.state.error.toString()}
                  <br />
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;