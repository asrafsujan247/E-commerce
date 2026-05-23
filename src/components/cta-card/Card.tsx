import React from "react";
import { Link } from "react-router-dom";
import { ctaCardData } from "@utils/data";

const Card: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
      {ctaCardData.map((item) => (
        <Link
          key={item.id}
          to={item.url}
          className="group relative overflow-hidden rounded-2xl aspect-4/3 block"
        >
          <img
            width={550}
            height={413}
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/25 to-transparent" />

          <div className="absolute top-4 left-4">
            <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
              Weekend Offer
            </span>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-5">
            <p className="text-white/70 text-sm mb-0.5">{item.title}</p>
            <h3 className="text-white text-xl font-bold mb-3 leading-tight">
              {item.subTitle}
            </h3>
            <span className="inline-flex items-center gap-1.5 bg-white text-foreground text-xs font-semibold px-4 py-2 rounded-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
              Shop Now →
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Card;
