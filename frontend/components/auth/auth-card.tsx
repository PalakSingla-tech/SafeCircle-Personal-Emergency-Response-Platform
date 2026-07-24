import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthCardProps {
  children: React.ReactNode;
  className?: string;
  backHref?: string;
  backLabel?: string;
}

export function AuthCard({
  children,
  className,
  backHref = "/",
  backLabel = "Back to home",
}: AuthCardProps) {
  return (
    <div className={cn("auth-animate-in w-full max-w-md", className)}>
      <Link
        href={backHref}
        className="auth-animate-in-delay-1 mb-6 inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        {backLabel}
      </Link>

      <div className="auth-animate-in-delay-2 relative">
        {/* Soft glow behind card */}
        <div
          aria-hidden="true"
          className="auth-card-glow absolute -inset-3 -z-10 rounded-[1.75rem] blur-2xl"
        />

        <div className="auth-gradient-border relative overflow-hidden rounded-2xl border border-border/40 bg-card/90 p-8 shadow-2xl shadow-primary/8 backdrop-blur-md sm:p-10">
          {/* Inner highlight */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"
          />
          {children}
        </div>
      </div>
    </div>
  );
}

interface AuthHeaderProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AuthHeader({ icon, title, subtitle }: AuthHeaderProps) {
  return (
    <div className="mb-8 text-center">
      <div className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center">
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-2xl bg-primary/15 blur-md"
        />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary ring-1 ring-primary/10">
          {icon}
        </div>
      </div>
      <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-[1.65rem]">
        {title}
      </h2>
      <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
        {subtitle}
      </p>
    </div>
  );
}

export function AuthFooter({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-8 border-t border-border/50 pt-6 text-center text-sm text-muted-foreground">
      {children}
    </p>
  );
}

export function AuthDivider() {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-border/70" />
      </div>
      <div className="relative flex justify-center text-xs uppercase tracking-wider">
        <span className="bg-card/90 px-4 text-muted-foreground/80">or</span>
      </div>
    </div>
  );
}

export function AuthError({ message }: { message: string }) {
  return (
    <p className="rounded-xl border border-destructive/20 bg-destructive/8 px-3.5 py-2.5 text-sm text-destructive">
      {message}
    </p>
  );
}

export function AuthSuccess({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="space-y-6 text-center">
      <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-green-500/15 blur-lg"
        />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10 text-green-600 ring-1 ring-green-500/20">
          {icon}
        </div>
      </div>
      <div>
        <p className="font-display text-xl font-semibold text-foreground">
          {title}
        </p>
        <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}
