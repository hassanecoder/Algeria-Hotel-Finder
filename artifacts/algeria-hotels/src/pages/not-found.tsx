import { Link } from "wouter";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-8">
          <Compass className="w-12 h-12 text-primary" />
        </div>
        <h1 className="text-5xl font-display font-bold text-foreground mb-4">404</h1>
        <h2 className="text-2xl font-bold mb-4 text-foreground">Lost in the desert?</h2>
        <p className="text-muted-foreground mb-8">
          The page you are looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        <Link 
          href="/"
          className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors inline-block shadow-lg shadow-primary/20"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
