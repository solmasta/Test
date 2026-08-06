import React, { useContext } from 'react';
import { useAppState, useUserState, usePreferences } from './state_selectors';
import { StateContext } from './state_manager';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

/* ---------------------------------------------- */
/* 4. Main App component – shows how to use the hooks */
/* ---------------------------------------------- */
const MainContent = () => {
  const { safeUpdateState } = useContext(StateContext);
  const user = useUserState();
  const preferences = usePreferences();

  const setName = (name) => safeUpdateState(prev => ({
    ...prev,
    user: { ...prev.user, name }
  }));

  const setTheme = (theme) => safeUpdateState(prev => ({
    ...prev,
    preferences: { ...prev.preferences, theme }
  }));

  return (
    <div className={`app theme-${preferences.theme}`}>
      <header>
        <h1>Verge State Demo</h1>
      </header>

      <section className="profile">
        <img
          src={user.avatar || 'https://picsum.photos/seed/avatar/100/100'}
          alt="Avatar"
          width={80}
        />
        <input value={user.name} onChange={e => setName(e.target.value)} />
      </section>

      <section className="settings">
        <label>
          Theme:
          <select
            value={preferences.theme}
            onChange={e => setTheme(e.target.value)}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="quantum">Quantum</option>
            <option value="matrix">Matrix</option>
            <option value="cosmic">Cosmic</option>
          </select>
        </label>
      </section>
    </div>
  );
};

/* ---------------------------------------------- */
/* 5. Wrap the whole app in StateManager          */
/* ---------------------------------------------- */
const App = () => {
  const initialState = {
    user: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Guest',
      email: '',
      avatar: '',
      bio: ''
    },
    preferences: {
      theme: 'light',
      fontSize: 'medium',
      animations: true,
      quantumMode: false
    },
    version: 1
  };

  return (
    <StateContext.Provider value={{ state: initialState, safeUpdateState: () => {}, error: null }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <StateContext.Provider value={{ state: initialState, safeUpdateState: () => {}, error: null }}>
              <MainContent />
            </StateContext.Provider>
          } />
        </Routes>
      </BrowserRouter>
    </StateContext.Provider>
  );
};

export default App;