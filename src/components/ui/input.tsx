import React from "react";
import { cn } from "@lib/utils";

interface InputProps extends React.ComponentPropsWithoutRef<"input"> {
  hasError?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, hasError, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        data-slot="input"
        className={cn(
          // Base styles
          "flex h-11 w-full rounded-lg border bg-muted px-4 py-3 text-sm text-foreground transition-all duration-200 outline-none",
          // Placeholder
          "placeholder:text-muted-foreground placeholder:text-sm",
          // Focus state
          "focus:bg-background focus:border-primary focus:ring-0.5 focus:ring-primary/20",
          // Hover state
          "hover:border-border",
          // Default border
          "border-border",
          // Disabled state
          "disabled:cursor-not-allowed disabled:opacity-60 disabled:bg-muted",
          // Read-only state
          "read-only:cursor-not-allowed read-only:bg-muted read-only:text-muted-foreground",
          // Error state
          hasError && "border-red-400 focus:border-red-500 focus:ring-red-500/20",
          // File input
          "file:text-foreground file:inline-flex file:h-8 file:border-0 file:bg-transparent file:text-sm file:font-medium",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export type { InputProps };
export { Input };
