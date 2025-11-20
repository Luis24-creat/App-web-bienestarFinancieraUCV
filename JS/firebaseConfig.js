// Importar Firebase desde CDN (versión 12.4.0)
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

// Tu configuración real de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDOry-U3lb0m6nLazXT0h_a0doQ9OfOesQ",
  authDomain: "ucv-bienestar-financiero.firebaseapp.com",
  projectId: "ucv-bienestar-financiero",
  storageBucket: "ucv-bienestar-financiero.firebasestorage.app",
  messagingSenderId: "514029689803",
  appId: "1:514029689803:web:c8211af4faf487e9c3344e",
  measurementId: "G-W2C35MFXLZ"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar para que otros archivos (como index.js o register.js) lo usen
export const auth = getAuth(app);
export const db = getFirestore(app);
