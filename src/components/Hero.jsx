import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";  // นำเข้า Link

function Hero() {
  return (
    <div className="relative h-[500px] flex items-center justify-center bg-cover bg-center bg-[url('https://images.unsplash.com/photo-1610348725531-843dff563e2c?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')]">
        {/* ทำ Overly */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      
      <div className="relative text-center text-white px-6 max-w-3xl">
        <motion.h1 
          className="text-4xl md:text-6xl font-bold"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          สดจากฟาร์ม ส่งตรงถึงมือคุณ
        </motion.h1>
        <motion.p 
          className="mt-4 text-lg md:text-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          คัดสรรผลผลิตคุณภาพจากเกษตรกรทั่วไทย สั่งซื้อง่าย จัดส่งถึงบ้าน
        </motion.p>
        
        {/* ใช้ Link แทนปุ่ม */}
        <Link to="/products"> {/* เปลี่ยน "/products" เป็นเส้นทางที่คุณต้องการ */}
          <motion.button
            className="mt-6 px-6 py-3 bg-green-500 text-white font-semibold text-lg rounded-lg shadow-lg hover:bg-green-600 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            เลือกซื้อสินค้า
          </motion.button>
        </Link>
      </div>
    </div>
  );
}

export default Hero;
