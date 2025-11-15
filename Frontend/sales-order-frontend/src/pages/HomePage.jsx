
import { fetchSalesOrders } from '../redux/slice/salesOrderSlice';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect } from 'react';

const COLUMN_COUNT = 7;
const ROW_COUNT = 8; // As per the Figma design

function HomePage() {
  const columns = Array.from({ length: COLUMN_COUNT }, (_, i) => `Col ${i + 1}`);
  const rows = Array.from({ length: ROW_COUNT });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get data and status from the Redux store
  const { orders, isLoading, error } = useSelector((state) => state.salesOrders);

  // VVV CORE LOGIC: Fetch data when the component loads VVV
  useEffect(() => {
    // Dispatch the asynchronous thunk action
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
    return <div className="text-center p-12 text-blue-600 font-semibold">Loading Orders...</div>;
  }
  if (error) {
    return <div className="text-center p-12 text-red-600 font-semibold">Error: {error}</div>;
  }

  // Determine the rows to display (real data + empty placeholders for padding)
  const displayRows = orders.length > 0 ? orders : Array.from({ length: 8 });

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
          <div className="text-sm font-semibold text-black">Home</div>
          <div className="w-16"></div> {/* Spacer */}
        </div>

        {/* Action Bar */}
        <div className="px-4 py-2 border-b-2 border-black flex justify-start">
          <Link
            to="/sales-order/new"
            className="bg-gray-200 border-2 border-black text-black px-4 py-1 rounded-md shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:bg-gray-300 active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all duration-150"
          onClick={handleAddNew}>
            Add New
          </Link>
        </div>

        {/* Table Area */}
 {/* Table Area */}
        <div className="p-4">
          <div className="border-2 border-black overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead className="border-b-2 border-black">
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col}
                      className="bg-gray-200 text-left text-sm font-semibold text-black px-4 py-2 border-r-2 border-black last:border-r-0"
                    >
                      <div className="flex items-center">
                        <span className="mr-2 text-black">▼</span>
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
                    key={rowIndex} 
                    className="cursor-pointer"
                    onDoubleClick={() => order && handleDoubleClick(order.id)}
                  >
                    {/* Render Columns */}
                    {columns.map((_, colIndex) => {
                      // Determine the cell content based on data availability
                      let content = order ? (
                        colIndex === 0 ? order.invoiceNo : 
                        colIndex === 1 ? new Date(order.invoiceDate).toLocaleDateString() : 
                        colIndex === 2 ? order.customerName : 
                        colIndex === 3 ? `$${order.totalIncl.toFixed(2)}` : 
                        '—'
                      ) : (
                        <span className="text-gray-500">"</span>
                      );

                      return (
                        <td
                          key={colIndex}
                          className="px-4 py-2 border-t-2 border-r-2 border-black last:border-r-0"
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