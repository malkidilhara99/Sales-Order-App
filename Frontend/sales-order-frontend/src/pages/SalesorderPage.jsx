import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

// Import Redux and API functions
import { fetchClients } from '../redux/slice/clientSlice';
import { fetchItems } from '../redux/slice/itemSlice';
import { createSalesOrder, updateSalesOrder, getSalesOrderById } from '../services/orderApi';
import { fetchSalesOrders } from '../redux/slice/salesOrderSlice'; 

// --- Initial State and Helpers ---

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

// CORE CALCULATION LOGIC (Requirement 5)
const calculateLineItem = (item, itemsList) => {
    const selectedItem = itemsList.find(i => i.id === item.itemId);
    const price = selectedItem ? selectedItem.price : 0; 
    
    const quantity = Number(item.quantity) || 0;
    const taxRate = Number(item.tax) || 0;

    const exclAmount = quantity * price;                     // Excl Amount = Quantity * Price
    const taxAmount = (exclAmount * taxRate) / 100;          // Tax Amount = Excl Amount * Tax Rate/100
    const inclAmount = exclAmount + taxAmount;               // Incl Amount = Excl Amount + Tax Amount

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

// Reusable component for form fields (retained from your static file)
const FormField = ({ label, id, type = 'text', value, onChange, options = [], className = '' }) => (
    <div className={`flex flex-col sm:flex-row sm:items-center ${className}`}>
      <label htmlFor={id} className="w-full sm:w-32 text-sm font-medium text-gray-800 mb-1 sm:mb-0">
        {label}
      </label>
      {type === 'textarea' ? (
        <textarea id={id} value={value} onChange={onChange} className="flex-grow p-1.5 border-2 border-black rounded-none" rows="4"></textarea>
      ) : type === 'select' ? (
        <div className="relative flex-grow">
          <select id={id} value={value} onChange={onChange} className="w-full p-1.5 border-2 border-black rounded-none appearance-none bg-white">
            <option value="">Select Customer...</option>
            {options.map(opt => (
                <option key={opt.id} value={opt.id}>{opt.customerName}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-black">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
      ) : (
        <input type={type} id={id} value={value} onChange={onChange} readOnly={id.includes('total')} className="flex-grow p-1.5 border-2 border-black rounded-none" />
      )}
    </div>
  );

const lineItemColumns = ['Item Code', 'Description', 'Note', 'Quantity', 'Price', 'Tax', 'Excl Amount', 'Tax Amount', 'Incl. Amount', 'Actions'];
const totalsFields = ['Total Excl', 'Total Tax', 'Total Incl'];

function SalesOrderPage() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const clientsState = useSelector(state => state.clients);
    const itemsState = useSelector(state => state.items);
    
    const [orderData, setOrderData] = useState(initialOrderState);

    // --- EFFECT: FETCH DATA ---
    useEffect(() => {
        // Fetch clients and items lists when the page mounts
        if (clientsState.list.length === 0) dispatch(fetchClients());
        if (itemsState.list.length === 0) dispatch(fetchItems());

        // Logic for EDITING an existing order (GET /api/salesorders/{id})
        if (id) {
            const fetchOrderDetails = async () => {
                const order = await getSalesOrderById(id);
                if (order) {
                    setOrderData(prev => ({
                        ...prev,
                        clientId: order.clientId,
                        invoiceNo: order.invoiceNo,
                        invoiceDate: order.invoiceDate.substring(0, 10),
                        referenceNo: order.referenceNo,
                        note: order.note,
                        orderItems: order.orderItems.map(item => calculateLineItem(item, itemsState.list)),
                        totals: calculateGrandTotals(order.orderItems)
                    }));
                }
            };
            if (itemsState.list.length > 0) {
                 fetchOrderDetails();
            }
        }
    }, [id, dispatch, clientsState.list.length, itemsState.list.length]);


    // --- HANDLERS ---
    
    const handleClientSelect = (e) => {
        const clientId = e.target.value;
        const selectedClient = clientsState.list.find(c => c.id.toString() === clientId);
        
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

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setOrderData(prev => ({
            ...prev,
            address: { ...prev.address, [name]: value }
        }));
    };

    const handleInvoiceChange = (e) => {
        const { name, value } = e.target;
        setOrderData(prev => ({ ...prev, [name]: value }));
    };

    // Handler for changes in the line item grid
    const handleItemChange = (index, e) => {
        const { name, value } = e.target;
        const newItems = [...orderData.orderItems];
        
        newItems[index][name] = (name === 'itemId' || name === 'quantity' || name === 'tax') ? Number(value) : value;

        const updatedItem = calculateLineItem(newItems[index], itemsState.list);
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
        // Validation check (basic)
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
            if (id) {
                // PUT logic for editing
                await updateSalesOrder(id, orderToSave);
                alert(`Order #${id} updated successfully!`);
            } else {
                // POST logic for creating
                await createSalesOrder(orderToSave);
                alert('New order created successfully!');
            }
            dispatch(fetchSalesOrders()); // Refresh the home list
            navigate('/');
        } catch (error) {
            alert(`Error saving order. Check console for details.`);
            console.error(error);
        }
    };


    // --- UI Structure ---
    if (clientsState.isLoading || itemsState.isLoading) return <div className="text-center p-12">Loading Data...</div>;
    
    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
            <div className="max-w-7xl mx-auto border-2 border-black bg-white shadow-lg font-sans">
                {/* Window Header */}
                <div className="flex items-center justify-between border-b-2 border-black px-3 py-1 bg-gray-200">
                    <div className="flex items-center space-x-1.5">
                        <div className="w-3.5 h-3.5 rounded-full border border-black flex items-center justify-center text-black text-sm font-black">
                            <span className="leading-none -mt-px">+</span>
                        </div>
                        <div className="w-3.5 h-3.5 rounded-full border border-black flex items-center justify-center text-black text-sm font-black">
                            <span className="leading-none -mt-px">-</span>
                        </div>
                        <div className="w-3.5 h-3.5 rounded-full border border-black flex items-center justify-center text-black text-sm font-black">
                            <span className="leading-none -mt-px">×</span>
                        </div>
                    </div>
                    <div className="text-sm font-semibold text-black">Sales Order</div>
                    <div className="w-16"></div>
                </div>

                {/* Action Bar */}
                <div className="px-4 py-2 border-b-2 border-black flex justify-start">
                    <button
                        onClick={handleSave}
                        className="bg-gray-200 border-2 border-black text-black px-4 py-1 rounded-md shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:bg-gray-300 active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all duration-150 flex items-center space-x-2"
                    >
                        <span className="text-lg">✔</span>
                        <span>Save Order</span>
                    </button>
                </div>

                {/* Form Area */}
                <div className="p-4 space-y-6">
                    {/* Top Section: Customer and Invoice Details */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4">
                        {/* Customer Details */}
                        <div className="space-y-2">
                            <FormField label="Customer Name" id="customerName" type="select" value={orderData.clientId} onChange={handleClientSelect} options={clientsState.list} />
                            <FormField label="Address 1" id="address1" value={orderData.address.address1} onChange={handleAddressChange} name="address1" />
                            <FormField label="Address 2" id="address2" value={orderData.address.address2} onChange={handleAddressChange} name="address2" />
                            <FormField label="Address 3" id="address3" value={orderData.address.address3} onChange={handleAddressChange} name="address3" />
                            <FormField label="Suburb" id="suburb" value={orderData.address.suburb} onChange={handleAddressChange} name="suburb" />
                            <FormField label="State" id="state" value={orderData.address.state} onChange={handleAddressChange} name="state" />
                            <FormField label="Post Code" id="postCode" value={orderData.address.postCode} onChange={handleAddressChange} name="postCode" />
                        </div>
                        {/* Invoice Details */}
                        <div className="space-y-2">
                            <FormField label="Invoice No." id="invoiceNo" value={orderData.invoiceNo} onChange={handleInvoiceChange} name="invoiceNo" />
                            <FormField label="Invoice Date" id="invoiceDate" type="date" value={orderData.invoiceDate} onChange={handleInvoiceChange} name="invoiceDate" />
                            <FormField label="Reference no" id="referenceNo" value={orderData.referenceNo} onChange={handleInvoiceChange} name="referenceNo" />
                            <FormField label="Note" id="note" type="textarea" value={orderData.note} onChange={handleInvoiceChange} name="note" />
                        </div>
                    </div>

                    {/* Middle Section: Line Items Table */}
                    <div className="border-2 border-black overflow-x-auto">
                        <table className="min-w-full border-collapse">
                            <thead className="border-b-2 border-black">
                                <tr>
                                    {lineItemColumns.map((col) => (
                                        <th key={col} className="bg-gray-200 text-left text-sm font-semibold text-black px-3 py-2 border-r-2 border-black last:border-r-0">
                                            {col}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {orderData.orderItems.map((item, rowIndex) => (
                                    <tr key={rowIndex} className="bg-white">
                                        {/* Item Code Dropdown */}
                                        <td className="px-2 py-1 border-t-2 border-r-2 border-black last:border-r-0">
                                            <select 
                                                name="itemId"
                                                value={item.itemId}
                                                onChange={(e) => handleItemChange(rowIndex, e)}
                                                className="w-full p-1 bg-transparent focus:outline-none focus:bg-gray-100"
                                            >
                                                <option value="">Code</option>
                                                {itemsState.list.map(i => (
                                                    <option key={i.id} value={i.id}>{i.itemCode}</option>
                                                ))}
                                            </select>
                                        </td>
                                        {/* Description Dropdown */}
                                        <td className="px-2 py-1 border-t-2 border-r-2 border-black last:border-r-0">
                                            <select 
                                                name="itemId"
                                                value={item.itemId}
                                                onChange={(e) => handleItemChange(rowIndex, e)}
                                                className="w-full p-1 bg-transparent focus:outline-none focus:bg-gray-100"
                                            >
                                                <option value="">Description</option>
                                                {itemsState.list.map(i => (
                                                    <option key={i.id} value={i.id}>{i.description}</option>
                                                ))}
                                            </select>
                                        </td>
                                        {/* Note Input */}
                                        <td className="px-2 py-1 border-t-2 border-r-2 border-black last:border-r-0">
                                            <input type="text" name="note" value={item.note} onChange={(e) => handleItemChange(rowIndex, e)} className="w-full p-1 bg-transparent focus:outline-none focus:bg-gray-100" />
                                        </td>
                                        {/* Quantity Input */}
                                        <td className="px-2 py-1 border-t-2 border-r-2 border-black last:border-r-0">
                                            <input type="number" name="quantity" value={item.quantity} onChange={(e) => handleItemChange(rowIndex, e)} className="w-full p-1 bg-transparent focus:outline-none focus:bg-gray-100" />
                                        </td>
                                        {/* Price (Read-only) */}
                                        <td className="px-2 py-1 border-t-2 border-r-2 border-black last:border-r-0 text-sm font-medium text-gray-700">
                                            {item.price.toFixed(2)}
                                        </td>
                                        {/* Tax Rate Input */}
                                        <td className="px-2 py-1 border-t-2 border-r-2 border-black last:border-r-0">
                                            <input type="number" name="tax" value={item.tax} onChange={(e) => handleItemChange(rowIndex, e)} className="w-full p-1 bg-transparent focus:outline-none focus:bg-gray-100" />
                                        </td>
                                        {/* Excl Amount (Read-only) */}
                                        <td className="px-2 py-1 border-t-2 border-r-2 border-black last:border-r-0 text-sm font-semibold text-gray-800">
                                            {item.exclAmount.toFixed(2)}
                                        </td>
                                        {/* Tax Amount (Read-only) */}
                                        <td className="px-2 py-1 border-t-2 border-r-2 border-black last:border-r-0 text-sm font-semibold text-gray-800">
                                            {item.taxAmount.toFixed(2)}
                                        </td>
                                        {/* Incl Amount (Read-only) */}
                                        <td className="px-2 py-1 border-t-2 border-r-2 border-black last:border-r-0 text-sm text-green-700 font-bold">
                                            {item.inclAmount.toFixed(2)}
                                        </td>
                                        {/* Actions */}
                                        <td className="px-2 py-1 border-t-2 border-r-2 border-black last:border-r-0 text-center">
                                            <button onClick={() => removeItemLine(rowIndex)} className="text-red-500 hover:text-red-700 text-sm">X</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {/* Button to add a new line item */}
                        <div className='p-3 bg-gray-100 flex justify-start border-t-2 border-black'>
                            <button
                                onClick={addNewLineItem}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                                + Add Item Line
                            </button>
                        </div>
                    </div>

                    {/* Bottom Section: Totals */}
                    <div className="flex justify-end pt-4">
                        <div className="w-full max-w-xs space-y-2">
                            {totalsFields.map((field) => (
                                <div key={field} className="flex items-center">
                                    <label htmlFor={field.toLowerCase().replace(/ /g, '')} className="w-28 text-sm font-medium text-gray-800">
                                        {field}
                                    </label>
                                    {/* Display field (Read-only, matching design input style) */}
                                    <input 
                                        type="text" 
                                        id={field.toLowerCase().replace(/ /g, '')} 
                                        readOnly 
                                        value={field === 'Total Excl' ? orderData.totals.totalExcl.toFixed(2) : field === 'Total Tax' ? orderData.totals.totalTax.toFixed(2) : orderData.totals.totalIncl.toFixed(2)}
                                        className="flex-grow p-1.5 border-2 border-black rounded-none bg-gray-100 text-right font-bold" 
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SalesOrderPage;