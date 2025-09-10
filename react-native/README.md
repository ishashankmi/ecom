# Saras React Native - v2.0 🚀

A complete React Native version of the Saras grocery delivery app, converted from the original React web application.

## ✨ Features
- Browse through various product categories
- View detailed product information
- Add items to cart with quantity management
- User authentication (Login/Register)
- Order placement and history
- Search functionality
- Responsive design for mobile devices
- Modern UI/UX with smooth animations

## 🛠️ Tech Stack

### Core Technologies
- **React Native 0.72** - Cross-platform mobile development
- **Expo SDK 49** - Development platform and tools
- **TypeScript** - Type safety and better development experience
- **Redux Toolkit** - State management with RTK
- **React Navigation 6** - Navigation library

### UI & Components
- **Expo Vector Icons** - Icon library
- **React Native Gesture Handler** - Touch and gesture handling
- **React Native Reanimated** - Smooth animations
- **React Native Toast Message** - Toast notifications

### Development Tools
- **Expo CLI** - Development and build tools
- **TypeScript** - Static type checking
- **Axios** - HTTP client for API calls

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development)
- Android Studio/Emulator (for Android development)

### Installation

```bash
# Navigate to the React Native project
cd react-native

# Install dependencies
npm install

# Start the development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

## 📱 App Structure

```
src/
├── components/          # Reusable UI components
│   ├── shared/         # Shared components (Header, AddToCartButton)
│   ├── cart/           # Cart-related components
│   ├── auth/           # Authentication components
│   └── ...
├── screens/            # Screen components
│   ├── HomeScreen.tsx
│   ├── LoginScreen.tsx
│   ├── CartScreen.tsx
│   ├── ProductDetailScreen.tsx
│   └── ...
├── store/              # Redux store and slices
│   ├── auth.ts
│   ├── cart.ts
│   ├── products.ts
│   └── ...
├── services/           # API services
├── navigation/         # Navigation configuration
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── hooks/              # Custom React hooks
```

## 🔧 Key Components

### Navigation
- **Bottom Tab Navigation** - Home, Search, Cart, Profile
- **Stack Navigation** - Product details, checkout, orders
- **Authentication Flow** - Login/Register screens

### State Management
- **Redux Toolkit** for global state
- **Cart Management** - Add/remove items, quantity updates
- **Authentication** - User login/logout, token management
- **Products** - Fetch, search, and category filtering

### Core Features
- **Product Browsing** - Grid layout with category filtering
- **Cart Functionality** - Add to cart, quantity management
- **User Authentication** - Secure login with token storage
- **Order Management** - Place orders, view order history
- **Search** - Product search with real-time results

## 🎨 UI/UX Features

- **Modern Design** - Clean and intuitive interface
- **Responsive Layout** - Optimized for different screen sizes
- **Smooth Animations** - Enhanced user experience
- **Toast Notifications** - User feedback for actions
- **Loading States** - Better user experience during API calls

## 🔐 Security

- **Secure Storage** - Expo SecureStore for token management
- **API Authentication** - JWT token-based authentication
- **Input Validation** - Form validation and error handling

## 📦 Backend Integration

The app connects to the existing Node.js backend:
- **Products API** - Fetch products, categories, search
- **Authentication API** - Login, register, token verification
- **Orders API** - Create and fetch orders
- **Categories API** - Fetch product categories

## 🚀 Deployment

### Development
```bash
# Start Expo development server
npm start

# Run on physical device using Expo Go app
# Scan QR code from terminal
```

### Production Build
```bash
# Build for iOS
expo build:ios

# Build for Android
expo build:android
```

## 📱 Platform Support

- **iOS** - iPhone and iPad support
- **Android** - Phone and tablet support
- **Web** - Can run on web browsers (via Expo)

## 🔄 Migration from React Web

This React Native version maintains feature parity with the original React web application:

- ✅ All core functionality preserved
- ✅ Same Redux store structure
- ✅ Compatible with existing backend API
- ✅ Similar UI/UX adapted for mobile
- ✅ TypeScript support maintained

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.