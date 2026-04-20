import { cn } from "@/lib/utils";

const sizes = {
  sm: "h-6",
  md: "h-8",
  lg: "h-10",
} as const;

interface LogoProps {
  size?: keyof typeof sizes;
  className?: string;
  showText?: boolean;
}

export function Logo({ size = "md", className, showText = true }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(sizes[size], "w-auto")}
        aria-hidden
      >
        <defs>
          <linearGradient id="aq-g1" x1="16" y1="2" x2="16" y2="30" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="oklch(0.55 0.14 220)" />
            <stop offset="100%" stopColor="oklch(0.42 0.095 240)" />
          </linearGradient>
        </defs>
        <path
          d="M16 2C16 2 6 14 6 20a10 10 0 0020 0C26 14 16 2 16 2z"
          fill="url(#aq-g1)"
          opacity="0.9"
        />
        <path
          d="M16 8c0 0-5 6.5-5 10a5 5 0 0010 0c0-3.5-5-10-5-10z"
          fill="white"
          opacity="0.3"
        />
      </svg>
      {showText && (
        <span className="font-semibold tracking-tight">
          Aqua<span className="text-primary">Flow</span>
        </span>
      )}
    </span>
  );
}
