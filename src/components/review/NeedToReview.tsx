import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
        <p className="text-rose-500 flex justify-center items-center">
          You have no products left to review.
        </p>
      ) : (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {reviews?.notReviewed?.map((item, index) => (
              <div
                key={index + 1}
                className="flex items-center gap-2 bg-card border border-border rounded-lg"
              >
                <ImageWithFallback
                  width="80"
                  height="80"
                  alt="product"
                  src={item?.image}
                />
                <div className="block py-3 w-auto">
                  <h3 className="font-medium text-sm mb-2 line-clamp-1 text-muted-foreground">
                    {item?.title}
                  </h3>
                  <button
                    onClick={() => openModal(item)}
                    className="flex-1 min-w-min px-2 py-1 text-xs font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
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
