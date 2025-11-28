// =====================================================
// 📌 IMPORTS CORREGIDOS (Chart.js + Firebase)
// =====================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { getFirestore, collection, addDoc, doc, getDoc, query, orderBy, getDocs } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";



// =====================================================
// 🔥 CONFIG FIREBASE
// =====================================================
const firebaseConfig = {
  apiKey: "AIzaSyDOry-U3lb0m6nLazXT0h_a0doQ9OfOesQ",
  authDomain: "ucv-bienestar-financiero.firebaseapp.com",
  projectId: "ucv-bienestar-financiero",
  storageBucket: "ucv-bienestar-financiero.appspot.com",
  messagingSenderId: "514029689803",
  appId: "1:514029689803:web:c8211af4faf487e9c3344e",
  measurementId: "G-W2C35MFXLZ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


// =====================================================
// 📌 DOM Elements
// =====================================================
const ingresoDesc = document.getElementById("ingresoDescripcion");
const ingresoMonto = document.getElementById("ingresoMonto");
const ingresoOrigen = document.getElementById("ingresoOrigen");
const btnIngreso = document.getElementById("btnAgregarIngreso");

const gastoDesc = document.getElementById("gastoDescripcion");
const gastoMonto = document.getElementById("gastoMonto");
const btnGasto = document.getElementById("btnAgregarGasto");

const listaIngresos = document.getElementById("listaIngresos");
const listaGastos = document.getElementById("listaGastos");

const totalIngresos = document.getElementById("totalIngresos");
const totalGastos = document.getElementById("totalGastos");
const balanceRestante = document.getElementById("balanceRestante");

const emailDisplay = document.getElementById("userEmail");
const logoutBtn = document.getElementById("logoutBtn");

let graficoPresupuesto = null;


// =====================================================
// 📌 Mostrar nombre usuario
// =====================================================
let USER_ID = null;

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  USER_ID = user.uid;

  const docRef = doc(db, "usuarios", user.uid);

  try {
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      emailDisplay.textContent = `Hola, ${snap.data().nombre}`;
    } else {
      emailDisplay.textContent = `Hola, ${user.email}`;
    }
  } catch (err) {
    console.log(err);
    emailDisplay.textContent = "Hola";
  }

  cargarMovimientos();
});


// =====================================================
// 📌 Cerrar sesión
// =====================================================
logoutBtn?.addEventListener("click", () => {
  signOut(auth).then(() => window.location.href = "/Html/index.html");
});


// =====================================================
// 🔔 NOTIFICACIÓN flotante
// =====================================================
function mostrarAnimacionPago(tipo) {
  const notif = document.getElementById("notificacionPago");
  const texto = document.getElementById("notificacionTexto");

  if (!notif || !texto) return;

  let mensaje = "Transacción registrada";
  let icono = "💸";

  if (tipo === "banco") { mensaje = "Depósito bancario"; icono = "🏦"; }
  if (tipo === "efectivo") { mensaje = "Ingreso en efectivo"; icono = "💵"; }
  if (tipo === "transferencia") { mensaje = "Transferencia recibida"; icono = "➡️"; }

  texto.textContent = mensaje;
  const iconNode = notif.querySelector(".notif-icon");
  if (iconNode) iconNode.textContent = icono;

  // Remover clase de oculto y agregar clase mostrar
  notif.classList.remove("oculto");
  notif.classList.add("mostrar");

  clearTimeout(notif._hideTimeout);
  notif._hideTimeout = setTimeout(() => {
    notif.classList.remove("mostrar");
    notif.classList.add("oculto");
  }, 2200);
}


// =====================================================
// 📌 Registrar ingreso
// =====================================================
btnIngreso?.addEventListener("click", async () => {
  if (!USER_ID) return alert("Usuario no autenticado");

  if (!ingresoDesc.value || !ingresoMonto.value || parseFloat(ingresoMonto.value) <= 0) {
    return alert("Completa todos los campos.");
  }

  const data = {
    userId: USER_ID,
    tipo: "ingreso",
    monto: parseFloat(ingresoMonto.value),
    descripcion: ingresoDesc.value,
    fecha: new Date(),
    creado: new Date()
  };

  btnIngreso.disabled = true;

  try {
    await addDoc(collection(db, "presupuesto"), data);

    const origen = ingresoOrigen?.value || "ingreso";
    mostrarAnimacionPago(origen);

    ingresoDesc.value = "";
    ingresoMonto.value = "";
    ingresoOrigen.value = "";

    cargarMovimientos();
  } catch (e) {
    console.log("Error:", e);
    alert("Ocurrió un error.");
  }

  btnIngreso.disabled = false;
});


// =====================================================
// 📌 Registrar gasto
// =====================================================
btnGasto?.addEventListener("click", async () => {
  if (!USER_ID) return alert("Usuario no autenticado");

  if (!gastoDesc.value || !gastoMonto.value || parseFloat(gastoMonto.value) <= 0) {
    return alert("Completa todos los campos.");
  }

  const data = {
    userId: USER_ID,
    tipo: "gasto",
    monto: parseFloat(gastoMonto.value),
    descripcion: gastoDesc.value,
    fecha: new Date(),
    creado: new Date()
  };

  btnGasto.disabled = true;

  try {
    await addDoc(collection(db, "presupuesto"), data);
    gastoDesc.value = "";
    gastoMonto.value = "";
    cargarMovimientos();
  } catch (e) {
    console.log("Error:", e);
    alert("Ocurrió un error.");
  }

  btnGasto.disabled = false;
});


// =====================================================
// 📌 Cargar movimientos
// =====================================================
async function cargarMovimientos() {
  if (!USER_ID) return;

  listaIngresos.innerHTML = "";
  listaGastos.innerHTML = "";

  let totalIng = 0;
  let totalGas = 0;

  try {
    const q = query(collection(db, "presupuesto"), orderBy("fecha", "desc"));
    const snap = await getDocs(q);

    snap.forEach((d) => {
      const mov = d.data();
      if (mov.userId !== USER_ID) return;

      const li = document.createElement("li");
      li.textContent = `${mov.descripcion} - S/ ${mov.monto.toFixed(2)}`;

      if (mov.tipo === "ingreso") {
        listaIngresos.appendChild(li);
        totalIng += mov.monto;
      } else {
        listaGastos.appendChild(li);
        totalGas += mov.monto;
      }
    });

    totalIngresos.textContent = `S/ ${totalIng.toFixed(2)}`;
    totalGastos.textContent = `S/ ${totalGas.toFixed(2)}`;
    balanceRestante.textContent = `S/ ${(totalIng - totalGas).toFixed(2)}`;

    actualizarGrafico(totalIng, totalGas);
  } catch (e) {
    console.log("Error:", e);
  }
}


// =====================================================
// 📌 Gráfico
// =====================================================
function actualizarGrafico(ing, gas) {
  const canvas = document.getElementById("graficoPresupuesto");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  if (graficoPresupuesto) graficoPresupuesto.destroy();

  graficoPresupuesto = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Ingresos", "Gastos"],
      datasets: [{
        data: [ing, gas],
        backgroundColor: ["#4CAF50", "#F44336"],
        borderRadius: 12
      }]
    },
    options: {
      responsive: true,
      scales: { y: { beginAtZero: true } }
    }
  });
}
