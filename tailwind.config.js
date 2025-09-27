/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html','./src/**/*.{vue,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        cn: ['"Noto Sans SC"', 'ui-sans-serif', 'system-ui'],//中文
        eng: ['"Rubik"', 'ui-sans-serif', 'system-ui'], //英文
      }
    },
  },
  plugins: [],
}

