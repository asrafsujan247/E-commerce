import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Star } from "lucide-react";

import { cn } from "@lib/utils";
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
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          <div className="animate-pulse space-y-5">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-xl bg-muted" />
              <div className="space-y-2">
                <div className="h-4 w-32 rounded bg-muted" />
                <div className="h-3 w-52 rounded bg-muted" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-36 rounded-xl bg-muted" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const reviewCounts = reviews as unknown as {
    totalNotReviewed?: number;
    totalReviewed?: number;
    notReviewed?: unknown[];
    reviewed?: unknown[];
  };
  const needCount = reviewCounts?.totalNotReviewed ?? reviewCounts?.notReviewed?.length;
  const reviewedCount = reviewCounts?.totalReviewed ?? reviewCounts?.reviewed?.length;

  const tabs = [
    { key: "need" as const, label: "Need to Review", count: needCount },
    { key: "reviewed" as const, label: "Reviewed", count: reviewedCount },
  ];

  return (
    <div className="overflow-hidden">
      <div className="mx-auto max-w-screen-2xl">
        <div className="rounded-2xl border border-border bg-card">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-border p-5 sm:p-6">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Star className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold leading-none text-foreground">
                My Reviews
              </h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Rate and review the products you've purchased.
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-border px-5 py-3 sm:px-6">
            <div className="inline-flex items-center gap-1 rounded-lg bg-muted p-1">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => {
                      setActiveTab(tab.key);
                      navigate("/user/my-reviews?page=1");
                    }}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-card text-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {tab.label}
                    {tab.count !== undefined && tab.count > 0 && (
                      <span
                        className={cn(
                          "inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold leading-none",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted-foreground/20 text-muted-foreground",
                        )}
                      >
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Body */}
          <div className="p-5 sm:p-6">
            {activeTab === "need" ? (
              <NeedToReview reviews={reviews as unknown as { notReviewed?: { _id?: string; [key: string]: unknown }[]; totalNotReviewed?: number }} error={reviewError ?? undefined} />
            ) : (
              <Reviewed reviews={reviews as unknown as { reviewed?: { _id?: string; [key: string]: unknown }[]; totalReviewed?: number }} error={reviewError ?? undefined} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyReviews;
