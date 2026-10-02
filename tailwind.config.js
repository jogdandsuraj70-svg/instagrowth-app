/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ios: {
          bg: '#F2F2F7',
          card: '#FFFFFF',
          blue: '#007AFF',
          green: '#34C759',
          red: '#FF3B30',
          darkBg: '#000000',
          darkCard: '#1C1C1E',
        },
        android: {
          bg: '#FEF7FF',
          primary: '#6750A4',
          container: '#EADDFF',
          darkBg: '#141218',
          darkContainer: '#4F378B',
        }
      },
      padding: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      margin: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
      },
      height: {
        'screen-safe': 'calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom))',
      }
    },
  },
  plugins: [],
}
