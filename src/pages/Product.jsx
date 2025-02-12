import React from "react";
import ProductList from "../components/ProductList";
import { CartProvider } from "../components/Cartcontext";

const Product = () => {
  return (
    <CartProvider>  
      <ProductList />
    </CartProvider>
  );
};

export default Product;
