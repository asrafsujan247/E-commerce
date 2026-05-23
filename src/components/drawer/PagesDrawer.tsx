import { Fragment } from "react";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Link } from "react-router-dom";
import { AlignJustify, ChevronRight, Headphones } from "lucide-react";
import {
  SignalIcon,
  DevicePhoneMobileIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";
import type { Category as CategoryType } from "@appTypes/index";

interface PagesDrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  categories?: CategoryType[];
  categoryError?: string | null;
}

const CATEGORY_LIMIT = 7;

const PagesDrawer: React.FC<PagesDrawerProps> = ({
  open,
  setOpen,
  categories,
  categoryError,
}) => {
  const close = () => setOpen(false);

  const topCats = (categories ?? []).slice(0, CATEGORY_LIMIT);
  const hasMore = (categories ?? []).length > CATEGORY_LIMIT;

  const catName = (cat: CategoryType) =>
    String(cat.name ?? '') ||
    String(cat.name);

  return (
    <Transition show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50 md:hidden" onClose={setOpen}>
        {/* Backdrop */}
        <TransitionChild
          as={Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40" />
        </TransitionChild>

        <div className="fixed inset-0 z-50 flex">
          <TransitionChild
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <DialogPanel className="relative flex w-72 flex-col overflow-y-auto bg-white shadow-xl">
              {/* Sign In / Join Free */}
              <div className="flex items-center gap-3 px-5 py-4">
                <Link
                  to="/auth/login"
                  onClick={close}
                  className="text-sm font-semibold text-primary hover:underline"
                >
                  Sign In
                </Link>
                <span className="text-gray-300 text-sm">|</span>
                <Link
                  to="/auth/register"
                  onClick={close}
                  className="text-sm font-semibold text-primary hover:underline"
                >
                  Join Free
                </Link>
              </div>

              <div className="border-t border-gray-100" />

              {/* Categories */}
              <div className="px-5 pt-4 pb-3">
                <div className="flex items-center gap-2 mb-3">
                  <AlignJustify className="h-4 w-4 text-gray-700 shrink-0" />
                  <span className="text-sm font-semibold text-gray-800">
                    Categories
                  </span>
                </div>

                {categoryError ? (
                  <p className="text-xs text-red-500">{categoryError}</p>
                ) : (
                  <ul className="space-y-2.5 pl-6">
                    {topCats.map((cat) => (
                      <li key={cat._id}>
                        <Link
                          to={`/search?_id=${cat._id}`}
                          onClick={close}
                          className="text-sm text-gray-700 leading-snug hover:text-primary"
                        >
                          {catName(cat)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}

                {hasMore && (
                  <Link
                    to="/search"
                    onClick={close}
                    className="inline-block mt-3 pl-6 text-sm text-primary font-medium hover:text-primary hover:underline"
                  >
                    View More...
                  </Link>
                )}
              </div>

              <div className="border-t border-gray-100" />

              {/* Menu items */}
              <nav className="px-5">
                <Link
                  to="/search"
                  onClick={close}
                  className="flex items-center gap-3 py-3.5 text-sm text-gray-700 hover:text-primary transition-colors"
                >
                  <SignalIcon className="h-5 w-5 text-gray-500 shrink-0" />
                  Post Sourcing Request
                </Link>

                <div className="border-t border-gray-100" />

                <Link
                  to="/"
                  onClick={close}
                  className="flex items-center gap-3 py-3.5 text-sm text-gray-700 hover:text-primary transition-colors"
                >
                  <DevicePhoneMobileIcon className="h-5 w-5 text-blue-500 shrink-0" />
                  Get App
                </Link>

                <div className="border-t border-gray-100" />

                <button className="flex items-center gap-3 py-3.5 text-sm text-gray-700 hover:text-primary transition-colors w-full">
                  <GlobeAltIcon className="h-5 w-5 text-gray-500 shrink-0" />
                  <span className="flex-1 text-left">English</span>
                  <ChevronRight className="h-4 w-4 text-gray-400 shrink-0" />
                </button>

                <div className="border-t border-gray-100" />

                <Link
                  to="/contact-us"
                  onClick={close}
                  className="flex items-center gap-3 py-3.5 text-sm text-gray-700 hover:text-primary transition-colors"
                >
                  <Headphones
                    className="h-5 w-5 text-primary shrink-0"
                    strokeWidth={1.8}
                  />
                  Help
                </Link>
              </nav>

              <div className="border-t border-gray-100" />

              {/* Footer links */}
              <div className="px-5 py-4 space-y-3">
                <Link
                  to="/"
                  onClick={close}
                  className="block text-sm text-gray-500 hover:text-primary hover:underline"
                >
                  User Agreement
                </Link>
                <Link
                  to="/"
                  onClick={close}
                  className="block text-sm text-gray-500 hover:text-primary hover:underline"
                >
                  Privacy Policy
                </Link>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};

export default PagesDrawer;
