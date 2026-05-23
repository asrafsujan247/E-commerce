import { Link } from "react-router-dom";
import {
  XIcon,
  FacebookIcon,
  LinkedinIcon,
  PinterestIcon,
  WhatsappIcon,
} from "react-share";

//internal imports
import CMSkeletonTwo from "@components/preloader/CMSkeletonTwo";
import { useAuth } from "@stores/useAuthStore";
import useUtilsFunction from "@hooks/useUtilsFunction";
import type { FooterProps } from "@appTypes/index";

const Footer = ({
  error,
  storeCustomizationSetting,
  globalSetting,
}: FooterProps) => {
  const { user: userInfo } = useAuth();

  const footer = storeCustomizationSetting?.footer;

  void error;

  return (
    <div className="pb-16 lg:pb-0 xl:pb-0 bg-background">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-10">
        <div className="grid grid-cols-2 md:grid-cols-7 xl:grid-cols-12 gap-5 sm:gap-9 lg:gap-11 xl:gap-7 py-10 lg:py-16 justify-between">
          {footer?.block1_status && (
            <div className="pb-3.5 sm:pb-0 col-span-1 md:col-span-2 lg:col-span-3">
              <h3 className="text-md lg:leading-7 font-medium mb-4 sm:mb-5 lg:mb-6 pb-0.5">
                <CMSkeletonTwo
                  count={1}
                  height={20}
                  loading={false}
                  data={footer?.block1_title}
                />
              </h3>
              <ul className="text-sm flex flex-col space-y-3">
                <li className="flex items-baseline">
                  <Link
                    to={footer?.block1_sub_link1 || "#"}
                    className="text-muted-foreground inline-block w-full hover:text-primary"
                  >
                    <CMSkeletonTwo
                      count={1}
                      height={10}
                      loading={false}
                      data={footer?.block1_sub_title1}
                    />
                  </Link>
                </li>
                <li className="flex items-baseline">
                  <Link
                    to={footer?.block1_sub_link2 || "#"}
                    className="text-muted-foreground inline-block w-full hover:text-primary"
                  >
                    <CMSkeletonTwo
                      count={1}
                      height={10}
                      loading={false}
                      data={footer?.block1_sub_title2}
                    />
                  </Link>
                </li>
                <li className="flex items-baseline">
                  <Link
                    to={footer?.block1_sub_link3 || "#"}
                    className="text-muted-foreground inline-block w-full hover:text-primary"
                  >
                    <CMSkeletonTwo
                      count={1}
                      height={10}
                      loading={false}
                      data={footer?.block1_sub_title3}
                    />
                  </Link>
                </li>
                <li className="flex items-baseline">
                  <Link
                    to={footer?.block1_sub_link4 || "#"}
                    className="text-muted-foreground inline-block w-full hover:text-primary"
                  >
                    <CMSkeletonTwo
                      count={1}
                      height={10}
                      loading={false}
                      data={footer?.block1_sub_title4}
                    />
                  </Link>
                </li>
              </ul>
            </div>
          )}
          {footer?.block2_status && (
            <div className="pb-3.5 sm:pb-0 col-span-1 md:col-span-2 lg:col-span-3">
              <h3 className="text-md lg:leading-7 font-medium mb-4 sm:mb-5 lg:mb-6 pb-0.5">
                <CMSkeletonTwo
                  count={1}
                  height={20}
                  loading={false}
                  data={footer?.block2_title}
                />
              </h3>
              <ul className="text-sm lg:text-15px flex flex-col space-y-3">
                <li className="flex items-baseline">
                  <Link
                    to={footer?.block2_sub_link1 || "#"}
                    className="text-muted-foreground inline-block w-full hover:text-primary"
                  >
                    <CMSkeletonTwo
                      count={1}
                      height={10}
                      loading={false}
                      data={footer?.block2_sub_title1}
                    />
                  </Link>
                </li>

                <li className="flex items-baseline">
                  <Link
                    to={footer?.block2_sub_link2 || "#"}
                    className="text-muted-foreground inline-block w-full hover:text-primary"
                  >
                    <CMSkeletonTwo
                      count={1}
                      height={10}
                      loading={false}
                      data={footer?.block2_sub_title2}
                    />
                  </Link>
                </li>
                <li className="flex items-baseline">
                  <Link
                    to={footer?.block2_sub_link3 || "#"}
                    className="text-muted-foreground inline-block w-full hover:text-primary"
                  >
                    <CMSkeletonTwo
                      count={1}
                      height={10}
                      loading={false}
                      data={footer?.block2_sub_title3}
                    />
                  </Link>
                </li>
                <li className="flex items-baseline">
                  <Link
                    to={footer?.block2_sub_link4 || "#"}
                    className="text-muted-foreground inline-block w-full hover:text-primary"
                  >
                    <CMSkeletonTwo
                      count={1}
                      height={10}
                      loading={false}
                      data={footer?.block2_sub_title4}
                    />
                  </Link>
                </li>
              </ul>
            </div>
          )}
          {footer?.block3_status && (
            <div className="pb-3.5 sm:pb-0 col-span-1 md:col-span-2 lg:col-span-3">
              <h3 className="text-md lg:leading-7 font-medium mb-4 sm:mb-5 lg:mb-6 pb-0.5">
                <CMSkeletonTwo
                  count={1}
                  height={20}
                  loading={false}
                  data={footer?.block3_title}
                />
              </h3>
              <ul className="text-sm lg:text-15px flex flex-col space-y-3">
                <li className="flex items-baseline">
                  <Link
                    to={userInfo?.email ? (footer?.block3_sub_link1 || "#") : "#"}
                    className="text-muted-foreground inline-block w-full hover:text-primary"
                  >
                    <CMSkeletonTwo
                      count={1}
                      height={10}
                      loading={false}
                      data={footer?.block3_sub_title1}
                    />
                  </Link>
                </li>
                <li className="flex items-baseline">
                  <Link
                    to={userInfo?.email ? (footer?.block3_sub_link2 || "#") : "#"}
                    className="text-muted-foreground inline-block w-full hover:text-primary"
                  >
                    <CMSkeletonTwo
                      count={1}
                      height={10}
                      loading={false}
                      data={footer?.block3_sub_title2}
                    />
                  </Link>
                </li>
                <li className="flex items-baseline">
                  <Link
                    to={userInfo?.email ? (footer?.block3_sub_link3 || "#") : "#"}
                    className="text-muted-foreground inline-block w-full hover:text-primary"
                  >
                    <CMSkeletonTwo
                      count={1}
                      height={10}
                      loading={false}
                      data={footer?.block3_sub_title3}
                    />
                  </Link>
                </li>
                <li className="flex items-baseline">
                  <Link
                    to={userInfo?.email ? (footer?.block3_sub_link4 || "#") : "#"}
                    className="text-muted-foreground inline-block w-full hover:text-primary"
                  >
                    <CMSkeletonTwo
                      count={1}
                      height={10}
                      loading={false}
                      data={footer?.block3_sub_title4}
                    />
                  </Link>
                </li>
              </ul>
            </div>
          )}
          {footer?.block4_status && (
            <div className="pb-3.5 sm:pb-0 col-span-1 md:col-span-2 lg:col-span-3">
              <Link
                to="/"
                className="mr-3 lg:mr-12 xl:mr-12 inline-block"
                rel="noreferrer"
              >
                <img
                  className="h-8 w-auto max-w-[160px] object-contain"
                  src={(footer?.block4_logo && !footer.block4_logo.includes("cloudinary.com/ahossain")) ? footer.block4_logo : "/logo/logo-color.svg"}
                  alt="logo"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/logo/logo-color.svg"; }}
                />
              </Link>
              <p className="leading-7 font-sans text-sm text-muted-foreground mt-3">
                <CMSkeletonTwo
                  count={1}
                  height={10}
                  loading={false}
                  data={footer?.block4_address}
                />
                <br />
                <span> Tel : {footer?.block4_phone}</span>
                <br />
                <span> Email : {footer?.block4_email}</span>
              </p>
            </div>
          )}
        </div>

        <hr className="hr-line"></hr>

        <div className="mx-auto max-w-screen-2xl px-4 sm:px-10 bg-muted shadow-sm border border-border rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-5 sm:gap-9 lg:gap-11 xl:gap-7 py-8 items-center justify-between">
            <div className="col-span-1">
              {footer?.social_links_status && (
                <div>
                  {(footer?.social_facebook ||
                    footer?.social_twitter ||
                    footer?.social_pinterest ||
                    footer?.social_linkedin ||
                    footer?.social_whatsapp) && (
                    <span className="text-base leading-7 font-medium block mb-2 pb-0.5">
                      Follow Us
                    </span>
                  )}
                  <ul className="text-sm flex">
                    {footer?.social_facebook && (
                      <li className="flex items-center mr-3 transition ease-in-out duration-500">
                        <a
                          href={footer.social_facebook}
                          aria-label="Social Link"
                          rel="noreferrer"
                          target="_blank"
                          className="block text-center mx-auto text-muted-foreground hover:text-white"
                        >
                          <FacebookIcon size={34} round />
                        </a>
                      </li>
                    )}
                    {footer?.social_twitter && (
                      <li className="flex items-center  mr-3 transition ease-in-out duration-500">
                        <a
                          href={footer.social_twitter}
                          aria-label="Social Link"
                          rel="noreferrer"
                          target="_blank"
                          className="block text-center mx-auto text-muted-foreground hover:text-white"
                        >
                          <XIcon size={34} round />
                        </a>
                      </li>
                    )}
                    {footer?.social_pinterest && (
                      <li className="flex items-center mr-3 transition ease-in-out duration-500">
                        <a
                          href={footer.social_pinterest}
                          aria-label="Social Link"
                          rel="noreferrer"
                          target="_blank"
                          className="block text-center mx-auto text-muted-foreground hover:text-white"
                        >
                          <PinterestIcon size={34} round />
                        </a>
                      </li>
                    )}
                    {footer?.social_linkedin && (
                      <li className="flex items-center  mr-3 transition ease-in-out duration-500">
                        <a
                          href={footer.social_linkedin}
                          aria-label="Social Link"
                          rel="noreferrer"
                          target="_blank"
                          className="block text-center mx-auto text-muted-foreground hover:text-white"
                        >
                          <LinkedinIcon size={34} round />
                        </a>
                      </li>
                    )}
                    {footer?.social_whatsapp && (
                      <li className="flex items-center  mr-3 transition ease-in-out duration-500">
                        <a
                          href={footer.social_whatsapp}
                          aria-label="Social Link"
                          rel="noreferrer"
                          target="_blank"
                          className="block text-center mx-auto text-muted-foreground hover:text-white"
                        >
                          <WhatsappIcon size={34} round />
                        </a>
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
            <div className="col-span-1 text-center hidden lg:block md:block">
              {footer?.bottom_contact_status && (
                <div>
                  <p className="text-base leading-7 font-medium block">
                    Call Us
                  </p>
                  <h5 className="text-2xl font-bold text-primary leading-7">
                    {footer?.bottom_contact}
                  </h5>
                </div>
              )}
            </div>
            {footer?.payment_method_status && (
              <div className="col-span-1 hidden lg:block md:block">
                <ul className="lg:text-right">
                  <li className="px-1 mb-2 md:mb-0 transition hover:opacity-80 inline-flex">
                    <img
                      className="w-full"
                      src={
                        footer?.payment_method_img ||
                        "/payment-method/payment-logo.png"
                      }
                      alt="payment method"
                    />
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-screen-2xl px-3 sm:px-10 flex justify-center py-4">
        <p className="text-sm text-muted-foreground leading-6">
          {globalSetting?.copyright_text ||
            `Copyright ${new Date().getFullYear()} @ All rights reserved.`}
        </p>
      </div>
    </div>
  );
};

export default Footer;
