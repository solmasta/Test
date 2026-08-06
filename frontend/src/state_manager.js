import React, { createContext, useState, useCallback } from 'react';
import { z } from 'zod';

/* ---------------------------------- */
/* 1. Define the schema for the state */
/* ---------------------------------- */
const StateSchema = z.object({
  user: z.object({
    id: z.string().uuid(),
    name: z.string().min(1).max(50),
    email: z.string().email(),
    avatar: z.string().url().optional(),
    bio: z.string().max(200).optional()
  }),
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'quantum', 'matrix', 'cosmic']),
    fontSize: z.enum(['small', 'medium', 'large']),
    animations: z.boolean(),
    quantumMode: z.boolean()
  }),
  version: z.number().default(1)
});

/* ---------------------------------- */
/* 2. Create context and provider */
/* ---------------------------------- */
export const StateContext = createContext();

/**
 * The Verge state manager.
 *
 * - Loads state from localStorage if available
 * - Validates state against the schema
 * - Persists state to localStorage on every update
 * - Provides a safe update helper that catches and reports errors
 */
export const StateManager = ({ children, initialState }) => {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem('app_state');
      if (saved) {
        const parsed = StateSchema.parse(JSON.parse(saved));
        return parsed;
      }
      return StateSchema.parse(initialState);
    } catch (e) {
      console.warn('Failed to load or parse state, using defaults', e);
      return StateSchema.parse(initialState);
    }
  });

  const [error, setError] = useState(null);

  const safeUpdateState = useCallback((updateFn) => {
    try {
      const newState = updateFn(state);
      const validated = StateSchema.parse(newState);
      setState(validated);
      localStorage.setItem('app_state', JSON.stringify(validated));
      setError(null);
    } catch (error) {
      setError(error.message);
      console.error('Verge state update failed:', error);
    }
  }, [state]);

  return (
    <StateContext.Provider value={{ state, safeUpdateState, error }}>
      {children}
    </StateContext.Provider>
  );
};