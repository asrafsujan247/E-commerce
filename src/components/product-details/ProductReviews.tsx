import { useState } from "react";
import { FiStar, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Dialog, DialogPanel } from "@headlessui/react";
import { X } from "lucide-react";

interface ReviewUser {
  name?: string;
  image?: string;
}

interface ReviewItem {
  _id: string;
  user?: ReviewUser;
  rating: number;
  comment: string;
  createdAt?: string;
  images: string[];
}

interface ProductReviewsProps {
  reviews?: ReviewItem[];
}

function StarRow({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  const cls = size === "md" ? "w-4 h-4" : "w-3.5 h-3.5";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <FiStar
          key={s}
          className={`${cls} ${s <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"}`}
        />
      ))}
    </div>
  );
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ reviews = [] }) => {
  const [zoomImages, setZoomImages] = useState<string[] | null>(null);
  const [zoomIdx, setZoomIdx] = useState(0);

  if (reviews.length === 0) {
    return (
      <div className="py-10 text-center text-muted-foreground text-sm">
        No reviews yet.
      </div>
    );
  }

  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  const counts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  const openZoom = (imgs: string[], idx: number) => {
    setZoomImages(imgs);
    setZoomIdx(idx);
  };

  return (
    <div className="pt-6">
      {/* ── Summary ── */}
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 p-5 rounded-xl border border-border bg-muted/30 mb-6">
        {/* Score */}
        <div className="flex flex-col items-center justify-center sm:min-w-25">
          <span className="text-5xl font-bold text-foreground leading-none">
            {avg.toFixed(1)}
          </span>
          <StarRow rating={Math.round(avg)} size="md" />
          <span className="text-xs text-muted-foreground mt-1">
            {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
          </span>
        </div>

        {/* Distribution bars */}
        <div className="flex-1 flex flex-col justify-center gap-1.5">
          {counts.map(({ star, count }) => {
            const pct = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;
            return (
              <div key={star} className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground w-4 text-right shrink-0">
                  {star}
                </span>
                <FiStar className="w-3 h-3 text-yellow-400 fill-yellow-400 shrink-0" />
                <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
                  <div
                    className="h-full rounded-full bg-yellow-400 transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground w-7 shrink-0">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Review cards ── */}
      <div className="flex flex-col divide-y divide-border">
        {reviews.map((review) => {
          const initials = (review.user?.name ?? "U")
            .split(" ")
            .map((w) => w[0])
            .slice(0, 2)
            .join("")
            .toUpperCase();

          const dateStr = review.createdAt
            ? new Date(review.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "";

          const validImages = (review.images ?? []).filter(Boolean);

          return (
            <div key={review._id} className="py-5 flex gap-4">
              {/* Avatar */}
              <div className="shrink-0">
                {review.user?.image?.startsWith("http") ? (
                  <img
                    src={review.user.image}
                    alt={review.user?.name ?? "User"}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-border"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary/10 ring-2 ring-border flex items-center justify-center text-sm font-semibold text-primary">
                    {initials}
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="flex-1 min-w-0">
                {/* Name + date row */}
                <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5 mb-1">
                  <span className="text-sm font-semibold text-foreground">
                    {review.user?.name ?? "Anonymous"}
                  </span>
                  <span className="text-xs text-muted-foreground">{dateStr}</span>
                </div>

                {/* Stars */}
                <StarRow rating={review.rating} />

                {/* Comment */}
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {review.comment}
                </p>

                {/* Review images */}
                {validImages.length > 0 && (
                  <div className="flex gap-2 flex-wrap mt-3">
                    {validImages.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => openZoom(validImages, idx)}
                        className="w-16 h-16 rounded-lg overflow-hidden border border-border hover:border-primary transition-colors shrink-0"
                      >
                        <img
                          src={img}
                          alt="review"
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Image zoom modal ── */}
      <Dialog
        open={!!zoomImages}
        onClose={() => setZoomImages(null)}
        className="fixed inset-0 z-50"
      >
        <div className="flex items-center justify-center min-h-screen bg-black/80 p-4">
          <DialogPanel className="relative max-w-2xl w-full bg-background rounded-xl p-4">
            <button
              onClick={() => setZoomImages(null)}
              className="absolute top-3 right-3 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-md z-10"
            >
              <X size={16} />
            </button>
            {zoomImages && (
              <div className="relative flex items-center justify-center">
                <button
                  onClick={() => setZoomIdx((p) => (p - 1 + zoomImages.length) % zoomImages.length)}
                  className="absolute left-0 p-2 bg-muted hover:bg-muted/80 rounded-full z-10 shadow"
                >
                  <FiChevronLeft size={20} />
                </button>
                <img
                  src={zoomImages[zoomIdx]}
                  alt="review zoom"
                  className="rounded-lg object-contain max-w-full max-h-[70vh]"
                />
                <button
                  onClick={() => setZoomIdx((p) => (p + 1) % zoomImages.length)}
                  className="absolute right-0 p-2 bg-muted hover:bg-muted/80 rounded-full z-10 shadow"
                >
                  <FiChevronRight size={20} />
                </button>
              </div>
            )}
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
};

export default ProductReviews;
