import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomeUser from '../pages/user/HomeUser';
import Cart from '../pages/Cart';
import Product from '../pages/Product';
import ProductUser from '../pages/user/ProductUser';
import Dashboard from '../pages/admin/Dashboard';
import Layout from '../Layout/Layout';
import LayoutAdmin from '../Layout/LayoutAdmin';
import LayoutUser from '../Layout/LayoutUser';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ProductAdmin from '../pages/admin/ProductAdmin';
import Home from '../pages/Home';


const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            { index: true, element: <Home /> },
            { path: 'cart', element: <Cart /> },
            { path: 'product', element: <Product />},
            { path: 'login', element: <Login /> },
            { path: 'register', element: <Register /> },
        ]
    },
  {
    path: '/admin',
    element: <LayoutAdmin />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'product', element: <ProductAdmin /> },
    ]
  },
  {
    path: '/user',
    element: <LayoutUser />,
    children: [
      { index: true, element: <HomeUser /> },
      { path: 'product', element: <ProductUser /> },
    ]
  }
]);

const AppRoutes = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default AppRoutes;
