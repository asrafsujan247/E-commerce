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
    <div className="md:px-3 px-1 py-4 card border border-border bg-background rounded-md">
      <label className="cursor-pointer label">
        <div className="flex item-center justify-between">
          <div className="flex items-center">
            <span className="text-xl md:mr-3 mr-1 text-muted-foreground">
              <Icon />
            </span>
            <h6 className="font-medium text-sm text-muted-foreground">{value}</h6>
          </div>
          <input
            onClick={() => setShowCard(value === "Card" ? true : false)}
            {...(register as UseFormRegister<FieldValues>)("paymentMethod", {
              required: "Payment Method is required!",
            })}
            type="radio"
            value={value}
            name="paymentMethod"
            className="form-radio outline-none focus:ring-0 text-primary"
          />
        </div>
      </label>
    </div>
  );
}

export default InputPayment;
