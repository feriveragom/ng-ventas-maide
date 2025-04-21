/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}", // Escanea archivos HTML y TS dentro de src
  ],
  theme: {
    extend: {
      colors: {
        // Definimos los colores corporativos
        'primary-dark': '#1a1a1a', // Un negro o gris muy oscuro
        'primary-yellow': '#facc15', // Tailwind 'yellow-400' como ejemplo, ajústalo si es necesario
        // Puedes añadir más tonos si quieres, ej: primary-yellow-light, primary-yellow-dark
      }
    },
  },
  plugins: [],
} 