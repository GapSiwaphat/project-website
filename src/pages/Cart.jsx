import React, { useContext } from "react";
import { useNavigate } from "react-router-dom"; 
import axios from "axios";
import { CartContext } from "../components/Cartcontext";

const Payment= () => {
  const { cart, setCart, removeItem } = useContext(CartContext);
  const navigate = useNavigate(); 
  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.count, 0);
  const handleCheckout = () => {
    const user = JSON.parse(localStorage.getItem("user")); 

    if (!user) {
      alert("กรุณาเข้าสู่ระบบก่อนทำการสั่งซื้อ!");
      navigate("/login"); 
    } else {
      alert("สั่งซื้อสำเร็จ!");
    }
  };

  return (
    <div className="max-w-screen-lg mx-auto mt-48 px-6 text-center">
      <h1 className="text-2xl font-bold">ตะกร้าสินค้า</h1>
      {cart.length === 0 ? (
        <p className="text-gray-500 mt-6">ไม่มีสินค้าในตะกร้า</p>
      ) : (
        <>
          <div className="mt-6 bg-white shadow-lg p-6 rounded-lg">
            {cart.map((item) => (
              <div key={item.productId} className="flex justify-between items-center border-b py-4">
                <img src={item.picture} alt={item.title} className="w-16 h-16 object-cover rounded-lg shadow-md" />
                
                <div className="flex-1 text-left ml-4">
                  <h2 className="font-bold text-lg">{item.title}</h2>
                  <p className="text-gray-500 text-sm">{item.description}</p>
                  <p className="text-black font-bold text-lg">฿{item.price * item.count}</p>
                </div>

                {/* เพิ่ม/ลดจำนวนสินค้า */}
                <div className="flex items-center space-x-4">
                  <button 
                    className="px-3 py-1 text-black rounded-md  hover:bg-gray-200 transition"
                    onClick={() => decreaseQuantity(item.productId)}
                  >
                    -
                  </button>
                  <span className="font-semibold text-xl">{item.count}</span>
                  <button 
                    className="px-3 py-1 text-black rounded-md  hover:bg-gray-200 transition"
                    onClick={() => increaseQuantity(item.productId)}
                  >
                    +
                  </button>
                </div>

                <button 
                  className="px-3 py-1 bg-black text-white hover:bg-slate-200 transition ml-4"
                  onClick={() => removeItem(item.productId)}
                >
                  ลบ
                </button>
              </div>
            ))}
          </div>
          <div className="mt-6 text-right">
            <h2 className="text-xl font-bold">รวมทั้งหมด: ฿{totalPrice}</h2>
            <button 
              onClick={handleCheckout} 
              className="mt-4 px-6 py-2 bg-black text-white font-bold hover:bg-blue-600 transition"
            >
              สั่งซื้อ
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Payment;
