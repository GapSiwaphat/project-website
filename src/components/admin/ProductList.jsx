import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3001/Product');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:3001/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('❌ Error fetching categories:', error);
    }
  };

  const handleEdit = async (product) => {
    const { value: formValues } = await Swal.fire({
      title: 'แก้ไขสินค้า',
      width: '600px', // ✅ เพิ่มความกว้าง
      customClass: {
        popup: 'no-scroll' // ✅ ป้องกันการเลื่อน
      },
      html: `
        <style>
          .swal2-input, .swal2-textarea, .swal2-select {
            width: 100%;
            padding: 12px;
            border-radius: 8px;
            border: 1px solid #ddd;
            box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.1);
            font-size: 16px;
          }
          .swal2-input:focus, .swal2-textarea:focus, .swal2-select:focus {
            border-color: #007bff;
            box-shadow: 0 0 8px rgba(0, 123, 255, 0.3);
            outline: none;
          }
          .swal2-label {
            font-weight: bold;
            display: block;
            margin-bottom: 6px;
            color: #333;
          }
          .swal2-field-group {
            margin-bottom: 15px;
          }
          .swal2-field-row {
            display: flex;
            gap: 12px;
          }
          .swal2-field-row > div {
            flex: 1;
          }
        </style>
  
        <div style="display: flex; flex-direction: column; gap: 15px;">
          <div class="swal2-field-group">
            <label class="swal2-label">ชื่อสินค้า</label>
            <input id="swal-title" class="swal2-input" placeholder="ชื่อสินค้า" value="${product.title}">
          </div>
  
          <div class="swal2-field-group">
            <label class="swal2-label">รายละเอียดสินค้า</label>
            <textarea id="swal-description" class="swal2-textarea" placeholder="รายละเอียดสินค้า">${product.description || ""}</textarea>
          </div>
  
          <div class="swal2-field-row">
            <div class="swal2-field-group">
              <label class="swal2-label">ราคา</label>
              <input id="swal-price" class="swal2-input" placeholder="ราคา" type="number" value="${product.price}">
            </div>
            <div class="swal2-field-group">
              <label class="swal2-label">จำนวนสินค้าในสต็อก</label>
              <input id="swal-quantity" class="swal2-input" placeholder="จำนวนสินค้า" type="number" value="${product.quantity}">
            </div>
          </div>
  
          <div class="swal2-field-group">
            <label class="swal2-label">หมวดหมู่</label>
            <select id="swal-category" class="swal2-select">
              <option value="">ไม่มีหมวดหมู่</option>
              ${categories.map(cat => `<option value="${cat.id}" ${cat.id === product.category_id ? 'selected' : ''}>${cat.name}</option>`).join("")}
            </select>
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "บันทึก",
      cancelButtonText: "ยกเลิก",
      preConfirm: () => {
        let categoryValue = document.getElementById('swal-category').value;
        let category_id = categoryValue ? parseInt(categoryValue, 10) : null;
  
        return {
          title: document.getElementById('swal-title').value,
          description: document.getElementById('swal-description').value,
          price: parseFloat(document.getElementById('swal-price').value) || 0,
          quantity: parseInt(document.getElementById('swal-quantity').value) || 0,
          category_id: isNaN(category_id) ? null : category_id,
        };
      }
    });
  
    if (!formValues) return;
  
    try {
      await axios.put(`http://localhost:3001/Product/${product.id}`, formValues);
      Swal.fire("สำเร็จ!", "สินค้าได้รับการอัปเดต", "success");
      fetchProducts();
    } catch (error) {
      Swal.fire("เกิดข้อผิดพลาด!", "ไม่สามารถแก้ไขสินค้าได้", "error");
      console.error('❌ Error updating product:', error);
    }
  };  

  return (
    <div className="max-w-screen-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-center">รายการสินค้า</h2>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200 text-gray-700">
            <th className="border px-4 py-2">รูป</th>
            <th className="border px-4 py-2">ชื่อสินค้า</th>
            <th className="border px-4 py-2">รายละเอียด</th>
            <th className="border px-4 py-2">หมวดหมู่</th>
            <th className="border px-4 py-2">ราคา</th>
            <th className="border px-4 py-2">จำนวนในสต็อก</th>
            <th className="border px-4 py-2">การจัดการ</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr><td colSpan="7" className="text-center py-4">ยังไม่มีสินค้าบนระบบ</td></tr>
          ) : (
            products.map(product => (
              <tr key={product.id} className="border-b hover:bg-gray-100">
                <td className="border px-4 py-2 text-center">
                  {product.picture ? (
                    <img src={product.picture} alt={product.title} className="w-20 h-20 object-cover rounded-lg" />
                  ) : <span>ไม่มีรูป</span>}
                </td>
                <td className="border px-4 py-2">{product.title}</td>
                <td className="border px-4 py-2">{product.description}</td>
                <td className="border px-4 py-2">{product.category_name || "ไม่มีหมวดหมู่"}</td>
                <td className="border px-4 py-2 text-center">฿{product.price}</td>
                <td className="border px-4 py-2 text-center">{product.quantity} ชิ้น</td>
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
