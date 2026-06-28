import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PenLine, Star } from "lucide-react";

import ReviewModal from "@components/modal/ReviewModal";
import Rating from "@components/common/Rating";
import ImageWithFallback from "@components/common/ImageWithFallBack";
import Pagination from "@components/pagination/Pagination";

interface ReviewData {
  rating?: number;
}

interface ReviewedItem {
  _id?: string;
  image?: string;
  title?: string;
  review?: ReviewData;
  [key: string]: unknown;
}

interface ReviewsData {
  reviewed?: ReviewedItem[];
  totalReviewed?: number;
}

interface ReviewedProps {
  reviews?: ReviewsData;
  error?: string;
}

const Reviewed: React.FC<ReviewedProps> = ({ reviews, error }) => {
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState<ReviewedItem | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openModal = (product: ReviewedItem) => {
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
    <div>
      {error ? (
        <h2 className="text-xl text-center my-10 mx-auto w-11/12 text-red-400">
          {error}
        </h2>
      ) : reviews?.reviewed?.length === 0 ? (
        <div className="py-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Star className="h-7 w-7 text-muted-foreground" />
          </div>
          <h4 className="font-medium text-foreground">No reviews yet</h4>
          <p className="mt-1.5 text-sm text-muted-foreground">
            You haven't reviewed any products yet.
          </p>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {reviews?.reviewed?.map((item, index) => (
              <div
                key={index + 1}
                className="group flex flex-col items-center rounded-xl border border-border bg-card p-4 text-center transition-all hover:border-primary/30 hover:shadow-sm"
              >
                {/* Image */}
                <ImageWithFallback
                  width="80"
                  height="80"
                  alt="product"
                  src={item?.image}
                  className="size-20 flex-none rounded-lg object-cover"
                />

                {/* Title */}
                <h3 className="mt-3 line-clamp-1 text-sm font-medium text-foreground">
                  {item?.title}
                </h3>

                {/* Rating */}
                <div className="mt-1.5">
                  <Rating
                    size="sm"
                    showReviews={false}
                    rating={item?.review?.rating || 0}
                  />
                </div>

                {/* Review Button */}
                <button
                  onClick={() => openModal(item)}
                  className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary/30 hover:text-primary"
                >
                  <PenLine className="h-3.5 w-3.5" />
                  Edit Review
                </button>
              </div>
            ))}
          </div>
          {reviews?.totalReviewed !== undefined && reviews.totalReviewed > 10 && (
            <Pagination
              resultsPerPage={10}
              onChange={handleChangePage}
              label="Product Page Navigation"
              totalResults={reviews.totalReviewed}
            />
          )}
        </div>
      )}

      {selectedProduct && (
        <ReviewModal
          edit
          isOpen={isOpen}
          onClose={closeModal}
          product={selectedProduct as { _id: string; title?: string; review?: { _id?: string; rating?: number; comment?: string } }}
          title={selectedProduct?.title ?? ""}
        />
      )}
    </div>
  );
};

export default Reviewed;
