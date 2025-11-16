import axios from 'axios';

const SALES_ORDER_API_URL = '/api/salesorders';
const CLIENT_API_URL = '/api/clients';
const ITEM_API_URL = '/api/items';

// --- Sales Order Endpoints ---

export const getAllSalesOrders = async () => {
    try {
        const response = await axios.get(SALES_ORDER_API_URL); 
        return response.data;
    } catch (error) {
        throw error;
    }
};


export const getSalesOrderById = async (id) => {
    try {
        // GET /api/salesorders/{id}
        const response = await axios.get(`${SALES_ORDER_API_URL}/${id}`);
        // The API returns the Client embedded in the order, but we may need the full Client list.
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createSalesOrder = async (orderData) => {
    try {
        const response = await axios.post(SALES_ORDER_API_URL, orderData);
        return response.data; 
    } catch (error) {
        throw error;
    }
};

export const updateSalesOrder = async (id, orderData) => {
    try {
        const response = await axios.put(`${SALES_ORDER_API_URL}/${id}`, orderData);
        return response.data; 
    } catch (error) {
        throw error;
    }
};


// --- Master Data Endpoints ---

export const getAllClients = async () => {
    try {
        const response = await axios.get(CLIENT_API_URL);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getAllItems = async () => {
    try {
        const response = await axios.get(ITEM_API_URL);
        return response.data;
    } catch (error) {
        throw error;
    }
};