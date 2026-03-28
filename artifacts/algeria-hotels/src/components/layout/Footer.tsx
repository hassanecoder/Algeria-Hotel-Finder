import { Link } from "wouter";
import { Facebook, Instagram, Twitter, MapPin, Mail, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <img 
                  src={`${import.meta.env.BASE_URL}images/logo.png`} 
                  alt="Algeria Hotels" 
                  className="w-6 h-6 object-contain invert"
                />
              </div>
              <span className="font-display text-xl font-bold">Algeria Hotels</span>
            </div>
            <p className="text-secondary-foreground/70 leading-relaxed text-sm">
              Discover the beauty of Algeria. Book premium hotels, resorts, and riads across the Mediterranean coast and the majestic Sahara.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-display font-semibold text-lg mb-6 text-white">Quick Links</h3>
            <ul className="space-y-4">
              <li><Link href="/hotels" className="text-secondary-foreground/70 hover:text-primary transition-colors">Browse Hotels</Link></li>
              <li><Link href="/cities" className="text-secondary-foreground/70 hover:text-primary transition-colors">Destinations</Link></li>
              <li><Link href="/about" className="text-secondary-foreground/70 hover:text-primary transition-colors">About Us</Link></li>
              <li><a href="#" className="text-secondary-foreground/70 hover:text-primary transition-colors">Special Offers</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-semibold text-lg mb-6 text-white">Popular Cities</h3>
            <ul className="space-y-4">
              <li><Link href="/cities/algiers" className="text-secondary-foreground/70 hover:text-primary transition-colors">Algiers</Link></li>
              <li><Link href="/cities/oran" className="text-secondary-foreground/70 hover:text-primary transition-colors">Oran</Link></li>
              <li><Link href="/cities/constantine" className="text-secondary-foreground/70 hover:text-primary transition-colors">Constantine</Link></li>
              <li><Link href="/cities/tamanrasset" className="text-secondary-foreground/70 hover:text-primary transition-colors">Tamanrasset</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-semibold text-lg mb-6 text-white">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-secondary-foreground/70">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>123 Didouche Mourad Street,<br/>Algiers 16000, Algeria</span>
              </li>
              <li className="flex items-center gap-3 text-secondary-foreground/70">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span>+213 21 00 00 00</span>
              </li>
              <li className="flex items-center gap-3 text-secondary-foreground/70">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span>contact@algeriahotels.com</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-secondary-foreground/50">
          <p>© {new Date().getFullYear()} Algeria Hotels. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
