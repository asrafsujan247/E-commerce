import { useRef, useState } from "react";
import { FiChevronDown, FiPaperclip, FiInfo } from "react-icons/fi";

import FormRow from "./FormRow";
import SelectField from "./SelectField";
import {
  UNITS,
  TRADE_TERMS,
  CURRENCIES,
  MAX_BUDGET_OPTIONS,
} from "@lib/rfqConstants";
import type { FormState } from "@appTypes/rfq";

const inputCls = (hasError: boolean) =>
  `border rounded px-3 py-1.5 text-sm text-gray-700 placeholder-gray-400 bg-white focus:outline-none focus:border-blue-400 transition-colors ${hasError ? "border-red-400 bg-red-50" : "border-gray-300"}`;

interface RfqBasicInfoProps {
  form: FormState;
  submitted: boolean;
  onChange: (field: keyof FormState, value: string) => void;
  onCategoryClick: () => void;
}

const RfqBasicInfo = ({
  form,
  submitted,
  onChange,
  onCategoryClick,
}: RfqBasicInfoProps) => {
  const [fileCount, setFileCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFileCount((prev) => Math.min(1, prev + e.target.files!.length));
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded p-5 sm:p-6">
      <h2 className="text-sm font-bold text-gray-900 mb-5">
        Basic Product Information
      </h2>

      <div className="space-y-4">
        {/* Product Name */}
        <FormRow label="Product Name" required>
          <input
            type="text"
            value={form.productName}
            onChange={(e) => onChange("productName", e.target.value)}
            placeholder="Enter a specific product name."
            className={`w-full max-w-lg ${inputCls(submitted && !form.productName)}`}
          />
        </FormRow>

        {/* Category — opens cascading modal */}
        <FormRow label="Category">
          <button
            type="button"
            onClick={onCategoryClick}
            className="flex items-center justify-between gap-1.5 w-full sm:w-auto border border-gray-300 rounded px-3 py-1.5 text-sm bg-white hover:border-blue-400 transition-colors"
          >
            {form.category ? (
              <span className="text-gray-800">{form.category}</span>
            ) : (
              <span className="text-gray-500">Please select</span>
            )}
            <FiChevronDown className="w-3.5 h-3.5 shrink-0 text-gray-400 ml-1" />
          </button>
        </FormRow>

        {/* Purchase Quantity */}
        <FormRow label="Purchase Quantity" required>
          <div className="flex items-center gap-2 flex-wrap">
            <input
              type="number"
              value={form.quantity}
              onChange={(e) => onChange("quantity", e.target.value)}
              min="1"
              className={`w-full sm:w-28 ${inputCls(submitted && !form.quantity)}`}
            />
            <SelectField
              value={form.unit}
              onChange={(e) => onChange("unit", e.target.value)}
            >
              {UNITS.map((u) => (
                <option key={u}>{u}</option>
              ))}
            </SelectField>
          </div>
        </FormRow>

        {/* Trade Terms */}
        <FormRow label="Trade Terms" required>
          <SelectField
            value={form.tradeTerms}
            onChange={(e) => onChange("tradeTerms", e.target.value)}
          >
            {TRADE_TERMS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </SelectField>
        </FormRow>

        {/* Target Unit Price */}
        <FormRow label="Target Unit Price">
          <div className="flex items-center gap-2 flex-wrap">
            <input
              type="number"
              value={form.targetPrice}
              onChange={(e) => onChange("targetPrice", e.target.value)}
              min="0"
              step="0.01"
              className={`w-full sm:w-28 ${inputCls(false)}`}
            />
            <SelectField
              value={form.currency}
              onChange={(e) => onChange("currency", e.target.value)}
            >
              {CURRENCIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </SelectField>
          </div>
        </FormRow>

        {/* Max Budget */}
        <FormRow label="Max Budget" required>
          <div className="flex items-center gap-2 flex-wrap">
            <SelectField
              value={form.maxBudget}
              onChange={(e) => onChange("maxBudget", e.target.value)}
              hasError={submitted && !form.maxBudget}
            >
              <option value="">Please select</option>
              {MAX_BUDGET_OPTIONS.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </SelectField>
            <span className="text-sm text-gray-500">USD</span>
          </div>
        </FormRow>

        {/* Details */}
        <FormRow label="Details" required alignTop>
          <div className="w-full max-w-lg">
            <textarea
              value={form.details}
              onChange={(e) => onChange("details", e.target.value)}
              rows={6}
              placeholder={
                "Describe the product you want to source.\n" +
                "You may include: Color, Material, Size, Weight, Packaging and certificate requirements and/or others."
              }
              className={`w-full resize-none ${inputCls(submitted && !form.details)}`}
            />

            {/* File upload trigger */}
            <div className="mt-1.5 border-t border-gray-200 pt-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*,.pdf,.doc,.docx"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={fileCount >= 1}
                className="flex items-center gap-1.5 text-sm text-blue-500 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FiPaperclip className="w-3.5 h-3.5" />
                Upload product image or file ({fileCount}/1)
                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-100 text-blue-600 ml-0.5">
                  <FiInfo className="w-2.5 h-2.5" />
                </span>
              </button>
            </div>
          </div>
        </FormRow>
      </div>
    </div>
  );
};

export default RfqBasicInfo;
