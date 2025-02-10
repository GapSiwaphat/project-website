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
    const result = await Swal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "หากลบแล้วจะไม่สามารถกู้คืนได้!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "ลบสินค้า",
      cancelButtonText: "ยกเลิก"
    });

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
  };

  const handleEdit = async (product) => {
    let selectedFile = null;
  
    const { value: formValues } = await Swal.fire({
      title: 'แก้ไขสินค้า',
      html: `
        <input id="swal-title" class="swal2-input" placeholder="ชื่อสินค้า" value="${product.title}">
        <input id="swal-description" class="swal2-input" placeholder="รายละเอียดสินค้า" value="${product.description || ""}">
        <input id="swal-price" class="swal2-input" placeholder="ราคา" type="number" value="${product.price}">
        <input id="swal-quantity" class="swal2-input" placeholder="จำนวนสินค้าในสต็อก" type="number" value="${product.quantity}">
        <input id="swal-picture" type="file" class="swal2-file">
        <img id="swal-preview" src="${product.picture}" class="w-24 h-24 mt-2 rounded" style="display:block; margin:auto;">
      `,
      didOpen: () => {
        const fileInput = document.getElementById('swal-picture');
        const preview = document.getElementById('swal-preview');
  
        fileInput.addEventListener('change', (event) => {
          const file = event.target.files[0];
          if (file) {
            selectedFile = file;
            const reader = new FileReader();
            reader.onload = (e) => (preview.src = e.target.result);
            reader.readAsDataURL(file);
          }
        });
      },
      preConfirm: () => {
        return {
          title: document.getElementById('swal-title').value,
          description: document.getElementById('swal-description').value,
          price: parseFloat(document.getElementById('swal-price').value) || 0,
          quantity: parseInt(document.getElementById('swal-quantity').value) || 0,
          file: selectedFile
        };
      }
    });
  
    if (!formValues || !formValues.title || isNaN(formValues.price) || isNaN(formValues.quantity)) {
      Swal.fire("เกิดข้อผิดพลาด!", "กรุณากรอกข้อมูลให้ครบถ้วน", "error");
      return;
    }
  
    const formData = new FormData();
    formData.append("title", formValues.title);
    formData.append("description", formValues.description);
    formData.append("price", formValues.price);
    formData.append("quantity", formValues.quantity);
    if (formValues.file) {
      formData.append("picture", formValues.file);
    }
  
    // ✅ Debug: ตรวจสอบค่าที่ถูกส่งไป Backend
    console.log("🟢 FormData Content:");
    for (let pair of formData.entries()) {
      console.log(pair[0] + ':', pair[1]);
    }
  
    try {
      await axios.put(`http://localhost:3001/Product/${product.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
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
            <th className="border px-4 py-2">รหัส</th>
            <th className="border px-4 py-2">ชื่อสินค้า</th>
            <th className="border px-4 py-2">รายละเอียด</th>
            <th className="border px-4 py-2">ราคา</th>
            <th className="border px-4 py-2">จำนวนในสต็อก</th>
            <th className="border px-4 py-2">ขายไปแล้ว</th>
            <th className="border px-4 py-2">การจัดการ</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr><td colSpan="8" className="text-center py-4">ยังไม่มีสินค้าบนระบบ</td></tr>
          ) : (
            products.map((product, index) => (
              <tr key={product.id} className="border-b hover:bg-gray-100">
                <td className="border px-4 py-2 text-center">
                  {product.picture ? (
                    <img src={product.picture} alt={product.title} className="w-20 h-20 object-cover rounded-lg" />
                  ) : <span>ไม่มีรูป</span>}
                </td>
                <td className="border px-4 py-2 text-center">{index + 1}</td>
                <td className="border px-4 py-2">{product.title}</td>
                <td className="border px-4 py-2">{product.description || "ไม่มีรายละเอียด"}</td>
                <td className="border px-4 py-2 text-center">฿{product.price}</td>
                <td className="border px-4 py-2 text-center">{product.quantity} ชิ้น</td>
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
