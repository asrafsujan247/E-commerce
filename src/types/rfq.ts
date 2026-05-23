export interface SubCategory {
  _id: string;
  name: string;
  slug: string;
  parentId: string;
  parentName: string;
}

export interface RfqCategory {
  _id: string;
  name: string;
  slug: string;
  children: SubCategory[];
  departmentId: string;
  departmentName: string;
}

export interface Department {
  _id: string;
  name: string;
  slug: string;
  categories: RfqCategory[];
}

export interface FormState {
  productName: string;
  category: string;
  categoryId: string;
  quantity: string;
  unit: string;
  tradeTerms: string;
  targetPrice: string;
  currency: string;
  maxBudget: string;
  details: string;
  shippingMethod: string;
  destinationPort: string;
  leadTime: string;
  paymentTerms: string;
}
