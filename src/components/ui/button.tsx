import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium",
    "transition-[background-color,color,border-color,box-shadow,transform]",
    "disabled:pointer-events-none disabled:opacity-50",
    "shrink-0 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 outline-none",
    "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
    "[--btn-bg:var(--primary)] [--btn-fg:var(--primary-foreground)] [--btn-border:transparent]",
    "[--btn-hover-bg:var(--btn-bg)] [--btn-hover-fg:var(--btn-fg)] [--btn-hover-border:var(--btn-border)]",
    "border border-[var(--btn-border)] bg-[var(--btn-bg)] text-[var(--btn-fg)]",
    "hover:border-[var(--btn-hover-border)] hover:bg-[var(--btn-hover-bg)] hover:text-[var(--btn-hover-fg)]",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "[--btn-bg:var(--primary)] [--btn-fg:var(--primary-foreground)] [--btn-hover-bg:color-mix(in_oklch,_var(--primary)_92%,_var(--background)_8%)] [--btn-hover-fg:var(--primary-foreground)]",
        destructive:
          "[--btn-bg:var(--destructive)] [--btn-fg:oklch(0.985_0_0)] [--btn-hover-bg:color-mix(in_oklch,_var(--destructive)_88%,_black_12%)] [--btn-hover-fg:oklch(0.985_0_0)] focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline:
          "shadow-xs [--btn-border:color-mix(in_oklch,_var(--foreground)_15%,_transparent)] [--btn-bg:color-mix(in_oklch,_var(--foreground)_6%,_transparent)] [--btn-fg:var(--foreground)] [--btn-hover-border:color-mix(in_oklch,_var(--foreground)_25%,_transparent)] [--btn-hover-bg:color-mix(in_oklch,_var(--foreground)_14%,_transparent)] [--btn-hover-fg:var(--foreground)]",
        secondary:
          "[--btn-bg:var(--secondary)] [--btn-fg:var(--secondary-foreground)] [--btn-hover-bg:color-mix(in_oklch,_var(--secondary)_88%,_var(--background)_12%)] [--btn-hover-fg:var(--secondary-foreground)]",
        ghost:
          "[--btn-border:transparent] [--btn-bg:transparent] [--btn-fg:var(--foreground)] [--btn-hover-bg:color-mix(in_oklch,_var(--foreground)_12%,_transparent)] [--btn-hover-fg:var(--foreground)]",
        link:
          "border-0 bg-transparent p-0 font-medium [--btn-border:transparent] [--btn-bg:transparent] [--btn-hover-border:transparent] [--btn-hover-bg:transparent] [--btn-fg:var(--primary)] [--btn-hover-fg:var(--primary)] underline-offset-4 hover:underline",
        inverted:
          "shadow-xs [--btn-border:color-mix(in_oklch,_oklch(0.145_0_0)_12%,_transparent)] [--btn-bg:oklch(0.985_0_0)] [--btn-fg:oklch(0.145_0_0)] [--btn-hover-border:color-mix(in_oklch,_oklch(0.145_0_0)_18%,_transparent)] [--btn-hover-bg:color-mix(in_oklch,_oklch(0.985_0_0)_88%,_oklch(0.9_0_0)_12%)] [--btn-hover-fg:oklch(0.205_0_0)]",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
