const express = require("express");
const { Pool } = require("pg");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 3000;

// Configura el pool de conexión a PostgreSQL
const pool = new Pool({
	user: "postgres", // Cambia esto según tu configuración
	host: "localhost",
	database: "Arqui", // Tu base de datos existente
	password: "", // La contraseña de tu base de datos
	port: 5432,
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

app.post("/api/login", async (req, res) => {
	const { username, password } = req.body;

	console.log(`Username: ${username}, Password: ${password}`); // Debug

	try {
		const result = await pool.query(
			"SELECT * FROM credenciales WHERE usuario = $1 AND password = $2",
			[username, password]
		);

		console.log(`Result rows: ${result.rows.length}`); // Debug

		if (result.rows.length > 0) {
			res.status(200).json({ message: "Inicio de sesión exitoso" });
		} else {
			res.status(401).json({ message: "Credenciales incorrectas" });
		}
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Error al conectar con la base de datos" });
	}
});

// Iniciar el servidor
app.listen(port, () => {
	console.log(`Servidor escuchando en http://localhost:${port}`);
});
