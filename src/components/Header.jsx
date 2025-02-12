import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaBars, FaTimes, FaHome, FaShoppingCart } from 'react-icons/fa';
import logo from "../assets/logo.png";
import { motion, AnimatePresence } from 'framer-motion';
import { CartContext } from "../components/Cartcontext";

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const { cart } = useContext(CartContext);  
    const cartItemCount = cart.reduce((total, item) => total + item.count, 0);

    const user = JSON.parse(localStorage.getItem("user"));

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <nav className="fixed top-0 left-0 w-full z-50 shadow-md bg-white">
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
                        <li className="relative">
                            <Link to="/cart" className="flex items-center space-x-2 hover:text-blue-600">
                                <FaShoppingCart className="text-xl" />
                                <span>Cart</span>
                                {/* แสดงจำนวนสินค้าในตะกร้า */}
                                {cartItemCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                        {cartItemCount}
                                    </span>
                                )}
                            </Link>
                        </li>
                    </ul>
                </div>

                <div className="hidden md:flex items-center space-x-7">
                    <FaFacebookF className="text-black hover:text-yellow-400 cursor-pointer" />
                    <FaTwitter className="text-black hover:text-yellow-400 cursor-pointer" />
                    <FaInstagram className="text-black hover:text-yellow-400 cursor-pointer" />

                    {user ? (
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                        >
                            Logout
                        </button>
                    ) : (
                        <>
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
                        </>
                    )}
                </div>

                <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-black">
                    {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                </button>
            </div>

            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        className="md:hidden absolute left-0 w-full bg-white shadow-lg py-6 px-4 z-50"
                        initial={{ opacity: 0, y: "-100%" }}
                        animate={{ opacity: 1, y: "0%" }}
                        exit={{ opacity: 0, y: "-100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        style={{ top: "100%" }}
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
                            <li className="relative">
                                <Link to="/cart" className="flex items-center space-x-2 hover:text-blue-600">
                                    <FaShoppingCart className="text-xl" />
                                    <span>Cart</span>
                                    {/* แสดงจำนวนสินค้าในตะกร้า */}
                                    {cartItemCount > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                            {cartItemCount}
                                        </span>
                                    )}
                                </Link>
                            </li>
                        </ul>

                        <div className="mt-4">
                            {user ? (
                                <>
                                    <button
                                        onClick={handleLogout}
                                        className="mt-2 w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login">
                                        <button className="mt-2 w-full px-4 py-2 border border-yellow-400 rounded-lg hover:bg-yellow-400 hover:text-black transition">
                                            Login
                                        </button>
                                    </Link>
                                    <Link to="/register">
                                        <button className="mt-2 w-full px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition">
                                            Register
                                        </button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Header;
