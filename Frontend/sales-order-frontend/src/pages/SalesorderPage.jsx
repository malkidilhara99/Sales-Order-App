// src/pages/SalesOrderPage.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

// VVV IMPORT THE HOOK VVV
import { useSalesOrderForm } from '../hooks/useSalesOrderForm'; 
// Import Redux actions
import { fetchClients } from '../redux/slices/clientSlice';
import { fetchItems } from '../redux/slices/itemSlice';

// --- Reusable FormField Component ---
const FormField = ({ label, id, type = 'text', value, onChange, options = [], name, className = '' }) => (
    <div className={`flex flex-col sm:flex-row sm:items-center ${className}`}>
      <label htmlFor={id} className="w-full sm:w-32 text-sm font-medium text-gray-800 mb-1 sm:mb-0">
        {label}
      </label>
      {type === 'textarea' ? (
        <textarea id={id} name={name} value={value} onChange={onChange} className="flex-grow p-1.5 border-2 border-black rounded-none" rows="4"></textarea>
      ) : type === 'select' ? (
        <div className="relative flex-grow">
          <select id={id} name={name} value={value} onChange={onChange} className="w-full p-1.5 border-2 border-black rounded-none appearance-none bg-white">
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
        <input type={type} id={id} name={name} value={value} onChange={onChange} className="flex-grow p-1.5 border-2 border-black rounded-none" />
      )}
    </div>
  );

const lineItemColumns = ['Item Code', 'Description', 'Note', 'Quantity', 'Price', 'Tax', 'Excl Amount', 'Tax Amount', 'Incl. Amount', 'Actions'];
const totalsFields = ['Total Excl', 'Total Tax', 'Total Incl'];

function SalesOrderPage() {
    const { id } = useParams();
    const dispatch = useDispatch();
    
    // Fetch master lists from Redux
    const clientsState = useSelector(state => state.clients);
    const itemsState = useSelector(state => state.items);

    // VVV CALL THE HOOK TO GET ALL LOGIC AND STATE VVV
    const {
        orderData,
        handleClientSelect,
        handleInputChange,
        handleItemChange,
        addNewLineItem,
        removeItemLine,
        handleSave,
    } = useSalesOrderForm(id, clientsState.list, itemsState.list);

    // Fetch master lists (Clients/Items) on component mount
    useEffect(() => {
        if (clientsState.list.length === 0) dispatch(fetchClients());
        if (itemsState.list.length === 0) dispatch(fetchItems());
    }, [dispatch, clientsState.list.length, itemsState.list.length]);

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
                        <span>{id ? 'Update Order' : 'Save Order'}</span>
                    </button>
                </div>

                {/* Form Area */}
                <div className="p-4 space-y-6">
                    {/* Top Section: Customer and Invoice Details */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4">
                        {/* Customer Details */}
                        <div className="space-y-2">
                            <FormField 
                                label="Customer Name" id="customerName" type="select" 
                                value={orderData.clientId} onChange={handleClientSelect} options={clientsState.list} 
                                name="clientId"
                            />
                            <FormField label="Address 1" id="address1" value={orderData.address.address1} onChange={(e) => handleInputChange(e, 'address')} name="address1" />
                            <FormField label="Address 2" id="address2" value={orderData.address.address2} onChange={(e) => handleInputChange(e, 'address')} name="address2" />
                            <FormField label="Address 3" id="address3" value={orderData.address.address3} onChange={(e) => handleInputChange(e, 'address')} name="address3" />
                            <FormField label="Suburb" id="suburb" value={orderData.address.suburb} onChange={(e) => handleInputChange(e, 'address')} name="suburb" />
                            <FormField label="State" id="state" value={orderData.address.state} onChange={(e) => handleInputChange(e, 'address')} name="state" />
                            <FormField label="Post Code" id="postCode" value={orderData.address.postCode} onChange={(e) => handleInputChange(e, 'address')} name="postCode" />
                        </div>
                        {/* Invoice Details */}
                        <div className="space-y-2">
                            <FormField label="Invoice No." id="invoiceNo" value={orderData.invoiceNo} onChange={(e) => handleInputChange(e, 'invoice')} name="invoiceNo" />
                            <FormField label="Invoice Date" id="invoiceDate" type="date" value={orderData.invoiceDate} onChange={(e) => handleInputChange(e, 'invoice')} name="invoiceDate" />
                            <FormField label="Reference no" id="referenceNo" value={orderData.referenceNo} onChange={(e) => handleInputChange(e, 'invoice')} name="referenceNo" />
                            <FormField label="Note" id="note" type="textarea" value={orderData.note} onChange={(e) => handleInputChange(e, 'invoice')} name="note" />
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
                                            ${item.price.toFixed(2)}
                                        </td>
                                        {/* Tax Rate Input */}
                                        <td className="px-2 py-1 border-t-2 border-r-2 border-black last:border-r-0">
                                            <input type="number" name="tax" value={item.tax} onChange={(e) => handleItemChange(rowIndex, e)} className="w-full p-1 bg-transparent focus:outline-none focus:bg-gray-100" />
                                        </td>
                                        {/* Excl Amount (Read-only) */}
                                        <td className="px-2 py-1 border-t-2 border-r-2 border-black last:border-r-0 text-sm font-semibold text-gray-800">
                                            ${item.exclAmount.toFixed(2)}
                                        </td>
                                        {/* Tax Amount (Read-only) */}
                                        <td className="px-2 py-1 border-t-2 border-r-2 border-black last:border-r-0 text-sm font-semibold text-gray-800">
                                            ${item.taxAmount.toFixed(2)}
                                        </td>
                                        {/* Incl Amount (Read-only) */}
                                        <td className="px-2 py-1 border-t-2 border-r-2 border-black last:border-r-0 text-sm text-green-700 font-bold">
                                            ${item.inclAmount.toFixed(2)}
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