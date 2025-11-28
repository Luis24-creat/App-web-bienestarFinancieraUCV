// =========================
// 🔥 IMPORTS FIREBASE
// =========================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { getFirestore, collection, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

// =========================
// 🔥 CONFIG FIREBASE
// =========================
const firebaseConfig = {
  apiKey: "AIzaSyDOry-U3lb0m6nLazXT0h_a0doQ9OfOesQ",
  authDomain: "ucv-bienestar-financiero.firebaseapp.com",
  projectId: "ucv-bienestar-financiero",
  storageBucket: "ucv-bienestar-financiero.appspot.com",
  messagingSenderId: "514029689803",
  appId: "1:514029689803:web:c8211af4faf487e9c3344e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// =========================
// 📌 DOM Elements
// =========================
const userEmail = document.getElementById("userEmail");
const logoutBtn = document.getElementById("logoutBtn");
const listaBeneficios = document.getElementById("listaBeneficios");

// =========================
// 🔹 Verificar usuario autenticado y mostrar nombre
// =========================
onAuthStateChanged(auth, async (user) => {
  if (user) {
    try {
      const docRef = doc(db, "usuarios", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const nombre = docSnap.data().nombre;
        userEmail.textContent = `Hola, ${nombre}`; // solo el nombre
      } else {
        userEmail.textContent = user.email.split("@")[0]; // fallback
      }
    } catch (error) {
      console.error("Error al obtener el nombre del usuario:", error);
      userEmail.textContent = user.email.split("@")[0]; // fallback
    }
  } else {
    window.location.href = "/Html/index.html";
  }
});

// =========================
// 🔹 Cerrar sesión
// =========================
logoutBtn.addEventListener("click", () => {
  signOut(auth).then(() => window.location.href = "/Html/index.html");
});

// =========================
// 🔹 Cargar Beneficios
// =========================
async function cargarBeneficios() {
  listaBeneficios.innerHTML = ""; // limpiar contenido

  try {
    const querySnapshot = await getDocs(collection(db, "beneficios"));
    querySnapshot.forEach((docSnap) => {
      const beneficio = docSnap.data();

      const div = document.createElement("div");
      div.classList.add("beneficio-card");

      div.innerHTML = `
        <img src="${beneficio.imagenURL || '/assets/default.png'}" alt="${beneficio.titulo}">
        <h3>${beneficio.titulo}</h3>
        <p>${beneficio.descripcion}</p>
        ${beneficio.enlace ? `<a href="${beneficio.enlace}" target="_blank">Ver más</a>` : ''}
      `;

      listaBeneficios.appendChild(div);
    });
  } catch (error) {
    console.error("Error al cargar beneficios:", error);
    listaBeneficios.innerHTML = "<p>No se pudieron cargar los beneficios.</p>";
  }
}

// =========================
// 🚀 Inicializar
// =========================
cargarBeneficios();
