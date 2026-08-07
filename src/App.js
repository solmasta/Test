import React from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import MainContent from './components/MainContent';

function App() {
  return (
    <ErrorBoundary>
      <MainContent />
    </ErrorBoundary>
  );
}

export default App;
