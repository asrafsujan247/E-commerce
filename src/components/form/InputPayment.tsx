import React from "react";
import { UseFormRegister, FieldValues } from "react-hook-form";

interface InputPaymentProps<T extends FieldValues> {
  Icon: React.ComponentType;
  name: string;
  value: string;
  register: UseFormRegister<T>;
  setShowCard: (show: boolean) => void;
}

function InputPayment<T extends FieldValues>({
  Icon,
  name,
  value,
  register,
  setShowCard,
}: InputPaymentProps<T>) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3.5 transition-all hover:border-primary/40 has-checked:border-primary has-checked:bg-primary/5 has-checked:ring-1 has-checked:ring-primary/20">
      <div className="flex items-center gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-lg text-primary">
          <Icon />
        </span>
        <h6 className="text-sm font-semibold text-foreground">{value}</h6>
      </div>
      <input
        onClick={() => setShowCard(value === "Card" ? true : false)}
        {...(register as UseFormRegister<FieldValues>)("paymentMethod", {
          required: "Payment Method is required!",
        })}
        type="radio"
        value={value}
        name="paymentMethod"
        className="size-4 shrink-0 accent-primary outline-none focus:ring-0"
      />
    </label>
  );
}

export default InputPayment;
