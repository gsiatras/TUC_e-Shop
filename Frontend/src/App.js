import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { LoginSignup } from './Components/LoginSignup/LoginSignup';
import { SellerDashboard } from './Components/SellerDashboard/SellerDashboard.jsx';
import { CustomerDashboard } from './Components/CustomerDashboard/CustomerDashboard.jsx';

import Layout from './Layout.js'
import RequireAuth from './Components/RequireAuth.js';


function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        {/* Public route for login*/}
        <Route path='/' element={<LoginSignup/>}></Route>

        {/* Protected Routes for sellers and customers */}
        <Route element={<RequireAuth allowedRole={'Seller'}/>}>
          <Route path='/sellerdashboard' element={<SellerDashboard/>} />
        </Route>

        <Route element={<RequireAuth allowedRole={'Customer'}/>}>
          <Route path='/customerdashboard' element={<CustomerDashboard/>} />
        </Route>

        {/* Default Route for not authenticated users */}
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Routes>
  
  );
}

export default App;

