import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyD9ktuNXH_4Rm9eMjW6XRJ4sF6AoqE0hNk",
  authDomain: "pilih-pilih-shop.firebaseapp.com",
  projectId: "pilih-pilih-shop",
  storageBucket: "pilih-pilih-shop.firebasestorage.app",
  messagingSenderId: "144481933595",
  appId: "1:144481933595:web:2e398a6818d459f26a5bbe",
  measurementId: "G-4NZW47WLLX"
};


const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)