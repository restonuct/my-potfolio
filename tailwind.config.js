/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        apple: {
          bg: {
            light: '#F5F5F7',
            dark: '#000000',
          },
          card: {
            light: '#FFFFFF',
            dark: '#0D0D10',
          },
          subcard: {
            light: '#F8F8FA',
            dark: '#16161A',
          },
          blue: {
            DEFAULT: '#0071E3',
            hover: '#0077ED',
            dark: '#2997FF',
          },
          gray: {
            text: '#86868B',
            darkText: '#A1A1A6',
            borderLight: 'rgba(0, 0, 0, 0.08)',
            borderDark: 'rgba(255, 255, 255, 0.08)',
          }
        }
      },
      fontFamily: {
        sf: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "SF Pro Text",
          "Inter",
          "system-ui",
          "sans-serif"
        ]
      },
      borderRadius: {
        'squircle-sm': '14px',
        'squircle': '20px',
        'squircle-lg': '28px',
        'squircle-xl': '36px',
      },
      letterSpacing: {
        'apple-tight': '-0.025em',
        'apple-tighter': '-0.035em',
      },
      boxShadow: {
        'apple-glass': '0 8px 32px 0 rgba(0, 0, 0, 0.06)',
        'apple-glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
        'apple-hover': '0 16px 40px -10px rgba(0, 0, 0, 0.12)',
        'apple-hover-dark': '0 20px 48px -10px rgba(0, 0, 0, 0.7)',
        'specular-light': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.8)',
        'specular-dark': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)',
      }
    },
  },
  plugins: [],
}
