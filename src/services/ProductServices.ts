import type { Product, Review } from "@appTypes/index";
import allProductsRaw from "@localdata/products.json";

function normalize(p: Record<string, unknown>): Product {
  const product = p as Product;
  if (!product.prices) {
    (product as Record<string, unknown>).prices = {
      price: product.price as number,
      originalPrice: product.originalPrice as number | undefined,
      discount: product.discount as number | undefined,
    };
  }
  return product;
}

const allProducts = (allProductsRaw as Record<string, unknown>[]).map(normalize);

interface GetShowingStoreProductsParams {
  category?: string;
  title?: string;
  slug?: string;
}

interface StoreProductsResult {
  products: Product[];
  popularProducts: Product[];
  usedProducts: Product[];
  relatedProducts: Product[];
  reviews: Review[];
  error: string | null;
}

function matchCategory(product: Product, categorySlug: string): boolean {
  if (!categorySlug) return true;
  const cat = product.category;
  if (!cat) return false;
  if (typeof cat === "string") {
    return cat === categorySlug;
  }
  const c = cat as { _id?: string; slug?: string; name?: string; parentId?: string; parentName?: string };
  // Direct _id match (CategoryNavigateButton passes _id as query param)
  if (c._id === categorySlug) return true;
  // Child category: product belongs to a child whose parentId matches the clicked parent
  if (c.parentId === categorySlug) return true;
  // Slug match
  if (c.slug === categorySlug) return true;
  // Parent name slug match (e.g. parentName "Fish & Meat" → "fish-meat")
  if (c.parentName) {
    const parentSlug = c.parentName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    if (parentSlug === categorySlug) return true;
  }
  // Slug-to-name regex: "fish-meat" → /^fish[^a-z0-9]+meat/i
  const pattern = categorySlug.replace(/-/g, "[^a-z0-9]+");
  const regex = new RegExp(`^${pattern}`, "i");
  return regex.test(c.name ?? "");
}

const getShowingStoreProducts = async ({
  category = "",
  title = "",
  slug = "",
}: GetShowingStoreProductsParams): Promise<StoreProductsResult> => {
  const popularProducts = allProducts
    .filter((p) => ((p as unknown as Record<string, number>).sales ?? 0) > 0)
    .sort((a, b) => ((b as unknown as Record<string, number>).sales ?? 0) - ((a as unknown as Record<string, number>).sales ?? 0));
  const usedProducts = allProducts.filter((p) => {
    const prices = p.prices as { discount?: number } | undefined;
    return (prices?.discount ?? (p.discount as number | undefined) ?? 0) > 0;
  });

  if (slug) {
    const product = allProducts.find((p) => p.slug === slug);
    const relatedProducts = product
      ? allProducts.filter(
          (p) =>
            p._id !== product._id &&
            typeof product.category === "object" &&
            product.category !== null &&
            typeof p.category === "object" &&
            p.category !== null &&
            (p.category as { _id?: string })._id === (product.category as { _id?: string })._id,
        )
      : [];
    return {
      products: product ? [product] : [],
      relatedProducts,
      popularProducts,
      usedProducts,
      reviews: [],
      error: null,
    };
  }

  let filtered = allProducts;

  if (category) {
    filtered = filtered.filter((p) => matchCategory(p, category));
  }

  if (title) {
    const lower = title.toLowerCase();
    filtered = filtered.filter((p) => {
      const t = typeof p.title === "string" ? p.title : Object.values(p.title ?? {}).join(" ");
      return t.toLowerCase().includes(lower);
    });
  }

  return {
    products: filtered,
    relatedProducts: [],
    popularProducts,
    usedProducts,
    reviews: [],
    error: null,
  };
};

export { getShowingStoreProducts };
