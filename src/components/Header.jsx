import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaBars, FaTimes, FaHome, FaShoppingCart } from 'react-icons/fa';
import logo from "../assets/logo.png";
import { motion } from 'framer-motion';

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className="shadow-md bg-white relative">

            <div className="container mx-auto flex justify-between items-center py-3 px-6">
                <div className="flex justify-center items-center flex-1 md:flex-none">
                    <img src={logo} alt="โลโก้" className="w-28 h-28" />
                </div>

                <div className={`hidden md:flex justify-start flex-1`}>
                    <ul className="flex items-center space-x-8 text-lg ml-20">
                        <li>
                            <Link to="/" className="flex items-center space-x-2 hover:text-blue-600">
                                <FaHome className="text-xl" />
                                <span>Home</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/product" className="flex items-center space-x-2 hover:text-blue-600">
                                <FaShoppingCart className="text-xl" />
                                <span>Shops</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/cart" className="flex items-center space-x-2 hover:text-blue-600">
                                <FaShoppingCart className="text-xl" />
                                <span>Cart</span>
                            </Link>
                        </li>
                    </ul>
                </div>

                <div className="hidden md:flex items-center space-x-7">
                    <FaFacebookF className="text-black hover:text-yellow-400 cursor-pointer" />
                    <FaTwitter className="text-black hover:text-yellow-400 cursor-pointer" />
                    <FaInstagram className="text-black hover:text-yellow-400 cursor-pointer" />

                    <Link to="/login">
                        <button className="px-4 py-2 border border-yellow-400 rounded-lg hover:bg-yellow-400 hover:text-black transition">
                            Login
                        </button>
                    </Link>
                    <Link to="/register">
                        <button className="px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition">
                            Register
                        </button>
                    </Link>
                </div>

                {/* เมนูมือถือ */}
                <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-black">
                    {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                </button>
            </div>

            {/* เมนูมือถือ (Dropdown with Framer Motion for slide effect) */}
            <motion.div
                className={`md:hidden absolute top-0 left-0 w-3/4 bg-white shadow-lg py-6 px-4 ${menuOpen ? 'z-10' : 'z-[-1]'} `}
                initial={{ x: '-100%' }}
                animate={{ x: menuOpen ? 0 : '-100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
                <ul className="text-lg text-left space-y-4">
                    <li>
                        <Link to="/" className="flex items-center space-x-2 hover:text-blue-600">
                            <FaHome className="text-xl" />
                            <span>Home</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/product" className="flex items-center space-x-2 hover:text-blue-600">
                            <FaShoppingCart className="text-xl" />
                            <span>Products</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/cart" className="flex items-center space-x-2 hover:text-blue-600">
                            <FaShoppingCart className="text-xl" />
                            <span>Cart</span>
                        </Link>
                    </li>
                </ul>
            </motion.div>
        </nav>
    );
};

export default Header;
