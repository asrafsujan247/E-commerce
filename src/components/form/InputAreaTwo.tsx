import React from "react";
import { Input } from "@components/ui/input";

interface InputAreaTwoProps {
  name: string;
  label?: string;
  type?: string;
  Icon?: React.ComponentType<{ className?: string }>;
  defaultValue?: string;
  autocomplete?: string;
  placeholder?: string;
  readOnly?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  hasError?: boolean;
}

const InputAreaTwo = ({
  name,
  label,
  type,
  Icon,
  defaultValue,
  autocomplete,
  placeholder,
  readOnly,
  onChange,
  value,
  hasError,
}: InputAreaTwoProps) => {
  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-muted-foreground"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-muted-foreground" />
          </div>
        )}
        <Input
          id={name}
          type={type}
          name={name}
          readOnly={readOnly}
          defaultValue={defaultValue}
          value={value}
          placeholder={placeholder}
          autoComplete={autocomplete}
          onChange={onChange}
          hasError={hasError}
          className={`${Icon ? "pl-12" : ""} ${
            readOnly ? "bg-muted cursor-not-allowed text-muted-foreground" : ""
          }`}
        />
      </div>
    </div>
  );
};

export default InputAreaTwo;
