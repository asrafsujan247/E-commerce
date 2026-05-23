import React from "react";
import { FiCreditCard, FiGift, FiPhoneCall, FiTruck } from "react-icons/fi";
import { IconType } from "react-icons";

interface FooterCustomization {
  shipping_card?: Record<string, unknown>;
  support_card?: Record<string, unknown>;
  payment_card?: Record<string, unknown>;
  offer_card?: Record<string, unknown>;
  [key: string]: unknown;
}

interface StoreCustomizationSettingProp {
  footer?: FooterCustomization;
  [key: string]: unknown;
}

interface FeatureCardProps {
  storeCustomizationSetting?: StoreCustomizationSettingProp | null;
}

interface PromoItem {
  id: number;
  title: string | undefined;
  icon: IconType;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  storeCustomizationSetting,
}) => {
  const footer = storeCustomizationSetting?.footer;

  const featurePromo: PromoItem[] = [
    {
      id: 1,
      title: String(footer?.shipping_card ?? ''),
      icon: FiTruck,
    },
    {
      id: 2,
      title: String(footer?.support_card ?? ''),
      icon: FiPhoneCall,
    },
    {
      id: 3,
      title: String(footer?.payment_card ?? ''),
      icon: FiCreditCard,
    },
    {
      id: 4,
      title: String(footer?.offer_card ?? ''),
      icon: FiGift,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 mx-auto gap-4">
      {featurePromo.map((promo) => (
        <div
          key={promo.id}
          className="py-3 px-4 flex items-center justify-center bg-card rounded-xl border border-border"
        >
          <div className="mr-3">
            <promo.icon
              className="flex-shrink-0 h-4 w-4 text-primary"
              aria-hidden="true"
            />
          </div>
          <div>
            <span className="block text-sm font-medium leading-5">
              {promo?.title}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeatureCard;
