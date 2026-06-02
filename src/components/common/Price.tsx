import useUtilsFunction from "@hooks/useUtilsFunction";

interface PriceProduct {
  isCombination?: boolean;
  prices?: {
    minPrice?: number;
    maxPrice?: number;
    originalPrice?: number;
  };
  [key: string]: unknown;
}

interface Campaign {
  inCampaign?: boolean;
  campaignPrice?: number;
  campaignOriginalPrice?: number;
  [key: string]: unknown;
}

interface PriceProps {
  product?: PriceProduct;
  price?: number;
  card?: boolean;
  originalPrice?: number;
  currency?: string;
  campaign?: Campaign;
}

const Price = ({ product, price, card, originalPrice, currency, campaign }: PriceProps) => {
  const { formatPrice } = useUtilsFunction();

  // When campaign data is present, always use the passed price/originalPrice directly
  const isCombo = product?.isCombination;
  const finalPrice = campaign
    ? price
    : isCombo
      ? price
      : product?.prices?.minPrice;
  const finalOriginal = campaign ? originalPrice : originalPrice;
  const discountAmount =
    (finalOriginal ?? 0) > (finalPrice ?? 0) ? (finalOriginal ?? 0) - (finalPrice ?? 0) : 0;

  return (
    <>
      <div className="product-price font-bold">
        <span
          className={`${
            card
              ? "inline-block text-base text-foreground"
              : "inline-block text-xl"
          }`}
        >
          {formatPrice(finalPrice ?? 0, currency)}
        </span>
        {discountAmount > 0 && (
          <span
            className={
              card
                ? "sm:text-sm font-normal text-base text-muted-foreground ml-1"
                : "text-sm font-normal text-muted-foreground ml-1"
            }
          >
            <del> {formatPrice(finalOriginal ?? 0, currency)}</del>
          </span>
        )}
      </div>

      {/* {discountAmount > 0 && !card && (
        <p className="text-xs text-primary">
          Save {formatPrice(discountAmount, currency)} ({discountPercent}% off)
        </p>
      )} */}
    </>
  );
};

export default Price;
