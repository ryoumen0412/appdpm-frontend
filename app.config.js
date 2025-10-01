import "dotenv/config";

export default {
  expo: {
    name: "Test-app",
    slug: "test-app-v2",
    version: "1.0.1",
    extra: {
      API_URL_GLOBAL: process.env.API_URL_GLOBAL,
    },
    ios: {
      bundleIdentifier: "com.testapp.appdpm",
      supportsTablet: true,
    },
    android: {
      package: "com.testapp.appdpm",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#FFFFFF",
      },
    },
  },
};
