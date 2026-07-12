import React, { useState } from 'react';
import { User } from '../types';
import { Lock, Mail, UserPlus, LogIn, Sparkles, ShieldCheck, AlertCircle } from 'lucide-react';

interface LoginSectionProps {
  onLoginSuccess: (user: User) => void;
}

export default function LoginSection({ onLoginSuccess }: LoginSectionProps) {
  const [isRegister, setIsRegister] = useState(false);
  
  // Form values
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess('Login successful!');
        setTimeout(() => {
          onLoginSuccess(data.user);
        }, 800);
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('Connection to backend auth service failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, role: 'customer' })
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess('Registration successful! Please login below.');
        setIsRegister(false);
        setPassword('');
      } else {
        setError(data.error || 'Failed to create account');
      }
    } catch (err) {
      setError('Connection to register service failed.');
    } finally {
      setLoading(false);
    }
  };

  // Quick Account Bypass buttons for user review
  const handleQuickLogin = async (presetEmail: string) => {
    setError('');
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: presetEmail, password: 'password123' })
      });

      const data = await response.json();
      if (response.ok) {
        onLoginSuccess(data.user);
      }
    } catch (err) {
      setError('Failed during quick preset login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 px-6 max-w-lg mx-auto">
      {/* Container Box */}
      <div className="bg-[#0F0F0F] border border-[#D4AF37]/15 rounded-none p-8 shadow-2xl relative overflow-hidden">
        {/* Glow border background decoration */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 bg-[#D4AF37]/15 border border-[#D4AF37]/35 rounded-none px-3 py-1 mb-3 text-[10px] font-bold text-[#D4AF37] tracking-[0.20em] uppercase">
            <Sparkles className="w-3 h-3 animate-pulse" />
            <span>SECURE GATEWAY</span>
          </div>
          <h2 className="font-serif text-3xl font-light text-white italic tracking-wide">
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-gray-400 text-xs mt-1 font-light tracking-wide">
            {isRegister ? 'Register your premium mall membership' : 'Sign in to access your luxury shopping panel'}
          </p>
        </div>

        {/* Feedback alerts */}
        {error && (
          <div className="bg-red-400/10 border border-red-500/30 text-red-400 p-4 rounded-none text-xs flex items-center gap-2 mb-6">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 p-4 rounded-none text-xs flex items-center gap-2 mb-6 animate-pulse">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Auth form */}
        <form onSubmit={isRegister ? handleRegister : handleLogin} className="space-y-5">
          {isRegister && (
            <div>
              <label className="block text-[9px] font-bold text-gray-500 uppercase mb-2 tracking-widest">Full Name</label>
              <div className="relative">
                <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full bg-[#0A0A0A] border border-[#D4AF37]/20 rounded-none py-3 pl-10 pr-4 text-xs text-white uppercase tracking-wider focus:border-[#D4AF37] focus:outline-none transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[9px] font-bold text-gray-500 uppercase mb-2 tracking-widest">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. admin@elegantmall.com"
                className="w-full bg-[#0A0A0A] border border-[#D4AF37]/20 rounded-none py-3 pl-10 pr-4 text-xs text-white focus:border-[#D4AF37] focus:outline-none transition-colors uppercase tracking-wider font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-[9px] font-bold text-gray-500 uppercase mb-2 tracking-widest">Secret Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0A0A0A] border border-[#D4AF37]/20 rounded-none py-3 pl-10 pr-4 text-xs text-white focus:border-[#D4AF37] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#F0C75E] text-[#0A0A0A] font-bold uppercase text-xs tracking-widest py-4 rounded-none cursor-pointer shadow-lg active:scale-95 transition-all"
          >
            {isRegister ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
            {loading ? 'Authorizing...' : isRegister ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        {/* Register/Login switch trigger */}
        <div className="text-center mt-6">
          <button
            onClick={() => { setIsRegister(!isRegister); setError(''); setSuccess(''); }}
            className="text-xs text-[#D4AF37] hover:text-[#F0C75E] transition-colors font-semibold cursor-pointer underline"
          >
            {isRegister ? 'Already have an account? Sign In' : 'New to Elegant Mall? Sign Up'}
          </button>
        </div>

        {/* DEMO ACCOUNTS QUICK-LOGIN PANEL */}
        <div className="mt-8 pt-6 border-t border-white/5 space-y-4">
          <span className="block text-center text-[10px] text-gray-500 uppercase font-bold tracking-[0.2em]">
            Reviewer Demo Access
          </span>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleQuickLogin('admin@elegantmall.com')}
              className="bg-[#0A0A0A] hover:bg-[#D4AF37]/10 border border-[#D4AF37]/15 hover:border-[#D4AF37]/50 py-3.5 px-4 rounded-none text-center cursor-pointer transition-all"
            >
              <span className="block text-[#D4AF37] font-bold text-xs uppercase mb-0.5 tracking-wider">Test Admin</span>
              <span className="text-[9px] font-mono text-gray-500 tracking-wide">Full CRUD, Sales charts</span>
            </button>

            <button
              onClick={() => handleQuickLogin('customer@elegantmall.com')}
              className="bg-[#0A0A0A] hover:bg-[#D4AF37]/10 border border-[#D4AF37]/15 hover:border-[#D4AF37]/50 py-3.5 px-4 rounded-none text-center cursor-pointer transition-all"
            >
              <span className="block text-white font-bold text-xs uppercase mb-0.5 tracking-wider">Test Customer</span>
              <span className="text-[9px] font-mono text-gray-500 tracking-wide">M-Pesa payment, Checkout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
