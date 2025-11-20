import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDOry-U3lb0m6nLazXT0h_a0doQ9OfOesQ",
  authDomain: "ucv-bienestar-financiero.firebaseapp.com",
  projectId: "ucv-bienestar-financiero",
  storageBucket: "ucv-bienestar-financiero.appspot.com",
  messagingSenderId: "514029689803",
  appId: "1:514029689803:web:c8211af4faf487e9c3344e",
  measurementId: "G-W2C35MFXLZ"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const carrera = document.getElementById("carrera").value;
  const campus = document.getElementById("campus").value;
  const telefono = document.getElementById("telefono").value;
  const sexo = document.getElementById("sexo").value;
  const fechaNacimiento = document.getElementById("fechaNacimiento").value;

  try {
    // 1️⃣ Crear usuario en Authentication
    const credencial = await createUserWithEmailAndPassword(auth, email, password);
    const user = credencial.user;

    // 2️⃣ Guardar datos en Firestore (usando el UID correcto)
    await setDoc(doc(db, "usuarios", user.uid), {
      nombre,
      email,
      carrera,
      campus,
      telefono: telefono || "No especificado",
      sexo: sexo || "No especificado",
      fechaNacimiento: fechaNacimiento || "No especificado",
      verificado: false,
      fechaRegistro: new Date().toISOString()
    });

    alert("✅ Registro exitoso. ¡Bienvenido!");
    window.location.href = "index.html";

  } catch (error) {
    console.error("Error en el registro:", error);
    alert("❌ Error: " + error.message);
  }
});


