import { Fragment, useState } from "react";
import Rating from "@components/common/Rating";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { X } from "lucide-react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

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

const ProductReviews: React.FC<ProductReviewsProps> = ({ reviews }) => {
  const [zoomImage, setZoomImage] = useState<string[] | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const openZoom = (images: string[], index: number): void => {
    setZoomImage(images);
    setCurrentIndex(index);
  };

  const closeZoom = (): void => {
    setZoomImage(null);
    setCurrentIndex(0);
  };

  const nextImage = (): void => {
    if (zoomImage) {
      setCurrentIndex((prev) => (prev + 1) % zoomImage.length);
    }
  };

  const prevImage = (): void => {
    if (zoomImage) {
      setCurrentIndex(
        (prev) => (prev - 1 + zoomImage.length) % zoomImage.length,
      );
    }
  };

  return (
    <>
      <Transition
        show={true}
        as="div"
        enter="transition-opacity duration-300"
        enterFrom="opacity-0 max-h-0"
        enterTo="opacity-100 max-h-screen"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-100 max-h-screen"
        leaveTo="opacity-0 max-h-0"
      >
        <TransitionChild
          as="div"
          enter="transform transition ease-in-out duration-300"
          enterFrom="translate-x-full"
          enterTo="translate-x-0"
          leave="transform transition ease-in-out duration-300"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-full"
        >
          <div className="relative">
            {reviews?.map((review) => (
              <div
                key={review._id}
                className="flex space-x-4 text-sm text-muted-foreground"
              >
                <div className="flex-none py-6">
                  {review.user?.image &&
                  (review.user.image.startsWith("http://") ||
                    review.user.image.startsWith("https://")) ? (
                    <img
                      src={review.user.image}
                      alt={review.user?.name?.[0] || "U"}
                      width={42}
                      height={42}
                      className="rounded-full object-cover w-[42px] h-[42px]"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-[42px] h-[42px] rounded-full bg-muted text-lg font-semibold text-muted-foreground">
                      {review.user?.name?.[0] || "U"}
                    </div>
                  )}
                </div>
                <div className="py-6 w-full">
                  <h3 className="font-medium mb-1 text-foreground">
                    {review?.user?.name}
                  </h3>
                  <Rating
                    size="sm"
                    rating={review.rating}
                    showReviews={false}
                  />
                  <span className="text-xs text-muted-foreground">
                    {new Date(review.createdAt ?? "").toLocaleDateString()}
                  </span>

                  <p className="text-sm text-muted-foreground mt-2">
                    {review.comment}
                  </p>
                  {review.images.filter(Boolean).length > 0 && (
                    <div className="flex gap-1 flex-wrap mt-3">
                      {review.images.filter(Boolean).map((img, idx) => (
                        <div
                          key={idx}
                          className="relative w-16 h-16 cursor-pointer"
                        >
                          <img
                            src={img}
                            alt="review image"
                            className="object-cover w-full h-full rounded-md border"
                            onClick={() =>
                              openZoom(review.images.filter(Boolean), idx)
                            }
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          {/* Zoom Modal */}
          <Dialog
            open={!!zoomImage}
            onClose={closeZoom}
            className="fixed inset-0 z-50"
          >
            <div className="flex items-center justify-center min-h-screen bg-black/80">
              <DialogPanel className="relative max-w-3xl w-full p-4 bg-background rounded-lg">
                <button
                  onClick={closeZoom}
                  className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-end rounded-md text-white cursor-pointer z-10"
                >
                  <X size={18} />
                </button>
                {zoomImage && (
                  <div className="relative flex items-center justify-center">
                    <button
                      onClick={prevImage}
                      className="absolute left-0 p-2 text-muted-foreground bg-muted shadow-sm hover:bg-muted hover:shadow-lg rounded-full z-10"
                    >
                      <FiChevronLeft size={20} />
                    </button>
                    <img
                      src={zoomImage[currentIndex]}
                      alt="Zoomed review"
                      className="rounded-lg object-cover w-full h-full max-w-[650px] max-h-[650px]"
                    />
                    <button
                      onClick={nextImage}
                      className="absolute right-0 p-2 text-muted-foreground bg-muted shadow-sm hover:bg-muted hover:shadow-lg rounded-full z-10"
                    >
                      <FiChevronRight size={20} />
                    </button>
                  </div>
                )}
              </DialogPanel>
            </div>
          </Dialog>
        </TransitionChild>
      </Transition>
    </>
  );
};

export default ProductReviews;
