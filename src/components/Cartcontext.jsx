import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const userId = 1; // **ใช้ userId ที่ล็อกอินอยู่**

  // โหลดสินค้าในตะกร้าจากฐานข้อมูลเมื่อเข้าเว็บ
  useEffect(() => {
    if (userId) {
      axios.get(`http://localhost:3003/cart/${userId}`)
        .then((response) => setCart(response.data))
        .catch((error) => console.error("❌ Error fetching cart:", error));
    }
  }, [userId]);

  // เพิ่มสินค้าเข้าตะกร้า (เชื่อม `ProductOnCart`)
  const addToCart = async (product) => {
    try {
      const existingItem = cart.find((item) => item.productId === product.id);

      if (existingItem) {
        // อัปเดตจำนวนสินค้าในฐานข้อมูล
        await axios.put("http://localhost:3003/cart/update", {
          cartId: existingItem.cartId,
          productId: product.id,
          count: existingItem.count + 1,
        });
        setCart(cart.map((item) =>
          item.productId === product.id ? { ...item, count: item.count + 1 } : item
        ));
      } else {
        // เพิ่มสินค้าลงฐานข้อมูล
        const response = await axios.post("http://localhost:3003/cart/add", {
          userId,
          productId: product.id,
          count: 1,
          price: product.price,
        });
        setCart([...cart, { ...product, count: 1, cartId: response.data.cartId }]);
      }
    } catch (error) {
      console.error("❌ Error adding to cart:", error);
    }
  };

  // ลบสินค้าจากตะกร้า
  const removeItem = async (productId) => {
    try {
      await axios.delete(`http://localhost:3003/cart/remove/${userId}/${productId}`);
      setCart(cart.filter((item) => item.productId !== productId));
    } catch (error) {
      console.error("❌ Error removing item:", error);
    }
  };

  return (
    <CartContext.Provider value={{ cart, setCart, addToCart, removeItem }}>
      {children}
    </CartContext.Provider>
  );
};
