import { Link } from "react-router-dom";
import type { Category } from "@appTypes/index";
import departmentsData from "@localdata/categories.json";

interface DepartmentCardProps {
  categories?: Category[];
}

interface DeptSubCategory {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  [key: string]: unknown;
}

interface Department {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  categories: DeptSubCategory[];
}

const departments = departmentsData as Department[];

// Static map — written as literals so Tailwind includes these classes in the bundle
const mdColsClass: Record<number, string> = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
};

// Returns responsive border classes for a grid cell.
// Mobile is always 2 cols; desktop uses `cols`.
function getCellBorders(idx: number, count: number, cols: number): string {
  const mobileLastCol = idx % 2 === 1;
  // last item alone in its mobile row (odd total, last index)
  const mobileAlone = count % 2 !== 0 && idx === count - 1;
  const mobileLastRow = Math.floor(idx / 2) === Math.floor((count - 1) / 2);
  const desktopLastCol = idx % cols === cols - 1;
  const desktopLastRow =
    Math.floor(idx / cols) === Math.floor((count - 1) / cols);

  return [
    !mobileLastCol && !mobileAlone ? "border-r" : !desktopLastCol ? "md:border-r" : "",
    !mobileLastCol && !mobileAlone && desktopLastCol ? "md:border-r-0" : "",
    !mobileLastRow ? "border-b" : !desktopLastRow ? "md:border-b" : "",
    !mobileLastRow && desktopLastRow ? "md:border-b-0" : "",
  ]
    .filter(Boolean)
    .join(" ");
}

const DepartmentCard = (_props: DepartmentCardProps) => {
  return (
    <div className="mx-auto max-w-screen-2xl px-3 sm:px-10 py-5 flex flex-col gap-5">
      {departments.map((dept) => {
        const subCategories = dept.categories.slice(0, 8);
        const count = subCategories.length;
        const cols = count > 4 ? 4 : count;

        return (
          <div key={dept._id} className="bg-white rounded-sm overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Left: Department panel */}
              <div className="md:w-50 lg:w-55 shrink-0 bg-[#fdf6e9] p-5 relative overflow-hidden">
                <h2 className="text-[15px] font-bold text-gray-900 mb-3 leading-snug">
                  {dept.name}
                </h2>
                <Link
                  to={`/search?category=${dept.slug}`}
                  className="inline-block self-start bg-red-500 hover:bg-red-600 active:bg-red-700 text-white text-[11px] font-semibold px-3 py-1.5 rounded-sm transition-colors"
                >
                  Source Now
                </Link>
                <img
                  src={dept.image ?? "/placeholder.png"}
                  alt={dept.name}
                  className="absolute bottom-2 right-2 max-h-1/2 max-w-4/5 object-contain"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "/placeholder.png";
                  }}
                />
              </div>

              {/* Right: Categories grid */}
              <div className={`md:flex-1 grid grid-cols-2 ${mdColsClass[cols]}`}>
                {subCategories.map((cat, idx) => (
                  <Link
                    key={cat._id}
                    to={`/search?category=${cat.slug}`}
                    className={`flex flex-col p-4 group border-gray-200 ${getCellBorders(idx, count, cols)}${count % 2 !== 0 && idx === count - 1 ? " col-span-2 md:col-span-1" : ""}`}
                  >
                    <span className="text-[12px] text-gray-700 group-hover:text-primary transition-colors leading-snug mb-2">
                      {cat.name}
                    </span>
                    <div className="flex items-end justify-end h-30">
                      <img
                        src={cat.image ?? "/placeholder.png"}
                        alt={cat.name}
                        className="max-h-full max-w-full object-contain transition-transform duration-200 group-hover:scale-105"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            "/placeholder.png";
                        }}
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DepartmentCard;
