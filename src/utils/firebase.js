import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage, isSupported } from "firebase/messaging";
import { baseURL } from "../Services/api/baseURL";
import axios from "axios";

        const userToken = JSON.parse(localStorage.getItem("token"));


const firebaseConfig = {
  apiKey: "AIzaSyDi55PY9Ql51owucu5ZFDk3fEAieeWwURs",
  authDomain: "karivepak-980a7.firebaseapp.com",
  projectId: "karivepak-980a7",
  storageBucket: "karivepak-980a7.firebasestorage.app",
  messagingSenderId: "476130235766",
  appId: "1:476130235766:web:114d2743438d0db847d657",
  measurementId: "G-2MBGYGJSD3"
};

const app = initializeApp(firebaseConfig);

let messaging = null;

export const initializeMessaging = async () => {
    if (typeof window === "undefined") return null;

    const supported = await isSupported();
    if (!supported) return null;

    messaging = getMessaging(app);

    // Listen for foreground messages
    onMessage(messaging, (payload) => {
        if (Notification.permission === "granted") {
            new Notification(payload.notification.title, {
                body: payload.notification.body,
                icon: payload.notification.image || "/rntout.png",
            });
        }
    });

    return messaging;
};

export const requestPermissionAndToken = async () => {
    if (typeof window === "undefined") return null;

    const permission = await Notification.requestPermission();
    if (permission !== "granted") return null;

    const messagingInstance = messaging || (await initializeMessaging());

    const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");

    const fcmToken = await getToken(messagingInstance, {
        vapidKey: "BOFs0qoJDOpWX6X_VkGVU7snq7_xR8rulgklRwaqE3dh7QdQIOAftA-gmU4i5RB3_vLFkhANFRsrmT_ACWArklQ",
        serviceWorkerRegistration: registration,
    });

if (userToken) {
  try {
    await axios.post(
      `${baseURL}/api/auth/save-fcm-token`,
      { fcmToken },
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("FCM token saved successfully");
  } catch (err) {
    console.error("Failed to save FCM token:", err.response?.data || err.message);
  }
}

    return fcmToken;
};

export { app, messaging };
