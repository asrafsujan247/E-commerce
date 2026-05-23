import { Link } from "react-router-dom";
import { Home, ChevronRight } from "lucide-react";
import useUtilsFunction from "@hooks/useUtilsFunction";

interface PageHeaderProps {
  title?: unknown;
  headerBg?: string;
}

const PageHeader = ({ title, headerBg }: PageHeaderProps) => {
  const displayTitle = String(title ?? '');

  return (
    <div
      className="relative bg-muted/50 border-b border-border overflow-hidden"
      style={headerBg ? { backgroundImage: `url(${headerBg})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
    >
      {headerBg && <div className="absolute inset-0 bg-black/50" />}
      <div className="relative max-w-screen-2xl mx-auto px-3 sm:px-10 py-8 lg:py-12">
        <h1 className={`text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight ${headerBg ? "text-white" : "text-foreground"}`}>
          {displayTitle}
        </h1>
        <nav className={`flex items-center gap-1.5 mt-3 text-sm ${headerBg ? "text-white/80" : "text-muted-foreground"}`}>
          <Link to="/" className="flex items-center gap-1 hover:text-primary transition-colors">
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className={`font-medium ${headerBg ? "text-white" : "text-foreground"}`}>{displayTitle}</span>
        </nav>
      </div>
    </div>
  );
};

export default PageHeader;
