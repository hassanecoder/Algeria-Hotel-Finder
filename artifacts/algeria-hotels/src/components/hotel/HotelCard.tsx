import { Link } from "wouter";
import { MapPin, Star, Heart } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { Hotel } from "@workspace/api-client-react";
import { Rating } from "../ui/rating";

interface HotelCardProps {
  hotel: Hotel;
}

export function HotelCard({ hotel }: HotelCardProps) {
  return (
    <Link 
      href={`/hotels/${hotel.id}`}
      className="group block bg-card rounded-2xl overflow-hidden border border-border/50 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {/* Fallback to unsplash if no image URL, though schema says it has imageUrl */}
        <img 
          src={hotel.imageUrl || "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80"} 
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <button className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-destructive transition-colors">
          <Heart className="w-4 h-4" />
        </button>
        {hotel.isFeatured && (
          <div className="absolute top-4 left-4 px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-primary text-white rounded-full">
            Featured
          </div>
        )}
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-display font-semibold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {hotel.name}
            </h3>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <MapPin className="w-3.5 h-3.5 mr-1" />
              {hotel.city}, Algeria
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center bg-secondary text-white px-2 py-1 rounded-md text-sm font-bold">
              <Star className="w-3.5 h-3.5 fill-accent text-accent mr-1" />
              {hotel.rating.toFixed(1)}
            </div>
            <span className="text-xs text-muted-foreground mt-1">
              {hotel.reviewCount} reviews
            </span>
          </div>
        </div>
        
        <Rating rating={hotel.stars} max={5} className="mb-4" />
        
        <div className="flex items-end justify-between pt-4 border-t border-border/50 mt-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase font-medium tracking-wide">Starting from</p>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-foreground">
                {formatCurrency(hotel.pricePerNight, hotel.currency)}
              </span>
              <span className="text-sm text-muted-foreground">/night</span>
            </div>
          </div>
          <div className="text-primary font-medium text-sm group-hover:underline">
            View Details
          </div>
        </div>
      </div>
    </Link>
  );
}
