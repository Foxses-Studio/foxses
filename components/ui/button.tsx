import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[8px] text-[16px] font-medium transition-all duration-200 active:scale-95 hover:scale-[1.02] focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 shadow-none cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-[#f25b2a] text-white hover:bg-[#d84b1b] border-none shadow-none",
        outline:
          "border border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800 shadow-none",
        ghost:
          "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-none",
        link: "text-zinc-900 dark:text-zinc-100 underline-offset-4 hover:underline shadow-none",
      },
      size: {
        default: "h-11 px-5 py-2 text-[16px]",
        sm: "h-9 rounded-[8px] px-3.5 text-[16px]",
        lg: "h-12 rounded-[8px] px-6 text-[16px]",
        icon: "h-10 w-10 text-[16px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
