import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { Layout } from "@/components/layout/Layout";
import Home from "@/pages/home";
import HotelsList from "@/pages/hotels-list";
import HotelDetail from "@/pages/hotel-detail";
import Cities from "@/pages/cities";
import CityDetail from "@/pages/city-detail";
import Booking from "@/pages/booking";
import BookingConfirmation from "@/pages/booking-confirmation";
import About from "@/pages/about";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    }
  }
});

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/hotels" component={HotelsList} />
        <Route path="/hotels/:id" component={HotelDetail} />
        <Route path="/cities" component={Cities} />
        <Route path="/cities/:slug" component={CityDetail} />
        <Route path="/book/:hotelId/:roomId" component={Booking} />
        <Route path="/booking-confirmation/:reference" component={BookingConfirmation} />
        <Route path="/about" component={About} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
