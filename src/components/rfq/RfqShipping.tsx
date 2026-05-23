import FormRow from "./FormRow";
import SelectField from "./SelectField";
import { SHIPPING_METHODS, PAYMENT_TERMS } from "@lib/rfqConstants";
import type { FormState } from "@appTypes/rfq";

interface RfqShippingProps {
  form: FormState;
  onChange: (field: keyof FormState, value: string) => void;
}

const RfqShipping = ({ form, onChange }: RfqShippingProps) => (
  <div className="bg-white border border-gray-200 rounded p-5 sm:p-6 mt-4">
    <h2 className="text-sm font-bold text-gray-900 mb-5">Shipping and Payment</h2>

    <div className="space-y-4">

      {/* Shipping Method */}
      <FormRow label="Shipping Method" required>
        <SelectField
          value={form.shippingMethod}
          onChange={(e) => onChange("shippingMethod", e.target.value)}
        >
          {SHIPPING_METHODS.map((s) => <option key={s}>{s}</option>)}
        </SelectField>
      </FormRow>

      {/* Destination Port */}
      <FormRow label="Destination Port">
        <input
          type="text"
          value={form.destinationPort}
          onChange={(e) => onChange("destinationPort", e.target.value)}
          className="w-full sm:w-48 border border-gray-300 rounded px-3 py-1.5 text-sm text-gray-700 bg-white focus:outline-none focus:border-blue-400"
        />
      </FormRow>

      {/* Lead Time */}
      <FormRow label="Lead Time">
        <div className="flex items-center gap-2 flex-wrap text-sm text-gray-700">
          <span>Ship in</span>
          <input
            type="number"
            value={form.leadTime}
            onChange={(e) => onChange("leadTime", e.target.value)}
            min="1"
            className="w-20 border border-gray-300 rounded px-2 py-1.5 text-sm text-gray-700 bg-white focus:outline-none focus:border-blue-400"
          />
          <span>day(s) after supplier receives the initial payment.</span>
        </div>
      </FormRow>

      {/* Payment Terms */}
      <FormRow label="Payment Terms" required>
        <SelectField
          value={form.paymentTerms}
          onChange={(e) => onChange("paymentTerms", e.target.value)}
        >
          {PAYMENT_TERMS.map((p) => <option key={p}>{p}</option>)}
        </SelectField>
      </FormRow>

    </div>

    {/* Submit button */}
    <div className="mt-6 sm:pl-37">
      <button
        type="submit"
        className="bg-red-500 hover:bg-red-600 active:bg-red-700 text-white text-sm font-semibold px-6 py-2 rounded transition-colors"
      >
        Submit
      </button>
    </div>
  </div>
);

export default RfqShipping;
