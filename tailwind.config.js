/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Thème sombre personnalisé
        dark: {
          bg: '#0a0a0a',           // Fond principal (noir profond)
          surface: '#1a1a1a',       // Surfaces (gris très foncé)
          elevated: '#252525',      // Surfaces élevées
          border: '#333333',        // Bordures
          'border-light': '#404040', // Bordures claires
        },
        accent: {
          yellow: '#fbbf24',        // Jaune principal
          'yellow-light': '#fcd34d', // Jaune clair
          'yellow-dark': '#f59e0b',  // Jaune foncé
        },
        text: {
          primary: '#f5f5f5',       // Texte principal
          secondary: '#9ca3af',     // Texte secondaire
          muted: '#6b7280',         // Texte désactivé
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-dark': 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(251, 191, 36, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(251, 191, 36, 0.8)' },
        },
      },
    },
  },
  plugins: [],
}
