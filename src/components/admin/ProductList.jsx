import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  // ดึงข้อมูลสินค้า
  const fetchProducts = () => {
    axios.get('http://localhost:3001/Product')
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.log('Error:', error);
      });
  };

  // ฟังก์ชันลบสินค้า
  const handleDelete = (id) => {
    Swal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "หากลบแล้วจะไม่สามารถกู้คืนได้!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "ลบสินค้า",
      cancelButtonText: "ยกเลิก"
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:3001/Product/${id}`)
          .then(() => {
            Swal.fire("ลบสำเร็จ!", "สินค้าถูกลบเรียบร้อย", "success");
            fetchProducts(); // รีเฟรชรายการสินค้า
          })
          .catch(error => {
            Swal.fire("เกิดข้อผิดพลาด!", "ไม่สามารถลบสินค้าได้", "error");
            console.log('Error:', error);
          });
      }
    });
  };

  // ฟังก์ชันแก้ไขสินค้า
  const handleEdit = (product) => {
    Swal.fire({
      title: "แก้ไขสินค้า",
      html: `
        <input id="swal-title" class="swal2-input" value="${product.title}" placeholder="ชื่อสินค้า">
        <textarea id="swal-description" class="swal2-textarea" placeholder="คำอธิบายสินค้า">${product.description}</textarea>
        <input id="swal-price" class="swal2-input" type="number" value="${product.price}" placeholder="ราคา">
        <input id="swal-quantity" class="swal2-input" type="number" value="${product.quantity}" placeholder="จำนวนสินค้า">
        <input id="swal-picture" type="file" class="swal2-file">
        ${product.picture ? `<img src="data:image/png;base64,${product.picture}" class="swal2-image" style="width:100px; margin-top:10px;">` : ''}
      `,
      showCancelButton: true,
      confirmButtonText: "บันทึก",
      cancelButtonText: "ยกเลิก",
      preConfirm: () => {
        const title = document.getElementById('swal-title').value;
        const description = document.getElementById('swal-description').value;
        const price = document.getElementById('swal-price').value;
        const quantity = document.getElementById('swal-quantity').value;
        const pictureFile = document.getElementById('swal-picture').files[0];
        
        if (!title || !price || !quantity) {
          Swal.showValidationMessage("กรุณากรอกข้อมูลให้ครบ");
        }
        
        return { title, description, price, quantity, pictureFile };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const formData = new FormData();
        formData.append('title', result.value.title);
        formData.append('description', result.value.description);
        formData.append('price', result.value.price);
        formData.append('quantity', result.value.quantity);
        if (result.value.pictureFile) {
          formData.append('picture', result.value.pictureFile);
        }

        axios.put(`http://localhost:3001/Product/${product.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        .then(() => {
          Swal.fire("สำเร็จ!", "อัปเดตข้อมูลสินค้าเรียบร้อย", "success");
          fetchProducts(); // รีเฟรชรายการสินค้า
        })
        .catch(error => {
          Swal.fire("เกิดข้อผิดพลาด!", "ไม่สามารถอัปเดตสินค้าได้", "error");
          console.log('Error:', error);
        });
      }
    });
  };

  return (
    <div className="max-w-screen-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-center">รายการสินค้า</h2>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="border border-gray-300 px-4 py-2">รหัสสินค้า</th>
              <th className="border border-gray-300 px-4 py-2">ชื่อสินค้า</th>
              <th className="border border-gray-300 px-4 py-2">ราคา</th>
              <th className="border border-gray-300 px-4 py-2">รูปสินค้า</th>
              <th className="border border-gray-300 px-4 py-2">การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4">ยังไม่มีสินค้าบนระบบ</td>
              </tr>
            ) : (
              products.map((product, index) => (
                <tr key={product.id} className="border-b hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2 text-center">{index + 1}</td>
                  <td className="border border-gray-300 px-4 py-2">{product.title}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center text-yellow-500 font-semibold">฿{product.price}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {product.picture ? (
                      <img
                        src={`data:image/png;base64,${product.picture}`}
                        alt={product.title}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    ) : (
                      <span>ไม่มีรูป</span>
                    )}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <button 
                      onClick={() => handleEdit(product)} 
                      className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-600">
                      แก้ไข
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id)} 
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                      ลบ
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;