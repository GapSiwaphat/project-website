import React from "react";
import { Link, useLocation } from "react-router-dom";

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((path) => path);

  return (
    <nav className="text-lg  text-gray-500">
      <ul className="flex space-x-2">
        <li>
          <Link to="/" className="text-gray-700  hover:underline">
            หน้าแรก
          </Link>
        </li>
        {pathnames.map((path, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;
          return (
            <li key={routeTo} className="flex items-center">
              <span className="mx-2">/</span>
              {isLast ? (
                <span className="text-gray-900">{decodeURIComponent(path)}</span>
              ) : (
                <Link to={routeTo} className="text-blue-600 hover:underline">
                  {decodeURIComponent(path)}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Breadcrumb;
