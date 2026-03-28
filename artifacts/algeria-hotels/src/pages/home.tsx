import { useState } from "react";
import { useLocation } from "wouter";
import { Search, MapPin, Calendar, Users, ArrowRight, Compass } from "lucide-react";
import { motion } from "framer-motion";
import { useGetFeaturedHotels, useGetCities } from "@workspace/api-client-react";
import { HotelCard } from "@/components/hotel/HotelCard";
import { CityCard } from "@/components/city/CityCard";

export default function Home() {
  const [_, setLocation] = useLocation();
  const [searchCity, setSearchCity] = useState("");
  
  const { data: featuredHotels, isLoading: loadingHotels } = useGetFeaturedHotels();
  const { data: cities, isLoading: loadingCities } = useGetCities();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLocation(`/hotels${searchCity ? `?city=${encodeURIComponent(searchCity)}` : ''}`);
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-20">
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`}
            alt="Algeria Mediterranean Hotel" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-secondary/40 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-background" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-6 leading-tight drop-shadow-lg"
          >
            Discover the Magic <br />
            <span className="italic text-white/90">of Algeria</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-12 drop-shadow-md"
          >
            From the Mediterranean coast to the golden dunes of the Sahara, book your perfect stay.
          </motion.p>

          {/* Search Box */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-card p-4 md:p-6 rounded-3xl shadow-2xl max-w-5xl mx-auto border border-border/50"
          >
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative flex items-center bg-muted/50 rounded-xl px-4 py-3">
                <MapPin className="w-5 h-5 text-primary mr-3 shrink-0" />
                <div className="w-full text-left">
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Location</label>
                  <select 
                    value={searchCity}
                    onChange={(e) => setSearchCity(e.target.value)}
                    className="w-full bg-transparent border-none text-foreground font-medium focus:ring-0 outline-none p-0 cursor-pointer appearance-none"
                  >
                    <option value="">Where to?</option>
                    <option value="algiers">Algiers</option>
                    <option value="oran">Oran</option>
                    <option value="constantine">Constantine</option>
                    <option value="tamanrasset">Tamanrasset</option>
                  </select>
                </div>
              </div>
              
              <div className="relative flex items-center bg-muted/50 rounded-xl px-4 py-3">
                <Calendar className="w-5 h-5 text-primary mr-3 shrink-0" />
                <div className="w-full text-left">
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Check In</label>
                  <input type="date" className="w-full bg-transparent border-none text-foreground font-medium focus:ring-0 outline-none p-0" />
                </div>
              </div>

              <div className="relative flex items-center bg-muted/50 rounded-xl px-4 py-3">
                <Users className="w-5 h-5 text-primary mr-3 shrink-0" />
                <div className="w-full text-left">
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Guests</label>
                  <select className="w-full bg-transparent border-none text-foreground font-medium focus:ring-0 outline-none p-0 cursor-pointer appearance-none">
                    <option>2 Adults, 0 Children</option>
                    <option>1 Adult, 0 Children</option>
                    <option>2 Adults, 1 Child</option>
                    <option>2 Adults, 2 Children</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit"
                className="bg-primary text-primary-foreground rounded-xl flex items-center justify-center font-semibold text-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30 py-4 md:py-0"
              >
                <Search className="w-5 h-5 mr-2" />
                Search
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Featured Hotels */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">Handpicked Stays</h2>
              <p className="text-muted-foreground max-w-2xl">Discover our selection of premium accommodations offering the finest Algerian hospitality.</p>
            </div>
            <button 
              onClick={() => setLocation('/hotels')}
              className="hidden md:flex items-center text-primary font-semibold hover:text-primary/80 transition-colors"
            >
              View all <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>

          {loadingHotels ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="animate-pulse bg-card rounded-2xl h-80 border border-border"></div>
              ))}
            </div>
          ) : featuredHotels && featuredHotels.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredHotels.slice(0, 4).map(hotel => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted/30 rounded-2xl border border-border border-dashed">
              <Compass className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No featured hotels found</h3>
              <p className="text-muted-foreground">Check back later for our curated picks.</p>
            </div>
          )}
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-24 bg-muted/30 border-t border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">Explore Destinations</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">From the Mediterranean white cities to the ancient desert oases.</p>
          </div>

          {loadingCities ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="animate-pulse bg-card rounded-2xl aspect-[3/4] border border-border"></div>
              ))}
            </div>
          ) : cities && cities.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {cities.slice(0, 4).map(city => (
                <CityCard key={city.id} city={city} />
              ))}
            </div>
          ) : null}
          
          <div className="mt-12 text-center">
            <button 
              onClick={() => setLocation('/cities')}
              className="px-8 py-3 rounded-full border-2 border-primary text-primary font-semibold hover:bg-primary hover:text-white transition-colors"
            >
              See all destinations
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
