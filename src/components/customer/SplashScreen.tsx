import React, { useEffect, useState } from 'react';
import { Logo } from '../common/Logo';
import { ShieldCheck, ArrowRight, Clock } from 'lucide-react';

interface SplashScreenProps {
  onDismiss: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onDismiss }) => {
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 20;
      });
    }, 150);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-[#111111] text-white flex flex-col items-center justify-between p-6 sm:p-10 select-none">
      {/* Top subtle branding */}
      <div className="flex items-center gap-2 text-xs text-gray-400 font-semibold tracking-wider uppercase mt-4">
        <ShieldCheck className="w-4 h-4 text-[#F04416]" />
        Verified Roadside Assistance Platform
      </div>

      {/* Center Brand Identity */}
      <div className="flex flex-col items-center text-center max-w-md w-full">
        {/* Logo Card */}
        <div className="p-4 bg-white rounded-3xl shadow-2xl shadow-orange-950/50 mb-8 border border-gray-800">
          <Logo size="xl" showText={false} />
        </div>

        <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-2">
          Rapid<span className="text-[#F04416]">Seva</span>
        </h1>

        <p className="text-lg sm:text-xl text-gray-300 font-medium tracking-wide mb-3">
          Help on Road. With You Soon.
        </p>

        {/* Marketing Target Tag */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-orange-950/80 border border-[#F04416]/50 text-xs text-[#FF6B35] font-semibold mb-8">
          <Clock className="w-3.5 h-3.5" />
          Target: Assistance Within 30 Mins*
        </div>

        {/* Loading Bar */}
        <div className="w-64 h-1.5 bg-gray-800 rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-gradient-to-r from-[#FF6B35] to-[#F04416] transition-all duration-200 ease-out"
            style={{ width: `${loadingProgress}%` }}
          />
        </div>

        <p className="text-xs text-gray-400">
          {loadingProgress < 100 ? 'Connecting to telematics & nearby mechanics...' : 'Ready for roadside dispatch'}
        </p>
      </div>

      {/* Bottom CTA / Skip */}
      <div className="w-full max-w-sm mb-4">
        <button
          onClick={onDismiss}
          className="w-full py-4 bg-[#F04416] hover:bg-[#D8380E] text-white font-extrabold rounded-2xl shadow-brand flex items-center justify-center gap-2 transition-all transform active:scale-98"
        >
          <span>Get Started</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        <p className="text-[10px] text-gray-400 text-center mt-3">
          *Target response time depends on vehicle breakdown spot and active technician availability.
        </p>
      </div>
    </div>
  );
};
