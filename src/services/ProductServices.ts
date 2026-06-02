import type { Product, Review } from "@appTypes/index";
import allProductsRaw from "@localdata/products.json";
import categoriesData from "@localdata/categories.json";

// Build slug → Set<all descendant IDs including self> so any level of the
// hierarchy resolves correctly when a URL slug is searched.
const slugToIds = new Map<string, Set<string>>();
(categoriesData as any[]).forEach((dept) => {
  const deptIds = new Set<string>([dept._id]);
  (dept.categories ?? []).forEach((cat: any) => {
    const catIds = new Set<string>([cat._id]);
    (cat.children ?? []).forEach((sub: any) => {
      catIds.add(sub._id);
      deptIds.add(sub._id);
      slugToIds.set(sub.slug, new Set([sub._id]));
    });
    deptIds.add(cat._id);
    slugToIds.set(cat.slug, catIds);
  });
  slugToIds.set(dept.slug, deptIds);
});

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

  const productCatIds: string[] = ((product as any).categories ?? []).map((c: any) => c._id);

  // Primary: check the product's categories array against the slug→ID map.
  // This handles dept, cat, and subcat slugs at all hierarchy levels.
  const validIds = slugToIds.get(categorySlug);
  if (validIds && validIds.size > 0) {
    if (productCatIds.some((id) => validIds.has(id))) return true;
  }

  // Secondary: categorySlug may be a raw ObjectId (from ?_id= navigation).
  // Check directly against the product's categories array.
  if (productCatIds.includes(categorySlug)) return true;

  // Fallback: legacy field-level checks on product.category object
  const cat = product.category;
  if (!cat) return false;
  if (typeof cat === "string") return cat === categorySlug;
  const c = cat as { _id?: string; slug?: string; name?: string; parentId?: string; parentName?: string };
  if (c._id === categorySlug) return true;
  if (c.parentId === categorySlug) return true;
  if (c.slug === categorySlug) return true;
  if (c.parentName) {
    const parentSlug = c.parentName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    if (parentSlug === categorySlug) return true;
  }
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
      reviews: ((product as any)?.reviews ?? []) as Review[],
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
