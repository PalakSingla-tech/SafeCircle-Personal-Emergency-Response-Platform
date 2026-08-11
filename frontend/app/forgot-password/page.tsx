"use client";
import { useState } from "react";
import Link from "next/link";
import { Mail, Loader2, KeyRound, CheckCircle } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { AuthCard, AuthHeader, AuthFooter, AuthError, AuthSuccess } from "@/components/auth/auth-card";
import { FormField } from "@/components/auth/form-field";
import { AuthSubmitButton } from "@/components/auth/auth-submit-button";
import { forgotPassword } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  return (
    <AuthShell>
      <AuthCard backHref="/login" backLabel="Back to sign in">
        {!success && (
          <AuthHeader
            icon={<KeyRound className="h-7 w-7" />}
            title="Forgot password?"
            subtitle="Enter your email and we'll send you a password reset link."
          />
        )}

        {success ? (
          <AuthSuccess
            icon={<CheckCircle className="h-9 w-9" />}
            title="Check your email!"
            subtitle="We've sent a password reset link to your email address."
          >
            <Link href="/login" className="block">
              <AuthSubmitButton type="button">Back to sign in</AuthSubmitButton>
            </Link>
          </AuthSuccess>
        ) : (
          <form
            className="space-y-4"
            noValidate
            onSubmit={async (e) => {
              e.preventDefault();
              setError("");
              const form = e.currentTarget;
              const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim();
              if (!email) {
                setError("Please enter your email address.");
                return;
              }
              setLoading(true);
              try {
                await forgotPassword(email);
                setSuccess(true);
              } catch (err: any) {
                setError(err.message || "Failed to send reset link");
              } finally {
                setLoading(false);
              }
            }}
          >
            <FormField
              id="email"
              name="email"
              label="Email"
              type="email"
              placeholder="you@email.com"
              icon={Mail}
            />

            {error && <AuthError message={error} />}

            <AuthSubmitButton disabled={loading}>
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <KeyRound size={18} />
              )}
              Send reset link
            </AuthSubmitButton>
          </form>
        )}

        {!success && (
          <AuthFooter>
            Remember your password?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary transition-colors hover:text-primary/80"
            >
              Sign in
            </Link>
          </AuthFooter>
        )}
      </AuthCard>
    </AuthShell>
  );
}
