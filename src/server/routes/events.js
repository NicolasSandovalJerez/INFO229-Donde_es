// server/routes/events.js
const express = require("express");
const router = express.Router();
const pool = require("../config/database"); // Conexión a la base de datos

// Ruta para obtener todos los eventos
router.get("/events", async (req, res) => {
	try {
		// Realizar consulta a la base de datos para obtener los eventos
		const result = await pool.query("SELECT * FROM events"); // Cambia 'events' por el nombre real de tu tabla
		const events = result.rows; // Suponiendo que 'result.rows' contiene los datos

		// Enviar los eventos como respuesta JSON
		res.status(200).json(events);
	} catch (error) {
		console.error("Error al obtener los eventos:", error);
		res.status(500).json({ message: "Error en el servidor" });
	}
});

// Ruta para obtener eventos creados por un usuario específico
router.get("/events/user/:userId", async (req, res) => {
	try {
		const { userId } = req.params;
		const result = await pool.query("SELECT * FROM events WHERE creator_id = $1", [
			userId,
		]);
		const events = result.rows;
		res.status(200).json(events);
	} catch (error) {
		console.error("Error al obtener los eventos del usuario:", error);
		res.status(500).json({ message: "Error en el servidor" });
	}
});

router.post("/events", async (req, res) => {
	try {
		const {
			title,
			description,
			start_date,
			end_date,
			location_name,
			max_participants,
			is_private,
			latitude,
			longitude,
			creator_id, // Aceptar el campo creator_id
		} = req.body;

		// Insertar el nuevo evento en la base de datos
		const result = await pool.query(
			"INSERT INTO events (title, description, start_date, end_date, location_name, max_participants, is_private, latitude, longitude, creator_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *",
			[
				title,
				description,
				start_date,
				end_date,
				location_name,
				max_participants,
				is_private,
				latitude,
				longitude,
				creator_id, // Pasar el creator_id
			]
		);

		const newEvent = result.rows[0];

		res.status(201).json(newEvent); // Enviar la respuesta con el evento creado
	} catch (error) {
		console.error("Error al crear el evento:", error);
		res.status(500).json({ message: "Error al crear el evento" });
	}
});

module.exports = router;
