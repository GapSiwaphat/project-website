import React from 'react'
import ProductList from '../components/ProductList'
import { CartProvider } from "../components/Cartcontext";

const Product = () => {
  return (
    <div>
      <CartProvider>
      <ProductList />
      </CartProvider>
    </div>
  )
}

export default Product
