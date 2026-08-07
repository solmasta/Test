import React, { createContext, useState, useCallback, useEffect } from 'react';
import { z } from 'zod';

const StateSchema = z.object({
  user: z.object({
    name: z.string().min(1).max(50),
    email: z.string().email()
  }),
  preferences: z.object({
    theme: z.enum(['light', 'dark']),
    fontSize: z.enum(['small', 'medium', 'large']).default('medium')
  }),
  version: z.number().default(2)
});

export const StateContext = createContext();

export const StateManager = ({ children, initialState }) => {
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('app_state_history');
      return saved ? JSON.parse(saved) : [initialState];
    } catch (e) {
      console.error('State load error', e);
      return [initialState];
    }
  });
  
  const [currentIndex, setCurrentIndex] = useState(() => {
    const savedIndex = localStorage.getItem('app_state_index');
    return savedIndex ? parseInt(savedIndex) : 0;
  });
  
  const [error, setError] = useState(null);
  
  const state = history[currentIndex];
  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  useEffect(() => {
    try {
      localStorage.setItem('app_state_history', JSON.stringify(history));
      localStorage.setItem('app_state_index', currentIndex.toString());
    } catch (e) {
      console.error('State save error', e);
    }
  }, [history, currentIndex]);

  const safeUpdateState = useCallback((updateFn) => {
    try {
      if (typeof updateFn !== 'function') throw new Error('State update must be a function');
      
      const newState = updateFn(state);
      const validated = StateSchema.parse(newState);
      
      setHistory(prev => [...prev.slice(0, currentIndex + 1), validated].slice(-50));
      setCurrentIndex(prev => Math.min(prev + 1, 49));
      setError(null);
    } catch (err) {
      setError(err.message);
      return state;
    }
  }, [state, currentIndex]);

  const undo = useCallback(() => canUndo && setCurrentIndex(prev => prev - 1), [canUndo]);
  const redo = useCallback(() => canRedo && setCurrentIndex(prev => prev + 1), [canRedo]);

  useEffect(() => {
    if (state.version < 2) {
      safeUpdateState(prev => ({
        ...prev,
        preferences: { ...prev.preferences, fontSize: 'medium' },
        version: 2
      }));
    }
  }, [state.version, safeUpdateState]);

  const contextValue = {
    state,
    safeUpdateState,
    undo,
    redo,
    canUndo,
    canRedo,
    error
  };

  return (
    <StateContext.Provider value={contextValue}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => {
  const context = React.useContext(StateContext);
  if (!context) throw new Error('useStateContext must be used within a StateManager');
  return context;
};
