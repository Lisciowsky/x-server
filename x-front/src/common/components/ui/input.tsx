import * as React from "react";

type InputProps<T extends React.ElementType> = {
  as?: T;
  className?: string;
} & React.ComponentPropsWithoutRef<T>;

const Input = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps<"input" | "textarea">>(
  ({ as: Component = "input", className, ...props }, ref) => {
    const baseStyles = "w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";
    const textareaStyles = "h-auto min-h-[9rem]";
    const combinedStyles = `${baseStyles} ${className} ${Component === "textarea" ? textareaStyles : ""}`;

    return React.createElement(Component, {
      className: combinedStyles,
      ref,
      ...props,
    });
  }
);

Input.displayName = "Input";

export { Input };
