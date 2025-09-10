import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cart';
import authReducer from './auth';
import productsReducer from './products';
import categoriesReducer from './categories';
import ordersReducer from './orders';
import uiReducer from './ui';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    products: productsReducer,
    categories: categoriesReducer,
    orders: ordersReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;