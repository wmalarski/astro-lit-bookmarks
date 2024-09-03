import { twCva } from "@utils/twCva";

export const cardRecipe = twCva("card border-base-300", {
  defaultVariants: {
    color: null,
    size: null,
    variant: null,
    shadow: null,
  },
  variants: {
    color: {
      accent: "border-l-2 border-l-accent",
      black: "border-l-2 border-l-neutral",
      disabled: "border-l-2 border-l-base-300",
      error: "border-l-2 border-l-error",
      info: "border-l-2 border-l-info",
      primary: "border-l-2 border-l-primary",
      secondary: "border-l-2 border-l-secondary",
      success: "border-l-2 border-l-success",
      warning: "border-l-2 border-l-warning",
    },
    size: {
      compact: "card-compact",
      normal: "card-normal",
      side: "card-side",
    },
    variant: {
      bordered: "card-bordered",
    },
    shadow: {
      md: "shadow-md",
      sm: "shadow-sm",
      regular: "shadow",
      lg: "shadow-lg",
      xl: "shadow-xl",
      xl2: "shadow-2xl",
      inner: "shadow-inner",
      none: "shadow-none",
    },
  },
});

export const cardTitleRecipe = twCva("card-title");

export const cardBodyRecipe = twCva("card-body");

export const cardActionsRecipe = twCva("card-actions");
