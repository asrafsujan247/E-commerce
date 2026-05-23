import { useEffect, useState } from "react";
import { useSetting } from "@stores/useSettingStore";
import useUtilsFunction from "@hooks/useUtilsFunction";
import FaqContent from "@components/faq/FaqContent";

interface FaqItem {
  question: string;
  answer: string;
}

const Faq = () => {
  const { storeCustomization } = useSetting();
  const [faqs, setFaqs] = useState<FaqItem[]>([]);

  useEffect(() => {
    const faqData = storeCustomization?.faq as Record<string, unknown> | undefined;
    if (!faqData) return;
    const pairs: Array<[string, string]> = [
      ["faq_one", "description_one"],
      ["faq_two", "description_two"],
      ["faq_three", "description_three"],
      ["faq_four", "description_four"],
      ["faq_five", "description_five"],
      ["faq_six", "description_six"],
      ["faq_seven", "description_seven"],
      ["faq_eight", "description_eight"],
    ];
    setFaqs(
      pairs.map(([q, a]) => ({
        question: String(faqData[q] ?? '') ?? "",
        answer: String(faqData[a] ?? '') ?? "",
      }))
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeCustomization]);

  const faqData = storeCustomization?.faq as Record<string, unknown> | undefined;
  const headerBg = faqData?.header_bg as string | undefined;
  const leftImg = faqData?.left_img as string | undefined;

  return (
    <div className="bg-background">
      {headerBg && (
        <div className="relative h-48 overflow-hidden">
          <img src={headerBg} alt="FAQ header" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <h1 className="text-white text-3xl font-bold">FAQs</h1>
          </div>
        </div>
      )}
      <div className="max-w-screen-2xl mx-auto px-3 sm:px-10 py-10 lg:py-12">
        <div className="grid gap-4 lg:mb-8 items-center md:grid-cols-2">
          <div className="pr-16">
            <img
              src={leftImg ?? "/faq.svg"}
              alt="FAQ illustration"
              className="w-full h-auto"
            />
          </div>
          <dl className="mt-10 space-y-6 divide-y divide-border">
            {faqs.map((faq, index) => (
              <FaqContent key={index} faq={faq} />
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default Faq;
