"use client";
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

const checkboxVariants = cva(
  "peer h-4 w-4 shrink-0 rounded border border-gray-300 bg-white text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        default: "h-4 w-4",
        sm: "h-3 w-3",
        lg: "h-5 w-5",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">, VariantProps<typeof checkboxVariants> {}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, size, ...props }, ref) => {
    return (
      <input
        type="checkbox"
        className={checkboxVariants({ size, className })}
        ref={ref}
        {...props}
      />
    );
  }
);
Checkbox.displayName = "Checkbox";
