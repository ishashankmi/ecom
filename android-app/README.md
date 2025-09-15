# Saras Android WebView App

A minimal Android WebView app for the Saras frontend.

## Setup

1. **Update URL**: Edit `MainActivity.java` and replace `http://localhost:5173` with your deployed frontend URL
2. **Install Android Studio** or ensure you have Android SDK installed
3. **Build APK**: Run `./build.sh` or use Android Studio

## Build Commands

```bash
# Build debug APK
./build.sh

# Or manually with gradle
./gradlew assembleDebug

# Build release APK (for production)
./gradlew assembleRelease
```

## Configuration

- **App Name**: Change in `res/values/strings.xml`
- **Package Name**: Update in `build.gradle` and `AndroidManifest.xml`
- **URL**: Update in `MainActivity.java`
- **Icon**: Replace files in `res/mipmap-*` folders

## Requirements

- Android SDK 21+
- Java 8+
- Gradle 8.1+