import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cart'
import modalReducer from './modal'
import uiReducer from './ui'
import authReducer from './auth'
import ordersReducer from './orders'
import productsReducer from './products'
import categoriesReducer from './categories'

const store = configureStore({
  reducer: {
    ui: uiReducer,
    cart: cartReducer,
    modal: modalReducer,
    auth: authReducer,
    orders: ordersReducer,
    products: productsReducer,
    categories: categoriesReducer
  }
})

export default store;
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;