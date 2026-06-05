/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Framer surfaces
        canvas: '#090909',
        'surface-1': '#141414',
        'surface-2': '#1c1c1c',
        hairline: '#262626',
        'hairline-soft': '#1a1a1a',
        // Framer text
        ink: '#ffffff',
        'ink-muted': '#999999',
        // Framer accent (links/focus ONLY)
        'accent-blue': '#0099ff',
        // Framer gradients (spotlight cards)
        'gradient-violet': '#6a4cf5',
        'gradient-magenta': '#d44df0',
        'gradient-orange': '#ff7a3d',
        'gradient-coral': '#ff5577',
        // Semantic
        success: '#22c55e',
        danger: '#ef4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
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
  plugins: [],
}
