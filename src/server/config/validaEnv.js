const requiredEnvVars = [
	"DB_USER",
	"DB_HOST",
	"DB_NAME",
	"DB_PASSWORD",
	"DB_PORT",
	"JWT_SECRET",
	"HERE_MAPS_API_KEY",
	"NODE_ENV",
];

function validateEnv() {
	const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

	if (missingVars.length > 0) {
		console.error(
			`Error: Las siguientes variables de entorno están ausentes: ${missingVars.join(
				", "
			)}`
		);
		process.exit(1); // Salir con código de error
	}

	console.log("✅ Todas las variables de entorno requeridas están configuradas.");
}

module.exports = validateEnv;
