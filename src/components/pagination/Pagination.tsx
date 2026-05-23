import React, { useEffect, useState, forwardRef } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface NavigationButtonProps {
  onClick: () => void;
  disabled: boolean;
  directionIcon: "prev" | "next";
}

export const NavigationButton: React.FC<NavigationButtonProps> = ({
  onClick,
  disabled,
  directionIcon,
}) => {
  const ariaLabel = directionIcon === "prev" ? "Previous" : "Next";
  const Icon = directionIcon === "prev" ? FiChevronLeft : FiChevronRight;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className="align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium p-2 rounded-md text-foreground dark:text-muted-foreground dark:hover:bg-accent focus:outline-none border border-transparent active:bg-transparent hover:bg-muted"
    >
      <Icon />
    </button>
  );
};

interface PageButtonProps {
  page: number;
  isActive: boolean;
  onClick: () => void;
}

export const PageButton: React.FC<PageButtonProps> = ({
  page,
  isActive,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`${
        isActive
          ? "bg-primary text-primary-foreground font-normal hover:text-primary-foreground"
          : "text-foreground dark:text-muted-foreground"
      } align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium px-3 py-1 rounded-md text-xs text-muted-foreground focus:outline-none border border-transparent active:bg-transparent hover:bg-muted dark:hover:bg-accent`}
    >
      {page}
    </button>
  );
};

export const EmptyPageButton: React.FC = () => (
  <span className="px-2 py-1">...</span>
);

type PageEntry = number | "...";

interface PaginationProps {
  totalResults: number;
  resultsPerPage?: number;
  label?: string;
  onChange: (page: number) => void;
  className?: string;
}

const Pagination = forwardRef<HTMLDivElement, PaginationProps>(
  function Pagination(props, ref) {
    const {
      totalResults,
      resultsPerPage = 10,
      label,
      onChange,
      ...other
    } = props;

    const [pages, setPages] = useState<PageEntry[]>([]);
    const [activePage, setActivePage] = useState<number>(1);

    const TOTAL_PAGES = Math.ceil(totalResults / resultsPerPage);
    const FIRST_PAGE = 1;
    const LAST_PAGE = TOTAL_PAGES;
    const MAX_VISIBLE_PAGES = 7;

    function handlePreviousClick(): void {
      setActivePage(activePage - 1);
    }

    function handleNextClick(): void {
      setActivePage(activePage + 1);
    }

    useEffect(() => {
      if (TOTAL_PAGES <= MAX_VISIBLE_PAGES) {
        setPages(Array.from({ length: TOTAL_PAGES }).map((_, i) => i + 1));
      } else if (activePage < 5) {
        setPages([1, 2, 3, 4, 5, "...", TOTAL_PAGES]);
      } else if (activePage >= 5 && activePage < TOTAL_PAGES - 3) {
        setPages([
          1,
          "...",
          activePage - 1,
          activePage,
          activePage + 1,
          "...",
          TOTAL_PAGES,
        ]);
      } else {
        setPages([
          1,
          "...",
          TOTAL_PAGES - 4,
          TOTAL_PAGES - 3,
          TOTAL_PAGES - 2,
          TOTAL_PAGES - 1,
          TOTAL_PAGES,
        ]);
      }
    }, [activePage, TOTAL_PAGES]);

    useEffect(() => {
      onChange(activePage);
    }, [activePage]);

    return (
      <div className="mt-4 text-muted-foreground">
        <div
          className="flex flex-col justify-between text-xs sm:flex-row text-muted-foreground dark:text-muted-foreground"
          ref={ref}
          {...other}
        >
          <span className="flex items-center font-semibold tracking-wide uppercase">
            Showing {activePage * resultsPerPage - resultsPerPage + 1}-
            {Math.min(activePage * resultsPerPage, totalResults)} of{" "}
            {totalResults}
          </span>

          <div className="flex mt-2 sm:mt-auto sm:justify-end font-normal text-xs">
            <nav aria-label={label}>
              <ul className="inline-flex items-center">
                <li>
                  <NavigationButton
                    directionIcon="prev"
                    disabled={activePage === FIRST_PAGE}
                    onClick={handlePreviousClick}
                  />
                </li>
                {pages.map((p, i) => (
                  <li key={p.toString() + i}>
                    {p === "..." ? (
                      <EmptyPageButton />
                    ) : (
                      <PageButton
                        page={p}
                        isActive={p === activePage}
                        onClick={() => setActivePage(+p)}
                      />
                    )}
                  </li>
                ))}
                <li>
                  <NavigationButton
                    directionIcon="next"
                    disabled={activePage === LAST_PAGE}
                    onClick={handleNextClick}
                  />
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    );
  }
);

export default Pagination;
