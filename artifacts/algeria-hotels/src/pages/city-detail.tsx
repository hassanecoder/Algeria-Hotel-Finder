import { useRoute } from "wouter";
import { useGetCity } from "@workspace/api-client-react";
import { HotelCard } from "@/components/hotel/HotelCard";

export default function CityDetail() {
  const [match, params] = useRoute("/cities/:slug");
  const slug = match ? params.slug : "";

  const { data: city, isLoading, isError } = useGetCity(slug, {
    query: { enabled: !!slug }
  });

  if (isLoading) return <div className="min-h-screen pt-32 flex justify-center">Loading...</div>;
  if (isError || !city) return <div className="min-h-screen pt-32 text-center text-destructive">City not found</div>;

  return (
    <div className="min-h-screen bg-background pb-20">
      
      {/* Hero */}
      <div className="relative h-[60vh] flex items-center justify-center">
        <img 
          src={city.imageUrl || "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=1600&q=80"} 
          alt={city.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-black/50 to-transparent" />
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-20">
          <span className="text-primary font-bold tracking-widest uppercase mb-4 block">Destination</span>
          <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 drop-shadow-lg">
            {city.name}
            {city.nameAr && <span className="block text-4xl mt-2 font-normal opacity-90">{city.nameAr}</span>}
          </h1>
          <p className="text-xl text-white/90 text-shadow-md">
            {city.region} Region
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
        <div className="bg-card border border-border shadow-xl rounded-3xl p-8 md:p-12 mb-16 max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-display font-bold mb-4">About {city.name}</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {city.description}
          </p>
        </div>

        <div className="mb-12 flex justify-between items-end border-b border-border pb-4">
          <div>
            <h2 className="text-3xl font-display font-bold">Hotels in {city.name}</h2>
            <p className="text-muted-foreground mt-2">{city.hotels.length} properties available</p>
          </div>
        </div>

        {city.hotels.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {city.hotels.map(hotel => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-muted/30 rounded-3xl border border-border border-dashed">
            <h3 className="text-xl font-medium mb-2">No hotels found in this city yet</h3>
            <p className="text-muted-foreground">We are working on adding more properties to our directory.</p>
          </div>
        )}
      </div>

    </div>
  );
}
