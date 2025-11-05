# Tetris Android App

Native Android application for Tetris game built with Kotlin, Gradle, Firebase, and Android Studio.

## Features

- 🎮 **Native Kotlin**: Full Android native implementation
- 🌐 **Real-time WebSocket**: Connects to Node.js backend
- 📱 **Touch Controls**: Optimized button layout for mobile
- 📊 **Firebase Analytics**: Track user engagement and gameplay
- 🐛 **Firebase Crashlytics**: Automatic crash reporting
- 🎨 **Material Design**: Modern Android UI/UX
- 📐 **Portrait Mode**: Optimized for mobile gameplay
- 🔒 **ProGuard**: Code obfuscation for release builds

## Quick Start

### Prerequisites

- Android Studio Hedgehog (2023.1.1) or later
- JDK 17
- Android SDK API 34
- Firebase account

### Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/contactevin2u/Tetris-App-Testing.git
   cd Tetris-App-Testing/android
   ```

2. **Open in Android Studio**:
   - Launch Android Studio
   - Click "Open" and select the `android` folder
   - Wait for Gradle sync

3. **Configure Firebase**:
   - Create Firebase project at https://console.firebase.google.com/
   - Add Android app with package name: `com.tetris.game`
   - Download `google-services.json`
   - Place it in `app/google-services.json`

4. **Build and Run**:
   - Click the green "Run" button in Android Studio
   - Select a device or emulator
   - App will install and launch

## Architecture

```
┌─────────────────────────────────────┐
│      Android App (Kotlin)           │
│  ┌──────────────────────────────┐   │
│  │      MainActivity.kt         │   │
│  │  - UI Management             │   │
│  │  - Event Handling            │   │
│  └──────────────────────────────┘   │
│              │                       │
│  ┌──────────────────────────────┐   │
│  │      GameView.kt             │   │
│  │  - Canvas Rendering          │   │
│  │  - Visual Display            │   │
│  └──────────────────────────────┘   │
│              │                       │
│  ┌──────────────────────────────┐   │
│  │   WebSocketClient.kt         │   │
│  │  - OkHttp WebSocket          │   │
│  │  - Auto-reconnect            │   │
│  │  - Message Parsing (Gson)    │   │
│  └──────────────────────────────┘   │
│              │                       │
│  ┌──────────────────────────────┐   │
│  │    TetrisGame.kt             │   │
│  │  - Game Logic                │   │
│  │  - State Management          │   │
│  └──────────────────────────────┘   │
└─────────────────────────────────────┘
              ↓
    wss://tetris-app-testing.onrender.com
              ↓
┌─────────────────────────────────────┐
│    Node.js Backend (Render)         │
│  - WebSocket Server                 │
│  - Game State Management            │
└─────────────────────────────────────┘
```

## Tech Stack

- **Language**: Kotlin 1.9.20
- **Build System**: Gradle 8.2 (Kotlin DSL)
- **Min SDK**: 24 (Android 7.0)
- **Target SDK**: 34 (Android 14)
- **UI**: Material Components, ConstraintLayout
- **Networking**: OkHttp 4.12 (WebSocket)
- **JSON Parsing**: Gson 2.10
- **Async**: Kotlin Coroutines
- **Analytics**: Firebase Analytics
- **Crash Reporting**: Firebase Crashlytics
- **Code Obfuscation**: ProGuard (R8)

## Build Types

### Debug Build
- WebSocket URL: `ws://10.0.2.2:3000` (emulator localhost)
- No code obfuscation
- Debuggable

```bash
./gradlew assembleDebug
```

### Release Build
- WebSocket URL: `wss://tetris-app-testing.onrender.com`
- ProGuard enabled
- Code obfuscated
- Requires signing key

```bash
./gradlew assembleRelease
```

## Configuration

### WebSocket URL

Change in `app/build.gradle.kts`:

```kotlin
buildTypes {
    release {
        buildConfigField("String", "WS_URL", "\"wss://your-backend.com\"")
    }
    debug {
        buildConfigField("String", "WS_URL", "\"ws://10.0.2.2:3000\"")
    }
}
```

### App Version

Update in `app/build.gradle.kts`:

```kotlin
defaultConfig {
    versionCode = 1
    versionName = "1.0"
}
```

## Testing

### On Emulator
1. Create emulator (Pixel 6, API 34 recommended)
2. Click "Run" in Android Studio

### On Physical Device
1. Enable Developer Options
2. Enable USB Debugging
3. Connect via USB
4. Select device in Android Studio

### Backend Testing
- **Production**: Connects to Render backend automatically
- **Local**: Start backend on port 3000, emulator will connect to `10.0.2.2:3000`

## Firebase Setup

### Analytics Events Tracked

- `app_opened`: App launch
- `game_started`: User starts new game
- `game_paused`: User pauses game
- `game_resumed`: User resumes game
- `game_over`: Game ends (includes final score)

### Crashlytics

Automatically reports:
- App crashes
- ANRs (Application Not Responding)
- Custom logged exceptions

## Permissions

Required permissions in `AndroidManifest.xml`:

- `INTERNET`: WebSocket connection
- `ACCESS_NETWORK_STATE`: Check connectivity
- `VIBRATE`: Haptic feedback (future)
- `WAKE_LOCK`: Keep screen on during gameplay

## Building for Production

See [BUILD.md](BUILD.md) for detailed instructions on:
- Creating signing keys
- Building release APK/AAB
- Publishing to Google Play Store
- ProGuard configuration

## Troubleshooting

### Can't connect to backend
- Check backend is running: https://tetris-app-testing.onrender.com/health
- For emulator: Use `10.0.2.2` not `localhost`
- For device: Check same network as dev machine

### Firebase not working
- Verify `google-services.json` is in `app/` folder
- Check package name matches: `com.tetris.game`
- Rebuild project after adding Firebase file

### Gradle sync failed
```bash
./gradlew clean
./gradlew build --refresh-dependencies
```

## File Structure

```
android/
├── app/
│   ├── src/main/
│   │   ├── java/com/tetris/game/
│   │   │   ├── MainActivity.kt        # Main activity
│   │   │   ├── TetrisGame.kt          # Game logic
│   │   │   ├── GameView.kt            # Canvas rendering
│   │   │   └── WebSocketClient.kt     # Network layer
│   │   ├── res/
│   │   │   ├── layout/
│   │   │   │   └── activity_main.xml  # UI layout
│   │   │   └── values/
│   │   │       ├── strings.xml
│   │   │       ├── colors.xml
│   │   │       └── themes.xml
│   │   ├── AndroidManifest.xml
│   │   └── google-services.json       # Firebase config
│   ├── build.gradle.kts               # App-level Gradle
│   └── proguard-rules.pro             # ProGuard rules
├── build.gradle.kts                   # Project-level Gradle
├── settings.gradle.kts
├── gradle.properties
├── BUILD.md                           # Detailed build guide
└── README.md                          # This file
```

## Contributing

1. Fork the repository
2. Create feature branch
3. Make your changes
4. Test thoroughly
5. Submit pull request

## License

ISC

## Backend Repository

The backend for this app is in the same repository:
- Backend: `tetris/src/`
- Frontend (Web): `tetris/frontend/`
- Android App: `tetris/android/`

## Links

- **Backend URL**: https://tetris-app-testing.onrender.com
- **Web App**: https://play-tetris.com
- **GitHub**: https://github.com/contactevin2u/Tetris-App-Testing
- **Firebase Console**: https://console.firebase.google.com/
