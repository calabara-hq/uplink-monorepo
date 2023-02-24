module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      backgroundImage: {
        'landing': "url('/landing-bg.svg')",
      }
    }
  },


  daisyui: {
    themes: ["dark"]
    /*
    {
      
      mytheme: {

        "primary": "#661AE6",

        "secondary": "#D926AA",

        "accent": "#1FB2A5",

        "neutral": "#202225",

        "base": "#303339",

        "info": "#3ABFF8",

        "success": "#36D399",

        "warning": "#FBBD23",

        "error": "#F87272",

      },
      mytheme: {

        "primary": "#b2c3ff",

        "secondary": "#3e2596",

        "accent": "#6f76d6",

        "neutral": "#1D2734",

        "base-100": "#393239",

        "info": "#759CF0",

        "success": "#17C488",

        "warning": "#FAC36B",

        "error": "#DD2622",
      },
    },
    
  ],
  */

  },
  plugins: [
    require("daisyui")
  ],
}

