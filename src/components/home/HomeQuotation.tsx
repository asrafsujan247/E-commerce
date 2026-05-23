import { useState } from "react";
import { useNavigate } from "react-router-dom";

const UNITS = [
  "Meter(s)",
  "Kilogram(s)",
  "Piece(s)",
  "Set(s)",
  "Pair(s)",
  "Ton(s)",
  "Liter(s)",
  "Box(es)",
  "Carton(s)",
  "Roll(s)",
];

const HomeQuotation = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    product: "",
    description: "",
    quantity: "",
    unit: "Meter(s)",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/rfq", {
      state: {
        productName: form.product,
        details: form.description,
        quantity: form.quantity,
        unit: form.unit,
      },
    });
  };

  return (
    <div className="mx-auto max-w-screen-2xl px-3 sm:px-10 py-5">
      <div className="relative overflow-hidden rounded-sm">
        {/* Background image */}
        <img
          src="/service_add_bg.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        <div className="relative flex flex-col lg:flex-row items-start gap-6 px-4 py-6 sm:px-8 sm:py-8 lg:px-16 lg:py-10">
          {/* Left: content */}
          <div className="flex-1">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-3 tracking-tight text-gray-900">
              EASY SOURCING
            </h2>
            <p className="text-sm sm:text-base text-gray-700 mb-4">
              An easy way to post your sourcing requests and get quotes.
            </p>
            <ul className="space-y-1 mb-5 text-gray-700 text-sm lg:text-base">
              <li>One request, multiple quotes</li>
              <li>Verified suppliers matching</li>
              <li>Quotes comparison and sample request</li>
            </ul>
            <a
              href="#"
              className="inline-flex items-center gap-1 font-semibold text-gray-900 hover:underline text-sm lg:text-base"
            >
              Learn More <span aria-hidden>›</span>
            </a>
          </div>

          {/* Right: quotation form card */}
          <div className="w-full lg:w-110 shrink-0 bg-white rounded-sm shadow-lg p-5 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
              Want to get quotations?
            </h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Product Name or Keywords"
                value={form.product}
                onChange={(e) => setForm({ ...form, product: e.target.value })}
                className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-primary"
              />
              <textarea
                placeholder="Product Description"
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-primary resize-none"
              />
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="number"
                  placeholder="Purchase Quantity"
                  value={form.quantity}
                  onChange={(e) =>
                    setForm({ ...form, quantity: e.target.value })
                  }
                  className="flex-1 border border-gray-300 rounded-sm px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-primary"
                />
                <select
                  value={form.unit}
                  onChange={(e) => setForm({ ...form, unit: e.target.value })}
                  className="border border-gray-300 rounded-sm px-2 py-2 text-sm text-gray-700 focus:outline-none focus:border-primary bg-white"
                >
                  {UNITS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="mt-1 w-full sm:w-auto bg-red-500 hover:bg-red-600 active:bg-red-700 text-white text-sm font-semibold px-5 py-2.5 rounded-sm transition-colors self-start"
              >
                Post Your Request Now
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeQuotation;
