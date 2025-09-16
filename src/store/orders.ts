import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface OrderItem {
  product_id: string;
  quantity: number;
  price: number;
  name: string;
}

export interface Order {
  id: string;
  user_id: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'paid';
  delivery_address: string;
  created_at: string;
}

interface OrderState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  loading: false,
  error: null,
};

export const createOrder = createAsyncThunk(
  'orders/create',
  async (orderData: { items: OrderItem[]; total: number; delivery_address: string }) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(orderData),
    });
    return response.json();
  }
);

export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUser',
  async () => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/orders/user`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.json();
  }
);

export const fetchAllOrders = createAsyncThunk(
  'orders/fetchAll',
  async () => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/orders`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.json();
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateStatus',
  async ({ id, status }: { id: string; status: string }) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/orders/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ status }),
    });
    return response.json();
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.unshift(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create order';
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const index = state.orders.findIndex(order => order.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      });
  },
});

export default ordersSlice.reducer;
export const { } = ordersSlice.actions;

// Export alias for fetchOrders
export const fetchOrders = fetchAllOrders;

// Export cancelOrder function
export const cancelOrder = createAsyncThunk(
  'orders/cancel',
  async (orderId: string) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/orders/${orderId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.json();
  }
);