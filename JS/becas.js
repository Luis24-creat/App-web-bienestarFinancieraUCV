// ===============================
// 🔥 Importar Firebase
// ===============================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import {getFirestore,collection,addDoc,getDocs,doc,updateDoc,deleteDoc,getDoc} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

// ===============================
// 🔥 Configuración Firebase UCV Bienestar Financiero
// ===============================
const firebaseConfig = {
  apiKey: "AIzaSyDOry-U3lb0m6nLazXT0h_a0doQ9OfOesQ",
  authDomain: "ucv-bienestar-financiero.firebaseapp.com",
  projectId: "ucv-bienestar-financiero",
  storageBucket: "ucv-bienestar-financiero.appspot.com",
  messagingSenderId: "514029689803",
  appId: "1:514029689803:web:c8211af4faf487e9c3344e",
  measurementId: "G-W2C35MFXLZ"
};

// ===============================
// 🔥 Inicializar Firebase
// ===============================
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ===============================
// 👉 Aquí escribirás TU código
//    para gestionar becas con Firebase
// ===============================

// Ejemplo de guía:
// const becasRef = collection(db, "becas");
// const solicitudesRef = collection(db, "solicitudesBecas");

// (Luego agregas tus funciones cuando las necesites)
