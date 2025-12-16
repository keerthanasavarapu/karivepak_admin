import { useEffect } from "react";
import { initializeMessaging, requestPermissionAndToken } from "../utils/firebase";

const FirebaseComponent = () => {
  useEffect(() => {
    const handleUserInteraction = async () => {
      try {
        if (Notification.permission === "default") {
          await initializeMessaging();
          const token = await requestPermissionAndToken();
          console.log("Permission granted, token:", token);
        }
      } catch (err) {
        console.error("Permission error:", err);
      } finally {
        document.removeEventListener("click", handleUserInteraction);
      }
    };

    document.addEventListener("click", handleUserInteraction, { once: true });

    return () =>
      document.removeEventListener("click", handleUserInteraction);
  }, []);

  return null;
};

export default FirebaseComponent;
