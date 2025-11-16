import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { formatCurrency } from '../utils/formatters'; 
import { useSalesOrderForm } from '../hooks/useSalesOrderForm'; 
import { fetchClients } from '../redux/slices/clientSlice';
import { fetchItems } from '../redux/slices/itemSlice';

// --- Reusable FormField Component ---
const FormField = ({ label, id, type = 'text', value, onChange, options = [], name, className = '' }) => (
    <div className={`flex flex-col sm:flex-row sm:items-center`}>
      <label htmlFor={id} className="w-full mb-1 text-sm font-medium text-gray-800 sm:w-32 sm:mb-0">
        {label}
      </label>
      {type === 'textarea' ? (
        <textarea id={id} name={name} value={value} onChange={onChange} className="flex-grow p-1.5 border-2 border-black rounded-none" rows="4"></textarea>
      ) : type === 'select' ? (
        <div className="relative flex-grow">
          <select id={id} name={name} value={value} onChange={onChange} className="w-full p-1.5 border-2 border-black rounded-none appearance-none bg-white">
            <option value="">Select Customer...</option>
            {options.map(opt => (
                <option key={opt.id || opt.customerName} value={opt.id}>{opt.customerName}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 text-black pointer-events-none">
            <svg className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
      ) : (
        <input type={type} id={id} name={name} value={value} onChange={onChange} className="flex-grow p-1.5 border-2 border-black rounded-none" />
      )}
    </div>
  );

// --- Print Confirmation Modal Component ---
const PrintConfirmationModal = ({ show, orderId, onConfirm }) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600 bg-opacity-50">
            <div className="p-6 font-sans text-sm bg-white border-4 border-black shadow-2xl w-80">
                <p className="mb-4 text-lg font-bold">Order Saved!</p>
                <p className="mb-6">Do you want to print this Invoice  now?</p>
                <div className="flex justify-between space-x-2">
                    <button
                        onClick={() => onConfirm(true)}
                        className="flex-1 px-4 py-2 font-bold text-white transition bg-green-500 rounded-md shadow-md hover:bg-green-600"
                    >
                        Yes, Print
                    </button>
                    <button
                        onClick={() => onConfirm(false)}
                        className="flex-1 px-4 py-2 font-bold text-black transition bg-gray-200 border border-gray-400 rounded-md shadow-md hover:bg-gray-300"
                    >
                        No, Go Home
                    </button>
                </div>
            </div>
        </div>
    );
};
// --- END MODAL COMPONENT ---


const lineItemColumns = ['Item Code', 'Description', 'Note', 'Quantity', 'Price', 'Tax', 'Excl Amount', 'Tax Amount', 'Incl. Amount', 'Actions'];
const totalsFields = ['Total Excl', 'Total Tax', 'Total Incl'];

function SalesOrderPage() {
    const { id } = useParams();
    const dispatch = useDispatch();
    
    // Fetch master lists from Redux
    const clientsState = useSelector(state => state.clients || { list: [], isLoading: false });
    const itemsState = useSelector(state => state.items || { list: [], isLoading: false });

    // VVV CALL THE HOOK TO GET ALL LOGIC AND STATE VVV
    const {
        orderData,
        handleClientSelect,
        handleInputChange,
        handleItemChange,
        addNewLineItem,
        removeItemLine,
        handleSave,
        // VVV MODAL STATE FROM HOOK VVV
        showPrintConfirm,
        handlePrintConfirm,
        savedOrderId
    } = useSalesOrderForm(id, clientsState.list, itemsState.list);

    // Fetch master lists (Clients/Items) on component mount
    useEffect(() => {
        if (clientsState.list.length === 0) dispatch(fetchClients());
        if (itemsState.list.length === 0) dispatch(fetchItems());
    }, [dispatch, clientsState.list.length, itemsState.list.length]);

    // --- UI Structure ---
    if (clientsState.isLoading || itemsState.isLoading) return <div className="p-12 text-center">Loading Data...</div>;

    return (
        // Responsive Container: Padding on all sides (p-4)
        <div className="min-h-screen p-4 bg-gray-100 sm:p-6">
            <PrintConfirmationModal 
                show={showPrintConfirm} 
                orderId={savedOrderId} 
                onConfirm={handlePrintConfirm} 
            />

            <div className="mx-auto font-sans bg-white border-2 border-black shadow-lg max-w-7xl">
                {/* Window Header */}
                <div className="flex items-center justify-between px-3 py-1 bg-gray-200 border-b-2 border-black">
                    <div className="flex items-center space-x-1.5">
                        <div className="w-3.5 h-3.5 rounded-full border border-black flex items-center justify-center text-black text-sm font-black">
                            <span className="-mt-px leading-none">+</span>
                        </div>
                        <div className="w-3.5 h-3.5 rounded-full border border-black flex items-center justify-center text-black text-sm font-black">
                            <span className="-mt-px leading-none">-</span>
                        </div>
                        <div className="w-3.5 h-3.5 rounded-full border border-black flex items-center justify-center text-black text-sm font-black">
                            <span className="-mt-px leading-none">×</span>
                        </div>
                    </div>
                    <div className="text-sm font-semibold text-black md:text-xl">Sales Order</div>
                    <div className="w-16"></div>
                </div>

                {/* Action Bar */}
                <div className="flex justify-start px-4 py-2 space-x-2 border-b-2 border-black">
                    <button
                        onClick={handleSave}
                        className="bg-gray-200 border-2 border-black text-black px-4 py-1 rounded-md shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:bg-gray-300 active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all duration-150 flex items-center space-x-2"
                    >
                        <span className="text-lg">✔</span>
                        <span>{id ? 'Update Order' : 'Save Order'}</span>
                    </button>
                    
                    {/* Print Button (Only show if ID exists and is NOT a confirmation dialog) */}
                    {id && !showPrintConfirm && (
                        <button
                            onClick={() => window.open(`/print-order/${id}`, '_blank')}
                            className="bg-gray-200 border-2 border-black text-black px-4 py-1 rounded-md shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:bg-gray-300 active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all duration-150 flex items-center space-x-2"
                        >
                            🖨️ Print Order
                        </button>
                    )}
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
                    <div className="overflow-x-auto border-2 border-black">
                        <table className="min-w-full border-collapse">
                            <thead className="border-b-2 border-black">
                                <tr>
                                    {lineItemColumns.map((col) => (
                                        <th key={col} className="px-3 py-2 text-sm font-semibold text-left text-black bg-gray-200 border-r-2 border-black last:border-r-0 whitespace-nowrap">
                                            {col}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {orderData.orderItems.map((item, rowIndex) => (
                                    <tr key={rowIndex} className="bg-white">
                                        {/* Item Code Dropdown */}
                                        <td className="w-1/12 px-2 py-1 border-t-2 border-r-2 border-black last:border-r-0">
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
                                        <td className="w-2/12 px-2 py-1 border-t-2 border-r-2 border-black last:border-r-0">
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
                                        <td className="w-2/12 px-2 py-1 border-t-2 border-r-2 border-black last:border-r-0">
                                            <input type="text" name="note" value={item.note} onChange={(e) => handleItemChange(rowIndex, e)} className="w-full p-1 bg-transparent focus:outline-none focus:bg-gray-100" />
                                        </td>
                                        {/* Quantity Input */}
                                        <td className="w-1/12 px-2 py-1 border-t-2 border-r-2 border-black last:border-r-0">
                                            <input type="number" name="quantity" value={item.quantity} onChange={(e) => handleItemChange(rowIndex, e)} className="w-full p-1 text-right bg-transparent focus:outline-none focus:bg-gray-100" />
                                        </td>
                                        {/* Price (Read-only) */}
                                        <td className="w-1/12 px-2 py-1 text-sm font-medium text-right text-gray-700 border-t-2 border-r-2 border-black last:border-r-0 whitespace-nowrap">
                                            {formatCurrency(item.price)}
                                        </td>
                                        {/* Tax Rate Input */}
                                        <td className="w-1/12 px-2 py-1 border-t-2 border-r-2 border-black last:border-r-0">
                                            <input type="number" name="tax" value={item.tax} onChange={(e) => handleItemChange(rowIndex, e)} className="w-full p-1 text-right bg-transparent focus:outline-none focus:bg-gray-100" />
                                        </td>
                                        {/* Excl Amount (Read-only) */}
                                        <td className="w-1/12 px-2 py-1 text-sm font-semibold text-right text-gray-800 border-t-2 border-r-2 border-black last:border-r-0 whitespace-nowrap">
                                            {formatCurrency(item.exclAmount)}
                                        </td>
                                        {/* Tax Amount (Read-only) */}
                                        <td className="w-1/12 px-2 py-1 text-sm font-semibold text-right text-gray-800 border-t-2 border-r-2 border-black last:border-r-0 whitespace-nowrap">
                                            {formatCurrency(item.taxAmount)}
                                        </td>
                                        {/* Incl Amount (Read-only) */}
                                        <td className="w-1/12 px-2 py-1 text-sm font-bold text-right text-green-700 border-t-2 border-r-2 border-black last:border-r-0 whitespace-nowrap">
                                            {formatCurrency(item.inclAmount)}
                                        </td>
                                        {/* Actions */}
                                        <td className="w-1/12 px-2 py-1 text-center border-t-2 border-r-2 border-black last:border-r-0">
                                            <button onClick={() => removeItemLine(rowIndex)} className="text-sm text-red-500 hover:text-red-700">X</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {/* Button to add a new line item */}
                        <div className='flex justify-start p-3 bg-gray-100 border-t-2 border-black'>
                            <button
                                onClick={addNewLineItem}
                                className="text-sm font-medium text-blue-600 hover:text-blue-800"
                            >
                                + Add Item Line
                            </button>
                        </div>
                    </div>

                    {/* Bottom Section: Totals */}
                    <div className="flex justify-end pt-4">
                        {/* Max-w-xs keeps the totals small even on wide screens */}
                        <div className="w-full max-w-xs space-y-2">
                            {totalsFields.map((field) => (
                                <div key={field} className="flex items-center">
                                    <label htmlFor={field.toLowerCase().replace(/ /g, '')} className="text-sm font-medium text-gray-800 w-28">
                                        {field}
                                    </label>
                                    {/* Display field with currency formatting */}
                                    <input 
                                        type="text" 
                                        id={field.toLowerCase().replace(/ /g, '')} 
                                        readOnly 
                                        value={
                                            field === 'Total Excl' ? formatCurrency(orderData.totals.totalExcl) : 
                                            field === 'Total Tax' ? formatCurrency(orderData.totals.totalTax) : 
                                            formatCurrency(orderData.totals.totalIncl)
                                        }
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