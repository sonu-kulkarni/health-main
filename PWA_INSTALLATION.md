# Health Vault PWA - Installation Guide

## What is a PWA?

A Progressive Web App (PWA) is a web application that can be installed on your mobile device like a native app. Health Vault works offline, has push notifications, and provides a native app experience.

## ✅ PWA Features Enabled

- 📱 **Install on Home Screen** - One-tap installation on Android & iOS
- 🔄 **Offline Support** - Works without internet connection
- ⚡ **Fast Loading** - Service Worker caches assets for speed
- 🔐 **Secure** - HTTPS only, secure data transmission
- 📲 **App-like Experience** - Full screen, native feel

## 📲 Installation Instructions

### Android (Chrome, Firefox, Samsung Internet)

1. **Open Health Vault** in your mobile browser
2. **Look for the install prompt** at the bottom or top of the browser
3. **Tap "Install"** or **tap the menu (⋮) → "Install app"**
4. **Confirm** - The app will be added to your home screen
5. **Open** - Tap the Health Vault icon to launch the app

### iOS (Safari only)

1. **Open Health Vault** in Safari on your iPhone/iPad
2. **Tap Share** (the square with arrow icon at bottom)
3. **Select "Add to Home Screen"**
4. **Name it** "Health Vault" (or your preferred name)
5. **Tap "Add"** - The app is now on your home screen
6. **Open** - Tap the Health Vault icon to launch

## 🔄 How Offline Mode Works

- The app caches essential resources when you first use it
- Medical records and profile data sync from the cloud when online
- Documents and data are automatically cached for offline viewing
- Changes made offline will sync when you reconnect to the internet

## 🆘 Troubleshooting

**App won't install?**
- Ensure you're using a supported browser (Chrome on Android, Safari on iOS)
- The app must be accessed via HTTPS (except localhost)
- Try clearing browser cache and try again

**Can't see data offline?**
- First load the app online to cache data
- Access the data once, then it's available offline
- Only cached records are available offline

**App crashes?**
- Clear app data in your phone settings
- Reinstall by removing from home screen and reinstalling
- Check that Supabase credentials are correct

## 🔗 Additional Resources

- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Web App Manifest Spec](https://www.w3.org/TR/appmanifest/)
- [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
