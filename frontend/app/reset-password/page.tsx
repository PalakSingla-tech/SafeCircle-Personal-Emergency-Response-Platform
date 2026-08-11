"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, CheckCircle, Lock } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { AuthCard, AuthHeader, AuthError, AuthSuccess } from "@/components/auth/auth-card";
import { PasswordField, PasswordStrength } from "@/components/auth/form-field";
import { AuthSubmitButton } from "@/components/auth/auth-submit-button";
import { getPasswordStrength, isPasswordStrongEnough } from "@/lib/password-strength";
import { resetPassword } from "@/lib/api";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const strength = getPasswordStrength(password);

  useEffect(() => {
    if (!token) {
      router.replace("/forgot-password");
    }
  }, [token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!token) {
      setError("Invalid or missing reset token.");
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
      await resetPassword(token, password);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to reset password. The link might be expired.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <AuthCard backHref="/login" backLabel="Back to sign in">
      <AuthHeader
        icon={<Lock className="h-7 w-7" />}
        title="Set new password"
        subtitle="Choose a strong password to secure your account."
      />

      {success ? (
        <AuthSuccess
          icon={<CheckCircle className="h-9 w-9" />}
          title="Password updated!"
          subtitle="Your password has been reset successfully."
        >
          <Link href="/login" className="block">
            <AuthSubmitButton type="button">Continue to sign in</AuthSubmitButton>
          </Link>
        </AuthSuccess>
      ) : (
        <form className="space-y-4" noValidate onSubmit={handleSubmit}>
          <div>
            <PasswordField
              id="password"
              label="New password"
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
          {error && <AuthError message={error} />}
          <AuthSubmitButton disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle size={18} />}
            Save password
          </AuthSubmitButton>
        </form>
      )}
    </AuthCard>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthShell>
      <Suspense fallback={
        <div className="flex min-h-[400px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }>
        <ResetPasswordForm />
      </Suspense>
    </AuthShell>
  );
}
