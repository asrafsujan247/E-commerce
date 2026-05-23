import React from "react";
import { ToastContainer } from "react-toastify";
import FacebookPixel from "@components/common/FacebookPixel";
import type { StoreSetting } from "@appTypes/index";

interface ProvidersProps {
  children: React.ReactNode;
  storeSetting: StoreSetting | null;
}

const Providers: React.FC<ProvidersProps> = ({ children, storeSetting }) => {
  return (
    <>
      <ToastContainer />
      <FacebookPixel
        pixelId={storeSetting?.fb_pixel_key}
        enabled={storeSetting?.fb_pixel_status}
      />
      {children}
    </>
  );
};

export default Providers;
