import { useState } from 'react';
import { Promotion } from '../types';
import { Tag, Check, Copy, AlertCircle, Calendar, Sparkles } from 'lucide-react';

interface PromotionsSectionProps {
  promotions: Promotion[];
  onApplyPromoCode?: (code: string) => void;
}

export default function PromotionsSection({ promotions, onApplyPromoCode }: PromotionsSectionProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);

    if (onApplyPromoCode) {
      onApplyPromoCode(code);
    }
  };

  return (
    <div className="py-12 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-[#D4AF37]/15 border border-[#D4AF37]/35 rounded-none px-4 py-1.5 mb-3 text-[10px] font-bold tracking-[0.2em] text-[#D4AF37] uppercase">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>EXCLUSIVE MALL COUPONS</span>
        </div>
        <h1 className="font-serif text-4xl font-light text-[#D4AF37] italic tracking-wide mb-3">
          Hot Promotions
        </h1>
        <p className="text-gray-400 max-w-xl mx-auto text-xs font-light tracking-wide leading-relaxed">
          Save big with our seasonal discounts. Copy any promo code below to apply a massive discount at your checkout page.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {promotions.map((promo) => (
          <div
            key={promo.id}
            className="group relative bg-[#0F0F0F] border border-[#D4AF37]/10 rounded-none overflow-hidden hover:border-[#D4AF37]/40 transition-all duration-300 flex flex-col justify-between hover:shadow-2xl hover:shadow-[#D4AF37]/5"
          >
            {/* Promo banner image */}
            <div className="relative h-48 bg-black overflow-hidden">
              <img
                src={promo.image}
                alt={promo.title}
                className="w-full h-full object-cover opacity-60 transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-transparent to-transparent" />
              
              {/* Floating discount tag */}
              <span className="absolute top-4 right-4 bg-[#D4AF37] text-[#0A0A0A] text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-none border border-[#D4AF37]/30 shadow-lg">
                {promo.discount}% OFF
              </span>
            </div>

            {/* Details */}
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-serif italic text-xl text-white mb-2 leading-tight group-hover:text-[#D4AF37] transition-colors">
                  {promo.title}
                </h3>
                
                <div className="flex items-center gap-2 text-[10px] text-gray-400 mb-4 tracking-wider uppercase">
                  <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Valid until: December 31, 2026</span>
                </div>

                <p className="text-gray-400 text-xs font-light leading-relaxed mb-6">
                  Save a flat {promo.discount}% on electronics, luxury apparel, premium groceries, and accessories. Offer valid both online and on-site at Elegant Mall.
                </p>
              </div>

              {/* Promo Code Box */}
              <div className="bg-[#0A0A0A] border border-[#D4AF37]/15 rounded-none p-4 flex items-center justify-between">
                <div>
                  <span className="block text-[9px] text-gray-500 uppercase tracking-widest font-bold mb-1">Coupon Code</span>
                  <code className="text-[#D4AF37] font-mono font-bold tracking-wider text-base">
                    {promo.code}
                  </code>
                </div>

                <button
                  onClick={() => handleCopy(promo.code)}
                  className="flex items-center gap-2 bg-[#D4AF37] hover:bg-[#F0C75E] text-[#0A0A0A] text-[10px] uppercase tracking-widest font-bold py-2.5 px-3.5 rounded-none transition-all cursor-pointer"
                >
                  {copiedCode === promo.code ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Applied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy Code
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* T&C Notice Banner */}
      <div className="bg-[#0F0F0F] border border-[#D4AF37]/10 rounded-none p-6 mt-16 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex gap-4 items-center">
          <div className="bg-amber-400/10 text-amber-400 p-3 rounded-none shrink-0 border border-amber-400/20">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-white font-serif italic text-sm mb-1 tracking-wide">Promotion Terms</h4>
            <p className="text-gray-400 text-xs font-light leading-relaxed max-w-xl">
              One coupon code allowed per order. Coupon discounts do not apply to restaurant deliveries or already marked down clearance items. Minimum cart size of $10.00 required.
            </p>
          </div>
        </div>

        <div className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest border border-[#D4AF37]/30 rounded-none px-4 py-2 hover:bg-[#D4AF37]/10 transition-all cursor-pointer">
          Read Full Policies
        </div>
      </div>
    </div>
  );
}
