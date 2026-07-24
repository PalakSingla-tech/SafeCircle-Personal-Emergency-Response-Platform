"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, Loader2, RefreshCw, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { AuthShell } from "@/components/auth/auth-shell";
import { AuthCard, AuthHeader, AuthError } from "@/components/auth/auth-card";
import { AuthSubmitButton } from "@/components/auth/auth-submit-button";
import {
  getResetEmail,
  maskEmail,
  startPasswordReset,
  verifyOtp,
} from "@/lib/auth-flow";

function pad(num: number) {
  return num.toString().padStart(2, "0");
}

export default function VerifyOtpPage() {
  const router = useRouter();
  // Read email synchronously — sessionStorage is available on client
  const [email, setEmail] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return getResetEmail();
  });
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(59);
  const [resendEnabled, setResendEnabled] = useState(false);
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  // Redirect to forgot-password if no email in sessionStorage
  useEffect(() => {
    if (!getResetEmail()) {
      router.replace("/forgot-password");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (timer > 0) {
      setResendEnabled(false);
      const t = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(t);
    }
    setResendEnabled(true);
  }, [timer]);

  const handleChange = (i: number, val: string) => {
    if (!/^[0-9]?$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[i] = val;
    setOtp(newOtp);
    setError("");
    if (val && i < 5) inputs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      inputs.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const newOtp = [...otp];
    for (let i = 0; i < 6; i++) newOtp[i] = pasted[i] ?? "";
    setOtp(newOtp);
    setError("");
    inputs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleResend = () => {
    if (!email) return;
    startPasswordReset(email);
    setTimer(59);
    setOtp(["", "", "", "", "", ""]);
    setError("");
    setResendEnabled(false);
    inputs.current[0]?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const code = otp.join("");
    if (code.length !== 6) {
      setError("Please enter the full 6-digit code.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      if (verifyOtp(code)) {
        router.push("/reset-password");
      } else {
        setError("Invalid verification code. Use 123456 for demo.");
        setLoading(false);
      }
    }, 600);
  };

  if (!email) {
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
      <AuthCard backHref="/forgot-password" backLabel="Back">
        <AuthHeader
          icon={<KeyRound className="h-7 w-7" />}
          title="Check your email"
          subtitle={`We sent a 6-digit code to ${maskEmail(email)}.`}
        />

        <div className="mb-6 flex items-center justify-center gap-2 rounded-xl border border-border/60 bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
          <Mail className="h-4 w-4 shrink-0 text-primary" />
          <span>Demo code: <strong className="text-foreground">123456</strong></span>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex justify-center gap-2 sm:gap-2.5" onPaste={handlePaste}>
            {otp.map((val, i) => (
              <input
                key={i}
                ref={(el) => { inputs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                className={cn("auth-otp-input", val && "auth-otp-input-filled")}
                value={val}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                required
              />
            ))}
          </div>

          {error && <AuthError message={error} />}

          <div className="flex items-center justify-between rounded-xl bg-muted/30 px-4 py-3">
            <span className="text-sm tabular-nums text-muted-foreground">
              {resendEnabled ? "Code expired" : <>Resend in 00:{pad(timer)}</>}
            </span>
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-full px-2 py-1 text-sm font-medium text-primary transition-colors hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-40"
              onClick={handleResend}
              disabled={!resendEnabled}
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Resend code
            </button>
          </div>

          <AuthSubmitButton disabled={loading || otp.some((d) => !d)}>
            {loading ? <Loader2 className="animate-spin" size={18} /> : <KeyRound size={18} />}
            Verify code
          </AuthSubmitButton>
        </form>
      </AuthCard>
    </AuthShell>
  );
}
