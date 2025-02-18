import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaEdit, FaTrash } from "react-icons/fa";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3003/Product');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:3003/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleEdit = async (product) => {
    let imageFile = null;

    const { value: formValues } = await Swal.fire({
      title: "แก้ไขสินค้า",
      width: "550px",
      customClass: { popup: "rounded-xl shadow-lg p-6" },
      html: `
      <style>
        .swal2-input, .swal2-textarea, .swal2-select {
          width: 100%; padding: 10px; border-radius: 8px;
          border: 1px solid #ddd; font-size: 16px;
        }
        .swal2-label { font-weight: bold; display: block; margin-bottom: 6px; color: #333; }
        .swal2-field-group { margin-bottom: 15px; }
        .swal2-field-row { display: flex; gap: 12px; }
        .swal2-field-row > div { flex: 1; }
        .swal2-img-preview { width: 100%; height: 160px; object-fit: cover; border-radius: 8px; }
        .swal2-file-input { display: none; } 
        .swal2-file-label {
          display: flex; align-items: center; justify-content: center;
          padding: 10px; background: #f5f5f5; border-radius: 8px; cursor: pointer;
        }
        .swal2-file-label:hover { background: #e0e0e0; }
      </style>

      <div>
        <div class="swal2-field-group">
          <label class="swal2-label">ชื่อสินค้า</label>
          <input id="swal-title" class="swal2-input" value="${product.title}">
        </div>

        <div class="swal2-field-group">
          <label class="swal2-label">รายละเอียด</label>
          <textarea id="swal-description" class="swal2-textarea">${product.description || ""}</textarea>
        </div>

        <div class="swal2-field-row">
          <div class="swal2-field-group">
            <label class="swal2-label">ราคา (฿)</label>
            <input id="swal-price" class="swal2-input" type="number" value="${product.price}">
          </div>
          <div class="swal2-field-group">
            <label class="swal2-label">จำนวนสินค้า</label>
            <input id="swal-quantity" class="swal2-input" type="number" value="${product.quantity}">
          </div>
        </div>

        <div class="swal2-field-group">
          <label class="swal2-label">หมวดหมู่</label>
          <select id="swal-category" class="swal2-select">
            <option value="">ไม่มีหมวดหมู่</option>
            ${categories.map(cat => `<option value="${cat.id}" ${cat.id === product.category_id ? 'selected' : ''}>${cat.name}</option>`).join("")}
          </select>
        </div>

        <div class="swal2-field-group">
          <label class="swal2-label">รูปภาพสินค้า</label>
          <input type="file" id="swal-image" class="swal2-file-input" accept="image/*">
          <label for="swal-image" class="swal2-file-label">
            <FaCamera size={18} class="mr-2" /> เปลี่ยนรูปภาพ
          </label>
          <img id="swal-image-preview" src="${product.picture}" class="swal2-img-preview">
        </div>
      </div>
    `,
      didOpen: () => {
        document.getElementById('swal-image').addEventListener('change', (event) => {
          const file = event.target.files[0];
          if (file) {
            imageFile = file;
            const reader = new FileReader();
            reader.onload = (e) => {
              document.getElementById('swal-image-preview').src = e.target.result;
            };
            reader.readAsDataURL(file);
          }
        });
      },
      showCancelButton: true,
      confirmButtonText: "บันทึก",
      cancelButtonText: "ยกเลิก",
      preConfirm: () => {
        return {
          title: document.getElementById('swal-title').value,
          description: document.getElementById('swal-description').value,
          price: parseFloat(document.getElementById('swal-price').value) || 0,
          quantity: parseInt(document.getElementById('swal-quantity').value) || 0,
          category_id: parseInt(document.getElementById('swal-category').value, 10) || null,
          imageFile: imageFile,
        };
      }
    });

    if (!formValues) return;

    try {
      const formData = new FormData();
      formData.append("title", formValues.title);
      formData.append("description", formValues.description);
      formData.append("price", formValues.price);
      formData.append("quantity", formValues.quantity);
      formData.append("category_id", formValues.category_id);
      if (formValues.imageFile) {
        formData.append("picture", formValues.imageFile);
      }

      await axios.put(`http://localhost:3003/Product/${product.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      Swal.fire("สำเร็จ!", "สินค้าได้รับการอัปเดต", "success");
      fetchProducts();
    } catch (error) {
      Swal.fire("เกิดข้อผิดพลาด!", "ไม่สามารถแก้ไขสินค้าได้", "error");
    }
  };

  const handleDelete = async (productId) => {
    const confirmDelete = await Swal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "เมื่อลบสินค้าแล้วจะไม่สามารถกู้คืนได้!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "ลบสินค้า",
      cancelButtonText: "ยกเลิก"
    });
  
    if (confirmDelete.isConfirmed) {
      try {
        await axios.delete(`http://localhost:3003/Product/${productId}`);
        Swal.fire("ลบสำเร็จ!", "สินค้าถูกลบออกจากระบบ", "success");
        fetchProducts();
      } catch (error) {
        Swal.fire("เกิดข้อผิดพลาด!", "ไม่สามารถลบสินค้าได้", "error");
      }
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
                  <button onClick={() => handleEdit(product)} className="text-yellow-500 hover:text-yellow-600 mr-2">
                    <FaEdit size={20} />
                  </button>
                  <button onClick={() => handleDelete(product.id)} className="text-red-500 hover:text-red-600">
                    <FaTrash size={20} />
                  </button>
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
