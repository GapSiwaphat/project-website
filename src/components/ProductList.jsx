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
      let url = "http://localhost:3001/Product";
      if (selectedCategory) {
        url += `?category_id=${selectedCategory}`;
      }
      const response = await axios.get(url);
      setProducts(response.data);
    } catch (error) {
      console.error("❌ Error fetching products:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:3001/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId ? Number(categoryId) : "");
  };

  return (
    <div className="max-w-screen-xl mx-auto mt-10 px-6 flex gap-6">
      {/* Sidebar ค้นหาตามหมวดหมู่ */}
      <div className="w-1/4 bg-white shadow-lg p-6 rounded-lg sticky top-20">
        <h2 className="text-xl font-bold mb-4">หมวดหมู่สินค้า</h2>
        <ul>
          <li
            className={`cursor-pointer py-2 px-4 rounded-lg transition ${
              selectedCategory === "" ? "bg-green-500 text-white" : "hover:bg-gray-100"
            }`}
            onClick={() => handleCategoryChange("")}
          >
            ทั้งหมด
          </li>
          {categories.map((cat) => (
            <li
              key={cat.id}
              className={`cursor-pointer py-2 px-4 rounded-lg transition ${
                selectedCategory === cat.id ? "bg-green-500 text-white" : "hover:bg-gray-100"
              }`}
              onClick={() => handleCategoryChange(cat.id)}
            >
              {cat.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Grid แสดงสินค้า */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.length === 0 ? (
          <p className="text-gray-600 col-span-4 text-center text-lg">ไม่มีสินค้าในระบบ</p>
        ) : (
          products.map((product) => (
            <div key={product.id} className="bg-white shadow-lg rounded-xl p-5 hover:shadow-2xl transition duration-300 flex flex-col items-center">
              <div className="w-full h-[220px] flex justify-center items-center overflow-hidden rounded-lg">
                <img
                  src={product.picture}
                  alt={product.title}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
              <h2 className="text-lg font-bold mt-3 text-center">{product.title}</h2>
              <p className="text-gray-500 text-sm text-center">{product.description}</p>
              <p className="text-green-600 font-bold mt-2 text-xl">฿{product.price}</p>
              <button
                onClick={() => {
                  console.log("📌 กดเพิ่มสินค้า:", product);
                  addToCart(product);
                }}
                className="mt-3 px-6 py-2 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition"
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
