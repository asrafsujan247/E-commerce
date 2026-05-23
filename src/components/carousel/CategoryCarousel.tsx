import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { IoChevronBackOutline, IoChevronForward } from "react-icons/io5";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import useUtilsFunction from "@hooks/useUtilsFunction";
import { Category } from "@appTypes/index";

interface CategoryCarouselProps {
  categories: Category[];
}

const CategoryCarousel: React.FC<CategoryCarouselProps> = ({ categories }) => {
  const navigate = useNavigate();

  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);


  const handleCategoryClick = (id: string, category: unknown) => {
    const category_name = String(category ?? '')
      ?.toLowerCase()
      .replace(/[^A-Z0-9]+/gi, "-");

    navigate(`/search?category=${category_name}&_id=${id}`);
  };

  return (
    <>
      <Swiper
        onInit={(swiper) => {
          // @ts-expect-error swiper navigation params typing
          swiper.params.navigation.prevEl = prevRef.current;
          // @ts-expect-error swiper navigation params typing
          swiper.params.navigation.nextEl = nextRef.current;
          swiper.navigation.init();
          swiper.navigation.update();
        }}
        spaceBetween={8}
        navigation={true}
        allowTouchMove={false}
        loop={true}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
        }}
        breakpoints={{
          375: {
            width: 375,
            slidesPerView: 2,
          },
          414: {
            width: 414,
            slidesPerView: 3,
          },
          660: {
            width: 660,
            slidesPerView: 4,
          },
          768: {
            width: 768,
            slidesPerView: 6,
          },
          991: {
            width: 991,
            slidesPerView: 8,
          },
          1140: {
            width: 1140,
            slidesPerView: 9,
          },
          1680: {
            width: 1680,
            slidesPerView: 10,
          },
          1920: {
            width: 1920,
            slidesPerView: 10,
          },
        }}
        modules={[Navigation, Autoplay]}
        className="mySwiper category-slider my-10"
      >
        <div>
          {categories[0]?.children?.map((category, i) => (
            <SwiperSlide key={i + 1} className="group">
              <div
                onClick={() =>
                  handleCategoryClick(category?._id, category.name)
                }
                className="text-center cursor-pointer p-3 bg-background rounded-lg"
              >
                <div className="bg-background p-2 mx-auto my-auto text-center w-10 h-10 rounded-full shadow-md">
                  <img
                    src={
                      (category?.icon as string) ||
                      "https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png"
                    }
                    alt="category"
                    width={40}
                    height={40}
                    className="object-fill"
                  />
                </div>

                <h3 className="text-xs text-muted-foreground mt-2  group-hover:text-primary">
                  {String(category?.name ?? '')}
                </h3>
              </div>
            </SwiperSlide>
          ))}
        </div>

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

export default React.memo(CategoryCarousel);
