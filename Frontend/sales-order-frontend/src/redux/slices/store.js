// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import salesOrderReducer from './salesOrderSlice'; 
import clientReducer from './clientSlice'; 
import itemReducer from './itemSlice';    
export const store = configureStore({
  reducer: {
    
    salesOrders: salesOrderReducer,
    clients: clientReducer, // The 'clients' key is what state.clients reads
    items: itemReducer,     // The 'items' key is what state.items reads
  },
 
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});