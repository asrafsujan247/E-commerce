import React, { useRef } from "react";
import { IoChevronBackOutline, IoChevronForward } from "react-icons/io5";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";

interface ImageCarouselProps {
  images?: string[];
  handleChangeImage: (img: string) => void;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  handleChangeImage,
}) => {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <Swiper
        spaceBetween={1}
        navigation={true}
        allowTouchMove={false}
        loop={true}
        slidesPerView={4}
        modules={[Navigation]}
        className="mySwiper image-carousel"
      >
        {images?.map((img, i) => (
          <SwiperSlide key={i + 1} className="group">
            <button onClick={() => handleChangeImage(img)}>
              <img
                className="border inline-flex items-center justify-center px-3 py-1 mt-2"
                src={img}
                alt="product"
                width={100}
                height={100}
              />
            </button>
          </SwiperSlide>
        ))}
        <button ref={prevRef} className="prev">
          <IoChevronBackOutline />
        </button>
        <button ref={nextRef} className="next">
          <IoChevronForward />
        </button>
      </Swiper>
    </>
  );
};

export default ImageCarousel;
