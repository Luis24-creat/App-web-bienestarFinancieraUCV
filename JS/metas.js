import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

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
const db = getFirestore(app);

// =========================
// 📌 CAPTURA DE ELEMENTOS
// =========================
const formMeta = document.getElementById("formMeta");
const metasContainer = document.getElementById("listaMetas");
const totalMetas = document.getElementById("totalMetas");
const totalAcumulado = document.getElementById("totalAcumulado");
const promedioProgreso = document.getElementById("promedioProgreso");
const fraseMotivacional = document.getElementById("fraseMotivacional");

const modalHistorial = document.getElementById("modalHistorial");
const listaHistorial = document.getElementById("listaHistorial");
const cerrarHistorial = document.getElementById("cerrarHistorial");

const modoToggle = document.getElementById("modoToggle");

// =========================
// 🌟 FRASES MOTIVACIONALES
// =========================
const frases = [
  "Cada pequeño paso te acerca a tu meta. 💪",
  "La constancia es la clave del éxito.",
  "Construye tu futuro, un aporte a la vez.",
  "Tu progreso importa, sigue avanzando.",
  "Nunca es tarde para empezar a mejorar."
];

function mostrarFrase() {
  if (!fraseMotivacional) return;
  const r = Math.floor(Math.random() * frases.length);
  fraseMotivacional.textContent = frases[r];
}

// =========================
// ➕ AGREGAR META
// =========================
formMeta.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombreMeta = document.getElementById("nombreMeta").value.trim();
  const montoObjetivo = parseFloat(document.getElementById("montoObjetivo").value);

  if (!nombreMeta || montoObjetivo <= 0) {
    alert("Completa correctamente los datos.");
    return;
  }

  try {
    await addDoc(collection(db, "metas"), {
      nombreMeta,
      montoObjetivo,
      montoAhorrado: 0,
      progreso: 0,
      historial: [],
      fechaCreacion: new Date().toISOString()
    });

    alert("Meta registrada correctamente ✔");
    formMeta.reset();
    mostrarMetas();
  } catch (error) {
    console.error("Error al guardar:", error);
  }
});

// =========================
// 📌 MOSTRAR TODAS LAS METAS
// =========================
async function mostrarMetas() {
  if (!metasContainer) return;

  metasContainer.innerHTML = "";
  const query = await getDocs(collection(db, "metas"));

  let total = 0;
  let acumulado = 0;
  let sumaProgreso = 0;

  query.forEach((docSnap) => {
    const meta = docSnap.data();
    const id = docSnap.id;
    total++;

    acumulado += meta.montoAhorrado || 0;
    sumaProgreso += meta.progreso || 0;

    const li = document.createElement("li");
    li.classList.add("meta-item");
    li.dataset.id = id;

    li.innerHTML = `
      <h3>${meta.nombreMeta}</h3>
      <p>Objetivo: S/.${meta.montoObjetivo}</p>
      <p>Avance: S/.${meta.montoAhorrado}</p>
      <p>Progreso: ${meta.progreso}%</p>

      <div class="meta-acciones">
        <button class="btn-aportar">💰 Aportar</button>
        <button class="btn-historial">📋 Historial</button>
        <button class="btn-editar">✏️ Editar</button>
        <button class="btn-eliminar">🗑️ Eliminar</button>
      </div>
    `;

    metasContainer.appendChild(li);
  });

  // Resumen
  if (totalMetas) totalMetas.textContent = total;
  if (totalAcumulado) totalAcumulado.textContent = `S/.${acumulado}`;
  if (promedioProgreso)
    promedioProgreso.textContent = total > 0 ? `${(sumaProgreso / total).toFixed(1)}%` : "0%";

  activarEventos();
}

// =========================
// 🟢 ACTIVAR BOTONES
// =========================
function activarEventos() {
  document.querySelectorAll(".btn-aportar").forEach(btn =>
    btn.addEventListener("click", aportarDinero)
  );

  document.querySelectorAll(".btn-historial").forEach(btn =>
    btn.addEventListener("click", verHistorial)
  );

  document.querySelectorAll(".btn-editar").forEach(btn =>
    btn.addEventListener("click", editarMeta)
  );

  document.querySelectorAll(".btn-eliminar").forEach(btn =>
    btn.addEventListener("click", eliminarMeta)
  );
}

// =========================
// 💰 APORTAR DINERO
// =========================
async function aportarDinero(e) {
  const li = e.target.closest("li");
  const id = li.dataset.id;

  const monto = parseFloat(prompt("¿Cuánto deseas sumar al avance?"));

  if (!monto || monto <= 0) return;

  const ref = doc(db, "metas", id);
  const snap = await getDoc(ref);
  const meta = snap.data();

  const nuevoMonto = (meta.montoAhorrado || 0) + monto;
  const progreso = ((nuevoMonto / meta.montoObjetivo) * 100).toFixed(1);

  // Si llega al objetivo → se elimina
  if (nuevoMonto >= meta.montoObjetivo) {
    await deleteDoc(ref);
    alert("🎉 ¡Meta alcanzada! Se eliminó automáticamente.");
    mostrarMetas();
    return;
  }

  await updateDoc(ref, {
    montoAhorrado: nuevoMonto,
    progreso: Number(progreso),
    historial: [
      ...(meta.historial || []),
      { monto, fecha: new Date().toLocaleString() }
    ]
  });

  mostrarMetas();
}

// =========================
// 📋 VER HISTORIAL
// =========================
async function verHistorial(e) {
  const li = e.target.closest("li");
  const id = li.dataset.id;

  const ref = doc(db, "metas", id);
  const snap = await getDoc(ref);
  const meta = snap.data();

  // Mostrar datos de la meta
  detalleTitulo.textContent = meta.nombreMeta;
  detalleObjetivo.textContent = `Objetivo: S/.${meta.montoObjetivo}`;
  detalleProgreso.textContent = `Progreso: ${meta.progreso}%`;

  // Barra de progreso
  detalleBarra.style.width = `${meta.progreso}%`;

  // Mostrar historial
  listaHistorial.innerHTML = "";
  (meta.historial || []).forEach(item => {
    const li = document.createElement("li");
    li.textContent = `+ S/.${item.monto} — ${item.fecha}`;
    listaHistorial.appendChild(li);
  });

  // Mostrar sección detalle y ocultar listado principal
  vistaMetas.style.display = "none";
  vistaDetalle.style.display = "block";
}

// ⚡ Evento para regresar a la vista principal de metas
btnRegresar.addEventListener("click", () => {
  vistaDetalle.style.display = "none";
  vistaMetas.style.display = "block";
});


// =========================
// ✏️ EDITAR META
// =========================
async function editarMeta(e) {
  const li = e.target.closest("li");
  const id = li.dataset.id;

  const nuevoNombre = prompt("Nuevo nombre de la meta:");
  if (!nuevoNombre) return;

  await updateDoc(doc(db, "metas", id), { nombreMeta: nuevoNombre });
  mostrarMetas();
}

// =========================
// 🗑️ ELIMINAR META
// =========================
async function eliminarMeta(e) {
  const li = e.target.closest("li");
  const id = li.dataset.id;

  if (!confirm("¿Eliminar esta meta?")) return;

  await deleteDoc(doc(db, "metas", id));
  mostrarMetas();
}

// =========================
// 🌙 MODO OSCURO
// =========================
if (modoToggle) {
  modoToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
  });
}

// =========================
// 🚀 INICIO
// =========================
mostrarMetas();
mostrarFrase();
