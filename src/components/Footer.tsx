import { Sparkles, Mail, Phone, MapPin, Clock } from 'lucide-react';

interface FooterProps {
  setActiveSection: (sec: string) => void;
}

export default function Footer({ setActiveSection }: FooterProps) {
  return (
    <footer className="bg-[#0F0F0F] border-t border-[#D4AF37]/30 pt-16 pb-8 px-6 md:px-12 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/5">
        
        {/* Brand Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="font-serif text-xl font-light italic text-[#D4AF37] tracking-wider">
              Elegant Mall
            </span>
          </div>
          <p className="text-gray-400 text-xs leading-relaxed font-light">
            Bringing elite, world-class luxury brands, gourmet dining adventures, and digital e-commerce fulfillment under one roof since 2026.
          </p>
          <div className="flex items-center gap-2 text-[#D4AF37] text-[10px] font-bold tracking-[0.2em] uppercase">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Premium Experience</span>
          </div>
        </div>

        {/* Directory links */}
        <div>
          <h4 className="text-white text-xs uppercase tracking-widest font-bold mb-4">Mall Directory</h4>
          <ul className="space-y-2 text-xs text-gray-400">
            {['Home', 'Products', 'Food Court', 'Promotions'].map((sec) => (
              <li key={sec}>
                <button
                  onClick={() => setActiveSection(sec.toLowerCase() === 'food court' ? 'restaurant' : sec.toLowerCase())}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer text-left"
                >
                  {sec}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Operating hours */}
        <div>
          <h4 className="text-white text-xs uppercase tracking-widest font-bold mb-4">Opening Hours</h4>
          <ul className="space-y-3 text-xs text-gray-400">
            <li className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Mon - Fri: 08:00 AM - 10:00 PM</span>
            </li>
            <li className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Sat - Sun: 09:00 AM - 11:00 PM</span>
            </li>
          </ul>
        </div>

        {/* Contact info */}
        <div>
          <h4 className="text-white text-xs uppercase tracking-widest font-bold mb-4">Contact concierge</h4>
          <ul className="space-y-3 text-xs text-gray-400">
            <li className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Westlands Ave, Nairobi, Kenya</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>+254 712 345 678</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>healerblessing@gmail.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-gray-500 text-[10px] font-mono uppercase tracking-wider">
          &copy; {new Date().getFullYear()} Elegant Mall Luxury Group. All Rights Reserved.
        </p>
        <div className="flex gap-6 text-[10px] text-gray-500 uppercase tracking-widest font-semibold">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">API Status</a>
        </div>
      </div>
    </footer>
  );
}
