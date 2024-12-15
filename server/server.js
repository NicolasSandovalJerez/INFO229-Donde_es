const express = require("express");
const path = require("path");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const authRoutes = require("./routes/auth");
const eventsRoutes = require("./routes/events");
const validateEnv = require("./config/validaEnv");
const pool = require("./config/database");
const userRoutes = require("./routes/users");
require("dotenv").config();

const app = express();
const port = 3000;

// Validar variables de entorno
validateEnv();

console.log("Inicializando el servidor...");

// Configuración de límites de solicitudes
const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutos
	max: 5, // 5 intentos
	message: "Demasiados intentos de inicio de sesión, intente más tarde",
	standardHeaders: true,
	legacyHeaders: false,
});

const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 100,
	message: "Demasiadas solicitudes a la API, intente más tarde",
	standardHeaders: true,
	legacyHeaders: false,
});

// Middlewares globales
app.use(cors());
app.use(express.json());

// Aplicar rate limiting específico
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);
app.use("/api/", apiLimiter);
app.use("/api", userRoutes);

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, "../public")));

// Rutas principales
app.use("/api/auth", authRoutes);
app.use("/api", eventsRoutes);

// Ruta para exponer claves del entorno
app.get("/api/config", (req, res) => {
	res.json({ HERE_MAPS_API_KEY: process.env.HERE_MAPS_API_KEY });
});

// Endpoint para perfiles de usuario
app.post("/api/submit-profile", async (req, res) => {
	const { user_id, full_name, bio, avatar_url, phone } = req.body;

	if (!user_id || !full_name) {
		console.error("Datos incompletos:", req.body);
		return res.status(400).json({ message: "Faltan datos obligatorios." });
	}

	try {
		const query = `
            INSERT INTO user_profiles (user_id, full_name, bio, avatar_url, phone)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING profile_id;
        `;
		const values = [user_id, full_name, bio, avatar_url, phone];
		const result = await pool.query(query, values);

		res.status(201).json({
			message: "Perfil creado exitosamente.",
			profile_id: result.rows[0].profile_id,
		});
	} catch (error) {
		console.error("Error al insertar perfil:", error);
		res.status(500).json({
			message: "Error al crear el perfil.",
			details: error.message,
		});
	}
});

// Middleware de manejo de errores global
app.use((err, req, res, next) => {
	console.error("Error capturado:", err.message || err);
	res.status(err.status || 500).json({
		message: err.message || "Error interno del servidor.",
		details: process.env.NODE_ENV === "development" ? err.stack : undefined,
	});
});

// Arranque del servidor
app.listen(port, () => {
	console.log(`Servidor corriendo en http://localhost:${port}`);
});

module.exports = app;
