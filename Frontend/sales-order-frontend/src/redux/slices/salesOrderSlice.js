// src/redux/slices/salesOrderSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllSalesOrders } from '../../services/orderApi'; // Import our new API function

// Define the async thunk for fetching data
export const fetchSalesOrders = createAsyncThunk(
  'salesOrders/fetchSalesOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllSalesOrders();
      return response;
    } catch (err) {
      // Return the error message to the reducer
      return rejectWithValue(err.message);
    }
  }
);

// Define the initial state
const initialState = {
  orders: [],
  isLoading: false,
  error: null,
};

const salesOrderSlice = createSlice({
  name: 'salesOrders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSalesOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSalesOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload; // Store the fetched list of orders
      })
      .addCase(fetchSalesOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.orders = [];
      });
  },
});

export default salesOrderSlice.reducer;