import { cn } from "@/lib/utils";

interface AuthCheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {}

export function AuthCheckbox({ className, ...props }: AuthCheckboxProps) {
  return (
    <input
      type="checkbox"
      className={cn("auth-checkbox", className)}
      {...props}
    />
  );
}
