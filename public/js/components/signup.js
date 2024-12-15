document.getElementById("signupForm").addEventListener("submit", async function (e) {
	e.preventDefault(); // Evitar el envío del formulario por defecto

	const username = document.getElementById("username").value.trim();
	const email = document.getElementById("email").value.trim();
	const password = document.getElementById("password").value;
	const confirmPassword = document.getElementById("confirmPassword").value;
	const errorMessage = document.getElementById("error-message");

	// Verificar que los valores se capturan correctamente
	console.log("username:", username);
	console.log("email:", email);
	console.log("password:", password);
	console.log("confirmPassword:", confirmPassword);

	// Limpiar el mensaje de error previo
	errorMessage.textContent = "";
	errorMessage.classList.remove("show");

	// Validación de los campos
	if (!username || !email || !password || !confirmPassword) {
		errorMessage.textContent = "Todos los campos son obligatorios.";
		errorMessage.classList.add("show");
		return;
	}

	if (password !== confirmPassword) {
		errorMessage.textContent = "Las contraseñas no coinciden.";
		errorMessage.classList.add("show");
		return;
	}

	// Expresión regular para verificar el correo electrónico
	const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
	if (!emailRegex.test(email)) {
		errorMessage.textContent = "Correo electrónico no válido.";
		errorMessage.classList.add("show");
		return;
	}

	// Hacer la solicitud al servidor para registrar el usuario
	const response = await fetch("/api/auth/register", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ username, email, password, confirmPassword }), // Asegúrate de enviar confirmPassword
	});

	const data = await response.json();

	if (response.ok) {
		// Redirigir al login si el registro fue exitoso
		localStorage.setItem("user_id", data.user.id);
		window.location.href = "../../components/user_profiles.html";
	} else {
		// Mostrar el mensaje de error si hubo un problema
		errorMessage.textContent =
			data.message || "Hubo un error al registrar la cuenta.";
		errorMessage.classList.add("show");
	}
});
