import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface GoogleButtonProps {
  loading: boolean;
  onClick: () => void;
}

export function GoogleButton({ loading, onClick }: GoogleButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      className="h-11 w-full rounded-full border-border/80 bg-background/80 font-medium shadow-sm backdrop-blur-sm transition-all hover:border-border hover:bg-muted/50 hover:shadow-md active:scale-[0.98]"
      disabled={loading}
      onClick={onClick}
    >
      {loading ? (
        <Loader2 className="animate-spin" size={18} />
      ) : (
        <svg
          width="18"
          height="18"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M47.532 24.366c0-1.636-.146-3.2-.418-4.705H24.48v9.02h12.98c-.56 3.02-2.24 5.58-4.78 7.3v6.06h7.74c4.54-4.18 7.11-10.34 7.11-17.675z"
            fill="#4285F4"
          />
          <path
            d="M24.48 48c6.48 0 11.93-2.14 15.91-5.82l-7.74-6.06c-2.15 1.44-4.9 2.3-8.17 2.3-6.28 0-11.6-4.24-13.5-9.94H2.6v6.24C6.57 43.98 14.7 48 24.48 48z"
            fill="#34A853"
          />
          <path
            d="M10.98 28.48c-.5-1.44-.78-2.98-.78-4.48s.28-3.04.78-4.48v-6.24H2.6A23.97 23.97 0 000 24c0 3.98.96 7.76 2.6 11.2l8.38-6.72z"
            fill="#FBBC05"
          />
          <path
            d="M24.48 9.52c3.52 0 6.66 1.2 9.14 3.54l6.84-6.84C36.41 2.14 30.96 0 24.48 0 14.7 0 6.57 4.02 2.6 10.8l8.38 6.24c1.9-5.7 7.22-9.52 13.5-9.52z"
            fill="#EA4335"
          />
        </svg>
      )}
      Continue with Google
    </Button>
  );
}
