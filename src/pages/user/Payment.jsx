import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { CartContext } from '../../components/Cartcontext';

const Payment = () => {
  const { cartTotal } = useContext(CartContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("promptpay");
  const [address, setAddress] = useState("");

  const handlePayment = async () => {
    if (!cartTotal || !address.trim() || !paymentMethod) {
      Swal.fire({
        title: "ไม่สามารถชำระเงินได้",
        text: "กรุณากรอกที่อยู่และเลือกช่องทางการชำระเงิน",
        icon: "warning",
        confirmButtonText: "ตกลง",
      });
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await axios.post("http://localhost:3003/order/create", {
        cartTotal,
        address: address.trim(),
        paymentMethod,
      });
  
      if (response.data.success) {
        Swal.fire({
          title: "ชำระเงินสำเร็จ!",
          text: "คำสั่งซื้อถูกบันทึกเรียบร้อยแล้ว",
          icon: "success",
          confirmButtonText: "ตกลง",
        });
  
        navigate("/user/history");
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      Swal.fire({
        title: "ชำระเงินล้มเหลว",
        text: "เกิดข้อผิดพลาด กรุณาลองใหม่",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6 mt-56">
      <div className="md:col-span-2 bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">ที่อยู่สำหรับจัดส่ง</h2>
        <textarea
          name="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg"
          placeholder="กรอกที่อยู่สำหรับจัดส่งสินค้า"
          rows="4"
        ></textarea>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">ยอดรวมสินค้า</h2>
        <p className="text-gray-700 text-lg font-bold">
          ฿{cartTotal !== undefined ? cartTotal.toLocaleString() : "กำลังโหลด..."}
        </p>

        <div className="mt-6">
          <h3 className="text-lg font-semibold">ช่องทางการชำระเงิน</h3>
          <label className="flex items-center space-x-3 mt-3">
            <input 
              type="radio" 
              name="paymentMethod"
              value="promptpay"
              checked={paymentMethod === "promptpay"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="h-5 w-5"
            />
            <span>พร้อมเพย์</span>
          </label>
          <label className="flex items-center space-x-3 mt-3">
            <input 
              type="radio" 
              name="paymentMethod"
              value="promptpay"
              checked={paymentMethod === "promptpay"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="h-5 w-5"
            />
            <span>เก็บเงินปลายทาง</span>
          </label>
        </div>

        <button
          onClick={handlePayment}
          className={`w-full mt-6 px-6 py-3 font-semibold text-white rounded-lg transition ${
            loading || !address.trim() ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={loading || !address.trim()}
        >
          {loading ? "กำลังดำเนินการ..." : "ดำเนินการชำระเงิน"}
        </button>
      </div>
    </div>
  );
};

export default Payment;
