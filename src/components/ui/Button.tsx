"use client";

import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-semibold rounded-full transition-all duration-300 cursor-pointer",
          "focus:outline-none focus:ring-2 focus:ring-offset-2",
          {
            "bg-orange text-white hover:bg-orange/90 focus:ring-orange shadow-lg hover:shadow-xl hover:scale-105":
              variant === "primary",
            "bg-navy text-white hover:bg-navy-dark focus:ring-navy":
              variant === "secondary",
            "border-2 border-white text-white hover:bg-white hover:text-navy focus:ring-white":
              variant === "outline",
            "text-navy hover:bg-navy-light focus:ring-navy":
              variant === "ghost",
          },
          {
            "px-4 py-2 text-sm": size === "sm",
            "px-6 py-3 text-base": size === "md",
            "px-8 py-4 text-lg": size === "lg",
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
