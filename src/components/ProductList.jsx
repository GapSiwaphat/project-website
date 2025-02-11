import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { CartContext } from "./Cartcontext";

const ProductList = () => {
  const { addToCart } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [selectedCategory]);
  
  const fetchProducts = async () => {
    try {
      let url = "http://localhost:3003/Product";
      if (selectedCategory) {
        url += `?category_id=${selectedCategory}`;
      }
      const response = await axios.get(url);
      console.log("📸 Products Data:", response.data); // ✅ ตรวจสอบค่าที่ API ส่งมา
      setProducts(response.data);
    } catch (error) {
      console.error("❌ Error fetching products:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:3003/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId ? Number(categoryId) : "");
  };

  return (
    <div className="max-w-screen-lg mx-auto mt-48 px-6 text-center ">
      <h1 className="text-xl font-bold">รายการสินค้า</h1>
      <p className="text-gray-500 mt-2">เลือกซื้อสินค้า</p>
      
      <div className="mt-6 bg-white shadow p-4 rounded-lg">
        <div className="flex overflow-x-auto space-x-4 pb-2">
          <button
            className={`px-4 py-2 rounded-full ${
              selectedCategory === "" ? "bg-black text-white" : "bg-gray-200"
            }`}
            onClick={() => handleCategoryChange("")}
          >
            ทั้งหมด
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`px-4 py-2 rounded-full ${
                selectedCategory === cat.id ? "bg-black text-white" : "bg-gray-200"
              }`}
              onClick={() => handleCategoryChange(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-6 mt-6">
        {products.length === 0 ? (
          <p className="text-gray-600 col-span-4 text-lg">ไม่มีสินค้าในระบบ</p>
        ) : (
          products.map((product) => (
            <div key={product.id} className="bg-white shadow rounded-lg p-4 flex flex-col items-center w-full">
              <img
                src={product.picture}
                alt={product.title}
                className="w-full h-40 object-cover rounded-lg"
              />
              <h2 className="text-md font-bold mt-3 text-center">{product.title}</h2>
              <p className="text-gray-500 text-sm text-center">{product.description}</p>
              <p className="text-black font-bold mt-2 text-lg">฿{product.price}</p>
              <button
                onClick={() => addToCart(product)}
                className="mt-3 px-4 py-2 bg-black text-white font-semibold hover:bg-gray-800 transition w-full"
              >
                เพิ่มลงรถเข็น
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductList;
