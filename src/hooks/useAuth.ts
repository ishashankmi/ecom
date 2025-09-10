import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './';
import { api } from '../lib/api';
import { cookieUtils } from '../utils/cookies';
import { verifyToken } from '../store/auth';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, token } = useAppSelector(state => state.auth);

  useEffect(() => {
    const storedToken = cookieUtils.getToken();
    if (storedToken && !user) {
      dispatch(verifyToken());
    }
  }, [user, dispatch]);

  return { user, token, isAuthenticated: !!token };
};