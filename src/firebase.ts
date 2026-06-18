import { initializeApp } from "firebase/app";
import { getDatabase, ref } from "firebase/database";

const firebaseConfig = {
  apiKey: 'AIzaSyCRMil-OJ7DxzXLLzAN_G7x9Dkz2Ifg4D4',
  authDomain: 'salameh-car-inspection.firebaseapp.com',
  projectId: 'salameh-car-inspection',
  storageBucket: 'salameh-car-inspection.firebasestorage.app',
  messagingSenderId: '1045571616526',
  appId: '1:1045571616526:web:1631483ffad3e248c5a15f',
  databaseURL: 'https://salameh-car-inspection-default-rtdb.firebaseio.com/'
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database
const db = getDatabase(app);

// Export db and the requested path reference helper
export { db, ref };
