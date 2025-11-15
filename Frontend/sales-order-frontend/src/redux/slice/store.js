// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import salesOrderReducer from '../slice/salesOrderSlice'; // <-- Check import path
import clientReducer from '../slice/clientSlice'; // <-- Check import path
import itemReducer from '../slice/itemSlice';     // <-- Check import path

export const store = configureStore({
  reducer: {
    // VVV THESE KEYS MUST BE PRESENT AND SPELLED EXACTLY VVV
    salesOrders: salesOrderReducer,
    clients: clientReducer, // The 'clients' key is what state.clients reads
    items: itemReducer,     // The 'items' key is what state.items reads
  },
  // Ensure middleware is set up to handle async thunks
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});