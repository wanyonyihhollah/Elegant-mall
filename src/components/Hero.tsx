import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Sparkles, Building, Bookmark } from 'lucide-react';

interface HeroProps {
  onExplore: () => void;
  onFoodCourt: () => void;
}

const SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80',
    title: 'Experience Pure Elegance',
    subtitle: 'Step into a world of curated style, high-end brands, and luxury shopping under one majestic roof.'
  },
  {
    image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=1200&q=80',
    title: 'Curated Designer Apparel',
    subtitle: 'Discover the latest premium seasonal lines, luxury boutiques, and accessories from global fashion houses.'
  },
  {
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    title: 'Gourmet Culinary Art',
    subtitle: 'From signature Wagyu burgers to fine artisanal coffees, experience dining crafted by world-class chefs.'
  },
  {
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80',
    title: 'Seamless Digital Retail',
    subtitle: 'Order directly from our smart online storefront for same-day premium home packaging and shipping.'
  }
];

export default function Hero({ onExplore, onFoodCourt }: HeroProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[85vh] flex items-center justify-center overflow-hidden bg-black">
      {/* Background Slideshow */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 0.5, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${SLIDES[current].image})` }}
        />
      </AnimatePresence>

      {/* Gold radial overlay */}
      <div className="absolute inset-0 bg-radial from-transparent via-[#0A0A0A]/80 to-[#0A0A0A]" />

      {/* Hero Content */}
      <div className="relative z-10 max-w-4xl text-center px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-none px-4 py-1.5 mb-6 text-[10px] font-bold tracking-[0.2em] text-[#D4AF37] uppercase"
        >
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>Welcome to Elegant Mall</span>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-serif text-5xl md:text-7xl font-light italic leading-[1.1] text-white mb-6">
              {SLIDES[current].title.split(' ').map((w, i) => i === 2 ? <span key={i} className="text-[#D4AF37] not-italic font-normal block md:inline">{w} </span> : w + ' ')}
            </h1>
            <p className="text-gray-300 text-sm md:text-base max-w-xl mx-auto mb-10 leading-relaxed font-light tracking-wide">
              {SLIDES[current].subtitle}
            </p>
          </motion.div>
        </AnimatePresence>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button
            onClick={onExplore}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#D4AF37] text-[#0A0A0A] font-bold text-xs uppercase tracking-widest px-8 py-4 rounded-none hover:bg-[#F0C75E] transition-all cursor-pointer duration-300"
          >
            <Building className="w-4 h-4" />
            Explore Products
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <button
            onClick={onFoodCourt}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-transparent border border-[#D4AF37] text-[#D4AF37] font-bold text-xs uppercase tracking-widest px-8 py-4 rounded-none hover:bg-[#D4AF37]/5 transition-all cursor-pointer duration-300"
          >
            <Bookmark className="w-4 h-4 text-[#D4AF37]" />
            Order Food Court
          </button>
        </motion.div>
      </div>

      {/* Carousel Dots */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2.5 z-20">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1 transition-all duration-300 cursor-pointer rounded-none ${
              current === i ? 'bg-[#D4AF37] w-8' : 'bg-white/30 hover:bg-white/50 w-3'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
