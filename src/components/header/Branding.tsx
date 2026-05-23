import { Link } from "react-router-dom";

interface BrandingItem {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  link: string;
  bgColor: string;
}

const BRANDING_ITEMS: BrandingItem[] = [
  {
    id: "1",
    title: "SMART EXPO",
    image: "/cta/cta-bg-1.jpg",
    link: "/",
    bgColor: "#f5f5f5",
  },
  {
    id: "2",
    title: "Secured",
    subtitle: "Trading Service",
    image: "/cta/cta-bg-2.jpg",
    link: "/",
    bgColor: "#f5f5f5",
  },
  {
    id: "3",
    title: "Leading Factory",
    image: "/cta/cta-bg-3.jpg",
    link: "/",
    bgColor: "#f5f5f5",
  },
  {
    id: "4",
    title: "Selected",
    subtitle: "Supplier",
    image: "/cta/delivery-boy.png",
    link: "/",
    bgColor: "#f5f5f5",
  },
];

const Branding = () => {
  return (
    <div className="flex gap-5 my-5">
      {BRANDING_ITEMS.map((item, index) => (
        <Link
          key={item.id}
          to={item.link}
          className={`flex-1 relative overflow-hidden h-24 flex flex-col justify-start p-3 hover:brightness-95 transition-all bg-[#f0f1f2]`}
        >
          <div className="z-10 relative">
            <span className="block text-[11.5px] font-semibold text-gray-700 leading-tight">
              {item.title}
            </span>
            {item.subtitle && (
              <span className="block text-[11.5px] font-semibold text-gray-700 leading-tight">
                {item.subtitle}
              </span>
            )}
          </div>
          <div className="absolute bottom-0 right-0 w-18 h-18">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = "/placeholder.png";
              }}
            />
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Branding;
