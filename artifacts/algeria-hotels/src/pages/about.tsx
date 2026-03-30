import { MapPin, ShieldCheck, HeartHandshake } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative h-[60vh] flex items-center justify-center pt-20">
        <img 
          src={`${import.meta.env.BASE_URL}images/about-hero.png`} 
          alt="Sahara Oasis"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-6">
            Our Story
          </h1>
          <p className="text-xl text-white/90 leading-relaxed">
            Connecting travelers to the authentic beauty, culture, and hospitality of Algeria.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <h2 className="text-3xl font-display font-bold mb-6 text-foreground">Pioneering Tourism in Algeria</h2>
            <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
              <p>
                Algeria Hotels was born from a simple vision: to make the majestic landscapes 
                and rich cultural heritage of Africa's largest country accessible to the world.
              </p>
              <p>
                We curate the finest accommodations, from modern luxury resorts on the azure 
                Mediterranean coast to traditional riads in the heart of ancient medinas, and 
                breathtaking desert camps in the deep Sahara.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80" alt="Hotel Interior" className="rounded-2xl w-full h-64 object-cover" />
            <img src="https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&q=80" alt="Resort Pool" className="rounded-2xl w-full h-64 object-cover mt-8" />
          </div>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-card border border-border p-8 rounded-3xl text-center shadow-sm hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
              <MapPin className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-4">Local Expertise</h3>
            <p className="text-muted-foreground">Deeply rooted in Algeria, our team ensures you experience the true essence of each destination.</p>
          </div>
          
          <div className="bg-card border border-border p-8 rounded-3xl text-center shadow-sm hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-4">Trusted Quality</h3>
            <p className="text-muted-foreground">Every property in our directory is verified to meet international hospitality standards.</p>
          </div>

          <div className="bg-card border border-border p-8 rounded-3xl text-center shadow-sm hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
              <HeartHandshake className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-4">Dedicated Support</h3>
            <p className="text-muted-foreground">Our customer service team is available around the clock to assist with your reservations.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
