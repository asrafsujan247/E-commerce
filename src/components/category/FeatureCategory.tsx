import React, { useEffect, useState } from "react";
import CMSkeletonTwo from "@components/preloader/CMSkeletonTwo";
import CategoryNavigateButton from "@components/category/CategoryNavigateButton";
import { getShowingCategory } from "@services/CategoryService";
import { Category } from "@appTypes/index";

interface FeatureCategoryProps {
  categories?: Category[];
  error?: string | null;
}

const FeatureCategory: React.FC<FeatureCategoryProps> = ({
  categories: categoriesProp,
  error: errorProp,
}) => {
  const [categories, setCategories] = useState<Category[]>(
    categoriesProp ?? [],
  );
  const [error, setError] = useState<string | null>(errorProp ?? null);

  useEffect(() => {
    if (categoriesProp && categoriesProp.length > 0) return;
    getShowingCategory().then((result) => {
      if (result.error) {
        setError(result.error);
      } else {
        setCategories(result.categories);
      }
    });
  }, [categoriesProp]);

  return (
    <>
      {error ? (
        <CMSkeletonTwo count={10} height={20} error={error} loading={false} />
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {categories
            ?.filter(
              (category) => category.children && category.children.length > 0,
            )
            .slice(0, 10)
            .map((category, i) => {
              const icon = category?.icon as string | undefined;
              const isUrl =
                icon && (icon.startsWith("http") || icon.startsWith("/"));
              return (
                <li className="group" key={i + 1}>
                  <div className="flex items-center justify-start w-full h-full rounded-xl border border-border bg-card px-10 py-8 md:p-4 cursor-pointer transition duration-200 ease-linear transform group-hover:shadow-md group-hover:border-primary/40">
                    <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-0">
                      <div className="shrink-0 w-8.75 h-8.75 flex items-center justify-center">
                        {isUrl ? (
                          <img
                            src={icon}
                            alt="category"
                            width={35}
                            height={35}
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src =
                                "/placeholder.png";
                            }}
                          />
                        ) : icon ? (
                          <span className="text-[28px] leading-none select-none">
                            {icon}
                          </span>
                        ) : (
                          <img
                            src="/placeholder.png"
                            alt="category"
                            width={35}
                            height={35}
                          />
                        )}
                      </div>

                      <CategoryNavigateButton
                        category={{
                          ...category,
                          name: category.name,
                          description: category.description,
                        }}
                      />
                    </div>
                  </div>
                </li>
              );
            })}
        </ul>
      )}
    </>
  );
};

export default FeatureCategory;
