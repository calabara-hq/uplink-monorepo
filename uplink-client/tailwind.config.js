import { redDark, mauveDark, crimsonDark } from '@radix-ui/colors'

const colors = {

  //Main Color
  base: mauveDark.mauve1,

  // Base Color (gray)
  base1: mauveDark.mauve3,
  base2: mauveDark.mauve4,
  base3: mauveDark.mauve5,

  // Text Colors (white)
  text1: mauveDark.mauve12,
  text2: mauveDark.mauve11,
  text3: mauveDark.mauve10,

  // Colors
  primary: crimsonDark.crimson8,

  primary1: crimsonDark.crimson1,
  primary2: crimsonDark.crimson2,
  primary3: crimsonDark.crimson3,
  primary4: crimsonDark.crimson4,
  primary5: crimsonDark.crimson5,
  primary6: crimsonDark.crimson6,
  primary7: crimsonDark.crimson7,
  primary8: crimsonDark.crimson8,
  primary9: crimsonDark.crimson9,
  primary10: crimsonDark.crimson10,
  primary11: crimsonDark.crimson11,
  primary12: crimsonDark.crimson12,

  accent: '#3a3a3a',
  error: redDark.red8,
  warning: '#FFB84D',
  success: '#30A46C',
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

        base: colors.base,
        'base-100': colors.base1,
        'base-200': colors.base2,
        'base-300': colors.base3,
        accent: colors.accent,

        t1: colors.text1,
        t2: colors.text2,
        t3: colors.text3,
        border: colors.accent,

        primary: colors.primary,
        primary1: colors.primary1,
        primary2: colors.primary2,
        primary3: colors.primary3,
        primary4: colors.primary4,
        primary5: colors.primary5,
        primary6: colors.primary6,
        primary7: colors.primary7,
        primary8: colors.primary8,
        primary9: colors.primary9,
        primary10: colors.primary10,
        primary11: colors.primary11,
        primary12: colors.primary12,

        error: colors.error,
        warning: colors.warning,
        success: colors.success

      },
      boxShadow: {
        'box': '0px 40px 120px rgba(76, 130, 251, 0.16);',
      },
      animation: {
        'springUp': 'springUp 350ms cubic-bezier(.15, 1.15, 0.6, 1.00)',
        'scrollInX': 'scrollInX 350ms ',
        'fadeIn': 'fadeIn 150ms ease-in-out',
        'fadeOut': 'fadeOut 150ms ease-in-out',
        'ping': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'spin': 'spin 1s linear infinite',
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
      fadeOut: {
        '0%': {
          opacity: '1'
        },
        '100%': {
          opacity: '0'
        }
      },
      ping: {
        "75%, 100%": {
          transform: "scale(2)",
          opacity: "0",
        }
      },
      spin: {
        "100%": {
          transform: "rotate(360deg)",
        },
      },
    })
  },

  plugins: [
    require('@tailwindcss/typography'),
  ],
}

