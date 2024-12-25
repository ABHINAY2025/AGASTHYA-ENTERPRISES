// firebase.ts (or firebase.js)

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCkZ2fnyYua7-jC7_Iw7S_o7HVkzm9o3p0",
  authDomain: "agasthya-enterprises.firebaseapp.com",
  projectId: "agasthya-enterprises",
  storageBucket: "agasthya-enterprises.firebasestorage.app",
  messagingSenderId: "47614470315",
  appId: "1:47614470315:web:06e21f22cda64667cc2fee",
  measurementId: "G-2RHC16R8NN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Example function to add a document to Firestore
export async function addInvoice() {
  try {
    const docRef = await addDoc(collection(db, "invoices"), {
      invoiceNumber: "12345",
      customerName: "John Doe",
      amount: 100.0,
      date: new Date(),
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

// Example function to get documents from Firestore
export async function getInvoices() {
  const invoicesCollection = collection(db, "invoices");
  const invoiceSnapshot = await getDocs(invoicesCollection);
  const invoiceList = invoiceSnapshot.docs.map(doc => doc.data());
  console.log(invoiceList);
}
