import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductsSection from './components/ProductsSection';
import RestaurantSection from './components/RestaurantSection';
import PromotionsSection from './components/PromotionsSection';
import CartSection from './components/CartSection';
import LoginSection from './components/LoginSection';
import AdminPanel from './components/AdminPanel';
import ChatBot from './components/ChatBot';
import ScrollToTop from './components/ScrollToTop';
import Footer from './components/Footer';
import { Product, Order, Promotion, User, CartItem } from './types';
import { Landmark, ArrowUpRight, Star, Shield, HelpCircle, Package, Store, Utensils, Sparkles } from 'lucide-react';

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('home');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  // Auth state
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Applied Coupon state
  const [activePromoCode, setActivePromoCode] = useState<string>('');

  // Synchronize data from Express fullstack server
  const fetchAllData = async () => {
    try {
      const [productsRes, ordersRes, promotionsRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/orders'),
        fetch('/api/promotions')
      ]);

      if (productsRes.ok) setProducts(await productsRes.json());
      if (ordersRes.ok) setOrders(await ordersRes.json());
      if (promotionsRes.ok) setPromotions(await promotionsRes.json());
    } catch (err) {
      console.error('Error synchronizing data with backend server', err);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Sync session auth state
  useEffect(() => {
    const savedUser = localStorage.getItem('elegant_user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('elegant_user');
      }
    }
  }, []);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('elegant_user', JSON.stringify(user));
    if (user.role === 'admin') {
      setActiveSection('admin');
    } else {
      setActiveSection('home');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('elegant_user');
    setActiveSection('home');
  };

  // Cart operations
  const handleAddToCart = (product: Product) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.product.id === product.id);
      if (existing) {
        return prevItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(item.product.inventory, item.quantity + 1) }
            : item
        );
      }
      return [...prevItems, { product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) => {
          if (item.product.id === productId) {
            const nextQty = item.quantity + delta;
            return { ...item, quantity: nextQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
    setActivePromoCode('');
    setActiveSection('home');
  };

  const handleOrderSubmitted = () => {
    // Refresh catalog and orders to represent updated inventories
    fetchAllData();
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#0A0A0A] text-[#F5F5F5] overflow-x-hidden">
      {/* Sticky Premium Header Navbar */}
      <Navbar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        cartCount={cartCount}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Render Deck */}
      <main className="flex-grow">
        {activeSection === 'home' && (
          <div className="space-y-24 pb-20">
            {/* Elegant Slideshow Hero */}
            <Hero
              onExplore={() => setActiveSection('products')}
              onFoodCourt={() => setActiveSection('restaurant')}
            />

            {/* Premium Category Spotlights */}
            <section className="max-w-7xl mx-auto px-6 md:px-12">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-1.5 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-none px-4 py-1.5 mb-3 text-[10px] font-bold tracking-[0.2em] uppercase text-[#D4AF37]">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  <span>The Prestige Destination</span>
                </div>
                <h2 className="font-serif text-4xl font-light text-[#D4AF37] italic tracking-wide mb-4">
                  Explore Elegant Venues
                </h2>
                <p className="text-gray-400 max-w-xl mx-auto text-xs leading-relaxed font-light tracking-wide">
                  Step inside the premier sectors of Elegant Mall. Curated high-fashion, specialized instruments, and Michelin-inspired bistro cuisines await you.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Fashion & Acc Card */}
                <div 
                  onClick={() => setActiveSection('products')}
                  className="group relative h-96 rounded-none overflow-hidden border border-[#D4AF37]/10 hover:border-[#D4AF37]/50 transition-all cursor-pointer shadow-xl bg-[#0F0F0F]"
                >
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-60"
                    style={{ backgroundImage: `url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="text-[9px] font-mono text-[#D4AF37] uppercase tracking-widest font-bold">Fashion & Jewels</span>
                    <h3 className="font-serif italic text-2xl text-white mt-1 group-hover:text-[#D4AF37] transition-colors flex items-center gap-2">
                      Luxury Boutiques
                      <ArrowUpRight className="w-5 h-5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                    <p className="text-gray-300 text-xs mt-2 font-light leading-relaxed">Handcrafted accessories, fine diamonds, and bespoke tailoring.</p>
                  </div>
                </div>

                {/* Restaurant Card */}
                <div 
                  onClick={() => setActiveSection('restaurant')}
                  className="group relative h-96 rounded-none overflow-hidden border border-[#D4AF37]/10 hover:border-[#D4AF37]/50 transition-all cursor-pointer shadow-xl bg-[#0F0F0F]"
                >
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-60"
                    style={{ backgroundImage: `url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="text-[9px] font-mono text-[#D4AF37] uppercase tracking-widest font-bold">Gourmet Dining</span>
                    <h3 className="font-serif italic text-2xl text-white mt-1 group-hover:text-[#D4AF37] transition-colors flex items-center gap-2">
                      Food Court
                      <ArrowUpRight className="w-5 h-5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                    <p className="text-gray-300 text-xs mt-2 font-light leading-relaxed">Michelin-standard bistro creations, specialty coffees, and desserts.</p>
                  </div>
                </div>

                {/* Electronics & Audio Card */}
                <div 
                  onClick={() => setActiveSection('products')}
                  className="group relative h-96 rounded-none overflow-hidden border border-[#D4AF37]/10 hover:border-[#D4AF37]/50 transition-all cursor-pointer shadow-xl bg-[#0F0F0F]"
                >
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-60"
                    style={{ backgroundImage: `url('https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="text-[9px] font-mono text-[#D4AF37] uppercase tracking-widest font-bold">Smart Lifestyle</span>
                    <h3 className="font-serif italic text-2xl text-white mt-1 group-hover:text-[#D4AF37] transition-colors flex items-center gap-2">
                      Premium Essentials
                      <ArrowUpRight className="w-5 h-5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                    <p className="text-gray-300 text-xs mt-2 font-light leading-relaxed">State-of-the-art acoustics, smart appliances, and fine keyboards.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Elegant Trust Row */}
            <section className="bg-[#0F0F0F] py-16 border-y border-[#D4AF37]/15">
              <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="flex gap-4 items-center">
                  <div className="bg-[#D4AF37]/10 p-3 rounded-none text-[#D4AF37] shrink-0 border border-[#D4AF37]/20">
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-white font-serif italic text-sm mb-1 tracking-wide">Premium Brands</h4>
                    <p className="text-gray-400 text-xs font-light">Exclusively authentic products from authorized luxury designers.</p>
                  </div>
                </div>

                <div className="flex gap-4 items-center">
                  <div className="bg-[#D4AF37]/10 p-3 rounded-none text-[#D4AF37] shrink-0 border border-[#D4AF37]/20">
                    <Landmark className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-white font-serif italic text-sm mb-1 tracking-wide">Secure Payment</h4>
                    <p className="text-gray-400 text-xs font-light">Simulated M-Pesa push, PayPal, and multi-bank encrypted checkout gateways.</p>
                  </div>
                </div>

                <div className="flex gap-4 items-center">
                  <div className="bg-[#D4AF37]/10 p-3 rounded-none text-[#D4AF37] shrink-0 border border-[#D4AF37]/20">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-white font-serif italic text-sm mb-1 tracking-wide">Luxury Delivery</h4>
                    <p className="text-gray-400 text-xs font-light">Flat-rate same-day courier service in customized thermal boxes.</p>
                  </div>
                </div>

                <div className="flex gap-4 items-center">
                  <div className="bg-[#D4AF37]/10 p-3 rounded-none text-[#D4AF37] shrink-0 border border-[#D4AF37]/20">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-white font-serif italic text-sm mb-1 tracking-wide">Genuine Support</h4>
                    <p className="text-gray-400 text-xs font-light">24/7 grounded AI Concierge helping guide you step-by-step.</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeSection === 'products' && (
          <ProductsSection
            products={products}
            onAddToCart={handleAddToCart}
            cartItems={cartItems}
          />
        )}

        {activeSection === 'restaurant' && (
          <RestaurantSection
            onAddToCart={handleAddToCart}
          />
        )}

        {activeSection === 'promotions' && (
          <PromotionsSection
            promotions={promotions}
            onApplyPromoCode={(code) => {
              setActivePromoCode(code);
              setActiveSection('cart');
            }}
          />
        )}

        {activeSection === 'cart' && (
          <CartSection
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
            onSubmitOrder={handleOrderSubmitted}
            activePromoCode={activePromoCode}
            setActivePromoCode={setActivePromoCode}
          />
        )}

        {activeSection === 'login' && (
          <LoginSection
            onLoginSuccess={handleLoginSuccess}
          />
        )}

        {activeSection === 'admin' && (
          <AdminPanel
            products={products}
            orders={orders}
            promotions={promotions}
            onRefreshData={fetchAllData}
          />
        )}
      </main>

      {/* Floating 24/7 AI Concierge Assistant */}
      <ChatBot />
      <ScrollToTop />

      {/* Elegant Footer */}
      <Footer setActiveSection={setActiveSection} />
    </div>
  );
}
