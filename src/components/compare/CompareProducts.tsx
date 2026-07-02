import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronUp, Heart, BadgeCheck } from "lucide-react";
import {
  compareProducts as defaultProducts,
  type CompareProduct,
} from "./compareData";

interface CompareProductsProps {
  products?: CompareProduct[];
}

const CompareProducts = ({
  products = defaultProducts,
}: CompareProductsProps) => {
  const colCount = products.length + 1;

  // Selection state for the "Select All" row.
  const [selected, setSelected] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(products.map((p) => [p.id, true])),
  );
  const allSelected = useMemo(
    () => products.every((p) => selected[p.id]),
    [products, selected],
  );

  // Specification block is collapsible (caret toggles it).
  const [specOpen, setSpecOpen] = useState(true);

  const toggleAll = () => {
    const next = !allSelected;
    setSelected(Object.fromEntries(products.map((p) => [p.id, next])));
  };

  const toggleOne = (id: string) =>
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));

  // ── Shared cell styles ────────────────────────────────────────────
  // Padding scales down on small screens so more columns stay readable.
  const cell =
    "border border-gray-200 px-2.5 py-2.5 sm:px-4 sm:py-3 align-top break-words";
  const labelCell = `${cell} bg-white text-gray-600 font-normal text-left`;
  const valueCell = `${cell} text-gray-700`;

  // The product header row sticks to the top of the viewport as the page
  // scrolls. The offset sits it just below the app's sticky navbar, whose
  // height differs per breakpoint (mobile ≈108px, md ≈64px, lg+ ≈124px with
  // the promo bar). z-30 keeps it under the navbar (z-40) but above the rows.
  const stickyHead =
    "sticky top-27 md:top-16 lg:top-31 z-30 shadow-[inset_0_-1px_0_#e5e7eb]";

  /** A simple text row: label on the left, one value per product. */
  const TextRow = ({
    label,
    render,
  }: {
    label: string;
    render: (p: CompareProduct) => React.ReactNode;
  }) => (
    <tr>
      <th scope="row" className={labelCell}>
        {label}
      </th>
      {products.map((p) => (
        <td key={p.id} className={valueCell}>
          {render(p)}
        </td>
      ))}
    </tr>
  );

  /** A full-width grey section heading row. */
  const SectionRow = ({ title }: { title: string }) => (
    <tr>
      <td
        colSpan={colCount}
        className="border border-gray-200 bg-gray-100 px-2.5 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-semibold text-gray-800"
      >
        {title}
      </td>
    </tr>
  );

  return (
    <div className="w-full">
      {/*
        No inner scroll container: the table flows in the page so the product
        header row can pin to the viewport with `position: sticky` on normal
        page scroll. (An overflow-x wrapper would capture the scroll and break
        vertical stickiness.) The table is fluid + table-fixed so columns share
        the available width on any device instead of forcing a horizontal
        scrollbar; long values wrap via `break-words`.
      */}
      <table className="w-full table-fixed border-collapse text-sm">
        <colgroup>
          <col className="w-24 sm:w-40 lg:w-48" />
          {products.map((p) => (
            <col key={p.id} />
          ))}
        </colgroup>

        <tbody>
          {/* ── Product header cards (sticky at the top on scroll) ─── */}
          <tr>
            <td
              className={`${stickyHead} border border-gray-200 bg-gray-50`}
            />
            {products.map((p) => (
              <td
                key={p.id}
                className={`${stickyHead} border border-gray-200 bg-white px-2 py-3 sm:px-4 sm:py-5 text-center align-top`}
              >
                <div className="flex flex-col items-center">
                  <div className="h-16 w-16 sm:h-24 sm:w-24 lg:h-28 lg:w-28 overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="h-full w-full object-contain"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          "/placeholder.png";
                      }}
                    />
                  </div>
                  <Link
                    to={`/product/${p.slug}`}
                    className="mt-2 sm:mt-3 line-clamp-2 text-xs sm:text-[13px] leading-snug text-blue-600 hover:underline"
                  >
                    {p.title}
                  </Link>
                  <button
                    type="button"
                    className="mt-2 sm:mt-3 rounded-sm bg-[#e4393c] px-4 py-1.5 sm:px-7 sm:py-2 text-xs sm:text-[13px] font-medium text-white transition-colors hover:bg-[#cf2f32]"
                  >
                    Send Inquiry
                  </button>
                  <label className="mt-1.5 sm:mt-2 inline-flex max-w-full cursor-pointer items-center gap-1.5 text-[11px] sm:text-[13px] text-blue-600">
                    <input
                      type="radio"
                      name={`contact-${p.id}`}
                      defaultChecked={p.id === products[0]?.id}
                      className="h-3.5 w-3.5 shrink-0 accent-blue-500"
                    />
                    <span className="truncate">{p.contactLabel}</span>
                  </label>
                </div>
              </td>
            ))}
          </tr>

          {/* ── Transaction Info ─────────────────────────────────── */}
          <SectionRow title="Transaction Info" />
          <TextRow label="Price" render={(p) => p.price} />
          <TextRow label="Min Order" render={(p) => p.minOrder} />
          <TextRow label="Trade Terms" render={(p) => p.tradeTerms} />
          <TextRow label="Payment Terms" render={(p) => p.paymentTerms} />

          {/* ── Quality Control ──────────────────────────────────── */}
          <SectionRow title="Quality Control" />
          <TextRow
            label="Product Certification"
            render={(p) => p.productCertification}
          />
          <TextRow
            label="Management System Certification"
            render={(p) => p.managementSystemCertification}
          />

          {/* ── Trade Capacity ───────────────────────────────────── */}
          <SectionRow title="Trade Capacity" />
          <TextRow label="Export Markets" render={(p) => p.exportMarkets} />
          <TextRow
            label="Annual Export Revenue"
            render={(p) => p.annualExportRevenue}
          />
          <TextRow label="Business Model" render={(p) => p.businessModel} />
          <TextRow
            label="Average Lead Time"
            render={(p) => (
              <div className="space-y-0.5">
                <div>Off-season: {p.leadTimeOffSeason}</div>
                <div>Peak-season: {p.leadTimePeakSeason}</div>
              </div>
            )}
          />

          {/* ── Product Attributes ───────────────────────────────── */}
          <SectionRow title="Product Attributes" />

          {/* Specification (collapsible) */}
          <tr>
            <th scope="row" className={labelCell}>
              <button
                type="button"
                onClick={() => setSpecOpen((o) => !o)}
                className="inline-flex items-center gap-1 font-normal text-gray-600"
                aria-expanded={specOpen}
              >
                Specification
                <ChevronUp
                  className={`h-4 w-4 transition-transform ${
                    specOpen ? "" : "rotate-180"
                  }`}
                />
              </button>
            </th>
            {products.map((p) => (
              <td key={p.id} className={valueCell}>
                {specOpen && (
                  <ul className="space-y-1">
                    {p.specifications.map((s) => (
                      <li key={s.label} className="leading-snug">
                        <span className="text-gray-600">{s.label}:</span>{" "}
                        <span className="font-medium text-gray-800">
                          {s.value}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </td>
            ))}
          </tr>

          {/* Supplier Name */}
          <tr>
            <th scope="row" className={labelCell}>
              Supplier Name
            </th>
            {products.map((p) => (
              <td key={p.id} className={valueCell}>
                <Link
                  to={`/product/${p.slug}`}
                  className="text-blue-600 hover:underline"
                >
                  {p.supplierName}
                </Link>
                <div className="mt-1.5 flex items-center gap-2">
                  <Heart className="h-4 w-4 fill-blue-500 text-blue-500" />
                  {p.supplierAudited && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700">
                      <BadgeCheck className="h-3.5 w-3.5 text-amber-600" />
                      Audited
                    </span>
                  )}
                </div>
              </td>
            ))}
          </tr>

          {/* Select All */}
          <tr>
            <th scope="row" className={labelCell}>
              <label className="inline-flex cursor-pointer items-center gap-2 font-normal text-gray-600">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  className="h-4 w-4 accent-blue-500"
                />
                Select All
              </label>
            </th>
            {products.map((p) => (
              <td key={p.id} className={`${cell} text-center`}>
                <input
                  type="checkbox"
                  checked={!!selected[p.id]}
                  onChange={() => toggleOne(p.id)}
                  aria-label={`Select ${p.title}`}
                  className="h-4 w-4 accent-blue-500"
                />
              </td>
            ))}
          </tr>
        </tbody>
      </table>

      {/* Bottom action */}
      <div className="mt-8 flex justify-center pb-8">
        <button
          type="button"
          className="rounded-sm bg-[#e4393c] px-8 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#cf2f32]"
        >
          Send Inquiry
        </button>
      </div>
    </div>
  );
};

export default CompareProducts;
