# Phase 3 - Terminal Commands & Installation Guide

Complete terminal commands for setting up and running the Phase 3 frontend.

---

## 📋 Prerequisites

Ensure you have:
- **Node.js 18+** installed: `node --version`
- **npm 9+** installed: `npm --version`
- **Backend running** on port 5000 (from Phase 2)

---

## 🚀 Installation & Setup

### Step 1: Navigate to Client Directory

```bash
cd client
```

**Expected:** You're now in the `client` folder.

---

### Step 2: Install Dependencies

```bash
npm install
```

**What this does:**
- Installs all dependencies from `package.json`
- Creates `node_modules` folder
- Generates `package-lock.json`

**Expected output:**
```
added 500+ packages in 45s
```

**If stuck:** Try clearing cache first:
```bash
npm cache clean --force
```

---

### Step 3: Start Development Server

```bash
npm run dev
```

**Expected output:**
```
VITE v8.0.12  ready in 123 ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

**Open in browser:** `http://localhost:5173`

---

## 🔄 Development Workflow

### Run Dev Server (with auto-reload)

```bash
npm run dev
```

Automatically reloads on file changes.

**Stop with:** `Ctrl+C`

---

### Check Code Quality

```bash
npm run lint
```

Runs ESLint to check code style.

---

## 🏗️ Production Build

### Build for Production

```bash
npm run build
```

**Creates:** `dist/` folder with optimized files

**Expected:**
```
dist/index.html                 0.46 kB
dist/assets/main.xxx.js     125.50 kB
```

---

### Preview Production Build Locally

```bash
npm run preview
```

Serves the production build at `http://localhost:4173`

---

## 🚦 Complete Setup Flow (Start Fresh)

Copy and run these commands in sequence:

```bash
# From project root
cd client

# Install dependencies
npm install

# Start development server
npm run dev
```

Then open `http://localhost:5173` in your browser.

---

## 🔗 Running Full Stack (Both Frontend & Backend)

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```
Backend runs on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```
Frontend runs on `http://localhost:5173`

---

## 🧹 Cleanup & Reinstall

If something goes wrong, try:

```bash
# Remove node_modules
rm -r node_modules

# Remove package-lock.json
rm package-lock.json

# Clear npm cache
npm cache clean --force

# Reinstall everything
npm install
```

---

## 📦 Package.json Scripts Reference

```json
{
  "scripts": {
    "dev": "vite",                    // Development server
    "build": "vite build",            // Production build
    "lint": "eslint .",              // Code linting
    "preview": "vite preview"         // Preview production build
  }
}
```

---

## 🐛 Troubleshooting Commands

### Port 5173 Already in Use

Vite automatically tries next available port (5174, 5175, etc.)

Or explicitly use different port:
```bash
npm run dev -- --port 3000
```

---

### Clear Vite Cache

```bash
rm -r node_modules/.vite
```

---

### Check Node Version

```bash
node --version
# Should be v18.0.0 or higher
```

---

### Check npm Version

```bash
npm --version
# Should be v9.0.0 or higher
```

---

### List Installed Packages

```bash
npm list --depth=0
```

Shows all installed packages (without dependencies).

---

### Check Specific Package Version

```bash
npm list react
npm list vite
npm list tailwindcss
```

---

## 🔍 Verify Installation

After `npm install`, verify key packages:

```bash
# Check if Vite is installed
npx vite --version

# Check if React is installed
npm list react

# Check if Tailwind is installed
npm list tailwindcss
```

---

## 🌐 Accessing the App

### Local Access
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

### From Another Computer (Same Network)

Find your local IP:

**Windows:**
```bash
ipconfig
```
Look for IPv4 address (e.g., `192.168.1.100`)

**Mac/Linux:**
```bash
ifconfig
```

Then access from another computer:
```
http://192.168.1.100:5173
```

---

## 📊 Dependency Sizes

```
react                   ~190 KB
tailwindcss             ~500 KB
daisyui                 ~100 KB
react-router-dom        ~60 KB
axios                   ~30 KB
lucide-react            ~300 KB
```

**Total after build:** ~125 KB (minified + gzipped)

---

## 🔄 Update Dependencies (Optional)

Check for updates:
```bash
npm outdated
```

Update all packages (careful!):
```bash
npm update
```

Update specific package:
```bash
npm install react@latest
```

---

## 📝 Common npm Commands Reference

```bash
# Install all dependencies
npm install

# Install specific package
npm install package-name

# Install as dev dependency
npm install --save-dev package-name

# Uninstall package
npm uninstall package-name

# List installed packages
npm list

# Check for security issues
npm audit

# Fix security issues automatically
npm audit fix
```

---

## 🎯 Environment Variables (Optional for Phase 3)

To use custom backend URL, create `.env` file:

```bash
echo "VITE_API_BASE_URL=http://localhost:5000" > .env
```

Then update `src/services/api.js`:
```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
});
```

---

## ✅ Installation Checklist

- [ ] Navigated to `client` folder
- [ ] Ran `npm install` successfully
- [ ] No error messages in output
- [ ] `node_modules` folder created
- [ ] Started `npm run dev`
- [ ] Browser opened `http://localhost:5173`
- [ ] Frontend loads and shows navbar/menu
- [ ] Can navigate to all pages
- [ ] Theme toggle works
- [ ] No console errors

---

## 🆘 Getting Help

If installation fails, check:

1. Node/npm versions: `node --version && npm --version`
2. npm cache: `npm cache clean --force`
3. Delete and reinstall: `rm -r node_modules && npm install`
4. Check internet connection
5. Try a different npm registry: `npm config set registry https://registry.npmjs.org`

---

**Last Updated:** May 26, 2026
