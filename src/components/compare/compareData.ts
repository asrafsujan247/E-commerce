// Mock data powering the product comparison page.
// Each product fills the same set of attributes so the comparison table can
// render them side by side. Swap `image` for real assets when wiring to an API.

export interface SpecItem {
  label: string;
  value: string;
}

export interface CompareProduct {
  id: string;
  title: string;
  slug: string;
  image: string;
  /** Label shown next to the contact radio under the product card. */
  contactLabel: string;

  // ── Transaction Info ──────────────────────────────────────────────
  price: string;
  minOrder: string;
  tradeTerms: string;
  paymentTerms: string;

  // ── Quality Control ───────────────────────────────────────────────
  productCertification: string;
  managementSystemCertification: string;

  // ── Trade Capacity ────────────────────────────────────────────────
  exportMarkets: string;
  annualExportRevenue: string;
  businessModel: string;
  leadTimeOffSeason: string;
  leadTimePeakSeason: string;

  // ── Product Attributes ────────────────────────────────────────────
  specifications: SpecItem[];
  supplierName: string;
  supplierAudited: boolean;
}

export const compareProducts: CompareProduct[] = [
  {
    id: "p1",
    title:
      "2020 New Model Small Kids Foldable Folding Small Tricycle Trike Bt-15",
    slug: "kids-foldable-tricycle-trike-bt-15",
    image: "/placeholder.png",
    contactLabel: "Chat with Supplier",
    price: "US $ 10 / Piece",
    minOrder: "50 Pieces",
    tradeTerms: "FOB, CIF, CFR, EXW",
    paymentTerms: "LC, T/T, D/P, PayPal, Small-amount payment, Western Union",
    productCertification: "-",
    managementSystemCertification: "-",
    exportMarkets: "South America, Europe, Southeast Asia/ Mideast, Africa",
    annualExportRevenue: "-",
    businessModel: "ODM, OEM",
    leadTimeOffSeason: "one month",
    leadTimePeakSeason: "one month",
    specifications: [
      { label: "Age", value: "1-5years" },
      { label: "Color", value: "Pink, Blue, Red, Green" },
      { label: "Function", value: "Foldable" },
      { label: "Folded", value: "Unfolded" },
      { label: "Wheel Size", value: '12"' },
      { label: "Suitable for", value: "Boys, Girls" },
      { label: "Rim Material", value: "Steel" },
      { label: "Type", value: "Balance Bike" },
    ],
    supplierName: "Xingtai Jinqi Toys Co., Ltd.",
    supplierAudited: true,
  },
  {
    id: "p2",
    title: "Construction Mini Skid Steer Loader Trencher Accessories",
    slug: "construction-mini-skid-steer-loader-trencher",
    image: "/placeholder.png",
    contactLabel: "Leave a message",
    price: "US $ 1900-2300 / unit",
    minOrder: "1 unit",
    tradeTerms: "FOB, CIF, CFR, EXW",
    paymentTerms: "LC, T/T, D/P PayPal, Western Union, Small-amount payment",
    productCertification: "CE",
    managementSystemCertification: "-",
    exportMarkets: "North America, South America, Europe, Australia",
    annualExportRevenue: "-",
    businessModel: "Own Brand, ODM, OEM",
    leadTimeOffSeason: "1-3 Month(s)",
    leadTimePeakSeason: "1-3 Month(s)",
    specifications: [
      { label: "Condition", value: "New" },
      { label: "Rated Load", value: "340kgs" },
      { label: "Transmission", value: "Hydraulic" },
      { label: "Load and Unload Mode", value: "Front Discharge" },
      { label: "Walking Mode", value: "Crawler" },
      { label: "Type", value: "Small Loader" },
      { label: "Color", value: "Customized Support" },
    ],
    supplierName: "Taian Mountain Machinery Science and Technology Co., Ltd.",
    supplierAudited: true,
  },
];
