/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        notion: {
          bg: '#ffffff',
          sidebar: '#f7f7f5',
          hover: '#efefed',
          text: '#37352f',
          textLight: '#787774',
          border: '#e9e9e7',
          highlight: '#ebeced'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      }
    },
  },
  corePlugins: {
    preflight: false, // Disable Tailwind's CSS reset to avoid conflicts with Chakra UI
  },
  plugins: [],
}
