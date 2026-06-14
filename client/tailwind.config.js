export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
      },
      colors: {
        sura: {
          navy:   '#2F4156',
          teal:   '#567C8D',
          sky:    '#C8D9E6',
          beige:  '#F5EFEB',
          white:  '#FFFFFF',
          dark:   '#1a2a38',
          ink:    '#2F4156',
          gold:   '#567C8D',
          ivory:  '#F5EFEB',
          cream:  '#C8D9E6',
          brown:  '#567C8D',
          border: '#C8D9E6',
          muted:  '#567C8D',
        }
      },
      boxShadow: {
        soft: '0 8px 40px rgba(47,65,86,0.10)',
        card: '0 4px 24px rgba(47,65,86,0.08)',
        glow: '0 0 32px rgba(86,124,141,0.15)',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      }
    }
  },
  plugins: []
};
