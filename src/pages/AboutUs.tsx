import { useEffect, useState } from "react";
import {
  FiInfo,
  FiBookOpen,
  FiUsers,
  FiAward,
  FiTrendingUp,
} from "react-icons/fi";

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

  const team = [
    {
      img: about_us?.founder_one_img || "/team/team-1.jpg",
      name: about_us?.founder_one_name,
      sub: about_us?.founder_one_sub,
      alt: "team-1",
    },
    {
      img: about_us?.founder_two_img || "/team/team-2.jpg",
      name: about_us?.founder_two_name,
      sub: about_us?.founder_two_sub,
      alt: "team-2",
    },
    {
      img: about_us?.founder_three_img || "/team/team-3.jpg",
      name: about_us?.founder_three_name,
      sub: about_us?.founder_three_sub,
      alt: "team-3",
    },
    {
      img: about_us?.founder_four_img || "/team/team-4.jpg",
      name: about_us?.founder_four_name,
      sub: about_us?.founder_four_sub,
      alt: "team-4",
    },
    {
      img: about_us?.founder_five_img || "/team/team-5.jpg",
      name: about_us?.founder_five_name,
      sub: about_us?.founder_five_sub,
      alt: "team-5",
    },
    {
      img: about_us?.founder_six_img || "/team/team-6.jpg",
      name: about_us?.founder_six_name,
      sub: about_us?.founder_six_sub,
      alt: "team-6",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageHeader headerBg={about_us?.header_bg} title={about_us?.title} />

      {/* Intro / Hero */}
      <section className="max-w-screen-2xl mx-auto px-4 sm:px-10 py-12 lg:py-20">
        <div className="grid grid-flow-row lg:grid-cols-2 gap-10 lg:gap-16 items-stretch">
          {/* Left: copy + stats */}
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-5">
              <FiInfo className="w-4 h-4" />
              Who We Are
            </span>

            <h2 className="text-2xl lg:text-4xl font-bold tracking-tight text-foreground leading-tight">
              <CMSkeletonTwo
                count={1}
                height={50}
                error={error}
                loading={false}
                data={about_us?.top_title}
              />
            </h2>

            <div className="mt-4 text-base text-muted-foreground leading-7">
              <CMSkeletonTwo
                count={5}
                height={20}
                error={error}
                loading={false}
                data={about_us?.top_description}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-6 mt-8">
              {/* Stat card one (primary) */}
              <div className="group bg-background dark:bg-muted p-7 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 border border-border">
                {error ? (
                  <CMSkeletonTwo count={5} height={20} error={error} loading={false} />
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <FiTrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-3xl block font-extrabold mb-2 bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
                      {String(about_us?.card_two_title ?? "") as string}
                    </span>
                    <h4 className="text-lg font-bold mb-1 text-foreground">
                      {String(about_us?.card_two_sub ?? "") as string}
                    </h4>
                    <p className="mb-0 text-sm text-muted-foreground leading-7">
                      {String(about_us?.card_two_description ?? "") as string}
                    </p>
                  </>
                )}
              </div>

              {/* Stat card two (indigo accent) */}
              <div className="group bg-background dark:bg-muted p-7 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 border border-border">
                {error ? (
                  <CMSkeletonTwo count={5} height={20} error={error} loading={false} />
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <FiAward className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-3xl block font-extrabold mb-2 bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
                      {String(about_us?.card_one_title ?? "") as string}
                    </span>
                    <h4 className="text-lg font-bold mb-1 text-foreground">
                      {String(about_us?.card_one_sub ?? "") as string}
                    </h4>
                    <p className="mb-0 text-sm text-muted-foreground leading-7">
                      {String(about_us?.card_one_description ?? "") as string}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right: hero image, height-matched to the copy column */}
          <div className="relative h-72 sm:h-96 lg:h-full mt-2 lg:mt-0">
            <img
              src={about_us?.content_right_img || "/about-us.jpg"}
              alt="About Us"
              className="absolute inset-0 w-full h-full object-cover rounded-xl shadow-lg ring-1 ring-border"
            />
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="relative overflow-hidden bg-muted/50 dark:bg-muted/30 border-y border-border/50 py-14 lg:py-24">
        {/* decorative gradient blobs */}
        <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative max-w-screen-2xl mx-auto px-4 sm:px-10">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            {/* Left: sticky heading */}
            <div className="lg:col-span-5 lg:sticky lg:top-28">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-5">
                <FiBookOpen className="w-4 h-4" />
                Our Story
              </span>
              <h3 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground leading-tight">
                Built on a passion for fresh food
              </h3>
              <div className="mt-6 h-1.5 w-24 rounded-full bg-gradient-to-r from-primary to-emerald-500" />

              <div className="relative mt-10">
                <div className="absolute -inset-3 bg-gradient-to-tr from-primary/20 via-emerald-500/10 to-transparent rounded-xl blur-2xl" />
                <img
                  width={900}
                  height={675}
                  loading="lazy"
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80"
                  alt="Fresh fruits and vegetables on display"
                  className="relative w-full h-80 sm:h-96 lg:h-[34rem] object-cover rounded-xl ring-1 ring-border shadow-xl"
                />
                <div className="absolute -bottom-5 -left-5 inline-flex items-center justify-center w-16 h-16 rounded-lg bg-gradient-to-br from-primary to-emerald-600 shadow-lg shadow-primary/30 ring-4 ring-background dark:ring-muted">
                  <FiBookOpen className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>

            {/* Right: story card */}
            <div className="lg:col-span-7">
              <div className="relative rounded-xl bg-background dark:bg-muted border border-border shadow-sm p-8 lg:p-12">
                <span
                  aria-hidden
                  className="absolute -top-6 left-8 text-8xl leading-none font-serif text-primary/15 select-none"
                >
                  &ldquo;
                </span>

                <p className="relative text-base lg:text-lg text-muted-foreground leading-8 first-letter:float-left first-letter:mr-3 first-letter:text-5xl first-letter:font-bold first-letter:leading-none first-letter:text-primary">
                  <CMSkeletonTwo
                    count={5}
                    height={20}
                    error={error}
                    loading={false}
                    data={about_us?.middle_description_one}
                  />
                </p>

                <div className="my-7 flex items-center gap-3">
                  <span className="h-px flex-1 bg-border" />
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                  <span className="h-px flex-1 bg-border" />
                </div>

                <p className="text-base text-muted-foreground leading-8">
                  <CMSkeletonTwo
                    count={8}
                    height={20}
                    error={error}
                    loading={false}
                    data={about_us?.middle_description_two}
                  />
                </p>
              </div>
            </div>
          </div>

          {/* Banner showcase */}
          <div className="group relative mt-12 lg:mt-16 overflow-hidden rounded-xl shadow-xl ring-1 ring-border">
            <img
              width={1920}
              height={570}
              src={about_us?.content_middle_Img || "/about-banner.jpg"}
              alt="About Banner"
              className="block w-full h-64 sm:h-80 lg:h-[26rem] object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 lg:bottom-8 lg:left-10">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-sm font-medium ring-1 ring-white/20">
                <FiTrendingUp className="w-4 h-4" />
                Fresh picks, sourced daily
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="max-w-screen-2xl mx-auto px-4 sm:px-10 py-12 lg:py-20">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-5">
            <FiUsers className="w-4 h-4" />
            Meet the Team
          </span>
          <h3 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
            <CMSkeletonTwo
              count={1}
              height={50}
              error={error}
              loading={false}
              data={about_us?.founder_title}
            />
          </h3>
          <p className="mt-3 text-base text-muted-foreground leading-7">
            <CMSkeletonTwo
              count={3}
              height={20}
              error={error}
              loading={false}
              data={about_us?.founder_description}
            />
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5 lg:gap-6">
          {team.map((member) => (
            <div
              key={member.alt}
              className="group bg-background dark:bg-muted rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-border"
            >
              <div className="overflow-hidden aspect-square">
                <img
                  width={420}
                  height={420}
                  src={member.img}
                  alt={member.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4 text-center">
                <h5 className="text-base font-semibold text-foreground">
                  {String(member.name ?? "") as string}
                </h5>
                <span className="text-sm text-muted-foreground">
                  {String(member.sub ?? "") as string}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
