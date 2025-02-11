import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState(""); // 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("รหัสผ่านไม่ตรงกัน!");
      return;
    }

    try {
      await axios.post("http://localhost:3003/register", {
        name, 
        email,
        password,
      });
      alert("สมัครสมาชิกสำเร็จ! กรุณาล็อกอิน");
      navigate("/login");
    } catch (error) {
      alert("สมัครสมาชิกไม่สำเร็จ");
      console.error("Register Error:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-56 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">สมัครสมาชิก</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="ชื่อ"
          value={name} // ✅ ใช้ name
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full p-2 border rounded-md mb-3"
        />
        <input
          type="email"
          placeholder="อีเมล"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 border rounded-md mb-3"
        />
        <input
          type="password"
          placeholder="รหัสผ่าน"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 border rounded-md mb-3"
        />
        <input
          type="password"
          placeholder="ยืนยันรหัสผ่าน"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full p-2 border rounded-md mb-3"
        />

        <button type="submit" className="w-full bg-black text-white p-2 rounded-md">
          สมัครสมาชิก
        </button>
      </form>
    </div>
  );
};

export default Register;
