import { useRoute, Link } from "wouter";
import { useGetHotel } from "@workspace/api-client-react";
import { MapPin, Star, Check, Wifi, Coffee, Car, Wind, Droplet, User, CalendarDays } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Rating } from "@/components/ui/rating";

export default function HotelDetail() {
  const [match, params] = useRoute("/hotels/:id");
  const id = match ? parseInt(params.id) : 0;
  
  const { data: hotel, isLoading, isError } = useGetHotel(id, {
    query: { enabled: !!id }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mt-20"></div>
      </div>
    );
  }

  if (isError || !hotel) {
    return (
      <div className="min-h-screen pt-24 pb-16 text-center">
        <h2 className="text-2xl font-bold text-destructive mt-20">Hotel not found</h2>
        <Link href="/hotels" className="text-primary hover:underline mt-4 inline-block">Return to hotels</Link>
      </div>
    );
  }

  // Map icon strings to real components (dummy logic)
  const renderIcon = (name: string) => {
    switch(name.toLowerCase()) {
      case 'wifi': return <Wifi className="w-5 h-5" />;
      case 'breakfast': return <Coffee className="w-5 h-5" />;
      case 'parking': return <Car className="w-5 h-5" />;
      case 'ac': case 'air conditioning': return <Wind className="w-5 h-5" />;
      case 'pool': return <Droplet className="w-5 h-5" />;
      default: return <Check className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header & Gallery */}
      <div className="pt-20 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Rating rating={hotel.stars} max={5} />
                {hotel.isFeatured && (
                  <span className="px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider bg-primary text-white rounded-md">
                    Featured
                  </span>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-2">
                {hotel.name}
              </h1>
              <div className="flex items-center text-muted-foreground">
                <MapPin className="w-5 h-5 mr-1.5 text-primary" />
                {hotel.address}, {hotel.city}, Algeria
              </div>
            </div>
            
            <div className="text-left md:text-right">
              <div className="flex items-center gap-2 mb-1 justify-start md:justify-end">
                <div className="bg-secondary text-white px-3 py-1.5 rounded-lg text-lg font-bold flex items-center">
                  <Star className="w-4 h-4 fill-accent text-accent mr-1.5" />
                  {hotel.rating.toFixed(1)}
                </div>
                <span className="text-sm font-medium">
                  {hotel.rating >= 4.5 ? 'Excellent' : hotel.rating >= 4 ? 'Very Good' : 'Good'}
                </span>
                <span className="text-sm text-muted-foreground underline">({hotel.reviewCount} reviews)</span>
              </div>
              <p className="text-2xl font-bold text-primary mt-2">
                {formatCurrency(hotel.pricePerNight, hotel.currency)}
                <span className="text-sm font-normal text-muted-foreground ml-1">/ night</span>
              </p>
            </div>
          </div>

          {/* Image Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8 h-[50vh] md:h-[60vh]">
            <div className="md:col-span-2 md:row-span-2 rounded-2xl overflow-hidden relative group">
              <img 
                src={hotel.imageUrl || "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80"} 
                alt={hotel.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            {hotel.images?.slice(0, 4).map((img, i) => (
              <div key={i} className="hidden md:block rounded-2xl overflow-hidden relative group">
                <img 
                  src={img || `https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80`} 
                  alt={`${hotel.name} gallery ${i}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            ))}
          </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Description */}
            <section>
              <h2 className="text-2xl font-display font-bold mb-4">About this hotel</h2>
              <div className="prose prose-lg text-muted-foreground">
                <p>{hotel.description}</p>
              </div>
            </section>

            {/* Amenities */}
            <section>
              <h2 className="text-2xl font-display font-bold mb-6">Popular Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {hotel.amenities.map(amenity => (
                  <div key={amenity} className="flex items-center gap-3 text-foreground font-medium p-3 rounded-xl bg-card border border-border shadow-sm">
                    <span className="text-primary">{renderIcon(amenity)}</span>
                    {amenity}
                  </div>
                ))}
              </div>
            </section>

            {/* Rooms */}
            <section id="rooms">
              <h2 className="text-2xl font-display font-bold mb-6">Available Rooms</h2>
              <div className="space-y-6">
                {hotel.rooms.map(room => (
                  <div key={room.id} className="bg-card rounded-2xl overflow-hidden border border-border shadow-md flex flex-col md:flex-row group">
                    <div className="w-full md:w-1/3 h-48 md:h-auto relative overflow-hidden">
                      <img 
                        src={room.imageUrl || "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80"} 
                        alt={room.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-bold mb-2">{room.name}</h3>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                          <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> {room.capacity} Guests</span>
                          <span className="flex items-center gap-1.5"><Check className="w-4 h-4" /> {room.bedType}</span>
                          <span className="flex items-center gap-1.5"><Check className="w-4 h-4" /> {room.size} m²</span>
                        </div>
                        <ul className="flex flex-wrap gap-2 mb-6">
                          {room.amenities.slice(0, 3).map(am => (
                            <li key={am} className="text-xs font-semibold px-2 py-1 bg-muted rounded-md text-foreground">{am}</li>
                          ))}
                          {room.amenities.length > 3 && (
                            <li className="text-xs font-semibold px-2 py-1 bg-muted rounded-md text-foreground">+{room.amenities.length - 3} more</li>
                          )}
                        </ul>
                      </div>
                      <div className="flex items-end justify-between border-t border-border pt-4 mt-auto">
                        <div>
                          <p className="text-2xl font-bold text-foreground">
                            {formatCurrency(room.pricePerNight, hotel.currency)}
                          </p>
                          <p className="text-xs text-muted-foreground">per night</p>
                        </div>
                        <Link 
                          href={`/book/${hotel.id}/${room.id}`}
                          className="px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                        >
                          Book Now
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Reviews */}
            <section>
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-border">
                <h2 className="text-2xl font-display font-bold">Guest Reviews</h2>
                <div className="flex items-center gap-2">
                  <div className="bg-secondary text-white px-3 py-1.5 rounded-lg text-xl font-bold">
                    {hotel.rating.toFixed(1)}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-foreground">Overall Rating</span>
                    <span className="text-sm text-muted-foreground">Based on {hotel.reviewCount} reviews</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {hotel.reviews.map(review => (
                  <div key={review.id} className="p-6 bg-card border border-border rounded-2xl">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                          {review.guestName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-foreground">{review.guestName}</p>
                          <p className="text-sm text-muted-foreground">{review.guestCountry} • {formatDate(review.date)}</p>
                        </div>
                      </div>
                      <div className="flex items-center bg-muted px-2 py-1 rounded-md">
                        <span className="font-bold mr-1">{review.rating.toFixed(1)}</span>
                        <Star className="w-3.5 h-3.5 fill-accent text-accent" />
                      </div>
                    </div>
                    {review.title && <h4 className="font-bold text-lg mb-2">{review.title}</h4>}
                    <p className="text-muted-foreground leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* Sidebar / Info */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-card border border-border rounded-2xl p-6 shadow-xl">
              <h3 className="font-display font-bold text-xl mb-6">Good to know</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-muted rounded-lg text-primary"><CalendarDays className="w-5 h-5" /></div>
                  <div>
                    <p className="font-semibold text-foreground">Check-in</p>
                    <p className="text-sm text-muted-foreground">After {hotel.checkInTime}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-muted rounded-lg text-primary"><CalendarDays className="w-5 h-5" /></div>
                  <div>
                    <p className="font-semibold text-foreground">Check-out</p>
                    <p className="text-sm text-muted-foreground">Before {hotel.checkOutTime}</p>
                  </div>
                </div>
              </div>

              {hotel.policies && (
                <div className="mb-8">
                  <h4 className="font-semibold mb-2">Policies</h4>
                  <p className="text-sm text-muted-foreground">{hotel.policies}</p>
                </div>
              )}

              <div className="bg-muted rounded-xl p-4 overflow-hidden relative h-48 mb-6 group cursor-pointer border border-border/50">
                {/* map placeholder */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80')] bg-cover bg-center opacity-50 group-hover:opacity-60 transition-opacity"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white text-primary px-4 py-2 rounded-lg font-bold shadow-lg flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> View Map
                  </div>
                </div>
              </div>

              <button 
                onClick={() => { document.getElementById('rooms')?.scrollIntoView({ behavior: 'smooth' }) }}
                className="w-full py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
              >
                See Availability
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
