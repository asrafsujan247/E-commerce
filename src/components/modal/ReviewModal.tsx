import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { useForm } from "react-hook-form";
import { notifyError, notifySuccess } from "@utils/toast";
import { addReview, updateReview } from "@services/ReviewServices";
import { useAuth } from "@stores/useAuthStore";
import MainModal from "./MainModal";
import { Button } from "@components/ui/button";
import Uploader from "@components/image-uploader/Uploader";

// Types
interface ReviewProduct {
  _id: string;
  title?: string;
  review?: {
    _id?: string;
    rating?: number;
    comment?: string;
  };
}

interface ReviewModalProps {
  title: string;
  edit?: boolean;
  isOpen: boolean;
  onClose: () => void;
  product: ReviewProduct;
}

interface ReviewFormData {
  comment?: string;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  title,
  edit,
  isOpen,
  onClose,
  product,
}) => {
  const { user } = useAuth();
  const [hover, setHover] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string[]>([]);
  const [rating, setRating] = useState<number>(product?.review?.rating || 0);

  const {
    reset,
    setValue,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReviewFormData>();

  const submitReview = async (data: ReviewFormData) => {
    if (rating <= 0) return notifyError("Minimum one rating is required!");
    try {
      setIsLoading(true);
      const updatedData: Record<string, unknown> = {
        ...data,
        rating,
        product: product._id,
        images: imageUrl,
      };
      if (edit && product.review?._id) {
        updatedData.reviewId = product.review._id; // must be review _id
      }

      const token = user?.token ?? "";
      const res = edit
        ? await updateReview(updatedData, token)
        : await addReview(updatedData, token);

      if ((res as { error?: string })?.error) {
        setIsLoading(false);
        return notifyError((res as { error: string }).error);
      }
      notifySuccess("Review submitted successfully!");

      // Reset form and close modal
      reset();
      onClose();

      setIsLoading(false);
    } catch {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setRating(product?.review?.rating || 0);
    setValue("comment", product?.review?.comment || "");
  }, [product, setValue]);

  return (
    <MainModal
      modalOpen={isOpen}
      bottomCloseBtn={true}
      handleCloseModal={onClose}
    >
      <div className="flex items-center justify-center">
        <div className="relative bg-background rounded-lg w-full max-w-4xl z-50">
          <h1 className="text-base font-semibold mb-4">{`Review for ${title}`}</h1>
          <div className="flex items-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => {
              const starValue = i + 1;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setRating(starValue)}
                  onMouseEnter={() => setHover(starValue)}
                  onMouseLeave={() => setHover(null)}
                >
                  <Star
                    size={24}
                    fill={starValue <= (hover ?? rating) ? "#facc15" : "none"}
                    stroke={
                      starValue <= (hover ?? rating) ? "#facc15" : "#9ca3af"
                    }
                  />
                </button>
              );
            })}
          </div>

          <div>
            <div className="mt-1 flex items-center">
              <Uploader
                multiple
                imageUrl={imageUrl}
                setImageUrl={(url) => setImageUrl(Array.isArray(url) ? url : [url])}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit(submitReview)}>
            <textarea
              {...register("comment", { required: false })}
              placeholder="Write your thoughts..."
              className="w-full border focus:ring-0 placeholder:text-sm text-sm focus:outline-none ring-0 border-border rounded p-2 min-h-[80px]"
            />
            {errors.comment && (
              <p className="text-sm text-red-500 mt-1">Comment is required.</p>
            )}

            <Button
              type="submit"
              variant="create"
              disabled={isLoading}
              className="w-full mt-4"
            >
              {isLoading ? "Processing..." : "Submit Review"}
            </Button>
          </form>
        </div>
      </div>
    </MainModal>
  );
};

export default ReviewModal;
