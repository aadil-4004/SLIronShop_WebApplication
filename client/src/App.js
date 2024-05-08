import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './Pages/Common pages/login';
import MainPage from './Pages/Main';
import ShowroomDashbaord from './Pages/showroom/ShowroomDashbaord';
import WarehouseDashbaord from './Pages/WarehouseDashbaord';
import AdminDashbaord from './Pages/admin/AdminDashbaord';
import SupplierDashbaord from './Pages/SupplierDashbaord';
import NotFoundPage from './Pages/Common pages/PageNotFound';
import Catalogue from './Pages/Common pages/catalogue';

import ShowroomOrders from './Pages/showroom/Showroom_orders';
import ShowroomCustomers from './Pages/showroom/Showroom_customers';
import ShowroomInventory from './Pages/showroom/Showroom_inventory';
import ShowroomSettings from './Pages/showroom/Showroom_settings';


function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/login" element={<LoginPage/>} />
        <Route exact path="/" element={<MainPage/>} />
        <Route exact path="/showroom-dashboard" element={<ShowroomDashbaord/>} />
        <Route exact path="/warehouse-dashboard" element={<WarehouseDashbaord/>} />
        <Route exact path="/admin-dashboard" element={<AdminDashbaord/>} />
        <Route exact path="/supplier-dashboard" element={<SupplierDashbaord/>} />
        <Route exact path="/catalogue" element={<Catalogue/>} />

        <Route exact path="/showroom-dashboard/orders" element={<ShowroomOrders/>} />
        <Route exact path="/showroom-dashboard/inventory" element={<ShowroomInventory/>} />
        <Route exact path="/showroom-dashboard/customers" element={<ShowroomCustomers/>} />
        <Route exact path="/showroom-dashboard/settings" element={<ShowroomSettings/>} />

        <Route exact path="*" element={<NotFoundPage/>} />
      </Routes>
    </Router>
  );
}

export default App;
