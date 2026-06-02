import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSidebarStore } from "@stores/useSidebarStore";
import useAddToCart from "@hooks/useAddToCart";
import { notifyError } from "@utils/toast";
import useUtilsFunction from "@hooks/useUtilsFunction";
import type { Product, ProductAttribute, GlobalSetting } from "@appTypes/index";

// ===================== Types =====================

interface ProductCampaignInfo {
  campaignPrice: number;
  campaignOriginalPrice?: number;
  campaignRemainingStock: number;
  campaignId: string;
  inCampaign?: boolean;
  [key: string]: unknown;
}

interface UseProductActionOptions {
  product: Product & {
    campaign?: ProductCampaignInfo;
    prices?: { minPrice?: number; maxPrice?: number; originalPrice?: number; discount?: number };
    stock?: number;
    image?: string | string[];
    category?: { name?: Record<string, string> };
  };
  attributes?: ProductAttribute[];
  globalSetting?: GlobalSetting | null;
  campaignInfo?: ProductCampaignInfo | null;
  onCloseModal?: () => void;
  withRouter?: boolean;
}

interface UseProductActionReturn {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  price: number;
  stock: number;
  discount: number;
  isReadMore: boolean;
  setIsReadMore: React.Dispatch<React.SetStateAction<boolean>>;
  selectedImage: string;
  originalPrice: number;
  setSelectedImage: React.Dispatch<React.SetStateAction<string>>;
  selectVariant: Record<string, unknown>;
  setSelectVariant: React.Dispatch<React.SetStateAction<Record<string, unknown>>>;
  selectVa: Record<string, unknown>;
  setSelectVa: React.Dispatch<React.SetStateAction<Record<string, unknown>>>;
  variantTitle: ProductAttribute[];
  variants: Array<Record<string, unknown>>;
  currency: string;
  category_name: string;
  category_display_name: string;
  isInCampaign: boolean;
  campaign: ProductCampaignInfo | null;
  handleAddToCart: (productOrQuantity?: number) => void;
  handleMoreInfo: (slug: string) => void;
}

// ===================== Hook =====================

export default function useProductAction({
  product,
  attributes,
  globalSetting,
  campaignInfo = null,
  onCloseModal,
  withRouter = false,
}: UseProductActionOptions): UseProductActionReturn {
  const navigate = useNavigate();
  const { setIsLoading, isLoading } = useSidebarStore();
  const { handleAddItem } = useAddToCart();
  const { getNumber } = useUtilsFunction();

  const [value, setValue] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [originalPrice, setOriginalPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [selectVariant, setSelectVariant] = useState<Record<string, unknown>>({});
  const [selectVa, setSelectVa] = useState<Record<string, unknown>>({});
  const [variantTitle, setVariantTitle] = useState<ProductAttribute[]>([]);
  const [variants, setVariants] = useState<Array<Record<string, unknown>>>([]);
  const [isReadMore, setIsReadMore] = useState<boolean>(false);

  const currency = globalSetting?.default_currency ?? "$";

  const campaign = campaignInfo ?? product?.campaign ?? null;
  const isInCampaign = !!(campaign && campaign.inCampaign !== false);

  useEffect(() => {
    const productVariants = product?.variants as
      | Array<Record<string, unknown>>
      | undefined;

    if (value) {
      const result =
        productVariants?.filter((variant) =>
          Object.keys(selectVa).every((k) => selectVa[k] === variant[k])
        ) ?? [];

      const res = result.map(
        ({
          originalPrice: _op,
          price: _p,
          discount: _d,
          quantity: _q,
          barcode: _b,
          sku: _s,
          productId: _pid,
          image: _img,
          ...rest
        }) => rest
      );

      const filterKey = Object.keys(Object.assign({}, ...res));
      const selectVar = filterKey.reduce<Record<string, unknown>>(
        (obj, key) => ({ ...obj, [key]: selectVariant[key] }),
        {}
      );
      const newObj = Object.entries(selectVar).reduce<Record<string, unknown>>(
        (a, [k, v]) => (v ? { ...a, [k]: v } : a),
        {}
      );

      const result2 = result.find((v) =>
        Object.keys(newObj).every((k) => newObj[k] === v[k])
      );

      if (result.length <= 0 || result2 === undefined) {
        setStock(0);
        return;
      }

      setVariants(result);
      setSelectVariant(result2);
      setSelectVa(result2);
      setSelectedImage((result2?.image as string) ?? "");

      if (isInCampaign && campaign) {
        setStock(
          Math.min(
            (result2?.quantity as number) ?? 0,
            campaign.campaignRemainingStock
          )
        );
        const cpPrice = getNumber(campaign.campaignPrice);
        const cpOriginal = getNumber(
          campaign.campaignOriginalPrice ?? (result2?.originalPrice as number)
        );
        const discountPct =
          cpOriginal > 0
            ? getNumber(((cpOriginal - cpPrice) / cpOriginal) * 100)
            : 0;
        setDiscount(discountPct);
        setPrice(cpPrice);
        setOriginalPrice(cpOriginal);
      } else {
        setStock((result2?.quantity as number) ?? 0);
        const p = getNumber(result2?.price as number);
        const op = getNumber(result2?.originalPrice as number);
        setDiscount(getNumber(((op - p) / op) * 100));
        setPrice(p);
        setOriginalPrice(op);
      }
    } else if (Array.isArray(productVariants) && productVariants.length > 0) {
      const result = productVariants.filter((variant) =>
        Object.keys(selectVa).every((k) => selectVa[k] === variant[k])
      );

      setVariants(result);
      setSelectVariant(productVariants[0]);
      setSelectVa(productVariants[0]);
      setSelectedImage((productVariants[0]?.image as string) ?? "");

      if (isInCampaign && campaign) {
        setStock(
          Math.min(
            (productVariants[0]?.quantity as number) ?? 0,
            campaign.campaignRemainingStock
          )
        );
        const cpPrice = getNumber(campaign.campaignPrice);
        const cpOriginal = getNumber(
          campaign.campaignOriginalPrice ??
            (productVariants[0]?.originalPrice as number)
        );
        const discountPct =
          cpOriginal > 0
            ? getNumber(((cpOriginal - cpPrice) / cpOriginal) * 100)
            : 0;
        setDiscount(discountPct);
        setPrice(cpPrice);
        setOriginalPrice(cpOriginal);
      } else {
        setStock((productVariants[0]?.quantity as number) ?? 0);
        const p = getNumber(productVariants[0]?.price as number);
        const op = getNumber(productVariants[0]?.originalPrice as number);
        setDiscount(getNumber(((op - p) / op) * 100));
        setPrice(p);
        setOriginalPrice(op);
      }
    } else {
      if (isInCampaign && campaign) {
        setStock(campaign.campaignRemainingStock);
        setSelectedImage(
          (product?.image as string[] | undefined)?.[0] ?? ""
        );
        const cpPrice = getNumber(campaign.campaignPrice);
        const cpOriginal = getNumber(
          campaign.campaignOriginalPrice ?? product?.prices?.originalPrice
        );
        const discountPct =
          cpOriginal > 0
            ? getNumber(((cpOriginal - cpPrice) / cpOriginal) * 100)
            : 0;
        setDiscount(discountPct);
        setPrice(cpPrice);
        setOriginalPrice(cpOriginal);
      } else {
        setStock(product?.stock ?? 0);
        setSelectedImage(
          (product?.image as string[] | undefined)?.[0] ?? ""
        );
        const p = getNumber(product?.prices?.minPrice);
        const op = getNumber(product?.prices?.originalPrice);
        setDiscount(getNumber(((op - p) / op) * 100));
        setPrice(p);
        setOriginalPrice(op);
      }
    }
  }, [
    product?.prices?.discount,
    product?.prices?.originalPrice,
    product?.prices?.minPrice,
    product?.stock,
    product?.variants,
    selectVa,
    selectVariant,
    value,
  ]);

  useEffect(() => {
    const productVariants = product?.variants as
      | Array<Record<string, unknown>>
      | undefined;
    if (!productVariants || !attributes) return;
    const res = Object.keys(Object.assign({}, ...productVariants));
    const varTitle = attributes?.filter((att) => res.includes(att?._id));
    setVariantTitle(varTitle?.sort() ?? []);
  }, [variants, attributes, product?.variants]);

  const handleAddToCart = (productOrQuantity?: number): void => {
    const quantity =
      typeof productOrQuantity === "number" ? productOrQuantity : 1;

    const productVariants = product?.variants as
      | Array<Record<string, unknown>>
      | undefined;

    if (
      productVariants?.length === 1 &&
      (productVariants[0].quantity as number) < 1
    )
      return notifyError("Insufficient stock");
    if (stock <= 0) return notifyError("Insufficient stock");

    const selectedVariantName = variantTitle
      ?.map((att) =>
        (
          att?.variants as unknown as
            | Array<{ _id?: string; name?: unknown }>
            | undefined
        )?.find(
          (v: { _id?: string; name?: unknown }) =>
            v._id === (selectVariant[att._id] as string)
        )
      )
      .map((el) => String(el?.name ?? ''));

    if (
      productVariants?.map(
        (variant) =>
          Object.entries(variant).sort().toString() ===
          Object.entries(selectVariant).sort().toString()
      )
    ) {
      const {
        variants: _variants,
        categories: _categories,
        description: _description,
        campaign: _camp,
        ...updatedProduct
      } = product as Product & {
        variants?: unknown;
        categories?: unknown;
        description?: unknown;
        campaign?: unknown;
        prices?: { price?: number; originalPrice?: number };
      };

      const newItem = {
        ...updatedProduct,
        id:
          !productVariants || productVariants.length <= 0
            ? product._id
            : product._id +
              "-" +
              variantTitle?.map((att) => selectVariant[att._id]).join("-"),
        title:
          !productVariants || productVariants.length <= 0
            ? String(product.title ?? '')
            : String(product.title ?? '') +
              "-" +
              selectedVariantName,
        image: selectedImage,
        variant: selectVariant ?? {},
        price: getNumber(price),
        originalPrice: getNumber(originalPrice),
        ...(isInCampaign && campaign
          ? {
              campaignId: campaign.campaignId,
              campaignPrice: campaign.campaignPrice,
              inCampaign: true,
              campaignRemainingStock: campaign.campaignRemainingStock,
            }
          : {}),
      };

      handleAddItem(newItem, quantity);
    } else {
      return notifyError("Please select all variant first!");
    }
  };

  const handleMoreInfo = (slug: string): void => {
    if (!withRouter) return;
    if (onCloseModal) onCloseModal();
    navigate(`/product/${slug}`);
    setIsLoading(!isLoading);
  };

  const category_display_name =
    String(
      product?.category?.name as Record<string, string>
     ?? '') ?? "";

  const category_name = category_display_name
    ?.toLowerCase()
    ?.replace(/[^A-Z0-9]+/gi, "-");

  return {
    value,
    setValue,
    price,
    stock,
    discount,
    isReadMore,
    setIsReadMore,
    selectedImage,
    originalPrice,
    setSelectedImage,
    selectVariant,
    setSelectVariant,
    selectVa,
    setSelectVa,
    variantTitle,
    variants,
    currency,
    category_name,
    category_display_name,
    isInCampaign,
    campaign,
    handleAddToCart,
    handleMoreInfo,
  };
}
