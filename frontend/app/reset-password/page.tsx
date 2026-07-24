"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, CheckCircle, Lock } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { AuthCard, AuthHeader, AuthError, AuthSuccess } from "@/components/auth/auth-card";
import { PasswordField, PasswordStrength } from "@/components/auth/form-field";
import { AuthSubmitButton } from "@/components/auth/auth-submit-button";
import { clearPasswordReset, getResetEmail, isOtpVerified } from "@/lib/auth-flow";
import { getPasswordStrength, isPasswordStrongEnough } from "@/lib/password-strength";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const strength = getPasswordStrength(password);

  useEffect(() => {
    if (!getResetEmail() || !isOtpVerified()) {
      router.replace("/forgot-password");
      return;
    }
    setReady(true);
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!isPasswordStrongEnough(strength)) {
      setError("Choose a stronger password (at least Fair strength).");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      clearPasswordReset();
      setLoading(false);
      setSuccess(true);
    }, 600);
  };

  if (!ready) {
    return (
      <AuthShell>
        <div className="flex min-h-[400px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
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
    </AuthShell>
  );
}
