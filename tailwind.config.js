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
        spider: {
          red: '#ff003c',
          blue: '#00f0ff',
          black: '#0a0a0c',
          dark: '#121218',
          yellow: '#ffe600',
          magenta: '#ff007f',
          purple: '#9d00ff',
          green: '#39ff14',
          gray: '#1e1e24',
        }
      },
      fontFamily: {
        comic: ['Bangers', 'Impact', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'comic': '4px 4px 0px #000000',
        'comic-lg': '8px 8px 0px #000000',
        'comic-glow': '0 0 20px var(--theme-accent)',
        'cyber': '0 0 15px var(--theme-primary), 0 0 30px var(--theme-secondary)',
      },
      keyframes: {
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        },
        'spider-pulse': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.05)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      animation: {
        'glitch': 'glitch 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) both infinite',
        'spider-pulse': 'spider-pulse 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
