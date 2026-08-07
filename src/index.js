import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { StateManager } from './state_manager';

const initialState = {
  user: { name: 'Guest', email: '' },
  preferences: { theme: 'light', fontSize: 'medium' },
  version: 2
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter basename="/Test">
      <StateManager initialState={initialState}>
        <App />
      </StateManager>
    </BrowserRouter>
  </React.StrictMode>
);
