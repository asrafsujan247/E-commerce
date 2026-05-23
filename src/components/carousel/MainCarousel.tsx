import React from "react";
import CarouselCard from "@components/carousel/CarouselCard";
import { useSetting } from "@stores/useSettingStore";

interface SliderCustomization {
  bottom_dots?: boolean;
  left_right_arrow?: boolean;
  both_slider?: boolean;
  first_title?: Record<string, unknown>;
  first_description?: Record<string, unknown>;
  first_button?: Record<string, unknown>;
  first_link?: string;
  first_img?: string;
  second_title?: Record<string, unknown>;
  second_description?: Record<string, unknown>;
  second_button?: Record<string, unknown>;
  second_link?: string;
  second_img?: string;
  third_title?: Record<string, unknown>;
  third_description?: Record<string, unknown>;
  third_button?: Record<string, unknown>;
  third_link?: string;
  third_img?: string;
  four_title?: Record<string, unknown>;
  four_description?: Record<string, unknown>;
  four_button?: Record<string, unknown>;
  four_link?: string;
  four_img?: string;
  five_title?: Record<string, unknown>;
  five_description?: Record<string, unknown>;
  five_button?: Record<string, unknown>;
  five_link?: string;
  five_img?: string;
  [key: string]: unknown;
}

interface StoreCustomizationSetting {
  slider?: SliderCustomization;
  [key: string]: unknown;
}

interface MainCarouselProps {
  storeCustomizationSetting?: StoreCustomizationSetting | null;
}

const MainCarousel: React.FC<MainCarouselProps> = ({
  storeCustomizationSetting: propCustomization,
}) => {
  const { storeCustomization } = useSetting();
  const storeCustomizationSetting = (propCustomization ??
    storeCustomization) as StoreCustomizationSetting | null;
  const slider = storeCustomizationSetting?.slider;

  const showingUrl = (data?: string) => (data !== undefined ? data : "!#");
  const showingImage = (data?: string) => data !== undefined && data;

  const sliderData = [
    {
      id: 1,
      title: String(slider?.first_title ?? '') ?? "",
      info: String(slider?.first_description ?? '') ?? "",
      buttonName: String(slider?.first_button ?? '') ?? "",
      url: showingUrl(slider?.first_link),
      image:
        (showingImage(slider?.first_img) as string) || "/slider/slider-1.jpg",
    },
    {
      id: 2,
      title: String(slider?.second_title ?? '') ?? "",
      info: String(slider?.second_description ?? '') ?? "",
      buttonName: String(slider?.second_button ?? '') ?? "",
      url: showingUrl(slider?.second_link),
      image:
        (showingImage(slider?.second_img) as string) || "/slider/slider-2.jpg",
    },
    {
      id: 3,
      title: String(slider?.third_title ?? '') ?? "",
      info: String(slider?.third_description ?? '') ?? "",
      buttonName: String(slider?.third_button ?? '') ?? "",
      url: showingUrl(slider?.third_link),
      image:
        (showingImage(slider?.third_img) as string) || "/slider/slider-3.jpg",
    },
    {
      id: 4,
      title: String(slider?.four_title ?? '') ?? "",
      info: String(slider?.four_description ?? '') ?? "",
      buttonName: String(slider?.four_button ?? '') ?? "",
      url: showingUrl(slider?.four_link),
      image:
        (showingImage(slider?.four_img) as string) || "/slider/slider-1.jpg",
    },
    {
      id: 5,
      title: String(slider?.five_title ?? '') ?? "",
      info: String(slider?.five_description ?? '') ?? "",
      buttonName: String(slider?.five_button ?? '') ?? "",
      url: showingUrl(slider?.five_link),
      image:
        (showingImage(slider?.five_img) as string) || "/slider/slider-2.jpg",
    },
  ];

  return (
    <>
      <CarouselCard
        sliderData={sliderData}
        storeCustomizationSetting={storeCustomizationSetting}
      />
    </>
  );
};

export default MainCarousel;
