import { createSlice } from '@reduxjs/toolkit';
import { CartItem, CartProduct, PricingTier } from '../utils/types';

type InitialState = {
  cartItems: CartItem[];
  totalQuantity: number;
  totalAmount: number;
  billAmount: number;
  discount: number;
};

const loadCartFromStorage = (): InitialState => {
  try {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      return JSON.parse(savedCart);
    }
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
  }
  return {
    cartItems: [],
    totalQuantity: 0,
    totalAmount: 0,
    billAmount: 0,
    discount: 0
  };
};

const saveCartToStorage = (state: InitialState) => {
  try {
    localStorage.setItem('cart', JSON.stringify(state));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

const initialState: InitialState = loadCartFromStorage();

const getDynamicPrice = (quantity: number, basePrice: number): number => {
  const price = typeof basePrice === 'string' ? parseFloat(basePrice) : basePrice;
  
  if (quantity >= 2) {
    return Math.max(0, price - 10); // ₹10 discount for 2+ items
  }
  
  return price;
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const existingItem = state.cartItems.find(
        (item) => item.product.id === product.id
      );
      
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        const unitPrice = getDynamicPrice(newQuantity, existingItem.product.price);
        existingItem.quantity = newQuantity;
        existingItem.unitPrice = unitPrice;
        existingItem.billPrice = unitPrice * newQuantity;
        existingItem.totalPrice = existingItem.product.mrp * newQuantity;
        existingItem.discount = existingItem.totalPrice - existingItem.billPrice;
      } else {
        const unitPrice = getDynamicPrice(quantity, product.price);
        state.cartItems.push({
          product,
          quantity,
          unitPrice,
          billPrice: unitPrice * quantity,
          totalPrice: product.mrp * quantity,
          discount: (product.mrp * quantity) - (unitPrice * quantity)
        });
      }
      
      state.totalQuantity = state.cartItems.reduce((total, item) => total + item.quantity, 0);
      state.totalAmount = state.cartItems.reduce((total, item) => total + item.totalPrice, 0);
      state.billAmount = state.cartItems.reduce((total, item) => total + item.billPrice, 0);
      state.discount = state.cartItems.reduce((total, item) => total + item.discount, 0);
      saveCartToStorage(state);
    },
    removeItem: (state, action) => {
      const id = action.payload;
      const existingItem = state.cartItems.find(
        (item) => item.product.id === id
      );
      if (existingItem) {
        if (existingItem.quantity === 1) {
          state.cartItems = state.cartItems.filter(
            (item) => item.product.id !== id
          );
        } else {
          const newQuantity = existingItem.quantity - 1;
          const unitPrice = getDynamicPrice(newQuantity, existingItem.product.price);
          existingItem.quantity = newQuantity;
          existingItem.unitPrice = unitPrice;
          existingItem.billPrice = unitPrice * newQuantity;
          existingItem.totalPrice = existingItem.product.mrp * newQuantity;
          existingItem.discount = existingItem.totalPrice - existingItem.billPrice;
        }
      }
      
      state.totalQuantity = state.cartItems.reduce((total, item) => total + item.quantity, 0);
      state.totalAmount = state.cartItems.reduce((total, item) => total + item.totalPrice, 0);
      state.billAmount = state.cartItems.reduce((total, item) => total + item.billPrice, 0);
      state.discount = state.cartItems.reduce((total, item) => total + item.discount, 0);
      saveCartToStorage(state);
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
      state.billAmount = 0;
      state.discount = 0;
      saveCartToStorage(state);
    },

  },
});

export default cartSlice.reducer;
export const { addItem, removeItem, clearCart } = cartSlice.actions;

// Export refreshCartPricing function
export const refreshCartPricing = () => (dispatch: any, getState: any) => {
  const state = getState();
  const cartItems = state.cart.cartItems;
  
  cartItems.forEach((item: any) => {
    const unitPrice = getDynamicPrice(item.quantity, item.product.price);
    item.unitPrice = unitPrice;
    item.billPrice = unitPrice * item.quantity;
    item.discount = item.totalPrice - item.billPrice;
  });
  
  // Recalculate totals
  const totalQuantity = cartItems.reduce((total: number, item: any) => total + item.quantity, 0);
  const totalAmount = cartItems.reduce((total: number, item: any) => total + item.totalPrice, 0);
  const billAmount = cartItems.reduce((total: number, item: any) => total + item.billPrice, 0);
  const discount = cartItems.reduce((total: number, item: any) => total + item.discount, 0);
  
  return { cartItems, totalQuantity, totalAmount, billAmount, discount };
};
