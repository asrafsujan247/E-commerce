import { useState } from "react";
import { useLocation } from "react-router-dom";
import categoriesData from "@localdata/categories.json";

import CategoryModal from "@components/rfq/CategoryModal";
import RfqBasicInfo from "@components/rfq/RfqBasicInfo";
import RfqShipping from "@components/rfq/RfqShipping";
import RfqCompleteness from "@components/rfq/RfqCompleteness";

import {
  initialForm,
  REQUIRED_FIELDS,
  ALL_SCORED_FIELDS,
} from "@lib/rfqConstants";
import type {
  FormState,
  Department,
  RfqCategory,
  SubCategory,
} from "@appTypes/rfq";

// Fields that always have a default value and are always counted as filled
const ALWAYS_FILLED_FIELDS = ["tradeTerms", "shippingMethod", "paymentTerms"];

function calcCompletionPercent(form: FormState): number {
  const filled = ALL_SCORED_FIELDS.filter((field) => {
    if (ALWAYS_FILLED_FIELDS.includes(field)) return true;
    const value = form[field as keyof FormState];
    return typeof value === "string" && value.trim() !== "";
  });
  return Math.round((filled.length / ALL_SCORED_FIELDS.length) * 100);
}

function getMissingRequired(form: FormState): (keyof FormState)[] {
  return REQUIRED_FIELDS.filter((field) => {
    const value = form[field];
    return typeof value !== "string" || value.trim() === "";
  });
}

const Rfq = () => {
  const location = useLocation();
  const locationState = location.state as Partial<FormState> | null;

  const [form, setForm] = useState<FormState>({
    ...initialForm,
    ...(locationState ?? {}),
  });
  const [submitted, setSubmitted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [selectedCat, setSelectedCat] = useState<RfqCategory | null>(null);

  const departments = categoriesData as Department[];
  const completionPercent = calcCompletionPercent(form);
  const missingRequired = getMissingRequired(form);
  const isComplete = missingRequired.length === 0;

  // Form field change handler
  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Category modal handlers
  const handleDeptSelect = (dept: Department) => {
    setSelectedDept(dept);
    setSelectedCat(null);
  };

  const handleCatSelect = (cat: RfqCategory) => {
    setSelectedCat(cat);
  };

  const handleSubCatSelect = (sub: SubCategory) => {
    setForm((prev) => ({
      ...prev,
      category: `${selectedDept?.name} > ${selectedCat?.name} > ${sub.name}`,
      categoryId: sub._id,
    }));
    closeModal();
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedDept(null);
    setSelectedCat(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page header */}
        <div className="mb-5">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Tell suppliers what you need
            </h1>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            The more specific your information, the faster response you will
            get.
          </p>
        </div>

        {/* Two-column layout: form on left, completeness tracker on right */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-start">
          {/* Left: form */}
          <div className="flex-1 min-w-0">
            <form onSubmit={handleSubmit} noValidate>
              <RfqBasicInfo
                form={form}
                submitted={submitted}
                onChange={handleChange}
                onCategoryClick={() => setModalOpen(true)}
              />
              <RfqShipping form={form} onChange={handleChange} />
            </form>
          </div>

          {/* Right: live completeness tracker — hidden on mobile, visible from md */}
          <div className="hidden md:block md:w-64 lg:w-72 shrink-0">
            <RfqCompleteness
              completionPercent={completionPercent}
              missingRequired={missingRequired}
              isComplete={isComplete}
            />
          </div>
        </div>
      </div>

      {/* Category selection modal (Department → Category → Sub-category) */}
      {modalOpen && (
        <CategoryModal
          departments={departments}
          selectedDept={selectedDept}
          selectedCat={selectedCat}
          onDeptSelect={handleDeptSelect}
          onCatSelect={handleCatSelect}
          onSubCatSelect={handleSubCatSelect}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default Rfq;
