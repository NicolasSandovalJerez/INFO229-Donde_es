// server/routes/auth.js
const express = require("express");
const router = express.Router();
const pool = require("../config/database.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

if (!process.env.JWT_SECRET) {
	throw new Error("JWT_SECRET no está definido en las variables de entorno");
}
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware para verificar la conexión a la BD
const checkDbConnection = async (req, res, next) => {
	try {
		await pool.query("SELECT 1");
		next();
	} catch (error) {
		console.error("Error de conexión a la BD:", error);
		res.status(500).json({ message: "Error de conexión a la base de datos" });
	}
};

// Aplicar el middleware a todas las rutas
router.use(checkDbConnection);

// Ruta para registrar usuario
router.post("/register", async (req, res) => {
	try {
		const { username, email, password, confirmPassword } = req.body;

		// Validaciones...
		if (!username || !email || !password || !confirmPassword) {
			return res.status(400).json({ message: "Todos los campos son obligatorios." });
		}

		if (password !== confirmPassword) {
			return res.status(400).json({ message: "Las contraseñas no coinciden." });
		}

		// Verificar usuario existente
		const userExists = await pool.query(
			"SELECT user_id FROM users WHERE email = $1 OR username = $2",
			[email, username]
		);

		if (userExists.rows.length > 0) {
			return res.status(400).json({
				message: "El correo o usuario ya están registrados.",
			});
		}

		const passwordHash = await bcrypt.hash(password, 10);
		const newUser = await pool.query(
			"INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, 'common') RETURNING user_id, username, email, role",
			[username, email, passwordHash]
		);

		const user = newUser.rows[0];
		const token = jwt.sign({ userId: user.user_id, role: user.role }, JWT_SECRET, {
			expiresIn: "24h",
		});

		res.status(201).json({
			token,
			user: {
				id: user.user_id,
				username: user.username,
				email: user.email,
				role: user.role,
			},
		});
	} catch (error) {
		console.error("Error en registro:", error);
		res.status(500).json({
			message: "Error en el servidor.",
			details: process.env.NODE_ENV === "development" ? error.message : undefined,
		});
	}
});

// Ruta para iniciar sesión
router.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({
				message: "Todos los campos son obligatorios.",
			});
		}

		const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [
			email,
		]);

		if (userResult.rows.length === 0) {
			return res.status(404).json({ message: "Usuario no encontrado." });
		}

		const user = userResult.rows[0];
		const isPasswordValid = await bcrypt.compare(password, user.password_hash);

		if (!isPasswordValid) {
			return res.status(401).json({ message: "Credenciales inválidas." });
		}

		const token = jwt.sign({ userId: user.user_id, role: user.role }, JWT_SECRET, {
			expiresIn: "24h",
		});

		res.status(200).json({
			token,
			user: {
				id: user.user_id,
				username: user.username,
				email: user.email,
				role: user.role,
			},
		});
	} catch (error) {
		console.error("Error en login:", error);
		res.status(500).json({
			message: "Error en el servidor.",
			details: process.env.NODE_ENV === "development" ? error.message : undefined,
		});
	}
});

// Aquí agregamos la lógica para acceder a la base de datos y obtener los detalles completos del evento
// Este es solo un ejemplo, asegúrate de que los datos provengan de tu base de datos correctamente

router.get("/event/:id", (req, res) => {
	const eventId = req.params.id;

	// Simulamos la respuesta de la base de datos (deberías reemplazar esto con tu lógica de DB)
	const event = {
		id: eventId,
		name: "Evento Ejemplo",
		description: "Descripción del evento",
		max_participants: 100,
		is_private: true,
		start_date: "2024-12-01",
		end_date: "2024-12-03",
		location: "Ubicación del evento",
		active: true,
		created_at: "2024-10-01",
		updated_at: "2024-10-15",
	};

	res.json(event);
});

module.exports = router;
