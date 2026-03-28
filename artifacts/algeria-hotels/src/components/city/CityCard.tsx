import { Link } from "wouter";
import type { City } from "@workspace/api-client-react";

interface CityCardProps {
  city: City;
}

export function CityCard({ city }: CityCardProps) {
  return (
    <Link
      href={`/cities/${city.slug}`}
      className="group relative block aspect-[3/4] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
    >
      <img
        src={city.imageUrl || "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800&q=80"}
        alt={city.name}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      
      <div className="absolute bottom-0 inset-x-0 p-6 text-white">
        <h3 className="font-display text-2xl font-bold mb-1">{city.name}</h3>
        <p className="text-white/80 text-sm">{city.region} • {city.hotelCount} Hotels</p>
      </div>
    </Link>
  );
}
