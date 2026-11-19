import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  showText?: boolean;
  theme?: 'light' | 'dark';
  className?: string;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showTagline = false,
  showText = true,
  theme = 'light',
  className = '',
  onClick,
}) => {
  const sizeMap = {
    sm: { img: 'w-7 h-7', text: 'text-lg', tagline: 'text-[9px]' },
    md: { img: 'w-9 h-9', text: 'text-xl', tagline: 'text-[11px]' },
    lg: { img: 'w-12 h-12', text: 'text-2xl', tagline: 'text-xs' },
    xl: { img: 'w-16 h-16', text: 'text-3xl', tagline: 'text-sm' },
  };

  const isDark = theme === 'dark';

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Official Brand Logo Symbol in Theme Base Colours */}
      <div className={`relative flex items-center justify-center shrink-0 ${sizeMap[size].img} rounded-xl overflow-hidden shadow-xs ${isDark ? 'bg-[#242424] border border-gray-700' : 'bg-white border border-gray-100'}`}>
        <img
          src="/logo-transparent.png"
          alt="RapidSeva Logo"
          className="w-full h-full object-contain p-0.5"
          onError={(e) => {
            const target = e.currentTarget;
            target.src = '/logo.png';
          }}
        />
      </div>

      {/* Brand Name & Tagline */}
      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1">
            <span className={`font-black tracking-tight ${sizeMap[size].text} ${isDark ? 'text-white' : 'text-[#111111]'}`}>
              Rapid<span className="text-[#F04416]">Seva</span>
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#F04416] mb-0.5"></span>
          </div>

          {showTagline && (
            <span className={`font-medium tracking-normal mt-0.5 ${sizeMap[size].tagline} ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Help on Road. With You Soon.
            </span>
          )}
        </div>
      )}
    </div>
  );
};
