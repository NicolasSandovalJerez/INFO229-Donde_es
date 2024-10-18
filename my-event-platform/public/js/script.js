document.getElementById("loginForm").addEventListener("submit", function (event) {
	event.preventDefault(); // Evita el envío del formulario

	const username = document.getElementById("username").value;
	const password = document.getElementById("password").value;

	// Enviar las credenciales al servidor
	fetch("http://localhost:3000/api/login", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ username: username, password: password }),
	})
		.then((response) => {
			if (!response.ok) {
				throw new Error("Credenciales incorrectas");
			}
			return response.json(); // Asumiendo que la respuesta será en JSON
		})
		.then((data) => {
			// Si el inicio de sesión es exitoso, redirigir a la página principal
			alert(data.message); // Muestra el mensaje
			window.location.href = "index.html"; // Cambia a la URL de tu página principal
		})
		.catch((error) => {
			document.getElementById("error-message").textContent = error.message;
		});
});
