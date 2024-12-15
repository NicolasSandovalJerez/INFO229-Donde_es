// server/config/database.js
const { Pool } = require("pg");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

// Verificación de variables de entorno
const requiredEnvVars = ["DB_USER", "DB_HOST", "DB_NAME", "DB_PASSWORD", "DB_PORT"];
for (const envVar of requiredEnvVars) {
	if (!process.env[envVar]) {
		throw new Error(`Variable de entorno ${envVar} no está definida`);
	}
}

console.log("Configuración de BD:", {
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	database: process.env.DB_NAME,
	port: process.env.DB_PORT,
	// No loggeamos la contraseña por seguridad
});

const pool = new Pool({
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	database: process.env.DB_NAME,
	password: process.env.DB_PASSWORD,
	port: parseInt(process.env.DB_PORT) || 5432,
});

// Prueba de conexión
pool.query("SELECT NOW()", (err, res) => {
	if (err) {
		console.error("Error al conectar con la base de datos:", err);
	} else {
		console.log("Conexión a la base de datos establecida correctamente");
	}
});

module.exports = pool;
