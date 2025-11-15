import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllItems } from '../../services/orderApi'; 

// VVV THE 'EXPORT' KEYWORD HERE IS CRITICAL VVV
export const fetchItems = createAsyncThunk(
  'items/fetchItems',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllItems();
      return response;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  list: [],
  isLoading: false,
  error: null,
};

const itemSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload; 
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.list = [];
      });
  },
});

export default itemSlice.reducer;