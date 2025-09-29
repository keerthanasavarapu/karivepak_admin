// firebase-messaging-sw.js

// Use compat build (works in service worker)
importScripts("https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging-compat.js");

const firebaseConfig = {
  apiKey: "AIzaSyBoR2lCIjFZXqN01iZgAWoNT0JSBilwOk8",
  authDomain: "luxorace-772ac.firebaseapp.com",
  projectId: "luxorace-772ac",
  storageBucket: "luxorace-772ac.firebasestorage.app",
  messagingSenderId: "1021836399704",
  appId: "1:1021836399704:web:28eefc1ee13dd167d0e62d",
  measurementId: "G-CXK40KXPRT"
};

// Initialize Firebase in SW
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image || "/rntout.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
