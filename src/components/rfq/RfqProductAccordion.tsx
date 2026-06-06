import { FiChevronDown } from "react-icons/fi";
import RfqBasicInfo from "./RfqBasicInfo";
import type { FormState } from "@appTypes/rfq";

export interface ProductEntry {
  id: string;
  form: FormState;
  submitted: boolean;
}

interface RfqProductAccordionProps {
  product: ProductEntry;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  onChange: (field: keyof FormState, value: string) => void;
  onCategoryClick: () => void;
}

const RfqProductAccordion = ({
  product,
  index,
  isOpen,
  onToggle,
  onChange,
  onCategoryClick,
}: RfqProductAccordionProps) => {
  return (
    <div className="mb-3">
      {/* Toggle header — always visible */}
      <button
        type="button"
        onClick={onToggle}
        className={`w-full flex items-center justify-between px-4 py-3 bg-white border rounded transition-colors duration-200`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded shrink-0 transition-colors duration-200 ${
              isOpen ? "bg-blue-500 text-white" : "bg-blue-50 text-blue-600"
            }`}
          >
            Product {index + 1}
          </span>
          {!isOpen && (
            <span className="text-sm text-gray-700 font-medium truncate">
              {product.form.productName ? (
                product.form.productName
              ) : (
                <span className="text-gray-400 font-normal italic">
                  Not named yet
                </span>
              )}
            </span>
          )}
        </div>
        <FiChevronDown
          className={`w-4 h-4 shrink-0 ml-2 transition-transform duration-300 ${
            isOpen ? "-rotate-180 text-blue-500" : "text-gray-400"
          }`}
        />
      </button>

      {/* Animated body using CSS grid trick */}
      <div
        style={{
          display: "grid",
          gridTemplateRows: isOpen ? "1fr" : "0fr",
          transition: "grid-template-rows 0.3s ease",
        }}
      >
        <div style={{ minHeight: 0, overflow: "hidden" }}>
          <div className="pt-2">
            <RfqBasicInfo
              form={product.form}
              submitted={product.submitted}
              onChange={onChange}
              onCategoryClick={onCategoryClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RfqProductAccordion;
