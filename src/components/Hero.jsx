import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const heroImages = [
  {
    url: "https://images.unsplash.com/photo-1610348725531-843dff563e2c?q=80&w=2940&auto=format&fit=crop",
    title: "สดจากฟาร์ม ส่งตรงถึงมือคุณ",
    description: "คัดสรรผลผลิตคุณภาพจากเกษตรกรทั่วไทย สั่งซื้อง่าย จัดส่งถึงบ้าน"
  },
  {
    url: "https://images.unsplash.com/photo-1576398289164-c48dc021b4e1?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8RnJ1aXRzJTIwYW5kJTIwdmVnZXRhYmxlc3xlbnwwfHwwfHx8MA%3D%3D",
    title: "ผลไม้สดจากสวน",
    description: "เลือกซื้อผลไม้ตามฤดูกาล สดใหม่ ส่งตรงจากไร่"
  },
  {
    url: "https://images.unsplash.com/photo-1573246123716-6b1782bfc499?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fEZydWl0cyUyMGFuZCUyMHZlZ2V0YWJsZXN8ZW58MHx8MHx8fDA%3D",
    title: "เกษตรอินทรีย์เพื่อสุขภาพ",
    description: "ผักปลอดสารพิษ ส่งตรงจากเกษตรกรไทย"
  }
];

function Hero() {

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 1000,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    arrows: false 
  };

  return (
    <div className="relative w-full h-[500px] overflow-hidden">
      <Slider {...settings}>
        {heroImages.map((item, index) => (
          <div key={index} className="relative w-full h-[500px]">

            <img 
              src={item.url} 
              alt={item.title} 
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default Hero;
