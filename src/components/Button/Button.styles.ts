import { css } from "lit";
import { cva, type VariantProps } from "class-variance-authority";

export const buttonRecipe = cva("button", {
	variants: {
		variant: {
			primary: "primary",
			secondary: "secondary",
		},
		size: {
			small: "small",
			medium: "medium",
			large: "large",
		},
	},
	defaultVariants: {
		variant: "primary",
		size: "medium",
	},
});

export type ButtonProps = VariantProps<typeof buttonRecipe>;

export const buttonStyles = css`
:host {
  button {
    all: unset;
    box-sizing: border-box;

    border-radius: 1.5rem;
    line-height: 1.5rem;
    font-size: 1rem;

    &.primary {
      color: rgb(var(--white));
      background-color: rgb(var(--purple-500));
      transition: background-color var(--transition-fast) ease-in-out;

      &:hover {
        background-color: rgb(var(--purple-700));
      }
      &:active {
        background-color: rgb(var(--purple-800));
      }
      &:focus-visible {
        outline: 1px solid rgb(var(--white));
      }
      &:disabled {
        background-color: rgba(var(--purple-500), var(--op-disabled));
      }
    }

    &.secondary {
      color: rgb(var(--neutral-900));
      background-color: rgb(var(--neutral-200));
      transition: background-color var(--transition-fast) ease-in-out;

      &:hover {
        background-color: rgb(var(--neutral-300));
      }
      &:active {
        background-color: rgb(var(--neutral-400));
      }
      &:focus-visible {
        outline: 1px solid rgb(var(--black));
      }
      &:disabled {
        color: rgba(var(--neutral-900), var(--op-disabled));
        background-color: rgb(var(--neutral-100));
      }
    }

    &.small {
        padding: 0.375rem 0.75rem;
    }
    &.medium {
        padding: 0.5rem 1.25rem;
    }
    &.large {
        padding: 0.75rem 1.5rem;
    }
  }
}
`;
