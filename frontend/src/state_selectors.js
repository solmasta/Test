import { useContext } from 'react';
import { StateContext } from './state_manager';

/**
 * Hook to get the entire state
 */
export const useAppState = () => {
  const { state } = useContext(StateContext);
  return state;
};

/**
 * Hook to get the user slice
 */
export const useUserState = () => {
  const state = useAppState();
  return state.user;
};

/**
 * Hook to get the preferences slice
 */
export const usePreferences = () => {
  const state = useAppState();
  return state.preferences;
};