import CompareProducts from "@components/compare/CompareProducts";

const Compare = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page header — mirrors the RFQ / Inquiry pages */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Compare Products
          </h1>
          <p className="mt-1.5 text-sm text-gray-500">
            Review key details side by side to find the right product and
            supplier for your needs.
          </p>
        </div>

        {/* White card lifts the table off the grey page background */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <CompareProducts />
        </div>
      </div>
    </div>
  );
};

export default Compare;
