import { Link } from "react-router-dom";
import {
  LayoutGrid,
  MousePointerClick,
  ShieldCheck,
  BrainCircuit,
  BookOpen,
} from "lucide-react";
import { SignalIcon } from "@heroicons/react/24/outline";
import type { LucideIcon } from "lucide-react";

interface Shortcut {
  label: string;
  icon: LucideIcon;
  to: string;
}

const SHORTCUTS: Shortcut[] = [
  { label: "All\nCategories", icon: LayoutGrid, to: "/search" },
  { label: "Request for\nQuotation", icon: SignalIcon, to: "/" },
  { label: "Secured\nTrading", icon: ShieldCheck, to: "/" },
  { label: "Sourcing\nAI", icon: BrainCircuit, to: "/" },
  { label: "Business\nGuide", icon: BookOpen, to: "/" },
];

const MobileServiceShortcuts = () => (
  <div className="flex items-start justify-around px-2 py-3 bg-white border-t border-gray-100">
    {SHORTCUTS.map(({ label, icon: Icon, to }) => (
      <Link
        key={label}
        to={to}
        className="flex flex-col items-center gap-1.5 flex-1 text-center"
      >
        <Icon className="h-6 w-6 text-primary" strokeWidth={1.5} />
        <span className="text-[10px] leading-tight text-gray-600 whitespace-pre-line">
          {label}
        </span>
      </Link>
    ))}
  </div>
);

export default MobileServiceShortcuts;
