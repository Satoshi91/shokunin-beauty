import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/ui/rating";
import { MapPin } from "lucide-react";
import type { Craftsman } from "@/lib/types";
import { formatPriceRange } from "@/lib/utils";

interface CraftsmanCardProps {
  craftsman: Craftsman;
}

export function CraftsmanCard({ craftsman }: CraftsmanCardProps) {
  return (
    <Link href={`/craftsmen/${craftsman.id}`}>
      <Card hover className="h-full">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <Avatar
              src={craftsman.profile_image_url}
              alt={craftsman.display_name}
              size="lg"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">
                {craftsman.display_name}
              </h3>
              <div className="mt-1">
                <Rating
                  value={craftsman.rating_avg}
                  size="sm"
                  reviewCount={craftsman.review_count}
                />
              </div>
              <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                <MapPin className="h-3.5 w-3.5" />
                <span>
                  {craftsman.prefecture} {craftsman.city}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <Badge variant="secondary">{craftsman.category}</Badge>
            <span className="text-sm font-medium text-gray-900">
              {formatPriceRange(craftsman.price_min, craftsman.price_max)}
            </span>
          </div>

          <p className="mt-3 text-sm text-gray-600 line-clamp-2">
            {craftsman.description}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
