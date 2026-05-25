# Phase 3 - Quick Reference

## 🚀 Get Started in 3 Steps

```bash
# 1. Navigate to client folder
cd client

# 2. Install all dependencies
npm install

# 3. Start development server
npm run dev
```

**Frontend will be available at:** `http://localhost:5173`

---

## 📍 Frontend URLs

| Page | URL | Component |
|------|-----|-----------|
| Home | `http://localhost:5173/` | Hero + Features |
| Predict | `http://localhost:5173/predict` | Form (scaffolded) |
| Results | `http://localhost:5173/results` | Results (scaffolded) |
| About | `http://localhost:5173/about` | Tech info |

---

## 🎨 Theme

- **Default:** Dark mode with Emerald Green (#10b981)
- **Toggle:** Use switch in top-right navbar
- **Persistence:** Saved to localStorage

---

## 🗂️ Key Files

| File | Purpose |
|------|---------|
| `src/App.jsx` | Router setup |
| `src/components/Navbar.jsx` | Navigation |
| `src/components/Layout.jsx` | Layout wrapper |
| `src/pages/Home.jsx` | Landing page |
| `src/pages/Predict.jsx` | Prediction form |
| `src/pages/Results.jsx` | Results display |
| `src/pages/About.jsx` | About page |
| `src/services/api.js` | Axios API client |
| `tailwind.config.js` | Theme config |
| `src/index.css` | Tailwind styles |

---

## 📦 Installed Dependencies

**Production:**
- react, react-dom, react-router-dom
- axios, lucide-react, daisyui

**Development:**
- vite, tailwindcss, postcss, autoprefixer

---

## ✅ What's Ready

- ✅ All pages created and routable
- ✅ Dark theme with Tailwind + DaisyUI
- ✅ Navbar with links and theme toggle
- ✅ Predict form with 11 fields (not connected yet)
- ✅ Results page layout (ready for data display)
- ✅ API service configured (points to localhost:5000)
- ✅ Responsive design
- ✅ Icons via lucide-react

---

## ⏳ What's Next (Phase 4)

- Connect Predict form to /predict endpoint
- Handle API responses
- Display results
- Error handling
- Loading states

---

## 🛠️ Useful Commands

```bash
# Development
npm run dev        # Start dev server

# Production
npm run build      # Create production build
npm run preview    # Preview production build

# Linting
npm run lint       # Check code quality
```

---

## 🐛 Troubleshooting

**Port 5173 not available?**
- Vite will auto-increment to 5174, 5175, etc.
- Check terminal output for actual port

**Tailwind styles not showing?**
- Restart dev server: `npm run dev`
- Clear browser cache: Ctrl+Shift+Delete

**Theme not saving?**
- Check localStorage in DevTools: F12 → Application

---

## 📞 Backend Connection

Backend must be running on `http://localhost:5000`

Start in separate terminal:
```bash
cd server
npm run dev
```

---

**Last Updated:** May 26, 2026
