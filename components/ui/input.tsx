import * as React from "react";

import { cn } from "@/lib/utils";
import {
  isNumericInputType,
  normalizeNumericInputValue,
} from "@/lib/numerals";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, inputMode, onChange, ...props }, ref) => {
    const isNumericType = type === "number";
    const resolvedType = isNumericType ? "text" : type;
    const resolvedInputMode =
      inputMode ?? (isNumericType ? "numeric" : undefined);

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
      if (isNumericInputType(type, resolvedInputMode)) {
        const normalized = normalizeNumericInputValue(
          event.target.value,
          type,
          resolvedInputMode
        );
        if (normalized !== event.target.value) {
          event.target.value = normalized;
        }
      }
      onChange?.(event);
    }

    return (
      <input
        type={resolvedType}
        inputMode={resolvedInputMode}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        onChange={handleChange}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
