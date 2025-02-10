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
      const response = await axios.get("http://localhost:3001/Product");
      setProducts(response.data);
    } catch (error) {
      console.error("❌ Error fetching products:", error);
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto mt-20 px-6">
      <h1 className="text-4xl text-center mb-10">สินค้า</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length === 0 ? (
          <p className="text-center text-gray-600 col-span-4">ไม่มีสินค้าในระบบ</p>
        ) : (
          products.map((product) => (
            <div key={product.id} className="flex flex-col items-center text-center">
              <div className="w-full h-[250px] flex justify-center items-center overflow-hidden">
                <img
                  src={product.picture}
                  alt={product.title}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
              <h2 className="text-lg font-bold mt-4">{product.title}</h2>
              
              <Link to="/Product">
                <button className="mt-4 px-6 py-2 bg-black text-white font-semibold  hover:bg-gray-800 transition">
                  see more
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
