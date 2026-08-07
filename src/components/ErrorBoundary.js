import React from 'react';
import { useStateContext } from '../state_manager';

export const ErrorBoundary = ({ children }) => {
  const { error } = useStateContext();
  
  if (error) {
    return (
      <div className="error-boundary">
        <h2>Application Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Reload Application</button>
      </div>
    );
  }
  
  return children;
};
