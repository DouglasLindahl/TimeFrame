/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Arial', 'sans'],
      },
      colors: {
        primary: {
          dark: '#6C63FF',
          light: '#A9A6FF',
        },
        secondary: {
          dark: '#FF6B6B',
          light: '#FFA8A8',
        },
        background: '#202020',
        text: {
          dark: '#333333',
          light: '#888888',
        },
        accent: {
          dark: '#2BB8B8',
          light: '#6ADDDD',
        },
        cta: {
          dark: '#FFD700',
          light: '#FFEA99',
        },
        success: {
          dark: '#4CAF50',
          light: '#8BC34A',
        },
        error: {
          dark: '#FF0000',
          light: '#FF5733',
        },
      },
    },
  },
  plugins: [],
}
