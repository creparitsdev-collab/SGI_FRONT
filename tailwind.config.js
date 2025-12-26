const { heroui } = require("@heroui/react");

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-6px)' },
          '40%': { transform: 'translateX(6px)' },
          '60%': { transform: 'translateX(-3px)' },
          '80%': { transform: 'translateX(3px)' },
        }
      },
      animation: {
        shake: 'shake 0.6s ease-in-out',
      },
      screens: {
        xs: '400px',
        mlg: '832px'
      }
    },
  },
  darkMode: "class",
  plugins: [heroui({
		themes: {
		  light: {
        colors: {
          primary: {
            50:   '#ecf8f8', 
            100:  '#daf0f1', 
            200:  '#b5e2e3', 
            300:  '#8fd3d6', 
            400:  '#6ac5c8', 
            500:  '#45b6ba',
            600:  '#379295', 
            700:  '#296d70', 
            800:  '#1c494a', 
            900:  '#0e2425', 
            950:  '#071213', 
            DEFAULT: "#368e91",
            foreground: "#f2f2f2",
          },
          default: {
            100: '#e6e6e6',
          },
          secondary: {
            50: '#eff5f6',
            100: '#dfebec',
            200: '#bed8da',
            300: '#9ec4c7',
            400: '#7db1b5',
            500: '#5d9da2',
            600: '#4a7e82',
            700: '#385e61',
            800: '#253f41',
            900: '#131f20',
            950: '#091010',
            DEFAULT: "#4C8084",
            foreground: "#f2f2f2",
          },
          background: {
            50:  '#f2f2f2',
            100: '#e6e6e6',
            200: '#cccccc',
            300: '#b3b3b3',
            400: '#999999',
            500: '#808080',
            600: '#666666',
            700: '#4d4d4d',
            800: '#333333',
            900: '#1a1a1a',
            950: '#0d0d0d',
            DEFAULT: "#f2f2f2", 
            foreground: "#0d0d0d",
          },		
          focus: "#368e91"
        }
		  },
			dark: {
        colors: {
          primary: {
            50: '#071213',
            100: '#0e2425',
            200: '#1c494a',
            300: '#296d70',
            400: '#379295',
            500: '#45b6ba',
            600: '#6ac5c8',
            700: '#8fd3d6',
            800: '#b5e2e3',
            900: '#daf0f1',
            950: '#ecf8f8',
            DEFAULT: "#6ec6c9", 
            foreground: "#0d0d0d",
          },
          default: {
            100: '#1F1F1F',
          },
          secondary: {
            50: '#091010',
            100: '#131f20',
            200: '#253f41',
            300: '#385e61',
            400: '#4a7e82',
            500: '#5d9da2',
            600: '#7db1b5',
            700: '#9ec4c7',
            800: '#bed8da',
            900: '#dfebec',
            950: '#eff5f6',
            DEFAULT: "#4C8084",
            foreground: "#0d0d0d",
          },
          background: {

            //50: '#121212',
            //100: '#1E1E1E',
            //200: '#2D2D2D',

            //50: '#0d0d0d',
            //100: '#1a1a1a',

            50: '#171717',
            100: '#1F1F1F',
            200: '#2B2B2B',
            300: '#4d4d4d',
            400: '#666666',
            500: '#808080',
            600: '#999999',
            700: '#b3b3b3',
            800: '#cccccc',
            900: '#e6e6e6',
            950: '#f2f2f2',
            DEFAULT: "#171717", 
            foreground: "#f2f2f2",
          },		
          focus: "#6ec6c9"
        }
		  }
		},
    layout: {
      disabledOpacity: "0.6"
    }
	})],
}