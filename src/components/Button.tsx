import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

// ✅ Centralized Button Variants (Design System Level)
const buttonVariants = cva(
  "inline-flex items-center text-xs justify-center gap-2 whitespace-nowrap rounded-md  font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:opacity-90",
        secondary:
          "bg-[var(--color-secondary)] text-[var(--color-secondary-foreground)] hover:opacity-80",
        danger: "bg-[var(--color-destructive)] text-white hover:opacity-90",
        ghost:
          "bg-transparent text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10",
      },
      size: {
        sm: "h-8 px-3",
        md: "h-10 px-4",
        lg: "h-11 px-6",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, loading, children, disabled, ...props },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {loading ? "Processing..." : children}
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };

// ✅ Tailwind Theme Extension (add to tailwind.config.ts)
/*
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: "#1d3449",
        "primary-foreground": "#ffffff",

        secondary: "#e5e7eb",
        "secondary-foreground": "#1f2937",

        destructive: "#dc2626",
      },
    },
  },
};
*/
