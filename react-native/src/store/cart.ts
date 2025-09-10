import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem, CartProduct } from '../types';

interface CartState {
  items: CartItem[];
  totalQuantity: number;
  billAmount: number;
  totalAmount: number;
  totalDiscount: number;
}

const initialState: CartState = {
  items: [],
  totalQuantity: 0,
  billAmount: 0,
  totalAmount: 0,
  totalDiscount: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartProduct>) => {
      const product = action.payload;
      const existingItem = state.items.find(item => item.product.id === product.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
        existingItem.totalPrice = existingItem.quantity * product.price;
        existingItem.billPrice = existingItem.quantity * product.price;
      } else {
        const newItem: CartItem = {
          product,
          quantity: 1,
          totalPrice: product.price,
          billPrice: product.price,
          discount: product.mrp - product.price,
        };
        state.items.push(newItem);
      }
      
      cartSlice.caseReducers.calculateTotals(state);
    },
    
    removeFromCart: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      const existingItem = state.items.find(item => item.product.id === productId);
      
      if (existingItem && existingItem.quantity > 1) {
        existingItem.quantity -= 1;
        existingItem.totalPrice = existingItem.quantity * existingItem.product.price;
        existingItem.billPrice = existingItem.quantity * existingItem.product.price;
      } else {
        state.items = state.items.filter(item => item.product.id !== productId);
      }
      
      cartSlice.caseReducers.calculateTotals(state);
    },
    
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.billAmount = 0;
      state.totalAmount = 0;
      state.totalDiscount = 0;
    },
    
    calculateTotals: (state) => {
      state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);
      state.billAmount = state.items.reduce((total, item) => total + item.billPrice, 0);
      state.totalAmount = state.items.reduce((total, item) => total + (item.quantity * item.product.mrp), 0);
      state.totalDiscount = state.totalAmount - state.billAmount;
    },
  },
});

export const { addToCart, removeFromCart, clearCart, calculateTotals } = cartSlice.actions;
export default cartSlice.reducer;