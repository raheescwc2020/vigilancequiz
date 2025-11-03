/** @type {import('tailwindcss').Config} */
export default {
  content: [
"./index.html", 
    // CRITICAL: This line makes sure .jsx, .tsx, .js, and .ts files in src/ are scanned.
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

