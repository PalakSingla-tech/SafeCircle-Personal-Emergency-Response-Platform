"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog } from "@/components/ui/dialog";
import { Mail, Loader2, KeyRound } from "lucide-react";
import { AuthHeader, AuthError } from "@/components/auth/auth-card";
import { FormField } from "@/components/auth/form-field";
import { AuthSubmitButton } from "@/components/auth/auth-submit-button";
import { startPasswordReset } from "@/lib/auth-flow";

export default function ForgotPasswordModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleClose = () => {
    setError("");
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      className="auth-gradient-border overflow-hidden border-border/40 bg-card/95 p-0 shadow-2xl shadow-primary/15 backdrop-blur-md sm:p-0"
    >
      <div className="relative p-6 sm:p-8">
        <AuthHeader
          icon={<KeyRound className="h-6 w-6" />}
          title="Reset your password"
          subtitle="Enter your email and we'll send a verification code."
        />
        <form
          className="space-y-4"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            setError("");
            const trimmed = email.trim();
            if (!trimmed) {
              setError("Please enter your email address.");
              return;
            }
            setLoading(true);
            startPasswordReset(trimmed);
            setTimeout(() => {
              setLoading(false);
              handleClose();
              router.push("/verify-otp");
            }, 500);
          }}
        >
          <FormField
            id="modal-email"
            label="Email"
            type="email"
            placeholder="you@email.com"
            icon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {error && <AuthError message={error} />}
          <AuthSubmitButton disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={18} /> : <KeyRound size={18} />}
            Send verification code
          </AuthSubmitButton>
        </form>
      </div>
    </Dialog>
  );
}
