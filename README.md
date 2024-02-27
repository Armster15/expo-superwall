# expo-superwall

Use [Superwall](https://superwall.com/) in React Native + Expo

This Expo module exposes [the official Superwall SDK](https://github.com/superwall-me/Superwall-iOS) to React Native.

# Limitations

- Currently only iOS is supported
- The whole Superwall SDK is not fully exposed, however this module exposes most of the critical methods that should be more than enough to meet most needs
- This package requires that you use RevenueCat to handle subscription-related logic

Most of these limitations come from the fact that this Expo module was not originally intended to become a dedicated library, but rather was a module part of a larger React Native app codebase, so features were added on demand depending on that codebase's needs.

All of these limitations can be fixed. Feel free to send a PR if you would like to contribute :)

# Installation

1. Install the package:

```
npm install expo-superwall
```

2. Add the config plugin to your `app.json`

```json
{
  "plugins": ["expo-superwall"]
}
```

3. Setup in your app

```ts
Superwall.configure(SUPERWALL_API_KEY); // Call this only once in your app
Superwall.syncSubscriptionStatus(REVENUECAT_API_KEY); // Use this method to sync the RevenueCat subscription status with Superwall. Can be called numerous times (ex: on Superwall initialization, on app user login, etc)
```
