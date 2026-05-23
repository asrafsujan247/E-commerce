import React from "react";
import { useNavigate } from "react-router-dom";
import { IoChevronForwardSharp } from "react-icons/io5";

import useUtilsFunction from "@hooks/useUtilsFunction";
import { Category } from "@appTypes/index";

interface CategoryNavigateButtonProps {
  category: Category;
}

const CategoryNavigateButton: React.FC<CategoryNavigateButtonProps> = ({
  category,
}) => {
  const navigate = useNavigate();

  const handleCategoryClick = (id: string, categoryName: string) => {
    const category_name = categoryName
      .toLowerCase()
      .replace(/[^A-Z0-9]+/gi, "-");
    const url = `/search?category=${category_name}&_id=${id}`;
    navigate(url);
  };

  return (
    <>
      <div className="pl-0 md:pl-4">
        <h3
          onClick={() =>
            handleCategoryClick(
              category._id,
              String(category?.name ?? '') ?? "",
            )
          }
          className="text-sm text-muted-foreground dark:text-muted-foreground hover:text-orange-400 font-medium leading-tight line-clamp-1  group-hover"
        >
          {String(category?.name ?? '')}
        </h3>
        <ul className="pt-1 mt-1">
          {category?.children?.slice(0, 3).map((child) => (
            <li key={child._id} className="pt-1">
              <a
                onClick={() =>
                  handleCategoryClick(
                    child._id,
                    String(child?.name ?? '') ?? "",
                  )
                }
                className="flex hover:translate-x-2 transition-transform duration-300 items-center  text-xs text-muted-foreground cursor-pointer"
              >
                <span className="text-xs text-muted-foreground ">
                  <IoChevronForwardSharp />
                </span>
                {String(child?.name ?? '')}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default CategoryNavigateButton;
