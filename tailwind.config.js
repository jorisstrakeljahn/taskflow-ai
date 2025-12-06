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
        'surface-light': '#fafafa',
        'surface-dark': '#1a1a1a',
        'card-light': '#ffffff',
        'card-dark': '#242424',
        'border-light': '#e5e5e5',
        'border-dark': '#3a3a3a',
        'text-primary-light': '#1a1a1a',
        'text-primary-dark': '#fafafa',
        'text-secondary-light': '#6b6b6b',
        'text-secondary-dark': '#a0a0a0',
        'accent-light': '#3b82f6',
        'accent-dark': '#60a5fa',
      },
    },
  },
  plugins: [],
}

