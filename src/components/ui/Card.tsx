import { type HTMLAttributes, forwardRef } from "react";

type CardVariant = "default" | "elevated" | "bordered" | "dark";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

const variantClasses: Record<CardVariant, string> = {
  default: "bg-white",
  elevated: "bg-white shadow-lg",
  bordered: "bg-white border border-grey-200",
  dark: "bg-dark text-white",
};

const paddingClasses = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  function Card(
    { variant = "default", hover = false, padding = "md", className = "", children, ...props },
    ref,
  ) {
    return (
      <div
        ref={ref}
        className={`rounded-lg ${variantClasses[variant]} ${paddingClasses[padding]} ${
          hover ? "transition-all duration-300 hover:shadow-xl hover:-translate-y-1" : ""
        } ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);
