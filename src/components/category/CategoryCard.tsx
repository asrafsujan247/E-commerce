import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IoChevronDownOutline,
  IoChevronForwardOutline,
  IoRemoveSharp,
} from "react-icons/io5";

import useUtilsFunction from "@hooks/useUtilsFunction";

interface ChildCategory {
  _id: string;
  name: Record<string, string> | string;
  children: ChildCategory[];
}

interface CategoryCardProps {
  title: string;
  icon?: string;
  nested?: ChildCategory[];
  id: string;
  onClose?: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  title,
  icon,
  nested,
  id,
  onClose,
}) => {
  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const [showSubCategory, setShowSubCategory] = useState<{
    id: string;
    show: boolean;
  }>({
    id: "",
    show: false,
  });

  const handleSearch = (categoryId: string, categoryName: string) => {
    const name = categoryName.toLowerCase().replace(/[^A-Z0-9]+/gi, "-");
    navigate(`/search?category=${name}&_id=${categoryId}`);
    if (onClose) {
      onClose();
    }
  };

  const toggleExpand = () => {
    setShow(!show);
  };

  const handleSubNestedToggle = (nestedId: string) => {
    setShowSubCategory({
      id: nestedId,
      show: showSubCategory.id === nestedId ? !showSubCategory.show : true,
    });
  };

  return (
    <>
      <div className="px-4 py-2.5 flex items-center hover:bg-accent w-full transition-colors">
        <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
          {icon ? (
            <img src={icon} width={20} height={20} alt="Category" />
          ) : (
            <img
              src="https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png"
              width={20}
              height={20}
              alt="category"
            />
          )}
        </div>

        {/* Clicking name = search */}
        <div
          onClick={() => handleSearch(id, title)}
          className="ml-3 text-sm font-medium flex-1 cursor-pointer hover:text-primary text-foreground"
        >
          {title}
        </div>

        {/* Clicking arrow = expand */}
        {(nested?.length ?? 0) > 0 && (
          <button
            onClick={toggleExpand}
            className="p-1 rounded-md cursor-pointer text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
          >
            {show ? <IoChevronDownOutline /> : <IoChevronForwardOutline />}
          </button>
        )}
      </div>

      {/* Nested categories */}
      {show && (nested?.length ?? 0) > 0 && (
        <ul className="pl-8 pr-4 pb-2 pt-1 bg-muted/30">
          {nested!.map((children) => (
            <li key={children._id}>
              {children.children.length > 0 ? (
                <div className="flex items-center py-2">
                  <span className="text-xs text-muted-foreground pr-2">
                    <IoRemoveSharp />
                  </span>
                  <div
                    onClick={() =>
                      handleSearch(
                        children._id,
                        String(children.name ?? '') ?? "",
                      )
                    }
                    className="flex-1 text-sm text-foreground/80 hover:text-primary cursor-pointer"
                  >
                    {String(children.name ?? '')}
                  </div>
                  <button
                    onClick={() => handleSubNestedToggle(children._id)}
                    className="p-1 rounded-md cursor-pointer text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
                  >
                    {showSubCategory.id === children._id &&
                    showSubCategory.show ? (
                      <IoChevronDownOutline />
                    ) : (
                      <IoChevronForwardOutline />
                    )}
                  </button>
                </div>
              ) : (
                <div
                  onClick={() =>
                    handleSearch(
                      children._id,
                      String(children.name ?? '') ?? "",
                    )
                  }
                  className="flex items-center py-2 text-sm text-foreground/80 hover:text-primary cursor-pointer"
                >
                  <span className="text-xs text-muted-foreground pr-2">
                    <IoRemoveSharp />
                  </span>
                  {String(children.name ?? '')}
                </div>
              )}

              {/* Sub children */}
              {showSubCategory.id === children._id && showSubCategory.show && (
                <ul className="pl-5 pb-2 bg-muted/20 rounded-md">
                  {children.children.map((subChildren) => (
                    <li
                      key={subChildren._id}
                      onClick={() =>
                        handleSearch(
                          subChildren._id,
                          String(subChildren.name ?? '') ?? "",
                        )
                      }
                      className="flex items-center py-1.5 text-sm text-foreground/70 hover:text-primary cursor-pointer"
                    >
                      <span className="text-xs text-muted-foreground pr-2">
                        <IoRemoveSharp />
                      </span>
                      {String(subChildren.name ?? '')}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default CategoryCard;
