import * as React from "react";

const Input = React.forwardRef(({ as: Component = "input", className, ...props }, ref) => {
  const baseStyles = "w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";
  const textareaStyles = "h-auto min-h-[9rem]"; // Adjust minimum height as needed
  const combinedStyles = `${baseStyles} ${className} ${Component === "textarea" ? textareaStyles : ""}`;

  return <Component className={combinedStyles} ref={ref} {...props} />;
});

Input.displayName = "Input";

export { Input };
