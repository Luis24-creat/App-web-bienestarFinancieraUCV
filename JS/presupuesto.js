import { 
  initializeApp 
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";

import { 
  getAuth, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";


// =====================================================
// 🔥 CONFIG
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
// 📌 DOM Elements — AHORA COINCIDEN CON TU HTML
// =====================================================
const ingresoDesc = document.getElementById("ingresoDescripcion");
const ingresoMonto = document.getElementById("ingresoMonto");
const btnIngreso = document.getElementById("btnAgregarIngreso");

const gastoDesc = document.getElementById("gastoDescripcion");
const gastoMonto = document.getElementById("gastoMonto");
const btnGasto = document.getElementById("btnAgregarGasto");

const listaIngresos = document.getElementById("listaIngresos");
const listaGastos = document.getElementById("listaGastos");

const totalIngresos = document.getElementById("totalIngresos");
const totalGastos = document.getElementById("totalGastos");
const balanceRestante = document.getElementById("balanceRestante");


// =====================================================
// 📌 Usuario autenticado
// =====================================================
let USER_ID = null;

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "/Html/index.html";
  } else {
    USER_ID = user.uid;
    cargarMovimientos();
  }
});


// =====================================================
// 📌 Registrar Ingreso
// =====================================================
if (btnIngreso) {
  btnIngreso.addEventListener("click", async () => {
    if (!ingresoDesc.value || !ingresoMonto.value) return alert("Completa todos los campos.");

    const data = {
      userId: USER_ID,
      tipo: "ingreso",
      monto: parseFloat(ingresoMonto.value),
      descripcion: ingresoDesc.value,
      fecha: new Date(),
      creado: new Date()
    };

    await addDoc(collection(db, "presupuesto"), data);

    ingresoDesc.value = "";
    ingresoMonto.value = "";
    cargarMovimientos();
  });
}


// =====================================================
// 📌 Registrar Gasto
// =====================================================
if (btnGasto) {
  btnGasto.addEventListener("click", async () => {
    if (!gastoDesc.value || !gastoMonto.value) return alert("Completa todos los campos.");

    const data = {
      userId: USER_ID,
      tipo: "gasto",
      monto: parseFloat(gastoMonto.value),
      descripcion: gastoDesc.value,
      fecha: new Date(),
      creado: new Date()
    };

    await addDoc(collection(db, "presupuesto"), data);

    gastoDesc.value = "";
    gastoMonto.value = "";
    cargarMovimientos();
  });
}


// =====================================================
// 📌 Cargar Ingresos y Gastos
// =====================================================
async function cargarMovimientos() {
  if (!USER_ID) return;

  listaIngresos.innerHTML = "";
  listaGastos.innerHTML = "";

  let totalIng = 0;
  let totalGas = 0;

  const q = query(collection(db, "presupuesto"), orderBy("fecha", "desc"));
  const snapshot = await getDocs(q);

  snapshot.forEach((doc) => {
    const mov = doc.data();
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
}
