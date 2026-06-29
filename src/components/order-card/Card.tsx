import React from "react";
import { ElementType } from "react";

import { cn } from "@lib/utils";

interface OrderCardProps {
  title?: string;
  Icon: ElementType;
  quantity?: number | string;
  className?: string;
}

const Card: React.FC<OrderCardProps> = ({ title, Icon, quantity, className }) => {
  return (
    <div className="group flex h-full">
      <div className="flex w-full items-center gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-sm">
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-xl transition-transform group-hover:scale-105",
            className,
          )}
        >
          <Icon />
        </div>
        <div className="min-w-0">
          <h5 className="mb-1.5 truncate text-sm font-medium leading-none text-muted-foreground">
            {title}
          </h5>
          <p className="text-2xl font-bold leading-none text-foreground">
            {quantity ?? 0}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Card;
