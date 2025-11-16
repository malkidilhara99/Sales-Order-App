
import './App.css';
import HomePage from './pages/HomePage';
import SalesOrderPage from './pages/SalesorderPage';
import PrintOrderView from './pages/PrintOrderView';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sales-order/new" element={<SalesOrderPage />} />
        <Route path="/print-order/:id" element={<PrintOrderView />} />
        <Route path="/sales-order/:id" element={<SalesOrderPage />} />
       
        {/* Add additional routes here, e.g.:
            <Route path="/orders" element={<OrdersPage/>} />
        */}
      </Routes>
    </div>
  );
}

export default App;
