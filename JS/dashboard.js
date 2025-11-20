import { auth } from "./firebaseConfig.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";

const emailDisplay = document.getElementById("userEmail");
const sidebar = document.getElementById("sidebar");
const menuToggle = document.getElementById("menuToggle");
const logoutBtn = document.getElementById("logoutBtn");

// Verificar usuario activo
onAuthStateChanged(auth, (user) => {
  if (user) {
    emailDisplay.textContent = `Hola, ${user.email}`;
  } else {
    window.location.href = "index.html";
  }
});

// Cerrar sesión
logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});

menuToggle.addEventListener("click", () => {
  sidebar.classList.toggle("open");
});
