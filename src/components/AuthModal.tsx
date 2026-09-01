import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  User,
  Phone,
  Mail,
  Lock,
  Sparkles,
  CheckCircle2,
  Users,
  Smartphone,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    currentUser,
    setCurrentUser,
    parentPhone,
    setParentPhone,
    switchRole,
  } = useApp();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(parentPhone);
  const [role, setRole] = useState<'parent' | 'kid' | 'guest'>(currentUser.role);
  const [password, setPassword] = useState('••••••••');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentUser({
      ...currentUser,
      name,
      email,
      role,
      parentPhoneNumber: phone,
    });
    setParentPhone(phone);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsAuthModalOpen(false);
    }, 900);
  };

  const handleQuickRole = (r: 'parent' | 'kid' | 'guest') => {
    switchRole(r);
    setIsAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-6 bg-blue-900 text-white relative">
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-blue-800 flex items-center justify-center text-white border border-blue-700 shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold">
                {mode === 'signin' ? 'Sign In to SafeScroll' : 'Create Guardian Account'}
              </h2>
              <p className="text-xs text-blue-200 mt-0.5">
                Youth Social Media Impact & Parent SMS Alert Guardian
              </p>
            </div>
          </div>
        </div>

        {/* Quick Role Switcher Presets */}
        <div className="p-5 pb-3 border-b border-slate-200 bg-slate-50">
          <p className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Quick Demo 1-Click Login:
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleQuickRole('parent')}
              className={`p-2.5 rounded-md border text-left transition-all ${
                currentUser.role === 'parent'
                  ? 'bg-blue-50 border-blue-600 text-blue-900 ring-1 ring-blue-500/30'
                  : 'bg-white border-slate-200 hover:border-blue-300 text-slate-700'
              }`}
            >
              <div className="font-bold text-xs flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-blue-600" /> Parent
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">Manage Limits & SMS</p>
            </button>

            <button
              onClick={() => handleQuickRole('kid')}
              className={`p-2.5 rounded-md border text-left transition-all ${
                currentUser.role === 'kid'
                  ? 'bg-blue-50 border-blue-600 text-blue-900 ring-1 ring-blue-500/30'
                  : 'bg-white border-slate-200 hover:border-blue-300 text-slate-700'
              }`}
            >
              <div className="font-bold text-xs flex items-center gap-1">
                <Smartphone className="w-3.5 h-3.5 text-indigo-600" /> Teen / Kid
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">Under-18 Learner</p>
            </button>

            <button
              onClick={() => handleQuickRole('guest')}
              className={`p-2.5 rounded-md border text-left transition-all ${
                currentUser.role === 'guest'
                  ? 'bg-blue-50 border-blue-600 text-blue-900 ring-1 ring-blue-500/30'
                  : 'bg-white border-slate-200 hover:border-blue-300 text-slate-700'
              }`}
            >
              <div className="font-bold text-xs flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Guest / Edu
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">Explore Research</p>
            </button>
          </div>
        </div>

        {/* Custom Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-3.5">
          <div className="flex border-b border-slate-200 pb-2">
            <button
              type="button"
              onClick={() => setMode('signin')}
              className={`flex-1 text-center py-1.5 text-xs font-semibold border-b-2 transition-colors ${
                mode === 'signin'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`flex-1 text-center py-1.5 text-xs font-semibold border-b-2 transition-colors ${
                mode === 'signup'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Sign Up / Register
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sarah Mitchell"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="parent@example.com"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Parent Phone Number (For SMS Over-limit Notifications)
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Used to deliver automatic SMS alerts when under-18 kids exceed their screen time.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-all flex items-center justify-center gap-2"
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" /> Signed In!
                </>
              ) : (
                mode === 'signin' ? 'Sign In' : 'Create Account & Enable SMS'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
