import type { VariantProps } from "class-variance-authority";
import { twCva } from "../utils/twCva";

export const dialogContainerRecipe = twCva("modal");

export type DialogContainerVariants = VariantProps<
  typeof dialogContainerRecipe
>;

export const dialogContentRecipe = twCva("modal-box");

export type DialogContentVariants = VariantProps<typeof dialogContentRecipe>;

export const dialogActionsRecipe = twCva("modal-action");

export type DialogActionsVariants = VariantProps<typeof dialogActionsRecipe>;
