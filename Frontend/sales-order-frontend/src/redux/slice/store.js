// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';

// Temporary placeholder reducer so the store has a valid reducer.
// Replace this by importing your real slice reducers and passing
// an object to `reducer`, for example:
// import salesOrderReducer from './salesOrderSlice';
// reducer: { salesOrders: salesOrderReducer }
const placeholderReducer = (state = {}, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export const store = configureStore({
  reducer: placeholderReducer,
});