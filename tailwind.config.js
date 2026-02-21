/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#F472B6',
          warm: '#FB7185',
          light: '#FECDD3',
        },
        background: '#FFF5F5',
        surface: '#FFFFFF',
        peach: '#FFEDD5',
        text: {
          DEFAULT: '#9D174D',
          muted: '#BE185D',
        },
        accent: '#DB2777',
        like: '#10B981',
        pass: '#EF4444',
      },
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
      },
      borderRadius: {
        card: '20px',
        button: '30px',
        tag: '26px',
      },
      boxShadow: {
        card: '0 6px 24px rgba(244, 114, 182, 0.15)',
        'card-hover': '0 8px 28px rgba(244, 114, 182, 0.2)',
        heart: '0 8px 24px rgba(244, 114, 182, 0.45)',
        match: '0 16px 40px rgba(244, 114, 182, 0.3)',
        nav: '0 -6px 24px rgba(244, 114, 182, 0.1)',
      },
      animation: {
        'heart-pulse': 'heartPulse 0.8s ease-in-out infinite alternate',
        'bounce-in': 'bounceIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'fade-slide-up': 'fadeSlideUp 0.5s ease-out both',
        'chili-bounce': 'chiliBounce 0.4s ease-in-out',
        'badge-pulse': 'badgePulse 2s ease-in-out infinite',
      },
      keyframes: {
        heartPulse: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.2)' },
        },
        bounceIn: {
          '0%': { opacity: '0', transform: 'scale(0.5)' },
          '60%': { transform: 'scale(1.1)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        fadeSlideUp: {
          '0%': { opacity: '0', transform: 'translateY(15px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        chiliBounce: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
        },
        badgePulse: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(244, 114, 182, 0.4)' },
          '50%': { boxShadow: '0 0 0 8px rgba(244, 114, 182, 0)' },
        },
      },
      transitionTimingFunction: {
        bouncy: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
}
