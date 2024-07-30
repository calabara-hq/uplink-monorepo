
const colors = {

  // Base Colors
  base1: '#1c1f26',
  base2: '#2b303b',
  base3: '#202020',

  // Neutral Colors
  neutral1: '#5D6783',
  neutral2: '#7B85A1',
  neurtral3: '#99A3BF',

  // Accent Colors
  primary: '#57BAD7',
  secondary: '#CC0595',
  accent: '#FF0080',

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

module.exports = {
  experimental: {
    optimizeUniversalDefaults: true
  },
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      backgroundColor: {
        "base": "#121212",
      },
      backgroundImage: {
        'landing': "url('/landing-bg.svg')",
        'gradient-vertical': 'linear-gradient(to bottom, rgb(32, 39, 56) 0%, rgb(7, 8, 22) 100%)',
      },
      backgroundRepeat: {
        'repeat': 'repeat',
      },
      fontFamily: {
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
        'scrollInX': 'scrollInX 350ms ',
        'fadeIn': 'fadeIn 150ms ease-in-out',
        'ping': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
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
      },
      scrollInX: {
        '0%': {
          transform: 'translateX(-100%)',
          opacity: '0'
        },
        '100%': {
          transform: 'translateX(0)',
          opacity: '1'
        }
      },
      fadeIn: {
        '0%': {
          opacity: '0'
        },
        '100%': {
          opacity: '1'
        }
      },
      ping: {
        "75%, 100%": {
          transform: "scale(2)",
          opacity: "0",
        }
      },
    })
  },

  daisyui: {
    themes: [

      {
        uplinkDark: {
          primary: colors.primary,
          secondary: colors.secondary,
          accent: colors.accent,
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

  plugins: [
    require("daisyui"),
  ],
}

