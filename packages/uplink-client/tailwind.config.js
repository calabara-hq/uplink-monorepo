
const colors = {
    
    // Base Colors
    base1: '#353F5B',
    base2: '#535D79',
    base3: '#717B97',
    
    // Neutral Colors
    neutral1: '#5D6783',
    neutral2: '#7B85A1',
    neurtral3: '#99A3BF',
    
    // Accent Colors
    primary: '#AB36BE',
    secondary: '#CC0595',
    accent1: '#57A89C',
    accent2: '#57BAD7',
    
    // Text Colors
    text1: '#FFFFFF',
    text2: '#EBEBEB',
    text3: '#DCDCDC',
    
    // Additional Colors
    success: '#60B56C',
    warning: '#FFB84D',
    error: '#E44444',
    info: '#5D9CEC',
}



module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      backgroundImage: {
        'landing': "url('/landing-bg.svg')",
        'gradient-vertical': 'linear-gradient(to bottom, rgb(32, 39, 56) 0%, rgb(7, 8, 22) 100%)',

      },
      fontFamily: {
        'virgil': ['Virgil', 'sans-serif'],
      },
      colors:{
        'twitter': '#00acee',
        //Box Border 
        'border': '#98a1c03d',
        //Background Color
        'start': '#202738',
        'end': '#070816',

      },
      boxShadow: {
        'box': '0px 40px 120px rgba(76, 130, 251, 0.16);',
      },
  },

},

  daisyui: {
    themes: [

      {
        mytheme: {

          primary: colors.primary,
          secondary: colors.secondary,
          accent: colors.accent1,
          'primary-content': colors.text1,
          'secondary-content': colors.text1,
          'accent-content': colors.text1,
          'base-100': colors.base1,
          'base-200': colors.base2,
          'base-300': colors.base3,
          neutral: colors.neutral1,
          info: colors.info,
          success: colors.success,
          warning: colors.warning,
          error: colors.error,
  

        }
      }
    ]
  },
    
  /*daisyui: {
    themes: ["dark",
    {
      

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

  },*/

  plugins: [
    require("daisyui")
  ],
}

