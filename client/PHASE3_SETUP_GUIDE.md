# WattwAIs Phase 3 - Frontend Initialization Guide

Complete setup guide for the React frontend using Vite, Tailwind CSS, and DaisyUI.

---

## 🚀 Quick Start Commands

Run these commands in sequence to get the frontend running:

```bash
# Navigate to client directory
cd client

# Install dependencies (includes React, Vite, Tailwind, DaisyUI, Router, Axios, Lucide)
npm install

# Start development server
npm run dev
```

**Expected Output:**
```
VITE v8.0.12  ready in 123 ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

---

## 📋 What Was Installed

### Main Dependencies
- **react** (19.2.6) - UI library
- **react-dom** (19.2.6) - React DOM rendering
- **react-router-dom** (6.23.1) - Client-side routing
- **axios** (1.16.1) - HTTP client for API calls
- **lucide-react** (0.408.0) - Icon library
- **daisyui** (4.12.0) - Tailwind CSS component library

### Development Dependencies
- **vite** (8.0.12) - Build tool & dev server
- **tailwindcss** (3.4.3) - CSS framework
- **postcss** (8.4.38) - CSS processor
- **autoprefixer** (10.4.19) - Vendor prefix automation

---

## 📁 Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Navigation bar with theme toggle
│   │   └── Layout.jsx          # Layout wrapper with header/footer
│   ├── pages/
│   │   ├── Home.jsx            # Landing page with features
│   │   ├── Predict.jsx         # Prediction form page
│   │   ├── Results.jsx         # Results display page
│   │   └── About.jsx           # About page with tech stack
│   ├── services/
│   │   └── api.js              # Axios instance for backend API
│   ├── assets/                 # Static assets folder
│   ├── App.jsx                 # Main app with routing
│   ├── main.jsx                # React entry point
│   └── index.css               # Tailwind & custom CSS
├── public/                      # Static files served as-is
├── index.html                   # HTML entry point
├── package.json                # Dependencies & scripts
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
└── eslint.config.js            # ESLint rules

```

---

## 🎨 Theme Configuration

### Dark Mode (Default)
- **Primary Color**: Emerald Green (#10b981)
- **Secondary Color**: Cyan (#06b6d4)
- **Accent Color**: Pink (#ec4899)
- **Base Background**: Dark Slate (#0f172a)

### Light Mode (Available)
- Switch between dark/light using the theme toggle in navbar
- Theme preference saved to localStorage

### Custom CSS Classes
Available in `src/index.css`:

```css
/* Gradient button */
<button className="btn-primary-gradient">Predict</button>

/* Glass effect card */
<div className="card-glass">Content</div>

/* Text gradient */
<h1 className="text-gradient">WattwAIs</h1>
```

---

## 🛣️ Routing Structure

Current routes configured in `src/App.jsx`:

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | Home.jsx | Landing page with features |
| `/predict` | Predict.jsx | Prediction form (scaffolded) |
| `/results` | Results.jsx | Results display (scaffolded) |
| `/about` | About.jsx | About page with tech info |

---

## 🔌 API Service Setup

Located in `src/services/api.js`:

```javascript
import api from './services/api';

// Make a prediction
const response = await api.post('/predict', inputData);

// Check backend health
const health = await api.get('/');
```

**Base URL:** `http://localhost:5000` (Backend must be running)

---

## 🏗️ Component Hierarchy

```
App (with Router)
├── Layout
│   ├── Navbar
│   ├── main (children routes)
│   │   ├── Home (/)
│   │   ├── Predict (/predict)
│   │   ├── Results (/results)
│   │   └── About (/about)
│   └── Footer
```

---

## 🎯 Key Files Explained

### `App.jsx`
- Sets up React Router with BrowserRouter
- Initializes dark theme on first load
- Renders Layout component with Routes

### `Navbar.jsx`
- Navigation menu with links to all pages
- Theme toggle button
- Responsive design using DaisyUI navbar

### `Layout.jsx`
- Wraps all pages with Navbar and Footer
- Main content area with container
- Consistent styling across pages

### `pages/Home.jsx`
- Hero section with call-to-action
- Features cards with icons
- Statistics display
- Link to predict page

### `pages/Predict.jsx`
- 11 input fields (scaffolded, no backend connection yet)
- Form groups: Temporal, Environmental, Historical, Averages
- Submit button (non-functional in Phase 3)
- Ready for Phase 4 API integration

### `pages/Results.jsx`
- Results display layout (scaffolded)
- Shows 4 prediction metrics:
  - Hourly demand (kWh)
  - Daily estimate (kWh)
  - Monthly estimate (kWh)
  - Monthly bill (₱)
- Preview cards shown in disabled state

### `pages/About.jsx`
- Mission statement
- Technology stack display
- Feature highlights
- Project phases timeline
- Links to other sections

### `services/api.js`
- Axios instance configured
- Base URL pointing to backend
- `predictDemand()` function for predictions
- `checkBackendHealth()` for health checks

---

## 📦 npm Scripts

```bash
# Start development server (with hot reload)
npm run dev

# Build for production
npm build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

---

## 🎨 DaisyUI Components Used

### In Navbar
- `navbar` - Navigation bar
- `menu` - Menu items
- `toggle` - Theme toggle switch
- `btn btn-ghost` - Ghost button style

### In Home
- `hero` - Hero section
- `card` - Feature cards
- `stats` - Statistics display
- `btn btn-primary` - Primary button

### In Predict
- `card` - Form card
- `form-control` - Form field wrapper
- `input input-bordered` - Input fields
- `divider` - Section divider
- `alert` - Info/success alerts
- `btn btn-primary btn-lg` - Large primary button

### In Results
- `alert` - Status alerts
- `card` - Result cards
- `btn` - Navigation buttons

### In About
- `card` - Feature/tech cards
- `badge` - Status badges
- `grid` - Responsive layout
- Various `text-*` and `bg-gradient-*` utilities

---

## 🌐 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Android)

---

## 🐛 Troubleshooting

### Port Already in Use
If port 5173 is in use, Vite will automatically try 5174, 5175, etc.

### Dependencies Not Installing
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules
rm -r node_modules
npm install
```

### Theme Not Persisting
Theme is saved to localStorage. Check browser DevTools:
- Open DevTools → Application → LocalStorage
- Look for key `theme` with value `dark` or `light`

### Tailwind Styles Not Applied
- Ensure `src/index.css` is imported in `main.jsx`
- Check that `tailwind.config.js` content paths are correct
- Restart dev server after config changes

---

## 📱 Responsive Design

All pages are responsive using Tailwind's breakpoints:
- `sm:` - 640px
- `md:` - 768px
- `lg:` - 1024px
- `xl:` - 1280px

Example:
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
```

---

## 🔗 Integration Checklist

- [x] React Router configured
- [x] Tailwind CSS setup
- [x] DaisyUI components available
- [x] Axios API service ready
- [x] Dark theme default
- [x] Responsive layout
- [x] All pages scaffolded
- [x] Icon library (lucide-react) imported
- [ ] Backend API integration (Phase 4)
- [ ] Form submission handling (Phase 4)
- [ ] Error handling UI (Phase 4)
- [ ] Loading states (Phase 4)

---

## 🚀 Next Steps (Phase 4)

1. Connect Predict form to backend `/predict` endpoint
2. Implement form submission with loading state
3. Display results from backend response
4. Add error handling and validation feedback
5. Store predictions for history/comparison
6. Add loading skeletons while fetching

---

## 📚 Resources

- [React Documentation](https://react.dev/)
- [React Router Documentation](https://reactrouter.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [DaisyUI Documentation](https://daisyui.com/)
- [Vite Documentation](https://vitejs.dev/)
- [Axios Documentation](https://axios-http.com/)
- [Lucide Icons](https://lucide.dev/)

---

## 🎓 Learning Points

This Phase 3 implementation demonstrates:
- **Component-based UI** - Reusable Layout, Navbar components
- **Client-side routing** - React Router for multi-page app
- **Utility-first CSS** - Tailwind for rapid styling
- **Component library** - DaisyUI for pre-built components
- **Responsive design** - Mobile-first approach
- **Theme system** - Dark/light mode switching
- **Icon integration** - lucide-react for SVG icons
- **API service layer** - Separation of concerns with api.js
- **Build tooling** - Vite for fast development

---

## ✅ Phase 3 Complete!

**Status:** ✅ Frontend initialization complete

**What's working:**
- ✅ React app with Vite
- ✅ Routing to all pages
- ✅ Dark theme (default)
- ✅ DaisyUI components
- ✅ Responsive layout
- ✅ API service setup
- ✅ Prediction form (scaffolded)
- ✅ Beautiful UI with Tailwind

**Ready for:** Phase 4 - API integration

---

**Last Updated:** May 26, 2026
