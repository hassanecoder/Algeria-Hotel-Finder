import { useRoute, Link } from "wouter";
import { useGetBooking } from "@workspace/api-client-react";
import { CheckCircle2, Copy, MapPin, CalendarDays, Users, Printer } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function BookingConfirmation() {
  const [match, params] = useRoute("/booking-confirmation/:reference");
  const reference = match ? params.reference : "";
  const { toast } = useToast();

  const { data: booking, isLoading, isError } = useGetBooking(reference, {
    query: { enabled: !!reference }
  });

  if (isLoading) return <div className="min-h-screen pt-32 flex justify-center">Loading...</div>;
  if (isError || !booking) return <div className="min-h-screen pt-32 text-center text-destructive">Booking not found</div>;

  const copyRef = () => {
    navigator.clipboard.writeText(booking.reference);
    toast({ title: "Copied!", description: "Booking reference copied to clipboard." });
  };

  return (
    <div className="min-h-screen bg-muted/30 pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-10">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-4xl font-display font-bold text-foreground mb-4">Booking Confirmed!</h1>
        <p className="text-lg text-muted-foreground">
          Thank you, {booking.guestName}. Your reservation is complete. We've sent a confirmation email to {booking.guestEmail}.
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-xl">
          
          <div className="bg-secondary text-white p-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <p className="text-secondary-foreground/70 uppercase tracking-widest text-xs font-bold mb-1">Booking Reference</p>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-mono tracking-widest font-bold">{booking.reference}</span>
                <button onClick={copyRef} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                  <Copy className="w-5 h-5" />
                </button>
              </div>
            </div>
            <button className="flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl font-medium transition-colors border border-white/20">
              <Printer className="w-4 h-4 mr-2" /> Print Confirmation
            </button>
          </div>

          <div className="p-8">
            <h2 className="text-2xl font-display font-bold mb-6 border-b border-border pb-4">Reservation Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Hotel</p>
                <p className="font-bold text-lg flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> {booking.hotelName}</p>
                <p className="text-muted-foreground mt-2">{booking.roomName}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-1">Guests</p>
                <p className="font-bold text-lg flex items-center gap-2"><Users className="w-4 h-4 text-primary" /> {booking.adults} Adults{booking.children ? `, ${booking.children} Children` : ''}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8 bg-muted/50 p-6 rounded-2xl border border-border/50">
              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1.5"><CalendarDays className="w-4 h-4" /> Check-in</p>
                <p className="font-bold text-lg">{formatDate(booking.checkIn)}</p>
                <p className="text-sm text-muted-foreground">From 14:00</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1.5"><CalendarDays className="w-4 h-4" /> Check-out</p>
                <p className="font-bold text-lg">{formatDate(booking.checkOut)}</p>
                <p className="text-sm text-muted-foreground">Until 12:00</p>
              </div>
            </div>

            <div className="border-t border-border pt-6 flex justify-between items-end">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                <p className="text-3xl font-bold text-primary">{formatCurrency(booking.totalPrice, booking.currency)}</p>
              </div>
              <span className="px-4 py-1.5 bg-emerald-100 text-emerald-700 font-bold rounded-full text-sm uppercase tracking-wider">
                {booking.status}
              </span>
            </div>

          </div>
        </div>

        <div className="text-center mt-10">
          <Link href="/hotels" className="text-primary font-semibold hover:underline">
            Explore more hotels
          </Link>
        </div>
      </div>
    </div>
  );
}
