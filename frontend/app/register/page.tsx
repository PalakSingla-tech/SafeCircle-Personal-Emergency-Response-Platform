"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import { setAuthToken } from "@/lib/api";
import {
  UserPlus,
  Mail,
  Phone,
  User,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { AuthCard, AuthHeader, AuthFooter, AuthError } from "@/components/auth/auth-card";
import { FormField, PasswordField, PasswordStrength } from "@/components/auth/form-field";
import { AuthCheckbox } from "@/components/auth/auth-checkbox";
import { AuthSubmitButton } from "@/components/auth/auth-submit-button";
import {
  getPasswordStrength,
  isPasswordStrongEnough,
} from "@/lib/password-strength";
import { register } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Clear any existing auth state when arriving at signup
    setAuthToken(null);
    sessionStorage.removeItem("safecircle_auth_token");
  }, []);

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value.trim();
    const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim();
    const phone = (form.elements.namedItem("phone") as HTMLInputElement).value.trim();

    if (!name || !email || !phone) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!accepted) {
      setError("You must accept the terms and conditions.");
      return;
    }
    if (!password) {
      setError("Please enter a password.");
      return;
    }
    if (!isPasswordStrongEnough(strength)) {
      setError("Choose a stronger password (at least Fair strength).");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await register({ name, email, phone, password });
      toast.success("Signup Successful. Please login to continue.");
      router.push("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <AuthCard>
        <AuthHeader
          icon={<UserPlus className="h-7 w-7" />}
          title="Create your account"
          subtitle="Join SafeCircle and keep your emergency info ready."
        />

        <form className="space-y-4" noValidate onSubmit={handleSubmit}>
          <FormField id="name" name="name" label="Full name" type="text" placeholder="Jane Doe" icon={User} />
          <FormField id="email" name="email" label="Email" type="email" placeholder="you@email.com" icon={Mail} />
          <FormField id="phone" name="phone" label="Phone number" type="tel" placeholder="+1 (555) 000-0000" icon={Phone} />

          <div>
            <PasswordField
              id="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              show={showPassword}
              onToggle={() => setShowPassword((v) => !v)}
            />
            <PasswordStrength password={password} />
          </div>

          <PasswordField
            id="confirm"
            label="Confirm password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            show={showConfirm}
            onToggle={() => setShowConfirm((v) => !v)}
          />

          <div className="flex items-start gap-2.5 pt-1">
            <AuthCheckbox
              id="terms"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="mt-0.5"
            />
            <label htmlFor="terms" className="cursor-pointer text-sm leading-snug text-muted-foreground">
              I agree to the{" "}
              <a href="#" className="font-medium text-primary hover:text-primary/80">Terms & Conditions</a>{" "}
              and{" "}
              <a href="#" className="font-medium text-primary hover:text-primary/80">Privacy Policy</a>
            </label>
          </div>

          {error && <AuthError message={error} />}

          <AuthSubmitButton disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle size={18} />}
            Create account
          </AuthSubmitButton>
        </form>

        <AuthFooter>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary transition-colors hover:text-primary/80">
            Sign in
          </Link>
        </AuthFooter>
      </AuthCard>
    </AuthShell>
  );
}
