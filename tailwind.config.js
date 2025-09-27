/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html','./src/**/*.{vue,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"roboto"', 'ui-sans-serif', 'system-ui'],  // 默认无衬线字体
        serif: ['"Georgia"', 'ui-serif', 'serif'],        // 默认衬线字体
        mono: ['"Fira Code"', 'ui-monospace', 'monospace']
      },
      colors: {
        text: {
          DEFAULT: '#4A5568', // 柔和深灰色，代替黑色
        }
      }
    },
  },
  plugins: [],
}

