import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3001/Product');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "หากลบแล้วจะไม่สามารถกู้คืนได้!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "ลบสินค้า",
      cancelButtonText: "ยกเลิก"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:3001/Product/${id}`);
          Swal.fire("ลบสำเร็จ!", "สินค้าถูกลบเรียบร้อย", "success");
          fetchProducts();
        } catch (error) {
          Swal.fire("เกิดข้อผิดพลาด!", "ไม่สามารถลบสินค้าได้", "error");
          console.error("Error deleting:", error);
        }
      }
    });
  };

  const handleEdit = (product) => {
    Swal.fire({
      title: 'แก้ไขสินค้า',
      html: `
        <input id="swal-input1" class="swal2-input" placeholder="ชื่อสินค้า" value="${product.title}">
        <input id="swal-input2" class="swal2-input" placeholder="ราคา" type="number" value="${product.price}">
      `,
      preConfirm: async () => {
        const title = document.getElementById('swal-input1').value;
        const price = parseFloat(document.getElementById('swal-input2').value);
        
        if (!title || isNaN(price)) {
          Swal.showValidationMessage('กรุณากรอกข้อมูลให้ครบถ้วน');
          return false;
        }

        try {
          await axios.put(`http://localhost:3001/Product/${product.id}`, { title, price });
          Swal.fire("สำเร็จ!", "สินค้าได้รับการอัปเดต", "success");
          fetchProducts();
        } catch (error) {
          Swal.fire("เกิดข้อผิดพลาด!", "ไม่สามารถแก้ไขสินค้าได้", "error");
          console.error('Error updating product:', error);
        }
      }
    });
  };

  return (
    <div className="max-w-screen-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-center">รายการสินค้า</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200 text-gray-700">
            <th className="border px-4 py-2">รูป</th>
            <th className="border px-4 py-2">รหัส</th>
            <th className="border px-4 py-2">ชื่อสินค้า</th>
            <th className="border px-4 py-2">ราคา</th>
            <th className="border px-4 py-2">ขายไปแล้ว</th>
            <th className="border px-4 py-2">การจัดการ</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr><td colSpan="6" className="text-center py-4">ยังไม่มีสินค้าบนระบบ</td></tr>
          ) : (
            products.map((product, index) => (
              <tr key={product.id} className="border-b hover:bg-gray-100">
                <td className="border px-4 py-2 text-center">
                  {product.picture ? (
                    <img src={`data:image/png;base64,${product.picture}`} alt={product.title} className="w-20 h-20 object-cover rounded-lg" />
                  ) : <span>ไม่มีรูป</span>}
                </td>
                <td className="border px-4 py-2 text-center">{index + 1}</td>
                <td className="border px-4 py-2">{product.title}</td>
                <td className="border px-4 py-2 text-center">฿{product.price}</td>
                <td className="border px-4 py-2 text-center">{product.sold || 0} ชิ้น</td>
                <td className="border px-4 py-2 text-center">
                  <button onClick={() => handleEdit(product)} className="bg-yellow-500 text-white px-3 py-1 rounded mr-2">แก้ไข</button>
                  <button onClick={() => handleDelete(product.id)} className="bg-red-500 text-white px-3 py-1 rounded">ลบ</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
