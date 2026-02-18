/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // BibleNOW Brand Colors - Enhanced Golden Accent
        primary: {
          50: '#fefcf8',
          100: '#fdf7ed',
          200: '#fbeed6',
          300: '#f8e0b8',
          400: '#f4cc94',
          500: '#D4A574', // Enhanced golden accent - more vibrant
          600: '#C1965A',
          700: '#AE8740',
          800: '#9B7826',
          900: '#88690C',
        },
        // Dark Mode Colors - Warm Tone Throughout
        dark: {
          50: '#f5f5f4',
          100: '#e7e5e4',
          200: '#8B7355', // Borders - warm brown
          300: '#6B4E3D', // Card backgrounds - warm reddish-brown
          400: '#5A3F2E', // Sidebar and Header - warm brown
          500: '#2A2420', // Main content area - deep warm background
          600: '#1E1A17', // Deeper background
          700: '#171411', // Darker background
          800: '#100D0B', // Very dark background
          900: '#0A0807', // Deepest dark
        },
        // Accent colors
        accent: {
          50: '#fef7ee',
          100: '#fdedd6',
          200: '#fbd7ac',
          300: '#f8bb77',
          400: '#f59440',
          500: '#f26d1a',
          600: '#e35510',
          700: '#bc4010',
          800: '#963315',
          900: '#7a2c14',
        },
        // Success/Error colors
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',

        // BibleNOW landing + auth (match auth-biblenow repo)
        biblenow: {
          brown: '#3E2723',
          beige: '#f5f5dc',
          gold: '#d4af37',
          'gold-light': '#e9d285',
          'brown-light': '#5D4037',
          'brown-dark': '#1d1914',
          red: '#E52D27',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
  darkMode: 'class',
};
