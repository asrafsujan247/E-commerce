import type { ReactNode } from "react";

interface FormRowProps {
  label: string;
  required?: boolean;
  alignTop?: boolean;
  children: ReactNode;
}

const FormRow = ({ label, required, alignTop, children }: FormRowProps) => (
  <div className={`flex flex-col sm:flex-row gap-1 sm:gap-0 ${alignTop ? "sm:items-start" : "sm:items-center"}`}>
    {/* Label — left-aligned on mobile, right-aligned at fixed width on sm+ */}
    <div
      className={`flex items-center text-sm text-gray-700 sm:w-37 sm:shrink-0 sm:justify-end sm:pr-3 ${alignTop ? "sm:pt-2" : ""}`}
    >
      {required && <span className="text-red-500 mr-0.5 leading-none">*</span>}
      <span>{label}:</span>
    </div>
    {/* Input area — full width on mobile, flex-1 on sm+ */}
    <div className="w-full sm:flex-1 sm:min-w-0">{children}</div>
  </div>
);

export default FormRow;
