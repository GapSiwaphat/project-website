import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faTimes } from '@fortawesome/free-solid-svg-icons';

const InsertProduct = () => {
  const [product, setProduct] = useState({
    title: '',
    description: '',
    price: '',
    quantity: '',
    picture: null,
    picturePreview: null,
  });

  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'picture') {
      setProduct((prevProduct) => ({
        ...prevProduct,
        picture: files[0],
        picturePreview: URL.createObjectURL(files[0]),
      }));
    } else {
      setProduct((prevProduct) => ({
        ...prevProduct,
        [name]: value,
      }));
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { title, description, price, quantity, picture } = product;

    if (!title || !price || !quantity) {
        setErrorMessage('กรุณากรอกข้อมูลให้ครบถ้วน');
        return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('quantity', quantity);
    if (picture) {
        formData.append('picture', picture);
    }

    try {
        const response = await axios.post("http://localhost:3001/Addproduct", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        console.log('✅ Product added successfully:', response.data);

        setProduct({
            title: '',
            description: '',
            price: '',
            quantity: '',
            picture: null,
            picturePreview: null,
        });
        setErrorMessage('');
    } catch (error) {
        console.error('❌ Error adding product:', error);
        setErrorMessage('เกิดข้อผิดพลาดในการเพิ่มสินค้า');
    }
};



  return (
    <div className="max-w-screen-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-8">เพิ่มสินค้าใหม่</h2>
      {errorMessage && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium">ชื่อสินค้า</label>
          <input
            type="text"
            name="title"
            value={product.title}
            onChange={handleChange}
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="text-gray-700 font-medium">รายละเอียดสินค้า</label>
          <input
            type="text"
            name="description"
            value={product.description}
            onChange={handleChange}
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-gray-700 font-medium">ราคาสินค้า</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="text-gray-700 font-medium">จำนวน</label>
          <input
            type="number"
            name="quantity"
            value={product.quantity}
            onChange={handleChange}
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="text-gray-700 font-medium">รูปภาพสินค้า</label>
          <div className="flex items-center border rounded-lg px-3 py-2">
            <FontAwesomeIcon icon={faUpload} className="mr-2 text-gray-700" />
            <input
              type="file"
              name="picture"
              onChange={handleChange}
              className="focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          {product.picturePreview && (
            <div className="mt-4 relative">
              <img src={product.picturePreview} alt="Preview" className="w-48 h-48 object-cover" />
              <button
                type="button"
                onClick={() => setProduct((prev) => ({ ...prev, picture: null, picturePreview: null }))}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          )}

          {product.picture && !product.picturePreview && (
            <p className="mt-2 text-gray-600">{product.picture.name}</p>
          )}
        </div>

        <div className="flex justify-end col-span-3 w-full mt-6">
          <button
            type="submit"
            className="bg-yellow-500 text-white py-2 px-6 rounded-lg hover:bg-yellow-600 transition duration-200"
          >
            เพิ่มสินค้า
          </button>
        </div>
      </form>
    </div>
  );
};

export default InsertProduct;
