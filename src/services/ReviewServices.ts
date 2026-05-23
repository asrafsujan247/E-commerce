import type { Review } from "@appTypes/index";

interface ReviewResult {
  reviews?: Review[];
  review?: Review | null;
  error: string | null;
  loading: boolean;
}

interface CartItem {
  _id?: string;
  title?: unknown;
  image?: string | string[];
  [key: string]: unknown;
}

interface StoredOrder {
  cart?: CartItem[];
}

function getFirstImage(image: string | string[] | undefined): string {
  if (Array.isArray(image)) return image[0] ?? "";
  return image ?? "";
}

function getTitleString(title: unknown): string {
  if (typeof title === "string") return title;
  if (title && typeof title === "object") {
    const t = title as Record<string, string>;
    return t.en ?? Object.values(t)[0] ?? "";
  }
  return "";
}

const getReviewsByProduct = async (
  _productId: string,
  _token: string,
): Promise<ReviewResult> => {
  return { reviews: [], error: null, loading: false };
};

interface PaginatedParams {
  page: number;
  limit: number;
}

const getUserPurchasedProducts = async (
  params: PaginatedParams,
  _token: string,
): Promise<ReviewResult> => {
  try {
    const orders: StoredOrder[] = JSON.parse(localStorage.getItem("kachabazar_orders") ?? "[]");
    const seen = new Set<string>();
    const notReviewed: CartItem[] = [];
    for (const order of orders) {
      for (const item of order.cart ?? []) {
        const id = item._id ?? "";
        if (id && !seen.has(id)) {
          seen.add(id);
          notReviewed.push({
            _id: id,
            image: getFirstImage(item.image as string | string[] | undefined),
            title: getTitleString(item.title),
          });
        }
      }
    }
    const { page, limit } = params;
    const start = (page - 1) * limit;
    const paginated = notReviewed.slice(start, start + limit);
    const result = { notReviewed: paginated, totalNotReviewed: notReviewed.length };
    return { reviews: result as unknown as Review[], error: null, loading: false };
  } catch {
    return { reviews: [] as unknown as Review[], error: null, loading: false };
  }
};

const addReview = async (
  _reviewData: unknown,
  _token: string,
): Promise<ReviewResult> => {
  return { review: null, error: null, loading: false };
};

const updateReview = async (
  _reviewData: unknown,
  _token: string,
): Promise<ReviewResult> => {
  return { review: null, error: null, loading: false };
};

const deleteReview = async (
  _reviewId: string,
  _token: string,
): Promise<ReviewResult> => {
  return { review: null, error: null, loading: false };
};

export {
  addReview,
  updateReview,
  deleteReview,
  getReviewsByProduct,
  getUserPurchasedProducts,
};
