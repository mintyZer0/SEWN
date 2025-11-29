/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./global/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      // device-style breakpoints (you can use prefixes like `mobile:`, `tablet:`, `desktop:`)
      // `mobile` is a max-width breakpoint (applies at <=639px)
      mobile: { max: "639px" },
      // `tablet` and `desktop` are min-width breakpoints
      tablet: "640px",
      desktop: "1024px",
    },
    extend: {},
  },
  plugins: [],
};
