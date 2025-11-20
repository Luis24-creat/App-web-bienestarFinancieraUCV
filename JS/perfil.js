import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

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

// Referencias al DOM
const form = document.getElementById("formPerfil");
const editarBtn = document.getElementById("editarBtn");
const guardarBtn = document.getElementById("guardarBtn");
const campos = ["nombre", "correo", "carrera", "campus", "telefono", "sexo", "fechaNacimiento"];

// Cargar datos del usuario
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userRef = doc(db, "usuarios", user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const datos = userSnap.data();

      document.getElementById("nombre").value = datos.nombre || "";
      document.getElementById("correo").value = datos.email || user.email;
      document.getElementById("carrera").value = datos.carrera || "";
      document.getElementById("campus").value = datos.campus || "";
      document.getElementById("telefono").value = datos.telefono || "";
      document.getElementById("sexo").value = datos.sexo || "";
      document.getElementById("fechaNacimiento").value = datos.fechaNacimiento || "";
    } else {
      alert("No se encontraron datos del usuario.");
    }
  } else {
    window.location.href = "index.html"; // Redirige si no hay sesión
  }
});

// Habilitar edición
editarBtn.addEventListener("click", () => {
  campos.forEach(id => {
    if (id !== "correo") document.getElementById(id).disabled = false;
  });
  editarBtn.style.display = "none";
  guardarBtn.style.display = "inline-block";
});

// Guardar cambios
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const user = auth.currentUser;
  if (!user) return;

  const userRef = doc(db, "usuarios", user.uid);

  try {
    await updateDoc(userRef, {
      nombre: document.getElementById("nombre").value,
      carrera: document.getElementById("carrera").value,
      campus: document.getElementById("campus").value,
      telefono: document.getElementById("telefono").value,
      sexo: document.getElementById("sexo").value,
      fechaNacimiento: document.getElementById("fechaNacimiento").value,
    });

    alert("✅ Cambios guardados correctamente.");

    campos.forEach(id => document.getElementById(id).disabled = true);
    editarBtn.style.display = "inline-block";
    guardarBtn.style.display = "none";
  } catch (error) {
    console.error("Error al guardar cambios:", error);
    alert("❌ Error al guardar los cambios.");
  }
});
// ✅ Mostrar correo en la barra superior
const userEmail = document.getElementById("userEmail");
onAuthStateChanged(auth, (user) => {
  if (user && userEmail) {
    userEmail.textContent = user.email;
  }
});

// 🚪 Cerrar sesión
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    try {
      await auth.signOut();
      window.location.href = "index.html";
    } catch (error) {
      console.error("❌ Error al cerrar sesión:", error);
      alert("No se pudo cerrar la sesión.");
    }
  });
}
