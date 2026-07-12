import { useState } from 'react';
import { RESTAURANT_ITEMS, RestaurantItem } from '../data/mockData';
import { Product } from '../types';
import { Utensils, Star, ShoppingBag, Clock, Heart, ChefHat } from 'lucide-react';

interface RestaurantSectionProps {
  onAddToCart: (p: Product) => void;
}

export default function RestaurantSection({ onAddToCart }: RestaurantSectionProps) {
  const [activeCategory, setActiveCategory] = useState<'All' | 'Mains' | 'Appetizers' | 'Desserts'>('All');

  const filteredItems = RESTAURANT_ITEMS.filter(
    (item) => activeCategory === 'All' || item.category === activeCategory
  );

  const handleAddFoodToCart = (item: RestaurantItem) => {
    // Map restaurant food item to a virtual Product structure for checkout
    const virtualProduct: Product = {
      id: `food_${item.id}`,
      title: `${item.name} [Food Court]`,
      sku: `FD-${item.id.toUpperCase()}`,
      price: item.price,
      description: item.description,
      images: [item.image],
      category: 'Food Court',
      rating: 4.9,
      inventory: 99
    };
    onAddToCart(virtualProduct);
  };

  return (
    <div className="py-12 px-6 md:px-12 max-w-7xl mx-auto">
      {/* Editorial Header */}
      <div className="relative rounded-none overflow-hidden bg-[#0A0A0A] border border-[#D4AF37]/25 mb-16 h-72 flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
        <div className="relative z-10 text-center px-4">
          <div className="inline-flex items-center gap-2 bg-[#D4AF37]/15 border border-[#D4AF37]/35 rounded-none px-4 py-1 mb-3 text-[10px] font-bold tracking-[0.2em] text-[#D4AF37] uppercase">
            <ChefHat className="w-3.5 h-3.5 animate-pulse" />
            <span>EXQUISITE GOURMET FLAVORS</span>
          </div>
          <h1 className="font-serif italic text-4xl md:text-5xl font-light text-white mb-2">
            Elegant Bites Food Court
          </h1>
          <p className="text-gray-300 text-xs md:text-sm max-w-md mx-auto italic font-light tracking-wide leading-relaxed">
            "The quality of food and attention to detail is outstanding. Fresh ingredients with experienced chef."
          </p>
        </div>
      </div>

      {/* Categories Tabs */}
      <div className="flex justify-center gap-3 mb-12 border-b border-white/5 pb-6">
        {(['All', 'Mains', 'Appetizers', 'Desserts'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2.5 rounded-none text-xs font-bold uppercase tracking-widest cursor-pointer transition-all border ${
              activeCategory === cat
                ? 'bg-[#D4AF37] text-[#0A0A0A] border-[#D4AF37]'
                : 'bg-[#0F0F0F] text-gray-400 hover:text-white border-[#D4AF37]/15'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="group bg-[#0F0F0F] border border-[#D4AF37]/10 rounded-none overflow-hidden hover:border-[#D4AF37]/30 transition-all flex flex-col sm:flex-row shadow-lg"
          >
            {/* Food Image */}
            <div className="relative w-full sm:w-48 h-48 overflow-hidden bg-black shrink-0">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-85"
              />
              <span className="absolute top-3 left-3 bg-[#0A0A0A]/90 text-[#D4AF37] text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-none border border-[#D4AF37]/20">
                {item.category}
              </span>
            </div>

            {/* Food Details */}
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start gap-2 mb-2">
                  <h3 className="font-serif text-lg italic text-white group-hover:text-[#D4AF37] transition-colors">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-amber-400 font-bold shrink-0">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="font-mono">4.9</span>
                  </div>
                </div>

                <p className="text-gray-400 text-xs font-light leading-relaxed mb-4">
                  {item.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                <span className="font-mono font-bold text-base text-[#D4AF37]">
                  ${item.price.toFixed(2)}
                </span>

                <button
                  onClick={() => handleAddFoodToCart(item)}
                  className="flex items-center gap-2 bg-[#D4AF37] hover:bg-[#F0C75E] text-[#0A0A0A] text-[10px] font-bold uppercase tracking-widest px-4 py-2.5 rounded-none cursor-pointer transition-all duration-300"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  Order Dish
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bistro Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 pt-12 border-t border-white/5">
        <div className="bg-[#0F0F0F] p-6 rounded-none border border-[#D4AF37]/10 flex gap-4 items-start">
          <div className="bg-[#D4AF37]/10 p-3 rounded-none text-[#D4AF37] shrink-0 border border-[#D4AF37]/20">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-white font-serif italic text-sm mb-1 tracking-wide">Fast Food Prep</h4>
            <p className="text-gray-400 text-xs font-light leading-relaxed">Dishes are freshly prepared by executive chefs in 15-20 minutes, ready for hot serving or thermal delivery.</p>
          </div>
        </div>

        <div className="bg-[#0F0F0F] p-6 rounded-none border border-[#D4AF37]/10 flex gap-4 items-start">
          <div className="bg-[#D4AF37]/10 p-3 rounded-none text-[#D4AF37] shrink-0 border border-[#D4AF37]/20">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-white font-serif italic text-sm mb-1 tracking-wide">Gourmet Quality</h4>
            <p className="text-gray-400 text-xs font-light leading-relaxed">Certified organic farm vegetables, grass-fed wagyu meats, and premium cold-pressed oils only.</p>
          </div>
        </div>

        <div className="bg-[#0F0F0F] p-6 rounded-none border border-[#D4AF37]/10 flex gap-4 items-start">
          <div className="bg-[#D4AF37]/10 p-3 rounded-none text-[#D4AF37] shrink-0 border border-[#D4AF37]/20">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-white font-serif italic text-sm mb-1 tracking-wide">Hygiene Excellence</h4>
            <p className="text-gray-400 text-xs font-light leading-relaxed">Highest global restaurant safety rating with daily sanitizations and transparent kitchen standards.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
