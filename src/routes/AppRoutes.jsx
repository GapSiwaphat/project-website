import React, { useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import HomeUser from '../pages/user/HomeUser';
import Cart from '../pages/Cart';
import Product from '../pages/Product';
import Payment from '../pages/user/Payment';
import Dashboard from '../pages/admin/Dashboard';
import Layout from '../Layout/Layout';
import LayoutAdmin from '../Layout/LayoutAdmin';
import LayoutUser from '../Layout/LayoutUser';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ProductAdmin from '../pages/admin/ProductAdmin';
import Home from '../pages/Home';
import { CartProvider } from "../components/Cartcontext";
import History from '../pages/user/History';


// ฟังก์ชันสำหรับป้องกัน Route ตาม Role
const ProtectedRoute = ({ element, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem('user')); 
  if (!user) return <Navigate to="/login" replace />; 
  if (!allowedRoles.includes(user.role)) return <Navigate to="/" replace />; 
  return element;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'cart', element: <Cart /> },
      { path: 'product', element: <Product /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
    ],
  },
  {
    path: '/admin',
    element: <ProtectedRoute element={<LayoutAdmin />} allowedRoles={['admin']} />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'product', element: <ProductAdmin /> },
    ],
  },
  {
    path: '/user',
    element: <ProtectedRoute element={<LayoutUser />} allowedRoles={['user']} />,
    children: [
      { index: true, element: <Home /> },
      { path: 'payment', element: <Payment /> },
      { path: 'product', element: <History />}
    ],
  },
]);

const AppRoutes = () => {
  return (
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  );
};

export default AppRoutes;
