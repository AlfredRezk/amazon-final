/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode:"class",
  content: [
    "./views/**/*.hbs"
  ],
  theme: {
    extend: {
      colors:{
        "primary-orange":"#ffa41c"
      }
    },
  },
  plugins: [],
}

