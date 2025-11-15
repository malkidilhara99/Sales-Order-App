// src/services/orderApi.js
import axios from 'axios';

// Base URL for API calls (uses proxy from package.json)
const SALES_ORDER_API_URL = '/api/salesorders';
const CLIENT_API_URL = '/api/clients';
const ITEM_API_URL = '/api/items';

// --- Sales Order Endpoints ---

// Function to get all sales orders for the Home screen list (GET /api/salesorders)
export const getAllSalesOrders = async () => {
    try {
        const response = await axios.get(SALES_ORDER_API_URL); 
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Function to get a single order by ID for the Edit page (GET /api/salesorders/{id})
export const getSalesOrderById = async (id) => {
    try {
        const response = await axios.get(`${SALES_ORDER_API_URL}/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Function to create a new order (POST /api/salesorders)
export const createSalesOrder = async (orderData) => {
    try {
        const response = await axios.post(SALES_ORDER_API_URL, orderData);
        return response.data; 
    } catch (error) {
        throw error;
    }
};

// Function to update an existing order (PUT /api/salesorders/{id})
export const updateSalesOrder = async (id, orderData) => {
    try {
        const response = await axios.put(`${SALES_ORDER_API_URL}/${id}`, orderData);
        return response.data; 
    } catch (error) {
        throw error;
    }
};


// --- VVV YOU WERE MISSING THESE TWO FUNCTIONS VVV ---

// Function to get all clients (GET /api/clients)
export const getAllClients = async () => {
    try {
        const response = await axios.get(CLIENT_API_URL);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Function to get all items (GET /api/items)
export const getAllItems = async () => {
    try {
        const response = await axios.get(ITEM_API_URL);
        return response.data;
    } catch (error) {
        throw error;
    }
};