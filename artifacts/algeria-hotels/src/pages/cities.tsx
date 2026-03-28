import { useGetCities } from "@workspace/api-client-react";
import { CityCard } from "@/components/city/CityCard";
import { MapPin } from "lucide-react";

export default function Cities() {
  const { data: cities, isLoading } = useGetCities();

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-6 text-foreground">
          Discover Algeria
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          From the vibrant shores of the Mediterranean to the endless golden dunes of the Sahara, 
          Algeria offers an unparalleled diversity of landscapes and cultures. Explore our top destinations.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="animate-pulse bg-card rounded-3xl aspect-square border border-border"></div>
            ))}
          </div>
        ) : cities && cities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cities.map((city, idx) => (
              <div key={city.id} className={`${idx === 0 || idx === 3 ? 'md:col-span-2 lg:col-span-2' : ''}`}>
                <CityCard city={city} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-medium">No destinations found</h3>
          </div>
        )}
      </div>
    </div>
  );
}
