import { twCva } from "@utils/twCva";

export const selectRecipe = twCva("select", {
  defaultVariants: {
    color: null,
    size: null,
    variant: null,
  },
  variants: {
    color: {
      accent: "select-accent",
      error: "select-error",
      info: "select-info",
      primary: "select-primary",
      secondary: "select-secondary",
      success: "select-success",
      warning: "select-warning",
    },
    size: {
      lg: "select-lg",
      md: "select-md",
      sm: "select-sm",
      xs: "select-xs",
    },
    variant: {
      bordered: "select-bordered",
      ghost: "select-ghost",
    },
  },
});
