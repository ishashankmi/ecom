import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message';
import { store } from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import { useAppDispatch } from './src/hooks';
import { verifyToken } from './src/store/auth';
import { getToken } from './src/utils/storage';

const AppContent = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getToken();
      if (token) {
        dispatch(verifyToken());
      }
    };
    checkAuth();
  }, [dispatch]);

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <AppNavigator />
      <Toast />
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}