import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productsAPI } from '../services/api';

interface SalesPrice {
  quantity: number;
  price: number;
}

interface Product {
  id: string;
  name: string;
  brand?: string;
  sales_prices?: SalesPrice[];
  mrp: number;
  category: string;
  batch_no?: string;
  expiry_date?: string;
  description: string;
  weight?: string;
  sku?: string;
  hsn?: string;
  images?: string[];
  stock: number;
  price: number;
  image: string;
  created_at?: string;
  modified_at?: string;
}

interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  products: [],
  loading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk('products/fetchAll', async () => {
  const response = await productsAPI.getAll();
  console.log('Products API response:', response.data);
  return response.data;
});

export const createProduct = createAsyncThunk(
  'products/create',
  async (productData: Omit<Product, 'id'>) => {
    const response = await productsAPI.create(productData);
    return response.data;
  }
);

export const updateProduct = createAsyncThunk(
  'products/update',
  async ({ id, ...productData }: Product) => {
    const response = await productsAPI.update(id, productData);
    return response.data;
  }
);

export const deleteProduct = createAsyncThunk(
  'products/delete',
  async (id: string) => {
    await productsAPI.delete(id);
    return id;
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch products';
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.unshift(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(p => p.id !== action.payload);
      });
  },
});

export const { clearError } = productsSlice.actions;
export default productsSlice.reducer;