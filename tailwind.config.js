/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      // These mirror the CSS variables already in styles/theme.css.
      // Once wired up, you can write className="bg-bp-bg text-bp-ink"
      // instead of hand-rolled CSS, and it'll match your existing
      // palette exactly instead of introducing a second color system.
      colors: {
        'bp-bg': 'var(--bp-bg)',
        'bp-surface': 'var(--bp-surface)',
        'bp-line': 'var(--bp-line)',
        'bp-ink': 'var(--bp-ink)',
        'bp-muted': 'var(--bp-muted)',
        'bp-accent': 'var(--bp-accent)',
        'bp-accent-tint': 'var(--bp-accent-tint)',
      },
      fontFamily: {
        display: ['Instrument Serif', 'serif'],
        body: ['IBM Plex Sans', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};