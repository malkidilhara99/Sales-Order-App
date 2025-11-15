// src/redux/slices/clientSlice.js

// VVV ADD createAsyncThunk HERE VVV
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllClients } from '../../services/orderApi'; 

// VVV EXPORT THE THUNK HERE VVV
export const fetchClients = createAsyncThunk(
  'clients/fetchClients',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllClients();
      return response;
    } catch (err) {
      // Return the error message to the reducer
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  list: [], // Renamed from 'clients' to 'list' for consistency
  isLoading: false,
  error: null,
};

const clientSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload; // Store the fetched list of clients
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.list = [];
      });
  },
});

// The default export is the reducer
export default clientSlice.reducer;