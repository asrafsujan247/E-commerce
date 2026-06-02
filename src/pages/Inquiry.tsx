import { useLocation, Link } from "react-router-dom";
import InquiryForm from "@components/inquiry/InquiryForm";

const Inquiry = () => {
  const { state } = useLocation();
  const product = (state as { product?: unknown })?.product;

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] px-4 gap-4">
        <p className="text-muted-foreground text-center">
          No product selected. Please navigate from a product page.
        </p>
        <Link
          to="/search"
          className="text-sm text-primary hover:underline font-medium"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <InquiryForm product={product as Parameters<typeof InquiryForm>[0]["product"]} />
  );
};

export default Inquiry;
