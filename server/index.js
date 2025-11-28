import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

// Necesario para usar __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar .env
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ==================================================
// 📌 SERVIR TU APLICACIÓN COMPLETA (HTML, JS, CSS)
// ==================================================

const publicPath = path.join(__dirname, "..");
app.use(express.static(publicPath));

// 👉 Página principal automáticamente
app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, "Html", "index.html"));
});

// ==================================================
// 📌 API PROXY PARA GOOGLE GEMINI (KEY SEGURA)
// ==================================================

app.post("/api/chat", async (req, res) => {
  try {
    const { mensaje } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Falta GEMINI_API_KEY en .env" });
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const respuesta = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: `Eres un asistente financiero UCV.\nUsuario: ${mensaje}` }
            ]
          }
        ]
      })
    });

    const data = await respuesta.json();
    res.json(data);

  } catch (error) {
    console.error("❌ Error en API:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// ==================================================
// 📌 INICIAR SERVIDOR
// ==================================================

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor Node funcionando en http://localhost:${PORT}`);
});
