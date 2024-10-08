import { twCva } from "@utils/twCva";

export const badgeRecipe = twCva("badge gap-2", {
  defaultVariants: {
    color: null,
    size: null,
    variant: null,
  },
  variants: {
    color: {
      accent: "badge-accent",
      error: "badge-error",
      info: "badge-info",
      primary: "badge-primary",
      secondary: "badge-secondary",
      success: "badge-success",
      warning: "badge-warning",
      neutral: "badge-neutral",
      ghost: "badge-ghost",
    },
    size: {
      xl: "badge-lg h-8",
      lg: "badge-lg",
      md: "badge-md",
      sm: "badge-sm",
      xs: "badge-xs",
    },
    variant: {
      outline: "badge-outline",
    },
  },
});
