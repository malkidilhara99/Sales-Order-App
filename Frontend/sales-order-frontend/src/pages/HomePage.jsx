import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSalesOrders } from '../redux/slices/salesOrderSlice'; 
import { formatDate } from '../utils/formatters'; 
import { formatCurrency } from '../utils/formatters'; // <-- Ensure this is imported and used

const columns = ['Invoice No.', 'Date', 'Customer Name', 'Total Incl.', 'Reference No.', 'Total Items', 'Actions'];

function HomePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get data and status from the Redux store
  const { orders, isLoading, error } = useSelector((state) => state.salesOrders);

  // VVV CORE LOGIC: Fetch data when the component loads VVV
  useEffect(() => {
    dispatch(fetchSalesOrders());
  }, [dispatch]);


  const handleDoubleClick = (id) => {
    // Navigates to the edit page when a row is double-clicked (Requirement)
    navigate(`/sales-order/${id}`);
  };

  const handleAddNew = () => {
    // Navigates to the form page for a new order
    navigate('/sales-order/new');
  };

  // --- Displaying Loading/Error States ---
  if (isLoading) {
    return <div className="p-12 font-semibold text-center text-blue-600">Loading Orders...</div>;
  }
  if (error) {
    return <div className="p-12 font-semibold text-center text-red-600">Error: {error}</div>;
  }

  // Determine the rows to display (real data + empty placeholders for padding)
  const displayRows = orders.length > 0 ? orders : Array.from({ length: 8 });

  return (
    // Outer container: Reduced padding on mobile (p-4)
    <div className="min-h-screen p-4 bg-gray-100 rounded-lg sm:p-6">
      
      {/* Max width container for desktop, strong border styling retained */}
      <div className="w-full mx-auto font-sans bg-white border-2 border-black rounded-lg shadow-lg max-w-7xl">
        
        {/* Window Header (Non-functional, cosmetic) */}
        <div className="flex items-center justify-between px-3 py-1 bg-gray-200 border-b-2 border-black rounded-t-lg">
          <div className="flex items-center space-x-1.5">
            <div className="w-3.5 h-3.5 rounded-full border border-black flex items-center justify-center text-white bg-black text-sm font-black">
              <span className="-mt-px leading-none">+</span>
            </div>
            <div className="w-3.5 h-3.5 rounded-full border border-black flex items-center justify-center text-white bg-black text-sm font-black">
              <span className="-mt-px leading-none">-</span>
            </div>
            <div className="w-3.5 h-3.5 rounded-full border border-black flex items-center justify-center text-white bg-black text-sm font-black">
              <span className="-mt-px leading-none">×</span>
            </div>
          </div>
          <div className="text-sm font-bold text-black md:text-xl">Home</div>
          <div className="w-16"></div> 
        </div>

        {/* Action Bar */}
        <div className="flex justify-start px-4 py-2 border-b-2 border-black">
          <button
            onClick={handleAddNew}
            className="bg-gray-200 border-2 border-black font-bold text-black md:px-6  px-4 py-1 rounded-md shadow-[2px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-300 active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all duration-150"
          >
            Add New
          </button>
        </div>

        {/* Table Area (Horizontal scrolling for small screens) */}
        <div className="p-4">
          <div className="overflow-x-auto border-2 border-black">
            
            {/* The table MUST use min-w-full to stretch, enabling controlled scrolling on mobile */}
            <table className="min-w-full border-collapse">
              <thead className="border-b-2 border-black">
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col}
                      className="px-4 py-2 text-sm font-semibold text-left text-black bg-gray-200 border-r-2 border-black last:border-r-0 whitespace-nowrap"
                    >
                      <div className="flex items-center">
                        <span className="mr-1 text-black md:mr-2">▼</span>
                        {col}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Map over actual orders OR empty array for padding */}
                {displayRows.map((order, rowIndex) => (
                  <tr 
                    key={order ? order.id : rowIndex} 
                    className={rowIndex % 2 !== 0 ? 'bg-gray-100 hover:bg-gray-200' : 'bg-white hover:bg-gray-100'}
                    onDoubleClick={() => order && handleDoubleClick(order.id)}
                  >
                    {/* Render Columns */}
                    {columns.map((_, colIndex) => {
                      // Determine the content for the columns based on real data
                      let content;
                      if (order) {
                        switch(colIndex) {
                          case 0: content = order.invoiceNo; break;
                          case 1: content = formatDate(order.invoiceDate); break;
                          case 2: content = order.customerName; break;
                          case 3: content = formatCurrency(order.totalIncl); break; // Use formatter here
                          case 4: content = order.referenceNo; break; // Added Reference No.
                          case 5: content = order.totalItems || 'N/A'; break; // Placeholder or actual count
                          case 6: content = (
                    <Link 
                        // Link directly to the edit route
                        to={`/sales-order/${order.id}`} 
                        className="font-semibold text-blue-600 underline hover:text-blue-800"
                    >
                        View/Edit
                    </Link>
                ); break; // Added Action Column
                          default: content = '—';
                        }
                      } else {
                        // Placeholder content for empty rows
                        content = <span className="text-gray-500">"</span>;
                      }

                      return (
                        <td
                          key={colIndex}
                          className="px-4 py-2 text-sm border-t-2 border-r-2 border-black last:border-r-0 whitespace-nowrap"
                        >
                          {content}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;