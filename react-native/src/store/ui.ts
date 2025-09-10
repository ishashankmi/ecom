import { createSlice } from '@reduxjs/toolkit';

interface UIState {
  cartVisible: boolean;
  loading: boolean;
}

const initialState: UIState = {
  cartVisible: false,
  loading: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    showCart: (state) => {
      state.cartVisible = true;
    },
    hideCart: (state) => {
      state.cartVisible = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { showCart, hideCart, setLoading } = uiSlice.actions;
export default uiSlice.reducer;