import { useState } from 'react';
import { Menu, X, ShoppingCart, User, LogOut, ShieldAlert, Home, Store, Utensils, Percent } from 'lucide-react';
import { User as UserType } from '../types';

interface NavbarProps {
  activeSection: string;
  setActiveSection: (sec: string) => void;
  cartCount: number;
  currentUser: UserType | null;
  onLogout: () => void;
}

export default function Navbar({ activeSection, setActiveSection, cartCount, currentUser, onLogout }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'products', label: 'Products', icon: Store },
    { id: 'restaurant', label: 'Food Court', icon: Utensils },
    { id: 'promotions', label: 'Promotions', icon: Percent },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0F0F0F] border-b border-[#D4AF37]/20 px-6 py-4 md:px-12 flex justify-between items-center transition-all">
      {/* Brand Logo */}
      <div 
        className="flex items-center gap-4 cursor-pointer group"
        onClick={() => { setActiveSection('home'); setIsOpen(false); }}
      >
        <div className="w-10 h-10 bg-[#D4AF37] rounded-none flex items-center justify-center rotate-45 transition-transform duration-500 group-hover:rotate-[225deg]">
          <span className="text-[#0A0A0A] font-bold text-xl -rotate-45">E</span>
        </div>
        <span className="font-serif text-2xl italic tracking-wider uppercase text-[#D4AF37] gold-text-glow">
          Elegant Mall
        </span>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center gap-8">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`flex items-center gap-2 text-xs uppercase tracking-widest transition-all hover:text-[#D4AF37] cursor-pointer py-1.5 border-b ${
                isActive ? 'text-[#D4AF37] border-[#D4AF37] font-semibold' : 'text-gray-400 border-transparent'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {item.label}
            </button>
          );
        })}

        {/* Cart Trigger */}
        <button
          onClick={() => setActiveSection('cart')}
          className={`relative p-2 rounded-none hover:bg-white/5 transition-all cursor-pointer ${
            activeSection === 'cart' ? 'text-[#D4AF37]' : 'text-gray-400'
          }`}
        >
          <ShoppingCart className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute top-0 right-0 bg-[#D4AF37] text-[#0A0A0A] text-[9px] font-black rounded-none w-4 h-4 flex items-center justify-center animate-pulse">
              {cartCount}
            </span>
          )}
        </button>

        {/* User / Login Trigger */}
        {currentUser ? (
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveSection(currentUser.role === 'admin' ? 'admin' : 'home')}
              className={`flex items-center gap-2 text-xs uppercase tracking-widest text-gray-300 border border-white/10 hover:border-[#D4AF37]/50 rounded-none px-4 py-2 transition-all hover:text-[#D4AF37] cursor-pointer ${
                activeSection === 'admin' ? 'border-[#D4AF37] text-[#D4AF37]' : ''
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>{currentUser.username}</span>
              {currentUser.role === 'admin' && (
                <span className="text-[9px] bg-[#D4AF37]/20 text-[#D4AF37] font-bold uppercase px-1.5 py-0.5 rounded-none">Admin</span>
              )}
            </button>
            <button 
              onClick={onLogout}
              className="text-gray-400 hover:text-red-400 p-1.5 rounded-none hover:bg-white/5 cursor-pointer transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setActiveSection('login')}
            className={`flex items-center gap-2 border border-[#D4AF37]/30 hover:border-[#D4AF37] text-xs uppercase tracking-widest text-[#D4AF37] px-5 py-2 rounded-none font-semibold transition-all hover:bg-[#D4AF37]/5 cursor-pointer ${
              activeSection === 'login' ? 'bg-[#D4AF37]/10 border-[#D4AF37]' : ''
            }`}
          >
            <User className="w-3.5 h-3.5" />
            Login
          </button>
        )}
      </nav>

      {/* Hamburger / Cart Icon for mobile */}
      <div className="flex items-center gap-4 lg:hidden">
        {/* Cart for Mobile */}
        <button
          onClick={() => setActiveSection('cart')}
          className="relative p-2 text-gray-300"
        >
          <ShoppingCart className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute top-0 right-0 bg-[#D4AF37] text-[#0A0A0A] text-[9px] font-bold rounded-none w-4 h-4 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>

        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="text-gray-300 hover:text-[#D4AF37] transition-all cursor-pointer"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-[74px] left-0 w-full bg-[#0F0F0F] border-b border-[#D4AF37]/30 py-6 px-8 flex flex-col gap-6 lg:hidden z-50 shadow-2xl animate-in fade-in slide-in-from-top duration-200">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveSection(item.id); setIsOpen(false); }}
                className={`flex items-center gap-3 text-sm uppercase tracking-widest text-left transition-colors cursor-pointer py-1 ${
                  activeSection === item.id ? 'text-[#D4AF37] font-semibold border-l-2 border-[#D4AF37] pl-2' : 'text-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}

          <hr className="border-white/5" />

          {/* User Account Mobile */}
          {currentUser ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 text-gray-300">
                <User className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-sm font-mono">{currentUser.username}</span>
                {currentUser.role === 'admin' && (
                  <span className="text-[9px] bg-[#D4AF37]/20 text-[#D4AF37] font-bold px-2 py-0.5 rounded-none">Admin</span>
                )}
              </div>
              {currentUser.role === 'admin' && (
                <button
                  onClick={() => { setActiveSection('admin'); setIsOpen(false); }}
                  className="flex items-center gap-3 text-gray-300 text-left text-xs uppercase tracking-widest"
                >
                  <ShieldAlert className="w-4 h-4" />
                  Admin Dashboard
                </button>
              )}
              <button
                onClick={() => { onLogout(); setIsOpen(false); }}
                className="flex items-center gap-3 text-red-400 text-left text-xs uppercase tracking-widest"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => { setActiveSection('login'); setIsOpen(false); }}
              className="flex items-center justify-center gap-3 border border-[#D4AF37] text-xs uppercase tracking-widest text-[#D4AF37] py-3 rounded-none font-bold transition-all hover:bg-[#D4AF37]/10"
            >
              <User className="w-4 h-4" />
              Sign In
            </button>
          )}
        </div>
      )}
    </header>
  );
}
