import CompareProducts from "@components/compare/CompareProducts";

const Compare = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
        {/* White card lifts the table off the grey page background */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <CompareProducts />
        </div>
      </div>
    </div>
  );
};

export default Compare;
