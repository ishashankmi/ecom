#!/bin/bash

echo "Building Saras Android APK..."

# Install Gradle if not present
if ! command -v gradle &> /dev/null; then
    echo "Installing Gradle..."
    # For Ubuntu/Debian
    if command -v apt &> /dev/null; then
        sudo apt update && sudo apt install -y gradle
    # For other systems, download manually
    else
        echo "Please install Gradle manually from https://gradle.org/install/"
        exit 1
    fi
fi

# Create gradle wrapper
if [ ! -f "./gradlew" ]; then
    echo "Creating Gradle wrapper..."
    gradle wrapper
fi

# Make gradlew executable
chmod +x ./gradlew

# Build debug APK
echo "Building debug APK..."
./gradlew assembleDebug

echo "APK built successfully!"
echo "Location: app/build/outputs/apk/debug/app-debug.apk"