import { useState, useEffect } from 'react';
import { CartItem, Product, OrderItem } from '../types';
import { Trash2, Plus, Minus, Tag, Check, ArrowRight, ShoppingCart, CreditCard, Landmark, CheckCircle2, FileText, Smartphone, Loader2 } from 'lucide-react';

interface CartSectionProps {
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onSubmitOrder: (order: any) => void;
  activePromoCode: string;
  setActivePromoCode: (code: string) => void;
}

export default function CartSection({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onSubmitOrder,
  activePromoCode,
  setActivePromoCode
}: CartSectionProps) {
  // Coupon State
  const [promoInput, setPromoInput] = useState(activePromoCode);
  const [appliedDiscount, setAppliedDiscount] = useState(0); // percentage
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  // Shipping details state
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'card' | 'paypal'>('mpesa');

  // Checkout Phase State: 'cart' | 'shipping' | 'paying' | 'completed'
  const [checkoutPhase, setCheckoutPhase] = useState<'cart' | 'shipping' | 'paying' | 'completed'>('cart');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'stk_sent' | 'processing' | 'success' | 'failed'>('idle');
  const [paymentMessage, setPaymentMessage] = useState('');
  const [placedOrder, setPlacedOrder] = useState<any | null>(null);

  // Sync coupon if set globally from promotions
  useEffect(() => {
    if (activePromoCode) {
      setPromoInput(activePromoCode);
      handleApplyCoupon(activePromoCode);
    }
  }, [activePromoCode]);

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountAmount = (subtotal * appliedDiscount) / 100;
  const shipping = subtotal > 100 ? 0 : subtotal > 0 ? 10 : 0;
  const total = Math.max(0, subtotal - discountAmount + shipping);

  const handleApplyCoupon = (codeToApply: string) => {
    const code = codeToApply.toUpperCase().trim();
    if (code === 'BLACKFRIDAY50') {
      setAppliedDiscount(50);
      setPromoSuccess('Promo BLACKFRIDAY50 Applied (50% Off)!');
      setPromoError('');
      setActivePromoCode('BLACKFRIDAY50');
    } else if (code === 'HOLIDAYFREE') {
      setAppliedDiscount(25);
      setPromoSuccess('Promo HOLIDAYFREE Applied (25% Off)!');
      setPromoError('');
      setActivePromoCode('HOLIDAYFREE');
    } else if (code === 'NEWYEAR30') {
      setAppliedDiscount(30);
      setPromoSuccess('Promo NEWYEAR30 Applied (30% Off)!');
      setPromoError('');
      setActivePromoCode('NEWYEAR30');
    } else {
      setPromoError('Invalid coupon code. Try "BLACKFRIDAY50"!');
      setPromoSuccess('');
      setAppliedDiscount(0);
    }
  };

  const handleMpesaCheckout = async () => {
    setCheckoutPhase('paying');
    setPaymentStatus('stk_sent');
    setPaymentMessage('Initiating simulated M-Pesa STK Push to ' + phone + '...');

    try {
      // Trigger API
      const res = await fetch('/api/payments/mpesa-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, total })
      });
      const data = await res.json();

      if (data.success) {
        setTimeout(() => {
          setPaymentStatus('processing');
          setPaymentMessage('Simulated STK Push received. Please input your transaction PIN on your imaginary handset.');
        }, 2500);

        setTimeout(() => {
          setPaymentStatus('success');
          setPaymentMessage('Payment Authorized Successfully! Transaction ID: ' + data.transactionId);
          completeCheckout();
        }, 5500);
      } else {
        setPaymentStatus('failed');
        setPaymentMessage('Simulated M-Pesa STK push failed.');
      }
    } catch (e) {
      setPaymentStatus('failed');
      setPaymentMessage('Error simulating M-Pesa push API.');
    }
  };

  const handleCardCheckout = () => {
    setCheckoutPhase('paying');
    setPaymentStatus('processing');
    setPaymentMessage('Authorizing credit card transaction with secure bank servers...');

    setTimeout(() => {
      setPaymentStatus('success');
      setPaymentMessage('Payment Authorized Successfully! Card charged.');
      completeCheckout();
    }, 3000);
  };

  const completeCheckout = async () => {
    const orderItems: OrderItem[] = cartItems.map(item => ({
      productId: item.product.id,
      title: item.product.title,
      price: item.product.price,
      quantity: item.quantity
    }));

    const orderPayload = {
      customerName: fullname,
      customerEmail: email,
      customerPhone: phone,
      items: orderItems,
      total: parseFloat(total.toFixed(2)),
      paymentMethod
    };

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      const order = await response.json();
      setPlacedOrder(order);
      onSubmitOrder(order); // Notify main app state
      setCheckoutPhase('completed');
    } catch (err) {
      console.error('Error submitting order', err);
    }
  };

  const handleDownloadInvoice = () => {
    if (!placedOrder) return;
    window.print();
  };

  // RENDER COMPLETE RECEIPT SCREEN
  if (checkoutPhase === 'completed' && placedOrder) {
    return (
      <div className="py-16 px-6 max-w-xl mx-auto text-center" id="invoice-print-area">
        <CheckCircle2 className="w-16 h-16 text-[#D4AF37] mx-auto mb-6 animate-bounce" />
        <h1 className="font-serif text-3xl font-light text-[#D4AF37] mb-2 italic tracking-wide">
          Payment Successful!
        </h1>
        <p className="text-gray-400 text-xs font-light mb-8">
          Thank you for shopping at Elegant Mall. Your order has been placed.
        </p>

        {/* Digital Receipt Card */}
        <div className="bg-[#0F0F0F] border border-[#D4AF37]/15 rounded-none p-6 text-left mb-8 shadow-2xl">
          <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-4">
            <div>
              <span className="block text-[9px] text-gray-500 uppercase font-bold tracking-wider">Order Number</span>
              <span className="font-mono text-white text-xs font-bold">{placedOrder.id}</span>
            </div>
            <div className="text-right">
              <span className="block text-[9px] text-gray-500 uppercase font-bold tracking-wider">Placed Date</span>
              <span className="text-white text-xs font-mono">{new Date(placedOrder.date).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Customer Details</h4>
            <p className="text-white text-sm font-serif italic">{placedOrder.customerName}</p>
            <p className="text-gray-400 text-xs font-mono">{placedOrder.customerEmail}</p>
            {placedOrder.customerPhone && <p className="text-gray-400 text-xs font-mono">{placedOrder.customerPhone}</p>}
          </div>

          <div className="border-t border-white/5 pt-4 mb-6">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Purchased Items</h4>
            <div className="space-y-2.5">
              {placedOrder.items.map((item: any, i: number) => (
                <div key={i} className="flex justify-between items-center text-xs">
                  <span className="text-gray-300">
                    {item.title} <strong className="text-xs text-[#D4AF37]">x{item.quantity}</strong>
                  </span>
                  <span className="text-white font-mono font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-white/5 pt-4 flex justify-between items-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Payment Method</span>
            <span className="text-[#D4AF37] font-bold text-[10px] uppercase tracking-wider">{placedOrder.paymentMethod}</span>
          </div>

          <div className="border-t border-white/5 pt-4 mt-4 flex justify-between items-center">
            <span className="text-xs font-bold text-white uppercase tracking-wider">Grand Total</span>
            <span className="text-lg font-mono font-bold text-[#D4AF37]">${placedOrder.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Invoice action keys */}
        <div className="flex gap-4">
          <button
            onClick={handleDownloadInvoice}
            className="flex-1 flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#F0C75E] text-[#0A0A0A] font-bold py-3.5 rounded-none uppercase text-xs tracking-widest cursor-pointer transition-all"
          >
            <FileText className="w-4 h-4" />
            Print / Save Invoice
          </button>
          
          <button
            onClick={onClearCart}
            className="flex-1 border border-[#D4AF37]/25 hover:border-[#D4AF37] text-[#D4AF37] font-bold py-3.5 rounded-none uppercase text-xs tracking-widest cursor-pointer hover:bg-[#D4AF37]/5 transition-all"
          >
            Back to Shopping
          </button>
        </div>
      </div>
    );
  }

  // RENDER LOADING / PAYING SCREEN
  if (checkoutPhase === 'paying') {
    return (
      <div className="py-24 px-6 text-center max-w-lg mx-auto">
        <div className="relative w-20 h-20 mx-auto mb-8 flex items-center justify-center">
          <Loader2 className="w-16 h-16 text-[#D4AF37] animate-spin absolute" />
          {paymentMethod === 'mpesa' ? (
            <Smartphone className="w-6 h-6 text-[#D4AF37]" />
          ) : (
            <CreditCard className="w-6 h-6 text-[#D4AF37]" />
          )}
        </div>

        <h2 className="text-2xl font-serif font-light text-white italic mb-3 tracking-wide">
          Payment Authorizing
        </h2>
        
        <div className="bg-[#0F0F0F] border border-[#D4AF37]/15 rounded-none p-6 mt-6">
          <p className="text-gray-300 text-xs leading-relaxed font-light animate-pulse tracking-wide">
            {paymentMessage}
          </p>
        </div>

        <p className="text-gray-500 text-[10px] mt-6 italic tracking-wider uppercase">
          This is a simulated secure sandboxed payment node. Do not close this window.
        </p>
      </div>
    );
  }

  return (
    <div className="py-12 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="font-serif text-4xl font-light text-[#D4AF37] italic tracking-wide mb-2">
          Shopping Cart
        </h1>
        <p className="text-gray-400 max-w-md mx-auto text-xs font-light tracking-wide">
          {checkoutPhase === 'shipping' ? 'Complete delivery & payment options' : 'Review your bags before secure checkout'}
        </p>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-20 bg-[#0F0F0F] border border-[#D4AF37]/10 rounded-none max-w-xl mx-auto">
          <ShoppingCart className="w-14 h-14 text-gray-600 mx-auto mb-4" />
          <h2 className="text-lg font-serif italic text-white mb-2">Your Shopping Cart is Empty</h2>
          <p className="text-gray-400 text-xs font-light mb-8">Add beautiful products or delicious foods to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          {/* Main Left Columns */}
          <div className="lg:col-span-2 space-y-6">
            {checkoutPhase === 'cart' ? (
              /* Itemized bag items list */
              <div className="bg-[#0F0F0F] border border-[#D4AF37]/10 rounded-none overflow-hidden shadow-xl">
                <div className="p-6 border-b border-white/5">
                  <h3 className="font-serif text-lg italic text-white">Your Shopping Bags</h3>
                </div>

                <div className="divide-y divide-white/5">
                  {cartItems.map((item) => (
                    <div key={item.product.id} className="p-6 flex flex-col sm:flex-row gap-5 items-center justify-between transition-colors hover:bg-white/[0.01]">
                      {/* Product Thumbnail */}
                      <div className="flex gap-4 items-center w-full sm:w-auto">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.title}
                          className="w-16 h-16 object-cover rounded-none border border-white/10"
                        />
                        <div className="min-w-0">
                          <h4 className="text-white text-sm font-serif italic truncate max-w-[200px] sm:max-w-[300px]">
                            {item.product.title}
                          </h4>
                          <span className="text-[9px] text-gray-500 font-mono block uppercase">SKU: {item.product.sku}</span>
                          <span className="text-xs text-[#D4AF37] font-mono font-bold mt-1 block">${item.product.price.toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Quantity Toggles */}
                      <div className="flex items-center gap-6 justify-between w-full sm:w-auto mt-4 sm:mt-0">
                        <div className="flex items-center gap-2.5 bg-[#0A0A0A] border border-[#D4AF37]/20 rounded-none p-1.5">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, -1)}
                            disabled={item.quantity <= 1}
                            className="p-1 rounded-none bg-white/5 hover:bg-white/10 disabled:opacity-30 text-white cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-mono font-bold text-white px-2 min-w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, 1)}
                            disabled={item.quantity >= item.product.inventory}
                            className="p-1 rounded-none bg-white/5 hover:bg-white/10 text-white cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Sum amount */}
                        <span className="font-mono font-bold text-white text-xs shrink-0">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>

                        {/* Delete button */}
                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          className="text-gray-500 hover:text-red-400 p-2 hover:bg-red-400/10 rounded-none transition-colors cursor-pointer border border-transparent hover:border-red-400/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Shipping & Checkout Fields */
              <div className="bg-[#0F0F0F] border border-[#D4AF37]/10 rounded-none p-6 shadow-xl">
                <h3 className="font-serif italic text-lg text-white mb-6 pb-3 border-b border-white/5">
                  Delivery & Secure Payment Information
                </h3>

                <form className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest mb-2">Recipient Name</label>
                      <input
                        type="text"
                        required
                        value={fullname}
                        onChange={(e) => setFullname(e.target.value)}
                        placeholder="e.g. John Doe"
                        className="w-full bg-[#0A0A0A] border border-[#D4AF37]/20 rounded-none py-3 px-4 text-xs text-white focus:border-[#D4AF37] focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest mb-2">Recipient Email</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. john@doe.com"
                        className="w-full bg-[#0A0A0A] border border-[#D4AF37]/20 rounded-none py-3 px-4 text-xs text-white focus:border-[#D4AF37] focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest mb-2">Mobile Phone (M-Pesa STK push format)</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+254 712 345 678"
                      className="w-full bg-[#0A0A0A] border border-[#D4AF37]/20 rounded-none py-3 px-4 text-xs text-white focus:border-[#D4AF37] focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="border-t border-white/5 pt-6 mt-6">
                    <label className="block text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.2em] mb-4">Payment Methods</label>
                    <div className="grid grid-cols-3 gap-4">
                      {/* M-Pesa Button */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('mpesa')}
                        className={`flex flex-col items-center justify-center p-4 border rounded-none gap-2 transition-all cursor-pointer ${
                          paymentMethod === 'mpesa'
                            ? 'bg-[#D4AF37]/10 border-[#D4AF37] text-[#D4AF37]'
                            : 'bg-[#0A0A0A] border-white/5 hover:border-white/20 text-gray-400 hover:text-white'
                        }`}
                      >
                        <Smartphone className="w-5 h-5" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">M-Pesa</span>
                      </button>

                      {/* Card Button */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className={`flex flex-col items-center justify-center p-4 border rounded-none gap-2 transition-all cursor-pointer ${
                          paymentMethod === 'card'
                            ? 'bg-[#D4AF37]/10 border-[#D4AF37] text-[#D4AF37]'
                            : 'bg-[#0A0A0A] border-white/5 hover:border-white/20 text-gray-400 hover:text-white'
                        }`}
                      >
                        <CreditCard className="w-5 h-5" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Card</span>
                      </button>

                      {/* Paypal Button */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('paypal')}
                        className={`flex flex-col items-center justify-center p-4 border rounded-none gap-2 transition-all cursor-pointer ${
                          paymentMethod === 'paypal'
                            ? 'bg-[#D4AF37]/10 border-[#D4AF37] text-[#D4AF37]'
                            : 'bg-[#0A0A0A] border-white/5 hover:border-white/20 text-gray-400 hover:text-white'
                        }`}
                      >
                        <Landmark className="w-5 h-5" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">PayPal</span>
                      </button>
                    </div>
                  </div>

                  {/* Payment option details */}
                  {paymentMethod === 'card' && (
                    <div className="bg-[#0A0A0A] p-4 rounded-none border border-[#D4AF37]/15 grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                      <div className="sm:col-span-3">
                        <label className="block text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">Card Number</label>
                        <input type="text" placeholder="xxxx xxxx xxxx xxxx" className="w-full bg-[#0F0F0F] border border-white/10 rounded-none p-2.5 text-xs text-white uppercase tracking-widest" />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">Expiry Date</label>
                        <input type="text" placeholder="MM/YY" className="w-full bg-[#0F0F0F] border border-white/10 rounded-none p-2.5 text-xs text-white font-mono" />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">CVV</label>
                        <input type="password" placeholder="***" className="w-full bg-[#0F0F0F] border border-white/10 rounded-none p-2.5 text-xs text-white" />
                      </div>
                    </div>
                  )}
                </form>
              </div>
            )}
          </div>

          {/* Checkout pricing sum column */}
          <div className="bg-[#0F0F0F] border border-[#D4AF37]/15 rounded-none p-6 shadow-xl space-y-6">
            <h3 className="font-serif italic text-lg text-white pb-3 border-b border-white/5">
              Order Summary
            </h3>

            {/* Calculations items */}
            <div className="space-y-3.5 text-xs font-light">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Items Subtotal</span>
                <span className="text-white font-mono">${subtotal.toFixed(2)}</span>
              </div>
              
              {appliedDiscount > 0 && (
                <div className="flex justify-between items-center text-green-500 font-medium">
                  <span className="flex items-center gap-1 uppercase tracking-wider text-[10px]">
                    <Tag className="w-3.5 h-3.5" />
                    Coupon Discount ({appliedDiscount}%)
                  </span>
                  <span className="font-mono">-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-gray-400">Luxury Delivery & Shipping</span>
                <span className="text-white font-mono">
                  {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                </span>
              </div>

              <hr className="border-white/5 my-2" />

              <div className="flex justify-between items-center text-sm font-bold">
                <span className="text-white uppercase tracking-wider">Total Amount</span>
                <span className="text-[#D4AF37] font-mono">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Promo Code Input */}
            {checkoutPhase === 'cart' && (
              <div className="pt-4 border-t border-white/5">
                <label className="block text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest mb-2">Apply Promo Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="e.g. BLACKFRIDAY50"
                    className="flex-1 bg-[#0A0A0A] border border-[#D4AF37]/20 rounded-none px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37] uppercase font-mono"
                  />
                  <button
                    onClick={() => handleApplyCoupon(promoInput)}
                    className="bg-[#D4AF37] text-[#0A0A0A] font-bold uppercase text-[10px] tracking-widest px-4 py-2 rounded-none hover:bg-[#F0C75E] transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {promoError && <p className="text-red-400 text-[10px] mt-2 flex items-center gap-1 font-mono uppercase">{promoError}</p>}
                {promoSuccess && <p className="text-green-500 text-[10px] mt-2 flex items-center gap-1 font-mono uppercase">{promoSuccess}</p>}
              </div>
            )}

            {/* Call to action Checkout Key */}
            {checkoutPhase === 'cart' ? (
              <button
                onClick={() => setCheckoutPhase('shipping')}
                className="w-full flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#F0C75E] text-[#0A0A0A] font-bold uppercase text-xs tracking-widest py-4 rounded-none cursor-pointer shadow-lg transition-all"
              >
                Checkout Now
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  disabled={!fullname || !email || (paymentMethod === 'mpesa' && !phone)}
                  onClick={paymentMethod === 'mpesa' ? handleMpesaCheckout : handleCardCheckout}
                  className={`w-full flex items-center justify-center gap-2 font-bold uppercase text-xs tracking-widest py-4 rounded-none shadow-lg transition-all ${
                    fullname && email && (paymentMethod !== 'mpesa' || phone)
                      ? 'bg-[#D4AF37] text-[#0A0A0A] cursor-pointer hover:bg-[#F0C75E]'
                      : 'bg-white/5 border border-white/5 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Pay & Submit Order
                </button>
                
                <button
                  onClick={() => setCheckoutPhase('cart')}
                  className="w-full text-center text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-white py-2 transition-colors cursor-pointer"
                >
                  Back to Bag Review
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
