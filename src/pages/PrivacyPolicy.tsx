import { useSetting } from "@stores/useSettingStore";
import useUtilsFunction from "@hooks/useUtilsFunction";

const PrivacyPolicy = () => {
  const { storeCustomization } = useSetting();
  const privacy = storeCustomization?.privacy_policy as Record<string, unknown> | undefined;
  const headerBg = privacy?.header_bg as string | undefined;
  const title = String(privacy?.title ?? '') ?? "Privacy Policy";
  const description = String(privacy?.description ?? '') ?? "";

  return (
    <div className="min-h-screen bg-background">
      {headerBg && (
        <div className="relative h-48 overflow-hidden">
          <img src={headerBg} alt="Privacy Policy header" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <h1 className="text-white text-3xl font-bold">{title}</h1>
          </div>
        </div>
      )}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-10 py-10">
        <div
          className="prose prose-sm sm:prose-base max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </div>
    </div>
  );
};

export default PrivacyPolicy;
