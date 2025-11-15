// src/hooks/useSalesOrderForm.js
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createSalesOrder, updateSalesOrder, getSalesOrderById, getAllItems } from '../services/orderApi';
import { fetchSalesOrders } from '../redux/slices/salesOrderSlice'; 

// --- Core State and Calculation Logic ---

const initialOrderState = {
    clientId: '',
    invoiceNo: '',
    invoiceDate: new Date().toISOString().substring(0, 10),
    referenceNo: '',
    note: '',
    address: { address1: '', address2: '', address3: '', suburb: '', state: '', postCode: '' },
    orderItems: [{ itemId: '', note: '', quantity: 1, tax: 0, price: 0, exclAmount: 0, taxAmount: 0, inclAmount: 0 }],
    totals: { totalExcl: 0, totalTax: 0, totalIncl: 0 }
};

// Calculation functions (kept local to the hook)
const calculateLineItem = (item, itemsList) => {
    const selectedItem = itemsList.find(i => i.id === item.itemId);
    const price = selectedItem ? selectedItem.price : 0; 
    
    const quantity = Number(item.quantity) || 0;
    const taxRate = Number(item.tax) || 0;

    const exclAmount = quantity * price;
    const taxAmount = (exclAmount * taxRate) / 100;
    const inclAmount = exclAmount + taxAmount;

    return {
        ...item,
        price: price,
        exclAmount: exclAmount,
        taxAmount: taxAmount,
        inclAmount: inclAmount
    };
};

const calculateGrandTotals = (items) => {
    const totalExcl = items.reduce((sum, item) => sum + item.exclAmount, 0);
    const totalTax = items.reduce((sum, item) => sum + item.taxAmount, 0);
    const totalIncl = totalExcl + totalTax;

    return { totalExcl, totalTax, totalIncl };
};

// --- Custom Hook ---

export const useSalesOrderForm = (orderId, clientsList, itemsList) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [orderData, setOrderData] = useState(initialOrderState);

    // Effect for loading existing order data (Editing mode)
    useEffect(() => {
        if (orderId && itemsList.length > 0) {
            const fetchOrderDetails = async () => {
                try {
                    const order = await getSalesOrderById(orderId);
                    if (order) {
                        setOrderData(prev => ({
                            ...prev,
                            clientId: order.clientId,
                            invoiceNo: order.invoiceNo,
                            invoiceDate: order.invoiceDate.substring(0, 10),
                            referenceNo: order.referenceNo,
                            note: order.note,
                            // Recalculate items to ensure prices are current
                            orderItems: order.orderItems.map(item => calculateLineItem(item, itemsList)),
                            totals: calculateGrandTotals(order.orderItems)
                        }));
                    }
                } catch (error) {
                    alert(`Could not load order ID ${orderId}`);
                    navigate('/');
                }
            };
             fetchOrderDetails();
        }
    }, [orderId, itemsList.length, navigate]); // Only re-run when item list loads or ID changes


    // Handler for customer selection (Requirement 1 & 2)
    const handleClientSelect = (e) => {
        const clientId = e.target.value;
        const selectedClient = clientsList.find(c => c.id.toString() === clientId);
        
        // Auto-fill address fields
        if (selectedClient) {
            setOrderData(prev => ({
                ...prev,
                clientId: parseInt(clientId),
                address: {
                    address1: selectedClient.address1 || '',
                    address2: selectedClient.address2 || '',
                    address3: selectedClient.address3 || '',
                    suburb: selectedClient.suburb || '',
                    state: selectedClient.state || '',
                    postCode: selectedClient.postCode || '',
                }
            }));
        } else {
            setOrderData(prev => ({ ...prev, clientId: '' }));
        }
    };

    // Handler for invoice/address changes (Requirement 3)
    const handleInputChange = (e, section) => {
        const { name, value } = e.target;
        if (section === 'address') {
             setOrderData(prev => ({
                ...prev,
                address: { ...prev.address, [name]: value }
            }));
        } else {
             setOrderData(prev => ({ ...prev, [name]: value }));
        }
    };

    // Handler for line item changes (Quantity/Tax/Item - Requirement 5)
    const handleItemChange = (index, e) => {
        const { name, value } = e.target;
        const newItems = [...orderData.orderItems];
        
        newItems[index][name] = (name === 'itemId' || name === 'quantity' || name === 'tax') ? Number(value) : value;

        const updatedItem = calculateLineItem(newItems[index], itemsList);
        newItems[index] = updatedItem;

        setOrderData(prev => {
            const newTotals = calculateGrandTotals(newItems);
            return {
                ...prev,
                orderItems: newItems,
                totals: newTotals
            };
        });
    };

    const addNewLineItem = () => {
        setOrderData(prev => ({
            ...prev,
            orderItems: [
                ...prev.orderItems,
                { itemId: '', note: '', quantity: 1, tax: 0, price: 0, exclAmount: 0, taxAmount: 0, inclAmount: 0 }
            ]
        }));
    };

    const removeItemLine = (index) => {
        const newItems = orderData.orderItems.filter((_, i) => i !== index);
        setOrderData(prev => ({
            ...prev,
            orderItems: newItems,
            totals: calculateGrandTotals(newItems)
        }));
    };

    const handleSave = async () => {
        if (!orderData.clientId || orderData.orderItems.length === 0 || orderData.orderItems.some(i => !i.itemId)) {
            alert('Please select a customer and at least one item.');
            return;
        }

        const orderToSave = {
            clientId: orderData.clientId,
            invoiceNo: orderData.invoiceNo,
            invoiceDate: orderData.invoiceDate,
            referenceNo: orderData.referenceNo,
            note: orderData.note,
            orderItems: orderData.orderItems.map(item => ({
                itemId: item.itemId,
                note: item.note,
                quantity: item.quantity,
                tax: item.tax,
            }))
        };
        
        try {
            if (orderId) {
                await updateSalesOrder(orderId, orderToSave);
                alert(`Order #${orderId} updated successfully!`);
            } else {
                await createSalesOrder(orderToSave);
                alert('New order created successfully!');
            }
            dispatch(fetchSalesOrders()); 
            navigate('/');
        } catch (error) {
            alert(`Error saving order. Check console for details.`);
            console.error(error);
        }
    };

    return {
        orderData,
        handleClientSelect,
        handleInputChange,
        handleItemChange,
        addNewLineItem,
        removeItemLine,
        handleSave,
    };
};