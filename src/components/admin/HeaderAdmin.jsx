import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { AiOutlineAppstore } from "react-icons/ai"; 
import { RiDashboard3Fill } from 'react-icons/ri';
import { FiLogOut } from "react-icons/fi";

const HeaderAdmin = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken"); 
    sessionStorage.removeItem("authToken"); 

    navigate("/login");
  };

  return (
    <div className="flex">
      <div className="fixed w-64 h-full bg-white text-black shadow-lg">
        <div className="p-6 text-center border-b">
          <h1 className="text-2xl font-semibold">Manage Stores</h1>
        </div>

        <nav className="mt-6">
          <ul>
            <li className="mb-2">
              <Link
                to="/admin"
                className="flex items-center px-6 py-3 text-lg font-medium text-black hover:bg-gray-200 rounded-md transition"
              >
                <RiDashboard3Fill className="text-xl mr-2" />
                <span>Dashboard</span>
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="product"
                className="flex items-center px-6 py-3 text-lg font-medium text-black hover:bg-gray-200 rounded-md transition"
              >
                <AiOutlineAppstore className="text-xl mr-2" />
                <span>Product Admin</span>
              </Link>
            </li>
          </ul>
        </nav>
        <div className="absolute bottom-6 w-full px-6">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-6 py-3 text-lg font-medium text-white bg-black hover:bg-gray-800 rounded-md transition"
          >
            <FiLogOut className="text-xl mr-2" />
            <span>Logout</span>
          </button>
        </div>
      </div>
      <div className="ml-64 flex-1 bg-gray-100 p-6 min-h-screen">
        <Outlet /> 
      </div>
    </div>
  );
};

export default HeaderAdmin;
