module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  
  
  daisyui: {
    theme: [
      {
        mytheme: {

          "primary": "#661AE6",

          "secondary": "#D926AA",

          "accent": "#1FB2A5",

          "neutral": "#202225",

          "base-100": "#303339",

          "info": "#3ABFF8",

          "success": "#36D399",

          "warning": "#FBBD23",

          "error": "#F87272",

          backgroundImage: {
            'landing': "url('/landing-bg-1.svg')",
          },

        },
      },
    ],

  },
  plugins: [
    require("daisyui")
  ],
}
