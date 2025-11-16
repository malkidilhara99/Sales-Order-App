import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSalesOrderById } from '../services/orderApi';
import { formatCurrency, formatDate } from '../utils/formatters';

function PrintOrderView() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // VVV ADD THIS GUARD VVV
        if (!id || isNaN(Number(id))) {
             setLoading(false);
             return; 
        }

        const fetchOrder = async () => {
            try {
                // Fetch the detailed order data using the ID from the URL
                const data = await getSalesOrderById(id); 
                setOrder(data);
            } catch (error) {
                // Log error instead of intrusive alert
                console.error("Error fetching print order:", error);
                setOrder(null);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    useEffect(() => {
        // Automatically open the print dialog once the data loads
        if (order) {
            // Delay slightly to ensure browser rendering is complete before printing
            setTimeout(() => window.print(), 500);
        }
    }, [order]);

    if (loading) return <div className="text-center p-12">Preparing Print View...</div>;
    // Added a specific error message if the ID was missing
    if (!order && (id === undefined || isNaN(Number(id)))) {
        return <div className="text-center p-12 text-red-600">Invalid Order ID provided for printing. Please save the order first.</div>;
    }
    if (!order) return <div className="text-center p-12 text-red-600">Order not found for printing.</div>;


    // Use Tailwind CSS to define a clean, receipt-like layout for printing
    return (
        <div className="p-8 max-w-4xl mx-auto font-serif text-sm">
            <header className="text-center border-b-2 border-black pb-4 mb-6">
                <h1 className="text-2xl font-bold">SALES ORDER RECEIPT</h1>
                <p className="text-gray-700">SPIL Labs (Pvt) Ltd.</p>
                <p className="text-xs mt-2">Printed: {formatDate(new Date().toISOString())}</p>
            </header>

            <div className="flex justify-between mb-8 text-sm border-b border-gray-400 pb-4">
                <div className="w-1/2 pr-4">
                    <h2 className="font-bold mb-1">Customer Details</h2>
                    <p>{order.client?.customerName || 'N/A'}</p>
                    <p>{order.client?.address1 || ''}</p>
                    <p>{order.client?.suburb || ''}, {order.client?.state || ''}</p>
                    <p>Post Code: {order.client?.postCode || ''}</p>
                </div>
                <div className="w-1/2 pl-4 text-right">
                    <h2 className="font-bold mb-1">Invoice Info</h2>
                    <p>Invoice No: **{order.invoiceNo}**</p>
                    <p>Order Date: {formatDate(order.invoiceDate)}</p>
                    <p>Reference: {order.referenceNo}</p>
                </div>
            </div>

            <h3 className="text-lg font-bold border-b-2 border-black mb-2">Order Items</h3>
            <table className="w-full text-sm border-collapse">
                <thead>
                    <tr>
                        <th className="text-left font-bold border-b border-black py-1">Item</th>
                        <th className="text-right font-bold border-b border-black py-1">Qty</th>
                        <th className="text-right font-bold border-b border-black py-1">Tax (%)</th>
                        <th className="text-right font-bold border-b border-black py-1">Excl Total</th>
                        <th className="text-right font-bold border-b border-black py-1">Incl Total</th>
                    </tr>
                </thead>
                <tbody>
                    {order.orderItems.map((item, index) => (
                        <tr key={index} className="border-b border-gray-200">
                            <td>{item.item.itemCode} - {item.item.description}</td>
                            <td className="text-right">{item.quantity}</td>
                            <td className="text-right">{item.tax}%</td>
                            <td className="text-right">{formatCurrency(item.exclAmount)}</td>
                            <td className="text-right font-bold">{formatCurrency(item.inclAmount)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="flex justify-end mt-6 text-sm">
                <div className="w-full max-w-xs border-t-2 border-black pt-2">
                    <div className="flex justify-between">
                        <p>Total Excl:</p><p>{formatCurrency(order.totalExcl)}</p>
                    </div>
                    <div className="flex justify-between">
                        <p>Total Tax:</p><p>{formatCurrency(order.totalTax)}</p>
                    </div>
                    <div className="flex justify-between text-base font-extrabold mt-1">
                        <p>Total Incl:</p><p>{formatCurrency(order.totalIncl)}</p>
                    </div>
                </div>
            </div>
            
            <footer className="text-center text-xs mt-10 border-t border-black pt-4">
                Thank you for your business. This document serves as your official sales receipt.
            </footer>
        </div>
    );
}

export default PrintOrderView;