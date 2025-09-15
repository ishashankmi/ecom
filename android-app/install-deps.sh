#!/bin/bash

echo "Installing Android development dependencies..."

# Install Java 11 (required for Android development)
sudo apt update
sudo apt install -y openjdk-11-jdk

# Install Gradle
sudo apt install -y gradle

# Set JAVA_HOME
export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
echo 'export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64' >> ~/.bashrc

echo "Dependencies installed!"
echo "Please restart your terminal or run: source ~/.bashrc"