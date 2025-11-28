import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

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
const formCita = document.getElementById("formCita");
const nombreCita = document.getElementById("nombreCita");
const emailCita = document.getElementById("emailCita");
const mensajeCita = document.getElementById("mensajeCita");
const listaConsultas = document.getElementById("listaConsultas");
const filtroEstado = document.getElementById("filtroEstado");

let USER_ID = null;

// =========================
// 📌 Usuario autenticado
// =========================
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "/Html/index.html";
  } else {
    USER_ID = user.uid;
    userEmail.textContent = user.email;
    cargarConsultas();
  }
});

// =========================
// 📌 Cerrar sesión
// =========================
logoutBtn?.addEventListener("click", () => {
  signOut(auth).then(() => window.location.href = "/Html/index.html");
});

// =========================
// 📌 Enviar solicitud de cita
// =========================
formCita?.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!nombreCita.value || !emailCita.value || !mensajeCita.value) {
    return alert("Completa todos los campos.");
  }

  try {
    await addDoc(collection(db, "asesoria"), {
      userId: USER_ID,
      nombre: nombreCita.value,
      email: emailCita.value,
      mensaje: mensajeCita.value,
      fecha: new Date(),
      estado: "pendiente",
      respuesta: "" // Campo para respuesta futura
    });

    nombreCita.value = "";
    emailCita.value = "";
    mensajeCita.value = "";
    cargarConsultas();
  } catch (error) {
    console.error("Error al enviar la cita:", error);
  }
});

// =========================
// 📌 Filtrar consultas
// =========================
filtroEstado?.addEventListener("change", () => {
  cargarConsultas(filtroEstado.value);
});

// =========================
// 📌 Cargar consultas
// =========================
async function cargarConsultas(estadoFiltro = "todos") {
  listaConsultas.innerHTML = "";

  try {
    const q = query(collection(db, "asesoria"), orderBy("fecha", "desc"));
    const snapshot = await getDocs(q);

    snapshot.forEach((docSnap) => {
      const consulta = docSnap.data();

      // Solo mostrar consultas del usuario
      if (consulta.userId !== USER_ID) return;
      if (estadoFiltro !== "todos" && consulta.estado !== estadoFiltro) return;

      const fecha = consulta.fecha?.toDate ? consulta.fecha.toDate() : consulta.fecha;

      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${fecha.toLocaleString()}</strong><br>
        <strong>Asunto:</strong> ${consulta.mensaje}<br>
        <em>Estado: ${consulta.estado}</em>
        ${consulta.respuesta ? `<p><strong>Respuesta:</strong> ${consulta.respuesta}</p>` : ''}
      `;
      listaConsultas.appendChild(li);
    });
  } catch (error) {
    console.error("Error al cargar consultas:", error);
    listaConsultas.innerHTML = "<li>No se pudieron cargar las consultas.</li>";
  }
}
