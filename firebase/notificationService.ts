import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { getDb } from "./config";

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "child_added" | "profile_updated" | "review_added" | "favorite_added" | "booking_success";
  isRead: boolean;
  createdAt: Timestamp;
}

export const sendNotification = async (
  userId: string,
  title: string,
  message: string,
  type: Notification["type"]
) => {
  try {
    const db = getDb();
    await addDoc(collection(db, "notifications"), {
      userId,
      title,
      message,
      type,
      isRead: false,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

export const getUserNotifications = async (userId: string): Promise<Notification[]> => {
  try {
    const db = getDb();
    const q = query(
      collection(db, "notifications"),
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(q);
    const notifications = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Notification, "id">),
    }));


    return notifications.sort((a, b) => {
      const timeA = a.createdAt?.toMillis() || 0;
      const timeB = b.createdAt?.toMillis() || 0;
      return timeB - timeA;
    });
  } catch (error) {
    console.error("Error getting notifications:", error);
    return [];
  }
};

export const markNotificationAsRead = async (notificationId: string) => {
  try {
    const db = getDb();
    const docRef = doc(db, "notifications", notificationId);
    await updateDoc(docRef, { isRead: true });
  } catch (error) {
    console.error("Error marking notification as read:", error);
  }
};
