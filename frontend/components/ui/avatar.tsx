import { cn } from "@/lib/utils";

function Avatar({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative flex h-9 w-9 shrink-0 overflow-hidden rounded-full bg-muted",
        className
      )}
      {...props}
    />
  );
}

function AvatarImage({
  className,
  src,
  alt,
}: {
  className?: string;
  src: string;
  alt?: string;
}) {
  return (
    <img
      src={src}
      alt={alt ?? ""}
      className={cn("aspect-square h-full w-full object-cover", className)}
    />
  );
}

function AvatarFallback({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary",
        className
      )}
    >
      {children}
    </div>
  );
}

export { Avatar, AvatarImage, AvatarFallback };
