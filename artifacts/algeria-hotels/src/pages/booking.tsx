import { useState } from "react";
import { useRoute, useLocation, Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useGetHotel, useCreateBooking } from "@workspace/api-client-react";
import { formatCurrency } from "@/lib/utils";
import { ShieldCheck, ChevronLeft, CalendarDays, Users, Bed, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const bookingSchema = z.object({
  guestName: z.string().min(2, "Name must be at least 2 characters"),
  guestEmail: z.string().email("Please enter a valid email address"),
  guestPhone: z.string().min(8, "Please enter a valid phone number"),
  checkIn: z.string().min(1, "Check-in date is required"),
  checkOut: z.string().min(1, "Check-out date is required"),
  adults: z.coerce.number().min(1, "At least 1 adult required"),
  children: z.coerce.number().min(0).default(0),
  specialRequests: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

export default function Booking() {
  const [match, params] = useRoute("/book/:hotelId/:roomId");
  const hotelId = match ? parseInt(params.hotelId) : 0;
  const roomId = match ? parseInt(params.roomId) : 0;
  
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  
  const { data: hotel, isLoading } = useGetHotel(hotelId, { query: { enabled: !!hotelId } });
  const createBooking = useCreateBooking();

  const { register, handleSubmit, watch, formState: { errors } } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      adults: 2,
      children: 0
    }
  });

  const checkInDate = watch("checkIn");
  const checkOutDate = watch("checkOut");

  const room = hotel?.rooms.find(r => r.id === roomId);

  // Very basic nights calculation
  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 1;
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const nights = calculateNights();
  const basePrice = room ? room.pricePerNight * nights : 0;
  const taxes = basePrice * 0.19; // 19% VAT example
  const total = basePrice + taxes;

  const onSubmit = async (data: BookingFormData) => {
    try {
      const response = await createBooking.mutateAsync({
        data: {
          ...data,
          hotelId,
          roomId,
        }
      });
      
      toast({
        title: "Booking Successful!",
        description: "Your reservation has been confirmed.",
      });
      
      setLocation(`/booking-confirmation/${response.reference}`);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Booking Failed",
        description: error.message || "An error occurred while creating your booking.",
      });
    }
  };

  if (isLoading) {
    return <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">Loading...</div>;
  }

  if (!hotel || !room) {
    return (
      <div className="min-h-screen pt-24 pb-16 text-center">
        <h2 className="text-2xl font-bold text-destructive mt-20">Hotel or Room not found</h2>
        <Link href="/hotels" className="text-primary hover:underline mt-4 inline-block">Return to hotels</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link href={`/hotels/${hotelId}`} className="inline-flex items-center text-muted-foreground hover:text-primary mb-8 transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to hotel
        </Link>
        
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-8">Complete your booking</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            <form id="booking-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Users className="w-5 h-5 text-primary" /> Guest Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-2">Full Name</label>
                    <input 
                      {...register("guestName")}
                      className="w-full bg-background border-2 border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                      placeholder="e.g. Lamine Tariq"
                    />
                    {errors.guestName && <p className="text-destructive text-sm mt-1">{errors.guestName.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Email Address</label>
                    <input 
                      type="email"
                      {...register("guestEmail")}
                      className="w-full bg-background border-2 border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                      placeholder="email@example.com"
                    />
                    {errors.guestEmail && <p className="text-destructive text-sm mt-1">{errors.guestEmail.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Phone Number</label>
                    <input 
                      type="tel"
                      {...register("guestPhone")}
                      className="w-full bg-background border-2 border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                      placeholder="+213 555 000 000"
                    />
                    {errors.guestPhone && <p className="text-destructive text-sm mt-1">{errors.guestPhone.message}</p>}
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><CalendarDays className="w-5 h-5 text-primary" /> Stay Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Check-in Date</label>
                    <input 
                      type="date"
                      {...register("checkIn")}
                      className="w-full bg-background border-2 border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                    />
                    {errors.checkIn && <p className="text-destructive text-sm mt-1">{errors.checkIn.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Check-out Date</label>
                    <input 
                      type="date"
                      {...register("checkOut")}
                      className="w-full bg-background border-2 border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                    />
                    {errors.checkOut && <p className="text-destructive text-sm mt-1">{errors.checkOut.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Adults</label>
                    <select 
                      {...register("adults")}
                      className="w-full bg-background border-2 border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                    >
                      {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Children</label>
                    <select 
                      {...register("children")}
                      className="w-full bg-background border-2 border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                    >
                      {[0,1,2,3,4].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
                <h2 className="text-xl font-bold mb-6">Special Requests (Optional)</h2>
                <textarea 
                  {...register("specialRequests")}
                  rows={4}
                  className="w-full bg-background border-2 border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all resize-none"
                  placeholder="E.g. early check-in, dietary requirements..."
                />
              </div>

            </form>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              
              <div className="bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
                <div className="aspect-video relative">
                  <img src={room.imageUrl || hotel.imageUrl} alt={room.name} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold shadow">
                    {hotel.name}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="font-display text-xl font-bold mb-2">{room.name}</h3>
                  <div className="flex items-center text-sm text-muted-foreground mb-6">
                    <Bed className="w-4 h-4 mr-1.5" />
                    {room.bedType} • Max {room.capacity} Guests
                  </div>

                  <div className="border-t border-border pt-6 mb-6 space-y-3">
                    <div className="flex justify-between text-muted-foreground">
                      <span>{formatCurrency(room.pricePerNight, hotel.currency)} x {nights} nights</span>
                      <span>{formatCurrency(basePrice, hotel.currency)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Taxes & Fees</span>
                      <span>{formatCurrency(taxes, hotel.currency)}</span>
                    </div>
                  </div>

                  <div className="border-t border-border pt-6 mb-8 flex justify-between items-center">
                    <span className="font-bold text-lg">Total</span>
                    <span className="font-bold text-2xl text-primary">{formatCurrency(total, hotel.currency)}</span>
                  </div>

                  <button 
                    type="submit"
                    form="booking-form"
                    disabled={createBooking.isPending}
                    className="w-full py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {createBooking.isPending ? "Processing..." : (
                      <><CreditCard className="w-5 h-5" /> Confirm Booking</>
                    )}
                  </button>
                  <p className="text-center text-xs text-muted-foreground mt-4">
                    You won't be charged yet
                  </p>
                </div>
              </div>

              <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 rounded-2xl p-5 flex gap-4">
                <ShieldCheck className="w-8 h-8 text-emerald-600 dark:text-emerald-500 shrink-0" />
                <div>
                  <h4 className="font-bold text-emerald-800 dark:text-emerald-400 mb-1">Secure Booking</h4>
                  <p className="text-sm text-emerald-700/80 dark:text-emerald-500/80">Your information is protected by industry standard encryption.</p>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
