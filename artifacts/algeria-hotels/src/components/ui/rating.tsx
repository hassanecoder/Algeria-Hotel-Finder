import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingProps {
  rating: number;
  max?: number;
  className?: string;
  starClassName?: string;
}

export function Rating({ rating, max = 5, className, starClassName }: RatingProps) {
  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "w-4 h-4",
            i < rating ? "fill-accent text-accent" : "fill-muted text-muted-foreground/30",
            starClassName
          )}
        />
      ))}
    </div>
  );
}
