import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import SelectField from "@components/rfq/SelectField";
import { UNITS } from "@lib/rfqConstants";

interface InquiryProduct {
  _id: string;
  title: unknown;
  image?: string | string[];
  slug: string;
  [key: string]: unknown;
}

interface InquiryFormProps {
  product: InquiryProduct;
}

const MAX_CONTENT = 4000;
const MAX_FILES = 1;

const InquiryForm = ({ product }: InquiryFormProps) => {
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("Piece(s)");
  const [content, setContent] = useState("");
  const [email, setEmail] = useState("");
  const [fileCount, setFileCount] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const productTitle = String(product?.title ?? "");
  const productImage = Array.isArray(product?.image)
    ? (product.image as string[])[0]
    : (product?.image as string | undefined);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setFileCount((prev) => Math.min(MAX_FILES, prev + e.target.files!.length));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10 md:py-12">
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">
          Send Your Purchase Inquiry
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Share your requirements, and our team will provide you with the best
          possible offer based on your needs.
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        {/* Product card */}
        <div className="mb-8 rounded-lg">
          <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-200 rounded-t-sm">
            <span className="text-sm text-gray-700">Your selected product</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-6 md:gap-3 px-4 py-4 bg-white rounded-b-sm">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-16 h-16 shrink-0 border border-gray-100 rounded overflow-hidden bg-gray-50">
                <img
                  src={productImage || "/placeholder.png"}
                  alt={productTitle}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "/placeholder.png";
                  }}
                />
              </div>
              <Link
                to={`/product/${product.slug}`}
                className="flex-1 min-w-0 text-sm text-blue-500 hover:underline line-clamp-2"
              >
                {productTitle}
              </Link>
            </div>
            <div className="flex items-center shrink-0 self-start sm:self-auto">
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Quantity"
                min="1"
                className="border border-gray-300 rounded-l px-3 py-1.5 text-sm text-gray-700 placeholder-gray-400 w-28 focus:outline-none focus:border-blue-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <SelectField
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="rounded-l-none border-l-0"
              >
                {UNITS.map((u) => (
                  <option key={u}>{u}</option>
                ))}
              </SelectField>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Content<span className="text-red-500">*</span>
          </label>
          <div className="bg-white rounded-sm overflow-hidden">
            <div className="relative">
              <textarea
                value={content}
                onChange={(e) => {
                  if (e.target.value.length <= MAX_CONTENT)
                    setContent(e.target.value);
                }}
                rows={7}
                placeholder="Please enter details such as material, size, application, specifications and other requirements to receive an accurate quote."
                className="w-full resize-none px-3 py-3 pb-7 text-sm text-gray-700 placeholder-gray-400 focus:outline-none block"
              />
              <span className="absolute bottom-2 right-3 text-xs text-gray-400 pointer-events-none select-none">
                {content.length}/{MAX_CONTENT}
              </span>
            </div>
            <div className="bg-gray-50 flex items-center px-3 py-2 border-t border-gray-100">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={fileCount >= MAX_FILES}
                className="inline-flex items-center gap-1.5 text-sm text-blue-500 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                </svg>
                Attach Files ({fileCount}/{MAX_FILES})
              </button>
            </div>
          </div>
        </div>

        {/* Email */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address..."
            className={`border bg-white rounded-sm px-4 py-2.75 text-sm text-gray-700 placeholder-gray-400 w-full sm:w-76 focus:outline-none focus:border-blue-400 transition-colors ${
              submitted && !email
                ? "border-red-400 bg-red-50"
                : "border-transparent"
            }`}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="px-6 py-2.5 bg-primary hover:bg-primary/80 text-white text-sm font-semibold rounded transition-colors"
        >
          Send Inquiry Now
        </button>
      </form>
    </div>
  );
};

export default InquiryForm;
