import type { FormState } from "@appTypes/rfq";

export const UNITS = [
  "Piece(s)", "Meter(s)", "Kilogram(s)", "Set(s)", "Pair(s)",
  "Ton(s)", "Liter(s)", "Box(es)", "Carton(s)", "Roll(s)",
];

export const TRADE_TERMS = ["FOB", "CIF", "EXW", "DDP", "DAP", "FCA", "CFR"];

export const CURRENCIES = ["USD", "EUR", "GBP", "CNY", "AED", "SGD"];

export const SHIPPING_METHODS = [
  "Sea freight", "Air freight", "Express delivery", "Land transport", "Rail freight",
];

export const PAYMENT_TERMS = ["T/T", "L/C", "D/P", "Western Union", "PayPal", "MoneyGram"];

export const MAX_BUDGET_OPTIONS = [
  "Less than $1,000", "$1,000 - $5,000", "$5,000 - $10,000",
  "$10,000 - $50,000", "$50,000 - $100,000", "More than $100,000",
];

export const REQUIRED_FIELDS: (keyof FormState)[] = [
  "productName", "quantity", "maxBudget", "details",
];

export const FIELD_LABELS: Partial<Record<keyof FormState, string>> = {
  productName: "Product Name",
  quantity: "Purchase Quantity",
  maxBudget: "Max Budget",
  details: "Details",
};

export const ALL_SCORED_FIELDS: (keyof FormState)[] = [
  "productName", "category", "quantity", "tradeTerms",
  "targetPrice", "maxBudget", "details",
  "shippingMethod", "destinationPort", "leadTime", "paymentTerms",
];

export const initialForm: FormState = {
  productName: "",
  category: "",
  categoryId: "",
  quantity: "",
  unit: "Piece(s)",
  tradeTerms: "FOB",
  targetPrice: "",
  currency: "USD",
  maxBudget: "",
  details: "",
  shippingMethod: "Sea freight",
  destinationPort: "",
  leadTime: "",
  paymentTerms: "T/T",
};
