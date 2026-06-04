import React from "react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";

interface ImageCarouselProps {
  images?: string[];
  handleChangeImage: (img: string) => void;
  vertical?: boolean;
}

const Thumbnail: React.FC<{ img: string; onClick: () => void }> = ({ img, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center justify-center border rounded overflow-hidden w-25 h-25 shrink-0 hover:border-primary transition-colors mt-2"
  >
    <img
      src={img}
      alt="product"
      className="w-full h-full object-cover"
    />
  </button>
);

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, handleChangeImage, vertical = false }) => {
  if (!images || images.length === 0) return null;

  if (vertical) {
    return (
      <div className="flex flex-col gap-2">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => handleChangeImage(img)}
            className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-border hover:border-primary transition-colors"
          >
            <img src={img} alt="product thumbnail" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    );
  }

  if (images.length <= 4) {
    return (
      <div className="flex justify-center gap-4 flex-wrap w-full">
        {images.map((img, i) => (
          <Thumbnail key={i} img={img} onClick={() => handleChangeImage(img)} />
        ))}
      </div>
    );
  }

  return (
    <Swiper
      spaceBetween={8}
      navigation={true}
      allowTouchMove={true}
      grabCursor={true}
      loop={false}
      speed={400}
      slidesPerView={4}
      modules={[Navigation]}
      className="mySwiper image-carousel w-full"
    >
      {images.map((img, i) => (
        <SwiperSlide key={i} className="flex justify-center">
          <Thumbnail img={img} onClick={() => handleChangeImage(img)} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ImageCarousel;
