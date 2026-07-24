import { cn } from "@/lib/utils";
import { Lock, Eye, EyeOff, Check, type LucideIcon } from "lucide-react";
import { getPasswordStrength } from "@/lib/password-strength";

interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  icon: LucideIcon;
  required?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  name?: string;
}

export function FormField({
  id,
  label,
  type = "text",
  placeholder,
  icon: Icon,
  required,
  value,
  onChange,
  className,
  name,
}: FormFieldProps) {
  return (
    <div className={cn("group", className)}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="relative">
        <Icon
          className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary"
          size={18}
        />
        <input
          id={id}
          name={name ?? id}
          type={type}
          required={required}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="auth-input"
        />
      </div>
    </div>
  );
}

interface PasswordFieldProps {
  id: string;
  label: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  show: boolean;
  onToggle: () => void;
  name?: string;
}

export function PasswordField({
  id,
  label,
  placeholder = "••••••••",
  value,
  onChange,
  show,
  onToggle,
  name,
}: PasswordFieldProps) {
  return (
    <div className="group">
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="relative">
        <Lock
          className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary"
          size={18}
        />
        <input
          id={id}
          name={name ?? id}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onInput={onChange as React.FormEventHandler<HTMLInputElement>}
          className="auth-input auth-input-password"
          autoComplete="current-password"
        />
        <button
          type="button"
          className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-muted-foreground transition-colors hover:bg-muted/60 hover:text-primary"
          onClick={onToggle}
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}

const requirements = [
  { test: (p?: string) => !!p && p.length >= 8, label: "At least 8 characters" },
  { test: (p?: string) => !!p && /[A-Z]/.test(p), label: "One uppercase letter" },
  { test: (p?: string) => !!p && /[a-z]/.test(p), label: "One lowercase letter" },
  { test: (p?: string) => !!p && /[0-9]/.test(p), label: "One number" },
  { test: (p?: string) => !!p && /[^A-Za-z0-9]/.test(p), label: "One special character" },
];

// Color map using inline styles to bypass Tailwind CSS purge issues
const strengthColors = [
  "#ef4444", // 0 → red
  "#f97316", // 1 → orange
  "#eab308", // 2 → yellow
  "#84cc16", // 3 → lime
  "#22c55e", // 4 → green
];

const strengthLabels = ["Very weak", "Weak", "Fair", "Good", "Strong"];

export function PasswordStrength({ password }: { password: string }) {
  const score = getPasswordStrength(password);
  const label = strengthLabels[Math.min(score, 4)] ?? strengthLabels[0];
  const activeColor = strengthColors[Math.min(score, 4)] ?? strengthColors[0];
  const isGood = score >= 3;

  return (
    <div className="mt-3 rounded-xl border border-border/60 bg-muted/30 p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">Password strength</span>
        <span
          className="text-xs font-semibold"
          style={{ color: score > 0 ? activeColor : undefined }}
        >
          {label}
        </span>
      </div>
      <div className="mb-3 flex gap-1.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-2 flex-1 rounded-full transition-all duration-300"
            style={{
              backgroundColor: i < score ? activeColor : "#e2e8f0",
            }}
          />
        ))}
      </div>
      <ul className="space-y-1.5">
        {requirements.map(({ test, label: reqLabel }) => {
          const met = test(password);
          return (
            <li key={reqLabel} className="flex items-center gap-2 text-xs">
              <span
                className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                style={{
                  backgroundColor: met ? "rgba(34,197,94,0.15)" : undefined,
                  color: met ? "#16a34a" : undefined,
                }}
              >
                <Check className="h-2.5 w-2.5" />
              </span>
              <span className={met ? "text-foreground" : "text-muted-foreground"}>{reqLabel}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
