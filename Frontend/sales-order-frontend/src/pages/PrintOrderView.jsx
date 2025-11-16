import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSalesOrderById } from '../services/orderApi';
import { formatCurrency, formatDate } from '../utils/formatters';

function PrintOrderView() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        
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

    if (loading) return <div className="p-12 text-center">Preparing Print View...</div>;
    // Added a specific error message if the ID was missing
    if (!order && (id === undefined || isNaN(Number(id)))) {
        return <div className="p-12 text-center text-red-600">Invalid Order ID provided for printing. Please save the order first.</div>;
    }
    if (!order) return <div className="p-12 text-center text-red-600">Order not found for printing.</div>;


    
    return (
        <div className="max-w-4xl p-8 mx-auto font-serif text-sm">
            <header className="pb-4 mb-6 text-center border-b-2 border-black">
                <h1 className="text-2xl font-bold">SALES ORDER RECEIPT</h1>
                <p className="text-gray-700">SPIL Labs (Pvt) Ltd.</p>
                <p className="mt-2 text-xs">Printed: {formatDate(new Date().toISOString())}</p>
            </header>

            <div className="flex justify-between pb-4 mb-8 text-sm border-b border-gray-400">
                <div className="w-1/2 pr-4">
                    <h2 className="mb-1 font-bold">Customer Details</h2>
                    <p>{order.client?.customerName || 'N/A'}</p>
                    <p>{order.client?.address1 || ''}</p>
                    <p>{order.client?.suburb || ''}, {order.client?.state || ''}</p>
                    <p>Post Code: {order.client?.postCode || ''}</p>
                </div>
                <div className="w-1/2 pl-4 text-right">
                    <h2 className="mb-1 font-bold">Invoice Info</h2>
                    <p>Invoice No: **{order.invoiceNo}**</p>
                    <p>Order Date: {formatDate(order.invoiceDate)}</p>
                    <p>Reference: {order.referenceNo}</p>
                </div>
            </div>

            <h3 className="mb-2 text-lg font-bold border-b-2 border-black">Order Items</h3>
            <table className="w-full text-sm border-collapse">
                <thead>
                    <tr>
                        <th className="py-1 font-bold text-left border-b border-black">Item</th>
                        <th className="py-1 font-bold text-right border-b border-black">Qty</th>
                        <th className="py-1 font-bold text-right border-b border-black">Tax (%)</th>
                        <th className="py-1 font-bold text-right border-b border-black">Excl Total</th>
                        <th className="py-1 font-bold text-right border-b border-black">Incl Total</th>
                    </tr>
                </thead>
                <tbody>
                    {order.orderItems.map((item, index) => (
                        <tr key={index} className="border-b border-gray-200">
                            <td>{item.item.itemCode} - {item.item.description}</td>
                            <td className="text-right">{item.quantity}</td>
                            <td className="text-right">{item.tax}%</td>
                            <td className="text-right">{formatCurrency(item.exclAmount)}</td>
                            <td className="font-bold text-right">{formatCurrency(item.inclAmount)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="flex justify-end mt-6 text-sm">
                <div className="w-full max-w-xs pt-2 border-t-2 border-black">
                    <div className="flex justify-between">
                        <p>Total Excl:</p><p>{formatCurrency(order.totalExcl)}</p>
                    </div>
                    <div className="flex justify-between">
                        <p>Total Tax:</p><p>{formatCurrency(order.totalTax)}</p>
                    </div>
                    <div className="flex justify-between mt-1 text-base font-extrabold">
                        <p>Total Incl:</p><p>{formatCurrency(order.totalIncl)}</p>
                    </div>
                </div>
            </div>
            
            <footer className="pt-4 mt-10 text-xs text-center border-t border-black">
                Thank you for your business. This document serves as your official sales receipt.
            </footer>
        </div>
    );
}

export default PrintOrderView;