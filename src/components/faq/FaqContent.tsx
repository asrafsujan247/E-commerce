import React, { useState } from "react";
import { FiPlus, FiMinus } from "react-icons/fi";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqContentProps {
  faq: FaqItem;
}

const FaqContent: React.FC<FaqContentProps> = ({ faq }) => {
  const [openFaq, setOpenFaq] = useState<boolean>(false);

  return (
    <div key={faq.question} className="pt-6">
      <button
        onClick={() => setOpenFaq(!openFaq)}
        className="flex w-full items-start justify-between text-left text-foreground dark:text-muted-foreground"
      >
        <span className="text-base font-semibold leading-7">
          {faq.question}
        </span>
        <span className="ml-6 flex h-7 items-center">
          {openFaq ? (
            <FiMinus className="h-6 w-6" aria-hidden="true" />
          ) : (
            <FiPlus className="h-6 w-6" aria-hidden="true" />
          )}
        </span>
      </button>

      {/* content */}
      <div
        style={{
          height: openFaq ? "auto" : 0,
          transition: "all .6s",
          visibility: !openFaq ? "hidden" : "visible",
          opacity: !openFaq ? "0" : "1",
        }}
      >
        <p className="text-base leading-7 text-muted-foreground dark:text-muted-foreground">
          {faq.answer}
        </p>
      </div>
    </div>
  );
};

export default FaqContent;
