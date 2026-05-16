import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getDb } from "./config";

type BookingData = {
  activity: string;
  parentName: string;
  phone: string;
  email: string;
  childName: string;
  age: string;
  notes: string;
  medicalInfo: string;
};

export async function submitBooking(data: BookingData) {
  const db = getDb();

  await addDoc(collection(db, "bookings"), {
    ...data,
    status: "pending",
    createdAt: serverTimestamp(),
  });

  await addDoc(collection(db, "mail"), {
    to: ["s12219933@stu.najah.edu"],
    message: {
      subject: `New Booking Request - ${data.activity}`,
      text: `New booking request from ${data.parentName} for ${data.activity}. Phone: ${data.phone}`,
    },
  });
}