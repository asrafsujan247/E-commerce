import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PenLine, CheckCircle2 } from "lucide-react";

import ReviewModal from "@components/modal/ReviewModal";
import Pagination from "@components/pagination/Pagination";
import ImageWithFallback from "@components/common/ImageWithFallBack";

interface ReviewItem {
  _id?: string;
  image?: string;
  title?: string;
  [key: string]: unknown;
}

interface ReviewsData {
  notReviewed?: ReviewItem[];
  totalNotReviewed?: number;
}

interface NeedToReviewProps {
  reviews?: ReviewsData;
  error?: string;
}

const NeedToReview: React.FC<NeedToReviewProps> = ({ reviews, error }) => {
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState<ReviewItem | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openModal = (product: ReviewItem) => {
    setSelectedProduct(product);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedProduct(null);
  };

  const handleChangePage = (page: number) => {
    navigate(`?page=${page}`);
  };

  return (
    <div className="">
      {error ? (
        <h2 className="text-xl text-center my-10 mx-auto w-11/12 text-red-400">
          {error}
        </h2>
      ) : reviews?.notReviewed?.length === 0 ? (
        <div className="py-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <CheckCircle2 className="h-7 w-7 text-muted-foreground" />
          </div>
          <h4 className="font-medium text-foreground">All caught up</h4>
          <p className="mt-1.5 text-sm text-muted-foreground">
            You have no products left to review.
          </p>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {reviews?.notReviewed?.map((item, index) => (
              <div
                key={index + 1}
                className="group flex items-center gap-3 rounded-xl border border-border bg-card p-3 transition-all hover:border-primary/30 hover:shadow-sm"
              >
                <ImageWithFallback
                  width="80"
                  height="80"
                  alt="product"
                  src={item?.image}
                  className="size-16 flex-none rounded-lg object-cover sm:size-20"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="mb-2 line-clamp-2 text-sm font-medium text-foreground">
                    {item?.title}
                  </h3>
                  <button
                    onClick={() => openModal(item)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    <PenLine className="h-3.5 w-3.5" />
                    Write Review
                  </button>
                </div>
              </div>
            ))}
          </div>
          {reviews?.totalNotReviewed !== undefined && reviews.totalNotReviewed > 16 && (
            <Pagination
              resultsPerPage={16}
              onChange={handleChangePage}
              label="Product Page Navigation"
              totalResults={reviews.totalNotReviewed}
            />
          )}
        </div>
      )}

      {selectedProduct && (
        <ReviewModal
          isOpen={isOpen}
          onClose={closeModal}
          product={selectedProduct as { _id: string; title?: string; review?: { _id?: string; rating?: number; comment?: string } }}
          title={selectedProduct?.title ?? ""}
        />
      )}
    </div>
  );
};

export default NeedToReview;
