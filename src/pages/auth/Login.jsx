import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3003/login', { email, password });
      const user = response.data.user;
      
      localStorage.setItem('user', JSON.stringify(user));

      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/user');
      }
    } catch (error) {
      alert('ล็อกอินล้มเหลว');
      console.error('Login Error:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg mt-40">
      <h2 className="text-xl font-bold mb-4">เข้าสู่ระบบ</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="อีเมล" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-2 border rounded-md mb-3" />
        <input type="password" placeholder="รหัสผ่าน" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full p-2 border rounded-md mb-3" />
        <button type="submit" className="w-full bg-black text-white p-2 rounded-md">เข้าสู่ระบบ</button>
      </form>
    </div>
  );
};

export default Login;
