import { useSetting } from "@stores/useSettingStore";
import useUtilsFunction from "@hooks/useUtilsFunction";

const Terms = () => {
  const { storeCustomization } = useSetting();
  const terms = storeCustomization?.term_and_condition as
    | Record<string, unknown>
    | undefined;
  const headerBg = terms?.header_bg as string | undefined;
  const title =
    String(terms?.title ?? '') ??
    "Terms & Conditions";
  const description =
    String(
      (terms?.description as Record<string, string> | undefined) ?? '') ?? "";

  return (
    <div className="min-h-screen bg-background">
      {headerBg && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={headerBg}
            alt="Terms header"
            className="w-full h-full object-cover"
          />
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

export default Terms;
