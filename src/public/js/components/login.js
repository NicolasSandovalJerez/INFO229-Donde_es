// js/components/login.js
document.getElementById("loginForm").addEventListener("submit", async (e) => {
	e.preventDefault();

	const email = document.getElementById("email").value;
	const password = document.getElementById("password").value;
	const errorMessage = document.getElementById("error-message");

	try {
		const response = await fetch("http://localhost:3000/api/auth/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email, password }),
		});

		const data = await response.json();

		if (response.ok) {
			// Guardar el token en localStorage
			localStorage.setItem("token", data.token);
			localStorage.setItem("userId", data.user.id);
			// Redirigir a la página de eventos
			window.location.href = "../../components/main.html";
		} else {
			errorMessage.textContent = data.message || "Error al iniciar sesión";
			errorMessage.classList.add("show");
		}
	} catch (error) {
		errorMessage.textContent = "Error de conexión";
		errorMessage.classList.add("show");
	}
});
