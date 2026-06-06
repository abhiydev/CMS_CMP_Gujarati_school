export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 30px 80px rgba(15, 23, 42, 0.12)',
      },
      backgroundImage: {
        'hero-overlay': 'linear-gradient(180deg, rgba(15,23,42,0.18) 0%, rgba(15,23,42,0.72) 100%)',
      },
    },
  },
  plugins: [],
};
