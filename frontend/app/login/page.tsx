"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogIn, Loader2, ShieldCheck, Mail } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { AuthCard, AuthHeader, AuthFooter, AuthDivider, AuthError } from "@/components/auth/auth-card";
import { FormField, PasswordField } from "@/components/auth/form-field";
import { GoogleButton } from "@/components/auth/google-button";
import { AuthCheckbox } from "@/components/auth/auth-checkbox";
import { AuthSubmitButton } from "@/components/auth/auth-submit-button";
import { login } from "@/lib/api";
import { toast } from "react-toastify";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      toast.error("Please enter your email.");
      return;
    }
    if (!password) {
      toast.error("Please enter your password.");
      return;
    }

    setLoading(true);
    try {
      await login({ email: trimmedEmail, password });
      toast.success("Successfully logged in!");
      router.push("/dashboard");
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Login failed.";
      toast.error(errorMsg);
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <AuthCard>
        <AuthHeader
          icon={<ShieldCheck className="h-7 w-7" />}
          title="Welcome back"
          subtitle="Sign in to access your emergency profile and contacts."
        />

        <form className="space-y-4" noValidate onSubmit={handleSubmit}>
          <FormField
            id="email"
            name="email"
            label="Email"
            type="email"
            placeholder="you@email.com"
            icon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <PasswordField
            id="password"
            name="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            show={showPassword}
            onToggle={() => setShowPassword((v) => !v)}
          />

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2.5">
              <AuthCheckbox id="remember" />
              <label htmlFor="remember" className="cursor-pointer text-sm text-muted-foreground">
                Remember me
              </label>
            </div>
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-primary transition-colors hover:text-primary/80 relative z-10"
            >
              Forgot password?
            </Link>
          </div>

          <AuthSubmitButton className="mt-2" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={18} /> : <LogIn size={18} />}
            Sign in
          </AuthSubmitButton>

          <AuthDivider />

          <GoogleButton
            loading={googleLoading}
            onClick={() => {
              setGoogleLoading(true);
              setTimeout(() => {
                router.push("/dashboard");
              }, 600);
            }}
          />
        </form>

        <AuthFooter>
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-primary transition-colors hover:text-primary/80">
            Create one
          </Link>
        </AuthFooter>
      </AuthCard>
    </AuthShell>
  );
}
