import React from 'react';
import { useStateContext } from '../state_manager';

const MainContent = () => {
  const { state, safeUpdateState, undo, redo, canUndo, canRedo, error } = useStateContext();

  const handleNameChange = (name) => {
    safeUpdateState(prev => ({
      ...prev,
      user: { ...prev.user, name }
    }));
  };

  const handleThemeToggle = () => {
    safeUpdateState(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        theme: prev.preferences.theme === 'light' ? 'dark' : 'light'
      }
    }));
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      {error && (
        <div style={{ background: '#f8d7da', color: '#721c24', padding: '10px', borderRadius: '5px', marginBottom: '20px' }}>
          Error: {error}
        </div>
      )}
      
      <h1>VERGE State Management Demo</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>User Profile</h2>
        <input
          value={state.user.name}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="Enter your name"
          style={{ padding: '10px', fontSize: '16px', width: '100%', marginBottom: '10px' }}
        />
        <p>Email: {state.user.email || 'Not set'}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Preferences</h2>
        <button onClick={handleThemeToggle} style={{ padding: '10px 20px', fontSize: '16px' }}>
          Toggle Theme (Current: {state.preferences.theme})
        </button>
        <p>Font Size: {state.preferences.fontSize}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>History Controls</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={undo} disabled={!canUndo} style={{ padding: '10px 20px', fontSize: '16px' }}>
            Undo
          </button>
          <button onClick={redo} disabled={!canRedo} style={{ padding: '10px 20px', fontSize: '16px' }}>
            Redo
          </button>
        </div>
        <p>History Position: {currentIndex + 1}/{history.length}</p>
      </div>

      <div style={{ marginTop: '30px', padding: '20px', background: '#f5f5f5', borderRadius: '10px' }}>
        <h3>Current State</h3>
        <pre style={{ background: '#fff', padding: '10px', borderRadius: '5px', overflow: 'auto' }}>
          {JSON.stringify(state, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default MainContent;
