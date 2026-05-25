/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
    "./node_modules/@tremor/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#10b981',
        'primary-dark': '#059669',
      }
    },
  },
  plugins: [
    require('daisyui'),
    require('@tailwindcss/forms'),
  ],
  daisyui: {
    themes: [
      {
        dark: {
          "primary": "#10b981",
          "primary-focus": "#059669",
          "primary-content": "#ffffff",
          "secondary": "#06b6d4",
          "secondary-focus": "#0891b2",
          "secondary-content": "#ffffff",
          "accent": "#ec4899",
          "accent-focus": "#be185d",
          "accent-content": "#ffffff",
          "neutral": "#1f2937",
          "neutral-focus": "#111827",
          "neutral-content": "#f3f4f6",
          "base-100": "#0f172a",
          "base-200": "#1e293b",
          "base-300": "#334155",
          "base-content": "#f1f5f9",
          "info": "#0ea5e9",
          "info-content": "#001033",
          "success": "#10b981",
          "success-content": "#001003",
          "warning": "#f59e0b",
          "warning-content": "#160900",
          "error": "#ef4444",
          "error-content": "#fef2f2",
        },
      },
      "light",
    ],
    darkTheme: "dark",
  },
}
