
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
  primary: '#5d9cec',
  secondary: '#CC0595',
  accent1: '#57A89C',
  accent2: '#57BAD7',

  // Text Colors
  text1: '#FFFFFF',
  text2: '#EBEBEB',
  text3: '#A1A1AA',

  // Additional Colors
  success: '#36d399',
  warning: '#FFB84D',
  error: '#f87272',
  info: '#5D9CEC',
}


const colors2 = {
  base1: '#1c1f26',
  base2: '#2b303b',
  base3: 'red'
}



module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      backgroundColor: {
        "base": "#0e1217",
      },
      backgroundImage: {
        'landing': "url('/landing-bg.svg')",
        'gradient-vertical': 'linear-gradient(to bottom, rgb(32, 39, 56) 0%, rgb(7, 8, 22) 100%)',
      },
      backgroundRepeat: {
        'repeat': 'repeat',
      },
      fontFamily: {
        'virgil': ['Virgil', 'sans-serif'],
      },
      colors: {
        'twitter': '#00acee',
        //Box Border 
        'border': '#98a1c03d',
        //Background Color
        'start': '#202738',
        'end': '#070816',
        't1': '#c8cede',
        't2': '#6b7280',

      },
      boxShadow: {
        'box': '0px 40px 120px rgba(76, 130, 251, 0.16);',
      },
      animation: {
        'springUp': 'springUp 350ms cubic-bezier(.15, 1.15, 0.6, 1.00)',
      }
    },
    keyframes: ({ theme }) => ({
      shimmer: {
        '100%': {
          transform: 'translateX(100%)',
        },
      },
      springUp: {
        '0%': {
          transform: 'translateY(100%)',
          opacity: '0'
        },
        '100%': {
          transform: 'translateY(0)',
          opacity: '1'
        }
      }

    })
  },

  daisyui: {
    themes: [

      {
        mytheme: {

          primary: colors.primary,
          secondary: colors.secondary,
          accent: colors.accent2,
          'primary-content': colors.text1,
          'secondary-content': colors.text1,
          'accent-content': colors.text2,
          'base-100': colors.base1,
          'base-200': colors.base2,
          'base-300': colors.base3,
          neutral: colors.neutral1,
          info: colors.info,
          success: colors.success,
          warning: colors.warning,
          error: colors.error,


        },
        uplinkDark: {
          primary: colors.primary,
          secondary: colors.secondary,
          accent: colors.accent2,
          'base-100': colors2.base1,
          'base-200': colors2.base2,
          'base-300': colors2.base3,
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

