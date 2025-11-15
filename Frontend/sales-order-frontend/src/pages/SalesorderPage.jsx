import React from 'react';
import { Link } from 'react-router-dom';

// Reusable component for form fields
const FormField = ({ label, id, type = 'text', placeholder = '', className = '' }) => (
  <div className={`flex flex-col sm:flex-row sm:items-center ${className}`}>
    <label htmlFor={id} className="w-full sm:w-32 text-sm font-medium text-gray-800 mb-1 sm:mb-0">
      {label}
    </label>
    {type === 'textarea' ? (
      <textarea id={id} placeholder={placeholder} className="flex-grow p-1.5 border-2 border-black rounded-none" rows="4"></textarea>
    ) : type === 'select' ? (
      <div className="relative flex-grow">
        <select id={id} className="w-full p-1.5 border-2 border-black rounded-none appearance-none bg-white">
          <option>Select Customer...</option>
          {/* Add customer options here */}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-black">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
        </div>
      </div>
    ) : (
      <input type={type} id={id} placeholder={placeholder} className="flex-grow p-1.5 border-2 border-black rounded-none" />
    )}
  </div>
);

const lineItemColumns = ['Item Code', 'Description', 'Note', 'Quantity', 'Price', 'Tax', 'Excl Amount', 'Tax Amount', 'Incl. Amount'];
const lineItemRows = Array.from({ length: 4 }); // 4 empty rows as per design
const totalsFields = ['Total Excl', 'Total Tax', 'Total Incl'];

function SalesOrderPage() {
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
          <div className="w-16"></div> {/* Spacer */}
        </div>

        {/* Action Bar */}
        <div className="px-4 py-2 border-b-2 border-black flex justify-start">
          <button
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
              <FormField label="Customer Name" id="customerName" type="select" />
              <FormField label="Address 1" id="address1" />
              <FormField label="Address 2" id="address2" />
              <FormField label="Address 3" id="address3" />
              <FormField label="Suburb" id="suburb" />
              <FormField label="State" id="state" />
              <FormField label="Post Code" id="postCode" />
            </div>
            {/* Invoice Details */}
            <div className="space-y-2">
              <FormField label="Invoice No." id="invoiceNo" />
              <FormField label="Invoice Date" id="invoiceDate" type="date" />
              <FormField label="Reference no" id="referenceNo" />
              <FormField label="Note" id="note" type="textarea" />
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
                {lineItemRows.map((_, rowIndex) => (
                  <tr key={rowIndex} className="bg-white">
                    {lineItemColumns.map((_, colIndex) => (
                      <td key={colIndex} className="px-2 py-1 border-t-2 border-r-2 border-black last:border-r-0">
                        <input type="text" className="w-full p-1 bg-transparent focus:outline-none focus:bg-gray-100" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bottom Section: Totals */}
          <div className="flex justify-end">
            <div className="w-full max-w-xs space-y-2">
              {totalsFields.map((field) => (
                <div key={field} className="flex items-center">
                  <label htmlFor={field.toLowerCase().replace(' ', '')} className="w-28 text-sm font-medium text-gray-800">
                    {field}
                  </label>
                  <input type="text" id={field.toLowerCase().replace(' ', '')} readOnly className="flex-grow p-1.5 border-2 border-black rounded-none bg-gray-100" />
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