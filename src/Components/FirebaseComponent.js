import React, { useState, useEffect } from "react";
import { initializeMessaging, requestPermissionAndToken } from "../utils/firebase";
import "../FirebaseNotificationPopup.css"; // optional for styling

const FirebaseComponent = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Show popup if permission not granted yet
    if (Notification.permission === "default") {
      setShowPopup(true);
    }
  }, []);

  const handleEnableNotifications = async () => {
    try {
      await initializeMessaging();
      const fcmToken = await requestPermissionAndToken();
      setToken(fcmToken);
      setShowPopup(false);
      console.log("Notifications enabled:", fcmToken);
    } catch (err) {
      console.error("Failed to enable notifications:", err);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  if (!showPopup || token) return null; // hide if not needed or already enabled

  return (
    <div className="fcm-popup-overlay">
      <div className="fcm-popup">
        <h3>Enable Notifications</h3>
        <p>Get notified for important updates and alerts.</p>
        <div className="fcm-popup-buttons">
          <button className="fcm-popup-allow" onClick={handleEnableNotifications}>
            Allow
          </button>
          <button className="fcm-popup-deny" onClick={handleClosePopup}>
            Not Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default FirebaseComponent;
