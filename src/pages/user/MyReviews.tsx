import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import { useAuth } from "@stores/useAuthStore";
import { useSidebar } from "@stores/useSidebarStore";
import Reviewed from "@components/review/Reviewed";
import NeedToReview from "@components/review/NeedToReview";
import { getUserPurchasedProducts } from "@services/ReviewServices";
import type { Review } from "@appTypes/index";

const MyReviews: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { activeTab, setActiveTab } = useSidebar();

  const currentPage = Number(searchParams.get("page") || 1);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!user?.token) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const result = await getUserPurchasedProducts(
        { page: currentPage, limit: 30 },
        user.token,
      );

      if (result.error) {
        setReviewError(result.error);
      } else {
        setReviews(result.reviews ?? []);
      }

      setLoading(false);
    };

    fetchReviews();
  }, [user?.token, currentPage]);

  if (loading) {
    return (
      <div className="overflow-hidden">
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-muted rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <div className="mb-4 border-b border-border">
        <nav className="-mb-px flex space-x-6">
          <button
            className={`whitespace-nowrap pb-2 px-1 border-b-2 text-sm font-medium ${
              activeTab === "need"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-muted-foreground hover:border-border"
            }`}
            onClick={() => {
              setActiveTab("need");
              navigate("/user/my-reviews?page=1");
            }}
          >
            Need to Review
          </button>
          <button
            className={`whitespace-nowrap pb-2 px-1 border-b-2 text-sm font-medium ${
              activeTab === "reviewed"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-muted-foreground hover:border-border"
            }`}
            onClick={() => {
              setActiveTab("reviewed");
              navigate("/user/my-reviews?page=1");
            }}
          >
            Reviewed Products
          </button>
        </nav>
      </div>

      {activeTab === "need" ? (
        <NeedToReview reviews={reviews as unknown as { notReviewed?: { _id?: string; [key: string]: unknown }[]; totalNotReviewed?: number }} error={reviewError ?? undefined} />
      ) : (
        <Reviewed reviews={reviews as unknown as { reviewed?: { _id?: string; [key: string]: unknown }[]; totalReviewed?: number }} error={reviewError ?? undefined} />
      )}
    </div>
  );
};

export default MyReviews;
