import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [userId, setUserId] = useState(null);
  const [isUserLoaded, setIsUserLoaded] = useState(false); // ✅ ตรวจสอบว่าโหลด userId เสร็จหรือยัง

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      console.log("✅ Loaded User ID:", parsedUser.id);
      setUserId(parsedUser.id);
    } else {
      console.log("🚨 No user found in localStorage");
    }
    setIsUserLoaded(true); // ✅ บอกว่าการโหลด userId เสร็จแล้ว
  }, []);

  useEffect(() => {
    if (userId) {
      console.log("📌 Fetching cart for userId:", userId);
      axios.get(`http://localhost:3003/cart/${userId}`)
        .then((response) => {
          console.log("📥 Cart Data Received:", response.data);
          setCart(response.data);
        })
        .catch((error) => console.error("❌ Error fetching cart:", error));
    }
  }, [userId]);

  const addToCart = async (product) => {
    try {
      if (!isUserLoaded) {
        console.log("⏳ Waiting for userId to load...");
        return;
      }

      if (!userId) {
        console.log("🚨 User ID is still missing, please login first.");
        return;
      }

      console.log("🛒 Adding to cart:", product);
      const response = await axios.post("http://localhost:3003/cart/add", {
        userId,
        productId: product.id,
        count: 1,
        price: product.price,
      });

      if (response.data.success) {
        console.log("✅ Successfully added to cart:", response.data.message);
        const updatedCart = await axios.get(`http://localhost:3003/cart/${userId}`);
        setCart(updatedCart.data);
      } else {
        console.error("🚨 Failed to add product:", response.data);
      }
    } catch (error) {
      console.error("❌ Error adding to cart:", error);
    }
  };

  return (
    <CartContext.Provider value={{ cart, setCart, userId, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
