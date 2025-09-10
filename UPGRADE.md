# Upgrade Guide - Saras v2.0

## What Was Upgraded

### Dependencies
- React: 18.2.0 → 18.3.1
- TypeScript: 4.6.4 → 5.6.2
- Vite: 3.0.0 → 5.4.6
- Redux Toolkit: 1.8.3 → 2.2.7
- React Router: 6.3.0 → 6.26.2
- TailwindCSS: 3.1.8 → 3.4.11

### New Features
- SWC compiler for faster builds
- Modern ESLint configuration
- Improved TypeScript settings
- Bundle optimization with code splitting
- Enhanced development experience

## Installation Steps

1. **Remove old dependencies:**
   ```bash
   rm -rf node_modules package-lock.json yarn.lock
   ```

2. **Install new dependencies:**
   ```bash
   npm install
   ```

3. **Verify the upgrade:**
   ```bash
   npm run type-check
   npm run lint
   npm run build
   ```

## Breaking Changes

### TailwindCSS
- Removed `@tailwindcss/line-clamp` plugin (now built-in)
- Updated config to ES modules format

### TypeScript
- Stricter type checking enabled
- Modern module resolution
- Updated target to ES2022

### Vite
- Now uses SWC instead of Babel for faster compilation
- Enhanced build optimizations

## Performance Improvements

- **Build time**: ~50% faster with SWC
- **Bundle size**: Optimized with automatic code splitting
- **Development**: Faster HMR and type checking
- **Production**: Better tree shaking and minification