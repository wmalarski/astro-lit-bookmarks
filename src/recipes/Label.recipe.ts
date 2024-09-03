import { twCva } from "@utils/twCva";

export const labelRecipe = twCva("label gap-2");

export const labelTextRecipe = twCva("", {
  defaultVariants: {
    alt: false,
  },
  variants: {
    alt: {
      false: "label-text",
      true: "label-text-alt pt-2",
    },
  },
});
