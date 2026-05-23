import React from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

interface SliderItem {
  id: number;
  title: string;
  info: string;
  buttonName: string;
  url: string;
  image: string;
}

interface SliderCustomization {
  bottom_dots?: boolean;
  left_right_arrow?: boolean;
  both_slider?: boolean;
  [key: string]: unknown;
}

interface StoreCustomizationSetting {
  slider?: SliderCustomization;
  [key: string]: unknown;
}

interface CarouselCardProps {
  storeCustomizationSetting?: StoreCustomizationSetting | null;
  sliderData?: SliderItem[];
}

const CarouselCard: React.FC<CarouselCardProps> = ({
  storeCustomizationSetting,
  sliderData,
}) => {
  const showDots =
    storeCustomizationSetting?.slider?.bottom_dots ||
    storeCustomizationSetting?.slider?.both_slider;

  return (
    <div className="relative w-full overflow-hidden aspect-video sm:aspect-2/1 md:aspect-auto md:flex-1 min-h-0">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={700}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        loop={true}
        pagination={showDots ? { clickable: true } : { clickable: true }}
        className="absolute inset-0 w-full h-full"
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      >
        {sliderData?.map((item) => (
          <SwiperSlide
            key={item.id}
            className="relative w-full h-full overflow-hidden"
          >
            {/* Background image fills the entire slide */}
            <img
              src={item.image}
              alt={item.title}
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Overlay text / CTA */}
            <div className="absolute inset-0 z-10 flex items-center">
              <div className="pl-6 pr-10 sm:pl-10 sm:pr-16 w-10/12 lg:w-8/12 xl:w-7/12">
                <h1 className="mb-2 text-lg sm:text-2xl md:text-2xl lg:text-3xl font-bold text-foreground line-clamp-2 leading-tight">
                  {item.title}
                </h1>
                <p className="text-xs sm:text-sm sm:leading-6 text-muted-foreground font-sans line-clamp-2">
                  {item.info}
                </p>
                {item.buttonName && (
                  <Link
                    to={item.url}
                    className="hidden sm:inline-block mt-5 px-6 py-2 bg-primary text-center rounded-lg text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    {item.buttonName}
                  </Link>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CarouselCard;
