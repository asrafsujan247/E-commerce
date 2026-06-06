import { useState } from "react";
import { useLocation } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import categoriesData from "@localdata/categories.json";

import CategoryModal from "@components/rfq/CategoryModal";
import RfqProductAccordion, {
  type ProductEntry,
} from "@components/rfq/RfqProductAccordion";
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

const FIRST_ID = "1";

const Rfq = () => {
  const location = useLocation();
  const locationState = location.state as Partial<FormState> | null;

  const [products, setProducts] = useState<ProductEntry[]>([
    {
      id: FIRST_ID,
      form: { ...initialForm, ...(locationState ?? {}) },
      submitted: false,
    },
  ]);
  const [openId, setOpenId] = useState<string>(FIRST_ID);

  // Shipping & payment is a single shared section for the whole RFQ
  const [shippingForm, setShippingForm] = useState<FormState>({
    ...initialForm,
    ...(locationState ?? {}),
  });

  const [modalProductId, setModalProductId] = useState<string | null>(null);
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [selectedCat, setSelectedCat] = useState<RfqCategory | null>(null);

  const departments = categoriesData as Department[];

  // Completeness tracker reflects the currently open product (or last product if none open)
  const activeProduct =
    products.find((p) => p.id === openId) ?? products[products.length - 1];
  const effectiveForm: FormState = {
    ...activeProduct.form,
    shippingMethod: shippingForm.shippingMethod,
    destinationPort: shippingForm.destinationPort,
    leadTime: shippingForm.leadTime,
    paymentTerms: shippingForm.paymentTerms,
  };
  const completionPercent = calcCompletionPercent(effectiveForm);
  const missingRequired = getMissingRequired(effectiveForm);
  const isComplete = missingRequired.length === 0;

  // Open one accordion at a time; clicking the open one collapses it
  const handleToggle = (id: string) => {
    setOpenId((prev) => (prev === id ? "" : id));
  };

  const handleProductChange = (
    id: string,
    field: keyof FormState,
    value: string,
  ) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, form: { ...p.form, [field]: value } } : p,
      ),
    );
  };

  const handleShippingChange = (field: keyof FormState, value: string) => {
    setShippingForm((prev) => ({ ...prev, [field]: value }));
  };

  // Validate the open product before allowing a new one to be added
  const handleAddMore = () => {
    const currentProduct = products.find((p) => p.id === openId);
    if (currentProduct) {
      const missing = getMissingRequired(currentProduct.form);
      if (missing.length > 0) {
        setProducts((prev) =>
          prev.map((p) => (p.id === openId ? { ...p, submitted: true } : p)),
        );
        return;
      }
    }
    const newId = Date.now().toString();
    setProducts((prev) => [
      ...prev,
      { id: newId, form: { ...initialForm }, submitted: false },
    ]);
    setOpenId(newId);
  };

  const handleCategoryClick = (id: string) => {
    setModalProductId(id);
    setSelectedDept(null);
    setSelectedCat(null);
  };

  const handleDeptSelect = (dept: Department) => {
    setSelectedDept(dept);
    setSelectedCat(null);
  };

  const handleCatSelect = (cat: RfqCategory) => {
    setSelectedCat(cat);
  };

  const handleSubCatSelect = (sub: SubCategory) => {
    if (!modalProductId) return;
    setProducts((prev) =>
      prev.map((p) =>
        p.id === modalProductId
          ? {
              ...p,
              form: {
                ...p.form,
                category: `${selectedDept?.name} > ${selectedCat?.name} > ${sub.name}`,
                categoryId: sub._id,
              },
            }
          : p,
      ),
    );
    closeModal();
  };

  const closeModal = () => {
    setModalProductId(null);
    setSelectedDept(null);
    setSelectedCat(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProducts((prev) => prev.map((p) => ({ ...p, submitted: true })));
    const firstInvalid = products.find(
      (p) => getMissingRequired(p.form).length > 0,
    );
    if (firstInvalid) {
      setOpenId(firstInvalid.id);
      return;
    }
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
              {/* Product accordion items */}
              {products.map((product, index) => (
                <RfqProductAccordion
                  key={product.id}
                  product={product}
                  index={index}
                  isOpen={openId === product.id}
                  onToggle={() => handleToggle(product.id)}
                  onChange={(field, value) =>
                    handleProductChange(product.id, field, value)
                  }
                  onCategoryClick={() => handleCategoryClick(product.id)}
                />
              ))}

              {/* Add another product */}
              <div className="mb-3">
                <button
                  type="button"
                  onClick={handleAddMore}
                  className="flex items-center justify-center gap-2 w-full py-3 px-4 text-sm font-medium text-blue-600 hover:text-blue-700 bg-white border border-dashed border-blue-300 hover:border-blue-400 hover:bg-blue-50/50 rounded transition-all duration-200"
                >
                  <FiPlus className="w-4 h-4" />
                  Add Another Product
                </button>
              </div>

              <RfqShipping
                form={shippingForm}
                onChange={handleShippingChange}
              />
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

      {/* Category selection modal — scoped to whichever product triggered it */}
      {modalProductId && (
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
