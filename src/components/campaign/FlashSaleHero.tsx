import React from "react";
import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";

interface FlashSaleHeroProps {
  headerBg?: string;
  totalProducts?: number;
  activeCampaignCount?: number;
  totalSold?: number;
}

const FlashSaleHero: React.FC<FlashSaleHeroProps> = ({
  headerBg,
  totalProducts,
  activeCampaignCount,
  totalSold,
}) => {
  return (
    <div className="bg-muted/50 border-b border-border">
      <div className="max-w-screen-2xl mx-auto px-3 sm:px-10 py-8 lg:py-12">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
          Flash Sale
        </h1>
        <nav className="flex items-center gap-1.5 mt-3 text-sm text-muted-foreground">
          <Link
            to="/"
            className="flex items-center gap-1 hover:text-primary transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-foreground font-medium">Flash Sale</span>
        </nav>
      </div>
    </div>
  );
};

export default FlashSaleHero;
