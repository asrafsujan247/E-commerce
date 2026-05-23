import React from "react";
import { Link } from "react-router-dom";

//internal import
import CMSkeletonTwo from "@components/preloader/CMSkeletonTwo";
import type { FooterProps } from "@appTypes/index";

const FooterTop = ({ error, storeCustomizationSetting }: FooterProps) => {
  const home = storeCustomizationSetting?.home as Record<string, unknown> | undefined;

  return (
    <div
      id="downloadApp"
      className="bg-primary/5 dark:bg-primary/10 py-10 lg:py-16 bg-repeat bg-center overflow-hidden border-t border-border/50"
    >
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-2 md:gap-3 lg:gap-3 items-center">
          <div className="flex-grow hidden lg:flex md:flex md:justify-items-center lg:justify-start">
            <img
              src={(home?.daily_need_img_left as string) || "/app-download-img-left.png"}
              alt="app download"
              className="block w-auto"
            />
          </div>
          <div className="text-center">
            <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3">
              <CMSkeletonTwo
                count={1}
                height={30}
                error={error ?? undefined}
                loading={false}
                data={home?.daily_need_title as { [lang: string]: string } | string | undefined}
              />
            </h3>
            <p className="text-base opacity-90 leading-7">
              <CMSkeletonTwo
                count={5}
                height={10}
                error={error ?? undefined}
                loading={false}
                data={home?.daily_need_description as { [lang: string]: string } | string | undefined}
              />
            </p>
            <div className="mt-8 flex mx-auto justify-center text-center">
              <Link
                to={(home?.daily_need_app_link as string) || "#"}
                className="mx-2"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  className="w-full h-auto"
                  src={(home?.button1_img as string) || "/app/app-store.svg"}
                  alt="app store"
                />
              </Link>
              <Link
                to={(home?.daily_need_google_link as string) || "#"}
                target="_blank"
                rel="noreferrer"
              >
                <img
                  className="w-full h-auto"
                  src={(home?.button2_img as string) || "/app/play-store.svg"}
                  alt="play store"
                />
              </Link>
            </div>
          </div>
          <div className="md:hidden lg:block">
            <div className="flex-grow hidden lg:flex md:flex lg:justify-end">
              <img
                src={(home?.daily_need_img_right as string) || "/app-download-img.png"}
                alt="app download"
                className="block w-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterTop;
