const FEATURES = [
  "Funds Security",
  "Audited Suppliers",
  "Refund Policy",
  "Service Guarantee",
];

const ShieldBadge = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 80"
    className="h-14 sm:h-16 lg:h-20 w-auto shrink-0"
    aria-hidden
  >
    <path
      d="M32 2 L60 14 L60 38 C60 58 32 74 32 74 C32 74 4 58 4 38 L4 14 Z"
      fill="#f5c842"
      stroke="#e0a800"
      strokeWidth="2"
    />
    <path
      d="M32 8 L54 18 L54 38 C54 54 32 68 32 68 C32 68 10 54 10 38 L10 18 Z"
      fill="#fdd835"
    />
    <polyline
      points="20,38 28,48 44,30"
      fill="none"
      stroke="#1a6e3c"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const FeatureIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-3.5 h-3.5 text-white/80 shrink-0"
    aria-hidden
  >
    <path
      fillRule="evenodd"
      d="M9.661 2.237a.531.531 0 0 1 .678 0 11.947 11.947 0 0 0 7.078 2.749.5.5 0 0 1 .479.425c.069.52.104 1.05.104 1.589 0 5.162-3.26 9.563-7.834 11.256a.48.48 0 0 1-.332 0C5.26 16.563 2 12.162 2 7c0-.538.035-1.069.104-1.589a.5.5 0 0 1 .48-.425 11.947 11.947 0 0 0 7.077-2.749Z"
      clipRule="evenodd"
    />
  </svg>
);

const ServiceAdd = () => {
  return (
    <div className="mx-auto max-w-screen-2xl px-3 sm:px-10">
      <div className="relative overflow-hidden rounded-sm bg-red-600">
        {/* Background image with red overlay */}
        <img
          src="/service_add_bg.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center opacity-20"
        />

        {/* Mobile: stacked layout */}
        <div className="relative flex flex-col sm:flex-row items-center gap-4 px-6 py-6 sm:px-10 sm:py-4 lg:px-16 lg:py-5">

          {/* Shield — hidden on very small, shown from sm */}
          <div className="hidden sm:block shrink-0">
            <ShieldBadge />
          </div>

          {/* Center: heading + features */}
          <div className="flex-1 flex flex-col items-center text-center">
            <h2 className="text-lg sm:text-xl lg:text-3xl font-extrabold text-white tracking-tight">
              Secured Trading Service
            </h2>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 mt-2">
              {FEATURES.map((label) => (
                <span
                  key={label}
                  className="flex items-center gap-1 text-white/90 text-xs sm:text-sm"
                >
                  <FeatureIcon />
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* CTA button */}
          <a
            href="#"
            className="shrink-0 bg-white text-red-600 text-sm font-bold px-6 py-2.5 rounded-full hover:bg-gray-100 transition-colors whitespace-nowrap"
          >
            Learn More
          </a>

        </div>
      </div>
    </div>
  );
};

export default ServiceAdd;
