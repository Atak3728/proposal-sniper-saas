import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6366F1',
        'primary-hover': '#4F46E5',
        background: '#0E1117',
        'background-light': '#f5f6f8',
        'background-dark': '#101622',
        'deep-dark': '#0E1117',
        'sidebar-bg': '#13161c',
        'surface-dark': '#1b1f27',
        'surface-lighter': '#1e1a24',
        'border-dark': '#282e39',
        'glass-panel': 'rgba(30, 26, 36, 0.4)',
        'glass-border': 'rgba(255, 255, 255, 0.08)',
        'card-dark': '#1b1f27',
        'electric-purple': '#6366F1',
      },
      fontFamily: {
        sans: ['var(--font-spline-sans)', 'sans-serif'],
        display: ['var(--font-spline-sans)', 'sans-serif'],
        mono: ['monospace', 'ui-monospace', 'SFMono-Regular'],
      },
      borderRadius: {
        DEFAULT: '1rem',
        lg: '2rem',
        xl: '3rem',
        full: '9999px',
      },
       backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
export default config;
