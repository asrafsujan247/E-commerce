import type { ReactNode, SelectHTMLAttributes } from "react";
import { FiChevronDown } from "react-icons/fi";

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  hasError?: boolean;
  children: ReactNode;
}

const SelectField = ({ hasError, children, className = "", ...props }: SelectFieldProps) => (
  <div className="relative inline-flex items-center">
    <select
      {...props}
      className={`appearance-none border rounded pl-3 pr-9 py-1.5 text-sm text-gray-700 bg-white focus:outline-none focus:border-blue-400 ${
        hasError ? "border-red-400 bg-red-50" : "border-gray-300"
      } ${className}`}
    >
      {children}
    </select>
    <FiChevronDown className="pointer-events-none absolute right-2.5 w-3.5 h-3.5 text-gray-400" />
  </div>
);

export default SelectField;
