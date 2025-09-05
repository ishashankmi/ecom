import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './';
import { api } from '../lib/api';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, token } = useAppSelector(state => state.auth);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken && !token) {
      // Verify token with backend and set user
      api.get('/auth/me').then(response => {
        // Handle user data if needed
      }).catch(() => {
        localStorage.removeItem('token');
      });
    }
  }, [token, dispatch]);

  return { user, token, isAuthenticated: !!token };
};