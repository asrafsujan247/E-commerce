import React from "react";
import { FiTruck } from "react-icons/fi";
import { UseFormRegister, FieldValues } from "react-hook-form";
import useUtilsFunction from "@hooks/useUtilsFunction";

interface InputShippingProps<T extends FieldValues> {
  value: number;
  name: string;
  register: UseFormRegister<T>;
  description?: string;
  handleShippingCost: (value: number) => void;
}

function InputShipping<T extends FieldValues>({
  value,
  name,
  register,
  description,
  handleShippingCost,
}: InputShippingProps<T>) {
  const { formatPrice } = useUtilsFunction();

  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-border bg-card p-3.5 transition-all hover:border-primary/40 has-checked:border-primary has-checked:bg-primary/5 has-checked:ring-1 has-checked:ring-primary/20">
      <div className="flex items-center gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-lg text-primary">
          <FiTruck />
        </span>
        <div>
          <h6 className="text-sm font-semibold text-foreground">{name}</h6>
          <p className="text-xs text-muted-foreground">
            {description}{" "}
            <span className="font-semibold text-foreground">
              {formatPrice(value)}
            </span>
          </p>
        </div>
      </div>
      <input
        onClick={() => handleShippingCost(value)}
        {...(register as UseFormRegister<FieldValues>)("shippingOption", {
          required: "Shipping Option is required!",
        })}
        name="shippingOption"
        type="radio"
        value={name}
        className="size-4 shrink-0 accent-primary outline-none focus:ring-0"
      />
    </label>
  );
}

export default InputShipping;
