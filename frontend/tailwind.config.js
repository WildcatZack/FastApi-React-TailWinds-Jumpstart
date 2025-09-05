/** @type {import('tailwindcss').Config} */
export default {
  content: [
    // Jinja templates so Tailwind can tree-shake properly
    "../backend/app/templates/**/*.html",
    // Frontend TSX files
    "./src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {}
  },
  plugins: []
};
