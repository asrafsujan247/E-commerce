import { FiX, FiChevronRight } from "react-icons/fi";
import type { Department, RfqCategory, SubCategory } from "@appTypes/rfq";

interface CategoryModalProps {
  departments: Department[];
  selectedDept: Department | null;
  selectedCat: RfqCategory | null;
  onDeptSelect: (dept: Department) => void;
  onCatSelect: (cat: RfqCategory) => void;
  onSubCatSelect: (sub: SubCategory) => void;
  onClose: () => void;
}

const CategoryModal = ({
  departments, selectedDept, selectedCat,
  onDeptSelect, onCatSelect, onSubCatSelect, onClose,
}: CategoryModalProps) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
    onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
  >
    <div
      className="bg-white rounded-lg shadow-2xl w-full max-w-3xl flex flex-col"
      style={{ maxHeight: "min(80vh, 560px)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 shrink-0">
        <h3 className="text-sm font-semibold text-gray-900">Select Category</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
          <FiX className="w-4 h-4" />
        </button>
      </div>

      {/* Breadcrumb */}
      {(selectedDept || selectedCat) && (
        <div className="px-5 py-2 text-xs text-gray-500 border-b border-gray-100 shrink-0 flex items-center gap-1 flex-wrap">
          {selectedDept && <span className="text-blue-600">{selectedDept.name}</span>}
          {selectedCat && (
            <>
              <FiChevronRight className="w-3 h-3" />
              <span className="text-blue-600">{selectedCat.name}</span>
            </>
          )}
        </div>
      )}

      {/* 3-column body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Column 1 – Departments */}
        <div className="flex flex-col border-r border-gray-200" style={{ width: "33.33%" }}>
          <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50 border-b border-gray-200 shrink-0">
            Department
          </div>
          <div className="overflow-y-auto flex-1">
            {departments.map((dept) => (
              <button
                key={dept._id}
                onClick={() => onDeptSelect(dept)}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left transition-colors border-b border-gray-50 ${
                  selectedDept?._id === dept._id
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span className="leading-snug">{dept.name}</span>
                <FiChevronRight className="w-3.5 h-3.5 shrink-0 text-gray-300 ml-2" />
              </button>
            ))}
          </div>
        </div>

        {/* Column 2 – Categories */}
        <div className="flex flex-col border-r border-gray-200" style={{ width: "33.33%" }}>
          <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50 border-b border-gray-200 shrink-0">
            Category
          </div>
          <div className="overflow-y-auto flex-1">
            {selectedDept ? (
              selectedDept.categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => onCatSelect(cat)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left transition-colors border-b border-gray-50 ${
                    selectedCat?._id === cat._id
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="leading-snug">{cat.name}</span>
                  {(cat.children?.length ?? 0) > 0 && (
                    <FiChevronRight className="w-3.5 h-3.5 shrink-0 text-gray-300 ml-2" />
                  )}
                </button>
              ))
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-xs text-gray-400 text-center px-4">Select a department first</p>
              </div>
            )}
          </div>
        </div>

        {/* Column 3 – Sub-categories */}
        <div className="flex flex-col" style={{ width: "33.33%" }}>
          <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50 border-b border-gray-200 shrink-0">
            Sub-Category
          </div>
          <div className="overflow-y-auto flex-1">
            {selectedCat ? (
              (selectedCat.children?.length ?? 0) > 0 ? (
                selectedCat.children.map((sub) => (
                  <button
                    key={sub._id}
                    onClick={() => onSubCatSelect(sub)}
                    className="w-full px-4 py-2.5 text-sm text-left text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors border-b border-gray-50"
                  >
                    {sub.name}
                  </button>
                ))
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-xs text-gray-400 text-center px-4">No sub-categories available</p>
                </div>
              )
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-xs text-gray-400 text-center px-4">Select a category first</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default CategoryModal;
