export const DEMO_OTP = "123456";
const RESET_EMAIL_KEY = "safecircle_reset_email";
const OTP_VERIFIED_KEY = "safecircle_otp_verified";

export function maskEmail(email: string) {
  const [user, domain] = email.split("@");
  if (!user || !domain) return email;
  const visible = user.length <= 2 ? user[0] : `${user.slice(0, 2)}***${user.slice(-1)}`;
  return `${visible}@${domain}`;
}

export function startPasswordReset(email: string) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(RESET_EMAIL_KEY, email.trim().toLowerCase());
  sessionStorage.removeItem(OTP_VERIFIED_KEY);
}

export function getResetEmail() {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(RESET_EMAIL_KEY);
}

export function verifyOtp(code: string) {
  if (code !== DEMO_OTP) return false;
  if (typeof window === "undefined") return false;
  sessionStorage.setItem(OTP_VERIFIED_KEY, "true");
  return true;
}

export function isOtpVerified() {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(OTP_VERIFIED_KEY) === "true";
}

export function clearPasswordReset() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(RESET_EMAIL_KEY);
  sessionStorage.removeItem(OTP_VERIFIED_KEY);
}
