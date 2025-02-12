import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../components/Cartcontext";
import Breadcrumb from "../components/Breadcrumb";
import { FaPlus, FaMinus, FaTrash, FaShoppingCart } from "react-icons/fa";

const Cart = () => {
  const { cart, setCart, userId } = useContext(CartContext);
  const [cartTotal, setCartTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // โหลดข้อมูลตะกร้า
  const fetchCartData = async () => {
    if (!userId) return;
    try {
      const [cartResponse, totalResponse] = await Promise.all([
        axios.get(`http://localhost:3003/cart/${userId}`),
        axios.get(`http://localhost:3003/cart/total/${userId}`)
      ]);
      setCart(cartResponse.data);
      setCartTotal(totalResponse.data.total ?? 0);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, [userId]);

  // อัปเดตจำนวนสินค้าในตะกร้า
  const updateCartItem = async (productId, newCount) => {
    if (newCount < 1) return removeCartItem(productId);
    try {
      await axios.put("http://localhost:3003/cart/update", { userId, productId, count: newCount });
      fetchCartData();
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  // ลบสินค้ารายการเดียว
  const removeCartItem = async (productId) => {
    try {
      await axios.delete(`http://localhost:3003/cart/remove/${userId}/${productId}`);
      fetchCartData();
    } catch (error) {
      console.error("Error removing product:", error);
    }
  };

  // ลบสินค้าทั้งหมด
  const clearCart = async () => {
    try {
      await axios.delete(`http://localhost:3003/cart/clear/${userId}`);
      setCart([]);
      setCartTotal(0);
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  if (loading) return <div className="text-center text-gray-500 text-lg mt-10">กำลังโหลด...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 mt-32">
      <div className="mt-10 mb-10">
        <Breadcrumb />
      </div>
      <h1 className="text-3xl font-light text-gray-800 text-center mb-6 tracking-wide">ตะกร้าสินค้า</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* รายการสินค้า */}
        <div className="lg:col-span-2 bg-white shadow-sm rounded-xl p-6">
          <h2 className="text-lg font-light mb-4 text-gray-600">สินค้าในตะกร้า</h2>

          {cart.length === 0 ? (
            <p className="text-gray-400 text-center">ไม่มีสินค้าในตะกร้า</p>
          ) : (
            <div className="space-y-6">
              {cart.map((item) => (
                <div key={item.productId} className="flex flex-wrap md:flex-nowrap items-center justify-between p-4 rounded-xl bg-gray-50">

                  <div className="flex items-center space-x-4">
                    <img src={`http://localhost:3003/uploads/${item.picture}`} alt={item.title} className="w-20 h-20 object-cover rounded-lg" />
                    <div>
                      <p className="text-md font-medium">{item.title}</p>
                      <p className="text-gray-500 text-sm">{item.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <span className="text-lg font-light text-gray-600">฿{item.price}</span>

                    <div className="flex items-center bg-white p-2 rounded-lg shadow-md">
                      <button className="p-2 rounded-full hover:bg-gray-200" onClick={() => updateCartItem(item.productId, item.count - 1)}>
                        <FaMinus />
                      </button>
                      <span className="text-lg mx-2">{item.count}</span>
                      <button className="p-2 rounded-full hover:bg-gray-200" onClick={() => updateCartItem(item.productId, item.count + 1)}>
                        <FaPlus />
                      </button>
                    </div>

                    <span className="text-lg font-semibold text-gray-600">฿{item.price * item.count}</span>
                    <button className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600" onClick={() => removeCartItem(item.productId)}>
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {cart.length > 0 && (
            <button className="px-10 py-3 bg-black   text-white font-medium rounded-lg hover:bg-red-600 flex items-center justify-center space-x-2 mt-6" onClick={clearCart}>
              <FaTrash />
              <span>ลบสินค้าทั้งหมด</span>
            </button>
          )}
        </div>

        {/* ยอดรวมตะกร้าสินค้า */}
        <div className="bg-white shadow-sm rounded-xl p-6">
          <p className="text-lg font-medium text-gray-900 text-center mb-6">ยอดรวมตะกร้าสินค้า</p>
          <div className="border-b border-gray-200 pb-4">
            <p className="text-lg flex justify-between text-gray-900">
              <span>ยอดรวมสินค้า <span className="text-gray-500">({cart.length} ชิ้น)</span></span>
              <span>฿{cartTotal}</span>
            </p>
          </div>
          <div className="border-t border-dashed border-gray-300 pt-4 mt-4">
            <p className="text-lg font-bold flex justify-between text-gray-900">
              <span>ยอดรวมทั้งหมด</span>
              <span>฿{cartTotal}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="text-red-700 mt-16 mb-10">
        <p>กรุณาตรวจสอบรายการสินค้าก่อนสั่งซื้อ</p>
        <div className="flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4">
          <button className="px-6 py-3 border border-gray-400 text-gray-700 font-medium rounded-lg hover:bg-gray-100" onClick={() => navigate("/product")}>
            ซื้อสินค้าต่อ
          </button>
          <button className="px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 flex items-center space-x-2" onClick={() => navigate("/user/payment")}>
            <FaShoppingCart />
            <span>สั่งซื้อสินค้า</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
