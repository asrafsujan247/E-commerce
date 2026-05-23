import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { createPortal } from "react-dom";
import {
  IoClose,
  IoPersonOutline,
  IoShieldCheckmarkOutline,
  IoRocketOutline,
} from "react-icons/io5";

interface GuestCheckoutPromptProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * GuestCheckoutPrompt
 * A modal that appears when an unauthenticated user tries to checkout
 * and guest checkout is enabled. Gives them the choice to sign in or
 * continue as a guest.
 */
const GuestCheckoutPrompt = ({ isOpen, onClose }: GuestCheckoutPromptProps) => {
  const navigate = useNavigate();
  const modalRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Click outside to close
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!isOpen || !mounted) return null;

  const handleGuestCheckout = () => {
    onClose();
    navigate("/checkout?mode=guest");
  };

  const modalContent = (
    <div
      onClick={handleBackdropClick}
      style={{ zIndex: 99999 }}
      className="fixed inset-0 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-md bg-background rounded-2xl shadow-2xl border border-border overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="Close"
        >
          <IoClose className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-transparent px-6 pt-8 pb-6 text-center border-b border-border">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 ring-4 ring-primary/5">
            <IoPersonOutline className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">
            How would you like to checkout?
          </h2>
          <p className="text-sm text-muted-foreground">
            Sign in for a richer experience, or continue as a guest.
          </p>
        </div>

        {/* Options */}
        <div className="p-6 space-y-3">
          {/* Sign In Option */}
          <Link
            to="/auth/login?redirectUrl=/checkout"
            onClick={onClose}
            className="group flex items-start gap-4 p-4 rounded-xl border-2 border-primary bg-primary/5 hover:bg-primary/10 transition-all duration-200"
          >
            <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-primary/15 group-hover:bg-primary/25 transition-colors">
              <IoShieldCheckmarkOutline className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground text-sm">
                Sign In / Create Account
              </p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Track orders, save addresses, and access your order history.
              </p>
            </div>
            <span className="shrink-0 self-center text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              Recommended
            </span>
          </Link>

          {/* Guest Option */}
          <button
            onClick={handleGuestCheckout}
            className="group w-full flex items-start gap-4 p-4 rounded-xl border-2 border-border hover:border-primary/30 hover:bg-muted/50 transition-all duration-200 text-left"
          >
            <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-muted group-hover:bg-muted/80 transition-colors">
              <IoRocketOutline className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground text-sm">
                Continue as Guest
              </p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                No account needed. Only Cash on Delivery available. Your order
                details will be saved with your email.
              </p>
            </div>
          </button>
        </div>

        {/* Footer note */}
        <div className="px-6 pb-5">
          <p className="text-center text-xs text-muted-foreground">
            By continuing, you agree to our{" "}
            <Link
              to="/terms-and-conditions"
              onClick={onClose}
              className="underline hover:text-foreground transition-colors"
            >
              Terms
            </Link>{" "}
            &amp;{" "}
            <Link
              to="/privacy-policy"
              onClick={onClose}
              className="underline hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default GuestCheckoutPrompt;
