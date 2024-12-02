/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    screens: { //default is extraextrasmall i suppose
      
      'extraSmall': '440px',

      'small': '640px',
      
      'medium': '840px',

      'large': '1040px',
      

      'extraLarge': '1240px',
      
    },
    extend: {
      fontFamily:{
        exo2: ['exo2'],
        bebas: ['bebasneue']
      },
      
    },
  },
  plugins: [],
}

