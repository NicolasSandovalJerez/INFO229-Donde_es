// mi-perfil.js

document.addEventListener("DOMContentLoaded", async () => {
	const userId = localStorage.getItem("userId");
	if (!userId) {
		console.error("Usuario no autenticado");
		window.location.href = "../../index.html";
		return;
	}

	try {
		const response = await fetch(`/api/users/${userId}`);
		if (response.ok) {
			const userData = await response.json();

			// Mostrar los datos en la página
			document.getElementById("username").textContent =
				userData.username || "Usuario";
			document.getElementById("full_name").textContent =
				userData.full_name || "No especificado";
			document.getElementById("email").textContent =
				userData.email || "No especificado";
			document.getElementById("bio").textContent = userData.bio || "Sin biografía";
			document.getElementById("phone").textContent =
				userData.phone || "No especificado";
			document.getElementById("created_at").textContent = new Date(
				userData.created_at
			).toLocaleDateString();

			// Actualizar imagen de perfil si existe
			const profileImg = document.querySelector(".profile-img");
			if (userData.avatar_url) {
				profileImg.src = userData.avatar_url;
			}
		} else {
			console.error("Error al obtener datos del usuario");
		}
	} catch (error) {
		console.error("Error en la solicitud:", error);
	}
});
