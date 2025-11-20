// ===========================================
//  ELEMENTOS DEL CHAT
// ===========================================
const chatBubble = document.getElementById("chatBubble");
const chatBox = document.getElementById("chatBox");
const closeChat = document.getElementById("closeChat");
const sendBtn = document.getElementById("sendBtn");
const userInput = document.getElementById("userInput");
const chatMessages = document.getElementById("chatMessages");

// ===========================================
//  MOSTRAR / OCULTAR CHAT (versión simple)
// ===========================================
if (chatBubble && chatBox && closeChat) {
  chatBubble.addEventListener("click", () => {
    chatBox.style.display = "flex";
    chatBubble.style.display = "none";
  });

  closeChat.addEventListener("click", () => {
    chatBox.style.display = "none";
    chatBubble.style.display = "block";
  });
}

// ===========================================
//  FUNCIÓN PARA ENVIAR MENSAJE
// ===========================================
async function enviar() {
  const mensaje = userInput.value.trim();
  if (!mensaje) return;

  agregarMensajeUsuario(mensaje);
  userInput.value = "";
  userInput.disabled = true;
  sendBtn.disabled = true;

  agregarMensajeIA("⏳ Enviando...");

  const respuesta = await enviarMensajeGemini(mensaje);

  // Elimina loader
  const loader = [...chatMessages.querySelectorAll(".ia-message")].find(m =>
    m.textContent.includes("⏳")
  );
  if (loader) loader.remove();

  agregarMensajeIA(respuesta);

  userInput.disabled = false;
  sendBtn.disabled = false;
  userInput.focus();
}

// CLICK EN ENVIAR
sendBtn.addEventListener("click", enviar);

// ENTER PARA ENVIAR
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    enviar();
  }
});

// ===========================================
//   AGREGAR MENSAJES AL CHAT
// ===========================================
function agregarMensajeUsuario(texto) {
  const div = document.createElement("div");
  div.className = "user-message";
  div.textContent = texto;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function agregarMensajeIA(texto) {
  const div = document.createElement("div");
  div.className = "ia-message";
  div.textContent = texto;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// ===========================================
//   IA: GOOGLE GEMINI
// ===========================================
async function enviarMensajeGemini(mensajeUsuario) {
  const apiKey = "AIzaSyAd1JeRbL0dPeH3MDUn3fIXQGc383hermA";

  const endpoint =
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const contexto = `
Eres un asistente virtual del sistema UCV Bienestar Financiero.
Ayuda con becas, ahorro, transacciones y finanzas personales.
Responde de forma clara, amable y útil.
`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: contexto + "\nUsuario: " + mensajeUsuario }
            ]
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Error API:", errorText);
      return `⚠️ Error ${response.status}: No se pudo obtener respuesta.`;
    }

    const data = await response.json();
    console.log("🔍 Respuesta IA:", data);

    const respuestaIA = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    return respuestaIA || "⚠️ La IA no respondió.";

  } catch (error) {
    console.error("❌ Error de conexión:", error);
    return "❌ No se pudo conectar con la IA.";
  }
}

// ===========================================
//   MANEJO DEL CHECKBOX (toggle CSS)
// ===========================================
document.addEventListener('DOMContentLoaded', () => {
  const chatToggle = document.getElementById('chatToggle');
  const chatBubbleLabel = document.querySelector('label.chat-bubble');
  const closeLabel = document.querySelector('label.close-chat');

  if (chatToggle && chatBox) {
    chatToggle.addEventListener('change', () => {
      chatBox.setAttribute('aria-hidden', chatToggle.checked ? "false" : "true");
      if (chatToggle.checked) setTimeout(() => userInput.focus(), 120);
    });

    chatBox.setAttribute("aria-hidden", chatToggle.checked ? "false" : "true");
  }

  if (chatBubbleLabel) {
    chatBubbleLabel.addEventListener("click", () => {
      setTimeout(() => userInput.focus(), 150);
    });
  }

  if (closeLabel) {
    closeLabel.addEventListener("click", () => {
      if (chatToggle) chatToggle.checked = false;
      chatBox.setAttribute("aria-hidden", "true");
    });
  }
});
