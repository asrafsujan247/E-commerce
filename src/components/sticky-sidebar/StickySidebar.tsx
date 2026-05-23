import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SignalIcon } from "@heroicons/react/24/outline";
import { ChevronUp, Headphones, Tablet } from "lucide-react";

const ITEMS = [
  {
    id: "rfq",
    label: "RFQ",
    to: "/rfq",
  },
  {
    id: "help",
    label: "Help",
    to: "/contact-us",
  },
  {
    id: "app",
    label: "APP",
    to: "/",
  },
] as const;

const StickySidebar = () => {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col gap-2">
      {/* Main sidebar items */}
      <div className="flex flex-col bg-white border border-gray-300 rounded-l-lg shadow-md overflow-hidden">
        {ITEMS.map(({ id, label, to }, index) => (
          <Link
            key={id}
            to={to}
            className={`group flex flex-col items-center justify-center gap-1 lg:gap-1.5 w-11 lg:w-14 py-2 lg:py-3 text-gray-600 hover:text-primary hover:bg-primary/5 transition-colors duration-200 ${
              index > 0 ? "border-t border-gray-200" : ""
            }`}
          >
            <div className="flex items-center justify-center w-5 h-5 lg:w-7 lg:h-7 rounded-full bg-gray-100 group-hover:bg-primary/10 transition-colors duration-200">
              {id === "rfq" && (
                <SignalIcon className="h-3 w-3 lg:h-3.5 lg:w-3.5 text-gray-600 group-hover:text-primary transition-colors" />
              )}
              {id === "help" && (
                <Headphones
                  className="h-3 w-3 lg:h-3.5 lg:w-3.5 text-gray-600 group-hover:text-primary transition-colors"
                  strokeWidth={1.8}
                />
              )}
              {id === "app" && (
                <Tablet
                  className="h-3 w-3 lg:h-3.5 lg:w-3.5 text-gray-600 group-hover:text-primary transition-colors"
                  strokeWidth={1.8}
                />
              )}
            </div>
            <span className="text-[9px] lg:text-[10px] font-semibold leading-none tracking-wide text-gray-700 group-hover:text-primary transition-colors">
              {label}
            </span>
          </Link>
        ))}
      </div>

      {/* Back to top — always rendered to prevent height/position shift */}
      <div
        className={`flex flex-col bg-white border border-gray-300 rounded-l-lg shadow-md overflow-hidden transition-opacity duration-300 will-change-[opacity] ${
          showTop ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          tabIndex={showTop ? 0 : -1}
          className="group flex flex-col items-center justify-center gap-1 lg:gap-1.5 w-11 lg:w-14 py-2 lg:py-3 text-gray-600 hover:text-primary hover:bg-primary/5 transition-colors duration-200"
        >
          <div className="flex items-center justify-center w-5 h-5 lg:w-7 lg:h-7 rounded-full bg-gray-100 group-hover:bg-primary/10 transition-colors duration-200">
            <ChevronUp className="h-3 w-3 lg:h-3.5 lg:w-3.5 text-gray-600 group-hover:text-primary transition-colors" />
          </div>
          <span className="text-[9px] lg:text-[10px] font-semibold leading-none tracking-wide text-gray-700 group-hover:text-primary transition-colors">
            Top
          </span>
        </button>
      </div>
    </div>
  );
};

export default StickySidebar;
