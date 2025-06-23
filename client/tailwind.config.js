/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html", 
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3ec1c8', // logo turkuazı
        dark: '#18191a',    // koyu arka plan
        light: '#ffffff',   // beyaz
        secondary: '#e5e5e5', // açık gri
      },
      keyframes: {
        'fade-in-move': {
          '0%': { opacity: '0', transform: 'translateY(-12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in-move': 'fade-in-move 0.4s ease',
      },
    },
  },
  plugins: [],
};
