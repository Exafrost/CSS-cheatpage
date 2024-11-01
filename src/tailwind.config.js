/** @type {import('tailwindcss').Config} */

// npx tailwindcss -i ./input.css -o ./output.css --watch
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily :{
        lucon: ['lucon', 'sans-serif'],
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        wiggleHard : {
          '0%, 100%': { transform: 'rotate(-15deg)' },
          '50%': { transform: 'rotate(15deg)' },
        },
        wiggleVeryHard : {
          '0%, 100%': { transform: 'rotate(-60deg)' },
          '50%': { transform: 'rotate(60deg)' },
        },
      },
      animation: {
        wiggle: 'wiggle 1s ease-in-out infinite',
        wiggleHard: 'wiggleHard 1s ease-in-out infinite',
        wiggleVeryHard: 'wiggleVeryHard 1s ease-in-out infinite',
    }
  },
  },
  plugins: [],
}


