// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import salesOrderReducer from './salesOrderSlice'; 
import clientReducer from './clientSlice'; 
import itemReducer from './itemSlice';    
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