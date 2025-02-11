import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import logo from "../../assets/logo.png";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("รหัสผ่านไม่ตรงกัน!");
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:3003/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      alert("สมัครสมาชิกสำเร็จ! กรุณาล็อกอิน");
      navigate("/login");
    } catch (error) {
      console.error(`Register Error: ${error.message}`);
      alert("สมัครสมาชิกไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 mt-20">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="text-center mb-6">
          <img src={logo} alt="โลโก้" className="w-24 h-24 mx-auto object-contain" />
          <p className="text-gray-500">สมัครสมาชิกเพื่อเริ่มช้อปปิ้งกับเรา!</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          {[
            { name: "name", type: "text", label: "ชื่อเต็ม" },
            { name: "email", type: "email", label: "อีเมล" },
            { name: "password", type: "password", label: "รหัสผ่าน" },
            { name: "confirmPassword", type: "password", label: "ยืนยันรหัสผ่าน" },
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
                กำลังสมัคร...
              </>
            ) : (
              "สมัครสมาชิก"
            )}
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          มีบัญชีแล้ว?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-blue-600 hover:underline"
          >
            ล็อกอินที่นี่
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
