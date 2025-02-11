import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { CartContext } from "../components/Cartcontext";

const Cart = () => {
  const { cart, setCart, userId } = useContext(CartContext);
  const [cartTotal, setCartTotal] = useState(0); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    if (userId) {
      axios.get(`http://localhost:3003/cart/${userId}`)
        .then((response) => {
          setCart(response.data);
          setLoading(false); 
        })
        .catch((error) => {
          console.error("Error fetching cart:", error);
          setLoading(false);
        });

        axios.get(`http://localhost:3003/cart/total/${userId}`)
        .then((response) => setCartTotal(response.data.total))
        .catch((error) => console.error(" Error fetching cart total:", error));      
      
    }
  }, [userId]);

  const updateCartItem = async (productId, newCount) => {
    if (newCount < 1) {
      removeCartItem(productId);
      return;
    }

    try {
      await axios.put("http://localhost:3003/cart/update", {
        userId,
        productId,
        count: newCount,
      });

      const updatedCart = await axios.get(`http://localhost:3003/cart/${userId}`);
      setCart(updatedCart.data);

      const updatedTotal = await axios.get(`http://localhost:3003/cart/total/${userId}`);
      setCartTotal(updatedTotal.data.total);
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  const removeCartItem = async (productId) => {
    try {
      await axios.delete(`http://localhost:3003/cart/remove/${userId}/${productId}`);

      const updatedCart = await axios.get(`http://localhost:3003/cart/${userId}`);
      setCart(updatedCart.data);

      const updatedTotal = await axios.get(`http://localhost:3003/cart/total/${userId}`);
      setCartTotal(updatedTotal.data.total);
    } catch (error) {
      console.error("Error removing product:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 mt-48">
      <h1 className="text-2xl font-bold text-gray-800">ตะกร้าสินค้า</h1>
      
      {cart?.length === 0 ? (
        <p className="text-gray-500 mt-4 text-lg">ไม่มีสินค้าในตะกร้า</p>
      ) : (
        <div className="mt-6 space-y-4">
          {cart.map((item) => (
            <div key={item.productId} className="flex items-center bg-white shadow-md rounded-lg p-4">
              <img 
                src={`http://localhost:3003/uploads/${item.picture}`}
                alt={item.title} 
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div className="ml-4 flex-1">
                <h2 className="text-lg font-semibold">{item.title}</h2>
                <p className="text-black font-bold">฿{item.price * item.count}</p>
                
                <div className="flex items-center mt-2">
                  <button 
                    className="px-3 py-1 bg-gray-300 text-black rounded-l-lg hover:bg-gray-400"
                    onClick={() => updateCartItem(item.productId, item.count - 1)}
                  >
                    -
                  </button>
                  
                  <span className="px-4 py-1 text-lg">{item.count}</span>

                  <button 
                    className="px-3 py-1 bg-gray-300 text-black rounded-r-lg hover:bg-gray-400"
                    onClick={() => updateCartItem(item.productId, item.count + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
              <button 
                className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                onClick={() => removeCartItem(item.productId)}
              >
                ลบ
              </button>
            </div>
          ))}
        </div>
      )}

      {cart?.length > 0 && (
        <div className="mt-6 text-right text-lg font-bold">
          ราคารวมทั้งหมด: ฿{cartTotal}
        </div>
      )}

      {cart?.length > 0 && (
        <button className="mt-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 w-full">
          ดำเนินการสั่งซื้อ
        </button>
      )}
    </div>
  );
};

export default Cart;
