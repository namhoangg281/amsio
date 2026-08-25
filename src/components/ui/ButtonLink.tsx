import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef } from "react";

interface ButtonLinkProps extends ComponentPropsWithoutRef<typeof Link> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

/**
 * Renders a Next.js Link styled as a Button.
 * Use this instead of <Link><Button> to avoid invalid <a><button> HTML nesting.
 */
export default function ButtonLink({
  className,
  variant = "primary",
  size = "md",
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(
        "inline-flex items-center justify-center font-semibold rounded-full transition-all duration-300",
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
    </Link>
  );
}
