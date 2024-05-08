const flowbite = require("flowbite-react/tailwind");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    flowbite.content(),
  ],
  theme: {
    extend: {
      maxHeight: {
        '550': '550px',
      },
      minHeight: {
        '550': '550px',
      },
      height: {
        '550': '550px',
      },
      width: {
        '550': '550px',
      },
      colors: {
        'textbox-color': '#DBDBDB',
      },
      transitionProperty: {
        'width': 'width',
        'transform': 'transform',
      },
      
    },
  },
  plugins: [
    flowbite.plugin(),
  ],
}

