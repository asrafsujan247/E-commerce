import { useEffect, useState } from "react";

import PageHeader from "@components/header/PageHeader";
import CMSkeletonTwo from "@components/preloader/CMSkeleton";
import { getStoreCustomizationSetting } from "@services/SettingServices";

import type { StoreCustomizationSetting } from "@appTypes/index";

const AboutUs = () => {
  const [storeCustomizationSetting, setStoreCustomizationSetting] = useState<
    StoreCustomizationSetting | undefined
  >(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getStoreCustomizationSetting();
        setStoreCustomizationSetting(result.storeCustomizationSetting);
        if (result.error) setError(result.error);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const about_us = storeCustomizationSetting?.about_us;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="bg-background">
      <PageHeader headerBg={about_us?.header_bg} title={about_us?.title} />

      <div className="bg-background text-foreground">
        <div className="max-w-screen-2xl mx-auto lg:py-20 py-10 px-4 sm:px-10">
          <div className="grid grid-flow-row lg:grid-cols-2 gap-4 lg:gap-16 items-center">
            <div>
              <h3 className="text-xl lg:text-3xl mb-2 font-semibold text-foreground">
                <CMSkeletonTwo
                  count={1}
                  height={50}
                  error={error}
                  loading={false}
                  data={about_us?.top_title}
                />
              </h3>
              <div className="mt-3 text-base text-muted-foreground leading-7">
                <p>
                  <CMSkeletonTwo
                    count={5}
                    height={20}
                    error={error}
                    loading={false}
                    data={about_us?.top_description}
                  />
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-6 lg:grid-cols-2 xl:gap-6 mt-8">
                <div className="p-8 bg-primary/5 dark:bg-primary/10 border border-primary/10 shadow-sm rounded-xl">
                  {error ? (
                    <CMSkeletonTwo
                      count={8}
                      height={20}
                      error={error}
                      loading={false}
                    />
                  ) : (
                    <>
                      <span className="text-3xl block font-extrabold mb-4 text-primary">
                        {String(about_us?.card_two_title ?? '') as string}
                      </span>
                      <h4 className="text-lg font-bold mb-1 text-foreground">
                        {String(about_us?.card_two_sub ?? '') as string}
                      </h4>
                      <p className="mb-0 text-muted-foreground leading-7">
                        {String(
                          storeCustomizationSetting?.about_us?.card_two_description ?? '') as string}
                      </p>
                    </>
                  )}
                </div>
                <div className="p-8 bg-indigo-50 shadow-sm rounded-lg">
                  {error ? (
                    <CMSkeletonTwo
                      count={8}
                      height={20}
                      error={error}
                      loading={false}
                    />
                  ) : (
                    <>
                      <span className="text-3xl block font-extrabold mb-4 text-primary">
                        {String(about_us?.card_one_title ?? '') as string}
                      </span>
                      <h4 className="text-lg font-bold mb-1 text-foreground">
                        {String(about_us?.card_one_sub ?? '') as string}
                      </h4>
                      <p className="mb-0 text-muted-foreground leading-7">
                        {String(
                          storeCustomizationSetting?.about_us?.card_one_description ?? '') as string}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-10 lg:mt-0">
              <img
                width={920}
                height={750}
                src={about_us?.content_right_img || "/about-us.jpg"}
                alt="About Us"
                className="w-full"
              />
            </div>
          </div>

          <div className="mt-10 lg:mt-16 text-base text-muted-foreground leading-7">
            <p>
              <CMSkeletonTwo
                count={5}
                height={20}
                error={error}
                loading={false}
                data={about_us?.middle_description_one}
              />
            </p>

            <p>
              <CMSkeletonTwo
                count={8}
                height={20}
                error={error}
                loading={false}
                data={about_us?.middle_description_two}
              />
            </p>
          </div>

          <div className="mt-10 lg:mt-12 flex flex-col sm:grid gap-4">
            <img
              width={1920}
              height={570}
              src={about_us?.content_middle_Img || "/about-banner.jpg"}
              alt="About Banner"
              className="block rounded-lg w-full"
            />
          </div>
        </div>

        <div className="bg-muted/50 dark:bg-muted/30 lg:py-20 py-10 border-t border-border/50">
          <div className="max-w-screen-2xl mx-auto px-3 sm:px-10">
            <div className="relative flex flex-col sm:flex-row sm:items-end justify-between mb-8">
              <div className="max-w-2xl">
                <h3 className="text-xl lg:text-3xl mb-2 font-semibold">
                  <CMSkeletonTwo
                    count={1}
                    height={50}
                    error={error}
                    loading={false}
                    data={about_us?.founder_title}
                  />
                </h3>
                <p className="mt-2 md:mt-3 font-normal block text-base">
                  <CMSkeletonTwo
                    count={3}
                    height={20}
                    error={error}
                    loading={false}
                    data={about_us?.founder_description}
                  />
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-x-5 gap-y-8 lg:grid-cols-6 xl:gap-x-8">
              {[
                { img: about_us?.founder_one_img || "/team/team-1.jpg", name: about_us?.founder_one_name, sub: about_us?.founder_one_sub, alt: "team-1" },
                { img: about_us?.founder_two_img || "/team/team-2.jpg", name: about_us?.founder_two_name, sub: about_us?.founder_two_sub, alt: "team-2" },
                { img: about_us?.founder_three_img || "/team/team-3.jpg", name: about_us?.founder_three_name, sub: about_us?.founder_three_sub, alt: "team-3" },
                { img: about_us?.founder_four_img || "/team/team-4.jpg", name: about_us?.founder_four_name, sub: about_us?.founder_four_sub, alt: "team-4" },
                { img: about_us?.founder_five_img || "/team/team-5.jpg", name: about_us?.founder_five_name, sub: about_us?.founder_five_sub, alt: "team-5" },
                { img: about_us?.founder_six_img || "/team/team-6.jpg", name: about_us?.founder_six_name, sub: about_us?.founder_six_sub, alt: "team-6" },
              ].map((member) => (
                <div key={member.alt} className="max-w-sm">
                  <img
                    width={420}
                    height={420}
                    src={member.img}
                    alt={member.alt}
                    className="block rounded-lg w-full"
                  />
                  <div className="py-4">
                    <h5 className="text-lg font-semibold">
                      {String(member.name ?? '') as string}
                    </h5>
                    <span className="opacity-75 text-sm">
                      {String(member.sub ?? '') as string}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
