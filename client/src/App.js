import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './Pages/Common pages/login';
import MainPage from './Pages/Main';
import ShowroomDashbaord from './Pages/showroom/ShowroomDashbaord';
import NotFoundPage from './Pages/Common pages/PageNotFound';
import Catalogue from './Pages/Common pages/catalogue';

import ShowroomOrders from './Pages/showroom/Showroom_orders';
import ShowroomCustomers from './Pages/showroom/Showroom_customers';
import ShowroomInventory from './Pages/showroom/Showroom_inventory';
import ShowroomSettings from './Pages/showroom/Showroom_settings';
import ItemDetails from './Pages/showroom/item-details';
import RawMaterial from './Pages/showroom/Showroom_rawmaterials';
import Supplier from './Pages/showroom/Showroom_suppliers';
function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/login" element={<LoginPage/>} />
        <Route exact path="/" element={<MainPage/>} />
        <Route exact path="/dashboard" element={<ShowroomDashbaord/>} />
        <Route exact path="/catalogue" element={<Catalogue/>} />
        <Route exact path="/orders" element={<ShowroomOrders/>} />
        <Route exact path="/inventory" element={<ShowroomInventory/>} />
        <Route exact path="/customers" element={<ShowroomCustomers/>} />
        <Route exact path="/settings" element={<ShowroomSettings/>} />
        <Route exact path="/item-details" element={<ItemDetails/>} /> 
        <Route exact path="/rawmaterials" element={<RawMaterial/>} />
        <Route exact path="/suppliers" element={<Supplier/>} />

        <Route exact path="*" element={<NotFoundPage/>} />
      </Routes>
    </Router>
  );
}

export default App;
