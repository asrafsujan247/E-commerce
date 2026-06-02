import React from "react";
import {
  FiDollarSign,
  FiHome,
  FiMapPin,
  FiRepeat,
  FiShieldOff,
  FiSun,
  FiTruck,
} from "react-icons/fi";

// internal import
import useUtilsFunction from "@hooks/useUtilsFunction";
import type { StoreCustomizationSetting, TranslationMap } from "@appTypes/index";

interface SlugCustomization {
  card_description_one?: TranslationMap;
  card_description_two?: TranslationMap;
  card_description_three?: TranslationMap;
  card_description_four?: TranslationMap;
  card_description_five?: TranslationMap;
  card_description_six?: TranslationMap;
  card_description_seven?: TranslationMap;
}

interface CardProps {
  storeCustomization?: StoreCustomizationSetting & { slug?: SlugCustomization };
}

const Card: React.FC<CardProps> = ({ storeCustomization }) => {
  const slug = (storeCustomization as CardProps["storeCustomization"])?.slug;

  const items = [
    { icon: <FiTruck />, text: slug?.card_description_one },
    { icon: <FiHome />, text: slug?.card_description_two },
    { icon: <FiDollarSign />, text: slug?.card_description_three },
    { icon: <FiRepeat />, text: slug?.card_description_four },
    { icon: <FiShieldOff />, text: slug?.card_description_five },
    { icon: <FiSun />, text: slug?.card_description_six },
    { icon: <FiMapPin />, text: slug?.card_description_seven },
  ];

  return (
    <ul className="my-0">
      {items.map((item, index) => (
        <li key={index} className="flex items-center py-2">
          <span className="text-lg text-muted-foreground items-start mr-3">
            {item.icon}
          </span>
          <p className="font-sans leading-5 text-sm text-muted-foreground">
            {String(item.text ?? '')}
          </p>
        </li>
      ))}
    </ul>
  );
};

export default Card;
