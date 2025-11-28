import { auth } from "./firebaseConfig.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

const db = getFirestore();
const emailDisplay = document.getElementById("userEmail");
const sidebar = document.getElementById("sidebar");
const menuToggle = document.querySelector(".menu-toggle");
const logoutBtn = document.getElementById("logoutBtn");

onAuthStateChanged(auth, async (user) => {
  if (user) {
    // Traer el documento del usuario
    const docRef = doc(db, "usuarios", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const nombre = docSnap.data().nombre;
      emailDisplay.textContent = `Hola, ${nombre}`;
    } else {
      emailDisplay.textContent = `Hola, ${user.email}`; // fallback
    }
  } else {
    window.location.href = "index.html";
  }
});

logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});

menuToggle.addEventListener("click", () => {
  sidebar.classList.toggle("open");
});
  