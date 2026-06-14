export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'Cambria', 'Times New Roman', 'serif'],
      },
      colors: {
        sura: {
          navy:   '#2F4156',
          teal:   '#567C8D',
          sky:    '#C8D9E6',
          beige:  '#F5EFEB',
          white:  '#FFFFFF',
          dark:   '#20303F',
          ink:    '#2F4156',
          // legacy aliases repointed to the new white-led palette
          gold:    '#567C8D',
          ivory:   '#FFFFFF',
          cream:   '#FAF9F7',
          brown:   '#567C8D',
          border:  '#E7E2DC',
          muted:   'rgba(32,48,63,0.6)',
          canvas:  '#FAF9F7',
          line:    '#E7E2DC',
        }
      },
      boxShadow: {
        soft: '0 8px 40px rgba(32,48,63,0.08)',
        card: '0 1px 2px rgba(32,48,63,0.03)',
        glow: '0 0 32px rgba(86,124,141,0.12)',
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
