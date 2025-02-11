import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// นำเข้ารูปจากโฟลเดอร์ src/assets
import image1 from "../assets/1.png";
import image2 from "../assets/2.png";

const heroImages = [
  {
    url: image1,  
    title: "สดจากฟาร์ม ส่งตรงถึงมือคุณ",
    description: "คัดสรรผลผลิตคุณภาพจากเกษตรกรทั่วไทย สั่งซื้อง่าย จัดส่งถึงบ้าน"
  },
  {
    url: image2,
    title: "ผลไม้สดจากสวน",
    description: "เลือกซื้อผลไม้ตามฤดูกาล สดใหม่ ส่งตรงจากไร่"
  }
];

function Hero() {
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 1500,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    arrows: false 
  };

  return (
    <div className="relative w-full max-h-[calc(100vh-100px)] overflow-hidden  mt-40">
      <Slider {...settings}>
        {heroImages.map((item, index) => (
          <div key={index} className="relative w-full h-[500px] flex justify-center items-center">
            <img 
              src={item.url} 
              alt={item.title} 
              className="w-full h-auto max-h-[500px] object-contain"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default Hero;
