import * as React from "react";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

export interface RatingProps {
  value: number;
  max?: number;
  size?: "sm" | "default" | "lg";
  showValue?: boolean;
  reviewCount?: number;
  className?: string;
}

function Rating({
  value,
  max = 5,
  size = "default",
  showValue = true,
  reviewCount,
  className,
}: RatingProps) {
  const sizes = {
    sm: "h-3 w-3",
    default: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const textSizes = {
    sm: "text-xs",
    default: "text-sm",
    lg: "text-base",
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex">
        {Array.from({ length: max }).map((_, i) => {
          const filled = i < Math.floor(value);
          const partial = i === Math.floor(value) && value % 1 > 0;

          return (
            <span key={i} className="relative">
              <Star
                className={cn(
                  sizes[size],
                  filled ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                )}
              />
              {partial && (
                <span
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${(value % 1) * 100}%` }}
                >
                  <Star
                    className={cn(sizes[size], "fill-yellow-400 text-yellow-400")}
                  />
                </span>
              )}
            </span>
          );
        })}
      </div>
      {showValue && (
        <span className={cn("font-medium text-gray-700", textSizes[size])}>
          {value.toFixed(1)}
        </span>
      )}
      {reviewCount !== undefined && (
        <span className={cn("text-gray-500", textSizes[size])}>
          ({reviewCount}件)
        </span>
      )}
    </div>
  );
}

export { Rating };
