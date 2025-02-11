import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import logo from "../../assets/logo.png"; 

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:3003/login", formData);
      const { user, token } = response.data;

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      // ตรวจสอบบทบาทของผู้ใช้
      navigate(user.role === "admin" ? "/admin" : "/user");
    } catch (error) {
      alert("อีเมลหรือรหัสผ่านไม่ถูกต้อง!");
      console.error("Login Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="text-center mb-6">
          <img src={logo} alt="โลโก้" className="w-24 h-24 mx-auto object-contain" />
          <p className="text-gray-500">เข้าสู่ระบบเพื่อช้อปปิ้งกับเรา!</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          {[
            { name: "email", type: "email", label: "อีเมล" },
            { name: "password", type: "password", label: "รหัสผ่าน" },
          ].map((field, index) => (
            <div key={index}>
              <label htmlFor={field.name} className="block text-gray-700 font-medium mb-1">
                {field.label}
              </label>
              <input
                id={field.name}
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
                placeholder={field.label}
              />
            </div>
          ))}
          <button
            type="submit"
            className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-md transition duration-200"
            disabled={loading}
          >
            {loading ? (
              <>
                <AiOutlineLoading3Quarters className="animate-spin mr-2" />
                กำลังเข้าสู่ระบบ...
              </>
            ) : (
              "เข้าสู่ระบบ"
            )}
          </button>
        </form>
        <div className="mt-4 text-center">
          <button
            onClick={() => navigate("/forgot-password")}
            className="text-blue-600 hover:underline"
          >
            ลืมรหัสผ่าน?
          </button>
          <p className="mt-2 text-gray-600">
            ยังไม่มีบัญชี?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-blue-600 hover:underline"
            >
              สมัครสมาชิก
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
