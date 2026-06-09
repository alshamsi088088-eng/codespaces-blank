
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif']
      },
      colors: {
        sura: {
          dark: '#0f172a',
          ink: '#111827',
          gold: '#3b82f6',
          ivory: '#f8fafc',
          cream: '#e2e8f0',
          brown: '#64748b',
          border: '#334155'
        }
      },
      boxShadow: {
        soft: '0 24px 60px rgba(15, 23, 42, 0.12)',
        card: '0 16px 40px rgba(15, 23, 42, 0.08)'
      },
      borderRadius: {
        xl: '1rem'
      }
    }
  },
  plugins: []
};
