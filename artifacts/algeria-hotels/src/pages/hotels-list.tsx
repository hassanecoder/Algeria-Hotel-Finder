import { useState, useEffect } from "react";
import { useSearch } from "wouter";
import { useGetHotels, useGetCities, useGetAmenities, type GetHotelsSortBy } from "@workspace/api-client-react";
import { HotelCard } from "@/components/hotel/HotelCard";
import { Filter, SlidersHorizontal, ChevronDown } from "lucide-react";

export default function HotelsList() {
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  const initialCity = searchParams.get('city') || '';

  const [city, setCity] = useState(initialCity);
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [stars, setStars] = useState<number | undefined>();
  const [sortBy, setSortBy] = useState<GetHotelsSortBy | undefined>();
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading } = useGetHotels({
    city: city || undefined,
    minPrice,
    maxPrice,
    stars,
    sortBy,
    page,
    limit: 12
  });

  const { data: cities } = useGetCities();
  
  // Create an array of star ratings to filter by
  const starFilters = [5, 4, 3, 2, 1];

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      {/* Page Header */}
      <div className="bg-secondary text-white py-12 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-5xl font-display font-bold mb-4">
            {city ? `Hotels in ${city}` : "Explore All Hotels"}
          </h1>
          <p className="text-white/80 max-w-2xl text-lg">
            Find the perfect place to stay in Algeria. Browse our comprehensive directory of hotels, resorts, and guesthouses.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden flex justify-between items-center bg-card p-4 rounded-xl border border-border shadow-sm">
            <span className="font-semibold">Filters</span>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 bg-muted rounded-lg text-primary"
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>

          {/* Sidebar Filters */}
          <aside className={`w-full lg:w-72 shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm sticky top-24">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border">
                <SlidersHorizontal className="w-5 h-5 text-primary" />
                <h2 className="font-display font-semibold text-lg">Filters</h2>
              </div>

              {/* City Filter */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Destination</h3>
                <select 
                  value={city}
                  onChange={(e) => { setCity(e.target.value); setPage(1); }}
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                >
                  <option value="">All Cities</option>
                  {cities?.map(c => (
                    <option key={c.id} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Star Rating Filter */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Star Rating</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="stars" 
                      checked={stars === undefined}
                      onChange={() => { setStars(undefined); setPage(1); }}
                      className="w-4 h-4 text-primary focus:ring-primary border-border" 
                    />
                    <span className="text-muted-foreground group-hover:text-foreground transition-colors">Any Rating</span>
                  </label>
                  {starFilters.map(star => (
                    <label key={star} className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="radio" 
                        name="stars" 
                        checked={stars === star}
                        onChange={() => { setStars(star); setPage(1); }}
                        className="w-4 h-4 text-primary focus:ring-primary border-border" 
                      />
                      <div className="flex items-center gap-1">
                        {Array.from({length: star}).map((_, i) => (
                          <span key={i} className="text-accent text-lg leading-none">★</span>
                        ))}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Filter (Simplified) */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Price Range (DZD)</h3>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    placeholder="Min" 
                    value={minPrice || ''}
                    onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary"
                  />
                  <span className="text-muted-foreground">-</span>
                  <input 
                    type="number" 
                    placeholder="Max" 
                    value={maxPrice || ''}
                    onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
              
              <button 
                onClick={() => {
                  setCity(''); setMinPrice(undefined); setMaxPrice(undefined); setStars(undefined); setPage(1);
                }}
                className="w-full py-2.5 text-sm font-medium text-destructive bg-destructive/10 hover:bg-destructive/20 rounded-xl transition-colors mt-4"
              >
                Clear Filters
              </button>
            </div>
          </aside>

          {/* Results Area */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <p className="text-muted-foreground">
                {isLoading ? "Searching..." : `Showing ${data?.hotels.length || 0} of ${data?.total || 0} hotels`}
              </p>
              
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-muted-foreground">Sort by:</label>
                <div className="relative">
                  <select 
                    value={sortBy || ''}
                    onChange={(e) => setSortBy(e.target.value as GetHotelsSortBy || undefined)}
                    className="appearance-none bg-card border border-border rounded-xl pl-4 pr-10 py-2 focus:outline-none focus:border-primary text-sm font-medium cursor-pointer"
                  >
                    <option value="">Recommended</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="rating_desc">Top Rated</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="animate-pulse bg-card rounded-2xl h-80 border border-border"></div>
                ))}
              </div>
            ) : data && data.hotels.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data.hotels.map(hotel => (
                    <HotelCard key={hotel.id} hotel={hotel} />
                  ))}
                </div>
                
                {/* Pagination */}
                {data.totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-12">
                    <button 
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 rounded-xl border border-border bg-card text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors font-medium"
                    >
                      Previous
                    </button>
                    <div className="flex gap-1 mx-4">
                      {Array.from({length: Math.min(5, data.totalPages)}).map((_, i) => {
                        // Simple pagination logic for demo
                        const p = i + 1;
                        return (
                          <button
                            key={p}
                            onClick={() => setPage(p)}
                            className={`w-10 h-10 rounded-xl font-medium transition-colors ${page === p ? 'bg-primary text-white' : 'bg-card border border-border hover:bg-muted'}`}
                          >
                            {p}
                          </button>
                        );
                      })}
                    </div>
                    <button 
                      onClick={() => setPage(p => Math.min(data.totalPages, p + 1))}
                      disabled={page === data.totalPages}
                      className="px-4 py-2 rounded-xl border border-border bg-card text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors font-medium"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20 bg-card rounded-3xl border border-border border-dashed">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-display font-bold text-foreground mb-2">No hotels found</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-8">
                  We couldn't find any hotels matching your current filters. Try changing your destination or adjusting your price range.
                </p>
                <button 
                  onClick={() => {
                    setCity(''); setMinPrice(undefined); setMaxPrice(undefined); setStars(undefined);
                  }}
                  className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
