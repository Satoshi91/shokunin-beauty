import * as React from "react";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  size?: "sm" | "default" | "lg" | "xl";
  fallback?: string;
}

function Avatar({
  className,
  src,
  alt,
  size = "default",
  fallback,
  ...props
}: AvatarProps) {
  const [hasError, setHasError] = React.useState(false);

  const sizes = {
    sm: "h-8 w-8 text-xs",
    default: "h-10 w-10 text-sm",
    lg: "h-14 w-14 text-base",
    xl: "h-20 w-20 text-lg",
  };

  const iconSizes = {
    sm: "h-4 w-4",
    default: "h-5 w-5",
    lg: "h-7 w-7",
    xl: "h-10 w-10",
  };

  const showFallback = !src || hasError;

  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100",
        sizes[size],
        className
      )}
      {...props}
    >
      {showFallback ? (
        fallback ? (
          <span className="font-medium text-gray-600">
            {fallback.slice(0, 2).toUpperCase()}
          </span>
        ) : (
          <User className={cn("text-gray-400", iconSizes[size])} />
        )
      ) : (
        <img
          src={src}
          alt={alt || "Avatar"}
          className="h-full w-full object-cover"
          onError={() => setHasError(true)}
        />
      )}
    </div>
  );
}

export { Avatar };
