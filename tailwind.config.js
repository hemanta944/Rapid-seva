/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#F04416',
          'orange-hover': '#D8380E',
          'orange-light': '#FFF0EC',
          secondary: '#FF6B35',
          black: '#111111',
          charcoal: '#242424',
          'light-grey': '#F5F5F5',
          border: '#E5E7EB',
          muted: '#6B7280',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'brand': '0 4px 20px -2px rgba(240, 68, 22, 0.2)',
        'card': '0 2px 12px 0 rgba(0, 0, 0, 0.05)',
        'elevated': '0 10px 30px -5px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'radar': 'radar 2.5s ease-out infinite',
      },
      keyframes: {
        radar: {
          '0%': { transform: 'scale(0.8)', opacity: '0.8' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        }
      }
    },
  },
  plugins: [],
}
