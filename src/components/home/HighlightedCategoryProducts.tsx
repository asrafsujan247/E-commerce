import { Link } from "react-router-dom";
import { MoveRight } from "lucide-react";
import rawDepartments from "@localdata/categories.json";

interface RawCategory {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  [key: string]: unknown;
}

interface RawDepartment {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  categories: RawCategory[];
}

const departments = (rawDepartments as RawDepartment[]).slice(0, 4);

const HighlightedCategoryProducts = () => {
  return (
    <div className="mx-auto max-w-screen-2xl px-3 sm:px-12 py-16">
      <h2 className="text-center text-lg sm:text-2xl font-normal text-gray-700 mb-5">
        Most popular categories with featured products
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        {departments.map((dept) => {
          const subcategories = dept.categories.slice(0, 3);
          const features = subcategories.map((c) => c.name);

          return (
            <div
              key={dept._id}
              className="bg-white rounded-sm overflow-hidden flex flex-col"
            >
              {/* ── Top banner ── */}
              <Link
                to={`/search?category=${dept.slug}`}
                className="relative block h-48 sm:h-56 shrink-0 overflow-hidden group"
              >
                <img
                  src={dept.image ?? "/placeholder.png"}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "/placeholder.png";
                  }}
                />
                <div className="absolute inset-0 bg-black/45" />

                <div className="relative z-10 px-7 py-10 h-full flex flex-col justify-between">
                  <div>
                    <h3 className="text-[15px] md:text-lg font-bold text-white leading-snug mb-4 md:mb-6">
                      {dept.name}
                    </h3>
                    <ul className="space-y-0.5">
                      {features.map((feat) => (
                        <li
                          key={feat}
                          className="text-[12px] md:text-sm text-white/80 leading-snug"
                        >
                          {feat}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full text-white/90 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 mt-4">
                    <MoveRight className="w-7 h-7" />
                  </span>
                </div>
              </Link>

              {/* ── Bottom products row ── */}
              <div className="flex divide-x divide-gray-100 flex-1">
                {subcategories.map((cat) => (
                  <Link
                    key={cat._id}
                    to={`/search?category=${cat.slug}`}
                    className="flex-1 flex flex-col items-center justify-start gap-2 py-8 px-1 sm:px-3 group hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                      <img
                        src={cat.image ?? "/placeholder.png"}
                        alt={cat.name}
                        className="w-10 h-10 object-contain transition-transform duration-200 group-hover:scale-110"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            "/placeholder.png";
                        }}
                      />
                    </div>
                    <p className="text-[11px] text-gray-600 text-center leading-snug group-hover:text-primary transition-colors line-clamp-2">
                      {cat.name}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HighlightedCategoryProducts;
