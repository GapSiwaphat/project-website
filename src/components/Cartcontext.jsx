import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [userId, setUserId] = useState(null);
  const [cartTotal, setCartTotal] = useState(0);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const { id } = JSON.parse(storedUser);
      setUserId(id);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchCartData();
    }
  }, [userId]);

  // โหลดข้อมูลตะกร้าและ cartTotal
  const fetchCartData = async () => {
    try {
      if (!userId) return;
      console.log(`Fetching cart for userId: ${userId}`);
      const response = await axios.get(`http://localhost:3003/cart/${userId}`);
      console.log("Cart Data Received:", response.data);

      setCart(response.data);

      // ดึง cartTotal จากฐานข้อมูล
      const totalResponse = await axios.get(`http://localhost:3003/cart/total/${userId}`);
      console.log("Cart Total from DB:", totalResponse.data.total);
      setCartTotal(totalResponse.data.total);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  // ฟังก์ชันอัปเดตจำนวนสินค้าในตะกร้า
  const updateCartItem = async (productId, count) => {
    if (!userId) return;
    console.log(`Updating cart: userId=${userId}, productId=${productId}, count=${count}`);

    try {
      await axios.put("http://localhost:3003/cart/update", {
        userId,
        productId,
        count,
      });

      console.log("Cart item updated successfully!");
      fetchCartData(); 
    } catch (error) {
      console.error("Error updating cart item:", error);
    }
  };

  // ฟังก์ชันเพิ่มสินค้าลงตะกร้า
  const addToCart = async (product) => {
    if (!userId) {
      Swal.fire("กรุณาเข้าสู่ระบบก่อนเพิ่มสินค้าในรถเข็น");
      return;
    }
  
    if (product.price == null) {
      console.error("ERROR: Product price is NULL for product:", product);
      Swal.fire("เกิดข้อผิดพลาด", "ราคาสินค้าผิดพลาด", "error");
      return;
    }
  
    console.log("🛒 Sending request to add product:", {
      userId,
      productId: product.id,
      count: 1,
      price: product.price,
    });
  
    try {
      const response = await axios.post("http://localhost:3003/cart/add", {
        userId,
        productId: product.id,
        count: 1,
        price: product.price,
      });
  
      console.log("Added to cart:", response.data);
      fetchCartData();
      Swal.fire("เพิ่มสินค้าในรถเข็นเรียบร้อย!", "", "success");
    } catch (error) {
      console.error("❌ Error adding to cart:", error);
      Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถเพิ่มสินค้าในรถเข็นได้", "error");
    }
  };  
  
  return (
    <CartContext.Provider value={{ cart, setCart, cartTotal, setCartTotal, userId, updateCartItem, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
