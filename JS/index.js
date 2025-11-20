import { auth, db } from "./firebaseConfig.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";

const form = document.getElementById("loginForm");
const mensaje = document.getElementById("mensaje");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    mensaje.textContent = "Inicio de sesión exitoso ✅";
    mensaje.style.color = "green";

    // Redirigir al dashboard
    window.location.href = "dashboard.html";
  } catch (error) {
    mensaje.textContent = "Error: " + error.message;
    mensaje.style.color = "red";
  }
});
