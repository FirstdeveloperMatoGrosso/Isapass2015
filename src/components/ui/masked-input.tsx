
import React from "react";
import InputMask from "react-input-mask";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface MaskedInputProps extends Omit<React.ComponentProps<typeof InputMask>, "className"> {
  className?: string;
}

const MaskedInput = React.forwardRef<HTMLInputElement, MaskedInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <InputMask
        {...props}
        inputRef={ref}
      >
        {(inputProps: any) => (
          <Input 
            className={cn(className)} 
            {...inputProps} 
          />
        )}
      </InputMask>
    );
  }
);

MaskedInput.displayName = "MaskedInput";

export { MaskedInput };
