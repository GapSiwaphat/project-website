import React from 'react';
import { Outlet } from 'react-router-dom';
import HeaderAdmin from '../components/admin/HeaderAdmin';

const LayoutAdmin = () => {
  return (
    <div className="flex">
      <HeaderAdmin /> 
    </div>
  );
};

export default LayoutAdmin;
