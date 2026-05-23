import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/plugin-groups/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Japanese-inspired product palette: sumi ink, ai blue, sakura, matcha, and shu red.
        brand: {
          50: '#eef7ff',
          100: '#d9edff',
          200: '#b9ddff',
          300: '#86c5ff',
          400: '#4da4f7',
          500: '#1f7ad8',
          600: '#185fae',
          700: '#194c88',
          800: '#193f6b',
          900: '#173555',
          950: '#0b1d30',
        },
        sakura: {
          300: '#f7b7c7',
          400: '#ee8fa8',
          500: '#d96c89',
        },
        matcha: {
          300: '#b7d782',
          400: '#8fb55f',
          500: '#6f9546',
        },
        shu: {
          300: '#f0a06f',
          400: '#df754a',
          500: '#b94f34',
        },
        washi: {
          100: '#f3ead8',
          200: '#d8c8a8',
        },
        surface: {
          DEFAULT: '#0b0f14',
          secondary: '#111821',
          elevated: '#172231',
          border: '#293746',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
