import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ProductUser = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:3003/Product");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto px-6 mt-32">
      <h1 className="text-3xl font-semibold text-center mb-6">สินค้า</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
        {products.length === 0 ? (
          <p className="text-center text-gray-600 col-span-full">ไม่มีสินค้าในระบบ</p>
        ) : (
          products.map((product) => (
            <div 
              key={product.id} 
              className="bg-white shadow-md rounded-lg p-3 sm:p-4 flex flex-col items-center text-center w-full sm:w-[90%] md:w-[80%] mx-auto"
            >
              <div className="w-full h-[160px] md:h-[200px] flex justify-center items-center overflow-hidden rounded-md">
                <img
                  src={product.picture}
                  alt={product.title}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
              <h2 className="text-md md:text-lg font-semibold mt-3">{product.title}</h2>

              <Link to="/Product">
                <button className="mt-3 px-4 py-2 bg-black text-white font-medium hover:bg-gray-800 transition w-full">
                  ดูเพิ่มเติม
                </button>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductUser;
