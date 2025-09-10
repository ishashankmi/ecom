# Saras Mobile - React Native App

A React Native version of the Saras grocery delivery app built with Expo.

## Features

- 📱 Native mobile experience
- 🛒 Product browsing and cart management
- 🔐 User authentication
- 📦 Product details view
- 🎨 Clean, modern UI

## Tech Stack

- **React Native** with Expo
- **Redux Toolkit** for state management
- **React Navigation** for routing
- **TypeScript** for type safety

## Quick Start

```bash
# Install dependencies
npm install

# Start the development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

## Project Structure

```
src/
├── components/     # Reusable components
├── screens/        # Screen components
├── store/          # Redux store and slices
└── services/       # API services
```

## API Integration

Update the API_URL in `src/store/productsSlice.ts` to point to your backend:

```typescript
const API_URL = 'http://your-backend-url:3002/api';
```

## Development

This app connects to the same backend as the web version. Make sure your backend is running on port 3002.

For local development, you might need to use your computer's IP address instead of localhost when running on a physical device.