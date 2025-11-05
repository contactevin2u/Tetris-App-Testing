# Android App Build Guide

## Prerequisites

### 1. Install Required Software

#### Android Studio
- Download from: https://developer.android.com/studio
- Version: Android Studio Hedgehog (2023.1.1) or later
- Install with default settings

#### Java Development Kit (JDK)
- JDK 17 required
- Bundled with Android Studio or download from: https://www.oracle.com/java/technologies/downloads/

### 2. Set Up Environment Variables

**Windows:**
```bash
setx ANDROID_HOME "C:\Users\YourUsername\AppData\Local\Android\Sdk"
setx PATH "%PATH%;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\tools"
```

**Mac/Linux:**
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/tools
```

Add to `~/.bashrc` or `~/.zshrc` to make permanent.

---

## Firebase Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Name it "Tetris" (or your choice)
4. Enable Google Analytics (recommended)
5. Create project

### 2. Add Android App to Firebase

1. In Firebase Console, click "Add app" → Android icon
2. **Android package name**: `com.tetris.game`
3. **App nickname**: Tetris
4. **Debug signing certificate SHA-1**: (optional for now)
5. Click "Register app"

### 3. Download google-services.json

1. Download the `google-services.json` file
2. Place it in: `android/app/google-services.json`

```
android/
└── app/
    └── google-services.json  ← Place here
```

### 4. Enable Firebase Services

In Firebase Console:
- **Analytics**: Already enabled
- **Crashlytics**: Go to Crashlytics → Enable

---

## Building the App

### Method 1: Using Android Studio (Recommended)

#### 1. Open Project

1. Launch Android Studio
2. Click "Open"
3. Navigate to and select the `android` folder
4. Wait for Gradle sync to complete

#### 2. Configure SDK

1. Go to `Tools` → `SDK Manager`
2. Install:
   - Android SDK Platform 34
   - Android SDK Build-Tools 34.0.0
   - Android Emulator
   - Intel x86 Emulator Accelerator (if using emulator)

#### 3. Build Project

**Debug Build:**
1. Click `Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`
2. Wait for build to complete
3. APK location: `android/app/build/outputs/apk/debug/app-debug.apk`

**Release Build:**
1. First, create a signing key (see "Signing the App" section)
2. Click `Build` → `Generate Signed Bundle / APK`
3. Select `APK`
4. Choose your keystore
5. APK location: `android/app/build/outputs/apk/release/app-release.apk`

---

### Method 2: Using Gradle Command Line

#### 1. Navigate to Android Directory

```bash
cd tetris/android
```

#### 2. Build Debug APK

**Windows:**
```bash
gradlew assembleDebug
```

**Mac/Linux:**
```bash
./gradlew assembleDebug
```

Output: `app/build/outputs/apk/debug/app-debug.apk`

#### 3. Build Release APK

**Windows:**
```bash
gradlew assembleRelease
```

**Mac/Linux:**
```bash
./gradlew assembleRelease
```

Output: `app/build/outputs/apk/release/app-release.apk`

---

## Signing the App (for Release)

### 1. Generate Signing Key

```bash
keytool -genkey -v -keystore tetris-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias tetris
```

**Enter details:**
- Password: (choose a strong password)
- Name, Organization, etc.
- Keep the `.jks` file secure!

### 2. Configure Signing in Gradle

Create `android/keystore.properties`:

```properties
storePassword=YOUR_KEYSTORE_PASSWORD
keyPassword=YOUR_KEY_PASSWORD
keyAlias=tetris
storeFile=../tetris-release-key.jks
```

### 3. Update app/build.gradle.kts

Add before `android` block:

```kotlin
val keystorePropertiesFile = rootProject.file("keystore.properties")
val keystoreProperties = Properties()
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(FileInputStream(keystorePropertiesFile))
}
```

Update `android` block:

```kotlin
signingConfigs {
    create("release") {
        keyAlias = keystoreProperties["keyAlias"] as String
        keyPassword = keystoreProperties["keyPassword"] as String
        storeFile = file(keystoreProperties["storeFile"] as String)
        storePassword = keystoreProperties["storePassword"] as String
    }
}

buildTypes {
    release {
        signingConfig = signingConfigs.getByName("release")
        // ... rest of release config
    }
}
```

---

## Running the App

### On Emulator

1. Open Android Studio
2. `Tools` → `Device Manager`
3. Create new virtual device (e.g., Pixel 6 with API 34)
4. Click `Run` (green play button) → Select emulator

### On Physical Device

1. Enable Developer Options on your Android device:
   - Go to `Settings` → `About phone`
   - Tap `Build number` 7 times
2. Enable USB Debugging:
   - Go to `Settings` → `Developer Options`
   - Enable `USB Debugging`
3. Connect device via USB
4. In Android Studio, click `Run` → Select your device

### Install APK Manually

```bash
adb install app/build/outputs/apk/debug/app-debug.apk
```

---

## Testing

### 1. Test WebSocket Connection

Ensure your backend is running:
- **Production**: https://tetris-app-testing.onrender.com
- **Local**: Start backend on `localhost:3000`

For local testing, the app is configured to connect to `10.0.2.2:3000` (Android emulator localhost).

### 2. Test on Real Device

- Make sure device is on same network as development machine
- Update `BuildConfig.WS_URL` in debug build to your machine's IP

---

## Building for Google Play Store

### 1. Create App Bundle (AAB)

**Recommended for Play Store:**

```bash
./gradlew bundleRelease
```

Output: `app/build/outputs/bundle/release/app-release.aab`

### 2. Prepare for Upload

1. **Version your app**: Update in `app/build.gradle.kts`:
   ```kotlin
   versionCode = 1
   versionName = "1.0"
   ```

2. **Create app icon**: Place in `app/src/main/res/mipmap-*` folders

3. **Test thoroughly**: Test on multiple devices and Android versions

4. **Create Play Console account**: https://play.google.com/console

5. **Upload AAB**: Follow Play Console wizard

---

## Troubleshooting

### Build Failed: SDK not found
- Install Android SDK via Android Studio SDK Manager
- Set `ANDROID_HOME` environment variable

### WebSocket Connection Failed
- Check backend is running
- For emulator, use `10.0.2.2` instead of `localhost`
- For real device, use your machine's IP address
- Check firewall settings

### Gradle Sync Failed
```bash
# Clean and rebuild
./gradlew clean
./gradlew build --refresh-dependencies
```

### App Crashes on Start
- Check Logcat in Android Studio
- Verify `google-services.json` is in correct location
- Ensure all Firebase services are enabled

### ProGuard Issues (Release Build)
- Check `proguard-rules.pro`
- Add keep rules for your models
- Test release build before distributing

---

## Project Structure

```
android/
├── app/
│   ├── src/
│   │   └── main/
│   │       ├── java/com/tetris/game/
│   │       │   ├── MainActivity.kt
│   │       │   ├── TetrisGame.kt
│   │       │   ├── GameView.kt
│   │       │   └── WebSocketClient.kt
│   │       ├── res/
│   │       │   ├── layout/
│   │       │   │   └── activity_main.xml
│   │       │   ├── values/
│   │       │   │   ├── strings.xml
│   │       │   │   ├── colors.xml
│   │       │   │   └── themes.xml
│   │       │   └── mipmap-*/  (app icons)
│   │       ├── AndroidManifest.xml
│   │       └── google-services.json
│   ├── build.gradle.kts
│   └── proguard-rules.pro
├── build.gradle.kts
├── settings.gradle.kts
└── gradle.properties
```

---

## Key Features Implemented

✅ **Native Kotlin App**: Full Android native implementation
✅ **WebSocket Connection**: Real-time connection to backend
✅ **Touch Controls**: Mobile-optimized button controls
✅ **Firebase Analytics**: Track user engagement
✅ **Firebase Crashlytics**: Monitor crashes
✅ **Portrait Mode**: Optimized for mobile gameplay
✅ **Material Design**: Modern Android UI
✅ **ProGuard**: Code obfuscation for release builds

---

## Next Steps

1. **Customize app icon**: Create launcher icons
2. **Add splash screen**: Improve app startup experience
3. **Implement haptic feedback**: Vibration on actions
4. **Add sound effects**: Audio feedback
5. **Leaderboard**: Integrate with backend/Firebase
6. **Offline mode**: Local gameplay without connection
7. **Multiplayer**: Real-time multiplayer features

---

## Useful Commands

```bash
# Clean build
./gradlew clean

# Build debug
./gradlew assembleDebug

# Build release
./gradlew assembleRelease

# Install on device
adb install -r app-debug.apk

# View logs
adb logcat | grep Tetris

# List connected devices
adb devices

# Uninstall app
adb uninstall com.tetris.game
```

---

## Support

For issues:
1. Check Android Studio Logcat
2. Verify all dependencies are installed
3. Ensure backend is accessible
4. Check Firebase configuration
