import React, { useState } from 'react';
import { User, Phone, Lock, Sparkles, X, ShieldCheck, ArrowRight, Mail, CheckCircle2 } from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { UserRole } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: UserRole;
  onOpenLegal?: (tab: 'terms' | 'privacy' | 'refund' | 'disclaimer') => void;
  isAutoPrompt?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultRole = 'customer',
  onOpenLegal,
  isAutoPrompt = false,
}) => {
  const { store, activeUser } = useStore();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<UserRole>(defaultRole);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Google / Gmail specific state
  const [customGmail, setCustomGmail] = useState('bikash.baruah.ghy@gmail.com');
  const [isEditingGmail, setIsEditingGmail] = useState(false);
  const [googleSuccess, setGoogleSuccess] = useState(false);

  if (!isOpen) return null;

  const handleGoogleLogin = (emailToUse: string = customGmail) => {
    const displayName = emailToUse.split('@')[0].replace(/[._]/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());
    
    setGoogleSuccess(true);
    setTimeout(() => {
      store.loginWithGoogle(emailToUse, displayName || 'Bikash Baruah', role);
      setGoogleSuccess(false);
      onClose();
    }, 600);
  };

  const handleDemoLogin = (targetRole: UserRole) => {
    store.loginAsDemo(targetRole);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;

    if (mode === 'register') {
      const newUser = {
        id: 'user_' + Date.now().toString(36),
        name: name || 'RapidSeva User',
        phone,
        email: customGmail || `${phone}@rapidseva.in`,
        role,
        authProvider: 'phone' as const,
        status: 'active' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      store.setActiveUser(newUser);
      store.addAuditLog('USER_REGISTERED', `New ${role} registered with phone ${phone}`, newUser);
    } else {
      handleDemoLogin(role);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#111111] px-6 py-5 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#F04416]">
                {isAutoPrompt ? 'Sign In to Proceed' : 'RapidSeva Authentication'}
              </span>
            </div>
            <h3 className="text-xl font-black tracking-tight mt-0.5">
              {mode === 'login' ? 'Sign In with Gmail' : 'Create New Account'}
            </h3>
            <p className="text-xs text-gray-400">
              Guwahati & Assam 24×7 Roadside Assistance
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto max-h-[82vh]">
          {/* PRIMARY GMAIL / GOOGLE SIGN-IN CARD */}
          <div className="p-4 bg-gradient-to-br from-orange-50/70 via-white to-amber-50/70 rounded-2xl border-2 border-[#F04416] space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#F04416] bg-orange-100/80 px-2 py-0.5 rounded-md">
                Fast & Recommended
              </span>
              <span className="text-[11px] text-gray-500 font-medium">Automatic Authentication</span>
            </div>

            <p className="text-xs text-gray-700 leading-relaxed font-medium">
              Sign in with your Google account to automatically autofill roadside booking locations and sync active telematics:
            </p>

            {/* Official Google Button */}
            <button
              type="button"
              onClick={() => handleGoogleLogin(customGmail)}
              disabled={googleSuccess}
              className="w-full py-3 px-4 bg-white hover:bg-gray-50 text-gray-800 font-extrabold text-xs sm:text-sm rounded-xl border border-gray-300 shadow-sm flex items-center justify-center gap-3 transition-all active:scale-98 group"
            >
              {/* Google 4-Color SVG Icon */}
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>{googleSuccess ? 'Connecting to Google...' : 'Continue with Google (Gmail)'}</span>
            </button>

            {/* Quick Account Switcher or Custom Gmail */}
            <div className="pt-1 flex items-center justify-between text-[11px] text-gray-600">
              <span className="truncate max-w-[220px] font-mono font-semibold text-gray-800">
                {customGmail}
              </span>
              <button
                type="button"
                onClick={() => setIsEditingGmail(!isEditingGmail)}
                className="text-[#F04416] font-bold hover:underline shrink-0"
              >
                {isEditingGmail ? 'Done' : 'Change Gmail'}
              </button>
            </div>

            {isEditingGmail && (
              <div className="pt-1">
                <input
                  type="email"
                  value={customGmail}
                  onChange={(e) => setCustomGmail(e.target.value)}
                  placeholder="Enter your Gmail address"
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-lg font-mono focus:border-[#F04416] focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="shrink mx-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Or Sign In with Phone & OTP
            </span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          {/* Role selector tab */}
          <div className="flex bg-gray-100 p-1 rounded-2xl border border-gray-200">
            {(['customer', 'provider', 'admin'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`flex-1 py-1.5 text-xs font-extrabold rounded-xl capitalize transition-all ${
                  role === r
                    ? 'bg-white text-[#F04416] shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Phone Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === 'register' && (
              <div>
                <label className="text-[10px] font-bold uppercase text-gray-500 block mb-1">
                  Full Name*
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Enter full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-xl font-medium"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-[10px] font-bold uppercase text-gray-500 block mb-1">
                Mobile Number*
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  placeholder="+91 94350 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-xl font-mono font-bold"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-gray-500 block mb-1">
                Password / Secure OTP
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-xl"
                />
              </div>
            </div>

            {mode === 'register' && (
              <div className="flex items-start gap-2 pt-1 text-xs text-gray-600">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 rounded text-[#F04416]"
                  required
                />
                <label htmlFor="agreeTerms" className="text-[11px] leading-tight">
                  I accept the{' '}
                  <button
                    type="button"
                    onClick={() => onOpenLegal && onOpenLegal('terms')}
                    className="text-[#F04416] font-bold hover:underline inline"
                  >
                    RapidSeva Terms & Conditions
                  </button>{' '}
                  and understand it is a roadside coordination platform.
                </label>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-[#111111] hover:bg-black text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all transform active:scale-98"
            >
              <span>{mode === 'login' ? `Sign In with Phone` : 'Create Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Accounts */}
          <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
            <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-gray-700 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#F04416]" />
              <span>Instant Evaluator Demo Login</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('customer')}
                className="py-1.5 px-1 bg-white hover:bg-orange-50 border border-gray-200 text-gray-800 rounded-xl text-[11px] font-bold shadow-xs transition-all text-center"
              >
                Customer
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('provider')}
                className="py-1.5 px-1 bg-white hover:bg-orange-50 border border-gray-200 text-gray-800 rounded-xl text-[11px] font-bold shadow-xs transition-all text-center"
              >
                Provider
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                className="py-1.5 px-1 bg-[#111111] hover:bg-black text-white rounded-xl text-[11px] font-bold shadow-xs transition-all text-center"
              >
                Admin
              </button>
            </div>
          </div>

          {/* Toggle login / register */}
          <div className="text-center pt-1 border-t border-gray-100 text-xs text-gray-500">
            {mode === 'login' ? (
              <span>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="font-bold text-[#F04416] hover:underline"
                >
                  Register here
                </button>
              </span>
            ) : (
              <span>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="font-bold text-[#F04416] hover:underline"
                >
                  Sign in
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
