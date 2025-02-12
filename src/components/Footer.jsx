import React, { useState, useEffect } from "react";
import { FaFacebook, FaInstagram, FaTwitter, FaPhone, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const triggerPosition = document.documentElement.scrollHeight - 200;
      setIsVisible(scrollPosition > triggerPosition);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <footer
      className={`bg-black text-gray-300 py-10 transition-all duration-700 mt-28 ease-in-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
        {/* โลโก้ & คำอธิบาย */}
        <div className="text-center md:text-left">
          <h2 className="text-white text-2xl font-semibold">GreenMarget</h2>
          <p className="text-gray-400 mt-3 max-w-xs">
            ร้านค้าของเราจำหน่ายสินค้าคุณภาพ พร้อมบริการจัดส่งถึงมือคุณ
          </p>
        </div>

        {/* ติดต่อเรา */}
        <div className="text-center md:text-right">
          <h3 className="text-white text-lg font-semibold">ติดต่อเรา</h3>
          <ul className="mt-3 space-y-2">
            <li className="flex justify-center md:justify-start items-center space-x-2">
              <FaPhone />
              <span>02-123-4567</span>
            </li>
            <li className="flex justify-center md:justify-start items-center space-x-2">
              <FaEnvelope />
              <span>GreenMarget01@gmail.com</span>
            </li>
          </ul>
        </div>

        {/* โซเชียลมีเดีย */}
        <div className="flex space-x-4 text-2xl">
          <a href="#" className="text-gray-400 hover:text-white">
            <FaFacebook />
          </a>
          <a href="#" className="text-gray-400 hover:text-white">
            <FaInstagram />
          </a>
          <a href="#" className="text-gray-400 hover:text-white">
            <FaTwitter />
          </a>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-700 mt-10 pt-4 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Use for educational purposes only.
      </div>
    </footer>
  );
};

export default Footer;
