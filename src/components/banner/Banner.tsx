import React from "react";
import { Link } from "react-router-dom";

interface HomeCustomization {
  promotion_title?: Record<string, unknown>;
  promotion_description?: Record<string, unknown>;
  promotion_button_name?: Record<string, unknown>;
  promotion_button_link?: string;
  [key: string]: unknown;
}

interface StoreCustomizationSetting {
  home?: HomeCustomization;
  [key: string]: unknown;
}

interface BannerProps {
  storeCustomizationSetting?: StoreCustomizationSetting | null;
}

const Banner: React.FC<BannerProps> = ({ storeCustomizationSetting }) => {
  const home = storeCustomizationSetting?.home;

  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl">
            <span className="text-primary dark:text-muted-foreground font-bold">
              {String(home?.promotion_title ?? '')}
            </span>
          </h1>

          <p className="text-muted-foreground dark:text-muted-foreground">
            {String(home?.promotion_description ?? '')}
          </p>
        </div>
        <Link
          to={`${home?.promotion_button_link ?? "#"}`}
          className="text-sm font-medium px-6 py-2 bg-primary text-center rounded-full text-primary-foreground hover:bg-primary/90"
        >
          {String(home?.promotion_button_name ?? '')}
        </Link>
      </div>
    </>
  );
};

export default Banner;
