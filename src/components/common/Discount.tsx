import useUtilsFunction from "@hooks/useUtilsFunction";

interface DiscountCampaign {
  inCampaign?: boolean;
  campaignPrice?: number;
  campaignOriginalPrice?: number;
  [key: string]: unknown;
}

interface DiscountProduct {
  campaign?: unknown;
  isCombination?: boolean;
  variants?: Array<{
    price?: number;
    originalPrice?: number;
    [key: string]: unknown;
  }>;
  prices?: {
    price?: number;
    originalPrice?: number;
  };
  [key: string]: unknown;
}

interface DiscountProps {
  discount?: number;
  product?: DiscountProduct;
  slug?: string | boolean;
  modal?: boolean;
}

const Discount = ({ discount, product, slug, modal }: DiscountProps) => {
  const { getNumber } = useUtilsFunction();

  // Check if product has campaign data from backend enrichment
  const campaign = product?.campaign as DiscountCampaign | undefined;
  const isInCampaign = !!(campaign && campaign.inCampaign !== false);

  const price = isInCampaign
    ? getNumber(campaign?.campaignPrice)
    : product?.isCombination
      ? getNumber(product?.variants?.[0]?.price)
      : getNumber(product?.prices?.price);

  const originalPrice = isInCampaign
    ? getNumber(campaign?.campaignOriginalPrice)
    : product?.isCombination
      ? getNumber(product?.variants?.[0]?.originalPrice)
      : getNumber(product?.prices?.originalPrice);

  const discountPercentage =
    originalPrice > 0
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  // Campaign items get a distinct orange/amber badge style
  const campaignBadgeClass = modal
    ? "absolute z-10 left-4 top-4 inline-flex items-center rounded-full bg-orange-50 px-2 py-1 text-xs font-semibold text-orange-700 ring-1 ring-orange-500/20 ring-inset"
    : slug
      ? "inline-flex items-center rounded-full bg-orange-50 px-2 py-1 text-xs font-semibold text-orange-700 ring-1 ring-orange-500/20 ring-inset"
      : "absolute z-10 right-3 top-3 inline-flex items-center rounded-full bg-orange-50 px-2 py-1 text-xs font-semibold text-orange-700 ring-1 ring-orange-500/20 ring-inset";

  // Regular discount badge style
  const regularBadgeClass = modal
    ? "absolute z-10 left-4 top-4 inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-red-600/10 ring-inset"
    : slug
      ? "inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-red-600/10 ring-inset"
      : "absolute z-10 right-3 top-3 inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-600 ring-1 ring-red-600/10 ring-inset";

  // Use the explicitly-passed discount prop first
  if ((discount ?? 0) > 1) {
    return (
      <span className={isInCampaign ? campaignBadgeClass : regularBadgeClass}>
        {discount}% Off
      </span>
    );
  }

  // Fallback to calculated discount
  if (discount === undefined && discountPercentage > 1) {
    return (
      <span className={isInCampaign ? campaignBadgeClass : regularBadgeClass}>
        {discountPercentage}% Off
      </span>
    );
  }

  return null;
};

export default Discount;
