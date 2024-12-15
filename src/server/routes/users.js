// server/routes/users.js
const express = require("express");
const router = express.Router();
const pool = require("../config/database");

// Obtener información del usuario por ID
router.get("/users/:id", async (req, res) => {
	const userId = req.params.id;

	try {
		const userResult = await pool.query(
			"SELECT user_id, username, email, role, created_at FROM users WHERE user_id = $1",
			[userId]
		);

		if (userResult.rows.length === 0) {
			return res.status(404).json({ message: "Usuario no encontrado" });
		}

		const profileResult = await pool.query(
			"SELECT full_name, bio, avatar_url, phone FROM user_profiles WHERE user_id = $1",
			[userId]
		);

		const user = userResult.rows[0];
		const profile = profileResult.rows[0] || {};

		res.json({ ...user, ...profile });
	} catch (error) {
		console.error("Error al obtener datos del usuario:", error);
		res.status(500).json({ message: "Error en el servidor" });
	}
});

module.exports = router;
