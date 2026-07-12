import React, { useState, useEffect } from 'react';
import { Search, Filter, ShoppingCart, ChevronLeft, ChevronRight, Star, Sparkles, AlertCircle } from 'lucide-react';
import { Product, CartItem } from '../types';

interface ProductsSectionProps {
  products: Product[];
  onAddToCart: (p: Product) => void;
  cartItems: CartItem[];
}

export default function ProductsSection({ products, onAddToCart, cartItems }: ProductsSectionProps) {
  // Filters State
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [maxPrice, setMaxPrice] = useState(2000);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('name'); // name, price-asc, price-desc, rating

  // Product Image Carousels State (tracks active image index per product ID)
  const [imageIndices, setImageIndices] = useState<Record<string, number>>({});

  // AI Recommendations State
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loadingAI, setLoadingAI] = useState(false);

  // Get unique categories
  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category)))];

  // Fetch AI Recommendations based on active cart or browsing context
  useEffect(() => {
    let active = true;
    const fetchRecommendations = async () => {
      setLoadingAI(true);
      try {
        const response = await fetch('/api/gemini/recommendations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cartItems })
        });
        const data = await response.json();
        if (active && data.recommendations) {
          setRecommendations(data.recommendations);
        }
      } catch (err) {
        console.error('Failed to load AI recommendations', err);
      } finally {
        if (active) setLoadingAI(false);
      }
    };

    fetchRecommendations();
    return () => { active = false; };
  }, [cartItems]);

  // Card sub-slider handlers
  const prevImage = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    const curr = imageIndices[product.id] || 0;
    const nextIdx = curr === 0 ? product.images.length - 1 : curr - 1;
    setImageIndices({ ...imageIndices, [product.id]: nextIdx });
  };

  const nextImage = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    const curr = imageIndices[product.id] || 0;
    const nextIdx = curr === product.images.length - 1 ? 0 : curr + 1;
    setImageIndices({ ...imageIndices, [product.id]: nextIdx });
  };

  // Filter products
  const filteredProducts = products
    .filter((p) => {
      const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                          p.sku.toLowerCase().includes(search.toLowerCase()) ||
                          p.description.toLowerCase().includes(search.toLowerCase());
      const matchCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchPrice = p.price <= maxPrice;
      const matchRating = p.rating >= minRating;
      return matchSearch && matchCategory && matchPrice && matchRating;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.title.localeCompare(b.title);
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

  return (
    <div className="py-12 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="font-serif text-4xl font-light text-[#D4AF37] italic tracking-wide mb-3">
          Shop Our Products
        </h1>
        <p className="text-gray-400 max-w-xl mx-auto text-xs leading-relaxed font-light tracking-wide">
          Browse luxury brands, electronics, fine instruments, and premium organics with fast delivery.
        </p>
      </div>

      {/* SEARCH, FILTER & SORT PANEL */}
      <div className="bg-[#0F0F0F] border border-[#D4AF37]/15 rounded-none p-6 mb-12 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
          {/* Search bar */}
          <div className="md:col-span-2 relative">
            <label className="block text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.2em] mb-2">Search Catalog</label>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, description, or SKU..."
                className="w-full bg-[#0A0A0A] border border-[#D4AF37]/20 rounded-none py-3 pl-10 pr-4 text-xs text-white uppercase tracking-wider focus:border-[#D4AF37] focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.2em] mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-[#D4AF37]/20 rounded-none p-3 text-xs text-white uppercase tracking-wider focus:border-[#D4AF37] focus:outline-none cursor-pointer"
            >
              <option value="name">Product Name (A-Z)</option>
              <option value="price-asc">Price (Low to High)</option>
              <option value="price-desc">Price (High to Low)</option>
              <option value="rating">Customer Rating</option>
            </select>
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.2em] mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-[#D4AF37]/20 rounded-none p-3 text-xs text-white uppercase tracking-wider focus:border-[#D4AF37] focus:outline-none cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Second row filters (Price slider, rating) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-white/5 mt-6 pt-6">
          {/* Price Range */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.2em]">Max Price</span>
              <span className="text-sm font-bold text-[#D4AF37] font-mono">${maxPrice}</span>
            </div>
            <input
              type="range"
              min="10"
              max="2000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value))}
              className="w-full accent-[#D4AF37]"
            />
          </div>

          {/* Rating filter */}
          <div>
            <span className="block text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.2em] mb-2">Minimum Rating</span>
            <div className="flex gap-2">
              {[0, 4, 4.5, 4.8].map((rate) => (
                <button
                  key={rate}
                  onClick={() => setMinRating(rate)}
                  className={`px-3 py-1.5 rounded-none text-[10px] font-bold uppercase tracking-widest cursor-pointer transition-colors border ${
                    minRating === rate
                      ? 'bg-[#D4AF37] text-[#0A0A0A] border-[#D4AF37]'
                      : 'bg-[#0A0A0A] hover:bg-white/5 text-gray-300 border-white/10'
                  }`}
                >
                  {rate === 0 ? 'Any' : `${rate}★ & Up`}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI RECOMMENDATION SPOTLIGHT */}
      <div className="bg-[#0F0F0F] border border-[#D4AF37]/25 rounded-none p-6 mb-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#D4AF37] animate-pulse" />
            <h3 className="font-serif italic text-lg text-white">AI-Powered Picks For You</h3>
          </div>
          <span className="text-[10px] uppercase text-[#D4AF37] tracking-widest font-mono">Tailored to your active cart</span>
        </div>

        {loadingAI ? (
          <div className="flex justify-center py-6">
            <div className="w-6 h-6 border-2 border-[#D4AF37] border-t-transparent rounded-none animate-spin"></div>
          </div>
        ) : recommendations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendations.map((rec) => (
              <div 
                key={rec.id} 
                onClick={() => onAddToCart(rec)}
                className="bg-[#0A0A0A] hover:bg-[#141414] border border-[#D4AF37]/15 rounded-none p-4 flex gap-4 items-center cursor-pointer transition-all"
              >
                <img 
                  src={rec.images[0]} 
                  alt={rec.title} 
                  className="w-16 h-16 object-cover rounded-none border border-white/5"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-white text-sm font-serif italic truncate">{rec.title}</h4>
                  <p className="text-[9px] text-gray-400 font-mono uppercase tracking-wider mb-1">{rec.category}</p>
                  <p className="text-sm font-bold text-[#D4AF37] font-mono">${rec.price.toFixed(2)}</p>
                </div>
                <div className="bg-[#D4AF37]/10 p-2 rounded-none text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0A0A0A] border border-[#D4AF37]/25 transition-colors">
                  <ShoppingCart className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-center text-gray-400">Loading fine recommendations from our concierge...</p>
        )}
      </div>

      {/* PRODUCTS GRID */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((prod) => {
            const activeIdx = imageIndices[prod.id] || 0;
            return (
              <div
                key={prod.id}
                className="group bg-[#0F0F0F] border border-[#D4AF37]/10 rounded-none overflow-hidden hover:border-[#D4AF37]/40 transition-all duration-300 flex flex-col justify-between hover:shadow-2xl hover:shadow-[#D4AF37]/5"
              >
                {/* Image Slider Wrapper */}
                <div className="relative h-60 w-full bg-[#0A0A0A] overflow-hidden">
                  <img
                    src={prod.images[activeIdx]}
                    alt={`${prod.title} - ${activeIdx}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Slider Arrows (only if multi-image) */}
                  {prod.images.length > 1 && (
                    <>
                      <button
                        onClick={(e) => prevImage(e, prod)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 border border-white/10 hover:bg-[#D4AF37] hover:text-[#0A0A0A] text-white p-1.5 rounded-none z-10 transition-colors cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => nextImage(e, prod)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 border border-white/10 hover:bg-[#D4AF37] hover:text-[#0A0A0A] text-white p-1.5 rounded-none z-10 transition-colors cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>

                      {/* Dots */}
                      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
                        {prod.images.map((_, dotIdx) => (
                          <div
                            key={dotIdx}
                            className={`h-0.5 transition-all rounded-none ${
                              activeIdx === dotIdx ? 'bg-[#D4AF37] w-3.5' : 'bg-white/40 w-1.5'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}

                  {/* Floating Category Tag */}
                  <span className="absolute top-4 left-4 bg-black/80 backdrop-blur-md text-[#D4AF37] text-[9px] font-bold uppercase tracking-[0.2em] px-2.5 py-1 rounded-none border border-[#D4AF37]/30">
                    {prod.category}
                  </span>
                </div>

                {/* Details */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-serif italic text-lg text-white group-hover:text-[#D4AF37] transition-colors line-clamp-1">
                        {prod.title}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-amber-400 font-bold">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="font-mono">{prod.rating}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[9px] font-mono text-gray-500 uppercase tracking-wider">SKU: {prod.sku}</span>
                      <span className={`text-[9px] font-bold uppercase tracking-wider ${prod.inventory > 3 ? 'text-green-500' : 'text-red-400'}`}>
                        {prod.inventory > 0 ? `${prod.inventory} In Stock` : 'Out Of Stock'}
                      </span>
                    </div>

                    <p className="text-gray-400 text-xs font-light line-clamp-2 mb-6 leading-relaxed">
                      {prod.description}
                    </p>
                  </div>

                  {/* Purchase Actions */}
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                    <span className="font-mono font-bold text-lg text-white">
                      ${prod.price.toFixed(2)}
                    </span>

                    <button
                      disabled={prod.inventory === 0}
                      onClick={() => onAddToCart(prod)}
                      className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest py-2.5 px-4 rounded-none transition-all cursor-pointer ${
                        prod.inventory > 0
                          ? 'bg-[#D4AF37] text-[#0A0A0A] hover:bg-[#F0C75E]'
                          : 'bg-white/5 text-gray-500 border border-white/5 cursor-not-allowed'
                      }`}
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      Add To Cart
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-[#0F0F0F] border border-[#D4AF37]/15 rounded-none">
          <AlertCircle className="w-12 h-12 text-[#D4AF37] mx-auto mb-4" />
          <h3 className="text-xl font-serif italic text-white mb-2">No matching items found</h3>
          <p className="text-gray-400 text-xs font-light tracking-wide">Try adjusting your filters or keyword query.</p>
        </div>
      )}
    </div>
  );
}
