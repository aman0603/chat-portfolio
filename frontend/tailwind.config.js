/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        accent: {
          DEFAULT: '#06b6d4',
          light:   '#22d3ee',
          dark:    '#0891b2',
          glow:    '#00f0ff',
        },
        surface: {
          50:  '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          800: '#1e293b',
          850: '#162032',
          900: '#0f172a',
          950: '#080d1a',
        },
      },
      fontFamily: {
        display: ['"Clash Display"', '"Space Grotesk"', 'system-ui', 'sans-serif'],
        body:    ['"General Sans"', '"DM Sans"', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      animation: {
        'float':       'float 6s ease-in-out infinite',
        'glow-pulse':  'glow-pulse 2s ease-in-out infinite',
        'slide-up':    'slide-up 0.6s ease-out',
        'fade-in':     'fade-in 0.8s ease-out',
        'typing':      'typing 3.5s steps(40, end), blink-caret 0.75s step-end infinite',
        'spin-slow':   'spin 20s linear infinite',
        'bounce-slow': 'bounce 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-20px)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(6, 182, 212, 0.3)' },
          '50%':      { boxShadow: '0 0 40px rgba(6, 182, 212, 0.6)' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(40px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
      },
      backgroundImage: {
        'gradient-radial':    'radial-gradient(var(--tw-gradient-stops))',
        'gradient-mesh':      'radial-gradient(at 40% 20%, rgba(6,182,212,0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(99,102,241,0.15) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(6,182,212,0.1) 0px, transparent 50%)',
        'gradient-mesh-light':'radial-gradient(at 40% 20%, rgba(99,102,241,0.08) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(6,182,212,0.08) 0px, transparent 50%)',
      },
    },
  },
  plugins: [],
};
