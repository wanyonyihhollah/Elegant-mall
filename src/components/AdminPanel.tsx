import React, { useState, useEffect } from 'react';
import { Product, Order, Promotion, EmailLog } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { DollarSign, Package, ShoppingBag, Plus, Trash2, Tag, Check, TrendingUp, AlertCircle, RefreshCw, Mail, Send, Eye, Sparkles } from 'lucide-react';

interface AdminPanelProps {
  products: Product[];
  orders: Order[];
  promotions: Promotion[];
  onRefreshData: () => void;
}

export default function AdminPanel({ products, orders, promotions, onRefreshData }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'add-product' | 'orders' | 'promotions' | 'emails'>('dashboard');

  // Simulated Email Notification states
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [selectedLog, setSelectedLog] = useState<EmailLog | null>(null);

  // Cart Abandonment Simulation states
  const [abandonedEmail, setAbandonedEmail] = useState('healerblessing@gmail.com');
  const [abandonedName, setAbandonedName] = useState('Blessing');
  const [abandonedProdIds, setAbandonedProdIds] = useState<string[]>([]);
  const [sendingAbandonment, setSendingAbandonment] = useState(false);

  // Promotional Campaign Simulation states
  const [promoEmail, setPromoEmail] = useState('healerblessing@gmail.com');
  const [promoName, setPromoName] = useState('Blessing');
  const [promoCampaignId, setPromoCampaignId] = useState('');
  const [sendingPromo, setSendingPromo] = useState(false);

  // Automatically select the first available promotion campaign for selection default
  useEffect(() => {
    if (promotions.length > 0 && !promoCampaignId) {
      setPromoCampaignId(promotions[0].id);
    }
  }, [promotions, promoCampaignId]);

  const fetchEmailLogs = async () => {
    setLoadingLogs(true);
    try {
      const res = await fetch('/api/notifications/logs');
      if (res.ok) {
        const data = await res.json();
        setEmailLogs(data);
      }
    } catch (err) {
      console.error('Failed to load email logs', err);
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'emails') {
      fetchEmailLogs();
    }
  }, [activeTab]);

  const handleSimulateAbandonment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (abandonedProdIds.length === 0) {
      alert("Please select at least one catalog item to simulate abandoned cart contents.");
      return;
    }
    setSendingAbandonment(true);

    const selectedProds = products
      .filter(p => abandonedProdIds.includes(p.id))
      .map(p => ({
        title: p.title,
        price: p.price,
        image: p.images[0]
      }));

    try {
      const res = await fetch('/api/notifications/abandoned-cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: abandonedEmail,
          customerName: abandonedName,
          items: selectedProds
        })
      });

      if (res.ok) {
        alert("Success! Automated Cart Abandonment notification simulated. Real HTML copy sent to Ethereal SMTP draft box!");
        fetchEmailLogs();
        setAbandonedProdIds([]);
      } else {
        const errorData = await res.json();
        alert("Simulated Send Error: " + (errorData.error || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("Network error simulating cart abandonment");
    } finally {
      setSendingAbandonment(false);
    }
  };

  const handleSimulatePromoCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCampaignId) {
      alert("Please ensure there is at least one active promotion campaign available in the promotions tab.");
      return;
    }
    setSendingPromo(true);

    try {
      const res = await fetch('/api/notifications/promotional', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: promoEmail,
          customerName: promoName,
          promotionId: promoCampaignId
        })
      });

      if (res.ok) {
        alert("Success! Personalized Promo Campaign simulated. Real HTML copy sent to Ethereal SMTP draft box!");
        fetchEmailLogs();
      } else {
        const errorData = await res.json();
        alert("Simulated Send Error: " + (errorData.error || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("Network error simulating promo campaign");
    } finally {
      setSendingPromo(false);
    }
  };

  const handleClearEmailLogs = async () => {
    if (!confirm("Are you sure you want to clear the entire email dispatch history?")) return;
    try {
      const res = await fetch('/api/notifications/logs', { method: 'DELETE' });
      if (res.ok) {
        fetchEmailLogs();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Add Product form state
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [images, setImages] = useState('');
  const [description, setDescription] = useState('');
  const [inventory, setInventory] = useState('10');
  const [addingProduct, setAddingProduct] = useState(false);

  // Add Promo form state
  const [promoTitle, setPromoTitle] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState('');
  const [addingPromo, setAddingPromo] = useState(false);

  // Stats Calculations
  const totalRevenue = orders
    .filter(o => o.paymentStatus === 'completed')
    .reduce((acc, o) => acc + o.total, 0);

  const totalSalesCount = orders.length;
  const uniqueProductsCount = products.length;

  // Chart Data preparation: Group revenue by day
  const dailySalesMap: Record<string, number> = {};
  orders.forEach(order => {
    const dateStr = new Date(order.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    dailySalesMap[dateStr] = (dailySalesMap[dateStr] || 0) + order.total;
  });

  const chartData = Object.keys(dailySalesMap).map(date => ({
    date,
    Revenue: parseFloat(dailySalesMap[date].toFixed(2))
  })).reverse();

  // If no chart data, provide standard mock points for initial visual beauty
  const finalChartData = chartData.length > 0 ? chartData : [
    { date: 'Jul 05', Revenue: 1200 },
    { date: 'Jul 06', Revenue: 1850 },
    { date: 'Jul 07', Revenue: 950 },
    { date: 'Jul 08', Revenue: 2200 },
    { date: 'Jul 09', Revenue: 1400 },
    { date: 'Jul 10', Revenue: 3100 },
    { date: 'Jul 11', Revenue: totalRevenue > 0 ? totalRevenue : 1500 }
  ];

  // Group products by category for Bar Chart
  const categoryCountMap: Record<string, number> = {};
  products.forEach(p => {
    categoryCountMap[p.category] = (categoryCountMap[p.category] || 0) + p.inventory;
  });

  const categoryBarData = Object.keys(categoryCountMap).map(cat => ({
    category: cat,
    Stock: categoryCountMap[cat]
  }));

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingProduct(true);

    const imagesArray = images.split(',').map(s => s.trim()).filter(Boolean);

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          sku,
          price: parseFloat(price) || 0,
          category,
          images: imagesArray.length > 0 ? imagesArray : undefined,
          description,
          inventory: parseInt(inventory) || 10
        })
      });

      if (res.ok) {
        setTitle('');
        setPrice('');
        setSku('');
        setImages('');
        setDescription('');
        setInventory('10');
        onRefreshData();
        setActiveTab('products');
      }
    } catch (err) {
      console.error('Failed to add product', err);
    } finally {
      setAddingProduct(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to remove this product from catalog?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        onRefreshData();
      }
    } catch (err) {
      console.error('Failed to delete product', err);
    }
  };

  const handleAddPromotion = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingPromo(true);

    try {
      const res = await fetch('/api/promotions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: promoTitle,
          code: promoCode,
          discount: parseFloat(promoDiscount) || 0
        })
      });

      if (res.ok) {
        setPromoTitle('');
        setPromoCode('');
        setPromoDiscount('');
        onRefreshData();
      }
    } catch (err) {
      console.error('Failed to add promotion', err);
    } finally {
      setAddingPromo(false);
    }
  };

  const handleUpdateOrderStatus = async (id: string, nextStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
      if (res.ok) {
        onRefreshData();
      }
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const handleUpdatePaymentStatus = async (id: string, nextPayStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus: nextPayStatus })
      });
      if (res.ok) {
        onRefreshData();
      }
    } catch (err) {
      console.error('Failed to update payment status', err);
    }
  };

  return (
    <div className="py-12 px-6 md:px-12 max-w-7xl mx-auto flex flex-col md:flex-row gap-10">
      {/* Sidebar Control Deck */}
      <aside className="w-full md:w-64 shrink-0 bg-[#0F0F0F] border border-[#D4AF37]/15 rounded-none p-6 h-fit space-y-6">
        <div>
          <h2 className="font-serif text-lg font-light text-white italic tracking-wide">Elegant Admin</h2>
          <p className="text-gray-500 text-[10px] uppercase tracking-wider mt-0.5">Mall Management Center</p>
        </div>

        <nav className="flex flex-col gap-2">
          {([
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'products', label: 'Manage Products' },
            { id: 'add-product', label: 'Add Product' },
            { id: 'orders', label: 'Orders Registry' },
            { id: 'promotions', label: 'Promotions / Coupons' },
            { id: 'emails', label: 'Email Dispatcher' }
          ] as const).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left py-3 px-4 rounded-none text-xs tracking-wider uppercase font-bold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#D4AF37] text-[#0A0A0A]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <button
          onClick={onRefreshData}
          className="w-full flex items-center justify-center gap-2 bg-[#0A0A0A] border border-[#D4AF37]/25 text-gray-300 text-[10px] tracking-widest uppercase font-bold py-2.5 rounded-none cursor-pointer hover:bg-white/5 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Sync Live Data
        </button>
      </aside>

      {/* Main Panel content */}
      <main className="flex-1 bg-[#0F0F0F] border border-[#D4AF37]/15 rounded-none p-6 min-h-[500px] shadow-2xl">
        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <h1 className="font-serif text-2xl font-light text-white italic tracking-wide">Operational Overview</h1>

            {/* KPI Cards row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Revenue Card */}
              <div className="bg-[#0A0A0A] border border-[#D4AF37]/15 rounded-none p-5 flex items-center gap-4">
                <div className="bg-green-500/10 p-3 rounded-none text-green-500 border border-green-500/20">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-[9px] text-[#D4AF37] uppercase font-bold tracking-wider mb-1">Total Revenue</span>
                  <span className="font-mono font-bold text-xl text-white">${totalRevenue.toFixed(2)}</span>
                </div>
              </div>

              {/* Sales count Card */}
              <div className="bg-[#0A0A0A] border border-[#D4AF37]/15 rounded-none p-5 flex items-center gap-4">
                <div className="bg-[#D4AF37]/10 p-3 rounded-none text-[#D4AF37] border border-[#D4AF37]/20">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-[9px] text-[#D4AF37] uppercase font-bold tracking-wider mb-1">Total Orders</span>
                  <span className="font-mono font-bold text-xl text-white">{totalSalesCount}</span>
                </div>
              </div>

              {/* Inventory items Card */}
              <div className="bg-[#0A0A0A] border border-[#D4AF37]/15 rounded-none p-5 flex items-center gap-4">
                <div className="bg-blue-500/10 p-3 rounded-none text-blue-500 border border-blue-500/20">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-[9px] text-[#D4AF37] uppercase font-bold tracking-wider mb-1">Active Products</span>
                  <span className="font-mono font-bold text-xl text-white">{uniqueProductsCount}</span>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Sales Curve AreaChart */}
              <div className="bg-[#0A0A0A] border border-[#D4AF37]/10 rounded-none p-5">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xs font-bold text-gray-300 uppercase tracking-widest">Revenue Trend Line</h3>
                  <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={finalChartData}>
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                      <XAxis dataKey="date" stroke="#666" fontSize={11} />
                      <YAxis stroke="#666" fontSize={11} />
                      <Tooltip contentStyle={{ backgroundColor: '#0F0F0F', border: '1px solid #D4AF37' }} />
                      <Area type="monotone" dataKey="Revenue" stroke="#D4AF37" fillOpacity={1} fill="url(#colorRev)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Inventory count BarChart */}
              <div className="bg-[#0A0A0A] border border-[#D4AF37]/10 rounded-none p-5">
                <h3 className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-6">Category Stock Levels</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryBarData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                      <XAxis dataKey="category" stroke="#666" fontSize={10} />
                      <YAxis stroke="#666" fontSize={11} />
                      <Tooltip contentStyle={{ backgroundColor: '#0F0F0F', border: '1px solid #D4AF37' }} />
                      <Bar dataKey="Stock" fill="#D4AF37" radius={[0, 0, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PRODUCTS LIST TAB */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <h1 className="font-serif text-2xl font-light text-white italic tracking-wide">Catalog Inventory</h1>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse divide-y divide-white/5">
                <thead>
                  <tr className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                    <th className="pb-4">Image</th>
                    <th className="pb-4">Product</th>
                    <th className="pb-4">Category</th>
                    <th className="pb-4">SKU</th>
                    <th className="pb-4">Price</th>
                    <th className="pb-4">Stock</th>
                    <th className="pb-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {products.map((prod) => (
                    <tr key={prod.id} className="text-white hover:bg-white/[0.01]">
                      <td className="py-4">
                        <img src={prod.images[0]} alt={prod.title} className="w-10 h-10 object-cover rounded-none border border-white/5" />
                      </td>
                      <td className="py-4 font-serif italic text-sm truncate max-w-[200px]">{prod.title}</td>
                      <td className="py-4 text-gray-400 text-xs uppercase tracking-wider">{prod.category}</td>
                      <td className="py-4 font-mono text-xs">{prod.sku}</td>
                      <td className="py-4 font-mono font-bold text-[#D4AF37]">${prod.price.toFixed(2)}</td>
                      <td className={`py-4 font-bold text-xs ${prod.inventory > 3 ? 'text-green-500' : 'text-red-400'}`}>
                        {prod.inventory} Units
                      </td>
                      <td className="py-4 text-right">
                        <button
                          onClick={() => handleDeleteProduct(prod.id)}
                          className="text-red-400 hover:bg-red-400/10 p-2 rounded-none transition-colors cursor-pointer border border-transparent hover:border-red-400/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ADD PRODUCT TAB */}
        {activeTab === 'add-product' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <h1 className="font-serif text-2xl font-light text-white italic tracking-wide">Add New Catalog Item</h1>

            <form onSubmit={handleAddProduct} className="space-y-5 bg-[#0A0A0A] border border-[#D4AF37]/15 p-6 rounded-none">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Product Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Designer Gold Necklace"
                    className="w-full bg-[#0F0F0F] border border-[#D4AF37]/20 rounded-none py-3 px-4 text-xs text-white focus:border-[#D4AF37] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">SKU / Code</label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="e.g. AC-WT-221"
                    className="w-full bg-[#0F0F0F] border border-[#D4AF37]/20 rounded-none py-3 px-4 text-xs text-white focus:border-[#D4AF37] focus:outline-none transition-colors font-mono uppercase tracking-wider"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Price ($)</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 149.00"
                    className="w-full bg-[#0F0F0F] border border-[#D4AF37]/20 rounded-none py-3 px-4 text-xs text-white focus:border-[#D4AF37] focus:outline-none transition-colors font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#0F0F0F] border border-[#D4AF37]/20 rounded-none py-3 px-4 text-xs text-white focus:border-[#D4AF37] focus:outline-none cursor-pointer uppercase tracking-wider font-semibold"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Musicals">Musicals</option>
                    <option value="Household Appliances">Household Appliances</option>
                    <option value="Groceries">Groceries</option>
                    <option value="Beauty & Wellness">Beauty & Wellness</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Stock Inventory Units</label>
                  <input
                    type="number"
                    value={inventory}
                    onChange={(e) => setInventory(e.target.value)}
                    className="w-full bg-[#0F0F0F] border border-[#D4AF37]/20 rounded-none py-3 px-4 text-xs text-white focus:border-[#D4AF37] focus:outline-none transition-colors font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Image URLs (Comma separated for slideshow)</label>
                <input
                  type="text"
                  value={images}
                  onChange={(e) => setImages(e.target.value)}
                  placeholder="https://images.unsplash.com/... , https://images.unsplash.com/..."
                  className="w-full bg-[#0F0F0F] border border-[#D4AF37]/20 rounded-none py-3 px-4 text-xs text-white focus:border-[#D4AF37] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Product Description</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summarize product details, materials, and warranty information..."
                  className="w-full bg-[#0F0F0F] border border-[#D4AF37]/20 rounded-none py-3 px-4 text-xs text-white focus:border-[#D4AF37] focus:outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={addingProduct}
                className="w-full flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#F0C75E] text-[#0A0A0A] font-bold uppercase text-xs tracking-widest py-4 rounded-none cursor-pointer transition-all"
              >
                {addingProduct ? 'Adding item...' : 'Save Product To Catalog'}
              </button>
            </form>
          </div>
        )}

        {/* ORDERS REGISTRY TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <h1 className="font-serif text-2xl font-light text-white italic tracking-wide">Orders Registry</h1>

            {orders.length === 0 ? (
              <div className="text-center py-16 bg-[#0A0A0A] border border-[#D4AF37]/10 rounded-none">
                <AlertCircle className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                <h3 className="text-white font-serif italic text-sm mb-1">No orders logged</h3>
                <p className="text-gray-400 text-xs font-light">Customer transactions will appear here instantly.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="bg-[#0A0A0A] border border-[#D4AF37]/15 rounded-none p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-3 border-b border-white/5">
                      <div>
                        <span className="font-mono text-[#D4AF37] font-bold text-xs tracking-wider">{order.id}</span>
                        <span className="text-gray-500 text-[10px] font-mono block mt-0.5">{new Date(order.date).toLocaleString()}</span>
                      </div>
                      
                      <div className="flex gap-3">
                        {/* Status Manager Dropdown */}
                        <div>
                          <label className="block text-[8px] text-gray-500 uppercase font-bold tracking-widest mb-1">Shipping Status</label>
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                            className="bg-[#0F0F0F] border border-white/10 rounded-none p-1.5 text-xs text-white cursor-pointer uppercase tracking-wider font-bold"
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                          </select>
                        </div>

                        {/* Payment Status Manager */}
                        <div>
                          <label className="block text-[8px] text-gray-500 uppercase font-bold tracking-widest mb-1">Payment Status</label>
                          <select
                            value={order.paymentStatus}
                            onChange={(e) => handleUpdatePaymentStatus(order.id, e.target.value)}
                            className="bg-[#0F0F0F] border border-white/10 rounded-none p-1.5 text-xs text-white cursor-pointer uppercase tracking-wider font-bold"
                          >
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                            <option value="failed">Failed</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-light">
                      <div>
                        <span className="block text-[9px] text-[#D4AF37] font-bold uppercase tracking-wider mb-1">Customer info</span>
                        <p className="text-white font-serif italic text-sm">{order.customerName}</p>
                        <p className="text-gray-400 font-mono mt-0.5">{order.customerEmail}</p>
                        {order.customerPhone && <p className="text-gray-400 font-mono">{order.customerPhone}</p>}
                      </div>
                      <div>
                        <span className="block text-[9px] text-[#D4AF37] font-bold uppercase tracking-wider mb-1">Cart products</span>
                        <ul className="space-y-1">
                          {order.items.map((item, i) => (
                            <li key={i} className="text-white font-serif italic">
                              {item.title} <strong className="text-[#D4AF37] font-mono not-italic text-[10px]">x{item.quantity}</strong> <span className="font-mono text-[10px] text-gray-400">(${item.price})</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className="block text-[9px] text-[#D4AF37] font-bold uppercase tracking-wider mb-1">Transaction Details</span>
                        <p className="text-white uppercase tracking-wider text-[10px]">Gateway: <strong className="text-[#D4AF37]">{order.paymentMethod}</strong></p>
                        <p className="text-[#D4AF37] text-sm font-mono font-bold mt-1">Total: ${order.total.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PROMOTIONS TAB */}
        {activeTab === 'promotions' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <h1 className="font-serif text-2xl font-light text-white italic tracking-wide">Promotions & Coupons</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Add Coupon Form */}
              <form onSubmit={handleAddPromotion} className="space-y-5 bg-[#0A0A0A] border border-[#D4AF37]/15 p-6 rounded-none">
                <h3 className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-2">Create Coupon Code</h3>
                
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Campaign Title</label>
                  <input
                    type="text"
                    required
                    value={promoTitle}
                    onChange={(e) => setPromoTitle(e.target.value)}
                    placeholder="e.g. Summer Festival"
                    className="w-full bg-[#0F0F0F] border border-[#D4AF37]/20 rounded-none py-3 px-4 text-xs text-white focus:border-[#D4AF37] focus:outline-none transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Promo Code</label>
                    <input
                      type="text"
                      required
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="SUMMER30"
                      className="w-full bg-[#0F0F0F] border border-[#D4AF37]/20 rounded-none py-3 px-4 text-xs text-white focus:border-[#D4AF37] focus:outline-none transition-colors font-mono uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Discount (%)</label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="100"
                      value={promoDiscount}
                      onChange={(e) => setPromoDiscount(e.target.value)}
                      placeholder="30"
                      className="w-full bg-[#0F0F0F] border border-[#D4AF37]/20 rounded-none py-3 px-4 text-xs text-white focus:border-[#D4AF37] focus:outline-none transition-colors font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={addingPromo}
                  className="w-full flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#F0C75E] text-[#0A0A0A] font-bold uppercase text-xs tracking-widest py-4 rounded-none cursor-pointer transition-all"
                >
                  Save Promotion Coupon
                </button>
              </form>

              {/* Active Coupons List */}
              <div className="bg-[#0A0A0A] border border-[#D4AF37]/15 rounded-none p-6">
                <h3 className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-4">Active Promotions Coupon Pool</h3>
                
                <div className="space-y-4">
                  {promotions.map((p) => (
                    <div key={p.id} className="border border-[#D4AF37]/15 rounded-none p-4 flex justify-between items-center bg-[#0F0F0F]">
                      <div>
                        <span className="font-serif italic text-white block text-sm">{p.title}</span>
                        <span className="text-xs text-[#D4AF37] font-bold font-mono uppercase mt-1 block tracking-wider">{p.code} ({p.discount}% OFF)</span>
                      </div>
                      <span className="text-[9px] uppercase font-bold bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/35 px-2.5 py-1 rounded-none tracking-wider">
                        Active
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* EMAIL DISPATCHER TAB */}
        {activeTab === 'emails' && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h2 className="font-serif text-xl font-light text-white italic tracking-wide">Automated Email Dispatch Deck</h2>
              <p className="text-gray-400 text-xs mt-1">
                Monitor and test real-time customer email alerts sent via simulated SMTP/Nodemailer transport.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column: Email Triggers Simulation forms */}
              <div className="space-y-8">
                {/* 1. Cart Abandonment Simulation */}
                <div className="bg-[#0A0A0A] border border-[#D4AF37]/15 p-6 rounded-none space-y-4">
                  <div className="flex items-center gap-2 border-b border-[#D4AF37]/15 pb-3">
                    <Mail className="w-4 h-4 text-[#D4AF37]" />
                    <h3 className="text-xs font-bold text-gray-300 uppercase tracking-widest">Simulate Cart Abandonment</h3>
                  </div>

                  <form onSubmit={handleSimulateAbandonment} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Recipient Email Address</label>
                      <input
                        type="email"
                        required
                        value={abandonedEmail}
                        onChange={(e) => setAbandonedEmail(e.target.value)}
                        className="w-full bg-[#0F0F0F] border border-[#D4AF37]/20 rounded-none py-2.5 px-3.5 text-xs text-white focus:border-[#D4AF37] focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Recipient Name</label>
                      <input
                        type="text"
                        required
                        value={abandonedName}
                        onChange={(e) => setAbandonedName(e.target.value)}
                        className="w-full bg-[#0F0F0F] border border-[#D4AF37]/20 rounded-none py-2.5 px-3.5 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Select Products Left Behind (Max 3)</label>
                      <div className="max-h-40 overflow-y-auto border border-[#D4AF37]/10 p-2 space-y-2 bg-[#0F0F0F] custom-scrollbar">
                        {products.map(p => {
                          const isSelected = abandonedProdIds.includes(p.id);
                          return (
                            <label key={p.id} className="flex items-start gap-2 p-1.5 hover:bg-white/5 cursor-pointer text-xs text-gray-300">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => {
                                  if (isSelected) {
                                    setAbandonedProdIds(abandonedProdIds.filter(id => id !== p.id));
                                  } else {
                                    if (abandonedProdIds.length >= 3) {
                                      alert("Maximum of 3 products for cart abandonment preview.");
                                      return;
                                    }
                                    setAbandonedProdIds([...abandonedProdIds, p.id]);
                                  }
                                }}
                                className="mt-0.5"
                              />
                              <div className="flex-1">
                                <span className="font-medium text-white block leading-tight">{p.title}</span>
                                <span className="text-[10px] text-gray-500 font-mono">${p.price.toFixed(2)}</span>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={sendingAbandonment}
                      className="w-full flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#F0C75E] text-[#0A0A0A] font-bold uppercase text-xs tracking-widest py-3 rounded-none cursor-pointer transition-all disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      {sendingAbandonment ? "Simulating Dispatch..." : "Trigger Abandonment Alert"}
                    </button>
                  </form>
                </div>

                {/* 2. Promotional Campaigns Simulation */}
                <div className="bg-[#0A0A0A] border border-[#D4AF37]/15 p-6 rounded-none space-y-4">
                  <div className="flex items-center gap-2 border-b border-[#D4AF37]/15 pb-3">
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                    <h3 className="text-xs font-bold text-gray-300 uppercase tracking-widest">Simulate VIP Promotional Offer</h3>
                  </div>

                  <form onSubmit={handleSimulatePromoCampaign} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Recipient Email Address</label>
                      <input
                        type="email"
                        required
                        value={promoEmail}
                        onChange={(e) => setPromoEmail(e.target.value)}
                        className="w-full bg-[#0F0F0F] border border-[#D4AF37]/20 rounded-none py-2.5 px-3.5 text-xs text-white focus:border-[#D4AF37] focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Recipient Name</label>
                      <input
                        type="text"
                        required
                        value={promoName}
                        onChange={(e) => setPromoName(e.target.value)}
                        className="w-full bg-[#0F0F0F] border border-[#D4AF37]/20 rounded-none py-2.5 px-3.5 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Select Coupon Campaign</label>
                      <select
                        value={promoCampaignId}
                        onChange={(e) => setPromoCampaignId(e.target.value)}
                        className="w-full bg-[#0F0F0F] border border-[#D4AF37]/20 rounded-none py-2.5 px-3.5 text-xs text-white focus:border-[#D4AF37] focus:outline-none cursor-pointer"
                      >
                        {promotions.map(promo => (
                          <option key={promo.id} value={promo.id} className="bg-[#0A0A0A]">
                            {promo.title} ({promo.code} - {promo.discount}% Off)
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={sendingPromo}
                      className="w-full flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#F0C75E] text-[#0A0A0A] font-bold uppercase text-xs tracking-widest py-3 rounded-none cursor-pointer transition-all disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      {sendingPromo ? "Sending Campaign..." : "Send Personalized VIP Offer"}
                    </button>
                  </form>
                </div>
              </div>

              {/* Right Column: Live Email logs */}
              <div className="bg-[#0A0A0A] border border-[#D4AF37]/15 p-6 rounded-none flex flex-col min-h-[450px]">
                <div className="flex justify-between items-center border-b border-[#D4AF37]/15 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                    <h3 className="text-xs font-bold text-gray-300 uppercase tracking-widest">Real-Time Dispatch Logs</h3>
                  </div>
                  {emailLogs.length > 0 && (
                    <button
                      onClick={handleClearEmailLogs}
                      className="text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/40 text-[10px] tracking-wider uppercase font-bold py-1 px-2.5 rounded-none transition-all cursor-pointer"
                    >
                      Wipe Logs
                    </button>
                  )}
                </div>

                {loadingLogs ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-gray-500 gap-2">
                    <RefreshCw className="w-6 h-6 animate-spin text-[#D4AF37]" />
                    <span className="text-xs">Fetching logs...</span>
                  </div>
                ) : emailLogs.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-gray-500 text-center p-6 space-y-2">
                    <Mail className="w-10 h-10 text-[#D4AF37]/20" />
                    <p className="text-xs font-medium text-gray-400">No emails dispatched yet</p>
                    <p className="text-[10px] text-gray-600 max-w-xs">
                      Make a customer order on the Mall frontend, or use the simulation triggers on the left to fire emails instantly!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar flex-1">
                    {emailLogs.map((log) => (
                      <div key={log.id} className="border border-[#D4AF37]/10 bg-[#0F0F0F] p-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-mono text-[9px] uppercase bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 px-2 py-0.5 rounded-none tracking-widest">
                              {log.type.replace('_', ' ')}
                            </span>
                            <h4 className="font-serif italic text-white text-sm mt-2">{log.subject}</h4>
                          </div>
                          <span className="text-[9px] font-mono text-gray-500">{new Date(log.sentAt).toLocaleTimeString()}</span>
                        </div>

                        <div className="text-xs text-gray-400 space-y-0.5 font-mono">
                          <div><span className="text-gray-600">TO:</span> {log.recipient}</div>
                          <div><span className="text-gray-600">REF ID:</span> {log.id}</div>
                        </div>

                        <div className="flex gap-2 pt-1 border-t border-white/5">
                          <button
                            onClick={() => setSelectedLog(log)}
                            className="flex-1 flex items-center justify-center gap-1.5 bg-[#0A0A0A] hover:bg-white/5 border border-[#D4AF37]/20 text-[#D4AF37] text-[10px] tracking-wider uppercase font-bold py-1.5 rounded-none transition-all cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Live Preview
                          </button>
                          {log.previewUrl && (
                            <a
                              href={log.previewUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="flex-1 flex items-center justify-center gap-1.5 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/35 text-[#D4AF37] text-[10px] tracking-wider uppercase font-bold py-1.5 rounded-none transition-all text-center"
                            >
                              Inbox View
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* EMAIL PREVIEW OVERLAY MODAL */}
            {selectedLog && (
              <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-[#0F0F0F] border border-[#D4AF37] w-full max-w-2xl h-[85vh] flex flex-col shadow-2xl">
                  {/* Modal Header */}
                  <div className="p-4 border-b border-[#D4AF37]/25 flex justify-between items-center bg-[#0A0A0A]">
                    <div>
                      <h3 className="font-serif text-sm font-light text-white italic">HTML Delivery Preview</h3>
                      <p className="text-gray-500 text-[10px] uppercase tracking-wider font-mono mt-0.5">Subject: {selectedLog.subject}</p>
                    </div>
                    <button
                      onClick={() => setSelectedLog(null)}
                      className="text-gray-400 hover:text-white border border-white/10 hover:border-white/30 px-3 py-1 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer bg-[#0A0A0A]"
                    >
                      Close
                    </button>
                  </div>

                  {/* Mail metadata header */}
                  <div className="p-4 bg-[#141416] border-b border-white/5 text-[11px] font-mono text-gray-400 space-y-1">
                    <div><span className="text-[#D4AF37] font-bold">FROM:</span> Elegant Concierge &lt;concierge@elegantmall.com&gt;</div>
                    <div><span className="text-[#D4AF37] font-bold">TO:</span> {selectedLog.recipient}</div>
                    <div><span className="text-[#D4AF37] font-bold">DATE:</span> {new Date(selectedLog.sentAt).toLocaleString()}</div>
                    {selectedLog.previewUrl && (
                      <div className="mt-2 pt-2 border-t border-white/5">
                        <a
                          href={selectedLog.previewUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] px-3 py-1 font-bold uppercase tracking-widest transition-all inline-block"
                        >
                          View Real Ethereal Web Inbox →
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Iframe with HTML content */}
                  <div className="flex-1 bg-white">
                    <iframe
                      srcDoc={selectedLog.body}
                      title="Email HTML Preview"
                      className="w-full h-full border-none bg-white"
                      sandbox="allow-same-origin"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
