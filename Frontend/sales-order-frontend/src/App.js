
import './App.css';
import HomePage from './pages/HomePage';
import SalesOrderPage from './pages/SalesorderPage';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sales-order/new" element={<SalesOrderPage />} />
        {/* Add additional routes here, e.g.:
            <Route path="/orders" element={<OrdersPage/>} />
        */}
      </Routes>
    </div>
  );
}

export default App;
